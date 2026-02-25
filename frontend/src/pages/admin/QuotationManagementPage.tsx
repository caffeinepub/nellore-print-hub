import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGetAllQuotations, useAddQuotationDetails, useApproveQuotation, useGetOverdueQuotations } from '../../hooks/useQuotations';
import { useRespondToNegotiation } from '../../hooks/useNegotiation';
import AdminGuard from '../../components/AdminGuard';
import NegotiationHistory from '../../components/NegotiationHistory';
import { QuotationRequest, ExternalBlob } from '../../backend';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Download,
  Upload,
  Paperclip,
} from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function QuotationCard({
  quotation,
  isOverdue,
}: {
  quotation: QuotationRequest;
  isOverdue: boolean;
}) {
  const { language } = useLanguage();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const addDetails = useAddQuotationDetails();
  const approveQuotation = useApproveQuotation();
  const respondToNegotiation = useRespondToNegotiation();

  const [expanded, setExpanded] = useState(false);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [negotiationReply, setNegotiationReply] = useState('');
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [replyFileError, setReplyFileError] = useState('');
  const [uploadingReply, setUploadingReply] = useState(false);
  const [replyUploadProgress, setReplyUploadProgress] = useState(0);

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

  const handleAddDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDetails.mutateAsync({
      quotationId: quotation.id,
      price: BigInt(Math.round(parseFloat(price) * 100)),
      description,
      terms,
    });
    setPrice('');
    setDescription('');
    setTerms('');
  };

  const handleNegotiationReply = async (e: React.FormEvent) => {
    e.preventDefault();
    await respondToNegotiation.mutateAsync({
      quotationId: quotation.id,
      message: negotiationReply,
    });
    setNegotiationReply('');
  };

  const handleReplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setReplyFileError('');
    if (!file) { setReplyFile(null); return; }
    if (file.size > MAX_FILE_SIZE) {
      setReplyFileError(language === 'te' ? 'ఫైల్ పరిమాణం 10MB కంటే తక్కువగా ఉండాలి' : 'File size must be less than 10MB');
      setReplyFile(null);
      return;
    }
    setReplyFile(file);
  };

  const handleUploadReplyFile = async () => {
    if (!replyFile || !actor) return;
    setUploadingReply(true);
    setReplyUploadProgress(0);
    try {
      const bytes = new Uint8Array(await replyFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setReplyUploadProgress(pct);
      });
      await actor.addReplyFile(quotation.id, blob);
      queryClient.invalidateQueries({ queryKey: ['allQuotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotationDetails', quotation.id] });
      setReplyFile(null);
    } catch {
      setReplyFileError(language === 'te' ? 'ఫైల్ అప్‌లోడ్ విఫలమైంది' : 'File upload failed');
    } finally {
      setUploadingReply(false);
    }
  };

  const serviceLabel = {
    design: language === 'te' ? 'డిజైన్ సేవలు' : 'Design Services',
    digital: language === 'te' ? 'డిజిటల్ ప్రింటింగ్' : 'Digital Printing',
    banner: language === 'te' ? 'అవుట్‌డోర్ ప్రింటింగ్' : 'Outdoor/Indoor Printing',
    offset: language === 'te' ? 'ఆఫ్‌సెట్ ప్రింటింగ్' : 'Offset Printing',
  }[quotation.serviceType as string] ?? quotation.serviceType;

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden transition-all ${
      isOverdue ? 'border-red-400 dark:border-red-600' : 'border-border'
    }`}>
      {/* Overdue Badge */}
      {isOverdue && (
        <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-800 px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
            {language === 'te' ? 'అత్యవసరం: 1 గంట కంటే ఎక్కువ పెండింగ్‌లో ఉంది' : 'Urgent: Pending for more than 1 hour'}
          </span>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
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
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {serviceLabel} · {quotation.email}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{language === 'te' ? 'సేవ' : 'Service'}</span>
              <span className="font-medium text-foreground">{serviceLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{language === 'te' ? 'మొబైల్' : 'Mobile'}</span>
              <span className="font-medium text-foreground">{quotation.mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{language === 'te' ? 'గడువు' : 'Deadline'}</span>
              <span className="font-medium text-foreground">
                {new Date(Number(quotation.deadline) / 1_000_000).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">{language === 'te' ? 'ప్రాజెక్ట్ వివరాలు' : 'Project Details'}</p>
            <p className="text-sm text-foreground">{quotation.projectDetails}</p>
          </div>

          {/* Customer File */}
          {quotation.quotationFileBlob && (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3">
              <Paperclip className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-xs text-blue-700 dark:text-blue-300 flex-1">
                {language === 'te' ? 'కస్టమర్ ఫైల్ జోడించబడింది' : 'Customer file attached'}
              </span>
              <a
                href={quotation.quotationFileBlob.getDirectURL()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Download className="w-3 h-3" />
                {language === 'te' ? 'డౌన్‌లోడ్' : 'Download'}
              </a>
            </div>
          )}

          {/* Negotiation History */}
          {quotation.negotiationHistory.length > 0 && (
            <NegotiationHistory negotiationHistory={quotation.negotiationHistory} />
          )}

          {/* Negotiation Reply */}
          {quotation.status === 'negotiating' && (
            <form onSubmit={handleNegotiationReply} className="space-y-2">
              <textarea
                value={negotiationReply}
                onChange={e => setNegotiationReply(e.target.value)}
                placeholder={language === 'te' ? 'చర్చ సందేశం...' : 'Negotiation reply...'}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button
                type="submit"
                disabled={respondToNegotiation.isPending || !negotiationReply.trim()}
                className="w-full py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {respondToNegotiation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto" />
                ) : (language === 'te' ? 'సమాధానం పంపండి' : 'Send Reply')}
              </button>
            </form>
          )}

          {/* Add Quotation Details */}
          <form onSubmit={handleAddDetails} className="space-y-3 border-t border-border pt-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {language === 'te' ? 'కోటేషన్ వివరాలు జోడించండి' : 'Add Quotation Details'}
            </p>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder={language === 'te' ? 'ధర (₹)' : 'Price (₹)'}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={language === 'te' ? 'వివరణ' : 'Description'}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <textarea
              value={terms}
              onChange={e => setTerms(e.target.value)}
              placeholder={language === 'te' ? 'నిబంధనలు' : 'Terms & Conditions'}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <button
              type="submit"
              disabled={addDetails.isPending || !price || !description || !terms}
              className="w-full py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {addDetails.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mx-auto" />
              ) : (language === 'te' ? 'వివరాలు జోడించండి' : 'Add Details')}
            </button>
          </form>

          {/* Reply File Upload */}
          <div className="border-t border-border pt-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {language === 'te' ? 'రిప్లై ఫైల్ అప్‌లోడ్' : 'Upload Reply File'}
            </p>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {replyFile ? replyFile.name : (language === 'te' ? 'ఫైల్ ఎంచుకోండి' : 'Choose file')}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf,.doc,.docx"
                  onChange={handleReplyFileChange}
                  className="hidden"
                />
              </label>
              {replyFile && (
                <button
                  onClick={handleUploadReplyFile}
                  disabled={uploadingReply}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-1"
                >
                  {uploadingReply ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground" />
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                  {language === 'te' ? 'అప్‌లోడ్' : 'Upload'}
                </button>
              )}
            </div>
            {uploadingReply && replyUploadProgress > 0 && replyUploadProgress < 100 && (
              <div className="bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${replyUploadProgress}%` }}
                />
              </div>
            )}
            {replyFileError && (
              <p className="text-xs text-destructive">{replyFileError}</p>
            )}
          </div>

          {/* Approve */}
          <button
            onClick={() => approveQuotation.mutate(quotation.id)}
            disabled={approveQuotation.isPending}
            className="w-full py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {approveQuotation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {language === 'te' ? 'ఆమోదించండి' : 'Approve Quotation'}
          </button>
        </div>
      )}
    </div>
  );
}

function QuotationManagementContent() {
  const { language } = useLanguage();
  const { data: quotations, isLoading } = useGetAllQuotations();
  const { data: overdueIds } = useGetOverdueQuotations();

  const overdueSet = new Set(overdueIds ?? []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6">
          <h1 className="text-xl font-bold text-foreground">
            {language === 'te' ? 'కోటేషన్ నిర్వహణ' : 'Quotation Management'}
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

  const sorted = [...(quotations ?? [])].sort((a, b) => {
    const aOverdue = overdueSet.has(a.id) ? 0 : 1;
    const bOverdue = overdueSet.has(b.id) ? 0 : 1;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    return Number(b.timestamp) - Number(a.timestamp);
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6">
        <h1 className="text-xl font-bold text-foreground">
          {language === 'te' ? 'కోటేషన్ నిర్వహణ' : 'Quotation Management'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {quotations?.length ?? 0} {language === 'te' ? 'కోటేషన్లు' : 'quotations'}
          {overdueSet.size > 0 && (
            <span className="ml-2 text-red-500 font-medium">
              · {overdueSet.size} {language === 'te' ? 'అత్యవసరం' : 'overdue'}
            </span>
          )}
        </p>
      </div>
      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{language === 'te' ? 'కోటేషన్లు లేవు' : 'No quotations yet'}</p>
          </div>
        ) : (
          sorted.map(q => (
            <QuotationCard
              key={q.id}
              quotation={q}
              isOverdue={overdueSet.has(q.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function QuotationManagementPage() {
  return (
    <AdminGuard>
      <QuotationManagementContent />
    </AdminGuard>
  );
}
