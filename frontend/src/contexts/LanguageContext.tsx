import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'te';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('appLanguage');
    return (saved === 'te' ? 'te' : 'en') as Language;
  });

  const toggleLanguage = () => {
    setLanguageState(prev => {
      const next = prev === 'en' ? 'te' : 'en';
      localStorage.setItem('appLanguage', next);
      return next;
    });
  };

  const setLanguage = (lang: Language) => {
    localStorage.setItem('appLanguage', lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
