// - DEFAULT_CALORIE_GOAL
// - MACRO_RATIOS
// - XP_VALUES { mealLogged, questComplete, streakDay }
// - QUEST_DEFINITIONS[]
// - ACHIEVEMENT_DEFINITIONS[]

// ══════════════════════════════════════════════════
// COLORS AND FONTS
// ══════════════════════════════════════════════════

// C values are CSS variable references — they resolve at render time
// via the custom properties set on :root by ThemeContext.
export const C = {
  bg: "var(--c-bg)",
  panel: "var(--c-panel)",
  card: "var(--c-card)",
  border: "var(--c-border)",
  accent: "var(--c-accent)",
  accentDim: "var(--c-accent-dim)",
  accentMid: "var(--c-accent-mid)",
  accentGlow: "var(--c-accent-glow)",
  gold: "var(--c-gold)",
  goldDim: "var(--c-gold-dim)",
  blue: "var(--c-blue)",
  blueDim: "var(--c-blue-dim)",
  pink: "var(--c-pink)",
  pinkDim: "var(--c-pink-dim)",
  orange: "var(--c-orange)",
  red: "var(--c-red)",
  text: "var(--c-text)",
  soft: "var(--c-soft)",
  muted: "var(--c-muted)",
  mutedLight: "var(--c-muted-light)",
};

/**
 * Create a semi-transparent version of any CSS color (hex or CSS variable).
 * Uses color-mix() which is supported in all modern browsers.
 *
 * @param {string} color  - CSS color value, e.g. "var(--c-accent)" or "#6EE7B7"
 * @param {number} percent - Opacity percentage 0-100
 * @returns {string} CSS color-mix expression
 *
 * @example alpha(C.accent, 10)  → "color-mix(in srgb, var(--c-accent) 10%, transparent)"
 * @example alpha(C.red, 50)     → "color-mix(in srgb, var(--c-red) 50%, transparent)"
 */
export function alpha(color, percent) {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

export const F = {
  head: "'Nunito', sans-serif",
  body: "'DM Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const levels = Object.fromEntries(
  Array.from({ length: 100 }, (_, index) => {
    const level = index + 1;
    return [level, (100 * index * (index + 1)) / 2];
  }),
);
export const achievements = [
  { id: 1, name: "First Log", description: "Log your first meal and start the journey.", max: 1 },
  { id: 2, name: "Three in a Row", description: "Log meals for 3 consecutive days.", max: 3 },
  { id: 3, name: "Five Day Streak", description: "Keep your logging streak alive for 5 days.", max: 5 },
  { id: 4, name: "Week Warrior", description: "Hit a 7-day logging streak.", max: 7 },
  { id: 5, name: "Two Week Grind", description: "Stay consistent for 14 straight days.", max: 14 },
  { id: 6, name: "Monthly Momentum", description: "Log something every day for 30 days.", max: 30 },
  { id: 7, name: "Calorie Tracker", description: "Log 25 meals in total.", max: 25 },
  { id: 8, name: "Meal Planner", description: "Reach 50 total meal logs.", max: 50 },
  { id: 9, name: "Macro Minded", description: "Check your macros on 10 different days.", max: 10 },
  { id: 10, name: "Hydration Habit", description: "Track your water intake 10 times.", max: 10 },
  { id: 11, name: "Balanced Plate", description: "Log a meal with all three macros in focus.", max: 1 },
  { id: 12, name: "Goal Getter", description: "Stay within your calorie goal for a full week.", max: 7 },
  { id: 13, name: "Quest Starter", description: "Complete your first quest.", max: 1 },
  { id: 14, name: "Quest Hunter", description: "Complete 5 quests.", max: 5 },
  { id: 15, name: "Quest Master", description: "Complete 10 quests.", max: 10 },
  { id: 16, name: "XP Collector", description: "Earn 1,000 XP total.", max: 1000 },
  { id: 17, name: "Level Up", description: "Reach level 5.", max: 5 },
  { id: 18, name: "Routine Builder", description: "Use the app for 20 separate days.", max: 20 },
  { id: 19, name: "Consistency King", description: "Log meals on 60 total days.", max: 60 },
  { id: 20, name: "Legendary Discipline", description: "Keep a 90-day tracking habit alive.", max: 90 },
];
export const quests = [
  { id: 1, name: "Log 3 meals today", progress: 2, icon: "meal", type: "Daily", reward: 50, max: 3 },
  { id: 2, name: "Drink 2.5L water", progress: 1.8, icon: "water", type: "Daily", reward: 30, max: 2.5 },
  { id: 3, name: "Hit protein goal", progress: 95, icon: "protein", type: "Daily", reward: 40, max: 100 },
  { id: 4, name: "Track breakfast", progress: 1, icon: "meal", type: "Daily", reward: 20, max: 1 },
  { id: 5, name: "Stay under calorie goal", progress: 4, icon: "fire", type: "Daily", reward: 60, max: 7 },
  { id: 6, name: "Walk after lunch", progress: 3, icon: "fire", type: "Daily", reward: 25, max: 5 },
  { id: 7, name: "Log 5 meals this week", progress: 4, icon: "meal", type: "Weekly", reward: 90, max: 5 },
  { id: 8, name: "Drink water 7 days", progress: 6, icon: "water", type: "Weekly", reward: 180, max: 7 },
  { id: 9, name: "Protein streak 5 days", progress: 3, icon: "protein", type: "Weekly", reward: 110, max: 5 },
  { id: 10, name: "Complete 4 workouts", progress: 2, icon: "fire", type: "Weekly", reward: 120, max: 4 },
  { id: 11, name: "Log 10 meals", progress: 7, icon: "meal", type: "Weekly", reward: 140, max: 10 },
  { id: 12, name: "Track water 10 times", progress: 8, icon: "water", type: "Weekly", reward: 150, max: 10 },
  { id: 13, name: "Protein master 10 days", progress: 6, icon: "protein", type: "Weekly", reward: 170, max: 10 },
  { id: 14, name: "Log lunch every weekday", progress: 5, icon: "meal", type: "Weekly", reward: 200, max: 5 },
  { id: 15, name: "Hydration habit 14 times", progress: 9, icon: "water", type: "Weekly", reward: 210, max: 14 },
  { id: 16, name: "Burn 1,000 calories", progress: 420, icon: "fire", type: "Weekly", reward: 250, max: 1000 },
  { id: 17, name: "Perfect week", progress: 4, icon: "meal", type: "Weekly", reward: 230, max: 7 },
  { id: 18, name: "Water champion", progress: 12, icon: "water", type: "Weekly", reward: 260, max: 14 },
  { id: 19, name: "Protein consistency", progress: 15, icon: "protein", type: "Weekly", reward: 280, max: 20 },
  { id: 20, name: "Daily logger", progress: 1, icon: "meal", type: "Daily", reward: 45, max: 1 },
  { id: 21, name: "Morning hydration", progress: 1, icon: "water", type: "Daily", reward: 25, max: 1 },
  { id: 22, name: "Active calories", progress: 3, icon: "fire", type: "Weekly", reward: 160, max: 5 },
  { id: 23, name: "Meal streak 7", progress: 7, icon: "meal", type: "Weekly", reward: 190, max: 7 },
  { id: 24, name: "Water streak 7", progress: 7, icon: "water", type: "Weekly", reward: 190, max: 7 },
  { id: 25, name: "Protein streak 7", progress: 5, icon: "protein", type: "Weekly", reward: 190, max: 7 },
  { id: 26, name: "Fire starter", progress: 2, icon: "fire", type: "Daily", reward: 35, max: 3 },
  { id: 27, name: "Meal planner", progress: 6, icon: "meal", type: "Weekly", reward: 175, max: 10 },
  { id: 28, name: "Hydration planner", progress: 4, icon: "water", type: "Weekly", reward: 175, max: 10 },
  { id: 29, name: "Protein planner", progress: 4, icon: "protein", type: "Weekly", reward: 175, max: 10 },
  { id: 30, name: "Weekly boss", progress: 2, icon: "fire", type: "Weekly", reward: 300, max: 7 },
];

// ══════════════════════════════════════════════════
// THEME PALETTES
// ══════════════════════════════════════════════════
// Each theme defines the full set of CSS variable values.
// The `colors` array [bg, accent] is kept for shop/settings previews.

export const themesDefinitions = [
  {
    id: 1,
    name: "Midnight Mint",
    lvlUnlocked: 1,
    price: 0,
    colors: ["#0B0B12", "#6EE7B7"],
    palette: {
      bg: "#0B0B12",
      panel: "#111118",
      card: "#16161F",
      border: "#21212E",
      accent: "#6EE7B7",
      gold: "#FCD34D",
      blue: "#60A5FA",
      pink: "#F9A8D4",
      orange: "#FB923C",
      red: "#F87171",
      text: "#F0F0F8",
      soft: "#8888A8",
      muted: "#404058",
      mutedLight: "#585878",
    },
  },
  {
    id: 2,
    name: "Warm Paper",
    lvlUnlocked: 2,
    price: 50,
    colors: ["#F5F0E8", "#FF4D00"],
    palette: {
      bg: "#F5F0E8",
      panel: "#EDE7DD",
      card: "#E4DED4",
      border: "#D0C8BC",
      accent: "#FF4D00",
      gold: "#B45309",
      blue: "#2563EB",
      pink: "#DB2777",
      orange: "#EA580C",
      red: "#DC2626",
      text: "#1C1108",
      soft: "#7A7062",
      muted: "#C4BAA8",
      mutedLight: "#9A9080",
    },
  },
  {
    id: 3,
    name: "Teal Night",
    lvlUnlocked: 5,
    price: 300,
    colors: ["#0E0E1A", "#00E5CC"],
    palette: {
      bg: "#0E0E1A",
      panel: "#141428",
      card: "#1A1A32",
      border: "#26264A",
      accent: "#00E5CC",
      gold: "#FCD34D",
      blue: "#38BDF8",
      pink: "#F0ABFC",
      orange: "#FB923C",
      red: "#FB7185",
      text: "#E8E8FA",
      soft: "#7878A8",
      muted: "#383858",
      mutedLight: "#505078",
    },
  },
  {
    id: 4,
    name: "Aurora",
    lvlUnlocked: 7,
    price: 500,
    colors: ["#0A0014", "#CC44FF"],
    palette: {
      bg: "#0A0014",
      panel: "#120022",
      card: "#1A0030",
      border: "#2E0058",
      accent: "#CC44FF",
      gold: "#FBBF24",
      blue: "#818CF8",
      pink: "#F472B6",
      orange: "#FB923C",
      red: "#FB7185",
      text: "#F0E8FF",
      soft: "#9878B8",
      muted: "#3D2060",
      mutedLight: "#5C3888",
    },
  },
  {
    id: 5,
    name: "Ember Dark",
    lvlUnlocked: 10,
    price: 800,
    colors: ["#1A0E04", "#FF8C42"],
    palette: {
      bg: "#1A0E04",
      panel: "#22140A",
      card: "#2C1C10",
      border: "#402C1C",
      accent: "#FF8C42",
      gold: "#FCD34D",
      blue: "#60A5FA",
      pink: "#FDA4AF",
      orange: "#FDBA74",
      red: "#F87171",
      text: "#FFF0E0",
      soft: "#A88868",
      muted: "#4D3020",
      mutedLight: "#6D4838",
    },
  },
];

export const shieldPacks = [
  { qty: "1×", price: 150 },
  { qty: "3×", price: 400 },
  { qty: "5×", price: 600 },
];
