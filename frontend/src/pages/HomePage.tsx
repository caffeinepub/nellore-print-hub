import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import ShareAppButton from '../components/ShareAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Printer,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Award,
  Users,
  Phone,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: t('language') === 'te' ? 'వేగవంతమైన డెలివరీ' : 'Fast Delivery', desc: t('language') === 'te' ? 'సమయానికి డెలివరీ హామీ' : 'On-time delivery guaranteed' },
    { icon: Award, title: t('language') === 'te' ? 'అత్యుత్తమ నాణ్యత' : 'Premium Quality', desc: t('language') === 'te' ? 'అత్యుత్తమ ముద్రణ నాణ్యత' : 'Best-in-class print quality' },
    { icon: Users, title: t('language') === 'te' ? 'నిపుణుల బృందం' : 'Expert Team', desc: t('language') === 'te' ? 'అనుభవజ్ఞులైన నిపుణులు' : 'Experienced professionals' },
    { icon: Phone, title: t('language') === 'te' ? '24/7 మద్దతు' : '24/7 Support', desc: t('language') === 'te' ? 'ఎల్లప్పుడూ మీకు సహాయం' : 'Always here to help you' },
  ];

  const services = [
    { icon: '/assets/generated/digital-icon.dim_256x256.png', name: t('digitalPrinting'), color: 'from-blue-500/20 to-blue-600/10' },
    { icon: '/assets/generated/flex-icon.dim_256x256.png', name: t('bannerPrinting'), color: 'from-green-500/20 to-green-600/10' },
    { icon: '/assets/generated/offset-icon.dim_256x256.png', name: t('offsetPrinting'), color: 'from-orange-500/20 to-orange-600/10' },
    { icon: '/assets/generated/design-icon.dim_256x256.png', name: t('designServices'), color: 'from-purple-500/20 to-purple-600/10' },
  ];

  const printSamples = [
    { src: '/assets/generated/print-sample-business-card.dim_800x450.png', label: t('language') === 'te' ? 'బిజినెస్ కార్డులు' : 'Business Cards' },
    { src: '/assets/generated/print-sample-brochure.dim_800x450.png', label: t('language') === 'te' ? 'బ్రోచర్లు' : 'Brochures' },
    { src: '/assets/generated/print-sample-flex.dim_800x450.png', label: t('language') === 'te' ? 'ఫ్లెక్స్ బ్యానర్లు' : 'Flex Banners' },
    { src: '/assets/generated/print-sample-banner.dim_800x450.png', label: t('language') === 'te' ? 'బ్యానర్లు' : 'Banners' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/hero-banner.dim_1200x400.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-accent/80" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-2 text-sm font-medium mb-6 border border-white/30">
            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            {t('language') === 'te' ? 'నెల్లూరు #1 ప్రింటింగ్ సేవ' : 'Nellore\'s #1 Printing Service'}
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            {t('heroTitle')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 font-semibold mb-3">
            {t('heroSubtitle')}
          </p>

          {/* Description */}
          <p className="text-base md:text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-white/25 transition-all hover:scale-105 active:scale-95"
              onClick={() => navigate({ to: '/request-quote' })}
            >
              <Printer className="w-5 h-5 mr-2" />
              {t('getQuote')}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20 font-semibold text-lg px-8 py-6 rounded-full backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
              onClick={() => navigate({ to: '/gallery' })}
            >
              {t('viewGallery')}
            </Button>

            {/* Share Button */}
            <ShareAppButton
              className="border-2 border-white/60 text-white hover:bg-white/20 font-semibold px-6 py-6 rounded-full backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
              label={t('shareApp')}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-primary-foreground/70">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 text-primary border-primary">
              {t('servicesTitle')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t('servicesSubtitle')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {services.map((service, i) => (
              <Card
                key={i}
                className={`cursor-pointer hover:shadow-lg transition-all hover:scale-105 active:scale-95 border-0 bg-gradient-to-br ${service.color} overflow-hidden`}
                onClick={() => navigate({ to: '/services' })}
              >
                <CardContent className="p-4 text-center">
                  <img src={service.icon} alt={service.name} className="w-16 h-16 mx-auto mb-3 object-contain" />
                  <p className="font-semibold text-sm text-foreground">{service.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-full"
              onClick={() => navigate({ to: '/services' })}
            >
              {t('learnMore')} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Print Samples */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {t('language') === 'te' ? 'మా పని నమూనాలు' : 'Our Print Samples'}
            </h2>
            <p className="text-muted-foreground">
              {t('language') === 'te' ? 'అత్యుత్తమ నాణ్యత ముద్రణ' : 'Premium quality printing'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {printSamples.map((sample, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                onClick={() => navigate({ to: '/gallery' })}
              >
                <img
                  src={sample.src}
                  alt={sample.label}
                  className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white text-sm font-semibold">{sample.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('language') === 'te' ? 'ఈరోజే మీ ప్రాజెక్ట్ ప్రారంభించండి!' : 'Start Your Project Today!'}
          </h2>
          <p className="text-white/80 text-lg mb-8">
            {t('language') === 'te'
              ? 'ఉచిత కోటేషన్ పొందండి మరియు మీ ముద్రణ అవసరాలను మాకు అప్పగించండి'
              : 'Get a free quote and let us handle all your printing needs'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold px-8 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
              onClick={() => navigate({ to: '/request-quote' })}
            >
              <Printer className="w-5 h-5 mr-2" />
              {t('getQuote')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20 font-semibold px-8 rounded-full transition-all hover:scale-105 active:scale-95"
              onClick={() => navigate({ to: '/contact' })}
            >
              {t('contactTitle')}
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Portal CTA */}
      <section className="py-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-accent/10 to-primary/10 overflow-hidden">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {t('language') === 'te' ? 'మీ ఆర్డర్లను ట్రాక్ చేయండి' : 'Track Your Orders'}
                </h3>
                <p className="text-muted-foreground">
                  {t('language') === 'te'
                    ? 'కస్టమర్ పోర్టల్‌లో లాగిన్ చేసి మీ కోటేషన్లు మరియు ఆర్డర్లను నిర్వహించండి'
                    : 'Login to the customer portal to manage your quotations and orders'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6"
                  onClick={() => navigate({ to: '/customer/login' })}
                >
                  {t('login')}
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 font-semibold rounded-full px-6"
                  onClick={() => navigate({ to: '/customer/register' })}
                >
                  {t('register')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-xl font-semibold text-foreground mb-2">
            {t('language') === 'te' ? '"అద్భుతమైన నాణ్యత మరియు వేగవంతమైన సేవ!"' : '"Amazing quality and fast service!"'}
          </p>
          <p className="text-muted-foreground mb-6">
            {t('language') === 'te' ? '— సంతృప్తి చెందిన కస్టమర్' : '— Happy Customer, Nellore'}
          </p>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 rounded-full"
            onClick={() => navigate({ to: '/testimonials' })}
          >
            {t('language') === 'te' ? 'అన్ని సమీక్షలు చూడండి' : 'View All Reviews'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
