import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { C, F, alpha } from "../lib/constans";
import { Mono } from "../components/shared/Primitives";
import { useMeals } from "../hooks/useMeals";
import { useGameStats } from "../hooks/useGameStats";
import { useUser } from "../hooks/useUser";
import { getStreakMultiplier } from "../lib/utils";
import { processProgress } from "../lib/progressEngine";
const ChevronLeft = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks"];

const FIELD_CONFIG = [
  { key: "name", label: "Name", type: "text", placeholder: "e.g. Chicken & Rice" },
  { key: "calories", label: "Calories", type: "number", placeholder: "kcal" },
  { key: "protein", label: "Protein", type: "number", placeholder: "g" },
  { key: "carbs", label: "Carbs", type: "number", placeholder: "g" },
  { key: "fat", label: "Fat", type: "number", placeholder: "g" },
];

export default function ManualMealPage() {
  const { gameData, quests, achievements, updateGameData, updateQuests, updateAchievements } = useGameStats();
  const { meals, addMeal, selectedDate } = useMeals();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const meal = location.state?.meal;

  const [form, setForm] = useState({
    name: meal?.name ?? "",
    calories: meal?.calories ?? "",
    protein: meal?.protein ?? "",
    carbs: meal?.carbs ?? "",
    fat: meal?.fat ?? "",
    type: meal?.type ?? "breakfast",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (form.calories === "") newErrors.calories = "Calories are required";
    if (form.protein === "") newErrors.protein = "Protein is required";
    if (form.carbs === "") newErrors.carbs = "Carbs are required";
    if (form.fat === "") newErrors.fat = "Fat is required";
    if (form.calories < 0) newErrors.calories = "Cannot be negative";
    if (form.protein < 0) newErrors.protein = "Cannot be negative";
    if (form.carbs < 0) newErrors.carbs = "Cannot be negative";
    if (form.fat < 0) newErrors.fat = "Cannot be negative";
    return newErrors;
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const multiplier = getStreakMultiplier(gameData.streak);
      const baseXp = 10;
      const xpAwarded = baseXp * multiplier;
      const baseCoins = 5;
      const coinsAwarded = baseCoins * multiplier;
      const getLocalYMD = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };
      
      const mealDateStr = getLocalYMD(selectedDate);
      const todayStr = getLocalYMD(new Date());
      const yesterdayD = new Date();
      yesterdayD.setDate(yesterdayD.getDate() - 1);
      const yesterdayStr = getLocalYMD(yesterdayD);

      let streakUpdates = {};
      if (mealDateStr === todayStr && gameData.last_log_date !== todayStr) {
        const isConsecutive = gameData.last_log_date === yesterdayStr;
        const newStreak = isConsecutive ? (gameData.streak || 0) + 1 : 1;
        streakUpdates = { streak: newStreak, last_log_date: todayStr };
      }

      await updateGameData({ 
        xp_total: (gameData.xp_total || 0) + xpAwarded, 
        coins: (gameData.coins || 0) + coinsAwarded,
        ...streakUpdates
      });

      const mealObj = {
        ...form,
        calories: Number(form.calories),
        protein: Number(form.protein || 0),
        carbs: Number(form.carbs || 0),
        fat: Number(form.fat || 0),
        date: mealDateStr,
      };

      await addMeal(mealObj);

      const contextBag = {
        meals: [...meals, mealObj],
        user,
        userQuests: quests || [],
        userAchievements: achievements || [],
        gameData: { ...gameData, xp_total: (gameData.xp_total || 0) + xpAwarded, coins: (gameData.coins || 0) + coinsAwarded, ...streakUpdates },
      };
      const { updatedQuests, updatedAchievements } = processProgress("ADD_MEAL", mealObj, contextBag);
      if (updatedQuests.length) updateQuests(updatedQuests);
      if (updatedAchievements.length) updateAchievements(updatedAchievements);

      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="sy"
      style={{ display: "flex", flexDirection: "column", flex: 1, animation: "fadeIn 0.22s ease both" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 22px 16px" }}>
        <div
          onClick={() => navigate("/")}
          className="press"
          style={{
            width: 36,
            height: 36,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.soft,
            cursor: "pointer",
          }}
        >
          <ChevronLeft />
        </div>
        <div style={{ fontFamily: F.head, fontSize: 18, fontWeight: 900, color: C.text }}>Add Meal</div>
      </div>

      <div style={{ padding: "0 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 16 }}>
          <Mono size={8} color={C.mutedLight}>
            Meal Type
          </Mono>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {MEAL_TYPES.map((type) => (
              <div
                key={type}
                onClick={() => handleChange("type", type)}
                className="press"
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 9,
                  textAlign: "center",
                  cursor: "pointer",
                  background: form.type === type ? C.accent : C.card,
                  border: `1px solid ${form.type === type ? C.accent : C.border}`,
                  transition: "all 0.2s",
                }}
              >
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 8,
                    fontWeight: 700,
                    color: form.type === type ? "#000" : C.muted,
                  }}
                >
                  {type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FIELD_CONFIG.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <Mono size={8} color={C.mutedLight}>
                  {label}
                </Mono>
                {errors[key] && (
                  <Mono size={8} color={C.red}>
                    {errors[key]}
                  </Mono>
                )}
              </div>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  background: C.card,
                  border: `1px solid ${errors[key] ? alpha(C.red, 50) : C.border}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontFamily: F.body,
                  fontSize: 14,
                  color: C.text,
                  outline: "none",
                  transition: "border-color 0.2s",
                  minHeight: 46,
                }}
                onFocus={(e) => (e.target.style.borderColor = errors[key] ? alpha(C.red, 50) : C.accent)}
                onBlur={(e) => (e.target.style.borderColor = errors[key] ? alpha(C.red, 50) : C.border)}
              />
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div
          onClick={!loading ? handleSubmit : undefined}
          className="hover-btn press"
          style={{
            marginTop: 20,
            background: loading ? C.accentDim : C.accent,
            borderRadius: 12,
            padding: "15px",
            textAlign: "center",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            minHeight: 50,
          }}
        >
          <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: loading ? C.accent : "#000" }}>
            {loading ? "SAVING..." : "ADD MEAL"}
          </span>
        </div>
      </div>
    </div>
  );
}
