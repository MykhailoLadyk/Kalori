import i18n from "./i18n";
import { MONTHS } from "./constants.js";

export function getDayName(date, lang) {
  const currentLang = lang || (i18n?.language?.startsWith("pl") ? "pl-PL" : "en-US");
  try {
    return new Intl.DateTimeFormat(currentLang, { weekday: "long" }).format(date);
  } catch {
    switch (date.getDay()) {
      case 0: return "Sunday";
      case 1: return "Monday";
      case 2: return "Tuesday";
      case 3: return "Wednesday";
      case 4: return "Thursday";
      case 5: return "Friday";
      case 6: return "Saturday";
      default: return "Unknown";
    }
  }
}

export function getMonthName(date, lang) {
  const currentLang = lang || (i18n?.language?.startsWith("pl") ? "pl-PL" : "en-US");
  const targetDate = typeof date === "number" ? new Date(2026, date, 1) : date instanceof Date ? date : null;
  if (!targetDate) return "";
  try {
    return new Intl.DateTimeFormat(currentLang, { month: "long" }).format(targetDate);
  } catch {
    const index = typeof date === "number" ? date : date instanceof Date ? date.getMonth() : -1;
    return MONTHS[index] || "";
  }
}
export function getNumberOfDaysInMonth(year, month) {
  const newDate = new Date(year, month + 1, 0);
  return newDate.getDate();
}
export function getStreakMultiplier(streak) {
  if (streak >= 30) return 3;
  if (streak >= 14) return 2;
  if (streak >= 7) return 1.5;
  return 1;
}
