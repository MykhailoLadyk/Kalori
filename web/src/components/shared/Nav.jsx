import {
  IconHome,
  IconPlus,
  IconChartLine,
  IconGamepad,
  IconShoppingBag,
  IconGear,
} from "../shared/DuoIcon";
import { C, F } from "../../lib/constans";
import { useState } from "react";
export default function Nav({ active, setPage, onAddMeal }) {
  const [popped, setPopped] = useState(null);

  const tabs = [
    { id: "stats", label: "Stats", Icon: IconChartLine },
    { id: "game", label: "Game", Icon: IconGamepad },
    { id: "shop", label: "Shop", Icon: IconShoppingBag },
    { id: "settings", label: "Set", Icon: IconGear },
  ];

  const handleHomeClick = () => {
    setPopped("home");
    setTimeout(() => setPopped(null), 400);
    if (active === "home") onAddMeal();
    else setPage("home");
  };

  const isHome = active === "home";

  return (
    <div
      style={{
        background: C.panel,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        padding: "10px 0 0",
        flexShrink: 0,
      }}
    >
      <div
        onClick={handleHomeClick}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          cursor: "pointer",
          padding: "2px 0",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: isHome ? 14 : 0,
            background: isHome ? C.accent : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isHome ? "#000" : C.muted,
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            animation: popped === "home" ? "navPop 0.35s ease" : "none",
            marginTop: isHome ? -6 : 0,
            boxShadow: isHome ? `0 0 20px ${C.accentGlow}` : "none",
          }}
        >
          {isHome ? (
            <IconPlus size={22} color="#000" />
          ) : (
            <IconHome size={22} color={C.muted} />
          )}
        </div>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: 1,
            color: isHome ? C.accent : C.muted,
            transition: "color 0.2s",
          }}
        >
          {isHome ? "ADD" : "HOME"}
        </span>
        <div
          style={{
            height: 2,
            borderRadius: 2,
            background: C.accent,
            width: isHome ? 16 : 0,
            transition: "width 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            marginTop: 1,
          }}
        />
      </div>

      {tabs.map(({ id, label, Icon }) => {
        const on = active === id;
        return (
          <div
            key={id}
            onClick={() => {
              setPopped(id);
              setTimeout(() => setPopped(null), 400);
              setPage(id);
            }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              cursor: "pointer",
              padding: "2px 0",
            }}
          >
            <div
              style={{
                color: on ? C.accent : C.muted,
                transition: "color 0.2s",
                animation: popped === id ? "navPop 0.35s ease" : "none",
              }}
            >
              <Icon size={22} color={on ? C.accent : C.muted} />
            </div>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 7,
                fontWeight: 700,
                letterSpacing: 1,
                color: on ? C.accent : C.muted,
                transition: "color 0.2s",
              }}
            >
              {label.toUpperCase()}
            </span>
            <div
              style={{
                height: 2,
                borderRadius: 2,
                background: C.accent,
                width: on ? 16 : 0,
                transition: "width 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                marginTop: 1,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
