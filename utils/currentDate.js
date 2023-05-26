// 1. getTodayDateTime()
// 2. getTodayDate()
// 3. getTmrwDate()
// 4. next9pm()
// 5. last9pm()
// 6. secondToLast9PM()
// 7. formatDayStart()
// 8. formatDayEnd()

// 1 - returns "12/25/2022 @ 15:42:53"
export const getTodayDateTime = () => {
  const now = new Date();
  let hour;
  // Adds 0 before hours if it's less than 2 digits (ex. 9am originally gives 9; we want 09)
  if (now.getHours().length == 1) {
    hour = "0" + now.getHours();
  } else hour = now.getHours();
  const dateTime =
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + now.getDate()).slice(-2) +
    "/" +
    now.getFullYear() +
    " @ " +
    hour +
    ":" +
    ("0" + now.getMinutes()).slice(-2) +
    ":" +
    ("0" + now.getSeconds()).slice(-2);
  return dateTime;
};

// 2 - returns "12/25/2022"
export const getTodayDate = () => {
  const now = new Date();
  const dateTime =
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + now.getDate()).slice(-2) +
    "/" +
    now.getFullYear();
  return dateTime;
};

// 3 - returns "01/01/2023" if today is "12/31/2022"
export const getTmrwDate = () => {
  const todayDate = new Date();
  const tmrwDate = new Date();
  tmrwDate.setDate(todayDate.getDate() + 1);
  const dateTime =
    ("0" + (tmrwDate.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + tmrwDate.getDate()).slice(-2) +
    "/" +
    tmrwDate.getFullYear();
  return dateTime;
};

// 3 - returns "12/31/2023" if today is "01/01/2022"
export const getYesterdayDate = () => {
  const todayDate = new Date();
  const yesterDate = new Date();
  yesterDate.setDate(todayDate.getDate() - 1);
  const dateTime =
    ("0" + (yesterDate.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + yesterDate.getDate()).slice(-2) +
    "/" +
    yesterDate.getFullYear();
  return dateTime;
};

// 4 - today.svelte
// return true if current time is between dayStart and dayEnd
export const withinTimeWindow = (dayStart, dayEnd) => {
  let now = getTodayDateTime();

  if (dayStart.length == 4) dayStart = "0" + dayStart; // Format dayStart

  // Format dayEnd
  const militaryTimeHour = parseInt(dayEnd.split(":")[0]) + 12;
  dayEnd = militaryTimeHour + ":" + dayEnd.split(":")[1];

  let nowHourMinute = now.slice(-8, -3);
  // console.log("currentTime " + nowHourMinute + " | dayStart: " + dayStart  + " | dayEnd: " + dayEnd );
	// console.log("result " + nowHourMinute >= dayStart && nowHourMinute < dayEnd)
  if (nowHourMinute >= dayStart && nowHourMinute < dayEnd) {
    return true;
  } else return false;
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

// 9 - used in TaskInput.svelte
// Input: "[5-11]:00" (AM)
// Output: "[next day]/2022 @ [05-11]:00:00"
export const formatDayStart = (originalString) => {
  let formattedTime;
  // Add '0' so we have "07:00"
  if (originalString.length == 4) {
    formattedTime = "0" + originalString;
  }
  formattedTime += ":00";
  const dateTime = getTmrwDate() + " @ " + formattedTime;
  return dateTime;
};

// 10 - used in TaskInput.svelte
// Input: "00:00" (PM)
// Output: "[next day]/2022 @ [17-23]:00:00"
export const formatDayEnd = (originalString) => {
  // Format original String (add milliseconds; convert to military time)
  const militaryTimeHour = parseInt(originalString.split(":")[0]) + 12;
  const formattedTime =
    militaryTimeHour + ":" + originalString.split(":")[1] + ":00";

  const dateTime = getTmrwDate() + " @ " + formattedTime;

  return dateTime;
};
