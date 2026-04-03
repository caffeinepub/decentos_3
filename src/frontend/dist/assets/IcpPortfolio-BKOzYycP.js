import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, D as TrendingUp, g as ue } from "./index-CZGIn5x2.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { L as LoaderCircle } from "./loader-circle-CDA4iBPc.js";
import { T as TrendingDown } from "./trending-down-BIy9-1eT.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
const Wallet = createLucideIcon("wallet", __iconNode);
const ACCENT = "rgba(39,215,224,";
const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";
const GREEN = "rgba(34,197,94,";
const RED = "rgba(248,113,113,";
function generateSparkline(price, change) {
  const points = [];
  let p = price * (1 - change / 100);
  for (let i = 0; i < 7; i++) {
    points.push(p);
    const noise = (Math.random() - 0.5) * price * 0.015;
    p += noise + (price - p) * 0.2;
  }
  points.push(price);
  return points;
}
const INITIAL_HOLDINGS = [
  {
    id: 1,
    name: "Internet Computer",
    symbol: "ICP",
    amount: 150,
    price: 8.42,
    change24h: 2.3,
    sparkline: generateSparkline(8.42, 2.3)
  },
  {
    id: 2,
    name: "Bitcoin",
    symbol: "BTC",
    amount: 0.05,
    price: 67500,
    change24h: -0.8,
    sparkline: generateSparkline(67500, -0.8)
  },
  {
    id: 3,
    name: "Ethereum",
    symbol: "ETH",
    amount: 0.8,
    price: 3200,
    change24h: 1.2,
    sparkline: generateSparkline(3200, 1.2)
  }
];
const fmtUsd = (n) => n >= 1e3 ? n.toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
}) : n.toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const fmtPct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
function Sparkline({
  points,
  positive
}) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const W = 64;
  const H = 24;
  const xs = points.map((_, i) => i / (points.length - 1) * W);
  const ys = points.map((p) => H - (p - min) / range * H);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const color = positive ? "#22C55E" : "#F87171";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}`, fill: "none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Sparkline" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d,
        stroke: color,
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] });
}
function IcpPortfolio({
  windowProps: _windowProps
}) {
  const {
    data: holdings,
    set: setHoldings,
    loading
  } = useCanisterKV("decentos_icpportfolio", INITIAL_HOLDINGS);
  const [nextId, setNextId] = reactExports.useState(4);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    symbol: "",
    amount: "",
    price: "",
    change24h: ""
  });
  const total = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);
  const weighted24h = holdings.length === 0 ? 0 : holdings.reduce(
    (sum, h) => sum + h.amount * h.price * h.change24h / (total || 1),
    0
  );
  const addHolding = () => {
    if (!form.name || !form.symbol || !form.amount || !form.price) return;
    const price = Number.parseFloat(form.price);
    const change = Number.parseFloat(form.change24h) || 0;
    const updated = [
      ...holdings,
      {
        id: nextId,
        name: form.name,
        symbol: form.symbol.toUpperCase(),
        amount: Number.parseFloat(form.amount),
        price,
        change24h: change,
        sparkline: generateSparkline(price, change)
      }
    ];
    setHoldings(updated);
    setNextId((n) => n + 1);
    setForm({ name: "", symbol: "", amount: "", price: "", change24h: "" });
    setShowAdd(false);
    ue.success("Holding added");
  };
  const deleteHolding = (id) => {
    setHoldings(holdings.filter((h) => h.id !== id));
  };
  const updatePrice = (id, price) => {
    setHoldings(
      holdings.map(
        (h) => h.id === id ? { ...h, price, sparkline: generateSparkline(price, h.change24h) } : h
      )
    );
    setEditingId(null);
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center h-full",
        style: { background: BG },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          LoaderCircle,
          {
            className: "w-6 h-6 animate-spin",
            style: { color: `${ACCENT}0.7)` }
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: BG },
      "data-ocid": "portfolio.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-shrink-0 px-5 py-4 border-b",
            style: { borderColor: BORDER, background: "rgba(10,16,20,0.6)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] uppercase tracking-widest mb-1",
                    style: { color: MUTED },
                    children: "Total Portfolio Value"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", style: { color: TEXT }, children: fmtUsd(total) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pb-1", children: [
                weighted24h >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TrendingUp,
                  {
                    className: "w-4 h-4",
                    style: { color: `${GREEN}0.8)` }
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TrendingDown,
                  {
                    className: "w-4 h-4",
                    style: { color: `${RED}0.8)` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-sm font-semibold",
                    style: {
                      color: weighted24h >= 0 ? `${GREEN}0.9)` : `${RED}0.9)`
                    },
                    children: [
                      fmtPct(weighted24h),
                      " today"
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: holdings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-48 gap-4",
            "data-ocid": "portfolio.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-16 h-16 rounded-2xl flex items-center justify-center",
                  style: {
                    background: `${ACCENT}0.08)`,
                    border: `1px solid ${ACCENT}0.2)`
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-8 h-8", style: { color: `${ACCENT}0.7)` } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: { color: TEXT }, children: "No holdings yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", style: { color: MUTED }, children: 'Click "Add Holding" below to track your crypto portfolio' })
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "tr",
            {
              style: {
                borderBottom: `1px solid ${BORDER}`,
                background: "rgba(10,16,20,0.4)"
              },
              children: [
                "Asset",
                "Price",
                "24h",
                "Sparkline",
                "Holdings",
                "Value",
                ""
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  style: {
                    padding: "8px 12px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 600,
                    color: MUTED,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em"
                  },
                  children: h
                },
                h
              ))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: holdings.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `portfolio.row.${i + 1}`,
              style: {
                borderBottom: "1px solid rgba(42,58,66,0.4)",
                transition: "background 0.12s"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "10px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                      style: {
                        background: `${ACCENT}0.12)`,
                        color: `${ACCENT}0.9)`
                      },
                      children: h.symbol.slice(0, 2)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: { fontSize: 13, fontWeight: 600, color: TEXT },
                        children: h.symbol
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: MUTED }, children: h.name })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    style: { padding: "10px 12px", fontSize: 13, color: TEXT },
                    children: editingId === h.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        defaultValue: h.price,
                        onBlur: (e) => updatePrice(
                          h.id,
                          Number.parseFloat(e.target.value) || h.price
                        ),
                        onKeyDown: (e) => {
                          if (e.key === "Enter")
                            updatePrice(
                              h.id,
                              Number.parseFloat(e.currentTarget.value) || h.price
                            );
                          if (e.key === "Escape") setEditingId(null);
                        },
                        style: {
                          background: "rgba(20,30,36,0.8)",
                          border: `1px solid ${BORDER}`,
                          color: TEXT,
                          fontSize: 12,
                          padding: "2px 6px",
                          borderRadius: 4,
                          width: 80,
                          outline: "none"
                        }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditingId(h.id),
                        style: {
                          background: "none",
                          border: "none",
                          cursor: "text",
                          color: TEXT,
                          fontSize: 13,
                          padding: 0,
                          textDecoration: "underline dotted",
                          textUnderlineOffset: "3px"
                        },
                        title: "Click to edit price",
                        children: fmtUsd(h.price)
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    style: {
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: h.change24h >= 0 ? `${GREEN}0.9)` : `${RED}0.9)`
                    },
                    children: fmtPct(h.change24h)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "10px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Sparkline,
                  {
                    points: h.sparkline,
                    positive: h.change24h >= 0
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    style: { padding: "10px 12px", fontSize: 13, color: MUTED },
                    children: [
                      h.amount,
                      " ",
                      h.symbol
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    style: {
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: `${ACCENT}0.9)`
                    },
                    children: fmtUsd(h.amount * h.price)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "10px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `portfolio.delete_button.${i + 1}`,
                    onClick: () => deleteHolding(h.id),
                    style: {
                      background: "none",
                      border: "none",
                      color: MUTED,
                      cursor: "pointer",
                      fontSize: 14,
                      padding: "0 4px"
                    },
                    title: "Remove",
                    children: "✕"
                  }
                ) })
              ]
            },
            h.id
          )) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { borderTop: `1px solid ${BORDER}`, flexShrink: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "portfolio.toggle",
              onClick: () => setShowAdd((v) => !v),
              style: {
                width: "100%",
                padding: "8px 16px",
                background: "rgba(10,16,20,0.6)",
                border: "none",
                color: MUTED,
                fontSize: 12,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 6
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: showAdd ? "▾" : "▸" }),
                " Add Holding"
              ]
            }
          ),
          showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "12px 16px 16px",
                background: "rgba(10,16,20,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                      gap: 8,
                      marginBottom: 10
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          "data-ocid": "portfolio.input",
                          placeholder: "Asset name",
                          value: form.name,
                          onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
                          style: {
                            background: "rgba(20,30,36,0.8)",
                            border: `1px solid ${BORDER}`,
                            color: TEXT,
                            fontSize: 12,
                            height: 32
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          placeholder: "Symbol",
                          value: form.symbol,
                          onChange: (e) => setForm((f) => ({ ...f, symbol: e.target.value })),
                          style: {
                            background: "rgba(20,30,36,0.8)",
                            border: `1px solid ${BORDER}`,
                            color: TEXT,
                            fontSize: 12,
                            height: 32
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          placeholder: "Amount",
                          value: form.amount,
                          onChange: (e) => setForm((f) => ({ ...f, amount: e.target.value })),
                          style: {
                            background: "rgba(20,30,36,0.8)",
                            border: `1px solid ${BORDER}`,
                            color: TEXT,
                            fontSize: 12,
                            height: 32
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          placeholder: "Price ($)",
                          value: form.price,
                          onChange: (e) => setForm((f) => ({ ...f, price: e.target.value })),
                          style: {
                            background: "rgba(20,30,36,0.8)",
                            border: `1px solid ${BORDER}`,
                            color: TEXT,
                            fontSize: 12,
                            height: 32
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          placeholder: "24h % (opt)",
                          value: form.change24h,
                          onChange: (e) => setForm((f) => ({ ...f, change24h: e.target.value })),
                          style: {
                            background: "rgba(20,30,36,0.8)",
                            border: `1px solid ${BORDER}`,
                            color: TEXT,
                            fontSize: 12,
                            height: 32
                          }
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "portfolio.submit_button",
                    onClick: addHolding,
                    style: {
                      fontSize: 12,
                      height: 30,
                      background: `${ACCENT}0.8)`,
                      border: "none",
                      color: "#000",
                      fontWeight: 700,
                      padding: "0 16px"
                    },
                    children: "Add"
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  IcpPortfolio
};
