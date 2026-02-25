import { useState, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Loader2, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useVerifyEmailPassword } from '@/hooks/useAdminAuth';
import { useBiometricLogin } from '@/hooks/useBiometricAuth';
import { useAdminExists } from '@/hooks/useAdminExists';
import { useRegisterFirstAdmin } from '@/hooks/useAdminRegistration';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useAdmin';
import { checkWebAuthnSupport } from '@/utils/webauthn';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const verifyMutation = useVerifyEmailPassword();
  const biometricMutation = useBiometricLogin();
  const registerFirstAdminMutation = useRegisterFirstAdmin();
  const [biometricSupported, setBiometricSupported] = useState(false);
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
      // After successful login, the identity will be available
      // and the user will be redirected if they're already an admin
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
      // Navigation will happen automatically via the useEffect above
      // after the admin status is updated
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register as admin');
    }
  };

  const showRegistrationOption = !adminExistsLoading && !adminExists;
  const showInternetIdentityRegistration = showRegistrationOption && isAuthenticated;
  const showInternetIdentityLogin = !isAuthenticated;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            {showInternetIdentityRegistration
              ? 'Register as the first administrator'
              : 'Enter your credentials to access the admin panel'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      placeholder="admin@example.com"
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
