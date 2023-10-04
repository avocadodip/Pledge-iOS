/* eslint-disable max-len */
// const {onRequest, stripe, moment, admin, schedulerKey} = require("../common");
// firebase deploy --only functions
// cd functions/stripe
// npx eslint --fix notifications.js
const {admin} = require("../common");

/**
 * Converts UTC time to user's local time based on their time zone.
 * @param {number} utcTime - The UTC time.
 * @param {string} userTimeZone - The user's time zone.
 * @return {number} The local time of the user.
 */
function convertToUserLocalTime(utcTime, userTimeZone) {
  // Logic to convert UTC time to user's local time based on their time zone
  // You can use libraries like 'moment-timezone' for this
  let localTime;
  // calculate localTime here
  return localTime;
}

/**
 * Converts time string to milliseconds.
 * @param {string} time - The time string.
 * @return {number} The time in milliseconds.
 */
function parseTimeToMillis(time) {
  // Convert time string to milliseconds
  let timeInMilliseconds;
  // calculate timeInMilliseconds here
  return timeInMilliseconds;
}

/**
 * Sends a notification to a user.
 * @param {string} uid - The user's ID.
 * @param {Object} todoData - The todo data.
 * @return {string} - Status of function
 */
function sendNotification(uid, todoData) {
  // Logic to send notification
  let notificationStatus;
  // set notificationStatus here
  return notificationStatus;
}

/**
 * Checks and sends notifications to users.
 * @async
 * @return {Object} contains several variables
 */
const checkAndSendNotifications = async () => {
  const currentTime = admin.firestore.Timestamp.now();
  const maxTime = currentTime + 6 * 60 * 60 * 1000; // 6 hours into the future

  // Get all users
  const usersSnapshot = await admin.firestore().collection("users").get();

  usersSnapshot.forEach(async (userDoc) => {
    const uid = userDoc.id;
    const notificationTimes = userDoc.data().notificationTimes;
    const userTimeZone = userDoc.data().timezone;

    const todosSnapshot = await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("todos")
        .where("closesAt", "<=", maxTime)
        .get();

    todosSnapshot.forEach((todoDoc) => {
      const todoData = todoDoc.data();
      let deadline = todoData.deadline;

      // Convert deadline to user's local time
      deadline = convertToUserLocalTime(deadline, userTimeZone);

      const notified = todoData.notified || {};

      for (const [time, isActive] of Object.entries(notificationTimes)) {
        if (isActive && !notified[time]) {
          const notifyTime = deadline - parseTimeToMillis(time);
          if (currentTime >= notifyTime) {
            // Send notification
            sendNotification(uid, todoData);
            notified[time] = true;
          }
        }
      }

      // Update the notified flags in Firestore
      todoDoc.ref.update({notified});
    });
  });
};

module.exports = {
  checkAndSendNotifications,
};
