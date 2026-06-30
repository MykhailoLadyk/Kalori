import { quests as questDefs, achievements as achDefs } from "./constans";

/**
 * @param {string}  trigger  - e.g. "ADD_MEAL"
 * @param {object}  payload  - the action data
 * @param {object}  contextBag - { meals, user, stats, gameData, userQuests, userAchievements }
 * @returns {{ updatedQuests: Array, updatedAchievements: Array }}
 */
export function processProgress(trigger, payload, contextBag) {
  const { userQuests, userAchievements } = contextBag;

  // Build lookup of current user progress
  const questProgressMap = new Map(userQuests.map(q => [q.id, q]));
  const achProgressMap = new Map(userAchievements.map(a => [a.id, a]));

  const updatedQuests = [];
  const updatedAchievements = [];

  // --- Process Quests ---
  for (const def of questDefs) {
    if (!def.triggers || !def.triggers.includes(trigger)) continue;
    const userQ = questProgressMap.get(def.id);
    if (!userQ) continue; // not an active quest for this user
    if (userQ.completedAt) continue; // already done

    const ctx = { ...contextBag, item: userQ };
    const result = def.evaluate(payload, ctx);
    
    const newProgress = Math.min(result.progress, def.max);
    if (newProgress !== userQ.progress || result.lastCountedDate !== userQ.lastCountedDate) {
      updatedQuests.push({ ...userQ, progress: newProgress, lastCountedDate: result.lastCountedDate || userQ.lastCountedDate });
    }
  }

  // --- Process Achievements ---
  for (const def of achDefs) {
    if (!def.triggers || !def.triggers.includes(trigger)) continue;
    const userA = achProgressMap.get(def.id);
    if (!userA) continue; // not an active achievement for this user
    if (userA.completedAt) continue; // already done

    const ctx = { ...contextBag, item: userA };
    const result = def.evaluate(payload, ctx);
    
    const newProgress = Math.min(result.progress, def.max);
    if (newProgress !== userA.progress || result.lastCountedDate !== userA.lastCountedDate) {
      updatedAchievements.push({ ...userA, progress: newProgress, lastCountedDate: result.lastCountedDate || userA.lastCountedDate });
    }
  }

  return { updatedQuests, updatedAchievements };
}
