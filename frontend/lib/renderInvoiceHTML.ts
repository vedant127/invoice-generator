import { TemplateId, InvoiceData } from "./types";
import { calcTotals, fmt } from "./calc";

function goldifyHTML(data: InvoiceData): string {
  const { subtotal, taxAmount, discountAmount, total } = calcTotals(data);
  const rows = data.items.map((it) => `
    <div class="row">
      <div>${it.desc}</div>
      <div class="right">${data.currency}${it.rate.toLocaleString()}</div>
      <div class="right">${it.qty}</div>
      <div class="right bold">${fmt(it.rate * it.qty, data.currency)}</div>
    </div>`).join("");

  return `
  <div style="background:#E8E4DC;font-family:'Courier New',monospace;font-size:11px;color:#1a1a1a;padding:52px 48px;min-height:100vh">
    <div style="text-align:right;font-size:40px;font-weight:900;letter-spacing:.05em;margin-bottom:40px">INVOICE</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #1a1a1a;border-bottom:1px solid #1a1a1a;padding:10px 0;margin-bottom:48px">
      <div><div style="font-weight:700;font-size:10px">INVOICE NO. ${data.invoiceNo}</div><div style="font-size:10px;color:#555">${data.date}</div></div>
      <div style="text-align:right"><div style="font-weight:700;font-size:10px">BILLED TO ${data.client.toUpperCase()}</div><div style="font-size:10px;color:#555">${data.clientEmail.toUpperCase()}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 100px 80px 100px;gap:8px;border-bottom:1px solid #1a1a1a;padding-bottom:8px;margin-bottom:12px">
      <div style="font-weight:700;font-size:10px;letter-spacing:.08em">ITEM</div>
      <div style="font-weight:700;font-size:10px;text-align:right;letter-spacing:.08em">RATE</div>
      <div style="font-weight:700;font-size:10px;text-align:right;letter-spacing:.08em">QTY</div>
      <div style="font-weight:700;font-size:10px;text-align:right;letter-spacing:.08em">TOTAL</div>
    </div>
    ${data.items.map((it) => `
    <div style="display:grid;grid-template-columns:1fr 100px 80px 100px;gap:8px;padding:9px 0;border-bottom:1px solid rgba(0,0,0,.12)">
      <div>${it.desc}</div>
      <div style="text-align:right">${data.currency}${it.rate.toLocaleString()}</div>
      <div style="text-align:right">${it.qty}</div>
      <div style="text-align:right;font-weight:600">${fmt(it.rate * it.qty, data.currency)}</div>
    </div>`).join("")}
    <div style="display:flex;justify-content:flex-end;margin:24px 0 48px">
      <div style="width:260px">
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.12);font-size:11px"><span>SUBTOTAL</span><span>${fmt(subtotal, data.currency)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.12);font-size:11px"><span>TAX (${data.taxRate}%)</span><span>${fmt(taxAmount, data.currency)}</span></div>
        ${data.discountRate > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.12);font-size:11px"><span>DISCOUNT (${data.discountRate}%)</span><span>-${fmt(discountAmount, data.currency)}</span></div>` : ""}
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:2px solid #1a1a1a;margin-top:4px;font-size:13px;font-weight:800;letter-spacing:.06em"><span>TOTAL</span><span>${fmt(total, data.currency)}</span></div>
      </div>
    </div>
    <div style="border-top:1px solid #1a1a1a;padding-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
      <div>
        <div style="display:grid;grid-template-columns:80px 1fr;row-gap:3px;margin-bottom:20px;font-size:10px">
          <span style="color:#555;font-weight:700">BANK</span><span>${data.bank}</span>
          <span style="color:#555;font-weight:700">ACCOUNT</span><span>${data.account}</span>
          <span style="color:#555;font-weight:700">SWIFT</span><span>${data.swift}</span>
          <span style="color:#555;font-weight:700">TAX ID</span><span>${data.taxId}</span>
        </div>
        <div style="font-size:9px;color:#555;line-height:1.7;max-width:220px">${data.notes}</div>
      </div>
      <div style="text-align:right;display:flex;align-items:flex-end;justify-content:flex-end">
        <div style="font-size:10px;font-weight:700;letter-spacing:.04em">THANK YOU FOR YOUR BUSINESS!</div>
      </div>
    </div>
  </div>`;
}

export function renderInvoiceHTML(template: TemplateId, data: InvoiceData): string {
  const body = goldifyHTML(data); // Extend with other templates as needed
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Invoice #${data.invoiceNo}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{background:#ccc;padding:40px}</style>
</head>
<body>
  <div style="max-width:720px;margin:0 auto">
    ${body}
  </div>
</body>
</html>`;
}
