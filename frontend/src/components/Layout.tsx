import React from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import BottomNav from './BottomNav';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Printer, Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const navLinks = [
    { label: t('home'), path: '/' },
    { label: t('services'), path: '/services' },
    { label: t('gallery'), path: '/gallery' },
    { label: t('testimonials'), path: '/testimonials' },
    { label: t('contact'), path: '/contact' },
    { label: t('about'), path: '/about' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Printer className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-lg text-foreground leading-tight block">
                Nellore Printing Hub
              </span>
              <span className="text-xs text-muted-foreground leading-tight block">
                by Magic Advertising
              </span>
            </div>
            <span className="sm:hidden font-bold text-base text-foreground">NPH</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate({ to: link.path as any })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Toggle - always visible */}
            <LanguageToggle />

            {/* Admin icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: identity ? '/admin/dashboard' : '/admin/login' })}
              className="text-muted-foreground hover:text-primary"
              title="Admin"
            >
              <ShieldCheck className="w-5 h-5" />
            </Button>

            {/* Get Quote CTA - desktop only */}
            <Button
              size="sm"
              className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-4"
              onClick={() => navigate({ to: '/request-quote' })}
            >
              {t('getQuote')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4 hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <Printer className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-extrabold text-lg block">Nellore Printing Hub</span>
                  <span className="text-xs text-background/60 block">by Magic Advertising</span>
                </div>
              </div>
              <p className="text-background/70 text-sm leading-relaxed max-w-xs">
                {t('footerTagline')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3 text-background/90">{t('quickLinks')}</h4>
              <ul className="space-y-2">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate({ to: link.path as any })}
                      className="text-background/60 hover:text-background text-sm transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-3 text-background/90">{t('contact')}</h4>
              <ul className="space-y-2 text-sm text-background/60">
                <li>📞 +91 93905 35070</li>
                <li>✉️ magic.nellorehub@gmail.com</li>
                <li>📍 Dargamitta, Nellore</li>
              </ul>
            </div>
          </div>

          {/* Sponsor Badge */}
          <div className="border-t border-background/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/magic-advertising-badge.dim_320x64.png"
                alt="Sponsored by Magic Advertising"
                className="h-10 object-contain opacity-80"
              />
            </div>

            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-background/50 text-xs">
                © {new Date().getFullYear()} Nellore Printing Hub. {t('allRightsReserved')}.
              </p>
              <p className="text-background/40 text-xs flex items-center gap-1">
                Built with <Heart className="w-3 h-3 fill-red-400 text-red-400" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-background/70"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer (minimal) */}
      <div className="lg:hidden bg-foreground/95 text-background py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="/assets/generated/magic-advertising-badge.dim_320x64.png"
            alt="Sponsored by Magic Advertising"
            className="h-7 object-contain opacity-80"
          />
        </div>
        <p className="text-background/40 text-xs flex items-center justify-center gap-1">
          Built with <Heart className="w-3 h-3 fill-red-400 text-red-400" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      {/* Bottom Navigation (mobile) */}
      <BottomNav />
    </div>
  );
}
