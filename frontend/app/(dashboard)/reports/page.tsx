"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import api from "@/lib/api";
import Link from "next/link";

// ─── Smooth bezier path ───────────────────────────────────────────────────────
const getSmoothPath = (pts: { x: number; y: number }[]) => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const c = pts[i], n = pts[i + 1];
    const cp1x = c.x + (n.x - c.x) / 3;
    const cp2x = c.x + (2 * (n.x - c.x)) / 3;
    d += ` C ${cp1x},${c.y} ${cp2x},${n.y} ${n.x},${n.y}`;
  }
  return d;
};

const DEMO_MONTHLY = [12000, 19500, 16500, 23000, 20000, 28400];
const AVATAR_COLORS = ["#2563EB", "#7C3AED", "#059669", "#DC2626", "#EA580C", "#0891B2"];

// ─── Demo fallback payments ───────────────────────────────────────────────────
const DEMO_PAYMENTS = [
  { id: "#PAY-89241", client: "Fleurish Creative",  initials: "FC", invoice: "TSN-904824", date: "Jun 24, 2025", amount: 3685,  status: "Success", color: "#2563EB" },
  { id: "#PAY-89242", client: "Design Studio Inc",  initials: "DS", invoice: "TSN-904825", date: "Jun 23, 2025", amount: 1200,  status: "Pending", color: "#7C3AED" },
  { id: "#PAY-89243", client: "Momentum Kings",     initials: "MK", invoice: "TSN-904826", date: "Jun 22, 2025", amount: 5400,  status: "Success", color: "#059669" },
  { id: "#PAY-89244", client: "Tech Partners LLC",  initials: "TP", invoice: "TSN-904827", date: "Jun 21, 2025", amount: 890,   status: "Failed",  color: "#DC2626" },
];

export default function ReportsPage() {
  const [invoices,       setInvoices]       = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [topClients,     setTopClients]     = useState<any[]>([]);
  const [timeRange,      setTimeRange]      = useState<"6m" | "12m" | "year">("6m");
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; value: number; label: string }>({
    visible: false, x: 0, y: 0, value: 0, label: "",
  });
  const [stats, setStats] = useState({
    total_revenue: 0, total_invoices: 0, active_clients: 0,
    revenue_growth: "+12.5%", pending_count: 42,
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const [invRes, cliRes] = await Promise.all([
          api.get("/api/v1/invoices/"),
          api.get("/api/v1/clients/"),
        ]);
        if (invRes.data && Array.isArray(invRes.data)) {
          const invs: any[] = invRes.data;
          setInvoices(invs);
          const totalRev = invs.reduce((a, i) => a + (i.total_amount || i.total || 0), 0);
          const pending  = invs.filter(i => i.status === "PENDING" || i.status === "SENT").length;
          setStats(s => ({ ...s, total_revenue: totalRev, total_invoices: invs.length, pending_count: pending }));

          const mapped = invs.slice(0, 5).map((inv, idx) => ({
            id: `#PAY-${89241 + idx}`,
            client:   inv.client?.name || "Unknown Client",
            initials: (inv.client?.name || "U").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
            invoice:  inv.invoice_number || `TSN-${904824 + idx}`,
            date:     new Date(inv.created_at || inv.issue_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            amount:   inv.total_amount || inv.total || 0,
            status:   inv.status === "PAID" ? "Success" : inv.status === "OVERDUE" ? "Failed" : "Pending",
            color:    AVATAR_COLORS[idx % AVATAR_COLORS.length],
          }));
          setRecentPayments(mapped);

          const map: Record<string, any> = {};
          invs.forEach(inv => {
            const n = inv.client?.name || "Unknown";
            if (!map[n]) map[n] = { name: n, amount: 0, email: inv.client?.email || "", initials: n.split(" ").map((x: string) => x[0]).join("").toUpperCase().slice(0, 2) };
            map[n].amount += (inv.total_amount || inv.total || 0);
          });
          setTopClients(Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 4));
        }
        if (cliRes.data && Array.isArray(cliRes.data))
          setStats(s => ({ ...s, active_clients: cliRes.data.length }));
      } catch (e) { console.error(e); }
    })();
  }, []);

  const chartData = useMemo(() => {
    const now = new Date();
    let months = timeRange === "12m" ? 12 : timeRange === "year" ? now.getMonth() + 1 : 6;
    const startMonth = timeRange === "year" ? 0 : now.getMonth() - (months - 1);
    const startYear  = timeRange === "year" ? now.getFullYear() : now.getFullYear() + (startMonth < 0 ? -1 : 0);
    const result = Array.from({ length: months }, (_, i) => {
      const d = new Date(startYear, (startMonth + i + 12) % 12 === startMonth + i + 12 ? startYear : startYear, (startMonth + i + 12) % 12);
      const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
      const label = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
      const value = invoices.filter(inv => {
        const id = new Date(inv.created_at || inv.issue_date);
        return id.getFullYear() === date.getFullYear() && id.getMonth() === date.getMonth();
      }).reduce((s, inv) => s + (inv.total_amount || inv.total || 0), 0);
      return { label, value };
    });
    const hasReal = result.some(r => r.value > 0);
    if (!hasReal) return result.map((r, i) => ({ label: r.label, value: DEMO_MONTHLY[DEMO_MONTHLY.length - months + i] ?? DEMO_MONTHLY[i % DEMO_MONTHLY.length] }));
    return result;
  }, [invoices, timeRange]);

  const hasReal = invoices.length > 0;
  const payments = hasReal ? recentPayments : DEMO_PAYMENTS;

  const SVG_W = 900, SVG_H = 220;
  const yMax = Math.ceil(Math.max(...chartData.map(d => d.value), 1) / 5000) * 5000;
  const chartPoints = useMemo(() => {
    if (!chartData.length) return { area: "", line: "", points: [] as any[] };
    const pts = chartData.map((d, i) => ({ x: (i / (chartData.length - 1)) * SVG_W, y: SVG_H - (d.value / yMax) * SVG_H, value: d.value, label: d.label }));
    const line = getSmoothPath(pts);
    return { area: `${line} L ${pts[pts.length-1].x},${SVG_H} L 0,${SVG_H} Z`, line, points: pts };
  }, [chartData, yMax]);

  const yTicks = [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0];

  const statusStyle = (s: string) => ({
    Success: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    Pending: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    Failed:  "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  }[s] ?? "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400");

  const statusDot = (s: string) => ({
    Success: "bg-green-500", Pending: "bg-amber-500", Failed: "bg-red-500",
  }[s] ?? "bg-slate-400 dark:bg-slate-500");

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:px-10 xl:px-12 pb-24 bg-[#F3F4F6] dark:bg-slate-950 font-sans transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-7">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Reports &amp; Analytics</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Monitor revenue, invoices, and client activity</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:shadow-md transition-shadow">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Report
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Revenue */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">{stats.revenue_growth}</span>
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Total Revenue</p>
            <h3 className="text-[28px] font-black text-slate-900 dark:text-white tracking-tight leading-none">
              ${(hasReal ? stats.total_revenue : 128430).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">vs. $114,200 last month</p>
          </div>

          {/* Invoices */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">{hasReal ? stats.pending_count : 42} Pending</span>
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Total Invoices</p>
            <h3 className="text-[28px] font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {(hasReal ? stats.total_invoices : 1248).toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">Average $1,050 per invoice</p>
          </div>

          {/* Clients */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">+4 new</span>
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Active Clients</p>
            <h3 className="text-[28px] font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {hasReal ? stats.active_clients : 84}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">Retention rate: 94%</p>
          </div>
        </div>

        {/* ── Revenue Chart ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Revenue Trends</h2>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Monthly breakdown of your earnings</p>
            </div>
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value as any)}
              className="h-10 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-4 outline-none appearance-none cursor-pointer"
            >
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="px-8 pt-6 pb-8">
            <div className="flex gap-6">
              {/* Y-axis */}
              <div className="flex flex-col justify-between text-right shrink-0 pb-8" style={{ height: 270 }}>
                {yTicks.map((t, i) => (
                  <span key={i} className="text-[11px] font-mono text-slate-300 dark:text-slate-600 leading-none">
                    ${t >= 1000 ? `${(t / 1000).toFixed(0)}k` : t}
                  </span>
                ))}
              </div>

              <div className="flex-1 min-w-0">
                <div ref={chartContainerRef} className="relative w-full" style={{ height: 230 }}
                  onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}>
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    preserveAspectRatio="none"
                    overflow="visible"
                  >
                    <defs>
                      <linearGradient id="rptGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>
                    {[0.25, 0.5, 0.75].map((p, i) => (
                      <line key={i} x1="0" y1={SVG_H * p} x2={SVG_W} y2={SVG_H * p} stroke="currentColor" strokeWidth="1" strokeDasharray="6,4" className="text-slate-100 dark:text-slate-800/50" />
                    ))}
                    <path d={chartPoints.area} fill="url(#rptGrad)" className="transition-all duration-700" />
                    <path d={chartPoints.line} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700" />
                    {chartPoints.points.map((pt, i) => {
                      const slotW = SVG_W / (chartPoints.points.length - 1 || 1);
                      const slotX = i === 0 ? 0 : pt.x - slotW / 2;
                      const slotEnd = i === chartPoints.points.length - 1 ? SVG_W : pt.x + slotW / 2;
                      return (
                        <g key={i}>
                          <rect x={slotX} y={0} width={slotEnd - slotX} height={SVG_H} fill="transparent"
                            onMouseEnter={e => {
                              const svgEl = (e.target as SVGElement).ownerSVGElement!;
                              const svgRect = svgEl.getBoundingClientRect();
                              const cRect = chartContainerRef.current?.getBoundingClientRect() ?? svgRect;
                              const scaleX = svgRect.width / SVG_W;
                              const scaleY = svgRect.height / SVG_H;
                              setTooltip({
                                visible: true,
                                x: (svgRect.left - cRect.left) + pt.x * scaleX,
                                y: (svgRect.top  - cRect.top)  + pt.y * scaleY,
                                value: pt.value,
                                label: chartData[i].label,
                              });
                            }}
                          />
                          <circle cx={pt.x} cy={pt.y} r={i === chartPoints.points.length - 1 ? "5" : "4"} fill="#2563EB" stroke="currentColor" strokeWidth="2" className="text-white dark:text-slate-900 transition-all duration-700" />
                        </g>
                      );
                    })}
                    {chartPoints.points.length > 0 && (
                      <line x1={chartPoints.points[chartPoints.points.length-1].x} y1={chartPoints.points[chartPoints.points.length-1].y}
                        x2={chartPoints.points[chartPoints.points.length-1].x} y2={SVG_H}
                        stroke="#2563EB" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.35" />
                    )}
                  </svg>
                  {tooltip.visible && (
                    <div className="absolute pointer-events-none z-20 bg-slate-900 dark:bg-slate-800 text-white text-[12px] font-black rounded-xl px-3 py-2 shadow-lg whitespace-nowrap"
                      style={{ left: tooltip.x, top: tooltip.y - 46, transform: "translateX(-50%)" }}>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] block">{tooltip.label}</span>
                      ${tooltip.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900 dark:border-t-slate-800" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-3 pl-0">
                  {chartData.map((d, i) => (
                    <span key={i} className={`text-[11px] font-black uppercase tracking-widest ${i === chartData.length - 1 ? "text-blue-600" : "text-slate-400 dark:text-slate-600"}`}>
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Grid: Table + Right Column ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 pb-8">

          {/* Recent Payments — 2 cols */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Recent Payments</h2>
              <Link href="/invoices" className="text-sm font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">View All</Link>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/60 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                    {["Payment ID", "Client", "Invoice #", "Date", "Amount", "Status"].map(h => (
                      <th key={h} className={`py-3.5 px-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ${h === "Amount" ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {payments.map(pay => (
                    <tr key={pay.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group">
                      <td className="py-4 px-6 text-[13px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline">{pay.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 shadow-sm"
                            style={{ backgroundColor: pay.color }}>
                            {pay.initials}
                          </div>
                          <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{pay.client}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[12px] text-slate-400 dark:text-slate-500 font-medium">{pay.invoice}</td>
                      <td className="py-4 px-6 text-[12px] text-slate-500 dark:text-slate-400 font-medium">{pay.date}</td>
                      <td className="py-4 px-6 text-[13px] font-black text-slate-900 dark:text-white text-right">
                        ${pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${statusStyle(pay.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot(pay.status)}`} />
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">

            {/* Top Clients */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1 transition-colors">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-base font-black text-slate-900 dark:text-white">Top Clients</h2>
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-[20px]">star</span>
              </div>
              <div className="p-3">
                {(topClients.length > 0 ? topClients : [
                  { name: "Fleurish Creative", initials: "FC", amount: 12450, email: "hi@fleurish.co" },
                  { name: "Design Studio Inc",  initials: "DS", amount: 9800,  email: "studio@ds.com" },
                  { name: "Momentum Kings",     initials: "MK", amount: 7200,  email: "mk@momentum.io" },
                ]).map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                        {c.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{c.name}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[130px]">{c.email}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-black text-slate-900 dark:text-white">${(c.amount / 1000).toFixed(1)}k</p>
                      <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Total Billed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 dark:shadow-none">
              <h3 className="text-base font-black mb-2">Automate your invoicing</h3>
              <p className="text-sm text-blue-100 mb-5 leading-relaxed">Connect your bank to auto-reconcile payments and save 10+ hours a week.</p>
              <button className="w-full py-2.5 bg-white text-blue-600 font-black text-sm rounded-xl hover:bg-blue-50 transition-colors active:scale-95">
                Connect Bank Account
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
