import { C, F } from "../../../lib/constans";

const SECTIONS = [
  {
    title: "Data We Collect",
    body: "We collect meal logs, calorie goals, body stats, and usage data to provide and improve the app experience.",
  },
  {
    title: "How We Use It",
    body: "Your data is used solely to power your personal dashboard and improve app features. We never sell your data.",
  },
  {
    title: "Data Storage",
    body: "All data is stored securely via Supabase with row-level security. Only you can access your own data.",
  },
  {
    title: "Deletion",
    body: "You can delete all your data at any time from Settings → Delete Account. Deletion is permanent and immediate.",
  },
];

export default function PrivacyModal({ onClose }) {
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
        Privacy
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
