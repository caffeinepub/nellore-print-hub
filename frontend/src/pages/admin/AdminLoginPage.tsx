import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useVerifyEmailPassword } from '../../hooks/useAdminAuth';
import { useBiometricLogin } from '../../hooks/useBiometricAuth';
import { useSeedFirstAdminPassword } from '../../hooks/useAdminRegistration';
import { useAdminExists } from '../../hooks/useAdminExists';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Mail, Lock, Fingerprint, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'magic.nellorehub@gmail.com';
const ADMIN_PASSWORD = 'Munnu1998@';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const verifyAuth = useVerifyEmailPassword();
  const biometricLogin = useBiometricLogin();
  const { adminExists, isLoading: checkingAdmin } = useAdminExists();
  const seedAdmin = useSeedFirstAdminPassword();
  const { login: iiLogin, loginStatus, identity } = useInternetIdentity();

  // Auto-seed admin credentials if no admin exists
  useEffect(() => {
    if (adminExists === false && !seedAdmin.isPending && !seedAdmin.isSuccess) {
      seedAdmin.mutate({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    }
  }, [adminExists]);

  // Redirect if already authenticated via Internet Identity
  useEffect(() => {
    if (identity) {
      navigate({ to: '/admin/dashboard' });
    }
  }, [identity, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const success = await verifyAuth.mutateAsync({ email, password });
      if (success) {
        // Redirect to admin dashboard immediately on success
        navigate({ to: '/admin/dashboard' });
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch {
      setError('Login failed. Please try again.');
    }
  };

  const handleBiometricLogin = async () => {
    setError('');
    try {
      await biometricLogin.mutateAsync(email);
      navigate({ to: '/admin/dashboard' });
    } catch {
      setError('Biometric login failed. Please try email/password login.');
    }
  };

  const handleIILogin = async () => {
    setError('');
    try {
      await iiLogin();
    } catch {
      setError('Internet Identity login failed.');
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-1">Nellore Printing Hub — Owner Access</p>
        </div>

        {seedAdmin.isPending && (
          <Alert className="mb-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <AlertDescription>Setting up admin credentials...</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={verifyAuth.isPending}
              >
                {verifyAuth.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleBiometricLogin}
              disabled={biometricLogin.isPending}
            >
              {biometricLogin.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Fingerprint className="w-4 h-4 mr-2" />
              )}
              Biometric Login
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleIILogin}
              disabled={loginStatus === 'logging-in'}
            >
              {loginStatus === 'logging-in' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Internet Identity
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Nellore Printing Hub · Sponsored by Magic Advertising
        </p>
      </div>
    </div>
  );
}
