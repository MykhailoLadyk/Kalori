/**
 * Calculate macro targets based on body weight, calorie goal, and weight goal.
 *
 * Protein is anchored to body weight (the gold standard):
 *   - Lose:     2.0 g/kg  (preserve muscle in a deficit)
 *   - Maintain: 1.6 g/kg  (general health)
 *   - Gain:     2.2 g/kg  (support muscle growth in a surplus)
 *
 * Fat is set to a healthy floor of ~25% of calories (never below 0.8 g/kg).
 * Carbs fill the remaining calories.
 *
 * @param {{ weight: number, calories: number, goal: string }} opts
 * @returns {{ protein: number, carbs: number, fat: number }}
 */
export function calcMacros({ weight, calories, goal = "maintain" }) {
  const w = Number(weight) || 70;   // fallback 70 kg
  const cal = Number(calories) || 2000;

  // 1) Protein — grams from body weight
  const proteinPerKg = goal === "lose" ? 2.0 : goal === "gain" ? 2.2 : 1.6;
  let protein = Math.round(w * proteinPerKg);

  // 2) Fat — 25 % of total calories (min 0.8 g/kg for hormonal health)
  let fat = Math.round((cal * 0.25) / 9);
  fat = Math.max(fat, Math.round(w * 0.8));

  // 3) Carbs — whatever is left
  const usedCals = protein * 4 + fat * 9;
  let carbs = Math.max(0, Math.round((cal - usedCals) / 4));

  // Safety: if protein + fat already exceed the calorie budget,
  // scale protein down so we always have ≥ 50 g carbs
  if (carbs < 50) {
    const available = cal - fat * 9 - 50 * 4;
    protein = Math.max(Math.round(w * 1.2), Math.round(available / 4));
    carbs = Math.max(50, Math.round((cal - protein * 4 - fat * 9) / 4));
  }

  return { protein, carbs, fat };
}

/**
 * Calculate calorie and water targets based on body stats.
 */
export function calculateTargets({ weight, height, age, sex = "male", activity_level, goal }) {
  if (!weight || !height || !age) {
    return { calories: 2000, water: 2000 };
  }

  // Estimate BMR (using exact Mifflin-St Jeor based on biological sex)
  let bmr = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
  bmr += sex === "female" ? -161 : 5;
  
  let multiplier = 1.2;
  switch (activity_level) {
    case "sedentary": multiplier = 1.2; break;
    case "light": multiplier = 1.375; break;
    case "moderate": multiplier = 1.55; break;
    case "active": multiplier = 1.725; break;
    case "very_active": multiplier = 1.9; break;
    default: multiplier = 1.2;
  }
  
  let tdee = bmr * multiplier;
  
  if (goal === "lose") tdee -= 500;
  if (goal === "gain") tdee += 500;
  
  let calories = Math.max(1200, Math.round(tdee));
  
  // Water goal in ml (~35ml per kg)
  let water = Math.round(Number(weight) * 35);
  water = Math.max(2000, Math.min(4000, water));

  return { calories, water };
}
