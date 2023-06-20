import React, { createContext, useContext, useState } from "react";

export const BottomSheetContext = createContext(); 

export const BottomSheetProvider = ({ children }) => {
  const [tmrwTodos, setTmrwTodos] = useState([]);
  const [todayTodos, setTodayTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(null);
  const [isBottomSheetEditable, setIsBottomSheetEditable] = useState(false);
 
  // looks through the array of todos, and when it finds a todo with the same todoNumber as the updated todo, it replaces that old todo with the updated one.
  const updateTodo = (updatedTodo) => {
    setTmrwTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.todoNumber === updatedTodo.todoNumber ? updatedTodo : todo
      );
      return updatedTodos;
    });
  };

  return ( 
    <BottomSheetContext.Provider
      value={{
        todayTodos,
        setTodayTodos,
        tmrwTodos,
        setTmrwTodos,
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
