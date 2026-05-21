import { useState, useEffect } from "react";
import { C, F } from "../../lib/constans";
import { IconStar } from "../shared/DuoIcon";

export default function GameCard({ level, xp, xpToNext, totalXp = xp }) {
  const [fillWidth, setFillWidth] = useState(0);
  const pct = Math.min((xp / xpToNext) * 100, 100);
  const remaining = Math.max(xpToNext - xp, 0);

  useEffect(() => {
    const timer = setTimeout(() => setFillWidth(pct), 120);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div
      className="hover-card"
      style={{
        background: `linear-gradient(135deg, ${C.accentDim}, ${C.pinkDim})`,
        border: `1px solid ${C.accentMid}`,
        borderRadius: 20,
        padding: "18px",
        marginBottom: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: C.accent,
          opacity: 0.06,
          filter: "blur(40px)",
          animation: "glowPulse 3s ease infinite",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 8,
              color: C.mutedLight,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Level
          </div>
          <div
            style={{
              fontFamily: F.head,
              fontSize: 52,
              fontWeight: 900,
              color: C.accent,
              lineHeight: 1,
            }}
          >
            {level}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 8,
              color: C.mutedLight,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Total XP
          </div>
          <div
            style={{
              fontFamily: F.head,
              fontSize: 24,
              fontWeight: 900,
              color: C.text,
            }}
          >
            {totalXp}
          </div>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 7,
              color: C.muted,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            {remaining} to Level {level + 1}
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: 6,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 8,
            color: C.soft,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          {xp} / {xpToNext} XP
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 8,
            color: C.accent,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          {Math.round(pct)}%
        </div>
      </div>
      <div style={{ height: 8, background: C.border, borderRadius: 8 }}>
        <div
          style={{
            height: "100%",
            borderRadius: 8,
            background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
            boxShadow: `0 0 16px ${C.accentGlow}`,
            width: `${fillWidth}%`,
            transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <span style={{ fontFamily: F.mono, fontSize: 7, color: C.muted }}>
          LV {level}
        </span>
        <span style={{ fontFamily: F.mono, fontSize: 7, color: C.muted }}>
          LV {level + 1}
        </span>
      </div>
    </div>
  );
}
