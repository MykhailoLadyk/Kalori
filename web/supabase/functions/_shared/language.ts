/**
 * Resolves locale codes (e.g. 'uk', 'pl', 'en') to full language names for AI prompts.
 */
export function resolveLanguage(lang?: string): string {
  if (!lang) return "English";
  const code = lang.slice(0, 2).toLowerCase();
  if (code === "uk") return "Ukrainian";
  if (code === "pl") return "Polish";
  if (code === "en") return "English";
  if (code === "de") return "German";
  if (code === "es") return "Spanish";
  if (code === "fr") return "French";
  return lang;
}
