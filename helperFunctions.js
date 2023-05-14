import firebase from "./database/firebase";
import "firebase/firestore";
import { Alert } from "react-native";
import Globals from "./Globals";

export const checkAuthState = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, navigate to the Map screen
      Globals.currentUserID = user.uid;

      // Get the user's document from Firestore
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // Set the full name in Globals
            Globals.fullName = doc.data().fullName;
            Globals.email = doc.data().email;
            Globals.profileImageUrl = doc.data().profileImageUrl || "";
            Globals.phoneNumber = doc.data().phoneNumber || "";
            console.log("properly set globals and logged in");
          } else {
            console.log("No such document!");
          }
        });
      return true;
    } else {
      // No user is signed in, navigate to the Login screen
      return false;
    }
  });
};
