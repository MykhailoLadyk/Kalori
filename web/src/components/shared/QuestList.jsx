import { Quest } from "./Quest";

export function QuestList({ quests }) {
  return quests.map((q, i) => {
    return <Quest key={i} {...q} />;
  });
}
