"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Plus, Trash2, Eye, EyeOff, Send, Save, ChevronLeft, Download, Maximize2 } from "lucide-react";
import Link from "next/link";

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadPDF = async () => {
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
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState([{ id: 1, description: "", quantity: 1, unit_price: 0 }]);
  const [taxPercentage, setTaxPercentage] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business. Please make payment within 7 days. Contact us with any questions regarding this invoice or payment details.");

  useEffect(() => {
    // Fetch clients
    api.get("/api/v1/clients").then(res => {
      setClients(res.data);
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
  const addItem = () => setItems([...items, { id: Date.now(), description: "", quantity: 1, unit_price: 0 }]);
  
  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };
  
  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const taxAmount = (subtotal * taxPercentage) / 100;
  const total = subtotal + taxAmount - discount;

  const handleSave = async (status: "DRAFT" | "SENT") => {
    try {
      if (!clientId) {
        alert("Please select a client.");
        return;
      }
      const payload = {
        client_id: clientId,
        status: status,
        issue_date: issueDate,
        due_date: dueDate,
        notes: notes,
        items: items.map(i => ({
          description: i.description,
          quantity: i.quantity,
          unit_price: i.unit_price
        }))
      };
      const res = await api.post("/api/v1/invoices/", payload);
      router.push(`/invoices/${res.data.id}?download=true`);
    } catch (err) {
      console.error(err);
      alert("Failed to save invoice.");
    }
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
                          onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-center focus:ring-brand focus:border-brand text-sm shadow-sm" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" min="0" step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, "unit_price", parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-brand focus:border-brand text-sm shadow-sm" 
                        />
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        ${(item.quantity * item.unit_price).toFixed(2)}
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
                  value={taxPercentage} onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm shadow-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Discount ($)</label>
                <input 
                  type="number" min="0"
                  value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
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
                <span className="text-slate-500">Tax ({taxPercentage}%)</span>
                <span className="font-bold text-slate-900">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Discount</span>
                <span className="font-bold text-slate-900">-${discount.toFixed(2)}</span>
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
                <h3 className="font-heading font-semibold text-slate-700">Live Preview</h3>
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
              <div data-purpose="invoice-paper" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 text-slate-900 min-h-[842px] flex flex-col font-sans">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h1 className="text-4xl font-heading font-bold tracking-tight mb-1 text-slate-900">Invoice</h1>
                    <p className="text-slate-400 text-xs">Invoice number: <span className="font-bold text-slate-700">#{invoiceNumber}</span></p>
                  </div>
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg font-heading">IP</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-10 mb-12">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3">Billed by</p>
                    <div className="text-sm">
                      <p className="font-bold mb-1 text-slate-800">InvoicePro</p>
                      <p className="text-slate-500 leading-relaxed">hello@invoicepro.com</p>
                      <p className="text-slate-500 leading-relaxed mb-4">123 Business Rd, Tech City,<br/>CA 94103</p>
                      
                      <p className="text-slate-500 text-xs">Date issued:</p>
                      <p className="font-bold text-slate-800">{new Date(issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3">Billed to</p>
                    <div className="text-sm">
                      <p className="font-bold mb-1 text-slate-800">{clientName || "Client Name"}</p>
                      {clientId ? (
                        <p className="text-slate-500 leading-relaxed whitespace-pre-line mb-4">{clientAddress || "Client Address"}</p>
                      ) : (
                        <p className="text-slate-500 leading-relaxed mb-4 italic">Select a client to see<br/>their address here.</p>
                      )}
                      
                      <p className="text-slate-500 text-xs">Due Date:</p>
                      <p className="font-bold text-slate-800">{new Date(dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                    </div>
                  </div>
                </div>
                
                <table className="w-full text-left text-sm mb-12">
                  <thead>
                    <tr className="border-b border-gray-100 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <th className="py-4">Items</th>
                      <th className="py-4 text-center">QTY</th>
                      <th className="py-4 text-center">Rate</th>
                      <th className="py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-5 font-bold text-slate-800">{item.description || "Item description"}</td>
                        <td className="py-5 text-center text-slate-600">{item.quantity}</td>
                        <td className="py-5 text-center text-slate-600">${item.unit_price.toFixed(2)}</td>
                        <td className="py-5 text-right font-bold text-slate-800">${(item.quantity * item.unit_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="flex justify-end mb-12">
                  <div className="w-full max-w-[200px] space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="font-bold text-slate-700">${subtotal.toFixed(2)}</span>
                    </div>
                    {taxPercentage > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Tax</span>
                        <span className="font-bold text-slate-700">{taxPercentage}% (${taxAmount.toFixed(2)})</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Discount</span>
                        <span className="font-bold text-slate-700">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-slate-400">Total</span>
                      <span className="text-2xl font-heading font-bold text-brand">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-10 border-t border-dashed border-gray-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notes:</p>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm whitespace-pre-line">{notes}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
