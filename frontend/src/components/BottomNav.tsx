import { Link, useLocation } from '@tanstack/react-router';
import { Home, Briefcase, Image, MessageSquare, Star, Lock, Mail } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface BottomNavProps {
  onChatOpen: () => void;
}

export default function BottomNav({ onChatOpen }: BottomNavProps) {
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    haptics.tap();
  };

  const handleRestrictedClick = (e: React.MouseEvent, itemName: string) => {
    e.preventDefault();
    haptics.error();
    toast.error(`Sign in to access ${itemName}`);
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      haptics.error();
      toast.error('Sign in to start a conversation');
      return;
    }
    haptics.tap();
    onChatOpen();
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home, restricted: false },
    { name: 'Services', path: '/services', icon: Briefcase, restricted: false },
    { name: 'Gallery', path: '/gallery', icon: Image, restricted: true },
    { name: 'Reviews', path: '/testimonials', icon: Star, restricted: true },
    { name: 'Contact', path: '/contact', icon: Mail, restricted: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isRestricted = item.restricted && !isAuthenticated;

          if (isRestricted) {
            return (
              <button
                key={item.path}
                onClick={(e) => handleRestrictedClick(e, item.name)}
                className="flex flex-col items-center justify-center flex-1 h-full min-w-[44px] text-muted-foreground/50 transition-colors relative"
              >
                <div className="relative">
                  <item.icon className="w-5 h-5 mb-1" />
                  <Lock className="w-3 h-3 absolute -top-1 -right-1 text-muted-foreground/70" />
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[44px] transition-colors ${
                isActive(item.path)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActive(item.path) ? 'fill-primary/20' : ''}`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={handleChatClick}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-[44px] transition-colors relative ${
            isAuthenticated ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground/50'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 mb-1" />
            {!isAuthenticated && <Lock className="w-3 h-3 absolute -top-1 -right-1 text-muted-foreground/70" />}
          </div>
          <span className="text-xs font-medium">Chat</span>
        </button>
      </div>
    </nav>
  );
}
