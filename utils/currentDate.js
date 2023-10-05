// 1. getTodayDateTime()
// 2. getTodayDate()
// 3. getTmrwDate()
// 4. next9pm()
// 5. last9pm()
// 6. secondToLast9PM()
// 7. formatDayStart()
// 8. formatDayEnd()
 
import moment from 'moment-timezone';

export const getTimezoneAbbrev = (timezone) => {
  return moment.tz(timezone).format('z');
}

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

// 1 - returns "20221225214213" for December 25, 2022, at 9:42:13 PM
export const getTodayDateTime = () => {
  const now = new Date();
  const dateTime =
    now.getFullYear() +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    ("0" + now.getDate()).slice(-2) +
    ("0" + now.getHours()).slice(-2) +
    ("0" + now.getMinutes()).slice(-2) +
    ("0" + now.getSeconds()).slice(-2);
  return dateTime;
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
export const getYesterdayDate = () => {
  const todayDate = new Date();
  const yesterDate = new Date();
  yesterDate.setDate(todayDate.getDate() - 1);
  const dateTime =
    yesterDate.getFullYear() +
    ("0" + (yesterDate.getMonth() + 1)).slice(-2) +
    ("0" + yesterDate.getDate()).slice(-2);
  return dateTime;
};

// 5 - today.svelte
// given "10:00"(pm), returns timestamp of next @ 10pm (could be today or tmrw)
export const nextDayEnd = (dayEnd) => {
  // Add 12 to first two digits
  let hour = parseInt(dayEnd.substring(0, 2));
  hour += 12;
  let formattedDayEnd = hour + ":" + dayEnd.substring(2);

  const now = getTodayDateTime();
  let nextDateTime;
  // If it's earlier than 10pm, then next 10pm is today's 10pm. .slice gets hour
  if (now.slice(-8, -6) < 21) {
    nextDateTime = getTodayDate() + " @ " + formattedDayEnd + ":00";
  }
  // If it's later than 10pm, then next 10pm is tomorrow's 10pm
  else if (now.slice(-8, -6) >= 21) {
    nextDateTime = getTmrwDate() + " @ " + formattedDayEnd + ":00";
  }
  return nextDateTime;
};

// 6 - today.svelte
// Given "7:00"(am) [1st parameter], returns timestamp of the active task dayStart (could be today or tmrw)
export const currentOrNextDayStart = (dayStart, dayEnd) => {
  const now = getTodayDateTime();
  7;
  // Add '0' so we have "07:00"
  if (dayStart.length == 4) {
    dayStart = "0" + dayStart;
  }

  // Get 2 first digists of dayEnd and add 12
  let hour = parseInt(dayEnd.substring(0, 2));
  hour += 12;

  let nextDateTime;
  // If it's earlier than dayEnd, then day start is today's 7am. [].slice gets hour
  if (now.slice(-8, -6) < hour) {
    nextDateTime = getTodayDate() + " @ " + dayStart + ":00";
  }
  // If it's later than dayEnd, then day start is next day's 7am
  else if (now.slice(-8, -6) >= hour) {
    nextDateTime = getTmrwDate() + " @ " + dayStart + ":00";
  }
  return nextDateTime;
};

// 7 - tmrw.svelte
// return timestamp of last day start
export const lastDayStart = (dayStart) => {
  // Add '0' so we have "07:00"
  if (dayStart.length == 4) {
    dayStart = "0" + dayStart;
  }
  let lastDateTime;
  const now = getTodayDateTime();
  // If time is before 7:00am then dayStart date was yesterday
  if (now.slice(-8, -6) < dayStart) {
    lastDateTime = getYesterdayDate() + " @ " + dayStart + ":00";
    // If time is after 7:00am then dayStart date was today
  } else if (now.slice(-8, -6) >= dayStart) {
    lastDateTime = getTodayDate() + " @ " + dayStart + ":00";
  }
  return lastDateTime;
};

// 8 - tmrw.svelte & stats.svelte
// Given "9:00"(pm), returns timestamp of yesterday or today's @ day end
export const lastDayEnd = (dayEnd) => {
  const now = new Date();
  let dateTime;

  // Add 12 to first two digits of dayEnd
  let hour = parseInt(dayEnd.substring(0, 2));
  hour += 12;
  let formattedDayEnd = hour + ":" + dayEnd.substring(2);

  // If it's earlier than 9pm, then our range is from yesterday 9pm to now
  if (now.getHours() < hour) {
    dateTime =
      ("0" + (now.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + (now.getDate() - 1)).slice(-2) +
      "/" +
      now.getFullYear() +
      " @ " +
      formattedDayEnd +
      ":00";
  }
  // If it's later than 9pm, then our range is from today 9pm to now
  else if (now.getHours() >= hour) {
    dateTime =
      ("0" + (now.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + now.getDate()).slice(-2) +
      "/" +
      now.getFullYear() +
      " @ " +
      formattedDayEnd +
      ":00";
  }
  return dateTime;
};

// Function to return the day of the week for the next time period
export const getDayOfNextPeriod = (dayStart, dayEnd) => {
  const now = new Date();

  // Format dayStart
  if (dayStart.length == 4) dayStart = "0" + dayStart;

  // Format dayEnd
  const militaryTimeHour = parseInt(dayEnd.split(":")[0]) + 12;
  dayEnd = militaryTimeHour + ":" + dayEnd.split(":")[1];

  // Get current time as HH:MM
  let nowHourMinute =
    ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);

  // Compare current time with dayStart and dayEnd
  if (nowHourMinute < dayStart || nowHourMinute >= dayEnd) {
    // If current time is before dayStart or after dayEnd, it's the same day
    return daysOfWeek[now.getDay()];
  } else {
    // If current time is within dayStart and dayEnd, it's the next day
    return daysOfWeek[(now.getDay() + 1) % 7];
  }
};

// 8 - used in stats.svelte to query failed/completed tasks (but not upcoming or in progress)
// Returns timestamp of second to last day end
// export const secondToLastDayEnd = (dayEnd) => {
// 	const now = new Date();
// 	let dateTime;

// 	// Format original String (add milliseconds; convert to military time)
// 	const militaryTimeHour = parseInt(originalString.split(':')[0]) + 12;
// 	const formattedTime = militaryTimeHour + ':' + originalString.split(':')[1] + ':00';

// 	// If it's earlier than 9pm, then our range is from two days ago 9pm to yesterday's 9pm
// 	if (now.getHours() < militaryTimeHour) {
// 		dateTime =
// 			('0' + (now.getMonth() + 1)).slice(-2) +
// 			'/' +
// 			('0' + (now.getDate() - 2)).slice(-2) +
// 			'/' +
// 			now.getFullYear() +
// 			' @ ' +
// 			formattedTime;
// 	}
// 	// If it's later than dayEnd, then our range is from yesterday's dayE to today's 9pm
// 	else if (now.getHours() >= militaryTimeHour) {
// 		dateTime =
// 			('0' + (now.getMonth() + 1)).slice(-2) +
// 			'/' +
// 			('0' + (now.getDate() - 1)).slice(-2) +
// 			'/' +
// 			now.getFullYear() +
// 			' @ ' +
// 			formattedTime;
// 	}
// 	return dateTime;
// };

// 9 - return 073000 for 7:30
export const formatDayStart = (originalString) => {
  // Add '0' to the start if we have "7:00" to make it "07:00"
  let formattedTime =
    originalString.length == 4 ? "0" + originalString : originalString;

  // Remove the colon
  formattedTime = formattedTime.replace(":", "") + "00";

  return formattedTime;
};

// 10 - used in TaskInput.svelte
// Input: "00:00" (PM)
// Output: "[17-23]00:00"
export const formatDayEnd = (originalString) => {
  // Format original String (add milliseconds; convert to military time)
  const militaryTimeHour = parseInt(originalString.split(":")[0]) + 12;
  const formattedTime =
    militaryTimeHour.toString().padStart(2, "0") +
    originalString.split(":")[1] +
    ":00";

  return formattedTime.replace(":", "");
};
