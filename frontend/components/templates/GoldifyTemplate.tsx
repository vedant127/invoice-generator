import { InvoiceData } from "@/lib/types";
import { calcTotals, fmt } from "@/lib/calc";
import React from "react";

export default function GoldifyTemplate({ data }: { data: InvoiceData }) {
  const { subtotal, taxAmount, discountAmount, total } = calcTotals(data);

  return (
    <div
      style={{
        background: "#E8E4DC",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 11,
        color: "#1a1a1a",
        padding: "52px 48px",
        minHeight: "100%",
        letterSpacing: "0.02em",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 40 }}>
        <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: "0.05em", fontFamily: "'Courier New', monospace" }}>
          INVOICE
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", padding: "10px 0", marginBottom: 48 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 2 }}>
            INVOICE NO. {data.invoiceNo}
          </div>
          <div style={{ fontSize: 10, color: "#555" }}>{data.date}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 2 }}>
            BILLED TO {data.client.toUpperCase()}
          </div>
          <div style={{ fontSize: 10, color: "#555" }}>{data.clientEmail.toUpperCase()}</div>
        </div>
      </div>

      {/* Line items table */}
      <div style={{ marginBottom: 32 }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 100px", gap: 8, borderBottom: "1px solid #1a1a1a", paddingBottom: 8, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: "0.08em" }}>ITEM</div>
          <div style={{ fontWeight: 700, fontSize: 10, textAlign: "right", letterSpacing: "0.08em" }}>RATE</div>
          <div style={{ fontWeight: 700, fontSize: 10, textAlign: "right", letterSpacing: "0.08em" }}>QTY</div>
          <div style={{ fontWeight: 700, fontSize: 10, textAlign: "right", letterSpacing: "0.08em" }}>TOTAL</div>
        </div>

        {/* Rows */}
        {data.items.map((item) => (
          <div
            key={item.id}
            style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 100px", gap: 8, padding: "9px 0", borderBottom: "1px solid rgba(0,0,0,0.12)" }}
          >
            <div style={{ fontSize: 11 }}>{item.desc}</div>
            <div style={{ fontSize: 11, textAlign: "right" }}>
              {data.currency}{item.rate.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, textAlign: "right" }}>{item.qty}</div>
            <div style={{ fontSize: 11, textAlign: "right", fontWeight: 600 }}>
              {fmt(item.rate * item.qty, data.currency)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 48 }}>
        <div style={{ width: 260 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
            <span style={{ fontSize: 11 }}>SUBTOTAL</span>
            <span style={{ fontSize: 11 }}>{fmt(subtotal, data.currency)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
            <span style={{ fontSize: 11 }}>TAX ({data.taxRate}%)</span>
            <span style={{ fontSize: 11 }}>{fmt(taxAmount, data.currency)}</span>
          </div>
          {data.discountRate > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
              <span style={{ fontSize: 11 }}>DISCOUNT ({data.discountRate}%)</span>
              <span style={{ fontSize: 11 }}>-{fmt(discountAmount, data.currency)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid #1a1a1a", marginTop: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.06em" }}>TOTAL</span>
            <span style={{ fontSize: 13, fontWeight: 800 }}>{fmt(total, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", rowGap: 3, marginBottom: 20 }}>
            {[
              ["BANK", data.bank],
              ["ACCOUNT", data.account],
              ["SWIFT", data.swift],
              ["TAX ID", data.taxId],
            ].map(([label, val]) => (
              <React.Fragment key={label}>
                <span style={{ fontSize: 10, color: "#555", fontWeight: 700 }}>{label}</span>
                <span style={{ fontSize: 10 }}>{val}</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontSize: 9, color: "#555", lineHeight: 1.7, maxWidth: 220 }}>
            {data.notes}
          </div>
        </div>
        <div style={{ textAlign: "right", display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em" }}>
            THANK YOU FOR YOUR BUSINESS!
          </div>
        </div>
      </div>
    </div>
  );
}
