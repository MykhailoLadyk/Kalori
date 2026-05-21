import { C, F } from "../../../lib/constans";
import { Tag } from "../../shared/Primitives";
import { IconCoin } from "../../shared/DuoIcon";

// - props: themes[], currentTheme, coins, onPurchase, onClose

export default function ShopThemesModal({
  themes = [],
  currentTheme,
  coins,
  onPurchase,
}) {
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
        Themes
      </div>

      {themes.map(({ id, name, colors, price, lock, active }, i) => {
        const isActive = active || id === currentTheme;
        const isLocked = Boolean(lock);
        return (
          <div
            key={id ?? name}
            className="hover-card press"
            onClick={() => (!isLocked && !isActive ? onPurchase?.(id) : null)}
            style={{
              background: C.card,
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${isActive ? C.accent : C.border}`,
              marginBottom: 8,
              opacity: isLocked ? 0.5 : 1,
              animation: `fadeUp 0.35s ease ${i * 50}ms both`,
            }}
          >
            <div style={{ display: "flex", height: 50 }}>
              {colors.map((col, ci) => (
                <div key={ci} style={{ flex: 1, background: col }} />
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
                  {name}
                </div>
                {lock && <Tag color={C.gold}>{lock} required</Tag>}
              </div>
              {isActive ? (
                <Tag color={C.accent}>Active</Tag>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <IconCoin size={14} color={C.gold} />
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: 10,
                      color: C.gold,
                      fontWeight: 700,
                    }}
                  >
                    {price}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
