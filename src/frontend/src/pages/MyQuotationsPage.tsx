import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyQuotations, useGetQuotationDetails } from '../hooks/useQuotations';
import { useGetOfficeLocation } from '../hooks/useOfficeLocation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, MapPin, ExternalLink, LogIn, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { QuotationDetails } from '../backend';

export default function MyQuotationsPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: quotations, isLoading } = useGetMyQuotations();
  const { data: officeLocation } = useGetOfficeLocation();
  const getDetails = useGetQuotationDetails();

  const [expandedQuotation, setExpandedQuotation] = useState<string | null>(null);
  const [quotationDetails, setQuotationDetails] = useState<Record<string, QuotationDetails | null>>({});

  const isAuthenticated = !!identity;

  const handleViewDetails = async (quotationId: string) => {
    if (expandedQuotation === quotationId) {
      setExpandedQuotation(null);
      return;
    }

    if (!quotationDetails[quotationId]) {
      try {
        const details = await getDetails.mutateAsync(quotationId);
        setQuotationDetails((prev) => ({ ...prev, [quotationId]: details }));
      } catch (error) {
        console.error('Failed to fetch quotation details:', error);
      }
    }
    setExpandedQuotation(quotationId);
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

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              My <span className="text-primary">Quotations</span>
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-2xl">
            <Alert>
              <LogIn className="h-5 w-5" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription className="mt-2">
                Please log in to view your quotation requests.
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

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            My <span className="text-primary">Quotations</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            View and manage your quotation requests
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-5xl space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : quotations && quotations.length > 0 ? (
            quotations.map((quotation) => {
              const details = quotationDetails[quotation.id];
              const isExpanded = expandedQuotation === quotation.id;
              const isApproved = details?.approved;

              return (
                <Card key={quotation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Request #{quotation.id}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Service: <span className="capitalize font-medium">{quotation.serviceType}</span>
                        </p>
                      </div>
                      <Badge variant={getStatusColor(quotation.status)}>
                        {quotation.status === 'pendingCustomerResponse' ? 'Pending' : quotation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                        <p className="text-sm">
                          {new Date(Number(quotation.deadline) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                        <p className="text-sm">
                          {new Date(Number(quotation.timestamp) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Project Details</p>
                      <p className="text-sm bg-muted p-3 rounded">{quotation.projectDetails}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(quotation.id)}
                        disabled={getDetails.isPending}
                      >
                        {getDetails.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isExpanded ? (
                          'Hide Details'
                        ) : (
                          'View Details'
                        )}
                      </Button>
                      {quotation.status === 'pendingCustomerResponse' && isApproved && (
                        <Link to="/quotations/respond">
                          <Button size="sm">Respond to Quotation</Button>
                        </Link>
                      )}
                    </div>

                    {isExpanded && details && (
                      <div className="pt-4 border-t space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Price</p>
                          <p className="text-lg font-semibold">
                            ₹{(Number(details.price) / 100).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                          <p className="text-sm">{details.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Terms & Conditions</p>
                          <p className="text-sm">{details.terms}</p>
                        </div>
                        {details.approved && (
                          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                              ✓ Quotation Approved
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300">
                              Approved on{' '}
                              {details.approvalTimestamp
                                ? new Date(Number(details.approvalTimestamp) / 1000000).toLocaleDateString()
                                : 'N/A'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {isApproved && quotation.status === 'accepted' && officeLocation && (
                      <div className="pt-4 border-t">
                        <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Office Location
                          </h4>
                          <p className="text-sm">{officeLocation.address}</p>
                          <a
                            href={`https://www.google.com/maps?q=${officeLocation.lat},${officeLocation.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            View on Google Maps
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Quotations Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't submitted any quotation requests yet.
                </p>
                <Link to="/request-quote">
                  <Button>Request a Quote</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
