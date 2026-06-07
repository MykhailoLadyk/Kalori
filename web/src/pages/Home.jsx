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
import { MealAddOptionSelectModal } from "../components/modals/home/MealAddOptionSelectModal";

import { CalorieRing } from "../components/home/CalorieRing";
import { HomeMacros } from "../components/home/HomeMacros";
import { StreakBanner } from "../components/home/StreakBanner";
import { WaterTracker } from "../components/home/WaterTracker";
import { DateSection } from "../components/home/DateSection";
import { Meals } from "../components/home/Meals";

export default function Home() {
  /// State
  const [modal, setModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  /// Modals
  const modals = {
    datepicker: <DateModal date={selectedDate} setDate={setSelectedDate} />,
    select_add_meal: <MealAddOptionSelectModal />,
  };
  /// Mock Data
  const macros = [
    { label: "Protein", val: 0, max: 150, color: C.blue },
    { label: "Carbs", val: 0, max: 250, color: C.gold },
    { label: "Fat", val: 0, max: 70, color: C.pink },
  ];
  const quests = [
    {
      Icon: QuestMealIcon,
      name: "Log 3 meals today",
      xp: 50,
      pct: 0,
      type: "Daily",
      color: C.accent,
    },
    {
      Icon: QuestWaterIcon,
      name: "Drink 2.5L water",
      xp: 30,
      pct: 0,
      type: "Daily",
      color: C.accent,
    },
    {
      Icon: QuestProteinIcon,
      name: "Protein goal 3 days",
      xp: 120,
      pct: 0,
      type: "Weekly",
      color: C.gold,
    },
  ];
  const meals = {
    Breakfast: [
      // {
      //   n: "Oat Porridge",
      //   cal: 320,
      //   p: 12,
      //   c: 58,
      //   f: 6,
      //   id: 1,
      //   type: "Breakfast",
      // },
    ],
    Lunch: [
      // {
      //   n: "Chicken & Rice",
      //   cal: 520,
      //   p: 42,
      //   c: 55,
      //   f: 8,
      //   id: 2,
      //   type: "Lunch",
      // },
      // { n: "Greek Yogurt", cal: 120, p: 10, c: 12, f: 3, id: 3, type: "Lunch" },
    ],
    Dinner: [],
    Snacks: [
      // { n: "Protein Bar", cal: 210, p: 20, c: 22, f: 7, id: 4, type: "Snacks" },
    ],
  };
  const water = { current: 0, goal: 3000 };

  return (
    <>
      <DateSection setModal={setModal} date={selectedDate} />
      <CalorieRing consumed={0} goal={2000}></CalorieRing>

      <HomeMacros macros={macros} />
      <StreakBanner streak={0} shields={0} />
      <div style={{ padding: "10px 22px 0" }}>
        <SectionLabel delay={400}>Quests</SectionLabel>
        <Stagger baseDelay={450} step={70}>
          <QuestList quests={quests} />
        </Stagger>
      </div>
      <WaterTracker
        current={water.current}
        goal={water.goal}
        onAdd={() => {}}
      />
      <div style={{ padding: "12px 22px 0" }}>
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

          <div
            onClick={() => setModal("select_add_meal")}
            className="hover-btn press"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: C.accentDim,
              border: `1px solid ${C.accentMid}`,
              borderRadius: 9,
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 14,
                fontWeight: 300,
                color: C.accent,
                lineHeight: 1,
              }}
            >
              +
            </span>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 8,
                fontWeight: 700,
                color: C.accent,
                letterSpacing: 1,
              }}
            >
              ADD MEAL
            </span>
          </div>
        </div>

        <Meals meals={meals} />
      </div>

      <Modal id={modal} close={() => setModal(null)}>
        {modals[modal]}
      </Modal>
    </>
  );
}
