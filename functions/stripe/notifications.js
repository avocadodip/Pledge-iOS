/* eslint-disable max-len */
// cd functions/stripe --> npx eslint --fix runDailyUpdate.js
// const {onRequest, stripe, moment, admin, schedulerKey} = require("../common");
// firebase deploy --only functions
// cd functions/stripe
// npx eslint --fix notifications.js
// const {admin} = require("../common");

const {moment, admin} = require("../common");
const {Expo} = require("expo-server-sdk");

/**
 * Asynchronously checks and sends notifications to users.
 *
 * This function queries the Firestore database for users who have enabled notifications,
 * are active today, and have not yet received all notifications for the day.
 * For each user, it checks the notification times and sends a notification if the current time
 * is past the notification time and the notification has not yet been sent.
 * All notifications are then sent in a batch using the Expo push notification service.
 *
 * @async
 * @function
 * @throws Will throw an error if the Expo push notification service returns an error.
 */
const checkAndSendNotifications = async () => {
  console.log("checkAndSendNotifications started");
  const currentTime = admin.firestore.Timestamp.now().toMillis(); // Current time in UTC milliseconds
  console.log(`Current time: ${currentTime}`);

  // Initialize an empty array to hold the messages
  const messages = [];

  // Query users based on initial criteria
  console.log("Querying users...");
  const usersSnapshot = await admin
      .firestore()
      .collection("users")
      .where("notificationsEnabled", "==", true)
      .where("todayIsActive", "==", true)
      .where("todayAllNotifsSent", "==", false)
      .where("todayAllSet", "==", false)
      .get();
  console.log(`Found ${usersSnapshot.size} users`);

  for (const userDoc of usersSnapshot.docs) {
    console.log("Processing user...");
    const userData = userDoc.data();
    const uid = userDoc.id;
    const notifExpoPushToken = userData.notifExpoPushToken;

    // user data
    const notificationTimes = userData.notificationTimes;
    const todayDayEnd = userData.todayDayEnd;
    const userTimeZone = userData.timezone;

    // get user's deadline in UTC ms
    const deadlineMillis = timeStringToUtcMillis(todayDayEnd, userTimeZone);

    const sortedNotificationTimes = Object.entries(notificationTimes).sort((a, b) => Number(a[0]) - Number(b[0]));

    for (const [time, notificationInfo] of sortedNotificationTimes) {
      console.log(`Processing notification time: ${time}`);
      const {shouldSend, isSent} = notificationInfo;
      if (isSent == true) {
        break;
      } else if (!isSent && shouldSend) {
        const notifyTime = deadlineMillis - parseInt(time) * 60 * 1000;
        const notifyTimePlus10Min = notifyTime + 10 * 60 * 1000;

        if (currentTime >= notifyTime && currentTime <= notifyTimePlus10Min) {
          // Prepare the message
          const message = {
            to: notifExpoPushToken,
            sound: "default",
            body: `You have ${convertMinutesToReadableTime(
                time,
            )} left to complete your day!`,
            data: {
              uid: uid,
              time: time,
            },
          };
          console.log(`Sending message: You have ${convertMinutesToReadableTime(time)} left to complete your day!`);

          userDoc.ref.update({
            [`notificationTimes.${time}.isSent`]: true,
            todayANotifHasBeenSent: true,
          });

          messages.push(message);

          break;
        }
      }
    }
  }
  console.log("checkAndSendNotifications finished");
  // Send all notifications in a batch
  const expo = new Expo();

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a time, which nicely spreads the load out over time:
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log("ticketChunk:", ticketChunk);
      // Pass through uid and time to the ticket
      tickets.push(
          ...ticketChunk.map((ticket, index) => {
            return {
              ...ticket,
              uid: chunk[index].data.uid,
              time: chunk[index].data.time,
            };
          }),
      );
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }

  // Receipt handling starts here
  const receiptIds = [];
  for (const ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }
  console.log("receiptIds:", receiptIds);
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  console.log("receiptIdChunks:", receiptIdChunks);

  for (const chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log("receipts:", receipts);

      for (const receiptId in receipts) {
        if (Object.prototype.hasOwnProperty.call(receipts, receiptId)) {
          const {status, message, details} = receipts[receiptId];
          if (status === "ok") {
            // Use the extended properties here
            const correspondingTicket = tickets.find((t) => t.id === receiptId);
            const {uid, time} = correspondingTicket;
            console.log("uid:", uid);
            console.log("time:", time);
            // if (time && uid) {
            //   await admin.firestore().collection("users").doc(uid).update({
            //     [`notificationTimes.${time}.isSent`]: true,
            //     todayANotifHasBeenSent: true,
            //   });
            // }
          } else if (status === "error") {
            console.error(`There was an error sending a notification: ${message}`);
            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
    }
  }
};


/**
 * Converts a time string to a Firestore timestamp.
 * @param {string} timeString - The time string to convert, in the format "HH:mm".
 * @param {string} timeZone - The time zone to use for the conversion.
 * @return {admin.firestore.Timestamp} The resulting Firestore timestamp.
 */
function timeStringToUtcMillis(timeString, timeZone) {
  // Create a moment object for the current date in the given time zone
  const now = moment.tz(timeZone);
  // Extract the current date components
  const year = now.year();
  const month = now.month();
  const date = now.date();
  // Construct a full date-time string
  const dateTimeString = `${year}-${month + 1}-${date} ${timeString} PM`;
  // Parse the date-time string into a moment object in the given time zone
  const localMoment = moment.tz(dateTimeString, "YYYY-MM-DD h:mm A", timeZone);
  // Convert the local moment to UTC milliseconds
  const utcMillis = localMoment.valueOf();
  return utcMillis;
}

/**
 * Converts a number of minutes to a readable time string.
 * @param {number} minutes - The number of minutes to convert.
 * @return {string} The resulting time string, in the format "X hours" or "X minutes".
 */
function convertMinutesToReadableTime(minutes) {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else {
    const hours = minutes / 60;
    return `${hours} ${hours > 1 ? "hours" : "hour"}`;
  }
}

/**
 * Sends a test push notification using the Expo push notification service.
 *
 * This function initializes the Expo client, creates a test message, and sends it.
 * The Expo push token used is a placeholder and should be replaced with a valid token.
 *
 * @async
 * @function
 * @throws {Error} Will throw an error if the Expo push notification service returns an error.
 */
const testPushNotification = async () => {
  // Initialize the Expo client
  const expo = new Expo();

  // Replace this with your Expo push token
  const yourExpoPushToken = "ExponentPushToken[3-U--PGRkkQFu36ZmeIKbO]";

  // Create a message
  const message = {
    to: yourExpoPushToken,
    sound: "default",
    body: "This is a test notification",
  };

  // Send the message
  try {
    const receipt = await expo.sendPushNotificationsAsync([message]);
    console.log(receipt);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  checkAndSendNotifications,
  testPushNotification,
};
