import { createContext, useState, useEffect, useContext } from "react";
import { db } from "../database/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
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
    settings, settings: { daysActive, vacationModeOn },
    currentUserID,
  } = useSettings();
  const { dayChanged } = useDayChange();
  const [tmrwTodos, setTmrwTodos] = useState([]);
  const [tmrwDOWAbbrev, setTmrwDOWAbbrev] = useState(getTmrwAbbrevDOW());
  const [isTmrwActiveDay, setIsTmrwActiveDay] = useState(false);
  const [noTmrwTodoLocked, setNoTmrwTodoLocked] = useState(false);

  const [nextActiveDay, setNextActiveDay] = useState(
    getNextActiveDay(getTmrwDOW(), daysActive)
  );

  useEffect(() => {
    console.log("settings changed");
  }, [settings]);

  const [isTodoArrayEmpty, setIsTodoArrayEmpty] = useState(true);
  const [tmrwPageCompletedForTheDay, setTmrwPageCompletedForTheDay] =
    useState(false);

  // Re-run when it hits 12am or daysActive changes
  useEffect(() => {
    if (currentUserID) {
      getAndSetTmrwTodos();
    }
    setIsTmrwActiveDay(daysActive[getTmrwDOW()]);
    setNextActiveDay(getNextActiveDay(getTmrwDOW(), daysActive));
    setTmrwDOWAbbrev(getTmrwAbbrevDOW());
  }, [dayChanged, currentUserID]);

  // Second useEffect hook for daysActive
  useEffect(() => {
    // setIsTmrwActiveDay(daysActive[getTmrwDOW()]);
    setNextActiveDay(getNextActiveDay(getTmrwDOW(), daysActive));
  }, [daysActive]);

  useEffect(() => {
    // If todo is locked, check if todo page is completed
    let allLocked =
      tmrwTodos &&
      tmrwTodos.filter((todo) => todo != null).length === 3 &&
      tmrwTodos.every((todo) => todo && todo.isLocked === true);

    // Check if there is at least one non-null item with isLocked true
    let noTmrwTodoLocked =
      tmrwTodos && !tmrwTodos.some((todo) => todo && todo.isLocked === true);
 
      console.log("4");
      console.log(noTmrwTodoLocked);

    if (allLocked || !isTmrwActiveDay || vacationModeOn) {
      setTmrwPageCompletedForTheDay(true);
    } else {
      setTmrwPageCompletedForTheDay(false);
    }

    // Set the state for noTmrwTodoLocked
    setNoTmrwTodoLocked(noTmrwTodoLocked);
  }, [tmrwTodos, settings]);

  // 1. Get tmrw day data
  const getAndSetTmrwTodos = async () => {
    let isActive;
    let fetchedTodos = [null, null, null];
    const todoRef = doc(db, "users", currentUserID, "todos", getTmrwDate());

    const docSnapshot = await getDoc(todoRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();

      const { isActive, isVacation, todos } = data;
      setIsTmrwActiveDay(isActive);

      if (todos) {
        fetchedTodos = todos;
      }
    } else {
      setIsTodoArrayEmpty(true);
    }

    setTmrwTodos(fetchedTodos);
  };

  // looks through the array of todos, and when it finds a todo with the same todoNumber as the updated todo, it replaces that old todo with the updated one. (used in bottom sheet)
  const updateTodo = (updatedTodo) => {
    setTmrwTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo, index) =>
        index + 1 === updatedTodo.todoNumber ? updatedTodo : todo
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
        tmrwPageCompletedForTheDay,
        noTmrwTodoLocked,
        getAndSetTmrwTodos,
        setIsTmrwActiveDay
      }}
    >
      {children}
    </TmrwTodosContext.Provider>
  );
};

export const useTmrwTodos = () => useContext(TmrwTodosContext);
