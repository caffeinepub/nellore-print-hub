import { useParams, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Smartphone, CreditCard, Bell } from 'lucide-react';

export default function QuotationConfirmationPage() {
  const { id } = useParams({ from: '/quotation-confirmation/$id' });

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Request <span className="text-primary">Submitted</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your quotation request has been received successfully
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Request ID: {id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">What Happens Next?</h3>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                      1
                    </span>
                    <span>Our team will review your requirements and create a custom quotation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                      2
                    </span>
                    <span>You'll receive a message/email notification when the owner approves your quotation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                      3
                    </span>
                    <span>You can accept, reject, or negotiate the quotation through your response page</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                      4
                    </span>
                    <span>Once approved, we'll share our office location and begin working on your project</span>
                  </li>
                </ol>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notification Process
                </h3>
                <p className="text-muted-foreground mb-4">
                  After the owner reviews and approves your quotation, you will receive a notification with options to:
                </p>
                <div className="space-y-2 pl-7">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Accept the quotation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">Reject the quotation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Negotiate with a counter-offer</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Contact Information
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your quotation will be sent directly to:
                </p>
                <div className="space-y-2 pl-7">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Your Mobile Number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Your Email Address</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                After you approve your quotation, you can choose from flexible payment options:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>50% Deposit</strong>
                    <p className="text-sm text-muted-foreground">Pay half upfront, balance on delivery</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>100% Upfront</strong>
                    <p className="text-sm text-muted-foreground">Full payment before production begins</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Custom Amount</strong>
                    <p className="text-sm text-muted-foreground">Agreed-upon payment terms for your project</p>
                  </div>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground pt-2 border-t">
                Payment options will be enabled immediately after you approve your quotation.
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/">
              <Button size="lg">Return to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
