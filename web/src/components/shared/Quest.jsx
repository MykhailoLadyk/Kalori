import { C, F, alpha } from "../../lib/constans";
import { Tag } from "./Primitives";
import { IconStar } from "./DuoIcon";

export function Quest({
  Icon,
  name,
  xp,
  pct: qpct,
  type,
  color = C.accent,
  done = false,
}) {
  return (
    <div
      key={name}
      className="hover-card"
      style={{
        background: done ? alpha(color, 7) : C.card,
        borderRadius: 13,
        padding: "11px 13px",
        border: `1px solid ${done ? alpha(color, 25) : C.border}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 7,
      }}
    >
      <div style={{ flexShrink: 0 }}>{Icon && <Icon color={color} />}</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: done ? 0 : 5,
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
          <Tag color={color}>{type}</Tag>
        </div>
        {!done && (
          <div style={{ height: 3, background: C.border, borderRadius: 3 }}>
            <div
              style={{
                height: "100%",
                background: color,
                borderRadius: 3,
                width: `${qpct}%`,
                transition: "width 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s",
              }}
            />
          </div>
        )}
      </div>
      {done ? (
        <div style={{ color: C.accent }}>
          <IconStar size={18} color={C.accent} />
        </div>
      ) : (
        <div
          style={{
            background: alpha(color, 9),
            border: `1px solid ${alpha(color, 21)}`,
            borderRadius: 7,
            padding: "3px 7px",
            fontFamily: F.mono,
            fontSize: 9,
            color,
            fontWeight: 700,
          }}
        >
          +{xp}
        </div>
      )}
    </div>
  );
}
