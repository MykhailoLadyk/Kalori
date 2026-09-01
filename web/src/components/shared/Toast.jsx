import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { C, F, alpha, achievements as achievementDefinitions, quests as questDefinitions } from "../../lib/constants";
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
  IconSparkles,
  IconCrown,
  IconInfo,
} from "./DuoIcon";

const CONFIGS = {
  xp: { color: C.accent, icon: IconLightning, duration: 3000 },
  coins: { color: C.gold, icon: IconCoin, duration: 3000 },
  coins_deducted: { color: C.gold, icon: IconCoin, duration: 3500 },
  quest: { color: C.accent, icon: IconTarget, duration: 5000 },
  achievement: { color: C.gold, icon: IconTrophy, duration: 6500 },
  levelup: { color: C.accent, icon: IconArrowUp, duration: 6500 },
  target: { color: C.accent, icon: IconTarget, duration: 4500 },
  streak: { color: C.orange, icon: IconFire, duration: 5500 },
  success: { color: "#10B981", icon: IconCheck, duration: 4000 },
  error: { color: C.red || "#EF4444", icon: IconX, duration: 4000 },
  info: { color: C.accent, icon: IconInfo, duration: 4000 },
  pro: { color: C.gold, icon: IconCrown, duration: 4500 },
};

function ToastContent({ notification }) {
  const { t } = useTranslation();
  const { type, amount, name, level, days, xp, coins, id } = notification;
  const cfg = CONFIGS[type] ?? CONFIGS.info;
  const color = cfg.color;

  const formatTargetName = (n) => {
    if (!n) return n;
    const lower = n.toLowerCase();
    if (lower.includes("calorie") || lower.includes("kalorii")) return t("onboarding.dailyCalories");
    if (lower.includes("water") || lower.includes("wody")) return t("onboarding.waterTarget");
    if (lower.includes("protein") || lower.includes("białk")) return t("onboarding.proteinTarget");
    if (lower.includes("carb") || lower.includes("węglowodan")) return t("onboarding.carbsTarget");
    if (lower.includes("fat") || lower.includes("tłuszcz")) return t("onboarding.fatTarget");
    return n;
  };

  const formatGenericToast = (n) => {
    if (!n) return n;
    if (n === "Goals updated") return t("stats.goalsUpdated");
    if (n === "Weight logged successfully!") return t("stats.weightLoggedSuccess");
    if (n === "User already registered") return t("auth.errorUserAlreadyRegistered");
    if (n === "Invalid login credentials") return t("auth.errorInvalidCredentials");
    if (n.includes("at least 6 characters")) return t("auth.errorPasswordLength");
    if (n === "Failed to add meal") return t("meal.failedAddMeal", { defaultValue: "Failed to add meal" });
    if (n === "Failed to delete meal") return t("meal.failedDeleteMeal", { defaultValue: "Failed to delete meal" });
    if (n === "Failed to edit meal") return t("meal.failedEditMeal", { defaultValue: "Failed to edit meal" });
    if (n === "Failed to reroll quest") return t("quests.rerollFailed", { defaultValue: "Failed to reroll quest" });
    if (typeof n === "string" && n.startsWith("Need ") && n.includes("coins to reroll")) {
      const match = n.match(/\d+/);
      const cost = match ? match[0] : 20;
      return t("quests.rerollNeedCoins", { cost });
    }
    return t(n, { defaultValue: n });
  };

  // small pill for XP and coins
  if (type === "xp" || type === "coins" || type === "coins_deducted") {
    const isDeducted = type === "coins_deducted" || (amount && amount < 0);
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
          {name || `${isDeducted ? amount : `+${amount}`} ${type === "xp" ? "XP" : t("common.coins")}`}
        </span>
      </div>
    );
  }

  // target reached card
  if (type === "target") {
    const targetDisplayName = formatTargetName(name);
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
        <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
          <span className="flex" style={{ color }}><IconTarget size={16} /></span>
          <Mono size={8} color={color}>
            {t("notifs.targetReached")}
          </Mono>
        </div>
        <div className="font-body font-semibold text-primary" style={{ fontSize: 12, marginBottom: 6 }}>
          {targetDisplayName}
        </div>
        <div className="flex" style={{ gap: 8 }}>
          {xp && (
            <Mono size={8} color={C.accent}>
              +{xp} XP
            </Mono>
          )}
          {coins && (
            <Mono size={8} color={C.gold}>
              +{coins} {t("common.coins").toLowerCase()}
            </Mono>
          )}
        </div>
      </div>
    );
  }

  // success / error / info / pro generic toast
  if (type === "success" || type === "error" || type === "info" || type === "pro") {
    const message = formatGenericToast(name);
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
          {message || (type === "success" ? t("common.success") : type === "info" ? t("common.info") : type === "pro" ? "Kalori Pro" : t("common.error"))}
        </span>
      </div>
    );
  }

  // medium card for quest
  if (type === "quest") {
    let questId = id;
    if (!questId && name) {
      const matched = questDefinitions.find((q) => q.name === name || q.description === name);
      if (matched) questId = matched.id;
    }
    const questName = questId ? t("quests_data." + questId + ".name", { defaultValue: name }) : name;
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
            {t("notifs.questComplete")}
          </Mono>
        </div>
        <div className="font-body font-semibold text-primary mb-2" style={{ fontSize: 12, marginBottom: 6 }}>{questName}</div>
        <div className="flex" style={{ gap: 8 }}>
          {xp && (
            <Mono size={8} color={C.accent}>
              +{xp} XP
            </Mono>
          )}
          {coins && (
            <Mono size={8} color={C.gold}>
              +{coins} {t("common.coins").toLowerCase()}
            </Mono>
          )}
        </div>
      </div>
    );
  }

  // larger card for achievement
  if (type === "achievement") {
    let achId = id;
    if (!achId && name) {
      const matched = achievementDefinitions.find((a) => a.name === name || a.description === name);
      if (matched) achId = matched.id;
    }
    const achievementName = achId ? t("achievements_data." + achId + ".name", { defaultValue: name }) : name;
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
            {t("notifs.achievementUnlocked")}
          </Mono>
        </div>
        <div className="font-body font-bold text-primary mb-1" style={{ fontSize: 13, marginBottom: 4 }}>{achievementName}</div>
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
          {t("notifs.levelUp")}
        </Mono>
        <div className="flex mt-1" style={{ alignItems: "baseline", gap: 6, marginTop: 4 }}>
          <span className="font-head font-black text-accent" style={{ fontSize: 32, lineHeight: 1 }}>
            {level}
          </span>
          <span className="font-body text-soft" style={{ fontSize: 13 }}>{t("notifs.reached")}</span>
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
              {t("notifs.streakMilestone")}
            </Mono>
            <div className="font-head font-black text-primary mt-1" style={{ fontSize: 16, marginTop: 2 }}>
              {t("notifs.streakDays", { count: days })}
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
