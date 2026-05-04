"use client";
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import Link from "next/link";
import BillingOverview from "@/components/dashboard/BillingOverview";

// ─── Smooth SVG path helper ───────────────────────────────────────────────────
const getSmoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 3;
    const cp2x = curr.x + (2 * (next.x - curr.x)) / 3;
    d += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`;
  }
  return d;
};

// ─── Fallback demo data when API has no invoices yet ─────────────────────────
// 12 months of demo data (used for both 6-month and 12-month / This Year views)
const DEMO_MONTHLY_DATA_12 = [5000, 8000, 13500, 12800, 11000, 15200, 19200, 22000, 21000, 23600, 26000, 28430];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<"6m" | "year" | "3m">("6m");
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [topClients, setTopClients] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_invoices: 0,
    paid_invoices: 0,
    overdue_invoices: 0,
    sent_invoices: 0,
    draft_invoices: 0,
    revenue_growth: "+12%",
  });

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    value: number;
    label: string;
  }>({ visible: false, x: 0, y: 0, value: 0, label: "" });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [invoicesRes, clientsRes] = await Promise.all([
          api.get("/api/v1/invoices/"),
          api.get("/api/v1/clients/"),
        ]);

        if (invoicesRes.data && Array.isArray(invoicesRes.data)) {
          const invs = invoicesRes.data;
          setInvoices(invs);

          const totalRev = invs.reduce(
            (acc: number, inv: any) => acc + (inv.total_amount || inv.total || 0),
            0
          );

          setStats({
            total_revenue: totalRev,
            total_invoices: invs.length,
            paid_invoices: invs.filter((i: any) => i.status === "PAID").length,
            overdue_invoices: invs.filter((i: any) => i.status === "OVERDUE").length,
            sent_invoices: invs.filter((i: any) => i.status === "SENT" || i.status === "PENDING").length,
            draft_invoices: invs.filter((i: any) => i.status === "DRAFT").length,
            revenue_growth: "+12%",
          });

          const mapped = invs.slice(0, 4).map((inv: any, idx: number) => ({
            id: `#INV-${4021 - idx}`,
            client: inv.client?.name || "Unknown Client",
            clientInitials: (inv.client?.name || "U").charAt(0),
            date: new Date(inv.created_at || inv.issue_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            amount: inv.total_amount || inv.total || 0,
            status:
              inv.status === "PAID" ? "Paid" :
              inv.status === "OVERDUE" ? "Overdue" : "Pending",
          }));
          setRecentPayments(mapped);

          const clientRev: Record<string, {
            name: string; amount: number; initials: string;
            email: string; count: number; avatar?: string;
          }> = {};
          invs.forEach((inv: any) => {
            const name = inv.client?.name || "Unknown";
            if (!clientRev[name]) {
              clientRev[name] = {
                name, amount: 0, initials: name.charAt(0),
                email: inv.client?.email || "no-email@client.com",
                count: 0, avatar: inv.client?.avatar,
              };
            }
            clientRev[name].amount += inv.total_amount || inv.total || 0;
            clientRev[name].count += 1;
          });

          setTopClients(
            Object.values(clientRev).sort((a, b) => b.amount - a.amount).slice(0, 3)
          );
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = useMemo(() => {
    const now = new Date();
    const result = [];

    let months: number;
    let startDate: Date;

    if (timeRange === "3m") {
      months = 3;
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    } else if (timeRange === "year") {
      // Jan → current month of current year
      months = now.getMonth() + 1;
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      // Default: last 6 months
      months = 6;
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    }

    for (let i = 0; i < months; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthLabel = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
      const year = date.getFullYear();
      const month = date.getMonth();

      const monthlyTotal = invoices
        .filter((inv) => {
          const invDate = new Date(inv.created_at || inv.issue_date);
          return invDate.getFullYear() === year && invDate.getMonth() === month;
        })
        .reduce((sum, inv) => sum + (inv.total_amount || inv.total || 0), 0);

      result.push({ label: monthLabel, value: monthlyTotal });
    }

    // If no real data, fall back to demo values sliced to the right length
    const hasRealData = result.some((d) => d.value > 0);
    if (!hasRealData) {
      const demoSlice = DEMO_MONTHLY_DATA_12.slice(-months);
      return result.map((d, i) => ({ label: d.label, value: demoSlice[i] ?? 0 }));
    }

    return result;
  }, [invoices, timeRange]);

  const maxRevenue = Math.max(...chartData.map((d) => d.value), 1);
  const yMax = Math.ceil(maxRevenue / 10000) * 10000;
  const SVG_W = 900;
  const SVG_H = 240;

  const chartPoints = useMemo(() => {
    if (chartData.length === 0) return { area: "", line: "", points: [] };

    const points = chartData.map((d, i) => ({
      x: (i / (chartData.length - 1)) * SVG_W,
      y: SVG_H - (d.value / yMax) * SVG_H,
      value: d.value,
      label: d.label,
    }));

    const linePath = getSmoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x},${SVG_H} L ${points[0].x},${SVG_H} Z`;

    return { area: areaPath, line: linePath, points };
  }, [chartData, yMax]);

  const yTicks = [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0];

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:px-12 xl:px-16 pb-24 bg-[#F8F9FB] dark:bg-slate-950 animate-in fade-in duration-700 font-sans transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-10">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start mb-5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-black">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {stats.revenue_growth}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mb-2">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ${stats.total_revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start mb-5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-black">
                <span className="material-symbols-outlined text-[14px]">trending_flat</span> 0%
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mb-2">Total Invoices</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.total_invoices.toLocaleString()}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start mb-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mb-2">Paid Invoices</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.paid_invoices.toLocaleString()}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-28 h-28 bg-red-50 dark:bg-red-900/20 rounded-bl-full -mr-6 -mt-6 opacity-40 z-0 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex justify-between items-start mb-5">
              <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined">warning</span>
              </div>
            </div>
            <p className="relative z-10 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mb-2">Overdue</p>
            <h3 className="relative z-10 text-2xl font-black text-red-600 dark:text-red-400 tracking-tight">{stats.overdue_invoices}</h3>
          </div>
        </div>

        {/* Revenue Trends Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Revenue Trends</h2>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-0.5 font-medium">Monthly breakdown of your earnings</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as "6m" | "year" | "3m")}
                className="h-10 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-4 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none appearance-none cursor-pointer"
              >
                <option value="6m">Last 6 Months</option>
                <option value="year">This Year</option>
                <option value="3m">Last 3 Months</option>
              </select>
              <button className="w-10 h-10 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-[22px]">more_vert</span>
              </button>
            </div>
          </div>

          <div className="px-8 pt-6 pb-8">
            <div className="flex gap-6">
              {/* Y-Axis Labels */}
              <div className="flex flex-col justify-between text-right shrink-0 pb-8" style={{ height: "280px" }}>
                {yTicks.map((tick, i) => (
                  <span key={i} className="text-[11px] font-mono text-slate-300 dark:text-slate-600 leading-none">
                    ${tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}
                  </span>
                ))}
              </div>

              <div className="flex-1 min-w-0">
                {/* SVG Chart */}
                <div
                  className="relative w-full"
                  style={{ height: "240px" }}
                  onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    preserveAspectRatio="none"
                    overflow="visible"
                  >
                    <defs>
                      <linearGradient id="revGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                        <stop offset="85%" stopColor="#2563eb" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>

                    {[0.25, 0.5, 0.75].map((pct, i) => (
                      <line key={i} x1="0" y1={SVG_H * pct} x2={SVG_W} y2={SVG_H * pct}
                        stroke="currentColor" strokeWidth="1" strokeDasharray="6,4" className="text-slate-100 dark:text-slate-800/50" />
                    ))}

                    <path d={chartPoints.area} fill="url(#revGradient)" className="transition-all duration-700" />
                    <path d={chartPoints.line} fill="none" stroke="#2563eb" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700" />

                    {chartPoints.points.map((pt, i) => {
                      const slotW = SVG_W / (chartPoints.points.length - 1 || 1);
                      const slotX = i === 0 ? 0 : pt.x - slotW / 2;
                      const slotXEnd = i === chartPoints.points.length - 1 ? SVG_W : pt.x + slotW / 2;

                      return (
                        <g key={i}>
                          <rect x={slotX} y={0} width={slotXEnd - slotX} height={SVG_H}
                            fill="transparent"
                            onMouseEnter={(e) => {
                              const svg = (e.target as SVGElement).ownerSVGElement!;
                              const rect = svg.getBoundingClientRect();
                              const scaleX = rect.width / SVG_W;
                              const scaleY = rect.height / SVG_H;
                              setTooltip({
                                visible: true,
                                x: pt.x * scaleX,
                                y: pt.y * scaleY,
                                value: pt.value,
                                label: chartData[i].label,
                              });
                            }}
                          />
                          <circle cx={pt.x} cy={pt.y} r="4" fill="#2563eb" stroke="currentColor" strokeWidth="2" className="text-white dark:text-slate-900" />
                        </g>
                      );
                    })}

                    {chartPoints.points.length > 0 && (
                      <line
                        x1={chartPoints.points[chartPoints.points.length - 1].x}
                        y1={chartPoints.points[chartPoints.points.length - 1].y}
                        x2={chartPoints.points[chartPoints.points.length - 1].x}
                        y2={SVG_H}
                        stroke="#2563eb" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.35"
                      />
                    )}
                  </svg>

                  {tooltip.visible && (
                    <div
                      className="absolute pointer-events-none z-20 bg-slate-900 dark:bg-slate-800 text-white text-[12px] font-black rounded-xl px-3 py-2 shadow-lg whitespace-nowrap"
                      style={{ left: tooltip.x, top: tooltip.y - 44, transform: "translateX(-50%)" }}
                    >
                      ${tooltip.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900 dark:border-t-slate-800" />
                    </div>
                  )}
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-3">
                  {chartData.map((d, i) => (
                    <span key={i} className={`text-[11px] font-black uppercase tracking-widest ${
                      i === chartData.length - 1 ? "text-blue-600" : "text-slate-400 dark:text-slate-600"
                    }`}>
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — 2 cols: BillingOverview + Recent Payments stacked */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* ── Billing Overview ── */}
            <BillingOverview
              stats={{
                paid_invoices: stats.paid_invoices,
                sent_invoices: stats.sent_invoices,
                draft_invoices: stats.draft_invoices,
                overdue_invoices: stats.overdue_invoices,
                total_invoices: stats.total_invoices,
              }}
            />

            {/* Recent Payments */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Recent Payments</h2>
                <Link href="/invoices" className="text-sm font-black text-blue-600 hover:text-blue-700 dark:text-blue-400">View All</Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/30 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                      {([["ID",""], ["Client",""], ["Date",""], ["Amount","text-right"], ["Status","text-center"]] as [string,string][]).map(([h, cls]) => (
                        <th key={h} className={`py-4 px-8 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ${cls}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {recentPayments.length > 0 ? recentPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                        <td className="py-5 px-8 text-[13px] font-mono font-bold text-slate-400 group-hover:text-blue-600 transition-colors">{pay.id}</td>
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-xs">{pay.clientInitials}</div>
                            <span className="text-[14px] font-black text-slate-900 dark:text-white">{pay.client}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-[13px] font-medium text-slate-500 dark:text-slate-400">{pay.date}</td>
                        <td className="py-5 px-8 text-[14px] font-black text-slate-900 dark:text-white text-right">${pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="py-5 px-8 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            pay.status === "Paid" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                            pay.status === "Overdue" ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          }`}>{pay.status}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="py-12 text-center text-sm text-slate-400">No recent payments.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right: Quick Actions + Top Clients */}
          <div className="flex flex-col gap-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 relative overflow-hidden group transition-colors">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 relative z-10">Quick Actions</h2>
              <div className="flex flex-col gap-3 relative z-10">
                <Link href="/invoices/new" className="h-[44px] w-full bg-blue-600 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors active:scale-[0.98]">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>post_add</span>
                  New Invoice
                </Link>
                <Link href="/clients" className="h-[44px] w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-[0.98]">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Add Client
                </Link>
              </div>
            </div>

            {/* Top Clients */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex-1 flex flex-col transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Top Clients</h2>
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-[22px]">star</span>
              </div>
              <div className="flex flex-col gap-5 flex-1">
                {topClients.length > 0 ? topClients.map((client, i) => (
                  <div key={i} className="flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      {client.avatar
                        ? <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 object-cover" />
                        : <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                            i === 0 ? "bg-indigo-50 border border-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400" :
                            i === 1 ? "bg-amber-50 border border-amber-100 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400" :
                            "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                          }`}>{client.initials}</div>
                      }
                      <div>
                        <p className="text-[14px] font-black text-slate-900 dark:text-white">{client.name}</p>
                        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{client.count} Invoices</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-black text-slate-900 dark:text-white">${(client.amount / 1000).toFixed(0)}K</p>
                      <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">YTD</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-10 text-sm text-slate-400">No clients yet.</p>
                )}
              </div>
              <Link href="/clients" className="mt-6 w-full text-[11px] font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border-t border-slate-50 dark:border-slate-800 pt-6 text-center uppercase tracking-widest">
                View All Clients
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
