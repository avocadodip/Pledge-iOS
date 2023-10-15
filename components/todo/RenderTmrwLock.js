import { View, TouchableOpacity, Alert } from "react-native";
import React from "react";
import LockIcon from "../../assets/icons/lock-icon.svg";
import UnlockIcon from "../../assets/icons/unlock-icon.svg";
import { getTodoStyles } from "./TodoStyles";
import TouchableRipple from "../TouchableRipple";
import { useThemes } from "../../hooks/ThemesContext";
import { useTmrwTodos } from "../../hooks/TmrwTodosContext";
import { useDayStatus } from "../../hooks/DayStatusContext";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import { getTmrwDate, getTodayDateTime } from "../../utils/currentDate";
import { doc, increment, runTransaction } from "firebase/firestore";
import { db } from "../../database/firebase";
import { useSettings } from "../../hooks/SettingsContext";

const RenderTmrwLock = ({ isLocked, todoNumber }) => {
  const { theme } = useThemes();
  const styles = getTodoStyles(theme);
  const { tmrwTodos, setTmrwTodos } = useTmrwTodos();
  const { timeStatus } = useDayStatus();
  const { setIsBottomSheetOpen } = useBottomSheet();
  const { currentUserID } = useSettings();

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

    let formattedAmount;

    // Validate title & amount fields
    if (title == "") {
      showMissingFieldAlert("title");
      return;
    }

    formattedAmount = parseFloat(amount);

    // Format new todo
    const newTodo = {
      title: title,
      description: description,
      tag: tag,
      amount: formattedAmount,
      createdAt: getTodayDateTime(),
      isComplete: false,
      isLocked: true,
      todoNumber: todoNumber,
    };

    // Save to local array
    const updatedTodos = [...tmrwTodos];
    updatedTodos[todoNumber - 1] = newTodo;
    setTmrwTodos(updatedTodos);

    // Save local array database
    try {
      await runTransaction(db, async (transaction) => {
        const todosRef = doc(
          db,
          "users",
          currentUserID,
          "todos",
          getTmrwDate()
        );
        const todoDoc = await transaction.get(todosRef);

        if (!todoDoc.exists()) {
          // If the document does not exist, create it
          transaction.set(todosRef, {
            date: getTmrwDate(),
            dateName: `${
              [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ][parseInt(getTmrwDate().slice(4, 6), 10) - 1]
            } ${parseInt(getTmrwDate().slice(6, 8), 10)}`,
            todos: updatedTodos,
            totalTodos: 1,
            totalFine: 0,
            isActive: true,
            isVacation: false,
          });
        } else {
          // If the document exists, update it with only the fields you want to change
          const payload = {
            todos: updatedTodos,
            totalTodos: increment(1),
          };
          transaction.update(todosRef, payload);
        }
      });
    } catch (error) {
      console.error("Transaction failed:", error);
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
