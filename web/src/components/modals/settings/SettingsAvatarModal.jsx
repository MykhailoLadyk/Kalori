import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { C, F, avatarsDefinitions } from "../../../lib/constants";
import { Tag } from "../../../components/shared/Primitives";
import { useUser } from "../../../hooks/useUser";
import { useGameStats } from "../../../hooks/useGameStats";

export default function SettingsAvatarModal({ handleClose }) {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const { shopItems } = useGameStats();
  const avatarsOwned = shopItems?.avatarsOwned ?? ["initial"];
  const ownedAvatars = avatarsDefinitions.filter((avatar) =>
    avatarsOwned.includes(avatar.id),
  );

  const [selected, setSelected] = useState(user?.settings?.avatar || "initial");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelected(user?.settings?.avatar || "initial");
  }, [user]);

  const handleSelectAvatar = async (avatar) => {
    setSelected(avatar.id);
    await updateUser({
      settings: {
        avatar: avatar.id,
      },
    });
  };

  const handleApply = () => {
    handleClose();
  };

  const userName = user?.name || "User";
  const initial = userName[0]?.toUpperCase() ?? "?";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontFamily: F.head,
            fontSize: 20,
            fontWeight: 900,
            color: C.text,
          }}
        >
          {t("settings.profilePictures")}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {ownedAvatars.map((avatar) => {
          const isSelected = selected === avatar.id;

          return (
            <div
              key={avatar.id}
              onClick={() => handleSelectAvatar(avatar)}
              className="press"
              style={{
                background: C.card,
                border: `1px solid ${isSelected ? C.accent : C.border}`,
                borderRadius: 14,
                padding: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background:
                    avatar.bg ||
                    `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: avatar.type === "emoji" ? 26 : 20,
                  fontFamily: F.head,
                  fontWeight: 900,
                  color: "#000",
                  marginBottom: 8,
                }}
              >
                {avatar.type === "pixel" ? (
                  <svg width={28} height={28} viewBox="0 0 256 256" fill="none">
                    <g opacity="0.2" fill="#000">
                      <path d={avatar.paths?.detail} />
                    </g>
                    <g fill="#000">
                      <path d={avatar.paths?.main} />
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
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: 6,
                }}
              >
                {t("shop_items.avatars." + avatar.id + ".name", { defaultValue: avatar.name })}
              </div>

              {isSelected && <Tag color={C.accent}>{t("shop.active") || "Active"}</Tag>}
            </div>
          );
        })}
      </div>

      <div
        onClick={!loading ? handleApply : undefined}
        className="hover-btn press"
        style={{
          background: loading ? C.accentDim : C.accent,
          borderRadius: 12,
          padding: "13px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 700,
            color: loading ? C.accent : "#000",
          }}
        >
          {t("settings.applyAvatar")}
        </span>
      </div>
    </div>
  );
}
