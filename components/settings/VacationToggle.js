import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import ToggleSwitch from "toggle-switch-react-native";
import { useThemes } from "../../hooks/ThemesContext";
import { useSettings } from "../../hooks/SettingsContext";

const VacationToggle = () => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const { currentUserID, settings: { tmrwTodos, tmrwIsVacation }} = useSettings();

  const handleVacationToggle = async (updatedBool) => {
    // If at least one tmrw todo is locked, vacation mode can't be turned on
    if (updatedBool === true && tmrwTodos.some(todo => todo.isLocked === true)) {
      Alert.alert("Disabled", "Vacation mode can't be turned on when a task has already been locked.");
      return;
    }

    const userRef = doc(db, "users", currentUserID);

    try {
      await updateDoc(userRef, {
        tmrwIsVacation: updatedBool,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{tmrwIsVacation ? "On" : "Off"}</Text>
      <View style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.25 }] }}>
        <ToggleSwitch
          isOn={tmrwIsVacation}
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
