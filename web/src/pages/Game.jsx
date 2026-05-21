import { useState } from "react";
import { C, F } from "../lib/constans";
import { SectionLabel } from "../components/shared/Primitives";
import { QuestList } from "../components/shared/QuestList";
import {
  QuestMealIcon,
  QuestProteinIcon,
  QuestWaterIcon,
} from "../components/shared/DuoIcon";

import GameCard from "../components/game/GameCard";
import Achievements from "../components/game/Achievements";
import { Modal } from "../components/modals/Modal";
import AchievementsModal from "../components/modals/game/AchievementsModal";

export default function Game() {
  const [modal, setModal] = useState(null);

  const gameStats = {
    level: 12,
    xp: 850,
    xpToNext: 1200,
  };

  const achievements = [
    { name: "Early Bird", unlocked: true, color: C.gold },
    { name: "Protein King", unlocked: true, color: C.blue },
    { name: "Water Lover", unlocked: true, color: C.blue },
    { name: "7 Day Streak", unlocked: false, color: C.orange },
    { name: "Meal Master", unlocked: false, color: C.accent },
  ];

  const quests = [
    {
      Icon: QuestMealIcon,
      name: "Log 3 meals today",
      xp: 50,
      pct: 66,
      type: "Daily",
      color: C.accent,
    },
    {
      Icon: QuestWaterIcon,
      name: "Drink 2.5L water",
      xp: 30,
      pct: 56,
      type: "Daily",
      color: C.accent,
    },
    {
      Icon: QuestProteinIcon,
      name: "Protein goal 3 days",
      xp: 120,
      pct: 33,
      type: "Weekly",
      color: C.gold,
    },
  ];

  return (
    <>
      <div style={{ padding: "16px 22px 80px" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            animation: "fadeUp 0.4s ease both",
          }}
        >
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 8,
              color: C.mutedLight,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Level & Progress
          </div>
          <div
            style={{
              fontFamily: F.head,
              fontSize: 20,
              fontWeight: 900,
              color: C.text,
              marginTop: 2,
            }}
          >
            Game Stats
          </div>
        </div>

        <div style={{ animation: "fadeUp 0.4s ease 0.1s both" }}>
          <GameCard {...gameStats} />
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
            <QuestList quests={quests} />
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
