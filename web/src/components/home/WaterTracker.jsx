import { useState } from "react";
import { C, F, alpha } from "../../lib/constants";
import { AnimBar } from "../shared/AnimBar";
import { IconDrop } from "../shared/DuoIcon";
import { useMeals } from "../../hooks/useMeals";
import { useUser } from "../../hooks/useUser";
import { useGameStats } from "../../hooks/useGameStats";
import { getLocalYMD } from "../../lib/dateUtils";
export function WaterTracker() {
  const { meals, addMeal, selectedDate } = useMeals();
  const { user } = useUser();
  const { syncProgress } = useGameStats();
  const waterMeals = meals.filter((m) => m.name.toLowerCase() === "water");
  const current = waterMeals.reduce((sum, m) => sum + m.amount, 0);
  const goal = user?.targets?.water || 2500;
  const [inputValue, setInputValue] = useState("");

  const handleAddWater = async (amount) => {
    await addMeal({ name: "water", amount });
    const isToday = !selectedDate || getLocalYMD(selectedDate) === getLocalYMD(new Date());
    if (isToday) {
      await syncProgress(getLocalYMD(new Date()), false);
    }
  };


  const handleCustomAdd = () => {
    const amount = parseInt(inputValue, 10);
    if (isNaN(amount) || amount <= 0 || amount > 10000) return;
    handleAddWater(amount);
    setInputValue("");
  };

  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div style={{ padding: "12px 22px 24px", animation: "fadeUp 0.4s ease 0.7s both" }}>
      <div
        data-tour="water-tracker"
        className="hover-card"
        style={{
          background: C.card,
          borderRadius: 18,
          padding: "16px",
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: alpha(C.blue, 12),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconDrop size={20} color={C.blue} />
          </div>
          <div>
            <div style={{ fontFamily: F.head, fontSize: 15, fontWeight: 800, color: C.text }}>
              Water Intake
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 800, color: C.blue }}>
                {current.toLocaleString()}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: 10, color: C.muted }}>
                / {goal.toLocaleString()} ml
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <AnimBar pct={pct} color={C.blue} height={6} delay={0} />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "+250ml", amount: 250 },
            { label: "+500ml", amount: 500 },
          ].map(({ label, amount }) => (
            <div
              key={amount}
              onClick={() => handleAddWater(amount)}
              className="hover-btn press"
              style={{
                flex: 1,
                background: alpha(C.blue, 10),
                border: `1px solid ${alpha(C.blue, 22)}`,
                borderRadius: 10,
                padding: "9px 0",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.blue,
                }}
              >
                {label}
              </span>
            </div>
          ))}

          <div
            style={{
              flex: 1.2,
              display: "flex",
              background: C.panel,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
              placeholder="+ Custom"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "0 10px",
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 700,
                color: C.blue,
                width: 0,
              }}
            />
            <div
              onClick={handleCustomAdd}
              className="hover-btn press"
              style={{
                padding: "0 12px",
                background: alpha(C.blue, 18),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderLeft: `1px solid ${alpha(C.blue, 25)}`,
              }}
            >
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 12,
                  fontWeight: 800,
                  color: C.blue,
                }}
              >
                +
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
