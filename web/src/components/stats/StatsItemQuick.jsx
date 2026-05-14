import { Mono } from "../shared/Primitives";
import CountUp from "../shared/CountUp";
import { C, F } from "../../lib/constans";

export default function StatsItemQuick(props) {
  const { label, val, suffix, sub, color, i } = props;
  return (
    <>
      <div
        key={label}
        className="hover-card"
        style={{
          background: C.card,
          borderRadius: 14,
          padding: "13px 14px",
          border: `1px solid ${C.border}`,
          animation: `fadeUp 0.4s ease ${0.1 + i * 0.07}s both`,
        }}
      >
        <Mono size={8} color={C.mutedLight}>
          {label}
        </Mono>
        <div
          style={{
            fontFamily: F.head,
            fontSize: 22,
            fontWeight: 900,
            color,
            marginTop: 3,
          }}
        >
          {suffix}
          <CountUp to={val} duration={900} delay={200 + i * 100} />
        </div>
        <Mono size={7} color={C.muted}>
          {sub}
        </Mono>
      </div>
    </>
  );
}
