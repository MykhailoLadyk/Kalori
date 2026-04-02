import { C, F } from "../../lib/constans";
import { MealCard } from "./MealCard";

const MEAL_TYPES = [
  { key: "Breakfast", color: C.gold },
  { key: "Lunch", color: C.blue },
  { key: "Dinner", color: C.pink },
  { key: "Snacks", color: C.orange },
];

export function Meals({ meals }) {
  return (
    <>
      {MEAL_TYPES.map(({ key, color }) => {
        const items = meals[key] ?? [];
        return (
          <div key={key} style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 7,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 13,
                  background: color,
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 8,
                  color,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                {key}
              </span>
            </div>
            {items.length === 0 ? (
              <div
                style={{
                  background: C.card,
                  borderRadius: 12,
                  padding: "10px 14px",
                  border: `1px dashed ${C.border}`,
                  fontFamily: F.body,
                  fontSize: 12,
                  color: C.muted,
                  textAlign: "center",
                }}
              >
                Nothing logged yet
              </div>
            ) : (
              items.map((meal, index) => (
                <MealCard
                  key={meal.id ?? index}
                  meal={meal}
                  color={color}
                  type={key}
                />
              ))
            )}
          </div>
        );
      })}
    </>
  );
}
