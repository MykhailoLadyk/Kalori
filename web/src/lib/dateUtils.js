/**
 * Returns today's date as a YYYY-MM-DD string
 */
export function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
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
