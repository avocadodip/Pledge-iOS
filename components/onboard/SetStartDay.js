import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";

const options = [
  {
    label: "Today",
    subtext: "Tasks must be completed by",
    date: "7:30 PM, July 23",
  },
  {
    label: "Tomorrow",
    subtext: "Tasks must be completed by",
    date: "7:30 PM, July 24",
  },
];

const SetStartDay = () => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const [selectedOption, setSelectedOption] = useState("Today");

  return (
    <View style={styles.container}>
      <Text style={styles.promptText}>
        I will complete{"\n"}my first day of tasks
      </Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.label}
          style={[
            styles.button,
            selectedOption === option.label && styles.buttonSelected,
          ]}
          onPress={() => setSelectedOption(option.label)}
        >
          <Text
            style={[
              styles.buttonTitleText,
              selectedOption === option.label && styles.buttonTitleTextSelected,
            ]}
          >
            {option.label}
          </Text>
          <View style={styles.descContainer}>
            <Text
              style={[
                styles.buttonDescText,
                selectedOption === option.label &&
                  styles.buttonDescTextSelected,
              ]}
            >
              {option.subtext}{" "}
            </Text>
            <Text
              style={[
                styles.buttonDateText,
                selectedOption === option.label &&
                  styles.buttonDescTextSelected,
              ]}
            >
              {option.date}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SetStartDay;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      gap: 20,
      alignItems: "center",
    },
    promptText: {
      color: "white",
      fontSize: 26,
      fontWeight: 600,
      alignSelf: "flex-start",
      lineHeight: 35,
    },

    // Unselected button styles
    button: {
      // Base styles
      flexDirection: "column",
      gap: 7,
      borderRadius: 12,
      width: "100%",
      paddingVertical: 20,
      justifyContent: "center",
      alignItems: "center",

      // Unselected
      borderWidth: 2,
      borderColor: "#ffffffb1",
    },
    buttonTitleText: {
      color: "#ffffffb1",
      fontSize: 23,
      fontWeight: 600,
    },
    buttonDescText: {
      color: "#ffffffb1",
      fontSize: 16,
      lineHeight: 27,
    },
    buttonDateText: {
      color: "#ffffffb1",
      fontSize: 16,
      fontWeight: "bold",
    },

    // Selected button styles
    buttonSelected: {
      backgroundColor: "#ffffff",
    },
    buttonTitleTextSelected: {
      color: theme.authButtonText,
    },
    buttonDescTextSelected: {
      color: theme.authButtonText,
    },

    descContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      paddingHorizontal: 20,
      justifyContent: "center",
    },
  });
