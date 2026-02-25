import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyQuotations, useGetQuotationDetails } from '../hooks/useQuotations';
import { useQuotationResponse } from '../hooks/useQuotationResponse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, CheckCircle, XCircle, MessageSquare, LogIn, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { QuotationStatus, QuotationDetails } from '../backend';
import NegotiationHistory from '../components/NegotiationHistory';

export default function QuotationResponsePage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: quotations, isLoading } = useGetMyQuotations();
  const getDetails = useGetQuotationDetails();
  const respondToQuotation = useQuotationResponse();

  const [quotationDetails, setQuotationDetails] = useState<Record<string, QuotationDetails | null>>({});
  const [negotiateDialogOpen, setNegotiateDialogOpen] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [negotiationMessage, setNegotiationMessage] = useState('');

  const isAuthenticated = !!identity;

  const loadQuotationDetails = async (quotationId: string) => {
    if (!quotationDetails[quotationId]) {
      try {
        const details = await getDetails.mutateAsync(quotationId);
        setQuotationDetails((prev) => ({ ...prev, [quotationId]: details }));
      } catch (error) {
        console.error('Failed to fetch quotation details:', error);
      }
    }
  };

  const handleAccept = async (quotationId: string) => {
    try {
      await respondToQuotation.mutateAsync({
        quotationId,
        status: QuotationStatus.accepted,
      });
      toast.success('Quotation accepted successfully!');
    } catch (error) {
      toast.error('Failed to accept quotation');
      console.error(error);
    }
  };

  const handleReject = async (quotationId: string) => {
    try {
      await respondToQuotation.mutateAsync({
        quotationId,
        status: QuotationStatus.rejected,
      });
      toast.success('Quotation rejected');
    } catch (error) {
      toast.error('Failed to reject quotation');
      console.error(error);
    }
  };

  const handleNegotiate = async () => {
    if (!selectedQuotationId || !negotiationMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await respondToQuotation.mutateAsync({
        quotationId: selectedQuotationId,
        status: QuotationStatus.negotiating,
        message: negotiationMessage,
      });
      toast.success('Negotiation message sent!');
      setNegotiateDialogOpen(false);
      setNegotiationMessage('');
      setSelectedQuotationId(null);
    } catch (error) {
      toast.error('Failed to send negotiation message');
      console.error(error);
    }
  };

  const openNegotiateDialog = (quotationId: string) => {
    setSelectedQuotationId(quotationId);
    setNegotiateDialogOpen(true);
  };

  const handleDownload = (quotation: any) => {
    if (quotation.quotationFileBlob) {
      const url = quotation.quotationFileBlob.getDirectURL();
      const link = document.createElement('a');
      link.href = url;
      link.download = `quotation-${quotation.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Respond to <span className="text-primary">Quotations</span>
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-2xl">
            <Alert>
              <LogIn className="h-5 w-5" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription className="mt-2">
                Please log in to respond to your quotations.
              </AlertDescription>
              <div className="mt-4">
                <Button onClick={login} disabled={loginStatus === 'logging-in'}>
                  {loginStatus === 'logging-in' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </Alert>
          </div>
        </section>
      </div>
    );
  }

  const approvedQuotations = quotations?.filter((q) => {
    const details = quotationDetails[q.id];
    return details?.approved || q.status === 'pendingCustomerResponse';
  }) || [];

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Respond to <span className="text-primary">Quotations</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Review and respond to your approved quotations
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : approvedQuotations.length > 0 ? (
            <div className="space-y-6">
              {approvedQuotations.map((quotation) => {
                const details = quotationDetails[quotation.id];
                if (!details) {
                  loadQuotationDetails(quotation.id);
                }

                return (
                  <Card key={quotation.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">
                          {quotation.serviceType.charAt(0).toUpperCase() + quotation.serviceType.slice(1)} Service
                        </CardTitle>
                        <Badge
                          variant={
                            quotation.status === 'accepted'
                              ? 'default'
                              : quotation.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {quotation.status === 'pendingCustomerResponse' ? 'Pending' : quotation.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {details ? (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Price:</span>
                              <span className="text-2xl font-bold">₹{(Number(details.price) / 100).toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Description:</span>
                              <p className="text-sm text-muted-foreground mt-1">{details.description}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Terms & Conditions:</span>
                              <p className="text-sm text-muted-foreground mt-1">{details.terms}</p>
                            </div>
                          </div>

                          {quotation.quotationFileBlob && (
                            <div className="pt-4 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(quotation)}
                                className="w-full sm:w-auto"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download Quotation File
                              </Button>
                            </div>
                          )}

                          {quotation.negotiationHistory.length > 0 && (
                            <div className="pt-4 border-t">
                              <NegotiationHistory negotiationHistory={quotation.negotiationHistory} />
                            </div>
                          )}

                          {quotation.status === 'pendingCustomerResponse' && (
                            <div className="flex gap-3 pt-4">
                              <Button
                                onClick={() => handleAccept(quotation.id)}
                                disabled={respondToQuotation.isPending}
                                className="flex-1"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(quotation.id)}
                                disabled={respondToQuotation.isPending}
                                className="flex-1"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                              <Dialog open={negotiateDialogOpen && selectedQuotationId === quotation.id} onOpenChange={setNegotiateDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    onClick={() => openNegotiateDialog(quotation.id)}
                                    className="flex-1"
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Negotiate
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Negotiate Quotation</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="negotiation-message">Your Message</Label>
                                      <Textarea
                                        id="negotiation-message"
                                        value={negotiationMessage}
                                        onChange={(e) => setNegotiationMessage(e.target.value)}
                                        placeholder="Enter your negotiation message..."
                                        rows={4}
                                      />
                                    </div>
                                    <Button
                                      onClick={handleNegotiate}
                                      disabled={respondToQuotation.isPending || !negotiationMessage.trim()}
                                      className="w-full"
                                    >
                                      {respondToQuotation.isPending ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Sending...
                                        </>
                                      ) : (
                                        'Send Message'
                                      )}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Approved Quotations</h3>
                <p className="text-muted-foreground">
                  You don't have any approved quotations to respond to yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
