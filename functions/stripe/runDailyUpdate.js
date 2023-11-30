/* eslint-disable */
// firebase deploy --only functions

const { onRequest, stripe, moment, admin, schedulerKey } = require("../common");
const { checkAndSendNotifications } = require("./notifications");
const { getTimeDefinitions } = require("../util/timeUtils");
const { calculateIncompleteFines, calculateNoInputFines } = require("../util/calculateFines");

const db = admin.firestore(); // Init database
 
// Function that runs every 15 min
const runDailyUpdate = onRequest(async (req, res) => {
  if (req.headers.authorization !== schedulerKey) {
    res.status(403).send("Unauthorized");
    return;
  }

  // Check and send notifs (other file)
  checkAndSendNotifications();

  // Calculate which timezone has a current time between 11:45pm & 12:00am
  const timeZones = moment.tz.names();
  const desiredTimeZones = timeZones.filter((tz) => {
    const currentTime = moment().tz(tz).format("HH:mm");
    return currentTime >= "00:00" && currentTime <= "24:00"; // TEMP 23:45
  });

  // Query users by timezone
  for (const tz of desiredTimeZones) {
    const querySnapshot = await db
      .collection("users")
      .where("timezone", "==", tz)
      .where("isOnboarded", "==", true)
      .get();

    // For each user who is currently in timezones where it's end of day
    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        // ----- GET THE USER DATA WE NEED ------
        const userid = doc.id;
        const userRef = db.collection("users").doc(userid);
        const userDoc = doc.data();

        // prettier-ignore
        const { nextDayStart, nextDayEnd, daysActive, todayIsActive, todayIsVacation, tmrwIsVacation, missedTaskFine, isPaymentSetup,stripeCustomerId, paymentMethodId, todayANotifHasBeenSent, notificationTimes, todayTodos, tmrwTodos, todayNoInputFine, todayNoInputCount, dailyUpdateLastRun } = userDoc;

        // prettier-ignore
        const { now, todayFormatted, todayDateName, todayDOW, nextDay, nextDOW, nextNextDOW, startOfWeek, endOfWeek, startOfWeekFormatted, endOfWeekFormatted, pastWeek, formattedPastWeek } = getTimeDefinitions(tz);

        const todayRef = userRef.collection("todos").doc(todayFormatted);
        const weekRef = userRef.collection("fines").doc(pastWeek);
        
        // If daily update already ran, quit function
        if (dailyUpdateLastRun === todayFormatted) {
          return;
        }

        // ----- 1. END OF DAY: MOVE TMRW DATA TO TODAY & RESET TMRW DATA------

        // First, Reset all isSent fields in notificationTimes
        for (const key in notificationTimes) {
          if (notificationTimes.hasOwnProperty(key)) {
            notificationTimes[key].isSent = false;
          }
        }
        // Second, calculate no input fines
        const {
          tmrwNoInputCount,
          tmrwNoInputFine,
        } = calculateNoInputFines(tmrwTodos, missedTaskFine);

        // Then, move tmrw to today
        await userRef.update({
          dailyUpdateLastRun: todayFormatted,
          todayTodos: tmrwTodos,
          // prettier-ignore
          tmrwTodos: [
            { todoNumber: 1, title: "", description: "", amount: "", tag: "", isLocked: false, isComplete: false }, 
            { todoNumber: 2, title: "", description: "", amount: "", tag: "", isLocked: false, isComplete: false }, 
            { todoNumber: 3, title: "", description: "", amount: "", tag: "", isLocked: false, isComplete: false },
          ],
          todayIsActive: daysActive[nextDOW],
          tmrwIsActive: daysActive[nextNextDOW],
          todayIsVacation: tmrwIsVacation,
          todayDayStart: nextDayStart,
          todayDayEnd: nextDayEnd,
          todayANotifHasBeenSent: false,
          notificationTimes,
          todayNoInputFine, tmrwNoInputFine,
          todayNoInputCount: tmrwNoInputCount,
        });

        // ----- 2. END OF DAY: MOVE TODAY DATA TO PAST TODOS + CALCULATE FINES ------
        // Calculate total failed task fine
        const {
          todayIncompleteFine,
          todayFinedTasks,
        } = calculateIncompleteFines(todayTodos);

        await todayRef.set(
          {
            isActive: todayIsActive,
            isVacation: todayIsVacation,
            date: todayFormatted,
            dateName: todayDateName,
            todos: todayTodos,
            totalFine: todayIncompleteFine + todayNoInputFine,
            noInputCount: todayNoInputCount,
            noInputFine: todayNoInputFine,
          },
          { merge: true }
        );

        // ----- END OF DAY: INCREMENT WEEKLY FINES ------

        // Get existing week data or default values
        const weekDoc = await weekRef.get();
        const defaultWeekData = {
          totalWeeklyFine: 0,
          isCharged: false,
          weekDateRange: formattedPastWeek,
          noInputCount: 0,
          noInputFine: 0,
          finedTasks: [],
          id: startOfWeekFormatted,
          chargeErrorType: null,
        };
        const weekData = weekDoc.exists ? weekDoc.data() : defaultWeekData;

        // Update fined tasks, avoiding duplicates
        const existingTasks = new Set(
          weekData.finedTasks.map((task) => task.createdAt)
        );
        const newFinedTasks = todayFinedTasks.filter(
          (task) => !existingTasks.has(task.createdAt)
        );

        const updatedTotalWeeklyFine = weekData.totalWeeklyFine + todayIncompleteFine + todayNoInputFine

        // Prepare week fines updates
        const updatedWeekData = {
          ...weekData,
          totalWeeklyFine: updatedTotalWeeklyFine,
          noInputCount: weekData.noInputCount + todayNoInputCount,
          noInputFine: weekData.noInputFine + todayNoInputFine,
          finedTasks: [...weekData.finedTasks, ...newFinedTasks],
        };

        // Set week fines updates
        await weekRef.set(updatedWeekData, { merge: true });

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
      })
    );
  }

  res.json({ result: `Completed.` });
});

module.exports = runDailyUpdate;
