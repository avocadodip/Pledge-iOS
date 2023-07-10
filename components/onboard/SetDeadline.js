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
        <View style={styles.lineContainer}>
          <View style={styles.container}>
            <SunFilledIcon color={"white"} height={25} width={25} />
            <Text style={styles.promptText}>Start your day at</Text>
          </View>
          <OnboardTimePicker type={"AM"} />
        </View>
      </View>

      <View style={styles.promptContainer}>
        <View style={styles.lineContainer}>
          <View style={styles.container}>
            <MoonIcon color={"white"} height={25} width={25} />
            <Text style={styles.promptText}>End your day at</Text>
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
    flexDirection: "column",
    // paddingHorizontal: 10,
    // paddingVertical: 6,
    borderRadius: 12,
    width: "100%",
    height: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,

    borderColor: "black",
    borderWidth: 1,  
  },
  lineContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",

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
    fontSize: 20,
    fontWeight: 600,
  },
});
