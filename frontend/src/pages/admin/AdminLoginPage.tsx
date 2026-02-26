import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminExists } from '@/hooks/useAdminExists';
import { setAdminSession, isAdminSessionValid } from '@/utils/sessionStorage';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminExists, isLoading: checkingAdmin, isFetched } = useAdminExists();
  const authMutation = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAdminSessionValid()) {
      navigate({ to: '/admin/dashboard' });
    }
  }, [navigate]);

  // Redirect to register if no admin exists
  useEffect(() => {
    if (isFetched && !adminExists) {
      navigate({ to: '/admin/register' });
    }
  }, [isFetched, adminExists, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Email is required');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required');
      return;
    }

    try {
      const result = await authMutation.mutateAsync({ email, password });
      setAdminSession(result.email);
      navigate({ to: '/admin/dashboard' });
    } catch (error: any) {
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  if (checkingAdmin && !isFetched) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to access the admin dashboard
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {errorMessage && (
            <Alert variant="destructive" className="mb-5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="admin@example.com"
                disabled={authMutation.isPending}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your password"
                  disabled={authMutation.isPending}
                  autoComplete="current-password"
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit(e as any);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={authMutation.isPending}
            >
              {authMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          First time setup?{' '}
          <button
            onClick={() => navigate({ to: '/admin/register' })}
            className="text-primary hover:underline font-medium"
          >
            Register admin account
          </button>
        </p>
      </div>
    </div>
  );
}
