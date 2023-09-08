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
          <View style={styles.startButtonContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Text style={styles.startButtonText}>
                Start your first day of tasks
              </Text>
            </TouchableOpacity>
          </View>
        );
      case "vacation":
        return (
          <>
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
          </>
        );
      case "rest day (today screen)":
        return (
          <>
            <Text style={styles.infoText}>Welcome, Josh.</Text>
            <Text style={styles.infoText}>It's your rest day.</Text>
            <TouchableOpacity
              style={styles.todoButton}
              onPress={handleButtonPress}
            >
              <Text style={styles.todoButtonText}> Add steps for </Text>
              <CircleRightArrow color={theme.textHigh} />
            </TouchableOpacity>
          </>
        );
      case "rest day (tmrw screen)":
        return (
          <>
            <Text style={styles.infoText}>
              Welcome, {currentUserFirstName}.
            </Text>
            <Text style={styles.infoText}>You have a rest day tomorrow.</Text>
            <Text style={styles.subText}>
              Come back on {dayBeforeNextActiveDay} to lock in tasks for{" "}
              {nextActiveDay}.
            </Text>
          </>
        );
      // When user selected tmrw option in onboarding (tmrw page is set; today should show "You're all set! Check in tomorrow.")
      case "all set":
        return (
          <>
            <Text style={styles.infoText}>You're all set!</Text>
            <Text style={styles.subText}>
              The tasks you've set will appear here tomorrow.
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderMessage()}</View>;
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

    startButton: {},
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
