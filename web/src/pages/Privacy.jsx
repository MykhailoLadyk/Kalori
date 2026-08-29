import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { C, F } from "../lib/constants";
import { Mono } from "../components/shared/Primitives";

const ChevronLeft = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export default function Privacy() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sections = t("privacy.sections", { returnObjects: true }) || [];

  return (
    <div
      className="sy"
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "100vh",
        padding: "16px 22px 48px",
        animation: "fadeIn 0.22s ease both",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          onClick={() => navigate(-1)}
          className="press"
          style={{
            width: 36,
            height: 36,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.soft,
            cursor: "pointer",
          }}
        >
          <ChevronLeft />
        </div>
        <div>
          <div style={{ fontFamily: F.head, fontSize: 20, fontWeight: 900, color: C.text }}>
            {t("privacy.title")}
          </div>
          <Mono size={8} color={C.muted}>
            {t("privacy.lastUpdated")}
          </Mono>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 8 }}>
        {Array.isArray(sections) &&
          sections.map(({ title, content }) => (
            <div
              key={title}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontFamily: F.head,
                  fontSize: 15,
                  fontWeight: 800,
                  color: C.text,
                  marginBottom: 8,
                }}
              >
                {title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Array.isArray(content) &&
                  content.map((paragraph, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontFamily: F.body,
                        fontSize: 13,
                        color: C.soft,
                        lineHeight: 1.65,
                      }}
                    >
                      {paragraph}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
