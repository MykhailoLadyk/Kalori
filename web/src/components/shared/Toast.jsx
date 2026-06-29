import { useEffect, useState } from "react";
import { C, F } from "../../lib/constans";
import { Mono } from "./Primitives";

const CONFIGS = {
  xp: { color: C.accent, icon: "⚡", duration: 2000 },
  coins: { color: C.gold, icon: "🪙", duration: 2000 },
  quest: { color: C.accent, icon: "🎯", duration: 3500 },
  achievement: { color: C.gold, icon: "🏆", duration: 5000 },
  levelup: { color: C.accent, icon: "⬆️", duration: 5000 },
  streak: { color: C.orange, icon: "🔥", duration: 4000 },
};

function ToastContent({ notification }) {
  const { type, amount, name, level, days, xp, coins } = notification;
  const cfg = CONFIGS[type] ?? CONFIGS.xp;
  const color = cfg.color;

  // small pill for XP and coins
  if (type === "xp" || type === "coins") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: C.panel,
          border: `1px solid ${color}40`,
          borderRadius: 10,
          padding: "8px 12px",
          boxShadow: `0 4px 20px #00000060, 0 0 0 1px ${color}20`,
        }}
      >
        <span style={{ fontSize: 14 }}>{cfg.icon}</span>
        <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 700, color }}>
          +{amount} {type === "xp" ? "XP" : "coins"}
        </span>
      </div>
    );
  }

  // medium card for quest
  if (type === "quest") {
    return (
      <div
        style={{
          background: C.panel,
          border: `1px solid ${color}40`,
          borderRadius: 14,
          padding: "12px 14px",
          minWidth: 200,
          boxShadow: `0 4px 20px #00000060`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 14 }}>🎯</span>
          <Mono size={8} color={color}>
            Quest Complete
          </Mono>
        </div>
        <div style={{ fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>{name}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {xp && (
            <Mono size={8} color={C.accent}>
              +{xp} XP
            </Mono>
          )}
          {coins && (
            <Mono size={8} color={C.gold}>
              +{coins} coins
            </Mono>
          )}
        </div>
      </div>
    );
  }

  // larger card for achievement
  if (type === "achievement") {
    return (
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.gold}50`,
          borderRadius: 14,
          padding: "12px 14px",
          minWidth: 200,
          boxShadow: `0 4px 20px #00000060, 0 0 20px ${C.gold}20`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 16, animation: "bounceIn 0.5s ease both" }}>🏆</span>
          <Mono size={8} color={C.gold}>
            Achievement Unlocked
          </Mono>
        </div>
        <div style={{ fontFamily: F.body, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{name}</div>
        {xp && (
          <Mono size={8} color={C.accent}>
            +{xp} XP
          </Mono>
        )}
      </div>
    );
  }

  // level up
  if (type === "levelup") {
    return (
      <div
        style={{
          background: `linear-gradient(135deg, ${C.accentDim}, ${C.pinkDim})`,
          border: `1px solid ${C.accentMid}`,
          borderRadius: 14,
          padding: "14px 16px",
          minWidth: 210,
          boxShadow: `0 4px 24px #00000070, 0 0 30px ${C.accentGlow}`,
        }}
      >
        <Mono size={8} color={C.mutedLight}>
          Level Up!
        </Mono>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
          <span style={{ fontFamily: F.head, fontSize: 32, fontWeight: 900, color: C.accent, lineHeight: 1 }}>
            {level}
          </span>
          <span style={{ fontFamily: F.body, fontSize: 13, color: C.soft }}>reached</span>
        </div>
      </div>
    );
  }

  // streak milestone
  if (type === "streak") {
    return (
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.orange}40`,
          borderRadius: 14,
          padding: "12px 14px",
          minWidth: 180,
          boxShadow: `0 4px 20px #00000060`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20, animation: "streakBounce 0.6s ease both" }}>🔥</span>
          <div>
            <Mono size={8} color={C.orange}>
              Streak Milestone
            </Mono>
            <div style={{ fontFamily: F.head, fontSize: 16, fontWeight: 900, color: C.text, marginTop: 2 }}>
              {days} days!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function Toast({ notification }) {
  const cfg = CONFIGS[notification.type] ?? CONFIGS.xp;
  const duration = notification.duration ?? cfg.duration;
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setExiting(true), duration - 400);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <div
      style={{
        animation: exiting
          ? "toastOut 0.4s cubic-bezier(0.4,0,1,1) forwards"
          : "toastIn  0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        pointerEvents: "auto",
      }}
    >
      <ToastContent notification={notification} />
    </div>
  );
}
