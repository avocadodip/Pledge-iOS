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
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");
  const [isTodayActiveDay, setIsTodayActiveDay] = useState(true);
  const [isTodayVacation, setIsTodayVacation] = useState(false);

  // Re-run when it hits 12am
  useEffect(() => {
    getAndSetTodos(); 
    setTodayDOWAbbrev(getTodayAbbrevDOW());
  }, [dayChanged]);
 
  // Function to fetch todos and set global todayTodos object
  const getAndSetTodos = async () => {
    const fetchedTodos = [null, null, null];
    const todoRef = doc(db, "users", currentUserID, "todos", getTodayDate());
    const todayDoc = await getDoc(todoRef);

    if (todayDoc.exists()) {
      // Set data for export
      const { opensAt, closesAt, isActive, isVacation, todos } = todayDoc.data();
      setIsTodayActiveDay(isActive);
      setIsTodayVacation(isVacation); 
      setDayStart(opensAt);
      setDayEnd(closesAt);
      
      if (todos) {
        // Merge fetched todos with predefined array
        for (let i = 0; i < todos.length; i++) {
          fetchedTodos[todos[i].todoNumber - 1] = todos[i];
        }
      }
    } else {
      console.log("Todo document does not exist.");
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

  return { todayDOWAbbrev, dayStart, dayEnd, isTodayActiveDay, isTodayVacation };
};
