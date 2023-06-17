import { useEffect, useState } from "react";
import { getTimeStatus } from "../utils/currentDate";

export const useDayStatus = (dayStart, dayEnd) => {
  const [timeStatus, setTimeStatus] = useState(getTimeStatus(dayStart, dayEnd));
  const [dayChanged, setDayChanged] = useState(false);
  const [tmrwHeaderSubtitleMessage, setTmrwHeaderSubtitleMessage] =
    useState("");
  const [todayHeaderSubtitleMessage, setTodayHeaderSubtitleMessage] =
    useState("");
 
  // Set dayChanged to true if new day and update timeStatus
  useEffect(() => {
    const checkDayChange = () => {
      const now = new Date();
      const currentDay = now.getDate();
      const isNewDay = dayChanged !== currentDay;
      setDayChanged(isNewDay); // true if day changes

      setTimeStatus(getTimeStatus(dayStart, dayEnd));
    };

    // initial call to set the correct values
    checkDayChange();

    // check day change every second
    const timerId = setInterval(checkDayChange, 1000);

    // cleanup on component unmount
    return () => clearInterval(timerId);
  }, [dayStart, dayEnd, dayChanged]);

  useEffect(() => {
    // Change message when timeStatus or dayChanged changes
    switch (timeStatus) {
      case 0:
        setTmrwHeaderSubtitleMessage(`Opens @ ${dayStart} AM`);
        setTodayHeaderSubtitleMessage(`Opens @ ${dayStart} AM`);
        break;
      case 1:
        setTmrwHeaderSubtitleMessage(`Locks @ ${dayEnd} PM`);
        setTodayHeaderSubtitleMessage(`Ends @ ${dayEnd} PM`);
        break;
      case 2:
        setTmrwHeaderSubtitleMessage(`Locked @ ${dayEnd} PM`);
        setTodayHeaderSubtitleMessage(`Ended @ ${dayEnd} PM`);
        break;
        default:
          setTmrwHeaderSubtitleMessage("");
          setTodayHeaderSubtitleMessage("");
    }
  }, [timeStatus, dayChanged]);

  return { todayHeaderSubtitleMessage, tmrwHeaderSubtitleMessage, timeStatus, dayChanged };
};
