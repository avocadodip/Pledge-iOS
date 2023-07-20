import React, { useState } from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { Color } from "../../GlobalStyles";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import Modal from "react-native-modal";
import TouchableRipple from "../TouchableRipple";
import * as Notifications from "expo-notifications";
import { EXPO_PROJECT_ID } from "@env";
import SelectDropdown from "react-native-select-dropdown";
// https://github.com/samad324/react-native-animated-multistep

const TIME_CHOICES = ["15 min", "30 min", "1 hour", "2 hours", "3 hours"];

const NotificationsModal = ({
  currentUserID,
  isVisible,
  handleToggleModal,
  notifsEnabled,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(notifsEnabled);

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
        expoPushToken: token, // store the token
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

  // Handle confirm button click
  const handleConfirm = async () => {
    // setModalDaysActive(tempDaysActive);
    // const userRef = doc(db, "users", currentUserID);
    // try {
    //   await updateDoc(userRef, {
    //     daysActive: tempDaysActive,
    //   });
    // } catch (error) {
    //   console.error("Error updating document: ", error.message);
    // }

    handleToggleModal(false);
  };

  return (
    <Modal
      style={styles.bottomModal}
      isVisible={isVisible}
      onBackdropPress={() => {
        handleConfirm();
      }}
      backdropTransitionOutTiming={0}
      animationOutTiming={500}
    >
      <View style={styles.modalContainer}>
        {notificationsEnabled ? (
          <>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Daily Reminder</Text>
              <View style={styles.remindMeContainer}>
                <Text style={styles.remindMeText}>Remind me</Text>
                <SelectDropdown
                  data={TIME_CHOICES}
                  defaultButtonText={"30 min"}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                  }}
                  buttonStyle={styles.timeSelectButton}
                  buttonTextStyle={styles.timeSelectButtonText}
                  dropdownStyle={styles.dropdownStyle}
                  rowStyle={styles.rowStyle}
                  rowTextStyle={styles.rowTextStyle}
                />

                <Text style={styles.remindMeText}>before my day ends</Text>
              </View>
              <View style={styles.enableButtonContainer}>
                <TouchableRipple
                  style={styles.disableButton}
                  onPress={disableNotifications}
                >
                  <Text style={styles.disableButtonText}>
                    Turn off notifications
                  </Text>
                </TouchableRipple>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Daily Reminder</Text>
              <Text style={styles.modalSubheader}>
                Get reminded when your day is about to end.
              </Text>
              <View style={styles.sampleNotif}>
                <View style={styles.sampleNotifAppIcon}></View>
                <View style={styles.sampleNotifContent}>
                  <View style={styles.sampleNotifTopContent}>
                    <Text style={styles.appName}>Fervo</Text>
                    <Text style={styles.timestamp}>now</Text>
                  </View>
                  <Text style={styles.sampleNotifMessage}>
                    You have 30 minutes remaining to complete your tasks!
                  </Text>
                </View>
              </View>
              <View style={styles.enableButtonContainer}>
                <TouchableRipple
                  style={styles.enableButton}
                  onPress={enableNotifications}
                >
                  <Text style={styles.enableButtonText}>
                    Turn on notifications
                  </Text>
                </TouchableRipple>
              </View>
            </View>
          </>
        )}
      </View>
      {/* CANCEL BUTTON */}
      <View>
        <TouchableRipple
          style={styles.cancelButton}
          onPress={() => {
            handleToggleModal(false);
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableRipple>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal styles
  bottomModal: {
    justifyContent: "flex-end",
  },
  modalContainer: {
    flexDirection: "col",
    backgroundColor: Color.fervo_red,
    // justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    height: 350,
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 30,
  },
  confirmButton: {
    backgroundColor: Color.fervo_red,
    width: "100%",
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelButton: {
    backgroundColor: Color.fervo_red,
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 15,
    textAlignVertical: "bottom",
    color: Color.white,
    fontWeight: 500,
  },

  // Modal content styles
  modalHeader: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 10,
    color: Color.white,
  },
  modalSubheader: {
    fontSize: 15,
    color: Color.white,
    fontWeight: 400,
    marginBottom: 35,
    textAlign: "center",
    lineHeight: 20,
  },

  // Sample notif styles
  sampleNotif: {
    backgroundColor: "rgba(226, 207, 207, 1)",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: "92%",
    marginBottom: 50,
    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sampleNotifAppIcon: {
    height: 35,
    width: 35,
    backgroundColor: "white",
    borderRadius: 6,
  },
  sampleNotifContent: {
    flexDirection: "column",
    gap: 3,
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

  // Remind me when styles
  remindMeContainer: {
    flexDirection: "column",
    gap: 15,
    alignItems: "center",
    marginBottom: 50,
    marginTop: 30,
  },
  remindMeText: {
    fontSize: 17,
    color: Color.white,
    fontWeight: 400,
  },
  timeSelectButton: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    width: 100,
    borderRadius: 16,
  },
  timeSelectButtonText: {
    fontSize: 17,
    color: Color.white,
    fontWeight: 500,
  },

  // Enable/disable notifs button styles
  enableButtonContainer: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  enableButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 60,
  },
  enableButtonText: {
    fontSize: 18,
    color: Color.white,
    fontWeight: 500,
  },
  disableButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 60,
  },
  disableButtonText: {
    fontSize: 18,
    color: Color.white,
    fontWeight: 500,
  },

  // Dropdown styles
  dropdownStyle: {
    backgroundColor: Color.fervo_red,
    borderRadius: 10,
  },
  rowStyle: {
    borderBottomWidth: 0,
  },
  rowTextStyle: {
    color: Color.white,
  },
});

export default NotificationsModal;
