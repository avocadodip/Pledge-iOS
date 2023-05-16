import firebase from './database/firebase'
import 'firebase/firestore'
import { Alert } from 'react-native'
import Globals from './Globals'

//import firebase wherever you use these
export const getCurrentUserId = () => {
  const currentUser = firebase.auth().currentUser
  if (currentUser) {
    const currentUserId = currentUser.uid
    return currentUserId
  } else {
    console.log('No user is currently signed in')
    return null
  }
}

export const acceptFriendRequest = async (userId, friendUserId) => {
  const db = firebase.firestore()

  // Get the user's document from Firestore
  const userRef = db.collection('users').doc(userId)
  const userDoc = await userRef.get()
  const userData = userDoc.data()

  // Find the friend request in the user's friendRequests array
  const friendRequest = userData.friendRequests.find(
    (request) => request.id === friendUserId,
  )

  // Check if the friend request exists
  if (!friendRequest) {
    console.log('Friend request not found')
    return
  }

  // Get the friend's document from Firestore
  const friendRef = db.collection('users').doc(friendUserId)
  const friendDoc = await friendRef.get()
  const friendData = friendDoc.data()

  // Create a friend object for both users
  const friendToAdd = { id: friendUserId, fullName: friendData.fullName }
  const friendToAddToFriend = { id: userId, fullName: userData.fullName }

  // Add friend objects to both users' friends arrays
  const updatedFriends = [...userData.friends, friendToAdd]
  const updatedFriendFriends = [...friendData.friends, friendToAddToFriend]

  // Remove the friend request from the user's friendRequests array
  const updatedFriendRequests = userData.friendRequests.filter(
    (request) => request.id !== friendUserId,
  )

  // Update both documents in a batch write
  const batch = db.batch()
  batch.update(userRef, {
    friends: updatedFriends,
    friendRequests: updatedFriendRequests,
  })
  batch.update(friendRef, { friends: updatedFriendFriends })
  await batch.commit()

  console.log('Friend request accepted')
}

// export const addFriendRequest = async (userId, friendUserId) => {
//   // Get the user's document from Firestore
//   const db = firebase.firestore()
//   const userRef = db.collection('users').doc(userId)
//   const userDoc = await userRef.get()

//   // Get the friend user's document from Firestore
//   const friendUserRef = db.collection('users').doc(friendUserId)
//   const friendUserDoc = await friendUserRef.get()

//   // Check if the friend user document exists
//   if (!friendUserDoc.exists) {
//     Alert.alert('Error', 'No users found with the provided phone number.')
//     return
//   }

//   // Get the friend user's full name
//   // const friendFullName = friendUserDoc.data().fullName

//   // Get the current user's full name
//   const currentUserName = userDoc.data().fullName

//   // Create a new friend request object for the current user to send
//   // const newFriendRequestSent = { id: friendUserId, fullName: friendFullName }

//   // Create a new friend request object for the friend user to receive
//   const newFriendRequestReceived = { id: userId, fullName: currentUserName }

//   // Check if the friend request has already been sent
//   const existingFriendRequestsSent = userDoc.data().friendRequests || []
//   const requestExists = existingFriendRequestsSent.some(
//     (request) => request.id === friendUserId,
//   )

//   if (requestExists) {
//     Alert.alert(
//       'Error',
//       'An error occurred while sending your friend request.',
//     )
//     return
//   }

//   // Add the new friend request object to the friendRequests array in the current user's document
//   // await userRef.update({
//   //   friendRequests: firebase.firestore.FieldValue.arrayUnion(
//   //     newFriendRequestSent,
//   //   ),
//   // })

//   // Add the new friend request object to the friendRequests array in the friend user's document
//   await friendUserRef.update({
//     friendRequests: firebase.firestore.FieldValue.arrayUnion(
//       newFriendRequestReceived,
//     ),
//   })

//   Alert.alert(
//     'Friend Request Sent',
//     'Your friend request was sent successfully.',
//   )
// }

export const declineFriendRequest = async (userId, friendUserId) => {
  try {
    // Get the Firestore instance
    const db = firebase.firestore()

    // Get the user's document reference from Firestore
    const userRef = db.collection('users').doc(userId)

    // Get the user's document snapshot
    const userDoc = await userRef.get()

    // Check if the user document exists
    if (!userDoc.exists) {
      console.log('User not found')
      return
    }

    // Get the current user's friend requests
    const friendRequests = userDoc.data().friendRequests || []

    // Find the index of the friend request to be declined
    const requestIndex = friendRequests.findIndex(
      (request) => request.id === friendUserId,
    )

    // If the friend request is not found, exit the function
    if (requestIndex === -1) {
      console.log('Friend request not found')
      return
    }

    // Remove the friend request from the friendRequests array
    friendRequests.splice(requestIndex, 1)

    // Update the friendRequests array in the user's document
    await userRef.update({ friendRequests })

    console.log('Friend request declined')
  } catch (error) {
    console.error('Error declining friend request:', error)
  }
}

export const removeFriend = async (userId, friendUserId) => {
  const db = firebase.firestore()

  // Get the user's document from Firestore
  const userRef = db.collection('users').doc(userId)
  const userDoc = await userRef.get()
  const userData = userDoc.data()

  // Get the friend's document from Firestore
  const friendRef = db.collection('users').doc(friendUserId)
  const friendDoc = await friendRef.get()
  const friendData = friendDoc.data()

  // Check if the friend exists in the user's friends array
  const isFriend = userData.friends.some((friend) => friend.id === friendUserId)
  if (!isFriend) {
    console.log('Friend not found')
    return
  }

  // Remove the friend from the user's friends array
  const updatedFriends = userData.friends.filter(
    (friend) => friend.id !== friendUserId,
  )

  // Remove the user from the friend's friends array
  const updatedFriendFriends = friendData.friends.filter(
    (friend) => friend.id !== userId,
  )

  // Update both documents in a batch write
  const batch = db.batch()
  batch.update(userRef, { friends: updatedFriends })
  batch.update(friendRef, { friends: updatedFriendFriends })
  await batch.commit()

  console.log('Friend removed successfully')
}

// Function to set the user's location in Firestore
export const setUserLocation = (latitude, longitude) => {
  // Get the currently signed-in user
  const currentUser = firebase.auth().currentUser

  // Check if the user is signed in
  if (currentUser) {
    // Get the user's UID
    const uid = currentUser.uid
    if (uid == 'wFgO6Uk0OqhldEeWQiyO8ZCMf6o1')
    {
      return
    }

    // Update the location field of the user document in Firestore
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .update({
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      })
      .then(() => {
        console.log('User location updated successfully.')
      })
      .catch((error) => {
        console.error('Error updating user location:', error.message)
      })
  } else {
    console.log('No user is signed in.')
  }
}

// Example usage of the function (replace with actual values)
// setUserLocation(40.7128, -74.0060) // New York City

export const getFirstName = (fullName) => {
  // Check if fullName is empty or undefined
  if (!fullName || fullName.trim() === '') {
    return ''
  }

  // Split the full name by spaces
  const nameParts = fullName.split(' ')

  // Get the first element of the array, which is the first name
  const firstName = nameParts[0]

  // If there is no space in the name, nameParts will have only one element
  // In that case, return the entire fullName as the first name
  return firstName
}

// Function to set the user's status in Firestore
export const setUserStatus = (mystatus) => {
  // Get the currently signed-in user
  console.log('this is the stuatus ' + { mystatus })
  const currentUser = firebase.auth().currentUser

  // Check if the user is signed in
  if (currentUser) {
    // Get the user's UID
    const uid = currentUser.uid

    // Update the location field of the user document in Firestore
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .update({
        status: mystatus,
      })
      .then(() => {
        console.log('User status updated successfully.')
      })
      .catch((error) => {
        console.error('Error updating user status:', error.message)
      })
  } else {
    console.log('No user is signed in.')
  }
}

export const turnOnBeacon = async (userId) => {
  // Check if the user ID is valid
  if (!userId || userId.trim() === '') {
    console.log('Invalid user ID')
    return
  }

  try {
    // Get the Firestore instance
    const db = firebase.firestore()

    // Get the user's document reference from Firestore
    const userRef = db.collection('users').doc(userId)

    // Update the beaconOn field to true in the user's document
    await userRef.update({ beaconOn: true })

    console.log('Beacon turned on successfully')
  } catch (error) {
    console.error('Error turning on beacon:', error)
  }
}

export const turnOffBeacon = async (userId) => {
  // Check if the user ID is valid
  if (!userId || userId.trim() === '') {
    console.log('Invalid user ID')
    return
  }

  try {
    // Get the Firestore instance 
    const db = firebase.firestore()

    // Get the user's document reference from Firestore
    const userRef = db.collection('users').doc(userId)

    // Update the beaconOn field to true in the user's document
    await userRef.update({ beaconOn: false })

    // console.log('Beacon turned off successfully')
  } catch (error) {
    // console.error('Error turning off beacon:', error)
  }
}

export const isBeaconOn = (mystatusmessage) => {
  // Get the currently signed-in user
  const currentUser = firebase.auth().currentUser

  // Check if the user is signed in
  if (currentUser) {
    // Get the user's UID
    const uid = currentUser.uid

    // Update the location field of the user document in Firestore
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .update({
        beaconOn: true,
      })
      .then(() => {
        // console.log('User status updated successfully.', mystatusmessage)
      })
      .catch((error) => {
        // console.error('Error updating user status:', error.message)
      })
  } else {
    // console.log('No user is signed in.')
  }
}

//     // Return the value of the beaconOn field
//     return beaconOn === true
//   } catch (error) {
//     console.error('Error checking beacon status:', error)
//     return false
//   }
// }

// Example usage
// import Globals from '../Globals'
// const userId = 'Globals.currentUserID'
// isBeaconOn(userId)
//   .then((beaconStatus) => {
//     if (beaconStatus) {
//       console.log('Beacon is on')
//     } else {
//       console.log('Beacon is off')
//     }
//   })
//   .catch((error) => {
//     console.error('Error checking beacon status:', error)
//   })

export const extractLast10Digits = (phoneNumber) => {
  return phoneNumber.replace(/\D+/g, '').slice(-10)
}

export const handleSearchPhoneNumber = async (
  searchPhoneNumber,
  currentUserId,
  currentUserName,
) => {
  // Check if the handleSearchPhoneNumber field is empty
  if (!searchPhoneNumber || searchPhoneNumber.trim() === '') {
    Alert.alert('Error', 'Please enter a phone number to search.')
    return
  }

  const db = firebase.firestore()
  const usersRef = db.collection('users')

  // Search for users with the matching phone number in Firestore
  const querySnapshot = await usersRef
    .where('phoneNumber', '==', searchPhoneNumber)
    .get()

  // Check if a user with the same phone number is found
  if (querySnapshot.empty) {
    Alert.alert(
      'User Not Found 🤔',
      'Please check the phone number and try again.',
    )
    return
  }

  // Get the friend user's document from Firestore
  const friendUserDoc = querySnapshot.docs[0]
  const friendUserId = friendUserDoc.id
  const friendUserRef = usersRef.doc(friendUserId)

  // Ensure the sender doesn't send a friend request to themselves
  if (friendUserId === currentUserId) {
    Alert.alert('Error', 'You cannot send a friend request to yourself.')
    return
  }

  // Create a new friend request object for the friend user to receive
  const newFriendRequestReceived = {
    id: currentUserId,
    fullName: currentUserName,
  }

  // Check if the friend request has already been sent
  const existingFriendRequestsReceived =
    friendUserDoc.data().friendRequests || []
  const requestExists = existingFriendRequestsReceived.some(
    (request) => request.id === currentUserId,
  )

  if (requestExists) {
    Alert.alert('Error', 'An error occurred while sending your friend request.')
    return
  }

  // Add the new friend request object to the friendRequests array in the friend user's document
  await friendUserRef.update({
    friendRequests: firebase.firestore.FieldValue.arrayUnion(
      newFriendRequestReceived,
    ),
  })

  Alert.alert(
    'Friend Request Sent 😊',
    'Your friend request was sent successfully.',
  )
}

export const setUserStatusMessage = (mystatusmessage) => {
  // Get the currently signed-in user
  const currentUser = firebase.auth().currentUser

  // Check if the user is signed in
  if (currentUser) {
    // Get the user's UID
    const uid = currentUser.uid

    // Update the location field of the user document in Firestore
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .update({
        statusMessage: mystatusmessage,
      })
      .then(() => {
        // console.log('User status updated successfully.', mystatusmessage)
      })
      .catch((error) => {
        // console.error('Error updating user status:', error.message)
      })
  } else {
    // console.log('No user is signed in.')
  }
}

export const checkAuthState = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, navigate to the Map screen
      Globals.currentUserID = user.uid

      // Get the user's document from Firestore
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // Set the full name in Globals
            Globals.fullName = doc.data().fullName
            Globals.email = doc.data().email
            Globals.profileImageUrl = doc.data().profileImageUrl || ''
            Globals.phoneNumber = doc.data().phoneNumber || ''
            console.log('properly set globals and logged in')
          } else {
            console.log('No such document!')
          }
        })
      return true
    } else {
      // No user is signed in, navigate to the Login screen
      return false
    }
  })
}

export const handleDeleteAccount = () => {
  return new Promise((resolve) => {
    // Display a confirmation alert before deleting the account
    Alert.alert(
      'Delete Account 🗑️',
      'Are you sure you want to delete your account? This action cannot be undone. 💔',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Account deletion cancelled');
            resolve(false); // Account deletion was cancelled
          },
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Get the currently signed-in user
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
              const uid = currentUser.uid;

              // Delete user's profile image from Firebase Cloud Storage, if it exists
              if (Globals.profileImageUrl) {
                const storageRef = firebase.storage().ref(Globals.profileImageUrl);
                storageRef.delete().catch((error) => {
                  console.error('Error deleting user image from Firebase Storage:', error);
                });
              }

              // Remove the current user from other users' friend lists and friend requests
              firebase
                .firestore()
                .collection('users')
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const friendList = doc.data().friendList || [];
                    const friendRequests = doc.data().friendRequests || [];
                    const updatedFriendList = friendList.filter((friend) => friend.userId !== uid);
                    const updatedFriendRequests = friendRequests.filter((request) => request.userId !== uid);
                    doc.ref.update({
                      friendList: updatedFriendList,
                      friendRequests: updatedFriendRequests,
                    });
                  });
                });

              // Delete the user's document from the Firestore users collection
              firebase
                .firestore()
                .collection('users')
                .doc(uid)
                .delete()
                .then(() => {
                  console.log('User successfully deleted!');
                  // Delete user from Firebase Authentication
                  currentUser
                    .delete()
                    .then(() => {
                      console.log('User account deleted from Firebase Authentication');
                      Globals.currentUserID = '';
                      Globals.fullName = '';
                      Globals.email = '';
                      Globals.profileImageUrl = '';
                      Globals.phoneNumber = '';
                      // Successfully deleted user account
                      resolve(true); // Account deletion was successful
                    })
                    .catch((error) => {
                      // Handle account deletion error
                      console.error('Error deleting user from Firebase Authentication: ', error);
                      Alert.alert('Account Deletion Failed', error.message);
                      resolve(false); // Account deletion failed
                    });
                })
                .catch((error) => {
                  console.error('Error deleting user document: ', error);
                  Alert.alert('Account Deletion Failed', error.message);
                  resolve(false); // Account deletion failed
                });
            } else {
              resolve(false); // No user to delete
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  });
};