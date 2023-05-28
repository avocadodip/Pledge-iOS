import { useState, useEffect } from "react";
import {
  getDayOfNextPeriod,
  getNextActiveDay,
  daysOfWeek,
} from "../utils/currentDate";

export const useActiveDay = (dayStart, dayEnd, daysActive) => {
  const [nextDay, setNextDay] = useState("");
  const [isTmrwActiveDay, setIsTmrwActiveDay] = useState("");
  const [tmrwInactiveMessage, setTmrwInactiveMessage] = useState("");

  useEffect(() => {
    // Get day of next period and compare with settings to see if it's an active day
    const newNextDay = getDayOfNextPeriod(dayStart, dayEnd);
    setNextDay(newNextDay);

    // Tmrw Inactive message variables
    const nextActiveDay = getNextActiveDay(newNextDay, daysActive);
    setIsTmrwActiveDay(daysActive[newNextDay]);

    if (nextActiveDay == null) {
      setTmrwInactiveMessage(
        "Tomorrow is your rest day. (All days are rest days)"
      );
    } else {
      const checkBackDay =
        daysOfWeek[
          (daysOfWeek.indexOf(nextActiveDay) - 1 + daysOfWeek.length) %
            daysOfWeek.length
        ];
      setTmrwInactiveMessage(
        `Tomorrow is your rest day. Check back in on ${checkBackDay} evening to input todos for ${nextActiveDay}`
      );
    }
  }, [dayStart, dayEnd, daysActive]);

  return { nextDay, isTmrwActiveDay, tmrwInactiveMessage };
};
