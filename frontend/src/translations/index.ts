import { en } from './en';
import { te } from './te';
import type { Translations } from './en';

export type { Translations };
export { en, te };

export function getTranslations(language: 'en' | 'te'): Translations {
  return language === 'te' ? te : en;
}
