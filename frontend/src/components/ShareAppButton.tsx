import React from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../translations';
import { haptics } from '../utils/haptics';

export default function ShareAppButton({ className = '' }: { className?: string }) {
  const { language } = useLanguage();
  const t = getTranslations(language);

  const handleShare = async () => {
    haptics.tap();
    const shareData = {
      title: 'Nellore Print Hub',
      text: 'Check out Nellore Print Hub - Your trusted printing partner!',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success(t.common.shareSuccess);
      } catch {
        // User cancelled or error — no toast needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success(t.common.linkCopied);
      } catch {
        toast.error('Could not copy link.');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-sm font-medium text-foreground ${className}`}
      aria-label={t.common.shareApp}
      title={t.common.shareApp}
    >
      <Share2 className="w-4 h-4" />
      <span className="hidden sm:inline">{t.common.shareApp}</span>
    </button>
  );
}
