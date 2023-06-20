import { useEffect, useState } from "react";

export const useDayChange = () => {
  const [dayChanged, setDayChanged] = useState(false);

  useEffect(() => {
    const checkDayChange = () => {
      const now = new Date();
      const currentDay = now.getDate();
      const isNewDay = dayChanged !== currentDay;
      setDayChanged(isNewDay); // true if day changes
    };

    // initial call to set the correct values
    checkDayChange();

    // check day change every second
    const timerId = setInterval(checkDayChange, 1000);

    // cleanup on component unmount
    return () => clearInterval(timerId);
  }, [dayChanged]);

  return { dayChanged };
};