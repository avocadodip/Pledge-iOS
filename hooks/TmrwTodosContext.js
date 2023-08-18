import { createContext, useState, useEffect, useContext } from "react";
import { db } from "../database/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import {
  getNextActiveDay,
  getTmrwAbbrevDOW,
  getTmrwDOW,
  getTmrwDate,
} from "../utils/currentDate";
import { useSettings } from "./SettingsContext";
import { useDayChange } from "./useDayChange";

export const TmrwTodosContext = createContext();

// Sets tmrwTodos, tmrwDOWAbbrev, nextActiveDay
export const TmrwTodosProvider = ({ children }) => {
  const {
    settings: { daysActive },
    currentUserID,
  } = useSettings();
  const { dayChanged } = useDayChange();
  const [tmrwTodos, setTmrwTodos] = useState([]);
  const [tmrwDOWAbbrev, setTmrwDOWAbbrev] = useState(getTmrwAbbrevDOW());
  const [isTmrwActiveDay, setIsTmrwActiveDay] = useState(
    daysActive[getTmrwDOW()]
  );

  const [nextActiveDay, setNextActiveDay] = useState(
    getNextActiveDay(getTmrwDOW(), daysActive)
  );

  const [isTodoArrayEmpty, setIsTodoArrayEmpty] = useState(true);
  const [tmrwPageCompletedForTheDay, setTmrwPageCompletedForTheDay] =
    useState(false);

  // Re-run when it hits 12am or daysActive changes
  useEffect(() => {
    let unsubscribe; // Declare a variable to hold the unsubscribe function

    if (currentUserID) {
      // 1. Get and sets todos to global tmrwTodos variable
      unsubscribe = getAndSetTodos(); // Assign the returned value (unsubscribe function) from getAndSetTodos
    }

    // Set whether tmrw is active, to be returned
    setIsTmrwActiveDay(daysActive[getTmrwDOW()]);

    // Set DOW of next active day, to be returned
    setNextActiveDay(getNextActiveDay(getTmrwDOW(), daysActive));

    // Set tmrw's abbrev day of week, to be returned
    setTmrwDOWAbbrev(getTmrwAbbrevDOW());

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Call the unsubscribe function when the component is unmounted or dependencies change
      }
    };
  }, [dayChanged, currentUserID]);

  // Second useEffect hook for daysActive
  useEffect(() => {
    console.log(daysActive);
    setIsTmrwActiveDay(daysActive[getTmrwDOW()]);
    setNextActiveDay(getNextActiveDay(getTmrwDOW(), daysActive));
  }, [daysActive]);

  // 1.
  const getAndSetTodos = () => {
    const fetchedTodos = [null, null, null];
    const todoRef = doc(db, "users", currentUserID, "todos", getTmrwDate());

    // Declare a flag to ensure code only executes once
    let firstRun = true;

    // Listen to changes to the document using onSnapshot
    const unsubscribe = onSnapshot(todoRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const { isActive, isVacation, todos } = data;

        // If it's the first run, set the todos accordingly
        if (firstRun) {
          setIsTmrwActiveDay(isActive);
          if (todos) {
            for (let i = 0; i < todos.length; i++) {
              fetchedTodos[todos[i].todoNumber - 1] = todos[i];
            }
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
              // If any todo has non-empty title, description, or amount, set isTodoArrayEmpty to false
              if (
                fetchedTodos[i].title !== "" ||
                fetchedTodos[i].description !== "" ||
                fetchedTodos[i].amount !== ""
              ) {
                setIsTodoArrayEmpty(false);
              }
            }
          }

          // Set state
          setTmrwTodos(fetchedTodos);

          firstRun = false;
        }

        // If all todos are locked, and there are exactly 3 of them, tell dayStatus that tmrw page is complete for the day
        console.log(todos.length);
        let allLocked =
          todos &&
          todos.length === 3 &&
          todos.every((todo) => todo.isLocked === true);
        console.log(allLocked);
        if (allLocked) {
          setTmrwPageCompletedForTheDay(true);
        } else {
          setTmrwPageCompletedForTheDay(false);
        }
      } else {
        console.log("Todo document does not exist.");
        setTmrwTodos([]);
        setIsTodoArrayEmpty(true);
      }
    });

    return unsubscribe;
  };

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
    <TmrwTodosContext.Provider
      value={{
        tmrwDOWAbbrev,
        isTmrwActiveDay,
        nextActiveDay,
        isTodoArrayEmpty,
        tmrwTodos,
        setTmrwTodos,
        updateTodo,
        tmrwPageCompletedForTheDay
      }}
    >
      {children}
    </TmrwTodosContext.Provider>
  );
};

export const useTmrwTodos = () => useContext(TmrwTodosContext);
