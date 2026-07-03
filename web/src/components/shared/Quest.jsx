import { C, F, alpha } from "../../lib/constants";
import { Tag } from "./Primitives";
import { IconStar } from "./DuoIcon";

export function Quest({
  Icon,
  name,
  description,
  xp,
  pct: qpct,
  type,
  color = C.accent,
  done = false,
}) {
  return (
    <div
      key={name}
      className="hover-card flex items-center"
      style={{
        background: done ? alpha(color, 7) : C.card,
        borderRadius: 13,
        padding: "11px 13px",
        border: `1px solid ${done ? alpha(color, 25) : C.border}`,
        gap: 10,
        marginBottom: 7,
      }}
    >
      <div className="flex-shrink-0">{Icon && <Icon color={color} />}</div>
      <div className="flex-1">
        <div
          className="flex items-center"
          style={{
            gap: 6,
            marginBottom: done ? 0 : (description ? 2 : 5),
          }}
        >
          <span
            className="font-body font-semibold text-primary"
            style={{ fontSize: 12 }}
          >
            {name}
          </span>
          <Tag color={color}>{type}</Tag>
        </div>
        {description && (
          <div
            className="font-body"
            style={{
              fontSize: 11,
              color: alpha(C.text, 60),
              marginBottom: done ? 0 : 5,
              lineHeight: 1.2,
            }}
          >
            {description}
          </div>
        )}
        {!done && (
          <div className="w-full relative" style={{ height: 3, background: C.border, borderRadius: 3 }}>
            <div
              className="absolute h-full"
              style={{
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
        <div className="text-accent">
          <IconStar size={18} color={C.accent} />
        </div>
      ) : (
        <div
          className="font-mono font-bold"
          style={{
            background: alpha(color, 9),
            border: `1px solid ${alpha(color, 21)}`,
            borderRadius: 7,
            padding: "3px 7px",
            fontSize: 9,
            color,
          }}
        >
          +{xp}
        </div>
      )}
    </div>
  );
}
