import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../database/firebase";
import {
  formatDayEnd,
  formatDayStart,
  getTmrwDate,
  getTodayDateTime,
} from "../../utils/currentDate";
import { useSettings } from "../../hooks/SettingsContext";
import NumberTodo from "./NumberTodo";
import FinedTodo from "./FinedTodo";
import InfoTodo from "./InfoTodo";
import OnboardTodo from "./OnboardTodo";

const Todo = ({
  todoNumber,
  title,
  description,
  amount,
  tag,
  componentType,
  isLocked,
}) => {
  const [isTodoLocked, setIsTodoLocked] = useState(null);

  useEffect(() => {
    setIsTodoLocked(isLocked);
  }, [isLocked]);

  const {
    settings: { dayStart, dayEnd }, currentUserID
  } = useSettings();
  const {
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    setSelectedTodo,
    setIsBottomSheetEditable,
  } = useBottomSheet(); // To open bottom sheet when todo is pressed

  const handleOpenBottomSheet = () => {
    setSelectedTodo({
      todoNumber,
      title,
      description,
      amount,
      tag,
      isTodoLocked,
    });
    setIsBottomSheetOpen(true);
    if (isTodoLocked == null || isTodoLocked == true) {
      // (isLocked == null on today page)
      setIsBottomSheetEditable(false);
    } else setIsBottomSheetEditable(true);
  };

  const handleNewTodoPress = () => {
    setIsBottomSheetEditable(true);
    setIsBottomSheetOpen(true);
    console.log(isBottomSheetOpen);
    setSelectedTodo({
      todoNumber,
      title,
      description,
      amount,
      tag,
      isTodoLocked,
    });
  };

  const handleLockTodo = async () => {
    // Validation: missing fields
    if (title == "") {
      showMissingFieldAlert("title");
      return;
    }

    if (amount == "") {
      showMissingFieldAlert("amount");
      return;
    }

    // Convert string to float
    const floatAmount = parseFloat(amount);

    // Adds doc to 'todos' containing new task info
    const todosRef = collection(db, "users", currentUserID, "todos");
    await addDoc(todosRef, {
      title: title,
      description: description,
      tag: tag,
      amount: floatAmount,
      // set: currentSetNum,
      createdAt: getTodayDateTime(),
      opensAt: formatDayStart(dayStart),
      closesAt: formatDayEnd(dayEnd),
      dayActive: getTmrwDate(),
      isComplete: false,
      isLocked: true,
      todoNumber: todoNumber,
    });

    setIsTodoLocked(true);
  };

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

  // Render todo based on component type
  switch (componentType) {
    case "number":
      return (
        <NumberTodo
          todoNumber={todoNumber}
          handleNewTodoPress={handleNewTodoPress}
        />
      );
    case "fined":
      return <FinedTodo />;
    case "info":
      return (
        <InfoTodo
          todoNumber={todoNumber}
          title={title}
          description={description}
          amount={amount}
          tag={tag}
          isTodoLocked={isTodoLocked}
          handleOpenBottomSheet={handleOpenBottomSheet}
          handleLockTodo={handleLockTodo}
        />
      );
    case "onboard":
      return (
        <OnboardTodo
          todoNumber={todoNumber}
          isTodoLocked={isTodoLocked}
          handleLockTodo={handleLockTodo}
        />
      );
    default:
      return null;
  }
};

export default Todo;
