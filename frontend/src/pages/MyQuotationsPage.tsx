import { useLanguage } from '../contexts/LanguageContext';
import { useGetMyQuotations, useGetQuotationDetails } from '../hooks/useQuotations';
import { QuotationRequest } from '../backend';
import { Clock, CheckCircle, XCircle, MessageSquare, FileText, Download, Paperclip } from 'lucide-react';

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

  const statusConfig = {
    pendingCustomerResponse: {
      label: language === 'te' ? 'పెండింగ్' : 'Pending',
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
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
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
  };

  const status = statusConfig[quotation.status as keyof typeof statusConfig];
  const StatusIcon = status?.icon ?? Clock;

  const serviceLabel = {
    design: language === 'te' ? 'డిజైన్ సేవలు' : 'Design Services',
    digital: language === 'te' ? 'డిజిటల్ ప్రింటింగ్' : 'Digital Printing',
    banner: language === 'te' ? 'అవుట్‌డోర్/ఇండోర్ ప్రింటింగ్' : 'Outdoor/Indoor Printing',
    offset: language === 'te' ? 'ఆఫ్‌సెట్ ప్రింటింగ్' : 'Offset Printing',
  }[quotation.serviceType as string] ?? quotation.serviceType;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${status?.bg}`}>
            <StatusIcon className={`w-4 h-4 ${status?.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">#{quotation.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status?.bg} ${status?.color}`}>
                {status?.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{serviceLabel}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(Number(quotation.timestamp) / 1_000_000).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Customer uploaded file indicator */}
        {quotation.quotationFileBlob && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Paperclip className="w-3 h-3" />
            <span>{language === 'te' ? 'ఫైల్ జోడించబడింది' : 'File attached'}</span>
          </div>
        )}

        <QuotationDetailsSection quotationId={quotation.id} />
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
          quotations.map(q => <QuotationCard key={q.id} quotation={q} />)
        )}
      </div>
    </div>
  );
}
