import { C, F } from "../../lib/constans";
import { Mono } from "../shared/Mono";
import { IconFire, IconShield } from "../shared/DuoIcon";
export function StreakBanner({ streak, shields }) {
  return (
    <div
      style={{
        padding: "10px 22px 0",
        animation: "fadeUp 0.5s ease 0.58s both",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #FB923C20, #FCD34D10)",
          border: "1px solid #FB923C35",
          borderRadius: 14,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            animation: "streakBounce 0.6s ease 0.9s both",
            flexShrink: 0,
          }}
        >
          <IconFire size={28} color={C.orange} />
        </div>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Mono size={8} color={C.orange}>
            Current Streak
          </Mono>
          <div
            style={{
              fontFamily: F.head,
              fontSize: 20,
              fontWeight: 900,
              color: C.text,
              lineHeight: 1.2,
            }}
          >
            {streak} days
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <IconShield size={18} color={C.gold} />
            <span
              style={{
                fontFamily: F.head,
                fontSize: 18,
                fontWeight: 900,
                color: C.gold,
              }}
            >
              {shields}
            </span>
          </div>
          <Mono size={7} color={C.muted}>
            Shields
          </Mono>
        </div>
      </div>
    </div>
  );
}
