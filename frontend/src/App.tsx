import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './contexts/LanguageContext';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';
import { Toaster } from '@/components/ui/sonner';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProjectGalleryPage from './pages/ProjectGalleryPage';
import TestimonialsPage from './pages/TestimonialsPage';
import QuotationRequestPage from './pages/QuotationRequestPage';
import QuotationConfirmationPage from './pages/QuotationConfirmationPage';
import AboutPage from './pages/AboutPage';
import ContactUsPage from './pages/ContactUsPage';
import DeliveryInfoPage from './pages/DeliveryInfoPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import MyQuotationsPage from './pages/MyQuotationsPage';
import QuotationResponsePage from './pages/QuotationResponsePage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRegistrationPage from './pages/admin/AdminRegistrationPage';
import QuotationManagementPage from './pages/admin/QuotationManagementPage';
import ProjectManagementPage from './pages/admin/ProjectManagementPage';
import LogoManagementPage from './pages/admin/LogoManagementPage';
import ContactInfoManagementPage from './pages/admin/ContactInfoManagementPage';
import ChatManagementPage from './pages/admin/ChatManagementPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import BusinessHoursManagementPage from './pages/admin/BusinessHoursManagementPage';
import ServiceMediaManagementPage from './pages/admin/ServiceMediaManagementPage';
import AppNameManagementPage from './pages/admin/AppNameManagementPage';

import CustomerLoginPage from './pages/customer/CustomerLoginPage';
import CustomerRegistrationPage from './pages/customer/CustomerRegistrationPage';
import CustomerPortalPage from './pages/customer/CustomerPortalPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});

// Root layout with Outlet
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Public routes
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const servicesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/services', component: ServicesPage });
const galleryRoute = createRoute({ getParentRoute: () => rootRoute, path: '/gallery', component: ProjectGalleryPage });
const testimonialsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/testimonials', component: TestimonialsPage });
const quotationRoute = createRoute({ getParentRoute: () => rootRoute, path: '/request-quote', component: QuotationRequestPage });
const quotationConfirmRoute = createRoute({ getParentRoute: () => rootRoute, path: '/quotation-confirmation/$id', component: QuotationConfirmationPage });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: ContactUsPage });
const deliveryRoute = createRoute({ getParentRoute: () => rootRoute, path: '/delivery', component: DeliveryInfoPage });
const submitReviewRoute = createRoute({ getParentRoute: () => rootRoute, path: '/submit-review', component: SubmitReviewPage });
const myQuotationsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/my-quotations', component: MyQuotationsPage });
const quotationResponseRoute = createRoute({ getParentRoute: () => rootRoute, path: '/quotation-response/$id', component: QuotationResponsePage });

// Admin routes
const adminLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/login', component: AdminLoginPage });
// /admin/setup redirects to /admin/register (same component)
const adminSetupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/setup', component: AdminRegistrationPage });
const adminRegistrationRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/register', component: AdminRegistrationPage });
const adminDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/dashboard', component: AdminDashboardPage });
const adminQuotationsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/quotations', component: QuotationManagementPage });
const adminProjectsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/projects', component: ProjectManagementPage });
const adminLogoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/logo', component: LogoManagementPage });
const adminContactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/contact', component: ContactInfoManagementPage });
const adminContactInfoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/contact-info', component: ContactInfoManagementPage });
const adminChatRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/chat', component: ChatManagementPage });
const adminChatsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/chats', component: ChatManagementPage });
const adminUsersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/users', component: AdminUserManagementPage });
const adminHoursRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/hours', component: BusinessHoursManagementPage });
const adminBusinessHoursRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/business-hours', component: BusinessHoursManagementPage });
const adminMediaRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/media', component: ServiceMediaManagementPage });
const adminServiceMediaRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/service-media', component: ServiceMediaManagementPage });
const adminAppNameRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/app-name', component: AppNameManagementPage });

// Customer routes
const customerLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/customer/login', component: CustomerLoginPage });
const customerRegistrationRoute = createRoute({ getParentRoute: () => rootRoute, path: '/customer/register', component: CustomerRegistrationPage });
const customerPortalRoute = createRoute({ getParentRoute: () => rootRoute, path: '/customer/portal', component: CustomerPortalPage });

const routeTree = rootRoute.addChildren([
  homeRoute,
  servicesRoute,
  galleryRoute,
  testimonialsRoute,
  quotationRoute,
  quotationConfirmRoute,
  aboutRoute,
  contactRoute,
  deliveryRoute,
  submitReviewRoute,
  myQuotationsRoute,
  quotationResponseRoute,
  adminLoginRoute,
  adminSetupRoute,
  adminRegistrationRoute,
  adminDashboardRoute,
  adminQuotationsRoute,
  adminProjectsRoute,
  adminLogoRoute,
  adminContactRoute,
  adminContactInfoRoute,
  adminChatRoute,
  adminChatsRoute,
  adminUsersRoute,
  adminHoursRoute,
  adminBusinessHoursRoute,
  adminMediaRoute,
  adminServiceMediaRoute,
  adminAppNameRoute,
  customerLoginRoute,
  customerRegistrationRoute,
  customerPortalRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <CustomerAuthProvider>
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" />
          </CustomerAuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
