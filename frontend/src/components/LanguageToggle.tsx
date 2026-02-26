import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { haptics } from '../utils/haptics';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggle = () => {
    haptics.select();
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      className="flex items-center gap-1.5 font-semibold text-sm border-primary/30 hover:border-primary hover:bg-primary/5 rounded-full px-3 h-8"
      title={language === 'en' ? 'Switch to Telugu' : 'Switch to English'}
    >
      <Languages className="w-3.5 h-3.5 text-primary" />
      <span className="text-primary">{language === 'en' ? 'EN' : 'తె'}</span>
      <span className="text-muted-foreground text-xs">|</span>
      <span className="text-muted-foreground text-xs">{language === 'en' ? 'తె' : 'EN'}</span>
    </Button>
  );
}
