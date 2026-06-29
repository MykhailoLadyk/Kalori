import { useState } from "react";
import { C, F, alpha } from "../../../lib/constans";
import { useMeals } from "../../../hooks/useMeals";
import { Mono } from "../../shared/Primitives";

const mealTypes = ["breakfast", "lunch", "dinner", "snacks"];

const formTypes = [
  {
    key: "name",
    label: "Name",
    type: "text",
    placeholder: "Chicken & Rice",
  },
  { key: "calories", label: "Calories", type: "number", placeholder: "kcal" },
  { key: "protein", label: "Protein", type: "number", placeholder: "g" },
  { key: "carbs", label: "Carbs", type: "number", placeholder: "g" },
  { key: "fat", label: "Fat", type: "number", placeholder: "g" },
];

export function MealEditModal({ meal, handleClose }) {
  const { updateMeal, loading } = useMeals();
  const [form, setForm] = useState({
    name: meal?.name ?? "",
    calories: meal?.calories ?? "",
    protein: meal?.protein ?? "",
    carbs: meal?.carbs ?? "",
    fat: meal?.fat ?? "",
    type: meal?.type ?? "breakfast",
  });

  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";

    const numericKeys = ["calories", "protein", "carbs", "fat"];
    numericKeys.forEach((k) => {
      const val = form[k];
      const n = Number(val);
      if (val === "" || val === null || val === undefined || isNaN(n)) {
        newErrors[k] = `${k.charAt(0).toUpperCase() + k.slice(1)} is required`;
      } else if (n < 0) {
        newErrors[k] = "Cannot be negative";
      }
    });

    return newErrors;
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key]) setFormErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    const payload = {
      ...form,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
    };

    updateMeal(meal.name, payload);
    handleClose();
  };

  return (
    <div>
      {/* title */}
      <div
        style={{
          fontFamily: F.head,
          fontSize: 20,
          fontWeight: 900,
          color: C.text,
          marginBottom: 20,
        }}
      >
        Edit Meal
      </div>

      {/* meal type selector */}
      <div style={{ marginBottom: 16 }}>
        <Mono size={8} color={C.mutedLight}>
          Meal Type
        </Mono>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {mealTypes.map((type) => (
            <div
              key={type}
              onClick={() => handleChange("type", type)}
              className="press"
              style={{
                flex: 1,
                padding: "7px 0",
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

      {/* fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {formTypes.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Mono size={8} color={C.mutedLight}>
                {label}
              </Mono>
              {formErrors[key] && (
                <Mono size={8} color={C.red}>
                  {formErrors[key]}
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
                border: `1px solid ${formErrors[key] ? alpha(C.red, 50) : C.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily: F.body,
                fontSize: 13,
                color: C.text,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.accent)}
              onBlur={(e) =>
                                (e.target.style.borderColor = formErrors[key]
                  ? alpha(C.red, 50)
                  : C.border)
              }
            />
          </div>
        ))}
      </div>

      {/* submit */}
      <div
        onClick={!loading ? handleSubmit : undefined}
        className="hover-btn press"
        style={{
          marginTop: 16,
          background: loading ? C.accentDim : C.accent,
          borderRadius: 12,
          padding: "13px",
          textAlign: "center",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
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
          {loading ? "SAVING..." : "SAVE CHANGES"}
        </span>
      </div>
    </div>
  );
}
