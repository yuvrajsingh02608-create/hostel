"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Settings, 
  User, 
  Bell, 
  Shield,
  CreditCard,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  Lock,
  Mail,
  Smartphone,
  Plus,
  Trash2,
  Camera,
  Image as ImageIcon
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPlaceholder({ role }: { role: 'RESIDENT' | 'AGENT' | 'ADMIN' }) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("Profile");
  const [density, setDensity] = useState("Comfortable");
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { label: 'Profile', icon: User },
    { label: 'Notifications', icon: Bell },
    { label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!mounted) return null;

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            Account Settings
          </h1>
          <p className="text-sm text-text-muted">Manage your profile and application preferences.</p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 text-success bg-success/10 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-bold">Settings saved successfully!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-1">
          {tabs.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.label
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-text-muted hover:bg-primary-light/50 hover:text-primary'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className={`bg-card rounded-card border border-border overflow-hidden shadow-sm min-h-[500px] ${density === 'Compact' ? 'scale-[0.98] origin-top transition-transform duration-300' : ''}`}>
            {activeTab === 'Profile' && (
              <div className="p-8 space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-primary-light transition-all group-hover:opacity-75">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full text-white">
                      <Camera className="h-6 w-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-bold text-text-primary">{session?.user?.name || "User Name"}</h2>
                    <p className="text-text-muted mb-4">{session?.user?.email || "email@example.com"}</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {role}
                      </span>
                      <span className="px-3 py-1 bg-sidebar-bg/10 text-sidebar-bg text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Resident ID: #RD9402
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue={session?.user?.name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Office</Label>
                    <Input defaultValue={session?.user?.email || ""} readOnly className="bg-surface" />
                  </div>
                  <div className="space-y-2">
                    <Label>Room Number / Department</Label>
                    <Input defaultValue={(session?.user as any)?.roomNumber || "304-B"} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="+91 98765-43210" />
                  </div>
                </div>

                <div className="pt-6">
                  <Button onClick={handleSave} className="px-8 font-bold">Save Changes</Button>
                </div>

                <div className="pt-10 border-t border-border space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Profile Gallery</h3>
                    <p className="text-sm text-text-muted mt-1">Manage the photos that appear on your public profile.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* Add Photo Button */}
                    <button className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-2">
                      <div className="p-3 bg-surface rounded-full group-hover:bg-primary/10 transition-colors">
                        <Plus className="h-6 w-6 text-text-muted group-hover:text-primary" />
                      </div>
                      <span className="text-xs font-bold text-text-muted group-hover:text-primary">Add Photo</span>
                    </button>

                    <div className="aspect-square rounded-2xl border border-border overflow-hidden relative group">
                      <img 
                        src="/Users/yuvrajsingh/.gemini/antigravity/brain/3cbcb6d7-f85d-4abd-b2c2-1ed173da89b4/profile_gallery_placeholder_1_1772731947554.png" 
                        alt="Profile photo 1"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white/20 border-white/40 text-white hover:bg-white/40">
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="icon" className="h-8 w-8 rounded-full">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="aspect-square rounded-2xl border border-border overflow-hidden relative group">
                      <img 
                        src="/Users/yuvrajsingh/.gemini/antigravity/brain/3cbcb6d7-f85d-4abd-b2c2-1ed173da89b4/profile_gallery_placeholder_2_1772731963867.png" 
                        alt="Profile photo 2"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white/20 border-white/40 text-white hover:bg-white/40">
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="icon" className="h-8 w-8 rounded-full">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="aspect-square rounded-2xl border border-border overflow-hidden relative group">
                      <img 
                        src="/Users/yuvrajsingh/.gemini/antigravity/brain/3cbcb6d7-f85d-4abd-b2c2-1ed173da89b4/profile_gallery_placeholder_3_1772731979477.png" 
                        alt="Profile photo 3"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white/20 border-white/40 text-white hover:bg-white/40">
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="icon" className="h-8 w-8 rounded-full">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="p-8 space-y-8 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-text-primary mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start justify-between p-4 rounded-xl border border-border bg-surface/30">
                    <div className="flex gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">Email Notifications</p>
                        <p className="text-xs text-text-muted mt-1">Receive complaint status updates via email.</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
                  </div>

                  <div className="flex items-start justify-between p-4 rounded-xl border border-border bg-surface/30">
                    <div className="flex gap-4">
                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">Push Notifications</p>
                        <p className="text-xs text-text-muted mt-1">Get real-time alerts for new messages or announcements.</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
                  </div>

                  <div className="flex items-start justify-between p-4 rounded-xl border border-border bg-surface/30">
                    <div className="flex gap-4">
                      <div className="p-2 bg-success/10 rounded-lg text-success">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">Marketing Emails</p>
                        <p className="text-xs text-text-muted mt-1">Updates about new platform features and newsletters.</p>
                      </div>
                    </div>
                    <input type="checkbox" className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
                  </div>
                </div>

                <div className="pt-6">
                  <Button onClick={handleSave} className="px-8 font-bold">Update Preferences</Button>
                </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="p-8 space-y-8 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-text-primary mb-6">Security & Privacy</h2>
                
                <div className="p-6 rounded-2xl border border-border bg-surface/30 space-y-6">
                  <h3 className="font-bold text-text-primary flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Change Password
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" />
                    </div>
                  </div>
                  <Button onClick={handleSave} className="w-full sm:w-auto font-bold">Update Password</Button>
                </div>

                <div className="p-6 rounded-2xl border border-danger/20 bg-danger/5 space-y-4">
                  <h3 className="font-bold text-danger">Danger Zone</h3>
                  <p className="text-xs text-text-muted">Deleting your account is permanent. This will erase all your complaint history and data.</p>
                  <Button variant="outline" className="text-danger border-danger/20 hover:bg-danger hover:text-white transition-all font-bold">
                    Request Account Deletion
                  </Button>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
