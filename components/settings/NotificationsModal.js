// https://github.com/samad324/react-native-animated-multistep
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
import { useDayChange } from "../../hooks/useDayChange";

const TIME_CHOICES = {
  "6 hours": 360,
  "3 hours": 180,
  "1 hour": 60,
  "30 min": 30,
  "15 min": 15,
};

// Convert the time choices to minutes
// Convert the time choices to minutes
const convertToMinutes = (timeChoices) => {
  let converted = {};
  for (let key in TIME_CHOICES) {
    converted[TIME_CHOICES[key]] = timeChoices[key] || false;
  }
  return converted;
};

const NotificationsModal = ({
  currentUserID,
  isVisible,
  handleToggleModal,
  notifsEnabled,
  notificationTimes,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(notifsEnabled);
  const [timeChoiceStates, setTimeChoiceStates] = useState(notificationTimes);

  const enableNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Linking.openURL("app-settings:");
      return;
    }
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: EXPO_PROJECT_ID,
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

    setNotificationsEnabled(true);
  };

  const disableNotifications = async () => {
    const userRef = doc(db, "users", currentUserID);
    try {
      await updateDoc(userRef, {
        notificationsEnabled: false,
      });
    } catch (error) {
      console.error("Error updating document: ", error.message);
    }
    handleToggleModal(false);

    // Timer to avoid seeing change flash
    setTimeout(() => {
      setNotificationsEnabled(false);
    }, 300);
  };

  // Use the function when updating the document
  const updateTimeChoices = async (newState) => {
    const userRef = doc(db, "users", currentUserID);
    try {
      await updateDoc(userRef, {
        notificationTimes: convertToMinutes(newState),
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
    >
      {notificationsEnabled ? (
        <View style={styles.modalContent}>
          <Text style={styles.remindMeText}>I want to be notified</Text>
          <View style={styles.daysActiveContainer}>
            {Object.keys(TIME_CHOICES).map((text, index) => (
              <View style={styles.dayContainer} key={index}>
                <Text
                  style={[
                    styles.dayText,
                    !timeChoiceStates[text]
                      ? styles.uncheckedText
                      : styles.checkedText,
                  ]}
                >
                  {text}
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
                      // Check if the current checkbox is checked and if it's the only one checked
                      if (
                        prevState[text] &&
                        Object.values(prevState).filter((v) => v).length === 1
                      ) {
                        // If it's the only one checked, don't allow it to be unchecked
                        return prevState;
                      }

                      const newState = {
                        ...prevState,
                        [text]: !prevState[text],
                      };
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
          <View style={styles.sampleNotif}>
            <Image
              source={require("../../assets/icons/pledgetransparent.png")}
              style={{ width: 50, height: 50 }}
            />
            <View style={styles.sampleNotifContent}>
              <View style={styles.sampleNotifTopContent}>
                <Text style={styles.appName}>Pledge</Text>
                <Text style={styles.timestamp}>now</Text>
              </View>
              <Text style={styles.sampleNotifMessage}>
                You have 30 minutes remaining to complete your tasks!
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.enableButtonContainer}>
        <TouchableRipple
          style={styles.mainButton}
          onPress={
            notificationsEnabled ? disableNotifications : enableNotifications
          }
        >
          <Text style={styles.mainButtonText}>
            {notificationsEnabled
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
    flexDirection: "col",
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 10,
    color: Color.white,
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

  // SAMPLE NOTIF STYLES
  sampleNotif: {
    backgroundColor: "rgba(211, 211, 211, 1)",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 12,
    paddingHorizontal: 5,
    width: "100%",
  },
  sampleNotifContent: {
    flexDirection: "column",
    gap: 3,
    width: "80%",
  },
  sampleNotifTopContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appName: {
    fontSize: 14,
    color: "black",
    fontWeight: 500,
  },
  timestamp: {
    fontSize: 14,
    color: "grey",
    fontWeight: 400,
  },
  sampleNotifMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: "black",
    fontWeight: 400,
  },

  // checkbox styles
  daysActiveContainer: {
    flexDirection: "col",
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
  checkedText: {
    fontWeight: "bold",
  },
});

export default NotificationsModal;
