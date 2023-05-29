import { Text, View } from "react-native";
import React from "react";
import { styles } from "./TodoStyles";

const FinedTodo = () => {
  return (
    <View style={styles.finedContainer}>
      <Text style={styles.finedText}>No task entered.</Text>
      <Text style={styles.finedText}>-$1</Text>
    </View>
  );
};

export default FinedTodo;
