import { C, alpha } from "../../lib/constants";
import { IconFire } from "../shared/DuoIcon";

export default function ShopItemFlames({ flames = [] }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {flames.slice(0, 5).map((flame) => (
        <div
          key={flame.id}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 10,
            background: alpha(flame.color, 12),
            border: `1px solid ${alpha(flame.color, 30)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconFire size={20} color={flame.color} />
        </div>
      ))}
    </div>
  );
}
