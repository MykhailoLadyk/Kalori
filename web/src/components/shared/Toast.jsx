import { useEffect, useState } from "react";
import { C, F, alpha } from "../../lib/constants";
import { Mono } from "./Primitives";
import {
  IconLightning,
  IconCoin,
  IconTarget,
  IconTrophy,
  IconArrowUp,
  IconFire,
  IconCheck,
  IconX,
} from "./DuoIcon";

const CONFIGS = {
  xp: { color: C.accent, icon: IconLightning, duration: 3000 },
  coins: { color: C.gold, icon: IconCoin, duration: 3000 },
  quest: { color: C.accent, icon: IconTarget, duration: 5000 },
  achievement: { color: C.gold, icon: IconTrophy, duration: 6500 },
  levelup: { color: C.accent, icon: IconArrowUp, duration: 6500 },
  streak: { color: C.orange, icon: IconFire, duration: 5500 },
  success: { color: "#10B981", icon: IconCheck, duration: 4000 },
  error: { color: C.red || "#EF4444", icon: IconX, duration: 4000 },
};

function ToastContent({ notification }) {
  const { type, amount, name, level, days, xp, coins } = notification;
  const cfg = CONFIGS[type] ?? CONFIGS.xp;
  const color = cfg.color;

  // small pill for XP and coins
  if (type === "xp" || type === "coins") {
    return (
      <div
        className="flex items-center bg-panel"
        style={{
          gap: 7,
          border: `1px solid ${alpha(color, 25)}`,
          borderRadius: 10,
          padding: "8px 12px",
          boxShadow: `0 4px 20px ${alpha("#000", 38)}, 0 0 0 1px ${alpha(color, 13)}`,
        }}
      >
        <span className="flex" style={{ color }}><cfg.icon size={16} /></span>
        <span className="font-mono font-bold" style={{ fontSize: 12, color }}>
          +{amount} {type === "xp" ? "XP" : "coins"}
        </span>
      </div>
    );
  }

  // success / error generic toast
  if (type === "success" || type === "error") {
    return (
      <div
        className="flex items-center bg-panel"
        style={{
          gap: 8,
          border: `1px solid ${alpha(color, 25)}`,
          borderRadius: 10,
          padding: "10px 14px",
          boxShadow: `0 4px 20px ${alpha("#000", 38)}`,
        }}
      >
        <span className="flex" style={{ color }}><cfg.icon size={18} /></span>
        <span className="font-body font-semibold text-primary" style={{ fontSize: 13 }}>
          {name || (type === "success" ? "Success" : "Error")}
        </span>
      </div>
    );
  }

  // medium card for quest
  if (type === "quest") {
    return (
      <div
        className="bg-panel"
        style={{
          border: `1px solid ${alpha(color, 25)}`,
          borderRadius: 14,
          padding: "12px 14px",
          minWidth: 200,
          boxShadow: `0 4px 20px ${alpha("#000", 38)}`,
        }}
      >
        <div className="flex items-center mb-2" style={{ gap: 8, marginBottom: 6 }}>
          <span className="flex" style={{ color }}><IconTarget size={16} /></span>
          <Mono size={8} color={color}>
            Quest Complete
          </Mono>
        </div>
        <div className="font-body font-semibold text-primary mb-2" style={{ fontSize: 12, marginBottom: 6 }}>{name}</div>
        <div className="flex" style={{ gap: 8 }}>
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
        className="bg-panel"
        style={{
          border: `1px solid ${alpha(C.gold, 31)}`,
          borderRadius: 14,
          padding: "12px 14px",
          minWidth: 200,
          boxShadow: `0 4px 20px ${alpha("#000", 38)}, 0 0 20px ${alpha(C.gold, 13)}`,
        }}
      >
        <div className="flex items-center mb-2" style={{ gap: 8, marginBottom: 6 }}>
          <span className="flex" style={{ color, animation: "bounceIn 0.5s ease both" }}>
            <IconTrophy size={20} />
          </span>
          <Mono size={8} color={C.gold}>
            Achievement Unlocked
          </Mono>
        </div>
        <div className="font-body font-bold text-primary mb-1" style={{ fontSize: 13, marginBottom: 4 }}>{name}</div>
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
          background: `linear-gradient(135deg, ${alpha(C.accent, 25)}, ${alpha(C.pink, 25)}), ${C.panel}`,
          border: `1px solid ${C.accentMid}`,
          borderRadius: 14,
          padding: "14px 16px",
          minWidth: 210,
          boxShadow: `0 4px 24px ${alpha("#000", 44)}, 0 0 30px ${C.accentGlow}`,
        }}
      >
        <Mono size={8} color={C.mutedLight}>
          Level Up!
        </Mono>
        <div className="flex mt-1" style={{ alignItems: "baseline", gap: 6, marginTop: 4 }}>
          <span className="font-head font-black text-accent" style={{ fontSize: 32, lineHeight: 1 }}>
            {level}
          </span>
          <span className="font-body text-soft" style={{ fontSize: 13 }}>reached</span>
        </div>
      </div>
    );
  }

  // streak milestone
  if (type === "streak") {
    return (
      <div
        className="bg-panel"
        style={{
          border: `1px solid ${alpha(C.orange, 25)}`,
          borderRadius: 14,
          padding: "12px 14px",
          minWidth: 180,
          boxShadow: `0 4px 20px ${alpha("#000", 38)}`,
        }}
      >
        <div className="flex items-center" style={{ gap: 8 }}>
          <span className="flex" style={{ color, animation: "streakBounce 0.6s ease both" }}>
            <IconFire size={24} />
          </span>
          <div>
            <Mono size={8} color={C.orange}>
              Streak Milestone
            </Mono>
            <div className="font-head font-black text-primary mt-1" style={{ fontSize: 16, marginTop: 2 }}>
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
