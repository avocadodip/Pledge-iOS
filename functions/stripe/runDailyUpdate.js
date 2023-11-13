/* eslint-disable max-len */
// cd functions/stripe
// npx eslint --fix runDailyUpdate.js
// firebase deploy --only functions

// fix duplicating todos when being charged

const {onRequest, stripe, moment, admin, schedulerKey} = require("../common");
const {checkAndSendNotifications} = require("./notifications");
const {formatDateRange} = require("../util/formatDateRange");

/**
 * Calculates total fines for a user based on their tasks.
 *
 * @param {Array} todos - isComplete, amount properties, or null for no input.
 * @param {String} dateName - The name of the date for which the fines are being calculated.
 * @param {Number} missedTaskFine - Fine for each missed task.
 * @return {Object} contains several variables
 */
function calculateFines(todos, dateName, missedTaskFine) {
  let todayTotalFine = 0;
  let todayNoInputCount = 0;
  let todayNoInputFine = 0;
  const todayFinedTasks = [];

  // Count the number of todos that are not complete and those with no input
  todos.forEach((todo) => {
    // If todo is null and missedTaskFine is on, add a fine
    if (todo === null && missedTaskFine !== 0) {
      todayNoInputCount += 1;
      todayNoInputFine += missedTaskFine; // +1
    } else if (!todo.isComplete && todo.amount !== 0) {
      todayTotalFine += parseInt(todo.amount);
      todo.dateName = dateName;
      todayFinedTasks.push(todo);
    }
  });

  todayTotalFine += todayNoInputFine;

  return {
    todayTotalFine,
    todayNoInputCount,
    todayNoInputFine,
    todayFinedTasks,
  };
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

    // For each user who is currently in timezones where it's end of day
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

          // ----- DEFINING REFS ------

          const todayRef = userRef.collection("todos").doc(todayFormatted);
          const nextDayRef = userRef.collection("todos").doc(nextDayFormatted);
          const nextNextDayRef = userRef
              .collection("todos")
              .doc(nextNextDayFormatted);
          const weekRef = userRef.collection("fines").doc(pastWeek);

          // ----- END OF DAY: RESET NOTIFICATION IS_SENT FIELDS ------

          const snapshot = await userRef
              .where("todayANotifHasBeenSent", "==", true)
              .get();
          const updates = snapshot.docs.map((doc) => {
            const notificationTimes = doc.data().notificationTimes;
            for (const key in notificationTimes) {
              if (Object.prototype.hasOwnProperty.call(notificationTimes, key)) {
                notificationTimes[key].isSent = false;
              }
            }
            return userRef.doc(doc.id).update({notificationTimes});
          });
          await Promise.all(updates);

          // ----- END OF DAY: SET TMRW DOC ------

          const nextDaySnapshot = await nextDayRef.get();

          if (nextDaySnapshot.exists) {
            const {isActive, closesAt} = nextDaySnapshot.data();
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

          // ----- END OF DAY: SET NEXT NEXT DAY DOC ------

          await nextNextDayRef.set(
              {
                date: nextNextDayFormatted,
                dateName: nextNextDayDateName,
                opensAt: dayStart,
                closesAt: dayEnd,
                isActive: daysActive[nextNextDOW],
                isVacation: vacationModeOn,
                todos: [null, null, null],
              },
              {merge: true},
          );

          // ----- END OF DAY: TALLY TODAY FINES AND UPDATE TODAY DOC ------

          const todayDoc = await todayRef.get();
          if (!todayDoc.exists) {
            return console.log(`No ${todayFormatted} doc for ${userid}`);
          }
          const {todos = [], dateName} = todayDoc.data();

          const {
            todayTotalFine,
            todayNoInputCount,
            todayNoInputFine,
            todayFinedTasks,
          } = calculateFines(todos, dateName, missedTaskFine);
          await todayRef.update({totalFine: todayTotalFine, totalNoInputCount: todayNoInputCount, totalNoInputFine: todayNoInputFine});

          // ----- END OF DAY: ADD TODAY FINES TO WEEKLY FINES ------

          // Get existing week data (default values if doesn't exist)
          const weekDoc = await weekRef.get();
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

          // Set week fines updates
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

          // ----- END OF SATURDAY: CHARGE USERS WHO HAVE A WEEKLY FINE ------

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
