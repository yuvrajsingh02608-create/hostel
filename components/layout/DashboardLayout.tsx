"use client";

import React from "react";
import SidebarNav from "@/components/shared/SidebarNav";
import { useSession } from "next-auth/react";
import { redirect } from "@/i18n/routing";
import { RedirectType } from "next/navigation";
import { Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'RESIDENT' | 'AGENT' | 'ADMIN';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !session.user) {
    redirect("/login", RedirectType.replace);
    return null; // Terminate for TS
  }

  // Double check role
  const userRole = (session.user as any).role as 'RESIDENT' | 'AGENT' | 'ADMIN';
  if (userRole !== role && role !== 'RESIDENT') { // Simple check, might need refine
     // redirect based on their actual role or login
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <SidebarNav role={userRole} user={session.user as any} />
      
      <main className="flex-1 ml-16 md:ml-[240px]">
        {/* Top Header Placeholder - can be customized in pages or here */}
        <div className="h-16 border-b border-border bg-card sticky top-0 z-40 px-6 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-4">
               {/* Welcome message or breadcrumbs could go here */}
               <span className="text-sm font-medium text-text-muted">Welcome back, {session.user.name}</span>
            </div>
            
            <div className="flex items-center gap-4">
                {mounted && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="rounded-full hover:bg-primary/10 text-text-muted hover:text-primary shadow-sm border border-border"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                )}
            </div>
        </div>
        
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
