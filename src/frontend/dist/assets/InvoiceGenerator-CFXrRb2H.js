import { r as reactExports, j as jsxRuntimeExports, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Printer } from "./printer-_H4AbTBS.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
function newItem() {
  return { id: crypto.randomUUID(), description: "", qty: 1, rate: 0 };
}
const inputStyle = {
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(42,58,66,0.7)",
  color: "var(--os-text-primary)",
  borderRadius: 6,
  padding: "5px 10px",
  fontSize: 12,
  outline: "none",
  width: "100%"
};
function InvoiceGenerator() {
  const { data, set: setDataRaw } = useCanisterKV(
    "decent-invoices",
    {
      companyName: "",
      companyAddress: "",
      companyEmail: "",
      clientName: "",
      clientEmail: "",
      invoiceNumber: "INV-001",
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      taxRate: 0,
      items: [newItem()]
    }
  );
  const styleRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = "@media print { body > *:not(.os-print-root) { display: none !important; } .os-print-root { display: block !important; position: fixed; inset: 0; background: white; color: black; padding: 40px; z-index: 999999; } }";
    document.head.appendChild(style);
    styleRef.current = style;
    return () => {
      if (styleRef.current) document.head.removeChild(styleRef.current);
    };
  }, []);
  const update = (patch) => setDataRaw({ ...data, ...patch });
  const updateItem = (id, patch) => setDataRaw({
    ...data,
    items: data.items.map((it) => it.id === id ? { ...it, ...patch } : it)
  });
  const addItem = () => setDataRaw({ ...data, items: [...data.items, newItem()] });
  const removeItem = (id) => setDataRaw({ ...data, items: data.items.filter((it) => it.id !== id) });
  const subtotal = data.items.reduce((s, it) => s + it.qty * it.rate, 0);
  const taxAmount = subtotal * (data.taxRate / 100);
  const total = subtotal + taxAmount;
  const fmt = (n) => n.toFixed(2);
  const sectionStyle = {
    background: "rgba(18,32,38,0.6)",
    border: "1px solid rgba(42,58,66,0.6)",
    borderRadius: 10,
    padding: 16
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: "rgba(11,15,18,0.7)" },
      "data-ocid": "invoicegenerator.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 flex-shrink-0",
            style: {
              borderBottom: "1px solid rgba(42,58,66,0.7)",
              background: "rgba(18,32,38,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold os-cyan-text", children: "Invoice Generator" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Create & print professional invoices" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => window.print(),
                  "data-ocid": "invoicegenerator.primary_button",
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors",
                  style: {
                    background: "rgba(39,215,224,0.15)",
                    border: "1px solid rgba(39,215,224,0.4)",
                    color: "rgba(39,215,224,0.9)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-3.5 h-3.5" }),
                    "Print Invoice"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    style: inputStyle,
                    placeholder: "Company Name",
                    value: data.companyName,
                    onChange: (e) => update({ companyName: e.target.value }),
                    "data-ocid": "invoicegenerator.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    style: inputStyle,
                    placeholder: "Address",
                    value: data.companyAddress,
                    onChange: (e) => update({ companyAddress: e.target.value })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    style: inputStyle,
                    placeholder: "Email",
                    type: "email",
                    value: data.companyEmail,
                    onChange: (e) => update({ companyEmail: e.target.value })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Bill To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    style: inputStyle,
                    placeholder: "Client Name",
                    value: data.clientName,
                    onChange: (e) => update({ clientName: e.target.value })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    style: inputStyle,
                    placeholder: "Client Email",
                    type: "email",
                    value: data.clientEmail,
                    onChange: (e) => update({ clientEmail: e.target.value })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      style: inputStyle,
                      placeholder: "Invoice #",
                      value: data.invoiceNumber,
                      onChange: (e) => update({ invoiceNumber: e.target.value })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      style: inputStyle,
                      type: "date",
                      value: data.date,
                      onChange: (e) => update({ date: e.target.value })
                    }
                  )
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Line Items" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: addItem,
                  "data-ocid": "invoicegenerator.secondary_button",
                  className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors",
                  style: {
                    background: "rgba(39,215,224,0.08)",
                    border: "1px solid rgba(39,215,224,0.25)",
                    color: "rgba(39,215,224,0.8)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                    " Add Row"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", style: { borderCollapse: "collapse" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { borderBottom: "1px solid rgba(42,58,66,0.6)" }, children: ["Description", "Qty", "Rate", "Amount", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "text-[10px] text-muted-foreground text-left pb-2",
                  style: { padding: "0 6px 8px 0" },
                  children: h
                },
                h
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  "data-ocid": `invoicegenerator.row.${i + 1}`,
                  style: { borderBottom: "1px solid rgba(42,58,66,0.3)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "6px 6px 6px 0", width: "45%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        style: inputStyle,
                        placeholder: "Description",
                        value: item.description,
                        onChange: (e) => updateItem(item.id, { description: e.target.value })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "6px 6px 6px 0", width: "12%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        style: { ...inputStyle, textAlign: "center" },
                        type: "number",
                        min: 0,
                        value: item.qty,
                        onChange: (e) => updateItem(item.id, { qty: Number(e.target.value) })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "6px 6px 6px 0", width: "18%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        style: { ...inputStyle, textAlign: "right" },
                        type: "number",
                        min: 0,
                        step: 0.01,
                        value: item.rate,
                        onChange: (e) => updateItem(item.id, { rate: Number(e.target.value) })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "td",
                      {
                        style: {
                          padding: "6px 6px 6px 0",
                          width: "18%",
                          textAlign: "right",
                          fontSize: 12,
                          color: "var(--os-text-primary)"
                        },
                        children: [
                          "$",
                          fmt(item.qty * item.rate)
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        style: {
                          padding: "6px 0",
                          width: "7%",
                          textAlign: "center"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => removeItem(item.id),
                            "data-ocid": `invoicegenerator.delete_button.${i + 1}`,
                            style: {
                              color: "rgba(239,68,68,0.6)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 4
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                          }
                        )
                      }
                    )
                  ]
                },
                item.id
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", style: { minWidth: 220 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex justify-between text-xs",
                  style: { color: "var(--os-text-secondary)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "$",
                      fmt(subtotal)
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs",
                      style: { color: "var(--os-text-secondary)" },
                      children: "Tax"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      max: 100,
                      step: 0.5,
                      value: data.taxRate,
                      onChange: (e) => update({ taxRate: Number(e.target.value) }),
                      "data-ocid": "invoicegenerator.select",
                      style: { ...inputStyle, width: 60, textAlign: "center" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs",
                      style: { color: "var(--os-text-secondary)" },
                      children: "%"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs",
                    style: { color: "var(--os-text-secondary)" },
                    children: [
                      "$",
                      fmt(taxAmount)
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex justify-between font-semibold",
                  style: {
                    borderTop: "1px solid rgba(39,215,224,0.3)",
                    paddingTop: 8,
                    color: "rgba(39,215,224,0.95)",
                    fontSize: 14
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "$",
                      fmt(total)
                    ] })
                  ]
                }
              )
            ] }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  InvoiceGenerator
};
