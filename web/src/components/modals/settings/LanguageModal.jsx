import { useState } from "react";
import { C, F } from "../../../lib/constans";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pl", label: "Polish", flag: "🇵🇱" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "uk", label: "Ukrainian", flag: "🇺🇦" },
];

export default function LanguageModal({ onClose }) {
  const [selected, setSelected] = useState("en");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUser({ language: selected });
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
        Language
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginBottom: 20,
        }}
      >
        {LANGUAGES.map(({ code, label, flag }) => (
          <div
            key={code}
            onClick={() => setSelected(code)}
            className="press"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: selected === code ? C.accentDim : C.card,
              border: `1px solid ${selected === code ? C.accentMid : C.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 20 }}>{flag}</span>
            <span
              style={{
                fontFamily: F.body,
                fontSize: 14,
                fontWeight: 600,
                color: C.text,
                flex: 1,
              }}
            >
              {label}
            </span>
            {selected === code && (
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
          {loading ? "SAVING..." : "SAVE LANGUAGE"}
        </span>
      </div>
    </div>
  );
}
