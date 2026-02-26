import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import { useAdminExists } from '../hooks/useAdminExists';
import { useActor } from '../hooks/useActor';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  // useIsCallerAdmin spreads query result — data is the boolean, not isAdmin
  const { data: isAdmin, isLoading: adminLoading, isFetched: adminStatusFetched } = useIsCallerAdmin();
  const { adminExists, isLoading: adminExistsLoading, isFetched: adminExistsFetched } = useAdminExists();

  // Check for email/password or biometric session stored at login time
  const [emailSessionValid, setEmailSessionValid] = useState<boolean | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem('adminEmailSession');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const now = Date.now();
        // Session valid for 8 hours
        if (parsed.timestamp && now - parsed.timestamp < 8 * 60 * 60 * 1000) {
          setEmailSessionValid(true);
          return;
        } else {
          sessionStorage.removeItem('adminEmailSession');
        }
      } catch {
        sessionStorage.removeItem('adminEmailSession');
      }
    }
    setEmailSessionValid(false);
  }, []);

  const isIIAuthenticated = !!identity;

  const isLoading =
    isInitializing ||
    actorFetching ||
    adminExistsLoading ||
    !adminExistsFetched ||
    emailSessionValid === null;

  // If email/password session is valid, allow access immediately
  if (emailSessionValid === true) {
    return <>{children}</>;
  }

  // Still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // No admin exists yet — show setup prompt
  if (!adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Admin Setup Required</h2>
          <p className="text-muted-foreground">
            No admin account has been configured yet. Please set up the first admin account.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate({ to: '/admin/setup' })}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Go to Admin Setup
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="w-full px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin exists but user is not authenticated via Internet Identity
  if (!isIIAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please log in to access the admin dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate({ to: '/admin/login' })}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Go to Admin Login
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="w-full px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // II authenticated — wait for admin status check
  if (!adminStatusFetched || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  // II authenticated but not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">
            Your account does not have admin privileges.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate({ to: '/admin/login' })}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Try Different Account
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="w-full px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All checks passed — render protected content
  return <>{children}</>;
}
