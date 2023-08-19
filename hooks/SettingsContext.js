import { doc, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../database/firebase";
import { onAuthStateChanged } from "@firebase/auth";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({ isOnboarded: false });
  const [currentUserID, setCurrentUserID] = useState(null);
  const [currentUserFullName, setCurrentUserFullName] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [appReadyToRender, setAppReadyToRender] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setCurrentUserID(user.uid);
        setIsAuthenticated(true); // user is authenticated
      } else {
        setCurrentUserID(null);
        setIsAuthenticated(false); // user is not authenticated
        setUserDataFetched(false);
        setAppReadyToRender(false);
      }
    }); 

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUserID) {
      const userDoc = doc(db, "users", currentUserID);

      const unsubscribe = onSnapshot(
        userDoc,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userSettings = docSnapshot.data();
            setSettings(userSettings);
            setCurrentUserFullName(userSettings.fullName);
            setCurrentUserEmail(userSettings.email);
            setUserDataFetched(true);

          } else {
            // Handle the case where the user does not exist or has no settings
          }
          // setLoading(false); // turn off loading
        },
        (error) => {
          console.error("Error fetching user settings: ", error);
        }
      );

      // Clean up listener when component is unmounted or userID changes
      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        currentUserID,
        setCurrentUserID,
        currentUserFullName,
        setCurrentUserFullName,
        currentUserEmail,
        setCurrentUserEmail,
        isAuthenticated,
        userDataFetched,
        setUserDataFetched,
        appReadyToRender,
        setAppReadyToRender,

      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
