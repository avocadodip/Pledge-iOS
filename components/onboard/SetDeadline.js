import { StyleSheet, Text, View } from "react-native";
import React from "react";
import NextButton from "./NextButton";
// import TmrwTimePicker from "../TmrwTimePicker";
import OnboardTimePicker from "./OnboardTimePicker";

const SetDeadline = () => {
  return (
    <View style={styles.promptContainer}>
      <View style={styles.lineContainer}>
        <Text style={styles.promptText}>Daily tasks will open at</Text>
        <OnboardTimePicker type={"AM"} />
      </View>

      <View style={styles.lineContainer}>
        <Text style={styles.promptText}>and close at</Text>
        <OnboardTimePicker type={"PM"} />
      </View>
    </View>
  );
};

export default SetDeadline;

const styles = StyleSheet.create({
  promptContainer: {
    backgroundColor: "#ffffff37",
    flexDirection: "column",
    // paddingHorizontal: 10,
    // paddingVertical: 6,
    borderRadius: 12,
    width: "100%",
    height: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 80,

  },
  lineContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",

    // borderColor: "black",
    // borderWidth: 1,
  },
  promptText: {
    color: "white",
    fontSize: 20,
    fontWeight: 600,
  },
});
