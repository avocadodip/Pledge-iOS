// firebase deploy --only functions
// local deploy: firebase emulators:start
// local test: http://127.0.0.1:5001/fervo-1/us-central1/runDailyUpdate
// npx eslint --fix index.js

/* eslint-disable max-len */
require("dotenv").config();

const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const moment = require("moment-timezone");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {initializeApp} = require("firebase-admin/app");
const schedulerKey = process.env.SCHEDULER_KEY;

console.log("keys");
console.log(schedulerKey);
console.log(process.env.STRIPE_SECRET_KEY);

initializeApp();
const auth = admin.auth();

/**
 * Calculates total fines for a user based on their tasks.
 *
 * @param {Array} todos - Array of todos, each todo has `isComplete` and `amount` properties, or is null for no input.
 * @param {Number} missedTaskFine - Fine for each missed task.
 * @return {Object} Object containing total fine amount, no input count, no input fine, and incomplete tasks.
 */
function calculateFines(todos, missedTaskFine) {
  let todayTotalFine = 0;
  let todayNoInputCount = 0;
  let todayNoInputFine = 0;
  const todayFinedTasks = [];

  // Count the number of todos that are not complete and those with no input
  todos.forEach((todo) => {
    if (todo === null) {
      todayNoInputCount += 1;
      todayNoInputFine += missedTaskFine; // Assign a fine for no input
    } else if (!todo.isComplete) {
      todayTotalFine += todo.amount;
      todayFinedTasks.push(todo);
    }
  });

  // Add fine for missing todos
  todayTotalFine += (3 - todos.length) * missedTaskFine;

  return {
    todayTotalFine,
    todayNoInputCount,
    todayNoInputFine,
    todayFinedTasks,
  };
}

/**
 * Formats a date range in the format "Aug 20 - Aug 26, 2023".
 *
 * @param {string} start - The start date in "YYYYMMDD" format.
 * @param {string} end - The end date in "YYYYMMDD" format.
 * @return {string} The formatted date range string.
 */
function formatDateRange(start, end) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract year, month, and day from the start date
  const startMonth = start.slice(4, 6);
  const startDay = start.slice(6, 8);

  // Extract year, month, and day from the end date
  const endYear = end.slice(0, 4);
  const endMonth = end.slice(4, 6);
  const endDay = end.slice(6, 8);

  // Format the date
  const formattedStart = `${months[parseInt(startMonth, 10) - 1]} ${parseInt(
      startDay,
      10,
  )}`;
  const formattedEnd = `${months[parseInt(endMonth, 10) - 1]} ${parseInt(
      endDay,
      10,
  )}, ${endYear}`;
  return `${formattedStart} - ${formattedEnd}`;
}

/**
 * Scheduled function that runs every 15 minutes to handle daily updates
 * 1. It finds the timezones where the current time is between 23:45 and 24:00.
 * 2. For each onboarded user in those timezones, it creates a todo document for the day after tmrw, setting the fields 'opensAt', 'closesAt', 'isActive', and 'isVacation' based on the user's settings.
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
    return currentTime >= "00:00" && currentTime <= "24:00"; // 23:45 TEMP CHANGE
  });

  const db = admin.firestore();

  for (const tz of desiredTimeZones) {
    // Query users by timezone
    const querySnapshot = await db
        .collection("users")
        .where("timezone", "==", tz)
        .where("isOnboarded", "==", true)
        .get();

    // For each user in a desired timezone
    await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const userDoc = doc.data();
          const {
            dayStart,
            dayEnd,
            daysActive,
            vacationModeOn,
            missedTaskFine,
            isPaymentSetup,
          } = userDoc;
          const userid = doc.id;
          const userRef = db.collection("users").doc(userid);

          // Defining times
          const now = moment().tz(tz);
          const todayFormatted = now.format("YYYYMMDD");
          const todayDOW = now.format("dddd");
          // Next next day (for which we will create the todo doc)
          const nextNextDay = now.clone().add(2, "days");
          const nextNextDayFormatted = nextNextDay.format("YYYYMMDD");
          const nextNextDOW = nextNextDay.format("dddd");
          const nextNextDayDateName = nextNextDay.format("MMM D"); // "Aug 27"
          // Defining past week
          const startOfWeek = now.clone().startOf("week");
          const endOfWeek = startOfWeek.clone().add(6, "days");
          const startOfWeekFormatted = startOfWeek.format("YYYYMMDD");
          const endOfWeekFormatted = endOfWeek.format("YYYYMMDD");
          const pastWeek = `${startOfWeekFormatted}-${endOfWeekFormatted}`;
          const formattedPastWeek = formatDateRange(
              startOfWeekFormatted,
              endOfWeekFormatted,
          ); // "Aug 20 - Aug 26, 2023"

          // Defining doc references
          const todayRef = userRef.collection("todos").doc(todayFormatted);
          const nextNextDayRef = userRef
              .collection("todos")
              .doc(nextNextDayFormatted);
          const weekRef = userRef.collection("fines").doc(pastWeek);

          // 2. Set user's nextnextdayDoc w/ settings data
          await nextNextDayRef.set(
              {
                date: nextNextDayFormatted,
                dateName: nextNextDayDateName, // added dateName
                opensAt: dayStart,
                closesAt: dayEnd,
                isActive: daysActive[nextNextDOW],
                isVacation: vacationModeOn,
                todos: [null, null, null],
              },
              {merge: true},
          ); // merge true to avoid overwriting existing data

          // 3. Tally & update today fine count
          const todayDoc = await todayRef.get();
          if (!todayDoc.exists) {
            return console.log(`No ${todayFormatted} doc for ${userid}`);
          }
          const {todos = []} = todayDoc.data(); // Get todos array

          const {
            todayTotalFine,
            todayNoInputCount,
            todayNoInputFine,
            todayFinedTasks,
          } = calculateFines(todos, missedTaskFine);
          await todayRef.update({totalFine: todayTotalFine}); // Update todayDoc totalFine

          // 4. Update week fine count
          const weekDoc = await weekRef.get();

          // Get existing week data (default values if doesn't exist)
          const {
            totalWeeklyFine = 0,
            isCharged = false,
            weekDateRange = formattedPastWeek,
            noInputCount = 0,
            noInputFine = 0,
            finedTasks = [],
            id = startOfWeekFormatted,
          } = weekDoc.exists ? weekDoc.data() : {};

          // Make updates
          const updatedTotalWeeklyFine = totalWeeklyFine + todayTotalFine;
          const updatedFinedTasks = [...finedTasks, ...todayFinedTasks]; // Merge arrays

          // Set updates
          await weekRef.set(
              {
                totalWeeklyFine: updatedTotalWeeklyFine,
                isCharged,
                weekDateRange,
                noInputCount: noInputCount + todayNoInputCount,
                noInputFine: noInputFine + todayNoInputFine,
                finedTasks: updatedFinedTasks,
                id,
              },
              {merge: true},
          );

          console.log(`Updated fines for user ${userid} on ${todayFormatted}`);

          console.log(process.env.STRIPE_SECRET_KEY);
          console.log(todayDOW);
          console.log(updatedTotalWeeklyFine);
          console.log(userDoc.stripeCustomerId);
          console.log(isPaymentSetup);

          // 5. Charge user with weekly fine if it's Saturday
          if (
            todayDOW === "Sunday" && // TEMP
          updatedTotalWeeklyFine !== 0 &&
          userDoc.stripeCustomerId &&
          isPaymentSetup
          ) {
          // Convert the fine amount to cents (Stripe uses cents instead of dollars)

            const amount = Math.round(updatedTotalWeeklyFine * 100); // Ensure it's an integer
            if (amount <= 0) {
              throw new Error(`Invalid amount for user ${doc.id}`);
            }

            // Create a Stripe charge

            const charge = await stripe.charges.create(
                {
                  amount,
                  currency: userDoc.currency || "usd", // Default to "usd" if not set
                  customer: userDoc.stripeCustomerId,
                  description: `Weekly fines for ${pastWeek}`,
                },
                {
                  idempotencyKey: `weekly_fines_${pastWeek}_${doc.id}`, // Ensure idempotency
                },
            );

            // If the charge was successful, update the fines document

            if (charge.paid) {
              await weekRef.update({isCharged: true});
              console.log(`Charged user ${doc.id} for ${updatedTotalWeeklyFine}`);
            } else {
              console.log(`Failed to charge user ${doc.id}`);
            }
          }
        }),
    );
  }

  res.json({result: `Completed.`});
});

// Function to create a Stripe Customer during sign up
exports.createStripeCustomer = onRequest(async (req, res) => {
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

    // Verify that the UID from the decoded token matches the uid from the request body
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

// Function to create a Stripe SetupIntent in settings page
exports.createSetupIntent = onRequest(async (req, res) => {
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

    // Verify that the UID from the decoded token matches the uid from the request body
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

// Function to list all Stripe PaymentMethods for a customer in settings page
exports.listPaymentMethods = onRequest(async (req, res) => {
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

    // Verify that the UID from the decoded token matches the uid from the request body
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
