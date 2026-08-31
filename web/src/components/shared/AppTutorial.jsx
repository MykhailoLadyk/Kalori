import { useMemo } from "react";
import { Joyride, STATUS } from "react-joyride";
import { useTranslation } from "react-i18next";
import { useTutorial } from "../../hooks/useTutorial";
import { useLocation } from "react-router-dom";
import { alpha } from "../../lib/constants";

function getSteps(t) {
  return [
    {
      target: '[data-tour="calorie-ring"]',
      title: t("tutorial.calorieRingTitle"),
      content: t("tutorial.calorieRingContent"),
      skipBeacon: true,
      blockTargetInteraction: true,
      buttons: ["skip", "primary"],
    },
    {
      target: '[data-tour="macro-bars"]',
      title: t("tutorial.macroBarsTitle"),
      content: t("tutorial.macroBarsContent"),
      skipBeacon: true,
      blockTargetInteraction: true,
      buttons: ["back", "skip", "primary"],
    },
    {
      target: '[data-tour="add-meal-btn"]',
      title: t("tutorial.addMealBtnTitle"),
      content: t("tutorial.addMealBtnContent"),
      skipBeacon: true,
      blockTargetInteraction: true,
      buttons: ["back", "skip", "primary"],
    },
    {
      target: '[data-tour="meals-list"]',
      title: t("tutorial.mealsListTitle"),
      content: t("tutorial.mealsListContent"),
      skipBeacon: true,
      blockTargetInteraction: true,
      buttons: ["back", "skip", "primary"],
    },
    {
      target: '[data-tour="water-tracker"]',
      title: t("tutorial.waterTrackerTitle"),
      content: t("tutorial.waterTrackerContent"),
      skipBeacon: true,
      blockTargetInteraction: true,
      buttons: ["back", "skip", "primary"],
    },
    {
      target: '[data-tour="streak-badge"]',
      title: t("tutorial.streakBadgeTitle"),
      content: t("tutorial.streakBadgeContent"),
      skipBeacon: true,
      blockTargetInteraction: true,
      buttons: ["back", "skip", "primary"],
    },
    {
      target: '[data-tour="nav-game"]',
      title: t("tutorial.navGameTitle"),
      content: t("tutorial.navGameContent"),
      skipBeacon: true,
      blockTargetInteraction: true,
      buttons: ["back", "skip", "primary"],
    },
    {
      target: '[data-tour="nav-shop"]',
      title: t("tutorial.navShopTitle"),
      content: t("tutorial.navShopContent"),
      skipBeacon: true,
      blockTargetInteraction: true,
      buttons: ["back", "primary"],
    },
  ];
}

function useJoyrideOptions() {
  return {
    arrowColor: "var(--c-card)",
    backgroundColor: "var(--c-card)",
    overlayColor: "rgba(0, 0, 0, 0.75)",
    textColor: "var(--c-text)",
    primaryColor: "var(--c-accent)",
    zIndex: 10000,
    skipBeacon: true,
    blockTargetInteraction: true,
    overlayClickAction: "none",
    buttons: ["back", "skip", "primary"],
    spotlightPadding: 8,
    spotlightRadius: 14,
    scrollOffset: 100,
    targetWaitTimeout: 3000,
  };
}

function useJoyrideStyles() {
  return {
    tooltip: {
      backgroundColor: "var(--c-card)",
      borderRadius: 16,
      padding: "18px 18px 14px",
      border: "1px solid var(--c-border)",
      boxShadow: `0 8px 32px ${alpha("var(--c-accent)", 16)}, 0 4px 16px rgba(0,0,0,0.5)`,
      maxWidth: "calc(100vw - 32px)",
      boxSizing: "border-box",
    },
    tooltipTitle: {
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 900,
      fontSize: 16,
      color: "var(--c-accent)",
      marginBottom: 6,
      textAlign: "left",
    },
    tooltipContent: {
      fontFamily: "'DM Sans', system-ui, sans-serif",
      fontSize: 13,
      lineHeight: 1.5,
      color: "var(--c-soft)",
      padding: "4px 0 12px",
      textAlign: "left",
    },
    buttonPrimary: {
      backgroundColor: "var(--c-accent)",
      color: "#000000",
      borderRadius: 10,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1,
      padding: "8px 16px",
      textTransform: "uppercase",
      cursor: "pointer",
      boxShadow: `0 0 10px ${alpha("var(--c-accent)", 40)}`,
    },
    buttonBack: {
      color: "var(--c-soft)",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1,
      marginRight: 8,
      textTransform: "uppercase",
      cursor: "pointer",
    },
    buttonSkip: {
      color: "var(--c-mutedLight)",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      cursor: "pointer",
    },
    buttonClose: { color: "var(--c-muted)" },
    spotlight: { borderRadius: 14 },
  };
}

export default function AppTutorial() {
  const { t } = useTranslation();
  const { isTutorialActive, tutorialKey, endTutorial } = useTutorial();
  const location = useLocation();
  const options = useJoyrideOptions();
  const styles = useJoyrideStyles();

  const steps = useMemo(() => getSteps(t), [t]);

  const handleEvent = (data) => {
    const { status, type } = data;
    if (type === "tour:end" || status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      endTutorial();
    }
  };

  // Only render on the Home page where the tour targets exist
  if (!isTutorialActive || location.pathname !== "/") return null;

  return (
    <Joyride
      key={`${tutorialKey}-${t("tutorial.done")}`}
      steps={steps}
      run={isTutorialActive}
      continuous
      scrollToFirstStep
      options={options}
      styles={styles}
      onEvent={handleEvent}
      locale={{
        back: t("tutorial.back"),
        close: t("tutorial.close"),
        last: t("tutorial.done"),
        next: t("tutorial.next"),
        skip: t("tutorial.skip"),
      }}
    />
  );
}
