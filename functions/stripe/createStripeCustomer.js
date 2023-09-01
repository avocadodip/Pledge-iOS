const {onRequest, stripe, auth} = require("../common");

// Function to create a Stripe Customer during sign up
const createStripeCustomer = onRequest(async (req, res) => {
  // Check if method is POST
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  if (!req.headers.authorization) {
    res.status(401).send("Missing Authorization header");
    return;
  }

  const uid = req.body.uid;
  const idToken = req.headers.authorization.split("Bearer ")[1];

  // Verify ID token
  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get the UID from the decoded token
    const uidFromToken = decodedToken.uid;

    // Verify that UID from decoded token matches the uid from the request body
    if (uid !== uidFromToken) {
      console.error("UID from ID token does not match UID from request body.");
      return res.status(403).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(403).send("Unauthorized");
  }

  try {
    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email: req.body.email,
      name: req.body.name,
    });

    // Send the customer ID in the response
    res.json({
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to create Stripe customer: " + error.message);
  }
});

module.exports = createStripeCustomer;

