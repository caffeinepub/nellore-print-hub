import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Loader2, Lock, Mail, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useVerifyEmailPassword } from '@/hooks/useAdminAuth';
import { useBiometricLogin } from '@/hooks/useBiometricAuth';
import { useAdminExists } from '@/hooks/useAdminExists';
import { useRegisterFirstAdmin, useSeedFirstAdminPassword } from '@/hooks/useAdminRegistration';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useAdmin';
import { checkWebAuthnSupport } from '@/utils/webauthn';

// The permanent admin credentials — pre-filled and auto-seeded on first load
const FIRST_ADMIN_EMAIL = 'magic.nellorehub@gmail.com';
const FIRST_ADMIN_PASSWORD = 'Munnu1998@';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(FIRST_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const verifyMutation = useVerifyEmailPassword();
  const biometricMutation = useBiometricLogin();
  const registerFirstAdminMutation = useRegisterFirstAdmin();
  const seedFirstAdminMutation = useSeedFirstAdminPassword();
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [seedingDone, setSeedingDone] = useState(false);
  const { adminExists, isLoading: adminExistsLoading } = useAdminExists();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  // Check biometric support on mount
  useEffect(() => {
    checkWebAuthnSupport().then(setBiometricSupported);
  }, []);

  // Redirect to dashboard if already an admin
  useEffect(() => {
    if (isAuthenticated && isAdmin && !isCheckingAdmin) {
      navigate({ to: '/admin/dashboard' });
    }
  }, [isAuthenticated, isAdmin, isCheckingAdmin, navigate]);

  // Auto-seed the permanent admin credentials when no admin exists yet.
  // inviteAdminUser has no auth check when adminCount == 0.
  useEffect(() => {
    if (!adminExistsLoading && !adminExists && !seedingDone && !seedFirstAdminMutation.isPending) {
      setSeedingDone(true);
      seedFirstAdminMutation.mutate(
        { email: FIRST_ADMIN_EMAIL, password: FIRST_ADMIN_PASSWORD },
        {
          onError: () => {
            // Silently ignore — may already be seeded or actor not ready yet
            setSeedingDone(false);
          },
        }
      );
    }
  }, [adminExists, adminExistsLoading, seedingDone, seedFirstAdminMutation]);

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      await verifyMutation.mutateAsync({ email, password });
      toast.success('Login successful!');
      navigate({ to: '/admin/dashboard' });
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleBiometricLogin = async () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }

    try {
      await biometricMutation.mutateAsync(email);
      toast.success('Biometric authentication successful!');
      navigate({ to: '/admin/dashboard' });
    } catch (error: any) {
      toast.error(error.message || 'Biometric authentication failed');
    }
  };

  const handleInternetIdentityLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      if (error.message !== 'User is already authenticated') {
        toast.error(error.message || 'Login failed');
      }
    }
  };

  const handleRegisterFirstAdmin = async () => {
    if (!isAuthenticated) {
      toast.error('Please login with Internet Identity first');
      return;
    }

    try {
      await registerFirstAdminMutation.mutateAsync();
      toast.success('You are now the admin! Redirecting...');
      navigate({ to: '/admin/dashboard' });
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message?.includes('assign user roles') || error.message?.includes('Unauthorized')) {
        toast.error(
          'Registration failed. Please try logging in with email & password using: ' +
            FIRST_ADMIN_EMAIL
        );
      } else {
        toast.error(error.message || 'Failed to register as admin');
      }
    }
  };

  const showRegistrationOption = !adminExistsLoading && !adminExists;
  const showInternetIdentityRegistration = showRegistrationOption && isAuthenticated;
  const showInternetIdentityLogin = !isAuthenticated;

  const isSeedingInProgress = seedFirstAdminMutation.isPending;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            {showInternetIdentityRegistration
              ? 'Register as the first administrator'
              : 'Enter your credentials to access the admin panel'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seeding indicator */}
          {isSeedingInProgress && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">Setting up admin credentials…</p>
            </div>
          )}

          {showInternetIdentityRegistration ? (
            <>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center space-y-2">
                <UserPlus className="h-8 w-8 mx-auto text-primary" />
                <p className="text-sm font-medium">No admin accounts exist yet</p>
                <p className="text-xs text-muted-foreground">
                  You're logged in with Internet Identity. Click below to register as the first
                  administrator.
                </p>
              </div>
              <Button
                onClick={handleRegisterFirstAdmin}
                className="w-full h-11"
                disabled={registerFirstAdminMutation.isPending}
              >
                {registerFirstAdminMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register as First Admin
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or use email & password
                  </span>
                </div>
              </div>

              {/* Email/password fallback for first admin */}
              <form onSubmit={handleEmailPasswordLogin} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email-reg">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-reg"
                      type="email"
                      placeholder={FIRST_ADMIN_EMAIL}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                      disabled={verifyMutation.isPending}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-reg">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password-reg"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11"
                      disabled={verifyMutation.isPending}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-11"
                  disabled={verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login with Email'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {showInternetIdentityLogin && (
                <>
                  <Button
                    onClick={handleInternetIdentityLogin}
                    className="w-full h-11"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login with Internet Identity
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or use email
                      </span>
                    </div>
                  </div>
                </>
              )}

              <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={FIRST_ADMIN_EMAIL}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                      disabled={verifyMutation.isPending || biometricMutation.isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11"
                      disabled={verifyMutation.isPending || biometricMutation.isPending}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={verifyMutation.isPending || biometricMutation.isPending}
                >
                  {verifyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login with Email'
                  )}
                </Button>
              </form>

              {biometricSupported && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11"
                    onClick={handleBiometricLogin}
                    disabled={verifyMutation.isPending || biometricMutation.isPending || !email}
                  >
                    {biometricMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="mr-2 h-4 w-4" />
                        Login with Biometrics
                      </>
                    )}
                  </Button>
                </>
              )}
            </>
          )}

          <p className="text-xs text-center text-muted-foreground mt-4">
            Only authorized administrators can access this area
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
