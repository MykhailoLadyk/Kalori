// modals/home/AddMealModal.jsx
import { C, F } from "../../../lib/constans";
import { Mono } from "../../../components/shared/Primitives";

const OPTIONS = [
  {
    key: "photo",
    label: "Photo",
    sub: "Take a photo of your meal",
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 256 256" fill="none">
        <path
          d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.72,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Z"
          fill={color}
          opacity="0.2"
        />
        <circle cx="128" cy="132" r="36" fill={color} opacity="0.2" />
        <path
          d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.72,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.65-3.56L100.28,48h55.44l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8Z"
          fill={color}
        />
        <path
          d="M128,84a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,84Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,164Z"
          fill={color}
        />
      </svg>
    ),
    color: C.blue,
  },
  {
    key: "describe",
    label: "Describe",
    sub: "Describe what you ate",
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 256 256" fill="none">
        <path
          d="M216,48H40a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A8,8,0,0,0,216,48Z"
          fill={color}
          opacity="0.2"
        />
        <path
          d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM80,112a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,112Zm0,32a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,144Zm0,32a8,8,0,0,1,8-8h40a8,8,0,0,1,0,16H88A8,8,0,0,1,80,176Z"
          fill={color}
        />
      </svg>
    ),
    color: C.accent,
  },
  {
    key: "album",
    label: "Album",
    sub: "Choose from your gallery",
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 256 256" fill="none">
        <path
          d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Z"
          fill={color}
          opacity="0.2"
        />
        <path
          d="M216,24H88a16,16,0,0,0-16,16V72H40A16,16,0,0,0,24,88V216a16,16,0,0,0,16,16H168a16,16,0,0,0,16-16V184h32a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM88,40H216v93.37l-19.19-19.18a16,16,0,0,0-22.62,0L160,128.37l-18.34-18.35a16,16,0,0,0-22.63,0L104,125.37V88h0V40ZM168,216H40V88H88v37.37a16,16,0,0,0,22.63,0h0L128,107.31l18.35,18.34a16,16,0,0,0,22.62,0L184,110.55V168H168Z"
          fill={color}
        />
      </svg>
    ),
    color: C.pink,
  },
  {
    key: "manual",
    label: "Manual",
    sub: "Enter nutrition details",
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 256 256" fill="none">
        <path
          d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Z"
          fill={color}
          opacity="0.2"
        />
        <path
          d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"
          fill={color}
        />
      </svg>
    ),
    color: C.gold,
  },
];

export function MealAddOptionSelectModal({ onSelect, handleClose }) {
  return (
    <div>
      {/* title */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: F.head,
            fontSize: 20,
            fontWeight: 900,
            color: C.text,
          }}
        >
          Add Meal
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 13,
            color: C.soft,
            marginTop: 4,
          }}
        >
          How would you like to log it?
        </div>
      </div>

      {/* options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {OPTIONS.map(({ key, label, sub, icon, color }) => (
          <div
            key={key}
            onClick={() => onSelect(key)}
            className="hover-card press"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "14px 16px",
              cursor: "pointer",
            }}
          >
            {/* icon container */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: color + "18",
                border: `1px solid ${color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {icon(color)}
            </div>

            {/* text */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 3,
                }}
              >
                {label}
              </div>
              <Mono size={8} color={C.muted}>
                {sub}
              </Mono>
            </div>

            {/* chevron */}
            <span style={{ color: C.muted, fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
