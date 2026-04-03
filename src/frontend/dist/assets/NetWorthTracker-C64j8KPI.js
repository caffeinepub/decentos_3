import { j as jsxRuntimeExports, D as TrendingUp, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { T as TrendingDown } from "./trending-down-BIy9-1eT.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
const DEFAULT_DATA = {
  assets: [
    { id: "a1", label: "Checking Account", amount: 5200 },
    { id: "a2", label: "Savings Account", amount: 18e3 },
    { id: "a3", label: "Investments", amount: 32e3 }
  ],
  liabilities: [
    { id: "l1", label: "Credit Card", amount: 2400 },
    { id: "l2", label: "Student Loan", amount: 15e3 }
  ]
};
function genId() {
  return Math.random().toString(36).slice(2, 9);
}
function fmt(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
}
function ItemRow({
  item,
  onUpdate,
  onDelete,
  ocidBase
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-2 py-1.5 border-b",
      style: { borderColor: "var(--os-border-subtle)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: item.label,
            onChange: (e) => onUpdate(item.id, e.target.value, item.amount),
            placeholder: "Label",
            className: "flex-1 bg-transparent text-sm outline-none",
            style: { color: "var(--os-text-primary)" },
            "data-ocid": `${ocidBase}.input`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: "var(--os-text-muted)" }, children: "$" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: item.amount,
            onChange: (e) => onUpdate(item.id, item.label, Number.parseFloat(e.target.value) || 0),
            className: "w-24 bg-transparent text-right text-sm outline-none font-mono",
            style: { color: "rgba(39,215,224,1)" },
            "data-ocid": `${ocidBase}.input`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onDelete(item.id),
            "data-ocid": `${ocidBase}.delete_button`,
            className: "p-1 rounded hover:bg-red-500/10 transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Trash2,
              {
                className: "w-3.5 h-3.5",
                style: { color: "rgba(255,100,100,0.5)" }
              }
            )
          }
        )
      ]
    }
  );
}
function NetWorthTracker() {
  const { data, set } = useCanisterKV(
    "decentos_networth",
    DEFAULT_DATA
  );
  const update = (section, id, label, amount) => set({
    ...data,
    [section]: data[section].map(
      (item) => item.id === id ? { ...item, label, amount } : item
    )
  });
  const add = (section) => set({
    ...data,
    [section]: [...data[section], { id: genId(), label: "", amount: 0 }]
  });
  const remove = (section, id) => set({ ...data, [section]: data[section].filter((i) => i.id !== id) });
  const totalAssets = data.assets.reduce((s, i) => s + i.amount, 0);
  const totalLiabilities = data.liabilities.reduce((s, i) => s + i.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const assetRatio = totalAssets + totalLiabilities > 0 ? totalAssets / (totalAssets + totalLiabilities) * 100 : 50;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: {
        background: "rgba(9,13,16,0.9)",
        color: "var(--os-text-primary)"
      },
      "data-ocid": "networth.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center py-6 flex-shrink-0 border-b",
            style: {
              borderColor: "rgba(39,215,224,0.1)",
              background: "rgba(18,32,38,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                netWorth >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TrendingUp,
                  {
                    className: "w-5 h-5",
                    style: { color: "rgba(39,215,224,1)" }
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TrendingDown,
                  {
                    className: "w-5 h-5",
                    style: { color: "rgba(255,100,100,1)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold uppercase tracking-widest",
                    style: { color: "var(--os-text-secondary)" },
                    children: "Net Worth"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-4xl font-bold font-mono",
                  style: {
                    color: netWorth >= 0 ? "rgba(39,215,224,1)" : "rgba(255,100,100,1)"
                  },
                  children: fmt(netWorth)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 mt-3 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--os-text-secondary)" }, children: "Assets" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-semibold font-mono",
                      style: { color: "rgba(100,220,100,0.9)" },
                      children: fmt(totalAssets)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--os-text-secondary)" }, children: "Liabilities" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-semibold font-mono",
                      style: { color: "rgba(255,120,120,0.9)" },
                      children: fmt(totalLiabilities)
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-64 h-2 rounded-full mt-3 overflow-hidden",
                  style: { background: "rgba(255,120,120,0.2)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full transition-all duration-500",
                      style: {
                        width: `${assetRatio}%`,
                        background: "rgba(100,220,100,0.6)"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex w-64 justify-between text-[10px] mt-1",
                  style: { color: "var(--os-text-muted)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Assets ",
                      Math.round(assetRatio),
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Liabilities ",
                      Math.round(100 - assetRatio),
                      "%"
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4",
              style: {
                background: "rgba(100,220,100,0.04)",
                border: "1px solid rgba(100,220,100,0.1)"
              },
              "data-ocid": "networth.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-semibold uppercase tracking-widest",
                      style: { color: "rgba(100,220,100,0.7)" },
                      children: "Assets"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => add("assets"),
                      "data-ocid": "networth.primary_button",
                      className: "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded",
                      style: {
                        background: "rgba(100,220,100,0.1)",
                        color: "rgba(100,220,100,0.8)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                        " Add"
                      ]
                    }
                  )
                ] }),
                data.assets.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ItemRow,
                  {
                    item,
                    onUpdate: (id, label, amount) => update("assets", id, label, amount),
                    onDelete: (id) => remove("assets", id),
                    ocidBase: "networth.assets"
                  },
                  item.id
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "mt-2 pt-2 border-t text-right text-xs font-mono font-semibold",
                    style: {
                      borderColor: "rgba(100,220,100,0.1)",
                      color: "rgba(100,220,100,0.9)"
                    },
                    children: fmt(totalAssets)
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4",
              style: {
                background: "rgba(255,100,100,0.04)",
                border: "1px solid rgba(255,100,100,0.1)"
              },
              "data-ocid": "networth.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-semibold uppercase tracking-widest",
                      style: { color: "rgba(255,120,120,0.7)" },
                      children: "Liabilities"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => add("liabilities"),
                      "data-ocid": "networth.secondary_button",
                      className: "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded",
                      style: {
                        background: "rgba(255,100,100,0.1)",
                        color: "rgba(255,120,120,0.8)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                        " Add"
                      ]
                    }
                  )
                ] }),
                data.liabilities.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ItemRow,
                  {
                    item,
                    onUpdate: (id, label, amount) => update("liabilities", id, label, amount),
                    onDelete: (id) => remove("liabilities", id),
                    ocidBase: "networth.liabilities"
                  },
                  item.id
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "mt-2 pt-2 border-t text-right text-xs font-mono font-semibold",
                    style: {
                      borderColor: "rgba(255,100,100,0.1)",
                      color: "rgba(255,120,120,0.9)"
                    },
                    children: fmt(totalLiabilities)
                  }
                )
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  NetWorthTracker
};
