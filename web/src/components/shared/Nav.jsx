import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { IconHome, IconPlus, IconChartLine, IconGamepad, IconShoppingBag, IconGear } from "../shared/DuoIcon";
import { MealAddOptionSelectModal } from "../modals/home/MealAddOptionSelectModal";
import { Modal } from "../modals/Modal";
import { C, F } from "../../lib/constants";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [popped, setPopped] = useState(null);
  const [modal, setModal] = useState(null);

  // 1. Derive the active tab dynamically from the browser's current URL pathname
  const currentPath = location.pathname;
  const isHome = currentPath === "/";
  const activeTab = isHome ? "home" : currentPath.substring(1);

  const tabs = [
    { id: "stats", label: "Stats", Icon: IconChartLine },
    { id: "game", label: "Level", Icon: IconGamepad },
    { id: "shop", label: "Shop", Icon: IconShoppingBag },
    { id: "settings", label: "Settings", Icon: IconGear },
  ];

  const handleHomeClick = () => {
    setPopped("home");
    setTimeout(() => setPopped(null), 400);

    if (isHome) {
      setModal(true); // Open options modal if already on the Home screen
    } else {
      navigate("/"); // Navigate to home route if on another page
    }
  };

  return (
    <>
      <Outlet />
      <div
        className="flex items-center bg-panel border-t"
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          zIndex: 50,
          padding: "10px 0 calc(10px + env(safe-area-inset-bottom))",
          flexShrink: 0,
        }}
      >
        {/* Home / Add Button */}
        <div
          onClick={handleHomeClick}
          className="flex-1 flex flex-col items-center press"
          style={{ gap: 3, padding: "2px 0" }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: isHome ? 14 : 0,
              background: isHome ? C.accent : "transparent",
              color: isHome ? "#000" : C.muted,
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              animation: popped === "home" ? "navPop 0.35s ease" : "none",
              marginTop: isHome ? -6 : 0,
              boxShadow: isHome ? `0 0 20px ${C.accentGlow}` : "none",
            }}
          >
            {isHome ? <IconPlus size={22} color="#000" /> : <IconHome size={22} color={C.muted} />}
          </div>
          <span
            className="font-mono font-bold"
            style={{ fontSize: 7, letterSpacing: 1, color: isHome ? C.accent : C.muted, transition: "color 0.2s" }}
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

        {/* Dynamic Mapping for Secondary Tabs */}
        {tabs.map(({ id, label, Icon }) => {
          const on = activeTab === id;
          return (
            <div
              key={id}
              data-tour={`nav-${id}`}
              onClick={() => {
                setPopped(id);
                setTimeout(() => setPopped(null), 400);
                // 2. Replace state trigger with URL navigation
                navigate(`/${id}`);
              }}
              className="flex-1 flex flex-col items-center press"
              style={{ gap: 3, padding: "2px 0" }}
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
                className="font-mono font-bold"
                style={{ fontSize: 7, letterSpacing: 1, color: on ? C.accent : C.muted, transition: "color 0.2s" }}
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
      {/* Selection Modal Context Integration */}
      <Modal id={modal} close={() => setModal(null)}>
        {/* 3. Intercept the legacy state call and route to the specific sub-wizard path */}
        <MealAddOptionSelectModal
          setCurrentPage={(targetPage) => {
            setModal(null); // Dismiss modal frame layout
            if (targetPage === "home") {
              navigate("/");
            } else {
              navigate(`/add-meal/${targetPage}`); // Routes to /add-meal/photo, etc.
            }
          }}
        />
      </Modal>
    </>
  );
}
