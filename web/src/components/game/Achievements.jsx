import { C, F } from "../../lib/constans";
import { IconTrophy } from "../shared/DuoIcon";

export default function Achievements({ achievements, onViewAll }) {
  const preview = achievements.slice(0, 5);

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 9,
            color: C.mutedLight,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Achievements
        </div>
        <div
          onClick={onViewAll}
          className="hover-btn press"
          style={{
            background: C.accent,
            borderRadius: 8,
            padding: "4px 10px",
            fontFamily: F.mono,
            fontSize: 8,
            fontWeight: 700,
            color: "#000",
          }}
        >
          View all →
        </div>
      </div>

      <div style={{ display: "flex", gap: 7 }}>
        {preview.map((a, i) => {
          const done = a.done ?? a.unlocked;
          const Icon = a.Icon || IconTrophy;
          return (
            <div
              key={`${a.name}-${i}`}
              className="hover-card"
              style={{
                flex: 1,
                background: done ? C.accentDim : C.card,
                border: `1px solid ${done ? C.accentMid : C.border}`,
                borderRadius: 12,
                padding: "10px 4px",
                textAlign: "center",
                opacity: done ? 1 : 0.9,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon size={20} color={done ? C.accent : C.muted} />
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 7,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: done ? C.accent : C.muted,
                }}
              >
                {a.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
