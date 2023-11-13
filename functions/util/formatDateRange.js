/**
 * Formats a date range in the format "Aug 20 - Aug 26, 2023".
 *
 * @param {string} start - The start date in "YYYYMMDD" format.
 * @param {string} end - The end date in "YYYYMMDD" format.
 * @return {string} The formatted date range string.
 */
function formatDateRange(start, end) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract year, month, and day from the start date
  const startMonth = start.slice(4, 6);
  const startDay = start.slice(6, 8);

  // Extract year, month, and day from the end date
  const endYear = end.slice(0, 4);
  const endMonth = end.slice(4, 6);
  const endDay = end.slice(6, 8);

  // Format the date
  const formattedStart = `${months[parseInt(startMonth, 10) - 1]} ${parseInt(
      startDay,
      10,
  )}`;
  const formattedEnd = `${months[parseInt(endMonth, 10) - 1]} ${parseInt(
      endDay,
      10,
  )}, ${endYear}`;
  return `${formattedStart} - ${formattedEnd}`;
}

module.exports = {
  formatDateRange,
};
