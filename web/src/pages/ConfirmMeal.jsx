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
  { key: "calories", label: "Calories", unit: "kcal", color: C.accent },
  { key: "protein", label: "Protein", unit: "g", color: C.blue },
  { key: "carbs", label: "Carbs", unit: "g", color: C.gold },
  { key: "fat", label: "Fat", unit: "g", color: C.pink },
];

export default function ConfirmMeal() {
  const { meals, addMeal, selectedDate } = useMeals();
  const { gameData, quests, achievements, updateGameData, updateQuests, updateAchievements } = useGameStats();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.meal;
  const photo = location.state?.photoData;
  const isAlbum = location.state?.isAlbum;
  const [form, setForm] = useState({
    name: result?.foods[0]?.name ?? "",
    calories: result?.meal_total?.calories ?? "",
    protein: result?.meal_total?.protein_g ?? "",
    carbs: result?.meal_total?.carbs_g ?? "",
    fat: result?.meal_total?.fat_g ?? "",
    type: result?.type ?? "breakfast",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (form.calories === "") newErrors.calories = "Required";
    if (form.protein === "") newErrors.protein = "Required";
    if (form.carbs === "") newErrors.carbs = "Required";
    if (form.fat === "") newErrors.fat = "Required";
    if (form.calories < 0) newErrors.calories = "Cannot be negative";
    if (form.protein < 0) newErrors.protein = "Cannot be negative";
    if (form.carbs < 0) newErrors.carbs = "Cannot be negative";
    if (form.fat < 0) newErrors.fat = "Cannot be negative";
    return newErrors;
  };

  const handleConfirm = async () => {
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
        <div style={{ fontFamily: F.head, fontSize: 18, fontWeight: 900, color: C.text }}>Confirm Meal</div>
      </div>

      <div style={{ padding: "0 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        {photo && (
          <div
            style={{
              width: "100%",
              height: 180,
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 16,
              position: "relative",
              border: `1px solid ${C.border}`,
            }}
          >
            <img src={photo} alt="meal" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {!isAlbum && (
              <div
                onClick={() => navigate("/add-meal/photo")}
                className="hover-btn press"
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  background: alpha("#000", 63),
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 700, color: "#fff" }}>RETAKE</span>
              </div>
            )}
          </div>
        )}

        <div style={{ fontFamily: F.body, fontSize: 13, color: C.soft, marginBottom: 14 }}>
          Review and adjust before adding to your log.
        </div>

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

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <Mono size={8} color={C.mutedLight}>
              Name
            </Mono>
            {errors.name && (
              <Mono size={8} color={C.red}>
                {errors.name}
              </Mono>
            )}
          </div>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Chicken & Rice"
            style={{
              width: "100%",
              background: C.card,
              border: `1px solid ${errors.name ? alpha(C.red, 50) : C.border}`,
              borderRadius: 10,
              padding: "12px 14px",
              fontFamily: F.body,
              fontSize: 14,
              color: C.text,
              outline: "none",
              transition: "border-color 0.2s",
              minHeight: 46,
            }}
            onFocus={(e) => (e.target.style.borderColor = errors.name ? alpha(C.red, 50) : C.accent)}
            onBlur={(e) => (e.target.style.borderColor = errors.name ? alpha(C.red, 50) : C.border)}
          />
        </div>

        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: "16px",
            marginBottom: 14,
            textAlign: "center",
          }}
        >
          <Mono size={8} color={C.mutedLight}>
            Calories
          </Mono>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6 }}>
            <input
              type="number"
              value={form.calories}
              onChange={(e) => handleChange("calories", e.target.value)}
              style={{
                width: 110,
                background: "transparent",
                border: "none",
                fontFamily: F.head,
                fontSize: 36,
                fontWeight: 900,
                color: C.accent,
                textAlign: "right",
                outline: "none",
              }}
            />
            <Mono size={11} color={C.muted}>
              kcal
            </Mono>
          </div>
          {errors.calories && (
            <div style={{ marginTop: 4 }}>
              <Mono size={8} color={C.red}>
                {errors.calories}
              </Mono>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {FIELD_CONFIG.slice(1).map(({ key, label, unit, color }) => (
            <div
              key={key}
              style={{
                flex: 1,
                background: alpha(color, 7),
                border: `1px solid ${alpha(color, 19)}`,
                borderRadius: 12,
                padding: "10px",
                textAlign: "center",
              }}
            >
              <Mono size={7} color={color}>
                {label}
              </Mono>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 3, marginTop: 4 }}>
                <input
                  type="number"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{
                    width: 42,
                    background: "transparent",
                    border: "none",
                    fontFamily: F.head,
                    fontSize: 16,
                    fontWeight: 800,
                    color: C.text,
                    textAlign: "right",
                    outline: "none",
                  }}
                />
                <Mono size={8} color={C.muted}>
                  {unit}
                </Mono>
              </div>
              {errors[key] && (
                <div style={{ marginTop: 2 }}>
                  <Mono size={7} color={C.red}>
                    {errors[key]}
                  </Mono>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <div
            onClick={() => navigate("/")}
            className="hover-btn press"
            style={{
              flex: 1,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "15px",
              textAlign: "center",
              cursor: "pointer",
              minHeight: 50,
            }}
          >
            <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: C.soft }}>CANCEL</span>
          </div>
          <div
            onClick={!loading ? handleConfirm : undefined}
            className="hover-btn press"
            style={{
              flex: 2,
              background: loading ? C.accentDim : C.accent,
              borderRadius: 12,
              padding: "15px",
              textAlign: "center",
              cursor: "pointer",
              minHeight: 50,
            }}
          >
            <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: loading ? C.accent : "#000" }}>
              {loading ? "SAVING..." : "ADD MEAL"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
