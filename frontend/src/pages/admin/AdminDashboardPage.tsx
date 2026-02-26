import React from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import {
  FileText,
  Image,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Package,
  Star,
  MapPin,
  Clock,
  Video,
  LogOut,
  Shield,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuotationStatistics } from '@/hooks/useQuotationStatistics';
import { clearAdminSession } from '@/utils/sessionStorage';

const managementSections = [
  {
    title: 'Quotations',
    description: 'Manage customer quotation requests',
    icon: FileText,
    href: '/admin/quotations',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Projects',
    description: 'Manage portfolio projects',
    icon: Package,
    href: '/admin/projects',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Reviews',
    description: 'View customer reviews',
    icon: Star,
    href: '/admin/reviews',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    title: 'Chat',
    description: 'Respond to customer messages',
    icon: MessageSquare,
    href: '/admin/chat',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    title: 'Users',
    description: 'Manage admin users',
    icon: Users,
    href: '/admin/users',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    title: 'Logo',
    description: 'Update company logo',
    icon: Image,
    href: '/admin/logo',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    title: 'Contact Info',
    description: 'Update contact details',
    icon: MapPin,
    href: '/admin/contact',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    title: 'Business Hours',
    description: 'Set operating hours',
    icon: Clock,
    href: '/admin/business-hours',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
  {
    title: 'Service Media',
    description: 'Manage service images & videos',
    icon: Video,
    href: '/admin/service-media',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    title: 'App Name',
    description: 'Update application name',
    icon: Type,
    href: '/admin/app-name',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useQuotationStatistics();

  const handleLogout = () => {
    clearAdminSession();
    navigate({ to: '/admin/login' });
  };

  const statCards = [
    { label: 'Draft', value: stats?.draft ?? 0, color: 'text-muted-foreground' },
    { label: 'Pending Review', value: stats?.customerPending ?? 0, color: 'text-blue-500' },
    { label: 'Payment Pending', value: stats?.paymentPending ?? 0, color: 'text-yellow-500' },
    { label: 'In Progress', value: stats?.workInProgress ?? 0, color: 'text-orange-500' },
    { label: 'Completed', value: stats?.completed ?? 0, color: 'text-green-500' },
    { label: 'Negotiating', value: stats?.negotiating ?? 0, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Nellore Print Hub</h1>
              <p className="text-xs text-primary-foreground/70">Admin Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-foreground/20 gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quotation Statistics */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quotation Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {statCards.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-4 pb-3 px-3">
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {statsLoading ? '—' : String(stat.value)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Management Sections */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {managementSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.title} to={section.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group border-border hover:border-primary/30">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${section.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-5 w-5 ${section.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{section.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
