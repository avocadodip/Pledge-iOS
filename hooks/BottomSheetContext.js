import React, { createContext, useContext, useState } from "react";
import { useTmrwTodos } from "./TmrwTodosContext";

export const BottomSheetContext = createContext(); 
 
export const BottomSheetProvider = ({ children }) => {

  const [todayTodos, setTodayTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(null);
  const [isBottomSheetEditable, setIsBottomSheetEditable] = useState(false);
 
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
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
