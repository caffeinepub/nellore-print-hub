import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useCreateQuotation } from '../hooks/useQuotations';
import { ServiceType, DesignStatus } from '../backend';
import { haptics } from '../utils/haptics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Printer, CheckCircle, Palette, Clock, Phone, Mail, Loader2 } from 'lucide-react';

export default function QuotationRequestPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const createQuotation = useCreateQuotation();

  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [deadline, setDeadline] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [designStatus, setDesignStatus] = useState<DesignStatus>(DesignStatus.needed);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!serviceType) newErrors.serviceType = t('errorRequired');
    if (!deadline) newErrors.deadline = t('errorRequired');
    if (!projectDetails.trim()) newErrors.projectDetails = t('errorRequired');
    if (!mobileNumber.trim()) newErrors.mobileNumber = t('errorRequired');
    if (!email.trim()) newErrors.email = t('errorRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('errorInvalidEmail');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    haptics.tap();

    try {
      const deadlineDate = new Date(deadline).getTime();
      const id = await createQuotation.mutateAsync({
        serviceType: serviceType as ServiceType,
        deadline: BigInt(deadlineDate),
        projectDetails,
        mobileNumber,
        email,
        designStatus,
      });
      haptics.success();
      navigate({ to: '/quotation-confirmation/$id', params: { id } });
    } catch (err) {
      haptics.error();
    }
  };

  const handleDesignStatusChange = (value: DesignStatus) => {
    setDesignStatus(value);
    haptics.select();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Printer className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('quotationTitle')}</h1>
          <p className="text-muted-foreground">{t('quotationSubtitle')}</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              {t('quotationTitle')}
            </CardTitle>
            <CardDescription>{t('quotationSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-sm font-semibold">
                  {t('serviceType')} *
                </Label>
                <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
                  <SelectTrigger id="serviceType" className={errors.serviceType ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t('selectService')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ServiceType.digital}>{t('digitalPrinting')}</SelectItem>
                    <SelectItem value={ServiceType.banner}>{t('bannerPrinting')}</SelectItem>
                    <SelectItem value={ServiceType.offset}>{t('offsetPrinting')}</SelectItem>
                    <SelectItem value={ServiceType.design}>{t('designServices')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.serviceType && <p className="text-xs text-destructive">{errors.serviceType}</p>}
              </div>

              {/* Project Details */}
              <div className="space-y-2">
                <Label htmlFor="projectDetails" className="text-sm font-semibold">
                  {t('projectDetails')} *
                </Label>
                <Textarea
                  id="projectDetails"
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder={t('projectDetailsPlaceholder')}
                  rows={4}
                  className={errors.projectDetails ? 'border-destructive' : ''}
                />
                {errors.projectDetails && <p className="text-xs text-destructive">{errors.projectDetails}</p>}
              </div>

              {/* Design Status - Toggle Buttons */}
              <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  {t('designStatusQuestion') || 'Is your design ready?'} *
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {/* YES button */}
                  <button
                    type="button"
                    onClick={() => handleDesignStatusChange(DesignStatus.ready)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer select-none ${
                      designStatus === DesignStatus.ready
                        ? 'border-primary bg-primary text-primary-foreground shadow-md scale-[1.02]'
                        : 'border-border bg-background text-foreground hover:border-primary/60 hover:bg-primary/5'
                    }`}
                  >
                    <span className="text-2xl">✅</span>
                    <span>{t('designStatusReady') || 'Yes, Ready'}</span>
                  </button>

                  {/* NO button */}
                  <button
                    type="button"
                    onClick={() => handleDesignStatusChange(DesignStatus.needed)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer select-none ${
                      designStatus === DesignStatus.needed
                        ? 'border-accent bg-accent text-accent-foreground shadow-md scale-[1.02]'
                        : 'border-border bg-background text-foreground hover:border-accent/60 hover:bg-accent/5'
                    }`}
                  >
                    <span className="text-2xl">🎨</span>
                    <span>{t('designStatusNeeded') || 'No, Need Design'}</span>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {designStatus === DesignStatus.ready
                    ? '✓ You will provide your own design files'
                    : '✓ We will create the design for you'}
                </p>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {t('deadline')} *
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.deadline ? 'border-destructive' : ''}
                />
                {errors.deadline && <p className="text-xs text-destructive">{errors.deadline}</p>}
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  {t('mobileNumber')} *
                </Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className={errors.mobileNumber ? 'border-destructive' : ''}
                />
                {errors.mobileNumber && <p className="text-xs text-destructive">{errors.mobileNumber}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {t('email')} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={createQuotation.isPending}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
              >
                {createQuotation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <Printer className="w-5 h-5 mr-2" />
                    {t('submitQuotation')}
                  </>
                )}
              </Button>

              {createQuotation.isError && (
                <p className="text-sm text-destructive text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
