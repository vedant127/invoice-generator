import { InvoiceData } from "@/lib/types";
import { calcTotals, fmt } from "@/lib/calc";
import React from "react";

export default function CorporateTemplate({ data }: { data: InvoiceData }) {
  const { subtotal, taxAmount, discountAmount, total } = calcTotals(data);

  return (
    <div
      style={{
        background: "#0f1923",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 11,
        color: "#e8e4dc",
        minHeight: "100%",
      }}
    >
      {/* Top bar */}
      <div style={{ background: "#1a2635", padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "0.12em", color: "#fff" }}>
            {data.company.toUpperCase()}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2, letterSpacing: "0.06em" }}>
            {data.address.toUpperCase()}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "0.08em", color: "#c8a96e" }}>
            INVOICE
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
            #{data.invoiceNo}
          </div>
        </div>
      </div>

      <div style={{ padding: "36px 48px" }}>
        {/* Meta */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36, background: "rgba(255,255,255,0.04)", borderRadius: 4, padding: "16px 20px" }}>
          <div>
            <div style={{ fontSize: 9, color: "#c8a96e", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 4 }}>INVOICE DATE</div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{data.date}</div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 9, color: "#c8a96e", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 4 }}>DUE DATE</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{data.dueDate}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#c8a96e", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 4 }}>BILLED TO</div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>{data.client.toUpperCase()}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{data.clientEmail}</div>
          </div>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 100px", gap: 8, borderBottom: "1px solid #c8a96e", paddingBottom: 8, marginBottom: 0 }}>
          {["ITEM", "RATE", "QTY", "TOTAL"].map((h, i) => (
            <div key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#c8a96e", textAlign: i > 0 ? "right" : "left" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {data.items.map((item, idx) => (
          <div
            key={item.id}
            style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 100px", gap: 8, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
          >
            <div style={{ fontSize: 11 }}>{item.desc}</div>
            <div style={{ fontSize: 11, textAlign: "right", color: "rgba(255,255,255,0.7)" }}>
              {data.currency}{item.rate.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, textAlign: "right", color: "rgba(255,255,255,0.7)" }}>{item.qty}</div>
            <div style={{ fontSize: 11, textAlign: "right", fontWeight: 700, color: "#fff" }}>
              {fmt(item.rate * item.qty, data.currency)}
            </div>
          </div>
        ))}

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", margin: "24px 0 40px" }}>
          <div style={{ width: 260 }}>
            {[
              [`SUBTOTAL`, fmt(subtotal, data.currency)],
              [`TAX (${data.taxRate}%)`, fmt(taxAmount, data.currency)],
              ...(data.discountRate > 0 ? [[`DISCOUNT (${data.discountRate}%)`, `-${fmt(discountAmount, data.currency)}`]] : []),
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "#c8a96e", marginTop: 8, borderRadius: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#0f1923", letterSpacing: "0.06em" }}>TOTAL</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#0f1923" }}>{fmt(total, data.currency)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontSize: 9, color: "#c8a96e", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>PAYMENT DETAILS</div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", rowGap: 4 }}>
              {[["BANK", data.bank], ["ACCOUNT", data.account], ["SWIFT", data.swift], ["TAX ID", data.taxId]].map(([l, v]) => (
                <React.Fragment key={l}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>{l}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)" }}>{v}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#c8a96e", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>NOTES</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{data.notes}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
