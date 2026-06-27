import { C, F } from "../../../lib/constans";
import { Tag } from "../../shared/Primitives";
import { IconCoin } from "../../shared/DuoIcon";
import { useUser } from "../../../hooks/useUser";
import { useGameStats } from "../../../hooks/useGameStats";
export default function ShopThemesModal({ themes = [], currentTheme, coins }) {
  const { updateUser } = useUser();
  const { updateShopItems, shopItems, updateGameData, gameData } =
    useGameStats();
  const onPurchase = async (themeId) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    if (coins < theme.price) {
      alert("Not enough coins to purchase this theme.");
      return;
    }

    await updateUser({
      settings: {
        theme: theme.id,
      },
    });
    await updateShopItems({
      themesOwned: [...(shopItems?.themesOwned || []), theme.id],
    });
    await updateGameData({
      coins: gameData.coins - theme.price,
    });
  };

  const handleThemeClick = async (theme, isLocked, isCurrent, isOwned) => {
    if (isLocked) return;

    if (isOwned) {
      if (isCurrent) return;

      await updateUser({
        settings: {
          theme: theme.id,
        },
      });
      return;
    }

    await onPurchase(theme.id);
  };

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

      {themes.map(({ id, name, colors, price, lock, owned }, i) => {
        const isCurrent = String(id) === String(currentTheme);
        const isOwned = Boolean(owned);
        const isLocked = Boolean(lock);
        return (
          <div
            key={id ?? name}
            className="press"
            onClick={() =>
              handleThemeClick({ id }, isLocked, isCurrent, isOwned)
            }
            style={{
              background: C.card,
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${isCurrent ? C.accent : C.border}`,
              marginBottom: 8,
              opacity: isLocked ? 0.5 : 1,
              transition: "all 0.2s ease",
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
              {isCurrent ? (
                <Tag color={C.accent}>Active</Tag>
              ) : isOwned ? (
                <Tag color={C.blue}>Owned</Tag>
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
