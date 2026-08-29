import { Joyride, STATUS } from "react-joyride";
import { useTutorial } from "../../hooks/useTutorial";
import { useLocation } from "react-router-dom";
import { alpha } from "../../lib/constants";

const STEPS = [
  {
    target: '[data-tour="calorie-ring"]',
    title: "Your Daily Goal",
    content: "This ring shows how many calories you've eaten vs your daily target. Stay in the green!",
    skipBeacon: true,
    blockTargetInteraction: true,
    buttons: ["skip", "primary"],
  },
  {
    target: '[data-tour="macro-bars"]',
    title: "Macro Breakdown",
    content: "Track your protein, carbs, and fat intake against your goals here.",
    skipBeacon: true,
    blockTargetInteraction: true,
    buttons: ["back", "skip", "primary"],
  },
  {
    target: '[data-tour="add-meal-btn"]',
    title: "Log a Meal",
    content: "Tap here to log what you eat. You can describe it, snap a photo, or enter macros manually.",
    skipBeacon: true,
    blockTargetInteraction: true,
    buttons: ["back", "skip", "primary"],
  },
  {
    target: '[data-tour="meals-list"]',
    title: "Your Meals",
    content:
      "All your logged meals appear here, grouped by Breakfast, Lunch, Dinner, and Snacks. Tap a meal to edit or favorite it.",
    skipBeacon: true,
    blockTargetInteraction: true,
    buttons: ["back", "skip", "primary"],
  },
  {
    target: '[data-tour="water-tracker"]',
    title: "Water Tracker",
    content: "Track your hydration! Use the quick-add buttons or enter a custom amount.",
    skipBeacon: true,
    blockTargetInteraction: true,
    buttons: ["back", "skip", "primary"],
  },
  {
    target: '[data-tour="streak-badge"]',
    title: "Your Streak",
    content: "Log meals every day to build your streak. Don't break the chain!",
    skipBeacon: true,
    blockTargetInteraction: true,
    buttons: ["back", "skip", "primary"],
  },
  {
    target: '[data-tour="nav-game"]',
    title: "Level Up & Quests",
    content: "Earn XP by logging meals, hit milestones, and complete daily quests for coins.",
    skipBeacon: true,
    blockTargetInteraction: true,
    buttons: ["back", "skip", "primary"],
  },
  {
    target: '[data-tour="nav-shop"]',
    title: "The Shop",
    content: "Spend your coins on avatars, streak flames, themes, and power-ups.",
    skipBeacon: true,
    blockTargetInteraction: true,
    buttons: ["back", "primary"],
  },
];

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
  const { isTutorialActive, tutorialKey, endTutorial } = useTutorial();
  const location = useLocation();
  const options = useJoyrideOptions();
  const styles = useJoyrideStyles();

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
      key={tutorialKey}
      steps={STEPS}
      run={isTutorialActive}
      continuous
      scrollToFirstStep
      options={options}
      styles={styles}
      onEvent={handleEvent}
      locale={{ back: "Back", close: "Got it", last: "Done!", next: "Next", skip: "Skip tour" }}
    />
  );
}
