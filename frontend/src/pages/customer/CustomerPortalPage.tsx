import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { useGetMyQuotations } from '../../hooks/useQuotations';
import { QuotationStatus, DesignStatus } from '../../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LogOut,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Printer,
  ChevronRight,
  Palette,
} from 'lucide-react';

const STATUS_STEPS = [
  QuotationStatus.draft,
  QuotationStatus.customerPending,
  QuotationStatus.paymentPending,
  QuotationStatus.workInProgress,
  QuotationStatus.completed,
];

function getProgressPercent(status: QuotationStatus): number {
  const idx = STATUS_STEPS.indexOf(status);
  if (idx === -1) return 0;
  return Math.round((idx / (STATUS_STEPS.length - 1)) * 100);
}

function StatusBadge({ status, t }: { status: QuotationStatus; t: (k: string) => string }) {
  const config: Record<
    string,
    {
      label: string;
      variant: 'default' | 'secondary' | 'destructive' | 'outline';
      icon: React.ReactNode;
    }
  > = {
    [QuotationStatus.draft]: {
      label: t('statusDraft'),
      variant: 'secondary',
      icon: <Clock className="w-3 h-3" />,
    },
    [QuotationStatus.customerPending]: {
      label: t('statusCustomerPending'),
      variant: 'default',
      icon: <AlertCircle className="w-3 h-3" />,
    },
    [QuotationStatus.paymentPending]: {
      label: t('statusPaymentPending'),
      variant: 'default',
      icon: <AlertCircle className="w-3 h-3" />,
    },
    [QuotationStatus.workInProgress]: {
      label: t('statusWorkInProgress'),
      variant: 'default',
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
    },
    [QuotationStatus.completed]: {
      label: t('statusCompleted'),
      variant: 'default',
      icon: <CheckCircle className="w-3 h-3" />,
    },
    [QuotationStatus.accepted]: {
      label: t('statusAccepted'),
      variant: 'default',
      icon: <CheckCircle className="w-3 h-3" />,
    },
    [QuotationStatus.rejected]: {
      label: t('statusRejected'),
      variant: 'destructive',
      icon: <XCircle className="w-3 h-3" />,
    },
    [QuotationStatus.negotiating]: {
      label: t('statusNegotiating'),
      variant: 'outline',
      icon: <AlertCircle className="w-3 h-3" />,
    },
  };
  const c = config[status] ?? { label: status, variant: 'secondary' as const, icon: null };
  return (
    <Badge variant={c.variant} className="flex items-center gap-1 text-xs">
      {c.icon}
      {c.label}
    </Badge>
  );
}

export default function CustomerPortalPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { customer, logout } = useCustomerAuth();
  const { data: quotations, isLoading } = useGetMyQuotations();

  const handleLogout = () => {
    logout();
    navigate({ to: '/customer/login' });
  };

  const stepLabels = [
    t('step_submitted'),
    t('step_review'),
    t('step_approved'),
    t('step_inProgress'),
    t('step_completed'),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('customerPortal')}</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              {t('language') === 'te' ? 'స్వాగతం' : 'Welcome'},{' '}
              {customer?.identifier}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-white/30 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] border-0 bg-gradient-to-br from-primary/10 to-primary/5"
            onClick={() => navigate({ to: '/request-quote' })}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Printer className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{t('requestQuote')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('language') === 'te' ? 'కొత్త కోటేషన్' : 'New quotation'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] border-0 bg-gradient-to-br from-accent/10 to-accent/5"
            onClick={() => navigate({ to: '/my-quotations' })}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{t('myQuotations')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('language') === 'te' ? 'అన్ని కోటేషన్లు' : 'All quotations'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Quotations */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">{t('myQuotations')}</h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : !quotations || quotations.length === 0 ? (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  {t('language') === 'te' ? 'ఇంకా కోటేషన్లు లేవు' : 'No quotations yet'}
                </p>
                <Button
                  className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                  onClick={() => navigate({ to: '/request-quote' })}
                >
                  {t('requestQuote')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {quotations.map((q) => {
                const progress = getProgressPercent(q.status);
                const stepIdx = STATUS_STEPS.indexOf(q.status);

                return (
                  <Card
                    key={q.id}
                    className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    onClick={() => navigate({ to: '/my-quotations' })}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">
                            {t('language') === 'te' ? 'కోటేషన్' : 'Quotation'} #{q.id}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(Number(q.timestamp) / 1_000_000).toLocaleDateString()}
                          </p>
                        </div>
                        <StatusBadge status={q.status} t={t} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {q.projectDetails}
                      </p>

                      {/* Design Status */}
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          {q.designStatus === DesignStatus.ready
                            ? t('designReady')
                            : t('designNeeded')}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {STATUS_STEPS.includes(q.status) && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{t('orderProgress')}</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            {stepLabels.map((label, i) => (
                              <span
                                key={i}
                                className={i <= stepIdx ? 'text-primary font-medium' : ''}
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action hints */}
                      {q.status === QuotationStatus.customerPending && (
                        <div className="mt-3 p-2 rounded-lg bg-primary/10 border border-primary/20">
                          <p className="text-xs text-primary font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {t('language') === 'te'
                              ? 'మీ సమీక్ష అవసరం — ట్యాప్ చేయండి'
                              : 'Your review needed — tap to view'}
                          </p>
                        </div>
                      )}
                      {q.status === QuotationStatus.paymentPending && (
                        <div className="mt-3 p-2 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                          <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {t('language') === 'te' ? 'చెల్లింపు పెండింగ్ ఉంది' : 'Payment pending'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
