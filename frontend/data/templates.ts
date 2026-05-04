export type FilterId = "all" | "minimal" | "corporate" | "creative" | "modern";

export interface TemplateBadge {
  label: string;
  bg: string;
  text: string;
}

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: Exclude<FilterId, "all">;
  badge?: TemplateBadge;
  tags: string[];
  accent: string; // hex
}

export const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all",       label: "All Templates" },
  { id: "minimal",   label: "Minimal" },
  { id: "corporate", label: "Corporate" },
  { id: "creative",  label: "Creative" },
  { id: "modern",    label: "Modern" },
];

export const TEMPLATES: TemplateData[] = [
  {
    id: "minimalist",
    name: "The Minimalist",
    description: "Clean, spacious layout focusing on clarity. Perfect for freelancers and consultants who value simplicity.",
    category: "minimal",
    badge: { label: "POPULAR", bg: "#f0fdf4", text: "#16a34a" },
    tags: ["Clean", "Freelance", "Simple"],
    accent: "#2563eb",
  },
  {
    id: "professional",
    name: "The Professional",
    description: "Standard corporate layout with structured sections and reliable data density for meticulous record-keeping.",
    category: "corporate",
    tags: ["Corporate", "Dense", "Formal"],
    accent: "#1e3a8a",
  },
  {
    id: "creative",
    name: "The Creative",
    description: "Dynamic layout for agencies and designers. Uses asymmetrical elements to stand out in the inbox.",
    category: "creative",
    badge: { label: "NEW", bg: "#fffbeb", text: "#d97706" },
    tags: ["Agency", "Bold", "Design"],
    accent: "#c2410c",
  },
  {
    id: "corporate",
    name: "The Corporate",
    description: "High-stakes identity design. Accommodates complex budgets and multiple service lines with ease.",
    category: "corporate",
    tags: ["Enterprise", "Premium", "Official"],
    accent: "#2563eb",
  },
  {
    id: "modern-bold",
    name: "Modern Bold",
    description: "A high-contrast layout with larger typography. Ideal for digital-first companies and modern brands.",
    category: "modern",
    badge: { label: "TRENDING", bg: "#f5f3ff", text: "#4f46e5" },
    tags: ["Modern", "Bold", "Digital"],
    accent: "#7c3aed",
  },
  {
    id: "elegant-stripe",
    name: "Elegant Stripe",
    description: "Timeless elegance with a gold accent. Refined for luxury services and consulting firms.",
    category: "minimal",
    tags: ["Luxury", "Gold", "Refined"],
    accent: "#d97706",
  },
];
