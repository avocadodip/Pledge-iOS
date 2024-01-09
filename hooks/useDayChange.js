// This file simply starts a function that runs every second and exports the updated current time in various formats. e.g. "Monday", "Mon.", "112623" (or Nov 26, 2023), etc.
import { useEffect, useState } from "react";
import {
  abbreviateMonth,
  getFormattedDate,
  getTmrwAbbrevDOW,
  getTmrwDate,
  getTodayAbbrevDOW,
  getTodayDate,
} from "../utils/currentDate";
import { DAYS_OF_WEEK } from "../constants";

export const useDayChange = () => {
  const todayIndex = new Date().getDay();
  const [todayDOWIndex, setTodayDOWIndex] = useState(todayIndex);
  const [todayDOW, setTodayDOW] = useState(DAYS_OF_WEEK[todayIndex]);
  const [todayDOWAbbrev, setTodayDOWAbbrev] = useState(getTodayAbbrevDOW());
  const [tmrwDOWAbbrev, setTmrwDOWAbbrev] = useState(getTmrwAbbrevDOW());

  const [tmrwDOW, setTmrwDOW] = useState(DAYS_OF_WEEK[(todayIndex + 1) % 7]);
  const [dayChanged, setDayChanged] = useState(false);

  const [todayDate, setTodayDate] = useState(getTodayDate()); // 20240108
  const [tmrwDate, setTmrwDate] = useState(getTmrwDate());
  const [todayDateNameAbbrev, setTodayDateNameAbbrev] = useState(abbreviateMonth(getFormattedDate(new Date())));
  const tmrwForInitialState = new Date();
  tmrwForInitialState.setDate(tmrwForInitialState.getDate() + 1);
  const [tmrwDateName, setTmrwDateName] = useState(getFormattedDate(tmrwForInitialState)); // July 24
  const [tmrwDateNameAbbrev, setTmrwDateNameAbbrev] = useState(abbreviateMonth(getFormattedDate(tmrwForInitialState)));

  const checkDayChange = () => {
    const now = new Date();
    const dayOfWeekI = now.getDay();
    if (dayOfWeekI !== todayDOWIndex) {
      setDayChanged(true);
      setTodayDOWIndex(dayOfWeekI);
      setTodayDOW(DAYS_OF_WEEK[dayOfWeekI]);
      setTodayDOWAbbrev(getTodayAbbrevDOW())
      setTmrwDOWAbbrev(getTmrwAbbrevDOW());
      setTmrwDOW(DAYS_OF_WEEK[(dayOfWeekI + 1) % 7]);
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
    todayDateNameAbbrev,
    tmrwDateNameAbbrev
  };
};
