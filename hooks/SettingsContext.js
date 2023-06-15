import { doc, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../database/firebase";
import { Text } from "react-native";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [currentUserFullName, setCurrentUserFullName] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserID) {
      const userDoc = doc(db, "users", currentUserID);

      const unsubscribe = onSnapshot( 
        userDoc,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userSettings = docSnapshot.data();
            setSettings(userSettings);

          } else {
            // Handle the case where the user does not exist or has no settings
          }
          setLoading(false); // turn off loading
        },
        (error) => {
          console.error("Error fetching user settings: ", error);
        }
      );

      // Clean up listener when component is unmounted or userID changes
      return () => unsubscribe();
    }
  }, [currentUserID]);


  return (
    <SettingsContext.Provider value={{ settings, currentUserID, setCurrentUserID, currentUserFullName, setCurrentUserFullName, currentUserEmail, setCurrentUserEmail, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
