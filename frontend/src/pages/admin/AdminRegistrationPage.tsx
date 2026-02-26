import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Shield, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminExists } from '@/hooks/useAdminExists';
import { useRegisterInitialAdmin } from '@/hooks/useAdminRegistration';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { setAdminSession } from '@/utils/sessionStorage';

export default function AdminRegistrationPage() {
  const navigate = useNavigate();
  const { adminExists, isLoading: checkingAdmin, isFetched } = useAdminExists();
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const registerMutation = useRegisterInitialAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // If admin already exists, redirect to login
  useEffect(() => {
    if (isFetched && adminExists) {
      navigate({ to: '/admin/login' });
    }
  }, [isFetched, adminExists, navigate]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      if (error?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!isAuthenticated) {
      setErrors({ form: 'Please authenticate with Internet Identity first' });
      return;
    }

    try {
      await registerMutation.mutateAsync({ email, password });
      setSuccessMessage('Admin account created successfully! Redirecting to login...');
      setAdminSession(email);
      setTimeout(() => {
        navigate({ to: '/admin/dashboard' });
      }, 1500);
    } catch (error: any) {
      const msg = error?.message || 'Registration failed';
      if (msg.includes('no admins exist')) {
        setErrors({ form: 'An admin account already exists. Please log in instead.' });
        setTimeout(() => navigate({ to: '/admin/login' }), 2000);
      } else {
        setErrors({ form: msg });
      }
    }
  };

  if (isInitializing || (checkingAdmin && !isFetched)) {
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
          <h1 className="text-2xl font-bold text-foreground">Admin Setup</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create the first administrator account
          </p>
        </div>

        {successMessage && (
          <Alert className="mb-6 border-green-500/30 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errors.form && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.form}</AlertDescription>
          </Alert>
        )}

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          {/* Step 1: Internet Identity Authentication */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isAuthenticated ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                {isAuthenticated ? '✓' : '1'}
              </div>
              <h2 className="font-semibold text-foreground">Authenticate Identity</h2>
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              You must authenticate with Internet Identity to register as admin.
            </p>
            {isAuthenticated ? (
              <div className="pl-8 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>Authenticated as: <span className="font-mono text-xs">{identity?.getPrincipal().toString().slice(0, 20)}...</span></span>
              </div>
            ) : (
              <div className="pl-8">
                <Button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Authenticate with Internet Identity
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Step 2: Set Admin Credentials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isAuthenticated ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <h2 className={`font-semibold ${isAuthenticated ? 'text-foreground' : 'text-muted-foreground'}`}>
                Set Admin Credentials
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="pl-8 space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="admin@example.com"
                  disabled={!isAuthenticated || registerMutation.isPending}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
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
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    placeholder="Min. 8 characters"
                    disabled={!isAuthenticated || registerMutation.isPending}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
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
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder="Repeat your password"
                    disabled={!isAuthenticated || registerMutation.isPending}
                    className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isAuthenticated || registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Admin Account...
                  </>
                ) : (
                  'Create Admin Account'
                )}
              </Button>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate({ to: '/admin/login' })}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
