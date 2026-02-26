import en from './en';
import te from './te';

export { en, te };

export function getTranslations(language: 'en' | 'te'): Record<string, string> {
  return language === 'te' ? te : en;
}
