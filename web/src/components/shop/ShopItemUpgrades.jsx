import { useTranslation } from "react-i18next";
import { C, F } from "../../lib/constants";
import { Tag } from "../shared/Primitives";
import { IconTarget, IconCoin } from "../shared/DuoIcon";

export default function ShopItemUpgrades({ upgrades = [] }) {
  const { t } = useTranslation();
  const item = upgrades[0];
  if (!item) return null;

  const displayName = t("shop_items.upgrades." + item.id + ".name", { defaultValue: item.name });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ animation: "float 2s ease infinite" }}>
        <IconTarget size={30} color={C.accent} />
      </div>
      <div>
        <div style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.text }}>
          {displayName}
        </div>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
        {item.owned ? (
          <Tag color={C.accent}>{t("shop.active")}</Tag>
        ) : item.lock ? (
          <Tag color={C.muted}>{item.lock}</Tag>
        ) : (
          <>
            <IconCoin size={14} color={C.gold} />
            <span style={{ fontFamily: F.mono, fontSize: 11, color: C.gold, fontWeight: 700 }}>
              {item.price}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
