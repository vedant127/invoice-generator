import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CheckCircle2, Clock } from 'lucide-react';

interface PaymentHistoryProps {
  invoiceId: string;
  refreshTrigger: number;
}

export default function PaymentHistory({ invoiceId, refreshTrigger }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get(`/api/v1/invoices/${invoiceId}/payments`);
        setPayments(res.data);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      } finally {
        setLoading(false);
      }
    };
    if (invoiceId) {
      fetchPayments();
    }
  }, [invoiceId, refreshTrigger]);

  if (loading) {
    return <div className="text-sm text-slate-500 animate-pulse">Loading payment history...</div>;
  }

  if (payments.length === 0) {
    return (
      <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No payments recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Payment History</h3>
      <div className="space-y-3">
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  ₹{payment.amount_paid.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {payment.payment_method || "Other"}
                  </span>
                  {payment.transaction_ref && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Ref: {payment.transaction_ref}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
