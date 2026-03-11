"use client";

import React, { useState, useRef } from "react";
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
  Loader2,
  X,
  ImageIcon
} from "lucide-react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  "WIFI", "MAINTENANCE", "FOOD", "HOUSEKEEPING", "SECURITY", "OTHER"
];

export default function NewComplaintPage() {
  const t = useTranslations('complaint');
  const commonT = useTranslations('common');
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "MAINTENANCE",
    description: "",
    priority: "NORMAL",
    roomNumber: (session?.user as any)?.roomNumber || "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 5) {
        alert("Maximum 5 files allowed");
        return;
      }
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (!supabase) {
      console.error("Supabase client is not initialized. Please check your environment variables.");
      return [];
    }

    const urls: string[] = [];
    for (const file of selectedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `complaints/${fileName}`;

      const { data, error } = await supabase.storage
        .from('complaints')
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('complaints')
        .getPublicUrl(filePath);
      
      urls.push(publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let attachmentUrls: string[] = [];
      if (selectedFiles.length > 0) {
        if (!supabase) {
          alert("Photo upload is currently unavailable. Please provide Supabase credentials in .env.local");
          setLoading(false);
          return;
        }
        setUploading(true);
        attachmentUrls = await uploadFiles();
        setUploading(false);
      }

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          attachments: attachmentUrls
        }),
      });

      if (res.ok) {
        router.push("/dashboard?success=true");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to submit complaint");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const [dismissWarning, setDismissWarning] = useState(false);

  return (
    <DashboardLayout role="RESIDENT">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-text-muted hover:text-text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {supabase?.isMock && !dismissWarning && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-card mb-6 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <ImageIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-800">Development Mock Mode</p>
                <p className="text-xs text-blue-700">Supabase is not configured. Photo uploads will work using placeholder images for testing.</p>
              </div>
            </div>
            <button 
              onClick={() => setDismissWarning(true)}
              className="text-blue-400 hover:text-blue-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

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
                  className="w-full h-10 px-3 rounded-button border border-border bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
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
              <p className={`text-[10px] italic ${formData.description.length < 10 ? 'text-text-muted' : 'text-success'}`}>
                {formData.description.length < 10 ? 'Min. 10 characters' : '✓ Length looks good'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t('attachments')}</Label>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-card p-8 text-center hover:bg-surface transition-colors cursor-pointer group"
              >
                <Upload className="h-8 w-8 text-text-muted/40 mx-auto mb-2 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-text-muted group-hover:text-text-primary">Click to upload photos</p>
                <p className="text-[10px] text-text-muted mt-1">PNG, JPG up to 10MB (Max 5 files)</p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-surface rounded-card border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-md border border-border flex items-center justify-center text-text-muted">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary truncate max-w-[200px]">{file.name}</p>
                          <p className="text-[10px] text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1 hover:bg-danger-light rounded-full text-text-muted hover:text-danger"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold"
                disabled={loading || uploading || formData.description.length < 10}
              >
                {loading || uploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {uploading ? 'Uploading photos...' : 'Submitting...'}
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
