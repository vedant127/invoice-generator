"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CreditCard, Download, Search, Filter, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Attempting to fetch payments. If endpoint doesn't exist, we will show empty state.
    api.get("/api/v1/payments").then(res => {
      setPayments(res.data);
    }).catch(err => {
      console.error("Payments fetch error", err);
    }).finally(() => setLoading(false));
  }, []);

  const filteredPayments = payments.filter((pay: any) => 
    (pay.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pay.invoice_id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:px-12 xl:px-16 pb-24 bg-[#F8F9FB] dark:bg-slate-950 font-sans animate-in fade-in duration-700 transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Payments History</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Track and manage all incoming payments and transactions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-11 px-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm">
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>
        </div>

        {/* Stats Mini Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Successful", value: payments.length, icon: <CheckCircle2 className="w-5 h-5" />, color: "emerald", bg: "emerald" },
            { label: "Pending", value: 0, icon: <Clock className="w-5 h-5" />, color: "amber", bg: "amber" },
            { label: "Disputed", value: 0, icon: <AlertCircle className="w-5 h-5" />, color: "red", bg: "red" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.bg}-50 dark:bg-${stat.bg}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Payments Table Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-colors">
          
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by payment ID or invoice..." 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none h-11 flex items-center justify-center gap-2 px-5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Payment ID</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Invoice Ref</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Method</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={6} className="px-8 py-24 text-center text-slate-400 font-bold animate-pulse">Loading payments...</td></tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center max-w-sm mx-auto">
                        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner rotate-3 hover:rotate-0 transition-transform duration-500">
                          <CreditCard className="w-10 h-10 text-blue-200 dark:text-blue-800" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Transactions Yet</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">Once your clients pay their invoices, the transaction history will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.map((pay: any) => (
                  <tr 
                    key={pay.id} 
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-colors group"
                  >
                    <td className="px-8 py-6 text-sm font-mono font-black text-slate-600 dark:text-slate-400">
                      {pay.id.split("-")[0].toUpperCase()}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        {pay.invoice_id}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                      {new Date(pay.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white">
                      ${pay.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{pay.method || "Card Payment"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Successful
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  </div>
  );
}
