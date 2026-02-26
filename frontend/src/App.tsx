import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

import Layout from './components/Layout';
import AdminGuard from './components/AdminGuard';
import { LanguageProvider } from './contexts/LanguageContext';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProjectGalleryPage from './pages/ProjectGalleryPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AboutPage from './pages/AboutPage';
import ContactUsPage from './pages/ContactUsPage';
import QuotationRequestPage from './pages/QuotationRequestPage';
import QuotationConfirmationPage from './pages/QuotationConfirmationPage';
import DeliveryInfoPage from './pages/DeliveryInfoPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import MyQuotationsPage from './pages/MyQuotationsPage';
import QuotationResponsePage from './pages/QuotationResponsePage';

// Customer portal
import CustomerLoginPage from './pages/customer/CustomerLoginPage';
import CustomerPortalPage from './pages/customer/CustomerPortalPage';
import CustomerGuard from './components/CustomerGuard';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminRegistrationPage from './pages/admin/AdminRegistrationPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import QuotationManagementPage from './pages/admin/QuotationManagementPage';
import ProjectManagementPage from './pages/admin/ProjectManagementPage';
import LogoManagementPage from './pages/admin/LogoManagementPage';
import ChatManagementPage from './pages/admin/ChatManagementPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import ContactInfoManagementPage from './pages/admin/ContactInfoManagementPage';
import BusinessHoursManagementPage from './pages/admin/BusinessHoursManagementPage';
import ServiceMediaManagementPage from './pages/admin/ServiceMediaManagementPage';
import AppNameManagementPage from './pages/admin/AppNameManagementPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// Named redirect component — must start with uppercase to satisfy hooks rules
function AdminIndexRedirect() {
  React.useEffect(() => {
    window.location.replace('/admin/login');
  }, []);
  return null;
}

function CustomerPortalWithGuard() {
  return (
    <CustomerGuard>
      <CustomerPortalPage />
    </CustomerGuard>
  );
}

function AdminDashboardWithGuard() {
  return (
    <AdminGuard>
      <AdminDashboardPage />
    </AdminGuard>
  );
}

function AdminQuotationsWithGuard() {
  return (
    <AdminGuard>
      <QuotationManagementPage />
    </AdminGuard>
  );
}

function AdminProjectsWithGuard() {
  return (
    <AdminGuard>
      <ProjectManagementPage />
    </AdminGuard>
  );
}

function AdminLogoWithGuard() {
  return (
    <AdminGuard>
      <LogoManagementPage />
    </AdminGuard>
  );
}

function AdminChatWithGuard() {
  return (
    <AdminGuard>
      <ChatManagementPage />
    </AdminGuard>
  );
}

function AdminUsersWithGuard() {
  return (
    <AdminGuard>
      <AdminUserManagementPage />
    </AdminGuard>
  );
}

function AdminContactWithGuard() {
  return (
    <AdminGuard>
      <ContactInfoManagementPage />
    </AdminGuard>
  );
}

function AdminBusinessHoursWithGuard() {
  return (
    <AdminGuard>
      <BusinessHoursManagementPage />
    </AdminGuard>
  );
}

function AdminServiceMediaWithGuard() {
  return (
    <AdminGuard>
      <ServiceMediaManagementPage />
    </AdminGuard>
  );
}

function AdminAppNameWithGuard() {
  return (
    <AdminGuard>
      <AppNameManagementPage />
    </AdminGuard>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public layout route
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Public pages
const homeRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/', component: HomePage });
const servicesRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/services', component: ServicesPage });
const galleryRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/gallery', component: ProjectGalleryPage });
const testimonialsRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/testimonials', component: TestimonialsPage });
const aboutRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/about', component: AboutPage });
const contactRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/contact', component: ContactUsPage });
const quotationRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/request-quote', component: QuotationRequestPage });
const quotationConfirmRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/quotation-confirmation', component: QuotationConfirmationPage });
const deliveryRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/delivery', component: DeliveryInfoPage });
const submitReviewRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/submit-review', component: SubmitReviewPage });
const myQuotationsRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/my-quotations', component: MyQuotationsPage });
const quotationResponseRoute = createRoute({ getParentRoute: () => layoutRoute, path: '/quotation-response/$quotationId', component: QuotationResponsePage });

// Customer portal
const customerLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/customer/login', component: CustomerLoginPage });
const customerPortalRoute = createRoute({ getParentRoute: () => rootRoute, path: '/customer/portal', component: CustomerPortalWithGuard });

// Admin routes
const adminIndexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminIndexRedirect });
const adminLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/login', component: AdminLoginPage });
const adminRegisterRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/register', component: AdminRegistrationPage });
const adminSetupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/setup', component: AdminRegistrationPage });
const adminDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/dashboard', component: AdminDashboardWithGuard });
const adminQuotationsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/quotations', component: AdminQuotationsWithGuard });
const adminProjectsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/projects', component: AdminProjectsWithGuard });
const adminLogoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/logo', component: AdminLogoWithGuard });
const adminChatRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/chat', component: AdminChatWithGuard });
const adminChatsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/chats', component: AdminChatWithGuard });
const adminUsersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/users', component: AdminUsersWithGuard });
const adminContactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/contact', component: AdminContactWithGuard });
const adminContactInfoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/contact-info', component: AdminContactWithGuard });
const adminBusinessHoursRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/business-hours', component: AdminBusinessHoursWithGuard });
const adminHoursRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/hours', component: AdminBusinessHoursWithGuard });
const adminServiceMediaRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/service-media', component: AdminServiceMediaWithGuard });
const adminMediaRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/media', component: AdminServiceMediaWithGuard });
const adminAppNameRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/app-name', component: AdminAppNameWithGuard });

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    servicesRoute,
    galleryRoute,
    testimonialsRoute,
    aboutRoute,
    contactRoute,
    quotationRoute,
    quotationConfirmRoute,
    deliveryRoute,
    submitReviewRoute,
    myQuotationsRoute,
    quotationResponseRoute,
  ]),
  customerLoginRoute,
  customerPortalRoute,
  adminIndexRoute,
  adminLoginRoute,
  adminRegisterRoute,
  adminSetupRoute,
  adminDashboardRoute,
  adminQuotationsRoute,
  adminProjectsRoute,
  adminLogoRoute,
  adminChatRoute,
  adminChatsRoute,
  adminUsersRoute,
  adminContactRoute,
  adminContactInfoRoute,
  adminBusinessHoursRoute,
  adminHoursRoute,
  adminServiceMediaRoute,
  adminMediaRoute,
  adminAppNameRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <CustomerAuthProvider>
            <RouterProvider router={router} />
            <Toaster />
          </CustomerAuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
