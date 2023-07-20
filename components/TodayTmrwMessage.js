import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CircleRightArrow from "../assets/icons/circle-right-arrow.svg";
import { useNavigation } from "@react-navigation/native";

const TodayTmrwMessage = ({ type, setModalVisible }) => {
  const navigation = useNavigation();

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
            <Text style={styles.infoText}>You're on vacation!</Text>
            <TouchableOpacity style={styles.todoButton}>
              <Text style={styles.todoButtonText}>Turn off vacation mode</Text>
              <CircleRightArrow />
            </TouchableOpacity>
          </>
        );
      case "rest day":
        return (
          <>
            <Text style={styles.infoText}>Welcome, Josh.</Text>
            <Text style={styles.infoText}>It's your day off!</Text>
            <TouchableOpacity
              style={styles.todoButton}
              onPress={handleButtonPress}
            >
              <Text style={styles.todoButtonText}> Add steps for </Text>
              <CircleRightArrow />
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

const styles = StyleSheet.create({
  startButton: {},
  startButtonText: {
    color: "white",
    fontWeight: 500,
    fontSize: 20,
  },
});
