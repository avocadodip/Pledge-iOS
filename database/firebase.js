import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2jF-_eHNQmwze9bVxgV28rnsSsompGfs",
  authDomain: "fervo-1.firebaseapp.com",
  projectId: "fervo-1",
  storageBucket: "fervo-1.appspot.com",
  messagingSenderId: "339175420075",
  appId: "1:339175420075:web:e3b20f7fcc7935017607ee"
};

initializeApp(firebaseConfig);

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore();



