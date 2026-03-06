"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp, 
  Calendar,
  Loader2,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/complaints/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  const pieData = stats ? [
    { name: 'Open', value: stats.open, color: '#1A56DB' },
    { name: 'In Progress', value: stats.inProgress, color: '#F59E0B' },
    { name: 'Resolved', value: stats.resolved, color: '#10B981' },
  ] : [];

  const handleExport = async () => {
    try {
        const res = await fetch("/api/admin/export");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nivaas-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (err) {
        alert("Export failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            System Reports
          </h1>
          <p className="text-sm text-text-muted">Analyze resolution efficiency and system performance.</p>
        </div>
        <Button onClick={handleExport} className="gap-2 h-11 shadow-lg shadow-primary/20">
          <Download className="h-4 w-4" />
          Export All Data (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-card border border-border p-6">
          <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-primary" />
            Complaint Distribution
          </h3>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/3 space-y-4">
                {pieData.map((item) => (
                    <div key={item.name} className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-text-muted">{item.name}</span>
                        <span className="text-xl font-bold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Resolution Progress */}
        <div className="bg-white rounded-card border border-border p-6">
          <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Success Metrics
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-text-muted">Resolution Rate</span>
                <span className="font-bold text-success">
                  {stats?.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success transition-all duration-1000" 
                  style={{ width: `${stats?.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-primary-light/30 border border-primary/10">
                    <Calendar className="h-4 w-4 text-primary mb-2" />
                    <p className="text-xs text-text-muted">Avg. Resolution</p>
                    <p className="text-lg font-bold text-primary">2.4 Days</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <TrendingUp className="h-4 w-4 text-amber-600 mb-2" />
                    <p className="text-xs text-text-muted">User Satisfaction</p>
                    <p className="text-lg font-bold text-amber-600">4.8/5.0</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-slate-900 rounded-card p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-display font-bold mb-4">Detailed Data Audit</h2>
          <p className="text-sidebar-text mb-8 leading-relaxed">
            Generate an encrypted CSV report containing all user details, complaint timelines, 
            resolution notes, and file attachments for internal auditing.
          </p>
          <div className="flex gap-4">
            <Button onClick={handleExport} size="lg" className="bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-5 w-5" />
              Download Audit File
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              <FileText className="mr-2 h-5 w-5" />
              PDF Format
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
