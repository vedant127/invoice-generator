import { InvoiceData } from "./types";

export const DEFAULT_DATA: InvoiceData = {
  company: "GOLDIFY",
  email: "hi@goldify.com",
  phone: "+1 555 000 0000",
  address: "123 Main Street, New York, NY 10001",
  bank: "NCC BANK LIMITED",
  account: "0005-031066388",
  swift: "NCCLDDDH",
  taxId: "465456",
  client: "JOHN PAUL",
  clientEmail: "hi@goldify.com",
  invoiceNo: "123",
  date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }),
  dueDate: new Date(Date.now() + 14 * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }),
  currency: "$",
  taxRate: 5,
  discountRate: 10,
  notes: "PAYMENT IS DUE WITHIN 14 DAYS OF THE INVOICE DATE. ALL CHECKS PAYABLE TO GOLDIFY FOR PROCESSING.",
  items: [
    { id: "1", desc: "WIDGET DESIGN", rate: 100, qty: 10 },
    { id: "2", desc: "DASHBOARD DESIGN", rate: 200, qty: 5 },
    { id: "3", desc: "BRANDING", rate: 1150, qty: 1 },
    { id: "4", desc: "EMAIL MARKETING", rate: 300, qty: 3 },
  ],
};
