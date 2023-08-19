import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../database/firebase";
import {
  getTmrwDate,
  getTodayDate,
  getTodayDateTime,
} from "../../utils/currentDate";
import { useSettings } from "../../hooks/SettingsContext";
import NumberTodo from "./NumberTodo";
import FinedTodo from "./FinedTodo";
// import OnboardTodo from "./OnboardTodo";
import TodayTodo from "./TodayTodo";
import TmrwTodo from "./TmrwTodo";
import { addTodoItem } from "../../utils/firebaseUtils";

const Todo = ({
  todoData,
  todoNumber,
  title,
  description, 
  amount,
  tag,
  isLocked,
  isComplete,
  timeStatus,
  componentType,
}) => { 
  const [updatedIsLocked, setUpdatedIsLocked] = useState(null);
  const [isTodoComplete, setIsTodoComplete] = useState(null);
  const { currentUserID } = useSettings();
  const {
    setIsBottomSheetOpen,
    setSelectedTodo,
    isBottomSheetEditable,
    setIsBottomSheetEditable,
  } = useBottomSheet();

  useEffect(() => {
    setUpdatedIsLocked(isLocked);
    setIsTodoComplete(isComplete);
  }, [isLocked, isComplete]);



  // When right side lock pressed
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

    const newTodo = {
      title: title,
      description: description,
      tag: tag,
      amount: floatAmount,
      createdAt: getTodayDateTime(),
      isComplete: false,
      isLocked: true,
      todoNumber: todoNumber,
    };

    // Adds doc to 'todos' containing new task info for tomorrow
    addTodoItem(currentUserID, newTodo, getTmrwDate());

    // Update icon
    setUpdatedIsLocked(true);
  };

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

  // When right side check pressed (costs read + write)
  const handleCheckTodo = async (todoNumber, currentBoolean) => {
    const todoRef = doc(db, "users", currentUserID, "todos", getTodayDate());
    const docSnap = await getDoc(todoRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      let todos = data.todos;

      // Find the index of the todo to update
      let index = todos.findIndex((todo) => todo.todoNumber === todoNumber);
      todos[index].isComplete = !currentBoolean;

      // Update the document with the updated todos array
      await updateDoc(todoRef, {
        todos: todos,
      });
    } else {
      console.log("No such document!");
    }

    setIsTodoComplete(!currentBoolean);
  };

  // Render todo based on component type
  switch (componentType) {
    case "today":
      if (title === "") {
        return <FinedTodo />;
      } else {
        return (
          <TodayTodo
            todoNumber={todoNumber}
            title={title}
            description={description}
            amount={amount}
            tag={tag}
            isTodoComplete={isTodoComplete}
            handleCheckTodo={handleCheckTodo}
            timeStatus={timeStatus}
          />
        );
      }


    default:
      return null;
  }
};

export default Todo;
