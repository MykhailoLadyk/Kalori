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
// ICONS
// ══════════════════════════════════════════════════

// Nav: Home
export const IconHome = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120V216a8,8,0,0,0,8,8H96a8,8,0,0,0,8-8V168h48v48a8,8,0,0,0,8,8h56a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68Z" />
    <path d="M224,120v96H160V168a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v48H40V120l88-88Z" />
  </DuoIcon>
);

// Nav: Plus (for "Add" state)
export const IconPlus = ({ size = 22, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Nav: Chart/Stats
export const IconChartLine = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M232,208H40V48a8,8,0,0,0-16,0V208a8,8,0,0,0,8,8H232a8,8,0,0,0,0-16Z" />
    <path d="M48,168a8,8,0,0,0,5.66-2.34l50.34-50.34,34.34,34.34a8,8,0,0,0,11.32,0l80-80a8,8,0,0,0-11.32-11.32L144,132.68l-34.34-34.34a8,8,0,0,0-11.32,0L48,158.34A8,8,0,0,0,48,168Z" />
  </DuoIcon>
);

// Nav: Game/Controller
export const IconGamepad = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M205.1,55.1a111.6,111.6,0,0,0-77.1-31.1A112,112,0,1,0,240,128,111.7,111.7,0,0,0,205.1,55.1ZM164,140a12,12,0,1,1,12-12A12,12,0,0,1,164,140Zm24,24a12,12,0,1,1,12-12A12,12,0,0,1,188,164Z" />
    <path d="M188,92H136a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h52a8,8,0,0,0,8-8V100A8,8,0,0,0,188,92ZM80,108H68V96a8,8,0,0,0-16,0v12H40a8,8,0,0,0,0,16H52v12a8,8,0,0,0,16,0V124H80a8,8,0,0,0,0-16Z" />
  </DuoIcon>
);

// Nav: Shop/Bag
export const IconShoppingBag = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M222.14,58.87A8,8,0,0,0,216,56H40a8,8,0,0,0-7.93,9.17l16,104A8,8,0,0,0,56,176H200a8,8,0,0,0,7.93-6.83l16-104A8,8,0,0,0,222.14,58.87Z" />
    <path d="M96,24a8,8,0,0,0-8,8V76a40,40,0,0,0,80,0V32a8,8,0,0,0-16,0V76a24,24,0,0,1-48,0V32A8,8,0,0,0,96,24Z" />
  </DuoIcon>
);

// Nav: Settings/Gear
export const IconGear = ({ size = 22, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
    <path d="M221.1,116l-11.5-6.6a80.6,80.6,0,0,0,0-22.8l11.5-6.6a8.1,8.1,0,0,0,3.6-9.4A104.2,104.2,0,0,0,204,47.5a8,8,0,0,0-9.9-.4l-11.6,6.7a82.3,82.3,0,0,0-19.7-11.4V29.2a8,8,0,0,0-6.3-7.8A104.9,104.9,0,0,0,128,20a104.9,104.9,0,0,0-28.5,1.4,8,8,0,0,0-6.3,7.8V42.4a82.3,82.3,0,0,0-19.7,11.4L62.1,47.1A8,8,0,0,0,52.2,47.5a103,103,0,0,0-20.8,23.2,8,8,0,0,0,.4,9.9l11.5,6.6a80.6,80.6,0,0,0,0,22.8L31.8,116.2a8,8,0,0,0-3.6,9.4A103,103,0,0,0,48.9,149a8,8,0,0,0,9.9.4l11.6-6.7a82.3,82.3,0,0,0,19.7,11.4v13.2a8,8,0,0,0,6.3,7.8,106.9,106.9,0,0,0,57,0,8,8,0,0,0,6.3-7.8V154.1a82.3,82.3,0,0,0,19.7-11.4l11.6,6.7a8,8,0,0,0,9.9-.4,103,103,0,0,0,20.8-23.2A8.1,8.1,0,0,0,221.1,116Z" />
  </DuoIcon>
);

export const IconCalendar = ({ size = 18, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <rect x="40" y="64" width="176" height="160" rx="8" />
    <path
      d="M88,24V56M168,24V56M40,96H216M88,128h16v16H88Zm48,0h16v16H136Zm48,0h16v16H184Zm-144,48h16v16H40Zm48,0h16v16H88Zm48,0h16v16H136Z"
      stroke={color}
      strokeWidth="16"
      strokeLinecap="round"
    />
  </DuoIcon>
);

// Meal plate/fork
export const IconMealPlate = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M128,40A88,88,0,1,0,216,128,88.1,88.1,0,0,0,128,40Zm0,160a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,200Z" />
    <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
  </DuoIcon>
);

// Water drop
export const IconDrop = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M174,72l-46-52-46,52a80,80,0,1,0,92,0Z" />
    <path d="M128,216a56,56,0,0,1-56-56c0-22,14-43,28-61l28-32,28,32c14,18,28,39,28,61A56,56,0,0,1,128,216Z" />
  </DuoIcon>
);

// Dumbbell/protein
export const IconDumbbell = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <rect x="72" y="104" width="112" height="48" rx="8" />
    <rect x="32" y="88" width="40" height="80" rx="16" />
    <rect x="184" y="88" width="40" height="80" rx="16" />
  </DuoIcon>
);

// Fire/streak
export const IconFire = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M143.38,17.21a8,8,0,0,0-12.63,3.75C124.39,40.08,109,59.86,88,79.37l-4,4C67.83,99,48,119.14,48,152a80,80,0,0,0,160,0C208,101.11,166.29,30.39,143.38,17.21Z" />
    <path d="M136,192a32,32,0,0,1-32-32c0-16,8-27.55,17.42-40.37l.2-.28c4.56-6.22,9.27-12.67,13.38-20.35,6.67,12.27,14,19.8,20.56,26.53C163.45,134.08,168,139.43,168,160A32,32,0,0,1,136,192Z" />
  </DuoIcon>
);

// Shield
export const IconShield = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M216,48L128,16,40,48V120c0,60.19,71.75,96.3,80.54,100.54a15.84,15.84,0,0,0,14.92,0C144.25,216.3,216,180.19,216,120Z" />
    <path d="M160,106.34,117.66,148.69l-21.66-21.66a8,8,0,0,0-11.31,11.31l28,28a8,8,0,0,0,11.32,0l48-48A8,8,0,0,0,160,106.34Z" />
  </DuoIcon>
);

// Trophy
export const IconTrophy = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,172.31V192H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V172.31A80.13,80.13,0,0,0,204.35,136H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64Z" />
    <path d="M208,112h-4V80h4a8,8,0,0,1,8,8V96A24,24,0,0,1,208,112ZM44,112a24,24,0,0,1-8-18V88a8,8,0,0,1,8-8h4v32Z" />
  </DuoIcon>
);

// Star/XP
export const IconStar = ({ size = 16, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-6.87,17.6,15.92,15.92,0,0,1-18.71.75L128,198.36,78.6,230.1a15.92,15.92,0,0,1-18.71-.75,16.4,16.4,0,0,1-6.87-17.6l13.71-58.07-45-38.83A15.92,15.92,0,0,1,27.35,96.5L86.64,91.4l23-55.47a15.92,15.92,0,0,1,29.22,0l23,55.47,59.29,5.1a15.92,15.92,0,0,1,13.12,18.35Z" />
    <path d="M128,167.85,78.6,199.6a4,4,0,0,1-5.92-4.31L86.12,136l-45-38.83A4,4,0,0,1,43.35,91L102.64,86l23-55.47a4,4,0,0,1,7.35,0L156,86l59.29,5.1a4,4,0,0,1,2.35,6.9l-45,38.83,13.71,58.07a4,4,0,0,1-5.92,4.31Z" />
  </DuoIcon>
);

// Coin
export const IconCoin = ({ size = 18, color = "#FCD34D" }) => (
  <DuoIcon size={size} color={color}>
    <circle cx="128" cy="128" r="96" />
    <path d="M128,48a80,80,0,1,0,80,80A80,80,0,0,0,128,48Zm40,104H120a8,8,0,0,1,0-16h40a8,8,0,0,0,0-16H128a24,24,0,0,1,0-48h8V64a8,8,0,0,1,16,0v8h16a8,8,0,0,1,0,16H128a8,8,0,0,0,0,16h40a24,24,0,0,1,0,48Z" />
  </DuoIcon>
);

// Person/User — detailed: head + rounded shoulder/body shape + subtle collar notch
export const IconUser = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    {/* Body / torso — secondary layer */}
    <path
      d="M 24 220 C 24 164 68 136 128 136 C 188 136 232 164 232 220 Z"
      fill={color}
      opacity="0.2"
    />
    {/* Collar notch cut */}
    <path d="M 108 136 L 128 164 L 148 136" fill={color} opacity="0.15" />
    {/* Head circle — primary */}
    <circle cx="128" cy="92" r="44" fill={color} />
    {/* Body outline — primary */}
    <path
      d="M 32 224 C 36 168 76 144 128 144 C 180 144 220 168 224 224"
      stroke={color}
      strokeWidth="16"
      strokeLinecap="round"
      fill="none"
    />
    {/* Collar V */}
    <path
      d="M 110 144 L 128 168 L 146 144"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// Target/Goal — concentric rings bullseye + crosshair lines
export const IconTarget = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    {/* Outer ring fill — secondary */}
    <circle cx="128" cy="128" r="96" fill={color} opacity="0.12" />
    {/* Mid ring fill — secondary */}
    <circle cx="128" cy="128" r="60" fill={color} opacity="0.15" />
    {/* Crosshair lines — secondary */}
    <line
      x1="128"
      y1="24"
      x2="128"
      y2="72"
      stroke={color}
      strokeWidth="12"
      strokeLinecap="round"
      opacity="0.2"
    />
    <line
      x1="128"
      y1="184"
      x2="128"
      y2="232"
      stroke={color}
      strokeWidth="12"
      strokeLinecap="round"
      opacity="0.2"
    />
    <line
      x1="24"
      y1="128"
      x2="72"
      y2="128"
      stroke={color}
      strokeWidth="12"
      strokeLinecap="round"
      opacity="0.2"
    />
    <line
      x1="184"
      y1="128"
      x2="232"
      y2="128"
      stroke={color}
      strokeWidth="12"
      strokeLinecap="round"
      opacity="0.2"
    />
    {/* Outer ring stroke — primary */}
    <circle
      cx="128"
      cy="128"
      r="96"
      stroke={color}
      strokeWidth="14"
      fill="none"
    />
    {/* Mid ring stroke — primary */}
    <circle
      cx="128"
      cy="128"
      r="60"
      stroke={color}
      strokeWidth="12"
      fill="none"
    />
    {/* Bullseye dot — primary */}
    <circle cx="128" cy="128" r="22" fill={color} />
    {/* Crosshair lines — primary */}
    <line
      x1="128"
      y1="24"
      x2="128"
      y2="72"
      stroke={color}
      strokeWidth="12"
      strokeLinecap="round"
    />
    <line
      x1="128"
      y1="184"
      x2="128"
      y2="232"
      stroke={color}
      strokeWidth="12"
      strokeLinecap="round"
    />
    <line
      x1="24"
      y1="128"
      x2="72"
      y2="128"
      stroke={color}
      strokeWidth="12"
      strokeLinecap="round"
    />
    <line
      x1="184"
      y1="128"
      x2="232"
      y2="128"
      stroke={color}
      strokeWidth="12"
      strokeLinecap="round"
    />
  </svg>
);

// Weight — proper balance scale: central post, horizontal beam, two hanging pans
export const IconWeight = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    {/* Pan fills — secondary */}
    <ellipse cx="68" cy="172" rx="40" ry="14" fill={color} opacity="0.2" />
    <ellipse cx="188" cy="172" rx="40" ry="14" fill={color} opacity="0.2" />
    {/* Base plate — secondary */}
    <rect
      x="88"
      y="210"
      width="80"
      height="14"
      rx="7"
      fill={color}
      opacity="0.25"
    />
    {/* Central post — primary */}
    <line
      x1="128"
      y1="48"
      x2="128"
      y2="216"
      stroke={color}
      strokeWidth="14"
      strokeLinecap="round"
    />
    {/* Base */}
    <rect x="88" y="210" width="80" height="14" rx="7" fill={color} />
    {/* Pivot circle */}
    <circle cx="128" cy="60" r="10" fill={color} />
    {/* Beam — primary */}
    <line
      x1="52"
      y1="80"
      x2="204"
      y2="80"
      stroke={color}
      strokeWidth="12"
      strokeLinecap="round"
    />
    {/* Left chain */}
    <line
      x1="68"
      y1="80"
      x2="68"
      y2="158"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
      strokeDasharray="0 0"
    />
    {/* Right chain — slightly lower to show balance in use */}
    <line
      x1="188"
      y1="80"
      x2="188"
      y2="158"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
    />
    {/* Left pan */}
    <path
      d="M 28 172 Q 68 186 108 172"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />
    {/* Right pan */}
    <path
      d="M 148 172 Q 188 186 228 172"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />
    {/* Pan top lines */}
    <line
      x1="28"
      y1="172"
      x2="108"
      y2="172"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      opacity="0.4"
    />
    <line
      x1="148"
      y1="172"
      x2="228"
      y2="172"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// Bell
export const IconBell = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M221.8,175.94C216.25,166.38,208,139.36,208,104a80,80,0,1,0-160,0c0,35.36-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88a40,40,0,0,0,80,0h40a16,16,0,0,0,13.8-24.06Z" />
    <path d="M128,232a24,24,0,0,1-22.63-16h45.26A24,24,0,0,1,128,232Z" />
  </DuoIcon>
);

// Lock/Privacy
export const IconLock = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <rect x="40" y="120" width="176" height="112" rx="8" />
    <path
      d="M88,120V88a40,40,0,0,1,80,0v32"
      stroke={color}
      strokeWidth="16"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="128" cy="164" r="12" />
  </DuoIcon>
);

// Export/Upload
export const IconExport = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M224,152v56a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V152a8,8,0,0,1,16,0v48H208V152a8,8,0,0,1,16,0Z" />
    <path d="M88.57,76.57,120,45.13V152a8,8,0,0,0,16,0V45.13l31.43,31.44a8,8,0,0,0,11.32-11.32l-45.9-45.9-.06-.06a8,8,0,0,0-11.32.06L75.57,65.25A8,8,0,0,0,86.89,76.57Z" />
  </DuoIcon>
);

// Globe/Language — detailed globe with meridians, latitude bands, equator emphasis
export const IconGlobe = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    {/* Globe fill — secondary */}
    <circle cx="128" cy="128" r="96" fill={color} opacity="0.12" />
    {/* Latitude bands — secondary */}
    <ellipse
      cx="128"
      cy="128"
      rx="96"
      ry="38"
      fill="none"
      stroke={color}
      strokeWidth="8"
      opacity="0.18"
    />
    <ellipse
      cx="128"
      cy="96"
      rx="72"
      ry="20"
      fill="none"
      stroke={color}
      strokeWidth="6"
      opacity="0.15"
    />
    <ellipse
      cx="128"
      cy="160"
      rx="72"
      ry="20"
      fill="none"
      stroke={color}
      strokeWidth="6"
      opacity="0.15"
    />
    {/* Outer circle — primary */}
    <circle
      cx="128"
      cy="128"
      r="96"
      stroke={color}
      strokeWidth="14"
      fill="none"
    />
    {/* Equator — primary, bold */}
    <line
      x1="32"
      y1="128"
      x2="224"
      y2="128"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
    />
    {/* Central meridian — primary */}
    <ellipse
      cx="128"
      cy="128"
      rx="46"
      ry="96"
      stroke={color}
      strokeWidth="10"
      fill="none"
    />
    {/* Side meridians — primary, lighter */}
    <path
      d="M 128 32 Q 196 80 196 128 Q 196 176 128 224"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
    <path
      d="M 128 32 Q 60 80 60 128 Q 60 176 128 224"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
    {/* Top / bottom poles */}
    <circle cx="128" cy="32" r="6" fill={color} />
    <circle cx="128" cy="224" r="6" fill={color} />
  </svg>
);

// Clock/Time
export const IconClock = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <circle cx="128" cy="128" r="96" />
    <path
      d="M128,72v56l40,24"
      stroke={color}
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </DuoIcon>
);

// Ruler/Measurements
export const IconRuler = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M220.28,75.72l-40-40a8,8,0,0,0-11.32,0l-144,144a8,8,0,0,0,0,11.32l40,40a8,8,0,0,0,11.32,0l144-144A8,8,0,0,0,220.28,75.72Z" />
    <path d="M100.69,156.69,80,136,72,144l20.69,20.69Zm40-40L120,96l-8,8,20.69,20.69Zm40-40L160,56l-8,8,20.69,20.69Z" />
  </DuoIcon>
);

// Palette/Theme
export const IconPalette = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M200.77,53.23A103.59,103.59,0,0,0,128,24h-1.07A104,104,0,0,0,24,128.75c.5,55.34,45.28,100.55,100.62,101.24A104,104,0,0,0,200.77,53.23Z" />
    <path d="M72,128a20,20,0,1,1,20,20A20,20,0,0,1,72,128Zm12-52a20,20,0,1,1,20,20A20,20,0,0,1,84,76Zm80,0a20,20,0,1,1,20,20A20,20,0,0,1,164,76Zm28,76a20,20,0,1,1,20,20A20,20,0,0,1,192,152Z" />
  </DuoIcon>
);

// Sign out/door
export const IconSignOut = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M168,40H72A16,16,0,0,0,56,56V200a16,16,0,0,0,16,16h96a16,16,0,0,0,16-16V56A16,16,0,0,0,168,40Z" />
    <path d="M229.66,122.34l-32-32a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,229.66,122.34Z" />
  </DuoIcon>
);

// Trash/Delete
export const IconTrash = ({ size = 20, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16Zm-96-8h32a8,8,0,0,1,8,8v8H112V48A8,8,0,0,1,120,40Z" />
    <path d="M112,160V104a8,8,0,0,0-16,0v56a8,8,0,0,0,16,0Zm48,0V104a8,8,0,0,0-16,0v56a8,8,0,0,0,16,0Z" />
  </DuoIcon>
);

// Pencil/Edit
export const IconPencil = ({ size = 14, color = "currentColor" }) => (
  <DuoIcon size={size} color={color}>
    <path d="M224,76l-52-52a8,8,0,0,0-11.31,0L36.68,148a8.07,8.07,0,0,0-2.32,4.82L32,208.24A8,8,0,0,0,40,216a8.43,8.43,0,0,0,.76,0l55.43-2.37a8,8,0,0,0,4.81-2.31L224,87.31A8,8,0,0,0,224,76Z" />
    <path d="M192,96.68,159.31,64,176,47.31,208.68,80Z" />
  </DuoIcon>
);
