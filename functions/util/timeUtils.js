/* eslint-disable */
const { moment } = require("../common");
const { formatDateRange } = require("./formatDateRange");


const getTimeDefinitions = (tz) => {
  // Defining times
  const now = moment().tz(tz);
  const todayFormatted = now.format("YYYYMMDD");
  const todayDateName = now.format("MMM D");

  // const todayDOW = now.format("dddd");
  // Next day (for notifications - we pull isActive & closesAt and set to user settings doc)
  const nextDay = now.clone().add(1, "days");
  const nextDOW = nextDay.format("dddd");
  const nextDayFormatted = nextDay.format("YYYYMMDD");
  // Next next day (for which we will create the todo doc)
  const nextNextDay = now.clone().add(2, "days");
  const nextNextDayFormatted = nextNextDay.format("YYYYMMDD");
  const nextNextDOW = nextNextDay.format("dddd");
  const nextNextDayDateName = nextNextDay.format("MMM D"); // "Aug 27"
  // Defining past week
  const startOfWeek = now.clone().startOf("week");
  const endOfWeek = startOfWeek.clone().add(6, "days");
  const startOfWeekFormatted = startOfWeek.format("YYYYMMDD");
  const endOfWeekFormatted = endOfWeek.format("YYYYMMDD");
  const pastWeek = `${startOfWeekFormatted}-${endOfWeekFormatted}`;
  const formattedPastWeek = formatDateRange(
    startOfWeekFormatted,
    endOfWeekFormatted
  ); // "Aug 20 - Aug 26, 2023"

  return {
    now,
    todayFormatted,
    todayDateName,
    nextDay,
    nextDOW,
    nextNextDOW,
    nextDayFormatted,
    startOfWeek,
    endOfWeek,
    startOfWeekFormatted,
    endOfWeekFormatted,
    pastWeek,
    formattedPastWeek
  };
};

module.exports = { getTimeDefinitions };
