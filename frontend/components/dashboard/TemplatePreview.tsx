"use client";
import GoldifyTemplate from "@/components/templates/GoldifyTemplate";
import CorporateTemplate from "@/components/templates/CorporateTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import RetroTemplate from "@/components/templates/RetroTemplate";

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  notes: string;
}

const DEFAULT_DATA: InvoiceData = {
  invoiceNumber: "INV-2026-001",
  issueDate: "2026-05-04",
  dueDate: "2026-05-11",
  clientName: "Vedant Patel",
  clientAddress: "pune, Maharashtra",
  items: [
    { description: "Laptop requirement for the uben projects", quantity: 1, unit_price: 1200 },
    { description: "UI/UX Design Services", quantity: 2, unit_price: 500 },
  ],
  subtotal: 2200,
  taxPercentage: 10,
  taxAmount: 220,
  discount: 0,
  total: 2420,
  currency: "USD",
  notes: "Thank you for your business. Please make payment within 7 days. Contact us with any questions regarding this invoice or payment details.",
};

// ── Standard Professional (Original Inbuilt Look) ──

export function StandardPreview({ data = DEFAULT_DATA }: { data?: InvoiceData }) {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col font-sans text-slate-900 min-h-[1000px]">
      <header className="flex justify-between items-start mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">IP</span>
            </div>
            <span className="text-xl font-bold tracking-tight">InvoicePro</span>
          </div>
          <h2 className="text-4xl font-bold mb-1">Invoice</h2>
          <p className="text-slate-400 text-sm font-medium tracking-wide">#{data.invoiceNumber}</p>
        </div>
        <div className="text-right">
           <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-widest">
             Draft
           </span>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-12 mb-16">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Billed by:</h3>
            <div className="text-sm leading-relaxed">
              <p className="font-bold">InvoicePro</p>
              <p className="text-slate-500">hello@invoicepro.com</p>
              <p className="text-slate-500 mt-2">123 Business Rd, Tech City, CA 94103</p>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Billed to:</h3>
            <div className="text-sm leading-relaxed">
              <p className="font-bold">{data.clientName || "Client Name"}</p>
              <p className="text-slate-500 whitespace-pre-line mt-2">{data.clientAddress || "Client Address"}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 border-l border-slate-100 pl-12">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Issued Date</h3>
            <p className="text-sm font-bold">{data.issueDate}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Due Date</h3>
            <p className="text-sm font-bold">{data.dueDate}</p>
          </div>
        </div>
      </section>

      <section className="flex-grow mb-12">
        <table className="w-full text-left">
          <thead className="border-b-2 border-slate-900">
            <tr>
              <th className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Items</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Qty</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Rate</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, i) => (
              <tr key={i}>
                <td className="py-6 font-bold text-sm">{item.description}</td>
                <td className="py-6 text-sm text-center text-slate-500">{item.quantity}</td>
                <td className="py-6 text-sm text-right text-slate-500">${item.unit_price.toFixed(2)}</td>
                <td className="py-6 text-sm font-bold text-right">${(item.quantity * item.unit_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="pt-8 border-t border-slate-100 mt-auto">
        <div className="flex justify-between items-start gap-12">
          <div className="max-w-xs">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Notes</h3>
            <p className="text-xs leading-relaxed text-slate-500 whitespace-pre-line">{data.notes}</p>
          </div>
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-bold">${data.subtotal.toFixed(2)}</span>
            </div>
            {data.taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax ({data.taxPercentage}%)</span>
                <span className="font-bold">${data.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-5 border-t-2 border-slate-900 mt-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-blue-600">${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-6 border-t border-dashed border-slate-100 flex justify-between items-center text-[10px] text-slate-300 uppercase tracking-widest">
          <span>invoicepro.com</span>
          <span>© 2026 InvoicePro Inc.</span>
          <span>Internal Use Only</span>
        </div>
      </footer>
    </div>
  );
}

// ── Minimalist Clean (High Spacing, Modern Type) ──

export function ModernMinimalPreview({ data = DEFAULT_DATA }: { data?: InvoiceData }) {
  return (
    <div className="w-full h-full bg-[#f8fafc] p-0 font-sans text-slate-900 flex flex-col min-h-[1000px]">
      <div className="bg-white p-12 flex-1 shadow-sm">
        <div className="flex justify-between mb-20">
          <div className="w-16 h-1 bg-blue-600 mb-4" />
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Invoice</p>
            <p className="text-xl font-bold">#{data.invoiceNumber}</p>
          </div>
        </div>

        <div className="flex justify-between mb-24">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase mb-2">Sender</p>
              <p className="text-lg font-bold">InvoicePro Inc.</p>
              <p className="text-slate-500 text-sm">billing@invoicepro.com</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase mb-2">Recipient</p>
              <p className="text-lg font-bold">{data.clientName}</p>
              <p className="text-slate-500 text-sm whitespace-pre-line">{data.clientAddress}</p>
            </div>
          </div>
          <div className="text-right space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase">Issue Date</p>
              <p className="text-sm font-bold">{data.issueDate}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase">Due Date</p>
              <p className="text-sm font-bold">{data.dueDate}</p>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-300">Service Description</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-300 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-6">
                    <p className="font-bold text-sm mb-1">{item.description}</p>
                    <p className="text-xs text-slate-400">Quantity: {item.quantity}</p>
                  </td>
                  <td className="py-6 text-right font-bold text-sm">${(item.unit_price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end border-t border-slate-100 pt-10">
          <div className="w-full max-w-[240px] space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-bold">${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black pt-4 border-t-4 border-blue-600">
              <span>Total Due</span>
              <span className="text-blue-600">${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-12 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Thank you for your partnership</p>
      </div>
    </div>
  );
}

// ── Creative Edge (Dynamic Header, Modern Grid) ──

export function CreativeEdgePreview({ data = DEFAULT_DATA }: { data?: InvoiceData }) {
  return (
    <div className="w-full h-full bg-white p-0 font-sans text-slate-900 flex flex-col min-h-[1000px]">
      <div className="bg-slate-900 text-white p-12 flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter mb-4">INV.</h1>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Reference: {data.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 ml-auto">
            <span className="text-slate-900 font-black">IP</span>
          </div>
          <p className="font-bold">InvoicePro Studio</p>
        </div>
      </div>

      <div className="p-12 flex-1">
        <div className="grid grid-cols-3 gap-12 mb-20">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-300 mb-4 tracking-widest">Client</p>
            <p className="font-bold text-lg">{data.clientName}</p>
            <p className="text-slate-500 text-sm whitespace-pre-line mt-2">{data.clientAddress}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-300 mb-4 tracking-widest">Issued</p>
            <p className="font-bold text-sm">{data.issueDate}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-300 mb-4 tracking-widest">Total Amount</p>
            <p className="text-4xl font-black tracking-tighter">${data.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-y-2 border-slate-900 py-10 mb-10">
          <div className="grid grid-cols-12 gap-4 text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">
            <div className="col-span-8">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          <div className="space-y-6">
            {data.items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-8 font-bold text-sm">{item.description}</div>
                <div className="col-span-2 text-center text-sm font-bold text-slate-400">x{item.quantity}</div>
                <div className="col-span-2 text-right font-black text-sm">${(item.unit_price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="max-w-xs text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-widest">
            {data.notes}
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black uppercase text-slate-300 mb-1">Due By</p>
             <p className="font-bold text-lg">{data.dueDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Corporate Blueprint (Grid heavy, Precise) ──

export function CorporateBlueprintPreview({ data = DEFAULT_DATA }: { data?: InvoiceData }) {
  return (
    <div className="w-full h-full bg-white p-10 font-mono text-[10px] text-slate-900 flex flex-col border-[1px] border-slate-100 min-h-[1000px]">
      <div className="border-[1px] border-slate-900 p-8 flex-1 flex flex-col">
        <div className="flex justify-between border-b-[1px] border-slate-900 pb-8 mb-8">
          <div>
            <p className="text-2xl font-bold uppercase tracking-tighter">Official Invoice</p>
            <p className="mt-1">Generated by InvoicePro Enterprise</p>
          </div>
          <div className="text-right">
            <p className="font-bold">ID: {data.invoiceNumber}</p>
            <p>DATE: {data.issueDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0 border-b-[1px] border-slate-900 mb-8">
          <div className="border-r-[1px] border-slate-900 pb-8 pr-8">
            <p className="font-bold mb-4 bg-slate-900 text-white px-2 py-1 inline-block">FROM</p>
            <p className="font-bold">INVOICEPRO INC.</p>
            <p>123 CORPORATE BLVD</p>
            <p>SUITE 500, TECH CITY</p>
          </div>
          <div className="pb-8 pl-8">
            <p className="font-bold mb-4 bg-slate-900 text-white px-2 py-1 inline-block">TO</p>
            <p className="font-bold uppercase">{data.clientName}</p>
            <p className="whitespace-pre-line uppercase">{data.clientAddress}</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-12 gap-0 border-b-[1px] border-slate-900 font-bold bg-slate-50">
            <div className="col-span-1 border-r-[1px] border-slate-900 p-2 text-center">#</div>
            <div className="col-span-7 border-r-[1px] border-slate-900 p-2">DESCRIPTION</div>
            <div className="col-span-2 border-r-[1px] border-slate-900 p-2 text-right">RATE</div>
            <div className="col-span-2 p-2 text-right">TOTAL</div>
          </div>
          {data.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-0 border-b-[1px] border-slate-100">
              <div className="col-span-1 border-r-[1px] border-slate-900 p-3 text-center">{i + 1}</div>
              <div className="col-span-7 border-r-[1px] border-slate-900 p-3 uppercase font-bold">{item.description}</div>
              <div className="col-span-2 border-r-[1px] border-slate-900 p-3 text-right">${item.unit_price.toFixed(2)}</div>
              <div className="col-span-2 p-3 text-right font-bold">${(item.unit_price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-64 border-[1px] border-slate-900">
            <div className="flex justify-between p-2 border-b-[1px] border-slate-900">
              <span>SUBTOTAL</span>
              <span className="font-bold">${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 border-b-[1px] border-slate-900">
              <span>TAX ({data.taxPercentage}%)</span>
              <span className="font-bold">${data.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 text-white font-bold text-sm">
              <span>TOTAL</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 flex justify-between items-end border-t-[1px] border-slate-900">
          <div>
            <p className="font-bold mb-2">TERMS & NOTES</p>
            <p className="max-w-sm italic uppercase">{data.notes}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">AUTHORIZED SIGNATURE</p>
            <div className="w-48 h-12 border-b-[1px] border-slate-900 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Luxury Serif (Elegant, High-End) ──

export function ElegantSerifPreview({ data = DEFAULT_DATA }: { data?: InvoiceData }) {
  return (
    <div className="w-full h-full bg-white p-16 font-serif text-slate-800 flex flex-col min-h-[1000px]">
      <div className="flex flex-col items-center mb-20">
        <h1 className="text-4xl font-light tracking-[0.2em] uppercase mb-2">InvoicePro</h1>
        <p className="text-[10px] tracking-[0.5em] uppercase text-slate-400">Excellence in Documentation</p>
      </div>

      <div className="flex justify-between mb-24 border-y border-slate-100 py-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-4">To</p>
          <p className="text-xl italic">{data.clientName}</p>
          <p className="text-sm text-slate-500 mt-2 whitespace-pre-line">{data.clientAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-4">Details</p>
          <p className="text-sm">Invoice No. <span className="font-bold italic">{data.invoiceNumber}</span></p>
          <p className="text-sm">Dated <span className="font-bold italic">{data.issueDate}</span></p>
        </div>
      </div>

      <div className="flex-1">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-4 text-left font-light italic text-slate-400">Description</th>
              <th className="py-4 text-right font-light italic text-slate-400">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.items.map((item, i) => (
              <tr key={i}>
                <td className="py-8">
                  <p className="text-lg font-light">{item.description}</p>
                  <p className="text-xs italic text-slate-400">Service quantity: {item.quantity}</p>
                </td>
                <td className="py-8 text-right text-lg font-light">${(item.unit_price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-20 border-t border-slate-200 pt-10">
        <div className="flex justify-end mb-10">
          <div className="w-64 space-y-4">
            <div className="flex justify-between text-sm italic">
              <span>Subtotal</span>
              <span>${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-light pt-4 border-t border-slate-100">
              <span className="italic">Total</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center italic text-xs text-slate-300 tracking-widest uppercase">
          Finalized with distinction by InvoicePro
        </div>
      </div>
    </div>
  );
}

// ── Adapted High-Fidelity Templates (From Provided Files) ──

function adaptData(data: InvoiceData) {
  return {
    company: "InvoicePro", // Default or from data
    email: "hello@invoicepro.com",
    phone: "+1 555 000 0000",
    address: "123 Business Rd, Tech City, CA 94103",
    bank: "STRIPE BANK",
    account: "XXXX-XXXX-XXXX",
    swift: "STRIPEXX",
    taxId: "TAX-999",
    client: data.clientName,
    clientEmail: "client@example.com",
    invoiceNo: data.invoiceNumber,
    date: data.issueDate,
    dueDate: data.dueDate,
    currency: data.currency === "USD" ? "$" : data.currency === "INR" ? "₹" : data.currency,
    taxRate: data.taxPercentage,
    discountRate: (data.discount / (data.subtotal || 1)) * 100,
    notes: data.notes,
    items: data.items.map((item, idx) => ({
      id: String(idx),
      desc: item.description,
      rate: item.unit_price,
      qty: item.quantity,
    })),
  };
}

export function GoldifyAdapted({ data = DEFAULT_DATA }: { data?: InvoiceData }) {
  return <GoldifyTemplate data={adaptData(data) as any} />;
}

export function CorporateAdapted({ data = DEFAULT_DATA }: { data?: InvoiceData }) {
  return <CorporateTemplate data={adaptData(data) as any} />;
}

export function MinimalAdapted({ data = DEFAULT_DATA }: { data?: InvoiceData }) {
  return <MinimalTemplate data={adaptData(data) as any} />;
}

export function RetroAdapted({ data = DEFAULT_DATA }: { data?: InvoiceData }) {
  return <RetroTemplate data={adaptData(data) as any} />;
}
