import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Color } from "../GlobalStyles";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import Modal from "react-native-modal";

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
  const buttonTexts = ["S", "M", "T", "W", "T", "F", "S"];

  // Local state for changes made in the modal
  const [modalDaysActive, setModalDaysActive] = useState({ ...daysActive });
  const [tempDaysActive, setTempDaysActive] = useState({ ...daysActive });

  // Handle day toggle in modal
  const handleModalDayToggle = (index) => {
    const dayKey = dayKeys[index];
    setTempDaysActive({
      ...tempDaysActive,
      [dayKey]: !tempDaysActive[dayKey],
    });
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
    <Modal
      style={styles.bottomModal}
      isVisible={isVisible}
      onBackdropPress={() => {
        handleToggleModal(false);
        setTempDaysActive(modalDaysActive);
      }}
      animationOutTiming={500}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Change Days Active</Text>
        <View style={styles.daysActiveContainer}>
          {buttonTexts.map((text, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                tempDaysActive[dayKeys[index]] ? styles.selectedButton : null,
              ]}
              onPress={() => handleModalDayToggle(index)}
            >
              <Text
                style={[
                  styles.buttonText,
                  tempDaysActive[dayKeys[index]]
                    ? styles.selectedButtonText
                    : null,
                ]}
              >
                {text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
      {/* CANCEL BUTTON */}
      <View>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            handleToggleModal(false);
            setTempDaysActive(modalDaysActive);
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal and modal content styles
  bottomModal: {
    justifyContent: "flex-end",
  },
  modalContent: {
    flexDirection: "col",
    backgroundColor: Color.fervo_red,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
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

  daysActiveContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 60,
    gap: 7,
  },
  button: {
    width: 34,
    height: 40,
    backgroundColor: "rgba(243,243,243,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  selectedButton: {
    backgroundColor: Color.white,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 15,
    textAlignVertical: "bottom",
    color: Color.white,
    fontWeight: 500,
  },
  selectedButtonText: {
    color: Color.fervo_red,
  },
});

export default DaysActiveModal;
