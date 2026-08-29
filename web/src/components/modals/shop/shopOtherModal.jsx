import { useState } from "react";
import { useTranslation } from "react-i18next";
import { C, F, alpha } from "../../../lib/constants";
import { Mono } from "../../shared/Primitives";
import { IconShield, IconCoin } from "../../shared/DuoIcon";
import { shieldPacks } from "../../../lib/constants";
import { useGameStats } from "../../../hooks/useGameStats";
import { useNotifications } from "../../../context/NotificationContext";
import { supabase } from "../../../services/supabase";

export default function ShopOtherModal() {
  const { t } = useTranslation();
  const { gameData, refreshGameData } = useGameStats();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  async function onPurchase(price, qty) {
    if (loading) return;
    setLoading(true);
    
    if (gameData.coins < price) {
      addNotification({ type: "error", name: t("notifs.notEnoughCoins") });
      setLoading(false);
      return;
    }
    
    try {
      const parsedQty = parseInt(qty, 10);
      const { data, error: rpcError } = await supabase.rpc("purchase_shield", {
        p_qty: parsedQty,
      });

      if (rpcError) throw rpcError;

      await refreshGameData();
      addNotification({ type: "success", name: t("notifs.purchasedShields", { qty }) });
    } catch (err) {
      addNotification({ type: "error", name: err.message || t("notifs.purchaseFailed") });
    } finally {
      setLoading(false);
    }
  }

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
        {t("shop.other")}
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${alpha(C.orange, 13)}, ${alpha(C.gold, 6)})`,
          border: `1px solid ${alpha(C.orange, 25)}`,
          borderRadius: 18,
          padding: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ animation: "float 2s ease infinite" }}>
            <IconShield size={44} color={C.orange} />
          </div>
          <div>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 20,
                fontWeight: 800,
                color: C.text,
              }}
            >
              {t("shop.streakShield")}
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 12,
                color: C.soft,
                marginTop: 3,
              }}
            >
              {t("shop.streakShieldSub")}
            </div>
          </div>
        </div>
        <div
          style={{
            background: C.border,
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 12,
          }}
        >
          <Mono size={8} color={C.mutedLight}>
            {t("shop.howItWorks")}
          </Mono>
          <div
            style={{
              fontFamily: F.body,
              fontSize: 12,
              color: C.soft,
              marginTop: 4,
            }}
          >
            {t("shop.howItWorksSub")}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {shieldPacks.map(({ qty, price }, i) => (
            <div
              key={qty}
              onClick={() => onPurchase(price, qty)}
              className="hover-btn press"
              style={{
                flex: 1,
                background: "#FB923C",
                borderRadius: 10,
                padding: "10px 0",
                textAlign: "center",
                animation: `bounceIn 0.4s ease ${i * 80 + 200}ms both`,
              }}
            >
              <div
                style={{
                  fontFamily: F.head,
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#000",
                }}
              >
                {qty}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <IconCoin size={10} color={alpha("#000", 56)} />
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 9,
                    color: alpha("#000", 56),
                    fontWeight: 700,
                  }}
                >
                  {price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
