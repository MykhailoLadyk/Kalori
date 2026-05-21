import { useState } from "react";
import { C, F } from "../lib/constans";
import { Modal } from "../components/modals/Modal";
import { Mono, Tag } from "../components/shared/Primitives";
import {
  IconCoin,
  IconPalette,
  IconTrophy,
  IconShield,
} from "../components/shared/DuoIcon";
import ShopItemThemes from "../components/shop/ShopItemThemes";
import ShopItemChests from "../components/shop/ShopItemChests";
import ShopItemOther from "../components/shop/ShopItemOther";
import ShopThemesModal from "../components/modals/shop/shopThemesModal";
import ShopOtherModal from "../components/modals/shop/shopOtherModal";
import ChestsModal from "../components/modals/shop/chestsModal";

export default function Shop() {
  const [modal, setModal] = useState(null);

  const coins = 847;
  const themes = [
    {
      id: "mint",
      name: "Midnight Mint",
      colors: ["#0B0B12", C.accent],
      price: 0,
      active: true,
    },
    {
      id: "warm",
      name: "Warm Paper",
      colors: ["#F5F0E8", "#FF4D00"],
      price: 200,
    },
    {
      id: "teal",
      name: "Teal Night",
      colors: ["#0E0E1A", "#00E5CC"],
      price: 200,
    },
    {
      id: "aurora",
      name: "Aurora",
      colors: ["#0a0014", "#cc44ff"],
      price: 500,
      lock: "Lv 8",
    },
    {
      id: "ember",
      name: "Ember Dark",
      colors: ["#1a0800", "#FF8C42"],
      price: 350,
    },
  ];
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
  const shieldPacks = [
    { qty: "1×", price: 150 },
    { qty: "3×", price: 400 },
    { qty: "5×", price: 600 },
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
    {
      id: "chests",
      label: "Chests",
      Icon: IconTrophy,
      desc: "Unlock random rewards",
      count: `${chests.length} types`,
      color: C.gold,
      preview: <ShopItemChests colors={[C.blue, C.pink, C.gold]} />,
    },
    {
      id: "other",
      label: "Other",
      Icon: IconShield,
      desc: "Streak shields & more",
      count: "Shields",
      color: C.orange,
      preview: <ShopItemOther price={shieldPacks[0].price} />,
    },
  ];

  const modals = {
    themes: (
      <ShopThemesModal
        themes={themes}
        currentTheme="mint"
        coins={coins}
        onPurchase={() => null}
        onClose={() => setModal(null)}
      />
    ),
    chests: (
      <ChestsModal
        coins={coins}
        chests={chests}
        onPurchase={() => null}
        onClose={() => setModal(null)}
      />
    ),
    other: (
      <ShopOtherModal
        coins={coins}
        packs={shieldPacks}
        onPurchase={() => null}
        onClose={() => setModal(null)}
      />
    ),
  };

  return (
    <div style={{ padding: "16px 22px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 14,
          animation: "fadeUp 0.4s ease both",
        }}
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
          <span
            style={{
              fontFamily: F.head,
              fontSize: 20,
              fontWeight: 900,
              color: C.gold,
            }}
          >
            {coins}
          </span>
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
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <Icon size={20} color={color} />
                  <span
                    style={{
                      fontFamily: F.head,
                      fontSize: 17,
                      fontWeight: 800,
                      color: C.text,
                    }}
                  >
                    {label}
                  </span>
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
