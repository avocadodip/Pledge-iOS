/* eslint-disable max-len */
// firebase emulators:start (root dir)
// firebase deploy --only functions (root dir; run with deploying to prod)
// KILL LOCAL PORT: lsof -i :5001    kill -9 <PID>
// LOCAL LINK: http://localhost:5001/fervo-1/us-central1/runDailyUpdate
// FORMATTER: npx eslint --fix index.js

require("dotenv").config();

const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const moment = require("moment-timezone");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {initializeApp} = require("firebase-admin/app");
const schedulerKey = process.env.SCHEDULER_KEY;

initializeApp();
const auth = admin.auth();

/**
 * Calculates total fines for a user based on their tasks.
 *
 * @param {Array} todos - Array of todos, each todo has `isComplete` and `amount` properties
 * @param {Number} missedTaskFine - Fine for each missed task.
 * @return {Number} Total fine amount.
 */
function calculateFines(todos, missedTaskFine) {
  let totalFine = 0;

  // Count the number of todos that are not complete
  todos.forEach((todo) => {
    if (!todo.isComplete) {
      totalFine += todo.amount;
    }
  });

  // Add fine for missing todos
  totalFine += (3 - todos.length) * missedTaskFine;

  return totalFine;
}

/**
 * Scheduled function that runs every 15 minutes to handle daily updates
 * 1. It finds the timezones where the current time is between 23:45 and 24:00.
 * 2. For each user in those timezones, it creates a todo document for the next day, setting the fields 'opensAt', 'closesAt', 'isActive', and 'isVacation' based on the user's settings.
 * 3. It tallies up and updates the current day's todo's fine count
 * 4. Also increments the fines document for that week.
 * 5. If the current day is Sunday and the user has opted in to be charged (shouldCharge == true), it charges the user for the past week's todoFines amount.
 *
 * @param {Request} req - Express.js request object. Not used in this function, but included for compatibility with Express.js
 * @param {Response} res - Express.js response object. Used to send a response back to the caller
 * @returns {Promise<void>} Returns a promise which resolves when all operations are completed. The promise does not carry any meaningful value.
 */

exports.runDailyUpdate = onRequest(async (req, res) => {
  if (req.headers.authorization !== schedulerKey) {
    res.status(403).send("Unauthorized");
    return;
  }

  // 1. Calculate which timezone has a current time between 11:45pm & 12:00am
  const timeZones = moment.tz.names(); // Get all the time zones
  // Get time zones where current time is between 11:45pm and 12:00am
  const desiredTimeZones = timeZones.filter((tz) => {
    const currentTime = moment().tz(tz).format("HH:mm");
    return currentTime >= "23:45" && currentTime <= "24:00";
  });

  const db = admin.firestore();

  for (const tz of desiredTimeZones) {
    // Query users by timezone
    const querySnapshot = await db
        .collection("users")
        .where("timezone", "==", tz)
        .get();

    // For each user in a desired timezone
    await Promise.all(querySnapshot.docs.map(async (doc) => {
      const userDoc = doc.data();
      const {dayStart, dayEnd, daysActive, vacationModeOn, missedTaskFine} =
        userDoc;
      const userid = doc.id;
      const userRef = db.collection("users").doc(userid);

      // Defining times
      const now = moment().tz(tz);
      const todayFormatted = now.format("YYYYMMDD");
      const todayDayOfWeek = now.format("dddd");
      const nextDay = now.clone().add(1, "days");
      const nextDayFormatted = nextDay.format("YYYYMMDD");
      const nextDayOfWeek = nextDay.format("dddd");
      // Defining past week
      const startOfWeek = now.clone().startOf("week");
      const endOfWeek = startOfWeek.clone().add(6, "days");
      const startOfWeekFormatted = startOfWeek.format("YYYYMMDD");
      const endOfWeekFormatted = endOfWeek.format("YYYYMMDD");
      const pastWeek = `${startOfWeekFormatted}-${endOfWeekFormatted}`;

      // Defining doc references
      const todayRef = userRef.collection("todos").doc(todayFormatted);
      const tmrwRef = userRef.collection("todos").doc(nextDayFormatted);
      const weekRef = userRef.collection("fines").doc(pastWeek);

      // 2. Set user's tmrwDoc w/ settings data
      await tmrwRef.set(
          {
            opensAt: dayStart,
            closesAt: dayEnd,
            isActive: daysActive[nextDayOfWeek],
            isVacation: vacationModeOn,
          },
          {merge: true},
      ); // merge true to avoid overwriting existing data

      // 3. Tally & update today fine count
      const todayDoc = await todayRef.get();
      if (!todayDoc.exists) {
        return console.log(`No ${todayFormatted} doc for ${userid}`);
      }
      const {todos = []} = todayDoc.data(); // Get todos array

      const todayFine = calculateFines(todos, missedTaskFine);
      await todayRef.update({totalFine: todayFine}); // Update todayDoc totalFine

      // 4. Update week fine count
      const weekDoc = await weekRef.get();
      let {totalWeeklyFine = 0, isCharged = false} = weekDoc.exists ?
        weekDoc.data() :
        {};

      totalWeeklyFine += todayFine;
      await weekRef.set(
          {
            totalWeeklyFine,
            isCharged,
          },
          {merge: true},
      );

      console.log(`Updated fines for user ${userid} on ${todayFormatted}`);

      // 5. Charge user with weekly fine if it's Saturday
      if (
        todayDayOfWeek === "Saturday" &&
        totalWeeklyFine !== 0 &&
        userDoc.stripeCustomerId
      ) {
        // Convert the fine amount to cents (Stripe uses cents instead of dollars)
        const amount = totalWeeklyFine * 100;

        // Create a Stripe charge
        const charge = await stripe.charges.create({
          amount,
          currency: userDoc.currency,
          customer: userDoc.stripeCustomerId,
          description: `Weekly fines for ${pastWeek}`,
        });

        // If the charge was successful, update the fines document
        if (charge.paid) {
          await weekRef.update({isCharged: true});
          console.log(`Charged user ${doc.id} for ${totalWeeklyFine}`);
        } else {
          console.log(`Failed to charge user ${doc.id}`);
        }
      }
    }));
  }

  res.json({result: `Completed.`});
});

exports.createStripeCustomer = onRequest(async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send("Missing Authorization header");
    return;
  }
  // Get the ID token passed in the Authorization header
  const idToken = req.headers.authorization.split("Bearer ")[1];

  const paymentMethodId = req.body.paymentMethodId;
  const email = req.body.email;
  const uid = req.body.uid;
  const userFullName = req.body.userFullName;

  try {
    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get the UID from the decoded token
    const uidFromToken = decodedToken.uid;

    // Verify that the UID from the decoded token matches the uid from the request body
    if (uid !== uidFromToken) {
      console.error("UID from ID token does not match UID from request body.");
      return res.status(403).send("Unauthorized");
    }

    try {
      // Create a new customer in Stripe.
      const customer = await stripe.customers.create({
        name: userFullName,
        email: email,
      });

      // Associate the new payment method with the customer
      const paymentMethod = await stripe.paymentMethods.attach(
          paymentMethodId,
          {customer: customer.id},
      );

      // Save the customer ID in Firestore.
      const db = admin.firestore();

      await db.collection("users").doc(uid).update({
        stripeCustomerId: customer.id,
        paymentMethodId: paymentMethod.id,
      });

      console.log(`Created Stripe customer ${customer.id} with payment method ${paymentMethod.id} for user ${uid}`);
      res.json({customer_id: customer.id, payment_method_id: paymentMethod.id});
    } catch (error) {
      console.error(`Failed to create Stripe customer for user ${uid}:`, error);
      res.status(500).send("Failed to create Stripe customer: " + error.message);
    }
    // Rest of your function...
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(403).send("Unauthorized");
  }
});


// exports.detachPaymentMethod = onRequest(async (req, res) => {
//   const paymentMethodId = req.body.paymentMethodId;

//   try {
//     // Detach the payment method
//     const detachedPaymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

//     // Send a response back to the client
//     res.send({status: "Payment method detached successfully"});
//   } catch (error) {
//     res.status(400).send(`Failed to detach payment method: ${error}`);
//   }
// });
