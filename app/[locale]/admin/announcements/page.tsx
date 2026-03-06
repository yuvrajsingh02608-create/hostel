"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Megaphone, 
  Trash2, 
  Clock, 
  Users, 
  Search,
  Loader2,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function AnnouncementManagementPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    target: "ALL",
    expiresAt: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: "", body: "", target: "ALL", expiresAt: "" });
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            Announcements
          </h1>
          <p className="text-sm text-text-muted">Broadcast important updates to your hostel community.</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-primary">{announcements.length} Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="bg-white rounded-card border border-border p-6 h-fit shadow-sm">
          <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2">
            Post New Update
          </h3>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                required 
                placeholder="e.g., Water Maintenance Update" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <div className="grid grid-cols-2 gap-2">
                {['ALL', 'RESIDENTS_ONLY', 'AGENTS_ONLY'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({...formData, target: t})}
                    className={`text-[10px] font-bold py-2 rounded border transition-all ${
                        formData.target === t 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-white border-border text-text-muted hover:border-primary/50'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Announcement Body</Label>
              <Textarea 
                required 
                placeholder="Details of the announcement..." 
                className="min-h-[120px]"
                value={formData.body}
                onChange={(e) => setFormData({...formData, body: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Expires At (Optional)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input 
                    type="date" 
                    className="pl-10"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-bold" disabled={creating}>
              {creating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Post Announcement'}
            </Button>
          </form>
        </div>

        {/* Existing Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text-primary">Posted Announcements</h3>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.3 w-3.3 text-text-muted" />
              <Input className="pl-9 h-8 text-xs" placeholder="Search..." />
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-primary mx-auto" /></div>
            ) : announcements.length > 0 ? (
                announcements.map((ann) => (
                    <div key={ann.id} className="bg-white border border-border rounded-lg p-5 hover:border-primary transition-all group overflow-hidden relative">
                        {/* Target Ribbon */}
                        <div className={`absolute top-0 right-0 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white ${
                            ann.target === 'ALL' ? 'bg-primary' : ann.target === 'AGENTS_ONLY' ? 'bg-amber-500' : 'bg-success'
                        }`}>
                            {ann.target.replace('_', ' ')}
                        </div>

                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-text-primary pr-12">{ann.title}</h4>
                            <button className="text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger transition-all">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-sm text-text-muted mb-4 whitespace-pre-wrap">{ann.body}</p>
                        <div className="flex items-center gap-4 text-[10px] text-text-muted border-t border-border pt-3">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Posted {new Date(ann.createdAt).toLocaleDateString()}
                            </div>
                            {ann.expiresAt && (
                                <div className="flex items-center gap-1 text-danger/70">
                                    <AlertCircle className="h-3 w-3" />
                                    Expires {new Date(ann.expiresAt).toLocaleDateString()}
                                </div>
                            )}
                            <div className="flex items-center gap-1 ml-auto">
                                <Users className="h-3 w-3" />
                                Target: {ann.target}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white border border-dashed border-border py-20 rounded-lg text-center">
                    <Megaphone className="h-10 w-10 text-text-muted/20 mx-auto mb-4" />
                    <p className="text-text-muted italic">No announcements posted yet.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
