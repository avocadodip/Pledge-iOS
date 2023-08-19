import React, { createContext, useContext, useEffect, useState } from "react";
import { useTmrwTodos } from "./TmrwTodosContext";

export const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
  const { tmrwTodos } = useTmrwTodos();
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBottomSheetEditable, setIsBottomSheetEditable] = useState(false);

  // When todo pressed (screen = "today" or "tmrw")
  const openBottomSheet = (todoData, screen, todoNumber) => {
    // For tmrw screen:
    if (todoData == null && screen == "tmrw") {
      setSelectedTodo({
        todoNumber: todoNumber,
        title: "",
        description: "",
        amount: "",
        tag: "",
        isLocked: false,
      });
      setIsBottomSheetEditable(true);
    } else {
      setSelectedTodo(todoData);
      // Set sheet editable and open
      if (todoData.isLocked) {
        setIsBottomSheetEditable(false);
      } else {
        setIsBottomSheetEditable(true);
      }
    }

    setIsBottomSheetOpen(true);
  };

  return (
    <BottomSheetContext.Provider
      value={{
        selectedTodo,
        setSelectedTodo,
        isBottomSheetOpen,
        setIsBottomSheetOpen,
        isBottomSheetEditable,
        setIsBottomSheetEditable,
        openBottomSheet,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
