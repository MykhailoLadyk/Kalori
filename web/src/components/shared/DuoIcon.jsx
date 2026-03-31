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
