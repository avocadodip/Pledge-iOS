import { useEffect, useState } from "react";
import { getTmrwDate, getTodayDate } from "../utils/currentDate";

export const useDayChange = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday", 
  ];
  const todayIndex = new Date().getDay();
  const [todayDOWIndex, setTodayDOWIndex] = useState(todayIndex);
  const [todayDOW, setTodayDOW] = useState(daysOfWeek[todayIndex]);
  const [tmrwDOW, setTmrwDOW] = useState(daysOfWeek[(todayIndex + 1) % 7]);
  const [dayChanged, setDayChanged] = useState(false);

   const [todayDate, setTodayDate] = useState(getTodayDate());
   const [tmrwDate, setTmrwDate] = useState(getTmrwDate());

  const checkDayChange = () => {
    const now = new Date();
    const dayOfWeekI = now.getDay();
    if (dayOfWeekI !== todayDOWIndex) {
      setDayChanged(true);
      setTodayDOWIndex(dayOfWeekI);
      setTodayDOW(daysOfWeek[dayOfWeekI]);
      setTmrwDOW(daysOfWeek[(dayOfWeekI + 1) % 7]);
      setTodayDate(getTodayDate());
      setTmrwDate(getTmrwDate());
    } else {
      setDayChanged(false);
    }
  };

  useEffect(() => {
    const getTimeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      return midnight - now;
    };

    // Initial call to set correct values
    checkDayChange();

    // Schedule the first check at midnight
    const timeoutId = setTimeout(() => {
      checkDayChange();

      // Schedule repeated checks every 24 hours
      const intervalId = setInterval(checkDayChange, 24 * 60 * 60 * 1000);

      return () => clearInterval(intervalId);
    }, getTimeUntilMidnight());

    return () => clearTimeout(timeoutId);
  }, [todayDOWIndex]);

  return { todayDOWIndex, todayDOW, tmrwDOW, dayChanged, todayDate, tmrwDate };
};
