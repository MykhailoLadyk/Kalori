import { useTranslation } from "react-i18next";
import { C, F } from "../../lib/constants";
import { IconShield, IconCoin } from "../shared/DuoIcon";

export default function ShopItemOther({ price = 150 }) {
  const { t } = useTranslation();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ animation: "float 2s ease infinite" }}>
        <IconShield size={32} color={C.orange} />
      </div>
      <div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
          }}
        >
          {t("shop.streakShield")}
        </div>
      </div>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <IconCoin size={14} color={C.gold} />
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            color: C.gold,
            fontWeight: 700,
          }}
        >
          {price}
        </span>
      </div>
    </div>
  );
}
