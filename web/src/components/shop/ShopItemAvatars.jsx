import { C, F } from "../../lib/constants";

export default function ShopItemAvatars({ avatars = [] }) {
  return (
    <div style={{ display: "flex", gap: 8, overflow: "hidden" }}>
      {avatars.slice(0, 5).map((av) => (
        <div
          key={av.id}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 10,
            background: av.bg || `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontFamily: F.head,
            fontWeight: 900,
            color: "#000",
            border: `1px solid ${C.border}`,
          }}
        >
          {av.type === "pixel" ? (
            <svg width={20} height={20} viewBox="0 0 256 256" fill="none">
              <g opacity="0.2" fill="#000">
                <path d={av.paths?.detail} />
              </g>
              <g fill="#000">
                <path d={av.paths?.main} />
              </g>
            </svg>
          ) : (
            "U"
          )}
        </div>
      ))}
    </div>
  );
}
