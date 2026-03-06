"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ComplaintCard from "@/components/shared/ComplaintCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import AgentWorkView from "@/components/shared/AgentWorkView";
import { 
  Filter, 
  Search, 
  Loader2,
  Inbox
} from "lucide-react";

export default function AgentComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(`/api/complaints?status=${statusFilter === 'ALL' ? '' : statusFilter}`);
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [statusFilter]);

  const filteredComplaints = complaints.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="AGENT">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            Agent Task Feed
          </h1>
          <p className="text-sm text-text-muted">Browse all complaints and manage your workload.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input 
            className="pl-10 h-11" 
            placeholder="Search by ID or title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
                <Button 
                    key={status}
                    variant={statusFilter === status ? 'primary' : 'outline'}
                    size="sm"
                    className="capitalize h-11 px-4"
                    onClick={() => setStatusFilter(status)}
                >
                    {status.toLowerCase().replace('_', ' ')}
                </Button>
            ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard 
                key={complaint.id} 
                complaint={complaint} 
                onClick={() => {
                    setSelectedComplaint(complaint);
                    setIsSheetOpen(true);
                }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-border p-20 rounded-card text-center">
          <Inbox className="h-12 w-12 text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted">No tasks found.</p>
        </div>
      )}

      <Sheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title={`Work on Complaint #${selectedComplaint?.id.slice(-6).toUpperCase()}`}
      >
        <AgentWorkView complaint={selectedComplaint} onUpdate={() => {
            setStatusFilter(statusFilter);
            setIsSheetOpen(false);
        }} />
      </Sheet>
    </DashboardLayout>
  );
}
