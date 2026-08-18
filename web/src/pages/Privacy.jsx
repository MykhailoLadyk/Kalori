import { useNavigate } from "react-router-dom";
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

const SECTIONS = [
  {
    title: "1. Overview & Commitment",
    content: [
      "Kalori (\"we\", \"us\", or \"our\") is committed to safeguarding your personal privacy and health data. This Privacy Policy explains what information we collect, how we process and store it, and the rights you retain over your data.",
      "We do NOT sell, rent, trade, or monetize your personal health data to data brokers, advertisers, or third parties.",
    ],
  },
  {
    title: "2. Information We Collect",
    content: [
      "• Account Information: Email address and authentication identifiers when you register.",
      "• Dietary & Nutritional Logs: Meal entries, meal names, custom macro inputs (calories, protein, carbs, fats), and water intake.",
      "• Body Metrics & Targets: Calorie targets, target macros, body weight, height, activity level, and gender (as configured by you).",
      "• Gamification Progress: Streaks, earned XP, level progression, inventory items (shields, themes), and quest achievements.",
      "• Technical Data: Local timezone, device preferences (e.g. selected theme), and error diagnostic logs.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: [
      "We process your data exclusively to:",
      "• Provide core application features (calculating daily caloric balance, macro splits, historical averages, and streaks).",
      "• Synchronize your meal and gamification history securely across your devices.",
      "• Estimate nutritional breakdown when you use AI-assisted text or photo food logging.",
      "• Maintain the security, integrity, and performance of our infrastructure.",
    ],
  },
  {
    title: "4. AI Image & Text Analysis",
    content: [
      "When you submit a meal photograph or text description for estimation, the image/text is processed ephemerally solely to identify food items and estimate macros.",
      "Images and personal food descriptions are NOT used to train public machine learning models and are not permanently archived for advertising purposes.",
    ],
  },
  {
    title: "5. Data Storage & Security",
    content: [
      "Your data is stored in cloud infrastructure powered by Supabase (PostgreSQL) with encryption in transit (HTTPS/TLS) and encryption at rest.",
      "We utilize Row-Level Security (RLS) policies at the database layer to ensure that only your authenticated account can read, write, or modify your personal logs and statistics.",
    ],
  },
  {
    title: "6. Data Sharing & Third Parties",
    content: [
      "We only share data with essential infrastructure service providers necessary to operate the Application (e.g., Supabase for database hosting and authentication). All providers are subject to strict data confidentiality and security obligations.",
      "We do not integrate third-party advertising trackers or sell personal data.",
    ],
  },
  {
    title: "7. User Rights & Data Deletion (GDPR / CCPA)",
    content: [
      "You have full control over your personal data, including the right to:",
      "• Access & Review: View all your logged meals, metrics, and progress in the app.",
      "• Rectification: Edit or update any past meal, macro target, or profile attribute.",
      "• Permanent Erasure: Instantly and permanently delete your account and all associated database records directly within Settings → Delete Account.",
    ],
  },
  {
    title: "8. Data Retention",
    content: [
      "We retain your data only for as long as your account remains active. When you delete your account, all associated records in our database are deleted immediately.",
    ],
  },
  {
    title: "9. Children's Privacy",
    content: [
      "Kalori is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided personal data, we will delete it immediately.",
    ],
  },
  {
    title: "10. Updates to this Policy",
    content: [
      "We may update this Privacy Policy from time to time. The updated version will be indicated by the \"Last updated\" date at the top of this page.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "For questions regarding this Privacy Policy or your personal data rights, contact us at privacy@kalori.app.",
    ],
  },
];

export default function Privacy() {
  const navigate = useNavigate();

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
            Privacy Policy
          </div>
          <Mono size={8} color={C.muted}>
            Last updated: August 2026
          </Mono>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 8 }}>
        {SECTIONS.map(({ title, content }) => (
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
              {content.map((paragraph, idx) => (
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
