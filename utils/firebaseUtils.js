import {
  doc,
  setDoc,
  runTransaction,
  arrayUnion,
  increment,
} from "@firebase/firestore";
import { db } from "../database/firebase";
import { getTmrwDate, getTodayDate } from "./currentDate";


// Updates isOnboarded field to true; Used in gettstartedmodal when user locks in 3 tasks
export const updateUserIsOnboarded = async (currentUserID) => {
  const userRef = doc(db, "users", currentUserID);

  return setDoc(
    userRef,
    {
      isOnboarded: true,
    },
    { merge: true }
  )
    .then(() => {
      console.log("User isOnboarded updated successfully");
    })
    .catch((error) => {
      console.error("Error updating user isOnboarded: ", error);
    });
};
