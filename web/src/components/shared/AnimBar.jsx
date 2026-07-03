import { useEffect, useState } from "react";
import { C } from "../../lib/constants";
export function AnimBar({ pct, color, height = 4, delay = 0 }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay + 80);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height,
        background: C.border,
        borderRadius: height,
      }}
    >
      <div
        className="h-full"
        style={{
          background: color,
          borderRadius: height,
          width: show ? `${pct}%` : "0%",
          transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        }}
      />
    </div>
  );
}
