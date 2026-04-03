import { r as reactExports, j as jsxRuntimeExports } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Pen } from "./pen-fZsCY6fQ.js";
const DEFAULT_COLORS = [
  "#27D7E0",
  "#63B3ED",
  "#68D391",
  "#F6AD55",
  "#FC8181",
  "#B794F4"
];
const DEFAULT_DATA = {
  income: 5200,
  expenses: 3400,
  netWorth: 28500,
  categories: [
    { id: "1", name: "Rent", amount: 1500, color: "#63B3ED" },
    { id: "2", name: "Food", amount: 600, color: "#68D391" },
    { id: "3", name: "Transport", amount: 250, color: "#F6AD55" },
    { id: "4", name: "Utilities", amount: 180, color: "var(--os-accent)" },
    { id: "5", name: "Entertainment", amount: 320, color: "#FC8181" },
    { id: "6", name: "Other", amount: 550, color: "#B794F4" }
  ],
  savingsTrend: [
    { month: "Oct", amount: 1400 },
    { month: "Nov", amount: 1650 },
    { month: "Dec", amount: 1200 },
    { month: "Jan", amount: 1800 },
    { month: "Feb", amount: 1600 },
    { month: "Mar", amount: 1800 }
  ]
};
function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
}
function EditableValue({
  value,
  onChange,
  prefix = "$"
}) {
  const [editing, setEditing] = reactExports.useState(false);
  const [raw, setRaw] = reactExports.useState(String(value));
  if (editing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: raw,
        onChange: (e) => setRaw(e.target.value),
        onBlur: () => {
          const n = Number(raw.replace(/[^0-9.]/g, ""));
          if (!Number.isNaN(n)) onChange(n);
          setEditing(false);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") setEditing(false);
        },
        className: "w-full text-xl font-bold outline-none bg-transparent border-b",
        style: {
          color: "rgba(39,215,224,0.9)",
          borderColor: "rgba(39,215,224,0.4)"
        }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => {
        setRaw(String(value));
        setEditing(true);
      },
      className: "flex items-center gap-1 group",
      "data-ocid": "financedashboard.edit_button",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-xl font-bold",
            style: { color: "rgba(39,215,224,0.9)" },
            children: [
              prefix,
              value.toLocaleString()
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Pen,
          {
            className: "w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity",
            style: { color: "rgba(39,215,224,0.7)" }
          }
        )
      ]
    }
  );
}
function FinanceDashboard() {
  const { data, set: setData } = useCanisterKV(
    "decentos_finance_dashboard",
    DEFAULT_DATA
  );
  const update = reactExports.useCallback(
    (fn) => {
      setData(fn(data));
    },
    [data, setData]
  );
  const savingsRate = reactExports.useMemo(
    () => data.income > 0 ? Math.round((data.income - data.expenses) / data.income * 100) : 0,
    [data.income, data.expenses]
  );
  const totalCatExpenses = data.categories.reduce((s, c) => s + c.amount, 0);
  const maxSavings = Math.max(...data.savingsTrend.map((s) => s.amount), 1);
  const svgW = 260;
  const svgH = 60;
  const points = data.savingsTrend.map((s, i) => {
    const x = i / (data.savingsTrend.length - 1) * svgW;
    const y = svgH - s.amount / maxSavings * (svgH - 8) - 4;
    return `${x},${y}`;
  });
  const addCategory = reactExports.useCallback(() => {
    const id = `cat_${Date.now()}`;
    const color = DEFAULT_COLORS[data.categories.length % DEFAULT_COLORS.length];
    update((d) => ({
      ...d,
      categories: [
        ...d.categories,
        { id, name: "New Category", amount: 0, color }
      ]
    }));
  }, [data.categories.length, update]);
  const removeCategory = reactExports.useCallback(
    (id) => {
      update((d) => ({
        ...d,
        categories: d.categories.filter((c) => c.id !== id)
      }));
    },
    [update]
  );
  const CARD_STYLE = {
    background: "rgba(18,32,38,0.7)",
    border: "1px solid rgba(39,215,224,0.15)",
    borderRadius: 10,
    padding: "14px 16px"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4 flex flex-col gap-4",
      style: { background: "rgba(11,15,18,0.6)" },
      "data-ocid": "financedashboard.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3", children: [
          {
            label: "Monthly Income",
            value: data.income,
            field: "income"
          },
          {
            label: "Monthly Expenses",
            value: data.expenses,
            field: "expenses"
          },
          {
            label: "Savings Rate",
            value: savingsRate,
            field: null,
            suffix: "%"
          },
          {
            label: "Net Worth",
            value: data.netWorth,
            field: "netWorth"
          }
        ].map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: CARD_STYLE, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-[10px] font-semibold mb-1",
              style: { color: "var(--os-text-secondary)" },
              children: card.label
            }
          ),
          card.field ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EditableValue,
            {
              value: card.value,
              onChange: (n) => update((d) => ({ ...d, [card.field]: n })),
              prefix: card.suffix ? "" : "$"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xl font-bold",
              style: {
                color: savingsRate >= 20 ? "#68D391" : savingsRate >= 10 ? "#F6AD55" : "#FC8181"
              },
              children: [
                savingsRate,
                "%"
              ]
            }
          )
        ] }, card.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: CARD_STYLE, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "text-xs font-semibold",
                  style: { color: "rgba(39,215,224,0.8)" },
                  children: "Expense Breakdown"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: addCategory,
                  "data-ocid": "financedashboard.add_button",
                  className: "text-[10px] px-2 py-0.5 rounded transition-all",
                  style: {
                    background: "rgba(39,215,224,0.1)",
                    border: "1px solid rgba(39,215,224,0.25)",
                    color: "rgba(39,215,224,0.8)"
                  },
                  children: "+ Add"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: data.categories.map((cat) => {
              const pct = totalCatExpenses > 0 ? cat.amount / totalCatExpenses * 100 : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "financedashboard.row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: cat.name,
                      onChange: (e) => update((d) => ({
                        ...d,
                        categories: d.categories.map(
                          (c) => c.id === cat.id ? { ...c, name: e.target.value } : c
                        )
                      })),
                      className: "text-[11px] bg-transparent outline-none w-24 text-muted-foreground"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-[10px] font-mono",
                        style: { color: cat.color },
                        children: [
                          "$",
                          cat.amount.toLocaleString()
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        value: cat.amount,
                        onChange: (e) => update((d) => ({
                          ...d,
                          categories: d.categories.map(
                            (c) => c.id === cat.id ? { ...c, amount: Number(e.target.value) } : c
                          )
                        })),
                        className: "w-16 text-[10px] bg-transparent outline-none border-b text-muted-foreground/60 font-mono text-right",
                        style: { borderColor: "var(--os-text-muted)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeCategory(cat.id),
                        className: "text-destructive/40 hover:text-destructive/80 transition-colors",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: "×" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-1.5 rounded-full overflow-hidden",
                    style: { background: "var(--os-border-subtle)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full transition-all",
                        style: { width: `${pct}%`, background: cat.color }
                      }
                    )
                  }
                )
              ] }, cat.id);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: CARD_STYLE, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "text-xs font-semibold mb-3",
                style: { color: "rgba(39,215,224,0.8)" },
                children: "Savings Trend (6 months)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                width: svgW,
                height: svgH,
                viewBox: `0 0 ${svgW} ${svgH}`,
                style: { overflow: "visible" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Savings sparkline chart" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "sparkline-fill", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "rgba(39,215,224,0.3)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "rgba(39,215,224,0)" })
                  ] }) }),
                  points.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "polyline",
                      {
                        points: [...points, `${svgW},${svgH}`, `0,${svgH}`].join(
                          " "
                        ),
                        fill: "url(#sparkline-fill)",
                        stroke: "none"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "polyline",
                      {
                        points: points.join(" "),
                        fill: "none",
                        stroke: "rgba(39,215,224,0.8)",
                        strokeWidth: 2,
                        strokeLinejoin: "round",
                        strokeLinecap: "round"
                      }
                    ),
                    data.savingsTrend.map((s, i) => {
                      const [px, py] = points[i].split(",").map(Number);
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: px,
                          cy: py,
                          r: 3,
                          fill: "rgba(39,215,224,0.9)"
                        },
                        s.month
                      );
                    })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between", children: data.savingsTrend.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: s.amount,
                  onChange: (e) => update((d) => ({
                    ...d,
                    savingsTrend: d.savingsTrend.map(
                      (m, j) => j === i ? { ...m, amount: Number(e.target.value) } : m
                    )
                  })),
                  className: "w-12 text-[10px] text-center bg-transparent outline-none border-b text-muted-foreground/60 font-mono",
                  style: { borderColor: "var(--os-text-muted)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground/60", children: s.month })
            ] }, s.month)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "mt-4 pt-3 border-t",
                style: { borderColor: "rgba(42,58,66,0.5)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground/60", children: [
                  "Monthly savings:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-semibold",
                      style: { color: "rgba(104,211,145,0.9)" },
                      children: formatCurrency(data.income - data.expenses)
                    }
                  )
                ] })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  FinanceDashboard
};
