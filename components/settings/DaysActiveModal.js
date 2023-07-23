import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import Modal from "react-native-modal";
import Checkbox from "expo-checkbox";
import { Color } from "../../GlobalStyles";
import TouchableRipple from "../TouchableRipple";
import { db } from "../../database/firebase";
import BottomModal from "../BottomModal";

const DaysActiveModal = ({
  currentUserID,
  daysActive,
  isVisible,
  handleToggleModal,
}) => {
  const dayKeys = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const abbrevDayKeys = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  // Local state for changes made in the modal
  const [modalDaysActive, setModalDaysActive] = useState({ ...daysActive });
  const [tempDaysActive, setTempDaysActive] = useState({ ...daysActive });

  // Handle day toggle in modal
  const handleModalDayToggle = (index) => {
    const dayKey = dayKeys[index];
    const newTempDaysActive = {
      ...tempDaysActive,
      [dayKey]: !tempDaysActive[dayKey],
    };

    if (!Object.values(newTempDaysActive).some(Boolean)) {
      Alert.alert(
        "At least one day must be active.",
        "Or turn vacation mode on."
      );
    } else {
      setTempDaysActive(newTempDaysActive);
    }
  };

  // Handle confirm button click
  const handleConfirm = async () => {
    setModalDaysActive(tempDaysActive);
    const userRef = doc(db, "users", currentUserID);
    try {
      await updateDoc(userRef, {
        daysActive: tempDaysActive,
      });
    } catch (error) {
      console.error("Error updating document: ", error.message);
    }

    handleToggleModal(false);
  };

  return (
    <BottomModal
      isVisible={isVisible}
      onBackdropPress={handleConfirm}
      modalTitle={"Set Days Active"}
    >
      <View style={styles.daysActiveContainer}>
        {abbrevDayKeys.map((text, index) => (
          <View style={styles.dayContainer} key={index}>
            <Text style={styles.dayText}>{text}</Text>
            <Checkbox
              style={styles.checkbox}
              color={
                tempDaysActive[dayKeys[index]]
                  ? "rgba(255,255,255, 0.4)"
                  : "rgba(255,255,255, 0.4)"
              }
              value={tempDaysActive[dayKeys[index]]}
              onValueChange={() => handleModalDayToggle(index)}
            />
          </View>
        ))}
      </View>
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 1,
    color: Color.white,
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

  // Modal content styles
  daysActiveContainer: {
    flexDirection: "col",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
    gap: 18,
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  dayText: {
    width: 60,
    fontSize: 19,
    color: Color.white,
  },
  checkbox: {
    transform: [{ scale: 1.2 }], // checkbox size
    borderRadius: 3,
  },
});

export default DaysActiveModal;
