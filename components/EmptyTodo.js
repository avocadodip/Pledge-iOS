import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EmptyTodo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.noTaskText}>No task entered.</Text>
      <Text style={styles.amountText}>-$1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "col",
    width: "100%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    borderRadius: 16,
    backgroundColor: "linear-gradient(0deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16)), linear-gradient(102.27deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)",
    padding: 15,
  },
  noTaskText: {
    color: "white",
    opacity: 0.7,
    fontSize: 22,
    fontWeight: "bold",
  },
  amountText: {
    color: "white",
    opacity: 0.7,
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default EmptyTodo;