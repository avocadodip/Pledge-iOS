import { View, TouchableOpacity } from "react-native";
import React from "react";
import CheckIcon from "../../assets/icons/check-icon.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";
import UnlockIcon from "../../assets/icons/unlock-icon.svg";
import { styles } from "./TodoStyles";

const RenderLockStatus = ({
  isTodoLocked,
  isTodoComplete,
  handleLockTodo,
  handleCheckTodo,
  todoNumber,
  rightStyle
}) => {
  // Lock icon: Todo is locked
  if (isTodoLocked === true) {
    return (
      <View
        style={{
          ...styles.rightContainer,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <LockIcon />
      </View>
    );
    // Unlock icon: Todo is NOT locked
  } else if (isTodoLocked === false) {
    return (
      <TouchableOpacity style={styles.rightContainer} onPress={handleLockTodo}>
        <UnlockIcon />
      </TouchableOpacity>
    );
    // Check icon: Todo is complete
  } else if (isTodoComplete === true) {
    return (
      <TouchableOpacity
        style={styles.rightContainer}
        onPress={() => {
          handleCheckTodo(todoNumber, isTodoComplete);
        }}
      >
        <CheckIcon />
      </TouchableOpacity>
    );
    // Check icon: Todo is NOT complete
  } else if (isTodoComplete === false) {
    return (
      <TouchableOpacity
      style={[styles.rightContainer]}
      onPress={() => {
          handleCheckTodo(todoNumber, isTodoComplete);
        }}
      >
        <CheckIcon />
      </TouchableOpacity>
    );
  }
};

export default RenderLockStatus;
