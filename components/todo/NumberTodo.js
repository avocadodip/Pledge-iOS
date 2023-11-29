import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
    timeStatus === 0 ? (
      <View style={[styles.numberContainer, styles.disabledOpacity]}>
        <Text style={styles.numberText}>{todoNumber}</Text>
      </View>
    ) : (
      <TouchableRipple
        style={styles.numberContainer}
        onPress={() => openBottomSheet("tmrw", todoNumber)}
      >
        <Text style={styles.numberText}>{todoNumber}</Text>
      </TouchableRipple>
    )
  );
};

export default NumberTodo;
