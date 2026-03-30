// date
// changeDate button
// homeCalorieRing.jsx
// homeMacros.jsx
// Streak card
// quest.jsx x3
// water card

import CalorieRing from "../components/home/CalorieRing";

// - imports CalorieRing, HomeMacros, StreakBanner,
//   MealList, QuestList, WaterTracker
// - calls useMeals(), useUser(), useGame()
// - owns modal state (which modal is open)
// - passes openModal(id) down to children that need it
export default function Home() {
  return (
    <>
      <CalorieRing consumed={1700} goal={2000}></CalorieRing>
    </>
  );
}
