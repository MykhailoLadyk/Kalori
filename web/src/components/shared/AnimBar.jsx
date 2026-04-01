import { useEffect, useState } from "react";
import { C } from "../../lib/constans";
export function AnimBar({ pct, color, height = 4, delay = 0 }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay + 80);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        height,
        background: C.border,
        borderRadius: height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          background: color,
          borderRadius: height,
          width: show ? `${pct}%` : "0%",
          transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        }}
      />
    </div>
  );
}
