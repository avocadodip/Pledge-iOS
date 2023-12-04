import moment from 'moment-timezone';
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export const getTimezoneAbbrev = (timezone) => {
  return moment.tz(timezone).format('z');
}

// Returns 0 if the current time is before dayStart; 1 if between dayStart & dayEnd; 2 if after dayEnd
export const getTimeStatus = (dayStart, dayEnd) => {
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


// In Dreams.js. 
export const formatDateDifference = (todayDate, lastCompleted) => {
  const lastCompletedDate = new Date(
    lastCompleted.slice(0, 4),
    lastCompleted.slice(4, 6) - 1,
    lastCompleted.slice(6, 8)
  );
  const today = new Date(
    todayDate.slice(0, 4),
    todayDate.slice(4, 6) - 1,
    todayDate.slice(6, 8)
  );

  const dayDiff = differenceInDays(today, lastCompletedDate);
  if (dayDiff === 0) {
    return "Today"
  }
  if (dayDiff <= 28) {
    return `${dayDiff}d ago`;
  }

  const monthDiff = differenceInMonths(today, lastCompletedDate);
  if (monthDiff <= 11) {
    return `${monthDiff}m ago`;
  }

  const yearDiff = differenceInYears(today, lastCompletedDate);
  return `${yearDiff}y ago`;
};

// Returns 20231001 if it's 20231005
export const getBeginningOfWeekDate = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek;
  const beginningOfWeek = new Date(now.setDate(diff));
  const year = beginningOfWeek.getFullYear();
  const month = beginningOfWeek.getMonth() + 1; // JavaScript months are 0-based
  const day = beginningOfWeek.getDate();
  return `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
};

// Array of week days
export const daysOfWeek = [
  "Sunday",
  "Monday", 
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const abbreviatedDaysOfWeek = [
  "Sun.",
  "Mon.",
  "Tues.",
  "Wed.",
  "Thurs.",
  "Fri.",
  "Sat.",
];

export const abbreviateDOW = (dayOfWeek) => {
  const abbreviations = {
    "Sunday": "Sun.",
    "Monday": "Mon.",
    "Tuesday": "Tues.",
    "Wednesday": "Wed.",
    "Thursday": "Thurs.",
    "Friday": "Fri.",
    "Saturday": "Sat.",
  };
  return abbreviations[dayOfWeek];
};

// "October 16" to "Oct. 16"
export const abbreviateMonth = (dateString) => {
  const monthAbbreviations = {
    "January": "Jan.",
    "February": "Feb.",
    "March": "Mar.",
    "April": "Apr.",
    "May": "May",
    "June": "Jun.",
    "July": "Jul.",
    "August": "Aug.",
    "September": "Sep.",
    "October": "Oct.",
    "November": "Nov.",
    "December": "Dec.",
  };
  const [month, day] = dateString.split(" ");
  return `${monthAbbreviations[month]} ${day}`;
};


export function getTodayDOW() {
  const currentDate = new Date();
  return daysOfWeek[currentDate.getDay()];
}

export const getTodayAbbrevDOW = () => {
  const currentDate = new Date();
  return abbreviatedDaysOfWeek[currentDate.getDay()];
};

export function getTmrwDOW() {
  const tmrwDate = new Date();
  tmrwDate.setDate(tmrwDate.getDate() + 1);
  return daysOfWeek[tmrwDate.getDay()];
}

export const getTmrwAbbrevDOW = () => {
  const currentDate = new Date();
  const tmrwDayIndex = (currentDate.getDay() + 1) % 7; // get tomorrow's day index, wrap around at the end of the week
  return abbreviatedDaysOfWeek[tmrwDayIndex];
};

// Helper function to get next active day
export const getNextActiveDay = (nextDay, days) => {
  let startChecking = false;

  for (let i = 0; i < daysOfWeek.length * 2; i++) {
    // loop twice to handle week cycle
    const day = daysOfWeek[i % daysOfWeek.length];

    if (day === nextDay) {
      startChecking = true; // start checking from the next day
    } else if (startChecking && days[day]) {
      return day; // return next 'true' day
    }
  }

  return null; // return null if no active day is found
};

// returns "20221225" if today is Dec 25, 2022
export const getTodayDate = () => {
  const now = new Date();
  const dateTime =
    now.getFullYear() +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    ("0" + now.getDate()).slice(-2);
  return dateTime;
};

// 3 - returns "20230101" if today is Dec 31, 2022
export const getTmrwDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return (
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0")
  );
};

// 3 - returns "20221231" if today is January 1, 2023
// export const getYesterdayDate = () => {
//   const todayDate = new Date();
//   const yesterDate = new Date();
//   yesterDate.setDate(todayDate.getDate() - 1);
//   const dateTime =
//     yesterDate.getFullYear() +
//     ("0" + (yesterDate.getMonth() + 1)).slice(-2) +
//     ("0" + yesterDate.getDate()).slice(-2);
//   return dateTime;
// };