import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { clearToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Briefcase, FileText, User, FileBadge, LogOut, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const { toast } = useToast();
  
  const { data: user, isLoading, isError } = useGetMe({ 
    query: { 
      retry: false,
    } 
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        clearToken();
        setLocation("/login");
        toast({ title: "Logged out successfully" });
      }
    }
  });

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      setLocation("/login");
    }
  }, [user, isLoading, isError, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
    { href: "/admin/content", label: "Content", icon: FileText },
    { href: "/admin/profile", label: "Profile", icon: User },
    { href: "/admin/cv", label: "CV Manager", icon: FileBadge },
  ];

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2 text-sidebar-primary hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">Back to Site</span>
          </Link>
        </div>
        
        <div className="p-6">
          <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4">
            Admin Panel
          </div>
          <nav className="flex flex-col gap-2">
            {sidebarLinks.map((link) => {
              const isActive = location === link.href || (link.href !== "/admin" && location.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user.name}</span>
              <span className="text-xs text-sidebar-foreground/60 truncate">{user.email}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border flex items-center px-4 justify-between bg-background">
          <span className="font-semibold">Admin Panel</span>
          <Link href="/" className="text-sm text-primary">View Site</Link>
        </header>
        <nav 
‎    className="flex overflow-x-auto gap-2 px-4 py-2 border-b border-border bg-background"
‎    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
‎  >
‎    {sidebarLinks.map((link) => {
‎      const isActive = location === link.href || (link.href !== "/admin" && location.startsWith(link.href));
‎      const Icon = link.icon;
‎      return (
‎        <Link
‎          key={link.href}
‎          href={link.href}
‎          className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs whitespace-nowrap ${
‎            isActive 
‎              ? "bg-primary text-primary-foreground font-medium" 
‎              : "bg-muted text-muted-foreground"
‎          }`}
‎        >
‎          <Icon className="h-3.5 w-3.5" />
‎          {link.label}
‎        </Link>
‎      );
‎    })}
‎  </nav>
‎</div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
