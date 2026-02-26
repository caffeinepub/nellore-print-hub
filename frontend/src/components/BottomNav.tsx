import React from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, Briefcase, Image, Star, Phone, MessageCircle } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const tabs = [
    { icon: Home, label: t('home'), path: '/' },
    { icon: Briefcase, label: t('services'), path: '/services' },
    { icon: Image, label: t('gallery'), path: '/gallery' },
    { icon: Star, label: t('testimonials'), path: '/testimonials' },
    { icon: Phone, label: t('contact'), path: '/contact' },
    { icon: MessageCircle, label: t('chat'), path: '/chat' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate({ to: tab.path as any })}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors min-h-[56px] ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              <span className={`text-[10px] font-medium leading-tight ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
