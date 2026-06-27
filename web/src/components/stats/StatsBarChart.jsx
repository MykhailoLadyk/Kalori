import { Mono } from "../shared/Primitives";
import { C, F } from "../../lib/constans";
import { useEffect, useState } from "react";

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StatsBarChart({ label, data, dates, max, color, goalV, unit, i }) {
  const [barsVisible, setBarsVisible] = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedBar(null);
  }, [data]);

  const handleBarTap = (idx) => {
    setSelectedBar((prev) => (prev === idx ? null : idx));
  };

  // Format tooltip value
  const formatValue = (v) => {
    if (unit === "L") return `${(v / 1000).toFixed(1)} L`;
    return `${v.toLocaleString()} ${unit || ""}`;
  };

  // Build day labels from dates array
  const dayLabels = dates
    ? dates.map((d) => SHORT_DAYS[new Date(d + "T00:00:00").getDay()])
    : data.map((_, idx) => idx);

  // Bar area height in px
  const barAreaH = 55;

  return (
    <div
      className="hover-card"
      style={{
        background: C.card,
        borderRadius: 16,
        padding: "14px 16px",
        border: `1px solid ${C.border}`,
        marginBottom: 10,
        animation: `fadeUp 0.4s ease ${0.3 + i * 0.1}s both`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Mono size={9} color={C.mutedLight}>
          {label}
        </Mono>
        <Mono size={8} color={C.soft}>
          Goal: {unit === "L" ? `${(goalV / 1000).toFixed(1)} L` : goalV.toLocaleString()}
        </Mono>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          height: 80,
          position: "relative",
        }}
      >
        {/* Goal dashed line — positioned relative to the bar area */}
        {goalV != null && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 20 + (goalV / max) * barAreaH,
              height: 1,
              background: `repeating-linear-gradient(90deg, ${color}50 0, ${color}50 3px, transparent 3px, transparent 7px)`,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        )}
        {data.map((v, idx) => {
          const h = v === 0 ? 3 : Math.max(Math.round((v / max) * 100), 6);
          const isToday = idx === data.length - 1;
          const isSelected = selectedBar === idx;

          return (
            <div
              key={idx}
              onClick={() => handleBarTap(idx)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                height: "100%",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {/* Tooltip */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: color,
                    color: "#000",
                    fontFamily: F.mono,
                    fontSize: 8,
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: 5,
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    animation: "fadeUp 0.2s ease both",
                    letterSpacing: 0.5,
                  }}
                >
                  {formatValue(v)}
                </div>
              )}
              <div
                style={{
                  width: "100%",
                  height: barAreaH,
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: barsVisible ? `${h}%` : "3px",
                    background:
                      v === 0 ? C.border : isToday ? `linear-gradient(180deg, ${color}, ${color}88)` : color + "70",
                    borderRadius: "4px 4px 0 0",
                    boxShadow: isToday ? `0 0 14px ${color}66` : "none",
                    transition: `height 0.8s cubic-bezier(0.22,1,0.36,1) ${idx * 60}ms`,
                    minHeight: 3,
                  }}
                />
              </div>
              <Mono size={7} color={isToday ? color : C.muted}>
                {dayLabels[idx]}
              </Mono>
            </div>
          );
        })}
      </div>
    </div>
  );
}
