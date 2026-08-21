import { useState } from "react";
import { C, F, alpha } from "../../lib/constants";
import { Tag } from "./Primitives";
import { IconStar } from "./DuoIcon";

export function Quest({
  id,
  Icon,
  name,
  description,
  xp,
  pct: qpct,
  type,
  color = C.accent,
  done = false,
  onReroll,
  canAffordReroll = true,
  rerollCost = 20,
}) {
  const [rerolling, setRerolling] = useState(false);

  const handleRerollClick = async (e) => {
    e.stopPropagation();
    if (rerolling || !onReroll) return;
    setRerolling(true);
    try {
      await onReroll(id, rerollCost);
    } finally {
      setRerolling(false);
    }
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {onReroll && (
            <div
              onClick={handleRerollClick}
              title={`Reroll quest for ${rerollCost} coins`}
              className="press cursor-pointer hover-card"
              style={{
                background: alpha(C.gold, rerolling ? 25 : 12),
                border: `1px solid ${alpha(C.gold, 30)}`,
                borderRadius: 7,
                padding: "3px 6px",
                display: "flex",
                alignItems: "center",
                gap: 3,
                opacity: canAffordReroll ? 1 : 0.5,
                cursor: canAffordReroll && !rerolling ? "pointer" : "not-allowed",
              }}
            >
              <span style={{ fontSize: 9, lineHeight: 1 }}>{rerolling ? "⏳" : "🔄"}</span>
              <span style={{ fontFamily: F.mono, fontSize: 8, fontWeight: 700, color: C.gold }}>
                {rerollCost}
              </span>
            </div>
          )}
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
        </div>
      )}
    </div>
  );
}
