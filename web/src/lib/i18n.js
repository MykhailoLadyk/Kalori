import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en.json";
import pl from "../locales/pl.json";
import uk from "../locales/uk.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pl: { translation: pl },
      uk: { translation: uk },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "pl", "uk"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "kalori_lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
