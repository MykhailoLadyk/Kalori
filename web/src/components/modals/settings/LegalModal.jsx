import { C, F } from "../../../lib/constans";

const SECTIONS = [
  {
    title: "Terms of Service",
    body: "Welcome to Kalori! By using our app, you agree to track your meals and health data responsibly. Kalori is designed for gamified fitness tracking and general wellness, not as a substitute for professional medical advice. We are not liable for any health decisions, dietary changes, or physical outcomes resulting from your use of the app. Please consult a doctor before starting any new diet or exercise routine.",
  },
  {
    title: "Privacy Policy",
    body: "We value your privacy. Kalori securely stores your dietary goals and meal logs exclusively to provide and improve your tracking experience. We do not sell your personal health data to third parties. Our AI features analyze food descriptions to estimate macros but do not use your personal data for public model training.",
  },
  {
    title: "Open Source",
    body: "Kalori is built on open source technologies including React, Supabase, and Vite. Licenses available on request.",
  },
];

export default function LegalModal({ handleClose }) {
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
        Legal
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SECTIONS.map(({ title, body }) => (
          <div
            key={title}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "14px",
            }}
          >
            <div
              style={{
                fontFamily: F.body,
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                marginBottom: 6,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 12,
                color: C.soft,
                lineHeight: 1.6,
              }}
            >
              {body}
            </div>
          </div>
        ))}
      </div>

      <div
        onClick={handleClose}
        className="hover-btn press"
        style={{
          marginTop: 20,
          background: C.card,
          border: `1px solid ${C.border}`,
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
            color: C.soft,
          }}
        >
          CLOSE
        </span>
      </div>
    </div>
  );
}
