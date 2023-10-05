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
  const [notificationPerms, setNotificationPerms] = useState(null);

  const updateUserDoc = async (isEnabled) => {
    if (currentUserID) {
      const userRef = doc(db, "users", currentUserID);
      await updateDoc(userRef, {
        notificationsEnabled: isEnabled,
      });
    }
  };

  const fetchInitialNotificationPerms = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationPerms(status);
    if (status !== "granted") {
      updateUserDoc(false);
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === "active") {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationPerms(status);
      if (status !== "granted") {
        updateUserDoc(false);
      }
    }
  };

  useEffect(() => {
    // Fetch the initial notification status when the component mounts
    fetchInitialNotificationPerms();

    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  return notificationPerms;
}
