/* eslint-disable max-len */
// firebase emulators:start (root dir)
// firebase deploy --only functions (root dir; run with deploying to prod)
// lsof -i :5001    kill -9 <PID>
// http://localhost:5001/fervo-1/us-central1/runDailyUpdate?text=hichris

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
// const {onDocumentCreated} = require("firebase-functions/v2/firestore");

const admin = require("firebase-admin");
const moment = require("moment-timezone");
const stripe = require("stripe")("sk_test_51Lulh6CNzspyvGyfqUMb1ra1HZo8ce3FIXGDsBz2plZ26C0GOTBgZv5jLdRVcwKWMc0bqam6c9MW4NDA3EHmuGM700JytjRJ7f");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
// const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

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
  // 1. Calculate which timezone has a current time between 11:45pm & 12:00am
  const timeZones = moment.tz.names(); // Get all the time zones
  // Get time zones where current time is between 11:45pm and 12:00am
  const desiredTimeZones = timeZones.filter((tz) => {
    const currentTime = moment().tz(tz).format("HH:mm");
    return (currentTime >= "12:00" && currentTime <= "13:00");
  });

  const db = admin.firestore();

  for (const tz of desiredTimeZones) {
    // Query users by timezone
    const querySnapshot = await db
        .collection("users")
        .where("timezone", "==", tz)
        .get();

    // For each user in a desired timezone
    querySnapshot.forEach(async (doc) => {
      const userDoc = doc.data();
      const {dayStart, dayEnd, daysActive, vacationModeOn, missedTaskFine} = userDoc;
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
      const todayRef = userRef
          .collection("todos")
          .doc(todayFormatted);
      const tmrwRef = userRef
          .collection("todos")
          .doc(nextDayFormatted);
      const weekRef = userRef
          .collection("fines")
          .doc(pastWeek);

      // 2. Set user's tmrwDoc w/ settings data
      await tmrwRef.set({
        opensAt: dayStart,
        closesAt: dayEnd,
        isActive: daysActive[nextDayOfWeek],
        isVacation: vacationModeOn,
      }, {merge: true}); // merge true to avoid overwriting existing data

      // 3. Tally & update today fine count
      const todayDoc = await todayRef.get();
      if (!todayDoc.exists) return console.log(`No ${todayFormatted} doc for ${userid}`);
      const {todos = []} = todayDoc.data(); // Get todos array

      const todayFine = calculateFines(todos, missedTaskFine);
      await todayRef.update({totalFine: todayFine}); // Update todayDoc totalFine

      // 4. Update week fine count
      const weekDoc = await weekRef.get();
      let {totalWeeklyFine = 0, isCharged = false} = weekDoc.exists ? weekDoc.data() : {};

      totalWeeklyFine += todayFine;
      await weekRef.set({
        totalWeeklyFine, isCharged,
      }, {merge: true});

      console.log(`Updated fines for user ${userid} on ${todayFormatted}`);

      // 5. Charge user with weekly fine if it's Saturday
      if (todayDayOfWeek === "Saturday" && totalWeeklyFine !== 0 && userDoc.stripeCustomerId) {
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
    });
  }

  res.json({result: `Completed.`});
});
