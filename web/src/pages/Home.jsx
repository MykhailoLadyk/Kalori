import { useState } from "react";

import { C, F } from "../lib/constants";
import { useMeals } from "../hooks/useMeals";

import { SectionLabel } from "../components/shared/Primitives";

import { Modal } from "../components/modals/Modal";
import { DateModal } from "../components/modals/home/DateModal";
import { MealAddOptionSelectModal } from "../components/modals/home/MealAddOptionSelectModal";

import { CalorieRing } from "../components/home/CalorieRing";
import { HomeMacros } from "../components/home/HomeMacros";
import { WaterTracker } from "../components/home/WaterTracker";
import { DateSection } from "../components/home/DateSection";
import { Meals } from "../components/home/Meals";

export default function Home() {
  const [modal, setModal] = useState(null);
  const { selectedDate, setSelectedDate } = useMeals();
  const modals = {
    datepicker: <DateModal date={selectedDate} setDate={setSelectedDate} />,
    select_add_meal: <MealAddOptionSelectModal setModal={setModal} />,
  };

  return (
    <>
      <DateSection setModal={setModal} date={selectedDate} />
      <CalorieRing />

      <HomeMacros />

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
            <span style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 300, color: C.accent, lineHeight: 1 }}>+</span>
            <span style={{ fontFamily: F.mono, fontSize: 8, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>
              ADD MEAL
            </span>
          </div>
        </div>

        <Meals />
      </div>
      <WaterTracker />

      <Modal id={modal} close={() => setModal(null)}>
        {modals[modal]}
      </Modal>
    </>
  );
}
