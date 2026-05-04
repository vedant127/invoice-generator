"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Printer, Download, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { 
  StandardPreview, 
  ModernMinimalPreview, 
  CreativeEdgePreview, 
  CorporateBlueprintPreview, 
  ElegantSerifPreview 
} from "@/components/dashboard/TemplatePreview";

const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  standard: StandardPreview,
  "modern-minimal": ModernMinimalPreview,
  "creative-edge": CreativeEdgePreview,
  "corporate-blueprint": CorporateBlueprintPreview,
  "elegant-serif": ElegantSerifPreview,
};

export default function InvoiceViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("standard");

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
          if (userRes.data.selected_template) {
            setSelectedTemplate(userRes.data.selected_template);
          }
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

  const PreviewComponent = TEMPLATE_COMPONENTS[selectedTemplate] || StandardPreview;

  const invoiceData = {
    invoiceNumber: invoice.invoice_number,
    issueDate: invoice.issue_date,
    dueDate: invoice.due_date,
    clientName: client?.name || "Client Name",
    clientAddress: client?.address || "Client Address",
    items: invoice.items.map((item: any) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price
    })),
    subtotal: invoice.subtotal,
    taxPercentage: 0, // Not directly in invoice model, but we have tax_amount
    taxAmount: invoice.tax_amount,
    discount: invoice.discount_amount,
    total: invoice.total_amount,
    currency: invoice.currency || "USD",
    notes: invoice.notes
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
        <article className="invoice-page print-shadow-none bg-white w-full max-w-[210mm] min-h-[297mm] shadow-xl rounded-lg overflow-hidden flex flex-col" data-purpose="invoice-document">
          <PreviewComponent data={invoiceData} />
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
