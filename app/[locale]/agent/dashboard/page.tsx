"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import ComplaintCard from "@/components/shared/ComplaintCard";
import { Sheet } from "@/components/ui/sheet";
import AgentWorkView from "@/components/shared/AgentWorkView";
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  Inbox,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgentDashboard() {
  const { data: session } = useSession();
  const t = useTranslations('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("PENDING"); // PENDING = OPEN + IN_PROGRESS

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          fetch(`/api/complaints/stats?agentId=${(session?.user as any)?.id || ''}`),
          fetch(`/api/complaints?agentId=${(session?.user as any)?.id || ''}&status=${statusFilter === 'PENDING' ? '' : statusFilter}`)
        ]);

        const [statsData, complaintsData] = await Promise.all([
          statsRes.json(),
          complaintsRes.json()
        ]);

        setStats(statsData);
        // If PENDING, filter manually for OPEN or IN_PROGRESS/URGENT
        if (statusFilter === 'PENDING') {
            setComplaints(complaintsData.filter((c: any) => c.status !== 'RESOLVED' && c.status !== 'CLOSED'));
        } else {
            setComplaints(complaintsData);
        }
      } catch (err) {
        console.error("Error fetching agent data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter]);

  const handleWorkOn = (complaint: any) => {
    setSelectedComplaint(complaint);
    setIsSheetOpen(true);
  };

  const onUpdate = () => {
    // Refresh data after update
    setStatusFilter(statusFilter); // Trigger effect
    setIsSheetOpen(false);
  };

  if (loading && !stats) {
    return (
      <DashboardLayout role="AGENT">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="AGENT">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-text-primary">
          Agent Dashboard
        </h1>
        <p className="text-text-muted">Manage your assigned tasks and resolve issues.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Assigned to Me" 
          value={stats?.total || 0} 
          icon={ClipboardList} 
          variant="primary" 
        />
        <StatCard 
          title="Urgent" 
          value={stats?.urgent || 0} 
          icon={AlertCircle} 
          variant="danger" 
        />
        <StatCard 
          title="In Progress" 
          value={stats?.inProgress || 0} 
          icon={Clock} 
          variant="amber" 
        />
        <StatCard 
          title="Resolved" 
          value={stats?.resolved || 0} 
          icon={CheckCircle2} 
          variant="success" 
        />
      </div>

      {/* Task Queue Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            Task Queue
          </h2>
          <div className="flex bg-card p-1 rounded-button border border-border">
            {['PENDING', 'RESOLVED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-button text-xs font-bold transition-all ${
                  statusFilter === s 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {complaints.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {complaints.sort((a, b) => {
                if (a.priority === 'URGENT' && b.priority !== 'URGENT') return -1;
                if (a.priority !== 'URGENT' && b.priority === 'URGENT') return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }).map((complaint) => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint} 
                onClick={() => handleWorkOn(complaint)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-border p-20 rounded-card text-center">
            <Inbox className="h-12 w-12 text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted">No {statusFilter.toLowerCase()} tasks found.</p>
          </div>
        )}
      </div>

      {/* Work Sheet */}
      <Sheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title={`Assigned Task #${selectedComplaint?.id.slice(-6).toUpperCase()}`}
      >
        <AgentWorkView complaint={selectedComplaint} onUpdate={onUpdate} />
      </Sheet>
    </DashboardLayout>
  );
}
