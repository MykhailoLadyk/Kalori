import { C, F, alpha, flameColorsDefinitions } from "../../lib/constants";
import { Mono } from "../shared/Primitives";
import { IconFire, IconShield } from "../shared/DuoIcon";
import { useGameStats } from "../../hooks/useGameStats";
import { useUser } from "../../hooks/useUser";

export function StreakBanner() {
  const { gameData, shopItems } = useGameStats();
  const { user } = useUser();
  const streak = gameData?.streak || 0;
  const shields = shopItems?.streak_shields || 0;

  const activeFlame =
    flameColorsDefinitions.find(
      (f) => f.id === (user?.settings?.flame_color || "orange"),
    ) || flameColorsDefinitions[0];
  const flameColor = activeFlame.color;

  const isActive = streak > 0;
  const hasShields = shields > 0;

  const bannerBg = isActive
    ? `linear-gradient(135deg, ${alpha(flameColor, 13)}, ${alpha(C.gold, 6)})`
    : C.card;
  const bannerBorder = isActive ? alpha(flameColor, 21) : C.border;
  const fireColor = isActive ? flameColor : C.mutedLight;
  const textColor = isActive ? flameColor : C.muted;

  return (
    <div
      style={{
        marginBottom: 14,
        animation: "fadeUp 0.4s ease 0.15s both",
      }}
    >
      <div
        style={{
          background: bannerBg,
          border: `1px solid ${bannerBorder}`,
          borderRadius: 14,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            animation: isActive ? "streakBounce 0.6s ease 0.9s both" : "none",
            flexShrink: 0,
            opacity: isActive ? 1 : 0.6,
          }}
        >
          <IconFire size={28} color={fireColor} />
        </div>
        <div
          style={{
            flex: 1,
            alignItems: "flex-start",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Mono size={8} color={textColor}>
            Current Streak
          </Mono>
          <div
            style={{
              fontFamily: F.head,
              fontSize: 20,
              fontWeight: 900,
              color: isActive ? C.text : C.muted,
              lineHeight: 1.2,
            }}
          >
            {streak} days
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <IconShield size={18} color={hasShields ? C.gold : C.mutedLight} />
            <span
              style={{
                fontFamily: F.head,
                fontSize: 18,
                fontWeight: 900,
                color: hasShields ? C.gold : C.mutedLight,
              }}
            >
              {shields}
            </span>
          </div>
          <Mono size={7} color={C.muted}>
            Shields
          </Mono>
        </div>
      </div>
    </div>
  );
}
