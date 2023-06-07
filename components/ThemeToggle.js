import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Color } from "../GlobalStyles";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";

const ThemeToggle = ({ currentUserID, theme }) => {
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const themes = ["Classic", "Light", "Dark"];

  const handleThemeToggle = async (selectedTheme) => {
    setSelectedTheme(selectedTheme);
    const userRef = doc(db, "users", currentUserID);
    try {
      await updateDoc(userRef, {
        theme: selectedTheme,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {themes.map((theme, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            selectedTheme === theme ? styles.selectedButton : null,
          ]}
          onPress={() => handleThemeToggle(theme)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedTheme === theme ? styles.selectedButtonText : null,
            ]}
          >
            {theme}
          </Text>
        </TouchableOpacity>
      ))}
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

export default ThemeToggle;
