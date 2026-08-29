import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  C,
  F,
  achievements as achievementDefinitions,
  levels,
} from "../lib/constants";
import { SectionLabel, Mono, Tag } from "../components/shared/Primitives";
import { IconLock } from "../components/shared/DuoIcon";
import { QuestList } from "../components/shared/QuestList";
import GameCard from "../components/game/GameCard";
import Achievements from "../components/game/Achievements";
import { Modal } from "../components/modals/Modal";
import AchievementsModal from "../components/modals/game/AchievementsModal";
import { StreakBanner } from "../components/game/StreakBanner";
import { useGameStats } from "../hooks/useGameStats";

export default function Game() {
  const { t } = useTranslation();
  const [modal, setModal] = useState(null);

  const {
    gameData,
    achievements: userAchievements,
    quests,
    shopItems,
  } = useGameStats();
  let level = 0;
  for (let [lvl, xp] of Object.entries(levels)) {
    if (gameData.xp_total >= xp) {
      level = parseInt(lvl);
    } else {
      break;
    }
  }

  const cardGameStats = {
    level: level,
    xp: gameData.xp_total - levels[level],
    xpToNext: levels[level + 1] - levels[level],
    streak: gameData.streak,
    streakShields: shopItems.streak_shields,
  };

  const achievementById = new Map(
    (userAchievements || []).map((achievement) => [
      achievement.id,
      achievement,
    ]),
  );
  const achievements = achievementDefinitions.map((achievement) => {
    const userAchievement = achievementById.get(achievement.id);
    const max = achievement.max ?? 1;
    const progress = Math.min(userAchievement?.progress ?? 0, max);
    const done = progress >= max;
    const localizedName = t(`achievements_data.${achievement.id}.name`, achievement.name);
    const localizedDesc = t(`achievements_data.${achievement.id}.desc`, achievement.description);
    return {
      ...achievement,
      ...(userAchievement || {}),
      name: localizedName,
      desc: localizedDesc,
      progress,
      max,
      done,
      unlocked: done,
      pct: max > 0 ? (progress / max) * 100 : 0,
    };
  });

  return (
    <>
      <div style={{ padding: "16px 22px 80px" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            animation: "fadeUp 0.4s ease both",
          }}
        ></div>

        <div style={{ animation: "fadeUp 0.4s ease 0.1s both" }}>
          <GameCard {...cardGameStats} />
        </div>

        <StreakBanner />

        <div style={{ animation: "fadeUp 0.4s ease 0.2s both" }}>
          <Achievements
            achievements={achievements}
            onViewAll={() => setModal("achievements")}
          />
        </div>

        <div style={{ animation: "fadeUp 0.4s ease 0.3s both" }}>
          <SectionLabel>{t("quests.activeQuests")}</SectionLabel>
          {level < 2 ? (
            <div
              style={{
                background: C.card,
                borderRadius: 14,
                padding: "18px",
                border: `1px dashed ${C.border}`,
                textAlign: "center",
                marginTop: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${C.border}60`,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconLock size={22} color={C.mutedLight} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: F.head, fontSize: 15, fontWeight: 800, color: C.text }}>
                  {t("quests.questsLocked")}
                </span>
                <Tag color={C.gold}>Lv 2</Tag>
              </div>
              <Mono size={8} color={C.mutedLight}>
                {t("quests.questsLockedSub")}
              </Mono>
            </div>
          ) : (
            <div style={{ marginTop: 10 }}>
              <QuestList />
            </div>
          )}
        </div>
      </div>

      <Modal id={modal} close={() => setModal(null)}>
        {modal === "achievements" && (
          <AchievementsModal
            achievements={achievements}
            handleClose={() => setModal(null)}
          />
        )}
      </Modal>
    </>
  );
}
