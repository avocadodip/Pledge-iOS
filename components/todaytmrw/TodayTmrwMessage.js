import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CircleRightArrow from "../../assets/icons/circle-right-arrow.svg";
import { useNavigation } from "@react-navigation/native";
import { useThemes } from "../../hooks/ThemesContext";
import { daysOfWeek } from "../../utils/currentDate";
import { useSettings } from "../../hooks/SettingsContext";

const TodayTmrwMessage = ({ type, setModalVisible, nextActiveDay }) => {
  const { theme } = useThemes();
  const { currentUserFirstName } = useSettings();
  const navigation = useNavigation();
  const styles = getStyles(theme);

  const nextActiveDayIndex = daysOfWeek.indexOf(nextActiveDay);
  const dayBeforeNextActiveDay = daysOfWeek[(nextActiveDayIndex - 1 + 7) % 7];

  const handleButtonPress = () => {
    // Navigate to the tomorrow page
    navigation.navigate("Tomorrow");
  };
  const renderMessage = () => {
    switch (type) {
      case "new user":
        return (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={styles.startButtonText}>
              Set up your first day of tasks
            </Text>
          </TouchableOpacity>
        );
      case "vacation":
        return (
          <View style={styles.container}>
            <Text style={styles.infoText}>Welcome, Josh.</Text>
            <Text style={styles.infoText}>You're on vacation.</Text>
            <TouchableOpacity
              style={styles.todoButton}
              onPress={() => {
                navigation.navigate("Settings");
              }}
            >
              <Text style={styles.startButtonText}>Turn off vacation mode</Text>
              <CircleRightArrow color={theme.textHigh} />
            </TouchableOpacity>
          </View>
        );
      case "rest day (today screen)":
        return (
          <View style={styles.container}>
            <Text style={styles.infoText}>Welcome, Josh.</Text>
            <Text style={styles.infoText}>It's your rest day.</Text>
            <TouchableOpacity
              style={styles.todoButton}
              onPress={handleButtonPress}
            >
              <Text style={styles.todoButtonText}> Add steps for </Text>
              <CircleRightArrow color={theme.textHigh} />
            </TouchableOpacity>
          </View>
        );
      case "rest day (tmrw screen)":
        return (
          <View style={styles.container}>
            <Text style={styles.infoText}>
              Welcome, {currentUserFirstName}.
            </Text>
            <Text style={styles.infoText}>You have a rest day tomorrow.</Text>
            <Text style={styles.subText}>
              Come back on {dayBeforeNextActiveDay} to lock in tasks for{" "}
              {nextActiveDay}.
            </Text>
          </View>
        );
      // When user selected tmrw option in onboarding (tmrw page is set; today should show "You're all set! Check in tomorrow.")
      case "all set":
        return (
          <View style={styles.container}>
            <Text style={styles.infoText}>You're all set!</Text>
            <Text style={styles.subText}>
              The tasks you've set will appear here tomorrow.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return renderMessage();
};

export default TodayTmrwMessage;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      width: "100%",
      height: 200,
      justifyContent: "center",
      alignItems: "center",
      gap: 28,
      borderRadius: 16,
      backgroundColor: theme.faintPrimary,
      padding: 15,
    },
    infoText: {
      color: theme.primary,
      fontSize: 18,
      fontWeight: "600",
    },
    subText: {
      color: theme.primary,
      fontSize: 18,
      fontWeight: "400",
      lineHeight: 25,
      textAlign: "center",
    },

    startButton: {
      color: theme.primary,
      fontSize: 20,
      fontWeight: "600",
      backgroundColor: theme.faintPrimary,
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#4a4a4a",

      // Adding glow effect
      shadowColor: "#ffffff", // You can also use a different color for the glow
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5, 
      shadowRadius: 10, 
    },
    startButtonText: {
      color: theme.primary,
      fontWeight: 500,
      fontSize: 20,
    },

    todoButton: {
      flexDirection: "row",
      gap: 10,
      backgroundColor: theme.faintPrimary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 10,
      // borderWidth: 1,
      // borderColor: "black",
    },
  });
