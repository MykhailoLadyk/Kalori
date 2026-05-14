import { Mono } from "../shared/Primitives";
import { C } from "../../lib/constans";
import { useEffect, useState } from "react";
const days = ["M", "T", "W", "T", "F", "SA", "SU"];
export default function StatsBarChart({ label, data, max, color, goalV, i }) {
  const [barsVisible, setBarsVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 300);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <div
        key={label}
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
            Goal: {goalV}
          </Mono>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            height: 70,
            position: "relative",
          }}
        >
          {goalV && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${100 - (goalV / max) * 100}%`,
                height: 1,
                background: `repeating-linear-gradient(90deg, ${color}50 0, ${color}50 3px, transparent 3px, transparent 7px)`,
              }}
            />
          )}
          {data.map((v, i) => {
            const h = v === 0 ? 3 : Math.max(Math.round((v / max) * 100), 6);
            const isToday = i === 4;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 55,
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: barsVisible ? `${h}%` : "3px",
                      background:
                        v === 0
                          ? C.border
                          : isToday
                            ? `linear-gradient(180deg, ${color}, ${color}88)`
                            : color + "70",
                      borderRadius: "4px 4px 0 0",
                      boxShadow: isToday ? `0 0 14px ${color}66` : "none",
                      transition: `height 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms`,
                      minHeight: 3,
                    }}
                  />
                </div>
                <Mono size={7} color={isToday ? color : C.muted}>
                  {days[i]}
                </Mono>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
