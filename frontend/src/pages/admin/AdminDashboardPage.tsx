import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  FileText,
  Image,
  Users,
  Phone,
  LogOut,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Video,
  Building2,
  Type,
  Printer,
  Sparkles,
} from 'lucide-react';
import AdminGuard from '../../components/AdminGuard';
import { useQuotationStatistics } from '../../hooks/useQuotationStatistics';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetAppName } from '../../hooks/useAppName';

function AdminDashboardContent() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useQuotationStatistics();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: appName } = useGetAppName();

  const displayName = appName || 'Nellore Print Hub';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const statCards = [
    { label: 'Draft', value: stats?.draft ?? 0, icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/30' },
    { label: 'Pending Review', value: stats?.customerPending ?? 0, icon: Clock, color: 'text-[oklch(0.55_0.16_68)]', bg: 'bg-[oklch(0.94_0.06_75)] dark:bg-[oklch(0.22_0.05_75)]' },
    { label: 'Payment Pending', value: stats?.paymentPending ?? 0, icon: BarChart3, color: 'text-[oklch(0.42_0.12_195)]', bg: 'bg-[oklch(0.92_0.05_195)] dark:bg-[oklch(0.20_0.05_195)]' },
    { label: 'In Progress', value: stats?.workInProgress ?? 0, icon: Printer, color: 'text-[oklch(0.45_0.14_270)]', bg: 'bg-[oklch(0.92_0.04_270)] dark:bg-[oklch(0.20_0.04_270)]' },
    { label: 'Completed', value: stats?.completed ?? 0, icon: CheckCircle, color: 'text-[oklch(0.45_0.14_145)]', bg: 'bg-[oklch(0.92_0.06_145)] dark:bg-[oklch(0.20_0.06_145)]' },
    { label: 'Negotiating', value: stats?.negotiating ?? 0, icon: MessageSquare, color: 'text-[oklch(0.50_0.14_30)]', bg: 'bg-[oklch(0.94_0.05_30)] dark:bg-[oklch(0.22_0.05_30)]' },
    { label: 'Accepted', value: stats?.accepted ?? 0, icon: CheckCircle, color: 'text-[oklch(0.42_0.14_160)]', bg: 'bg-[oklch(0.92_0.06_160)] dark:bg-[oklch(0.20_0.06_160)]' },
    { label: 'Rejected', value: stats?.rejected ?? 0, icon: XCircle, color: 'text-[oklch(0.50_0.20_25)]', bg: 'bg-[oklch(0.94_0.05_25)] dark:bg-[oklch(0.22_0.05_25)]' },
  ];

  const managementLinks = [
    { path: '/admin/quotations', label: 'Quotations', sublabel: 'కోటేషన్లు', icon: FileText, desc: 'Manage customer quotation requests' },
    { path: '/admin/projects', label: 'Portfolio', sublabel: 'పోర్ట్‌ఫోలియో', icon: Image, desc: 'Add and manage portfolio projects' },
    { path: '/admin/logo', label: 'Logo', sublabel: 'లోగో', icon: Printer, desc: 'Upload and update company logo' },
    { path: '/admin/app-name', label: 'App Name', sublabel: 'యాప్ పేరు', icon: Type, desc: 'Change the application display name' },
    { path: '/admin/contact', label: 'Contact Info', sublabel: 'సంప్రదింపు', icon: Phone, desc: 'Update contact information' },
    { path: '/admin/users', label: 'Admin Users', sublabel: 'అడ్మిన్ వినియోగదారులు', icon: Users, desc: 'Manage admin accounts' },
    { path: '/admin/service-media', label: 'Service Media', sublabel: 'సేవా మీడియా', icon: Video, desc: 'Manage service images and videos' },
    { path: '/admin/business-hours', label: 'Business Hours', sublabel: 'వ్యాపార సమయాలు', icon: Clock, desc: 'Set operating hours' },
    { path: '/admin/chats', label: 'Customer Chats', sublabel: 'చాట్‌లు', icon: MessageSquare, desc: 'View and reply to customer messages' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[oklch(0.20_0.07_205)] text-white border-b border-[oklch(0.28_0.07_205)]">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-[oklch(0.68_0.18_72)] flex items-center justify-center">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-white leading-none">{displayName}</h1>
              <p className="text-[10px] text-[oklch(0.78_0.18_78)] uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Admin Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Quotation Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`${card.bg} border border-border rounded-xl p-4 shadow-card`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.label}</span>
                    <Icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  {statsLoading ? (
                    <div className="h-7 w-12 bg-muted rounded animate-pulse" />
                  ) : (
                    <div className={`text-2xl font-bold ${card.color}`}>{Number(card.value)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Management Links */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {managementLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate({ to: link.path as any })}
                  className="group flex items-start gap-4 p-4 bg-card border border-border rounded-xl shadow-card hover:border-[oklch(0.42_0.12_195)] hover:shadow-card-hover transition-all text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-[oklch(0.20_0.07_205)] flex items-center justify-center shrink-0 group-hover:bg-[oklch(0.68_0.18_72)] transition-colors">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground text-sm leading-tight">
                      {link.label}
                      <span className="text-muted-foreground font-normal ml-1.5 text-xs">/ {link.sublabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{link.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
