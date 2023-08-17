import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CircleRightArrow from "../../assets/icons/circle-right-arrow.svg";
import { useNavigation } from "@react-navigation/native";
import { useThemes } from "../../hooks/ThemesContext";
import { getTodoStyles, styles } from "../todo/TodoStyles";
import { daysOfWeek } from "../../utils/currentDate";

const TodayTmrwMessage = ({ type, setModalVisible, nextActiveDay }) => {
  const { theme } = useThemes();
  const navigation = useNavigation();
  const styles = getTodoStyles(theme);

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
            <Text style={styles.infoText}>You're on vacation.</Text>
            <TouchableOpacity
              style={styles.todoButton}
              onPress={() => {
                navigation.navigate("Settings");
              }}
            >
              <Text style={styles.todoButtonText}>Turn off vacation mode</Text>
              <CircleRightArrow color={theme.textHigh} />
            </TouchableOpacity>
          </>
        );
      case "rest day (today screen)":
        return (
          <>
            <Text style={styles.infoText}>Welcome, Josh.</Text>
            <Text style={styles.infoText}>It's your day off.</Text>
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
            <Text style={styles.infoText}>It's your day off.</Text>
            <Text style={styles.infoText}>
              Check back in on {dayBeforeNextActiveDay} to lock in tasks for{" "}
              {nextActiveDay}.
            </Text>

            <TouchableOpacity
              style={styles.todoButton}
              onPress={handleButtonPress}
            >
              <Text style={styles.todoButtonText}> Make an exception </Text>
              <CircleRightArrow color={theme.textHigh} />
            </TouchableOpacity>
          </>
        );
      // When user selected tmrw option in onboarding (tmrw page is set; today should show "You're all set! Check in tomorrow.")
      case "all set":
        return (
          <Text style={styles.infoText}>
            You're all set! The tasks you've set will appear here tomorrow.
          </Text>
        );
      default:
        return null;
    }
  };

  return <View style={styles.oneContainer}>{renderMessage()}</View>;
};

export default TodayTmrwMessage;

const getStyles = (theme) =>
  StyleSheet.create({
    startButton: {},
    startButtonText: {
      color: theme.primary,
      fontWeight: 500,
      fontSize: 20,
    },
  });
