import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useSaveCallerUserProfile } from '../hooks/useUserProfile';
import { toast } from 'sonner';
import { hapticFeedback } from '../utils/haptics';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileSetupProps {
  open: boolean;
  onComplete: () => void;
}

export default function ProfileSetup({ open, onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; mobile?: string }>({});
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();
  const { t } = useLanguage();

  const validate = () => {
    const newErrors: { name?: string; email?: string; mobile?: string } = {};
    if (!name.trim()) newErrors.name = t('profile.errorName');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = t('profile.errorEmail');
    if (!mobile.trim()) newErrors.mobile = t('profile.errorMobile');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      hapticFeedback('error');
      return;
    }
    try {
      await saveProfile({ name: name.trim(), email: email.trim(), mobileNumber: mobile.trim() });
      hapticFeedback('success');
      toast.success('Profile saved!');
      onComplete();
    } catch {
      hapticFeedback('error');
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('profile.title')}</DialogTitle>
          <DialogDescription>{t('profile.subtitle')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">{t('profile.name')}</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profile.namePlaceholder')}
              className="h-12"
              autoComplete="name"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-email">{t('profile.email')}</Label>
            <Input
              id="profile-email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('profile.emailPlaceholder')}
              className="h-12"
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-mobile">{t('profile.mobile')}</Label>
            <Input
              id="profile-mobile"
              type="tel"
              inputMode="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t('profile.mobilePlaceholder')}
              className="h-12"
              autoComplete="tel"
            />
            {errors.mobile && <p className="text-xs text-destructive">{errors.mobile}</p>}
          </div>
          <Button type="submit" className="w-full h-12" disabled={isPending}>
            {isPending ? t('profile.saving') : t('profile.save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
