import { useEffect, useState } from "react";
import { db } from "../database/firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
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
  const [isTodoArrayEmpty, setIsTodoArrayEmpty] = useState(true);

  // In your useEffect call
  useEffect(() => {
    let unsubscribe;

    if (currentUserID) {
      // Call getAndSetTodos and hold on to the unsubscribe function it returns.
      unsubscribe = getAndSetTodos();
    }

    setTodayDOWAbbrev(getTodayAbbrevDOW());

    // Unsubscribe from document changes when the component unmounts.
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dayChanged, currentUserID]);

  // Function to fetch todos and set global todayTodos object
  const getAndSetTodos = () => {
    const fetchedTodos = [null, null, null];
    const todoRef = doc(db, "users", currentUserID, "todos", getTodayDate());

    // The onSnapshot function triggers every time the data changes, including when it's initially loaded.
    const unsubscribe = onSnapshot(todoRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const { opensAt, closesAt, isActive, isVacation, todos } =
          docSnapshot.data();

        setIsTodayActiveDay(isActive);
        setIsTodayVacation(isVacation);
        setDayStart(opensAt);
        setDayEnd(closesAt);

        if (todos) {
          for (let i = 0; i < todos.length; i++) {
            fetchedTodos[todos[i].todoNumber - 1] = todos[i];
          }
        }
      } else {
        console.log("Todo document does not exist.");
        setTodayTodos([]);
        setIsTodoArrayEmpty(true);
      }

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
        } else {
          if (
            fetchedTodos[i].title !== "" ||
            fetchedTodos[i].description !== "" ||
            fetchedTodos[i].amount !== ""
          ) {
            setIsTodoArrayEmpty(false);
          }
        }
      }

      setTodayTodos(fetchedTodos);
    });

    // Return the unsubscribe function to ensure we unsubscribe from document changes when the component unmounts.
    return unsubscribe;
  };

  return {
    todayDOWAbbrev,
    dayStart,
    dayEnd,
    isTodayActiveDay,
    isTodayVacation,
    isTodoArrayEmpty,
  };
};
