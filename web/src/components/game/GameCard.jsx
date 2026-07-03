import { useState, useEffect } from "react";
import { C, F } from "../../lib/constants";
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
      className="hover-card relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.accentDim}, ${C.pinkDim})`,
        border: `1px solid ${C.accentMid}`,
        borderRadius: 20,
        padding: "18px",
        marginBottom: 14,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          background: C.accent,
          opacity: 0.06,
          filter: "blur(40px)",
          animation: "glowPulse 3s ease infinite",
        }}
      />
      <div className="flex justify-between items-start" style={{ marginBottom: 14 }}>
        <div>
          <div className="font-mono text-muted-light uppercase" style={{ fontSize: 8, letterSpacing: 1.5 }}>
            Level
          </div>
          <div className="font-head font-black text-accent" style={{ fontSize: 52, lineHeight: 1 }}>
            {level}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-muted-light uppercase" style={{ fontSize: 8, letterSpacing: 1.5 }}>
            Total XP
          </div>
          <div className="font-head font-black text-primary" style={{ fontSize: 24 }}>
            {totalXp}
          </div>
          <div className="font-mono text-muted uppercase" style={{ fontSize: 7, letterSpacing: 1.2 }}>
            {remaining} to Level {level + 1}
          </div>
        </div>
      </div>

      <div className="flex justify-between" style={{ marginBottom: 6 }}>
        <div className="font-mono text-soft uppercase" style={{ fontSize: 8, letterSpacing: 1.2 }}>
          {xp} / {xpToNext} XP
        </div>
        <div className="font-mono text-accent uppercase" style={{ fontSize: 8, letterSpacing: 1.2 }}>
          {Math.round(pct)}%
        </div>
      </div>
      <div style={{ height: 8, background: C.border, borderRadius: 8 }}>
        <div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
            boxShadow: `0 0 16px ${C.accentGlow}`,
            width: `${fillWidth}%`,
            transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
      <div className="flex justify-between" style={{ marginTop: 8 }}>
        <span className="font-mono text-muted" style={{ fontSize: 7 }}>LV {level}</span>
        <span className="font-mono text-muted" style={{ fontSize: 7 }}>LV {level + 1}</span>
      </div>
    </div>
  );
}
