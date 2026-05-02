"use client";
import { useState } from "react";

type FilterType = "All" | "Minimal" | "Modern" | "Classic" | "Professional";

const TEMPLATES = [
  {
    id: 1,
    name: "The Minimalist",
    category: "Minimal",
    badge: "DEFAULT",
    tag: "POPULAR",
    tagColor: "bg-green-100 text-green-700",
    description: "A clean, spacious layout focusing on clarity. Perfect for freelancers and consultants who value simplicity.",
    preview: (
      <div className="w-full h-full bg-white flex flex-col p-6 gap-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="w-20 h-5 bg-on-surface rounded mb-1"></div>
            <div className="w-28 h-2 bg-outline-variant rounded"></div>
          </div>
          <div className="text-right">
            <div className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Invoice</div>
            <div className="text-[14px] font-black text-primary">#0001</div>
          </div>
        </div>
        <div className="w-full h-px bg-outline-variant/40 my-1"></div>
        <div className="flex gap-4">
          <div className="flex-1"><div className="w-10 h-1.5 bg-outline-variant rounded mb-1.5"></div><div className="w-20 h-2 bg-on-surface/80 rounded mb-1"></div><div className="w-16 h-2 bg-on-surface/40 rounded"></div></div>
          <div className="flex-1"><div className="w-10 h-1.5 bg-outline-variant rounded mb-1.5"></div><div className="w-20 h-2 bg-on-surface/80 rounded mb-1"></div><div className="w-16 h-2 bg-on-surface/40 rounded"></div></div>
        </div>
        <div className="flex-1 space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="flex justify-between items-center py-1.5 border-b border-outline-variant/20">
              <div className="flex gap-2 items-center"><div className="w-16 h-2 bg-on-surface/60 rounded"></div></div>
              <div className="w-10 h-2 bg-primary/30 rounded"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-end"><div className="bg-primary text-white px-4 py-2 rounded text-[9px] font-black uppercase tracking-wider">Total: $2,400.00</div></div>
      </div>
    ),
  },
  {
    id: 2,
    name: "The Professional",
    category: "Professional",
    badge: null,
    tag: null,
    tagColor: "",
    description: "Standard corporate layout with structured sections and reliable data density for established businesses.",
    preview: (
      <div className="w-full h-full bg-white flex flex-col">
        <div className="bg-primary p-5 flex justify-between items-center">
          <div><div className="w-16 h-3 bg-white/80 rounded mb-1"></div><div className="w-10 h-1.5 bg-white/40 rounded"></div></div>
          <div className="text-right"><div className="text-[10px] font-black text-white/80 uppercase tracking-widest">INVOICE</div><div className="text-[16px] font-black text-white">#0042</div></div>
        </div>
        <div className="p-5 flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low rounded p-2"><div className="w-8 h-1.5 bg-outline-variant rounded mb-1"></div><div className="w-16 h-2 bg-on-surface/60 rounded mb-1"></div><div className="w-12 h-1.5 bg-on-surface/30 rounded"></div></div>
            <div className="bg-surface-container-low rounded p-2"><div className="w-8 h-1.5 bg-outline-variant rounded mb-1"></div><div className="w-16 h-2 bg-on-surface/60 rounded mb-1"></div><div className="w-12 h-1.5 bg-on-surface/30 rounded"></div></div>
          </div>
          <div className="space-y-1.5">
            <div className="grid grid-cols-4 gap-1 bg-primary/10 px-2 py-1 rounded">{["Item","Qty","Rate","Total"].map(h=><div key={h} className="text-[7px] font-black text-primary uppercase">{h}</div>)}</div>
            {[1,2,3].map(i=><div key={i} className="grid grid-cols-4 gap-1 px-2 py-1 border-b border-outline-variant/20">{[1,2,3,4].map(j=><div key={j} className="w-full h-1.5 bg-on-surface/30 rounded"></div>)}</div>)}
          </div>
          <div className="flex justify-end"><div className="bg-primary text-white px-3 py-1.5 rounded text-[8px] font-black">TOTAL: $5,800.00</div></div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    name: "The Creative",
    category: "Modern",
    badge: null,
    tag: "NEW",
    tagColor: "bg-purple-100 text-purple-700",
    description: "Dynamic layout for agencies and designers. Uses asymmetrical elements to stand out in the inbox.",
    preview: (
      <div className="w-full h-full bg-white flex flex-col">
        <div className="flex">
          <div className="w-2 bg-tertiary-container"></div>
          <div className="flex-1 p-5">
            <div className="flex justify-between mb-4">
              <div><div className="text-[18px] font-black text-tertiary-container leading-none">INV.</div><div className="text-[9px] text-on-surface-variant">#0087</div></div>
              <div className="text-right"><div className="w-12 h-2 bg-on-surface rounded mb-1"></div><div className="w-20 h-1.5 bg-outline-variant rounded"></div></div>
            </div>
            <div className="space-y-2 mb-4">
              {[1,2,3].map(i=><div key={i} className="flex justify-between"><div className="w-20 h-1.5 bg-on-surface/40 rounded"></div><div className="w-10 h-1.5 bg-tertiary-container/60 rounded"></div></div>)}
            </div>
            <div className="bg-tertiary-container text-white rounded p-2 flex justify-between items-center">
              <div className="text-[8px] font-black uppercase tracking-widest">Amount Due</div>
              <div className="text-[12px] font-black">$3,200.00</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    name: "The Corporate",
    category: "Classic",
    badge: null,
    tag: null,
    tagColor: "",
    description: "High information density design. Accommodates complex tax structures and multiple service lines.",
    preview: (
      <div className="w-full h-full bg-slate-900 flex flex-col p-5">
        <div className="flex justify-between mb-4">
          <div><div className="w-14 h-3 bg-white/90 rounded mb-1"></div><div className="w-10 h-1.5 bg-white/30 rounded"></div></div>
          <div className="bg-primary px-3 py-1 rounded"><div className="text-[8px] font-black text-white uppercase tracking-wider">Invoice #007</div></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="grid grid-cols-3 gap-1 bg-white/5 px-2 py-1 rounded">{["Service","Hours","Amount"].map(h=><div key={h} className="text-[7px] font-black text-white/50 uppercase">{h}</div>)}</div>
          {[1,2,3,4].map(i=><div key={i} className="grid grid-cols-3 gap-1 px-2 py-1 border-b border-white/10">{[1,2,3].map(j=><div key={j} className="w-full h-1.5 bg-white/20 rounded"></div>)}</div>)}
        </div>
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
          <div className="text-[8px] text-white/40">Subtotal / Tax / Total</div>
          <div className="text-[12px] font-black text-primary">$9,450.00</div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    name: "Modern Bold",
    category: "Modern",
    badge: null,
    tag: "TRENDING",
    tagColor: "bg-blue-100 text-blue-700",
    description: "A high-contrast layout with large typography. Ideal for digital-first companies and modern brands.",
    preview: (
      <div className="w-full h-full bg-white flex flex-col">
        <div className="bg-on-surface p-5">
          <div className="text-[7px] font-black text-white/50 uppercase tracking-widest mb-1">Invoice</div>
          <div className="text-[22px] font-black text-white leading-none">#2024</div>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="space-y-1.5">
            {[1,2,3].map(i=><div key={i} className="flex justify-between items-center py-1.5 border-b border-outline-variant/30"><div className="w-20 h-2 bg-on-surface/50 rounded"></div><div className="w-12 h-2 bg-on-surface/70 rounded"></div></div>)}
          </div>
          <div className="bg-primary rounded-lg p-3 flex justify-between items-center">
            <div className="text-[9px] font-black text-white/80 uppercase tracking-widest">Total Due</div>
            <div className="text-[14px] font-black text-white">$12,500</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    name: "Elegant Stripe",
    category: "Classic",
    badge: null,
    tag: null,
    tagColor: "",
    description: "Timeless striped rows with a gold accent. A refined look for luxury services and consulting firms.",
    preview: (
      <div className="w-full h-full bg-white flex flex-col p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Invoice</div>
            <div className="w-16 h-2 bg-on-surface rounded mt-1"></div>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-amber-500/60"></div></div>
        </div>
        <div className="flex-1 space-y-0">
          {[1,2,3,4,5].map(i=><div key={i} className={`flex justify-between px-2 py-1.5 ${i%2===0 ? 'bg-amber-50' : 'bg-white'}`}><div className="w-20 h-1.5 bg-on-surface/40 rounded"></div><div className="w-10 h-1.5 bg-amber-600/50 rounded"></div></div>)}
        </div>
        <div className="mt-3 flex justify-end">
          <div className="bg-amber-500 text-white px-4 py-1.5 rounded text-[8px] font-black">$6,750.00</div>
        </div>
      </div>
    ),
  },
];

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(1);

  const filters: FilterType[] = ["All", "Minimal", "Modern", "Classic", "Professional"];

  const filtered = activeFilter === "All"
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeFilter);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-16">
      {/* Page Header */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 block">Personalization</span>
            <h2 className="text-3xl font-black text-on-surface tracking-tight mb-3">Invoice Templates</h2>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              Choose a layout that best represents your brand. You can customize colors and fonts to ensure consistency with your professional identity.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
              <span className="material-symbols-outlined text-[18px]">upload</span>
              Upload Custom
            </button>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <nav className="flex flex-wrap items-center gap-2 pb-6 border-b border-outline-variant/40">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
              activeFilter === f
                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                : "text-secondary hover:bg-surface-container-high border border-outline-variant/50"
            }`}
          >
            {f} Templates
          </button>
        ))}
      </nav>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map(template => {
          const isSelected = selectedTemplate === template.id;
          return (
            <article
              key={template.id}
              className={`group relative bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20 shadow-lg"
                  : "border-outline-variant/60 hover:border-primary/30"
              }`}
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {template.badge && (
                  <span className="bg-primary text-on-primary px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {template.badge}
                  </span>
                )}
                {isSelected && !template.badge && (
                  <span className="bg-primary text-on-primary px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    SELECTED
                  </span>
                )}
              </div>

              {/* Preview Area */}
              <div className="aspect-[3/4] relative bg-surface-container overflow-hidden">
                {template.preview}

                {/* Hover Overlay */}
                <div className="invoice-preview-card absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <button
                    onClick={() => setSelectedTemplate(template.id)}
                    className="bg-white text-primary font-black text-xs px-6 py-2.5 rounded-xl shadow-xl hover:bg-primary hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Quick Preview
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-on-surface text-lg tracking-tight">{template.name}</h3>
                  {template.tag && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${template.tagColor}`}>
                      {template.tag}
                    </span>
                  )}
                </div>
                <p className="text-on-surface-variant text-sm font-medium mb-6 line-clamp-2 leading-relaxed">{template.description}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`flex-1 h-11 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
                      isSelected
                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                        : "bg-primary/10 text-primary hover:bg-primary hover:text-on-primary"
                    }`}
                  >
                    {isSelected ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Selected
                      </span>
                    ) : "Select Template"}
                  </button>
                  <button className="w-11 h-11 rounded-xl border border-outline-variant text-secondary hover:bg-surface-container transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {/* Create Custom Card */}
        <div className="group relative bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-12 hover:bg-surface-container transition-all cursor-pointer hover:border-primary/40">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary text-3xl">add</span>
          </div>
          <h3 className="font-black text-on-surface text-lg mb-2 tracking-tight">Create Custom</h3>
          <p className="text-center text-on-surface-variant text-sm font-medium max-w-[180px] leading-relaxed">
            Build your own template with our drag-and-drop editor.
          </p>
          <button className="mt-6 px-6 py-2.5 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95">
            Start Building
          </button>
        </div>
      </div>

      {/* Selected Template Info Banner */}
      {selectedTemplate && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>
            <div>
              <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-0.5">Active Template</p>
              <h4 className="font-black text-on-surface text-lg tracking-tight">
                {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
              </h4>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-xs font-black uppercase tracking-widest hover:bg-surface-container transition-all">
              Customize
            </button>
            <button className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">edit_document</span>
              Use This Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
