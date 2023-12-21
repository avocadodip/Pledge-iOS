import React, { useState } from "react";
import { View, Text, StyleSheet, Linking, Image } from "react-native";
import { Color } from "../../GlobalStyles";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import TouchableRipple from "../TouchableRipple";
import * as Notifications from "expo-notifications";
import { EXPO_PROJECT_ID } from "@env";
import BottomModal from "../BottomModal";
import Checkbox from "expo-checkbox";
import SampleNotif from "../SampleNotif";

const TIME_CHOICES = ["360", "180", "60", "30", "15"];
const TIME_LABELS = {
  360: "6 hours",
  180: "3 hours",
  60: "1 hour",
  30: "30 min",
  15: "15 min",
};

const NotificationsModal = ({
  currentUserID,
  isVisible,
  handleToggleModal,
  notificationsEnabled,
  notificationTimes,
  notificationPerms,
}) => {
  const [timeChoiceStates, setTimeChoiceStates] = useState(
    Object.fromEntries(
      Object.entries(notificationTimes).map(([key, value]) => [
        key,
        value.shouldSend,
      ])
    )
  );
  const enableNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Linking.openURL("app-settings:");
      return;
    }
    const token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: EXPO_PROJECT_ID,
      })
    ).data;

    const userRef = doc(db, "users", currentUserID);
    try {
      await updateDoc(userRef, {
        notifExpoPushToken: token, // store the token
        notificationsEnabled: true,
      });
    } catch (error) {
      console.error("Error updating document: ", error.message);
    }
  };

  const disableNotifications = async () => {
    handleToggleModal(false);
    setTimeout(async () => {
      const userRef = doc(db, "users", currentUserID);
      try {
        await updateDoc(userRef, {
          notificationsEnabled: false,
        });
      } catch (error) {
        console.error("Error updating document: ", error.message);
      }
    }, 300);
  };

  // Use the function when updating the document
  const updateTimeChoices = async (newState) => {
    const userRef = doc(db, "users", currentUserID);
    try {
      let updatedNotificationTimes = { ...notificationTimes };
      for (let key in newState) {
        updatedNotificationTimes[key].shouldSend = newState[key];
      }
      await updateDoc(userRef, {
        notificationTimes: updatedNotificationTimes,
      });
    } catch (error) {
      console.error("Error updating document: ", error.message);
    }
  };

  return (
    <BottomModal
      isVisible={isVisible}
      onBackdropPress={() => {
        handleToggleModal(false);
      }}
      modalTitle={"Notifications"}
      modalDescription={"Get notified when your day is about to end."}
    >
      {notificationsEnabled && notificationPerms ? (
        <View style={styles.modalContent}>
          <Text style={styles.remindMeText}>I want to be notified</Text>
          <View style={styles.daysActiveContainer}>
            {TIME_CHOICES.map((text, index) => (
              <View style={styles.dayContainer} key={index}>
                <Text
                  style={[
                    styles.dayText,
                    !timeChoiceStates[text]
                      ? styles.uncheckedText
                      : styles.checkedText,
                  ]}
                >
                  {TIME_LABELS[text]}
                </Text>
                <Checkbox
                  style={styles.checkbox}
                  color={
                    timeChoiceStates[text]
                      ? "rgba(255,255,255, 0.4)"
                      : "rgba(255,255,255, 0.4)"
                  }
                  value={timeChoiceStates[text]}
                  onValueChange={() => {
                    setTimeChoiceStates((prevState) => {
                      const newState = {
                        ...prevState,
                        [text]: !prevState[text],
                      };

                      // Count the number of true values in newState
                      const checkedCount =
                        Object.values(newState).filter(Boolean).length;

                      // If there are no true values, don't update the state
                      if (checkedCount === 0) {
                        return prevState;
                      }

                      updateTimeChoices(newState);
                      return newState;
                    });
                  }}
                />
              </View>
            ))}
          </View>
          <Text style={styles.remindMeText}>before my deadline.</Text>
        </View>
      ) : (
        <View style={styles.modalContent}>
          <Text style={styles.enableSubheader}>
            Get reminded when your day is about to end.
          </Text>
          <SampleNotif />
        </View>
      )}

      <View style={styles.enableButtonContainer}>
        <TouchableRipple
          style={styles.mainButton}
          onPress={
            notificationsEnabled && notificationPerms
              ? disableNotifications
              : enableNotifications
          }
        >
          <Text style={styles.mainButtonText}>
            {notificationsEnabled && notificationPerms
              ? "Turn off notifications"
              : "Turn on notifications"}
          </Text>
        </TouchableRipple>
      </View>
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  // MODAL CONTENT STYLES
  modalContent: {
    height: 300,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
  },
  mainButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    width: "100%",
  },
  mainButtonText: {
    fontSize: 18,
    color: Color.white,
    fontWeight: 500,
  },

  // DISABLED CONTAINER
  enableButtonContainer: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  enableSubheader: {
    fontSize: 15,
    color: Color.white,
    fontWeight: 400,
    marginBottom: 35,
    textAlign: "center",
    lineHeight: 20,
  },

  // ENABLED CONTAINER
  remindMeText: {
    fontSize: 17,
    color: Color.white,
    fontWeight: 400,
  },

  // checkbox styles
  daysActiveContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 25,
    gap: 18,
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  dayText: {
    width: 80,
    fontSize: 17,
    color: Color.white,
  },
  checkbox: {
    transform: [{ scale: 1.2 }], // checkbox size
    borderRadius: 3,
  },
  uncheckedText: {
    opacity: 0.5, // adjust this value as needed
  },
});

export default NotificationsModal;
