// - DEFAULT_CALORIE_GOAL
// - MACRO_RATIOS
// - XP_VALUES { mealLogged, questComplete, streakDay }
// - QUEST_DEFINITIONS[]
// - ACHIEVEMENT_DEFINITIONS[]

// ══════════════════════════════════════════════════
// COLORS AND FONTS
// ══════════════════════════════════════════════════
export const C = {
  bg: "#0B0B12",
  panel: "#111118",
  card: "#16161F",
  border: "#21212E",
  accent: "#6EE7B7",
  accentDim: "#6EE7B710",
  accentMid: "#6EE7B730",
  accentGlow: "#6EE7B755",
  gold: "#FCD34D",
  goldDim: "#FCD34D15",
  blue: "#60A5FA",
  blueDim: "#60A5FA15",
  pink: "#F9A8D4",
  pinkDim: "#F9A8D415",
  orange: "#FB923C",
  red: "#F87171",
  text: "#F0F0F8",
  soft: "#8888A8",
  muted: "#404058",
  mutedLight: "#585878",
};
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
export const themesDefinitions = [
  { id: 1, name: "Midnight Mint", lvlUnlocked: 1, price: 0, colors: ["#0B0B12", C.accent] },
  { id: 2, name: "Warm Paper", lvlUnlocked: 3, price: 150, colors: ["#F5F0E8", "#FF4D00"] },
  { id: 3, name: "Teal Night", lvlUnlocked: 5, price: 300, colors: ["#0E0E1A", "#00E5CC"] },
  { id: 4, name: "Aurora", lvlUnlocked: 7, price: 500, colors: ["#0a0014", "#cc44ff"] },
  { id: 5, name: "Ember Dark", lvlUnlocked: 10, price: 800, colors: ["#1a0800", "#FF8C42"] },
];
export const shieldPacks = [
  { qty: "1×", price: 150 },
  { qty: "3×", price: 400 },
  { qty: "5×", price: 600 },
];
