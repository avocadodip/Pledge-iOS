import { Alert, View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import CheckIcon from "../../assets/icons/check-icon.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";
import UnlockIcon from "../../assets/icons/unlock-icon.svg";
import { styles } from "./TodoStyles";

const RenderLockStatus = ({ isTodoLocked, handleLockTodo }) => {
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
  } else if (isTodoLocked === false) {
    return (
      <TouchableOpacity style={styles.rightContainer} onPress={handleLockTodo}>
        <UnlockIcon />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={styles.rightContainer}>
        <CheckIcon />
      </TouchableOpacity>
    );
  }
};

export default RenderLockStatus;
