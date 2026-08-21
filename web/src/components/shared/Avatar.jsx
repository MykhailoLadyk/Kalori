import { C, F, avatarsDefinitions } from "../../lib/constants";

export default function Avatar({
  user,
  avatarId,
  size = 52,
  fontSize = 24,
  borderRadius = 16,
  style = {},
}) {
  const selectedId = avatarId || user?.settings?.avatar || "initial";
  const avatarDef =
    avatarsDefinitions.find((a) => a.id === selectedId) ||
    avatarsDefinitions[0];
  const userName = user?.name || "User";
  const initial = userName[0]?.toUpperCase() ?? "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        background:
          avatarDef.bg || `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: F.head,
        fontSize,
        fontWeight: 900,
        color: "#000",
        flexShrink: 0,
        boxShadow: `0 0 20px ${C.accentGlow}`,
        userSelect: "none",
        ...style,
      }}
    >
      {avatarDef.type === "emoji" ? avatarDef.emoji : initial}
    </div>
  );
}
