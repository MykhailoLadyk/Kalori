import { useState, useEffect } from "react";
import { C, F } from "../../../lib/constans";
import { Mono } from "../../../components/shared/Primitives";
import { useUser } from "../../../hooks/useUser";

export default function CalorieGoalModal({ handleClose }) {
  const { user, updateUser } = useUser();

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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    goal: user?.settings?.weight_goal || "maintain",
    activity_level: user?.settings?.activity_level || "moderate",
  });

  useEffect(() => {
    if (user?.settings) {
      setCalorieGoal(user.targets.calories);
      setWaterGoal(user.targets.water);
      setForm({
        goal: user.settings.weight_goal || "maintain",
        activity_level: user.settings.activity_level || "moderate",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUser({
        targets: {
          calories: Number(calorieGoal),
          water: Number(waterGoal),
        },
        settings: {
          weight_goal: form.goal,
          activity_level: form.activity_level,
        },
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
                onClick={() => setForm({ ...form, goal: key })}
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
              onClick={() => setForm({ ...form, activity_level: key })}
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
              onChange={(e) => setCalorieGoal(Number(e.target.value))}
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
