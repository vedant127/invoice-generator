"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, FileText, Search, MoreVertical, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/v1/invoices").then(res => {
      setInvoices(res.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#191b23] tracking-tight font-heading">Invoices</h2>
          <p className="text-[#434655] font-medium mt-1">Manage and track your customer billing history.</p>
        </div>
        <Link 
          href="/invoices/new" 
          className="h-12 px-6 bg-[#004ac6] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#003ea8] transition-all shadow-[0_4px_14px_0_rgba(0,74,198,0.39)] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Invoice
        </Link>
      </div>

      <div className="bg-white border border-[#c3c6d7] rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-[#c3c6d7] flex flex-col md:flex-row justify-between items-center gap-4 bg-[#faf8ff]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434655]" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full bg-white border border-[#c3c6d7] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-[#004ac6] outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-[#434655] bg-white border border-[#c3c6d7] rounded-xl hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#faf8ff]">
                <th className="px-6 py-4 text-xs font-bold text-[#434655] uppercase tracking-widest border-b border-[#c3c6d7]">Invoice #</th>
                <th className="px-6 py-4 text-xs font-bold text-[#434655] uppercase tracking-widest border-b border-[#c3c6d7]">Client Name</th>
                <th className="px-6 py-4 text-xs font-bold text-[#434655] uppercase tracking-widest border-b border-[#c3c6d7]">Issue Date</th>
                <th className="px-6 py-4 text-xs font-bold text-[#434655] uppercase tracking-widest border-b border-[#c3c6d7]">Total Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-[#434655] uppercase tracking-widest border-b border-[#c3c6d7]">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#434655] uppercase tracking-widest border-b border-[#c3c6d7] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center max-w-xs mx-auto">
                      <div className="w-20 h-20 bg-[#faf8ff] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                        <FileText className="w-10 h-10 text-gray-300" />
                      </div>
                      <h4 className="text-lg font-bold text-[#191b23] mb-2 font-heading">No Invoices Yet</h4>
                      <p className="text-sm text-[#434655] font-medium mb-6">Create your first professional invoice and start getting paid faster.</p>
                      <Link href="/invoices/new" className="text-[#004ac6] font-bold text-sm hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Create Invoice
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : invoices.map((inv: any) => (
                <tr 
                  key={inv.id} 
                  onClick={() => router.push(`/invoices/${inv.id}`)}
                  className="hover:bg-[#ededf9]/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5 text-sm font-mono font-bold text-[#004ac6]">{inv.invoice_number || inv.id.split("-")[0]}</td>
                  <td className="px-6 py-5 text-sm font-bold text-[#191b23]">{inv.client?.name || "Anonymous Client"}</td>
                  <td className="px-6 py-5 text-sm font-medium text-[#434655]">
                    {new Date(inv.created_at || inv.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[#191b23]">
                    ${(inv.total_amount || inv.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inv.status === 'Paid' || inv.status === 'PAID' ? 'bg-[#2563eb]/10 text-[#004ac6]' :
                      inv.status === 'Pending' || inv.status === 'SENT' ? 'bg-[#bc4800]/10 text-[#bc4800]' :
                      'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                    }`}>
                      {inv.status || "DRAFT"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button className="text-gray-400 hover:text-[#004ac6] transition-colors p-1.5 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

