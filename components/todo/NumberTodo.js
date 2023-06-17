import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./TodoStyles";
import TouchableRipple from "../TouchableRipple";

const NumberTodo = ({ todoNumber, openBottomSheet }) => (
  <TouchableRipple style={styles.numberContainer} onPress={openBottomSheet}>
    <Text style={styles.numberText}>{todoNumber}</Text>
  </TouchableRipple>
);

export default NumberTodo;
