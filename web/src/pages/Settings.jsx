import { useState } from "react";
import SettingsCard from "../components/settings/SettingsCard";
import { Mono } from "../components/shared/Primitives";
import { C, F } from "../lib/constans";
import { Modal } from "../components/modals/Modal";
import {
  IconUser,
  IconTarget,
  IconWeight,
  IconGlobe,
  IconClock,
  IconRuler,
  IconPalette,
  IconBell,
  IconDrop,
  IconFire,
  IconLock,
  IconExport,
  IconCalendar,
  IconSignOut,
  IconTrash,
} from "../components/shared/DuoIcon";

export default function Settings() {
  const [toggles, setToggles] = useState({
    meal: true,
    water: true,
    streak: false,
  });
  const [modal, setModal] = useState(null);
  const modals = {};
  const toggle = (k) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  const SectionLabel = ({ children }) => (
    <div
      style={{
        fontFamily: F.mono,
        fontSize: 9,
        color: C.mutedLight,
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 10,
        animation: `fadeUp 0.4s ease both`,
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ padding: "16px 22px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
          animation: "fadeUp 0.4s ease both",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: F.head,
            fontSize: 24,
            fontWeight: 900,
            color: "#000",
            flexShrink: 0,
          }}
        >
          M
        </div>
        <div>
          <div
            style={{
              fontFamily: F.head,
              fontSize: 18,
              fontWeight: 900,
              color: C.text,
            }}
          >
            Maria
          </div>
          <Mono size={8} color={C.muted}>
            Level 5 · 1,240 XP
          </Mono>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionLabel>Account</SectionLabel>
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          <SettingsCard
            icon={<IconUser size={18} color={C.soft} />}
            label="Profile Settings"
            sub="Name, photo, goals"
            arrow
          />
          <SettingsCard
            icon={<IconTarget size={18} color={C.soft} />}
            label="Calorie Goal"
            sub="2,000 kcal/day"
            arrow
            withTopBorder
          />
          <SettingsCard
            icon={<IconWeight size={18} color={C.soft} />}
            label="Body Stats"
            sub="Weight, height, activity"
            arrow
            withTopBorder
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionLabel>Preferences</SectionLabel>
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          <SettingsCard
            icon={<IconGlobe size={18} color={C.soft} />}
            label="Language"
            sub="English"
            arrow
          />
          <SettingsCard
            icon={<IconClock size={18} color={C.soft} />}
            label="Timezone"
            sub="UTC+1 · Warsaw"
            arrow
            withTopBorder
          />
          <SettingsCard
            icon={<IconRuler size={18} color={C.soft} />}
            label="Measurements"
            sub="Metric (kg, cm)"
            arrow
            withTopBorder
          />
          <SettingsCard
            icon={<IconPalette size={18} color={C.soft} />}
            label="Theme"
            sub="Midnight Mint"
            arrow
            withTopBorder
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionLabel>Notifications</SectionLabel>
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          <SettingsCard
            icon={<IconBell size={18} color={C.soft} />}
            label="Meal Reminders"
            sub="08:00, 13:00, 19:00"
            toggle={toggles.meal}
            onToggle={() => toggle("meal")}
          />
          <SettingsCard
            icon={<IconDrop size={18} color={C.soft} />}
            label="Water Reminders"
            sub="Every 2 hours"
            toggle={toggles.water}
            onToggle={() => toggle("water")}
            withTopBorder
          />
          <SettingsCard
            icon={<IconFire size={18} color={C.soft} />}
            label="Streak Alerts"
            sub="If you haven't logged by 8pm"
            toggle={toggles.streak}
            onToggle={() => toggle("streak")}
            withTopBorder
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionLabel>App</SectionLabel>
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          <SettingsCard
            icon={<IconLock size={18} color={C.soft} />}
            label="Privacy"
            sub="Data & permissions"
            arrow
          />
          <SettingsCard
            icon={<IconExport size={18} color={C.soft} />}
            label="Export My Data"
            sub="Download all your data"
            arrow
            withTopBorder
          />
          <SettingsCard
            icon={<IconCalendar size={18} color={C.soft} />}
            label="Legal"
            sub="Terms & Privacy Policy"
            arrow
            withTopBorder
          />
          <SettingsCard
            icon={<IconSignOut size={18} color={C.red} />}
            label="Log Out"
            danger
            withTopBorder
          />
          <SettingsCard
            icon={<IconTrash size={18} color={C.red} />}
            label="Delete Account"
            sub="Permanent"
            danger
            withTopBorder
          />
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          animation: "fadeIn 0.4s ease 0.6s both",
        }}
      >
        <Mono size={8} color={C.muted}>
          Kalori v1.0.0 · Made with 🤍
        </Mono>
      </div>
      <Modal id={modal} close={() => setModal(null)}>
        {modals[modal]}
      </Modal>
    </div>
  );
}
