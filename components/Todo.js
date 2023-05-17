import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Todo = () => {
  return (
    <View style={styles.container}>
      <Text>Todo</Text>
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Add this line
    paddingHorizontal: wp("3%"),
    marginVertical: hp("2%"),
    width: wp("70%"), // Adjust the width percentage as needed
    height: hp("25%"),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: wp("4%"),
  },
  title: {
    flex: 1,
    fontSize: wp("6%"),
    fontWeight: "bold",
  },
});
