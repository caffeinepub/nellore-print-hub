import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Printer } from 'lucide-react';

export default function ServicesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const services = [
    {
      id: 'digital',
      icon: '/assets/generated/digital-icon.dim_256x256.png',
      title: t('digitalPrinting'),
      description: t('language') === 'te'
        ? 'అత్యాధునిక డిజిటల్ ప్రింటింగ్ సాంకేతికత ఉపయోగించి అత్యుత్తమ నాణ్యత ముద్రణ.'
        : 'High-quality digital printing using the latest technology for vibrant, precise results.',
      features: t('language') === 'te'
        ? ['వేగవంతమైన టర్నరౌండ్', 'వివిధ పేపర్ సైజులు', 'రంగు ఖచ్చితత్వం', 'చిన్న పరిమాణాలు']
        : ['Fast turnaround', 'Various paper sizes', 'Color accuracy', 'Small quantities'],
      sample: '/assets/generated/print-sample-business-card.dim_800x450.png',
      color: 'from-blue-500/10 to-blue-600/5',
      badge: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'banner',
      icon: '/assets/generated/flex-icon.dim_256x256.png',
      title: t('bannerPrinting'),
      description: t('language') === 'te'
        ? 'పెద్ద ఫార్మాట్ బ్యానర్లు మరియు ఫ్లెక్స్ ప్రింటింగ్ అన్ని ఈవెంట్లు మరియు ప్రకటనలకు.'
        : 'Large format banner and flex printing for all events and advertising needs.',
      features: t('language') === 'te'
        ? ['పెద్ద ఫార్మాట్ ప్రింటింగ్', 'వాతావరణ నిరోధకత', 'వివిధ పదార్థాలు', 'అనుకూల సైజులు']
        : ['Large format printing', 'Weather resistant', 'Various materials', 'Custom sizes'],
      sample: '/assets/generated/print-sample-flex.dim_800x450.png',
      color: 'from-green-500/10 to-green-600/5',
      badge: 'bg-green-100 text-green-700',
    },
    {
      id: 'offset',
      icon: '/assets/generated/offset-icon.dim_256x256.png',
      title: t('offsetPrinting'),
      description: t('language') === 'te'
        ? 'పెద్ద పరిమాణాలకు అత్యుత్తమ ఆఫ్‌సెట్ ప్రింటింగ్ — పుస్తకాలు, బ్రోచర్లు మరియు మరిన్ని.'
        : 'Premium offset printing for large quantities — books, brochures, and more.',
      features: t('language') === 'te'
        ? ['పెద్ద పరిమాణాలు', 'అత్యుత్తమ నాణ్యత', 'తక్కువ ధర', 'వివిధ ముగింపులు']
        : ['Large quantities', 'Premium quality', 'Cost effective', 'Various finishes'],
      sample: '/assets/generated/print-sample-brochure.dim_800x450.png',
      color: 'from-orange-500/10 to-orange-600/5',
      badge: 'bg-orange-100 text-orange-700',
    },
    {
      id: 'design',
      icon: '/assets/generated/design-icon.dim_256x256.png',
      title: t('designServices'),
      description: t('language') === 'te'
        ? 'వృత్తిపరమైన గ్రాఫిక్ డిజైన్ సేవలు మీ బ్రాండ్‌ను జీవంలోకి తీసుకొస్తాయి.'
        : 'Professional graphic design services to bring your brand to life.',
      features: t('language') === 'te'
        ? ['లోగో డిజైన్', 'బ్రాండ్ ఐడెంటిటీ', 'ప్రింట్ రెడీ ఫైల్స్', 'అనంతమైన రివిజన్లు']
        : ['Logo design', 'Brand identity', 'Print-ready files', 'Unlimited revisions'],
      sample: '/assets/generated/print-sample-banner.dim_800x450.png',
      color: 'from-purple-500/10 to-purple-600/5',
      badge: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            {t('servicesTitle')}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            {t('servicesTitle')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('servicesSubtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {services.map((service, i) => (
            <Card
              key={service.id}
              className={`overflow-hidden border-0 shadow-md hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-br ${service.color}`}
            >
              <CardContent className="p-0">
                <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Image */}
                  <div className="md:w-2/5 overflow-hidden">
                    <img
                      src={service.sample}
                      alt={service.title}
                      className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={service.icon} alt={service.title} className="w-12 h-12 object-contain" />
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{service.title}</h2>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="self-start bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6 hover:scale-105 active:scale-95 transition-all"
                      onClick={() => navigate({ to: '/request-quote' })}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      {t('requestQuote')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
