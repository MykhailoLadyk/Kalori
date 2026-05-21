import { Quest } from "./Quest";
import {
  QuestMealIcon,
  QuestWaterIcon,
  QuestProteinIcon,
  QuestFireIcon,
} from "./DuoIcon";

const QUEST_ICON_MAP = {
  meal: QuestMealIcon,
  water: QuestWaterIcon,
  protein: QuestProteinIcon,
  fire: QuestFireIcon,
};

export function QuestList({ quests }) {
  return quests.map((q, i) => {
    const Icon = q.Icon || QUEST_ICON_MAP[q.icon] || q.icon;
    return <Quest key={q.name ?? i} {...q} Icon={Icon} />;
  });
}
