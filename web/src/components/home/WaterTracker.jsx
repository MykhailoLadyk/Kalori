import { useState } from "react";
import { C, F } from "../../lib/constans";
import { Mono } from "../shared/Primitives";
import { AnimBar } from "../shared/AnimBar";
import { IconDrop } from "../shared/DuoIcon";

export function WaterTracker({ current, goal, onAdd }) {
  const [inputValue, setInputValue] = useState("");

  const handleCustomAdd = () => {
    const amount = parseInt(inputValue);
    if (!amount || amount <= 0) return;
    onAdd(amount);
    setInputValue("");
  };

  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div
      className="hover-card"
      style={{
        background: C.card,
        borderRadius: 14,
        padding: "11px 14px",
        border: `1px solid ${C.border}`,
        width: "90%",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div style={{ animation: "float 3s ease infinite", flexShrink: 0 }}>
          <IconDrop size={22} color={C.blue} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Mono size={8} color={C.mutedLight}>
              Water
            </Mono>
            <Mono size={8} color={C.blue}>
              {current}ml / {goal}ml
            </Mono>
          </div>
          <AnimBar pct={pct} color={C.blue} delay={900} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {[250, 400].map((amount) => (
          <div
            key={amount}
            onClick={() => onAdd(amount)}
            className="hover-btn press"
            style={{
              flex: 1,
              background: C.blueDim,
              border: `1px solid ${C.blue}40`,
              borderRadius: 9,
              padding: "7px 0",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 9,
                fontWeight: 700,
                color: C.blue,
              }}
            >
              +{amount}ml
            </span>
          </div>
        ))}

        <div
          style={{
            flex: 1,
            display: "flex",
            background: C.blueDim,
            border: `1px solid ${C.blue}40`,
            borderRadius: 9,
            overflow: "hidden",
          }}
        >
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
            placeholder="ml"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: "7px 8px",
              fontFamily: F.mono,
              fontSize: 9,
              fontWeight: 700,
              color: C.blue,
              width: 0,
            }}
          />
          <div
            onClick={handleCustomAdd}
            className="press"
            style={{
              padding: "7px 10px",
              background: `${C.blue}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderLeft: `1px solid ${C.blue}40`,
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 10,
                fontWeight: 700,
                color: C.blue,
              }}
            >
              +
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
