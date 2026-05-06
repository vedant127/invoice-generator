"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Plus, Trash2, Eye, EyeOff, Send, Save, ChevronLeft, Download, Maximize2 } from "lucide-react";
import Link from "next/link";
import { 
  StandardPreview, 
  ModernMinimalPreview, 
  CreativeEdgePreview, 
  CorporateBlueprintPreview, 
  ElegantSerifPreview,
  GoldifyAdapted,
  CorporateAdapted,
  MinimalAdapted,
  RetroAdapted
} from "@/components/dashboard/TemplatePreview";

const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  standard: StandardPreview,
  "modern-minimal": ModernMinimalPreview,
  "creative-edge": CreativeEdgePreview,
  "corporate-blueprint": CorporateBlueprintPreview,
  "elegant-serif": ElegantSerifPreview,
  "goldify": GoldifyAdapted,
  "corporate-gold": CorporateAdapted,
  "minimal-swiss": MinimalAdapted,
  "retro-terracotta": RetroAdapted,
};

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  
  const downloadPDF = async () => {
    // ... (rest of downloadPDF logic remains same)
    if (isDownloading) return;
    setIsDownloading(true);

    const tryGenerate = async (retries = 5) => {
      // @ts-ignore
      const h2c = window.html2canvas;
      // @ts-ignore
      const jspdfLib = window.jspdf;

      if (typeof h2c !== 'function' || !jspdfLib) {
        if (retries > 0) {
          console.log("Waiting for PDF libraries to load...");
          setTimeout(() => tryGenerate(retries - 1), 1000);
          return;
        }
        alert("PDF generation libraries failed to load correctly. Please refresh the page.");
        setIsDownloading(false);
        return;
      }

      try {
        const element = document.querySelector('[data-purpose="invoice-paper"]') as HTMLElement;
        if (!element) return;
        
        const canvas = await h2c(element, { 
          scale: 2, 
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdfLib.jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-preview-${invoiceNumber}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        setIsDownloading(false);
      }
    };

    tryGenerate();
  };
  
  // Form state
  const [clientId, setClientId] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState([{ id: 1, description: "", quantity: "1", unit_price: "0" }]);
  const [taxPercentage, setTaxPercentage] = useState("10");
  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState("Thank you for your business. Please make payment within 7 days. Contact us with any questions regarding this invoice or payment details.");

  // Generate invoice number only on the client to avoid SSR/hydration mismatch
  useEffect(() => {
    setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

  useEffect(() => {
    // Fetch clients and user preference
    api.get("/api/v1/clients").then(res => {
      setClients(res.data);
    }).catch(err => console.error(err));

    api.get("/api/v1/users/me").then(res => {
      if (res.data.selected_template) {
        setSelectedTemplate(res.data.selected_template);
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    // Update address/name when client changes
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setClientAddress(selectedClient.address || "No address provided");
      setClientName(selectedClient.name);
    } else {
      setClientAddress("");
      setClientName("");
    }
  }, [clientId, clients]);

  // Handlers
  const addItem = () => setItems([...items, { id: Date.now(), description: "", quantity: "1", unit_price: "0" }]);
  
  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };
  
  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Calculations
  const parsedTax = parseFloat(taxPercentage) || 0;
  const parsedDiscount = parseFloat(discount) || 0;
  
  const subtotal = items.reduce((acc, item) => acc + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)), 0);
  const taxAmount = (subtotal * parsedTax) / 100;
  const total = subtotal + taxAmount - parsedDiscount;

  const handleSave = async (status: "DRAFT" | "SENT") => {
    try {
      if (!clientId) {
        alert("Please select a client.");
        return;
      }
      
      // Persist the selected template so the invoice view page uses it
      try {
        await api.patch('/api/v1/users/me', { selected_template: selectedTemplate });
      } catch (templateErr) {
        console.error("Failed to persist template selection:", templateErr);
      }

      const payload = {
        client_id: clientId,
        status: status,
        issue_date: issueDate,
        due_date: dueDate,
        notes: notes,
        tax_rate: parsedTax,
        discount_value: parsedDiscount,
        discount_type: parsedDiscount > 0 ? "FLAT" : null,
        items: items.map(i => ({
          description: i.description,
          quantity: parseFloat(i.quantity) || 0,
          unit_price: parseFloat(i.unit_price) || 0
        }))
      };
      const res = await api.post("/api/v1/invoices/", payload);
      router.push(`/invoices/${res.data.id}?download=true`);
    } catch (err) {
      console.error(err);
      alert("Failed to save invoice.");
    }
  };

  const PreviewComponent = TEMPLATE_COMPONENTS[selectedTemplate] || StandardPreview;

  const invoiceData = {
    invoiceNumber,
    issueDate,
    dueDate,
    clientName,
    clientAddress,
    items: items.map(i => ({ ...i, quantity: parseFloat(i.quantity) || 0, unit_price: parseFloat(i.unit_price) || 0 })),
    subtotal,
    taxPercentage: parsedTax,
    taxAmount,
    discount: parsedDiscount,
    total,
    currency,
    notes
  };

  return (
    <div className="max-w-[1400px] mx-auto text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4" data-purpose="invoice-header">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900">New invoice</h1>
          <nav aria-label="Breadcrumb" className="flex mt-2 text-sm text-slate-400 items-center">
            <Link href="/invoices" className="hover:text-brand flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back to Invoices
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowPreview(!showPreview)} className="px-4 py-2 border border-gray-200 bg-white rounded-xl font-bold text-slate-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm text-sm">
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button onClick={() => handleSave("DRAFT")} className="px-4 py-2 border border-gray-200 bg-white rounded-xl font-bold text-slate-600 hover:bg-gray-50 transition-all shadow-sm text-sm">
            <Save className="w-4 h-4 inline mr-2" /> Save as Draft
          </button>
          <button onClick={() => handleSave("SENT")} className="px-4 py-2 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-all flex items-center gap-2 shadow-sm shadow-brand/20 text-sm">
            <Send className="w-4 h-4" /> Send Invoice
          </button>
        </div>
      </div>

      <div className={`grid ${showPreview ? 'grid-cols-12 gap-8' : 'grid-cols-1'} items-start`}>
        {/* Form Section */}
        <div className={`${showPreview ? 'col-span-12 lg:col-span-6 xl:col-span-7' : 'col-span-1'} space-y-8`} data-purpose="invoice-form">
          {/* Bill To Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-heading font-semibold border-b border-gray-200 pb-2">Invoice details</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Bill to</label>
                <select 
                  value={clientId} 
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 appearance-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm shadow-sm"
                >
                  <option value="" disabled>Select a client...</option>
                  {clients.length === 0 && (
                    <option value="" disabled>⚠️ No clients available. Please add a client first.</option>
                  )}
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Address</label>
                <textarea 
                  value={clientAddress}
                  readOnly
                  className="w-full border border-gray-200 rounded-xl py-3 px-4 bg-gray-50 text-slate-500 focus:outline-none text-sm shadow-sm" 
                  rows={2}
                  placeholder="Client address will appear here"
                />
              </div>
            </div>
          </section>

          {/* Specific Details */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Invoice Number</label>
              <input readOnly className="w-full border border-gray-200 rounded-xl py-3 px-4 bg-gray-50 text-slate-500 text-sm shadow-sm" type="text" value={invoiceNumber} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Currency</label>
              <div className="relative">
                <div 
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-10 cursor-pointer focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm shadow-sm relative flex items-center min-h-[46px]"
                >
                  <span className="block truncate">
                    {({USD: 'US Dollar (USD)', EUR: 'Euro (EUR)', GBP: 'British Pound (GBP)', INR: 'Indian Rupee (INR)', AUD: 'Australian Dollar (AUD)', CAD: 'Canadian Dollar (CAD)', SGD: 'Singapore Dollar (SGD)', JPY: 'Japanese Yen (JPY)', CHF: 'Swiss Franc (CHF)', CNY: 'Chinese Yuan (CNY)'} as Record<string, string>)[currency]}
                  </span>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-3.5 bg-gray-100 flex items-center justify-center overflow-hidden rounded-sm border border-gray-200 shadow-sm">
                    <img 
                      alt={currency} 
                      className="object-cover h-full w-full" 
                      src={`https://flagcdn.com/w20/${({USD:'us',EUR:'eu',GBP:'gb',INR:'in',AUD:'au',CAD:'ca',SGD:'sg',JPY:'jp',CHF:'ch',CNY:'cn'} as Record<string, string>)[currency] || 'us'}.png`} 
                    />
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {isCurrencyDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsCurrencyDropdownOpen(false)}></div>
                    <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-2 max-h-60 overflow-auto">
                      {[
                        { code: "USD", name: "US Dollar (USD)", flag: "us" },
                        { code: "EUR", name: "Euro (EUR)", flag: "eu" },
                        { code: "GBP", name: "British Pound (GBP)", flag: "gb" },
                        { code: "INR", name: "Indian Rupee (INR)", flag: "in" },
                        { code: "AUD", name: "Australian Dollar (AUD)", flag: "au" },
                        { code: "CAD", name: "Canadian Dollar (CAD)", flag: "ca" },
                        { code: "SGD", name: "Singapore Dollar (SGD)", flag: "sg" },
                        { code: "JPY", name: "Japanese Yen (JPY)", flag: "jp" },
                        { code: "CHF", name: "Swiss Franc (CHF)", flag: "ch" },
                        { code: "CNY", name: "Chinese Yuan (CNY)", flag: "cn" }
                      ].map((curr) => (
                        <div 
                          key={curr.code}
                          onClick={() => {
                            setCurrency(curr.code);
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer hover:bg-brand/5 transition-colors ${currency === curr.code ? 'bg-brand/10 text-brand font-semibold' : 'text-slate-700'}`}
                        >
                          <div className="w-5 h-3.5 bg-gray-100 flex items-center justify-center overflow-hidden rounded-sm border border-gray-200 shadow-sm shrink-0">
                            <img alt={curr.code} className="object-cover h-full w-full" src={`https://flagcdn.com/w20/${curr.flag}.png`} />
                          </div>
                          <span>{curr.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Issued Date</label>
              <input 
                type="date" 
                value={issueDate} onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Due Date</label>
              <input 
                type="date" 
                value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm shadow-sm" 
              />
            </div>
          </section>

          {/* Line Items Table */}
          <section className="space-y-4">
            <h2 className="text-lg font-heading font-semibold border-b border-gray-200 pb-2">Items details</h2>
            <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3 w-24 text-center">QTY</th>
                    <th className="px-4 py-3 w-32">Rate</th>
                    <th className="px-4 py-3 w-32">Total</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <input 
                          type="text" 
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-brand focus:border-brand text-sm shadow-sm" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-center focus:ring-brand focus:border-brand text-sm shadow-sm" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" min="0" step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-brand focus:border-brand text-sm shadow-sm" 
                        />
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        ${((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => removeItem(item.id)} className="text-rose-500 hover:text-rose-700 transition-colors bg-rose-50 p-2 rounded-md hover:bg-rose-100">
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addItem} className="flex items-center gap-2 text-brand font-bold text-sm hover:text-brand-light transition-colors">
              <Plus className="w-4 h-4" /> Add item
            </button>
          </section>

          {/* Totals & Notes */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tax percentage (%)</label>
                <input 
                  type="number" min="0" max="100"
                  value={taxPercentage} onChange={(e) => setTaxPercentage(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm shadow-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Discount ($)</label>
                <input 
                  type="number" min="0"
                  value={discount} onChange={(e) => setDiscount(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm shadow-sm" 
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl flex flex-col justify-center space-y-4 border border-gray-200 shadow-inner">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax ({parsedTax}%)</span>
                <span className="font-bold text-slate-900">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Discount</span>
                <span className="font-bold text-slate-900">-${parsedDiscount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-heading font-bold text-slate-900">Total</span>
                <span className="text-xl font-heading font-bold text-brand">${total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Notes Section */}
          <section className="pb-10">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Notes / Terms</label>
            <textarea 
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm text-slate-600 shadow-sm" 
              rows={4}
            />
          </section>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 relative" data-purpose="invoice-preview">
            <div className="lg:sticky lg:top-8 no-scrollbar max-h-[calc(100vh-6rem)] overflow-y-auto pb-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-heading font-semibold text-slate-700">Live Preview</h3>
                  <div className="relative">
                    <button 
                      onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                      className="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                      Template: {selectedTemplate}
                      <span className="material-symbols-outlined text-[12px]">expand_more</span>
                    </button>
                    {isTemplateDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsTemplateDropdownOpen(false)}></div>
                        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20">
                          {Object.keys(TEMPLATE_COMPONENTS).map((tpl) => (
                            <button
                              key={tpl}
                              onClick={() => {
                                setSelectedTemplate(tpl);
                                setIsTemplateDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest ${selectedTemplate === tpl ? 'text-brand' : 'text-slate-600'}`}
                            >
                              {tpl}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-slate-400 transition-colors" title="Expand">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={downloadPDF}
                    disabled={isDownloading}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-slate-400 transition-colors disabled:opacity-50" 
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Invoice Paper */}
              <div data-purpose="invoice-paper" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[842px]">
                <PreviewComponent data={invoiceData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
