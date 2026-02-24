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
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import MyQuotationsPage from './pages/MyQuotationsPage';
import QuotationResponsePage from './pages/QuotationResponsePage';
import ProfileSetup from './components/ProfileSetup';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <ProfileSetup />
      <Toaster />
    </>
  ),
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

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
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

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: AdminUserManagementPage,
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
  adminLoginRoute,
  adminDashboardRoute,
  adminQuotationsRoute,
  adminProjectsRoute,
  adminLogoRoute,
  adminChatsRoute,
  adminUsersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
