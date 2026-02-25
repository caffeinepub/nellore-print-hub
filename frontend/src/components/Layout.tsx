import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetCompanyLogo } from '../hooks/useCompanyLogo';
import BottomNav from './BottomNav';
import ChatWidget from './ChatWidget';
import LanguageToggle from './LanguageToggle';
import ShareAppButton from './ShareAppButton';
import { SiWhatsapp } from 'react-icons/si';
import { PhoneCall, ShieldCheck } from 'lucide-react';
import { useGetContactInfo } from '../hooks/useContactInfo';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAdmin';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: logoBlob } = useGetCompanyLogo();
  const { data: contactInfo } = useGetContactInfo();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const [chatOpen, setChatOpen] = useState(false);

  const logoUrl = logoBlob ? logoBlob.getDirectURL() : null;
  const phone = contactInfo?.phone ?? '+919390535070';
  const phoneDigits = phone.replace(/\D/g, '');

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleAdminIconClick = () => {
    if (identity && isAdmin) {
      navigate({ to: '/admin/dashboard' });
    } else {
      navigate({ to: '/admin/login' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">M</span>
                </div>
                <span className="font-bold text-foreground text-sm">
                  {language === 'te' ? 'మేజిక్ హబ్' : 'Magic Hub'}
                </span>
              </div>
            )}
          </Link>
          <div className="flex items-center gap-1">
            <ShareAppButton />
            <LanguageToggle />
            {/* Admin Icon */}
            <button
              onClick={handleAdminIconClick}
              aria-label="Admin Access"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                identity && isAdmin
                  ? 'text-primary bg-primary/10 hover:bg-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={
                identity && isAdmin
                  ? (language === 'te' ? 'అడ్మిన్ డాష్‌బోర్డ్' : 'Admin Dashboard')
                  : (language === 'te' ? 'అడ్మిన్ లాగిన్' : 'Admin Login')
              }
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {!isAdminRoute && (
        <footer className="bg-card border-t border-border px-4 py-6 pb-28 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Magic Hub Nellore.{' '}
            {language === 'te' ? 'అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built with{' '}
            <span className="text-red-500">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'magic-hub-nellore')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      )}

      {/* Floating WhatsApp & Call Buttons */}
      {!isAdminRoute && (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-colors"
            aria-label="Chat on WhatsApp"
          >
            <SiWhatsapp className="w-6 h-6" />
          </a>
          <a
            href={`tel:${phone}`}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transition-colors"
            aria-label="Call Us"
          >
            <PhoneCall className="w-5 h-5" />
          </a>
        </div>
      )}

      <BottomNav onChatOpen={() => setChatOpen(true)} />

      {/* Chat Widget — only mount when open */}
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
    </div>
  );
}
