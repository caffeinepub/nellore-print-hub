import { useState } from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import QuotationRequestPage from './pages/QuotationRequestPage';
import QuotationConfirmationPage from './pages/QuotationConfirmationPage';
import DeliveryInfoPage from './pages/DeliveryInfoPage';
import ProjectGalleryPage from './pages/ProjectGalleryPage';
import TestimonialsPage from './pages/TestimonialsPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import QuotationManagementPage from './pages/admin/QuotationManagementPage';
import ProjectManagementPage from './pages/admin/ProjectManagementPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import LogoManagementPage from './pages/admin/LogoManagementPage';
import ChatManagementPage from './pages/admin/ChatManagementPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminRegistrationPage from './pages/admin/AdminRegistrationPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import MyQuotationsPage from './pages/MyQuotationsPage';
import QuotationResponsePage from './pages/QuotationResponsePage';
import ContactUsPage from './pages/ContactUsPage';
import ContactInfoManagementPage from './pages/admin/ContactInfoManagementPage';
import ServiceMediaManagementPage from './pages/admin/ServiceMediaManagementPage';
import BusinessHoursManagementPage from './pages/admin/BusinessHoursManagementPage';
import HomepageContentManagementPage from './pages/admin/HomepageContentManagementPage';
import AboutContentManagementPage from './pages/admin/AboutContentManagementPage';
import CustomerLoginPage from './pages/customer/CustomerLoginPage';
import CustomerRegistrationPage from './pages/customer/CustomerRegistrationPage';
import CustomerPortalPage from './pages/customer/CustomerPortalPage';
import ProfileSetup from './components/ProfileSetup';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';

function RootLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [profileCompleted, setProfileCompleted] = useState(false);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null && !profileCompleted;

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <ProfileSetup
        open={showProfileSetup}
        onComplete={() => setProfileCompleted(true)}
      />
      <Toaster />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesPage,
});

const requestQuoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request-quote',
  component: QuotationRequestPage,
});

const quotationConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quotation-confirmation/$id',
  component: QuotationConfirmationPage,
});

const deliveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/delivery',
  component: DeliveryInfoPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: ProjectGalleryPage,
});

const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimonials',
  component: TestimonialsPage,
});

const submitReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit-review',
  component: SubmitReviewPage,
});

const myQuotationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-quotations',
  component: MyQuotationsPage,
});

const quotationResponseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quotations/respond',
  component: QuotationResponsePage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactUsPage,
});

// Admin routes
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

const adminRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/register',
  component: AdminRegistrationPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboardPage,
});

const adminQuotationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/quotations',
  component: QuotationManagementPage,
});

const adminProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/projects',
  component: ProjectManagementPage,
});

const adminLogoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/logo',
  component: LogoManagementPage,
});

const adminChatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/chats',
  component: ChatManagementPage,
});

// Also register /admin/chat as an alias so dashboard links work
const adminChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/chat',
  component: ChatManagementPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: AdminUserManagementPage,
});

const adminContactInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/contact-info',
  component: ContactInfoManagementPage,
});

const adminServiceMediaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/service-media',
  component: ServiceMediaManagementPage,
});

const adminBusinessHoursRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/business-hours',
  component: BusinessHoursManagementPage,
});

const adminHomepageContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/homepage-content',
  component: HomepageContentManagementPage,
});

const adminAboutContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/about-content',
  component: AboutContentManagementPage,
});

// Customer portal routes
const customerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/login',
  component: CustomerLoginPage,
});

const customerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/register',
  component: CustomerRegistrationPage,
});

const customerPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/portal',
  component: CustomerPortalPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  servicesRoute,
  requestQuoteRoute,
  quotationConfirmationRoute,
  deliveryRoute,
  galleryRoute,
  testimonialsRoute,
  submitReviewRoute,
  myQuotationsRoute,
  quotationResponseRoute,
  contactRoute,
  adminLoginRoute,
  adminRegisterRoute,
  adminDashboardRoute,
  adminQuotationsRoute,
  adminProjectsRoute,
  adminLogoRoute,
  adminChatsRoute,
  adminChatRoute,
  adminUsersRoute,
  adminContactInfoRoute,
  adminServiceMediaRoute,
  adminBusinessHoursRoute,
  adminHomepageContentRoute,
  adminAboutContentRoute,
  customerLoginRoute,
  customerRegisterRoute,
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
    <CustomerAuthProvider>
      <RouterProvider router={router} />
    </CustomerAuthProvider>
  );
}
