import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../database/firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { getTodayAbbrevDOW, getTodayDate } from "../utils/currentDate";
import { useBottomSheet } from "./BottomSheetContext";
import { useSettings } from "./SettingsContext";
import { DayStatusContext, useDayStatus } from "./DayStatusContext";
import { useDayChange } from "./useDayChange";
import { is } from "date-fns/locale";

export const TodayTodosContext = createContext();

export const TodayTodosProvider = ({ children }) => {
  const [todayTodos, setTodayTodos] = useState([]);
  const {
    settings,
    currentUserID,
    settings: { isOnboarded },
  } = useSettings();
  const { setDayStart, setDayEnd, setTodayPageCompletedForTheDay } =
    useDayStatus();
  const { dayChanged } = useDayChange();
  const [todayDOWAbbrev, setTodayDOWAbbrev] = useState(getTodayAbbrevDOW());
  const [isTodayActiveDay, setIsTodayActiveDay] = useState(true);
  const [isTodayVacation, setIsTodayVacation] = useState(false);
  const [onboardStartTmrw, setOnboardStartTmrw] = useState(false); // Lets Today page know to show "all set" message if user elects to start Tmrw in onboarding
  const [isTodoArrayEmpty, setIsTodoArrayEmpty] = useState(true);

  // Keep track of amount of incomplete todos
  const [incompleteCount, setIncompleteCount] = useState(0);

  useEffect(() => {
    // Compute the number of action items left based on the conditions
    const computeActionItemsLeft = () => {
      if (
        todayTodos == [] ||
        todayTodos == [null, null, null] ||
        isTodoArrayEmpty ||
        // !isTodayVacation ||
        // isTodayActiveDay ||
        !isOnboarded
      ) {
        return 0;
      }

      // Count the number of todos that are not locked in yet
      return todayTodos.filter((todo) => todo !== null && !todo.isComplete).length;
    };

    // Set the state for actionItemsLeft
    setIncompleteCount(computeActionItemsLeft());
  }, [todayTodos]);

  // In your useEffect call
  useEffect(() => {
    if (currentUserID) {
      getAndSetTodayTodos();
    }
    setTodayDOWAbbrev(getTodayAbbrevDOW());
  }, [dayChanged, currentUserID]);

  useEffect(() => {
    // If all todos are complete, tell dayStatus that today page is complete for the day
    let nonNullTodos = todayTodos && todayTodos.filter((todo) => todo != null);
    let allCompleted =
      nonNullTodos && nonNullTodos.every((todo) => todo.isComplete === true);

    if (allCompleted) {
      setTodayPageCompletedForTheDay(true);
    } else {
      setTodayPageCompletedForTheDay(false);
    }
  }, [todayTodos, settings]);

  // Function to fetch todos and set global todayTodos object
  const getAndSetTodayTodos = async () => {
    let fetchedTodos = [null, null, null];
    const todoRef = doc(db, "users", currentUserID, "todos", getTodayDate());

    const docSnapshot = await getDoc(todoRef);

    if (docSnapshot.exists()) {
      const {
        opensAt,
        closesAt,
        isActive,
        isVacation,
        todos,
        onboardStartTmrw,
      } = docSnapshot.data();

      setIsTodayActiveDay(isActive);
      setIsTodayVacation(isVacation);
      setDayStart(opensAt);
      setDayEnd(closesAt);
      setOnboardStartTmrw(onboardStartTmrw);

      if (todos) {
        fetchedTodos = todos;
      }
      setIsTodoArrayEmpty(false);
    } else {
      setIsTodoArrayEmpty(true);
    }

    setTodayTodos(fetchedTodos);
  };

  return (
    <TodayTodosContext.Provider
      value={{
        todayTodos,
        setTodayTodos,
        todayDOWAbbrev,
        isTodayActiveDay,
        isTodayVacation,
        isTodoArrayEmpty,
        onboardStartTmrw,
        getAndSetTodayTodos,
        setOnboardStartTmrw,
        incompleteCount,
      }}
    >
      {children}
    </TodayTodosContext.Provider>
  );
};

export const useTodayTodos = () => useContext(TodayTodosContext);
