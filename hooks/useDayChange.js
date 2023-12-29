// This file simply starts a function that runs every second and exports the updated current time in various formats. e.g. "Monday", "Mon.", "112623" (or Nov 26, 2023), etc.
import { useEffect, useState } from "react";
import {
  getBeginningOfWeek,
  getTmrwAbbrevDOW,
  getTmrwDate,
  getTodayAbbrevDOW,
  getTodayDate,
} from "../utils/currentDate";

const getFormattedDate = (date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const monthName = monthNames[monthIndex];

  return `${monthName} ${day}`;
};

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
  const [todayDOWAbbrev, setTodayDOWAbbrev] = useState(getTodayAbbrevDOW());
  const [tmrwDOWAbbrev, setTmrwDOWAbbrev] = useState(getTmrwAbbrevDOW());

  const [tmrwDOW, setTmrwDOW] = useState(daysOfWeek[(todayIndex + 1) % 7]);
  const [dayChanged, setDayChanged] = useState(false);

  const [todayDate, setTodayDate] = useState(getTodayDate());
  const [tmrwDate, setTmrwDate] = useState(getTmrwDate());
  const today = new Date();
  const tmrwForInitialState = new Date(today);
  tmrwForInitialState.setDate(today.getDate() + 1);
  const [tmrwDateName, setTmrwDateName] = useState(getFormattedDate(tmrwForInitialState)); // July 24

  const checkDayChange = () => {
    const now = new Date();
    const dayOfWeekI = now.getDay();
    if (dayOfWeekI !== todayDOWIndex) {
      setDayChanged(true);
      setTodayDOWIndex(dayOfWeekI);
      setTodayDOW(daysOfWeek[dayOfWeekI]);
      setTodayDOWAbbrev(getTodayAbbrevDOW())
      setTmrwDOWAbbrev(getTmrwAbbrevDOW());
      setTmrwDOW(daysOfWeek[(dayOfWeekI + 1) % 7]);
      setTodayDate(getTodayDate());
      setTmrwDate(getTmrwDate());
      const tmrw = new Date(now);
      tmrw.setDate(now.getDate() + 1); 
      setTmrwDateName(getFormattedDate(tmrw));
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

  return {
    todayDOWIndex,
    todayDOW,
    todayDOWAbbrev,
    tmrwDOWAbbrev,
    tmrwDOW,
    dayChanged,
    todayDate,
    tmrwDate,
    tmrwDateName,
  };
};
