// - props: to, duration, delay
// - owns val + started state
// - used on calorie ring, stats cards, level card
import { useState, useEffect } from "react";
export default function CountUp({
  to,
  duration = 1200,
  delay = 0,
  style = {},
}) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 4)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, to, duration]);
  return <span style={style}>{val.toLocaleString()}</span>;
}
