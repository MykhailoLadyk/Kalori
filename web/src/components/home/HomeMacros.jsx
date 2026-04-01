import { Mono } from "../shared/Mono";
import { C } from "../../lib/constans";
import { AnimBar } from "../shared/AnimBar";
export function HomeMacros({ macros }) {
  return (
    <div
      style={{
        padding: "10px 22px 0",
        animation: "fadeUp 0.5s ease 0.5s both",
      }}
    >
      <div
        style={{
          background: C.card,
          borderRadius: 18,
          padding: "14px 16px",
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          {macros.map(({ label, val, max, color }, i) => (
            <div key={label} style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Mono size={8} color={C.mutedLight}>
                  {label.slice(0, 4)}
                </Mono>
                <Mono size={8} color={color}>
                  {val}g
                </Mono>
              </div>
              <AnimBar
                pct={(val / max) * 100}
                color={color}
                delay={600 + i * 120}
              />
              <div style={{ marginTop: 3, textAlign: "right" }}>
                <Mono size={7} color={C.muted}>
                  /{max}g
                </Mono>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
