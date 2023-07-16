import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useThemes } from "../../hooks/ThemesContext";

const SetStartDay = ({
  isTodayOption,
  timePickerText,
  startDay,
  setStartDay,
}) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.promptText}>
        I will complete{"\n"}my first day of tasks
      </Text>

      {/* Today Button */}
      {isTodayOption && (
        <TouchableOpacity
          style={[styles.button, startDay === "Today" && styles.buttonSelected]}
          onPress={() => setStartDay("Today")}
        >
          <Text
            style={[
              styles.buttonTitleText,
              startDay === "Today" && styles.buttonTitleTextSelected,
            ]}
          >
            Today
          </Text>
          <View style={styles.descContainer}>
            <Text
              style={[
                styles.buttonDescText,
                startDay === "Today" && styles.buttonDescTextSelected,
              ]}
            >
              Tasks must be completed by{" "}
            </Text>
            <Text
              style={[
                styles.buttonDescBoldText,
                startDay === "Today" && styles.buttonDescTextSelected,
              ]}
            >
              {timePickerText.end}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Tomorrow Button */}
      <TouchableOpacity
        style={[
          styles.button,
          startDay === "Tomorrow" && styles.buttonSelected,
        ]}
        onPress={() => setStartDay("Tomorrow")}
      >
        <Text
          style={[
            styles.buttonTitleText,
            startDay === "Tomorrow" && styles.buttonTitleTextSelected,
          ]}
        >
          Tomorrow
        </Text>
        <View style={styles.descContainer}>
          <Text
            style={[
              styles.buttonDescText,
              startDay === "Tomorrow" && styles.buttonDescTextSelected,
            ]}
          >
            Tasks must be completed by{" "}
          </Text>
          <Text
            style={[
              styles.buttonDescBoldText,
              startDay === "Tomorrow" && styles.buttonDescTextSelected,
            ]}
          >
            {timePickerText.end}, July 24
          </Text>
        </View>
      </TouchableOpacity>
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
      height: 120,
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
    buttonDescBoldText: {
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
      alignItems: "center",
    },
  });
