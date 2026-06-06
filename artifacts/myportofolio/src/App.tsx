import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initAuth } from "@/lib/auth";
import { usePageTracker } from "@/hooks/usePageTracker";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Public Pages (eager — needed on first load)
import Home from "@/pages/Home";
import About from "@/pages/About";
import Portfolio from "@/pages/Portfolio";
import Contact from "@/pages/Contact";
import CvPage from "@/pages/Cv";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Services from "@/pages/Services";
import NotFound from "@/pages/not-found";

// Auth Pages (lazy — only when navigating to /login etc)
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));

// Admin Pages (lazy — only when navigating to /admin/*)
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const PortfolioList = lazy(() => import("@/pages/admin/PortfolioList"));
const ContentManager = lazy(() => import("@/pages/admin/Content"));
const ProfileEditor = lazy(() => import("@/pages/admin/ProfileEditor"));
const CvManager = lazy(() => import("@/pages/admin/CvManager"));
const CvGenerator = lazy(() => import("@/pages/admin/CvGenerator"));
const BlogManager = lazy(() => import("@/pages/admin/BlogManager"));
const AnalyticsPage = lazy(() => import("@/pages/admin/Analytics"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-8 h-8 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

initAuth();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PublicRoutes() {
  usePageTracker();
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/contact" component={Contact} />
        <Route path="/cv" component={CvPage} />
        <Route path="/services" component={Services} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/portfolio" component={PortfolioList} />
          <Route path="/admin/content" component={ContentManager} />
          <Route path="/admin/profile" component={ProfileEditor} />
          <Route path="/admin/cv" component={CvManager} />
          <Route path="/admin/cv/new" component={CvGenerator} />
          <Route path="/admin/blog" component={BlogManager} />
          <Route path="/admin/analytics" component={AnalyticsPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/verify-email" component={VerifyEmail} />
        <Route path="/reset-password" component={ResetPassword} />

        <Route path="/admin/*" component={AdminRoutes} />
        <Route path="/admin" component={AdminRoutes} />

        {/* Fallback to public routes */}
        <Route path="/*" component={PublicRoutes} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
