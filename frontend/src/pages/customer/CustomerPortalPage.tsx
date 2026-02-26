import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { useGetCustomerQuotations } from '../../hooks/useCustomerQuotations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, FileText, Clock, CheckCircle, XCircle, Loader2, User, Printer } from 'lucide-react';
import { QuotationStatus, ServiceType } from '../../backend';

const statusConfig: Record<string, { label: string; teLabel: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', teLabel: 'డ్రాఫ్ట్', variant: 'secondary' },
  customerPending: { label: 'Review Pending', teLabel: 'సమీక్ష పెండింగ్', variant: 'default' },
  paymentPending: { label: 'Payment Pending', teLabel: 'చెల్లింపు పెండింగ్', variant: 'default' },
  workInProgress: { label: 'Work In Progress', teLabel: 'పని జరుగుతోంది', variant: 'default' },
  completed: { label: 'Completed', teLabel: 'పూర్తయింది', variant: 'default' },
  accepted: { label: 'Accepted', teLabel: 'అంగీకరించారు', variant: 'default' },
  rejected: { label: 'Rejected', teLabel: 'తిరస్కరించారు', variant: 'destructive' },
  negotiating: { label: 'Negotiating', teLabel: 'చర్చలు జరుగుతున్నాయి', variant: 'outline' },
};

const serviceTypeLabels: Record<string, { en: string; te: string }> = {
  digital: { en: 'Digital Printing', te: 'డిజిటల్ ప్రింటింగ్' },
  banner: { en: 'Banner / Flex', te: 'బ్యానర్ / ఫ్లెక్స్' },
  offset: { en: 'Offset Printing', te: 'ఆఫ్‌సెట్ ప్రింటింగ్' },
  design: { en: 'Design Services', te: 'డిజైన్ సేవలు' },
};

export default function CustomerPortalPage() {
  const navigate = useNavigate();
  const { customer, logout } = useCustomerAuth();
  const { data: quotations, isLoading } = useGetCustomerQuotations(customer?.customerId ?? null);

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getServiceLabel = (serviceType: ServiceType) => {
    const key = serviceType.toString().toLowerCase();
    return serviceTypeLabels[key] || { en: key, te: key };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Printer className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground leading-none">Magic Hub Nellore</p>
              <p className="text-xs text-muted-foreground">Customer Portal / కస్టమర్ పోర్టల్</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="max-w-[150px] truncate">{customer?.identifier}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            My Orders
            <span className="block text-base font-normal text-muted-foreground mt-0.5">నా ఆర్డర్లు</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View all your quotation requests and their current status.
            <span className="block">మీ అన్ని కోటేషన్ అభ్యర్థనలు మరియు వాటి ప్రస్తుత స్థితి చూడండి.</span>
          </p>
        </div>

        {/* Quotations */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !quotations || quotations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-foreground font-medium">No orders yet</p>
              <p className="text-muted-foreground text-sm mt-1">ఇంకా ఆర్డర్లు లేవు</p>
              <Button
                className="mt-4"
                onClick={() => navigate({ to: '/request-quote' })}
              >
                Request a Quote / కోటేషన్ అడగండి
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {quotations.map((q) => {
              const statusInfo = statusConfig[q.status.toString()] || statusConfig.draft;
              const serviceLabel = getServiceLabel(q.serviceType);
              return (
                <Card key={q.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground text-sm">
                            Order #{q.id}
                          </span>
                          <Badge variant={statusInfo.variant} className="text-xs">
                            {statusInfo.label} / {statusInfo.teLabel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {serviceLabel.en} / {serviceLabel.te}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {q.projectDetails}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(q.timestamp)}
                          </span>
                          {q.negotiationHistory.length > 0 && (
                            <span>{q.negotiationHistory.length} message(s)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button onClick={() => navigate({ to: '/request-quote' })} size="lg">
            Request New Quote / కొత్త కోటేషన్ అడగండి
          </Button>
        </div>
      </main>
    </div>
  );
}
