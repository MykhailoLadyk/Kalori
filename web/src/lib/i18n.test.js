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

  it("translates newly added auth, onboarding, stats, shop items and settings keys in Polish", async () => {
    await i18n.changeLanguage("pl");
    // Auth
    expect(i18n.t("auth.taglineLogin")).toBe("ŚLEDŹ · ZDOBYWAJ POZIOMY · ROZWIJAJ SIĘ");
    expect(i18n.t("auth.taglineSignup")).toBe("ROZPOCZNIJ SWOJĄ PODRÓŻ");
    expect(i18n.t("auth.taglineForgot")).toBe("ODZYSKAJ SWOJE KONTO");
    expect(i18n.t("auth.taglineReset")).toBe("USTAW NOWE HASŁO");
    expect(i18n.t("auth.or")).toBe("LUB");
    expect(i18n.t("auth.continueWithGoogle")).toBe("Kontynuuj z Google");
    expect(i18n.t("auth.minPassword")).toBe("Min. 6 znaków");
    expect(i18n.t("auth.errorUserAlreadyRegistered")).toBe("Użytkownik z tym adresem email jest już zarejestrowany.");

    // Onboarding
    expect(i18n.t("onboarding.actVeryActive")).toBe("Dwa razy dziennie / Sportowiec");
    expect(i18n.t("onboarding.howItWorksTitle")).toBe("Jak działa Kalori");
    expect(i18n.t("onboarding.doneSubtitle")).toBe("Twój spersonalizowany plan jest gotowy. Zacznijmy budować zdrowe nawyki.");
    expect(i18n.t("onboarding.startTracking")).toBe("ZACZNIJ ŚLEDZENIE");
    expect(i18n.t("onboarding.settingUp")).toBe("KONFIGUROWANIE...");

    // Home & Stats
    expect(i18n.t("home.calories")).toBe("Kalorie");
    expect(i18n.t("home.return")).toBe("WRÓĆ");
    expect(i18n.t("addMeal.optionsAlbum")).toBe("Wybierz z Galerii");
    expect(i18n.t("stats.goal")).toBe("Cel");

    // Shop Items
    expect(i18n.t("shop_items.avatars.initial.name")).toBe("Twój Piksel");
    expect(i18n.t("shop_items.avatars.dragon.name")).toBe("Smok");
    expect(i18n.t("shop_items.flames.orange.name")).toBe("Klasyczny Płomień");
    expect(i18n.t("shop_items.themes.1.name")).toBe("Domyślny Ciemny");
    expect(i18n.t("shop_items.upgrades.expanded_quests.name")).toBe("Dodatkowe Miejsca na Zadania");

    // Settings
    expect(i18n.t("settings.name")).toBe("Imię");
    expect(i18n.t("settings.age")).toBe("Wiek");
    expect(i18n.t("settings.typeDeleteToConfirm")).toBe("Wpisz DELETE, aby potwierdzić");

    // Quests & Rerolls
    expect(i18n.t("quests.rerollNeedCoins", { cost: 20 })).toBe("Potrzebujesz 20 monet, aby wylosować nowe zadanie!");
    expect(i18n.t("quests.rerolledSuccess", { name: "Zapisz śniadanie", cost: 20 })).toBe("Nowe zadanie: Zapisz śniadanie (-20 monet)");
    expect(i18n.t("quests.rerollFailed")).toBe("Nie udało się wylosować nowego zadania");

    // Meal errors
    expect(i18n.t("meal.failedAddMeal")).toBe("Nie udało się dodać posiłku");
    expect(i18n.t("meal.failedDeleteMeal")).toBe("Nie udało się usunąć posiłku");
    expect(i18n.t("meal.failedEditMeal")).toBe("Nie udało się edytować posiłku");
  });

  it("switches to Ukrainian and translates navigation keys correctly", async () => {
    await i18n.changeLanguage("uk");
    expect(i18n.t("nav.home")).toBe("ГОЛОВНА");
    expect(i18n.t("nav.settings")).toBe("НАЛАШТУВАННЯ");
    expect(i18n.t("nav.shop")).toBe("МАГАЗИН");
    expect(i18n.t("settings.language")).toBe("Мова");
  });

  it("translates onboarding steps in Ukrainian", async () => {
    await i18n.changeLanguage("uk");
    expect(i18n.t("onboarding.welcomeTitle")).toBe("Ласкаво просимо до");
    expect(i18n.t("onboarding.bodyTitle")).toBe("Параметри тіла");
    expect(i18n.t("onboarding.sexLabel")).toBe("Біологічна стать");
    expect(i18n.t("onboarding.goalLose")).toBe("Схуднути");
  });

  it("handles pluralization in English, Polish, and Ukrainian", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("common.day", { count: 1 })).toBe("1 day");
    expect(i18n.t("common.day", { count: 5 })).toBe("5 days");

    await i18n.changeLanguage("pl");
    expect(i18n.t("common.day", { count: 1 })).toBe("1 dzień");
    expect(i18n.t("common.day", { count: 2 })).toBe("2 dni");
    expect(i18n.t("common.day", { count: 5 })).toBe("5 dni");

    await i18n.changeLanguage("uk");
    expect(i18n.t("common.day", { count: 1 })).toBe("1 день");
    expect(i18n.t("common.day", { count: 2 })).toBe("2 дні");
    expect(i18n.t("common.day", { count: 5 })).toBe("5 днів");
    expect(i18n.t("common.coins_count", { count: 1 })).toBe("1 монета");
    expect(i18n.t("common.coins_count", { count: 3 })).toBe("3 монети");
    expect(i18n.t("common.coins_count", { count: 10 })).toBe("10 монет");
    expect(i18n.t("common.meal", { count: 1 })).toBe("1 прийом їжі");
    expect(i18n.t("common.meal", { count: 2 })).toBe("2 прийоми їжі");
    expect(i18n.t("common.meal", { count: 5 })).toBe("5 прийомів їжі");
    expect(i18n.t("notifs.streakDays", { count: 1 })).toBe("1 день!");
    expect(i18n.t("notifs.streakDays", { count: 4 })).toBe("4 дні!");
    expect(i18n.t("notifs.streakDays", { count: 7 })).toBe("7 днів!");
  });

  it("translates tutorial steps in Ukrainian", async () => {
    await i18n.changeLanguage("uk");
    expect(i18n.t("tutorial.calorieRingTitle")).toBe("Ваша денна ціль");
    expect(i18n.t("tutorial.skip")).toBe("Пропустити тур");
    expect(i18n.t("tutorial.done")).toBe("Готово!");
  });

  it("translates stats, achievements, quests, notifs, shop, privacy and terms in Ukrainian", async () => {
    await i18n.changeLanguage("uk");
    expect(i18n.t("stats.title")).toBe("Статистика");
    expect(i18n.t("stats.logWeight")).toBe("ДОДАТИ ВАГУ");
    expect(i18n.t("game.achievements")).toBe("Досягнення");
    expect(i18n.t("achievements_data.1.name")).toBe("Перший запис");
    expect(i18n.t("quests.activeQuests")).toBe("Активні завдання");
    expect(i18n.t("quests.questsLocked")).toBe("Завдання заблоковано");
    expect(i18n.t("quests.daily")).toBe("Щоденні");
    expect(i18n.t("quests_data.1.name")).toBe("Записати 3 страви сьогодні");
    expect(i18n.t("notifs.targetReached")).toBe("Ціль досягнуто");
    expect(i18n.t("shop.streakFlames")).toBe("Полум'я серії");
    expect(i18n.t("shop.streakShield")).toBe("Щит серії");
    expect(i18n.t("privacy.title")).toBe("Політика конфіденційності");
    expect(i18n.t("terms.title")).toBe("Умови використання");
  });

  it("translates home, meal, pro, insufficientCoins and settings in Ukrainian", async () => {
    await i18n.changeLanguage("uk");
    expect(i18n.t("home.todaysMeals")).toBe("Сьогоднішні страви");
    expect(i18n.t("home.addMeal")).toBe("ДОДАТИ СТРАВУ");
    expect(i18n.t("home.customWaterPlaceholder")).toBe("+ Своя");
    expect(i18n.t("meal.confirmMeal")).toBe("Підтвердити страву");
    expect(i18n.t("meal.fave")).toBe("УЛЮБЛЕНЕ");
    expect(i18n.t("meal.unfave")).toBe("ВИДАЛИТИ");
    expect(i18n.t("meal.editMeal")).toBe("Редагувати страву");
    expect(i18n.t("meal.deleteMeal")).toBe("Видалити страву");
    expect(i18n.t("pro.upgradeToPro")).toBe("Перейти на Kalori Pro");
    expect(i18n.t("pro.viewPro")).toBe("ПЕРЕГЛЯНУТИ PRO ›");
    expect(i18n.t("pro.heroTitle")).toBe("Виведіть своє харчування на новий рівень");
    expect(i18n.t("insufficientCoins.title", { count: 50 })).toBe("Потрібно 50 монет");
    expect(i18n.t("settings.kaloriPro")).toBe("Kalori Pro");
    expect(i18n.t("settings.proActive")).toBe("PRO Учасник · Високий ліміт AI");
    expect(i18n.t("settings.freePlanCoins")).toBe("Безкоштовний план · 50 за AI-сканування");
    expect(i18n.t("settings.profileSettings")).toBe("Налаштування профілю");
    expect(i18n.t("settings.goalsTargets")).toBe("Цілі калорій та БЖВ");
    expect(i18n.t("settings.bodyStats")).toBe("Параметри тіла");
    expect(i18n.t("settings.app")).toBe("Додаток");
    expect(i18n.t("settings.replayTutorial")).toBe("Повторити навчання");
    expect(i18n.t("settings.privacyPolicy")).toBe("Політика конфіденційності");
    expect(i18n.t("settings.termsOfService")).toBe("Умови використання");
  });

  it("translates newly added auth, onboarding, stats, shop items and settings keys in Ukrainian", async () => {
    await i18n.changeLanguage("uk");
    // Auth
    expect(i18n.t("auth.taglineLogin")).toBe("ВІДСТЕЖУЙТЕ · ЗДОБУВАЙТЕ РІВНІ · РОЗВИВАЙТЕСЯ");
    expect(i18n.t("auth.taglineSignup")).toBe("ПОЧНІТЬ СВІЙ ШЛЯХ");
    expect(i18n.t("auth.taglineForgot")).toBe("ВІДНОВІТЬ СВІЙ АКАУНТ");
    expect(i18n.t("auth.taglineReset")).toBe("ВСТАНОВІТЬ НОВИЙ ПАРОЛЬ");
    expect(i18n.t("auth.or")).toBe("АБО");
    expect(i18n.t("auth.continueWithGoogle")).toBe("Продовжити з Google");
    expect(i18n.t("auth.minPassword")).toBe("Мін. 6 символів");
    expect(i18n.t("auth.errorUserAlreadyRegistered")).toBe("Користувач із цією електронною адресою вже зареєстрований.");

    // Onboarding
    expect(i18n.t("onboarding.actVeryActive")).toBe("Двічі на день / Спортсмен");
    expect(i18n.t("onboarding.howItWorksTitle")).toBe("Як працює Kalori");
    expect(i18n.t("onboarding.doneSubtitle")).toBe("Ваш персональний план готовий. Давайте будувати здорові звички разом.");
    expect(i18n.t("onboarding.startTracking")).toBe("ПОЧАТИ ВІДСТЕЖЕННЯ");
    expect(i18n.t("onboarding.settingUp")).toBe("НАЛАШТУВАННЯ...");

    // Home & Stats
    expect(i18n.t("home.calories")).toBe("Калорії");
    expect(i18n.t("home.return")).toBe("ПОВЕРНУТИСЯ");
    expect(i18n.t("addMeal.optionsAlbum")).toBe("Галерея");
    expect(i18n.t("stats.goal")).toBe("Ціль");

    // Shop Items
    expect(i18n.t("shop_items.avatars.initial.name")).toBe("Твій Піксель");
    expect(i18n.t("shop_items.avatars.dragon.name")).toBe("Дракон");
    expect(i18n.t("shop_items.flames.orange.name")).toBe("Класичне полум'я");
    expect(i18n.t("shop_items.themes.1.name")).toBe("Стандартна темна");
    expect(i18n.t("shop_items.upgrades.expanded_quests.name")).toBe("Додаткові слоти завдань");

    // Settings
    expect(i18n.t("settings.name")).toBe("Ім'я");
    expect(i18n.t("settings.age")).toBe("Вік");
    expect(i18n.t("settings.typeDeleteToConfirm")).toBe("Введіть DELETE для підтвердження");

    // Quests & Rerolls
    expect(i18n.t("quests.rerollNeedCoins", { cost: 20 })).toBe("Потрібно 20 монет, щоб змінити завдання!");
    expect(i18n.t("quests.rerolledSuccess", { name: "Записати сніданок", cost: 20 })).toBe("Нове завдання: Записати сніданок (-20 монет)");
    expect(i18n.t("quests.rerollFailed")).toBe("Не вдалося змінити завдання");

    // Meal errors
    expect(i18n.t("meal.failedAddMeal")).toBe("Не вдалося додати страву");
    expect(i18n.t("meal.failedDeleteMeal")).toBe("Не вдалося видалити страву");
    expect(i18n.t("meal.failedEditMeal")).toBe("Не вдалося відредагувати страву");
  });

  it("falls back to English for missing keys in unsupported languages", async () => {
    await i18n.changeLanguage("de");
    expect(i18n.t("nav.home")).toBe("HOME");
  });
});
