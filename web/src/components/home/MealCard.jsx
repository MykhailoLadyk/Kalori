import { useState } from "react";
import { C, F } from "../../lib/constans";
import { IconPencil, IconTrash } from "../shared/DuoIcon";
export function MealCard({ meal, color, type }) {
  const [expandedMeal, setExpandedMeal] = useState(null);
  const expanded = expandedMeal === meal.id;
  return (
    <div
      key={meal.id}
      className="hover-card meal-card"
      onClick={() => setExpandedMeal(expanded ? null : meal.id)}
      style={{
        background: C.card,
        borderRadius: 13,
        border: `1px solid ${expanded ? color + "40" : C.border}`,
        marginBottom: 6,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* Meal category pictogram */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: color + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            {type === "Breakfast" && (
              <>
                <circle cx="16" cy="18" r="10" fill={color} opacity="0.2" />
                <circle
                  cx="16"
                  cy="18"
                  r="10"
                  stroke={color}
                  strokeWidth="1.5"
                />
                <path
                  d="M11 18C11 15.5 13 13 16 13C19 13 21 15.5 21 18"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M16 8L16 6M11 10L9.5 8.5M21 10L22.5 8.5"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </>
            )}
            {type === "Lunch" && (
              <>
                <rect
                  x="5"
                  y="20"
                  width="22"
                  height="4"
                  rx="2"
                  fill={color}
                  opacity="0.25"
                />
                <path
                  d="M8 20C8 14 12 10 16 10C20 10 24 14 24 20"
                  fill={color}
                  opacity="0.12"
                  stroke={color}
                  strokeWidth="1.5"
                />
                <rect
                  x="5"
                  y="20"
                  width="22"
                  height="4"
                  rx="2"
                  stroke={color}
                  strokeWidth="1.5"
                />
              </>
            )}
            {type === "Dinner" && (
              <>
                <path
                  d="M7 8V24"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <path
                  d="M7 8C5 10 5 14 7 16"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <path
                  d="M12 8V13C12 16 14 17 14 17V24"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 8C10 10 10 14 12 16"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="22"
                  cy="16"
                  r="8"
                  fill={color}
                  opacity="0.15"
                  stroke={color}
                  strokeWidth="1.5"
                />
              </>
            )}
            {type === "Snacks" && (
              <>
                <path
                  d="M12 8C12 8 10 11 10 14"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 8C20 8 22 11 22 14"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 14H22L21 24H11Z"
                  fill={color}
                  opacity="0.2"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <rect
                  x="9"
                  y="8"
                  width="14"
                  height="2"
                  rx="1"
                  fill={color}
                  opacity="0.4"
                />
              </>
            )}
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: F.body,
              fontSize: 13,
              fontWeight: 600,
              color: C.text,
              display: "flex",
            }}
          >
            {meal.n}
          </span>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {[
              { l: "P", v: meal.p, col: C.blue },
              { l: "C", v: meal.c, col: C.gold },
              { l: "F", v: meal.f, col: C.pink },
            ].map(({ l, v, col }) => (
              <span
                key={l}
                style={{
                  fontFamily: F.mono,
                  fontSize: 8,
                  color: col,
                  background: col + "18",
                  borderRadius: 4,
                  padding: "1px 5px",
                }}
              >
                {l} {v}g
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: F.head,
              fontSize: 16,
              fontWeight: 800,
              color: C.soft,
            }}
          >
            {meal.cal}
          </span>
          <div
            style={{
              color: C.muted,
              fontSize: 10,
              transition: "transform 0.2s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▾
          </div>
        </div>
      </div>
      {expanded && (
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "8px 12px",
            display: "flex",
            gap: 8,
            animation: "fadeIn 0.2s ease both",
          }}
        >
          <div
            className="hover-btn press"
            style={{
              flex: 1,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 9,
              padding: "7px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <IconPencil size={14} color={C.soft} />
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 8,
                color: C.soft,
                fontWeight: 700,
              }}
            >
              EDIT
            </span>
          </div>
          <div
            className="hover-btn press"
            style={{
              flex: 1,
              background: "#F8717112",
              border: `1px solid #F8717130`,
              borderRadius: 9,
              padding: "7px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <IconTrash size={14} color={C.red} />
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 8,
                color: C.red,
                fontWeight: 700,
              }}
            >
              DELETE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
