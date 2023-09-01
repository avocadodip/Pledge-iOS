// firebase deploy --only functions
// local deploy: firebase emulators:start
// local test: http://127.0.0.1:5001/fervo-1/us-central1/runDailyUpdate
// npx eslint --fix index.js

const createSetupIntent = require("./stripe/createSetupIntent");
const createStripeCustomer = require("./stripe/createStripeCustomer");
const listPaymentMethods = require("./stripe/listPaymentMethods");
const runDailyUpdate = require("./stripe/runDailyUpdate");
const stripeWebhook = require("./stripe/stripeWebhook");

exports.createSetupIntent = createSetupIntent;
exports.createStripeCustomer = createStripeCustomer;
exports.listPaymentMethods = listPaymentMethods;
exports.runDailyUpdate = runDailyUpdate;
exports.stripeWebhook = stripeWebhook;
