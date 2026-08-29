import { useTranslation } from "react-i18next";
import { Quest } from "./Quest";
import {
  QuestMealIcon,
  QuestWaterIcon,
  QuestProteinIcon,
  QuestFireIcon,
} from "./DuoIcon";
import { C, quests as questDefinitions } from "../../lib/constants";
import { useGameStats } from "../../hooks/useGameStats";

const QUEST_ICON_MAP = {
  meal: QuestMealIcon,
  water: QuestWaterIcon,
  protein: QuestProteinIcon,
  fire: QuestFireIcon,
};

export function QuestList() {
  const { t } = useTranslation();
  const { quests: userQuests, gameData, rerollQuest } = useGameStats();
  const questDefinitionById = new Map(
    questDefinitions.map((quest) => [quest.id, quest]),
  );
  const quests = (userQuests || []).map((userQuest) => {
    const quest = questDefinitionById.get(userQuest.id) || {};
    const max = quest.max ?? 1;
    const progress = Math.min(userQuest.progress ?? 0, max);
    const done = progress >= max;
    const localizedName = t(`quests_data.${quest.id}.name`, quest.name || userQuest.name);
    const localizedDesc = t(`quests_data.${quest.id}.desc`, quest.description || userQuest.description);
    const localizedType = quest.type === "Daily" ? t("quests.daily") : t("quests.weekly");

    return {
      ...quest,
      ...userQuest,
      name: localizedName,
      description: localizedDesc,
      type: localizedType,
      Icon: QUEST_ICON_MAP[quest.icon] || QUEST_ICON_MAP[userQuest.icon],
      xp: quest.reward,
      pct: max > 0 ? (progress / max) * 100 : 0,
      done,
      color: quest.type === "Daily" ? C.accent : C.gold,
    };
  }).sort((a, b) => {
    if (a.type === "Daily" && b.type === "Weekly") return -1;
    if (a.type === "Weekly" && b.type === "Daily") return 1;
    return 0;
  });

  return quests.map((q, i) => {
    const Icon = q.Icon || QUEST_ICON_MAP[q.icon] || q.icon;
    return (
      <Quest
        key={q.id ?? q.name ?? i}
        {...q}
        Icon={Icon}
        onReroll={rerollQuest}
        canAffordReroll={(gameData?.coins ?? 0) >= 20}
        rerollCost={20}
      />
    );
  });
}
