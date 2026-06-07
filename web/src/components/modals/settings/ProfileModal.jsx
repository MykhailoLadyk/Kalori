import { useState } from "react";
import { C, F } from "../../../lib/constans";
import { Mono } from "../../../components/shared/Primitives";

export default function ProfileModal({ onClose }) {
  // const { user, updateUser } = useUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUser(form);
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
        Profile Settings
      </div>

      {/* avatar */}
      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: F.head,
            fontSize: 30,
            fontWeight: 900,
            color: "#000",
            boxShadow: `0 0 30px ${C.accentGlow}`,
          }}
        >
          {form.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <Mono size={8} color={C.accent} style={{ marginTop: 8 }}>
          CHANGE AVATAR
        </Mono>
      </div> */}

      {/* fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { key: "name", label: "Name", type: "text" },
          { key: "email", label: "Email", type: "email" },
          { key: "age", label: "Age", type: "number" },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <Mono size={8} color={C.mutedLight}>
              {label}
            </Mono>
            <input
              type={type}
              value={form[key]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
              }
              style={{
                width: "100%",
                marginTop: 6,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily: F.body,
                fontSize: 13,
                color: C.text,
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.accent)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
          </div>
        ))}
      </div>

      <div
        onClick={!loading ? handleSave : undefined}
        className="hover-btn press"
        style={{
          marginTop: 20,
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
          {loading ? "SAVING..." : "SAVE CHANGES"}
        </span>
      </div>
    </div>
  );
}
