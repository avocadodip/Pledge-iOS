import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../database/firebase'; 

// Updates timezone when app is active & their device timezone is different from stored timezone
export default function useUpdateTimezoneOnAppActive(currentUserID) {

  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const handleAppStateChange = async (nextAppState) => { 

    if (nextAppState === 'active') {
      const newTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;  

      // If new time zone
      if (newTimezone !== timezone) {
        setTimezone(newTimezone);

        // Save the new timezone to the Firebase user document
        if (userId) {
          const userDoc = doc(db, "users", currentUserID);
          await setDoc(userDoc, { timezone: newTimezone }, { merge: true });
        }

        // To add: update dayStart/dayEnd
      } 
    }
  }; 
   
  // if App State changes, run check function
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
}