import { useState, useMemo } from "react";

import { C, F } from "../lib/constans";

import { IconFire } from "../components/shared/DuoIcon";
import { Mono } from "../components/shared/Primitives";
import CountUp from "../components/shared/CountUp";
import StatsBarChart from "../components/stats/StatsBarChart";
import StatsLineChart from "../components/stats/StatsLineChart";
import StatsItemQuick from "../components/stats/StatsItemQuick";
import StatsMacroSplit from "../components/stats/StatsMacroSplit";
import { useGameStats } from "../hooks/useGameStats";
import { useStats } from "../hooks/useStats";
import { useUser } from "../hooks/useUser";

export default function Stats() {
  const { gameData } = useGameStats();
  const { getWeekData, getMonthData, get3MonthData, get3MonthWeeklyAverages } = useStats();
  const { user } = useUser();
  const [period, setPeriod] = useState("W");

  const targets = user?.targets || { calories: 2000, protein: 150, carbs: 250, fat: 70, water: 3000 };

  // Get data for the current period
  const periodData = useMemo(() => {
    if (period === "W") return getWeekData();
    if (period === "M") return getMonthData();
    return get3MonthData();
  }, [period, getWeekData, getMonthData, get3MonthData]);

  const weeklyAvgData = useMemo(() => {
    if (period === "3M") return get3MonthWeeklyAverages();
    return [];
  }, [period, get3MonthWeeklyAverages]);

  // Compute quick stats from period data
  const quickStats = useMemo(() => {
    if (!periodData.length) return [];

    const avgCal = Math.round(periodData.reduce((s, d) => s + d.calories, 0) / periodData.length);
    const totalDeficit = periodData.reduce((s, d) => s + (targets.calories - d.calories), 0);
    const daysOnGoal = periodData.filter(
      (d) => d.calories >= targets.calories * 0.8 && d.calories <= targets.calories * 1.3,
    ).length;
    const avgProtein = Math.round(periodData.reduce((s, d) => s + d.protein, 0) / periodData.length);

    const periodLabel = period === "W" ? "of 7 days" : period === "M" ? "of 30 days" : "of 90 days";

    return [
      { label: "Avg Calories", val: avgCal, suffix: "", sub: "kcal/day", color: C.accent },
      {
        label: totalDeficit >= 0 ? "Total Deficit" : "Total Surplus",
        val: Math.abs(totalDeficit),
        suffix: totalDeficit >= 0 ? "−" : "+",
        sub: "kcal total",
        color: C.blue,
      },
      { label: "Days On Goal", val: daysOnGoal, suffix: "", sub: periodLabel, color: C.gold },
      { label: "Protein Avg", val: avgProtein, suffix: "", sub: `g of ${targets.protein}g`, color: C.pink },
    ];
  }, [periodData, targets, period]);

  // Compute macro stats
  const macroStats = useMemo(() => {
    if (!periodData.length) return [];
    const avgProtein = Math.round(periodData.reduce((s, d) => s + d.protein, 0) / periodData.length);
    const avgCarbs = Math.round(periodData.reduce((s, d) => s + d.carbs, 0) / periodData.length);
    const avgFat = Math.round(periodData.reduce((s, d) => s + d.fat, 0) / periodData.length);
    return [
      { label: "Protein", val: avgProtein, max: targets.protein, color: C.blue },
      { label: "Carbs", val: avgCarbs, max: targets.carbs, color: C.gold },
      { label: "Fat", val: avgFat, max: targets.fat, color: C.pink },
    ];
  }, [periodData, targets]);

  // Chart definitions — used for both bar and line charts
  const chartDefs = [
    { label: "Calories", key: "calories", color: C.accent, goal: targets.calories, unit: "kcal" },
    { label: "Protein", key: "protein", color: C.blue, goal: targets.protein, unit: "g" },
    { label: "Carbs", key: "carbs", color: C.gold, goal: targets.carbs, unit: "g" },
    { label: "Fat", key: "fat", color: C.pink, goal: targets.fat, unit: "g" },
    { label: "Water", key: "water", color: C.blue, goal: targets.water, unit: "L" },
  ];

  // Determine max for bar charts
  const getBarMax = (key, goal) => {
    const vals = periodData.map((d) => d[key]);
    return Math.max(...vals, goal) * 1.15;
  };

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
              <div style={{ fontFamily: F.head, fontSize: 22, fontWeight: 900, color: C.text, lineHeight: 1 }}>
                <CountUp to={gameData.streak} duration={800} delay={100} /> days
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

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {quickStats.map(({ label, val, suffix, sub, color }, i) => (
            <StatsItemQuick key={label} label={label} val={val} suffix={suffix} sub={sub} color={color} i={i} />
          ))}
        </div>

        {/* Charts — Bar for W, Line for M/3M */}
        {period === "W" &&
          chartDefs.map(({ label, key, color, goal, unit }, i) => {
            const values = periodData.map((d) => d[key]);
            const chartDates = periodData.map((d) => d.date);
            const barMax = getBarMax(key, goal);
            return (
              <StatsBarChart
                key={label}
                label={label}
                data={values}
                dates={chartDates}
                max={barMax}
                color={color}
                goalV={goal}
                unit={unit}
                i={i}
              />
            );
          })}

        {period === "M" &&
          chartDefs.map(({ label, key, color, goal, unit }, i) => {
            const values = periodData.map((d) => d[key]);
            const chartDates = periodData.map((d) => d.date);
            return (
              <StatsLineChart
                key={label}
                label={label}
                data={values}
                dates={chartDates}
                color={color}
                goalV={goal}
                unit={unit}
                period="M"
                i={i}
              />
            );
          })}

        {period === "3M" &&
          chartDefs.map(({ label, key, color, goal, unit }, i) => {
            const values = weeklyAvgData.map((d) => d[key]);
            const chartDates = weeklyAvgData.map((d) => d.date);
            return (
              <StatsLineChart
                key={label}
                label={label}
                data={values}
                dates={chartDates}
                color={color}
                goalV={goal}
                unit={unit}
                period="3M"
                i={i}
              />
            );
          })}

        {/* Macro Split */}
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
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {macroStats.map(({ label, val, max, color }, i) => (
              <StatsMacroSplit key={label} label={label} val={val} max={max} color={color} i={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
