import { useEffect, useState } from "react";
import { C } from "../../lib/constans";
export function Modal({ id, close, children }) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (id) {
      setClosing(false);
      requestAnimationFrame(() => setVisible(true));
    } else setVisible(false);
  }, [id]);
  useEffect(() => {
    if (id) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [id]);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      close();
    }, 280);
  };
  if (!id && !visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: closing ? "transparent" : "#00000070",
        backdropFilter: visible && !closing ? "blur(4px)" : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        transition: "background 0.28s, backdrop-filter 0.28s",
      }}
    >
      <div
        className="sy"
        style={{
          background: C.panel,
          borderRadius: "24px 24px 0 0",
          border: `1px solid ${C.border}`,
          borderBottom: "none",
          maxHeight: "85%",
          padding: "20px 20px 40px",
          transform: closing
            ? "translateY(100%)"
            : visible
              ? "translateY(0)"
              : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: C.border,
            borderRadius: 4,
            margin: "0 auto 16px",
          }}
        />
        <div
          onClick={handleClose}
          className="press"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 28,
            height: 28,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.soft,
            fontSize: 12,
          }}
        >
          ✕
        </div>
        {children}
      </div>
    </div>
  );
}
