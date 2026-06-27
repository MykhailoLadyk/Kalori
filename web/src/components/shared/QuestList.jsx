import { Quest } from "./Quest";
import {
  QuestMealIcon,
  QuestWaterIcon,
  QuestProteinIcon,
  QuestFireIcon,
} from "./DuoIcon";
import { C, quests as questDefinitions } from "../../lib/constans";
import { useGameStats } from "../../hooks/useGameStats";
const QUEST_ICON_MAP = {
  meal: QuestMealIcon,
  water: QuestWaterIcon,
  protein: QuestProteinIcon,
  fire: QuestFireIcon,
};
export function QuestList() {
  const { quests: userQuests } = useGameStats();
  const questDefinitionById = new Map(
    questDefinitions.map((quest) => [quest.id, quest]),
  );
  const quests = (userQuests || []).map((userQuest) => {
    const quest = questDefinitionById.get(userQuest.id) || {};
    const max = quest.max ?? 1;
    const progress = Math.min(userQuest.progress ?? 0, max);
    const done = progress >= max;
    return {
      ...quest,
      ...userQuest,
      Icon: QUEST_ICON_MAP[quest.icon] || QUEST_ICON_MAP[userQuest.icon],
      xp: quest.reward,
      pct: max > 0 ? (progress / max) * 100 : 0,
      done,
      color: quest.type === "Daily" ? C.accent : C.gold,
    };
  });

  return quests.map((q, i) => {
    const Icon = q.Icon || QUEST_ICON_MAP[q.icon] || q.icon;
    return <Quest key={q.id ?? q.name ?? i} {...q} Icon={Icon} />;
  });
}
