import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, al as DollarSign, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M17 7 7 17", key: "15tmo1" }],
  ["path", { d: "M17 17H7V7", key: "1org7z" }]
];
const ArrowDownLeft = createLucideIcon("arrow-down-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode);
const INCOME_CATS = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const EXPENSE_CATS = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Other"
];
const SAMPLE_TXS = [
  {
    id: "1",
    type: "income",
    amount: 4200,
    category: "Salary",
    note: "March salary",
    date: "2026-03-01"
  },
  {
    id: "2",
    type: "income",
    amount: 850,
    category: "Freelance",
    note: "ICP consulting",
    date: "2026-03-10"
  },
  {
    id: "3",
    type: "expense",
    amount: 120,
    category: "Food",
    note: "Weekly groceries",
    date: "2026-03-15"
  },
  {
    id: "4",
    type: "expense",
    amount: 45,
    category: "Transport",
    note: "Monthly transit pass",
    date: "2026-03-02"
  },
  {
    id: "5",
    type: "expense",
    amount: 299,
    category: "Entertainment",
    note: "Tech conference ticket",
    date: "2026-03-18"
  }
];
function BudgetTracker() {
  const {
    data: transactions,
    set: setTransactionsKV,
    loading
  } = useCanisterKV("decentos_budget", SAMPLE_TXS);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [txType, setTxType] = reactExports.useState("expense");
  const [amount, setAmount] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("Other");
  const [note, setNote] = reactExports.useState("");
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const cats = txType === "income" ? INCOME_CATS : EXPENSE_CATS;
  const addTx = () => {
    const n = Number.parseFloat(amount);
    if (!n || n <= 0) return;
    setTransactionsKV([
      {
        id: Date.now().toString(),
        type: txType,
        amount: n,
        category,
        note,
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      },
      ...transactions
    ]);
    setAmount("");
    setNote("");
    setShowForm(false);
  };
  if (loading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex h-full items-center justify-center",
        style: { background: "rgba(11,15,18,0.6)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" })
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(11,15,18,0.6)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex gap-3 p-4 border-b flex-shrink-0",
            style: { borderColor: "rgba(42,58,66,0.8)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex-1 rounded-xl p-3",
                  style: {
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[10px] mb-1",
                        style: { color: "rgba(16,185,129,0.6)" },
                        children: "Income"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "text-base font-bold",
                        style: { color: "rgba(16,185,129,0.9)" },
                        children: [
                          "$",
                          totalIncome.toLocaleString()
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex-1 rounded-xl p-3",
                  style: {
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[10px] mb-1",
                        style: { color: "rgba(239,68,68,0.6)" },
                        children: "Expenses"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "text-base font-bold",
                        style: { color: "rgba(239,68,68,0.9)" },
                        children: [
                          "$",
                          totalExpense.toLocaleString()
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex-1 rounded-xl p-3",
                  style: {
                    background: balance >= 0 ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                    border: `1px solid ${balance >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[10px] mb-1",
                        style: { color: "rgba(180,200,210,0.5)" },
                        children: "Balance"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "text-base font-bold",
                        style: {
                          color: balance >= 0 ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)"
                        },
                        children: [
                          "$",
                          Math.abs(balance).toLocaleString()
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-4 border-b flex-shrink-0",
            style: {
              background: "rgba(18,32,38,0.5)",
              borderColor: "rgba(42,58,66,0.8)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-3", children: ["expense", "income"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setTxType(t);
                    setCategory(
                      t === "income" ? INCOME_CATS[0] : EXPENSE_CATS[0]
                    );
                  },
                  "data-ocid": `budget.${t}.toggle`,
                  className: "flex-1 h-7 rounded text-xs capitalize transition-all",
                  style: txType === t ? {
                    background: t === "income" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                    border: `1px solid ${t === "income" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                    color: t === "income" ? "rgba(16,185,129,1)" : "rgba(239,68,68,1)"
                  } : {
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(42,58,66,0.5)",
                    color: "rgba(180,200,210,0.5)"
                  },
                  children: t
                },
                t
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DollarSign,
                    {
                      className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5",
                      style: { color: "rgba(180,200,210,0.4)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      placeholder: "Amount",
                      value: amount,
                      onChange: (e) => setAmount(e.target.value),
                      "data-ocid": "budget.input",
                      className: "w-full h-8 pl-7 pr-3 rounded-md text-xs bg-white/5 border outline-none",
                      style: {
                        border: "1px solid rgba(42,58,66,0.8)",
                        color: "rgba(220,235,240,0.9)"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: category,
                    onChange: (e) => setCategory(e.target.value),
                    "data-ocid": "budget.select",
                    className: "flex-1 h-8 px-2 rounded-md text-xs bg-white/5 border outline-none",
                    style: {
                      border: "1px solid rgba(42,58,66,0.8)",
                      color: "rgba(220,235,240,0.9)",
                      background: "rgba(18,32,38,0.9)"
                    },
                    children: cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Note (optional)",
                  value: note,
                  onChange: (e) => setNote(e.target.value),
                  "data-ocid": "budget.note.input",
                  className: "w-full h-8 px-3 mb-2 rounded-md text-xs bg-white/5 border outline-none",
                  style: {
                    border: "1px solid rgba(42,58,66,0.8)",
                    color: "rgba(220,235,240,0.9)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: addTx,
                    "data-ocid": "budget.submit_button",
                    className: "flex-1 h-8 rounded-lg text-xs font-semibold transition-all",
                    style: {
                      background: "rgba(16,185,129,0.14)",
                      border: "1px solid rgba(16,185,129,0.35)",
                      color: "rgba(16,185,129,1)"
                    },
                    children: "Add Transaction"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowForm(false),
                    "data-ocid": "budget.cancel_button",
                    className: "h-8 px-3 rounded-lg text-xs transition-colors",
                    style: { color: "rgba(180,200,210,0.5)" },
                    children: "Cancel"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-4 py-2 sticky top-0",
              style: {
                background: "rgba(11,15,18,0.8)",
                borderBottom: "1px solid rgba(42,58,66,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] font-semibold uppercase tracking-widest",
                    style: { color: "rgba(180,200,210,0.3)" },
                    children: "Transactions"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowForm((v) => !v),
                    "data-ocid": "budget.primary_button",
                    className: "flex items-center gap-1 h-6 px-2.5 rounded text-[10px] transition-all",
                    style: {
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.3)",
                      color: "rgba(16,185,129,0.9)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                      " Add"
                    ]
                  }
                )
              ]
            }
          ),
          transactions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex flex-col items-center justify-center h-24 gap-1",
              "data-ocid": "budget.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "rgba(180,200,210,0.3)" }, children: "No transactions yet" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", style: { borderColor: "rgba(42,58,66,0.3)" }, children: transactions.map((tx, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `budget.item.${i + 1}`,
              className: "flex items-center gap-3 px-4 py-2.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                    style: {
                      background: tx.type === "income" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"
                    },
                    children: tx.type === "income" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ArrowUpRight,
                      {
                        className: "w-3.5 h-3.5",
                        style: { color: "rgba(16,185,129,0.8)" }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ArrowDownLeft,
                      {
                        className: "w-3.5 h-3.5",
                        style: { color: "rgba(239,68,68,0.8)" }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-medium",
                        style: { color: "rgba(220,235,240,0.85)" },
                        children: tx.category
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px]",
                        style: { color: "rgba(180,200,210,0.35)" },
                        children: tx.date
                      }
                    )
                  ] }),
                  tx.note && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[10px] truncate",
                      style: { color: "rgba(180,200,210,0.4)" },
                      children: tx.note
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-sm font-semibold flex-shrink-0",
                    style: {
                      color: tx.type === "income" ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)"
                    },
                    children: [
                      tx.type === "income" ? "+" : "-",
                      "$",
                      tx.amount.toLocaleString()
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setTransactionsKV(transactions.filter((t) => t.id !== tx.id)),
                    "data-ocid": `budget.delete_button.${i + 1}`,
                    className: "w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/10 transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Trash2,
                      {
                        className: "w-3 h-3",
                        style: { color: "rgba(239,68,68,0.4)" }
                      }
                    )
                  }
                )
              ]
            },
            tx.id
          )) })
        ] })
      ]
    }
  );
}
export {
  BudgetTracker
};
