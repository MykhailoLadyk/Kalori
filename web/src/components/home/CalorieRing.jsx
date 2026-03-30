import { C, F } from "../../lib/constans";
import { useState, useEffect } from "react";
import CountUp from "../shared/CountUp";
import Mono from "../shared/Mono";
export default function CalorieRing({ consumed, goal }) {
  const [ringAnimated, setRingAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRingAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);
  const left = goal - consumed;
  const pct = consumed / goal;
  const totalArc = 427;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
        height: 158,
        marginBottom: 2,
        animation: "fadeIn 0.3s ease 0.1s both",
      }}
    >
      <svg
        width="340"
        height="158"
        viewBox="0 0 340 158"
        style={{ position: "absolute", top: 0 }}
      >
        <path
          d="M 24 154 A 136 136 0 0 1 296 154"
          fill="none"
          stroke={C.border}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 24 154 A 136 136 0 0 1 296 154"
          fill="none"
          stroke={C.accent}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={
            ringAnimated ? `${pct * totalArc} ${totalArc}` : `0 ${totalArc}`
          }
          style={{
            transition:
              "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s",
            filter: `drop-shadow(0 0 12px ${C.accentGlow})`,
          }}
        />
        {[0.25, 0.5, 0.75].map((t, i) => {
          const a = Math.PI * (1 - t);
          return (
            <line
              key={i}
              x1={160 + 127 * Math.cos(a)}
              y1={154 - 127 * Math.sin(a)}
              x2={160 + 118 * Math.cos(a)}
              y2={154 - 118 * Math.sin(a)}
              stroke={C.border}
              strokeWidth="2"
            />
          );
        })}
        {ringAnimated &&
          (() => {
            const a = Math.PI * (1 - pct);
            return (
              <circle
                cx={160 + 136 * Math.cos(a)}
                cy={154 - 136 * Math.sin(a)}
                r="8"
                fill={C.accent}
                style={{
                  animation: "glowPulse 2s ease infinite",
                  filter: `drop-shadow(0 0 6px ${C.accent})`,
                }}
              />
            );
          })()}
        <text
          x="5"
          y="154"
          textAnchor="middle"
          fill={C.muted}
          fontSize="9"
          fontFamily={F.mono}
          fontWeight="700"
          letterSpacing="1"
        >
          0
        </text>
        <text
          x="325"
          y="154"
          textAnchor="middle"
          fill={C.muted}
          fontSize="9"
          fontFamily={F.mono}
          fontWeight="700"
          letterSpacing="1"
        >
          {goal}
        </text>
      </svg>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: F.head,
            fontWeight: 900,
            color: C.text,
            lineHeight: 1,
            fontSize: 50,
          }}
        >
          <CountUp to={left} duration={1200} delay={400} />
        </div>
        <Mono size={9} color={C.mutedLight}>
          KCAL REMAINING
        </Mono>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 5,
            animation: "fadeIn 0.4s ease 1.2s both",
          }}
        >
          <Mono size={8} color={C.soft}>
            {consumed} eaten
          </Mono>
          <span style={{ color: C.muted }}>·</span>
          <Mono size={8} color={C.soft}>
            {goal} goal
          </Mono>
        </div>
      </div>
    </div>
  );
}
