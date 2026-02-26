import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Download,
  Loader2,
  CreditCard,
  Wrench,
  ThumbsUp,
  Clock,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { useGetMyQuotations, useCustomerApproveQuotation } from '../hooks/useQuotations';
import { useQuotationResponse } from '../hooks/useQuotationResponse';
import { useActor } from '../hooks/useActor';
import { QuotationStatus, QuotationDetails, QuotationRequest } from '../backend';
import { toast } from 'sonner';
import { haptics } from '../utils/haptics';
import NegotiationHistory from '../components/NegotiationHistory';
import { useLanguage } from '../contexts/LanguageContext';

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

  const [details, setDetails] = useState<QuotationDetails | null | undefined>(undefined);
  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .getQuotationDetails(quotation.id)
      .then((d) => {
        setDetails(d ?? null);
      })
      .catch(() => {
        setDetails(null);
      });
  }, [actor, quotation.id]);

  const statusKey =
    typeof quotation.status === 'object'
      ? Object.keys(quotation.status)[0]
      : String(quotation.status);

  const statusLabels: Record<string, string> = {
    draft: language === 'te' ? 'డ్రాఫ్ట్' : 'Draft',
    customerPending: language === 'te' ? 'మీ సమీక్ష అవసరం' : 'Awaiting Your Review',
    paymentPending: language === 'te' ? 'చెల్లింపు పెండింగ్' : 'Payment Pending',
    workInProgress: language === 'te' ? 'పని జరుగుతోంది' : 'Work In Progress',
    completed: language === 'te' ? 'పూర్తయింది' : 'Completed',
    accepted: language === 'te' ? 'అంగీకరించబడింది' : 'Accepted',
    rejected: language === 'te' ? 'తిరస్కరించబడింది' : 'Rejected',
    negotiating: language === 'te' ? 'చర్చలో' : 'Negotiating',
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
    <div
      className={`bg-card rounded-2xl border p-6 ${
        isCustomerPending ? 'border-yellow-400 dark:border-yellow-600' : 'border-border'
      }`}
    >
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
            <p className="text-xs text-muted-foreground">
              {language === 'te' ? 'ధర' : 'Price'}
            </p>
            <p className="text-xl font-bold text-primary">
              ₹{Number(details.price).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {language === 'te' ? 'వివరణ' : 'Description'}
            </p>
            <p className="text-sm text-foreground">{details.description}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {language === 'te' ? 'నిబంధనలు' : 'Terms'}
            </p>
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
                {language === 'te' ? 'ఫైల్ డౌన్‌లోడ్ చేయి' : 'Download File'}
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          {language === 'te'
            ? 'ఇంకా కోటేషన్ వివరాలు అందుబాటులో లేవు.'
            : 'No quotation details available yet.'}
        </p>
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
            <Dialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
              <DialogTrigger asChild>
                <Button
                  className="flex-1 gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={isApprovingPrice}
                >
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
                      ? 'మీరు ఈ ధరను ఆమోదించడానికి నిర్ధారిస్తున్నారా?'
                      : 'Are you sure you want to approve this price? After approval, you will need to send payment.'}
                  </p>
                  {details && (
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">
                        {language === 'te' ? 'ఆమోదించే ధర' : 'Price to approve'}
                      </p>
                      <p className="text-xl font-bold text-primary">
                        ₹{Number(details.price).toLocaleString()}
                      </p>
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
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {language === 'te' ? 'ఆమోదిస్తోంది...' : 'Approving...'}
                        </>
                      ) : (
                        <>{language === 'te' ? 'అవును, ఆమోదించండి' : 'Yes, Approve'}</>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={negotiateOpen} onOpenChange={setNegotiateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={isPending} className="flex-1 gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {language === 'te' ? 'చర్చించు' : 'Negotiate'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{language === 'te' ? 'చర్చించు' : 'Negotiate'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label>{language === 'te' ? 'మీ సందేశం' : 'Your Message'}</Label>
                    <Textarea
                      value={negotiationMessage}
                      onChange={(e) => setNegotiationMessage(e.target.value)}
                      placeholder={
                        language === 'te'
                          ? 'మీ చర్చా సందేశం నమోదు చేయండి...'
                          : 'Enter your negotiation message...'
                      }
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleNegotiateSubmit}
                    disabled={isPending}
                    className="w-full"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : language === 'te' ? (
                      'సందేశం పంపండి'
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Payment Pending */}
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
                  ? 'మీరు ధరను ఆమోదించారు. దయచేసి చెల్లింపు పంపండి.'
                  : 'You have approved the price. Please send payment. Work will begin once admin confirms receipt.'}
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
                  ? 'మీ ప్రాజెక్ట్‌పై పని జరుగుతోంది.'
                  : 'Your project is being worked on. We will update you soon.'}
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

      {/* Legacy accept/reject for older statuses */}
      {statusKey === 'pendingCustomerResponse' && (
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            onClick={() => onAccept(quotation.id)}
            disabled={isPending}
            className="flex-1 gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {language === 'te' ? 'అంగీకరించు' : 'Accept'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onReject(quotation.id)}
            disabled={isPending}
            className="flex-1 gap-2"
          >
            <XCircle className="w-4 h-4" />
            {language === 'te' ? 'తిరస్కరించు' : 'Reject'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function QuotationResponsePage() {
  const { language } = useLanguage();
  const { data: quotations, isLoading } = useGetMyQuotations();
  const quotationResponse = useQuotationResponse();
  const approvePrice = useCustomerApproveQuotation();

  const handleAccept = (id: string) => {
    haptics.tap();
    quotationResponse.mutate(
      { quotationId: id, status: QuotationStatus.accepted },
      {
        onSuccess: () => {
          haptics.success();
          toast.success(language === 'te' ? 'కోటేషన్ అంగీకరించబడింది!' : 'Quotation accepted!');
        },
        onError: () => {
          haptics.error();
          toast.error(language === 'te' ? 'విఫలమైంది' : 'Failed. Please try again.');
        },
      }
    );
  };

  const handleReject = (id: string) => {
    haptics.tap();
    quotationResponse.mutate(
      { quotationId: id, status: QuotationStatus.rejected },
      {
        onSuccess: () => {
          haptics.success();
          toast.success(language === 'te' ? 'కోటేషన్ తిరస్కరించబడింది.' : 'Quotation rejected.');
        },
        onError: () => {
          haptics.error();
          toast.error(language === 'te' ? 'విఫలమైంది' : 'Failed. Please try again.');
        },
      }
    );
  };

  const handleNegotiate = (id: string, message: string) => {
    haptics.tap();
    quotationResponse.mutate(
      { quotationId: id, status: QuotationStatus.negotiating, message },
      {
        onSuccess: () => {
          haptics.success();
          toast.success(language === 'te' ? 'సందేశం పంపబడింది!' : 'Message sent!');
        },
        onError: () => {
          haptics.error();
          toast.error(language === 'te' ? 'విఫలమైంది' : 'Failed. Please try again.');
        },
      }
    );
  };

  const handleApprovePrice = (id: string) => {
    haptics.tap();
    approvePrice.mutate(id, {
      onSuccess: () => {
        haptics.success();
        toast.success(
          language === 'te'
            ? 'ధర ఆమోదించబడింది! చెల్లింపు పంపండి.'
            : 'Price approved! Please send payment.'
        );
      },
      onError: () => {
        haptics.error();
        toast.error(language === 'te' ? 'విఫలమైంది' : 'Failed. Please try again.');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6">
        <h1 className="text-xl font-bold text-foreground">
          {language === 'te' ? 'నా కోటేషన్లు' : 'My Quotations'}
        </h1>
      </div>
      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {!quotations || quotations.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {language === 'te' ? 'కోటేషన్లు లేవు' : 'No quotations yet.'}
          </p>
        ) : (
          quotations.map((q) => (
            <QuotationCard
              key={q.id}
              quotation={q}
              onAccept={handleAccept}
              onReject={handleReject}
              onNegotiate={handleNegotiate}
              onApprovePrice={handleApprovePrice}
              isPending={quotationResponse.isPending}
              isApprovingPrice={approvePrice.isPending}
            />
          ))
        )}
      </div>
    </div>
  );
}
