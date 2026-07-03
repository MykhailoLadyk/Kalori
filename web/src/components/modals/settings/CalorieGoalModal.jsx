import { useState, useEffect } from "react";
import { C, F } from "../../../lib/constants";
import { Mono } from "../../../components/shared/Primitives";
import { useUser } from "../../../hooks/useUser";
import { calcMacros, calculateTargets } from "../../../lib/macroCalc";
import { useNotifications } from "../../../context/NotificationContext";

export default function CalorieGoalModal({ handleClose }) {
  const { user, updateUser } = useUser();
  const { addNotification } = useNotifications();

  const GOALS = [
    { key: "lose", label: "Lose weight" },
    { key: "maintain", label: "Maintain" },
    { key: "gain", label: "Gain muscle" },
  ];
  const ACTIVITY_LEVELS = [
    { key: "sedentary", label: "Sedentary", sub: "Little or no exercise" },
    { key: "light", label: "Light", sub: "1-3 days/week" },
    { key: "moderate", label: "Moderate", sub: "3-5 days/week" },
    { key: "active", label: "Active", sub: "6-7 days/week" },
    { key: "very_active", label: "Very Active", sub: "Twice a day" },
  ];

  const [calorieGoal, setCalorieGoal] = useState(user.targets.calories || 2000);
  const [waterGoal, setWaterGoal] = useState(user.targets.water || 2000);
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
      setCalorieGoal(user.targets.calories);
      setWaterGoal(user.targets.water);
      setMacroGoals({
        protein: user.targets.protein || 0,
        carbs: user.targets.carbs || 0,
        fat: user.targets.fat || 0,
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
       const { calories, water } = calculateTargets({
         weight: user.settings.weight,
         height: user.settings.height,
         age: user.age,
         activity_level: newForm.activity_level,
         goal: newForm.goal
       });
       setCalorieGoal(calories);
       setWaterGoal(water);
       setMacroGoals(calcMacros({ weight: user.settings.weight, calories, goal: newForm.goal }));
    }
  };

  const handleSave = async () => {
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
      addNotification({ type: "success", name: "Goals saved successfully!" });
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
          <div
            style={{
              fontFamily: F.head,
              fontSize: 20,
              fontWeight: 900,
              color: C.text,
              marginBottom: 24,
            }}
          >
            Weight Goals
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {GOALS.map(({ key, label }) => (
              <div
                key={key}
                onClick={() => handleFormChange("goal", key)}
                className="press"
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  borderRadius: 10,
                  textAlign: "center",
                  cursor: "pointer",
                  background: form.goal === key ? C.accent : C.card,
                  border: `1px solid ${form.goal === key ? C.accent : C.border}`,
                  transition: "all 0.2s",
                  // min height for touch
                  minHeight: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 8,
                    fontWeight: 700,
                    color: form.goal === key ? "#000" : C.muted,
                  }}
                >
                  {label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            fontFamily: F.head,
            fontSize: 20,
            fontWeight: 900,
            color: C.text,
            marginBottom: 24,
          }}
        >
          Activity Level
        </div>
      </div>
      {/* activity level */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginTop: 8,
          }}
        >
          {ACTIVITY_LEVELS.map(({ key, label, sub }) => (
            <div
              key={key}
              onClick={() => handleFormChange("activity_level", key)}
              className="press"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: form.activity_level === key ? C.accentDim : C.card,
                border: `1px solid ${form.activity_level === key ? C.accentMid : C.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                cursor: "pointer",
                transition: "all 0.2s",
                // min height for touch
                minHeight: 52,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                  }}
                >
                  {label}
                </div>
                <Mono size={7} color={C.muted}>
                  {sub}
                </Mono>
              </div>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `2px solid ${form.activity_level === key ? C.accent : C.border}`,
                  background:
                    form.activity_level === key ? C.accent : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {form.activity_level === key && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#000",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* ── Calorie goal ── */}

        <div>
          <div
            style={{
              fontFamily: F.head,
              fontSize: 20,
              fontWeight: 900,
              color: C.text,
              marginBottom: 24,
              marginTop: 18,
            }}
          >
            Daily Targets
          </div>
          <Mono size={8} color={C.mutedLight}>
            Calorie Target
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
              value={calorieGoal}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCalorieGoal(val);
                setMacroGoals(calcMacros({ weight: user?.settings?.weight, calories: val, goal: form.goal }));
              }}
              placeholder="Enter calorie goal"
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
            Water Target
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
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            overflow: "hidden",
            marginTop: 6,
          }}
        >
          <summary
            className="press"
            style={{
              padding: "14px",
              fontFamily: F.body,
              fontSize: 14,
              color: C.text,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              outline: "none",
            }}
          >
            <div>
              <span style={{ fontWeight: 600 }}>Daily Macros Breakdown</span>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                 <Mono size={9} color={C.muted}>P: {macroGoals.protein}g</Mono>
                 <Mono size={9} color={C.muted}>C: {macroGoals.carbs}g</Mono>
                 <Mono size={9} color={C.muted}>F: {macroGoals.fat}g</Mono>
              </div>
            </div>
            <Mono size={12} color={C.muted}>▼</Mono>
          </summary>
          <div style={{ padding: "0 14px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
             {[
               { key: "protein", label: "Protein" },
               { key: "carbs", label: "Carbs" },
               { key: "fat", label: "Fat" },
             ].map(({ key, label }) => (
               <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <Mono size={10} color={C.text}>{label}</Mono>
                 <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                   <input 
                     type="number" 
                     value={macroGoals[key]} 
                     onChange={(e) => setMacroGoals({ ...macroGoals, [key]: Number(e.target.value) })}
                     style={{ width: 50, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px", color: C.text, fontFamily: F.mono, fontSize: 10, outline: "none", textAlign: "right" }}
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
        className="hover-btn press"
        style={{
          background: loading ? C.accentDim : C.accent,
          borderRadius: 12,
          padding: "13px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 700,
            color: loading ? C.accent : "#000",
          }}
        >
          {loading ? "SAVING..." : "SAVE GOALS"}
        </span>
      </div>
    </>
  );
}
