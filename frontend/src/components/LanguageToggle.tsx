import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { haptics } from '../utils/haptics';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  const handleToggle = () => {
    haptics.select();
    toggleLanguage();
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-sm font-semibold text-foreground min-w-[48px] justify-center"
      aria-label={language === 'en' ? 'Switch to Telugu' : 'Switch to English'}
      title={language === 'en' ? 'Switch to Telugu' : 'Switch to English'}
    >
      {language === 'en' ? 'EN' : 'తె'}
    </button>
  );
}
