"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="font-sans antialiased overflow-x-hidden bg-white text-slate-800">
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .hero-gradient {
          background: radial-gradient(circle at 70% 30%, #f5f3ff 0%, #ffffff 60%);
        }
        .floating-ui {
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.08);
        }
        .connector-line {
          border: 1.5px solid #e2e8f0;
        }
      `}} />

      {/* BEGIN: Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100" data-purpose="main-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand rounded-lg p-1.5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <span className="text-xl font-bold font-heading text-brand-dark">Invoice Generator</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link className="hover:text-brand transition-colors" href="#features">Features</Link>
            <Link className="hover:text-brand transition-colors" href="#pricing">Pricing</Link>
            <Link className="hover:text-brand transition-colors" href="#">Blog</Link>
            <Link className="hover:text-brand transition-colors" href="/login">Login</Link>
          </div>
          <div>
            <Link href="/register">
              <button className="px-6 py-2.5 rounded-xl bg-soft-blue text-brand font-semibold text-sm hover:bg-brand hover:text-white transition-all">
                Register
              </button>
            </Link>
          </div>
        </div>
      </nav>
      {/* END: Navigation */}

      {/* BEGIN: Hero Section */}
      <main className="pt-32 pb-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div data-purpose="hero-content">
            <h1 className="text-5xl lg:text-6xl font-heading font-extrabold text-brand-dark leading-tight mb-6">
              Invoicing That Helps Small Businesses Get <span className="text-brand">Paid Faster</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-lg leading-relaxed">
              Helps business owners world-wide make beautiful invoices, look professional and get paid faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <button className="px-8 py-4 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:scale-105 transition-transform">
                  Get Started
                </button>
              </Link>
              <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
            {/* Social Proof Logos */}
            <div className="mt-20">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Join 40,000+ entrepreneur use our invoice generator</p>
              <div className="flex flex-wrap gap-8 items-center opacity-50 grayscale">
                <span className="text-xl font-bold">upwork</span>
                <span className="text-xl font-bold">zendesk</span>
                <span className="text-xl font-bold">getaround</span>
                <span className="text-xl font-bold">HELLOSIGN</span>
              </div>
            </div>
          </div>
          <div className="relative h-[450px] w-full hidden md:block" data-purpose="hero-visual">
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-soft-blue rounded-full blur-3xl"></div>
            
            {/* Center Main Card: Invoiced Line Chart */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[320px] bg-white rounded-2xl p-5 floating-ui border border-gray-100 transition-transform hover:-translate-y-[55%] duration-500">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-brand-dark">Invoiced</span>
                <span className="text-xs bg-brand-dark text-white font-bold px-3 py-1 rounded-full">$24,500</span>
              </div>
              <div className="relative h-28 w-full flex items-end justify-between gap-1 overflow-hidden">
                {/* Simulated wavy/bars chart */}
                <svg className="absolute bottom-0 left-0 w-full h-full text-brand opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                  <path d="M0,100 C20,80 30,100 50,50 C70,0 80,60 100,20 L100,100 Z" fill="currentColor"></path>
                </svg>
                <svg className="absolute bottom-0 left-0 w-full h-full text-brand drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                  <path d="M0,80 C20,60 30,80 50,30 C70,-20 80,40 100,0" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"></path>
                </svg>
              </div>
              <div className="flex justify-between items-center mt-2 text-[9px] text-gray-400 font-bold uppercase">
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-[10px]">C</div>
                <div className="text-[10px] text-gray-500"><span className="font-bold text-gray-700">Customer accepted estimate</span> • 10:30 AM</div>
              </div>
            </div>

            {/* Left Card: Recurring Invoice */}
            <div className="absolute top-[10%] left-[-5%] z-10 w-[220px] bg-white rounded-2xl p-5 floating-ui border border-gray-100 transition-transform hover:-translate-y-2 duration-500">
              <div className="font-bold text-brand-dark mb-4 text-sm">Recurring invoice</div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Send 15 invoices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-200"></div>
                  <span className="text-xs font-medium text-gray-400">Send on specific date</span>
                </div>
              </div>
              <div className="mt-5">
                <div className="text-[10px] text-gray-400 mb-1">Send invoice every</div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-600">Month</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Right Card: Invoice Tracking */}
            <div className="absolute bottom-[5%] right-[-5%] z-30 w-[240px] bg-white rounded-2xl p-5 floating-ui border border-gray-100 transition-transform hover:-translate-y-2 duration-500">
              <div className="font-bold text-brand-dark mb-5 text-sm">Invoice Tracking</div>
              <div className="space-y-5 relative">
                {/* Connecting line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100 -z-10"></div>
                
                {/* Step 1 */}
                <div className="flex gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-700">Invoice created</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">24 Oct, 08:30 AM</div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-700">Invoice viewed by customer</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">25 Oct, 09:15 AM</div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-700">Invoice paid</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">26 Oct, 11:00 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* END: Hero Section */}

      {/* BEGIN: Feature Grid Section */}
      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 mb-16 items-end">
            <div>
              <h2 className="text-4xl font-heading font-bold text-brand-dark leading-tight">
                Smart invoicing for small businesses &amp; freelancers
              </h2>
            </div>
            <div>
              <p className="text-gray-500 leading-relaxed max-w-md">
                Vitae curabitur congue euismod sed consequat in venenatis, tellus arcu ac aliquam platea aenean ut hac elit, eget nunc, ultricies scelerisque sapien libero suscipit vel sed et a.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/30 hover:shadow-xl hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">Invoicing on autopilot</h3>
              <p className="text-gray-500">Use the recurring invoice function to schedule automatic invoices for your regular and repeat customers.</p>
            </div>
            {/* Feature 2 */}
            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/30 hover:shadow-xl hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">Send invoices &amp; quotes</h3>
              <p className="text-gray-500">No more walking to the post box create and send invoices by e-mail or Royal Mail in less than 60 seconds.</p>
            </div>
            {/* Feature 3 */}
            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/30 hover:shadow-xl hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">Convert quotes into invoices with 1 click</h3>
              <p className="text-gray-500">Don't start from scratch just convert the existing quote into an invoice with a single click and send it.</p>
            </div>
            {/* Feature 4 */}
            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/30 hover:shadow-xl hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">Send Reminders for late-payers</h3>
              <p className="text-gray-500">Haven't received payment yet? No need to worry. Send invoice reminders within seconds and get paid faster.</p>
            </div>
          </div>
        </div>
      </section>
      {/* END: Feature Grid Section */}

      {/* BEGIN: How It Works */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-bold text-brand-dark mb-4">How does Invoice Generator work?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-20">Below is a general process of how each one of our invoicing software modules works and when to use it.</p>
          <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center min-h-[500px]">
            {/* Left Nodes */}
            <div className="md:absolute left-0 top-0 bottom-0 flex flex-col justify-between py-10 w-full md:w-1/3 text-center md:text-right gap-8 md:gap-0 mb-8 md:mb-0">
              <div className="flex flex-col md:flex-row items-center gap-4 justify-end">
                <p className="text-sm font-semibold text-brand-dark max-w-[180px]">You can monitor the money going in and out of your business</p>
                <div className="w-12 h-12 bg-orange-400 rounded-full flex-shrink-0 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 justify-end">
                <p className="text-sm font-semibold text-brand-dark max-w-[180px]">Invoice templates make your invoice look professional &amp; cool</p>
                <div className="w-12 h-12 bg-orange-400 rounded-full flex-shrink-0 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 justify-end">
                <p className="text-sm font-semibold text-brand-dark max-w-[180px]">We'll notify you every time an email is opened, a payment fails, etc</p>
                <div className="w-12 h-12 bg-orange-400 rounded-full flex-shrink-0 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
              </div>
            </div>

            {/* Central Icon */}
            <div className="relative z-10 w-28 h-28 bg-brand rounded-full flex items-center justify-center shadow-2xl shadow-brand/40 my-8 md:my-0 mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>

            {/* Right Nodes */}
            <div className="md:absolute right-0 top-0 bottom-0 flex flex-col justify-between py-10 w-full md:w-1/3 text-center md:text-left gap-8 md:gap-0 mt-8 md:mt-0">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-12 h-12 bg-orange-400 rounded-full flex-shrink-0 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <p className="text-sm font-semibold text-brand-dark max-w-[180px]">Know who owes your money and how much they've spent</p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-12 h-12 bg-orange-400 rounded-full flex-shrink-0 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <p className="text-sm font-semibold text-brand-dark max-w-[180px]">You'll find yourself invoicing the same types of products over time</p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-12 h-12 bg-orange-400 rounded-full flex-shrink-0 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <p className="text-sm font-semibold text-brand-dark max-w-[180px]">Creating single or recurring invoices is super easy</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: How It Works */}

      {/* BEGIN: Detailed Feature Breakdowns */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Create Unlimited Invoices */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="rounded-3xl floating-ui bg-white border border-gray-100 p-6 flex flex-col gap-4 relative overflow-hidden h-[320px]">
                <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                  <div className="space-y-2">
                    <div className="w-24 h-6 bg-brand rounded-md"></div>
                    <div className="w-32 h-3 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="w-16 h-4 bg-gray-200 rounded-full ml-auto"></div>
                    <div className="w-24 h-3 bg-gray-100 rounded-full ml-auto"></div>
                  </div>
                </div>
                <div className="space-y-3 mt-2 flex-1">
                  <div className="flex justify-between items-center p-3 bg-soft-blue rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                        <div className="w-4 h-4 bg-brand rounded-full"></div>
                      </div>
                      <div className="w-24 h-3 bg-brand-dark/80 rounded-full"></div>
                    </div>
                    <div className="w-16 h-3 bg-brand font-bold rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="w-32 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="w-16 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="w-20 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="w-16 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                   <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
                   <div className="w-32 h-10 bg-brand hover:bg-brand-light transition-colors rounded-xl"></div>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-6 -left-6 grid grid-cols-5 gap-2 opacity-20 -z-10">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                ))}
              </div>
            </div>
            <div>
              <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-bold mb-6 inline-block">Invoices</span>
              <h2 className="text-4xl font-heading font-bold text-brand-dark mb-6">Create unlimited invoices</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Invoice Generator is the easiest and most powerful way to create an invoice online. Your customers will love the way they look, and you'll love how quickly they are to generate and customize.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-brand-dark font-medium">
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path></svg>
                  </span>
                  You can create invoices in seconds
                </li>
                <li className="flex items-center gap-3 text-brand-dark font-medium">
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path></svg>
                  </span>
                  You can create recurring invoices
                </li>
                <li className="flex items-center gap-3 text-brand-dark font-medium">
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path></svg>
                  </span>
                  You can customize your invoices
                </li>
              </ul>
            </div>
          </div>
          {/* Invoice Analytics */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-bold mb-6 inline-block">Analytics</span>
              <h2 className="text-4xl font-heading font-bold text-brand-dark mb-6">Invoice analytics</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                View what matters most at-a-glance. With invoice analytics make you easy to understand and make decisions on what needs to be done to increase profit and collect money faster.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-brand-dark font-medium">
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path></svg>
                  </span>
                  Monthly company stats
                </li>
                <li className="flex items-center gap-3 text-brand-dark font-medium">
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path></svg>
                  </span>
                  Aging invoice balances
                </li>
                <li className="flex items-center gap-3 text-brand-dark font-medium">
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path></svg>
                  </span>
                  How much is owed to you
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="bg-white rounded-3xl p-8 floating-ui border border-gray-100 h-[340px] flex flex-col">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</div>
                    <div className="text-[32px] font-bold text-brand-dark leading-none">$24,500</div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                      12.5%
                    </span>
                  </div>
                </div>
                {/* Bar Chart Area */}
                <div className="flex-1 flex flex-col">
                  {/* Bars */}
                  <div className="flex justify-between items-end flex-1 gap-3 pb-3">
                    {[40, 70, 45, 90, 60, 85, 50].map((height, i) => (
                      <div key={i} className="w-full bg-[#f4f6fa] rounded-t-md relative group h-full flex items-end">
                        <div 
                          className="w-full bg-brand rounded-t-md transition-all duration-300 group-hover:opacity-80" 
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  {/* X-Axis */}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <span key={i} className="w-full text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Detailed Feature Breakdowns */}

      {/* BEGIN: Pricing */}
      <section className="py-24 bg-soft-blue/30" id="pricing">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-bold text-brand-dark mb-4">Our pricing</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-10">We're on a mission to support you, the small business owner simplifying your invoicing process, so you can get paid faster.</p>
          <div className="inline-flex p-1 bg-gray-100 rounded-2xl mb-16" data-purpose="pricing-toggle">
            <button 
              onClick={() => setBillingCycle("annually")}
              className={`px-8 py-2 rounded-xl font-bold text-sm transition-all ${billingCycle === "annually" ? "bg-white shadow-sm text-brand" : "text-gray-500 hover:text-gray-700"}`}
            >
              Annually
            </button>
            <button 
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-2 rounded-xl font-bold text-sm transition-all ${billingCycle === "monthly" ? "bg-white shadow-sm text-brand" : "text-gray-500 hover:text-gray-700"}`}
            >
              Monthly
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Basic Card */}
            <div 
              onClick={() => setSelectedPlan("basic")}
              className={`bg-white p-8 rounded-[2.5rem] transition-all cursor-pointer group ${selectedPlan === "basic" ? "border-2 border-brand ring-8 ring-brand/5 shadow-2xl" : "border border-gray-100 hover:shadow-2xl"}`}
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Basic</h3>
              <p className="text-gray-400 text-sm mb-8">Free account with limited features.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-brand-dark">{billingCycle === "annually" ? "$9" : "$12"}</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <Link href="/register">
                <button className={`w-full py-4 rounded-2xl font-bold mb-10 transition-colors ${selectedPlan === "basic" ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white"}`}>
                  Get Started
                </button>
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  100 Monthly Invoice
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  25 Saved Clients
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  Up to 2 Team Members
                </li>
              </ul>
            </div>
            {/* Professional Card */}
            <div 
              onClick={() => setSelectedPlan("professional")}
              className={`bg-white p-8 rounded-[2.5rem] transition-all cursor-pointer group relative ${selectedPlan === "professional" ? "border-2 border-brand ring-8 ring-brand/5 shadow-2xl" : "border border-gray-100 hover:shadow-2xl"}`}
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Professional</h3>
              <p className="text-gray-400 text-sm mb-8">Free account with limited features.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-brand-dark">{billingCycle === "annually" ? "$19" : "$24"}</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <Link href="/register">
                <button className={`w-full py-4 rounded-2xl font-bold mb-10 transition-colors ${selectedPlan === "professional" ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white"}`}>
                  Get Started
                </button>
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  250 Monthly Invoice
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  100 Saved Clients
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  Up to 10 Team Members
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  Invoices Reminder
                </li>
              </ul>
            </div>
            {/* Enterprise Card */}
            <div 
              onClick={() => setSelectedPlan("enterprise")}
              className={`bg-white p-8 rounded-[2.5rem] transition-all cursor-pointer group ${selectedPlan === "enterprise" ? "border-2 border-brand ring-8 ring-brand/5 shadow-2xl" : "border border-gray-100 hover:shadow-2xl"}`}
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Enterprise</h3>
              <p className="text-gray-400 text-sm mb-8">Free account with limited features.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-brand-dark">{billingCycle === "annually" ? "$29" : "$39"}</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <Link href="/register">
                <button className={`w-full py-4 rounded-2xl font-bold mb-10 transition-colors ${selectedPlan === "enterprise" ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white"}`}>
                  Get Started
                </button>
              </Link>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  Unlimited Monthly Invoice
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  Unlimited Saved Clients
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                  <span className="text-brand"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></span>
                  Up to 25 Team Members
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* END: Pricing */}

      {/* BEGIN: Footer */}
      <footer className="bg-soft-blue py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-200 pb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-brand rounded-lg p-1.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <span className="text-xl font-bold font-heading text-brand-dark">Invoice Generator</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">The best invoicing platform for modern entrepreneurs and small business owners globally.</p>
            </div>
            <div data-purpose="footer-links">
              <h4 className="font-bold text-brand-dark mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><Link className="hover:text-brand" href="#features">Features</Link></li>
                <li><Link className="hover:text-brand" href="#pricing">Pricing</Link></li>
                <li><Link className="hover:text-brand" href="#">Reviews</Link></li>
                <li><Link className="hover:text-brand" href="#">Updates</Link></li>
              </ul>
            </div>
            <div data-purpose="footer-links">
              <h4 className="font-bold text-brand-dark mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><Link className="hover:text-brand" href="#">About Us</Link></li>
                <li><Link className="hover:text-brand" href="#">Contact</Link></li>
                <li><Link className="hover:text-brand" href="#">Careers</Link></li>
                <li><Link className="hover:text-brand" href="#">Privacy Policy</Link></li>
              </ul>
            </div>
            <div data-purpose="footer-links">
              <h4 className="font-bold text-brand-dark mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><Link className="hover:text-brand" href="#">Help Center</Link></li>
                <li><Link className="hover:text-brand" href="#">API Reference</Link></li>
                <li><Link className="hover:text-brand" href="#">Community</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center md:text-left text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Invoice Generator Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </div>
  );
}
