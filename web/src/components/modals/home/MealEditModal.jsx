import { useState } from "react";
import { C, F } from "../../../lib/constans";
// import { useMeals } from "../../../hooks/useMeals";
import { Mono } from "../../shared/Primitives";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

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
  const [form, setForm] = useState({
    name: meal?.n ?? "",
    calories: meal?.cal ?? "",
    protein: meal?.p ?? "",
    carbs: meal?.c ?? "",
    fat: meal?.f ?? "",
    type: meal?.type ?? "Breakfast",
  });

  const [formErrors, setFormErrors] = useState({});
  /// Change to loading from context later
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (form.calories < 0) newErrors.calories = "Cannot be negative";
    if (form.protein < 0) newErrors.protein = "Cannot be negative";
    if (form.carbs < 0) newErrors.carbs = "Cannot be negative";
    if (form.fat < 0) newErrors.fat = "Cannot be negative";
    if (!form.calories) newErrors.calories = "Calories are required";
    if (!form.protein) newErrors.protein = "Protein is required";
    if (!form.carbs) newErrors.carbs = "Carbs are required";
    if (!form.fat) newErrors.fat = "Fat is required";
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

    /// Context call here
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
                border: `1px solid ${formErrors[key] ? C.red + "80" : C.border}`,
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
                  ? C.red + "80"
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
