import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageSquare, Download, Loader2, LogIn, CreditCard, Wrench, ThumbsUp, Clock, CircleDot } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { useGetMyQuotations, useCustomerApproveQuotation } from '../hooks/useQuotations';
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
  onApprovePrice,
  isPending,
  isApprovingPrice,
}: {
  quotation: QuotationRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onNegotiate: (id: string, message: string) => void;
  onApprovePrice: (id: string) => void;
  isPending: boolean;
  isApprovingPrice: boolean;
}) {
  const { actor } = useActor();
  const { language } = useLanguage();
  const t = getTranslations(language);

  const [details, setDetails] = useState<QuotationDetails | null | undefined>(undefined);
  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);

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
    draft: language === 'te' ? 'డ్రాఫ్ట్' : 'Draft',
    customerPending: language === 'te' ? 'మీ సమీక్ష అవసరం' : 'Awaiting Your Review',
    paymentPending: language === 'te' ? 'చెల్లింపు పెండింగ్' : 'Payment Pending',
    workInProgress: language === 'te' ? 'పని జరుగుతోంది' : 'Work In Progress',
    completed: language === 'te' ? 'పూర్తయింది' : 'Completed',
    accepted: t.quotationResponse.accepted,
    rejected: t.quotationResponse.rejected,
    negotiating: t.quotationResponse.negotiating,
  };

  const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    draft: 'outline',
    customerPending: 'secondary',
    paymentPending: 'secondary',
    workInProgress: 'default',
    completed: 'default',
    accepted: 'default',
    rejected: 'destructive',
    negotiating: 'secondary',
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

  const handleApproveConfirm = () => {
    onApprovePrice(quotation.id);
    setApproveConfirmOpen(false);
  };

  const isCustomerPending = statusKey === 'customerPending';
  const isPaymentPending = statusKey === 'paymentPending';
  const isWorkInProgress = statusKey === 'workInProgress';
  const isCompleted = statusKey === 'completed';

  return (
    <div className={`bg-card rounded-2xl border p-6 ${
      isCustomerPending ? 'border-yellow-400 dark:border-yellow-600' : 'border-border'
    }`}>
      {/* Attention banner for customerPending */}
      {isCustomerPending && (
        <div className="bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-2 flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-yellow-500 animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
            {language === 'te' ? 'మీ సమీక్ష మరియు ఆమోదం అవసరం!' : 'Your review & approval needed!'}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground capitalize">
            {quotation.serviceType} Service
          </h3>
          <p className="text-sm text-muted-foreground">ID: {quotation.id}</p>
        </div>
        <Badge variant={statusVariant[statusKey] ?? 'secondary'}>
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

      {/* Customer Pending: Approve Price */}
      {isCustomerPending && (
        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-sm text-muted-foreground">
            {language === 'te'
              ? 'పై ధర మరియు నిబంధనలు సమీక్షించి, అంగీకరిస్తే ఆమోదించండి.'
              : 'Please review the price and terms above. If you agree, approve to proceed to payment.'}
          </p>
          <div className="flex gap-3">
            {/* Approve Price */}
            <Dialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 gap-2 bg-yellow-500 hover:bg-yellow-600 text-white" disabled={isApprovingPrice}>
                  <ThumbsUp className="w-4 h-4" />
                  {language === 'te' ? 'ధర ఆమోదించండి' : 'Approve Price'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {language === 'te' ? 'ధర ఆమోదించండి' : 'Approve Price'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <p className="text-sm text-muted-foreground">
                    {language === 'te'
                      ? 'మీరు ఈ ధరను ఆమోదించడానికి నిర్ధారిస్తున్నారా? ఆమోదించిన తర్వాత, మీరు చెల్లింపు పంపాల్సి ఉంటుంది.'
                      : 'Are you sure you want to approve this price? After approval, you will need to send payment to proceed.'}
                  </p>
                  {details && (
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">
                        {language === 'te' ? 'ఆమోదించే ధర' : 'Price to approve'}
                      </p>
                      <p className="text-xl font-bold text-primary">₹{Number(details.price).toLocaleString()}</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setApproveConfirmOpen(false)}
                    >
                      {language === 'te' ? 'రద్దు చేయండి' : 'Cancel'}
                    </Button>
                    <Button
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={handleApproveConfirm}
                      disabled={isApprovingPrice}
                    >
                      {isApprovingPrice ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {language === 'te' ? 'ఆమోదిస్తోంది...' : 'Approving...'}</>
                      ) : (
                        <>{language === 'te' ? 'అవును, ఆమోదించండి' : 'Yes, Approve'}</>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Negotiate */}
            <Dialog open={negotiateOpen} onOpenChange={setNegotiateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={isPending} className="flex-1 gap-2">
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
        </div>
      )}

      {/* Payment Pending: Instructions */}
      {isPaymentPending && (
        <div className="pt-4 border-t border-border">
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4 flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                {language === 'te' ? 'చెల్లింపు పంపండి' : 'Please Send Payment'}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                {language === 'te'
                  ? 'మీరు ధరను ఆమోదించారు. దయచేసి చెల్లింపు పంపండి. అడ్మిన్ చెల్లింపు అందుకున్న తర్వాత పని ప్రారంభిస్తారు.'
                  : 'You have approved the price. Please send payment. Work will begin once admin confirms receipt of payment.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Work In Progress */}
      {isWorkInProgress && (
        <div className="pt-4 border-t border-border">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 flex items-start gap-3">
            <Wrench className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                {language === 'te' ? 'పని ప్రారంభమైంది!' : 'Work Has Started!'}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                {language === 'te'
                  ? 'మీ ప్రాజెక్ట్‌పై పని జరుగుతోంది. మేము మీకు త్వరలో అప్‌డేట్ చేస్తాము.'
                  : 'Your project is being worked on. We will update you soon with progress.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Completed */}
      {isCompleted && (
        <div className="pt-4 border-t border-border">
          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                {language === 'te' ? 'పూర్తయింది!' : 'Completed!'}
              </p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                {language === 'te'
                  ? 'మీ ప్రాజెక్ట్ పూర్తయింది. ధన్యవాదాలు!'
                  : 'Your project has been completed. Thank you for your business!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legacy: pendingCustomerResponse accept/reject/negotiate */}
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
              <Button variant="outline" disabled={isPending} className="flex-1 gap-2">
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
  const { mutateAsync: approvePrice, isPending: isApprovingPrice } = useCustomerApproveQuotation();

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

  const handleApprovePrice = async (quotationId: string) => {
    try {
      haptics.success();
      await approvePrice(quotationId);
      toast.success(
        language === 'te'
          ? 'ధర ఆమోదించబడింది! దయచేసి చెల్లింపు పంపండి.'
          : 'Price approved! Please send payment.'
      );
    } catch {
      haptics.error();
      toast.error(
        language === 'te' ? 'ఆమోదించడం విఫలమైంది' : 'Failed to approve price.'
      );
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
            {language === 'te'
              ? 'మీ కోటేషన్లను సమీక్షించి స్పందించండి'
              : 'Review and respond to your quotations'}
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
              {language === 'te' ? 'కోటేషన్లు లేవు.' : 'No quotations found.'}
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
                  onApprovePrice={handleApprovePrice}
                  isPending={isPending}
                  isApprovingPrice={isApprovingPrice}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
