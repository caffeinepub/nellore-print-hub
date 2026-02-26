import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { haptics } from '../utils/haptics';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const handleToggle = () => {
    haptics.tap();
    const next = language === 'en' ? 'te' : 'en';
    setLanguage(next);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={`Switch to ${language === 'en' ? 'Telugu' : 'English'}`}
      className="relative inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm font-medium select-none"
    >
      <span
        className={`transition-all duration-200 ${
          language === 'en'
            ? 'text-primary font-bold'
            : 'text-muted-foreground'
        }`}
      >
        EN
      </span>
      <span className="text-muted-foreground/50 text-xs">|</span>
      <span
        className={`transition-all duration-200 ${
          language === 'te'
            ? 'text-primary font-bold'
            : 'text-muted-foreground'
        }`}
      >
        తె
      </span>
    </button>
  );
}
