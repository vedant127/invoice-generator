# 📄 PRD — Invoice Generator (Frontend)

> **Project:** Invoice Generator  
> **Type:** Frontend Only  
> **Framework:** Next.js 14+ (App Router)  
> **Version:** v1.0.0  
> **Status:** In Progress  
> **Backend API:** Connects to FastAPI backend (see `PRD.md`)

---

## 1. Project Overview

**Invoice Generator Frontend** is a clean, modern web application built with **Next.js 14 (App Router)**. It consumes the FastAPI backend REST API to provide businesses and freelancers with a complete invoicing experience — from landing page to dashboard, invoice management, client management, and settings.

The UI is designed with a **light color scheme**, clean typography, and a professional look inspired by the provided design references.

---

## 2. Design Principles

- **Light & Clean** — white/light gray backgrounds, minimal shadows, no clutter
- **Consistent Color Palette** — blue as primary accent (`#2563eb`), neutral grays for text and borders
- **Typography** — `Inter` or `Geist` (Next.js default), readable font sizes
- **Component-first** — reusable components for cards, badges, tables, forms
- **Mobile Responsive** — all pages work on mobile, tablet, and desktop
- **Fast** — Next.js App Router with server components where possible

---

## 3. Color Palette

| Token | Value | Usage |
|---|---|---|
| `primary` | `#2563eb` | Buttons, links, active states, badges |
| `primary-hover` | `#1d4ed8` | Button hover state |
| `background` | `#f9fafb` | Page background |
| `surface` | `#ffffff` | Cards, modals, panels |
| `border` | `#e5e7eb` | Card borders, dividers, inputs |
| `text-primary` | `#111827` | Headings, important text |
| `text-secondary` | `#6b7280` | Subtitles, labels, metadata |
| `text-muted` | `#9ca3af` | Placeholders, disabled states |
| `success` | `#16a34a` | Paid status badge |
| `success-bg` | `#dcfce7` | Paid badge background |
| `warning` | `#d97706` | Pending/Sent status badge |
| `warning-bg` | `#fef3c7` | Pending badge background |
| `danger` | `#dc2626` | Overdue status, errors |
| `danger-bg` | `#fee2e2` | Overdue badge background |
| `draft` | `#6b7280` | Draft status badge |
| `draft-bg` | `#f3f4f6` | Draft badge background |

---

## 4. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | File-based routing, SSR, SSG |
| Language | TypeScript | Type safety across the app |
| Styling | Tailwind CSS v3 | Utility-first styling |
| UI Components | shadcn/ui | Accessible, unstyled base components |
| Icons | Lucide React | Clean, consistent icon set |
| Forms | React Hook Form + Zod | Form state and schema validation |
| API Client | Axios + React Query (TanStack) | API calls, caching, loading states |
| Auth | NextAuth.js v5 (Auth.js) | JWT session management |
| PDF Preview | react-pdf or iframe embed | Render invoice PDF preview |
| Date Handling | date-fns | Date formatting and calculations |
| Notifications | react-hot-toast | Toast messages for actions |
| State | Zustand | Lightweight global state (user, sidebar) |
| Linting | ESLint + Prettier | Code quality |

---

## 5. Project Folder Structure

```
invoice-generator-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   └── register/
│   │       └── page.tsx             # Register page
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Dashboard shell (sidebar + header)
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Dashboard / Overview page
│   │   ├── invoices/
│   │   │   ├── page.tsx             # Invoice list page
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Create invoice page
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Invoice detail / edit page
│   │   │       └── preview/
│   │   │           └── page.tsx     # Invoice PDF preview page
│   │   ├── clients/
│   │   │   ├── page.tsx             # Client list page
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Create client page
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Client detail page
│   │   ├── payments/
│   │   │   └── page.tsx             # Payments page
│   │   └── settings/
│   │       └── page.tsx             # Settings page
│   ├── (landing)/
│   │   └── page.tsx                 # Landing page (public)
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── components/
│   ├── ui/                          # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── table.tsx
│   │   └── toast.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx              # App sidebar navigation
│   │   ├── TopBar.tsx               # Top header bar
│   │   └── PageHeader.tsx           # Page title + action button
│   ├── invoices/
│   │   ├── InvoiceList.tsx          # Invoice list with filters
│   │   ├── InvoiceCard.tsx          # Single invoice row card
│   │   ├── InvoiceForm.tsx          # Create / Edit invoice form
│   │   ├── InvoicePreview.tsx       # Live PDF preview panel
│   │   ├── LineItemsTable.tsx       # Draggable line items table
│   │   ├── InvoiceStatusBadge.tsx   # Status chip (paid/draft/etc)
│   │   └── InvoiceSummary.tsx       # Subtotal / tax / total panel
│   ├── clients/
│   │   ├── ClientGrid.tsx           # Client card grid
│   │   ├── ClientCard.tsx           # Single client card
│   │   └── ClientForm.tsx           # Create / edit client form
│   ├── dashboard/
│   │   ├── StatsCards.tsx           # Revenue / invoice stat cards
│   │   ├── RecentInvoices.tsx       # Recent invoices table
│   │   └── RevenueChart.tsx         # Monthly revenue bar chart
│   └── shared/
│       ├── StatusBadge.tsx          # Reusable status badge
│       ├── EmptyState.tsx           # Empty state illustration
│       ├── LoadingSpinner.tsx       # Loading indicator
│       ├── ConfirmDialog.tsx        # Delete/confirm modal
│       └── SearchInput.tsx          # Search with icon
├── lib/
│   ├── api.ts                       # Axios instance + interceptors
│   ├── auth.ts                      # NextAuth config
│   └── utils.ts                     # cn(), formatCurrency(), formatDate()
├── hooks/
│   ├── useInvoices.ts               # React Query hooks for invoices
│   ├── useClients.ts                # React Query hooks for clients
│   └── useAuth.ts                   # Auth session hook
├── types/
│   ├── invoice.ts                   # Invoice TypeScript types
│   ├── client.ts                    # Client TypeScript types
│   └── user.ts                      # User TypeScript types
├── store/
│   └── useAppStore.ts               # Zustand global store
├── public/
│   └── logo.svg
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 6. Pages — Full Specification

---

### 6.1 Landing Page — `/`

**Reference:** https://stitch.withgoogle.com/preview/12491514747483603314?node-id=9cbfc047cf8b4b129a48d9255e4344db

**Layout:** Full-width public page, no sidebar

**Sections:**

#### Navbar
- Logo `InvoicePro` on the left (bold, blue)
- Nav links: Home, Features, Pricing (center or right)
- CTA Button: `Get Started` (blue, rounded) + User avatar (if logged in)
- Sticky top, white/blur background, subtle bottom border

#### Hero Section
- Large headline: **"Create Professional Invoices in Minutes"**
- Subtitle paragraph (gray text, max-width)
- Two CTA buttons: `Get Started Free` (filled blue) + `Watch Demo` (outlined with play icon)
- Dashboard preview screenshot/mockup below buttons (rounded card, soft shadow)
- Subtle background blob decoration

#### Stats Bar
- 3 stats: `50K+ Active Users` | `$2B+ Invoices Processed` | `99.9% Uptime SLA`
- Light gray background, top and bottom border
- Stat numbers in bold blue, labels in gray

#### Features Section (`#features`)
- Section title + subtitle centered
- Bento grid layout (3 columns on desktop):
  - Large card (2 cols): **Create & Send Instantly** — drag-and-drop editor description + UI mockup
  - Card: **Track Payments** — cash flow visibility, automated reminders
  - Card: **Flawless PDF Export** — pixel-perfect PDF generation
- Cards: white bg, border, rounded-xl, hover shadow effect

#### Pricing Section (`#pricing`)
- 2-column grid (Starter free vs Pro $15/month)
- Starter: white card, border, feature list with check icons
- Pro: blue border, `Most Popular` badge at top, filled blue button
- Clean feature list with green check_circle icons

#### Footer
- Copyright text left, nav links right (Privacy, Terms, Help Center)
- Light gray background, subtle top border

---

### 6.2 Auth Pages — `/login` and `/register`

**Layout:** Centered card on light gray background, no sidebar

#### Login Page `/login`
- Logo at top center
- Card with:
  - Title: **"Welcome back"**
  - Subtitle: "Sign in to your account"
  - Email input
  - Password input + show/hide toggle
  - `Sign In` button (full width, blue)
  - `Forgot password?` link (right-aligned)
  - Divider: "or"
  - Link: "Don't have an account? Register"
- Clean white card, rounded-xl, soft shadow

#### Register Page `/register`
- Same card layout
- Title: **"Create your account"**
- Full Name + Email + Password + Confirm Password inputs
- `Create Account` button (full width, blue)
- Link: "Already have an account? Sign in"
- Terms of Service checkbox

---

### 6.3 Dashboard — `/dashboard`

**Reference:** Image 1 (left sidebar + main content)

**Layout:** Fixed sidebar (left) + main content area (right)

#### Sidebar
- Logo at top left
- Search bar (with `⌘K` shortcut hint)
- Nav items with icons (Lucide icons):
  - Dashboard
  - Transactions / Invoices (active state = blue bg + bold)
  - Wallet / Payments
  - Clients
  - Reports
  - Settings (bottom)
- User profile at very bottom (avatar + name + settings icon)
- Width: `240px`, white background, right border

#### Top Bar
- Page title (e.g. "Dashboard")
- Right side: notification bell + user avatar

#### Stats Cards (4 cards in a row)
- **Total Revenue** — total all-time with trend indicator
- **Paid Invoices** — count + total amount
- **Pending Invoices** — count + total amount  
- **Overdue Invoices** — count + total amount (red accent)
- Each card: white bg, border, rounded-xl, icon + label + value + trend badge

#### Revenue Chart
- Bar chart showing monthly revenue (last 6 months)
- Clean, minimal — use Recharts or Chart.js
- Title: "Revenue Overview" + date range selector

#### Recent Invoices Table
- Columns: Invoice #, Client, Issue Date, Due Date, Amount, Status, Actions
- Status badge (color coded)
- Last 5 recent invoices
- "View All" link to `/invoices`

---

### 6.4 Invoice List Page — `/invoices`

**Reference:** Image 2 (invoice list with filter tabs)

**Layout:** Sidebar + main content

#### Page Header
- Title: **"Invoices"**
- Subtitle: "Manage and track your client billing."
- Right: `+ New Invoice` button (blue, rounded)

#### Filter Tabs
- Tab pills: `All` | `Draft` | `Sent` | `Paid` | `Overdue`
- Active tab: blue background + white text
- Inactive: gray text, no background

#### Search Bar
- Right-aligned search input: `Search client or number...`
- With search icon inside

#### Invoice List (Card rows)
Each row is a white card with:
- Left: Icon based on status + Invoice number (e.g. `INV-2024-001`) + **Status badge** (PAID / PENDING / OVERDUE / DRAFT)
- Middle: **Client name** (bold) + `Billed Oct 12 · Due Nov 11`
- Right: **Amount** (bold, large) + currency + chevron arrow `>`
- Overdue rows: left red border accent
- Hover: subtle gray background
- Click: navigates to invoice detail page

#### Empty State
- When no invoices match filter: illustration + "No invoices found" + "Create your first invoice" button

---

### 6.5 Create / Edit Invoice — `/invoices/new` and `/invoices/[id]`

**Reference:** Image 1 (split view — form left, preview right)

**Layout:** Two-panel split (form left 55% | preview right 45%)

#### Left Panel — Form

**Invoice Details Section**
- `Bill to` — Client dropdown (searchable, shows avatar + company name + email)
- `Address` — Auto-filled from client, editable text field
- `Invoice Number` — Auto-generated (e.g. `INV-2025-001`), editable
- `Currency` — Dropdown with flag icons (USD, INR, EUR, GBP)
- `Issued Date` — Date picker (calendar icon)
- `Due Date` — Date picker (calendar icon)

**Items Details Section**
- Table columns: `Item` | `QTY` | `Cost` | `Total`
- Each row: drag handle (⠿) + description input + qty number + cost number + total (auto) + delete icon (red)
- `+ Add item` button below table
- Line items are dynamic — add/remove rows

**Summary Section**
- Subtotal (auto-calculated)
- Tax % input → Tax amount (auto)
- Discount input → Discount amount (auto)
- **Total** (bold, large)

**Notes Section**
- Textarea: "Notes or payment instructions..."

**Action Buttons**
- `Save as Draft` (outlined) + `Send Invoice` (filled blue) at top right of form panel

#### Right Panel — Live Preview
- Shows a rendered preview of the invoice as it's being filled
- Updates in real-time as user types
- Toolbar: Expand (fullscreen), Download PDF icons
- Preview card styled like a real PDF invoice:
  - Invoice header with "Invoice" title + number
  - Billed by / Billed to columns
  - Date issued / Due date
  - Line items table
  - Subtotal / Tax / Discount / Total
  - Notes section
- `Hide Preview` / `Show Preview` toggle button

---

### 6.6 Client List Page — `/clients`

**Reference:** Image 3 (client card grid)

**Layout:** Sidebar + main content

#### Page Header
- Title: **"Clients"**
- Subtitle: "Manage your customer database"
- Floating `+` FAB button (bottom-right) or `+ New Client` in header

#### Search Bar
- Full-width: `Search clients, companies, or emails...`
- With search icon

#### Client Cards Grid
- 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Each card is a white rounded-xl card with:
  - **Avatar** — colored square with first letter of company name (colored by initial, e.g. A=blue, G=orange, I=indigo)
  - **Company name** (bold) + contact person name (gray)
  - Three-dot `⋮` menu (top-right) — Edit / Delete options
  - Email with mail icon
  - Industry/category with building icon
  - Bottom section (border-top):
    - `TOTAL BILLED` label + amount (bold)
    - Invoice count badge (e.g. `12 Invoices`)

#### Empty State
- "No clients yet" illustration + "Add your first client" button

#### Create / Edit Client Modal (or drawer)
- Slide-in drawer or dialog:
  - Company Name
  - Contact Person Name
  - Email
  - Phone
  - Address, City, State, Country, Postal Code
  - Industry / Category
  - GSTIN (optional)
  - Notes
  - `Save Client` button

---

### 6.7 Settings Page — `/settings`

**Reference:** Image 4 (profile + business details + invoice defaults)

**Layout:** Sidebar + main content (single column, max-width centered)

#### Profile Section (Card)
- User avatar (round, colored initials fallback)
- Full name + email
- `Sign Out` button (outlined, right side)

#### Business Details Section (Card)
- Card title: `🏢 Business Details`
- **Business Logo** — dashed upload area with cloud-upload icon + "Tap to upload logo"
- **Business Name** — text input
- **Registered Address** — textarea (multi-line)

#### Invoice Defaults Section (Card)
- Card title: `📄 Invoice Defaults`
- **Currency** — dropdown (USD, INR, EUR, GBP, etc.)
- **Tax ID / VAT** — text input (optional)
- **Default Payment Terms** — textarea (e.g. "Net 30. Please make payment within 30 days of receipt.")

#### Notification Preferences Section (Card)
- Toggle switches:
  - Email when invoice is viewed
  - Email when invoice is paid
  - Reminder emails for overdue invoices

#### Save Button
- Full-width blue `💾 SAVE CHANGES` button at bottom of each card
- Shows success toast on save

---

## 7. Shared Components Specification

### 7.1 Sidebar Navigation

```
Items:
- Dashboard         (LayoutDashboard icon)
- Invoices          (FileText icon)
- Clients           (Users icon)
- Payments          (CreditCard icon)
- Reports           (BarChart2 icon)
- Settings          (Settings icon)  ← pushed to bottom

Active state:   blue-50 bg + blue-600 text + blue-600 icon
Inactive state: gray-600 text + gray-400 icon
Hover:          gray-100 bg
```

### 7.2 Status Badges

```
PAID     → bg-green-100   text-green-700   font-semibold
SENT     → bg-blue-100    text-blue-700    font-semibold
PENDING  → bg-yellow-100  text-yellow-700  font-semibold
OVERDUE  → bg-red-100     text-red-700     font-semibold
DRAFT    → bg-gray-100    text-gray-600    font-semibold
VIEWED   → bg-purple-100  text-purple-700  font-semibold
```

### 7.3 Page Header Pattern

```tsx
<PageHeader
  title="Invoices"
  subtitle="Manage and track your client billing."
  action={{ label: "+ New Invoice", href: "/invoices/new" }}
/>
```

### 7.4 Empty State Pattern

```tsx
<EmptyState
  icon={<FileText />}
  title="No invoices found"
  description="Create your first invoice to get started."
  action={{ label: "Create Invoice", href: "/invoices/new" }}
/>
```

---

## 8. API Integration

All API calls go to the FastAPI backend. Base URL from environment variable.

### 8.1 Axios Instance

```ts
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8000
});

// Attach JWT token from NextAuth session on every request
api.interceptors.request.use((config) => {
  const token = getToken(); // from NextAuth session
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### 8.2 React Query Hooks

```ts
// hooks/useInvoices.ts
export const useInvoices = (filters) =>
  useQuery(['invoices', filters], () => api.get('/api/v1/invoices', { params: filters }));

export const useCreateInvoice = () =>
  useMutation((data) => api.post('/api/v1/invoices', data), {
    onSuccess: () => queryClient.invalidateQueries(['invoices']),
  });

export const useDeleteInvoice = () =>
  useMutation((id) => api.delete(`/api/v1/invoices/${id}`), {
    onSuccess: () => queryClient.invalidateQueries(['invoices']),
  });
```

### 8.3 API Endpoints Used

| Page | Endpoints Called |
|---|---|
| Login | `POST /api/v1/auth/login` |
| Register | `POST /api/v1/auth/register` |
| Dashboard | `GET /api/v1/reports/summary`, `GET /api/v1/invoices?limit=5` |
| Invoice List | `GET /api/v1/invoices?status=&search=&page=` |
| Create Invoice | `POST /api/v1/invoices`, `GET /api/v1/clients` |
| Edit Invoice | `GET /api/v1/invoices/{id}`, `PUT /api/v1/invoices/{id}` |
| Invoice PDF | `GET /api/v1/invoices/{id}/pdf` |
| Client List | `GET /api/v1/clients?search=` |
| Create Client | `POST /api/v1/clients` |
| Edit Client | `PUT /api/v1/clients/{id}` |
| Delete Client | `DELETE /api/v1/clients/{id}` |
| Settings | `GET /api/v1/users/me`, `PUT /api/v1/users/me` |

---

## 9. TypeScript Types

```ts
// types/invoice.ts
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client: Client;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  items: InvoiceItem[];
  notes?: string;
  pdf_url?: string;
  created_at: string;
}

// types/client.ts
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  gstin?: string;
  total_billed?: number;
  invoice_count?: number;
}

// types/user.ts
export interface User {
  id: string;
  email: string;
  full_name: string;
  business_name?: string;
  is_verified: boolean;
}
```

---

## 10. Environment Variables

```env
# .env.local

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# App
NEXT_PUBLIC_APP_NAME=Invoice Generator
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 11. Non-Functional Requirements

| Category | Target | Notes |
|---|---|---|
| Performance | LCP < 2.5s | Next.js SSR + React Query caching |
| Responsiveness | Mobile + Tablet + Desktop | Tailwind breakpoints: sm, md, lg, xl |
| Accessibility | WCAG 2.1 AA | shadcn/ui components are accessible by default |
| Bundle Size | < 200KB initial JS | Code-split by route (Next.js default) |
| SEO | Meta tags on landing page | next/head or metadata API |
| Auth | JWT sessions via NextAuth | Redirect unauthenticated users to /login |
| Error Handling | All API errors show toast | React Query onError + react-hot-toast |
| Loading States | Skeleton loaders on all lists | Use shadcn Skeleton component |
| Form Validation | Real-time via Zod + RHF | Errors shown inline under each field |

---

## 12. Routing & Auth Guards

```
Public routes (no auth required):
  /                    → Landing page
  /login               → Login
  /register            → Register

Protected routes (require JWT session):
  /dashboard           → Dashboard
  /invoices            → Invoice list
  /invoices/new        → Create invoice
  /invoices/[id]       → Invoice detail
  /clients             → Client list
  /settings            → Settings

Auth guard: middleware.ts
  - Check NextAuth session
  - Redirect to /login if unauthenticated
  - Redirect to /dashboard if already logged in and visiting /login
```

---

## 13. package.json Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "next-auth": "^5.0.0-beta",
    "axios": "^1.7.0",
    "@tanstack/react-query": "^5.40.0",
    "react-hook-form": "^7.52.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.6.0",
    "zustand": "^4.5.0",
    "lucide-react": "^0.390.0",
    "date-fns": "^3.6.0",
    "react-hot-toast": "^2.4.0",
    "recharts": "^2.12.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/node": "^20.14.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.3.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

---

## 14. Development Milestones

| Phase | Timeline | Deliverables |
|---|---|---|
| Phase 1 | Week 1 | Next.js setup, Tailwind config, shadcn/ui install, folder structure, layout shell |
| Phase 2 | Week 1–2 | Landing page (all sections), responsive, matches reference design |
| Phase 3 | Week 2 | Auth pages: Login + Register, NextAuth integration, middleware |
| Phase 4 | Week 2–3 | Dashboard: sidebar, stats cards, revenue chart, recent invoices table |
| Phase 5 | Week 3–4 | Invoice list page: filters, search, status badges, empty state |
| Phase 6 | Week 4–5 | Create/Edit invoice: split-panel form + live preview, line items |
| Phase 7 | Week 5–6 | Client list + cards + create/edit drawer |
| Phase 8 | Week 6 | Settings page: profile, business details, invoice defaults |
| Phase 9 | Week 7 | API integration: all pages wired to FastAPI backend |
| Phase 10 | Week 7–8 | Polish: loading skeletons, error handling, toasts, mobile responsive |

---

## 15. Future Roadmap (v2+)

| Feature | Description |
|---|---|
| Dark Mode | Toggle dark/light theme |
| Invoice Templates | Multiple PDF design templates |
| Dashboard Reports | Advanced revenue charts and analytics |
| Bulk Actions | Select + bulk delete/send invoices |
| Email Preview | Preview invoice email before sending |
| Client Portal | Public shareable link for client to view invoice |
| Mobile App | React Native app using same API |
| Notifications | In-app notification bell for payment alerts |

---

> **Invoice Generator Frontend — PRD v1.0.0**  
> Built with Next.js 14 + TypeScript + Tailwind CSS  
> Connects to: FastAPI Backend (`PRD.md`)  
> This document is the single source of truth for frontend development.
