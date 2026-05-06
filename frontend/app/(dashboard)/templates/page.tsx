"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  StandardPreview,
  ModernMinimalPreview,
  CreativeEdgePreview,
  CorporateBlueprintPreview,
  ElegantSerifPreview,
  GoldifyAdapted,
  CorporateAdapted,
  MinimalAdapted,
  RetroAdapted,
} from "@/components/dashboard/TemplatePreview";
import { Upload, X, FileJson, CheckCircle2, Info, ChevronRight, Plus } from "lucide-react";

// ─── Template metadata ──────────────────────────────────────────────────────
const TEMPLATE_META = [
  {
    id: "minimal-swiss",
    name: "The Minimalist",
    badge: "POPULAR",
    badgeColor: "#10B981",
    category: "formal",
    description: "Clean, distraction-free layout focusing on clarity. Perfect for freelancers and consultants.",
    accent: "#111827",
    bg: "#FFFFFF",
    Preview: MinimalAdapted,
  },
  {
    id: "standard",
    name: "The Professional",
    badge: null,
    badgeColor: null,
    category: "corporate",
    description: "Standard corporate layout with tailored structure and reliable data hierarchy.",
    accent: "#1D4ED8",
    bg: "#F8FAFF",
    Preview: StandardPreview,
  },
  {
    id: "retro-terracotta",
    name: "The Creative",
    badge: "NEW",
    badgeColor: "#F59E0B",
    category: "creative",
    description: "Dynamic layout for agencies and designers. Uses bold elements to stand out.",
    accent: "#7C3AED",
    bg: "#FDFAFF",
    Preview: RetroAdapted,
  },
  {
    id: "corporate-gold",
    name: "The Corporate",
    badge: null,
    badgeColor: null,
    category: "corporate",
    description: "A dark, formal template with gold accents. Designed for high-end corporate billing.",
    accent: "#92400E",
    bg: "#FFFBEB",
    Preview: CorporateAdapted,
  },
  {
    id: "modern-minimal",
    name: "Modern Bold",
    badge: "TRENDING",
    badgeColor: "#10B981",
    category: "creative",
    description: "Ultra-modern design with generous spacing and bold indigo accents.",
    accent: "#4F46E5",
    bg: "#EEF2FF",
    Preview: ModernMinimalPreview,
  },
  {
    id: "elegant-serif",
    name: "Elegant Stripe",
    badge: null,
    badgeColor: null,
    category: "formal",
    description: "Sophisticated high-end design using fine serif typography for luxury clients.",
    accent: "#065F46",
    bg: "#F0FDF4",
    Preview: ElegantSerifPreview,
  },
  {
    id: "goldify",
    name: "Goldy Editorial",
    badge: null,
    badgeColor: null,
    category: "creative",
    description: "Premium design-forward template with editorial tone and luxurious gold accents.",
    accent: "#B45309",
    bg: "#FFFBEB",
    Preview: GoldifyAdapted,
  },
];

const CATEGORIES = ["ALL TEMPLATES", "FORMAL", "CORPORATE", "CREATIVE", "MODERN"];

// ─── Thumbnail — Renders the actual React component scaled down ──────────────
const THUMB_W = 284;
const THUMB_H = 210;

function InvoiceThumbnail({ template }) {
  const Preview = template.Preview;
  return (
    <div
      style={{
        width: THUMB_W,
        height: THUMB_H,
        overflow: "hidden",
        position: "relative",
        background: template.bg,
        borderRadius: "10px 10px 0 0",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1000px", // Base width for preview
          height: "1414px", // A4 Aspect Ratio
          transform: `scale(${THUMB_W / 1000})`,
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
      >
        <Preview />
      </div>
    </div>
  );
}

// ─── Template Card ─────────────────────────────────────────────────────────
function TemplateCard({ template, isSelected, onSelect, onGenerate }) {
  return (
    <div
      onClick={() => onSelect(template.id)}
      style={{
        background: "#fff",
        borderRadius: 12,
        border: isSelected ? "2px solid #2563EB" : "1.5px solid #E5E7EB",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        boxShadow: isSelected
          ? "0 0 0 4px rgba(37,99,235,0.10)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}
    >
      {/* Badge top-right */}
      {template.badge && (
        <div
          style={{
            position: "absolute", top: 10, right: 10, zIndex: 10,
            background: template.badgeColor, color: "#fff",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
            padding: "3px 8px", borderRadius: 4,
          }}
        >
          {template.badge}
        </div>
      )}

      {/* Checkmark top-left when selected */}
      {isSelected && (
        <div
          style={{
            position: "absolute", top: 10, left: 10, zIndex: 10,
            background: "#2563EB", borderRadius: "50%",
            width: 22, height: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Thumbnail */}
      <InvoiceThumbnail template={template} />

      {/* Card footer */}
      <div style={{ padding: "13px 15px 15px", borderTop: "1px solid #F3F4F6" }}>
        <p style={{ margin: "0 0 3px", fontSize: 13.5, fontWeight: 600, color: "#111827" }}>
          {template.name}
        </p>
        <p
          style={{
            margin: "0 0 11px", fontSize: 11.5, color: "#6B7280", lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}
        >
          {template.description}
        </p>

        <div style={{ display: "flex", gap: 7 }}>
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              if (isSelected) {
                onGenerate();
              } else {
                onSelect(template.id);
              }
            }}
            style={{
              flex: 1, padding: "8px 0", fontSize: 11.5, fontWeight: 700,
              borderRadius: 8, border: "none", cursor: "pointer",
              background: isSelected ? "#2563EB" : "#EFF6FF",
              color: isSelected ? "#fff" : "#2563EB",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              letterSpacing: "0.03em",
              boxShadow: isSelected ? "0 4px 12px rgba(37,99,235,0.2)" : "none",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: isSelected ? "slideInUp 0.3s ease-out" : "none",
            }}
          >
            {isSelected ? (
              <>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                CREATE INVOICE
              </>
            ) : (
              "USE TEMPLATE"
            )}
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            title="Full preview"
            style={{
              width: 30, height: 30, borderRadius: 7,
              border: "1.5px solid #E5E7EB", background: "#fff",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 5V2h3M9 2h3v3M12 9v3H9M5 12H2V9" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("ALL TEMPLATES");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Sync with Backend
  useEffect(() => {
    api.get("/api/v1/users/me").then((res) => {
      setSelectedTemplate(res.data.selected_template || "minimal-swiss");
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleSelect = async (id: string) => {
    try {
      await api.patch("/api/v1/users/me", { selected_template: id });
      setSelectedTemplate(id);
    } catch (err) {
      console.error("Failed to update template", err);
    }
  };

  const handleMockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
      }, 2000);
    }, 1500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      handleMockUpload();
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      handleMockUpload();
    }
  };

  const filtered = TEMPLATE_META.filter((t) => {
    if (activeCategory === "ALL TEMPLATES") return true;
    if (activeCategory === "MODERN") return t.id === "modern-minimal" || t.id === "modern-bold";
    return t.category.toUpperCase() === activeCategory;
  });

  const selectedMeta = TEMPLATE_META.find((t) => t.id === selectedTemplate);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: "80vh", background: "#F3F4F6", padding: "32px 24px", borderRadius: "24px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 21, fontWeight: 700, color: "#111827" }}>Templates</h1>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#6B7280" }}>
                ensure consistency with your professional identity.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {selectedTemplate && (
                <button
                  onClick={() => router.push("/invoices/new")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 18px", fontSize: 13, fontWeight: 700,
                    borderRadius: 8, border: "none",
                    background: "#2563EB", color: "#fff", cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  Generate Invoice →
                </button>
              )}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", fontSize: 13, fontWeight: 600,
                  borderRadius: 8, border: "1.5px solid #D1D5DB",
                  background: "#fff", color: "#374151", cursor: "pointer",
                }}
              >
                <Upload width={13} height={13} strokeWidth={2.5} />
                Upload custom
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 3, marginBottom: 24, background: "#E5E7EB", borderRadius: 9, padding: 3, width: "fit-content" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "6px 14px", fontSize: 11.5,
                  fontWeight: activeCategory === cat ? 600 : 500,
                  borderRadius: 7, border: "none", cursor: "pointer",
                  background: activeCategory === cat ? "#fff" : "transparent",
                  color: activeCategory === cat ? "#111827" : "#6B7280",
                  boxShadow: activeCategory === cat ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
                  transition: "all 0.12s",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(284px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                isSelected={selectedTemplate === t.id}
                onSelect={handleSelect}
                onGenerate={() => router.push("/invoices/new")}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          {selectedMeta && (
            <div
              style={{
                marginTop: 28, padding: "16px 20px", background: "#fff",
                borderRadius: 10, border: "1.5px solid #DBEAFE",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 12,
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1E3A8A" }}>
                  {selectedMeta.name} selected
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6B7280" }}>
                  Your invoices will use this template design.
                </p>
              </div>
              <button
                onClick={() => router.push("/invoices/new")}
                style={{
                  padding: "9px 22px", fontSize: 13, fontWeight: 600,
                  borderRadius: 8, border: "none", background: "#2563EB",
                  color: "#fff", cursor: "pointer",
                }}
              >
                Generate Invoice →
              </button>
            </div>
          )}

          {/* Upload Modal */}
          {isUploadModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
                onClick={() => !isUploading && setIsUploadModalOpen(false)}
              ></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-500">
                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Upload Custom Template</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Import your own design schema.</p>
                  </div>
                  <button onClick={() => setIsUploadModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="p-10">
                  {uploadSuccess ? (
                    <div className="py-12 text-center animate-in zoom-in duration-300">
                      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Upload Successful!</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">Your template is being processed and will appear soon.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div 
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer group overflow-hidden
                          ${isDragging ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10'}
                          ${isUploading ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : ''}
                        `}
                      >
                        {/* Invisible Drag Target Overlay */}
                        <div 
                          className="absolute inset-0 z-30"
                          style={{ display: isDragging ? 'block' : 'none' }}
                        />

                        <input 
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          accept=".json,.html"
                          onChange={handleFileSelect}
                        />
                        
                        {isDragging && (
                          <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center border-2 border-blue-600 border-dashed animate-in fade-in zoom-in duration-200 z-40 pointer-events-none">
                            <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-blue-100 dark:border-blue-900/50 transform -translate-y-2">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center animate-bounce">
                                <Plus className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-black text-blue-600 uppercase tracking-widest text-xs">Drop to Upload</span>
                            </div>
                          </div>
                        )}

                        {isUploading ? (
                          <div className="space-y-4 animate-in fade-in duration-500">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <div>
                              <p className="text-blue-600 font-black text-sm uppercase tracking-widest">Uploading Schema...</p>
                              {selectedFile && (
                                <p className="text-xs text-slate-400 font-bold mt-1 truncate max-w-[200px] mx-auto">
                                  {selectedFile.name}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                              <FileJson className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Click to select or drag & drop</h3>
                            <p className="text-sm text-slate-400 font-medium">Support for .JSON and .HTML template formats</p>
                          </>
                        )}
                      </div>


                      <div className="flex gap-4">
                        <button 
                          onClick={() => setIsUploadModalOpen(false)}
                          className="flex-1 h-14 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="flex-1 h-14 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                        >
                          {isUploading ? "Uploading..." : (
                            <>
                              <Upload className="w-5 h-5" />
                              Browse Files
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
