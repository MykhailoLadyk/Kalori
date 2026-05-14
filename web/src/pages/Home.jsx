import { useState } from "react";

import { C, F } from "../lib/constans";

import {
  QuestMealIcon,
  QuestProteinIcon,
  QuestWaterIcon,
  IconCalendar,
} from "../components/shared/DuoIcon";
import { SectionLabel, Stagger } from "../components/shared/Primitives";
import { QuestList } from "../components/shared/QuestList";

import { Modal } from "../components/modals/Modal";
import { DateModal } from "../components/modals/home/DateModal";

import { CalorieRing } from "../components/home/CalorieRing";
import { HomeMacros } from "../components/home/HomeMacros";
import { StreakBanner } from "../components/home/StreakBanner";
import { WaterTracker } from "../components/home/WaterTracker";
import { Meals } from "../components/home/Meals";
export default function Home() {
  const [modal, setModal] = useState(null);
  const modals = {
    datepicker: <DateModal handleClose={() => setModal(null)} />,
  };
  const macros = [
    { label: "Protein", val: 94, max: 150, color: C.blue },
    { label: "Carbs", val: 148, max: 250, color: C.gold },
    { label: "Fat", val: 44, max: 70, color: C.pink },
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
  const meals = {
    Breakfast: [{ n: "Oat Porridge", cal: 320, p: 12, c: 58, f: 6, id: 1 }],
    Lunch: [
      { n: "Chicken & Rice", cal: 520, p: 42, c: 55, f: 8, id: 2 },
      { n: "Greek Yogurt", cal: 120, p: 10, c: 12, f: 3, id: 3 },
    ],
    Dinner: [],
    Snacks: [{ n: "Protein Bar", cal: 210, p: 20, c: 22, f: 7, id: 4 }],
  };
  return (
    <>
      <div
        style={{
          padding: "8px 22px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          animation: "fadeUp 0.4s ease both",
        }}
      >
        <div
          onClick={() => setModal("datepicker")}
          className="hover-btn press"
          style={{
            position: "absolute",
            left: 22,
            width: 36,
            height: 36,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconCalendar size={18} color={C.soft} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 8,
              color: C.mutedLight,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Thursday
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
            February 27, 2025
          </div>
        </div>
      </div>
      <CalorieRing consumed={1700} goal={2000}></CalorieRing>

      <HomeMacros macros={macros} />
      <StreakBanner streak={7} shields={3} />
      <div style={{ padding: "10px 22px 0" }}>
        <SectionLabel delay={400}>Quests</SectionLabel>
        <Stagger baseDelay={450} step={70}>
          <QuestList quests={quests} />
        </Stagger>
      </div>
      <WaterTracker current={2.5} goal={3} onAdd={() => {}} />
      <div style={{ padding: "10px 22px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            animation: "fadeUp 0.4s ease 0.64s both",
          }}
        >
          <SectionLabel>Today's Meals</SectionLabel>
        </div>
        <Meals meals={meals} />
      </div>

      <Modal id={modal} close={() => setModal(null)}>
        {modals[modal]}
      </Modal>
    </>
  );
}
