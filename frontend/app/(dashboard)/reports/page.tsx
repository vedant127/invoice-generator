"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Download } from "lucide-react";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    total_revenue: 124500.00, 
    outstanding: 18240.00, 
    overdue: 3150.00,
    paid_percentage: 65,
    pending_percentage: 25,
    overdue_percentage: 10
  });

  useEffect(() => {
    // Attempting to fetch real report data if backend supports it
    api.get("/api/v1/reports/summary").then(res => {
      if (res.data && res.data.total_revenue !== undefined) {
        setStats(prev => ({...prev, ...res.data}));
      }
    }).catch(err => {
      console.error("Reports fetch error", err);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight font-h1">Reports & Analytics</h2>
          <p className="text-on-surface-variant font-medium mt-1">Deep dive into your revenue streams and payment performance.</p>
        </div>
        <button className="h-12 px-6 bg-white border border-outline-variant text-on-surface rounded-xl font-black flex items-center gap-2 hover:bg-surface-container transition-all shadow-sm active:scale-95 uppercase tracking-widest text-xs">
          <span className="material-symbols-outlined text-lg">download</span>
          Export Report
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Billed Card */}
        <div className="bg-white rounded-2xl p-8 border border-outline-variant shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Total Revenue</h3>
          </div>
          <div className="mb-4 relative z-10">
            <span className="text-3xl font-black text-on-surface tracking-tighter font-h2">
              ${stats.total_revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-primary bg-primary/5 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest relative z-10">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12.5% vs Last Period</span>
          </div>
        </div>

        {/* Outstanding Card */}
        <div className="bg-white rounded-2xl p-8 border border-outline-variant shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/5 rounded-full opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Outstanding</h3>
          </div>
          <div className="mb-2 relative z-10">
            <span className="text-3xl font-black text-on-surface tracking-tighter font-h2">
              ${stats.outstanding.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </span>
          </div>
          <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mt-4">14 Pending Invoices</p>
        </div>

        {/* Overdue Card */}
        <div className="bg-white rounded-2xl p-8 border border-outline-variant shadow-sm hover:shadow-md transition-all group relative overflow-hidden border-l-4 border-l-error">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Overdue</h3>
          </div>
          <div className="mb-2 relative z-10">
            <span className="text-3xl font-black text-on-surface tracking-tighter font-h2">
              ${stats.overdue.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </span>
          </div>
          <p className="text-xs font-black text-error uppercase tracking-widest mt-4 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-error rounded-full animate-pulse"></span> Critical Priority
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Chart Visualization */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-outline-variant shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h3 className="text-xl font-black text-on-surface tracking-tight">Revenue Growth</h3>
            <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/50">
              <button className="px-4 py-1.5 text-xs font-black bg-white text-primary rounded-lg shadow-sm border border-outline-variant uppercase tracking-widest">6 Months</button>
              <button className="px-4 py-1.5 text-xs font-black text-on-surface-variant hover:text-on-surface uppercase tracking-widest">12 Months</button>
            </div>
          </div>
          
          <div className="h-72 flex items-end justify-between gap-4 border-b border-outline-variant/30 pb-2 relative bg-gradient-to-b from-primary/5 to-transparent rounded-t-xl">
            {/* Visual Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-4 px-2 opacity-10">
              {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-on-surface-variant border-dashed"></div>)}
            </div>
            
            {/* Dynamic Bars */}
            {[
              { m: 'Jan', h: 'h-[40%]', v: '$12k' },
              { m: 'Feb', h: 'h-[60%]', v: '$18k' },
              { m: 'Mar', h: 'h-[35%]', v: '$10k' },
              { m: 'Apr', h: 'h-[80%]', v: '$24k' },
              { m: 'May', h: 'h-[70%]', v: '$21k' },
              { m: 'Jun', h: 'h-[95%]', v: '$28k', active: true },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer relative z-10">
                <div className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 relative shadow-sm ${bar.active ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/40'} ${bar.h}`}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                    {bar.v}
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${bar.active ? 'text-primary' : 'text-on-surface-variant'}`}>{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown Circle Representation */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-8 border border-outline-variant shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-on-surface tracking-tight mb-8">Payment Health</h3>
          
          <div className="space-y-8 flex-grow">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Successfully Paid</span>
                <span className="text-sm font-black text-primary">{stats.paid_percentage}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 border border-outline-variant/30 p-0.5 shadow-inner">
                <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.paid_percentage}%` }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">In Pipeline</span>
                <span className="text-sm font-black text-tertiary-container">{stats.pending_percentage}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 border border-outline-variant/30 p-0.5 shadow-inner">
                <div className="bg-tertiary-container h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.pending_percentage}%` }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Overdue/Risk</span>
                <span className="text-sm font-black text-error">{stats.overdue_percentage}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 border border-outline-variant/30 p-0.5 shadow-inner">
                <div className="bg-error h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.overdue_percentage}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-outline-variant/30">
            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-outline-variant flex items-center justify-center text-on-surface-variant shadow-sm">
                <span className="material-symbols-outlined">calendar_today</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Next Payout</p>
                <p className="text-sm font-black text-on-surface">Nov 12, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
