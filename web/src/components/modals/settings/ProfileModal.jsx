import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { C, F } from "../../../lib/constants";
import { Mono } from "../../../components/shared/Primitives";
import { useUser } from "../../../hooks/useUser";
import { useNotifications } from "../../../context/NotificationContext";

import Avatar from "../../../components/shared/Avatar";

export default function ProfileModal({ handleClose }) {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const { addNotification } = useNotifications();

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
      });
    }
  }, [user]);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (form.age) {
      const age = Number(form.age);
      if (age < 13 || age > 120) {
        addNotification({ type: "error", name: "Age must be between 13 and 120" });
        return;
      }
    }
    
    try {
      setLoading(true);
      await updateUser({
        ...form,
        age: form.age ? Number(form.age) : undefined,
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
        {t("settings.profileSettings")}
      </div>

      {/* avatar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Avatar user={{ ...user, name: form.name || user?.name }} size={72} fontSize={32} borderRadius={22} />
      </div>

      {/* fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { key: "name", label: t("settings.name"), type: "text" },
          { key: "email", label: "Email", type: "email" },
          { key: "age", label: t("settings.age"), type: "number" },
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
              maxLength={key === "name" ? 50 : undefined}
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
          {loading ? t("settings.saving") : t("settings.saveChanges")}
        </span>
      </div>
    </div>
  );
}
