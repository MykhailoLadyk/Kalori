import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Mono } from "../components/shared/Primitives";
import { C, F } from "../lib/constants";
import { useUser } from "../hooks/useUser";
import { useTutorial } from "../hooks/useTutorial";
import { useGameStats } from "../hooks/useGameStats";

import SettingsCard from "../components/settings/SettingsCard";
import Avatar from "../components/shared/Avatar";

import { Modal } from "../components/modals/Modal";
import ProfileModal from "../components/modals/settings/ProfileModal";
import CalorieGoalModal from "../components/modals/settings/CalorieGoalModal";
import BodyStatsModal from "../components/modals/settings/BodyStatsModal";
import LanguageModal from "../components/modals/settings/LanguageModal";
import TimezoneModal from "../components/modals/settings/TimezonesModal";
import MeasurementsModal from "../components/modals/settings/MeasurmentsModal";
import ExportModal from "../components/modals/settings/ExportModal";
import SettingsThemeModal from "../components/modals/settings/SettingsThemesModal";
import SettingsAvatarModal from "../components/modals/settings/SettingsAvatarModal";
import SettingsFlameModal from "../components/modals/settings/SettingsFlameModal";
import LogoutModal from "../components/modals/settings/LogOutModal";
import DeleteAccountModal from "../components/modals/settings/DeleteAccountModal";

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
  IconCrown,
  IconStar,
} from "../components/shared/DuoIcon";
import { Tag } from "../components/shared/Primitives";

export default function Settings() {
  const navigate = useNavigate();
  const { user, isPro } = useUser();
  const { startTutorial } = useTutorial();
  const { gameData } = useGameStats();
  const [toggles, setToggles] = useState({ meal: true, water: true, streak: false });
  const [modal, setModal] = useState(null);
  const modals = {
    profile: <ProfileModal handleClose={() => setModal(null)} />,
    calorieGoal: <CalorieGoalModal handleClose={() => setModal(null)} />,
    bodyStats: <BodyStatsModal handleClose={() => setModal(null)} />,
    // language: <LanguageModal handleClose={() => setModal(null)} />,
    timezone: <TimezoneModal handleClose={() => setModal(null)} />,
    measurements: <MeasurementsModal handleClose={() => setModal(null)} />,
    export: <ExportModal handleClose={() => setModal(null)} />,
    theme: <SettingsThemeModal handleClose={() => setModal(null)} />,
    avatar: <SettingsAvatarModal handleClose={() => setModal(null)} />,
    flame: <SettingsFlameModal handleClose={() => setModal(null)} />,
    logout: <LogoutModal handleClose={() => setModal(null)} />,
    deleteAccount: <DeleteAccountModal handleClose={() => setModal(null)} />,
  };
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
        style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, animation: "fadeUp 0.4s ease both" }}
      >
        <Avatar user={user} size={52} fontSize={24} borderRadius={16} />
        <div>
          <div style={{ fontFamily: F.head, fontSize: 18, fontWeight: 900, color: C.text }}>{user?.name || "User"}</div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionLabel>Account</SectionLabel>
        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <SettingsCard
            onClick={() => navigate("/premium")}
            icon={<IconCrown size={18} color={C.gold} />}
            label="Kalori Pro"
            sub={isPro ? "PRO Active · 100 scans/day" : "Free Plan · 50 🪙 per scan"}
            arrow
          />
          <SettingsCard
            onClick={() => {
              setModal("profile");
            }}
            icon={<IconUser size={18} color={C.soft} />}
            label="Profile Settings"
            arrow
            withTopBorder
          />
          <SettingsCard
            onClick={() => {
              setModal("calorieGoal");
            }}
            icon={<IconTarget size={18} color={C.soft} />}
            label="Goals & Targets"
            arrow
            withTopBorder
          />
          <SettingsCard
            onClick={() => {
              setModal("bodyStats");
            }}
            icon={<IconWeight size={18} color={C.soft} />}
            label="Body Stats"
            arrow
            withTopBorder
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionLabel>Preferences</SectionLabel>
        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          {/* <SettingsCard
            onClick={() => {
              setModal("language");
            }}
            icon={<IconGlobe size={18} color={C.soft} />}
            label="Language"
            arrow
          /> */}
          {/* <SettingsCard
            onClick={() => {
              setModal("timezone");
            }}
            icon={<IconClock size={18} color={C.soft} />}
            label="Timezone"
            arrow
            withTopBorder
          /> */}
          {/* <SettingsCard
            onClick={() => {
              setModal("measurements");
            }}
            icon={<IconRuler size={18} color={C.soft} />}
            label="Measurements"
            arrow
            withTopBorder
          /> */}
          <SettingsCard
            onClick={() => {
              setModal("avatar");
            }}
            icon={<IconUser size={18} color={C.soft} />}
            label="Avatar"
            arrow
          />
          <SettingsCard
            onClick={() => {
              setModal("flame");
            }}
            icon={<IconFire size={18} color={C.soft} />}
            label="Streak Flame"
            arrow
            withTopBorder
          />
          <SettingsCard
            onClick={() => {
              setModal("theme");
            }}
            icon={<IconPalette size={18} color={C.soft} />}
            label="Theme"
            arrow
            withTopBorder
          />
        </div>
      </div>

      {/* <div style={{ marginBottom: 16 }}>
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
      </div> */}

      <div style={{ marginBottom: 16 }}>
        <SectionLabel>App</SectionLabel>
        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <SettingsCard
            onClick={() => {
              startTutorial();
              navigate("/");
            }}
            icon={<IconStar size={18} color={C.soft} />}
            label="Replay Tutorial"
            sub="Walk through the app again"
            arrow
          />
          <SettingsCard
            onClick={() => navigate("/privacy")}
            icon={<IconLock size={18} color={C.soft} />}
            label="Privacy Policy"
            arrow
            withTopBorder
          />
          {/* <SettingsCard
            onClick={() => {
              setModal("export");
            }}
            icon={<IconExport size={18} color={C.soft} />}
            label="Export My Data"
            arrow
            withTopBorder
          /> */}
          <SettingsCard
            onClick={() => navigate("/terms")}
            icon={<IconCalendar size={18} color={C.soft} />}
            label="Terms of Service"
            arrow
            withTopBorder
          />
          <SettingsCard
            onClick={() => {
              setModal("logout");
            }}
            icon={<IconSignOut size={18} color={C.red} />}
            label="Log Out"
            danger
            withTopBorder
          />
          <SettingsCard
            onClick={() => {
              setModal("deleteAccount");
            }}
            icon={<IconTrash size={18} color={C.red} />}
            label="Delete Account"
            danger
            withTopBorder
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 8, animation: "fadeIn 0.4s ease 0.6s both" }}>
        <Mono size={8} color={C.muted}>
          Kalori v1.2.1
        </Mono>
      </div>
      <Modal id={modal} close={() => setModal(null)}>
        {modals[modal]}
      </Modal>
    </div>
  );
}
