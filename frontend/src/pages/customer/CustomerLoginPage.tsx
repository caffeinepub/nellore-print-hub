import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from '../../hooks/useActor';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, LogIn, UserPlus, Printer } from 'lucide-react';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const { login } = useCustomerAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setLoading(true);
    setError('');
    try {
      const hash = await sha256(password);
      const customerId = await actor.authenticateCustomer(identifier, hash);
      login(customerId, identifier);
      navigate({ to: '/customer/portal' });
    } catch (err: any) {
      setError('Invalid credentials. Please check your email/mobile and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Printer className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Magic Hub Nellore</h1>
          <p className="text-muted-foreground text-sm mt-1">మేజిక్ హబ్ నెల్లూరు</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              Customer Login
              <span className="block text-sm font-normal text-muted-foreground mt-1">కస్టమర్ లాగిన్</span>
            </CardTitle>
            <CardDescription>
              Sign in to view your orders and quotations
              <span className="block text-xs mt-0.5">మీ ఆర్డర్లు మరియు కోటేషన్లు చూడండి</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="identifier">
                  Email or Mobile Number
                  <span className="block text-xs text-muted-foreground font-normal">ఇమెయిల్ లేదా మొబైల్ నంబర్</span>
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="email@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">
                  Password
                  <span className="block text-xs text-muted-foreground font-normal">పాస్‌వర్డ్</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in... / లాగిన్ అవుతోంది...</>
                ) : (
                  <><LogIn className="w-4 h-4 mr-2" /> Sign In / లాగిన్</>
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate({ to: '/customer/register' })}
                    className="text-primary font-medium hover:underline"
                  >
                    Register / నమోదు చేయండి
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="hover:underline"
          >
            ← Back to Home / హోమ్‌కి తిరిగి వెళ్ళండి
          </button>
        </p>
      </div>
    </div>
  );
}
