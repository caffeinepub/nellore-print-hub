import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import AdminGuard from '../../components/AdminGuard';
import { useQuotationStatistics } from '../../hooks/useQuotationStatistics';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText, Clock, CreditCard, Wrench, CheckCircle, XCircle,
  MessageSquare, BarChart3, Users, Image, Phone, Globe,
  Info, Video, Home,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: stats } = useQuotationStatistics();

  const statCards = [
    { label: 'Draft', teLabel: 'డ్రాఫ్ట్', value: stats?.draft ?? 0n, icon: FileText, color: 'text-muted-foreground' },
    { label: 'Customer Review', teLabel: 'కస్టమర్ సమీక్ష', value: stats?.customerPending ?? 0n, icon: Clock, color: 'text-yellow-600' },
    { label: 'Payment Pending', teLabel: 'చెల్లింపు పెండింగ్', value: stats?.paymentPending ?? 0n, icon: CreditCard, color: 'text-orange-600' },
    { label: 'Work In Progress', teLabel: 'పని జరుగుతోంది', value: stats?.workInProgress ?? 0n, icon: Wrench, color: 'text-blue-600' },
    { label: 'Completed', teLabel: 'పూర్తయింది', value: stats?.completed ?? 0n, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Accepted', teLabel: 'అంగీకరించారు', value: stats?.accepted ?? 0n, icon: CheckCircle, color: 'text-emerald-600' },
    { label: 'Rejected', teLabel: 'తిరస్కరించారు', value: stats?.rejected ?? 0n, icon: XCircle, color: 'text-destructive' },
    { label: 'Negotiating', teLabel: 'చర్చలు', value: stats?.negotiating ?? 0n, icon: MessageSquare, color: 'text-purple-600' },
  ];

  const managementLinks = [
    { label: 'Quotations', teLabel: 'కోటేషన్లు', icon: FileText, path: '/admin/quotations' },
    { label: 'Projects', teLabel: 'ప్రాజెక్టులు', icon: Image, path: '/admin/projects' },
    { label: 'Chat', teLabel: 'చాట్', icon: MessageSquare, path: '/admin/chats' },
    { label: 'Contact Info', teLabel: 'సంప్రదింపు', icon: Phone, path: '/admin/contact-info' },
    { label: 'Logo', teLabel: 'లోగో', icon: Globe, path: '/admin/logo' },
    { label: 'Users', teLabel: 'వినియోగదారులు', icon: Users, path: '/admin/users' },
    { label: 'Service Media', teLabel: 'సేవా మీడియా', icon: Video, path: '/admin/service-media' },
    { label: 'Business Hours', teLabel: 'వ్యాపార సమయాలు', icon: Clock, path: '/admin/business-hours' },
    { label: 'Homepage Content', teLabel: 'హోమ్‌పేజ్ కంటెంట్', icon: Home, path: '/admin/homepage-content' },
    { label: 'About Content', teLabel: 'అబౌట్ కంటెంట్', icon: Info, path: '/admin/about-content' },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">అడ్మిన్ డాష్‌బోర్డ్</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate({ to: '/' })}>
              View Site / సైట్ చూడండి
            </Button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
          {/* Stats */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Quotation Statistics / కోటేషన్ గణాంకాలు
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {statCards.map((card) => (
                <Card key={card.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <card.icon className={`w-4 h-4 ${card.color}`} />
                      <span className="text-2xl font-bold">{Number(card.value)}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground">{card.label}</p>
                    <p className="text-xs text-muted-foreground">{card.teLabel}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Management Links */}
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Manage / నిర్వహించండి
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {managementLinks.map((link) => (
                <Card
                  key={link.path}
                  className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
                  onClick={() => navigate({ to: link.path })}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <link.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{link.label}</p>
                      <p className="text-xs text-muted-foreground">{link.teLabel}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </AdminGuard>
  );
}
