import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./TodoStyles";

const NumberTodo = ({ todoNumber, handleNewTodoPress }) => (
  <TouchableOpacity style={styles.numberContainer} onPress={handleNewTodoPress}>
    <Text style={styles.numberText}>{todoNumber}</Text>
  </TouchableOpacity>
);

export default NumberTodo;
