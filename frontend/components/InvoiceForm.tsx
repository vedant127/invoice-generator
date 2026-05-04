"use client";

import { InvoiceData, LineItem } from "@/lib/types";

interface Props {
  data: InvoiceData;
  onChange: (d: InvoiceData) => void;
}

const inp =
  "w-full text-[11px] px-2 py-1.5 border border-gray-200 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">{label}</label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[9px] font-black tracking-[0.2em] text-gray-400 uppercase mb-3 border-b border-gray-100 pb-1.5">
        {title}
      </div>
      {children}
    </div>
  );
}

export default function InvoiceForm({ data, onChange }: Props) {
  const set = (k: keyof InvoiceData, v: string | number) => onChange({ ...data, [k]: v });

  const setItem = (id: string, k: keyof LineItem, v: string | number) =>
    onChange({ ...data, items: data.items.map((it) => (it.id === id ? { ...it, [k]: v } : it)) });

  const addItem = () =>
    onChange({
      ...data,
      items: [...data.items, { id: Date.now().toString(), desc: "NEW SERVICE", rate: 0, qty: 1 }],
    });

  const removeItem = (id: string) =>
    onChange({ ...data, items: data.items.filter((it) => it.id !== id) });

  return (
    <div className="overflow-y-auto flex-1 px-4 py-4">
      <Section title="Your Business">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Field label="Company"><input className={inp} value={data.company} onChange={(e) => set("company", e.target.value)} /></Field>
          <Field label="Email"><input className={inp} value={data.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Phone"><input className={inp} value={data.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Address"><input className={inp} value={data.address} onChange={(e) => set("address", e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Bank Details">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Bank Name"><input className={inp} value={data.bank} onChange={(e) => set("bank", e.target.value)} /></Field>
          <Field label="Account No."><input className={inp} value={data.account} onChange={(e) => set("account", e.target.value)} /></Field>
          <Field label="SWIFT"><input className={inp} value={data.swift} onChange={(e) => set("swift", e.target.value)} /></Field>
          <Field label="Tax ID"><input className={inp} value={data.taxId} onChange={(e) => set("taxId", e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Client">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Client Name"><input className={inp} value={data.client} onChange={(e) => set("client", e.target.value)} /></Field>
          <Field label="Client Email"><input className={inp} value={data.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Invoice Info">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Field label="Invoice No."><input className={inp} value={data.invoiceNo} onChange={(e) => set("invoiceNo", e.target.value)} /></Field>
          <Field label="Currency">
            <select className={inp} value={data.currency} onChange={(e) => set("currency", e.target.value)}>
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="₹">INR (₹)</option>
            </select>
          </Field>
          <Field label="Date"><input className={inp} value={data.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="Due Date"><input className={inp} value={data.dueDate} onChange={(e) => set("dueDate", e.target.value)} /></Field>
          <Field label="Tax (%)"><input type="number" className={inp} value={data.taxRate} onChange={(e) => set("taxRate", Number(e.target.value))} /></Field>
          <Field label="Discount (%)"><input type="number" className={inp} value={data.discountRate} onChange={(e) => set("discountRate", Number(e.target.value))} /></Field>
        </div>
      </Section>

      <Section title="Line Items">
        <div className="mb-2">
          <div className="grid gap-1 text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1" style={{ gridTemplateColumns: "1fr 70px 50px 30px" }}>
            <span>Description</span><span className="text-right">Rate</span><span className="text-right">Qty</span><span />
          </div>
          {data.items.map((item) => (
            <div key={item.id} className="grid gap-1 mb-1.5" style={{ gridTemplateColumns: "1fr 70px 50px 30px" }}>
              <input className={inp} value={item.desc} onChange={(e) => setItem(item.id, "desc", e.target.value)} />
              <input type="number" className={inp + " text-right"} value={item.rate} onChange={(e) => setItem(item.id, "rate", Number(e.target.value))} />
              <input type="number" className={inp + " text-center"} value={item.qty} onChange={(e) => setItem(item.id, "qty", Number(e.target.value))} />
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-gray-700 font-bold text-sm">×</button>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="w-full text-[10px] font-bold text-gray-400 border border-dashed border-gray-200 rounded py-2 hover:border-gray-400 hover:text-gray-600 transition-colors">
          + ADD ITEM
        </button>
      </Section>

      <Section title="Notes">
        <textarea
          className={inp + " resize-y min-h-[64px]"}
          value={data.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
        />
      </Section>
    </div>
  );
}
