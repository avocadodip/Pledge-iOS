// common.js
require("dotenv").config();
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const moment = require("moment-timezone");
const {initializeApp} = require("firebase-admin/app");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

initializeApp();
const auth = admin.auth();

const endpointSecret = "whsec_vS3nH9E0sb2U2KWQDLFaf6Sz91ZLW2vG";

module.exports = {
  onRequest,
  admin,
  moment,
  stripe,
  auth,
  endpointSecret,
};
