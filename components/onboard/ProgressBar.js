import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={200}
        borderWidth={0}
        color={"#ffffff"}
        unfilledColor={"#ffffff2f"}
      />
    </View>
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
