"use client";

import React from 'react';
import { Shield, HelpCircle, CreditCard, Landmark, Plus, Lock } from 'lucide-react';

export default function CustomPaymentPage() {
  return (
    <div className="bg-[#f9f9ff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1100px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">LuxePay</span>
            <nav className="hidden md:flex gap-6 items-center">
              <a className="text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 py-1" href="#">
                Back to Shop
              </a>
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
        {/* Main Checkout Container */}
        <div className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl flex flex-col md:flex-row w-full max-w-[1100px] overflow-hidden border border-slate-200 dark:border-slate-800">
          
          {/* Left Pane (Order Summary) */}
          <aside className="w-full md:w-[42%] bg-slate-50/80 dark:bg-slate-900/50 p-8 md:p-12 flex flex-col border-r border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-10 tracking-tight">Order Summary</h2>
            
            <div className="flex-grow space-y-8">
              {/* Item 1 */}
              <div className="flex justify-between items-center gap-6 group">
                <div className="flex-grow">
                  <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Premium Headphones</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Stellar Black • Over-ear</p>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">$299.00</p>
              </div>

              {/* Item 2 */}
              <div className="flex justify-between items-center gap-6 group">
                <div className="flex-grow">
                  <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Wireless Mouse</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Ergonomic • Precision</p>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">$89.00</p>
              </div>

              {/* Promo Code */}
              <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm py-2 mt-6 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                <Plus className="w-4 h-4" />
                Add Promo Code
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">$388.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Tax (8%)</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">$31.04</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Shipping</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Free</span>
              </div>
              <div className="flex justify-between items-end pt-6">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">$419.04</span>
              </div>
            </div>
          </aside>

          {/* Right Pane (Payment Details) */}
          <section className="w-full md:w-[58%] bg-white dark:bg-slate-900 p-8 md:p-12">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-10 tracking-tight">Payment Details</h2>
            
            {/* Payment Tabs */}
            <div className="flex p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-10 border border-slate-100 dark:border-slate-800">
              <button className="flex-1 flex items-center justify-center gap-2.5 py-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 font-bold text-sm transition-all">
                <CreditCard className="w-4 h-4" />
                Credit Card
              </button>
              <button className="flex-1 flex items-center justify-center gap-2.5 py-3 text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-slate-900 dark:hover:text-white transition-colors">
                <Landmark className="w-4 h-4" />
                Bank Transfer
              </button>
            </div>

            {/* Payment Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Cardholder's Name</label>
                <input 
                  className="w-full px-5 py-3.5 bg-[#F8F9FA] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-all" 
                  placeholder="Johnathan Doe" 
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Card Number</label>
                <div className="relative">
                  <input 
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
                    className="w-full px-5 py-3.5 bg-[#F8F9FA] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-all font-mono" 
                    placeholder="MM/YY" 
                    type="text"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">CVV</label>
                  <div className="relative">
                    <input 
                      className="w-full px-5 py-3.5 bg-[#F8F9FA] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-all font-mono tracking-widest" 
                      placeholder="***" 
                      type="password"
                      maxLength={4}
                    />
                    <HelpCircle className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Additional Security Note */}
              <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mt-8 border border-indigo-100 dark:border-indigo-800/50">
                <div className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                </div>
                <p className="text-sm font-medium text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed">
                  Your transaction is secured with 256-bit SSL encryption. We do not store your full card details.
                </p>
              </div>

              {/* Action Button */}
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_25px_rgba(79,70,229,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-10">
                <Lock className="w-5 h-5" />
                Pay $419.04 Now
              </button>
            </form>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 mt-auto border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-10 max-w-[1100px] mx-auto gap-6">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">LuxePay Inc.</span>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center md:text-left">
              © 2024 LuxePay Inc. Secure Checkout encrypted with 256-bit SSL.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-8">
            <a className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:underline transition-colors uppercase tracking-wider" href="#">Privacy Policy</a>
            <a className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:underline transition-colors uppercase tracking-wider" href="#">Terms of Service</a>
            <a className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:underline transition-colors uppercase tracking-wider" href="#">Refund Policy</a>
            <a className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:underline transition-colors uppercase tracking-wider" href="#">Contact Support</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
