/* eslint-disable max-len */
// cd functions/stripe
// npx eslint --fix runDailyUpdate.js
// firebase deploy --only functions

// fix duplicating todos when being charged

const {onRequest, stripe, moment, admin, schedulerKey} = require("../common");
const {checkAndSendNotifications} = require("./notifications");
// const { checkAndSendNotifications } = require('../stripe/notifications');

/**
 * Calculates total fines for a user based on their tasks.
 *
 * @param {Array} todos - isComplete, amount properties, or null for no input.
 * @param {String} dateName - The name of the date for which the fines are being calculated.
 * @param {Number} missedTaskFine - Fine for each missed task.
 * @return {Object} contains several variables
 */
function calculateFines(todos, dateName) {
  let todayTotalFine = 0;
  // let todayNoInputCount = 0;
  // let todayNoInputFine = 0;
  const todayFinedTasks = [];

  // Count the number of todos that are not complete and those with no input
  todos.forEach((todo) => {
    if (todo === null) {
      // todayNoInputCount += 1;
      // todayNoInputFine += missedTaskFine; // Commented out: Assign a fine for no input
    } else if (!todo.isComplete && todo.amount !== 0) {
      todayTotalFine += parseInt(todo.amount); // Just in case: convert amount to integer before addition
      todo.dateName = dateName;
      todayFinedTasks.push(todo);
    }
  });

  // Commented out: Add fine for missing todos
  // todayTotalFine += (3 - todos.length) * missedTaskFine;

  return {
    todayTotalFine,
    // todayNoInputCount,
    // todayNoInputFine,
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
 * 1. Sends push notifs for users if current time matches their notif time
 * 2. It finds the timezones where the current time is between 23:45 and 24:00.
 * 3. For each onboarded user in those timezones, create a todo document for next next day, set 'opensAt', 'closesAt', 'isActive', and 'isVacation' based on the user settings.
 * 4. It tallies up and updates the current day's todo's fine count
 * 5. Also increments the fines document for that week.
 * 6. If the current day is Sunday and the user has opted in to be charged (shouldCharge == true), it charges the user for the past week's todoFines amount.
 *
 * @param {Request} req - Express.js request object. Not used in this function, but included for compatibility with Express.js
 * @param {Response} res - Express.js response object. Used to send a response back to the caller
 * @returns {Promise<void>} Returns a promise which resolves when all operations are completed. The promise does not carry any meaningful value.
 */

const runDailyUpdate = onRequest(async (req, res) => {
  if (req.headers.authorization !== schedulerKey) {
    res.status(403).send("Unauthorized");
    return;
  }

  // 1. Check if it's time to schedule push notif
  // checkAndSendNotifications();
  checkAndSendNotifications();

  // 2. Calculate which timezone has a current time between 11:45pm & 12:00am
  const timeZones = moment.tz.names(); // Get all the time zones
  // Get time zones where current time is between 11:45pm and 12:00am
  const desiredTimeZones = timeZones.filter((tz) => {
    const currentTime = moment().tz(tz).format("HH:mm");
    return currentTime >= "23:45" && currentTime <= "24:00"; // 23:45 TEMP CHANGE
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
            stripeCustomerId,
            paymentMethodId,
          } = userDoc;
          const userid = doc.id;
          const userRef = db.collection("users").doc(userid);

          // Defining times
          const now = moment().tz(tz);
          const todayFormatted = now.format("YYYYMMDD");
          const todayDOW = now.format("dddd");
          // Next day (for notifications - we pull isActive & closesAt and set to user settings doc)
          const nextDay = now.clone().add(1, "days");
          const nextDayFormatted = nextDay.format("YYYYMMDD");
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
          const nextDayRef = userRef.collection("todos").doc(nextDayFormatted);
          const nextNextDayRef = userRef
              .collection("todos")
              .doc(nextNextDayFormatted);
          const weekRef = userRef.collection("fines").doc(pastWeek);

          // ----- NOTIFICATION STUFF ------

          // For user's that had a notif sent to them today: Change all notification times isSent field to false
          const usersRef = db.collection("users");

          const snapshot = await usersRef
              .where("todayANotifHasBeenSent", "==", true)
              .get();
          const updates = snapshot.docs.map((doc) => {
            const notificationTimes = doc.data().notificationTimes;
            for (const key in notificationTimes) {
              if (Object.prototype.hasOwnProperty.call(notificationTimes, key)) {
                notificationTimes[key].isSent = false;
              }
            }
            return usersRef.doc(doc.id).update({notificationTimes});
          });
          await Promise.all(updates);

          // For all users: (1) Set next day's isActive and opensAt fields to user's doc (2) reset notifSent fields
          const nextDaySnapshot = await nextDayRef.get();

          if (nextDaySnapshot.exists) {
          // Extract the isActive and dayEnd fields
            const {isActive, closesAt} = nextDaySnapshot.data();

            // Update the user document
            await userRef.update({
              todayIsActive: isActive,
              todayDayEnd: closesAt,
              todayANotifHasBeenSent: false,
              todayAllSet: !isActive,
            });
          } else {
            console.log(
                `No document for next day ${nextDayFormatted} for user ${userid}`,
            );
          }
          // ----- END NOTIFICATION STUFF ------

          // 3. Set user's nextnextdayDoc w/ settings data
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

          // 4. Tally & update today fine count
          const todayDoc = await todayRef.get();
          if (!todayDoc.exists) {
            return console.log(`No ${todayFormatted} doc for ${userid}`);
          }
          const {todos = [], dateName} = todayDoc.data(); // Get todos array

          const {
            todayTotalFine,
            todayNoInputCount,
            todayNoInputFine,
            todayFinedTasks,
          } = calculateFines(todos, dateName, missedTaskFine);
          await todayRef.update({totalFine: todayTotalFine}); // Update todayDoc totalFine

          // 5. Update week fine count
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
            chargeErrorType = null,
          } = weekDoc.exists ? weekDoc.data() : {};

          // Safeguard: Before merging the arrays, filter out todos that already exist (avoid adding todo if it already exists in array)
          const newFinedTasks = todayFinedTasks.filter(
              (todayTodo) => !finedTasks.some(
                  (finedTodo) => finedTodo.createdAt === todayTodo.createdAt,
              ),
          );

          // Make updates
          const updatedFinedTasks = [...finedTasks, ...newFinedTasks];
          const updatedTotalWeeklyFine = totalWeeklyFine + todayTotalFine;

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
                chargeErrorType,
              },
              {merge: true},
          );

          console.log(`Updated fines for user ${userid} on ${todayFormatted}`);

          // 6. Charge user with weekly fine if it's Saturday
          if (
            todayDOW === "Saturday" && // TEMP
          stripeCustomerId &&
          paymentMethodId &&
          isPaymentSetup &&
          updatedTotalWeeklyFine > 0 &&
          !isCharged
          ) {
            const formattedAmount = Math.round(updatedTotalWeeklyFine * 100); // Ensure it's an integer
            if (formattedAmount <= 0) {
              throw new Error(`Invalid amount for user ${userid}`);
            }
            // Create a Stripe charge
            try {
            // const paymentIntent =
              await stripe.paymentIntents.create({
                amount: formattedAmount,
                currency: userDoc.currency,
                // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
                automatic_payment_methods: {enabled: true},
                customer: userDoc.stripeCustomerId,
                payment_method: paymentMethodId,
                return_url: "https://example.com/order/123/complete",
                off_session: true,
                confirm: true,
              });

              await weekRef.update({isCharged: true});
            } catch (err) {
            // Error code will be authentication_required if authentication is needed
              console.log("Error code is: ", err.code);
              if (err.code == "incorrect_zip") {
                console.log("incorrect zip");
              }
              await weekRef.update({chargeErrorType: err.code});

              // Used to retrieve the details of a Stripe PaymentIntent when an error occurs during the creation of a PaymentIntent.
              if (err.raw && err.raw.payment_intent) {
                const paymentIntentRetrieved =
                await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
                console.log("PI retrieved: ", paymentIntentRetrieved.id);
              } else {
                console.log("Error does not contain a payment intent");
              }
            }
          }
        }),
    );
  }

  res.json({result: `Completed.`});
});

module.exports = runDailyUpdate;
