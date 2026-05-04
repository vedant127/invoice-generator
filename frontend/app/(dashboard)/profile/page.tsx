"use client";
import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp, 
  Receipt, 
  Users, 
  Edit2,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total_invoices: 1248,
    active_clients: 84,
    revenue: "$128K"
  });

  useEffect(() => {
    api.get("/api/v1/users/me")
      .then(res => setUser(res.data))
      .catch(err => console.error("Failed to fetch user:", err));
    
    // Fetch stats if available, otherwise use defaults
    api.get("/api/v1/invoices/")
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          const totalRev = res.data.reduce((acc: number, inv: any) => acc + (inv.total_amount || 0), 0);
          setStats(prev => ({
            ...prev,
            total_invoices: res.data.length,
            revenue: `$${(totalRev / 1000).toFixed(0)}K`
          }));
        }
      });
    
    api.get("/api/v1/clients/")
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setStats(prev => ({
            ...prev,
            active_clients: res.data.length
          }));
        }
      });
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm transition-colors">
          <div className="w-24 h-24 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 dark:shadow-none border-4 border-white dark:border-slate-800">
            {user ? getInitials(user.full_name) : "..."}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user?.full_name || "Loading..."}</h1>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">
              Admin
            </span>
            <div className="mt-3 text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {user?.email}
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Full Name</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{user?.full_name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Email Address</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Phone</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">+91 98765 43210</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Location</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">Ahmedabad, India</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Joined</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">Jan 12, 2024</span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Account Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Account Role</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">Admin</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Current Plan</span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">Pro Business</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Account Status</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Last Login</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">Today, 4:32 PM</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">2FA Security</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">Enabled</span>
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors lg:col-span-2">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Activity Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-default">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.total_invoices}</div>
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Total Invoices</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-default">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.active_clients}</div>
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Active Clients</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-default">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.revenue}</div>
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Revenue Generated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
