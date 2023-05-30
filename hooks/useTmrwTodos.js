import { useState, useEffect } from "react";
import { db } from "../database/firebase";
import { query, collection, where, getDoc, doc } from "firebase/firestore";
import {
  getTmrwDate,
  getTodayDateTime,
  lastDayEnd,
  lastDayStart,
  withinTimeWindow,
} from "../utils/currentDate";
import { useBottomSheet } from "./BottomSheetContext";
import { useSettings } from "./SettingsContext";

export const useTmrwTodos = (isDay, dayStart, dayEnd) => {
  const { setTmrwTodos } = useBottomSheet();
  const [headerMessage, setHeaderMessage] = useState("");
  const { currentUserID } = useSettings();

  useEffect(() => {
    const fetchTodos = async () => {
      const fetchedTodos = [null, null, null];
      const todoRef = doc(db, "users", currentUserID, "todos", getTmrwDate());

      try {
        const docSnapshot = await getDoc(todoRef);
        if (docSnapshot.exists()) {
          const todoData = docSnapshot.data().todos;
          console.log("Todo data:", todoData);

          // Here we merge fetched todos with our predefined array
          // This will overwrite the empty slots with actual todo data
          for (let i = 0; i < todoData.length; i++) {
            fetchedTodos[todoData[i].todoNumber - 1] = todoData[i];
          }
        } else {
          console.log("Todo document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching todos: ", error);
      }

      // Fill in non-inputted todos with empty data
      for (let i = 0; i < 3; i++) {
        if (fetchedTodos[i] === null) {
          fetchedTodos[i] = {
            id: i,
            todoNumber: i + 1,
            title: "",
            description: "",
            amount: "",
            tag: "",
            isLocked: false,
          };
        }
      }

      // Set state
      setTmrwTodos(fetchedTodos);
    };

    fetchTodos();
  }, [isDay]);

  useEffect(() => {
    // SET HEADER MESSAGE
    if (withinTimeWindow(dayStart, dayEnd)) {
      setHeaderMessage("Locks @ " + dayEnd + " PM");
    } else {
      setHeaderMessage("Opens @ " + dayStart + " AM");
    }
  }, [isDay, dayStart, dayEnd]);

  return headerMessage;
};
