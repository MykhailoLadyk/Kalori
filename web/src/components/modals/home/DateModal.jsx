import { C, F } from "../../../lib/constans";
import { Mono } from "../../../components/shared/Mono";

export function DateModal({ handleClose }) {
  return (
    <div>
      <div
        style={{
          fontFamily: F.head,
          fontSize: 20,
          fontWeight: 900,
          color: C.text,
          marginBottom: 16,
        }}
      >
        Choose Date
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          marginBottom: 8,
        }}
      >
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <Mono size={8} color={C.muted}>
              {d}
            </Mono>
          </div>
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={"e" + i} />
        ))}
        {[...Array(28)].map((_, i) => {
          const d = i + 1,
            today = d === 27,
            past = d < 27;
          return (
            <div
              key={d}
              className="press"
              style={{
                height: 34,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: today ? C.accent : "transparent",
                border: `1px solid ${today ? C.accent : past ? C.border : "transparent"}`,
                opacity: d > 27 ? 0.2 : 1,
                transition: "all 0.15s",
                animation: today ? "pulse 2s ease infinite" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 13,
                  fontWeight: today ? 800 : 500,
                  color: today ? "#000" : past ? C.text : C.muted,
                }}
              >
                {d}
              </span>
            </div>
          );
        })}
      </div>
      <div
        onClick={handleClose}
        className="hover-btn press"
        style={{
          background: C.accent,
          borderRadius: 12,
          padding: "12px",
          textAlign: "center",
          fontFamily: F.head,
          fontSize: 15,
          fontWeight: 800,
          color: "#000",
          marginTop: 14,
        }}
      >
        Confirm
      </div>
    </div>
  );
}
