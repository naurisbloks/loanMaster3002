import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "../locales/en/translation.json";
import lvTranslation from "../locales/lv/translation.json";
import ltTranslation from "../locales/lt/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  lv: {
    translation: lvTranslation,
  },
  lt: {
    translation: ltTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      lookupCookie: 'i18next',
      caches: ['cookie'],
      cookieMinutes: 43200, // 30 days
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;