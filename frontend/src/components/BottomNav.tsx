import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, Briefcase, Image, Star, Phone, MessageCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../translations';

interface BottomNavProps {
  onChatOpen: () => void;
}

export default function BottomNav({ onChatOpen }: BottomNavProps) {
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { language } = useLanguage();
  const t = getTranslations(language);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: t.nav.home, icon: Home, locked: false },
    { path: '/services', label: t.nav.services, icon: Briefcase, locked: false },
    { path: '/gallery', label: t.nav.gallery, icon: Image, locked: false },
    { path: '/reviews', label: t.nav.reviews, icon: Star, locked: !identity },
    { path: '/contact', label: t.nav.contact, icon: Phone, locked: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, label, icon: Icon, locked }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
              isActive(path)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {locked && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-medium leading-tight">{label}</span>
          </Link>
        ))}
        <button
          onClick={onChatOpen}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium leading-tight">{t.nav.chat}</span>
        </button>
      </div>
    </nav>
  );
}
