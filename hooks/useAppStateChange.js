import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import * as Notifications from "expo-notifications";

export function useUpdateUserTimezone(currentUserID) {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === "active") {
      const newTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (newTimezone !== timezone) {
        setTimezone(newTimezone);

        if (currentUserID) {
          const userDoc = doc(db, "users", currentUserID);
          await setDoc(userDoc, { timezone: newTimezone }, { merge: true });
        }
      }
    }
  };

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);
}

export function useCheckNotificationPerms(currentUserID) {
  const [notificationPerms, setNotificationPerms] = useState(false);

  const updateUserDoc = async (isEnabled) => {
    try {
      if (currentUserID) {
        const userRef = doc(db, "users", currentUserID);
        await updateDoc(userRef, {
          notificationsEnabled: isEnabled,
        });
      }
    } catch (error) {
      console.error("Failed to update user document:", error);
    }
  };

  const fetchInitialNotificationPerms = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationPerms(status);
      if (status !== "granted") {
        updateUserDoc(false);
      }
    } catch (error) {
      console.error("Failed to fetch initial notification permissions:", error);
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    try {
      if (nextAppState === "active") {
        const { status } = await Notifications.getPermissionsAsync();
        setNotificationPerms(status);
        if (status !== "granted") {
          updateUserDoc(false);
        }
      } 
    } catch (error) {
      console.error("Failed to handle app state change:", error);
    }
  };

  useEffect(() => {
    const handle = (state) => handleAppStateChange(state);
    
    const subscription = AppState.addEventListener("change", handle);
    
    return () => {
      subscription.remove();
    };
  }, []);
 
  return notificationPerms;
}