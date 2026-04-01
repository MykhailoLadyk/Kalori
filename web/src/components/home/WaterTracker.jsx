import { IconDrop } from "../../components/shared/DuoIcon";
import { Mono } from "../shared/Primitives";
import { AnimBar } from "../../components/shared/AnimBar";
import { C } from "../../lib/constans";
export function WaterTracker({ current, goal, onAdd }) {
  return (
    <div
      style={{
        padding: "10px 22px 0",
        animation: "fadeUp 0.5s ease 0.62s both",
      }}
    >
      <div
        className="hover-card"
        style={{
          background: C.card,
          borderRadius: 14,
          padding: "11px 14px",
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ animation: "float 3s ease infinite", flexShrink: 0 }}>
          <IconDrop size={22} color={C.blue} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Mono size={8} color={C.mutedLight}>
              Water
            </Mono>
            <Mono size={8} color={C.blue}>
              {current} / {goal}L
            </Mono>
          </div>
          <AnimBar pct={(current / goal) * 100} color={C.blue} delay={900} />
        </div>
        <div
          className="press"
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: C.blueDim,
            border: `1px solid ${C.blue}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.blue,
            fontSize: 18,
            fontWeight: 300,
          }}
        >
          +
        </div>
      </div>
    </div>
  );
}
