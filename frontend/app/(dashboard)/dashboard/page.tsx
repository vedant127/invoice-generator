"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  DollarSign, 
  MoreHorizontal,
  ChevronRight,
  PlusCircle,
  Download
} from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_revenue: 128430.00,
    total_invoices: 1248,
    active_clients: 84,
    revenue_growth: "+12.5%",
    invoice_pending: "42 Pending",
    client_growth: "+4 new"
  });

  const [recentPayments, setRecentPayments] = useState([
    { id: "PAY-89241", client: "Fleurish Creative", clientInitials: "FC", invoice: "TSN-904824", date: "Jun 24, 2025", amount: 3685.00, status: "Success" },
    { id: "PAY-89242", client: "Design Studio Inc", clientInitials: "DS", invoice: "TSN-904825", date: "Jun 23, 2025", amount: 1200.00, status: "Pending" },
    { id: "PAY-89243", client: "Motion Spark", clientInitials: "MS", invoice: "TSN-904826", date: "Jun 22, 2025", amount: 5400.00, status: "Success" }
  ]);

  const [topClients, setTopClients] = useState([
    { name: "Fleurish Creative", email: "hello@fleurish.com", initials: "FC", amount: 42500, color: "bg-primary/10 text-primary" },
    { name: "Design Studio Inc", email: "contact@designstudio.io", initials: "DS", amount: 28900, color: "bg-orange-100 text-orange-600" },
    { name: "Motion Spark", email: "hi@motionspark.com", initials: "MS", amount: 19200, color: "bg-purple-100 text-purple-600" }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [invoicesRes, clientsRes] = await Promise.all([
          api.get("/api/v1/invoices/"),
          api.get("/api/v1/clients/")
        ]);

        if (invoicesRes.data && Array.isArray(invoicesRes.data)) {
          const totalRev = invoicesRes.data.reduce((acc: number, inv: any) => acc + (inv.total || 0), 0);
          setStats(prev => ({
            ...prev,
            total_revenue: totalRev > 0 ? totalRev : prev.total_revenue,
            total_invoices: invoicesRes.data.length > 0 ? invoicesRes.data.length : prev.total_invoices,
            invoice_pending: `${invoicesRes.data.filter((i: any) => i.status === 'pending').length} Pending`
          }));

          // Map real invoices to the payments table for demonstration
          if (invoicesRes.data.length > 0) {
            const mapped = invoicesRes.data.slice(0, 5).map((inv: any, idx: number) => ({
              id: `PAY-${90000 + idx}`,
              client: inv.client_name || "Unknown Client",
              clientInitials: (inv.client_name || "UC").split(' ').map((n:any) => n[0]).join('').toUpperCase(),
              invoice: inv.invoice_number || `INV-${inv.id}`,
              date: new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              amount: inv.total || 0,
              status: inv.status === 'paid' ? 'Success' : 'Pending'
            }));
            setRecentPayments(mapped);
          }
        }

        if (clientsRes.data && Array.isArray(clientsRes.data)) {
          setStats(prev => ({
            ...prev,
            active_clients: clientsRes.data.length > 0 ? clientsRes.data.length : prev.active_clients
          }));
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-primary rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">{stats.revenue_growth}</span>
          </div>
          <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">Total Revenue</p>
          <h3 className="text-3xl font-black mt-1 text-on-surface tracking-tighter">
            ${stats.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">vs. $114,200 last month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">description</span>
            </div>
            <span className="text-xs font-black text-on-surface-variant bg-surface-container px-3 py-1 rounded-full uppercase tracking-wider">{stats.invoice_pending}</span>
          </div>
          <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">Total Invoices</p>
          <h3 className="text-3xl font-black mt-1 text-on-surface tracking-tighter">{stats.total_invoices.toLocaleString()}</h3>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Average $1,050 per invoice</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">{stats.client_growth}</span>
          </div>
          <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">Active Clients</p>
          <h3 className="text-3xl font-black mt-1 text-on-surface tracking-tighter">{stats.active_clients}</h3>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Retention rate: 94%</p>
        </div>
      </section>

      {/* Revenue Trends Chart */}
      <section className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-black text-on-surface tracking-tight">Revenue Trends</h3>
            <p className="text-sm text-on-surface-variant font-medium mt-1">Monthly breakdown of your earnings</p>
          </div>
          <select className="text-sm font-bold border-outline-variant rounded-xl bg-surface px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        
        <div className="h-72 flex items-end justify-between gap-4 p-4 rounded-2xl border border-dashed border-outline-variant/50 bg-gradient-to-b from-primary/5 to-transparent relative">
          {/* Chart Horizontal Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-4 px-2 opacity-20">
            {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-outline"></div>)}
          </div>

          {[
            { m: 'Jan', h: 'h-24', v: '$12.4k' },
            { m: 'Feb', h: 'h-32', v: '$15.2k' },
            { m: 'Mar', h: 'h-28', v: '$14.8k' },
            { m: 'Apr', h: 'h-44', v: '$22.1k' },
            { m: 'May', h: 'h-36', v: '$18.5k' },
            { m: 'Jun', h: 'h-56', v: '$28.4k', active: true },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative z-10">
              <div className={`w-full max-w-[50px] rounded-t-xl transition-all duration-500 cursor-pointer relative shadow-sm hover:shadow-lg ${bar.active ? 'bg-primary shadow-blue-200' : 'bg-primary/20 hover:bg-primary/40'} ${bar.h}`}>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                  {bar.v}
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${bar.active ? 'text-primary' : 'text-on-surface-variant'}`}>{bar.m}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Payments Table */}
      <section className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center">
          <h3 className="text-xl font-black text-on-surface tracking-tight">Recent Payments</h3>
          <button className="text-sm font-black text-primary hover:underline uppercase tracking-widest">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
                <th className="px-8 py-5">Payment ID</th>
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5">Invoice #</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Amount</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {recentPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <td className="px-8 py-5 text-sm font-bold text-primary">{pay.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-container text-[11px] flex items-center justify-center font-black text-on-surface-variant shadow-sm">{pay.clientInitials}</div>
                      <span className="text-sm font-bold text-on-surface">{pay.client}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">{pay.invoice}</td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">{pay.date}</td>
                  <td className="px-8 py-5 text-sm font-black text-right text-on-surface">${pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      pay.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pay.status === 'Success' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Grid: Clients & Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        {/* Top Clients */}
        <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-xl font-black text-on-surface tracking-tight">Top Clients</h3>
            <button className="p-2 hover:bg-surface-container rounded-xl transition-all">
              <span className="material-symbols-outlined text-on-surface-variant">more_horiz</span>
            </button>
          </div>
          <div className="p-4 flex-1 space-y-2">
            {topClients.map((client, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-2xl transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${client.color}`}>{client.initials}</div>
                  <div>
                    <p className="text-sm font-black text-on-surface">{client.name}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{client.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-on-surface">${client.amount.toLocaleString()}</p>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Total Billed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-primary p-8 rounded-2xl text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-xl font-black mb-2 tracking-tight relative z-10">Automate your invoicing</h3>
            <p className="text-sm text-blue-100 mb-8 font-medium leading-relaxed relative z-10">Connect your bank account to automatically reconcile payments and save up to 10 hours a week.</p>
            <button className="w-full py-4 bg-white text-primary font-black rounded-xl hover:bg-blue-50 transition-all active:scale-95 shadow-xl relative z-10 uppercase tracking-widest text-xs">
              Connect Bank Account
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex items-center gap-5 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-2xl">help_center</span>
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm text-on-surface uppercase tracking-wider">Need help with Reports?</h4>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Schedule a 15-min walkthrough with an expert.</p>
            </div>
            <button className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</button>
          </div>
        </div>
      </section>
    </div>
  );
}
