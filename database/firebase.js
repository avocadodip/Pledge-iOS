import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2jF-_eHNQmwze9bVxgV28rnsSsompGfs",
  authDomain: "fervo-1.firebaseapp.com",
  projectId: "fervo-1",
  storageBucket: "fervo-1.appspot.com",
  messagingSenderId: "339175420075",
  appId: "1:339175420075:web:e3b20f7fcc7935017607ee",
  measurementId: "G-JCR13C35TN",
};

firebase.initializeApp(firebaseConfig);
export default firebase;
