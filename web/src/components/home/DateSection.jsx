import { C, F } from "../../lib/constans";
import { IconCalendar } from "../../components/shared/DuoIcon";
import { getDayName, getMonthName } from "../../lib/utils";
export function DateSection({ setModal, date }) {
  const day = getDayName(date);
  const month = getMonthName(date);
  return (
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
          {day}
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
          {month}
          {"  "}
          {date.getDate()}
        </div>
      </div>
    </div>
  );
}
