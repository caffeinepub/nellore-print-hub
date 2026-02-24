import { Link, useLocation } from '@tanstack/react-router';
import { Home, Briefcase, Image, MessageSquare, Star } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface BottomNavProps {
  onChatOpen: () => void;
}

export default function BottomNav({ onChatOpen }: BottomNavProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    haptics.tap();
  };

  const handleChatClick = () => {
    haptics.tap();
    onChatOpen();
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'Reviews', path: '/testimonials', icon: Star },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
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
            <item.icon className={`w-6 h-6 mb-1 ${isActive(item.path) ? 'fill-primary/20' : ''}`} />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
        <button
          onClick={handleChatClick}
          className="flex flex-col items-center justify-center flex-1 h-full min-w-[44px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Chat</span>
        </button>
      </div>
    </nav>
  );
}
