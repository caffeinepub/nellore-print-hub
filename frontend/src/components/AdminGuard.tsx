import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '@/hooks/useAdmin';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useAdminExists } from '@/hooks/useAdminExists';
import { Loader2, ShieldAlert, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched } = useIsCallerAdmin();
  const { adminExists, isLoading: adminExistsLoading } = useAdminExists();

  const isAuthenticated = !!identity;
  const isLoading = isInitializing || isCheckingAdmin || adminExistsLoading;

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and is an admin, show the protected content
  if (isAuthenticated && isAdmin && isFetched) {
    return <>{children}</>;
  }

  // If no admins exist and user is authenticated, show registration prompt
  if (isAuthenticated && !adminExists && isFetched) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Register as First Admin</CardTitle>
            <CardDescription>
              No admin accounts exist yet. Go to the admin login page to register as the first
              administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => navigate({ to: '/admin/login' })} className="w-full">
              Go to Admin Setup
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated but not admin, show access denied
  if (isAuthenticated && isFetched && !isAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access this area. Only administrators can view this
              page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => navigate({ to: '/admin/login' })} className="w-full">
              Go to Admin Login
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You must be logged in to access this area.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => navigate({ to: '/admin/login' })} className="w-full">
              Go to Admin Login
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
