import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Printer,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  Shield,
  Award,
  Phone,
  ChevronRight,
  Package,
  Clock,
  Users,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetAppName } from '../hooks/useAppName';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: appName } = useGetAppName();
  const displayName = appName || 'Nellore Print Hub';

  const services = [
    {
      id: 'digital',
      icon: '/assets/generated/digital-icon.dim_256x256.png',
      title: t('services.digital') || 'Digital Printing',
      desc: t('services.digitalDesc') || 'High-resolution digital prints for all your business needs.',
      badge: 'Fast Turnaround',
    },
    {
      id: 'banner',
      icon: '/assets/generated/flex-icon.dim_256x256.png',
      title: t('services.banner') || 'Flex & Banner',
      desc: t('services.bannerDesc') || 'Large format banners and flex boards for maximum visibility.',
      badge: 'Large Format',
    },
    {
      id: 'offset',
      icon: '/assets/generated/offset-icon.dim_256x256.png',
      title: t('services.offset') || 'Offset Printing',
      desc: t('services.offsetDesc') || 'Premium quality offset printing for bulk orders.',
      badge: 'Bulk Orders',
    },
    {
      id: 'design',
      icon: '/assets/generated/design-icon.dim_256x256.png',
      title: t('services.design') || 'Design Services',
      desc: t('services.designDesc') || 'Professional graphic design for all your print materials.',
      badge: 'Creative',
    },
  ];

  const printSamples = [
    { src: '/assets/generated/print-sample-business-card.dim_800x450.png', label: 'Business Cards' },
    { src: '/assets/generated/print-sample-brochure.dim_800x450.png', label: 'Brochures' },
    { src: '/assets/generated/print-sample-banner.dim_800x450.png', label: 'Banners' },
    { src: '/assets/generated/print-sample-flex.dim_800x450.png', label: 'Flex Boards' },
  ];

  const features = [
    { icon: Zap, title: t('home.feature1Title') || 'Fast Delivery', desc: t('home.feature1Desc') || 'Same-day and next-day delivery options available.' },
    { icon: Shield, title: t('home.feature2Title') || 'Quality Assured', desc: t('home.feature2Desc') || 'Every print is quality-checked before delivery.' },
    { icon: Award, title: t('home.feature3Title') || 'Expert Design', desc: t('home.feature3Desc') || 'Professional designers to bring your vision to life.' },
    { icon: Users, title: t('home.feature4Title') || 'Trusted by 500+', desc: t('home.feature4Desc') || 'Hundreds of businesses trust us for their printing needs.' },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-[oklch(0.18_0.07_205)] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('/assets/generated/hero-bg.dim_1920x1080.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.07_205)] via-[oklch(0.18_0.07_205)]/90 to-[oklch(0.18_0.07_205)]/60" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-2xl">
            {/* Powered by badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.68_0.18_72)]/20 border border-[oklch(0.68_0.18_72)]/40 rounded text-xs font-semibold text-[oklch(0.82_0.16_78)] uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Magic Advertising
            </div>

            {/* App name */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.42_0.12_195)]/30 border border-[oklch(0.58_0.12_190)]/40 rounded text-xs font-semibold text-[oklch(0.75_0.10_190)] uppercase tracking-widest mb-6">
              <Printer className="w-3.5 h-3.5" />
              Professional Printing Services
            </div>

            <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {t('home.heroTitle') || 'Print with'}{' '}
              <span className="text-[oklch(0.78_0.18_78)]">Precision</span>
              <br />
              {t('home.heroSubtitle') || 'Deliver with Pride'}
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
              {t('home.heroDesc') || `${displayName} — your trusted partner for high-quality digital, offset, and large-format printing in Nellore.`}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate({ to: '/request-quote' })}
                className="flex items-center gap-2 px-6 py-3 bg-[oklch(0.68_0.18_72)] hover:bg-[oklch(0.60_0.18_70)] text-white font-semibold rounded transition-colors shadow-gold"
              >
                {t('home.getQuote') || 'Get a Quote'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate({ to: '/gallery' })}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded border border-white/20 transition-colors"
              >
                {t('home.viewWork') || 'View Our Work'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 mt-8 pt-8 border-t border-white/10">
              {[
                { icon: Star, text: '4.9/5 Rating' },
                { icon: Package, text: '10,000+ Orders' },
                { icon: Clock, text: 'Same-Day Delivery' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-white/60">
                  <Icon className="w-4 h-4 text-[oklch(0.78_0.18_78)]" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Print Samples Strip */}
      <section className="bg-[oklch(0.15_0.06_210)] py-4 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 max-w-7xl mx-auto">
          {printSamples.map((sample) => (
            <div key={sample.label} className="shrink-0 relative rounded overflow-hidden group">
              <img
                src={sample.src}
                alt={sample.label}
                className="h-20 w-36 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <span className="text-white text-xs font-medium">{sample.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
              {t('home.whyChooseUs') || 'Why Choose Us?'}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('home.whyChooseUsDesc') || 'We combine cutting-edge technology with expert craftsmanship.'}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow text-center"
              >
                <div className="h-12 w-12 rounded-lg bg-[oklch(0.88_0.05_195)] flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-[oklch(0.42_0.12_195)]" />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 bg-[oklch(0.95_0.01_195)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                {t('servicesTitle') || 'Our Services'}
              </h2>
              <p className="text-muted-foreground">
                {t('servicesSubtitle') || 'Professional printing solutions for every need'}
              </p>
            </div>
            <button
              onClick={() => navigate({ to: '/services' })}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[oklch(0.42_0.12_195)] hover:text-[oklch(0.35_0.12_195)] transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all cursor-pointer group"
                onClick={() => navigate({ to: '/services' })}
              >
                <div className="h-32 bg-[oklch(0.90_0.04_195)] flex items-center justify-center">
                  <img src={service.icon} alt={service.title} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-4">
                  <div className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-[oklch(0.88_0.05_195)] text-[oklch(0.35_0.12_195)] mb-2">
                    {service.badge}
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <button
              onClick={() => navigate({ to: '/services' })}
              className="flex items-center gap-2 text-sm font-semibold text-[oklch(0.42_0.12_195)] mx-auto"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[oklch(0.20_0.07_205)] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.68_0.18_72)]/20 border border-[oklch(0.68_0.18_72)]/40 rounded text-xs font-semibold text-[oklch(0.82_0.16_78)] uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Ready to Print?
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('home.ctaTitle') || 'Start Your Print Project Today'}
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            {t('home.ctaDesc') || 'Get a free quote in minutes. Our team is ready to bring your vision to life.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate({ to: '/request-quote' })}
              className="flex items-center gap-2 px-8 py-3.5 bg-[oklch(0.68_0.18_72)] hover:bg-[oklch(0.60_0.18_70)] text-white font-bold rounded transition-colors shadow-gold text-base"
            >
              {t('home.getQuote') || 'Get a Free Quote'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate({ to: '/contact' })}
              className="flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded border border-white/20 transition-colors text-base"
            >
              <Phone className="w-5 h-5" />
              {t('contactTitle') || 'Contact Us'}
            </button>
          </div>
        </div>
      </section>

      {/* Customer Portal Link */}
      <section className="py-10 px-4 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-foreground mb-1">
              {t('customerPortal') || 'Customer Portal'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('home.portalDesc') || 'Track your orders and manage quotations online.'}
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/customer/login' })}
            className="flex items-center gap-2 px-5 py-2.5 bg-[oklch(0.42_0.12_195)] hover:bg-[oklch(0.35_0.12_195)] text-white font-semibold rounded transition-colors text-sm shrink-0"
          >
            {t('login') || 'Login'} / {t('register') || 'Register'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
