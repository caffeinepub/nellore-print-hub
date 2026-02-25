import { Link } from '@tanstack/react-router';
import { useGetMyQuotations } from '../hooks/useQuotations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Download, FileText } from 'lucide-react';
import { useGetOfficeLocation } from '../hooks/useOfficeLocation';
import SkeletonCard from '../components/SkeletonCard';

export default function MyQuotationsPage() {
  const { data: quotations, isLoading } = useGetMyQuotations();
  const { data: officeLocation } = useGetOfficeLocation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'rejected':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'negotiating':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendingCustomerResponse':
        return 'Pending Response';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'negotiating':
        return 'Negotiating';
      default:
        return status;
    }
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

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16 px-4">
        <div className="container text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            My <span className="text-primary">Quotations</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Track and manage your quotation requests
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12 px-4 flex-1">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="space-y-6 animate-fade-in">
              {[...Array(3)].map((_, idx) => (
                <SkeletonCard key={idx} variant="quotation" />
              ))}
            </div>
          ) : quotations && quotations.length > 0 ? (
            <div className="space-y-6 animate-fade-in">
              {quotations.map((quotation) => (
                <Card key={quotation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl">
                        {quotation.serviceType.charAt(0).toUpperCase() + quotation.serviceType.slice(1)} Service
                      </CardTitle>
                      <Badge className={getStatusColor(quotation.status)}>
                        {getStatusLabel(quotation.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Deadline:</span>{' '}
                        {new Date(Number(quotation.deadline) / 1000000).toLocaleDateString()}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Details:</span> {quotation.projectDetails}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Submitted:</span>{' '}
                        {new Date(Number(quotation.timestamp) / 1000000).toLocaleDateString()}
                      </p>
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

                    {quotation.status === 'accepted' && officeLocation && (
                      <div className="pt-4 border-t">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium mb-1">Visit our office:</p>
                            <p className="text-muted-foreground">{officeLocation.address}</p>
                            <a
                              href={`https://www.google.com/maps?q=${officeLocation.lat},${officeLocation.lon}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-block mt-2"
                            >
                              Open in Maps
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Link to="/quotations/respond" search={{ id: quotation.id }} className="flex-1">
                        <Button variant="outline" className="w-full min-h-[44px]">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-6">You haven't submitted any quotation requests yet</p>
                <Link to="/request-quote">
                  <Button size="lg" className="min-h-[48px] px-8">
                    Request a Quote
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
