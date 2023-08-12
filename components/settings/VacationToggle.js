import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Color } from "../../GlobalStyles";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import ToggleSwitch from "toggle-switch-react-native";
import { useThemes } from "../../hooks/ThemesContext";

const VacationToggle = ({ currentUserID, vacationModeOn }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
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
      <Text style={styles.label}>{vacationModeOn ? "On" : "Off"}</Text>
      <View style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.25 }] }}>
        <ToggleSwitch
          isOn={vacationModeOn}
          onColor={theme.halfPrimary}
          offColor={theme.lightPrimary}
          size="medium"
          onToggle={handleVacationToggle}
        />
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    label: {
      width: 30,
      marginRight: 15,
      fontSize: 15, // should match style of theme toggle text
      color: theme.textMedium,
      opacity: 0.8, // should match style of theme toggle text
    },
  });

export default VacationToggle;
