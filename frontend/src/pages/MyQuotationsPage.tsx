import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetMyQuotations, useGetQuotationDetails, useCustomerApproveQuotation } from '../hooks/useQuotations';
import { QuotationRequest, DesignStatus } from '../backend';
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Download,
  Paperclip,
  CreditCard,
  Wrench,
  CircleDot,
  ThumbsUp,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner';

function QuotationDetailsSection({ quotationId }: { quotationId: string }) {
  const { language } = useLanguage();
  const { data: details, isLoading } = useGetQuotationDetails(quotationId);

  if (isLoading) {
    return <div className="animate-pulse h-4 bg-muted rounded w-1/2 mt-2" />;
  }

  if (!details) return null;

  return (
    <div className="mt-3 space-y-2 border-t border-border pt-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{language === 'te' ? 'ధర' : 'Price'}</span>
        <span className="font-semibold text-foreground">₹{(Number(details.price) / 100).toFixed(2)}</span>
      </div>
      {details.description && (
        <div className="bg-muted/30 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">{language === 'te' ? 'వివరణ' : 'Description'}</p>
          <p className="text-sm text-foreground">{details.description}</p>
        </div>
      )}
      {details.terms && (
        <div className="bg-muted/30 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">{language === 'te' ? 'నిబంధనలు' : 'Terms'}</p>
          <p className="text-sm text-foreground">{details.terms}</p>
        </div>
      )}
      {details.replyFile && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 rounded-xl p-3">
          <Paperclip className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="text-xs text-green-700 dark:text-green-300 flex-1">
            {language === 'te' ? 'అడ్మిన్ రిప్లై ఫైల్ అందుబాటులో ఉంది' : 'Admin reply file available'}
          </span>
          <a
            href={details.replyFile.getDirectURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 hover:underline"
          >
            <Download className="w-3 h-3" />
            {language === 'te' ? 'డౌన్‌లోడ్' : 'Download'}
          </a>
        </div>
      )}
    </div>
  );
}

function QuotationCard({ quotation }: { quotation: QuotationRequest }) {
  const { language } = useLanguage();
  const approveQuotation = useCustomerApproveQuotation();

  const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    draft: {
      label: language === 'te' ? 'డ్రాఫ్ట్' : 'Draft',
      icon: CircleDot,
      color: 'text-gray-500',
      bg: 'bg-gray-50 dark:bg-gray-950/30',
    },
    customerPending: {
      label: language === 'te' ? 'మీ సమీక్ష అవసరం' : 'Awaiting Your Review',
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    },
    paymentPending: {
      label: language === 'te' ? 'చెల్లింపు పెండింగ్' : 'Payment Pending',
      icon: CreditCard,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
    },
    workInProgress: {
      label: language === 'te' ? 'పని జరుగుతోంది' : 'Work In Progress',
      icon: Wrench,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    completed: {
      label: language === 'te' ? 'పూర్తయింది' : 'Completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    accepted: {
      label: language === 'te' ? 'ఆమోదించబడింది' : 'Accepted',
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    rejected: {
      label: language === 'te' ? 'తిరస్కరించబడింది' : 'Rejected',
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
    negotiating: {
      label: language === 'te' ? 'చర్చలో' : 'Negotiating',
      icon: MessageSquare,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
    },
  };

  const status = statusConfig[quotation.status as string] ?? {
    label: String(quotation.status),
    icon: Clock,
    color: 'text-gray-500',
    bg: 'bg-gray-50 dark:bg-gray-950/30',
  };
  const StatusIcon = status.icon;

  const serviceLabel = {
    design: language === 'te' ? 'డిజైన్ సేవలు' : 'Design Services',
    digital: language === 'te' ? 'డిజిటల్ ప్రింటింగ్' : 'Digital Printing',
    banner: language === 'te' ? 'అవుట్‌డోర్/ఇండోర్ ప్రింటింగ్' : 'Outdoor/Indoor Printing',
    offset: language === 'te' ? 'ఆఫ్‌సెట్ ప్రింటింగ్' : 'Offset Printing',
  }[quotation.serviceType as string] ?? String(quotation.serviceType);

  const isCustomerPending = quotation.status === 'customerPending';
  const isPaymentPending = quotation.status === 'paymentPending';
  const isWorkInProgress = quotation.status === 'workInProgress';

  const handleApprove = async () => {
    try {
      await approveQuotation.mutateAsync(quotation.id);
      toast.success(
        language === 'te'
          ? 'ధర ఆమోదించబడింది! చెల్లింపు పంపండి.'
          : 'Price approved! Please send payment.'
      );
    } catch {
      toast.error(
        language === 'te' ? 'ఆమోదించడం విఫలమైంది' : 'Failed to approve. Please try again.'
      );
    }
  };

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden ${
      isCustomerPending ? 'border-yellow-400 dark:border-yellow-600' : 'border-border'
    }`}>
      {/* Attention banner for customerPending */}
      {isCustomerPending && (
        <div className="bg-yellow-50 dark:bg-yellow-950/40 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-500 animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
            {language === 'te' ? 'మీ సమీక్ష మరియు ఆమోదం అవసరం!' : 'Your review & approval needed!'}
          </span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${status.bg}`}>
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">#{quotation.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{serviceLabel}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(Number(quotation.timestamp) / 1_000_000).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Design Status */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Palette className="w-3 h-3 text-primary" />
          <span>
            {quotation.designStatus === DesignStatus.ready
              ? (language === 'te' ? 'డిజైన్ సిద్ధంగా ఉంది' : 'Design Ready')
              : (language === 'te' ? 'డిజైన్ సహాయం అవసరం' : 'Design Assistance Needed')}
          </span>
        </div>

        <QuotationDetailsSection quotationId={quotation.id} />

        {/* Customer Pending: Approve Price Button */}
        {isCustomerPending && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground">
              {language === 'te'
                ? 'పై ధర మరియు నిబంధనలు సమీక్షించి, అంగీకరిస్తే ఆమోదించండి.'
                : 'Please review the price and terms above, then approve if you agree.'}
            </p>
            <button
              onClick={handleApprove}
              disabled={approveQuotation.isPending}
              className="w-full py-2.5 bg-yellow-500 text-white rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {approveQuotation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
              {language === 'te' ? 'ధర ఆమోదించండి' : 'Approve Price'}
            </button>
          </div>
        )}

        {/* Payment Pending: Instructions */}
        {isPaymentPending && (
          <div className="mt-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                {language === 'te' ? 'చెల్లింపు పంపండి' : 'Please Send Payment'}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-0.5">
                {language === 'te'
                  ? 'మీరు ధరను ఆమోదించారు. దయచేసి చెల్లింపు పంపండి. అడ్మిన్ చెల్లింపు అందుకున్న తర్వాత పని ప్రారంభిస్తారు.'
                  : 'You have approved the price. Please send payment. Work will begin once admin confirms receipt.'}
              </p>
            </div>
          </div>
        )}

        {/* Work In Progress: Status message */}
        {isWorkInProgress && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 flex items-start gap-2">
            <Wrench className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                {language === 'te' ? 'పని ప్రారంభమైంది!' : 'Work Has Started!'}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5">
                {language === 'te'
                  ? 'మీ ప్రాజెక్ట్‌పై పని జరుగుతోంది. మేము మీకు త్వరలో అప్‌డేట్ చేస్తాము.'
                  : 'Your project is being worked on. We will update you soon.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyQuotationsPage() {
  const { language } = useLanguage();
  const { data: quotations, isLoading } = useGetMyQuotations();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6">
          <h1 className="text-xl font-bold text-foreground">
            {language === 'te' ? 'నా కోటేషన్లు' : 'My Quotations'}
          </h1>
        </div>
        <div className="px-4 py-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
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
        <p className="text-sm text-muted-foreground mt-1">
          {quotations?.length ?? 0} {language === 'te' ? 'కోటేషన్లు' : 'quotations'}
        </p>
      </div>
      <div className="px-4 py-4 space-y-3 max-w-lg mx-auto">
        {!quotations || quotations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{language === 'te' ? 'కోటేషన్లు లేవు' : 'No quotations yet'}</p>
          </div>
        ) : (
          quotations.map((q) => <QuotationCard key={q.id} quotation={q} />)
        )}
      </div>
    </div>
  );
}
