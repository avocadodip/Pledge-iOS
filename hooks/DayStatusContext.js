import { createContext, useState, useEffect, useContext } from "react";
import { dayChanged } from "./useDayChange";
import { useSettings } from "./SettingsContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";

const getTimeStatus = (dayStart, dayEnd) => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const [startHours, startMinutes] = dayStart.split(":").map(Number);

  // convert endHours to 24-hour format if it's meant to be PM
  let [endHours, endMinutes] = dayEnd.split(":").map(Number);
  endHours = endHours < 12 ? endHours + 12 : endHours;

  if (
    currentHours < startHours ||
    (currentHours === startHours && currentMinutes < startMinutes)
  ) {
    return 0; // before day start
  } else if (
    currentHours < endHours ||
    (currentHours === endHours && currentMinutes < endMinutes)
  ) {
    return 1; // between day start and day end
  } else if (
    currentHours > endHours ||
    (currentHours === endHours && currentMinutes >= endMinutes)
  ) {
    return 2; // after day end
  }
};
 
export const DayStatusContext = createContext();

export const DayStatusProvider = ({ children }) => {
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");
  const [timeStatus, setTimeStatus] = useState(getTimeStatus(dayStart, dayEnd));
  const [tmrwHeaderSubtitleMessage, setTmrwHeaderSubtitleMessage] =
    useState("");
  const [todayHeaderSubtitleMessage, setTodayHeaderSubtitleMessage] =
    useState("");

  const [todayPageCompletedForTheDay, setTodayPageCompletedForTheDay] = useState(false);
  const [tmrwPageCompletedForTheDay, setTmrwPageCompletedForTheDay] = useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);

  const { currentUserID } = useSettings();


  const updateDayAllActionItemsCompleted = async (completed) => {
    const userRef = doc(db, "users", currentUserID);
  
    try {
      await updateDoc(userRef, {
        todayAllSet: completed
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const bool = todayPageCompletedForTheDay && tmrwPageCompletedForTheDay;
    setDayCompleted(bool);
    updateDayAllActionItemsCompleted(bool);

  }, [todayPageCompletedForTheDay, tmrwPageCompletedForTheDay]);


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStatus(getTimeStatus(dayStart, dayEnd));
    }, 1000);  // runs every second
  
    // Clear the interval when the component is unmounted
    return () => clearInterval(timer);
  }, [dayStart, dayEnd]);
  

  useEffect(() => {
    // Change message when timeStatus or dayChanged changes
    const doneMessages = ["You're done for today!"];
    // "Boom! Nailed it!", "Crushed it, as usual", 
    const randomDoneMessage = doneMessages[Math.floor(Math.random() * doneMessages.length)];

    switch (timeStatus) {
      case 0:
        setTmrwHeaderSubtitleMessage(`Opens @ ${dayStart} AM`);
        setTodayHeaderSubtitleMessage(`Opens @ ${dayStart} AM`);

        break;
      case 1:
        if (dayCompleted) {
          setTodayHeaderSubtitleMessage(randomDoneMessage);
        } else {
          setTmrwHeaderSubtitleMessage(`Due @ ${dayEnd} PM`);
          setTodayHeaderSubtitleMessage(`Due @ ${dayEnd} PM`);
        }
        break;
      case 2:
        if (dayCompleted) {
          setTodayHeaderSubtitleMessage(randomDoneMessage);
        } else {
          setTmrwHeaderSubtitleMessage(`Ended @ ${dayEnd} PM`);
          setTodayHeaderSubtitleMessage(`Ended @ ${dayEnd} PM`);
        }
        break;
      default:
        setTmrwHeaderSubtitleMessage("");
        setTodayHeaderSubtitleMessage("");
    }
  }, [timeStatus, dayChanged, dayStart, dayEnd, dayCompleted]);

  return ( 
    <DayStatusContext.Provider
      value={{
        todayHeaderSubtitleMessage,
        tmrwHeaderSubtitleMessage, 
        timeStatus,
        dayStart,
        setDayStart,
        dayEnd,
        setDayEnd,

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
