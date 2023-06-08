import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./TodoStyles";
import CircleRightArrow from "../../assets/icons/circle-right-arrow.svg";
import { useSettings } from "../../hooks/SettingsContext";
import { useActiveDay } from "../../hooks/useActiveDay";
import { useNavigation } from "@react-navigation/native";

const DaysOffTodo = () => {
    const { dayStart, dayEnd, vacationModeOn, daysActive } = useSettings().settings;

    const { nextDay, isTmrwActiveDay, tmrwInactiveMessage } = useActiveDay(
      dayStart,
      dayEnd,
      daysActive
    );

    const navigation = useNavigation();

    const handleButtonPress = () => {
      // Navigate to the tomorrow page
      navigation.navigate("Tomorrow");
    };

  return (
    <View style={styles.oneContainer}>
      <Text style={styles.infoText}>Welcome, Josh.</Text>
      <Text style={styles.infoText}>It's your day off!</Text>
      <TouchableOpacity style={styles.todoButton} onPress={handleButtonPress}>
        <Text style={styles.todoButtonText}> Add steps for {nextDay}</Text>
        <CircleRightArrow/>
      </TouchableOpacity>
    </View>
  );
};

export default DaysOffTodo;
