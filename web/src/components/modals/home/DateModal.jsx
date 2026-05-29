import { C, F } from "../../../lib/constans";
import { Mono } from "../../shared/Primitives";
import { useState } from "react";
import { getNumberOfDaysInMonth } from "../../../lib/utils";
export function DateModal({ handleClose, globalDate, setGlobalDate }) {
  const daysInMonth = getNumberOfDaysInMonth(
    globalDate.getFullYear(),
    globalDate.getMonth(),
  );
  const firstDayOfMonth = new Date(
    globalDate.getFullYear(),
    globalDate.getMonth(),
    1,
  ).getDay();
  const leadingEmptyDays = (firstDayOfMonth + 6) % 7;
  const [date, setDate] = useState(globalDate.getDate());
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
        {[...Array(leadingEmptyDays)].map((_, i) => (
          <div key={"e" + i} />
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const d = i + 1;
          return (
            <div
              onClick={() => {
                setDate(d);
              }}
              key={d}
              className="press"
              style={{
                height: 34,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: date === d ? C.accent : "transparent",
                border: `1px solid ${date === d ? C.accent : C.border}`,
                transition: "all 0.15s",
                animation: date === d ? "pulse 2s ease infinite" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 13,
                  fontWeight: date === d ? 800 : 500,
                  color: date === d ? "#000" : C.text,
                }}
              >
                {d}
              </span>
            </div>
          );
        })}
      </div>
      <div
        onClick={() => {
          setGlobalDate(
            new Date(globalDate.getFullYear(), globalDate.getMonth(), date),
          );
          handleClose();
        }}
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
