import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDeliveryConfig, useSetDeliveryConfig } from '../../hooks/useDelivery';
import AdminGuard from '../../components/AdminGuard';
import { Save, Truck, CheckCircle, AlertCircle } from 'lucide-react';

function DeliveryConfigForm() {
  const { language } = useLanguage();
  const { data: config, isLoading } = useDeliveryConfig();
  const setConfig = useSetDeliveryConfig();

  const [perKmRate, setPerKmRate] = useState('');
  const [minimumFee, setMinimumFee] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) {
      // Backend stores in paise (1/100 rupee), display in rupees
      setPerKmRate((Number(config.perKmRate) / 100).toString());
      setMinimumFee((Number(config.minimumFee) / 100).toString());
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rateVal = parseFloat(perKmRate);
    const feeVal = parseFloat(minimumFee);
    if (isNaN(rateVal) || rateVal <= 0 || isNaN(feeVal) || feeVal <= 0) return;

    try {
      await setConfig.mutateAsync({
        perKmRate: BigInt(Math.round(rateVal * 100)),
        minimumFee: BigInt(Math.round(feeVal * 100)),
      });
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
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {language === 'te' ? 'కి.మీ కి ధర (₹)' : 'Per Km Rate (₹)'}
        </label>
        <input
          type="number"
          value={perKmRate}
          onChange={e => setPerKmRate(e.target.value)}
          required
          min="0.01"
          step="0.01"
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="10.00"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'te' ? 'ప్రతి కిలోమీటర్‌కు రూపాయలలో ధర' : 'Price in rupees per kilometer'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {language === 'te' ? 'కనీస రుసుము (₹)' : 'Minimum Fee (₹)'}
        </label>
        <input
          type="number"
          value={minimumFee}
          onChange={e => setMinimumFee(e.target.value)}
          required
          min="0.01"
          step="0.01"
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="100.00"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'te' ? 'కనీస డెలివరీ రుసుము రూపాయలలో' : 'Minimum delivery fee in rupees'}
        </p>
      </div>

      {setConfig.isError && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {language === 'te' ? 'అప్‌డేట్ విఫలమైంది' : 'Update failed. Please try again.'}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 dark:bg-green-950/30 rounded-xl px-3 py-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {language === 'te' ? 'విజయవంతంగా సేవ్ చేయబడింది!' : 'Delivery config saved successfully!'}
        </div>
      )}

      <button
        type="submit"
        disabled={setConfig.isPending}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {setConfig.isPending ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {language === 'te' ? 'సేవ్ చేయండి' : 'Save Changes'}
      </button>
    </form>
  );
}

export default function DeliveryConfigManagementPage() {
  const { language } = useLanguage();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background pb-24">
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {language === 'te' ? 'డెలివరీ ధర నిర్వహణ' : 'Delivery Pricing Management'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === 'te' ? 'డెలివరీ ధరలను అప్‌డేట్ చేయండి' : 'Update delivery pricing configuration'}
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 py-6 max-w-lg mx-auto">
          <div className="bg-card border border-border rounded-2xl p-5">
            <DeliveryConfigForm />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
