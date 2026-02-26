import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetContactInfo } from '../hooks/useContactInfo';
import { useGetAdminContent } from '../hooks/useAdminContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, ExternalLink, ArrowRight } from 'lucide-react';

const DEFAULT_HOURS = [
  { day: 'Monday / సోమవారం', hours: '09:00 - 18:00' },
  { day: 'Tuesday / మంగళవారం', hours: '09:00 - 18:00' },
  { day: 'Wednesday / బుధవారం', hours: '09:00 - 18:00' },
  { day: 'Thursday / గురువారం', hours: '09:00 - 18:00' },
  { day: 'Friday / శుక్రవారం', hours: '09:00 - 18:00' },
  { day: 'Saturday / శనివారం', hours: '09:00 - 14:00' },
  { day: 'Sunday / ఆదివారం', hours: 'Closed / మూసివేయబడింది' },
];

const DAY_LABELS: Record<string, string> = {
  Mon: 'Monday / సోమవారం',
  Tue: 'Tuesday / మంగళవారం',
  Wed: 'Wednesday / బుధవారం',
  Thu: 'Thursday / గురువారం',
  Fri: 'Friday / శుక్రవారం',
  Sat: 'Saturday / శనివారం',
  Sun: 'Sunday / ఆదివారం',
};

function parseBusinessHours(hoursArray: string[]) {
  return hoursArray.map((entry) => {
    const colonIdx = entry.indexOf(':');
    if (colonIdx === -1) return { day: entry, hours: '' };
    const key = entry.substring(0, colonIdx).trim();
    const hours = entry.substring(colonIdx + 1).trim();
    const dayLabel = DAY_LABELS[key] || key;
    return { day: dayLabel, hours };
  });
}

export default function ContactUsPage() {
  const navigate = useNavigate();
  const { data: contactInfo } = useGetContactInfo();
  const { data: adminContent } = useGetAdminContent();

  const businessHours =
    adminContent?.businessHours && adminContent.businessHours.length > 0
      ? parseBusinessHours(adminContent.businessHours)
      : DEFAULT_HOURS;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-10 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">Contact Us</h1>
        <p className="text-xl text-primary font-semibold mb-2">సంప్రదించండి</p>
        <p className="text-muted-foreground text-sm">
          We're here to help / మేము సహాయం చేయడానికి ఇక్కడ ఉన్నాము
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-sm text-foreground mb-0.5">Email / ఇమెయిల్</p>
              <a
                href={`mailto:${contactInfo?.email || 'magic.nellorehub@gmail.com'}`}
                className="text-xs text-primary hover:underline break-all"
              >
                {contactInfo?.email || 'magic.nellorehub@gmail.com'}
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-sm text-foreground mb-0.5">Phone / ఫోన్</p>
              <a
                href={`tel:${contactInfo?.phone || '+919390535070'}`}
                className="text-xs text-primary hover:underline"
              >
                {contactInfo?.phone || '+91 9390535070'}
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-sm text-foreground mb-0.5">Address / చిరునామా</p>
              <p className="text-xs text-muted-foreground">
                {contactInfo?.physicalAddress || 'Dargamitta, Podalakur Road, Nellore'}
              </p>
              {(contactInfo?.mapsLink) && (
                <a
                  href={contactInfo.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center justify-center gap-1 mt-1"
                >
                  View Map <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Business Hours */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <h2 className="font-bold text-foreground">Business Hours</h2>
                <p className="text-xs text-muted-foreground">వ్యాపార సమయాలు</p>
              </div>
            </div>
            <div className="space-y-2">
              {businessHours.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{item.day}</span>
                  <span className={`text-sm font-medium ${item.hours.toLowerCase().includes('closed') ? 'text-destructive' : 'text-primary'}`}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" onClick={() => navigate({ to: '/request-quote' })} className="gap-2">
            Request a Quote / కోటేషన్ అడగండి
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
