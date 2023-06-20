import { useEffect, useState } from "react";
import { db } from "../database/firebase";
import { getDoc, doc } from "firebase/firestore";
import {
  getNextActiveDay,
  getTmrwAbbrevDOW,
  getTmrwDOW,
  getTmrwDate,
} from "../utils/currentDate";
import { useBottomSheet } from "./BottomSheetContext";
import { useSettings } from "./SettingsContext";

// Sets tmrwTodos, tmrwDOWAbbrev, nextActiveDay
export const useTmrwTodos = (dayChanged, daysActive) => {
  const { setTmrwTodos } = useBottomSheet();
  const { currentUserID } = useSettings();
  const [tmrwDOWAbbrev, setTmrwDOWAbbrev] = useState(getTmrwAbbrevDOW());
  const [isTmrwActiveDay, setIsTmrwActiveDay] = useState(
    daysActive[getTmrwDOW()]
  );
  const [nextActiveDay, setNextActiveDay] = useState(
    getNextActiveDay(getTmrwDOW(), daysActive)
  );
  const [isTodoArrayEmpty, setIsTodoArrayEmpty] = useState(true);

  // Re-run when it hits 12am or daysActive changes
  useEffect(() => {
    // 1. Get and sets todos to global tmrwTodos variable
    getAndSetTodos();

    // Set whether tmrw is active, to be returned
    setIsTmrwActiveDay(daysActive[getTmrwDOW()]);

    // Set DOW of next active day, to be returned
    setNextActiveDay(getNextActiveDay(getTmrwDOW(), daysActive));

    // Set tmrw's abbrev day of week, to be returned
    setTmrwDOWAbbrev(getTmrwAbbrevDOW());
  }, [dayChanged]);

  // Second useEffect hook for daysActive
  useEffect(() => {
    setIsTmrwActiveDay(daysActive[getTmrwDOW()]);
    setNextActiveDay(getNextActiveDay(getTmrwDOW(), daysActive));
  }, [daysActive]);

  // 1.
  const getAndSetTodos = async () => {
    const fetchedTodos = [null, null, null];
    const todoRef = doc(db, "users", currentUserID, "todos", getTmrwDate());

    try {
      const docSnapshot = await getDoc(todoRef);
      if (docSnapshot.exists()) {
        const todoData = docSnapshot.data().todos;

        if (todoData) {
          for (let i = 0; i < todoData.length; i++) {
            fetchedTodos[todoData[i].todoNumber - 1] = todoData[i];
          }
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
          amount: "3",
          tag: "",
          isLocked: false,
        }; 
      } else {
        // If any todo has non-empty title, description or amount, set isTodoArrayEmpty to false
        if (
          fetchedTodos[i].title !== "" ||
          fetchedTodos[i].description !== "" ||
          fetchedTodos[i].amount !== ""
        ) {
          setIsTodoArrayEmpty(false);
        }
      }
    }
    console.log(fetchedTodos);
    // Set state
    setTmrwTodos(fetchedTodos);
  };

  return { tmrwDOWAbbrev, isTmrwActiveDay, nextActiveDay, isTodoArrayEmpty };
};
