import { useState } from "react";
import {
  C,
  achievements as achievementDefinitions,
  levels,
} from "../lib/constans";
import { SectionLabel } from "../components/shared/Primitives";
import { QuestList } from "../components/shared/QuestList";
import GameCard from "../components/game/GameCard";
import Achievements from "../components/game/Achievements";
import { Modal } from "../components/modals/Modal";
import AchievementsModal from "../components/modals/game/AchievementsModal";
import { useGameStats } from "../hooks/useGameStats";

export default function Game() {
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
    return {
      ...achievement,
      ...(userAchievement || {}),
      desc: achievement.description,
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

        <div style={{ animation: "fadeUp 0.4s ease 0.2s both" }}>
          <Achievements
            achievements={achievements}
            onViewAll={() => setModal("achievements")}
          />
        </div>

        <div style={{ animation: "fadeUp 0.4s ease 0.3s both" }}>
          <SectionLabel>Active Quests</SectionLabel>
          <div style={{ marginTop: 10 }}>
            <QuestList />
          </div>
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
