import { useState } from "react";
import { useTranslation } from "react-i18next";
import { C, F, alpha } from "../../lib/constants";
import {
  IconPencil,
  IconTrash,
  IconStar,
  IconStarOutline,
  IconMealBreakfast,
  IconMealLunch,
  IconMealDinner,
  IconMealSnacks,
} from "../shared/DuoIcon";
import { useFavorites } from "../../hooks/useFavorites";
import { MealDeleteModal } from "../modals/home/MealDeleteModal";
import { MealEditModal } from "../modals/home/MealEditModal";
import { Modal } from "../modals/Modal";

export function MealCard({ meal, color, type }) {
  const { t } = useTranslation();
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const { isFavorite, addFavorite, removeFavorite, getFavoriteByName } = useFavorites();
  const mealIsFav = isFavorite(meal.name);

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
            {type === "breakfast" && <IconMealBreakfast size={20} color={color} />}
            {type === "lunch" && <IconMealLunch size={20} color={color} />}
            {type === "dinner" && <IconMealDinner size={20} color={color} />}
            {type === "snacks" && <IconMealSnacks size={20} color={color} />}
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
                border: `1px solid ${mealIsFav ? alpha(C.gold, 25) : C.border}`,
                borderRadius: 9,
                padding: "7px 0",
                gap: 6,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (mealIsFav) {
                  const fav = getFavoriteByName(meal.name);
                  if (fav) removeFavorite(fav.id);
                } else {
                  addFavorite({
                    name: meal.name,
                    calories: meal.calories,
                    protein: meal.protein,
                    carbs: meal.carbs,
                    fat: meal.fat,
                    type: type,
                  });
                }
              }}
            >
              {mealIsFav ? <IconStar size={14} color={C.gold} /> : <IconStarOutline size={14} color={C.soft} />}
              <span className="font-mono font-bold" style={{ fontSize: 8, color: mealIsFav ? C.gold : C.soft }}>
                {mealIsFav ? t("meal.unfave") : t("meal.fave")}
              </span>
            </div>
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
                {t("common.edit")}
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
                {t("common.delete")}
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
