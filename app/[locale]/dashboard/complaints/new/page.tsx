"use client";

import React, { useState } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  ArrowLeft, 
  Upload, 
  CheckCircle2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useSession } from "next-auth/react";

const CATEGORIES = [
  "WIFI", "MAINTENANCE", "FOOD", "HOUSEKEEPING", "SECURITY", "OTHER"
];

export default function NewComplaintPage() {
  const t = useTranslations('complaint');
  const commonT = useTranslations('common');
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "MAINTENANCE",
    description: "",
    priority: "NORMAL",
    roomNumber: (session?.user as any)?.roomNumber || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard?success=true");
      } else {
        alert("Failed to submit complaint");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="RESIDENT">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-text-muted hover:text-text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="bg-white rounded-card shadow-card border border-border p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
              Submit New Complaint
            </h1>
            <p className="text-sm text-text-muted">
              Please provide as much detail as possible to help our team resolve your issue quickly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t('title')}</Label>
              <Input 
                id="title" 
                required 
                placeholder="Briefly describe the issue"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">{t('category')}</Label>
                <select
                  id="category"
                  className="w-full h-10 px-3 rounded-button border border-border bg-white text-sm focus:ring-2 focus:ring-primary"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber">{t('room_number', { defaultValue: 'Room Number' })}</Label>
                <Input 
                  id="roomNumber" 
                  required 
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">{t('priority')}</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, priority: 'NORMAL'})}
                  className={`flex-1 h-12 rounded-card border-2 flex items-center justify-center gap-2 transition-all ${
                    formData.priority === 'NORMAL' 
                      ? 'border-primary bg-primary-light/30 text-primary' 
                      : 'border-border text-text-muted hover:border-text-muted/30'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-semibold text-sm">{t('normal')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, priority: 'URGENT'})}
                  className={`flex-1 h-12 rounded-card border-2 flex items-center justify-center gap-2 transition-all ${
                    formData.priority === 'URGENT' 
                      ? 'border-danger bg-danger/5 text-danger' 
                      : 'border-border text-text-muted hover:border-danger/30'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold text-sm">{t('urgent')}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea 
                id="description" 
                required 
                placeholder="Explain the problem in detail (e.g., When did it start? What have you tried?)"
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <p className="text-[10px] text-text-muted italic">Min. 20 characters</p>
            </div>

            <div className="space-y-2">
              <Label>{t('attachments')}</Label>
              <div className="border-2 border-dashed border-border rounded-card p-8 text-center hover:bg-surface transition-colors cursor-pointer group">
                <Upload className="h-8 w-8 text-text-muted/40 mx-auto mb-2 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-text-muted group-hover:text-text-primary">Click to upload photos</p>
                <p className="text-[10px] text-text-muted mt-1">PNG, JPG up to 10MB (Max 5 files)</p>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold"
                disabled={loading || formData.description.length < 20}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
