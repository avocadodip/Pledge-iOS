import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { getTodoStyles, styles } from "./TodoStyles";
import TouchableRipple from "../TouchableRipple";
import { useThemes } from "../../hooks/ThemesContext";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import { useDayStatus } from "../../hooks/DayStatusContext";

const NumberTodo = ({ todoNumber }) => {
  const { theme } = useThemes();
  const { openBottomSheet } = useBottomSheet();
  const styles = getTodoStyles(theme);
  const { timeStatus } = useDayStatus();

  // a) Shows disabled button if timeStatus == 0 (day has not started)
  // b) Shows pressable button if timeStatus == 1 (day has started)
  return (
    <TouchableRipple
      style={
        timeStatus === 0
          ? styles.disabledNumberContainer
          : styles.numberContainer
      }
      onPress={timeStatus === 0 ? null : () => openBottomSheet(null, "tmrw", todoNumber)}
    >
      <Text style={styles.numberText}>{todoNumber}</Text>
    </TouchableRipple>
  );
};

export default NumberTodo;
