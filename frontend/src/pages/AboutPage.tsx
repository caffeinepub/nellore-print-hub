import React from 'react';
import { CheckCircle, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../translations';

export default function AboutPage() {
  const { language } = useLanguage();
  const t = getTranslations(language);

  const benefits = [
    { title: t.about.benefit1Title, desc: t.about.benefit1Desc },
    { title: t.about.benefit2Title, desc: t.about.benefit2Desc },
    { title: t.about.benefit3Title, desc: t.about.benefit3Desc },
    { title: t.about.benefit4Title, desc: t.about.benefit4Desc },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <section
        className="relative rounded-2xl overflow-hidden mb-10 min-h-[240px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/about-bg.dim_1200x600.png)' }}
      >
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 text-center px-6 py-10">
          <h1 className="text-3xl font-extrabold text-foreground mb-3">{t.about.title}</h1>
          <p className="text-lg font-medium text-foreground mb-1">{t.about.heroText}</p>
          <p className="text-muted-foreground">{t.about.heroSubtext}</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map(({ title, desc }) => (
            <div key={title} className="bg-card rounded-2xl border border-border p-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-primary text-primary-foreground rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-3">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-3">{t.about.commitmentTitle}</h2>
        <p className="opacity-90">{t.about.commitmentText}</p>
      </section>
    </div>
  );
}
