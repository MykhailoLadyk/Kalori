import { C, F } from "../../../lib/constans";
import { IconTrophy } from "../../../components/shared/DuoIcon";

export default function AchievementsModal({ achievements, handleClose }) {
  return (
    <div style={{ padding: "10px 4px" }}>
      <div
        style={{
          fontFamily: F.head,
          fontSize: 20,
          fontWeight: 900,
          color: C.text,
          marginBottom: 16,
        }}
      >
        Achievements
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {achievements.map((a, i) => {
          const done = a.done ?? a.unlocked;
          const pct = a.pct ?? 0;
          const Icon = a.Icon;
          return (
            <div
              key={`${a.name}-${i}`}
              className="hover-card"
              style={{
                background: done ? C.accentDim : C.card,
                border: `1px solid ${done ? C.accentMid : C.border}`,
                borderRadius: 14,
                padding: "12px 14px",
                display: "flex",
                gap: 12,
                alignItems: "center",
                opacity: done ? 1 : 0.75,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: done ? C.accent + "25" : C.panel,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: done ? "none" : "grayscale(0.8)",
                }}
              >
                {<IconTrophy size={22} color={done ? C.accent : C.muted} />}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: F.body,
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.text,
                    }}
                  >
                    {a.name}
                  </span>
                  {done && (
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: 8,
                        fontWeight: 700,
                        color: C.accent,
                        background: C.accent + "18",
                        border: `1px solid ${C.accent}35`,
                        padding: "2px 7px",
                        borderRadius: 6,
                        textTransform: "uppercase",
                        letterSpacing: 1.2,
                      }}
                    >
                      Done
                    </span>
                  )}
                </div>
                {a.desc && (
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: 11,
                      color: C.soft,
                      marginBottom: done ? 0 : 5,
                    }}
                  >
                    {a.desc}
                  </div>
                )}
                {!done && pct > 0 && (
                  <div
                    style={{
                      height: 4,
                      background: C.border,
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: C.accent,
                        borderRadius: 4,
                        transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  </div>
                )}
              </div>
              {typeof a.xp !== "undefined" && (
                <div
                  style={{
                    fontFamily: F.mono,
                    fontSize: 9,
                    color: done ? C.accent : C.muted,
                    fontWeight: 700,
                  }}
                >
                  +{a.xp} XP
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
