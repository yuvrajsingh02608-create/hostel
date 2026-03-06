"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import AnnouncementBanner from "@/components/shared/AnnouncementBanner";
import ComplaintCard from "@/components/shared/ComplaintCard";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Sheet } from "@/components/ui/sheet";
import ComplaintDetailView from "@/components/shared/ComplaintDetailView";

export default function ResidentDashboard() {
  const { data: session } = useSession();
  const t = useTranslations('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [announcement, setAnnouncement] = useState<any>(null);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, annRes, complaintsRes] = await Promise.all([
          fetch("/api/complaints/stats"),
          fetch("/api/announcements?active=true&limit=1&target=RESIDENTS_ONLY"),
          fetch("/api/complaints?limit=5")
        ]);

        const [statsData, annData, complaintsData] = await Promise.all([
          statsRes.json(),
          annRes.json(),
          complaintsRes.json()
        ]);

        setStats(statsData);
        if (annData.length > 0) setAnnouncement(annData[0]);
        setRecentComplaints(complaintsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="RESIDENT">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="RESIDENT">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            {t('welcome', { name: session?.user?.name || 'Resident' })}
          </h1>
          <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-xs font-semibold">
            {t('room_chip', { room: (session?.user as any)?.roomNumber || 'N/A' })}
          </div>
        </div>
        
        <Link href="/dashboard/complaints/new">
          <Button className="h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            <Plus className="mr-2 h-4 w-4" />
            {t('submit_button')}
          </Button>
        </Link>
      </div>

      {/* Announcement */}
      {announcement && (
        <AnnouncementBanner 
          id={announcement.id}
          title={announcement.title}
          body={announcement.body}
          date={new Date(announcement.createdAt).toLocaleDateString()}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title={t('total_complaints')} 
          value={stats?.total || 0} 
          icon={ClipboardList} 
          variant="primary" 
        />
        <StatCard 
          title={t('open')} 
          value={stats?.open || 0} 
          icon={AlertCircle} 
          variant="primary" 
        />
        <StatCard 
          title={t('in_progress')} 
          value={stats?.inProgress || 0} 
          icon={Clock} 
          variant="amber" 
        />
        <StatCard 
          title={t('resolved')} 
          value={stats?.resolved || 0} 
          icon={CheckCircle2} 
          variant="success" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">{t('recent_complaints')}</h2>
            <Link href="/dashboard/complaints" className="text-sm font-semibold text-primary hover:underline">
              {t('view_all')}
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <ComplaintCard 
                    key={complaint.id} 
                    complaint={complaint} 
                    onClick={() => {
                        setSelectedComplaint(complaint);
                        setIsSheetOpen(true);
                    }}
                />
              ))
            ) : (
              <div className="bg-card border border-dashed border-border p-12 rounded-card text-center">
                <ClipboardList className="h-12 w-12 text-text-muted/20 mx-auto mb-4" />
                <p className="text-text-muted">{t('no_complaints', { defaultValue: 'No complaints found.' })}</p>
                <Link href="/dashboard/complaints/new" className="mt-4 inline-block text-primary font-bold hover:underline">
                    {t('submit_button')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Info/CTA Panel */}
        <div className="space-y-6">
          <div className="bg-primary rounded-card p-6 text-white overflow-hidden relative group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">{t('submit_cta_title')}</h3>
              <p className="text-primary-light/80 text-sm mb-6 leading-relaxed">
                {t('submit_cta_sub')}
              </p>
              <Link href="/dashboard/complaints/new">
                <Button variant="outline" className="w-full bg-white text-primary border-none hover:bg-white/90">
                  {t('submit_button')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Quick Help / Guide Card */}
          <div className="bg-card border border-border rounded-card p-6 shadow-sm">
            <h3 className="font-bold text-text-primary mb-4">Guidelines</h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                Be clear and concise in description.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                Attach photos for faster resolution.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                Tag urgent issues with URGENT priority.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title={`Complaint #${selectedComplaint?.id.slice(-6).toUpperCase()}`}
      >
        <ComplaintDetailView complaint={selectedComplaint} />
      </Sheet>
    </DashboardLayout>
  );
}
