import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {},
  fallbackLng: null,
  debug: false,

  ns: ['translation'],
  defaultNS: 'translation',

  nsSeparator: false,
  keySeparator: false,

  interpolation: {
    escapeValue: false,
    prefix: '#',
    suffix: '#',
  },
});

export default i18n;
