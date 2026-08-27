import { useNavigate } from "react-router-dom";
import { C, F, alpha } from "../../../lib/constants";
import { Mono } from "../../shared/Primitives";
import { IconCoin, IconSparkles, IconLock } from "../../shared/DuoIcon";
import { AI_COIN_COST } from "../../../services/subscriptionService";

export default function InsufficientCoinsModal({ coins = 0, handleClose }) {
  const navigate = useNavigate();
  const needed = Math.max(0, AI_COIN_COST - coins);

  const handleGoToPremium = () => {
    if (handleClose) handleClose();
    navigate("/premium");
  };

  const handleManualAdd = () => {
    if (handleClose) handleClose();
    navigate("/add-meal/manual");
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: alpha(C.gold, 15),
            border: `1px solid ${alpha(C.gold, 35)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            animation: "pulseGold 2.5s ease infinite",
          }}
        >
          <IconCoin size={32} color={C.gold} />
        </div>

        <div style={{ fontFamily: F.head, fontSize: 20, fontWeight: 900, color: C.text }}>
          50 Coins Required
        </div>
        <div style={{ fontFamily: F.body, fontSize: 13, color: C.soft, marginTop: 6, lineHeight: 1.5, maxWidth: 280 }}>
          AI meal detection costs <strong style={{ color: C.gold }}>50 coins</strong> per scan for free tier accounts.
        </div>
      </div>

      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "16px",
          marginBottom: 18,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Mono size={8} color={C.mutedLight}>YOUR BALANCE</Mono>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 4 }}>
            <IconCoin size={16} color={C.gold} />
            <span style={{ fontFamily: F.head, fontSize: 18, fontWeight: 900, color: C.text }}>
              {coins}
            </span>
          </div>
        </div>

        <div style={{ width: 1, height: 32, background: C.border }} />

        <div style={{ textAlign: "center" }}>
          <Mono size={8} color={C.mutedLight}>REQUIRED</Mono>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 4 }}>
            <IconCoin size={16} color={C.gold} />
            <span style={{ fontFamily: F.head, fontSize: 18, fontWeight: 900, color: C.gold }}>
              {AI_COIN_COST}
            </span>
          </div>
        </div>
      </div>

      {/* Pro Value Proposition Box */}
      <div
        onClick={handleGoToPremium}
        className="hover-card press"
        style={{
          background: `linear-gradient(135deg, ${alpha(C.accent, 15)}, ${alpha(C.gold, 10)})`,
          border: `1px solid ${alpha(C.accent, 35)}`,
          borderRadius: 16,
          padding: "14px 16px",
          marginBottom: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: alpha(C.accent, 20),
            border: `1px solid ${alpha(C.accent, 40)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconSparkles size={22} color={C.accent} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.head, fontSize: 14, fontWeight: 800, color: C.text }}>
            Get Kalori Pro
          </div>
          <div style={{ fontFamily: F.body, fontSize: 11, color: C.soft, marginTop: 2 }}>
            High daily limit (100 AI scans/day) with zero coin costs.
          </div>
        </div>
        <span style={{ color: C.accent, fontSize: 18, fontWeight: "bold" }}>›</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          type="button"
          onClick={handleGoToPremium}
          className="hover-btn press"
          style={{
            width: "100%",
            background: C.accent,
            border: "none",
            borderRadius: 12,
            padding: "14px",
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 800,
            color: "#000",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <IconSparkles size={16} color="#000" />
          <span>VIEW PRO PLANS</span>
        </button>

        <button
          type="button"
          onClick={handleManualAdd}
          className="hover-btn press"
          style={{
            width: "100%",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "14px",
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 700,
            color: C.soft,
            cursor: "pointer",
          }}
        >
          LOG MANUALLY (FREE)
        </button>
      </div>
    </div>
  );
}
