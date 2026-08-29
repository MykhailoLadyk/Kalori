// pages/OnboardingPage.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { C, F, alpha } from "../lib/constants";
import { Mono } from "../components/shared/Primitives";
import { AnimBar } from "../components/shared/AnimBar";
import { useUser } from "../hooks/useUser";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { calcMacros } from "../lib/macroCalc";
import { Modal } from "../components/modals/Modal";
import LanguageModal from "../components/modals/settings/LanguageModal";
import { 
  IconMealPlate, 
  IconLightning, 
  IconFire, 
  IconTarget, 
  IconCoin, 
  IconParty,
  IconGlobe,
  IconFlagUK,
  IconFlagPoland
} from "../components/shared/DuoIcon";

// ── Step indicator ────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div className="flex justify-center gap-1">
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
  maxLength,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div className="flex justify-between mb-1">
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
        className="flex items-center overflow-hidden bg-card"
        style={{
          border: `1px solid ${error ? alpha(C.red, 50) : focused ? C.accent : C.border}`,
          borderRadius: 12,
          transition: "border-color 0.2s",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 input-field"
          style={{ padding: "12px 14px", minHeight: 46 }}
        />
        {unit && (
          <div style={{ padding: "0 14px", borderLeft: `1px solid ${C.border}` }}>
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
      className="press flex items-center justify-between"
      style={{
        background: selected ? alpha(color, 9) : C.card,
        border: `1px solid ${selected ? alpha(color, 38) : C.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <div>
        <div className="font-body font-semibold text-primary" style={{ fontSize: 13 }}>
          {label}
        </div>
        {sub && (
          <Mono size={7} color={C.muted}>
            {sub}
          </Mono>
        )}
      </div>
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${selected ? color : C.border}`,
          background: selected ? color : "transparent",
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

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { updateUser } = useUser();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [langModalOpen, setLangModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    weight: "",
    weight_unit: "kg",
    height: "",
    height_unit: "cm",
    activity_level: "moderate",
    goal: "maintain",
  });

  const activityLevels = [
    { key: "sedentary", label: t("onboarding.actSedentary"), sub: t("onboarding.actSedentarySub") },
    { key: "light", label: t("onboarding.actLight"), sub: t("onboarding.actLightSub") },
    { key: "moderate", label: t("onboarding.actModerate"), sub: t("onboarding.actModerateSub") },
    { key: "active", label: t("onboarding.actActive"), sub: t("onboarding.actActiveSub") },
    { key: "very_active", label: t("onboarding.actVeryActive"), sub: t("onboarding.actVeryActiveSub") },
  ];

  const goals = [
    {
      key: "lose",
      label: t("onboarding.goalLose"),
      sub: t("onboarding.goalLoseSub"),
      color: C.blue,
    },
    {
      key: "maintain",
      label: t("onboarding.goalMaintain"),
      sub: t("onboarding.goalMaintainSub"),
      color: C.accent,
    },
    {
      key: "gain",
      label: t("onboarding.goalGain"),
      sub: t("onboarding.goalGainSub"),
      color: C.gold,
    },
  ];

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleWeightUnitChange = (newUnit) => {
    if (newUnit === form.weight_unit) return;
    setForm((prev) => {
      let newWeight = prev.weight;
      if (prev.weight && !isNaN(Number(prev.weight)) && Number(prev.weight) > 0) {
        const num = Number(prev.weight);
        newWeight = newUnit === "lbs"
          ? String(Math.round((num / 0.453592) * 10) / 10)
          : String(Math.round((num * 0.453592) * 10) / 10);
      }
      return { ...prev, weight_unit: newUnit, weight: newWeight };
    });
    if (errors.weight) setErrors((prev) => ({ ...prev, weight: null }));
  };

  const handleHeightUnitChange = (newUnit) => {
    if (newUnit === form.height_unit) return;
    setForm((prev) => {
      let newHeight = prev.height;
      if (prev.height && !isNaN(Number(prev.height)) && Number(prev.height) > 0) {
        const num = Number(prev.height);
        newHeight = newUnit === "ft"
          ? String(Math.round((num / 30.48) * 10) / 10)
          : String(Math.round(num * 30.48));
      }
      return { ...prev, height_unit: newUnit, height: newHeight };
    });
    if (errors.height) setErrors((prev) => ({ ...prev, height: null }));
  };

  const currentStep = STEPS[step];
  const totalDots = STEPS.length - 2; // exclude welcome + done from dots

  // ── Derived Goals ───────────────────────────────────────────
  let derivedCalories = 2000;
  let derivedWater = 2500;

  if (form.weight && form.height && form.age && form.sex) {
    const weightKg = form.weight_unit === "lbs" ? Number(form.weight) * 0.453592 : Number(form.weight);
    const heightCm = form.height_unit === "ft" ? Number(form.height) * 30.48 : Number(form.height);
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * Number(form.age));
    bmr += form.sex === "female" ? -161 : 5;
    
    let multiplier = 1.2;
    switch (form.activity_level) {
      case "sedentary": multiplier = 1.2; break;
      case "light": multiplier = 1.375; break;
      case "moderate": multiplier = 1.55; break;
      case "active": multiplier = 1.725; break;
      case "very_active": multiplier = 1.9; break;
      default: multiplier = 1.2;
    }
    
    let tdee = bmr * multiplier;
    
    if (form.goal === "lose") tdee -= 500;
    if (form.goal === "gain") tdee += 500;
    
    derivedCalories = Math.max(1200, Math.round(tdee));
    
    let water = Math.round(weightKg * 35);
    derivedWater = Math.max(2000, Math.min(4000, water));
  }

  // ── Validate per step ───────────────────────────────────────
  const validate = () => {
    const e = {};
    if (currentStep === "profile") {
      if (!form.name.trim()) e.name = t("onboarding.required");
    }
    if (currentStep === "body") {
      const age = Number(form.age);
      const weight = Number(form.weight);
      const weightKg = form.weight_unit === "lbs" ? weight * 0.453592 : weight;
      const height = Number(form.height);
      const heightCm = form.height_unit === "ft" ? height * 30.48 : height;

      if (!form.sex) e.sex = t("onboarding.errorSex");
      if (!form.age || age < 13 || age > 120) e.age = t("onboarding.errorAge");
      if (!form.weight || weightKg < 20 || weightKg > 300) e.weight = form.weight_unit === "lbs" ? t("onboarding.errorWeightLbs") : t("onboarding.errorWeightKg");
      if (!form.height || heightCm < 100 || heightCm > 250) e.height = form.height_unit === "ft" ? t("onboarding.errorHeightFt") : t("onboarding.errorHeightCm");
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

      const activeLang = i18n.language?.startsWith("pl") ? "pl" : "en";
      await updateUser({
        name: form.name.trim(),
        age: Number(form.age),
        completedOnboarding: true,
        settings: {
          activity_level: form.activity_level,
          weight_goal: form.goal,
          weight: Number(form.weight),
          weight_unit: form.weight_unit,
          height: Number(form.height),
          height_unit: form.height_unit,
          sex: form.sex,
          language: activeLang,
        },
        targets: {
          calories: derivedCalories,
          water: derivedWater,
          ...calcMacros({ 
            weight: form.weight_unit === "lbs" ? Number(form.weight) * 0.453592 : Number(form.weight), 
            calories: derivedCalories, 
            goal: form.goal 
          }),
        },
      });

      navigate("/");
    } catch (err) {
      console.error("Failed to save onboarding profile:", err);
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
              {t("onboarding.welcomeTitle")}
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
              {t("onboarding.welcomeSubtitle")}
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
                { icon: <IconMealPlate size={24} color={C.accent} />, label: t("onboarding.logMeals") },
                { icon: <IconLightning size={24} color={C.accent} />, label: t("onboarding.earnXP") },
                { icon: <IconFire size={24} color={C.orange} />, label: t("onboarding.buildStreaks") },
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
                  <span className="flex">{icon}</span>
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
              {t("onboarding.nameTitle")}
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
              {t("onboarding.nameSubtitle")}
            </div>

            <Field
              label={t("onboarding.nameLabel")}
              value={form.name}
              onChange={(v) => set("name", v)}
              placeholder={t("onboarding.namePlaceholder")}
              error={errors.name}
              maxLength={50}
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
              {t("onboarding.bodyTitle")}
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
              {t("onboarding.bodySubtitle")}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <Mono size={8} color={C.mutedLight}>{t("onboarding.sexLabel")}</Mono>
                  {errors.sex && <Mono size={8} color={C.red}>{errors.sex}</Mono>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Chip label={t("onboarding.male")} selected={form.sex === "male"} onSelect={() => set("sex", "male")} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Chip label={t("onboarding.female")} selected={form.sex === "female"} onSelect={() => set("sex", "female")} />
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <Mono size={8} color={C.mutedLight}>{t("onboarding.weightUnitLabel")}</Mono>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Chip label="kg" selected={form.weight_unit === "kg"} onSelect={() => handleWeightUnitChange("kg")} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Chip label="lbs" selected={form.weight_unit === "lbs"} onSelect={() => handleWeightUnitChange("lbs")} />
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <Mono size={8} color={C.mutedLight}>{t("onboarding.heightUnitLabel")}</Mono>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Chip label="cm" selected={form.height_unit === "cm"} onSelect={() => handleHeightUnitChange("cm")} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Chip label="ft" selected={form.height_unit === "ft"} onSelect={() => handleHeightUnitChange("ft")} />
                  </div>
                </div>
              </div>

              <Field
                label={t("onboarding.ageLabel")}
                type="number"
                value={form.age}
                onChange={(v) => set("age", v)}
                placeholder={t("onboarding.agePlaceholder")}
                unit={t("common.yrs")}
                error={errors.age}
              />
              <Field
                label={t("onboarding.weightLabel")}
                type="number"
                value={form.weight}
                onChange={(v) => set("weight", v)}
                placeholder={form.weight_unit === "lbs" ? t("onboarding.weightPlaceholderLbs") : t("onboarding.weightPlaceholderKg")}
                unit={form.weight_unit}
                error={errors.weight}
              />
              <Field
                label={t("onboarding.heightLabel")}
                type="number"
                value={form.height}
                onChange={(v) => set("height", v)}
                placeholder={form.height_unit === "ft" ? t("onboarding.heightPlaceholderFt") : t("onboarding.heightPlaceholderCm")}
                unit={form.height_unit}
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
              {t("onboarding.goalTitle")}
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
              {t("onboarding.goalSubtitle")}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {goals.map(({ key, label, sub, color }) => (
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
              {t("onboarding.activityTitle")}
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
              {t("onboarding.activitySubtitle")}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activityLevels.map(({ key, label, sub }) => (
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
              {t("onboarding.howItWorksTitle")}
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
              {t("onboarding.howItWorksSubtitle")}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  icon: <IconLightning size={24} color={C.accent} />,
                  color: C.accent,
                  title: t("onboarding.gameEarnXpTitle"),
                  body: t("onboarding.gameEarnXpBody"),
                },
                {
                  icon: <IconFire size={24} color={C.orange} />,
                  color: C.orange,
                  title: t("onboarding.gameStreakTitle"),
                  body: t("onboarding.gameStreakBody"),
                },
                {
                  icon: <IconTarget size={24} color={C.blue} />,
                  color: C.blue,
                  title: t("onboarding.gameQuestsTitle"),
                  body: t("onboarding.gameQuestsBody"),
                },
                {
                  icon: <IconCoin size={24} color={C.gold} />,
                  color: C.gold,
                  title: t("onboarding.gameCoinsTitle"),
                  body: t("onboarding.gameCoinsBody"),
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
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      background: alpha(color, 15),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
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
              className="flex items-center justify-center text-accent"
              style={{
                marginBottom: 20,
                animation: "bounceIn 0.6s ease both",
              }}
            >
              <IconParty size={64} />
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
              {t("onboarding.doneTitle", { name: form.name.split(" ")[0] })}
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
              {t("onboarding.doneSubtitle")}
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
                  label: t("onboarding.calorieGoal"),
                  value: `${derivedCalories}`,
                  unit: t("common.kcal"),
                  color: C.accent,
                },
                {
                  label: t("onboarding.waterGoal"),
                  value: `${derivedWater}`,
                  unit: t("common.liters"),
                  color: C.blue,
                },
                { label: t("onboarding.level"), value: "1", unit: `${t("common.xp")} 0`, color: C.gold },
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
    if (currentStep === "welcome") return t("onboarding.getStarted");
    if (currentStep === "done")
      return saving ? t("onboarding.settingUp") : t("onboarding.startTracking");
    return t("common.continue");
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
        {/* top bar with globe icon language switcher */}
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: 12 }}>
          <div
            onClick={() => setLangModalOpen(true)}
            className="press hover-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "5px 9px",
              cursor: "pointer",
            }}
          >
            {i18n.language?.startsWith("pl") ? <IconFlagPoland size={13} /> : <IconFlagUK size={13} />}
            <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: C.text }}>
              {i18n.language?.startsWith("pl") ? "PL" : "EN"}
            </span>
          </div>
        </div>

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
                {t("onboarding.stepOf", { current: step, total: STEPS.length - 2 })}
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

      </div>

      <Modal id={langModalOpen} close={() => setLangModalOpen(false)}>
        <LanguageModal handleClose={() => setLangModalOpen(false)} />
      </Modal>
    </div>
  );
}
