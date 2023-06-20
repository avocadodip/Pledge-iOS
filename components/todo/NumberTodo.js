import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./TodoStyles";
import TouchableRipple from "../TouchableRipple";

const NumberTodo = ({ todoNumber, openBottomSheet, timeStatus }) => (
  // a) Shows disabled button if timeStatus == 0 (day has not started)
  // b) Shows pressable button if timeStatus == 1 (day has started)
  <TouchableRipple
    style={
      timeStatus === 0 ? styles.disabledNumberContainer : styles.numberContainer
    }
    onPress={timeStatus === 0 ? null : openBottomSheet}
  >
    <Text style={styles.numberText}>{todoNumber}</Text>
  </TouchableRipple>
);

export default NumberTodo;
