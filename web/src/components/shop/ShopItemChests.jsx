import { IconTrophy } from "../shared/DuoIcon";
import { alpha } from "../../lib/constans";

export default function ShopItemChests({ colors = [] }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {colors.map((col, i) => (
        <div
          key={`${col}-${i}`}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: alpha(col, 13),
            border: `1px solid ${alpha(col, 31)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: `float ${2 + i * 0.3}s ease infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          <IconTrophy size={18} color={col} />
        </div>
      ))}
    </div>
  );
}
