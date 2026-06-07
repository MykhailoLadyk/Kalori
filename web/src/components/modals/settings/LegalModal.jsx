import { C, F } from "../../../lib/constans";

const SECTIONS = [
  {
    title: "Terms of Service",
    body: "By using Kalori you agree to use it for personal health tracking only. We are not liable for any health decisions made based on the app's data.",
  },
  {
    title: "Privacy Policy",
    body: "We collect only the data necessary to run the app. See the Privacy section for full details on what we collect and how we use it.",
  },
  {
    title: "Open Source",
    body: "Kalori is built on open source technologies including React, Supabase, and Vite. Licenses available on request.",
  },
];

export default function LegalModal({ onClose }) {
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
        onClick={onClose}
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
