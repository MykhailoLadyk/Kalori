// pages/OnboardingPage.jsx
import { useState } from "react";
import { C, F, alpha } from "../lib/constans";
import { Mono } from "../components/shared/Primitives";
import { AnimBar } from "../components/shared/AnimBar";
import { useUser } from "../hooks/useUser";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

// ── Step indicator ────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      {[...Array(total)].map((_, i) => (
        <div
          key={i}
          style={{
            height: 4,
            borderRadius: 4,
            width: i === current ? 20 : 6,
            background:
              i === current ? C.accent : i < current ? C.accentMid : C.border,
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      ))}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────
function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  unit,
  error,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Mono size={8} color={C.mutedLight}>
          {label}
        </Mono>
        {error && (
          <Mono size={8} color={C.red}>
            {error}
          </Mono>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: C.card,
          border: `1px solid ${error ? alpha(C.red, 50) : focused ? C.accent : C.border}`,
          borderRadius: 12,
          overflow: "hidden",
          transition: "border-color 0.2s",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            padding: "12px 14px",
            fontFamily: F.body,
            fontSize: 14,
            color: C.text,
            outline: "none",
            minHeight: 46,
          }}
        />
        {unit && (
          <div
            style={{ padding: "0 14px", borderLeft: `1px solid ${C.border}` }}
          >
            <Mono size={9} color={C.muted}>
              {unit}
            </Mono>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Selectable chip ───────────────────────────────────────────
function Chip({ label, sub, selected, onSelect, color = C.accent }) {
  return (
    <div
      onClick={onSelect}
      className="press"
      style={{
        background: selected ? alpha(color, 9) : C.card,
        border: `1px solid ${selected ? alpha(color, 38) : C.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
        {sub && (
          <Mono size={7} color={C.muted}>
            {sub}
          </Mono>
        )}
      </div>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          flexShrink: 0,
          border: `2px solid ${selected ? color : C.border}`,
          background: selected ? color : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        {selected && (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#000",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────
const STEPS = [
  "welcome",
  "profile",
  "body",
  "goals",
  "activity",
  "game",
  "done",
];

const ACTIVITY_LEVELS = [
  { key: "sedentary", label: "Sedentary", sub: "Desk job, little movement" },
  { key: "light", label: "Light", sub: "Walk occasionally, 1–3x/week" },
  { key: "moderate", label: "Moderate", sub: "Active lifestyle, 3–5x/week" },
  { key: "active", label: "Active", sub: "Gym daily or physical job" },
  {
    key: "very_active",
    label: "Very Active",
    sub: "Athlete or twice-a-day training",
  },
];

const GOALS = [
  {
    key: "lose",
    label: "Lose weight",
    sub: "Caloric deficit, track carefully",
    color: C.blue,
  },
  {
    key: "maintain",
    label: "Stay healthy",
    sub: "Balanced intake, build habits",
    color: C.accent,
  },
  {
    key: "gain",
    label: "Build muscle",
    sub: "Caloric surplus, hit protein goals",
    color: C.gold,
  },
];

const CALORIE_PRESETS = [1500, 1800, 2000, 2200, 2500];
const WATER_PRESETS = [1.5, 2.0, 2.5, 3.0, 3.5];

export default function OnboardingPage() {
  const navigate = useNavigate();

  const { updateUser } = useUser();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    activity_level: "moderate",
    goal: "maintain",
    calorie_goal: 2000,
    water_goal: 2500,
  });

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const currentStep = STEPS[step];
  const totalDots = STEPS.length - 2; // exclude welcome + done from dots

  // ── Validate per step ───────────────────────────────────────
  const validate = () => {
    const e = {};
    if (currentStep === "profile") {
      if (!form.name.trim()) e.name = "Required";
    }
    if (currentStep === "body") {
      if (!form.age || form.age <= 0) e.age = "Required";
      if (!form.weight || form.weight <= 0) e.weight = "Required";
      if (!form.height || form.height <= 0) e.height = "Required";
    }
    return e;
  };

  const next = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  // ── Save and finish ─────────────────────────────────────────
  const handleFinish = async () => {
    try {
      setSaving(true);

      await updateUser({
        name: form.name.trim(),
        age: Number(form.age),
        completedOnboarding: true,
        settings: {
          activity_level: form.activity_level,
          goal: form.goal,
          weight: Number(form.weight),
          height: Number(form.height),
        },
        targets: {
          calories: form.calorie_goal,
          water: form.water_goal,
        },
      });

      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── Render steps ────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {
      // ── Welcome ─────────────────────────────────────────────
      case "welcome":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              flex: 1,
              justifyContent: "center",
              padding: "0 8px",
            }}
          >
            {/* animated calorie ring hint */}
            <div
              style={{
                position: "relative",
                width: 120,
                height: 120,
                marginBottom: 32,
              }}
            >
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={C.border}
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={C.accent}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="220 314"
                  style={{
                    transition:
                      "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1) 0.5s",
                    filter: `drop-shadow(0 0 8px ${C.accentGlow})`,
                  }}
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={C.accent}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="0 314"
                  style={{
                    animation:
                      "xpFill 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s forwards",
                    strokeDasharray: "220 314",
                    filter: `drop-shadow(0 0 8px ${C.accentGlow})`,
                  }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: F.head,
                    fontSize: 28,
                    fontWeight: 900,
                    color: C.accent,
                    animation: "bounceIn 0.6s ease 0.8s both",
                    opacity: 0,
                  }}
                >
                  K
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: F.head,
                fontSize: 30,
                fontWeight: 900,
                color: C.text,
                lineHeight: 1.1,
                marginBottom: 12,
                animation: "fadeUp 0.5s ease 0.4s both",
              }}
            >
              Welcome to
              <br />
              <span style={{ color: C.accent }}>Kalori</span>
            </div>

            <div
              style={{
                fontFamily: F.body,
                fontSize: 14,
                color: C.soft,
                lineHeight: 1.7,
                marginBottom: 8,
                animation: "fadeUp 0.5s ease 0.5s both",
              }}
            >
              Track your meals, hit your goals, and level up your health — one
              day at a time.
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 12,
                animation: "fadeUp 0.5s ease 0.6s both",
              }}
            >
              {[
                { icon: "🍽️", label: "Log meals" },
                { icon: "⚡", label: "Earn XP" },
                { icon: "🔥", label: "Build streaks" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <Mono size={7} color={C.muted}>
                    {label.toUpperCase()}
                  </Mono>
                </div>
              ))}
            </div>
          </div>
        );

      // ── Profile ─────────────────────────────────────────────
      case "profile":
        return (
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 22,
                fontWeight: 900,
                color: C.text,
                marginBottom: 6,
              }}
            >
              What's your name?
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 13,
                color: C.soft,
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              We'll use this to personalize your experience.
            </div>

            <Field
              label="Your Name"
              value={form.name}
              onChange={(v) => set("name", v)}
              placeholder="e.g. Maria"
              error={errors.name}
            />

            {/* avatar preview */}
            {form.name && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 28,
                  animation: "bounceIn 0.4s ease both",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: F.head,
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#000",
                    boxShadow: `0 0 30px ${C.accentGlow}`,
                  }}
                >
                  {form.name[0].toUpperCase()}
                </div>
              </div>
            )}
          </div>
        );

      // ── Body stats ───────────────────────────────────────────
      case "body":
        return (
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 22,
                fontWeight: 900,
                color: C.text,
                marginBottom: 6,
              }}
            >
              Body Stats
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 13,
                color: C.soft,
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              Used to calculate your recommended calorie goal. You can change
              these anytime.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field
                label="Age"
                type="number"
                value={form.age}
                onChange={(v) => set("age", v)}
                placeholder="e.g. 25"
                unit="yrs"
                error={errors.age}
              />
              <Field
                label="Weight"
                type="number"
                value={form.weight}
                onChange={(v) => set("weight", v)}
                placeholder="e.g. 70"
                unit="kg"
                error={errors.weight}
              />
              <Field
                label="Height"
                type="number"
                value={form.height}
                onChange={(v) => set("height", v)}
                placeholder="e.g. 175"
                unit="cm"
                error={errors.height}
              />
            </div>
          </div>
        );

      // ── Goals ────────────────────────────────────────────────
      case "goals":
        return (
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 22,
                fontWeight: 900,
                color: C.text,
                marginBottom: 6,
              }}
            >
              What's your goal?
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 13,
                color: C.soft,
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              This helps us set the right calorie targets for you.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {GOALS.map(({ key, label, sub, color }) => (
                <Chip
                  key={key}
                  label={label}
                  sub={sub}
                  selected={form.goal === key}
                  onSelect={() => set("goal", key)}
                  color={color}
                />
              ))}
            </div>
          </div>
        );

      // ── Activity ─────────────────────────────────────────────
      case "activity":
        return (
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 22,
                fontWeight: 900,
                color: C.text,
                marginBottom: 6,
              }}
            >
              Activity Level
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 13,
                color: C.soft,
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              How active are you on a typical day?
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ACTIVITY_LEVELS.map(({ key, label, sub }) => (
                <Chip
                  key={key}
                  label={label}
                  sub={sub}
                  selected={form.activity_level === key}
                  onSelect={() => set("activity_level", key)}
                />
              ))}
            </div>
          </div>
        );

      // ── Game intro ───────────────────────────────────────────
      case "game":
        return (
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 22,
                fontWeight: 900,
                color: C.text,
                marginBottom: 6,
              }}
            >
              How it works
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 13,
                color: C.soft,
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              Kalori turns healthy habits into a game. Here's what to expect.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  icon: "⚡",
                  color: C.accent,
                  title: "Earn XP",
                  body: "Log meals, hit your calorie goal, and drink enough water to earn XP and level up.",
                },
                {
                  icon: "🔥",
                  color: C.orange,
                  title: "Build your streak",
                  body: "Log at least one meal every day to grow your streak. Longer streaks multiply your XP and coins.",
                },
                {
                  icon: "🎯",
                  color: C.blue,
                  title: "Complete quests",
                  body: "Daily and weekly quests give bonus XP and coins. New quests unlock as you level up.",
                },
                {
                  icon: "🪙",
                  color: C.gold,
                  title: "Spend coins",
                  body: "Buy streak shields, XP boosters, themes, and permanent upgrades in the shop.",
                },
              ].map(({ icon, color, title, body }, i) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 14,
                    padding: "14px",
                    animation: `fadeUp 0.4s ease ${i * 80}ms both`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      flexShrink: 0,
                      background: alpha(color, 9),
                      border: `1px solid ${alpha(color, 19)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: F.body,
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.text,
                        marginBottom: 3,
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        fontFamily: F.body,
                        fontSize: 12,
                        color: C.soft,
                        lineHeight: 1.5,
                      }}
                    >
                      {body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ── Done ─────────────────────────────────────────────────
      case "done":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              flex: 1,
              justifyContent: "center",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                fontSize: 56,
                marginBottom: 20,
                animation: "bounceIn 0.6s ease both",
              }}
            >
              🎉
            </div>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 26,
                fontWeight: 900,
                color: C.text,
                marginBottom: 10,
                animation: "fadeUp 0.4s ease 0.2s both",
              }}
            >
              You're all set,{" "}
              <span style={{ color: C.accent }}>{form.name.split(" ")[0]}</span>
              !
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 14,
                color: C.soft,
                lineHeight: 1.7,
                marginBottom: 28,
                animation: "fadeUp 0.4s ease 0.3s both",
              }}
            >
              Your profile is ready. Start logging meals to earn your first XP
              and build your streak.
            </div>

            {/* mini stats preview */}
            <div
              style={{
                display: "flex",
                gap: 10,
                width: "100%",
                animation: "fadeUp 0.4s ease 0.4s both",
              }}
            >
              {[
                {
                  label: "Calorie Goal",
                  value: `${form.calorie_goal}`,
                  unit: "kcal",
                  color: C.accent,
                },
                {
                  label: "Water Goal",
                  value: `${form.water_goal}`,
                  unit: "L",
                  color: C.blue,
                },
                { label: "Level", value: "1", unit: "XP 0", color: C.gold },
              ].map(({ label, value, unit, color }) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "12px 8px",
                    textAlign: "center",
                  }}
                >
                  <Mono size={7} color={C.mutedLight}>
                    {label}
                  </Mono>
                  <div
                    style={{
                      fontFamily: F.head,
                      fontSize: 18,
                      fontWeight: 900,
                      color,
                      marginTop: 4,
                    }}
                  >
                    {value}
                  </div>
                  <Mono size={7} color={C.muted}>
                    {unit}
                  </Mono>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Button label ─────────────────────────────────────────────
  const buttonLabel = () => {
    if (currentStep === "welcome") return "GET STARTED";
    if (currentStep === "done")
      return saving ? "SETTING UP..." : "START TRACKING";
    return "CONTINUE";
  };

  const handleNext = () => {
    if (currentStep === "done") {
      handleFinish();
      return;
    }
    next();
  };

  const showBack = step > 0 && currentStep !== "done";
  const showDots = currentStep !== "welcome" && currentStep !== "done";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "fixed",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: C.accent,
          opacity: 0.04,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          minHeight: "80vh",
        }}
      >
        {/* progress bar */}
        {showDots && (
          <div style={{ marginBottom: 24, animation: "fadeIn 0.3s ease both" }}>
            <AnimBar
              pct={((step - 1) / (STEPS.length - 3)) * 100}
              color={C.accent}
              height={3}
              delay={0}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Mono size={7} color={C.muted}>
                STEP {step} OF {STEPS.length - 2}
              </Mono>
              <Mono size={7} color={C.accent}>
                {Math.round(((step - 1) / (STEPS.length - 3)) * 100)}%
              </Mono>
            </div>
          </div>
        )}

        {/* step content */}
        <div
          key={step}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            animation: "fadeUp 0.3s ease both",
          }}
        >
          {renderStep()}
        </div>

        {/* nav buttons */}
        <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
          {showBack && (
            <div
              onClick={back}
              className="hover-btn press"
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                flexShrink: 0,
                background: C.card,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.soft}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </div>
          )}
          <div
            onClick={!saving ? handleNext : undefined}
            className="hover-btn press"
            style={{
              flex: 1,
              background: saving ? C.accentDim : C.accent,
              borderRadius: 12,
              padding: "14px",
              textAlign: "center",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: saving ? "none" : `0 0 24px ${C.accentGlow}`,
              transition: "all 0.2s",
              minHeight: 48,
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 700,
                color: saving ? C.accent : "#000",
              }}
            >
              {buttonLabel()}
            </span>
          </div>
        </div>

        {/* skip — only on game intro */}
        {currentStep === "game" && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <span
              onClick={next}
              className="press"
              style={{
                fontFamily: F.mono,
                fontSize: 8,
                color: C.muted,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              SKIP →
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
