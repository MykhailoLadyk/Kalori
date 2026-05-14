import { Mono } from "../shared/Primitives";
import { C, F } from "../../lib/constans";
import { AnimBar } from "../shared/AnimBar";
export default function StatsMacroSplit({ label, val, max: m, color, i }) {
  return (
    <>
      <div
        key={label}
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <div
          style={{
            width: 46,
            fontFamily: F.body,
            fontSize: 12,
            color: C.soft,
          }}
        >
          {label}
        </div>
        <div style={{ flex: 1 }}>
          <AnimBar pct={(val / m) * 100} color={color} delay={700 + i * 100} />
        </div>
        <Mono size={8} color={C.muted}>
          {val}g
        </Mono>
      </div>
    </>
  );
}
