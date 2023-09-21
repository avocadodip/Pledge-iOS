// common.js
require("dotenv").config();
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const moment = require("moment-timezone");
const {initializeApp} = require("firebase-admin/app");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const schedulerKey = process.env.SCHEDULER_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

initializeApp();
const auth = admin.auth();

module.exports = {
  onRequest,
  admin,
  moment,
  stripe,
  auth,
  endpointSecret,
  schedulerKey,
};
