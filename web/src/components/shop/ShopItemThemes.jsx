import { C } from "../../lib/constans";

export default function ShopItemThemes({ previewColors = [] }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {previewColors.slice(0, 4).map(([bg, ac], i) => (
        <div
          key={`${bg}-${i}`}
          style={{
            flex: 1,
            height: 28,
            borderRadius: 5,
            background: bg,
            border: `2px solid ${ac ?? C.accent}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 8,
              background: ac ?? C.accent,
              opacity: 0.5,
            }}
          />
        </div>
      ))}
    </div>
  );
}
