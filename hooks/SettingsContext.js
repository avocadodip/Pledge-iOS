import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../database/firebase";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (currentUserID) {
        try {
          const userDoc = doc(db, "users", currentUserID);
          const userDocSnapshot = await getDoc(userDoc);

          if (userDocSnapshot.exists()) {
            const userSettings = userDocSnapshot.data();
            setSettings(userSettings);
          } else {
            // Handle the case where the user does not exist or has no settings
          }
        } catch (error) {
          console.error("Error fetching user settings: ", error);
        }
      }
    };

    fetchSettings();
  }, [currentUserID]);

  return (
    <SettingsContext.Provider value={{ settings, setCurrentUserID }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

