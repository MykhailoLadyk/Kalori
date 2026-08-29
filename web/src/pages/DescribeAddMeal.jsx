import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, alpha } from "../lib/constants";
import { Mono, Tag } from "../components/shared/Primitives";
import analyzeFoodDesc from "../services/analyzeFoodDesc";
import { useUser } from "../hooks/useUser";
import { useGameStats } from "../hooks/useGameStats";
import { useNotifications } from "../context/NotificationContext";
import { IconSparkles, IconCoin, IconCrown } from "../components/shared/DuoIcon";
import { Modal } from "../components/modals/Modal";
import InsufficientCoinsModal from "../components/modals/home/InsufficientCoinsModal";
import { AI_COIN_COST } from "../services/subscriptionService";

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

const Spinner = ({ color = "#000", size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ animation: "spin 1s linear infinite" }}
  >
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function DescribeAddMeal() {
  const navigate = useNavigate();
  const { isPro } = useUser();
  const { gameData, refreshGameData } = useGameStats();
  const { addNotification } = useNotifications();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCoinGate, setShowCoinGate] = useState(false);

  const userCoins = gameData?.coins || 0;

  const loadingSteps = ["Reading description...", "Searching database...", "Estimating calories...", "Calculating macros..."];
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  
  useEffect(() => {
    let interval;
    if (loading && !result) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % loadingSteps.length);
      }, 1500);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading, result]);

  useEffect(() => {
    if (!loading) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    if (!isPro && userCoins < AI_COIN_COST) {
      setShowCoinGate(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const parsed = await analyzeFoodDesc(text);

      // Server already deducted coins atomically for free users
      await refreshGameData();
      if (!isPro) {
        addNotification({ type: "coins_deducted", amount: -AI_COIN_COST, name: `-${AI_COIN_COST} coins (AI Description Scan)` });
      }

      navigate("/add-meal/confirm", { state: { meal: parsed, description: text } });
    } catch (err) {
      if (err.code === "RATE_LIMITED") {
        setError("Daily AI limit reached. Try again tomorrow or add meals manually.");
      } else if (err.code === "INSUFFICIENT_COINS") {
        setShowCoinGate(true);
      } else {
        setError(err.code === "NO_FOOD_DETECTED" ? (err.message || "Couldn't detect food in description.") : (err.message || "Couldn't analyze that. Try being more specific."));
        await refreshGameData();
        if (!isPro) {
          addNotification({ type: "coins_deducted", amount: -AI_COIN_COST, name: `-${AI_COIN_COST} coins (AI Description Scan)` });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="flex flex-col flex-1"
      style={{ animation: "fadeIn 0.22s ease both" }}
    >
      <div className="flex items-center justify-between" style={{ padding: "8px 22px 16px" }}>
        <div className="flex items-center" style={{ gap: 12 }}>
          <div
            onClick={!loading ? () => navigate("/") : undefined}
            className={loading ? "flex items-center justify-center bg-card" : "press flex items-center justify-center bg-card"}
            style={{
              width: 36,
              height: 36,
              border: `1px solid ${C.border}`,
              borderRadius: 11,
              color: C.soft,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.35 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            <ChevronLeft />
          </div>
          <div className="font-head font-black text-primary" style={{ fontSize: 18 }}>
            Describe Meal
          </div>
        </div>

        {/* Pro / Coin pill (Free Tier) */}
        {!isPro && (
          <div
            onClick={!loading ? () => navigate("/premium") : undefined}
            className={loading ? "" : "press"}
            style={{
              background: alpha(C.gold, 12),
              border: `1px solid ${alpha(C.gold, 30)}`,
              borderRadius: 16,
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.4 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            <IconCoin size={13} color={C.gold} />
            <span style={{ fontFamily: F.mono, fontSize: 8, fontWeight: 800, color: C.gold }}>
              50 COINS ({userCoins})
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col" style={{ padding: "0 22px" }}>
        {!result ? (
          <>
            <div className="font-body text-soft" style={{ fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>
              Tell us what you ate in plain language. We'll estimate the
              calories and macros.
            </div>


            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Grilled salmon with rice and steamed vegetables"
              className="w-full bg-card font-body text-primary"
              style={{
                minHeight: 120,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "14px",
                fontSize: 14,
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

            <div className="flex-1" />

            <div
              onClick={!loading && text.trim() ? handleAnalyze : undefined}
              className="hover-btn press flex items-center justify-center"
              style={{
                background: loading || !text.trim() ? C.accentDim : C.accent,
                borderRadius: 12,
                padding: "14px",
                gap: 8,
                cursor: loading ? "not-allowed" : (text.trim() ? "pointer" : "not-allowed"),
                margin: "16px 0",
              }}
            >
              {loading && <Spinner color={C.accent} size={14} />}
              <span className="font-mono font-bold" style={{ fontSize: 11, color: loading ? C.accent : "#000" }}>
                  {loading
                    ? loadingSteps[loadingStepIndex].toUpperCase()
                    : isPro
                    ? "ANALYZE MEAL"
                    : <>ANALYZE MEAL ({AI_COIN_COST} <IconCoin size={11} color="#000" />)</>}
              </span>
            </div>

          </>
        ) : (
          <>
            <div className="font-body text-soft" style={{ fontSize: 13, marginBottom: 14 }}>
              Here's what we found — adjust if needed before saving.
            </div>

            <div
              className="bg-card"
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "16px",
                marginBottom: 16,
              }}
            >
              <div className="font-body font-bold text-primary" style={{ fontSize: 15, marginBottom: 12 }}>
                {result.name}
              </div>
              <div className="flex justify-between" style={{ marginBottom: 12 }}>
                <Mono size={9} color={C.mutedLight}>
                  Calories
                </Mono>
                <span className="font-head font-black text-accent" style={{ fontSize: 18 }}>
                  {result.calories} kcal
                </span>
              </div>
              <div className="flex" style={{ gap: 8 }}>
                {[
                  { l: "Protein", v: result.protein, col: C.blue },
                  { l: "Carbs", v: result.carbs, col: C.gold },
                  { l: "Fat", v: result.fat, col: C.pink },
                ].map(({ l, v, col }) => (
                  <div
                    key={l}
                    className="flex-1 text-center"
                    style={{
                      background: alpha(col, 7),
                      border: `1px solid ${alpha(col, 19)}`,
                      borderRadius: 10,
                      padding: "8px",
                    }}
                  >
                    <Mono size={7} color={col}>
                      {l}
                    </Mono>
                    <div className="font-head text-primary font-extrabold" style={{ fontSize: 14, marginTop: 2 }}>
                      {v}g
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1" />

            <div className="flex" style={{ gap: 10, margin: "16px 0" }}>
              <div
                onClick={() => setResult(null)}
                className="hover-btn press flex-1 bg-card text-center cursor-pointer"
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "14px",
                }}
              >
                <span className="font-mono font-bold" style={{ fontSize: 10, color: C.soft }}>
                  EDIT
                </span>
              </div>
              <div
                onClick={!loading ? handleConfirm : undefined}
                className="hover-btn press flex items-center justify-center"
                style={{
                  flex: 2,
                  background: loading ? C.accentDim : C.accent,
                  borderRadius: 12,
                  padding: "14px",
                  gap: 8,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading && <Spinner color={C.accent} size={14} />}
                <span className="font-mono font-bold" style={{ fontSize: 11, color: loading ? C.accent : "#000" }}>
                  {loading ? "SAVING..." : "ADD MEAL"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal id={showCoinGate} close={() => setShowCoinGate(false)}>
        <InsufficientCoinsModal coins={userCoins} handleClose={() => setShowCoinGate(false)} />
      </Modal>
    </div>
  );
}


