export type TemplateId = "goldify" | "corporate" | "minimal" | "retro";

export interface LineItem {
  id: string;
  desc: string;
  rate: number;
  qty: number;
}

export interface InvoiceData {
  // Sender
  company: string;
  email: string;
  phone: string;
  address: string;
  // Bank
  bank: string;
  account: string;
  swift: string;
  taxId: string;
  // Client
  client: string;
  clientEmail: string;
  // Invoice meta
  invoiceNo: string;
  date: string;
  dueDate: string;
  // Financials
  currency: string;
  taxRate: number;
  discountRate: number;
  notes: string;
  // Items
  items: LineItem[];
}
