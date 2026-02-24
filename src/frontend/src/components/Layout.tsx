import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Printer, ShieldCheck } from 'lucide-react';
import LoginButton from './LoginButton';
import ChatWidget from './ChatWidget';
import BottomNav from './BottomNav';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import { useGetCompanyLogo } from '../hooks/useCompanyLogo';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: logo } = useGetCompanyLogo();

  const isAdminPage = location.pathname.startsWith('/admin');
  const showBottomNav = !isAdminPage;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Compact Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            {logo ? (
              <img
                src={logo.getDirectURL()}
                alt="Company Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Printer className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm leading-none">Nellore Print Hub</span>
            </div>
          </Link>

          {isAdminPage && <LoginButton />}
        </div>
      </header>

      {/* Main Content with bottom padding for nav and admin button */}
      <main className={`flex-1 ${showBottomNav ? 'pb-28' : ''}`}>{children}</main>

      {/* Admin Login Button - visible on mobile above bottom nav */}
      {showBottomNav && (
        <div className="fixed bottom-16 left-0 right-0 z-30 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container px-4 py-3">
            <Link
              to="/admin/login"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-500 font-medium transition-colors border border-amber-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Login
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Navigation - only on customer pages */}
      {showBottomNav && <BottomNav onChatOpen={() => setChatOpen(true)} />}

      {/* Full-screen Chat Modal */}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Footer - hidden on mobile when bottom nav is shown */}
      <footer className={`border-t bg-muted/30 ${showBottomNav ? 'hidden md:block' : ''}`}>
        <div className="container py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {logo ? (
                  <img
                    src={logo.getDirectURL()}
                    alt="Company Logo"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                    <Printer className="w-5 h-5" />
                  </div>
                )}
                <span className="font-display font-bold">Nellore Print Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Quality printing and design solutions for your brand.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/services" className="hover:text-foreground transition-colors">Digital Printing</Link></li>
                <li><Link to="/services" className="hover:text-foreground transition-colors">Flex & Banners</Link></li>
                <li><Link to="/services" className="hover:text-foreground transition-colors">Offset Printing</Link></li>
                <li><Link to="/services" className="hover:text-foreground transition-colors">Design Services</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/gallery" className="hover:text-foreground transition-colors">Portfolio</Link></li>
                <li><Link to="/testimonials" className="hover:text-foreground transition-colors">Testimonials</Link></li>
                <li><Link to="/delivery" className="hover:text-foreground transition-colors">Delivery Info</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Get Started</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/request-quote" className="hover:text-foreground transition-colors">Request Quote</Link></li>
                <li><Link to="/submit-review" className="hover:text-foreground transition-colors">Leave Review</Link></li>
                <li>
                  <Link 
                    to="/admin/login" 
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors text-amber-600 dark:text-amber-500 font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Nellore Print Hub. Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'nellore-print-hub'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
