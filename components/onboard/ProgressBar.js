import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const ProgressBar = ({ progress }) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={200}
        borderWidth={0}
        color={"#ffffff"}
        unfilledColor={"#ffffff2f"}
      />
    </Animated.View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    alignItems: "center",
    gap: 15,
  },
  text: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
  },
});
