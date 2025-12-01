import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enLanding from './locales/en/landing.json';
import enAuth from './locales/en/auth.json';
import enQuiz from './locales/en/quiz.json';
import enQuestions from './locales/en/questions.json';
import enDashboard from './locales/en/dashboard.json';

import esCommon from './locales/es/common.json';
import esLanding from './locales/es/landing.json';
import esAuth from './locales/es/auth.json';
import esQuiz from './locales/es/quiz.json';
import esQuestions from './locales/es/questions.json';
import esDashboard from './locales/es/dashboard.json';

import zhCommon from './locales/zh-CN/common.json';
import zhLanding from './locales/zh-CN/landing.json';
import zhAuth from './locales/zh-CN/auth.json';
import zhQuiz from './locales/zh-CN/quiz.json';
import zhQuestions from './locales/zh-CN/questions.json';
import zhDashboard from './locales/zh-CN/dashboard.json';

import frCommon from './locales/fr/common.json';
import frLanding from './locales/fr/landing.json';
import frAuth from './locales/fr/auth.json';
import frQuiz from './locales/fr/quiz.json';
import frQuestions from './locales/fr/questions.json';
import frDashboard from './locales/fr/dashboard.json';

import ptCommon from './locales/pt/common.json';
import ptLanding from './locales/pt/landing.json';
import ptAuth from './locales/pt/auth.json';
import ptQuiz from './locales/pt/quiz.json';
import ptQuestions from './locales/pt/questions.json';
import ptDashboard from './locales/pt/dashboard.json';

const resources = {
  en: {
    common: enCommon,
    landing: enLanding,
    auth: enAuth,
    quiz: enQuiz,
    questions: enQuestions,
    dashboard: enDashboard,
  },
  es: {
    common: esCommon,
    landing: esLanding,
    auth: esAuth,
    quiz: esQuiz,
    questions: esQuestions,
    dashboard: esDashboard,
  },
  'zh-CN': {
    common: zhCommon,
    landing: zhLanding,
    auth: zhAuth,
    quiz: zhQuiz,
    questions: zhQuestions,
    dashboard: zhDashboard,
  },
  fr: {
    common: frCommon,
    landing: frLanding,
    auth: frAuth,
    quiz: frQuiz,
    questions: frQuestions,
    dashboard: frDashboard,
  },
  pt: {
    common: ptCommon,
    landing: ptLanding,
    auth: ptAuth,
    quiz: ptQuiz,
    questions: ptQuestions,
    dashboard: ptDashboard,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'landing', 'auth', 'quiz', 'questions', 'dashboard'],
    
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
    
    debug: false,
  });

export default i18n;
