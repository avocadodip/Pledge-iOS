import React, { createContext, useContext, useEffect, useState } from "react";

export const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBottomSheetEditable, setIsBottomSheetEditable] = useState(false);


  // looks through the array of todos, and when it finds a todo with the same todoNumber as the updated todo, it replaces that old todo with the updated one.
  const updateTodo = (updatedTodo) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.todoNumber === updatedTodo.todoNumber ? updatedTodo : todo
      );
      return updatedTodos;
    });
  };

  return (
    <BottomSheetContext.Provider
      value={{
        todos,
        setTodos,
        selectedTodo,
        setSelectedTodo,
        isBottomSheetOpen,
        setIsBottomSheetOpen,
        isBottomSheetEditable,
        setIsBottomSheetEditable,
        updateTodo,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
