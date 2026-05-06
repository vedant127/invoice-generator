"use client";

import { Link, Check, Copy } from "lucide-react";
import { usePaymentLink } from "@/hooks/usePaymentLink";
import { useState } from "react";

export default function PaymentLinkButton({ 
  invoiceId, 
  invoiceStatus,
  existingPaymentLink 
}: { 
  invoiceId: string, 
  invoiceStatus: string,
  existingPaymentLink?: string 
}) {
  const { createPaymentLink, loading } = usePaymentLink();
  
  // If a payment link already exists in the DB, reconstruct our custom local pay URL
  const initialLink = existingPaymentLink 
    ? `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/pay/${invoiceId}` 
    : "";
    
  const [paymentLink, setPaymentLink] = useState(initialLink);
  const [copied, setCopied] = useState(false);

  if (invoiceStatus === 'PAID') {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateLink = async () => {
    const url = await createPaymentLink(invoiceId);
    if (url) {
      setPaymentLink(url);
    }
  };

  if (paymentLink) {
    return (
      <div className="w-full mt-4 flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share this Payment Link with your client:</p>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            readOnly 
            value={paymentLink} 
            className="flex-1 h-10 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="h-10 px-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all active:scale-95"
            title="Copy Link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <a 
          href={paymentLink} 
          target="_blank" 
          rel="noreferrer"
          className="text-xs text-blue-600 hover:underline text-left mt-1 font-medium"
        >
          Preview checkout page &rarr;
        </a>
      </div>
    );
  }

  return (
    <button
      onClick={generateLink}
      disabled={loading}
      className="w-full mt-3 h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition-all shadow-md active:scale-95 disabled:opacity-50"
    >
      <Link className="w-4 h-4" />
      {loading ? "Generating Link..." : "Generate Payment Link"}
    </button>
  );
}
