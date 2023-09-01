const {onRequest, stripe, auth} = require("../common");

// Function to list all Stripe PaymentMethods for a customer in settings page
const listPaymentMethods = onRequest(async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send("Missing Authorization header");
    return;
  }

  const uid = req.body.uid;
  const stripeCustomerId = req.body.stripeCustomerId;
  const idToken = req.headers.authorization.split("Bearer ")[1];

  // Verify ID token
  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get the UID from the decoded token
    const uidFromToken = decodedToken.uid;

    // Verify UID from decoded token matches uid from the request body
    if (uid !== uidFromToken) {
      console.error("UID from ID token does not match UID from request body.");
      return res.status(403).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(403).send("Unauthorized");
  }

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
    });
    res.json(paymentMethods);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to list payment methods: " + error.message);
  }
});

module.exports = listPaymentMethods;
