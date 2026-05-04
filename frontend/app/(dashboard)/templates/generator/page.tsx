"use client";

import { useState, useRef, useEffect } from "react";
import { TemplateId, InvoiceData } from "@/lib/types";
import { DEFAULT_DATA } from "@/lib/defaults";
import { renderInvoiceHTML } from "@/lib/renderInvoiceHTML";
import InvoiceForm from "@/components/InvoiceForm";
import TemplatePicker from "@/components/TemplatePicker";
import GoldifyTemplate from "@/components/templates/GoldifyTemplate";
import CorporateTemplate from "@/components/templates/CorporateTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import RetroTemplate from "@/components/templates/RetroTemplate";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type Tab = "edit" | "preview";

const TEMPLATE_COMPONENTS = {
  goldify: GoldifyTemplate,
  corporate: CorporateTemplate,
  minimal: MinimalTemplate,
  retro: RetroTemplate,
};

export default function TemplateGeneratorPage() {
  const router = useRouter();
  const [template, setTemplate] = useState<TemplateId>("goldify");
  const [data, setData] = useState<InvoiceData>(DEFAULT_DATA);
  const [tab, setTab] = useState<Tab>("preview");
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const TemplateComponent = TEMPLATE_COMPONENTS[template];

  // Integrate with Backend: Fetch User Profile for Business Details
  useEffect(() => {
    api.get("/api/v1/users/me").then((res) => {
      const user = res.data;
      setData((prev) => ({
        ...prev,
        company: user.business_name || user.full_name || prev.company,
        email: user.email || prev.email,
        // Add more mappings if user profile has more fields
      }));
    }).catch(err => console.error("Failed to fetch user profile", err));
  }, []);

  const handleDownload = () => {
    const html = renderInvoiceHTML(template, data);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${data.invoiceNo}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToBackend = async () => {
    setIsSaving(true);
    try {
      // Note: This requires a client to be selected. 
      // In a real integration, we'd add a ClientPicker to InvoiceForm.
      // For now, we'll try to find a default client or ask the user to select one.
      const clientsRes = await api.get("/api/v1/clients");
      const clients = clientsRes.data;
      
      if (clients.length === 0) {
        alert("Please create a client first in the Clients section.");
        setIsSaving(false);
        return;
      }

      const payload = {
        invoice_number: data.invoiceNo,
        client_id: clients[0].id, // Defaulting to first client for demo integration
        status: "DRAFT",
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        currency: data.currency,
        notes: data.notes,
        tax_rate: data.taxRate,
        items: data.items.map(item => ({
          description: item.desc,
          quantity: item.qty,
          unit_price: item.rate
        }))
      };

      const res = await api.post("/api/v1/invoices/", payload);
      alert("Invoice saved successfully!");
      router.push(`/invoices`);
    } catch (err) {
      console.error("Failed to save invoice", err);
      alert("Failed to save invoice to database.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabCls = (t: Tab) =>
    `px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase border-b-2 transition-colors cursor-pointer ${
      tab === t
        ? "border-gray-900 text-gray-900"
        : "border-transparent text-gray-400 hover:text-gray-600"
    }`;

  return (
    <div className="h-[calc(100vh-120px)] flex overflow-hidden bg-gray-50 rounded-3xl border border-gray-200 shadow-sm">
      {/* ── Left sidebar: Template picker ── */}
      <aside className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-3 py-3 border-b border-gray-100">
          <p className="text-[9px] font-black tracking-[0.2em] text-gray-400 uppercase">Templates</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <TemplatePicker selected={template} onSelect={setTemplate} />
        </div>
      </aside>

      {/* ── Right panel: Tabs ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 flex items-center justify-between px-5 py-0 h-14">
          <div className="flex">
            <button className={tabCls("edit")} onClick={() => setTab("edit")}>Edit</button>
            <button className={tabCls("preview")} onClick={() => setTab("preview")}>Preview</button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveToBackend}
              disabled={isSaving}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save to DB"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gray-900 text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download HTML
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {tab === "edit" ? (
            <div className="h-full flex flex-col">
              <InvoiceForm data={data} onChange={setData} />
            </div>
          ) : (
            /* Preview panel */
            <div className="h-full overflow-y-auto bg-gray-200 p-8">
              <div
                ref={previewRef}
                className="max-w-[720px] mx-auto shadow-2xl overflow-hidden"
                style={{ minHeight: 900 }}
              >
                <TemplateComponent data={data} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
