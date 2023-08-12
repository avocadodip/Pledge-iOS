import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import XMarkIcon from "../../assets/icons/x-mark.svg";
import CheckIcon from "../../assets/icons/check.svg";
import ClockIcon from "../../assets/icons/clock.svg";



const StatsItem= ({title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "col",
    alignItems: "center",
    width: "100%",
    height: 150,
    justifyContent: "space-between",
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  dateText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  taskContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginRight: 0,
  },
});

export default StatsItem;
