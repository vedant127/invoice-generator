"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      desc: "Ideal for freelancers & small agencies",
      monthly: 28,
      annually: 22,
      features: ["Up to 25 monthly invoices", "Automated email reminders", "Basic analytics"],
      highlight: false,
    },
    {
      id: "growth",
      name: "Growth",
      desc: "For scaling businesses",
      monthly: 89,
      annually: 71,
      features: ["Unlimited monthly invoices", "Smart payment links", "Priority support", "Advanced AR aging reports"],
      highlight: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      desc: "Advanced control & security",
      monthly: null,
      annually: null,
      features: ["Unlimited everything", "Dedicated account manager", "Custom API development"],
      highlight: false,
    },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#F8F9FB", color: "#1E293B" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2563EB" }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <span className="sora text-xl font-bold tracking-tight text-slate-800">Invoice<span style={{ color: "#2563EB" }}>Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold" style={{ color: "#94A3B8" }}>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how" className="hover:text-blue-600 transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Login</Link>
            <Link href="/register">
              <button className="px-6 py-2.5 rounded-full text-white text-sm font-bold hover:opacity-90 transition-all" style={{ background: "#2563EB" }}>
                Start Free Trial
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-bg pt-24 pb-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6" style={{ background: "#EFF6FF", color: "#2563EB" }}>
            Simplifying Invoice Payments
          </span>
          <h1 className="sora text-5xl md:text-7xl font-extrabold leading-tight mb-8 max-w-4xl mx-auto text-slate-800" style={{ lineHeight: 1.1 }}>
            Collect customer payments <span style={{ color: "#2563EB" }}>effortlessly.</span>
          </h1>
          <p className="text-lg mb-12 max-w-2xl mx-auto font-medium" style={{ color: "#94A3B8" }}>
            Automate tedious payment reminders. Accelerate communication with your customers and improve your cash flow — today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-24">
            <Link href="/register">
              <button className="px-10 py-4 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform" style={{ background: "#2563EB", boxShadow: "0 10px 30px -8px rgba(37,99,235,0.35)" }}>
                Start Free Trial
              </button>
            </Link>
            <a href="#features">
              <button className="px-10 py-4 bg-white rounded-full font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors" style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}>
                <span className="material-symbols-outlined text-xl" style={{ color: "#2563EB" }}>play_circle</span>
                See Features
              </button>
            </a>
          </div>

          {/* Hero UI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Analytics Card */}
            <div className="bg-white rounded-3xl p-8 floating-card text-left hover-lift">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="sora text-lg font-bold text-slate-800">30 days</h3>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>Days Sales Outstanding</p>
                </div>
                <div className="px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1" style={{ background: "#ECFDF5", color: "#059669" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span> 12%
                </div>
              </div>
              <div className="flex items-end gap-2 h-24 mb-4">
                {[40, 80, 60, 70, 90].map((h, i) => (
                  <div key={i} className="flex-1 rounded-lg" style={{ height: `${h}%`, background: i === 4 ? "#2563EB" : "#F1F5F9" }}></div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter" style={{ color: "#94A3B8" }}>
                <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
              <div className="mt-6 pt-5 flex justify-between items-center" style={{ borderTop: "1px solid #E2E8F0" }}>
                <span className="text-xs font-bold" style={{ color: "#94A3B8" }}>Outstanding</span>
                <span className="text-lg font-extrabold" style={{ color: "#2563EB" }}>$12,490</span>
              </div>
            </div>

            {/* Reminder Card (center — highlighted) */}
            <div className="bg-white rounded-3xl p-8 floating-card-lg text-left scale-105 z-10 hover-lift">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#EFF6FF", color: "#2563EB" }}>
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-800">Automated Reminder</h4>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>Scheduled for tomorrow</p>
                </div>
                <span className="text-sm font-bold text-slate-800">$3,566</span>
              </div>
              <div className="rounded-xl p-3 mb-4" style={{ background: "#F8F9FB" }}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span style={{ color: "#94A3B8" }}>Recipient:</span><span className="font-bold text-slate-800">Acme Corp</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span style={{ color: "#94A3B8" }}>Status:</span><span className="font-bold" style={{ color: "#D97706" }}>8 days overdue</span>
                </div>
              </div>
              <div className="text-xs leading-relaxed space-y-1.5 mb-6 rounded-xl p-4 border" style={{ borderColor: "#E2E8F0", background: "rgba(255,255,255,0.6)" }}>
                <p className="font-bold text-slate-800">Hi there,</p>
                <p style={{ color: "#1E293B" }}>Invoice <span className="font-bold" style={{ color: "#2563EB" }}>#122</span> is overdue. Please settle at your earliest convenience.</p>
              </div>
              <button className="w-full py-3 text-white rounded-xl font-bold text-xs" style={{ background: "#2563EB" }}>Approve &amp; Send</button>
            </div>

            {/* Payment Success Card */}
            <div className="bg-white rounded-3xl p-8 floating-card text-left hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#ECFDF5", color: "#059669" }}>
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Payment Received</h4>
                  <p className="text-[10px]" style={{ color: "#94A3B8" }}>2 mins ago</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs"><span style={{ color: "#94A3B8" }}>Invoice #156</span><span className="font-bold text-slate-800">$1,240.00</span></div>
                <div className="flex justify-between text-xs"><span style={{ color: "#94A3B8" }}>Processing Fee</span><span className="font-bold text-red-500">-$2.40</span></div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                  <div className="h-full w-full rounded-full" style={{ background: "#059669" }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-5" style={{ borderTop: "1px solid #E2E8F0" }}>
                <span className="text-xs font-bold uppercase" style={{ color: "#94A3B8" }}>Net Amount</span>
                <span className="text-lg font-extrabold" style={{ color: "#059669" }}>$1,237.60</span>
              </div>
              <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ background: "#EFF6FF" }}>
                <span className="material-symbols-outlined text-sm" style={{ color: "#2563EB" }}>bolt</span>
                <p className="text-[10px] font-medium" style={{ color: "#2563EB" }}>Funds available in your bank in 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE ADVANTAGE ── */}
      <section className="py-32 bg-white text-center" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <span className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block" style={{ background: "#EFF6FF", color: "#2563EB" }}>The InvoicePro Advantage</span>
          <h2 className="sora text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">Designed for Growth</h2>
          <p className="max-w-2xl mx-auto mb-20 font-medium" style={{ color: "#94A3B8" }}>
            We provide the infrastructure you need to manage accounts receivable like a Fortune 500 company, without the overhead.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: "target", bg: "#EFF6FF", color: "#2563EB", title: "Strategic Goals", desc: "Set specific collection targets and track progress in real-time. Turn your invoices into a predictable revenue stream." },
              { icon: "rocket_launch", bg: "#FFFBEB", color: "#D97706", title: "Performance Boost", desc: "Reduce manual work by up to 70%. Your team spends less time chasing payments and more time growing the business." },
              { icon: "account_balance_wallet", bg: "#ECFDF5", color: "#059669", title: "Stable Finances", desc: "Maintain healthy cash flow cycles. Manage your AR aging with professional-grade reporting and insights." },
            ].map((f) => (
              <div key={f.title} className="p-8 rounded-3xl text-left hover-lift" style={{ border: "1px solid #E2E8F0" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8" style={{ background: f.bg }}>
                  <span className="material-symbols-outlined text-3xl" style={{ color: f.color }}>{f.icon}</span>
                </div>
                <h3 className="sora text-xl font-bold mb-4 text-slate-800">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYTICS SHOWCASE ── */}
      <section className="py-32 border-y" id="how" style={{ background: "#F8F9FB", borderColor: "#E2E8F0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-6 inline-block" style={{ background: "#DBEAFE", color: "#2563EB" }}>Real-time Visibility</span>
              <h2 className="sora text-4xl font-extrabold text-slate-800 mb-8 leading-tight">Understand your cash flow inside out</h2>
              <p className="mb-10 leading-relaxed font-medium" style={{ color: "#94A3B8" }}>
                Make better business decisions through a deep, real-time view of your accounts receivable. No more surprises at month end.
              </p>
              <div className="space-y-5">
                {["Live Financial Dashboard", "Intelligent Cash Projections", "Automated AR Aging Reports"].map((item) => (
                  <div key={item} className="flex items-center gap-4 font-bold text-slate-800">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white" style={{ background: "#2563EB" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/register">
                <button className="mt-10 px-8 py-4 text-white rounded-full font-bold hover:opacity-90 transition-all" style={{ background: "#2563EB" }}>
                  Get Started Free →
                </button>
              </Link>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-xl" style={{ border: "1px solid #E2E8F0" }}>
              <div className="flex justify-between items-center mb-8">
                <h4 className="sora text-lg font-bold text-slate-800">Aging Balance</h4>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: "#2563EB" }}></span>
                  <span className="w-3 h-3 rounded-full" style={{ background: "#FBBF24" }}></span>
                  <span className="w-3 h-3 rounded-full" style={{ background: "#F87171" }}></span>
                </div>
              </div>
              <div className="space-y-7">
                {[
                  { label: "Current", amount: "$45,000", pct: 75, color: "#2563EB" },
                  { label: "1–30 Days Overdue", amount: "$12,400", pct: 25, color: "#FBBF24" },
                  { label: "31–60 Days Overdue", amount: "$3,200", pct: 10, color: "#F87171" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs font-bold mb-2 text-slate-800">
                      <span>{row.label}</span><span>{row.amount}</span>
                    </div>
                    <div className="w-full h-3 rounded-full" style={{ background: "#F1F5F9" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${row.pct}%`, background: row.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 text-center" style={{ borderTop: "1px solid #E2E8F0" }}>
                <Link href="/dashboard/reports" className="font-bold text-sm flex items-center justify-center gap-2" style={{ color: "#2563EB" }}>
                  View Detailed Analysis <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-32 bg-white text-center" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="sora text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">Transparent Pricing</h2>
          <p className="mb-12 font-medium" style={{ color: "#94A3B8" }}>Choose a plan that fits your volume. Scale as your revenue grows.</p>
          <div className="flex items-center justify-center gap-6 mb-16">
            <span className="text-sm font-bold" style={{ color: billingCycle === "monthly" ? "#1E293B" : "#94A3B8" }}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="relative w-14 h-7 rounded-full p-1 transition-all"
              style={{ background: "#2563EB" }}
            >
              <div className="w-5 h-5 bg-white rounded-full transition-all" style={{ marginLeft: billingCycle === "annually" ? "auto" : 0 }}></div>
            </button>
            <span className="text-sm font-bold" style={{ color: billingCycle === "annually" ? "#1E293B" : "#94A3B8" }}>
              Yearly <span className="ml-2 px-2 py-0.5 rounded-md text-[10px]" style={{ background: "#ECFDF5", color: "#059669" }}>Save 20%</span>
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-[2.5rem] p-10 flex flex-col text-left hover-lift ${plan.highlight ? "plan-popular shadow-2xl scale-105 z-10" : ""}`}
                style={{ border: plan.highlight ? "2px solid #2563EB" : "1px solid #E2E8F0" }}
              >
                {plan.highlight && (
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="sora text-xl font-bold text-slate-800">{plan.name}</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase" style={{ background: "#2563EB" }}>Most Popular</span>
                  </div>
                )}
                {!plan.highlight && <h3 className="sora text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>}
                <p className="text-[10px] font-bold uppercase tracking-widest mb-8" style={{ color: "#94A3B8" }}>{plan.desc}</p>
                <div className="mb-10">
                  {plan.monthly ? (
                    <>
                      <span className="text-5xl font-extrabold text-slate-800">${billingCycle === "annually" ? plan.annually : plan.monthly}</span>
                      <span className="text-sm font-bold" style={{ color: "#94A3B8" }}> / month</span>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-slate-800">Custom</span>
                  )}
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-800">
                      <span className="material-symbols-outlined text-lg" style={{ color: plan.highlight ? "#2563EB" : "#059669" }}>check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <button
                    className="w-full py-4 rounded-xl font-bold hover:opacity-90 transition-all"
                    style={plan.highlight
                      ? { background: "#2563EB", color: "#fff" }
                      : { background: "#F8F9FB", color: "#1E293B", border: "1px solid #E2E8F0" }
                    }
                  >
                    {plan.monthly ? (plan.highlight ? "Start 14-day Free Trial" : "Get Started") : "Contact Sales"}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white py-24" style={{ borderTop: "1px solid #E2E8F0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2563EB" }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <span className="sora text-xl font-bold text-slate-800">InvoicePro</span>
              </div>
              <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: "#94A3B8" }}>
                Modernizing the way professional service businesses get paid.
              </p>
            </div>
            <div className="grid grid-cols-3 col-span-3 gap-8">
              {[
                { title: "Product", links: ["Features", "Integrations", "Pricing"] },
                { title: "Company", links: ["About Us", "Blog", "Careers"] },
                { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="sora font-bold text-slate-800 mb-6 text-sm">{col.title}</h4>
                  <ul className="space-y-4">
                    {col.links.map((l) => (
                      <li key={l}><a href="#" className="text-xs font-bold hover:text-blue-600 transition-colors" style={{ color: "#94A3B8" }}>{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold" style={{ borderTop: "1px solid #E2E8F0", color: "#94A3B8" }}>
            <p>© {new Date().getFullYear()} InvoicePro Inc. All rights reserved.</p>
            <div className="flex gap-6"><span>Certified ISO 27001</span><span>GDPR Compliant</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
