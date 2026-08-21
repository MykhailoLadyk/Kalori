import { useState } from "react";
import { C, F, alpha } from "../../../lib/constants";
import { Mono, Tag } from "../../shared/Primitives";
import { IconCoin, IconFire } from "../../shared/DuoIcon";
import { useUser } from "../../../hooks/useUser";
import { useGameStats } from "../../../hooks/useGameStats";
import { supabase } from "../../../services/supabase";

export default function ShopFlamesModal({ flames = [], currentFlame, coins }) {
  const { user, updateUser, refreshUser } = useUser();
  const { refreshGameData } = useGameStats();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeFlameId = currentFlame || "orange";

  const onPurchase = async (flameId) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    const flame = flames.find((f) => f.id === flameId);
    if (!flame) {
      setLoading(false);
      return;
    }
    if (coins < flame.price) {
      setError("Not enough coins to purchase this flame color.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: rpcError } = await supabase.rpc("purchase_flame_color", {
        p_flame_id: flame.id,
        p_price: flame.price,
      });

      if (rpcError) throw rpcError;

      await refreshUser();
      await refreshGameData();

      setMessage(`Unlocked ${flame.name}!`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message || "Purchase failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlameClick = async (flame, isLocked, isCurrent, isOwned) => {
    if (isLocked || loading) return;

    if (isOwned) {
      if (isCurrent) return;
      await updateUser({ settings: { flame_color: flame.id } });
      return;
    }

    await onPurchase(flame.id);
  };

  return (
    <div>
      <div style={{ fontFamily: F.head, fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 16 }}>
        Streak Flame Colors
      </div>

      {(error || message) && (
        <div style={{ marginBottom: 16, textAlign: "center", animation: "fadeIn 0.3s ease" }}>
          <Mono size={9} color={error ? C.red : C.accent}>
            {error || message}
          </Mono>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {flames.map(({ id, name, color, price, lock, owned }) => {
          const isCurrent = String(id) === String(activeFlameId);
          const isOwned = Boolean(owned);
          const isLocked = Boolean(lock);

          return (
            <div
              key={id}
              className="press"
              onClick={() => handleFlameClick({ id }, isLocked, isCurrent, isOwned)}
              style={{
                background: C.card,
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${isCurrent ? color : C.border}`,
                opacity: isLocked ? 0.5 : 1,
                transition: "all 0.2s ease",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: alpha(color, 15),
                    border: `1px solid ${alpha(color, 35)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isCurrent ? `0 0 16px ${alpha(color, 40)}` : "none",
                  }}
                >
                  <IconFire size={24} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: C.text }}>
                    {name}
                  </div>
                  {lock && <Tag color={C.gold}>{lock} required</Tag>}
                </div>
              </div>

              <div>
                {isCurrent ? (
                  <Tag color={color}>Active</Tag>
                ) : isOwned ? (
                  <Tag color={C.blue}>Owned</Tag>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <IconCoin size={14} color={C.gold} />
                    <span style={{ fontFamily: F.mono, fontSize: 11, color: C.gold, fontWeight: 700 }}>
                      {price}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
