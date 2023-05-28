import { useState, useEffect } from "react";
import { withinTimeWindow } from "../utils/currentDate";

export const useDayTimeStatus = (dayStart, dayEnd) => {
  const [isDay, setIsDay] = useState(withinTimeWindow(dayStart, dayEnd));

  useEffect(() => {
    const timerId = setInterval(() => {
      setIsDay(withinTimeWindow(dayStart, dayEnd));
    }, 1000);

    return () => clearInterval(timerId);
  }, [dayStart, dayEnd]);

  return isDay;
};