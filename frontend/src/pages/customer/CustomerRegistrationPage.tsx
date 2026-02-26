import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from '../../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, UserPlus, Printer } from 'lucide-react';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function CustomerRegistrationPage() {
  const navigate = useNavigate();
  const { actor } = useActor();

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;

    if (!email && !mobile) {
      setError('Please provide at least an email or mobile number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const hash = await sha256(password);
      await actor.registerCustomer(email, mobile, hash);
      setSuccess(true);
      setTimeout(() => navigate({ to: '/customer/login' }), 2000);
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('already exists')) {
        setError('An account with this email or mobile already exists.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
              Create Account
              <span className="block text-sm font-normal text-muted-foreground mt-1">ఖాతా తయారు చేయండి</span>
            </CardTitle>
            <CardDescription>
              Register to track your orders and quotations
              <span className="block text-xs mt-0.5">మీ ఆర్డర్లు ట్రాక్ చేయడానికి నమోదు చేయండి</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-foreground font-medium">Registration successful!</p>
                <p className="text-muted-foreground text-sm">నమోదు విజయవంతమైంది! Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Email Address
                    <span className="block text-xs text-muted-foreground font-normal">ఇమెయిల్ చిరునామా</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile">
                    Mobile Number
                    <span className="block text-xs text-muted-foreground font-normal">మొబైల్ నంబర్</span>
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
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
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">
                    Confirm Password
                    <span className="block text-xs text-muted-foreground font-normal">పాస్‌వర్డ్ నిర్ధారించండి</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering...</>
                  ) : (
                    <><UserPlus className="w-4 h-4 mr-2" /> Register / నమోదు చేయండి</>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate({ to: '/customer/login' })}
                      className="text-primary font-medium hover:underline"
                    >
                      Login / లాగిన్
                    </button>
                  </p>
                </div>
              </form>
            )}
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
