import { useState } from "react";
import { C, F } from "../lib/constans";
import { Modal } from "../components/modals/Modal";
import { CalorieRing } from "../components/home/CalorieRing";
import { IconCalendar } from "../components/shared/DuoIcon";
import { DateModal } from "../components/modals/home/DateModal";
import { HomeMacros } from "../components/home/HomeMacros";
import { StreakBanner } from "../components/home/StreakBanner";
import { WaterTracker } from "../components/home/WaterTracker";
import { QuestList } from "../components/shared/QuestList";
import { SectionLabel, Stagger } from "../components/shared/Primitives";
import {
  QuestMealIcon,
  QuestProteinIcon,
  QuestWaterIcon,
} from "../components/shared/DuoIcon";
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
      <Modal id={modal} close={() => setModal(null)}>
        {modals[modal]}
      </Modal>
    </>
  );
}
