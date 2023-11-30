import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import Checkbox from "expo-checkbox";
import { Color } from "../../GlobalStyles";
import { db } from "../../database/firebase";
import BottomModal from "../BottomModal";
import { useDayChange } from "../../hooks/useDayChange";
import { useSettings } from "../../hooks/SettingsContext";

const DAY_KEYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const ABBREV_DAY_KEYS = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

const DaysActiveModal = ({ isVisible, handleToggleModal }) => {
  const { tmrwDOW } = useDayChange();
  const {
    currentUserID,
    settings: { daysActive },
  } = useSettings();

  const toggleCheckbox = async (dayKey) => {
    const newDaysActive = { ...daysActive, [dayKey]: !daysActive[dayKey] };
    if (!Object.values(newDaysActive).some(Boolean)) {
      Alert.alert(
        "At least one day must be active.",
        "Or turn vacation mode on."
      );
      return;
    }

    const userRef = doc(db, "users", currentUserID);
    const updateData = { daysActive: newDaysActive };
    if (dayKey === tmrwDOW) {
      updateData.tmrwIsActive = newDaysActive[tmrwDOW];
    }

    try {
      await updateDoc(userRef, updateData);
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
      modalTitle={"Set Days Active"}
    >
      <View style={styles.daysActiveContainer}>
        {ABBREV_DAY_KEYS.map((text, index) => (
          <View style={styles.dayContainer} key={index}>
            <Text style={styles.dayText}>{text}</Text>
            <Checkbox
              style={styles.checkbox}
              color={
                daysActive[DAY_KEYS[index]]
                  ? "rgba(255,255,255, 0.4)"
                  : "rgba(255,255,255, 0.4)"
              }
              value={daysActive[DAY_KEYS[index]]}
              onValueChange={() => toggleCheckbox(DAY_KEYS[index])}
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
