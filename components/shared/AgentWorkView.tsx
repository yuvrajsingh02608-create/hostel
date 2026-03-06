"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Send,
  Loader2,
  AlertCircle,
  UserPlus
} from "lucide-react";
import { useSession } from "next-auth/react";
import ComplaintStatusBadge from "./ComplaintStatusBadge";
import Timeline from "./Timeline";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface AgentWorkViewProps {
  complaint: any;
  onUpdate: () => void;
}

const AgentWorkView: React.FC<AgentWorkViewProps> = ({ complaint, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [status, setStatus] = useState(complaint?.status || "OPEN");
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState(complaint?.agentId || "");
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  React.useEffect(() => {
    if (userRole === 'ADMIN') {
      fetch("/api/users?role=AGENT")
        .then(res => res.json())
        .then(data => setAgents(data));
    }
  }, [userRole]);

  const handleUpdate = async (updateData: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!complaint) return null;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between bg-surface p-4 rounded-card border border-border">
        <div>
          <p className="text-xs font-bold text-text-muted uppercase mb-1">Current Status</p>
          <ComplaintStatusBadge status={complaint.status} />
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-text-muted uppercase mb-1">Priority</p>
          <Badge variant={complaint.priority === 'URGENT' ? 'danger' : 'outline'}>
            {complaint.priority}
          </Badge>
        </div>
      </div>

      {/* Resident Context */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Issue Details</h3>
        <div className="bg-card border border-border rounded-card p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Resident:</span>
            <span className="font-bold">{complaint.resident?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Room:</span>
            <span className="font-bold">{complaint.roomNumber}</span>
          </div>
          <p className="text-sm text-text-primary pt-2 border-t border-border mt-2 italic">
            &quot;{complaint.description}&quot;
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="space-y-6 pt-4 border-t border-border">
        <div className="space-y-2">
            <Label>Update Status</Label>
            <div className="grid grid-cols-2 gap-2">
                <Button 
                    variant={status === 'IN_PROGRESS' ? 'amber' : 'outline'}
                    onClick={() => {
                        handleUpdate({ status: 'IN_PROGRESS' });
                    }}
                    disabled={loading || complaint.status === 'RESOLVED'}
                    className="gap-2"
                >
                    <Clock className="h-4 w-4" />
                    In Progress
                </Button>
                <Button 
                    variant={status === 'RESOLVED' ? 'success' : 'outline'}
                    onClick={() => setStatus('RESOLVED')}
                    disabled={loading || complaint.status === 'RESOLVED'}
                    className="gap-2"
                >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Resolved
                </Button>
            </div>
        </div>

        {userRole === 'ADMIN' && (
          <div className="space-y-3 p-4 bg-primary/5 rounded-card border border-primary/10">
            <Label className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Assign Specialist
            </Label>
            <div className="flex gap-2">
              <select 
                className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="">Select an Agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.department || 'General'})
                  </option>
                ))}
              </select>
              <Button 
                size="sm" 
                onClick={() => handleUpdate({ agentId: selectedAgent })}
                disabled={loading || selectedAgent === complaint.agentId}
              >
                Assign
              </Button>
            </div>
          </div>
        )}

        {status === 'RESOLVED' && complaint.status !== 'RESOLVED' && (
            <div className="space-y-4 bg-success/5 p-4 rounded-card border border-success/20 animate-in fade-in slide-in-from-top-4">
                <div className="space-y-2">
                    <Label htmlFor="res-note" className="text-success font-bold">Resolution Note (Visible to Resident)</Label>
                    <Textarea 
                        id="res-note"
                        placeholder="Explain how the issue was fixed..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        required
                    />
                </div>
                <Button 
                    variant="success" 
                    className="w-full" 
                    onClick={() => handleUpdate({ status: 'RESOLVED', resolutionNote: note })}
                    disabled={loading || note.length < 5}
                >
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm Resolution'}
                </Button>
            </div>
        )}

        <div className="space-y-2">
            <Label htmlFor="internal-note">Internal Notes (Staff Only)</Label>
            <Textarea 
                id="internal-note"
                placeholder="Private notes for other staff/admins..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
            />
                <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleUpdate({ internalNote })}
                disabled={loading || !internalNote}
            >
                Add Note
            </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6">History</h3>
        <Timeline events={complaint.timeline || []} />
      </div>
    </div>
  );
};

export default AgentWorkView;
