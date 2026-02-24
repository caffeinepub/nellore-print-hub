import AdminGuard from '../../components/AdminGuard';
import { useQuotationStatistics } from '../../hooks/useQuotationStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, CheckCircle, XCircle, MessageSquare, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}

function AdminDashboardContent() {
  const { data: statistics, isLoading } = useQuotationStatistics();

  const stats = [
    {
      title: 'Pending Quotations',
      value: statistics ? Number(statistics.pending) : 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-950',
    },
    {
      title: 'Accepted',
      value: statistics ? Number(statistics.accepted) : 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Rejected',
      value: statistics ? Number(statistics.rejected) : 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-950',
    },
    {
      title: 'Negotiating',
      value: statistics ? Number(statistics.negotiating) : 0,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Overview of quotation requests and statistics
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))
            ) : (
              stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total {stat.title.toLowerCase()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : statistics ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Total Quotations:{' '}
                      <span className="font-semibold text-foreground">
                        {Number(statistics.pending) +
                          Number(statistics.accepted) +
                          Number(statistics.rejected) +
                          Number(statistics.negotiating)}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Completion Rate:{' '}
                      <span className="font-semibold text-foreground">
                        {(() => {
                          const total =
                            Number(statistics.pending) +
                            Number(statistics.accepted) +
                            Number(statistics.rejected) +
                            Number(statistics.negotiating);
                          const completed = Number(statistics.accepted) + Number(statistics.rejected);
                          return total > 0 ? `${((completed / total) * 100).toFixed(1)}%` : '0%';
                        })()}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
