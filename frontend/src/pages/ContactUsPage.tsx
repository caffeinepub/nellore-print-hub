import { useLanguage } from '../contexts/LanguageContext';
import { useGetContactInfo } from '../hooks/useContactInfo';
import { Mail, Phone, MapPin, ExternalLink, MessageCircle, PhoneCall, Navigation } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

export default function ContactUsPage() {
  const { language } = useLanguage();
  const { data: contactInfo, isLoading } = useGetContactInfo();

  const phone = contactInfo?.phone ?? '+919390535070';
  const email = contactInfo?.email ?? 'magic.nellorehub@gmail.com';
  const address = contactInfo?.physicalAddress ?? 'Dargamitta, Podalakur Road, Nellore';
  const mapsLink = contactInfo?.mapsLink ?? 'https://maps.app.goo.gl/TTjDJUpiKHcE6RHX9?g_st=ic2';

  // Strip non-digits for wa.me link
  const phoneDigits = phone.replace(/\D/g, '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {language === 'te' ? 'మమ్మల్ని సంప్రదించండి' : 'Contact Us'}
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {language === 'te'
            ? 'మేము మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాము'
            : "We're here to help you with all your printing needs"}
        </p>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-2xl p-4 transition-colors"
          >
            <SiWhatsapp className="w-7 h-7" />
            <span className="text-sm font-semibold">
              {language === 'te' ? 'వాట్సాప్‌లో చాట్' : 'Chat on WhatsApp'}
            </span>
          </a>
          <a
            href={`tel:${phone}`}
            className="flex flex-col items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl p-4 transition-colors"
          >
            <PhoneCall className="w-7 h-7" />
            <span className="text-sm font-semibold">
              {language === 'te' ? 'కాల్ చేయండి' : 'Call Us'}
            </span>
          </a>
        </div>

        {/* Contact Info Cards */}
        <div className="space-y-3">
          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {language === 'te' ? 'ఇమెయిల్' : 'Email'}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">{email}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-auto" />
          </a>

          {/* Phone */}
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-green-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {language === 'te' ? 'ఫోన్' : 'Phone'}
              </p>
              <p className="text-sm font-semibold text-foreground">{phone}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-auto" />
          </a>

          {/* Address */}
          <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {language === 'te' ? 'చిరునామా' : 'Address'}
              </p>
              <p className="text-sm font-semibold text-foreground">{address}</p>
            </div>
          </div>

          {/* Get Directions */}
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl p-4 hover:bg-primary/90 transition-colors font-semibold"
          >
            <Navigation className="w-5 h-5" />
            {language === 'te' ? 'దిశలు పొందండి' : 'Get Directions'}
          </a>
        </div>

        {/* Business Hours */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            {language === 'te' ? 'వ్యాపార సమయాలు' : 'Business Hours'}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === 'te' ? 'సోమ - శని' : 'Mon – Sat'}
              </span>
              <span className="font-medium text-foreground">9:00 AM – 8:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === 'te' ? 'ఆదివారం' : 'Sunday'}
              </span>
              <span className="font-medium text-foreground">10:00 AM – 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
