"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  User as UserIcon,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("RESIDENT");

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?role=${activeTab}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (user: any) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            User Management
          </h1>
          <p className="text-sm text-text-muted">Manage system access for residents and staff.</p>
        </div>
        <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add New User
        </Button>
      </div>

      <div className="bg-white rounded-card border border-border overflow-hidden shadow-sm">
        <div className="border-b border-border p-4 bg-surface/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-white p-1 rounded-lg border border-border">
            {['RESIDENT', 'AGENT', 'ADMIN'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab}s
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input 
                className="pl-9 h-9 text-sm" 
                placeholder="Search users..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface/30">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                    {activeTab === 'RESIDENT' ? 'Room' : 'Department'}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Registered</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage src={user.image} />
                          <AvatarFallback className="bg-primary-light text-primary font-bold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{user.name}</p>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                        {user.role === 'ADMIN' ? <Shield className="h-3 w-3 text-amber-500" /> : <UserIcon className="h-3 w-3 text-primary" />}
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-sm text-text-primary">
                            {activeTab === 'RESIDENT' ? user.roomNumber || 'N/A' : user.department || 'Staff'}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleUserStatus(user)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            user.isActive 
                                ? 'bg-success/10 text-success hover:bg-danger/10 hover:text-danger' 
                                : 'bg-danger/10 text-danger hover:bg-success/10 hover:text-success'
                        }`}
                      >
                        {user.isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {user.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-text-muted italic">
                        No users found.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
