import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { isAdminSessionValid } from '@/utils/sessionStorage';
import { useAdminExists } from '@/hooks/useAdminExists';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const { adminExists, isLoading: checkingAdmin, isFetched } = useAdminExists();

  // Synchronously check session on mount
  useEffect(() => {
    const valid = isAdminSessionValid();
    setHasSession(valid);
    setSessionChecked(true);
  }, []);

  // Once we know session status and admin existence, redirect if needed
  useEffect(() => {
    if (!sessionChecked) return;

    // If session is valid, allow access
    if (hasSession) return;

    // Wait for admin check to complete
    if (!isFetched) return;

    if (!adminExists) {
      navigate({ to: '/admin/register' });
    } else {
      navigate({ to: '/admin/login' });
    }
  }, [sessionChecked, hasSession, isFetched, adminExists, navigate]);

  // Show loading while checking
  if (!sessionChecked || (!hasSession && (checkingAdmin || !isFetched))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If no session, don't render children (redirect is in progress)
  if (!hasSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
