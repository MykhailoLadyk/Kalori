import { useState } from "react";

import { C, F } from "../lib/constans";

import { IconFire } from "../components/shared/DuoIcon";
import { Mono } from "../components/shared/Primitives";
import CountUp from "../components/shared/CountUp";
import StatsBarChart from "../components/stats/StatsBarChart";
import StatsItemQuick from "../components/stats/StatsItemQuick";
import StatsMacroSplit from "../components/stats/StatsMacroSplit";
export default function Stats() {
  const [period, setPeriod] = useState("W");
  const cals = [1840, 2200, 1650, 2000, 1360, 0, 0];
  const protein = [88, 102, 74, 95, 64, 0, 0];
  const water = [2.1, 1.8, 2.5, 2.2, 1.4, 0, 0];
  const goal = 2000,
    max = 2400;
  const quickStats = [
    {
      label: "Avg Calories",
      val: 1810,
      suffix: "",
      sub: "kcal/day",
      color: C.accent,
    },
    {
      label: "Weekly Deficit",
      val: 950,
      suffix: "−",
      sub: "kcal total",
      color: C.blue,
    },
    {
      label: "Days On Goal",
      val: 3,
      suffix: "",
      sub: "of 5 days",
      color: C.gold,
    },
    {
      label: "Protein Avg",
      val: 84,
      suffix: "",
      sub: "g of 150g",
      color: C.pink,
    },
  ];

  const barsCharts = [
    {
      label: "Calories",
      data: cals,
      max: max,
      color: C.accent,
      goalV: goal,
    },
    {
      label: "Protein",
      data: protein,
      max: 160,
      color: C.blue,
      goalV: 150,
    },
    { label: "Water", data: water, max: 3, color: C.blue, goalV: 2.5 },
  ];
  const macroStats = [
    { label: "Protein", val: 84, max: 150, color: C.blue },
    { label: "Carbs", val: 190, max: 250, color: C.gold },
    { label: "Fat", val: 48, max: 70, color: C.pink },
  ];
  return (
    <>
      <div style={{ padding: "16px 22px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            animation: "fadeUp 0.4s ease both",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ animation: "float 2.5s ease infinite" }}>
              <IconFire size={24} color={C.orange} />
            </div>
            <div>
              <Mono size={8} color={C.orange}>
                Current Streak
              </Mono>
              <div
                style={{
                  fontFamily: F.head,
                  fontSize: 22,
                  fontWeight: 900,
                  color: C.text,
                  lineHeight: 1,
                }}
              >
                <CountUp to={7} duration={800} delay={100} /> days
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {["W", "M", "3M"].map((p) => (
              <div
                key={p}
                onClick={() => setPeriod(p)}
                className="press"
                style={{
                  width: 32,
                  height: 28,
                  borderRadius: 8,
                  background: period === p ? C.accent : C.card,
                  border: `1px solid ${period === p ? C.accent : C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: F.mono,
                  fontSize: 9,
                  fontWeight: 700,
                  color: period === p ? "#000" : C.muted,
                  transition: "all 0.2s",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 12,
          }}
        >
          {quickStats.map(({ label, val, suffix, sub, color }, i) => (
            <StatsItemQuick
              key={i}
              label={label}
              val={val}
              suffix={suffix}
              sub={sub}
              color={color}
              i={i}
            />
          ))}
        </div>
        {barsCharts.map(({ label, data, max, color, goalV }, i) => (
          <StatsBarChart
            key={i}
            label={label}
            data={data}
            max={max}
            color={color}
            goalV={goalV}
            i={i}
          />
        ))}
        <div
          className="hover-card"
          style={{
            background: C.card,
            borderRadius: 16,
            padding: "14px 16px",
            border: `1px solid ${C.border}`,
            animation: "fadeUp 0.4s ease 0.6s both",
          }}
        >
          <Mono size={9} color={C.mutedLight}>
            Macro Split (avg)
          </Mono>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 10,
            }}
          >
            {macroStats.map(({ label, val, max, color }, i) => (
              <StatsMacroSplit
                key={i}
                label={label}
                val={val}
                max={max}
                color={color}
                i={i}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
