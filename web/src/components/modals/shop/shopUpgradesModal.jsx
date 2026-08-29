import { useState } from "react";
import { C, F, alpha } from "../../../lib/constants";
import { Tag } from "../../shared/Primitives";
import { IconCoin, IconTarget, IconCheck, IconLock } from "../../shared/DuoIcon";
import { useGameStats } from "../../../hooks/useGameStats";
import { useUser } from "../../../hooks/useUser";
import { useNotifications } from "../../../context/NotificationContext";
import { supabase } from "../../../services/supabase";

export default function ShopUpgradesModal({ upgrades = [], coins, user }) {
  const { refreshGameData, setQuests } = useGameStats();
  const { refreshUser } = useUser();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const onPurchase = async (upgrade) => {
    if (loading || upgrade.owned || upgrade.lock) return;
    if (coins < upgrade.price) {
      addNotification({ type: "error", name: "Not enough coins" });
      return;
    }

    setLoading(true);

    try {
      const { data, error: rpcError } = await supabase.rpc("purchase_upgrade", {
        p_upgrade_id: upgrade.id,
      });

      if (rpcError) throw rpcError;

      if (data?.quests) {
        setQuests(data.quests);
      }
      await refreshUser();
      await refreshGameData();
      addNotification({ type: "success", name: `Unlocked ${upgrade.name}!` });
    } catch (err) {
      addNotification({ type: "error", name: err.message || "Purchase failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ fontFamily: F.head, fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 16 }}>
        Perma Upgrades
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {upgrades.map((upgrade) => (
          <div
            key={upgrade.id}
            style={{
              background: upgrade.owned ? alpha(C.accent, 8) : C.card,
              border: `1px solid ${upgrade.owned ? alpha(C.accent, 30) : C.border}`,
              borderRadius: 16,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: upgrade.owned ? alpha(C.accent, 15) : alpha(C.border, 40),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconTarget size={24} color={upgrade.owned ? C.accent : C.muted} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: F.head, fontSize: 16, fontWeight: 800, color: C.text }}>
                    {upgrade.name}
                  </span>
                  {upgrade.lock && <Tag color={C.muted}>{upgrade.lock}</Tag>}
                  {upgrade.owned && <Tag color={C.accent}>OWNED</Tag>}
                </div>
                <div style={{ fontFamily: F.body, fontSize: 12, color: C.soft, lineHeight: 1.4 }}>
                  {upgrade.desc}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 4 }}>
              {upgrade.owned ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <IconCheck size={16} color={C.accent} />
                  <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: C.accent }}>
                    PERMANENTLY ACTIVE
                  </span>
                </div>
              ) : upgrade.lock ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.6 }}>
                  <IconLock size={14} color={C.muted} />
                  <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: C.muted }}>
                    UNLOCKS AT LEVEL {upgrade.lvlUnlocked}
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => onPurchase(upgrade)}
                  className="hover-btn press cursor-pointer"
                  style={{
                    background: C.accent,
                    borderRadius: 10,
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <IconCoin size={14} color="#000" />
                  <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 800, color: "#000" }}>
                    {upgrade.price} COINS
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
