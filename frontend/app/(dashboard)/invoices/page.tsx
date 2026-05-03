"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, FileText, Search, MoreVertical, Filter, Download, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.get("/api/v1/invoices/").then(res => {
      setInvoices(res.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => setLoading(false));
  }, []);

  const filteredInvoices = invoices.filter((inv: any) => 
    (inv.invoice_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.client?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:px-12 xl:px-16 pb-24 bg-[#F8F9FB] font-sans animate-in fade-in duration-700">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Invoices</h1>
            <p className="text-slate-500 font-medium mt-1">Manage, track, and send professional billing to your clients.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-11 px-5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link 
              href="/invoices/new" 
              className="h-11 px-6 bg-blue-600 text-white rounded-xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Invoice
            </Link>
          </div>
        </div>

        {/* Stats Mini Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Billed", value: `$${invoices.reduce((acc: number, inv: any) => acc + (inv.total_amount || 0), 0).toLocaleString()}`, icon: "payments", color: "blue" },
            { label: "Paid", value: invoices.filter((i: any) => i.status === "PAID").length, icon: "check_circle", color: "emerald" },
            { label: "Pending", value: invoices.filter((i: any) => i.status === "SENT" || i.status === "PENDING").length, icon: "schedule", color: "amber" },
            { label: "Overdue", value: invoices.filter((i: any) => i.status === "OVERDUE").length, icon: "warning", color: "red" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Invoices Table Container */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by invoice # or client name..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none h-11 flex items-center justify-center gap-2 px-5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={6} className="px-8 py-24 text-center text-slate-400 font-bold animate-pulse">Loading invoices database...</td></tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center max-w-sm mx-auto">
                        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner rotate-3 hover:rotate-0 transition-transform duration-500">
                          <FileText className="w-10 h-10 text-blue-200" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">No Invoices Found</h4>
                        <p className="text-sm text-slate-500 font-medium mb-8">Start your journey by creating your first professional invoice today.</p>
                        <Link href="/invoices/new" className="h-12 px-8 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                          <Plus className="w-5 h-5" /> Create Invoice
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : filteredInvoices.map((inv: any) => (
                  <tr 
                    key={inv.id} 
                    onClick={() => router.push(`/invoices/${inv.id}`)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group relative"
                  >
                    <td className="px-8 py-6">
                      <span className="text-sm font-mono font-black text-blue-600 group-hover:underline">
                        {inv.invoice_number || `#INV-${inv.id.split("-")[0].toUpperCase()}`}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs border border-white shadow-sm">
                          {(inv.client?.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{inv.client?.name || "Unknown Client"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">
                      {new Date(inv.created_at || inv.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-900">
                      ${(inv.total_amount || inv.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' :
                        inv.status === 'SENT' || inv.status === 'PENDING' ? 'bg-blue-50 text-blue-700' :
                        inv.status === 'OVERDUE' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inv.status === 'PAID' ? 'bg-emerald-500' :
                          inv.status === 'SENT' || inv.status === 'PENDING' ? 'bg-blue-500' :
                          inv.status === 'OVERDUE' ? 'bg-red-500' : 'bg-slate-400'
                        }`}></span>
                        {inv.status || "DRAFT"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-white hover:shadow-sm">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                      </div>
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

