import { useState } from "react";
import { C, F, alpha } from "../../lib/constants";
import { IconPencil, IconTrash } from "../shared/DuoIcon";
import { MealDeleteModal } from "../modals/home/MealDeleteModal";
import { MealEditModal } from "../modals/home/MealEditModal";
import { Modal } from "../modals/Modal";
export function MealCard({ meal, color, type }) {
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const [expandedMeal, setExpandedMeal] = useState(null);
  const expanded = expandedMeal === meal.id;
  return (
    <>
      <div
        key={meal.id}
        className="hover-card meal-card bg-card overflow-hidden cursor-pointer"
        onClick={() => setExpandedMeal(expanded ? null : meal.id)}
        style={{
          borderRadius: 13,
          border: `1px solid ${expanded ? alpha(color, 25) : C.border}`,
          marginBottom: 6,
          transition: "all 0.2s",
        }}
      >
        <div className="flex items-center" style={{ padding: "10px 12px", gap: 10 }}>
          {" "}
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: alpha(color, 9),
            }}
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              {type === "breakfast" && (
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
              {type === "lunch" && (
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
              {type === "dinner" && (
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
              {type === "snacks" && (
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
          <div className="flex-1" style={{ minWidth: 0 }}>
            <span className="font-body font-semibold text-primary flex" style={{ fontSize: 13 }}>
              {meal.name}
            </span>
            <div className="flex" style={{ gap: 6, marginTop: 4 }}>
              {[
                { l: "P", v: meal.protein, col: C.blue },
                { l: "C", v: meal.carbs, col: C.gold },
                { l: "F", v: meal.fat, col: C.pink },
              ].map(({ l, v, col }) => (
                <span
                  key={l}
                  className="font-mono rounded"
                  style={{
                    fontSize: 8,
                    color: col,
                    background: alpha(col, 9),
                    padding: "1px 5px",
                  }}
                >
                  {l} {v}g
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span className="font-head font-extrabold text-soft" style={{ fontSize: 16 }}>
              {meal.calories} kcal
            </span>
            <div
              className="text-muted"
              style={{
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
            className="flex"
            style={{
              borderTop: `1px solid ${C.border}`,
              padding: "8px 12px",
              gap: 8,
              animation: "fadeIn 0.2s ease both",
            }}
          >
            <div
              className="hover-btn press flex-1 flex items-center justify-center bg-card"
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: 9,
                padding: "7px 0",
                gap: 6,
              }}
              onClick={() => setEditModal(true)}
            >
              <IconPencil size={14} color={C.soft} />
              <span className="font-mono font-bold text-soft" style={{ fontSize: 8 }}>
                EDIT
              </span>
            </div>
            <div
              className="hover-btn press flex-1 flex items-center justify-center"
              style={{
                background: alpha(C.red, 7),
                border: `1px solid ${alpha(C.red, 19)}`,
                borderRadius: 9,
                padding: "7px 0",
                gap: 6,
              }}
              onClick={() => setDeleteModal(true)}
            >
              <IconTrash size={14} color={C.red} />
              <span className="font-mono font-bold text-red" style={{ fontSize: 8 }}>
                DELETE
              </span>
            </div>
          </div>
        )}
      </div>

      <Modal id={deleteModal} close={() => setDeleteModal(null)}>
        <MealDeleteModal meal={meal} />
      </Modal>

      <Modal id={editModal} close={() => setEditModal(null)}>
        <MealEditModal meal={meal} />
      </Modal>
    </>
  );
}
