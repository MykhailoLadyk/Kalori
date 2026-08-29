import { useState, useEffect } from "react";
import { C, F, alpha } from "../../../lib/constants";
import { Mono } from "../../../components/shared/Primitives";
import { useUser } from "../../../hooks/useUser";

const SYSTEMS = [
  {
    key: "metric",
    label: "Metric",
    sub: "kg, cm, ml",
    units: { weight: "kg", height: "cm", liquid: "ml" },
  },
  {
    key: "imperial",
    label: "Imperial",
    sub: "lbs, ft, fl oz",
    units: { weight: "lbs", height: "ft", liquid: "fl oz" },
  },
];

export default function MeasurementsModal({ handleClose }) {
  const { user, updateUser } = useUser();
  const [selected, setSelected] = useState(
    user?.settings?.measurement_system || "metric",
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updates = {
        measurement_system: selected,
        weight_unit: selected === "imperial" ? "lbs" : "kg",
        height_unit: selected === "imperial" ? "ft" : "cm",
      };

      if (user?.settings?.weight) {
        const currentWeightUnit = user?.settings?.weight_unit || "kg";
        const targetWeightUnit = updates.weight_unit;
        if (currentWeightUnit !== targetWeightUnit) {
          const w = Number(user.settings.weight);
          if (w > 0) {
            updates.weight = targetWeightUnit === "lbs"
              ? Math.round((w / 0.453592) * 10) / 10
              : Math.round((w * 0.453592) * 10) / 10;
          }
        }
      }

      if (user?.settings?.height) {
        const currentHeightUnit = user?.settings?.height_unit || "cm";
        const targetHeightUnit = updates.height_unit;
        if (currentHeightUnit !== targetHeightUnit) {
          const h = Number(user.settings.height);
          if (h > 0) {
            updates.height = targetHeightUnit === "ft"
              ? Math.round((h / 30.48) * 10) / 10
              : Math.round(h * 30.48);
          }
        }
      }

      await updateUser({
        settings: updates,
      });
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
        Measurements
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {SYSTEMS.map(({ key, label, sub, units }) => (
          <div
            key={key}
            onClick={() => setSelected(key)}
            className="press"
            style={{
              background: selected === key ? C.accentDim : C.card,
              border: `1px solid ${selected === key ? C.accentMid : C.border}`,
              borderRadius: 14,
              padding: "16px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                {label}
              </div>
              {selected === key && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.accent,
                  }}
                />
              )}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.values(units).map((unit) => (
                <div
                  key={unit}
                  style={{
                    background: selected === key ? C.accentMid : C.panel,
                    border: `1px solid ${
                      selected === key ? alpha(C.accent, 25) : C.border
                    }`,
                    borderRadius: 7,
                    padding: "3px 8px",
                  }}
                >
                  <Mono size={8} color={selected === key ? C.accent : C.muted}>
                    {unit}
                  </Mono>
                </div>
              ))}
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
          {loading ? "SAVING..." : "SAVE"}
        </span>
      </div>
    </div>
  );
}
