import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useCreateQuotation } from '../hooks/useQuotations';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { haptics } from '../utils/haptics';
import { ServiceType, ExternalBlob } from '../backend';
import { Paperclip, X, Upload, FileText } from 'lucide-react';

// Extended service options for display (maps to backend types)
const extendedServiceOptions = [
  { value: ServiceType.design, labelEn: 'Design Services', labelTe: 'డిజైన్ సేవలు' },
  { value: ServiceType.digital, labelEn: 'Digital Printing', labelTe: 'డిజిటల్ ప్రింటింగ్' },
  { value: ServiceType.banner, labelEn: 'Outdoor Printing', labelTe: 'అవుట్‌డోర్ ప్రింటింగ్' },
  { value: ServiceType.banner, labelEn: 'Indoor Printing', labelTe: 'ఇండోర్ ప్రింటింగ్' },
  { value: ServiceType.banner, labelEn: 'Screen Printing & Personalization', labelTe: 'స్క్రీన్ ప్రింటింగ్ & వ్యక్తిగతీకరణ' },
  { value: ServiceType.offset, labelEn: 'Offset Printing', labelTe: 'ఆఫ్‌సెట్ ప్రింటింగ్' },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function QuotationRequestPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const createQuotation = useCreateQuotation();
  const { data: userProfile } = useGetCallerUserProfile();

  const [serviceType, setServiceType] = useState('');
  const [deadline, setDeadline] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [mobileNumber, setMobileNumber] = useState(userProfile?.mobileNumber ?? '');
  const [email, setEmail] = useState(userProfile?.email ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError(language === 'te' ? 'ఫైల్ పరిమాణం 10MB కంటే తక్కువగా ఉండాలి' : 'File size must be less than 10MB');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    haptics.tap();

    // Find the service type value
    const selectedOption = extendedServiceOptions.find(o => o.labelEn === serviceType);
    if (!selectedOption) return;

    let fileBlob: ExternalBlob | null = null;
    if (selectedFile) {
      const bytes = new Uint8Array(await selectedFile.arrayBuffer());
      fileBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
    }

    try {
      const id = await createQuotation.mutateAsync({
        serviceType: selectedOption.value,
        deadline: BigInt(new Date(deadline).getTime() * 1_000_000),
        projectDetails,
        mobileNumber,
        email,
        file: fileBlob,
      });
      haptics.success();
      navigate({ to: '/quotation-confirmation/$id', params: { id } });
    } catch {
      haptics.error();
    }
  };

  const t = {
    title: language === 'te' ? 'కోటేషన్ అభ్యర్థన' : 'Request a Quotation',
    subtitle: language === 'te' ? 'మీ ప్రాజెక్ట్ వివరాలు పూరించండి' : 'Fill in your project details',
    serviceLabel: language === 'te' ? 'సేవ రకం' : 'Service Type',
    servicePlaceholder: language === 'te' ? 'సేవ ఎంచుకోండి' : 'Select a service',
    deadlineLabel: language === 'te' ? 'గడువు తేదీ' : 'Deadline',
    detailsLabel: language === 'te' ? 'ప్రాజెక్ట్ వివరాలు' : 'Project Details',
    detailsPlaceholder: language === 'te' ? 'మీ ప్రాజెక్ట్ గురించి వివరించండి' : 'Describe your project requirements',
    mobileLabel: language === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Number',
    emailLabel: language === 'te' ? 'ఇమెయిల్' : 'Email',
    attachFile: language === 'te' ? 'ఫైల్ జోడించండి' : 'Attach File',
    attachHint: language === 'te' ? 'చిత్రాలు, PDF, Word పత్రాలు (గరిష్టంగా 10MB)' : 'Images, PDF, Word documents (max 10MB)',
    submit: language === 'te' ? 'సమర్పించండి' : 'Submit Request',
    submitting: language === 'te' ? 'సమర్పిస్తోంది...' : 'Submitting...',
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-lg mx-auto space-y-5">
        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t.serviceLabel}</label>
          <select
            value={serviceType}
            onChange={e => setServiceType(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">{t.servicePlaceholder}</option>
            {extendedServiceOptions.map((opt, i) => (
              <option key={i} value={opt.labelEn}>
                {language === 'te' ? opt.labelTe : opt.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t.deadlineLabel}</label>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Project Details */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t.detailsLabel}</label>
          <textarea
            value={projectDetails}
            onChange={e => setProjectDetails(e.target.value)}
            required
            rows={4}
            placeholder={t.detailsPlaceholder}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t.mobileLabel}</label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={e => setMobileNumber(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="+91XXXXXXXXXX"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t.emailLabel}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="you@example.com"
          />
        </div>

        {/* File Attachment */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t.attachFile}</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            {selectedFile ? (
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {createQuotation.isPending && uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-1.5 bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removeFile(); }}
                  className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {language === 'te' ? 'ఫైల్ అప్‌లోడ్ చేయండి' : 'Upload a file'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.attachHint}</p>
                </div>
                <Paperclip className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          {fileError && (
            <p className="text-xs text-destructive mt-1">{fileError}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={createQuotation.isPending}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 text-sm"
        >
          {createQuotation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
              {t.submitting}
            </>
          ) : t.submit}
        </button>

        {createQuotation.isError && (
          <p className="text-xs text-destructive text-center">
            {language === 'te' ? 'సమర్పణ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.' : 'Submission failed. Please try again.'}
          </p>
        )}
      </form>
    </div>
  );
}
