import React from 'react';
import { CheckCircle, ArrowRight, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../translations';

export default function QuotationConfirmationPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/quotation-confirmation/$id' });
  const { language } = useLanguage();
  const t = getTranslations(language);

  const steps = [
    t.quotationConfirmation.step1,
    t.quotationConfirmation.step2,
    t.quotationConfirmation.step3,
    t.quotationConfirmation.step4,
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
      </div>

      <h1 className="text-2xl font-extrabold text-foreground mb-2">{t.quotationConfirmation.title}</h1>
      <p className="text-muted-foreground mb-2">{t.quotationConfirmation.subtitle}</p>
      {id && (
        <p className="text-xs text-muted-foreground mb-6 font-mono bg-muted px-3 py-1 rounded-full inline-block">
          ID: {id}
        </p>
      )}

      <div className="bg-card rounded-2xl border border-border p-6 mb-8 text-left">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <List className="w-4 h-4 text-primary" />
          {language === 'te' ? 'తదుపరి దశలు' : 'What happens next?'}
        </h2>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={() => navigate({ to: '/my-quotations' })} className="gap-2">
          {t.quotationConfirmation.viewQuotations}
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          {t.quotationConfirmation.backHome}
        </Button>
      </div>
    </div>
  );
}
