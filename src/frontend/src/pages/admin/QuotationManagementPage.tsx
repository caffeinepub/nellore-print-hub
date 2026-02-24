import { useState } from 'react';
import { useGetAllQuotations, useAddQuotationDetails, useApproveQuotation } from '../../hooks/useQuotations';
import { useRespondToNegotiation } from '../../hooks/useNegotiation';
import AdminGuard from '../../components/AdminGuard';
import NegotiationHistory from '../../components/NegotiationHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, CheckCircle, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { QuotationRequest } from '../../backend';

export default function QuotationManagementPage() {
  return (
    <AdminGuard>
      <QuotationManagementContent />
    </AdminGuard>
  );
}

function QuotationManagementContent() {
  const { data: quotations, isLoading } = useGetAllQuotations();
  const addDetails = useAddQuotationDetails();
  const approveQuotation = useApproveQuotation();
  const respondToNegotiation = useRespondToNegotiation();

  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRequest | null>(null);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [negotiateDialogOpen, setNegotiateDialogOpen] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState('');

  const handleAddDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuotation) return;

    try {
      await addDetails.mutateAsync({
        quotationId: selectedQuotation.id,
        price: BigInt(Math.floor(parseFloat(price) * 100)),
        description,
        terms,
      });
      toast.success('Quotation details added successfully');
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add quotation details');
      console.error(error);
    }
  };

  const handleApprove = async (quotationId: string) => {
    try {
      await approveQuotation.mutateAsync(quotationId);
      toast.success('Quotation approved successfully');
    } catch (error) {
      toast.error('Failed to approve quotation');
      console.error(error);
    }
  };

  const handleRespondToNegotiation = async () => {
    if (!selectedQuotation || !negotiationMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await respondToNegotiation.mutateAsync({
        quotationId: selectedQuotation.id,
        message: negotiationMessage,
      });
      toast.success('Response sent successfully');
      setNegotiateDialogOpen(false);
      setNegotiationMessage('');
      setSelectedQuotation(null);
    } catch (error) {
      toast.error('Failed to send response');
      console.error(error);
    }
  };

  const resetForm = () => {
    setPrice('');
    setDescription('');
    setTerms('');
    setSelectedQuotation(null);
  };

  const openDialog = (quotation: QuotationRequest) => {
    setSelectedQuotation(quotation);
    setDialogOpen(true);
  };

  const openNegotiateDialog = (quotation: QuotationRequest) => {
    setSelectedQuotation(quotation);
    setNegotiateDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'negotiating':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Quotation <span className="text-primary">Management</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Review and manage customer quotation requests
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quotation Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : quotations && quotations.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotations.map((quotation) => (
                        <TableRow key={quotation.id}>
                          <TableCell className="font-mono text-sm">{quotation.id}</TableCell>
                          <TableCell className="capitalize">{quotation.serviceType}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{quotation.email}</div>
                              <div className="text-muted-foreground">{quotation.mobileNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(Number(quotation.deadline) / 1000000).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(quotation.status)}>
                              {quotation.status === 'pendingCustomerResponse' ? 'Pending' : quotation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 flex-wrap">
                              <Dialog open={dialogOpen && selectedQuotation?.id === quotation.id} onOpenChange={(open) => {
                                setDialogOpen(open);
                                if (!open) resetForm();
                              }}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openDialog(quotation)}
                                  >
                                    Add Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Add Quotation Details</DialogTitle>
                                  </DialogHeader>
                                  <form onSubmit={handleAddDetails} className="space-y-4">
                                    <div className="space-y-2">
                                      <Label>Project Details</Label>
                                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                                        {quotation.projectDetails}
                                      </p>
                                    </div>
                                    {quotation.negotiationHistory.length > 0 && (
                                      <div className="space-y-2">
                                        <NegotiationHistory negotiationHistory={quotation.negotiationHistory} />
                                      </div>
                                    )}
                                    <div className="space-y-2">
                                      <Label htmlFor="price">Price (₹) *</Label>
                                      <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="Enter price"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="description">Description *</Label>
                                      <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe what's included..."
                                        rows={3}
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="terms">Terms & Conditions *</Label>
                                      <Textarea
                                        id="terms"
                                        value={terms}
                                        onChange={(e) => setTerms(e.target.value)}
                                        placeholder="Payment terms, delivery timeline, etc."
                                        rows={3}
                                        required
                                      />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={addDetails.isPending}>
                                      {addDetails.isPending ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Saving...
                                        </>
                                      ) : (
                                        'Save Details'
                                      )}
                                    </Button>
                                  </form>
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(quotation.id)}
                                disabled={approveQuotation.isPending}
                              >
                                {approveQuotation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Approve
                                  </>
                                )}
                              </Button>
                              {quotation.status === 'negotiating' && (
                                <Dialog open={negotiateDialogOpen && selectedQuotation?.id === quotation.id} onOpenChange={(open) => {
                                  setNegotiateDialogOpen(open);
                                  if (!open) {
                                    setNegotiationMessage('');
                                    setSelectedQuotation(null);
                                  }
                                }}>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => openNegotiateDialog(quotation)}
                                    >
                                      <MessageSquare className="mr-1 h-4 w-4" />
                                      Respond
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Respond to Negotiation</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <NegotiationHistory negotiationHistory={quotation.negotiationHistory} />
                                      <div className="space-y-2">
                                        <Label htmlFor="admin-response">Your Response</Label>
                                        <Textarea
                                          id="admin-response"
                                          value={negotiationMessage}
                                          onChange={(e) => setNegotiationMessage(e.target.value)}
                                          placeholder="Enter your response to the customer..."
                                          rows={4}
                                        />
                                      </div>
                                      <Button
                                        onClick={handleRespondToNegotiation}
                                        disabled={respondToNegotiation.isPending || !negotiationMessage.trim()}
                                        className="w-full"
                                      >
                                        {respondToNegotiation.isPending ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                          </>
                                        ) : (
                                          'Send Response'
                                        )}
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Quotation Requests</h3>
                  <p className="text-muted-foreground">
                    Quotation requests will appear here when customers submit them.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
