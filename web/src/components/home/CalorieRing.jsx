import { C, F } from "../../lib/constants";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CountUp from "../shared/CountUp";
import { Mono } from "../shared/Primitives";
import { useUser } from "../../hooks/useUser";
import { useMeals } from "../../hooks/useMeals";
export function CalorieRing() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { meals } = useMeals();
  const goal = Number(user?.targets?.calories || 0);
  const consumed = meals.reduce(
    (sum, meal) => sum + Number(meal.calories || 0),
    0,
  );

  const [ringAnimated, setRingAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRingAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);
  const left = goal - consumed;
  const isOver = left < 0;
  const isSeverelyOver = goal > 0 && consumed >= goal * 1.2;
  const displayValue = Math.abs(left);
  const pct = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const totalArc = 427;
  return (
    <div
      data-tour="calorie-ring"
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
          stroke={isSeverelyOver ? C.redSoft : C.accent}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={
            ringAnimated ? `${pct * totalArc} ${totalArc}` : `0 ${totalArc}`
          }
          style={{
            transition:
              "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s, stroke 0.5s ease",
            filter: `drop-shadow(0 0 12px ${isSeverelyOver ? C.redDim : C.accentGlow})`,
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
                fill={isSeverelyOver ? C.redSoft : C.accent}
                style={{
                  animation: "glowPulse 2s ease infinite",
                  filter: `drop-shadow(0 0 6px ${isSeverelyOver ? C.redSoft : C.accent})`,
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
            color: isSeverelyOver ? C.redSoft : C.text,
            lineHeight: 1,
            fontSize: 50,
          }}
        >
          <CountUp to={Number(displayValue)} duration={1200} delay={400} />
        </div>
        <Mono size={9} color={isSeverelyOver ? C.redSoft : C.mutedLight}>
          {isOver ? t("home.caloriesOver") : t("home.caloriesRemaining")}
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
            {consumed} {t("home.eaten").toLowerCase()}
          </Mono>
          <span style={{ color: C.muted }}>·</span>
          <Mono size={8} color={C.soft}>
            {goal} {t("home.goal").toLowerCase()}
          </Mono>
        </div>
      </div>
    </div>
  );
}
