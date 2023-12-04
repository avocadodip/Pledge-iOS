import { View, TouchableOpacity, Alert } from "react-native";
import React from "react";
import LockIcon from "../../assets/icons/lock-icon.svg";
import UnlockIcon from "../../assets/icons/unlock-icon.svg";
import { getTodoStyles } from "./TodoStyles";
import TouchableRipple from "../TouchableRipple";
import { useThemes } from "../../hooks/ThemesContext";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import { doc, getDoc, increment, runTransaction, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { useSettings } from "../../hooks/SettingsContext";

const RenderTmrwLock = ({ isLocked, todoNumber }) => {
  const { theme } = useThemes();
  const styles = getTodoStyles(theme);
  const { setIsBottomSheetOpen } = useBottomSheet();
  const {
    currentUserID,
    settings: { tmrwTodos },
    timeStatus
  } = useSettings();

  // Show alert and open bottom sheet
  const showMissingFieldAlert = (missingField) => {
    let message;
    if (missingField === "title") {
      message = "Fill in a name for the task to lock it!";
    } else if (missingField === "amount") {
      message = "Fill in a pledge amount to lock the task!";
    }
    Alert.alert(
      "Missing fields",
      message,
      [{ text: "OK", onPress: () => setIsBottomSheetOpen(true) }],
      { cancelable: true }
    );
  };

  // When right side lock pressed
  const handleLockTodo = async (todoNumber) => {
    const todoToLock = tmrwTodos[todoNumber - 1];
    const { title, description, tag, amount } = todoToLock;

    // Validate title & amount fields
    if (title == "") {
      showMissingFieldAlert("title");
      return;
    }
    let formattedAmount = parseFloat(amount);

    // If (amount > 0 && todo has tag), add amount to dream
    if (formattedAmount > 0 && tag !== "") {
      try {
        const dreamRef = doc(db, "users", currentUserID, "dreams", tag);

        const payload = {
          amountPledged: increment(formattedAmount),
        };
        await updateDoc(dreamRef, payload);
      } catch (error) {
        console.error("Update failed:", error);
      }
    }

    // Format new todo
    const newTodo = {
      title: title,
      description: description,
      tag: tag,
      amount: formattedAmount,
      isComplete: false,
      isLocked: true,
      todoNumber: todoNumber,
    };

    const todoRef = doc(db, "users", currentUserID);
    const docSnap = await getDoc(todoRef);

    // Update database
    if (docSnap.exists()) {
      let data = docSnap.data();
      let tmrwTodos = data.tmrwTodos; // Access the 'todayTodos' field
      tmrwTodos[todoNumber - 1].isLocked = true; // Update the specific todo item
      await updateDoc(todoRef, { tmrwTodos: tmrwTodos });
    }
  };

  // Lock icon: Todo is locked
  // If time status == 2, make it disabled opacity
  if (isLocked === true) {
    return (
      <View
        style={[
          styles.rightContainer,
          { backgroundColor: theme.faintPrimary },
          timeStatus === 2 && styles.disabledOpacity,
        ]}
      >
        <View style={timeStatus === 2 ? styles.disabledOpacity : null}>
          <LockIcon color={theme.primary} />
        </View>
      </View>
    );
    // Unlock icon: Todo is NOT locked [should not show on time status == 2; instead show NumberTodo]
  } else {
    return (
      <TouchableOpacity
        style={styles.rightContainer}
        onPress={() => {
          handleLockTodo(todoNumber);
        }}
      >
        <UnlockIcon color={theme.primary} />
      </TouchableOpacity>
    );
  }
};

export default RenderTmrwLock;
