import { Link, useLocation } from '@tanstack/react-router';
import { Menu, Printer, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';
import ChatWidget from './ChatWidget';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import { useGetCompanyLogo } from '../hooks/useCompanyLogo';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: logo } = useGetCompanyLogo();

  const isAuthenticated = !!identity;

  // Determine if we should show login button (only on admin pages)
  const isAdminPage = location.pathname.startsWith('/admin');
  const showLoginButton = isAdminPage;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Delivery', href: '/delivery' },
  ];

  const customerNavigation = [
    { name: 'My Quotations', href: '/my-quotations' },
  ];

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Quotations', href: '/admin/quotations' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Logo', href: '/admin/logo' },
    { name: 'Chats', href: '/admin/chats' },
    { name: 'Users', href: '/admin/users' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {logo ? (
              <img
                src={logo.getDirectURL()}
                alt="Company Logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Printer className="w-6 h-6" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none">Nellore Print Hub</span>
              <span className="text-xs text-muted-foreground">Magic Advertising</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated && !isAdmin && customerNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <Link to="/request-quote" className="hidden sm:block">
              <Button size="sm" className="font-semibold">
                Get Quote
              </Button>
            </Link>
            {showLoginButton && <LoginButton />}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 text-base font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground/80 hover:bg-accent/50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAuthenticated && !isAdmin && customerNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 text-base font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground/80 hover:bg-accent/50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAdmin && adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 text-base font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground/80 hover:bg-accent/50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link to="/request-quote" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full font-semibold">Get Quote</Button>
                  </Link>
                  {showLoginButton && (
                    <div className="pt-4 border-t">
                      <LoginButton />
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Chat Widget - visible on all pages */}
      <ChatWidget />

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
