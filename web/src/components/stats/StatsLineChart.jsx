import { Mono } from "../shared/Primitives";
import { C, F, alpha } from "../../lib/constans";
import { useState } from "react";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function StatsLineChart({ label, data, dates, color, goalV, unit, period, i }) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  if (!data || data.length === 0) return null;

  const padTop = 28;
  const padBottom = 24;
  const padLeft = 6;
  const padRight = 6;
  const svgW = 320;
  const svgH = 130;
  const chartW = svgW - padLeft - padRight;
  const chartH = svgH - padTop - padBottom;

  const maxVal = Math.max(...data, goalV || 0) * 1.15;
  const minVal = 0;

  const toX = (idx) => padLeft + (idx / (data.length - 1 || 1)) * chartW;
  const toY = (v) => padTop + chartH - ((v - minVal) / (maxVal - minVal || 1)) * chartH;

  // Build SVG polyline points
  const points = data.map((v, idx) => `${toX(idx)},${toY(v)}`).join(" ");

  // Area fill path (polyline + close at bottom)
  const areaPath = `M ${toX(0)},${toY(data[0])} ` +
    data.map((v, idx) => `L ${toX(idx)},${toY(v)}`).join(" ") +
    ` L ${toX(data.length - 1)},${padTop + chartH} L ${toX(0)},${padTop + chartH} Z`;

  // X-axis labels
  let xLabels = [];
  if (period === "3M") {
    // Show month names
    const monthsSet = new Map();
    dates.forEach((d, idx) => {
      const m = new Date(d + "T00:00:00").getMonth();
      if (!monthsSet.has(m)) {
        monthsSet.set(m, idx);
      }
    });
    monthsSet.forEach((idx, m) => {
      xLabels.push({ text: MONTH_SHORT[m], x: toX(idx) });
    });
  } else {
    // 5 evenly spaced date labels for month view
    const count = 5;
    for (let k = 0; k < count; k++) {
      const idx = Math.round((k / (count - 1)) * (data.length - 1));
      const d = new Date(dates[idx] + "T00:00:00");
      xLabels.push({
        text: `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`,
        x: toX(idx),
      });
    }
  }

  // Format tooltip
  const formatValue = (v) => {
    if (unit === "L") return `${(v / 1000).toFixed(1)} L`;
    return `${v.toLocaleString()} ${unit || ""}`;
  };

  const handlePointTap = (idx) => {
    setSelectedPoint((prev) => (prev === idx ? null : idx));
  };

  // Goal line Y
  const goalY = goalV != null ? toY(goalV) : null;

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
          marginBottom: 6,
        }}
      >
        <Mono size={9} color={C.mutedLight}>
          {label}
        </Mono>
        <Mono size={8} color={C.soft}>
          Goal: {unit === "L" ? `${(goalV / 1000).toFixed(1)} L` : (goalV || 0).toLocaleString()}
        </Mono>
      </div>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <linearGradient id={`grad-${label}-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d={areaPath}
          fill={`url(#grad-${label}-${i})`}
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 6px ${alpha(color, 40)})`,
          }}
        />

        {/* Goal dashed line */}
        {goalY != null && (
          <line
            x1={padLeft}
            x2={svgW - padRight}
            y1={goalY}
            y2={goalY}
            stroke={color}
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.45}
          />
        )}

        {/* Data points — interactive hit areas */}
        {data.map((v, idx) => {
          const cx = toX(idx);
          const cy = toY(v);
          const isSelected = selectedPoint === idx;
          // Only show dots at reasonable intervals for readability
          const showDot = data.length <= 15 || idx % Math.ceil(data.length / 15) === 0 || idx === data.length - 1;
          return (
            <g key={idx} onClick={() => handlePointTap(idx)} style={{ cursor: "pointer" }}>
              {/* Invisible hit area */}
              <circle cx={cx} cy={cy} r={10} fill="transparent" />
              {/* Visible dot */}
              {showDot && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 4.5 : 2.5}
                  fill={isSelected ? color : C.card}
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1.5}
                  style={{ transition: "r 0.2s, fill 0.2s" }}
                />
              )}
              {/* Tooltip */}
              {isSelected && (
                <>
                  {/* Vertical guide line */}
                  <line
                    x1={cx}
                    x2={cx}
                    y1={cy + 5}
                    y2={padTop + chartH}
                    stroke={color}
                    strokeWidth={0.8}
                    strokeDasharray="2 2"
                    opacity={0.4}
                  />
                  {/* Tooltip bg */}
                  <rect
                    x={cx - 30}
                    y={cy - 22}
                    width={60}
                    height={16}
                    rx={4}
                    fill={color}
                  />
                  <text
                    x={cx}
                    y={cy - 11}
                    textAnchor="middle"
                    fill="#000"
                    fontFamily={F.mono}
                    fontSize={8}
                    fontWeight={700}
                  >
                    {formatValue(v)}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {xLabels.map(({ text, x }, idx) => (
          <text
            key={idx}
            x={x}
            y={svgH - 4}
            textAnchor="middle"
            fill={C.muted}
            fontFamily={F.mono}
            fontSize={7}
            fontWeight={600}
          >
            {text}
          </text>
        ))}
      </svg>
    </div>
  );
}
