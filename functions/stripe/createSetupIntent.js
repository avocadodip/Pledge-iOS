const {onRequest, stripe, auth} = require("../common");

// Function to create a Stripe SetupIntent in settings page
const createSetupIntent = onRequest(async (req, res) => {
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

    // Verify that UID from decoded token matches uid from the request body
    if (uid !== uidFromToken) {
      console.error("UID from ID token does not match UID from request body.");
      return res.status(403).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(403).send("Unauthorized");
  }

  try {
    const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer: stripeCustomerId},
        {apiVersion: "2022-08-01"},
    );
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
    });
    res.json({
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: stripeCustomerId,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to create setup intent: " + error.message);
  }
});

module.exports = createSetupIntent;
