import { useState } from "react";
import { C, F } from "../../../lib/constans";
import { Mono } from "../../../components/shared/Primitives";
import { useUser } from "../../../hooks/useUser";

const TIMEZONES = [
  { value: "UTC-5", label: "Eastern Time", sub: "UTC−5 · New York" },
  { value: "UTC-6", label: "Central Time", sub: "UTC−6 · Chicago" },
  { value: "UTC-7", label: "Mountain Time", sub: "UTC−7 · Denver" },
  { value: "UTC-8", label: "Pacific Time", sub: "UTC−8 · Los Angeles" },
  { value: "UTC+0", label: "London", sub: "UTC+0 · GMT" },
  { value: "UTC+1", label: "Warsaw", sub: "UTC+1 · CET" },
  { value: "UTC+2", label: "Kiev", sub: "UTC+2 · EET" },
  { value: "UTC+3", label: "Moscow", sub: "UTC+3 · MSK" },
];

export default function TimezoneModal({ onClose }) {
  const [selected, setSelected] = useState("UTC+1");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUser({ timezone: selected });
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
        Timezone
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginBottom: 20,
        }}
      >
        {TIMEZONES.map(({ value, label, sub }) => (
          <div
            key={value}
            onClick={() => setSelected(value)}
            className="press"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: selected === value ? C.accentDim : C.card,
              border: `1px solid ${selected === value ? C.accentMid : C.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              cursor: "pointer",
              transition: "all 0.2s",
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
            {selected === value && (
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
          {loading ? "SAVING..." : "SAVE TIMEZONE"}
        </span>
      </div>
    </div>
  );
}
