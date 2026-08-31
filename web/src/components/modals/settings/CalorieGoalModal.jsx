import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { C, F } from "../../../lib/constants";
import { Mono } from "../../../components/shared/Primitives";
import { useUser } from "../../../hooks/useUser";
import { calcMacros, calculateTargets } from "../../../lib/macroCalc";
import { useNotifications } from "../../../context/NotificationContext";

export default function CalorieGoalModal({ handleClose }) {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const { addNotification } = useNotifications();

  const GOALS = [
    { key: "lose", label: t("onboarding.goalLose") },
    { key: "maintain", label: t("onboarding.goalMaintain") },
    { key: "gain", label: t("onboarding.goalGain") },
  ];
  const ACTIVITY_LEVELS = [
    { key: "sedentary", label: t("onboarding.actSedentary"), sub: t("onboarding.actSedentarySub") },
    { key: "light", label: t("onboarding.actLight"), sub: t("onboarding.actLightSub") },
    { key: "moderate", label: t("onboarding.actModerate"), sub: t("onboarding.actModerateSub") },
    { key: "active", label: t("onboarding.actActive"), sub: t("onboarding.actActiveSub") },
    { key: "very_active", label: t("onboarding.actVeryActive"), sub: t("onboarding.actVeryActiveSub") },
  ];

  const [calorieGoal, setCalorieGoal] = useState(user?.targets?.calories || 2000);
  const [waterGoal, setWaterGoal] = useState(user?.targets?.water || 2500);
  const [macroGoals, setMacroGoals] = useState({
    protein: user?.targets?.protein || 0,
    carbs: user?.targets?.carbs || 0,
    fat: user?.targets?.fat || 0,
  });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    goal: user?.settings?.weight_goal || "maintain",
    activity_level: user?.settings?.activity_level || "moderate",
  });

  useEffect(() => {
    if (user?.settings) {
      setCalorieGoal(user?.targets?.calories || 2000);
      setWaterGoal(user?.targets?.water || 2500);
      setMacroGoals({
        protein: user?.targets?.protein || 0,
        carbs: user?.targets?.carbs || 0,
        fat: user?.targets?.fat || 0,
      });
      setForm({
        goal: user.settings.weight_goal || "maintain",
        activity_level: user.settings.activity_level || "moderate",
      });
    }
  }, [user]);

  const handleFormChange = (key, val) => {
    const newForm = { ...form, [key]: val };
    setForm(newForm);
    
    if (user?.settings && user.age) {
       const weightKg = user.settings.weight_unit === "lbs" ? user.settings.weight * 0.453592 : user.settings.weight;
       const heightCm = user.settings.height_unit === "ft" ? user.settings.height * 30.48 : user.settings.height;
       const { calories, water } = calculateTargets({
         weight: weightKg,
         height: heightCm,
         age: user.age,
         activity_level: newForm.activity_level,
         goal: newForm.goal
       });
       setCalorieGoal(calories);
       setWaterGoal(water);
       setMacroGoals(calcMacros({ weight: weightKg, calories, goal: newForm.goal }));
    }
  };

  const handleSave = async () => {
    const cal = Number(calorieGoal);
    const wat = Number(waterGoal);

    if (!cal || cal < 500 || cal > 15000) {
      addNotification({ type: "error", name: "Calorie target must be between 500 and 15,000 kcal" });
      return;
    }
    
    if (!wat || wat < 500 || wat > 15000) {
      addNotification({ type: "error", name: "Water target must be between 500 and 15,000 ml" });
      return;
    }

    const p = Number(macroGoals.protein);
    const c = Number(macroGoals.carbs);
    const f = Number(macroGoals.fat);

    if (p < 0 || p > 5000 || c < 0 || c > 5000 || f < 0 || f > 5000 || isNaN(p) || isNaN(c) || isNaN(f)) {
      addNotification({ type: "error", name: "Macro targets must be between 0 and 5000g" });
      return;
    }

    try {
      setLoading(true);
      await updateUser({
        targets: {
          calories: Number(calorieGoal),
          water: Number(waterGoal),
          ...macroGoals,
        },
        settings: {
          weight_goal: form.goal,
          activity_level: form.activity_level,
        },
      });
      addNotification({
        type: "success",
        name: "Goals updated",
      });
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          marginBottom: 32,
        }}
      >
        {/* goal */}
        <div style={{ marginBottom: 16 }}>
          <div className="font-head font-black text-primary" style={{ fontSize: 20, marginBottom: 24 }}>
            {t("settings.goalsTargets")}
          </div>
          <div className="flex" style={{ gap: 6, marginTop: 8 }}>
            {GOALS.map(({ key, label }) => (
              <div
                key={key}
                onClick={() => handleFormChange("goal", key)}
                className="press flex-1 flex items-center justify-center text-center cursor-pointer"
                style={{
                  padding: "10px 4px",
                  borderRadius: 10,
                  background: form.goal === key ? C.accent : C.card,
                  border: `1px solid ${form.goal === key ? C.accent : C.border}`,
                  transition: "all 0.2s",
                  minHeight: 44,
                }}
              >
                <span className="font-mono font-bold" style={{ fontSize: 8, color: form.goal === key ? "#000" : C.muted }}>
                  {label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="font-head font-black text-primary" style={{ fontSize: 20, marginBottom: 24 }}>
          {t("onboarding.activityTitle")}
        </div>
      </div>
      {/* activity level */}
      <div style={{ marginBottom: 20 }}>
        <div className="flex flex-col" style={{ gap: 6, marginTop: 8 }}>
          {ACTIVITY_LEVELS.map(({ key, label, sub }) => (
            <div
              key={key}
              onClick={() => handleFormChange("activity_level", key)}
              className="press flex items-center justify-between cursor-pointer"
              style={{
                background: form.activity_level === key ? C.accentDim : C.card,
                border: `1px solid ${form.activity_level === key ? C.accentMid : C.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                transition: "all 0.2s",
                minHeight: 52,
              }}
            >
              <div>
                <div className="font-body font-semibold text-primary" style={{ fontSize: 13 }}>
                  {label}
                </div>
                <Mono size={7} color={C.muted}>
                  {sub}
                </Mono>
              </div>
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `2px solid ${form.activity_level === key ? C.accent : C.border}`,
                  background: form.activity_level === key ? C.accent : "transparent",
                  transition: "all 0.2s",
                }}
              >
                {form.activity_level === key && (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#000" }} />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* ── Calorie goal ── */}

        <div>
          <div className="font-head font-black text-primary" style={{ fontSize: 20, marginBottom: 24, marginTop: 18 }}>
            {t("settings.calorieGoal")}
          </div>
          <Mono size={8} color={C.mutedLight}>
            {t("meal.calories")}
          </Mono>
          <div
            className="flex items-center overflow-hidden bg-card"
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              marginTop: 6,
            }}
          >
            <input
              type="number"
              value={calorieGoal}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCalorieGoal(val);
                const weightKg = user?.settings?.weight_unit === "lbs" ? user.settings.weight * 0.453592 : user?.settings?.weight;
                setMacroGoals(calcMacros({ weight: weightKg, calories: val, goal: form.goal }));
              }}
              placeholder="Enter calorie goal"
              className="flex-1 font-body text-primary"
              style={{
                background: "transparent",
                border: "none",
                padding: "11px 12px",
                fontSize: 14,
                outline: "none",
                minHeight: 44,
              }}
              onFocus={(e) =>
                (e.target.parentElement.style.borderColor = C.accent)
              }
              onBlur={(e) =>
                (e.target.parentElement.style.borderColor = C.border)
              }
            />
            <div className="flex items-center" style={{ padding: "0 14px", borderLeft: `1px solid ${C.border}`, minHeight: 44 }}>
              <Mono size={9} color={C.muted}>
                kcal
              </Mono>
            </div>
          </div>
        </div>
        {/* divider */}
        <div
          style={{
            height: 0,
            background: C.border,
            marginBottom: 12,
            marginTop: 12,
          }}
        />

        {/* ── Water goal ── */}
        <div>
          <Mono size={8} color={C.mutedLight}>
            {t("home.water")}
          </Mono>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              overflow: "hidden",
              marginTop: 6,
            }}
          >
            <input
              type="number"
              value={waterGoal}
              onChange={(e) => setWaterGoal(Number(e.target.value))}
              placeholder="Enter water goal"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                padding: "11px 12px",
                fontFamily: F.body,
                fontSize: 14,
                color: C.text,
                outline: "none",
                // larger touch target for mobile
                minHeight: 44,
              }}
              onFocus={(e) =>
                (e.target.parentElement.style.borderColor = C.accent)
              }
              onBlur={(e) =>
                (e.target.parentElement.style.borderColor = C.border)
              }
            />
            <div
              style={{
                padding: "0 14px",
                borderLeft: `1px solid ${C.border}`,
                minHeight: 44,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Mono size={9} color={C.muted}>
                ML
              </Mono>
            </div>
          </div>
        </div>

        {/* divider */}
        <div
          style={{
            height: 0,
            background: C.border,
            marginBottom: 12,
            marginTop: 12,
          }}
        />

        {/* ── Macros breakdown ── */}
        <details
          className="bg-card overflow-hidden"
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            marginTop: 6,
          }}
        >
          <summary
            className="press flex justify-between items-center font-body text-primary cursor-pointer outline-none"
            style={{ padding: "14px", fontSize: 14 }}
          >
            <div>
              <span className="font-semibold">{t("stats.macroSplit")}</span>
              <div className="flex" style={{ gap: 8, marginTop: 4 }}>
                 <Mono size={9} color={C.muted}>P: {macroGoals.protein}g</Mono>
                 <Mono size={9} color={C.muted}>C: {macroGoals.carbs}g</Mono>
                 <Mono size={9} color={C.muted}>F: {macroGoals.fat}g</Mono>
              </div>
            </div>
            <Mono size={12} color={C.muted}>▼</Mono>
          </summary>
          <div className="flex flex-col" style={{ padding: "0 14px 14px 14px", gap: 8 }}>
             {[
               { key: "protein", label: t("meal.protein") },
               { key: "carbs", label: t("meal.carbs") },
               { key: "fat", label: t("meal.fat") },
             ].map(({ key, label }) => (
               <div key={key} className="flex justify-between items-center">
                 <Mono size={10} color={C.text}>{label}</Mono>
                 <div className="flex items-center" style={{ gap: 4 }}>
                   <input 
                     type="number" 
                     value={macroGoals[key]} 
                     onChange={(e) => setMacroGoals({ ...macroGoals, [key]: Number(e.target.value) })}
                     className="font-mono text-primary outline-none text-right"
                     style={{ width: 50, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px", fontSize: 10 }}
                   />
                   <Mono size={10} color={C.muted}>g</Mono>
                 </div>
               </div>
             ))}
          </div>
        </details>
      </div>
      <div
        onClick={!loading ? handleSave : undefined}
        className="hover-btn press text-center cursor-pointer"
        style={{
          background: loading ? C.accentDim : C.accent,
          borderRadius: 12,
          padding: "13px",
        }}
      >
        <span className="font-mono font-bold" style={{ fontSize: 11, color: loading ? C.accent : "#000" }}>
          {loading ? t("settings.saving") : t("settings.saveChanges")}
        </span>
      </div>
    </>
  );
}
