import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Star, Zap, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';
import ShareAppButton from '../components/ShareAppButton';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../translations';

export default function HomePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslations(language);

  const features = [
    { icon: Star, title: t.home.feature1Title, desc: t.home.feature1Desc },
    { icon: Zap, title: t.home.feature2Title, desc: t.home.feature2Desc },
    { icon: DollarSign, title: t.home.feature3Title, desc: t.home.feature3Desc },
    { icon: Users, title: t.home.feature4Title, desc: t.home.feature4Desc },
  ];

  const services = [
    { key: 'digital', title: t.services.digital, desc: t.services.digitalDesc, icon: '/assets/generated/digital-icon.dim_256x256.png' },
    { key: 'banner', title: t.services.banner, desc: t.services.bannerDesc, icon: '/assets/generated/flex-icon.dim_256x256.png' },
    { key: 'offset', title: t.services.offset, desc: t.services.offsetDesc, icon: '/assets/generated/offset-icon.dim_256x256.png' },
    { key: 'design', title: t.services.design, desc: t.services.designDesc, icon: '/assets/generated/design-icon.dim_256x256.png' },
  ];

  return (
    <SwipeContainer>
      <PullToRefreshContainer onRefresh={async () => {}}>
        <div className="flex flex-col">
          {/* Hero Section */}
          <section
            className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)' }}
          >
            <div className="absolute inset-0 bg-background/70" />
            <div className="relative z-10 text-center px-4 py-16 max-w-2xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 leading-tight">
                {t.home.heroTitle}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {t.home.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={() => navigate({ to: '/request-quote' })} className="gap-2">
                  {t.home.heroButton}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/gallery' })}>
                  {t.home.heroButton2}
                </Button>
              </div>
              <div className="mt-4 flex justify-center">
                <ShareAppButton className="mt-2" />
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-14 px-4 bg-muted/30">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-foreground mb-8">{t.home.featuresTitle}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-card rounded-2xl p-5 flex flex-col items-center text-center gap-3 shadow-sm border border-border">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Preview */}
          <section className="py-14 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-foreground mb-2">{t.home.servicesTitle}</h2>
              <p className="text-center text-muted-foreground mb-8">{t.home.servicesSubtitle}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map(({ key, title, desc, icon }) => (
                  <div
                    key={key}
                    className="bg-card rounded-2xl p-4 flex flex-col items-center text-center gap-3 shadow-sm border border-border cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => navigate({ to: '/services' })}
                  >
                    <img src={icon} alt={title} className="w-14 h-14 object-contain" />
                    <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button variant="outline" onClick={() => navigate({ to: '/services' })} className="gap-2">
                  {t.common.viewAll} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-14 px-4 bg-primary text-primary-foreground">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-3">{t.home.ctaTitle}</h2>
              <p className="mb-6 opacity-90">{t.home.ctaSubtitle}</p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate({ to: '/request-quote' })}
                className="gap-2"
              >
                {t.home.ctaButton} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </section>
        </div>
      </PullToRefreshContainer>
    </SwipeContainer>
  );
}
