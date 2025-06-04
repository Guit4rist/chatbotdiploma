import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to the ChatBot!',
          login: 'Login',
          logout: 'Logout',
          chat: 'Chat',
          profile: 'Profile',
          settings: 'Settings',
        },
      },
      kk: {
        translation: {
          welcome: 'ЧатБотқа қош келдіңіз!',
          login: 'Кіру',
          logout: 'Шығу',
          chat: 'Сөйлесу',
          profile: 'Профиль',
          settings: 'Параметрлер',
        },
      },
      ru: {
        translation: {
          welcome: 'Добро пожаловать в ЧатБот!',
          login: 'Вход',
          logout: 'Выход',
          chat: 'Чат',
          profile: 'Профиль',
          settings: 'Настройки',
        },
      },
    },
  });

export default i18n;
