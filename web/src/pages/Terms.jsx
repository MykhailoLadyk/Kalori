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
    title: "1. Acceptance of Terms",
    content: [
      "By accessing, downloading, or using Kalori (\"the Application\", \"we\", \"us\", or \"our\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, do not use the Application.",
      "You must be at least 13 years old (or the applicable minimum age of digital consent in your jurisdiction) to create an account and use Kalori.",
    ],
  },
  {
    title: "2. Medical & Health Disclaimer",
    content: [
      "Kalori is an informational and educational self-tracking tool designed to assist users in logging dietary intake, macronutrients, water consumption, and related fitness metrics. Kalori is NOT a medical device, healthcare provider, or medical diagnostic service.",
      "No content, calculation, or recommendation provided within the Application constitutes professional medical advice, clinical diagnosis, treatment, or nutritional prescription. Always consult a qualified physician or registered dietitian before starting any diet, caloric deficit/surplus, or fitness routine.",
      "You acknowledge that any reliance on calculations or information provided through the Application is strictly at your own risk.",
    ],
  },
  {
    title: "3. User Accounts & Security",
    content: [
      "To access certain features, you must create an account with a valid email address and secure password. You agree to provide accurate, complete, and updated information.",
      "You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Notify us immediately if you suspect unauthorized access.",
    ],
  },
  {
    title: "4. AI Food Analysis & Macro Estimation",
    content: [
      "Kalori provides AI-assisted features for analyzing food descriptions and photos to estimate caloric and nutritional values. These figures are automated approximations and should not be relied upon as clinically accurate nutritional analyses.",
      "Nutritional content may vary based on portion sizes, preparation methods, ingredients, and brand differences. You are responsible for reviewing and adjusting logged values as necessary.",
    ],
  },
  {
    title: "5. Gamification & Virtual Items",
    content: [
      "Kalori includes gamification elements such as streaks, streak shields, experience points (XP), levels, and virtual coins.",
      "Virtual coins, streak shields, and customizable themes have no real-world monetary value, cannot be redeemed for legal currency, and cannot be transferred outside the Application. We reserve the right to manage, regulate, modify, or eliminate virtual items at our sole discretion.",
    ],
  },
  {
    title: "6. Acceptable Use & Prohibited Conduct",
    content: [
      "You agree not to: (a) reverse engineer, decompile, or attempt to extract source code from the Application; (b) use automated bots, scrapers, or exploits; (c) attempt to bypass authentication or security controls; or (d) use the Application for any unlawful or abusive purpose.",
    ],
  },
  {
    title: "7. Intellectual Property",
    content: [
      "The Application, including its interface design, branding, visual identity, software code, and documentation, is the exclusive property of Kalori and its licensors, protected by intellectual property laws.",
    ],
  },
  {
    title: "8. Disclaimer of Warranties & Limitation of Liability",
    content: [
      "The Application is provided on an \"AS IS\" and \"AS AVAILABLE\" basis without warranties of any kind, either express or implied, including fitness for a particular purpose, uninterrupted operation, or error-free calculations.",
      "To the maximum extent permitted by law, Kalori and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of health data, profits, or goodwill arising out of your use of the Application.",
    ],
  },
  {
    title: "9. Termination",
    content: [
      "We may suspend or terminate your access to the Application at any time, with or without notice, if you breach these Terms. You may terminate your account at any time via Settings → Delete Account.",
    ],
  },
  {
    title: "10. Changes to Terms",
    content: [
      "We reserve the right to modify these Terms at any time. Material updates will be reflected with a revised \"Last Updated\" date. Continued use of the Application following updates constitutes acceptance of the new Terms.",
    ],
  },
  {
    title: "11. Contact",
    content: [
      "If you have questions regarding these Terms of Service, please contact us at support@kalori.app.",
    ],
  },
];

export default function Terms() {
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
            Terms of Service
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
