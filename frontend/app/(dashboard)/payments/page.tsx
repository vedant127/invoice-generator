"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempting to fetch payments. If endpoint doesn't exist, we will show empty state.
    api.get("/api/v1/payments").then(res => {
      setPayments(res.data);
    }).catch(err => {
      console.error("Payments fetch error", err);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-bold">Payment ID</th>
              <th className="px-6 py-4 font-bold">Invoice</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Amount</th>
              <th className="px-6 py-4 font-bold">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-1">No payments found</p>
                    <p className="text-xs text-gray-400">Payments will appear here once invoices are paid</p>
                  </div>
                </td>
              </tr>
            ) : payments.map((payment: any) => (
              <tr key={payment.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{payment.id.split("-")[0]}</td>
                <td className="px-6 py-4 text-brand hover:underline">{payment.invoice_id}</td>
                <td className="px-6 py-4">{new Date(payment.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium text-green-600">${payment.amount?.toFixed(2) || "0.00"}</td>
                <td className="px-6 py-4">{payment.method || "Stripe"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
