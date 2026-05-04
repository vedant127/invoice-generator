"use client";

import { TemplateId } from "@/lib/types";

interface TemplateOption {
  id: TemplateId;
  name: string;
  sub: string;
  bg: string;
  accent: string;
  textColor: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: "goldify",
    name: "Goldify",
    sub: "Beige · Typewriter · Editorial",
    bg: "#E8E4DC",
    accent: "#1a1a1a",
    textColor: "#1a1a1a",
  },
  {
    id: "corporate",
    name: "Corporate",
    sub: "Dark · Gold · Formal",
    bg: "#0f1923",
    accent: "#c8a96e",
    textColor: "#fff",
  },
  {
    id: "minimal",
    name: "Minimal",
    sub: "White · Swiss · Clean",
    bg: "#ffffff",
    accent: "#111",
    textColor: "#111",
  },
  {
    id: "retro",
    name: "Retro",
    sub: "Terracotta · Bold · Warm",
    bg: "#f5f0e8",
    accent: "#c4432a",
    textColor: "#2c1810",
  },
];

interface Props {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export default function TemplatePicker({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-1.5 p-3">
      {TEMPLATES.map((t) => {
        const active = selected === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`text-left rounded-lg overflow-hidden border-2 transition-all ${
              active ? "border-gray-900 shadow-md scale-[1.01]" : "border-transparent hover:border-gray-300"
            }`}
          >
            {/* Swatch preview */}
            <div
              style={{ background: t.bg, padding: "12px 14px", borderBottom: `3px solid ${t.accent}` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.15em", color: t.textColor, opacity: 0.5, fontFamily: "Courier New, monospace" }}>
                  INVOICE NO. 001
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: t.textColor, fontFamily: "Courier New, monospace", letterSpacing: "0.04em" }}>
                  INVOICE
                </div>
              </div>
              {/* Mini table lines */}
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                {[70, 55, 80, 45].map((w, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ height: 4, width: `${w}%`, background: t.textColor, opacity: 0.15, borderRadius: 2 }} />
                    <div style={{ height: 4, width: "15%", background: t.accent, opacity: 0.4, borderRadius: 2 }} />
                  </div>
                ))}
              </div>
            </div>
            {/* Label */}
            <div className="px-3 py-2 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-gray-900">{t.name}</div>
                  <div className="text-[9px] text-gray-400 tracking-wide">{t.sub}</div>
                </div>
                {active && (
                  <div className="w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
