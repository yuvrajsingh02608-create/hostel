"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { 
  Building2, 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Megaphone, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LanguageToggle from "./language-toggle";
import { signOut } from "next-auth/react";

interface SidebarNavProps {
  role: 'RESIDENT' | 'AGENT' | 'ADMIN';
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const SidebarNav: React.FC<SidebarNavProps> = ({ role, user }) => {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navItems = {
    RESIDENT: [
      { icon: LayoutDashboard, label: t('dashboard'), href: '/dashboard' },
      { icon: ClipboardList, label: t('complaints'), href: '/dashboard/complaints' },
      { icon: Settings, label: t('settings'), href: '/dashboard/settings' },
    ],
    AGENT: [
      { icon: LayoutDashboard, label: t('dashboard'), href: '/agent/dashboard' },
      { icon: ClipboardList, label: t('complaints'), href: '/agent/dashboard/complaints' },
      { icon: Settings, label: t('settings'), href: '/agent/settings' },
    ],
    ADMIN: [
      { icon: LayoutDashboard, label: t('dashboard'), href: '/admin/dashboard' },
      { icon: Users, label: t('users'), href: '/admin/users' },
      { icon: ClipboardList, label: t('complaints'), href: '/admin/complaints' },
      { icon: Megaphone, label: t('announcements'), href: '/admin/announcements' },
      { icon: FileText, label: t('reports'), href: '/admin/reports' },
    ],
  };

  const items = navItems[role] || [];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar-bg text-sidebar-text z-50 flex flex-col border-r border-border/50",
        isCollapsed ? "w-16" : "w-[240px]"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-border overflow-hidden">
        <Building2 className="h-8 w-8 text-primary shrink-0" />
        {!isCollapsed && (
          <span className="ml-3 text-xl font-display font-bold text-white whitespace-nowrap">
            NivaasDesk
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center h-11 px-3 rounded-button transition-colors relative group",
                isActive 
                  ? "bg-primary/10 text-primary font-bold" 
                  : "hover:bg-primary/5 hover:text-primary text-text-muted"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-badge" />
              )}
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-text-muted group-hover:text-primary")} />
              {!isCollapsed && (
                <span className="ml-3 truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-4">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          <LanguageToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-text-muted hover:text-primary hover:bg-primary/10"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
          <div className="relative group">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user.image || ''} />
              <AvatarFallback className="bg-primary text-white">
                {user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-white/50 font-bold truncate uppercase tracking-widest">{role.toLowerCase()}</p>
            </div>
          )}
          {!isCollapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => signOut()}
              className="text-text-muted hover:text-danger hover:bg-danger/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
