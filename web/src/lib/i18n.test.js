import { describe, it, expect, beforeEach } from "vitest";
import i18n from "./i18n";

describe("i18n Internationalization", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("translates English navigation keys correctly", () => {
    expect(i18n.t("nav.home")).toBe("HOME");
    expect(i18n.t("nav.settings")).toBe("SETTINGS");
    expect(i18n.t("nav.shop")).toBe("SHOP");
  });

  it("switches to Polish and translates navigation keys correctly", async () => {
    await i18n.changeLanguage("pl");
    expect(i18n.t("nav.home")).toBe("GŁÓWNA");
    expect(i18n.t("nav.settings")).toBe("USTAWIENIA");
    expect(i18n.t("nav.shop")).toBe("SKLEP");
    expect(i18n.t("settings.language")).toBe("Język");
  });

  it("translates onboarding steps in Polish", async () => {
    await i18n.changeLanguage("pl");
    expect(i18n.t("onboarding.welcomeTitle")).toBe("Witaj w");
    expect(i18n.t("onboarding.bodyTitle")).toBe("Parametry Ciała");
    expect(i18n.t("onboarding.sexLabel")).toBe("Płeć biologiczna");
  });

  it("handles pluralization in English and Polish", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("common.day", { count: 1 })).toBe("1 day");
    expect(i18n.t("common.day", { count: 5 })).toBe("5 days");

    await i18n.changeLanguage("pl");
    expect(i18n.t("common.day", { count: 1 })).toBe("1 dzień");
    expect(i18n.t("common.day", { count: 2 })).toBe("2 dni");
    expect(i18n.t("common.day", { count: 5 })).toBe("5 dni");
  });

  it("translates tutorial steps in English and Polish", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("tutorial.calorieRingTitle")).toBe("Your Daily Goal");
    expect(i18n.t("tutorial.skip")).toBe("Skip tour");

    await i18n.changeLanguage("pl");
    expect(i18n.t("tutorial.calorieRingTitle")).toBe("Twój Dzienny Cel");
    expect(i18n.t("tutorial.skip")).toBe("Pomiń samouczek");
    expect(i18n.t("tutorial.done")).toBe("Gotowe!");
  });

  it("translates stats, achievements, quests, notifs, shop, privacy and terms in Polish", async () => {
    await i18n.changeLanguage("pl");
    expect(i18n.t("stats.title")).toBe("Statystyki");
    expect(i18n.t("stats.logWeight")).toBe("DODAJ WAGĘ");
    expect(i18n.t("game.achievements")).toBe("Osiągnięcia");
    expect(i18n.t("achievements_data.1.name")).toBe("Pierwszy Posiłek");
    expect(i18n.t("quests.activeQuests")).toBe("Aktywne Zadania");
    expect(i18n.t("quests.questsLocked")).toBe("Zadania Zablokowane");
    expect(i18n.t("quests.daily")).toBe("Dzienne");
    expect(i18n.t("quests_data.1.name")).toBe("Zapisz 3 posiłki dzisiaj");
    expect(i18n.t("notifs.targetReached")).toBe("Cel Osiągnięty");
    expect(i18n.t("shop.streakFlames")).toBe("Płomienie Serii");
    expect(i18n.t("shop.streakShield")).toBe("Osłona Serii");
    expect(i18n.t("privacy.title")).toBe("Polityka Prywatności");
    expect(i18n.t("terms.title")).toBe("Regulamin Usługi");
  });

  it("translates home, meal, pro, insufficientCoins and settings in Polish", async () => {
    await i18n.changeLanguage("pl");
    expect(i18n.t("home.todaysMeals")).toBe("Dzisiejsze Posiłki");
    expect(i18n.t("home.addMeal")).toBe("DODAJ POSIŁEK");
    expect(i18n.t("home.customWaterPlaceholder")).toBe("+ Własna");
    expect(i18n.t("meal.confirmMeal")).toBe("Zatwierdź Posiłek");
    expect(i18n.t("meal.fave")).toBe("ULUBIONE");
    expect(i18n.t("meal.unfave")).toBe("USUŃ");
    expect(i18n.t("meal.editMeal")).toBe("Edytuj Posiłek");
    expect(i18n.t("meal.deleteMeal")).toBe("Usuń Posiłek");
    expect(i18n.t("pro.upgradeToPro")).toBe("Przejdź na Kalori Pro");
    expect(i18n.t("pro.viewPro")).toBe("ZOBACZ PRO ›");
    expect(i18n.t("pro.heroTitle")).toBe("Wznieś dietę na wyższy poziom");
    expect(i18n.t("insufficientCoins.title", { count: 50 })).toBe("Wymagane 50 monet");
    expect(i18n.t("settings.kaloriPro")).toBe("Kalori Pro");
    expect(i18n.t("settings.proActive")).toBe("PRO Member · Wysoki limit AI");
    expect(i18n.t("settings.freePlanCoins")).toBe("Plan darmowy · 50 za skan AI");
    expect(i18n.t("settings.profileSettings")).toBe("Ustawienia Profilu");
    expect(i18n.t("settings.goalsTargets")).toBe("Cele Kalorii i Makroskładników");
    expect(i18n.t("settings.bodyStats")).toBe("Wymiary Ciała");
    expect(i18n.t("settings.app")).toBe("Aplikacja");
    expect(i18n.t("settings.replayTutorial")).toBe("Odtwórz Samouczek");
    expect(i18n.t("settings.privacyPolicy")).toBe("Polityka Prywatności");
    expect(i18n.t("settings.termsOfService")).toBe("Regulamin Usługi");
  });

  it("falls back to English for missing keys in unsupported languages", async () => {
    await i18n.changeLanguage("de");
    expect(i18n.t("nav.home")).toBe("HOME");
  });
});
