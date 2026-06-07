import { C, F } from "../../../lib/constans";
import { Tag } from "../../../components/shared/Primitives";
import { useState } from "react";

const THEMES = [
  {
    id: "midnight_mint",
    name: "Midnight Mint",
    colors: ["#0B0B12", "#6EE7B7"],
    price: 0,
    active: true,
  },
  {
    id: "warm_paper",
    name: "Warm Paper",
    colors: ["#F5F0E8", "#FF4D00"],
    price: 200,
  },
  {
    id: "teal_night",
    name: "Teal Night",
    colors: ["#0E0E1A", "#00E5CC"],
    price: 200,
  },
  // {
  //   id: "aurora",
  //   name: "Aurora",
  //   colors: ["#0a0014", "#cc44ff"],
  //   price: 500,
  //   lock: "Lv 8",
  // },
  // {
  //   id: "ember_dark",
  //   name: "Ember Dark",
  //   colors: ["#1a0800", "#FF8C42"],
  //   price: 350,
  // },
  // {
  //   id: "ocean_depth",
  //   name: "Ocean Depth",
  //   colors: ["#020d1a", "#0ea5e9"],
  //   price: 300,
  // },
];

export default function ThemeModal({ onClose }) {
  const [selected, setSelected] = useState("midnight_mint");
  const [loading, setLoading] = useState(false);

  // mock coins — replace with gameData.coins

  const handleApply = async () => {};

  const handlePurchase = async (theme) => {
    // deduct coins and unlock — wire to gameService
    console.log("purchase", theme.id);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontFamily: F.head,
            fontSize: 20,
            fontWeight: 900,
            color: C.text,
          }}
        >
          Themes
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {THEMES.map((theme) => {
          const isSelected = selected === theme.id;
          const isLocked = !!theme.lock;
          const isFree = theme.price === 0;
          const isOwned = isFree || theme.active;

          return (
            <div
              key={theme.id}
              onClick={() => !isLocked && setSelected(theme.id)}
              className={isLocked ? "" : "press"}
              style={{
                background: C.card,
                border: `1px solid ${isSelected ? C.accent : C.border}`,
                borderRadius: 14,
                overflow: "hidden",
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", height: 44 }}>
                {theme.colors.map((col, i) => (
                  <div key={i} style={{ flex: 1, background: col }} />
                ))}
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.text,
                    }}
                  >
                    {theme.name}
                  </div>
                  {isLocked && (
                    <div style={{ marginTop: 2 }}>
                      <Tag color={C.gold}>{theme.lock} required</Tag>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isSelected && <Tag color={C.accent}>Selected</Tag>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        onClick={!loading ? handleApply : undefined}
        className="hover-btn press"
        style={{
          background: loading ? C.accentDim : C.accent,
          borderRadius: 12,
          padding: "13px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 700,
            color: loading ? C.accent : "#000",
          }}
        >
          {loading ? "APPLYING..." : "APPLY THEME"}
        </span>
      </div>
    </div>
  );
}
