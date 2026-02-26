import React from 'react';
import { Share2 } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { Button } from '@/components/ui/button';

interface ShareAppButtonProps {
  className?: string;
  label?: string;
}

export default function ShareAppButton({ className, label }: ShareAppButtonProps) {
  const handleShare = async () => {
    haptics.tap();
    const shareData = {
      title: 'Nellore Printing Hub',
      text: 'Check out Nellore Printing Hub — Premium quality printing services in Nellore! Sponsored by Magic Advertising.',
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      // User cancelled or error
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className={className}
    >
      <Share2 className="w-4 h-4 mr-2" />
      {label || 'Share'}
    </Button>
  );
}
