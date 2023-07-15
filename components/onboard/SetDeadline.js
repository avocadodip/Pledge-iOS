import { StyleSheet, Text, View } from "react-native";
import React from "react";
import NextButton from "./NextButton";
// import TmrwTimePicker from "../TmrwTimePicker";
import OnboardTimePicker from "./OnboardTimePicker";
import SunIcon from "../../assets/icons/sun-theme-icon.svg";
import SunFilledIcon from "../../assets/icons/sun-filled.svg";
import MoonIcon from "../../assets/icons/moon-icon.svg";

const SetDeadline = () => {
  return (
    <>
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>I will start my day at</Text>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <SunFilledIcon color={"white"} height={30} width={30} />
          </View>
          <OnboardTimePicker type={"AM"} />
        </View>
      </View>

      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>and end my day at</Text>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <MoonIcon color={"white"} height={25} width={25} />
          </View>

          <OnboardTimePicker type={"PM"} />
        </View>
      </View>
    </>
  );
};

export default SetDeadline;

const styles = StyleSheet.create({
  promptContainer: {
    flexDirection: "col",
    gap: 15,
    width: "100%",
    paddingVertical: 20,

    // borderColor: "black",
    // borderWidth: 1,
  },
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  promptText: {
    color: "white",
    fontSize: 26,
    fontWeight: 600,
  },
  iconContainer: {
    width: 35
  },
});
