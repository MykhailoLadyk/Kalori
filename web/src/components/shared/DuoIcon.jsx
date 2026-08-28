// ══════════════════════════════════════════════════
// 8-BIT PIXEL ART ICON LIBRARY
// All icons use only H/V/M/Z path commands (no curves)
// Grid: 256×256 viewBox, 16-unit pixel grid
// ══════════════════════════════════════════════════

const CIRCLE = "M 80,32 H 176 V 48 H 192 V 64 H 208 V 80 H 224 V 176 H 208 V 192 H 192 V 208 H 176 V 224 H 80 V 208 H 64 V 192 H 48 V 176 H 32 V 80 H 48 V 64 H 64 V 48 H 80 Z";

export default function DuoIcon({
  size = 24,
  color = "currentColor",
  children,
}) {
  const [secondary, primary] = Array.isArray(children)
    ? children
    : [null, children];
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      {secondary && (
        <g opacity="0.2" fill={color}>
          {secondary}
        </g>
      )}
      <g fill={color}>{primary}</g>
    </svg>
  );
}

// ══════════════════════════════════════════════════
// NAVIGATION ICONS
// ══════════════════════════════════════════════════

// Nav: Home (pixel house with stepped roof)
export const IconHome = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 112,48 H 144 V 64 H 160 V 80 H 176 V 96 H 192 V 224 H 64 V 96 H 80 V 80 H 96 V 64 H 112 Z" />
    <path d="M 112,176 H 144 V 224 H 112 Z M 80,128 H 96 V 144 H 80 Z M 160,128 H 176 V 144 H 160 Z" />
  </DuoIcon>
);

// Nav: Plus (pixel cross)
export const IconPlus = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
    <path d="M 96,48 H 160 V 96 H 208 V 160 H 160 V 208 H 96 V 160 H 48 V 96 H 96 Z" />
  </svg>
);

// Nav: Stats (pixel bar chart)
export const IconChartLine = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 48,144 H 96 V 208 H 48 Z M 112,80 H 160 V 208 H 112 Z M 176,128 H 224 V 208 H 176 Z" />
    <path d="M 32,208 H 240 V 224 H 32 Z" />
  </DuoIcon>
);

// Nav: Game (pixel controller with d-pad + buttons)
export const IconGamepad = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 48,80 H 208 V 96 H 224 V 160 H 208 V 176 H 48 V 160 H 32 V 96 H 48 Z" />
    <path d="M 64,112 H 80 V 96 H 96 V 112 H 112 V 128 H 96 V 144 H 80 V 128 H 64 Z M 176,96 H 192 V 112 H 176 Z M 160,128 H 176 V 144 H 160 Z" />
  </DuoIcon>
);

// Nav: Shop (pixel bag with handle)
export const IconShoppingBag = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 48,96 H 208 V 224 H 48 Z" />
    <path d="M 80,32 H 176 V 96 H 160 V 48 H 96 V 96 H 80 Z M 48,128 H 208 V 144 H 48 Z" />
  </DuoIcon>
);

// Nav: Settings (pixel gear — cross shape with 4 teeth)
export const IconGear = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 112,48 H 144 V 80 H 176 V 112 H 208 V 144 H 176 V 176 H 144 V 208 H 112 V 176 H 80 V 144 H 48 V 112 H 80 V 80 H 112 Z" />
    <path d="M 112,112 H 144 V 144 H 112 Z" />
  </DuoIcon>
);

// ══════════════════════════════════════════════════
// MEAL / FOOD ICONS
// ══════════════════════════════════════════════════

// Calendar (pixel calendar with tabs)
export const IconCalendar = ({ size = 18, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 48,64 H 208 V 224 H 48 Z" />
    <path d="M 80,32 H 96 V 80 H 80 Z M 160,32 H 176 V 80 H 160 Z M 48,96 H 208 V 112 H 48 Z M 80,128 H 96 V 144 H 80 Z M 128,128 H 144 V 144 H 128 Z M 176,128 H 192 V 144 H 176 Z M 80,160 H 96 V 176 H 80 Z M 128,160 H 144 V 176 H 128 Z" />
  </DuoIcon>
);

// Meal Plate (pixel circle with inner square)
export const IconMealPlate = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d={CIRCLE} />
    <path d="M 96,96 H 160 V 160 H 96 Z" />
  </DuoIcon>
);

// Water drop (pixel teardrop — narrow top, wide bottom)
export const IconDrop = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 112,16 H 144 V 48 H 160 V 64 H 176 V 80 H 192 V 96 H 208 V 144 H 192 V 176 H 176 V 208 H 160 V 224 H 96 V 208 H 80 V 176 H 64 V 144 H 48 V 96 H 64 V 80 H 80 V 64 H 96 V 48 H 112 Z" />
    <path d="M 80,128 H 96 V 144 H 80 Z M 80,160 H 96 V 176 H 80 Z" />
  </DuoIcon>
);

// Dumbbell / Protein (pixel H-shape barbell)
export const IconDumbbell = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 32,80 H 80 V 112 H 176 V 80 H 224 V 176 H 176 V 144 H 80 V 176 H 32 Z" />
    <path d="M 48,96 H 64 V 160 H 48 Z M 192,96 H 208 V 160 H 192 Z" />
  </DuoIcon>
);

// ══════════════════════════════════════════════════
// GAME / ACHIEVEMENT ICONS
// ══════════════════════════════════════════════════

// Fire / Streak (pixel flame — narrow tip, wide base)
export const IconFire = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 112,32 H 144 V 64 H 160 V 96 H 176 V 128 H 192 V 176 H 208 V 224 H 48 V 176 H 64 V 128 H 80 V 96 H 96 V 64 H 112 Z" />
    <path d="M 112,160 H 144 V 192 H 160 V 224 H 96 V 192 H 112 Z" />
  </DuoIcon>
);

// Shield (pixel shield — wide top, pointed bottom)
export const IconShield = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 32,32 H 224 V 80 H 208 V 112 H 192 V 144 H 176 V 160 H 160 V 176 H 144 V 208 H 112 V 176 H 96 V 160 H 80 V 144 H 64 V 112 H 48 V 80 H 32 Z" />
    <path d="M 112,80 H 144 V 112 H 176 V 144 H 144 V 112 H 112 V 144 H 80 V 112 H 112 Z" />
  </DuoIcon>
);

// Trophy (pixel cup + stem + base)
export const IconTrophy = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 48,32 H 208 V 96 H 192 V 112 H 176 V 128 H 160 V 144 H 144 V 176 H 176 V 208 H 80 V 176 H 112 V 144 H 96 V 128 H 80 V 112 H 64 V 96 H 48 Z" />
    <path d="M 112,64 H 144 V 96 H 112 Z" />
  </DuoIcon>
);

// Star / XP (pixel 8-pointed sparkle — cross + corner squares)
export const IconStar = ({ size = 16, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 96,48 H 160 V 96 H 208 V 160 H 160 V 208 H 96 V 160 H 48 V 96 H 96 Z M 176,48 H 208 V 80 H 176 Z M 48,48 H 80 V 80 H 48 Z M 176,176 H 208 V 208 H 176 Z M 48,176 H 80 V 208 H 48 Z" />
    <path d="M 112,112 H 144 V 144 H 112 Z" />
  </DuoIcon>
);

// Star Outline (pixel sparkle outline)
export const IconStarOutline = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <path
      d="M 112,48 H 144 V 112 H 208 V 144 H 144 V 208 H 112 V 144 H 48 V 112 H 112 Z"
      stroke={color}
      strokeWidth="12"
      fill="none"
    />
    <rect x="176" y="48" width="32" height="32" stroke={color} strokeWidth="10" fill="none" />
    <rect x="48" y="48" width="32" height="32" stroke={color} strokeWidth="10" fill="none" />
    <rect x="176" y="176" width="32" height="32" stroke={color} strokeWidth="10" fill="none" />
    <rect x="48" y="176" width="32" height="32" stroke={color} strokeWidth="10" fill="none" />
  </svg>
);

// ══════════════════════════════════════════════════
// CURRENCY / SHOP ICONS
// ══════════════════════════════════════════════════

// Coin (pixel circle with $ lines)
export const IconCoin = ({ size = 18, color = "#FCD34D" }) => (
  <DuoIcon size={size} color={color}>
    <path d={CIRCLE} />
    <path d="M 96,96 H 160 V 112 H 96 Z M 96,144 H 160 V 160 H 96 Z M 120,80 H 136 V 176 H 120 Z" />
  </DuoIcon>
);

// Lightning / XP bolt (pixel zigzag)
export const IconLightning = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 128,16 H 192 V 112 H 128 Z M 96,80 H 160 V 176 H 96 Z M 64,144 H 128 V 240 H 64 Z" />
    <path d="M 112,112 H 144 V 144 H 112 Z" />
  </DuoIcon>
);

// ══════════════════════════════════════════════════
// SETTINGS / UI ICONS
// ══════════════════════════════════════════════════

// Person / User (pixel character — head + body)
export const IconUser = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <g opacity="0.2" fill={color}>
      <path d="M 96,32 H 160 V 80 H 176 V 208 H 80 V 80 H 96 Z" />
    </g>
    <g fill={color}>
      <path d="M 104,48 H 120 V 64 H 104 Z M 136,48 H 152 V 64 H 136 Z M 80,128 H 176 V 144 H 80 Z" />
    </g>
  </svg>
);

// Target / Goal (pixel crosshair + center)
export const IconTarget = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <g opacity="0.2" fill={color}>
      <path d="M 112,32 H 144 V 104 H 112 Z M 112,152 H 144 V 224 H 112 Z M 32,112 H 104 V 144 H 32 Z M 152,112 H 224 V 144 H 152 Z" />
    </g>
    <g fill={color}>
      <path d="M 104,104 H 152 V 152 H 104 Z" />
    </g>
  </svg>
);

// Weight / Scale (pixel balance)
export const IconWeight = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <g opacity="0.2" fill={color}>
      <path d="M 32,80 H 80 V 128 H 32 Z M 176,80 H 224 V 128 H 176 Z M 80,208 H 176 V 224 H 80 Z" />
    </g>
    <g fill={color}>
      <path d="M 32,48 H 224 V 64 H 32 Z M 120,64 H 136 V 224 H 120 Z M 32,80 H 80 V 96 H 32 Z M 176,80 H 224 V 96 H 176 Z" />
    </g>
  </svg>
);

// Bell (pixel bell shape)
export const IconBell = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 80,48 H 176 V 64 H 192 V 128 H 208 V 160 H 224 V 176 H 32 V 160 H 48 V 128 H 64 V 64 H 80 Z" />
    <path d="M 112,192 H 144 V 208 H 112 Z" />
  </DuoIcon>
);

// Lock / Privacy (pixel padlock)
export const IconLock = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 48,128 H 208 V 224 H 48 Z" />
    <path d="M 80,48 H 176 V 128 H 160 V 64 H 96 V 128 H 80 Z M 112,160 H 144 V 192 H 112 Z" />
  </DuoIcon>
);

// Export / Upload (pixel arrow up + base)
export const IconExport = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 112,32 H 144 V 48 H 160 V 64 H 176 V 80 H 192 V 96 H 160 V 176 H 96 V 96 H 64 V 80 H 80 V 64 H 96 V 48 H 112 Z" />
    <path d="M 32,208 H 224 V 224 H 32 Z" />
  </DuoIcon>
);

// Globe / Language (pixel circle with cross lines)
export const IconGlobe = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <g opacity="0.2" fill={color}>
      <path d={CIRCLE} />
    </g>
    <g fill={color}>
      <path d="M 32,112 H 224 V 144 H 32 Z M 112,32 H 144 V 224 H 112 Z" />
    </g>
  </svg>
);

// Clock / Time (pixel circle with L-shaped hands)
export const IconClock = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d={CIRCLE} />
    <path d="M 120,64 H 136 V 120 H 176 V 136 H 120 Z" />
  </DuoIcon>
);

// Ruler / Measurements (pixel ruler with notches)
export const IconRuler = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 32,96 H 224 V 176 H 32 Z" />
    <path d="M 64,96 H 80 V 128 H 64 Z M 128,96 H 144 V 128 H 128 Z M 192,96 H 208 V 128 H 192 Z M 96,96 H 112 V 112 H 96 Z M 160,96 H 176 V 112 H 160 Z" />
  </DuoIcon>
);

// Palette / Themes (pixel color swatches — 3 bars)
export const IconPalette = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 32,48 H 80 V 208 H 32 Z M 96,48 H 160 V 208 H 96 Z M 176,48 H 224 V 208 H 176 Z" />
    <path d="M 48,64 H 64 V 80 H 48 Z M 112,112 H 144 V 128 H 112 Z M 192,80 H 208 V 96 H 192 Z" />
  </DuoIcon>
);

// Sign Out (pixel door + arrow)
export const IconSignOut = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 32,32 H 128 V 224 H 32 Z" />
    <path d="M 144,112 H 176 V 80 H 192 V 96 H 208 V 112 H 224 V 144 H 208 V 160 H 192 V 176 H 176 V 144 H 144 Z" />
  </DuoIcon>
);

// Trash / Delete (pixel trash can)
export const IconTrash = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 64,80 H 192 V 224 H 64 Z" />
    <path d="M 48,48 H 208 V 80 H 48 Z M 112,32 H 144 V 48 H 112 Z M 96,112 H 112 V 192 H 96 Z M 144,112 H 160 V 192 H 144 Z" />
  </DuoIcon>
);

// Pencil / Edit (pixel pencil — body with stepped tip)
export const IconPencil = ({ size = 14, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 96,48 H 160 V 176 H 144 V 192 H 136 V 208 H 120 V 192 H 112 V 176 H 96 Z" />
    <path d="M 96,32 H 160 V 48 H 96 Z M 120,208 H 136 V 224 H 120 Z" />
  </DuoIcon>
);

// ══════════════════════════════════════════════════
// STATUS / FEEDBACK ICONS
// ══════════════════════════════════════════════════

// Check / Success (pixel circle + check)
export const IconCheck = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d={CIRCLE} />
    <path d="M 128,64 H 176 V 160 H 128 Z M 64,112 H 128 V 160 H 64 Z" />
  </DuoIcon>
);

// X / Close (pixel circle + X dots)
export const IconX = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d={CIRCLE} />
    <path d="M 80,80 H 96 V 96 H 80 Z M 160,80 H 176 V 96 H 160 Z M 96,96 H 112 V 112 H 96 Z M 144,96 H 160 V 112 H 144 Z M 112,112 H 144 V 144 H 112 Z M 96,144 H 112 V 160 H 96 Z M 144,144 H 160 V 160 H 144 Z M 80,160 H 96 V 176 H 80 Z M 160,160 H 176 V 176 H 160 Z" />
  </DuoIcon>
);

// Arrow Up / Level Up (pixel arrow pointing up)
export const IconArrowUp = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 112,32 H 144 V 48 H 160 V 64 H 176 V 80 H 192 V 96 H 160 V 224 H 96 V 96 H 64 V 80 H 80 V 64 H 96 V 48 H 112 Z" />
    <path d="M 112,112 H 144 V 160 H 112 Z" />
  </DuoIcon>
);

// Party / Confetti (pixel flag + confetti squares)
export const IconParty = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 80,32 H 192 V 128 H 80 Z M 64,32 H 80 V 224 H 64 Z" />
    <path d="M 176,160 H 192 V 176 H 176 Z M 128,176 H 144 V 192 H 128 Z M 192,192 H 208 V 208 H 192 Z M 160,208 H 176 V 224 H 160 Z" />
  </DuoIcon>
);

// Sparkles / Pro AI (pixel multi-sparkle)
export const IconSparkles = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 112,16 H 128 V 64 H 176 V 80 H 128 V 128 H 112 V 80 H 64 V 64 H 112 Z" />
    <path d="M 176,128 H 192 V 152 H 216 V 168 H 192 V 192 H 176 V 168 H 152 V 152 H 176 Z M 64,160 H 80 V 176 H 96 V 192 H 80 V 208 H 64 V 192 H 48 V 176 H 64 Z" />
  </DuoIcon>
);

// Crown / Premium (pixel crown with 3 points)
export const IconCrown = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M 48,64 H 80 V 96 H 112 V 32 H 144 V 96 H 176 V 64 H 208 V 192 H 48 Z" />
    <path d="M 48,176 H 208 V 192 H 48 Z M 120,48 H 136 V 64 H 120 Z" />
  </DuoIcon>
);

// Info / Alert (pixel circle with i)
export const IconInfo = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d={CIRCLE} />
    <path d="M 112,64 H 144 V 80 H 112 Z M 112,112 H 144 V 192 H 112 Z" />
  </DuoIcon>
);

// ══════════════════════════════════════════════════
// QUEST ICONS (32×32 viewBox, 4-unit pixel grid)
// ══════════════════════════════════════════════════

// Quest: Meal (pixel plate)
export const QuestMealIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <g opacity="0.2" fill={color}>
      <path d="M 8,4 H 24 V 8 H 28 V 24 H 24 V 28 H 8 V 24 H 4 V 8 H 8 Z" />
    </g>
    <g fill={color}>
      <path d="M 12,12 H 20 V 20 H 12 Z" />
      <path d="M 8,4 H 24 V 8 H 28 V 12 H 24 V 8 H 8 V 12 H 4 V 8 H 8 Z" />
      <path d="M 28,20 H 24 V 24 H 20 V 28 H 12 V 24 H 8 V 20 H 4 V 24 H 8 V 28 H 24 V 24 H 28 Z" />
    </g>
  </svg>
);

// Quest: Water (pixel droplet)
export const QuestWaterIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <g opacity="0.2" fill={color}>
      <path d="M 14,2 H 18 V 6 H 22 V 10 H 26 V 18 H 22 V 22 H 18 V 26 H 14 V 22 H 10 V 18 H 6 V 10 H 10 V 6 H 14 Z" />
    </g>
    <g fill={color}>
      <path d="M 10,14 H 14 V 18 H 10 Z" />
    </g>
  </svg>
);

// Quest: Protein (pixel dumbbell)
export const QuestProteinIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <g opacity="0.2" fill={color}>
      <path d="M 4,10 H 10 V 14 H 22 V 10 H 28 V 22 H 22 V 18 H 10 V 22 H 4 Z" />
    </g>
    <g fill={color}>
      <path d="M 4,10 H 10 V 14 H 4 Z M 4,18 H 10 V 22 H 4 Z M 22,10 H 28 V 14 H 22 Z M 22,18 H 28 V 22 H 22 Z" />
    </g>
  </svg>
);

// Quest: Fire (pixel flame)
export const QuestFireIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <g opacity="0.2" fill={color}>
      <path d="M 14,2 H 18 V 6 H 22 V 10 H 26 V 18 H 28 V 28 H 4 V 18 H 6 V 10 H 10 V 6 H 14 Z" />
    </g>
    <g fill={color}>
      <path d="M 14,18 H 18 V 22 H 20 V 28 H 12 V 22 H 14 Z" />
    </g>
  </svg>
);
