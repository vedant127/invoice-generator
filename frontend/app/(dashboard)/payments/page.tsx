"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CreditCard, Download, Search, Filter, ChevronRight, CheckCircle2, Clock, AlertCircle, X, Info } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/api/v1/invoices/").then(res => {
      // Map invoices to payment history format
      const mappedPayments = res.data.map((inv: any) => ({
        id: inv.id,
        invoice_id: inv.id,
        created_at: inv.created_at || inv.issue_date,
        amount: inv.total_amount || inv.total || 0,
        status: inv.status === "PAID" ? "Successful" : "Pending",
        method: inv.payment_method || "Card Payment",
        client_name: inv.client?.name || "Client"
      }));
      setPayments(mappedPayments);
    }).catch(err => {
      console.error("Payments fetch error", err);
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    successful: payments.filter((p: any) => p.status === "Successful").length,
    pending: payments.filter((p: any) => p.status === "Pending").length,
    disputed: 0
  };

  const filteredPayments = payments.filter((pay: any) => 
    (pay.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pay.client_name || "").toLowerCase().includes(searchQuery.toLowerCase())
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
            { label: "Successful", value: stats.successful, icon: <CheckCircle2 className="w-5 h-5" />, color: "emerald", bg: "emerald" },
            { label: "Pending", value: stats.pending, icon: <Clock className="w-5 h-5" />, color: "amber", bg: "amber" },
            { label: "Disputed", value: stats.disputed, icon: <AlertCircle className="w-5 h-5" />, color: "red", bg: "red" },
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
                placeholder="Search by client or invoice ID..." 
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
                    onClick={() => {
                      setSelectedPayment(pay);
                      setIsModalOpen(true);
                    }}
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6 text-sm font-mono font-black text-slate-600 dark:text-slate-400">
                      PAY-{pay.id.slice(0, 4).toUpperCase()}
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
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        pay.status === "Successful" 
                          ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
                          : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pay.status === "Successful" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        {isModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" 
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-500">
              {/* Modal Header */}
              <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Transaction Details</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Ref: PAY-{selectedPayment.id.slice(0, 4).toUpperCase()}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-10 space-y-8">
                {/* Status Hero */}
                <div className={`rounded-[2rem] p-8 text-center border-2 ${
                  selectedPayment.status === "Successful" 
                    ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20" 
                    : "bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20"
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    selectedPayment.status === "Successful" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  }`}>
                    {selectedPayment.status === "Successful" ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                  </div>
                  <h3 className={`text-2xl font-black ${selectedPayment.status === "Successful" ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                    ${selectedPayment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mt-1">{selectedPayment.status} Payment</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Invoice ID</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedPayment.invoice_id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Date</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {new Date(selectedPayment.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      <p className="text-sm font-black text-slate-900 dark:text-white">{selectedPayment.method}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Client Name</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedPayment.client_name}</p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                    This payment was processed via your connected payment provider. The funds will be settled to your bank account within 2-3 business days.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button className="flex-1 h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Receipt
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-14 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl hover:opacity-90 transition-all active:scale-95"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
