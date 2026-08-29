import { useState } from "react";
import { useTranslation } from "react-i18next";
import { C, F } from "../../../lib/constants";
import { useUser } from "../../../hooks/useUser";
import { IconFlagUK, IconFlagPoland } from "../../shared/DuoIcon";

const LANGUAGES = [
  { code: "en", label: "English", FlagIcon: IconFlagUK },
  { code: "pl", label: "Polski", FlagIcon: IconFlagPoland },
];

export default function LanguageModal({ handleClose }) {
  const { i18n, t } = useTranslation();
  const { user, updateUser } = useUser();
  const [selected, setSelected] = useState(
    i18n.language?.startsWith("pl") ? "pl" : "en"
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await i18n.changeLanguage(selected);
      localStorage.setItem("kalori_lang", selected);
      if (user?.userAuth) {
        await updateUser({ settings: { language: selected } });
      }
      handleClose();
    } catch (err) {
      console.error("Failed to save language:", err);
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
        {t("settings.languageModalTitle")}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {LANGUAGES.map(({ code, label, FlagIcon }) => (
          <div
            key={code}
            onClick={() => setSelected(code)}
            className="press"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: selected === code ? C.accentDim : C.card,
              border: `1px solid ${selected === code ? C.accentMid : C.border}`,
              borderRadius: 14,
              padding: "12px 14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FlagIcon size={20} />
            </div>
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
          {loading ? t("common.saving") : t("settings.saveLanguage")}
        </span>
      </div>
    </div>
  );
}
