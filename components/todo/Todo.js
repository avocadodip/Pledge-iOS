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
  formatDayEnd,
  formatDayStart,
  getTmrwDate,
  getTodayDate,
  getTodayDateTime,
} from "../../utils/currentDate";
import { useSettings } from "../../hooks/SettingsContext";
import NumberTodo from "./NumberTodo";
import FinedTodo from "./FinedTodo";
import InfoTodo from "./TodayTodo";
import OnboardTodo from "./OnboardTodo";
import TodayTodo from "./TodayTodo";
import TmrwTodo from "./TmrwTodo";

const Todo = ({
  todoNumber,
  title,
  description,
  amount,
  tag,
  componentType,
  isLocked,
  isComplete,
}) => {
  const [isTodoLocked, setIsTodoLocked] = useState(null);
  const [isTodoComplete, setIsTodoComplete] = useState(null);
  const {
    settings: { dayStart, dayEnd },
    currentUserID,
  } = useSettings();
  const {
    setIsBottomSheetOpen,
    setSelectedTodo,
    isBottomSheetEditable,
    setIsBottomSheetEditable,
  } = useBottomSheet();

  useEffect(() => {
    setIsTodoLocked(isLocked);
    setIsTodoComplete(isComplete);
  }, [isLocked, isComplete]);

  // When todo pressed
  const openBottomSheet = () => {
    // Set todo info for sheet
    setSelectedTodo({
      todoNumber,
      title,
      description,
      amount,
      tag,
      isTodoLocked,
    });
    // Set sheet editable and open
    if (isTodoLocked == null || isTodoLocked == true) {
      // (isLocked == null on today page)
      setIsBottomSheetEditable(false);
    } else {
      setIsBottomSheetEditable(true);
    }
    setIsBottomSheetOpen(true);
  };

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

    // Adds doc to 'todos' containing new task info
    const todosRef = doc(db, "users", currentUserID, "todos", getTmrwDate());

    runTransaction(db, async (transaction) => {
      const todoDoc = await transaction.get(todosRef);

      if (!todoDoc.exists()) {
        // If the document does not exist, create it
        transaction.set(todosRef, {
          todos: [newTodo],
          totalTodos: 1,
          totalFine: 0,
          opensAt: formatDayStart(dayStart),
          closesAt: formatDayEnd(dayEnd),
        });
      } else {
        // If the document exists, update it
        transaction.update(todosRef, {
          todos: arrayUnion(newTodo),
          totalTodos: increment(1),
          totalFine: 0,
          opensAt: formatDayStart(dayStart),
          closesAt: formatDayEnd(dayEnd),
        });
      }
    })
      .then(() => {
        console.log("Todo added successfully");
      })
      .catch((error) => {
        console.error("Error adding Todo: ", error);
      });

    // Update icon
    setIsTodoLocked(true);
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
    case "number":
      return (
        <NumberTodo
          todoNumber={todoNumber}
          openBottomSheet={openBottomSheet}
        />
      );
    case "fined":
      return <FinedTodo />;
    case "check":
      return (
        <TodayTodo
          todoNumber={todoNumber}
          title={title}
          description={description}
          amount={amount}
          tag={tag}
          isTodoComplete={isTodoComplete}
          handleOpenBottomSheet={openBottomSheet}
          handleCheckTodo={handleCheckTodo}
        />
      );
    case "lock":
      return (
        <TmrwTodo
          todoNumber={todoNumber}
          title={title}
          description={description}
          amount={amount}
          tag={tag}
          isTodoLocked={isTodoLocked}
          handleOpenBottomSheet={openBottomSheet}
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
