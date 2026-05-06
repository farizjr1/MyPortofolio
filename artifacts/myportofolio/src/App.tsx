import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initAuth } from "@/lib/auth";
import { usePageTracker } from "@/hooks/usePageTracker";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Public Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Portfolio from "@/pages/Portfolio";
import Contact from "@/pages/Contact";
import CvPage from "@/pages/Cv";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/not-found";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import ResetPassword from "@/pages/auth/ResetPassword";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import PortfolioList from "@/pages/admin/PortfolioList";
import ContentManager from "@/pages/admin/Content";
import ProfileEditor from "@/pages/admin/ProfileEditor";
import CvManager from "@/pages/admin/CvManager";
import CvGenerator from "@/pages/admin/CvGenerator";
import BlogManager from "@/pages/admin/BlogManager";
import AnalyticsPage from "@/pages/admin/Analytics";

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
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/flutceadmin" component={Login} />
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
