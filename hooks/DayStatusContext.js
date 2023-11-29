import { createContext, useState, useEffect, useContext } from "react";
import { dayChanged } from "./useDayChange";
import { useSettings } from "./SettingsContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import { getTimeStatus } from "../utils/currentDate";

export const DayStatusContext = createContext();

export const DayStatusProvider = ({ children }) => {
  const [timeStatusBadge, setTimeStatusBadge] = useState("");
  const [todayPageCompletedForTheDay, setTodayPageCompletedForTheDay] =
    useState(false);
  const [tmrwPageCompletedForTheDay, setTmrwPageCompletedForTheDay] =
    useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);

  // Get user start and end times
  const {
    currentUserID,
    settings: { todayDayStart, todayDayEnd },
  } = useSettings();

  // Calculate time status
  const [timeStatus, setTimeStatus] = useState(getTimeStatus(todayDayStart, todayDayEnd));

  // Check if both pages are done --> day is complete
  useEffect(() => {
    // Define function to update firebase
    const updateDayAllActionItemsCompleted = async (completed) => {
      const userRef = doc(db, "users", currentUserID);

      try {
        await updateDoc(userRef, {
          todayAllSet: completed,
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    };

    const bool = todayPageCompletedForTheDay && tmrwPageCompletedForTheDay;
    setDayCompleted(bool);
    updateDayAllActionItemsCompleted(bool);
  }, [todayPageCompletedForTheDay, tmrwPageCompletedForTheDay]);

  // Update timeStatus every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStatus(getTimeStatus(todayDayStart, todayDayEnd));
    }, 1000);

    return () => clearInterval(timer);
  }, [todayDayStart, todayDayEnd]);

  // Change day status indicator text
  useEffect(() => {
    if (timeStatus === 0) {
      setTimeStatusBadge(`Opens @ ${todayDayStart} AM`);
    } else if (timeStatus === 1) {
      if (dayCompleted) {
        setTimeStatusBadge("You're done for today!");
      } else {
        setTimeStatusBadge(`Due @ ${todayDayEnd} PM`);
      }
    } else if (timeStatus === 2) {
      if (dayCompleted) {
        setTimeStatusBadge(randomDoneMessage);
      } else {
        setTimeStatusBadge(`Ended @ ${todayDayEnd} PM`);
      }
    } else {
      setTimeStatusBadge("");
    }
  }, [timeStatus, dayChanged, dayCompleted]);

  return (
    <DayStatusContext.Provider
      value={{
        timeStatusBadge,
        timeStatus,
        todayPageCompletedForTheDay,
        setTodayPageCompletedForTheDay,
        tmrwPageCompletedForTheDay,
        setTmrwPageCompletedForTheDay,
        dayCompleted,
      }}
    >
      {children}
    </DayStatusContext.Provider>
  );
};

export const useDayStatus = () => useContext(DayStatusContext);
