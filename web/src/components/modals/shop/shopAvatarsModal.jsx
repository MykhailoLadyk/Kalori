import { useState } from "react";
import { C, F } from "../../../lib/constants";
import { Tag } from "../../shared/Primitives";
import { IconCoin } from "../../shared/DuoIcon";
import { useUser } from "../../../hooks/useUser";
import { useGameStats } from "../../../hooks/useGameStats";
import { useNotifications } from "../../../context/NotificationContext";
import { supabase } from "../../../services/supabase";

export default function ShopAvatarsModal({ avatars = [], currentAvatar, coins, user }) {
  const { updateUser, refreshUser } = useUser();
  const { refreshGameData } = useGameStats();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const activeAvatarId = currentAvatar || "initial";

  const onPurchase = async (avatarId) => {
    if (loading) return;
    setLoading(true);

    const avatar = avatars.find((a) => a.id === avatarId);
    if (!avatar) {
      setLoading(false);
      return;
    }
    if (coins < avatar.price) {
      addNotification({ type: "error", name: "Not enough coins" });
      setLoading(false);
      return;
    }

    try {
      const { data, error: rpcError } = await supabase.rpc("purchase_avatar", {
        p_avatar_id: avatar.id,
      });

      if (rpcError) throw rpcError;

      await refreshUser();
      await refreshGameData();

      addNotification({ type: "success", name: `Unlocked ${avatar.name}!` });
    } catch (err) {
      addNotification({ type: "error", name: err.message || "Purchase failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = async (avatar, isLocked, isCurrent, isOwned) => {
    if (isLocked || loading) return;

    if (isOwned) {
      if (isCurrent) return;
      await updateUser({ settings: { avatar: avatar.id } });
      return;
    }

    await onPurchase(avatar.id);
  };

  return (
    <div>
      <div style={{ fontFamily: F.head, fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 16 }}>
        Profile Pictures
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {avatars.map(({ id, name, type, bg, price, lock, owned, paths }) => {
          const isCurrent = String(id) === String(activeAvatarId);
          const isOwned = Boolean(owned);
          const isLocked = Boolean(lock);
          const userName = user?.name || "User";
          const initial = userName[0]?.toUpperCase() ?? "?";

          return (
            <div
              key={id}
              className="press"
              onClick={() => handleAvatarClick({ id }, isLocked, isCurrent, isOwned)}
              style={{
                background: C.card,
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${isCurrent ? C.accent : C.border}`,
                opacity: isLocked ? 0.5 : 1,
                transition: "all 0.2s ease",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: bg || `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: type === "emoji" ? 28 : 22,
                  fontFamily: F.head,
                  fontWeight: 900,
                  color: "#000",
                  marginBottom: 10,
                  boxShadow: isCurrent ? `0 0 16px ${C.accentGlow}` : "none",
                }}
              >
                {type === "pixel" ? (
                  <svg width={30} height={30} viewBox="0 0 256 256" fill="none">
                    <g opacity="0.2" fill="#000">
                      <path d={paths?.detail} />
                    </g>
                    <g fill="#000">
                      <path d={paths?.main} />
                    </g>
                  </svg>
                ) : (
                  initial
                )}
              </div>

              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 6,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {name}
              </div>

              {isLocked ? (
                <Tag color={C.gold}>{lock} required</Tag>
              ) : isCurrent ? (
                <Tag color={C.accent}>Active</Tag>
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
          );
        })}
      </div>
    </div>
  );
}
