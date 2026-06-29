// modals/home/MealDeleteModal.jsx
import { C, F, alpha } from "../../../lib/constans";
import { IconTrash } from "../../shared/DuoIcon";
import { useMeals } from "../../../hooks/useMeals";

export function MealDeleteModal({ meal, handleClose }) {
  const { deleteMeal } = useMeals();

  const handleDelete = async () => {
    await deleteMeal(meal.name);
    handleClose();
  };
  return (
    <div>
      {/* icon */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: alpha(C.red, 8),
            border: `1px solid ${alpha(C.red, 19)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconTrash size={26} color={C.red} />
        </div>
      </div>

      {/* title */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div
          style={{
            fontFamily: F.head,
            fontSize: 20,
            fontWeight: 900,
            color: C.text,
          }}
        >
          Delete Meal
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 13,
            color: C.soft,
            marginTop: 6,
          }}
        >
          Are you sure you want to delete
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            marginTop: 2,
          }}
        >
          {meal?.name}?
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 11,
            color: C.muted,
            marginTop: 6,
          }}
        >
          This action cannot be undone.
        </div>
      </div>

      {/* meal preview */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "16px 0",
        }}
      >
        <span
          style={{
            fontFamily: F.body,
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
          }}
        >
          {meal?.name}
        </span>
        <span
          style={{
            fontFamily: F.head,
            fontSize: 15,
            fontWeight: 800,
            color: C.soft,
          }}
        >
          {meal?.calories} kcal
        </span>
      </div>

      {/* buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <div
          onClick={() => {
            handleClose();
          }}
          className="hover-btn press"
          style={{
            flex: 1,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "13px 0",
            textAlign: "center",
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 700,
            color: C.soft,
            cursor: "pointer",
          }}
        >
          CANCEL
        </div>
        <div
          onClick={() => {
            handleDelete();
            handleClose();
          }}
          className="hover-btn press"
          style={{
            flex: 1,
            background: alpha(C.red, 13),
            border: `1px solid ${alpha(C.red, 31)}`,
            borderRadius: 12,
            padding: "13px 0",
            textAlign: "center",
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 700,
            color: C.red,
            cursor: "pointer",
          }}
        >
          DELETE
        </div>
      </div>
    </div>
  );
}
