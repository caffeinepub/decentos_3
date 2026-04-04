import { r as reactExports, j as jsxRuntimeExports, T as Trash2, g as ue } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { D as Download } from "./download-BCO-vDCJ.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const CATEGORIES = [
  "Travel",
  "Meals",
  "Accommodation",
  "Software",
  "Office Supplies",
  "Other"
];
const CATEGORY_COLORS = {
  Travel: "#3b82f6",
  Meals: "#f97316",
  Accommodation: "#8b5cf6",
  Software: "#06b6d4",
  "Office Supplies": "#22c55e",
  Other: "#6b7280"
};
function ExpenseReport() {
  const { data: items, set: saveItems } = useCanisterKV(
    "expensereport_items",
    []
  );
  const [reportTitle, setReportTitle] = reactExports.useState("Expense Report");
  const [form, setForm] = reactExports.useState({
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    description: "",
    category: CATEGORIES[0],
    amount: ""
  });
  const categoryTotals = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = items.filter((i) => i.category === cat).reduce((s, i) => s + i.amount, 0);
      return acc;
    },
    {}
  );
  const total = items.reduce((s, i) => s + i.amount, 0);
  function addItem() {
    const amount = Number.parseFloat(form.amount);
    if (!form.description.trim() || Number.isNaN(amount) || amount <= 0) {
      ue.error("Please fill in all fields with a valid amount");
      return;
    }
    const newItem = {
      id: `item_${Date.now()}`,
      date: form.date,
      description: form.description.trim(),
      category: form.category,
      amount
    };
    saveItems([...items, newItem]);
    setForm((prev) => ({ ...prev, description: "", amount: "" }));
    ue.success("Expense added ✓");
  }
  function removeItem(id) {
    saveItems(items.filter((i) => i.id !== id));
  }
  function exportCSV() {
    const header = "Date,Description,Category,Amount\n";
    const rows = items.map(
      (i) => `${i.date},"${i.description}",${i.category},${i.amount.toFixed(2)}`
    ).join("\n");
    const csv = `${header + rows}

Total,,,$${total.toFixed(2)}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportTitle.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("Exported as CSV");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: {
        background: "var(--os-bg-app)",
        color: "var(--os-text-primary)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: { borderColor: "var(--os-border)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "font-semibold text-sm bg-transparent outline-none",
                  style: { color: "var(--os-text-primary)" },
                  value: reportTitle,
                  onChange: (e) => setReportTitle(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: exportCSV,
                  className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80",
                  style: {
                    background: "var(--os-accent)",
                    color: "var(--os-text-primary)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 12 }),
                    "Export CSV"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col flex-1 overflow-hidden border-r",
              style: { borderColor: "var(--os-border)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "p-4 space-y-2 border-b",
                    style: { borderColor: "var(--os-border)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-medium",
                          style: { color: "var(--os-text-muted)" },
                          children: "Add Expense"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              htmlFor: "expense-date",
                              className: "text-xs",
                              style: { color: "var(--os-text-secondary)" },
                              children: "Date"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: "expense-date",
                              type: "date",
                              className: "w-full text-xs px-2 py-1.5 rounded-lg border mt-0.5",
                              style: {
                                background: "var(--os-bg-secondary)",
                                color: "var(--os-text-primary)",
                                borderColor: "var(--os-border)",
                                colorScheme: "dark"
                              },
                              value: form.date,
                              onChange: (e) => setForm((p) => ({ ...p, date: e.target.value }))
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              htmlFor: "expense-category",
                              className: "text-xs",
                              style: { color: "var(--os-text-secondary)" },
                              children: "Category"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "select",
                            {
                              id: "expense-category",
                              className: "w-full text-xs px-2 py-1.5 rounded-lg border mt-0.5 outline-none",
                              style: {
                                background: "var(--os-bg-secondary)",
                                color: "var(--os-text-primary)",
                                borderColor: "var(--os-border)"
                              },
                              value: form.category,
                              onChange: (e) => setForm((p) => ({ ...p, category: e.target.value })),
                              children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              htmlFor: "expense-desc",
                              className: "text-xs",
                              style: { color: "var(--os-text-secondary)" },
                              children: "Description"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: "expense-desc",
                              type: "text",
                              className: "w-full text-xs px-2 py-1.5 rounded-lg border mt-0.5",
                              style: {
                                background: "var(--os-bg-secondary)",
                                color: "var(--os-text-primary)",
                                borderColor: "var(--os-border)"
                              },
                              placeholder: "What was this expense for?",
                              value: form.description,
                              onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
                              onKeyDown: (e) => e.key === "Enter" && addItem()
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              htmlFor: "expense-amount",
                              className: "text-xs",
                              style: { color: "var(--os-text-secondary)" },
                              children: "Amount ($)"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: "expense-amount",
                              type: "number",
                              min: "0",
                              step: "0.01",
                              className: "w-full text-xs px-2 py-1.5 rounded-lg border mt-0.5",
                              style: {
                                background: "var(--os-bg-secondary)",
                                color: "var(--os-text-primary)",
                                borderColor: "var(--os-border)"
                              },
                              placeholder: "0.00",
                              value: form.amount,
                              onChange: (e) => setForm((p) => ({ ...p, amount: e.target.value })),
                              onKeyDown: (e) => e.key === "Enter" && addItem()
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: addItem,
                            className: "w-full flex items-center justify-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80",
                            style: {
                              background: "var(--os-accent)",
                              color: "var(--os-text-primary)"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                              "Add"
                            ]
                          }
                        ) })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-col items-center justify-center h-32 text-center",
                    "data-ocid": "expensereport.empty_state",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-sm",
                        style: { color: "var(--os-text-muted)" },
                        children: "No expenses yet. Add one above."
                      }
                    )
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { borderBottom: "1px solid var(--os-border)" }, children: ["Date", "Description", "Category", "Amount", ""].map(
                    (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "th",
                      {
                        className: "px-3 py-2 text-left font-medium",
                        style: { color: "var(--os-text-muted)" },
                        children: h
                      },
                      h
                    )
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      "data-ocid": `expensereport.item.${idx + 1}`,
                      className: "hover:opacity-80 transition-opacity",
                      style: { borderBottom: "1px solid var(--os-border)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: "px-3 py-2",
                            style: { color: "var(--os-text-secondary)" },
                            children: item.date
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: "px-3 py-2",
                            style: { color: "var(--os-text-primary)" },
                            children: item.description
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "px-1.5 py-0.5 rounded text-xs",
                            style: {
                              background: `${CATEGORY_COLORS[item.category]}22`,
                              color: CATEGORY_COLORS[item.category]
                            },
                            children: item.category
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "td",
                          {
                            className: "px-3 py-2 font-mono",
                            style: { color: "var(--os-text-primary)" },
                            children: [
                              "$",
                              item.amount.toFixed(2)
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => removeItem(item.id),
                            className: "opacity-40 hover:opacity-100 transition-opacity",
                            style: { color: "#ef4444" },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                          }
                        ) })
                      ]
                    },
                    item.id
                  )) })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-48 flex flex-col p-4 gap-3", style: { flexShrink: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs font-semibold",
                style: { color: "var(--os-text-secondary)" },
                children: "Summary"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: CATEGORIES.filter((c) => categoryTotals[c] > 0).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-secondary)" }, children: cat }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono",
                    style: { color: CATEGORY_COLORS[cat] },
                    children: [
                      "$",
                      categoryTotals[cat].toFixed(2)
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-1 rounded-full overflow-hidden",
                  style: { background: "var(--os-bg-secondary)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full",
                      style: {
                        width: `${total > 0 ? categoryTotals[cat] / total * 100 : 0}%`,
                        background: CATEGORY_COLORS[cat]
                      }
                    }
                  )
                }
              )
            ] }, cat)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "mt-auto pt-3 border-t",
                style: { borderColor: "var(--os-border)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-primary)" }, children: "Total" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--os-accent)" }, children: [
                      "$",
                      total.toFixed(2)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs mt-0.5",
                      style: { color: "var(--os-text-muted)" },
                      children: [
                        items.length,
                        " expense",
                        items.length !== 1 ? "s" : ""
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  ExpenseReport as default
};
