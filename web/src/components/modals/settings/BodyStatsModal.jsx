import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { C, F } from "../../../lib/constants";
import { Mono } from "../../../components/shared/Primitives";
import { useUser } from "../../../hooks/useUser";
import { calculateTargets, calcMacros } from "../../../lib/macroCalc";
import { useNotifications } from "../../../context/NotificationContext";

export default function BodyStatsModal({ handleClose }) {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const { addNotification } = useNotifications();

  const [form, setForm] = useState({
    weight: "",
    weight_unit: "kg",
    height: "",
    height_unit: "cm",
    age: "",
    sex: "male",
    activity_level: "moderate",
    goal: "maintain",
  });

  useEffect(() => {
    if (user?.settings) {
      setForm({
        weight: user.settings.weight || "",
        weight_unit: user.settings.weight_unit || "kg",
        height: user.settings.height || "",
        height_unit: user.settings.height_unit || "cm",
        age: user.age || "",
        sex: user.settings.sex || "male",
        activity_level: user.settings.activity_level || "moderate",
        goal: user.settings.weight_goal || "maintain",
      });
    }
  }, [user]);

  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

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
  };

  const handleSave = async () => {
    const weight = Number(form.weight);
    const weightKg = form.weight_unit === "lbs" ? weight * 0.453592 : weight;
    const height = Number(form.height);
    const heightCm = form.height_unit === "ft" ? height * 30.48 : height;
    
    const age = Number(form.age);
    
    if (!form.age || isNaN(age) || age < 13 || age > 120) {
      addNotification({ type: "error", name: "Age must be between 13 and 120" });
      return;
    }
    if (!form.weight || isNaN(weight) || weightKg < 20 || weightKg > 300) {
      addNotification({ type: "error", name: form.weight_unit === "lbs" ? "Weight must be between 44 and 660 lbs" : "Weight must be between 20 and 300 kg" });
      return;
    }
    if (!form.height || isNaN(height) || heightCm < 100 || heightCm > 250) {
      addNotification({ type: "error", name: form.height_unit === "ft" ? "Height must be between 3.3 and 8.2 ft" : "Height must be between 100 and 250 cm" });
      return;
    }

    try {
      setLoading(true);
      const { calories, water } = calculateTargets({
        weight: weightKg,
        height: heightCm,
        age: Number(form.age),
        sex: form.sex,
        activity_level: form.activity_level,
        goal: form.goal,
      });

      const macros = calcMacros({
        weight: weightKg,
        calories,
        goal: form.goal,
      });

      const goalsChanged =
        user?.settings?.weight_goal !== form.goal ||
        user?.settings?.activity_level !== form.activity_level ||
        Number(user?.settings?.weight) !== weight ||
        Number(user?.settings?.height) !== height ||
        Number(user?.age) !== age;

      await updateUser({
        age: Number(form.age),
        settings: {
          ...user.settings,
          weight: form.weight ? Number(form.weight) : undefined,
          weight_unit: form.weight_unit,
          height: form.height ? Number(form.height) : undefined,
          height_unit: form.height_unit,
          sex: form.sex,
          activity_level: form.activity_level,
          weight_goal: form.goal,
        },
        targets: {
          calories,
          water,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
        },
      });
      if (goalsChanged) {
        addNotification({ type: "success", name: "Goals updated" });
      } else {
        addNotification({ type: "success", name: "Stats updated successfully!" });
      }
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          fontFamily: F.head,
          fontSize: 20,
          fontWeight: 900,
          color: C.text,
          marginBottom: 20,
        }}
      >
        {t("settings.bodyMeasurements")}
      </div>

      <div style={{ marginBottom: 16 }}>
        <Mono size={8} color={C.mutedLight}>{t("onboarding.stepSex")}</Mono>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {["male", "female"].map((s) => (
            <div
              key={s}
              onClick={() => set("sex", s)}
              style={{
                flex: 1,
                padding: "12px",
                textAlign: "center",
                borderRadius: 10,
                border: `1px solid ${form.sex === s ? C.accent : C.border}`,
                background: form.sex === s ? C.accent + "20" : C.card,
                cursor: "pointer",
                fontFamily: F.body,
                fontSize: 14,
                fontWeight: 600,
                color: C.text,
                textTransform: "capitalize",
              }}
            >
              {s === "male" ? t("onboarding.sexMale") : t("onboarding.sexFemale")}
            </div>
          ))}
        </div>
      </div>

      {/* weight / height / age — stack vertically on mobile */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div style={{ marginBottom: 6 }}>
          <Mono size={8} color={C.mutedLight}>Weight Unit</Mono>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {["kg", "lbs"].map((u) => (
              <div
                key={u}
                onClick={() => handleWeightUnitChange(u)}
                style={{
                  flex: 1,
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: 10,
                  border: `1px solid ${form.weight_unit === u ? C.accent : C.border}`,
                  background: form.weight_unit === u ? C.accent + "20" : C.card,
                  cursor: "pointer",
                  fontFamily: F.body,
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                {u}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 6 }}>
          <Mono size={8} color={C.mutedLight}>Height Unit</Mono>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {["cm", "ft"].map((u) => (
              <div
                key={u}
                onClick={() => handleHeightUnitChange(u)}
                style={{
                  flex: 1,
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: 10,
                  border: `1px solid ${form.height_unit === u ? C.accent : C.border}`,
                  background: form.height_unit === u ? C.accent + "20" : C.card,
                  cursor: "pointer",
                  fontFamily: F.body,
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                {u}
              </div>
            ))}
          </div>
        </div>

        {[
          {
            key: "weight",
            label: t("settings.weight"),
            unit: form.weight_unit,
            placeholder: form.weight_unit === "lbs" ? "e.g. 150" : "e.g. 70",
          },
          {
            key: "height",
            label: t("settings.height"),
            unit: form.height_unit,
            placeholder: form.height_unit === "ft" ? "e.g. 5.9" : "e.g. 175",
          },
        ].map(({ key, label, unit, placeholder }) => (
          <div key={key}>
            <Mono size={8} color={C.mutedLight}>
              {label}
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
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
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
                  {unit}
                </Mono>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        onClick={!loading ? handleSave : undefined}
        className="hover-btn press"
        style={{
          background: loading ? C.accentDim : C.accent,
          borderRadius: 12,
          padding: "14px",
          textAlign: "center",
          cursor: "pointer",
          minHeight: 48,
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
          {loading ? t("settings.saving") : t("settings.saveChanges")}
        </span>
      </div>
    </div>
  );
}
