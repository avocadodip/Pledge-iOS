import firebase from "../database/firebase";
import "firebase/firestore";
import Globals from "../Globals";
import { auth, db, googleProvider } from "../database/firebase";
import {
  onAuthStateChanged,
} from "firebase/auth";
import { collection, setDoc, doc, addDoc } from "firebase/firestore";

export const handleGoogleLogin = async () => {
  console.log('1');
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();
  
  console.log('1');
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
  console.log('1');
  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
};

export const checkAuthState = () => {
  onAuthStateChanged(auth, async (user) => {
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
