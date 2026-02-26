import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  useGetAllQuotations,
  useMarkQuotationCustomerPending,
  useAdminAcceptPayment,
} from '../../hooks/useQuotations';
import { QuotationStatus, DesignStatus, ServiceType } from '../../backend';
import AdminGuard from '../../components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Palette,
  Send,
  CreditCard,
} from 'lucide-react';

function StatusBadge({ status }: { status: QuotationStatus }) {
  const config: Record<string, { label: string; className: string }> = {
    [QuotationStatus.draft]: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
    [QuotationStatus.customerPending]: { label: 'Customer Pending', className: 'bg-blue-100 text-blue-700' },
    [QuotationStatus.paymentPending]: { label: 'Payment Pending', className: 'bg-yellow-100 text-yellow-700' },
    [QuotationStatus.workInProgress]: { label: 'Work In Progress', className: 'bg-purple-100 text-purple-700' },
    [QuotationStatus.completed]: { label: 'Completed', className: 'bg-green-100 text-green-700' },
    [QuotationStatus.accepted]: { label: 'Accepted', className: 'bg-green-100 text-green-700' },
    [QuotationStatus.rejected]: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
    [QuotationStatus.negotiating]: { label: 'Negotiating', className: 'bg-orange-100 text-orange-700' },
  };
  const c = config[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}

function ServiceTypeBadge({ type }: { type: ServiceType }) {
  const labels: Record<string, string> = {
    [ServiceType.digital]: 'Digital',
    [ServiceType.banner]: 'Banner',
    [ServiceType.offset]: 'Offset',
    [ServiceType.design]: 'Design',
  };
  return <Badge variant="outline" className="text-xs">{labels[type] ?? type}</Badge>;
}

export default function QuotationManagementPage() {
  const { data: quotations, isLoading } = useGetAllQuotations();
  const markCustomerPending = useMarkQuotationCustomerPending();
  const acceptPayment = useAdminAcceptPayment();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Quotation Management</h1>
            <p className="text-muted-foreground mt-1">Manage all customer quotation requests</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : !quotations || quotations.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-16 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No quotations yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {quotations.map((q) => {
                const isExpanded = expandedId === q.id;
                return (
                  <Card key={q.id} className="border-0 shadow-md overflow-hidden">
                    <CardHeader
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-base">#{q.id}</CardTitle>
                          <StatusBadge status={q.status} />
                          <ServiceTypeBadge type={q.serviceType} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground hidden sm:block">
                            {new Date(Number(q.timestamp) / 1_000_000).toLocaleDateString()}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0 border-t border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Customer</p>
                            <p className="text-sm">{q.email}</p>
                            <p className="text-sm text-muted-foreground">{q.mobileNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Deadline</p>
                            <p className="text-sm">{new Date(Number(q.deadline)).toLocaleDateString()}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Project Details</p>
                            <p className="text-sm text-foreground leading-relaxed">{q.projectDetails}</p>
                          </div>

                          {/* Design Status */}
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                              <Palette className="w-3 h-3" /> Design Status
                            </p>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                              q.designStatus === DesignStatus.ready
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {q.designStatus === DesignStatus.ready ? (
                                <>✅ Design Ready</>
                              ) : (
                                <>🎨 Design Assistance Needed</>
                              )}
                            </div>
                          </div>

                          {/* Negotiation History */}
                          {q.negotiationHistory && q.negotiationHistory.length > 0 && (
                            <div className="md:col-span-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Negotiation History</p>
                              <div className="space-y-2">
                                {q.negotiationHistory.map((msg, i) => (
                                  <div
                                    key={i}
                                    className={`p-2 rounded-lg text-sm ${
                                      msg.sender === 'admin'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-muted text-foreground'
                                    }`}
                                  >
                                    <span className="font-medium capitalize">{msg.sender}: </span>
                                    {msg.message}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                          {q.status === QuotationStatus.draft && (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() => markCustomerPending.mutate(q.id)}
                              disabled={markCustomerPending.isPending}
                            >
                              {markCustomerPending.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4 mr-2" />
                              )}
                              Send to Customer for Review
                            </Button>
                          )}
                          {q.status === QuotationStatus.paymentPending && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => acceptPayment.mutate(q.id)}
                              disabled={acceptPayment.isPending}
                            >
                              {acceptPayment.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <CreditCard className="w-4 h-4 mr-2" />
                              )}
                              Accept Payment & Start Work
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
