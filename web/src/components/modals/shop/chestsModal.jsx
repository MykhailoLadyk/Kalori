import { C, F, alpha } from "../../../lib/constans";
import { Tag, Mono } from "../../shared/Primitives";
import {
  IconCoin,
  IconTrophy,
  IconStar,
  IconShoppingBag,
} from "../../shared/DuoIcon";

// - props: coins, onPurchase, onClose
// - calls gameService.purchaseChest on buy

const CHEST_ICON_MAP = {
  basic: IconShoppingBag,
  rare: IconStar,
  epic: IconTrophy,
};

export default function ChestsModal({ chests = [], onPurchase }) {
  return (
    <div>
      <div
        style={{
          fontFamily: F.head,
          fontSize: 20,
          fontWeight: 900,
          color: C.text,
          marginBottom: 16,
        }}
      >
        Chests
      </div>

      {chests.map(({ id, name, price, color, desc, drops }, i) => {
        const Icon = CHEST_ICON_MAP[id] || IconTrophy;
        return (
          <div
            key={id ?? name}
            style={{
              background: C.card,
              borderRadius: 18,
              border: `1px solid ${alpha(color, 25)}`,
              marginBottom: 12,
              overflow: "hidden",
              animation: `scaleIn 0.35s ease ${i * 80}ms both`,
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${alpha(color, 8)}, ${alpha(color, 2)})`,
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderBottom: `1px solid ${alpha(color, 13)}`,
              }}
            >
              <div style={{ animation: `float ${2 + i * 0.4}s ease infinite` }}>
                <Icon size={40} color={color} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: F.head,
                    fontSize: 18,
                    fontWeight: 800,
                    color: C.text,
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: 12,
                    color: C.soft,
                    marginTop: 2,
                  }}
                >
                  {desc}
                </div>
              </div>
            </div>
            <div style={{ padding: "12px 16px" }}>
              <Mono size={8} color={C.mutedLight}>
                Possible drops
              </Mono>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 5,
                  marginTop: 7,
                }}
              >
                {drops.map((d) => (
                  <Tag key={d} color={color}>
                    {d}
                  </Tag>
                ))}
              </div>
              <div
                onClick={() => onPurchase?.(id)}
                className="hover-btn press"
                style={{
                  marginTop: 12,
                  background: color,
                  borderRadius: 10,
                  padding: "10px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <IconCoin size={14} color="#000" />
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#000",
                  }}
                >
                  {price} — Open Chest
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
