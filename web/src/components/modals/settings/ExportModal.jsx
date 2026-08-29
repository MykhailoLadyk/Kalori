import { useState } from "react";
import { useTranslation } from "react-i18next";
import { C, F } from "../../../lib/constants";
import { Mono } from "../../../components/shared/Primitives";
import { IconCheck } from "../../../components/shared/DuoIcon";

export default function ExportModal({ handleClose }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(["meals"]);
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const EXPORT_OPTIONS = [
    { key: "meals", label: t("settings.mealLogs"), sub: "All logged meals with macros" },
    { key: "stats", label: t("settings.statistics"), sub: "Weekly and monthly summaries" },
    { key: "profile", label: t("settings.profileData"), sub: "Your account and body stats" },
  ];

  const toggle = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleExport = async () => {
    setExporting(true);
    // export logic here
    await new Promise((r) => setTimeout(r, 1500)); // simulate
    setExporting(false);
    setDone(true);
  };

  return (
    <div>
      <div
        style={{
          fontFamily: F.head,
          fontSize: 20,
          fontWeight: 900,
          color: C.text,
          marginBottom: 8,
        }}
      >
        {t("settings.exportMyData")}
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontSize: 13,
          color: C.soft,
          marginBottom: 20,
        }}
      >
        {t("settings.exportDesc")}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {EXPORT_OPTIONS.map(({ key, label, sub }) => {
          const on = selected.includes(key);
          return (
            <div
              key={key}
              onClick={() => toggle(key)}
              className="press"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: on ? C.accentDim : C.card,
                border: `1px solid ${on ? C.accentMid : C.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: on ? C.accent : "transparent",
                  border: `2px solid ${on ? C.accent : C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {on && (
                  <span className="flex" style={{ color: "#000" }}>
                    <IconCheck size={14} />
                  </span>
                )}
              </div>
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
            </div>
          );
        })}
      </div>

      {done ? (
        <div
          style={{
            background: C.accentDim,
            border: `1px solid ${C.accentMid}`,
            borderRadius: 12,
            padding: "13px",
            textAlign: "center",
          }}
        >
          <span
            className="flex items-center gap-2 justify-center"
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 700,
              color: C.accent,
            }}
          >
            <IconCheck size={14} /> {t("settings.downloaded")}
          </span>
        </div>
      ) : (
        <div
          onClick={!exporting && selected.length > 0 ? handleExport : undefined}
          className="hover-btn press"
          style={{
            background:
              exporting || selected.length === 0 ? C.accentDim : C.accent,
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
              color: exporting ? C.accent : "#000",
            }}
          >
            {exporting ? t("settings.exporting") : t("settings.exportButton")}
          </span>
        </div>
      )}
    </div>
  );
}
