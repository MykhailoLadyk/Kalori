import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { C, F, alpha } from "../lib/constants";

import { Mono } from "../components/shared/Primitives";
import StatsBarChart from "../components/stats/StatsBarChart";
import StatsLineChart from "../components/stats/StatsLineChart";
import StatsItemQuick from "../components/stats/StatsItemQuick";
import StatsMacroSplit from "../components/stats/StatsMacroSplit";
import { Modal } from "../components/modals/Modal";
import { WeightLogModal } from "../components/modals/stats/WeightLogModal";
import { useStats } from "../hooks/useStats";
import { useUser } from "../hooks/useUser";

export default function Stats() {
  const { t } = useTranslation();
  const { getWeekData, getMonthData, get3MonthData, get3MonthWeeklyAverages, refreshStats } = useStats();
  const { user } = useUser();
  const [period, setPeriod] = useState("W");
  const [modal, setModal] = useState(null);

  // Fetch history lazily on first visit instead of eagerly on login
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const targets = user?.targets || { calories: 2000, protein: 150, carbs: 250, fat: 70, water: 3000 };
  const currentWeight = Number(user?.settings?.weight) || 0;
  const weightUnit = user?.settings?.weight_unit || "kg";

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

    const periodLabel = period === "W" ? t("stats.ofDays_7") : period === "M" ? t("stats.ofDays_30") : t("stats.ofDays_90");

    return [
      { label: t("stats.avgCalories"), val: avgCal, suffix: "", sub: t("stats.kcalPerDay"), color: C.accent },
      {
        label: totalDeficit >= 0 ? t("stats.totalDeficit") : t("stats.totalSurplus"),
        val: Math.abs(totalDeficit),
        suffix: totalDeficit >= 0 ? "−" : "+",
        sub: t("stats.kcalTotal"),
        color: C.blue,
      },
      { label: t("stats.daysOnGoal"), val: daysOnGoal, suffix: "", sub: periodLabel, color: C.gold },
      { label: t("stats.proteinAvg"), val: avgProtein, suffix: "", sub: t("stats.gOf", { target: targets.protein }), color: C.pink },
    ];
  }, [periodData, targets, period, t]);

  // Compute macro stats
  const macroStats = useMemo(() => {
    if (!periodData.length) return [];
    const avgProtein = Math.round(periodData.reduce((s, d) => s + d.protein, 0) / periodData.length);
    const avgCarbs = Math.round(periodData.reduce((s, d) => s + d.carbs, 0) / periodData.length);
    const avgFat = Math.round(periodData.reduce((s, d) => s + d.fat, 0) / periodData.length);
    return [
      { label: t("home.protein"), val: avgProtein, max: targets.protein, color: C.blue },
      { label: t("home.carbs"), val: avgCarbs, max: targets.carbs, color: C.gold },
      { label: t("home.fat"), val: avgFat, max: targets.fat, color: C.pink },
    ];
  }, [periodData, targets, t]);

  // Chart definitions — used for both bar and line charts
  const chartDefs = [
    { label: t("home.calories"), key: "calories", color: C.accent, goal: targets.calories, unit: "kcal" },
    { label: t("home.protein"), key: "protein", color: C.blue, goal: targets.protein, unit: "g" },
    { label: t("home.carbs"), key: "carbs", color: C.gold, goal: targets.carbs, unit: "g" },
    { label: t("home.fat"), key: "fat", color: C.pink, goal: targets.fat, unit: "g" },
    { label: t("home.water"), key: "water", color: C.blue, goal: targets.water, unit: "L" },
    { label: t("settings.weight"), key: "weight", color: C.pink, goal: null, unit: weightUnit },
  ];

  // Determine max for bar charts
  const getBarMax = (key, goal) => {
    const vals = periodData.map((d) => d[key]);
    const maxVal = Math.max(...vals, goal || 0);
    return maxVal > 0 ? maxVal * 1.15 : 100;
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: F.head, fontSize: 22, fontWeight: 900, color: C.text }}>
              {t("stats.title")}
            </div>
            <div
              onClick={() => setModal("weight")}
              className="hover-btn press cursor-pointer flex items-center"
              style={{
                gap: 5,
                background: alpha(C.pink, 12),
                border: `1px solid ${alpha(C.pink, 28)}`,
                borderRadius: 8,
                padding: "4px 8px",
              }}
            >
              <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: C.pink, lineHeight: 1 }}>+</span>
              <span style={{ fontFamily: F.mono, fontSize: 8, fontWeight: 700, color: C.pink, letterSpacing: 0.5 }}>
                {t("stats.logWeight")}
              </span>
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
            {t("stats.macroSplitAvg")}
          </Mono>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {macroStats.map(({ label, val, max, color }, i) => (
              <StatsMacroSplit key={label} label={label} val={val} max={max} color={color} i={i} />
            ))}
          </div>
        </div>
      </div>

      <Modal id={modal} close={() => setModal(null)}>
        {modal === "weight" && <WeightLogModal handleClose={() => setModal(null)} />}
      </Modal>
    </>
  );
}
