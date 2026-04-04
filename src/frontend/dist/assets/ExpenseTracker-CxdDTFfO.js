import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, an as DollarSign, T as Trash2 } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { T as TrendingDown } from "./trending-down-B7w8Khsk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode);
const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Utilities",
  "Other"
];
const CATEGORY_COLORS = {
  Food: "rgba(245,158,11,",
  Transport: "rgba(6,182,212,",
  Entertainment: "rgba(168,85,247,",
  Health: "rgba(34,197,94,",
  Shopping: "rgba(236,72,153,",
  Utilities: "rgba(99,102,241,",
  Other: "rgba(148,163,184,"
};
function ExpenseTracker() {
  const { data: expenses, set: setExpenses } = useCanisterKV(
    "decent-expenses",
    []
  );
  const [amount, setAmount] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("Food");
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [notes, setNotes] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("list");
  const addExpense = () => {
    const val = Number.parseFloat(amount);
    if (!amount || Number.isNaN(val) || val <= 0) return;
    const newExpense = {
      id: Date.now(),
      amount: val,
      category,
      date,
      notes
    };
    setExpenses(
      [newExpense, ...expenses].sort((a, b) => b.date.localeCompare(a.date))
    );
    setAmount("");
    setNotes("");
  };
  const removeExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };
  const now = /* @__PURE__ */ new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = reactExports.useMemo(() => {
    const map = {};
    for (const e of monthExpenses) {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    }
    return map;
  }, [monthExpenses]);
  const maxCatVal = Math.max(...Object.values(byCategory), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full text-sm",
      style: { background: "transparent", color: "#e2e8f0" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3",
            style: { borderBottom: "1px solid var(--os-border-subtle)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DollarSign,
                  {
                    className: "w-4 h-4",
                    style: { color: "rgb(39,215,224)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Expense Tracker" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["list", "overview"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `expense.${t}.tab`,
                  onClick: () => setActiveTab(t),
                  className: "px-3 py-1 rounded text-xs capitalize transition-all",
                  style: {
                    background: activeTab === t ? "rgba(39,215,224,0.15)" : "var(--os-border-subtle)",
                    border: `1px solid ${activeTab === t ? "rgba(39,215,224,0.4)" : "var(--os-border-subtle)"}`,
                    color: activeTab === t ? "rgb(39,215,224)" : "rgba(148,163,184,0.8)"
                  },
                  children: t
                },
                t
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-4 py-3",
            style: { borderBottom: "1px solid var(--os-border-subtle)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  placeholder: "Amount",
                  value: amount,
                  onChange: (e) => setAmount(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && addExpense(),
                  "data-ocid": "expense.input",
                  className: "flex-1 min-w-[80px] px-2 py-1.5 rounded text-xs bg-muted/50 border focus:outline-none focus:border-cyan-500/50",
                  style: {
                    border: "1px solid var(--os-text-muted)",
                    color: "#e2e8f0"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: category,
                  onChange: (e) => setCategory(e.target.value),
                  "data-ocid": "expense.select",
                  className: "px-2 py-1.5 rounded text-xs bg-muted/50 focus:outline-none",
                  style: {
                    border: "1px solid var(--os-text-muted)",
                    color: "#e2e8f0"
                  },
                  children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: c,
                      style: { background: "var(--os-bg-app)" },
                      children: c
                    },
                    c
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: date,
                  onChange: (e) => setDate(e.target.value),
                  className: "px-2 py-1.5 rounded text-xs bg-muted/50 focus:outline-none",
                  style: {
                    border: "1px solid var(--os-text-muted)",
                    color: "#e2e8f0"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Notes (optional)",
                  value: notes,
                  onChange: (e) => setNotes(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && addExpense(),
                  "data-ocid": "expense.textarea",
                  className: "flex-1 min-w-[120px] px-2 py-1.5 rounded text-xs bg-muted/50 focus:outline-none",
                  style: {
                    border: "1px solid var(--os-text-muted)",
                    color: "#e2e8f0"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: addExpense,
                  "data-ocid": "expense.add_button",
                  className: "flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-all",
                  style: {
                    background: "rgba(39,215,224,0.12)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "rgb(39,215,224)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-3 h-3" }),
                    " Add"
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto px-4 py-3", children: activeTab === "list" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "This month:",
              " ",
              now.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric"
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", style: { color: "rgb(39,215,224)" }, children: [
              "$",
              monthTotal.toFixed(2)
            ] })
          ] }),
          expenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "expense.empty_state",
              className: "text-center py-12 text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-8 h-8 mx-auto mb-2 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No expenses yet. Add your first one above." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: expenses.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `expense.item.${i + 1}`,
              className: "flex items-center gap-3 px-3 py-2 rounded group",
              style: {
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-border-subtle)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-2 h-2 rounded-full flex-shrink-0",
                    style: {
                      background: `${CATEGORY_COLORS[e.category]}0.8)`
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs",
                    style: { color: `${CATEGORY_COLORS[e.category]}0.7)` },
                    children: e.category
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground flex-shrink-0", children: e.date }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate flex-1", children: e.notes }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground flex-shrink-0", children: [
                  "$",
                  e.amount.toFixed(2)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeExpense(e.id),
                    "data-ocid": `expense.delete_button.${i + 1}`,
                    className: "opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                  }
                )
              ]
            },
            e.id
          )) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Total this month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
              "$",
              monthTotal.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: CATEGORIES.map((cat) => {
            const val = byCategory[cat] ?? 0;
            const pct = val / maxCatVal * 100;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: `${CATEGORY_COLORS[cat]}0.8)` }, children: cat }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
                  "$",
                  val.toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-2 rounded-full",
                  style: { background: "var(--os-border-subtle)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-2 rounded-full transition-all duration-500",
                      style: {
                        width: `${pct}%`,
                        background: `${CATEGORY_COLORS[cat]}0.7)`
                      }
                    }
                  )
                }
              )
            ] }, cat);
          }) })
        ] }) })
      ]
    }
  );
}
export {
  ExpenseTracker
};
