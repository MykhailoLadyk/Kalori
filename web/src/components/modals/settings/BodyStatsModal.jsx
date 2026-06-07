import { useState } from "react";
import { C, F } from "../../../lib/constans";
import { Mono } from "../../../components/shared/Primitives";

export default function BodyStatsModal({ onClose }) {
  const [form, setForm] = useState({
    weight: "",
    height: "",
    age: "",
    activity_level: "moderate",
    goal: "maintain",
  });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUser({
        weight: Number(form.weight),
        height: Number(form.height),
        age: Number(form.age),
        activity_level: form.activity_level,
        goal: form.goal,
      });
      onClose();
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
        Body Stats
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
        {[
          {
            key: "weight",
            label: "Weight",
            unit: "kg",
            placeholder: "e.g. 70",
          },
          {
            key: "height",
            label: "Height",
            unit: "cm",
            placeholder: "e.g. 175",
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
          {loading ? "SAVING..." : "SAVE STATS"}
        </span>
      </div>
    </div>
  );
}
