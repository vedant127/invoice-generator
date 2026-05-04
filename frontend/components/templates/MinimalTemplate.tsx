import { InvoiceData } from "@/lib/types";
import { calcTotals, fmt } from "@/lib/calc";
import React from "react";

export default function MinimalTemplate({ data }: { data: InvoiceData }) {
  const { subtotal, taxAmount, discountAmount, total } = calcTotals(data);

  return (
    <div
      style={{
        background: "#ffffff",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: 11,
        color: "#111",
        padding: "52px 56px",
        minHeight: "100%",
      }}
    >
      {/* Big number top-left */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "#999", marginBottom: 8 }}>
          INVOICE
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", color: "#111" }}>
          #{data.invoiceNo}
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, marginBottom: 48, borderTop: "3px solid #111" }}>
        {[
          { label: "FROM", lines: [data.company.toUpperCase(), data.email, data.phone] },
          { label: "TO", lines: [data.client.toUpperCase(), data.clientEmail, ""] },
          { label: "DATE", lines: [data.date, `DUE ${data.dueDate}`, ""] },
        ].map((col, i) => (
          <div key={col.label} style={{ padding: "16px 0", paddingRight: 24, borderRight: i < 2 ? "1px solid #eee" : "none", marginRight: i < 2 ? 24 : 0 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "#999", marginBottom: 8 }}>{col.label}</div>
            {col.lines.map((l, li) => (
              <div key={li} style={{ fontSize: li === 0 ? 12 : 10, fontWeight: li === 0 ? 700 : 400, color: li === 0 ? "#111" : "#777", lineHeight: 1.6 }}>{l}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 60px 100px", borderBottom: "1px solid #111", paddingBottom: 6, marginBottom: 0 }}>
          {["DESCRIPTION", "RATE", "QTY", "TOTAL"].map((h, i) => (
            <div key={h} style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: "#999", textAlign: i > 0 ? "right" : "left" }}>{h}</div>
          ))}
        </div>
        {data.items.map((item) => (
          <div
            key={item.id}
            style={{ display: "grid", gridTemplateColumns: "1fr 90px 60px 100px", borderBottom: "1px solid #f0f0f0", padding: "11px 0" }}
          >
            <div style={{ fontSize: 11, color: "#111" }}>{item.desc}</div>
            <div style={{ fontSize: 11, textAlign: "right", color: "#555" }}>{data.currency}{item.rate.toLocaleString()}</div>
            <div style={{ fontSize: 11, textAlign: "right", color: "#555" }}>{item.qty}</div>
            <div style={{ fontSize: 11, textAlign: "right", fontWeight: 700 }}>{fmt(item.rate * item.qty, data.currency)}</div>
          </div>
        ))}
      </div>

      {/* Totals — right aligned */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 52 }}>
        <div style={{ width: 240 }}>
          {[
            [`SUBTOTAL`, fmt(subtotal, data.currency)],
            [`TAX ${data.taxRate}%`, fmt(taxAmount, data.currency)],
            ...(data.discountRate > 0 ? [[`DISCOUNT ${data.discountRate}%`, `−${fmt(discountAmount, data.currency)}`]] : []),
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 10, color: "#777", borderBottom: "1px solid #f0f0f0" }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "3px solid #111", marginTop: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.04em" }}>TOTAL</span>
            <span style={{ fontSize: 13, fontWeight: 900 }}>{fmt(total, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, borderTop: "1px solid #eee", paddingTop: 20 }}>
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "#999", marginBottom: 10 }}>PAYMENT</div>
          <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", rowGap: 4 }}>
            {[["BANK", data.bank], ["ACCOUNT", data.account], ["SWIFT", data.swift], ["TAX ID", data.taxId]].map(([l, v]) => (
              <React.Fragment key={l}>
                <span style={{ fontSize: 9, color: "#999", fontWeight: 700 }}>{l}</span>
                <span style={{ fontSize: 9, color: "#555" }}>{v}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "#999", marginBottom: 10 }}>NOTES</div>
          <div style={{ fontSize: 9, color: "#777", lineHeight: 1.8 }}>{data.notes}</div>
          <div style={{ marginTop: 20, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em" }}>THANK YOU FOR YOUR BUSINESS!</div>
        </div>
      </div>
    </div>
  );
}
