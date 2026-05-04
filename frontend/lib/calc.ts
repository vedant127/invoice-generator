import { InvoiceData } from "./types";

export function calcTotals(data: InvoiceData) {
  const subtotal = data.items.reduce((s, i) => s + i.rate * i.qty, 0);
  const taxAmount = subtotal * (data.taxRate / 100);
  const discountAmount = subtotal * (data.discountRate / 100);
  const total = subtotal + taxAmount - discountAmount;
  return { subtotal, taxAmount, discountAmount, total };
}

export function fmt(n: number, currency: string) {
  return (
    currency +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })
  );
}
