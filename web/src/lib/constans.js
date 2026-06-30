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
export const TRIGGERS = {
  ADD_MEAL: "ADD_MEAL",
  ADD_WATER: "ADD_WATER",
  COMPLETE_QUEST: "COMPLETE_QUEST",
  EARN_XP: "EARN_XP",
};

export const achievements = [
  {
    id: 1,
    name: "First Log",
    description: "Log your first meal and start the journey.",
    max: 1,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => ({ progress: 1 }),
  },
  {
    id: 2,
    name: "Three in a Row",
    description: "Log meals for 3 consecutive days.",
    max: 3,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => ({ progress: ctx.gameData.streak }),
  },
  {
    id: 3,
    name: "Five Day Streak",
    description: "Keep your logging streak alive for 5 days.",
    max: 5,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => ({ progress: ctx.gameData.streak }),
  },
  {
    id: 4,
    name: "Week Warrior",
    description: "Hit a 7-day logging streak.",
    max: 7,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => ({ progress: ctx.gameData.streak }),
  },
  {
    id: 5,
    name: "Two Week Grind",
    description: "Stay consistent for 14 straight days.",
    max: 14,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => ({ progress: ctx.gameData.streak }),
  },
  {
    id: 6,
    name: "Monthly Momentum",
    description: "Log something every day for 30 days.",
    max: 30,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => ({ progress: ctx.gameData.streak }),
  },
  {
    id: 7,
    name: "Calorie Tracker",
    description: "Log 25 meals in total.",
    max: 25,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 8,
    name: "Meal Planner",
    description: "Reach 50 total meal logs.",
    max: 50,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 9,
    name: "Macro Minded",
    description: "Check your macros on 10 different days.",
    max: 10,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 10,
    name: "Hydration Habit",
    description: "Track your water intake 10 times.",
    max: 10,
    triggers: [TRIGGERS.ADD_WATER],
    evaluate: (payload, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 11,
    name: "Balanced Plate",
    description: "Log a meal with all three macros in focus.",
    max: 1,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => {
      if (payload.protein > 0 && payload.carbs > 0 && payload.fat > 0) return { progress: 1 };
      return { progress: ctx.item.progress };
    },
  },
  {
    id: 12,
    name: "Goal Getter",
    description: "Stay within your calorie goal for a full week.",
    max: 7,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (payload, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      const totalCals = ctx.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
      if (totalCals > ctx.user.targets.calories) return { progress: 0, lastCountedDate: null };
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 13,
    name: "Quest Starter",
    description: "Complete your first quest.",
    max: 1,
    triggers: [TRIGGERS.COMPLETE_QUEST],
    evaluate: (payload, ctx) => ({ progress: 1 }),
  },
  {
    id: 14,
    name: "Quest Hunter",
    description: "Complete 5 quests.",
    max: 5,
    triggers: [TRIGGERS.COMPLETE_QUEST],
    evaluate: (payload, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 15,
    name: "Quest Master",
    description: "Complete 10 quests.",
    max: 10,
    triggers: [TRIGGERS.COMPLETE_QUEST],
    evaluate: (payload, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 16,
    name: "XP Collector",
    description: "Earn 1,000 XP total.",
    max: 1000,
    triggers: [TRIGGERS.EARN_XP],
    evaluate: (payload, ctx) => ({ progress: ctx.gameData.xp_total }),
  },
  {
    id: 17,
    name: "Level Up",
    description: "Reach level 5.",
    max: 5,
    triggers: [TRIGGERS.EARN_XP],
    evaluate: (payload, ctx) => ({ progress: ctx.level || 1 }),
  },
  {
    id: 18,
    name: "Routine Builder",
    description: "Use the app for 20 separate days.",
    max: 20,
    triggers: [TRIGGERS.ADD_MEAL, TRIGGERS.ADD_WATER],
    evaluate: (payload, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 19,
    name: "Consistency King",
    description: "Log meals on 60 total days.",
    max: 60,
    triggers: [TRIGGERS.ADD_MEAL, TRIGGERS.ADD_WATER],
    evaluate: (payload, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 20,
    name: "Legendary Discipline",
    description: "Keep a 90-day tracking habit alive.",
    max: 90,
    triggers: [TRIGGERS.ADD_MEAL, TRIGGERS.ADD_WATER],
    evaluate: (payload, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
];
export const quests = [
  {
    id: 1,
    name: "Log 3 meals today",
    icon: "meal",
    type: "Daily",
    reward: 50,
    max: 3,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => ({ progress: ctx.meals.filter((m) => m.calories != null).length }),
  },
  {
    id: 2,
    name: "Drink 2.5L water",
    icon: "water",
    type: "Daily",
    reward: 30,
    max: 2.5,
    triggers: [TRIGGERS.ADD_WATER],
    evaluate: (p, ctx) => {
      const w = ctx.meals.filter((m) => m.name === "water").reduce((s, m) => s + (m.amount || 0), 0) / 1000;
      return { progress: w };
    },
  },
  {
    id: 3,
    name: "Hit protein goal",
    icon: "protein",
    type: "Daily",
    reward: 40,
    max: 100,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => {
      const pTotal = ctx.meals.reduce((s, m) => s + (m.protein || 0), 0);
      return { progress: Math.min((pTotal / (ctx.user.targets.protein || 1)) * 100, 100) };
    },
  },
  {
    id: 4,
    name: "Track breakfast",
    icon: "meal",
    type: "Daily",
    reward: 20,
    max: 1,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => ({
      progress: p.type === "breakfast" || ctx.meals.some((m) => m.type === "breakfast") ? 1 : ctx.item.progress,
    }),
  },
  {
    id: 5,
    name: "Stay under calorie goal",
    icon: "fire",
    type: "Daily",
    reward: 60,
    max: 7,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      const totalCals = ctx.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
      if (totalCals > ctx.user.targets.calories) return { progress: 0, lastCountedDate: null };
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 6,
    name: "Walk after lunch",
    icon: "fire",
    type: "Daily",
    reward: 25,
    max: 5,
    triggers: ["ADD_ACTIVITY"],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 7,
    name: "Log 5 meals this week",
    icon: "meal",
    type: "Weekly",
    reward: 90,
    max: 5,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 8,
    name: "Drink water 7 days",
    icon: "water",
    type: "Weekly",
    reward: 180,
    max: 7,
    triggers: [TRIGGERS.ADD_WATER],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 9,
    name: "Protein streak 5 days",
    icon: "protein",
    type: "Weekly",
    reward: 110,
    max: 5,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      const totalProtein = ctx.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
      if (totalProtein >= ctx.user.targets.protein)
        return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
      return { progress: ctx.item.progress };
    },
  },
  {
    id: 10,
    name: "Complete 4 workouts",
    icon: "fire",
    type: "Weekly",
    reward: 120,
    max: 4,
    triggers: ["ADD_ACTIVITY"],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 11,
    name: "Log 10 meals",
    icon: "meal",
    type: "Weekly",
    reward: 140,
    max: 10,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 12,
    name: "Track water 10 times",
    icon: "water",
    type: "Weekly",
    reward: 150,
    max: 10,
    triggers: [TRIGGERS.ADD_WATER],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 13,
    name: "Protein master 10 days",
    icon: "protein",
    type: "Weekly",
    reward: 170,
    max: 10,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      const totalProtein = ctx.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
      if (totalProtein >= ctx.user.targets.protein)
        return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
      return { progress: ctx.item.progress };
    },
  },
  {
    id: 14,
    name: "Log lunch every weekday",
    icon: "meal",
    type: "Weekly",
    reward: 200,
    max: 5,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      if (p.type === "lunch") return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
      return { progress: ctx.item.progress };
    },
  },
  {
    id: 15,
    name: "Hydration habit 14 times",
    icon: "water",
    type: "Weekly",
    reward: 210,
    max: 14,
    triggers: [TRIGGERS.ADD_WATER],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 16,
    name: "Burn 1,000 calories",
    icon: "fire",
    type: "Weekly",
    reward: 250,
    max: 1000,
    triggers: ["ADD_ACTIVITY"],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + (p.caloriesBurned || 0) }),
  },
  {
    id: 17,
    name: "Perfect week",
    icon: "meal",
    type: "Weekly",
    reward: 230,
    max: 7,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      const totalCals = ctx.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
      if (totalCals > ctx.user.targets.calories) return { progress: 0, lastCountedDate: null };
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 18,
    name: "Water champion",
    icon: "water",
    type: "Weekly",
    reward: 260,
    max: 14,
    triggers: [TRIGGERS.ADD_WATER],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      const w = ctx.meals.filter((m) => m.name === "water").reduce((s, m) => s + (m.amount || 0), 0) / 1000;
      if (w >= 3) return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
      return { progress: ctx.item.progress };
    },
  },
  {
    id: 19,
    name: "Protein consistency",
    icon: "protein",
    type: "Weekly",
    reward: 280,
    max: 20,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      const totalProtein = ctx.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
      if (totalProtein >= ctx.user.targets.protein)
        return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
      return { progress: ctx.item.progress };
    },
  },
  {
    id: 20,
    name: "Daily logger",
    icon: "meal",
    type: "Daily",
    reward: 45,
    max: 1,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => ({ progress: 1 }),
  },
  {
    id: 21,
    name: "Morning hydration",
    icon: "water",
    type: "Daily",
    reward: 25,
    max: 1,
    triggers: [TRIGGERS.ADD_WATER],
    evaluate: (p, ctx) => ({ progress: new Date().getHours() < 12 ? 1 : ctx.item.progress }),
  },
  {
    id: 22,
    name: "Active calories",
    icon: "fire",
    type: "Weekly",
    reward: 160,
    max: 5,
    triggers: ["ADD_ACTIVITY"],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 23,
    name: "Meal streak 7",
    icon: "meal",
    type: "Weekly",
    reward: 190,
    max: 7,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 24,
    name: "Water streak 7",
    icon: "water",
    type: "Weekly",
    reward: 190,
    max: 7,
    triggers: [TRIGGERS.ADD_WATER],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
    },
  },
  {
    id: 25,
    name: "Protein streak 7",
    icon: "protein",
    type: "Weekly",
    reward: 190,
    max: 7,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (ctx.item.lastCountedDate === todayStr) return { progress: ctx.item.progress };
      const totalProtein = ctx.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
      if (totalProtein >= ctx.user.targets.protein)
        return { progress: ctx.item.progress + 1, lastCountedDate: todayStr };
      return { progress: ctx.item.progress };
    },
  },
  {
    id: 26,
    name: "Fire starter",
    icon: "fire",
    type: "Daily",
    reward: 35,
    max: 3,
    triggers: ["ADD_ACTIVITY"],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 27,
    name: "Meal planner",
    icon: "meal",
    type: "Weekly",
    reward: 175,
    max: 10,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 28,
    name: "Hydration planner",
    icon: "water",
    type: "Weekly",
    reward: 175,
    max: 10,
    triggers: [TRIGGERS.ADD_WATER],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 29,
    name: "Protein planner",
    icon: "protein",
    type: "Weekly",
    reward: 175,
    max: 10,
    triggers: [TRIGGERS.ADD_MEAL],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
  {
    id: 30,
    name: "Weekly boss",
    icon: "fire",
    type: "Weekly",
    reward: 300,
    max: 7,
    triggers: ["ADD_ACTIVITY"],
    evaluate: (p, ctx) => ({ progress: ctx.item.progress + 1 }),
  },
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
    name: "Neon Nights",
    lvlUnlocked: 3,
    price: 150,
    colors: ["#050511", "#4CC9F0"],
    palette: {
      bg: "#050511",
      panel: "#0A0A1C",
      card: "#13132A",
      border: "#232345",
      accent: "#F72585",
      gold: "#FEE440",
      blue: "#4CC9F0",
      pink: "#B5179E",
      orange: "#F8961E",
      red: "#D00000",
      text: "#F8F9FA",
      soft: "#ADB5BD",
      muted: "#495057",
      mutedLight: "#6C757D",
    },
  },
  {
    id: 3,
    name: "Sakura White",
    lvlUnlocked: 5,
    price: 300,
    colors: ["#FFF5F8", "#E83E8C"],
    palette: {
      bg: "#FFF5F8",
      panel: "#FFE8EF",
      card: "#FFFFFF",
      border: "#FAD1DF",
      accent: "#E83E8C",
      gold: "#F59E0B",
      blue: "#60A5FA",
      pink: "#FDA4AF",
      orange: "#FB923C",
      red: "#E11D48",
      text: "#3F2E3E",
      soft: "#9A8C98",
      muted: "#D4C5CB",
      mutedLight: "#B7A9B0",
    },
  },
  {
    id: 4,
    name: "Solarized Classic",
    lvlUnlocked: 7,
    price: 500,
    colors: ["#FDF6E3", "#2AA198"],
    palette: {
      bg: "#FDF6E3",
      panel: "#EEE8D5",
      card: "#F5EFDC",
      border: "#D9D2C2",
      accent: "#2AA198",
      gold: "#B58900",
      blue: "#268BD2",
      pink: "#D33682",
      orange: "#CB4B16",
      red: "#DC322F",
      text: "#657B83",
      soft: "#93A1A1",
      muted: "#D1CBBA",
      mutedLight: "#BDB7A6",
    },
  },
  {
    id: 5,
    name: "OLED Pure",
    lvlUnlocked: 10,
    price: 800,
    colors: ["#000000", "#39FF14"],
    palette: {
      bg: "#000000",
      panel: "#0A0A0A",
      card: "#121212",
      border: "#262626",
      accent: "#39FF14",
      gold: "#FBBF24",
      blue: "#3B82F6",
      pink: "#EC4899",
      orange: "#F97316",
      red: "#EF4444",
      text: "#FFFFFF",
      soft: "#A3A3A3",
      muted: "#404040",
      mutedLight: "#737373",
    },
  },
];

export const shieldPacks = [
  { qty: "1×", price: 150 },
  { qty: "3×", price: 400 },
  { qty: "5×", price: 600 },
];
// Context does this: recieves an array of objets(updated achievements/quests)

// If any objects progress = max progress add date to the object to mark as completed

// calls addNotifcation

// Update DB

// Update context

// each Component where user aaction can complete quest/ach does this:

// Calls function and assigns result to const upddatedQuests or ach

// Calls context and gives it updatedQue or Ach

// Function does this:

// Recieves trigger type and payload(added meal,  water)

// filters out all irrelevant que/ach(completed or differet trigger)

// iterates through all quests/ach calling their function

// add to quest or ach definitions:

// Trigger, like ADD_MEAL, ADD_WATER etc.

// Add function to calculate progress requiemnts which will take  payload and calculate whether reqs to progress are completed. For example, requiremnts reach macros targets for 10 days:

// Was target macros reached today?

// Will adding payload to current meals context reach macro targets?

// If yes, then +1 to progress
