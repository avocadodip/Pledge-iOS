import { View, TouchableOpacity } from "react-native";
import React from "react";
import LockIcon from "../../assets/icons/lock-icon.svg";
import UnlockIcon from "../../assets/icons/unlock-icon.svg";
import { styles } from "./TodoStyles";
import TouchableRipple from "../TouchableRipple";

const RenderTmrwLock = ({ isLocked, handleLockTodo }) => {
  // Lock icon: Todo is locked
  if (isLocked === true) {
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
  } else {
    return (
      <TouchableRipple style={styles.rightContainer} onPress={handleLockTodo}>
        <UnlockIcon />
      </TouchableRipple>
    );
  }
};

export default RenderTmrwLock;
