import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDeliveryConfig, useCalculateDeliveryFee } from '../hooks/useDelivery';
import { haptics } from '../utils/haptics';
import { Truck, MapPin, Clock, Calculator, Info } from 'lucide-react';

export default function DeliveryInfoPage() {
  const { language } = useLanguage();
  const [distance, setDistance] = useState('');
  const [calculatedFee, setCalculatedFee] = useState<bigint | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: deliveryConfig, isLoading: configLoading } = useDeliveryConfig();
  const calculateFee = useCalculateDeliveryFee();

  const perKmRate = deliveryConfig ? Number(deliveryConfig.perKmRate) / 100 : 10;
  const minimumFee = deliveryConfig ? Number(deliveryConfig.minimumFee) / 100 : 100;

  const handleCalculate = async () => {
    const dist = parseFloat(distance);
    if (isNaN(dist) || dist <= 0) return;
    haptics.tap();
    setIsCalculating(true);
    try {
      const fee = await calculateFee.mutateAsync(BigInt(Math.round(dist)));
      setCalculatedFee(fee);
      haptics.success();
    } catch {
      haptics.error();
    } finally {
      setIsCalculating(false);
    }
  };

  const t = {
    title: language === 'te' ? 'డెలివరీ సమాచారం' : 'Delivery Information',
    subtitle: language === 'te' ? 'మా డెలివరీ సేవలు మరియు ధరలు' : 'Our delivery services and pricing',
    perKm: language === 'te' ? 'కి.మీ కి ధర' : 'Rate per km',
    minFee: language === 'te' ? 'కనీస రుసుము' : 'Minimum Fee',
    calculator: language === 'te' ? 'డెలివరీ రుసుము కాలిక్యులేటర్' : 'Delivery Fee Calculator',
    distanceLabel: language === 'te' ? 'దూరం (కి.మీ)' : 'Distance (km)',
    calculate: language === 'te' ? 'లెక్కించండి' : 'Calculate',
    estimatedFee: language === 'te' ? 'అంచనా రుసుము' : 'Estimated Fee',
    serviceArea: language === 'te' ? 'సేవా ప్రాంతం' : 'Service Area',
    serviceAreaDesc: language === 'te'
      ? 'నెల్లూరు మరియు చుట్టుపక్కల ప్రాంతాలకు డెలివరీ అందుబాటులో ఉంది'
      : 'Delivery available in Nellore and surrounding areas',
    timing: language === 'te' ? 'డెలివరీ సమయం' : 'Delivery Timing',
    timingDesc: language === 'te'
      ? 'సాధారణంగా 1-3 పని దినాలలో డెలివరీ'
      : 'Usually delivered within 1-3 business days',
    formula: language === 'te' ? 'ధర సూత్రం' : 'Pricing Formula',
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
          <Truck className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{t.title}</h1>
        <p className="text-muted-foreground text-sm">{t.subtitle}</p>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">

        {/* Pricing Info */}
        {configLoading ? (
          <div className="bg-card border border-border rounded-2xl p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-3" />
            <div className="h-8 bg-muted rounded w-1/3" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              {t.formula}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t.perKm}</p>
                <p className="text-xl font-bold text-primary">₹{perKmRate}</p>
              </div>
              <div className="bg-accent/10 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t.minFee}</p>
                <p className="text-xl font-bold text-foreground">₹{minimumFee}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {language === 'te'
                ? `ధర = దూరం × ₹${perKmRate}/కి.మీ (కనీసం ₹${minimumFee})`
                : `Fee = Distance × ₹${perKmRate}/km (minimum ₹${minimumFee})`}
            </p>
          </div>
        )}

        {/* Calculator */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            {t.calculator}
          </h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={distance}
              onChange={e => setDistance(e.target.value)}
              placeholder={t.distanceLabel}
              min="1"
              className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleCalculate}
              disabled={isCalculating || !distance}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isCalculating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
              ) : t.calculate}
            </button>
          </div>
          {calculatedFee !== null && (
            <div className="mt-3 bg-primary/5 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">{t.estimatedFee}</p>
              <p className="text-2xl font-bold text-primary">
                ₹{(Number(calculatedFee) / 100).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Service Area */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{t.serviceArea}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t.serviceAreaDesc}</p>
            </div>
          </div>
        </div>

        {/* Timing */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{t.timing}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t.timingDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
