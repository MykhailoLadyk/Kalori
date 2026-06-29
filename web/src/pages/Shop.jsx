import { useState } from "react";
import { useGameStats } from "../hooks/useGameStats";
import { useUser } from "../hooks/useUser";
import { C, F, levels, themesDefinitions } from "../lib/constans";
import { Modal } from "../components/modals/Modal";
import { Mono, Tag } from "../components/shared/Primitives";
import { IconCoin, IconPalette, IconTrophy, IconShield } from "../components/shared/DuoIcon";
import ShopItemThemes from "../components/shop/ShopItemThemes";
import ShopItemChests from "../components/shop/ShopItemChests";
import ShopItemOther from "../components/shop/ShopItemOther";
import ShopThemesModal from "../components/modals/shop/shopThemesModal";
import ShopOtherModal from "../components/modals/shop/shopOtherModal";
import ChestsModal from "../components/modals/shop/chestsModal";

export default function Shop() {
  const [modal, setModal] = useState(null);
  const { gameData, shopItems } = useGameStats();
  const { user } = useUser();

  const coins = gameData.coins;
  const themesOwned = shopItems?.themesOwned ?? [];

  let level = 0;
  for (const [lvl, xp] of Object.entries(levels)) {
    if (gameData.xp_total >= xp) {
      level = Number(lvl);
    } else {
      break;
    }
  }

  const themes = themesDefinitions.map((theme) => {
    const isLocked = level < theme.lvlUnlocked;
    return { ...theme, owned: themesOwned.includes(theme.id), lock: isLocked ? `Lv ${theme.lvlUnlocked}` : null };
  });
  const chests = [
    {
      id: "basic",
      name: "Basic Chest",
      price: 100,
      color: C.blue,
      desc: "Common & uncommon items",
      drops: ["Coins ×20-50", "Common theme", "Small XP boost"],
    },
    {
      id: "rare",
      name: "Rare Chest",
      price: 300,
      color: C.pink,
      desc: "Uncommon & rare items",
      drops: ["Coins ×50-150", "Rare theme", "Streak shield"],
    },
    {
      id: "epic",
      name: "Epic Chest",
      price: 800,
      color: C.gold,
      desc: "Rare & epic guaranteed",
      drops: ["Coins ×150-500", "Epic theme", "3× Shields"],
    },
  ];
  const sections = [
    {
      id: "themes",
      label: "Themes",
      Icon: IconPalette,
      desc: "Personalize your look",
      count: `${themes.length} available`,
      color: C.pink,
      preview: <ShopItemThemes previewColors={themes.map((t) => t.colors)} />,
    },
    // {
    //   id: "chests",
    //   label: "Chests",
    //   Icon: IconTrophy,
    //   desc: "Unlock random rewards",
    //   count: `${chests.length} types`,
    //   color: C.gold,
    //   preview: <ShopItemChests colors={[C.blue, C.pink, C.gold]} />,
    // },
    {
      id: "other",
      label: "Other",
      Icon: IconShield,
      desc: "Streak shields & more",
      count: "Shields",
      color: C.orange,
      preview: <ShopItemOther />,
    },
  ];

  const modals = {
    themes: <ShopThemesModal themes={themes} currentTheme={user?.settings?.theme} coins={coins} />,
    chests: <ChestsModal />,
    other: <ShopOtherModal />,
  };

  return (
    <div style={{ padding: "16px 22px 16px" }}>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14, animation: "fadeUp 0.4s ease both" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: C.goldDim,
            border: `1px solid ${C.gold}40`,
            borderRadius: 11,
            padding: "7px 14px",
            animation: "pulseGold 2.5s ease infinite",
          }}
        >
          <IconCoin size={18} color={C.gold} />
          <span style={{ fontFamily: F.head, fontSize: 20, fontWeight: 900, color: C.gold }}>{coins}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sections.map(({ id, label, Icon, desc, count, color, preview }, i) => (
          <div
            key={id}
            onClick={() => setModal(id)}
            className="hover-card press"
            style={{
              background: C.card,
              borderRadius: 18,
              padding: "16px",
              border: `1px solid ${C.border}`,
              animation: `fadeUp 0.4s ease ${0.1 + i * 0.1}s both`,
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Icon size={20} color={color} />
                  <span style={{ fontFamily: F.head, fontSize: 17, fontWeight: 800, color: C.text }}>{label}</span>
                </div>
                <Mono size={8} color={C.muted}>
                  {desc}
                </Mono>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Tag color={color}>{count}</Tag>
                <span style={{ color: C.muted, fontSize: 16 }}>›</span>
              </div>
            </div>
            {preview}
          </div>
        ))}
      </div>

      <Modal id={modal} close={() => setModal(null)}>
        {modals[modal]}
      </Modal>
    </div>
  );
}
