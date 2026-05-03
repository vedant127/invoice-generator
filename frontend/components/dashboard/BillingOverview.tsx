"use client";

import Link from "next/link";

interface BillingOverviewProps {
  stats: {
    paid_invoices: number;
    sent_invoices: number;
    draft_invoices: number;
    overdue_invoices: number;
    total_invoices: number;
  };
}

// ─── Fallback demo data when API has no invoices yet ─────────────────────────
const DEMO_STATS = {
  paid_invoices: 812,
  sent_invoices: 250,
  draft_invoices: 124,
  overdue_invoices: 62,
  total_invoices: 1248,
};

export default function BillingOverview({ stats }: BillingOverviewProps) {
  // Use demo data if all values are 0 (no real data yet)
  const hasRealData = stats.total_invoices > 0;
  const data = hasRealData ? stats : DEMO_STATS;

  const total = data.total_invoices || 1; // avoid divide-by-zero

  const segments = [
    {
      key: "paid",
      label: "PAID",
      count: data.paid_invoices,
      color: "#22c55e", // green
      bgLight: "#dcfce7",
      textColor: "#16a34a",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2" />
          <path
            d="M7 12l3.5 3.5L17 8"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "sent",
      label: "SENT",
      count: data.sent_invoices,
      color: "#3b82f6", // blue
      bgLight: "#dbeafe",
      textColor: "#2563eb",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l7-7 7 7"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 5v14" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "draft",
      label: "DRAFT",
      count: data.draft_invoices,
      color: "#f59e0b", // amber
      bgLight: "#fef3c7",
      textColor: "#d97706",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16M4 10h10M4 14h7"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      key: "overdue",
      label: "OVERDUE",
      count: data.overdue_invoices,
      color: "#ef4444", // red
      bgLight: "#fee2e2",
      textColor: "#dc2626",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 20h20L12 2z"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M12 9v5M12 16.5v.5"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black text-slate-900">Billing Overview</h2>
        <Link
          href="/invoices"
          className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Details
        </Link>
      </div>

      {/* Distribution Label + Total */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Invoice Status Distribution
        </span>
        <span className="text-sm font-black text-slate-900">
          {data.total_invoices.toLocaleString()}{" "}
          <span className="text-slate-400 font-medium">Total</span>
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex gap-[2px]">
        {hasRealData ? (
          segments.map((seg) => {
            const pct = (seg.count / total) * 100;
            if (pct <= 0) return null;
            return (
              <div
                key={seg.key}
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  backgroundColor: seg.color,
                  minWidth: pct > 0 ? "4px" : "0px",
                }}
                title={`${seg.label}: ${seg.count} (${Math.round(pct)}%)`}
              />
            );
          })
        ) : (
          /* Demo data bar */
          segments.map((seg) => {
            const pct = (seg.count / total) * 100;
            return (
              <div
                key={seg.key}
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  backgroundColor: seg.color,
                  minWidth: "4px",
                }}
                title={`${seg.label}: ${seg.count} (${Math.round(pct)}%)`}
              />
            );
          })
        )}
      </div>

      {/* Status breakdown grid */}
      <div className="grid grid-cols-4 gap-4 mt-1">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.count / total) * 100) : 0;
          return (
            <div key={seg.key} className="flex flex-col gap-2">
              {/* Label + Icon */}
              <div className="flex items-center gap-1.5">
                {seg.icon}
                <span
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: seg.textColor }}
                >
                  {seg.label}
                </span>
              </div>
              {/* Count */}
              <p className="text-2xl font-black text-slate-900 leading-none">
                {seg.count.toLocaleString()}
              </p>
              {/* Percentage */}
              <p className="text-[11px] font-medium text-slate-400">
                {pct > 0 ? `${pct}% of total` : "—"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Demo data notice */}
      {!hasRealData && (
        <p className="text-[10px] text-slate-300 font-medium text-right -mt-2">
          * Showing sample data — create invoices to see real stats
        </p>
      )}
    </div>
  );
}
