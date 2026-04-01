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
