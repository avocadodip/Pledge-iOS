import React from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { Color } from "../../GlobalStyles";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import TouchableRipple from "../TouchableRipple";
import BottomModal from "../BottomModal";

const MissedTaskFineModal = ({
  currentUserID,
  isVisible,
  handleToggleModal,
  missedTaskFine,
  isPaymentSetup,
}) => {
  const toggleMissedTaskFine = async () => {
    // Show alert and return if payment method isn't set up
    if (missedTaskFine === 0 && !isPaymentSetup) {
      Alert.alert("Add a payment method to enable this feature.", "", [
        {
          text: "OK",
          onPress: () => {
            handleToggleModal(false);
          },
        },
      ]);
      return;
    }

    const newFineValue = missedTaskFine === 0 ? 1 : 0;
    const userRef = doc(db, "users", currentUserID);

    try {
      await updateDoc(userRef, {
        missedTaskFine: newFineValue,
      });
    } catch (error) {
      console.error("Error updating document: ", error.message);
    }

    if (newFineValue === 0) {
      handleToggleModal(true);
    }
  };

  return (
    <BottomModal
      isVisible={isVisible}
      onBackdropPress={() => {
        handleToggleModal(false);
      }}
      modalTitle={"No Input Fine"}
    >
      <View style={styles.modalContent}>
        {missedTaskFine === 0 ? (
          <View style={{ gap: 20 }}>
            <Text style={styles.descriptionText}>
              By enabling this feature, you'll be fined $1 for each task not
              locked in by the deadline ($3 for not locking in all 3 tasks for
              the next day).
            </Text>
            <Text style={styles.descriptionText}>
              We strongly recommend enabling fines, as this is core to
              Pledge's intended usage.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 20 }}>
            <Text style={styles.descriptionText}>No input fine is ON.</Text>
            <Text style={styles.descriptionText}>
              For each task not locked in by the deadline, you will be fined $1.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.enableButtonContainer}>
        <TouchableRipple
          style={styles.mainButton}
          onPress={toggleMissedTaskFine}
        >
          <Text style={styles.mainButtonText}>
            {missedTaskFine === 0 ? "Enable fines" : "Turn off fines"}
          </Text>
        </TouchableRipple>
      </View>
    </BottomModal>
  );
};
const styles = StyleSheet.create({
  // MODAL CONTENT STYLES
  modalContent: {
    height: 200,
    width: "100%",
    flexDirection: "col",
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionText: {
    fontSize: 14,
    color: Color.white,
    fontWeight: 400,
    textAlign: "center",
    lineHeight: 19,
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
});

export default MissedTaskFineModal;
