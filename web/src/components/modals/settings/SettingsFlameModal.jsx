import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { C, F, alpha, flameColorsDefinitions } from "../../../lib/constants";
import { Tag } from "../../../components/shared/Primitives";
import { IconFire } from "../../../components/shared/DuoIcon";
import { useUser } from "../../../hooks/useUser";
import { useGameStats } from "../../../hooks/useGameStats";

export default function SettingsFlameModal({ handleClose }) {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const { shopItems } = useGameStats();
  const flameColorsOwned = shopItems?.flameColorsOwned ?? ["orange"];
  const ownedFlames = flameColorsDefinitions.filter((flame) =>
    flameColorsOwned.includes(flame.id),
  );

  const [selected, setSelected] = useState(
    user?.settings?.flame_color || "orange",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelected(user?.settings?.flame_color || "orange");
  }, [user]);

  const handleSelectFlame = async (flame) => {
    setSelected(flame.id);
    await updateUser({
      settings: {
        flame_color: flame.id,
      },
    });
  };

  const handleApply = () => {
    handleClose();
  };

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
          {t("settings.streakFlameColors")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {ownedFlames.map((flame) => {
          const isSelected = selected === flame.id;

          return (
            <div
              key={flame.id}
              onClick={() => handleSelectFlame(flame)}
              className="press"
              style={{
                background: C.card,
                border: `1px solid ${isSelected ? flame.color : C.border}`,
                borderRadius: 14,
                padding: "12px 14px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: alpha(flame.color, 15),
                    border: `1px solid ${alpha(flame.color, 35)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconFire size={22} color={flame.color} />
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.text,
                  }}
                >
                  {t("shop_items.flames." + flame.id + ".name", { defaultValue: flame.name })}
                </div>
              </div>

              {isSelected && <Tag color={flame.color}>{t("shop.active") || "Active"}</Tag>}
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
          {t("settings.applyFlame")}
        </span>
      </div>
    </div>
  );
}
