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
  GoldifyAdapted,
  CorporateAdapted,
  MinimalAdapted,
  RetroAdapted,
} from "@/components/dashboard/TemplatePreview";

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
function TemplateCard({ template, isSelected, onSelect }) {
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
            onClick={(e) => { e.stopPropagation(); onSelect(template.id); }}
            style={{
              flex: 1, padding: "7px 0", fontSize: 11.5, fontWeight: 600,
              borderRadius: 7, border: "none", cursor: "pointer",
              background: isSelected ? "#2563EB" : "#EFF6FF",
              color: isSelected ? "#fff" : "#2563EB",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              letterSpacing: "0.04em",
            }}
          >
            {isSelected ? (
              <>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                SELECTED
              </>
            ) : (
              "SELECT TEMPLATE"
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
            <button
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", fontSize: 13, fontWeight: 600,
                borderRadius: 8, border: "1.5px solid #D1D5DB",
                background: "#fff", color: "#374151", cursor: "pointer",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Upload custom
            </button>
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

        </div>
      </div>
    </>
  );
}
