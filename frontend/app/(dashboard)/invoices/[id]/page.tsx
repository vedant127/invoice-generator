"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Printer, Download, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function InvoiceViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await api.get(`/api/v1/invoices/${params.id}`);
        setInvoice(invRes.data);
        
        if (invRes.data.client_id) {
          const cliRes = await api.get(`/api/v1/clients/${invRes.data.client_id}`);
          setClient(cliRes.data);
        }

        try {
          const userRes = await api.get('/api/v1/users/me');
          setUser(userRes.data);
        } catch (e) {
          console.error("Could not fetch user", e);
        }

      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleDownload = async () => {
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
        const element = document.querySelector('[data-purpose="invoice-document"]') as HTMLElement;
        if (!element) return;

        const canvas = await h2c(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdfLib.jsPDF('p', 'mm', 'a4');
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${invoice.invoice_number}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        setIsDownloading(false);
      }
    };

    tryGenerate();
  };

  useEffect(() => {
    if (!loading && invoice && searchParams.get('download') === 'true') {
      // Small delay to ensure rendering is complete
      setTimeout(() => {
        handleDownload();
        // Clear the param after download starts
        const newPath = window.location.pathname;
        window.history.replaceState({}, '', newPath);
      }, 1000);
    }
  }, [loading, invoice, searchParams]);

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
    </div>;
  }

  if (!invoice) {
    return <div className="p-8 text-center text-gray-500">Invoice not found or you don't have permission to view it.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen text-slate-800 font-sans -m-6 pb-20">
      {/* Top Action Bar */}
      <nav className="no-print sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm" data-purpose="actions-header">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/invoices')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900" title="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold">Invoice {invoice.invoice_number}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm" data-purpose="print-button">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm disabled:opacity-50" 
            data-purpose="download-button"
          >
            <Download className="w-4 h-4" /> {isDownloading ? "Generating..." : "Download PDF"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand text-white rounded-lg hover:bg-brand-light transition-colors shadow-sm" data-purpose="send-email-button">
            <Mail className="w-4 h-4" /> Send via Email
          </button>
        </div>
      </nav>

      {/* Invoice Preview Container */}
      <main className="max-w-5xl mx-auto py-12 px-6 flex justify-center" data-purpose="preview-area">
        {/* A4 Invoice Page */}
        <article className="invoice-page print-shadow-none bg-white w-full max-w-[210mm] min-h-[297mm] shadow-xl rounded-lg p-12 flex flex-col" data-purpose="invoice-document">
          {/* Invoice Header */}
          <header className="flex justify-between items-start mb-16">
            <div>
              {/* Company Logo Placeholder */}
              <div className="flex items-center gap-2 mb-6" data-purpose="brand-logo">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg font-heading">IP</span>
                </div>
                <span className="text-xl font-bold tracking-tight font-heading">InvoicePro</span>
              </div>
              <h2 className="text-3xl font-heading font-bold mb-1">Invoice</h2>
              <p className="text-gray-500 text-sm font-medium tracking-wide">#{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              {invoice.status === 'PAID' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Paid
                </span>
              ) : (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${
                  invoice.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                  invoice.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                  invoice.status === 'OVERDUE' ? 'bg-rose-100 text-rose-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {invoice.status || 'DRAFT'}
                </span>
              )}
            </div>
          </header>

          {/* Billing Info & Meta */}
          <section className="grid grid-cols-2 gap-12 mb-16" data-purpose="billing-and-meta">
            {/* Address Columns */}
            <div className="grid grid-cols-2 gap-8">
              <div data-purpose="billed-by">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Billed by:</h3>
                <div className="text-sm leading-relaxed text-gray-700">
                  <p className="font-bold text-slate-900">InvoicePro</p>
                  <p className="text-gray-500">{user?.email || "hello@invoicepro.com"}</p>
                  <p className="text-gray-500 mt-2">123 Business Rd, Tech City,</p>
                  <p className="text-gray-500">CA 94103</p>
                </div>
              </div>
              <div data-purpose="billed-to">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Billed to:</h3>
                <div className="text-sm leading-relaxed text-gray-700">
                  <p className="font-bold text-slate-900">{client?.name || "Client Name"}</p>
                  <p className="text-gray-500">{client?.email || "client@example.com"}</p>
                  <p className="text-gray-500 whitespace-pre-line mt-2">{client?.address || "Client Address"}</p>
                </div>
              </div>
            </div>
            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-8 border-l border-gray-200 pl-12">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Issued Date</h3>
                <p className="text-sm font-semibold text-slate-900">{new Date(invoice.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Due Date</h3>
                <p className="text-sm font-semibold text-slate-900">{new Date(invoice.due_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</p>
              </div>
            </div>
          </section>

          {/* Items Table */}
          <section className="flex-grow mb-12" data-purpose="line-items">
            <table className="w-full text-left">
              <thead className="border-b-2 border-slate-900">
                <tr>
                  <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Items</th>
                  <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Qty</th>
                  <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Rate</th>
                  <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.items && invoice.items.length > 0 ? invoice.items.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="py-5">
                      <div className="font-semibold text-sm text-slate-900">{item.description}</div>
                    </td>
                    <td className="py-5 text-sm text-center text-gray-600">{item.quantity}</td>
                    <td className="py-5 text-sm text-right text-gray-600">${item.unit_price.toFixed(2)}</td>
                    <td className="py-5 text-sm font-bold text-right text-slate-900">${item.amount.toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="py-6 text-center text-sm text-gray-500">No items found</td></tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Invoice Footer Summary */}
          <footer className="pt-8 border-t border-gray-200" data-purpose="invoice-footer">
            <div className="flex justify-between gap-12">
              {/* Notes section */}
              <div className="max-w-xs">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Notes</h3>
                <p className="text-xs leading-relaxed text-gray-500 whitespace-pre-line">
                  {invoice.notes || "Thank you for your business. Please make payment within 7 days. Contact us with any questions regarding this invoice or payment details."}
                </p>
              </div>
              {/* Totals section */}
              <div className="w-64">
                <div className="flex justify-between mb-3">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm font-semibold text-slate-900">${invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.tax_amount > 0 && (
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-500">Tax</span>
                    <span className="text-sm font-semibold text-slate-900">${invoice.tax_amount.toFixed(2)}</span>
                  </div>
                )}
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-500">Discount</span>
                    <span className="text-sm font-semibold text-slate-900">-${invoice.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-5 border-t-2 border-slate-900 mt-4">
                  <span className="text-lg font-heading font-bold text-slate-900">Total</span>
                  <span className="text-xl font-heading font-bold text-brand">${invoice.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            {/* Decorative bottom elements */}
            <div className="mt-20 pt-6 border-t border-dashed border-gray-200 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
              <span>invoicepro.com</span>
              <span>© {new Date().getFullYear()} InvoicePro Inc.</span>
              <span>Internal Use Only</span>
            </div>
          </footer>
        </article>
      </main>
      
      {/* CSS for print mode */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-shadow-none {
            box-shadow: none !important;
            border: none !important;
          }
          .invoice-page {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}} />
    </div>
  );
}
