// firebase deploy --only functions

/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const {onRequest, admin, stripe, endpointSecret} = require("../common");

const stripeWebhook = onRequest(async (req, res) => {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];
    let event;

    const rawBody = req.rawBody.toString("utf-8");
    const trimmedEndpointSecret = endpointSecret.trim();

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, trimmedEndpointSecret);
      console.log("Event constructed successfully");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const db = admin.firestore();
    const usersRef = db.collection("users");
    // From setup intent succeeded structure
    let stripeCustomerId = event.data.object.customer;
    // For payment method detached structure
    if (!stripeCustomerId && event.data.previous_attributes) {
      stripeCustomerId = event.data.previous_attributes.customer;
    }
    // Query to find the Firestore document with this Stripe customer ID
    const snapshot = await usersRef
        .where("stripeCustomerId", "==", stripeCustomerId)
        .get();
    if (snapshot.empty) {
      console.log(`No user match Stripe customer ID: ${stripeCustomerId}`);
      return;
    }
    // Assuming there's only one matching doc, or otherwise handle multiple
    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    const userRef = db.collection("users").doc(userId);

    // Handle the event
    switch (event.type) {
      case "setup_intent.succeeded": {
        const setupIntentSucceeded = event.data.object;
        const paymentMethodId = setupIntentSucceeded.payment_method;

        // Get last 4 digits
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        const last4Digits = paymentMethod.card.last4;

        try {
          // Update Firestore user document with the new payment method ID
          await userRef.update({
            paymentMethodId: paymentMethodId,
            isPaymentSetup: true,
            last4Digits: last4Digits,
          });
          console.log(
              `Updated paymentMethodId and isPaymentSetup for user: ${userId}`,
          );
        } catch (err) {
          console.error(`Failed to update user: ${err}`);
        }

        break;
      }
      case "payment_method.detached": {
        const paymentMethodDetached = event.data.object;
        const {id: detachedPaymentMethodId} = paymentMethodDetached;

        try {
          // Fetch the current paymentMethodId from Firestore
          const userDocSnapshot = await userRef.get();
          const userData = userDocSnapshot.data();
          const currentPaymentMethodId = userData.paymentMethodId;

          // Check if the detached payment method matches the one in Firestore
          if (currentPaymentMethodId === detachedPaymentMethodId) {
            // Step 3: If it matches, remove it from Firestore and set isPaymentSetup to false
            await userRef.update({
              paymentMethodId: null,
              isPaymentSetup: false,
              last4Digits: null,
              missedTaskFine: 0,

            });
            console.log("Successfully removed paymentMethodId and set isPaymentSetup to false");
          } else {
            console.log("Detached paymentMethodId does not match Firestore record.");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
        break;
      }
      // ... handle other event types
      default: {
        console.log(`Unhandled event type ${event.type}`);
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  } else {
    // Handle other HTTP methods
    res.status(405).end();
  }
});

module.exports = stripeWebhook;
