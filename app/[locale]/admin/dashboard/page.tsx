"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import ComplaintCard from "@/components/shared/ComplaintCard";
import { Sheet } from "@/components/ui/sheet";
import AgentWorkView from "@/components/shared/AgentWorkView";
import { 
  Users, 
  Megaphone, 
  BarChart3, 
  Activity,
  Loader2,
  Settings,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function AdminDashboard() {
  const t = useTranslations('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Mock chart data (in real app, fetch from analytics API)
  const chartData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 12 },
    { name: 'Fri', count: 8 },
    { name: 'Sat', count: 3 },
    { name: 'Sun', count: 2 },
  ];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          fetch("/api/complaints/stats"),
          fetch("/api/complaints?limit=10")
        ]);

        const [statsData, complaintsData] = await Promise.all([
          statsRes.json(),
          complaintsRes.json()
        ]);

        setStats(statsData);
        setRecentComplaints(complaintsData);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdate = () => {
    // Refresh
    setLoading(true);
    fetch("/api/complaints?limit=10").then(r => r.json()).then(d => {
        setRecentComplaints(d);
        setLoading(false);
    });
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            Admin Overview
          </h1>
          <p className="text-sm text-text-muted">System-wide monitoring and management.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            System Config
          </Button>
          <Button size="sm" className="gap-2">
            <Megaphone className="h-4 w-4" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Residents" 
          value={stats?.registeredResidents || 0} 
          icon={Users} 
          variant="primary" 
        />
        <StatCard 
          title="Active Agents" 
          value={stats?.activeAgents || 0} 
          icon={ShieldCheck} 
          variant="success" 
        />
        <StatCard 
          title="Urgent Tasks" 
          value={stats?.urgent || 0} 
          icon={Activity} 
          variant="danger" 
        />
        <StatCard 
          title="Total Complaints" 
          value={stats?.total || 0} 
          icon={BarChart3} 
          variant="primary" 
        />
      </div>

      {/* Analytics & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-card rounded-card border border-border p-6">
          <h3 className="font-bold text-text-primary mb-6">Complaint Volume (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                />
                <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#1A56DB" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text-primary">Recent Activity</h3>
            <span className="text-[10px] font-bold text-success animate-pulse uppercase tracking-widest">Live</span>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((c) => (
                <div 
                    key={c.id} 
                    onClick={() => { setSelectedComplaint(c); setIsSheetOpen(true); }}
                    className="p-3 bg-white border border-border rounded-lg hover:border-primary cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-text-muted">#{c.id.slice(-6).toUpperCase()}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        c.status === 'URGENT' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                    }`}>
                        {c.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-text-primary line-clamp-1">{c.title}</p>
                  <p className="text-[10px] text-text-muted mt-1">{c.resident?.name} • Room {c.roomNumber}</p>
                </div>
              ))
            ) : (
                <div className="text-center py-10 text-text-muted text-sm italic">
                    No recent activity.
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title={`Manage Complaint #${selectedComplaint?.id.slice(-6).toUpperCase()}`}
      >
        <AgentWorkView complaint={selectedComplaint} onUpdate={handleUpdate} />
      </Sheet>
    </DashboardLayout>
  );
}
