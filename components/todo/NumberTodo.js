import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./TodoStyles";
import TouchableRipple from "../TouchableRipple";

const NumberTodo = ({ todoNumber, handleNewTodoPress }) => (
  <TouchableRipple style={styles.numberContainer} onPress={handleNewTodoPress}>
    <Text style={styles.numberText}>{todoNumber}</Text>
  </TouchableRipple>
);

export default NumberTodo;
