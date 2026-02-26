import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetContactInfo } from '../hooks/useContactInfo';
import { useActor } from '../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, MessageCircle, Loader2, CheckCircle } from 'lucide-react';

export default function ContactUsPage() {
  const { t } = useLanguage();
  const { data: contactInfo } = useGetContactInfo();
  const { actor } = useActor();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSending(true);
    setError('');
    try {
      await actor.sendMessage(name, email, message);
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError(t('language') === 'te' ? 'సందేశం పంపడం విఫలమైంది' : 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            {t('contactTitle')}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            {t('contactTitle')}
          </h1>
          <p className="text-lg text-muted-foreground">{t('contactSubtitle')}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t('language') === 'te' ? 'మా సంప్రదింపు వివరాలు' : 'Get in Touch'}
            </h2>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t('phone')}</p>
                  <a href={`tel:${contactInfo?.phone}`} className="text-primary hover:underline text-sm">
                    {contactInfo?.phone || '+91 93905 35070'}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t('emailLabel')}</p>
                  <a href={`mailto:${contactInfo?.email}`} className="text-primary hover:underline text-sm">
                    {contactInfo?.email || 'magic.nellorehub@gmail.com'}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t('address')}</p>
                  <p className="text-muted-foreground text-sm">
                    {contactInfo?.physicalAddress || 'Dargamitta, Podalakur Road, Nellore'}
                  </p>
                  {contactInfo?.mapsLink && (
                    <a
                      href={contactInfo.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      {t('language') === 'te' ? 'మ్యాప్‌లో చూడండి' : 'View on Maps'}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t('language') === 'te' ? 'సందేశం పంపండి' : 'Send a Message'}
            </h2>

            {sent ? (
              <Card className="border-0 shadow-md">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {t('language') === 'te' ? 'సందేశం పంపబడింది!' : 'Message Sent!'}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('language') === 'te' ? 'మేము త్వరలో మీకు తెలియజేస్తాం' : 'We\'ll get back to you soon'}
                  </p>
                  <Button
                    className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                    onClick={() => setSent(false)}
                  >
                    {t('language') === 'te' ? 'మరొక సందేశం పంపండి' : 'Send Another Message'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('name')} *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('name')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('message')} *</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('messagePlaceholder')}
                        rows={4}
                        required
                      />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full h-11"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('sending')}
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {t('sendMessage')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
