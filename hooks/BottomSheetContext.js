import React, { createContext, useContext, useState } from "react";
import { useSettings } from "./SettingsContext";

export const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
  const { settings: {todayTodos, tmrwTodos} } = useSettings();
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBottomSheetEditable, setIsBottomSheetEditable] = useState(false);

  // When todo pressed (screen = "today" or "tmrw")
  const openBottomSheet = (screen, todoNumber) => {
    if (screen === "tmrw") {
      setSelectedTodo(tmrwTodos[todoNumber - 1]);
      setIsBottomSheetEditable(!tmrwTodos[todoNumber - 1].isLocked);
    } else if (screen === "today") {
      setSelectedTodo(todayTodos[todoNumber - 1]);
      setIsBottomSheetEditable(false);
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
