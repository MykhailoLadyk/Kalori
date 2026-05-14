import { Mono } from "../shared/Primitives";
import { C, F } from "../../lib/constans";

export default function SettingsCard({
  icon,
  label,
  sub,
  danger = false,
  arrow = false,
  toggle,
  onClick,
  onToggle,
  withTopBorder = false,
}) {
  const iconColor = danger ? C.red : C.soft;
  return (
    <div
      onClick={toggle !== undefined ? onToggle : onClick}
      className="hover-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 14px",
        borderTop: withTopBorder ? `1px solid ${C.border}` : "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: danger ? "#F8717115" : C.panel,
          border: `1px solid ${danger ? "#F8717130" : C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          fontFamily: F.mono,
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 14,
            fontWeight: 600,
            color: danger ? C.red : C.text,
          }}
        >
          {label}
        </div>
        {sub && (
          <Mono size={8} color={C.muted}>
            {sub}
          </Mono>
        )}
      </div>
      {arrow && <span style={{ color: C.muted, fontSize: 16 }}>›</span>}
      {toggle !== undefined && (
        <div
          style={{
            width: 38,
            height: 22,
            borderRadius: 11,
            background: toggle ? C.accent : C.border,
            position: "relative",
            transition: "background 0.25s",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 3,
              left: toggle ? 19 : 3,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow: toggle ? `0 0 8px ${C.accentGlow}` : "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
