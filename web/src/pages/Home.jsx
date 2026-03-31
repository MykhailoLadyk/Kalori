import CalorieRing from "../components/home/CalorieRing";
import { IconCalendar } from "../components/shared/DuoIcon";
import { C, F } from "../lib/constans";
import { Modal } from "../components/modals/Modal";
import { useState } from "react";
import { DateModal } from "../components/modals/home/DateModal";
export default function Home() {
  const [modal, setModal] = useState(null);
  const modals = {
    datepicker: <DateModal handleClose={() => setModal(null)} />,
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
      <Modal id={modal} close={() => setModal(null)}>
        {modals[modal]}
      </Modal>
    </>
  );
}
