import React, { createContext, useContext, useEffect, useState } from "react";
import { useTmrwTodos } from "./TmrwTodosContext";

export const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
  const [todayTodos, setTodayTodos] = useState([]);
  const { tmrwTodos } = useTmrwTodos();
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBottomSheetEditable, setIsBottomSheetEditable] = useState(false);

  // When todo pressed (screen = "today" or "tmrw")
  const openBottomSheet = (todoNumber) => {

    let todo = tmrwTodos[todoNumber-1];
    setSelectedTodo(todo);

    // Set sheet editable and open
    if (todo.isLocked == true) {
      setIsBottomSheetEditable(false);
    } else {
      setIsBottomSheetEditable(true);
    }

    setIsBottomSheetOpen(true);
  };

  return (
    <BottomSheetContext.Provider
      value={{
        todayTodos,
        setTodayTodos,
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
