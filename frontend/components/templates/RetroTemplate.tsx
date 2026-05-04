import { InvoiceData } from "@/lib/types";
import { calcTotals, fmt } from "@/lib/calc";
import React from "react";

export default function RetroTemplate({ data }: { data: InvoiceData }) {
  const { subtotal, taxAmount, discountAmount, total } = calcTotals(data);

  return (
    <div
      style={{
        background: "#f5f0e8",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 11,
        color: "#2c1810",
        minHeight: "100%",
      }}
    >
      {/* Terracotta top band */}
      <div style={{ background: "#c4432a", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#f5f0e8", letterSpacing: "0.08em", lineHeight: 1 }}>
            {data.company.toUpperCase()}
          </div>
          <div style={{ fontSize: 9, color: "rgba(245,240,232,0.6)", marginTop: 4, letterSpacing: "0.06em" }}>
            {data.email.toUpperCase()}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "rgba(245,240,232,0.6)", letterSpacing: "0.15em", marginBottom: 2 }}>N°</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#f5f0e8", letterSpacing: "0.02em", lineHeight: 1 }}>
            {data.invoiceNo.padStart(3, "0")}
          </div>
        </div>
      </div>

      {/* Thin divider */}
      <div style={{ height: 4, background: "#2c1810" }} />

      <div style={{ padding: "32px 48px" }}>
        {/* Meta */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 36, paddingBottom: 24, borderBottom: "2px solid #2c1810" }}>
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "#c4432a", marginBottom: 6 }}>INVOICE DATE</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{data.date}</div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "#c4432a", marginBottom: 6 }}>DUE DATE</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{data.dueDate}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "#c4432a", marginBottom: 6 }}>BILLED TO</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{data.client.toUpperCase()}</div>
            <div style={{ fontSize: 10, color: "#7a5a50", marginTop: 2 }}>{data.clientEmail}</div>
          </div>
        </div>

        {/* Table */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 60px 110px", background: "#2c1810", padding: "8px 0", marginBottom: 0 }}>
            {["ITEM", "RATE", "QTY", "TOTAL"].map((h, i) => (
              <div key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "#f5f0e8", textAlign: i > 0 ? "right" : "left", padding: "0 10px" }}>{h}</div>
            ))}
          </div>
          {data.items.map((item, idx) => (
            <div
              key={item.id}
              style={{ display: "grid", gridTemplateColumns: "1fr 100px 60px 110px", padding: "10px 0", borderBottom: "1px solid rgba(44,24,16,0.15)", background: idx % 2 === 0 ? "transparent" : "rgba(196,67,42,0.05)" }}
            >
              <div style={{ fontSize: 11, padding: "0 10px" }}>{item.desc}</div>
              <div style={{ fontSize: 11, textAlign: "right", padding: "0 10px", color: "#7a5a50" }}>{data.currency}{item.rate.toLocaleString()}</div>
              <div style={{ fontSize: 11, textAlign: "right", padding: "0 10px", color: "#7a5a50" }}>{item.qty}</div>
              <div style={{ fontSize: 11, textAlign: "right", padding: "0 10px", fontWeight: 700 }}>{fmt(item.rate * item.qty, data.currency)}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 40 }}>
          <div style={{ width: 260 }}>
            {[
              [`SUBTOTAL`, fmt(subtotal, data.currency)],
              [`TAX (${data.taxRate}%)`, fmt(taxAmount, data.currency)],
              ...(data.discountRate > 0 ? [[`DISCOUNT (${data.discountRate}%)`, `−${fmt(discountAmount, data.currency)}`]] : []),
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 10, color: "#7a5a50", borderBottom: "1px solid rgba(44,24,16,0.12)" }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#c4432a", marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#f5f0e8", letterSpacing: "0.06em" }}>TOTAL</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#f5f0e8" }}>{fmt(total, data.currency)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "2px solid #2c1810", paddingTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "#c4432a", marginBottom: 10 }}>PAYMENT DETAILS</div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", rowGap: 4 }}>
              {[["BANK", data.bank], ["ACCOUNT", data.account], ["SWIFT", data.swift], ["TAX ID", data.taxId]].map(([l, v]) => (
                <React.Fragment key={l}>
                  <span style={{ fontSize: 9, color: "#7a5a50", fontWeight: 700 }}>{l}</span>
                  <span style={{ fontSize: 9, color: "#2c1810" }}>{v}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "#c4432a", marginBottom: 10 }}>NOTES</div>
            <div style={{ fontSize: 9, color: "#7a5a50", lineHeight: 1.8 }}>{data.notes}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
