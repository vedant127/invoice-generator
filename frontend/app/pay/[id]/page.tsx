"use client";

import React, { useEffect, useState } from 'react';
import { Shield, HelpCircle, CreditCard, Landmark, Plus, Lock, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

export default function CustomPaymentPage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/api/v1/invoices/${params.id}`);
        setInvoice(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff] dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff] dark:bg-slate-950 text-slate-500">Invoice not found.</div>;
  }

  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoice.payment_link_url) {
      window.location.href = invoice.payment_link_url;
    } else {
      alert("Payment has not been fully configured for this invoice yet. Please contact the sender.");
    }
  };

  return (
    <div className="bg-[#f9f9ff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1100px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">LuxePay</span>
            <nav className="hidden md:flex gap-6 items-center">
              <span className="text-slate-500 font-medium">Invoice #{invoice.invoice_number}</span>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
              <Shield className="w-5 h-5" />
            </button>
            <button className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 md:p-10">
        {invoice.status === 'PAID' ? (
          <div className="shadow-xl bg-white dark:bg-slate-900 rounded-3xl p-12 flex flex-col items-center max-w-md w-full border border-slate-200 dark:border-slate-800 text-center">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Payment Successful</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">This invoice has been paid in full. Thank you!</p>
          </div>
        ) : (
          <div className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl flex flex-col md:flex-row w-full max-w-[1100px] overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Left Pane (Order Summary) */}
            <aside className="w-full md:w-[42%] bg-slate-50/80 dark:bg-slate-900/50 p-8 md:p-12 flex flex-col border-r border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-10 tracking-tight">Order Summary</h2>
              
              <div className="flex-grow space-y-6 max-h-[300px] overflow-y-auto pr-2">
                {invoice.items && invoice.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center gap-6 group">
                    <div className="flex-grow">
                      <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {item.description}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      ₹{(item.quantity * item.unit_price).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">₹{(invoice.subtotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Tax ({invoice.tax_rate || 0}%)</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">₹{(invoice.tax_amount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between items-end pt-6">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Total Due</span>
                  <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                    ₹{(invoice.balance_due || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>
            </aside>

            {/* Right Pane (Payment Details) */}
            <section className="w-full md:w-[58%] bg-white dark:bg-slate-900 p-8 md:p-12">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-10 tracking-tight">Payment Details</h2>
              
              <div className="flex p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-10 border border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-lg font-bold text-sm transition-all ${
                    paymentMethod === 'card' 
                      ? 'bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white'
                  }`}>
                  <CreditCard className="w-4 h-4" />
                  Credit Card
                </button>
                <button 
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-lg font-bold text-sm transition-all ${
                    paymentMethod === 'bank' 
                      ? 'bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white'
                  }`}>
                  <Landmark className="w-4 h-4" />
                  Bank Transfer
                </button>
              </div>

              {paymentMethod === 'card' ? (
                /* Fake Payment Form for UI completeness - Actually handled by Stripe */
                <form className="space-y-6" onSubmit={handlePayClick}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Cardholder's Name</label>
                    <input 
                      required
                      className="w-full px-5 py-3.5 bg-[#F8F9FA] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-all" 
                      placeholder="Johnathan Doe" 
                      type="text"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Card Number</label>
                    <div className="relative">
                      <input 
                        required
                        className="w-full pl-5 pr-14 py-3.5 bg-[#F8F9FA] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-all font-mono" 
                        placeholder="0000 0000 0000 0000" 
                        type="text"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        <CreditCard className="w-6 h-6 text-indigo-400 dark:text-indigo-500" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Expiry Date</label>
                      <input 
                        required
                        className="w-full px-5 py-3.5 bg-[#F8F9FA] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-all font-mono" 
                        placeholder="MM/YY" 
                        type="text"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">CVV</label>
                      <div className="relative">
                        <input 
                          required
                          className="w-full px-5 py-3.5 bg-[#F8F9FA] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-all font-mono tracking-widest" 
                          placeholder="***" 
                          type="password"
                          maxLength={4}
                        />
                        <HelpCircle className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mt-8 border border-indigo-100 dark:border-indigo-800/50">
                    <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full">
                      <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    </div>
                    <p className="text-sm font-medium text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed">
                      Your transaction is secured with 256-bit SSL encryption. We do not store your full card details.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_25px_rgba(79,70,229,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-10"
                  >
                    <Lock className="w-5 h-5" />
                    Pay ₹{(invoice.balance_due || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})} Now
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#F8F9FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Bank Account Details</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Please transfer the total amount to the following bank account. Your order will be processed once the funds have cleared.</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Account Name</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">LuxePay Inc.</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Bank Name</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Global Standard Bank</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Account Number</span>
                        <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">0000 1234 5678 9012</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 dark:text-slate-400">IFSC / Routing Number</span>
                        <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">LUXE0001234</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Reference / Memo</span>
                        <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">INV-{invoice.invoice_number}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => alert("Thank you! Please complete the bank transfer. We will verify your payment within 1-2 business days.")}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-10"
                  >
                    I have made the transfer
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
