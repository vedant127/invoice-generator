"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  StandardPreview,
  ModernMinimalPreview,
  CreativeEdgePreview,
  CorporateBlueprintPreview,
  ElegantSerifPreview,
} from "@/components/dashboard/TemplatePreview";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type FilterId = "all" | "minimal" | "corporate" | "creative" | "modern";

interface Template {
  id: string;
  name: string;
  description: string;
  tag?: string;
  tagClass?: string;
  category: FilterId;
  Preview: React.ComponentType<any>;
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const TEMPLATES: Template[] = [
  {
    id: "standard",
    name: "Standard Professional",
    description:
      "The classic InvoicePro layout. Clean, high-fidelity, and optimized for business clarity. Our most popular choice.",
    tag: "DEFAULT",
    tagClass: "bg-blue-600 text-white border border-blue-600",
    category: "corporate",
    Preview: StandardPreview,
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description:
      "Ultra-clean design with generous spacing and modern typography. Focuses on the core billing information.",
    tag: "PREMIUM",
    tagClass: "bg-slate-900 text-white border border-slate-900",
    category: "minimal",
    Preview: ModernMinimalPreview,
  },
  {
    id: "creative-edge",
    name: "Creative Edge",
    description:
      "Bold, high-contrast header with a striking italic style. Perfect for designers, agencies, and digital studios.",
    category: "creative",
    Preview: CreativeEdgePreview,
  },
  {
    id: "corporate-blueprint",
    name: "Corporate Blueprint",
    description:
      "A highly structured, grid-based layout. Features precise technical details and a classic typewriter monospace feel.",
    category: "corporate",
    Preview: CorporateBlueprintPreview,
  },
  {
    id: "elegant-serif",
    name: "Elegant Serif",
    description:
      "A sophisticated, high-end design using fine serif typography. Ideal for luxury services and consulting.",
    tag: "LUXURY",
    tagClass: "bg-amber-100 text-amber-800 border border-amber-200",
    category: "minimal",
    Preview: ElegantSerifPreview,
  },
];

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Templates" },
  { id: "minimal", label: "Minimal" },
  { id: "corporate", label: "Corporate" },
  { id: "creative", label: "Creative" },
  { id: "modern", label: "Modern" },
];

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────
export default function TemplatesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    // Fetch current selection
    api.get("/api/v1/users/me").then((res) => {
      setSelected(res.data.selected_template || "standard");
      setLoading(false);
    });
  }, []);

  const handleSelectTemplate = async (id: string) => {
    setSaving(true);
    try {
      await api.patch("/api/v1/users/me", { selected_template: id });
      setSelected(id);
      setShowBar(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredTemplates =
    filter === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === filter);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-32">
      {/* Header */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Invoice Templates</h1>
          <p className="text-slate-500 font-medium">Choose a high-fidelity design that matches your brand's excellence.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-slate-400 hover:text-slate-900 border border-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredTemplates.map((tpl) => {
          const isSelected = selected === tpl.id;
          const Preview = tpl.Preview;

          return (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl.id)}
              className={`group relative bg-white rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? "border-primary shadow-2xl shadow-primary/10 scale-[1.02]"
                  : "border-slate-50 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50"
              }`}
            >
              {/* Preview Container */}
              <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden origin-top scale-[0.98] mt-2 mx-2 rounded-2xl group-hover:scale-100 transition-transform duration-500">
                 <div className="absolute inset-0 pointer-events-none origin-top scale-[0.35] w-[285%] h-[285%] p-8">
                    <Preview />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-lg text-slate-900">{tpl.name}</h3>
                  {tpl.tag && (
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${tpl.tagClass}`}>
                      {tpl.tag}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Action row */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleSelectTemplate(tpl.id); 
                      router.push("/invoices/new");
                    }}
                    disabled={saving}
                    className={`flex-1 h-10 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${
                      isSelected
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-slate-50 text-slate-600 hover:bg-primary hover:text-white"
                    }`}
                  >
                    {isSelected ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        Active Template
                      </span>
                    ) : (
                      "Use This Template"
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar (Ephemeral) */}
      {showBar && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[500px]">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <div>
                <p className="text-sm font-black">Template Selected!</p>
                <p className="text-[10px] text-slate-400">Your invoices will now use this professional layout.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowBar(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
              <button 
                onClick={() => router.push("/invoices/new")}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span className="hidden sm:inline">Create Invoice</span>
                <span className="sm:hidden text-xs">Create</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
