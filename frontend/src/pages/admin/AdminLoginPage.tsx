import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useVerifyEmailPassword } from '../../hooks/useAdminAuth';
import { useBiometricLogin } from '../../hooks/useBiometricAuth';
import { useAdminExists } from '../../hooks/useAdminExists';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Shield, Mail, Fingerprint, LogIn, ArrowLeft, CheckCircle } from 'lucide-react';
import { haptics } from '../../utils/haptics';

type LoginMethod = 'select' | 'email' | 'biometric';

// Store session in sessionStorage with multiple keys for compatibility
function storeAdminSession(adminEmail: string) {
  const now = Date.now();
  // Primary session object
  sessionStorage.setItem('adminEmailSession', JSON.stringify({
    email: adminEmail,
    timestamp: now,
  }));
  // Secondary flat keys (checked by AdminGuard as fallback)
  sessionStorage.setItem('adminEmail', adminEmail);
  sessionStorage.setItem('adminAuthenticated', 'true');
  sessionStorage.setItem('adminAuthTimestamp', String(now));
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, loginStatus, identity, isInitializing } = useInternetIdentity();
  const { adminExists, isLoading: adminExistsLoading } = useAdminExists();
  const verifyEmailPassword = useVerifyEmailPassword();
  const biometricLogin = useBiometricLogin();

  const [method, setMethod] = useState<LoginMethod>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // After II login succeeds, navigate to dashboard
  useEffect(() => {
    if (loginStatus === 'success' && identity) {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['adminExists'] });
      setTimeout(() => {
        navigate({ to: '/admin/dashboard', replace: true });
      }, 500);
    }
  }, [loginStatus, identity, navigate, queryClient]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    haptics.tap();

    try {
      const result = await verifyEmailPassword.mutateAsync({ email, password });
      if (result) {
        haptics.success();
        // Store session with all keys before navigating
        storeAdminSession(email);
        setLoginSuccess(true);
        // Navigate immediately — AdminGuard will read session synchronously
        navigate({ to: '/admin/dashboard', replace: true });
      } else {
        haptics.error();
        setError('Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      haptics.error();
      setError(err?.message || 'Login failed. Please try again.');
    }
  };

  const handleBiometricLogin = async () => {
    setError('');
    haptics.tap();

    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    try {
      const result = await biometricLogin.mutateAsync(email);
      if (result) {
        haptics.success();
        storeAdminSession(email);
        setLoginSuccess(true);
        navigate({ to: '/admin/dashboard', replace: true });
      } else {
        haptics.error();
        setError('Biometric authentication failed.');
      }
    } catch (err: any) {
      haptics.error();
      setError(err?.message || 'Biometric login failed.');
    }
  };

  const handleIILogin = async () => {
    setError('');
    haptics.tap();
    try {
      await login();
    } catch (err: any) {
      if (err?.message === 'User is already authenticated') {
        queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
        navigate({ to: '/admin/dashboard', replace: true });
      } else {
        haptics.error();
        setError(err?.message || 'Internet Identity login failed.');
      }
    }
  };

  if (isInitializing || adminExistsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (loginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Login Successful!</h2>
          <p className="text-muted-foreground">Redirecting to Admin Dashboard...</p>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          <button
            onClick={() => navigate({ to: '/admin/dashboard', replace: true })}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Access the admin dashboard</p>
        </div>

        {/* Method Selection */}
        {method === 'select' && (
          <div className="space-y-3">
            <button
              onClick={() => { setMethod('email'); setError(''); }}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Email &amp; Password</div>
                <div className="text-sm text-muted-foreground">Sign in with your credentials</div>
              </div>
            </button>

            <button
              onClick={() => { setMethod('biometric'); setError(''); }}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Fingerprint className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Biometric / Passkey</div>
                <div className="text-sm text-muted-foreground">Use fingerprint or face recognition</div>
              </div>
            </button>

            <button
              onClick={handleIILogin}
              disabled={loginStatus === 'logging-in'}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {loginStatus === 'logging-in' ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">
                  {loginStatus === 'logging-in' ? 'Connecting...' : 'Internet Identity'}
                </div>
                <div className="text-sm text-muted-foreground">Sign in with Internet Identity</div>
              </div>
            </button>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="pt-4 text-center">
              <button
                onClick={() => navigate({ to: '/' })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Return to Home
              </button>
            </div>
          </div>
        )}

        {/* Email Login Form */}
        {method === 'email' && (
          <div className="space-y-4">
            <button
              onClick={() => { setMethod('select'); setError(''); }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login options
            </button>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={verifyEmailPassword.isPending}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {verifyEmailPassword.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Biometric Login */}
        {method === 'biometric' && (
          <div className="space-y-4">
            <button
              onClick={() => { setMethod('select'); setError(''); }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login options
            </button>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <button
                onClick={handleBiometricLogin}
                disabled={biometricLogin.isPending || !email}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {biometricLogin.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5" />
                    Authenticate with Biometric
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Use your registered fingerprint, face ID, or passkey to sign in.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
