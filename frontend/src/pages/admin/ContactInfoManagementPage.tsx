import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGetContactInfo, useUpdateContactInfo } from '../../hooks/useContactInfo';
import AdminGuard from '../../components/AdminGuard';
import { Save, Mail, Phone, MapPin, Map, CheckCircle, AlertCircle } from 'lucide-react';

function ContactInfoForm() {
  const { language } = useLanguage();
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const updateMutation = useUpdateContactInfo();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (contactInfo) {
      setEmail(contactInfo.email);
      setPhone(contactInfo.phone);
      setPhysicalAddress(contactInfo.physicalAddress);
      setMapsLink(contactInfo.mapsLink);
    }
  }, [contactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ email, phone, physicalAddress, mapsLink });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // error handled by mutation state
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
          <Mail className="w-4 h-4 text-blue-500" />
          {language === 'te' ? 'ఇమెయిల్' : 'Email'}
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="email@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
          <Phone className="w-4 h-4 text-green-500" />
          {language === 'te' ? 'ఫోన్ నంబర్' : 'Phone Number'}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="+91XXXXXXXXXX"
        />
      </div>

      {/* Physical Address */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
          <MapPin className="w-4 h-4 text-orange-500" />
          {language === 'te' ? 'భౌతిక చిరునామా' : 'Physical Address'}
        </label>
        <textarea
          value={physicalAddress}
          onChange={e => setPhysicalAddress(e.target.value)}
          required
          rows={2}
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          placeholder="Street, City, State"
        />
      </div>

      {/* Maps Link */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
          <Map className="w-4 h-4 text-red-500" />
          {language === 'te' ? 'గూగుల్ మ్యాప్స్ లింక్' : 'Google Maps Link'}
        </label>
        <input
          type="url"
          value={mapsLink}
          onChange={e => setMapsLink(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="https://maps.app.goo.gl/..."
        />
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'te'
            ? 'గూగుల్ మ్యాప్స్ నుండి షేర్ లింక్ పేస్ట్ చేయండి'
            : 'Paste the share link from Google Maps'}
        </p>
      </div>

      {/* Status messages */}
      {updateMutation.isError && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {language === 'te' ? 'అప్‌డేట్ విఫలమైంది' : 'Update failed. Please try again.'}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 dark:bg-green-950/30 rounded-xl px-3 py-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {language === 'te' ? 'విజయవంతంగా సేవ్ చేయబడింది!' : 'Contact info saved successfully!'}
        </div>
      )}

      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {updateMutation.isPending ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {language === 'te' ? 'సేవ్ చేయండి' : 'Save Changes'}
      </button>
    </form>
  );
}

export default function ContactInfoManagementPage() {
  const { language } = useLanguage();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background pb-24">
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6">
          <h1 className="text-xl font-bold text-foreground">
            {language === 'te' ? 'సంప్రదింపు సమాచారం నిర్వహణ' : 'Contact Info Management'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'te'
              ? 'పబ్లిక్ సంప్రదింపు వివరాలను అప్‌డేట్ చేయండి'
              : 'Update the public-facing contact details'}
          </p>
        </div>
        <div className="px-4 py-6 max-w-lg mx-auto">
          <div className="bg-card border border-border rounded-2xl p-5">
            <ContactInfoForm />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
