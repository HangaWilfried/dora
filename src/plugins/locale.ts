import { createI18n } from 'vue-i18n'

const getBrowserLanguage = () => {
  const language = navigator.language.split('-')[0];
  return language === "fr" ? language : "en";
}

export const i18n = createI18n({
  legacy: false,
  fallbackLocale: "en",
  locale: getBrowserLanguage(),
})
