/**
 * Formats a Date object to a local YYYY-MM-DD string
 */
export function getLocalYMD(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date as a local YYYY-MM-DD string
 */
export function getTodayDateString() {
  return getLocalYMD(new Date());
}

/**
 * Calculates the number of days between two YYYY-MM-DD date strings
 * Returns positive if date2 is after date1
 */
export function getDaysBetweenDates(date1Str, date2Str) {
  if (!date1Str || !date2Str) return 0;
  
  const d1 = new Date(date1Str);
  const d2 = new Date(date2Str);
  
  // Set times to midnight to ensure exact day calculations
  d1.setUTCHours(0, 0, 0, 0);
  d2.setUTCHours(0, 0, 0, 0);
  
  const diffTime = d2 - d1;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
