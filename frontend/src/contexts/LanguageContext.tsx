import React, { createContext, useContext, useState } from 'react';
import en from '../translations/en';
import te from '../translations/te';

type Language = 'en' | 'te';

const translations = { en, te };

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('appLanguage');
    return (saved === 'te' ? 'te' : 'en') as Language;
  });

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'te' : 'en';
      localStorage.setItem('appLanguage', next);
      return next;
    });
  };

  const setLanguage = (lang: Language) => {
    localStorage.setItem('appLanguage', lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    return dict[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
