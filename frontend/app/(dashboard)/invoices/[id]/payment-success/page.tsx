"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

export default function PaymentSuccessPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await api.get(`/api/v1/invoices/${params.id}/payment-status`);
        setStatus(res.data.status);
        if (res.data.status === 'PAID' || res.data.status === 'PARTIALLY_PAID') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to check status", err);
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [params.id]);

  const isSuccess = status === 'PAID' || status === 'PARTIALLY_PAID';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-500">
      {isSuccess ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-[2rem] max-w-md w-full shadow-sm border border-emerald-100 dark:border-emerald-800/30">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-800/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Payment Successful!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Your payment has been successfully recorded. The invoice status has been updated.
          </p>
          <button 
            onClick={() => router.push(`/invoices/${params.id}`)}
            className="w-full h-12 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Invoice
          </button>
        </div>
      ) : (
        <div className="max-w-md w-full">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-6" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verifying Payment...</h1>
          <p className="text-slate-500 dark:text-slate-400">
            We're waiting for confirmation from Stripe. This usually takes a few seconds.
          </p>
        </div>
      )}
    </div>
  );
}
