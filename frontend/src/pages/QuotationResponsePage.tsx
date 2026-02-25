import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageSquare, Download, Loader2, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { useGetMyQuotations } from '../hooks/useQuotations';
import { useQuotationResponse } from '../hooks/useQuotationResponse';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { QuotationStatus, QuotationDetails, QuotationRequest } from '../backend';
import { toast } from 'sonner';
import { haptics } from '../utils/haptics';
import NegotiationHistory from '../components/NegotiationHistory';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../translations';

// Sub-component that fetches and displays details for a single quotation
function QuotationCard({
  quotation,
  onAccept,
  onReject,
  onNegotiate,
  isPending,
}: {
  quotation: QuotationRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onNegotiate: (id: string, message: string) => void;
  isPending: boolean;
}) {
  const { actor } = useActor();
  const { language } = useLanguage();
  const t = getTranslations(language);

  const [details, setDetails] = useState<QuotationDetails | null | undefined>(undefined);
  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState('');

  useEffect(() => {
    if (!actor) return;
    actor.getQuotationDetails(quotation.id).then((d) => {
      setDetails(d ?? null);
    }).catch(() => {
      setDetails(null);
    });
  }, [actor, quotation.id]);

  const statusKey = typeof quotation.status === 'object'
    ? Object.keys(quotation.status)[0]
    : String(quotation.status);

  const statusLabels: Record<string, string> = {
    pendingCustomerResponse: t.quotationResponse.pending,
    accepted: t.quotationResponse.accepted,
    rejected: t.quotationResponse.rejected,
    negotiating: t.quotationResponse.negotiating,
  };

  const handleDownload = () => {
    if (quotation.quotationFileBlob) {
      const url = quotation.quotationFileBlob.getDirectURL();
      const link = document.createElement('a');
      link.href = url;
      link.download = `quotation-${quotation.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleNegotiateSubmit = () => {
    if (!negotiationMessage.trim()) {
      toast.error('Please enter a message.');
      return;
    }
    onNegotiate(quotation.id, negotiationMessage.trim());
    setNegotiationMessage('');
    setNegotiateOpen(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground capitalize">
            {quotation.serviceType} Service
          </h3>
          <p className="text-sm text-muted-foreground">ID: {quotation.id}</p>
        </div>
        <Badge
          variant={
            statusKey === 'accepted' ? 'default' :
            statusKey === 'rejected' ? 'destructive' : 'secondary'
          }
        >
          {statusLabels[statusKey] || statusKey}
        </Badge>
      </div>

      {details === undefined ? (
        <Skeleton className="h-20 w-full mb-4" />
      ) : details !== null ? (
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">{t.quotationResponse.price}</p>
            <p className="text-xl font-bold text-primary">₹{Number(details.price).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.quotationResponse.description}</p>
            <p className="text-sm text-foreground">{details.description}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.quotationResponse.terms}</p>
            <p className="text-sm text-foreground">{details.terms}</p>
          </div>
          {details.replyFile && (
            <div className="pt-2">
              <a
                href={details.replyFile.getDirectURL()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Download className="w-4 h-4" />
                {t.quotationResponse.downloadFile}
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">{t.quotationResponse.noDetails}</p>
      )}

      {quotation.quotationFileBlob && (
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            {t.quotationResponse.downloadFile}
          </Button>
        </div>
      )}

      {quotation.negotiationHistory.length > 0 && (
        <div className="mb-4 pt-4 border-t border-border">
          <NegotiationHistory negotiationHistory={quotation.negotiationHistory} />
        </div>
      )}

      {statusKey === 'pendingCustomerResponse' && (
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            onClick={() => onAccept(quotation.id)}
            disabled={isPending}
            className="flex-1 gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {t.quotationResponse.accept}
          </Button>
          <Button
            variant="destructive"
            onClick={() => onReject(quotation.id)}
            disabled={isPending}
            className="flex-1 gap-2"
          >
            <XCircle className="w-4 h-4" />
            {t.quotationResponse.reject}
          </Button>
          <Dialog open={negotiateOpen} onOpenChange={setNegotiateOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={isPending}
                className="flex-1 gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {t.quotationResponse.negotiate}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.quotationResponse.negotiate}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>{t.quotationResponse.negotiationMessage}</Label>
                  <Textarea
                    value={negotiationMessage}
                    onChange={(e) => setNegotiationMessage(e.target.value)}
                    placeholder={t.quotationResponse.negotiationPlaceholder}
                    rows={4}
                  />
                </div>
                <Button onClick={handleNegotiateSubmit} disabled={isPending} className="w-full">
                  {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    t.quotationResponse.sendMessage
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default function QuotationResponsePage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { language } = useLanguage();
  const t = getTranslations(language);

  const isAuthenticated = !!identity;
  const { data: quotations = [], isLoading } = useGetMyQuotations();
  const { mutateAsync: respond, isPending } = useQuotationResponse();

  const handleAccept = async (quotationId: string) => {
    try {
      haptics.success();
      await respond({ quotationId, status: QuotationStatus.accepted });
      toast.success('Quotation accepted!');
    } catch {
      haptics.error();
      toast.error('Failed to accept quotation.');
    }
  };

  const handleReject = async (quotationId: string) => {
    try {
      haptics.tap();
      await respond({ quotationId, status: QuotationStatus.rejected });
      toast.success('Quotation rejected.');
    } catch {
      haptics.error();
      toast.error('Failed to reject quotation.');
    }
  };

  const handleNegotiate = async (quotationId: string, message: string) => {
    try {
      haptics.tap();
      await respond({
        quotationId,
        status: QuotationStatus.negotiating,
        message,
      });
      toast.success('Negotiation message sent!');
    } catch {
      haptics.error();
      toast.error('Failed to send negotiation message.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              {t.quotationResponse.title}
            </h1>
          </div>
        </section>
        <section className="py-16">
          <div className="container max-w-2xl">
            <Alert>
              <LogIn className="h-5 w-5" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription className="mt-2">
                Please log in to respond to your quotations.
              </AlertDescription>
              <div className="mt-4">
                <Button onClick={() => login()} disabled={loginStatus === 'logging-in'}>
                  {loginStatus === 'logging-in' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.common.loggingIn}
                    </>
                  ) : (
                    t.common.login
                  )}
                </Button>
              </div>
            </Alert>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            {t.quotationResponse.title}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Review and respond to your approved quotations
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : quotations.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No quotations found.
            </div>
          ) : (
            <div className="space-y-6">
              {quotations.map((quotation) => (
                <QuotationCard
                  key={quotation.id}
                  quotation={quotation}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onNegotiate={handleNegotiate}
                  isPending={isPending}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
