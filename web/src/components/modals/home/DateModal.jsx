import { C, F } from "../../../lib/constans";
import { Mono } from "../../shared/Primitives";
import { useState } from "react";
import { getNumberOfDaysInMonth, getMonthName } from "../../../lib/utils";
export function DateModal({ handleClose, date, setDate }) {
  const [localDate, setLocalDate] = useState(date.getDate());
  const [localMonth, setLocalMonth] = useState(date.getMonth());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());

  const currentYear = date.getFullYear();
  const daysInMonth = getNumberOfDaysInMonth(currentYear, localMonth);
  const firstDayOfMonth = new Date(currentYear, localMonth, 1).getDay();
  const leadingEmptyDays = (firstDayOfMonth + 6) % 7;

  const isPrevDisabled = localMonth === 0;
  const isNextDisabled = localMonth === 11;
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 28px",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            onClick={() => {
              if (!isPrevDisabled) {
                setLocalMonth(localMonth - 1);
              }
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isPrevDisabled ? C.muted : C.text}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </div>
          <span style={{ textAlign: "center" }}>
            {getMonthName(localMonth)} {currentYear}
          </span>
          <div
            onClick={() => {
              if (!isNextDisabled) {
                setLocalMonth(localMonth + 1);
              }
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isNextDisabled ? C.muted : C.text}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          marginBottom: 8,
          height: 252,
          alignContent: "start",
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
                setLocalDate(d);
                setSelectedMonth(localMonth);
              }}
              key={d}
              className="press"
              style={{
                height: 34,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  localDate === d && selectedMonth === localMonth
                    ? C.accent
                    : "transparent",
                border: `1px solid ${localDate === d && selectedMonth === localMonth ? C.accent : C.border}`,
                transition: "all 0.15s",
                animation:
                  localDate === d && selectedMonth === localMonth
                    ? "pulse 2s ease infinite"
                    : "none",
              }}
            >
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 13,
                  fontWeight:
                    localDate === d && selectedMonth === localMonth ? 800 : 500,
                  color:
                    localDate === d && selectedMonth === localMonth
                      ? "#000"
                      : C.text,
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
          setDate(new Date(date.getFullYear(), selectedMonth, localDate));
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
