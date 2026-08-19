import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { C, F, alpha } from "../lib/constants";
import { Mono } from "../components/shared/Primitives";
import { IconStar, IconStarOutline } from "../components/shared/DuoIcon";
import { useFavorites } from "../hooks/useFavorites";
import { useMeals } from "../hooks/useMeals";
import { useGameStats } from "../hooks/useGameStats";
import { useUser } from "../hooks/useUser";
import { getLocalYMD } from "../lib/dateUtils";
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
  const { addMeal, selectedDate } = useMeals();
  const { syncProgress } = useGameStats();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.meal;
  const photo = location.state?.photoData;
  const isAlbum = location.state?.isAlbum;
  // Get macro value from meal_total or sum from foods array
  const getMacro = (data, field) => {
    if (data?.meal_total?.[field] != null) return data.meal_total[field];
    if (data?.foods?.length > 0) {
      return data.foods.reduce((sum, f) => sum + (f[field] || 0), 0);
    }
    if (data?.[field] != null) return data[field];
    return "";
  };

  const [form, setForm] = useState({
    name: result?.name || result?.foods?.[0]?.name || "",
    calories: getMacro(result, "calories"),
    protein: getMacro(result, "protein_g"),
    carbs: getMacro(result, "carbs_g"),
    fat: getMacro(result, "fat_g"),
    type: result?.type ?? "breakfast",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { isFavorite, addFavorite, removeFavorite, getFavoriteByName } = useFavorites();
  const formIsFav = isFavorite(form.name);

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
      const mealDateStr = getLocalYMD(selectedDate);
      const todayStr = getLocalYMD(new Date());
      const isToday = mealDateStr === todayStr;

      const mealObj = {
        ...form,
        calories: Number(form.calories),
        protein: Number(form.protein || 0),
        carbs: Number(form.carbs || 0),
        fat: Number(form.fat || 0),
        date: mealDateStr,
      };
      await addMeal(mealObj);

      if (isToday) {
        await syncProgress(mealDateStr, true);
      }
      navigate("/");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="sy flex flex-col flex-1" style={{ animation: "fadeIn 0.22s ease both" }}>
      <div className="flex items-center" style={{ gap: 12, padding: "8px 22px 16px" }}>
        <div
          onClick={() => navigate("/")}
          className="press flex items-center justify-center bg-card"
          style={{
            width: 36,
            height: 36,
            border: `1px solid ${C.border}`,
            borderRadius: 11,
            color: C.soft,
            cursor: "pointer",
          }}
        >
          <ChevronLeft />
        </div>
        <div className="font-head font-black text-primary" style={{ fontSize: 18 }}>
          Confirm Meal
        </div>
      </div>

      <div className="flex-1 flex flex-col" style={{ padding: "0 22px 22px" }}>
        {photo && (
          <div
            className="w-full relative overflow-hidden"
            style={{ height: 180, borderRadius: 16, marginBottom: 16, border: `1px solid ${C.border}` }}
          >
            <img src={photo} alt="meal" className="w-full h-full" style={{ objectFit: "cover" }} />
            {!isAlbum && (
              <div
                onClick={() => navigate("/add-meal/photo")}
                className="hover-btn press absolute"
                style={{
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
                <span className="font-mono font-bold" style={{ fontSize: 9, color: "#fff" }}>
                  RETAKE
                </span>
              </div>
            )}
          </div>
        )}

        <div className="font-body text-soft" style={{ fontSize: 13, marginBottom: 14 }}>
          Review and adjust before adding to your log.
        </div>

        <div style={{ marginBottom: 16 }}>
          <Mono size={8} color={C.mutedLight}>
            Meal Type
          </Mono>
          <div className="flex" style={{ gap: 6, marginTop: 8 }}>
            {MEAL_TYPES.map((type) => (
              <div
                key={type}
                onClick={() => handleChange("type", type)}
                className="press flex-1 text-center cursor-pointer"
                style={{
                  padding: "9px 0",
                  borderRadius: 9,
                  background: form.type === type ? C.accent : C.card,
                  border: `1px solid ${form.type === type ? C.accent : C.border}`,
                  transition: "all 0.2s",
                }}
              >
                <span
                  className="font-mono font-bold"
                  style={{ fontSize: 8, color: form.type === type ? "#000" : C.muted }}
                >
                  {type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="flex justify-between" style={{ marginBottom: 5 }}>
            <Mono size={8} color={C.mutedLight}>
              Name
            </Mono>
            {errors.name && (
              <Mono size={8} color={C.red}>
                {errors.name}
              </Mono>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Chicken & Rice"
              maxLength={50}
              className="w-full bg-card input-field"
              style={{
                flex: 1,
                border: `1px solid ${errors.name ? alpha(C.red, 50) : C.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                transition: "border-color 0.2s",
                minHeight: 46,
              }}
              onFocus={(e) => (e.target.style.borderColor = errors.name ? alpha(C.red, 50) : C.accent)}
              onBlur={(e) => (e.target.style.borderColor = errors.name ? alpha(C.red, 50) : C.border)}
            />
            <div
              onClick={() => {
                if (formIsFav) {
                  const fav = getFavoriteByName(form.name);
                  if (fav) removeFavorite(fav.id);
                } else {
                  addFavorite({
                    name: form.name,
                    calories: Number(form.calories) || 0,
                    protein: Number(form.protein) || 0,
                    carbs: Number(form.carbs) || 0,
                    fat: Number(form.fat) || 0,
                    type: form.type,
                  });
                }
              }}
              className="press flex items-center justify-center"
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: formIsFav ? alpha(C.gold, 9) : C.card,
                border: `1px solid ${formIsFav ? alpha(C.gold, 25) : C.border}`,
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {formIsFav ? <IconStar size={20} color={C.gold} /> : <IconStarOutline size={20} color={C.muted} />}
            </div>
          </div>
        </div>

        <div
          className="bg-card text-center"
          style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 14 }}
        >
          <Mono size={8} color={C.mutedLight}>
            Calories
          </Mono>
          <div className="flex items-center justify-center" style={{ gap: 6, marginTop: 6 }}>
            <input
              type="number"
              value={form.calories}
              onChange={(e) => handleChange("calories", e.target.value)}
              className="font-head font-black text-accent text-right"
              style={{ width: 110, background: "transparent", border: "none", fontSize: 36, outline: "none" }}
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

        <div className="flex" style={{ gap: 8, marginBottom: 16 }}>
          {FIELD_CONFIG.slice(1).map(({ key, label, unit, color }) => (
            <div
              key={key}
              className="flex-1 text-center"
              style={{
                background: alpha(color, 7),
                border: `1px solid ${alpha(color, 19)}`,
                borderRadius: 12,
                padding: "10px",
              }}
            >
              <Mono size={7} color={color}>
                {label}
              </Mono>
              <div className="flex items-baseline justify-center" style={{ gap: 3, marginTop: 4 }}>
                <input
                  type="number"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="font-head text-primary text-right"
                  style={{
                    width: 42,
                    background: "transparent",
                    border: "none",
                    fontSize: 16,
                    fontWeight: 800,
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

        <div className="flex-1" />

        <div className="flex" style={{ gap: 10, marginTop: 8 }}>
          <div
            onClick={() => navigate("/")}
            className="hover-btn press flex-1 bg-card text-center cursor-pointer"
            style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "15px", minHeight: 50 }}
          >
            <span className="font-mono font-bold" style={{ fontSize: 10, color: C.soft }}>
              CANCEL
            </span>
          </div>
          <div
            onClick={!loading ? handleConfirm : undefined}
            className="hover-btn press text-center cursor-pointer"
            style={{
              flex: 2,
              background: loading ? C.accentDim : C.accent,
              borderRadius: 12,
              padding: "15px",
              minHeight: 50,
            }}
          >
            <span className="font-mono font-bold" style={{ fontSize: 11, color: loading ? C.accent : "#000" }}>
              {loading ? "SAVING..." : "ADD MEAL"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
