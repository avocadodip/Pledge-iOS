import { useEffect, useState } from "react";
import { db } from "../database/firebase";
import { getDoc, doc } from "firebase/firestore";
import { getTodayAbbrevDOW, getTodayDate } from "../utils/currentDate";
import { useBottomSheet } from "./BottomSheetContext";
import { useSettings } from "./SettingsContext";

export const useTodayTodos = (dayChanged) => {
  const { setTodayTodos } = useBottomSheet();
  const { currentUserID } = useSettings();
  const [todayDOWAbbrev, setTodayDOWAbbrev] = useState(getTodayAbbrevDOW());
  const [isTodayActiveDay, setIsTodayActiveDay] = useState(true);

  // Re-run when it hits 12am
  useEffect(() => {
    getAndSetTodos(); 
    setTodayDOWAbbrev(getTodayAbbrevDOW());
  }, [dayChanged]);

  // Function to fetch todos and set global todayTodos object
  const getAndSetTodos = async () => {
    const fetchedTodos = [null, null, null];
    const todoRef = doc(db, "users", currentUserID, "todos", getTodayDate());

    try {
      const docSnapshot = await getDoc(todoRef);
      if (docSnapshot.exists()) {
        const todoData = docSnapshot.data().todos;

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
    setTodayTodos(fetchedTodos);
  };

  return { todayDOWAbbrev, isTodayActiveDay };
};
