import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateQuotation } from '../hooks/useQuotations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ServiceType } from '../backend';
import BottomSheetSelect from '../components/BottomSheetSelect';
import { haptics } from '../utils/haptics';

export default function QuotationRequestPage() {
  const navigate = useNavigate();
  const createQuotation = useCreateQuotation();

  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [deadline, setDeadline] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');

  const serviceOptions = [
    { value: 'digital', label: 'Digital Printing' },
    { value: 'banner', label: 'Flex & Banner Printing' },
    { value: 'offset', label: 'Offset Printing' },
    { value: 'design', label: 'Creative Design Services' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceType || !deadline || !projectDetails.trim() || !mobileNumber.trim() || !email.trim()) {
      haptics.error();
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const deadlineDate = new Date(deadline);
      const id = await createQuotation.mutateAsync({
        serviceType: serviceType as ServiceType,
        deadline: BigInt(deadlineDate.getTime() * 1000000),
        projectDetails,
        mobileNumber,
        email,
      });
      haptics.success();
      toast.success('Quotation request submitted successfully!');
      navigate({ to: '/quotation-confirmation/$id', params: { id } });
    } catch (error) {
      haptics.error();
      toast.error('Failed to submit quotation request. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16 px-4">
        <div className="container text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Request a <span className="text-primary">Quote</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell us about your project and we'll provide a custom quotation within 24 hours
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12 px-4 flex-1">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Fill in the information below and our team will review your requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <BottomSheetSelect
                  label="Service Type"
                  value={serviceType}
                  onValueChange={(value) => setServiceType(value as ServiceType)}
                  options={serviceOptions}
                  placeholder="Select a service"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="deadline">Project Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Project Details *</Label>
                  <Textarea
                    id="details"
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder="Describe your project requirements, quantity, size, colors, etc."
                    rows={5}
                    required
                    className="text-base resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    inputMode="tel"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    inputMode="email"
                    className="h-12 text-base"
                  />
                </div>

                <Button type="submit" className="w-full min-h-[48px] text-base" size="lg" disabled={createQuotation.isPending}>
                  {createQuotation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
