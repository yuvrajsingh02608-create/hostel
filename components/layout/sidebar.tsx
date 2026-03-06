"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    FileText,
    PlusCircle,
    Bell,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Users,
    BarChart3,
    Megaphone,
    Settings,
    ClipboardList
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const residentLinks = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "My Complaints", href: "/dashboard/complaints", icon: FileText },
    { name: "New Complaint", href: "/dashboard/new", icon: PlusCircle },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Profile", href: "/dashboard/profile", icon: User },
];

const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "All Complaints", href: "/admin/complaints", icon: ClipboardList },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

const agentLinks = [
    { name: "Dashboard", href: "/agent", icon: Home },
    { name: "My Queue", href: "/agent/complaints", icon: ClipboardList },
    { name: "Notifications", href: "/agent/notifications", icon: Bell },
    { name: "Profile", href: "/agent/profile", icon: User },
];

function getLinksForRole(role: string) {
    switch (role) {
        case "ADMIN": return adminLinks;
        case "AGENT": return agentLinks;
        default: return residentLinks;
    }
}

export default function Sidebar({ role = "RESIDENT" }: { role?: string }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const links = getLinksForRole(role);

    return (
        <aside
            className={cn(
                "flex flex-col border-r bg-white transition-all duration-300 shadow-sm",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-16 items-center justify-between px-6 border-b">
                {!collapsed && (
                    <span className="text-xl font-serif font-bold text-[#1E3A5F]">
                        NivaasDesk
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                >
                    {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
            </div>

            {!collapsed && (
                <div className="px-6 py-3 border-b bg-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {role} Panel
                    </span>
                </div>
            )}

            <nav className="flex-1 space-y-2 p-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[#1E3A5F] text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1E3A5F]"
                            )}
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>{link.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={() => signOut()}
                    className={cn(
                        "flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}
