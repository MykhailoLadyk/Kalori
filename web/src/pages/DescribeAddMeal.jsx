import { useState } from "react";
import { C, F } from "../lib/constans";
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

export default function DescribeAddMeal({ onBack, setMealConfirm }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const parsed = await analyzeMealDescription(text);
      setMealConfirm(parsed);
    } catch (err) {
      setError("Couldn't analyze that. Try being more specific.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      // await addMeal({
      //   ...result,
      //   date: new Date().toISOString().split("T")[0],
      // });
      onBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        animation: "fadeIn 0.22s ease both",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 22px 16px",
        }}
      >
        <div
          onClick={onBack}
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
        <div
          style={{
            fontFamily: F.head,
            fontSize: 18,
            fontWeight: 900,
            color: C.text,
          }}
        >
          Describe Your Meal
        </div>
      </div>

      <div
        style={{
          padding: "0 22px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!result ? (
          <>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 13,
                color: C.soft,
                marginBottom: 14,
                lineHeight: 1.6,
              }}
            >
              Tell us what you ate in plain language. We'll estimate the
              calories and macros.
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Grilled salmon with rice and steamed vegetables"
              style={{
                width: "100%",
                minHeight: 120,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "14px",
                fontFamily: F.body,
                fontSize: 14,
                color: C.text,
                outline: "none",
                resize: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.accent)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />

            {error && (
              <div style={{ marginTop: 12 }}>
                <Mono size={8} color={C.red}>
                  {error}
                </Mono>
              </div>
            )}

            <div style={{ flex: 1 }} />

            <div
              onClick={!loading && text.trim() ? handleAnalyze : undefined}
              className="hover-btn press"
              style={{
                background: loading || !text.trim() ? C.accentDim : C.accent,
                borderRadius: 12,
                padding: "14px",
                textAlign: "center",
                cursor: text.trim() ? "pointer" : "not-allowed",
                margin: "16px 0",
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
                {loading ? "ANALYZING..." : "ANALYZE"}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* result preview */}
            <div
              style={{
                fontFamily: F.body,
                fontSize: 13,
                color: C.soft,
                marginBottom: 14,
              }}
            >
              Here's what we found — adjust if needed before saving.
            </div>

            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "16px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 12,
                }}
              >
                {result.name}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Mono size={9} color={C.mutedLight}>
                  Calories
                </Mono>
                <span
                  style={{
                    fontFamily: F.head,
                    fontSize: 18,
                    fontWeight: 900,
                    color: C.accent,
                  }}
                >
                  {result.calories} kcal
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { l: "Protein", v: result.protein, col: C.blue },
                  { l: "Carbs", v: result.carbs, col: C.gold },
                  { l: "Fat", v: result.fat, col: C.pink },
                ].map(({ l, v, col }) => (
                  <div
                    key={l}
                    style={{
                      flex: 1,
                      background: col + "12",
                      border: `1px solid ${col}30`,
                      borderRadius: 10,
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <Mono size={7} color={col}>
                      {l}
                    </Mono>
                    <div
                      style={{
                        fontFamily: F.head,
                        fontSize: 14,
                        fontWeight: 800,
                        color: C.text,
                        marginTop: 2,
                      }}
                    >
                      {v}g
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ display: "flex", gap: 10, margin: "16px 0" }}>
              <div
                onClick={() => setResult(null)}
                className="hover-btn press"
                style={{
                  flex: 1,
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "14px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.soft,
                  }}
                >
                  EDIT
                </span>
              </div>
              <div
                onClick={!loading ? handleConfirm : undefined}
                className="hover-btn press"
                style={{
                  flex: 2,
                  background: loading ? C.accentDim : C.accent,
                  borderRadius: 12,
                  padding: "14px",
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
                  {loading ? "SAVING..." : "ADD MEAL"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// placeholder — replace with real AI call
async function analyzeMealDescription(text) {
  await new Promise((r) => setTimeout(r, 1200));
  return {
    name: text.length > 30 ? text.slice(0, 30) + "..." : text,
    calories: 450,
    protein: 28,
    carbs: 45,
    fat: 14,
  };
}
