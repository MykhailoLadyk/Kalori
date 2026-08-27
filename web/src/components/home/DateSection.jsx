import { C, F, flameColorsDefinitions } from "../../lib/constants";
import { IconCalendar, IconFire } from "../../components/shared/DuoIcon";
import { getDayName, getMonthName } from "../../lib/utils";
import { useGameStats } from "../../hooks/useGameStats";
import { useUser } from "../../hooks/useUser";

export function DateSection({ setModal, date }) {
  const day = getDayName(date);
  const month = getMonthName(date);
  const { gameData } = useGameStats();
  const { user } = useUser();
  const streak = gameData?.streak || 0;
  const isActive = streak > 0;

  const activeFlame =
    flameColorsDefinitions.find(
      (f) => f.id === (user?.settings?.flame_color || "orange"),
    ) || flameColorsDefinitions[0];
  const flameColor = activeFlame.color;

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

      <div
        data-tour="streak-badge"
        style={{
          position: "absolute",
          right: 22,
          height: 36,
          background: C.card,
          border: `1px solid ${isActive ? flameColor + "40" : C.border}`,
          borderRadius: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 10px",
          gap: 6,
        }}
      >
        <IconFire size={18} color={isActive ? flameColor : C.mutedLight} />
        <span
          style={{
            fontFamily: F.head,
            fontSize: 16,
            fontWeight: 900,
            color: isActive ? C.text : C.muted,
          }}
        >
          {streak}
        </span>
      </div>
    </div>
  );
}
