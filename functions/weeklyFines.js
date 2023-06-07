const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createWeeklyFines = functions.pubsub.schedule('every monday 00:00').onRun((context) => {
    // Create new document for each user
    const weekStart = new Date();
    const weekEnd = new Date();
    weekEnd.setDate(weekStart.getDate() + 7);
    const weekRange = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;

    const usersRef = admin.firestore().collection('users');
    return usersRef.get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const finesRef = admin.firestore().collection('fines');
            finesRef.doc(doc.id).collection(weekRange).add({
                totalTodosDue: 0,
                hasBeenCharged: false,
                failedTodos: [],
            });
        });
        return null;
    }).catch((err) => {
        console.log('Error creating weekly fines', err);
    });
});