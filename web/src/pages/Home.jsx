import { CalorieRing } from "../components/home/CalorieRing";
import { IconCalendar } from "../components/shared/DuoIcon";
import { C, F } from "../lib/constans";
import { Modal } from "../components/modals/Modal";
import { useState } from "react";
import { DateModal } from "../components/modals/home/DateModal";
import { HomeMacros } from "../components/home/HomeMacros";
import { StreakBanner } from "../components/home/StreakBanner";
import { WaterTracker } from "../components/home/WaterTracker";
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
      <WaterTracker current={2.5} goal={3} onAdd={() => {}} />
      <Modal id={modal} close={() => setModal(null)}>
        {modals[modal]}
      </Modal>
    </>
  );
}
