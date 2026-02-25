import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useQuotationStatistics } from '../../hooks/useQuotationStatistics';
import { useGetOverdueQuotations } from '../../hooks/useQuotations';
import AdminGuard from '../../components/AdminGuard';
import {
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Users,
  Clock,
  AlertTriangle,
  Truck,
  Phone,
  Images,
  Image,
} from 'lucide-react';

function DashboardContent() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuotationStatistics();
  const { data: overdueIds } = useGetOverdueQuotations();

  const overdueCount = overdueIds?.length ?? 0;

  const statCards = [
    {
      label: language === 'te' ? 'పెండింగ్' : 'Pending',
      value: stats ? Number(stats.pending) : 0,
      icon: FileText,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    },
    {
      label: language === 'te' ? 'ఆమోదించబడింది' : 'Accepted',
      value: stats ? Number(stats.accepted) : 0,
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: language === 'te' ? 'తిరస్కరించబడింది' : 'Rejected',
      value: stats ? Number(stats.rejected) : 0,
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
    {
      label: language === 'te' ? 'చర్చలో' : 'Negotiating',
      value: stats ? Number(stats.negotiating) : 0,
      icon: MessageSquare,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
  ];

  const quickLinks = [
    {
      label: language === 'te' ? 'కోటేషన్లు నిర్వహించండి' : 'Manage Quotations',
      path: '/admin/quotations',
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: language === 'te' ? 'వినియోగదారులు నిర్వహించండి' : 'Manage Users',
      path: '/admin/users',
      icon: Users,
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
    },
    {
      label: language === 'te' ? 'డెలివరీ ధర నిర్వహించండి' : 'Manage Delivery Pricing',
      path: '/admin/delivery-config',
      icon: Truck,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      label: language === 'te' ? 'సంప్రదింపు సమాచారం సవరించండి' : 'Edit Contact Info',
      path: '/admin/contact-info',
      icon: Phone,
      color: 'text-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-950/30',
    },
    {
      label: language === 'te' ? 'ప్రాజెక్ట్ గ్యాలరీ నిర్వహించండి' : 'Manage Project Gallery',
      path: '/admin/projects',
      icon: Images,
      color: 'text-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-950/30',
    },
    {
      label: language === 'te' ? 'లోగో నిర్వహించండి' : 'Manage Logo',
      path: '/admin/logo',
      icon: Image,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 pt-8 pb-6">
        <h1 className="text-xl font-bold text-foreground">
          {language === 'te' ? 'అడ్మిన్ డాష్‌బోర్డ్' : 'Admin Dashboard'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'te' ? 'మీ వ్యాపారాన్ని నిర్వహించండి' : 'Manage your business'}
        </p>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <button
            onClick={() => navigate({ to: '/admin/quotations' })}
            className="w-full flex items-center gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-left hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-700 dark:text-red-400 text-sm">
                {language === 'te' ? 'అత్యవసర కోటేషన్లు' : 'Overdue Quotations'}
              </p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                {overdueCount} {language === 'te' ? 'కోటేషన్లు 1 గంట కంటే ఎక్కువ పెండింగ్‌లో ఉన్నాయి' : 'quotations pending for more than 1 hour'}
              </p>
            </div>
            <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
          </button>
        )}

        {/* Stats Grid */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {language === 'te' ? 'కోటేషన్ గణాంకాలు' : 'Quotation Statistics'}
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-8 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className={`${card.bg} border border-border rounded-2xl p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${card.color}`} />
                      <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
                    </div>
                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Overdue Count Card */}
        <div
          onClick={() => navigate({ to: '/admin/quotations' })}
          className="cursor-pointer bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {language === 'te' ? 'పెండింగ్ > 1 గంట' : 'Pending > 1 Hour'}
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{overdueCount}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {language === 'te' ? 'త్వరిత లింక్లు' : 'Quick Links'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate({ to: link.path })}
                  className={`${link.bg} border border-border rounded-2xl p-4 text-left hover:opacity-80 transition-opacity`}
                >
                  <Icon className={`w-5 h-5 ${link.color} mb-2`} />
                  <p className="text-sm font-medium text-foreground">{link.label}</p>
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
      <DashboardContent />
    </AdminGuard>
  );
}
