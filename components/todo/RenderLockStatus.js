import { View, TouchableOpacity } from "react-native";
import React from "react";
import LockIcon from "../../assets/icons/lock-icon.svg";
import UnlockIcon from "../../assets/icons/unlock-icon.svg";
import { styles } from "./TodoStyles";
import Animated from "react-native-reanimated";
import TouchableRipple from "../TouchableRipple";

const RenderLockStatus = ({
  isTodoLocked,
  isTodoComplete,
  handleLockTodo,
  handleCheckTodo,
  todoNumber,
  rightStyle,
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
      <TouchableRipple style={styles.rightContainer} onPress={handleLockTodo}>
        <UnlockIcon />
      </TouchableRipple>
    );
    // Check icon: Todo is complete
  } else if (isTodoComplete === true) {
    return (
      <TouchableOpacity
        style={[styles.rightContainer, rightStyle]}
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
      <Animated.View style={[styles.rightContainer, rightStyle]}>
        <TouchableOpacity
        
          onPress={() => {
            handleCheckTodo(todoNumber, isTodoComplete);
          }}
        >
          <CheckIcon />
        </TouchableOpacity>
      </Animated.View>
    );
  }
};

export default RenderLockStatus;
