import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateQuotation } from '../hooks/useQuotations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ServiceType } from '../backend';

export default function QuotationRequestPage() {
  const navigate = useNavigate();
  const createQuotation = useCreateQuotation();

  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [deadline, setDeadline] = useState<Date>();
  const [projectDetails, setProjectDetails] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceType || !deadline || !projectDetails.trim() || !mobileNumber.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const id = await createQuotation.mutateAsync({
        serviceType: serviceType as ServiceType,
        deadline: BigInt(deadline.getTime() * 1000000),
        projectDetails,
        mobileNumber,
        email,
      });
      toast.success('Quotation request submitted successfully!');
      navigate({ to: '/quotation-confirmation/$id', params: { id } });
    } catch (error) {
      toast.error('Failed to submit quotation request');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Request a <span className="text-primary">Quote</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us about your project and we'll provide a custom quotation within 24 hours
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
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
                <div className="space-y-2">
                  <Label htmlFor="service">Service Type *</Label>
                  <Select value={serviceType} onValueChange={(value) => setServiceType(value as ServiceType)}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital Printing</SelectItem>
                      <SelectItem value="banner">Flex & Banner Printing</SelectItem>
                      <SelectItem value="offset">Offset Printing</SelectItem>
                      <SelectItem value="design">Creative Design Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Project Deadline *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={createQuotation.isPending}>
                  {createQuotation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
