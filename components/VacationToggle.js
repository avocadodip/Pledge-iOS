import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Color } from "../GlobalStyles";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";

const VacationToggle = ({ currentUserID, vacationModeOn }) => {

  const handleVacationToggle = async (value) => {
    const userRef = doc(db, "users", currentUserID);
    try {
      await updateDoc(userRef, {
        vacationModeOn: value,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            vacationModeOn ? styles.selectedButton : null,
          ]}
          onPress={() => handleVacationToggle(true)}
        >
          <Text
            style={[
              styles.buttonText,
              vacationModeOn ? styles.selectedButtonText : null,
            ]}
          >
            On
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            !vacationModeOn ? styles.selectedButton : null,
          ]}
          onPress={() => handleVacationToggle(false)}
        >
          <Text
            style={[
              styles.buttonText,
              !vacationModeOn ? styles.selectedButtonText : null,
            ]}
          >
            Off
          </Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 70,
    height: 36,
    backgroundColor: "rgba(243,243,243,0.1)",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 7,
    borderRadius: 10,
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: Color.white,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 15,
    textAlignVertical: "bottom",
    color: Color.white,
  },
  selectedButtonText: {
    color: Color.fervo_red,
  },
});

export default VacationToggle;
