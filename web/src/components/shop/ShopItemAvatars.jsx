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
            fontSize: av.type === "emoji" ? 18 : 14,
            fontFamily: F.head,
            fontWeight: 900,
            color: "#000",
            border: `1px solid ${C.border}`,
          }}
        >
          {av.type === "emoji" ? av.emoji : "U"}
        </div>
      ))}
    </div>
  );
}
