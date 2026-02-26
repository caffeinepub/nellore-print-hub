import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from '@tanstack/react-router';
import {
  Printer,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  Heart,
  ChevronUp,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import LanguageToggle from './LanguageToggle';
import BottomNav from './BottomNav';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetCompanyLogo } from '../hooks/useCompanyLogo';
import { useGetContactInfo } from '../hooks/useContactInfo';
import { useGetAppName } from '../hooks/useAppName';
import ShareAppButton from './ShareAppButton';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { t } = useLanguage();
  const { data: logoBlob } = useGetCompanyLogo();
  const { data: contactInfo } = useGetContactInfo();
  const { data: appName } = useGetAppName();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const displayName = appName || 'Nellore Print Hub';
  const logoUrl = logoBlob ? logoBlob.getDirectURL() : null;

  React.useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { path: '/', label: t('home') || 'Home' },
    { path: '/services', label: t('services') || 'Services' },
    { path: '/gallery', label: t('gallery') || 'Gallery' },
    { path: '/testimonials', label: t('testimonials') || 'Reviews' },
    { path: '/about', label: t('about') || 'About' },
    { path: '/contact', label: t('contact') || 'Contact' },
  ];

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate({ to: '/admin/dashboard' });
    } else {
      navigate({ to: '/admin/login' });
    }
  };

  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'nellore-print-hub');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[oklch(0.20_0.07_205)] text-white shadow-press border-b border-[oklch(0.28_0.07_205)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={displayName}
                  className="h-9 w-auto max-w-[120px] rounded object-contain bg-white/10 p-0.5"
                />
              ) : (
                <div className="h-9 w-9 rounded bg-[oklch(0.68_0.18_72)] flex items-center justify-center shadow-gold">
                  <Printer className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="hidden sm:block">
                <span className="font-heading text-lg font-bold tracking-tight text-white leading-none">
                  {displayName}
                </span>
                <div className="text-[10px] text-[oklch(0.78_0.18_78)] uppercase tracking-widest font-sans flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Powered by Magic Advertising
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path as any}
                    className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                      isActive
                        ? 'bg-[oklch(0.68_0.18_72)] text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ShareAppButton />
              <button
                onClick={handleAdminClick}
                className="p-2 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title={isAdmin ? 'Admin Dashboard' : 'Admin Login'}
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[oklch(0.15_0.06_210)]">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path as any}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                      isActive
                        ? 'bg-[oklch(0.68_0.18_72)] text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Footer - Desktop */}
      <footer className="bg-[oklch(0.13_0.05_210)] text-white border-t border-[oklch(0.22_0.06_210)] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={displayName}
                    className="h-10 w-auto max-w-[130px] rounded object-contain bg-white/10 p-0.5"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-[oklch(0.68_0.18_72)] flex items-center justify-center">
                    <Printer className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <div className="font-heading text-base font-bold text-white">{displayName}</div>
                  <div className="text-[10px] text-[oklch(0.78_0.18_78)] uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Powered by Magic Advertising
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {t('footerTagline') || 'Your trusted partner for high-quality printing solutions in Nellore.'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                {t('quickLinks') || 'Quick Links'}
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path as any}
                      className="text-sm text-white/60 hover:text-[oklch(0.78_0.18_78)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                {t('contact') || 'Contact Us'}
              </h4>
              <ul className="space-y-3">
                {contactInfo?.phone && (
                  <li className="flex items-center gap-2 text-sm text-white/60">
                    <Phone className="w-4 h-4 text-[oklch(0.78_0.18_78)] shrink-0" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                      {contactInfo.phone}
                    </a>
                  </li>
                )}
                {contactInfo?.email && (
                  <li className="flex items-center gap-2 text-sm text-white/60">
                    <Mail className="w-4 h-4 text-[oklch(0.78_0.18_78)] shrink-0" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                      {contactInfo.email}
                    </a>
                  </li>
                )}
                {contactInfo?.physicalAddress && (
                  <li className="flex items-start gap-2 text-sm text-white/60">
                    <MapPin className="w-4 h-4 text-[oklch(0.78_0.18_78)] shrink-0 mt-0.5" />
                    <span>{contactInfo.physicalAddress}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              © {currentYear} {displayName}. {t('allRightsReserved') || 'All rights reserved.'}
            </p>
            <div className="flex items-center gap-4">
              {/* Admin Login link - discreet */}
              <Link
                to="/admin/login"
                className="flex items-center gap-1 text-xs text-white/25 hover:text-white/50 transition-colors"
                title="Admin Login"
              >
                <Lock className="w-3 h-3" />
                Admin
              </Link>
              <p className="text-xs text-white/40 flex items-center gap-1">
                Built with{' '}
                <Heart className="w-3 h-3 text-[oklch(0.78_0.18_78)] fill-current" />{' '}
                using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.78_0.18_78)] hover:text-[oklch(0.88_0.16_78)] transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer (minimal) */}
      <footer className="lg:hidden bg-[oklch(0.13_0.05_210)] text-white border-t border-[oklch(0.22_0.06_210)] pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={displayName}
                  className="h-8 w-auto max-w-[100px] rounded object-contain bg-white/10 p-0.5"
                />
              ) : (
                <div className="h-8 w-8 rounded bg-[oklch(0.68_0.18_72)] flex items-center justify-center">
                  <Printer className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="text-left">
                <div className="font-heading text-sm font-bold text-white">{displayName}</div>
                <div className="text-[9px] text-[oklch(0.78_0.18_78)] uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-2 h-2" />
                  Magic Advertising
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              {contactInfo?.phone && (
                <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
                  <Phone className="w-3 h-3" />
                  {contactInfo.phone}
                </a>
              )}
              {contactInfo?.email && (
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
                  <Mail className="w-3 h-3" />
                  {contactInfo.email}
                </a>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Admin Login link - discreet */}
              <Link
                to="/admin/login"
                className="flex items-center gap-1 text-xs text-white/25 hover:text-white/50 transition-colors"
                title="Admin Login"
              >
                <Lock className="w-3 h-3" />
                Admin
              </Link>
              <p className="text-xs text-white/40 flex items-center gap-1">
                Built with <Heart className="w-3 h-3 text-[oklch(0.78_0.18_78)] fill-current" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.78_0.18_78)] hover:text-[oklch(0.88_0.16_78)] transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>

            <p className="text-xs text-white/30">
              © {currentYear} {displayName}
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 lg:bottom-8 z-40 w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-all"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
