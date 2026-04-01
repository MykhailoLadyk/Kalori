import { C, F } from "../../lib/constans";
import { Tag } from "./Primitives";

export function Quest({ Icon, name, xp, pct: qpct, type, color, done }) {
  return (
    <div
      key={name}
      className="hover-card"
      style={{
        background: C.card,
        borderRadius: 13,
        padding: "10px 13px",
        border: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 7,
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Icon color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontFamily: F.body,
              fontSize: 12,
              fontWeight: 600,
              color: C.text,
            }}
          >
            {name}
          </span>
          <Tag color={type === "Weekly" ? C.gold : C.accent}>{type}</Tag>
        </div>
        <div style={{ height: 3, background: C.border, borderRadius: 3 }}>
          <div
            style={{
              height: "100%",
              background: color,
              borderRadius: 3,
              width: `${qpct}%`,
              transition: "width 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s",
            }}
          />
        </div>
      </div>
      <div
        style={{
          background: C.accentDim,
          border: `1px solid ${C.accentMid}`,
          borderRadius: 7,
          padding: "3px 7px",
          fontFamily: F.mono,
          fontSize: 9,
          color: color,
          fontWeight: 700,
        }}
      >
        +{xp}
      </div>
    </div>
  );
}
