import { C, F } from "../../lib/constans";
export function Mono({ children, size = 9, color = C.soft, weight = 700 }) {
  return (
    <span
      style={{
        fontFamily: F.mono,
        fontSize: size,
        color,
        fontWeight: weight,
        letterSpacing: 1.5,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}
export function SectionLabel({ children, delay = 0 }) {
  return (
    <div
      style={{
        fontFamily: F.mono,
        fontSize: 9,
        color: C.mutedLight,
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 10,
        animation: `fadeUp 0.4s ease both`,
        animationDelay: `${delay}ms`,
        display: "flex",
      }}
    >
      {children}
    </div>
  );
}
export function Tag({ children, color = C.accent }) {
  return (
    <span
      style={{
        fontFamily: F.mono,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 1.2,
        color,
        background: color + "18",
        border: `1px solid ${color}35`,
        padding: "2px 7px",
        borderRadius: 6,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}
export function Stagger({ children, baseDelay = 0, step = 60 }) {
  const arr = Array.isArray(children) ? children : [children];
  return (
    <>
      {arr.filter(Boolean).map((c, i) => (
        <div
          key={i}
          style={{
            animation: `fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both`,
            animationDelay: `${baseDelay + i * step}ms`,
          }}
        >
          {c}
        </div>
      ))}
    </>
  );
}
