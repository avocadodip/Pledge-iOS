import React, { createContext, useContext, useState } from "react";

export const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <BottomSheetContext.Provider
      value={{
        selectedTodo,
        setSelectedTodo,
        isBottomSheetOpen,
        setIsBottomSheetOpen,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
