import { r as reactExports, j as jsxRuntimeExports, aZ as PiggyBank, an as DollarSign, T as Trash2, g as ue } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16"
];
const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Housing", budget: 1500, spent: 1500, color: "#3b82f6" },
  {
    id: "c2",
    name: "Food & Dining",
    budget: 600,
    spent: 420,
    color: "#10b981"
  },
  { id: "c3", name: "Transport", budget: 300, spent: 185, color: "#f59e0b" },
  {
    id: "c4",
    name: "Entertainment",
    budget: 200,
    spent: 250,
    color: "#ef4444"
  },
  { id: "c5", name: "Utilities", budget: 150, spent: 130, color: "#8b5cf6" }
];
function currentMonth() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(m) {
  const [y, mo] = m.split("-").map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString(void 0, {
    month: "long",
    year: "numeric"
  });
}
function genId() {
  return `cat_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
}
const DEFAULT_DATA = {
  income: 5e3,
  month: currentMonth(),
  categories: DEFAULT_CATEGORIES
};
function BudgetPlanner() {
  const { data, set: saveData } = useCanisterKV(
    "budget_planner_v1",
    DEFAULT_DATA
  );
  const dataRef = reactExports.useRef(data);
  dataRef.current = data;
  const [editingIncome, setEditingIncome] = reactExports.useState(false);
  const [incomeInput, setIncomeInput] = reactExports.useState("");
  const [addingCat, setAddingCat] = reactExports.useState(false);
  const [newCatName, setNewCatName] = reactExports.useState("");
  const [newCatBudget, setNewCatBudget] = reactExports.useState("");
  const [newCatColor, setNewCatColor] = reactExports.useState(PALETTE[0]);
  const [editingSpent, setEditingSpent] = reactExports.useState(null);
  const [spentInput, setSpentInput] = reactExports.useState("");
  const income = (data == null ? void 0 : data.income) ?? 5e3;
  const categories = (data == null ? void 0 : data.categories) ?? DEFAULT_CATEGORIES;
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const remaining = income - totalSpent;
  const save = (patch) => {
    saveData({ ...dataRef.current ?? DEFAULT_DATA, ...patch });
    ue.success("Budget updated ✓");
  };
  const updateSpent = (id, spent) => {
    const updated = categories.map(
      (c) => c.id === id ? { ...c, spent: Math.max(0, spent) } : c
    );
    save({ categories: updated });
    setEditingSpent(null);
  };
  const removeCategory = (id) => {
    save({ categories: categories.filter((c) => c.id !== id) });
  };
  const addCategory = () => {
    if (!newCatName.trim() || !newCatBudget) return;
    const newCat = {
      id: genId(),
      name: newCatName.trim(),
      budget: Number(newCatBudget),
      spent: 0,
      color: newCatColor
    };
    save({ categories: [...categories, newCat] });
    setNewCatName("");
    setNewCatBudget("");
    setAddingCat(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--app-bg)", color: "var(--app-text)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: { borderColor: "var(--app-border)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "w-4 h-4 opacity-70" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", children: [
                "Budget Planner — ",
                monthLabel((data == null ? void 0 : data.month) ?? currentMonth())
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-3 gap-px border-b",
            style: {
              borderColor: "var(--app-border)",
              background: "var(--app-border)"
            },
            children: [
              { label: "Income", value: income, color: "rgba(34,197,94,0.8)" },
              {
                label: "Budgeted",
                value: totalBudget,
                color: "rgba(99,102,241,0.8)"
              },
              {
                label: "Remaining",
                value: remaining,
                color: remaining >= 0 ? "rgba(34,197,94,0.8)" : "rgba(239,68,68,0.8)"
              }
            ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center py-3",
                style: { background: "var(--app-surface)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-50 mb-0.5", children: s.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base font-bold", style: { color: s.color }, children: [
                    "$",
                    s.value.toLocaleString()
                  ] })
                ]
              },
              s.label
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-2 border-b flex items-center gap-2",
            style: { borderColor: "var(--app-border)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-3.5 h-3.5 opacity-50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs opacity-60", children: "Monthly income:" }),
              editingIncome ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    className: "text-xs px-2 py-0.5 rounded w-24 bg-white/10 border border-white/20 outline-none",
                    style: { color: "var(--app-text)" },
                    value: incomeInput,
                    onChange: (e) => setIncomeInput(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        const n = Number(incomeInput);
                        if (!Number.isNaN(n) && n > 0) save({ income: n });
                        setEditingIncome(false);
                      }
                      if (e.key === "Escape") setEditingIncome(false);
                    },
                    "data-ocid": "budget.income.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const n = Number(incomeInput);
                      if (!Number.isNaN(n) && n > 0) save({ income: n });
                      setEditingIncome(false);
                    },
                    className: "text-xs px-2 py-0.5 rounded",
                    style: {
                      background: "rgba(99,102,241,0.2)",
                      color: "rgba(129,140,248,0.9)"
                    },
                    "data-ocid": "budget.income.save_button",
                    children: "Save"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "text-xs font-medium hover:opacity-80 transition-opacity",
                  style: { color: "rgba(34,197,94,0.8)" },
                  onClick: () => {
                    setIncomeInput(String(income));
                    setEditingIncome(true);
                  },
                  "data-ocid": "budget.income.edit_button",
                  children: [
                    "$",
                    income.toLocaleString(),
                    " ✏️"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3 space-y-3", children: [
          categories.map((cat, idx) => {
            const pct = cat.budget > 0 ? Math.min(100, cat.spent / cat.budget * 100) : 0;
            const over = cat.spent > cat.budget;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg p-3",
                style: {
                  background: "var(--app-surface)",
                  border: "1px solid var(--app-border)"
                },
                "data-ocid": `budget.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-2.5 h-2.5 rounded-full",
                          style: { background: cat.color }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: cat.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "text-xs font-medium",
                          style: {
                            color: over ? "rgba(239,68,68,0.9)" : "rgba(34,197,94,0.8)"
                          },
                          children: [
                            "$",
                            cat.spent,
                            " / $",
                            cat.budget
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => removeCategory(cat.id),
                          className: "p-0.5 rounded hover:bg-red-500/20 transition-colors opacity-50 hover:opacity-100",
                          "data-ocid": `budget.delete_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 text-red-400" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-full h-2 rounded-full overflow-hidden",
                      style: { background: "var(--os-border-subtle)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full rounded-full transition-all",
                          style: {
                            width: `${pct}%`,
                            background: over ? "#ef4444" : cat.color
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-40", children: over ? `$${cat.spent - cat.budget} over` : `$${cat.budget - cat.spent} left` }),
                    editingSpent === cat.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          className: "text-[10px] px-1.5 py-0.5 rounded w-16 bg-white/10 border border-white/20 outline-none",
                          style: { color: "var(--app-text)" },
                          value: spentInput,
                          onChange: (e) => setSpentInput(e.target.value),
                          onKeyDown: (e) => {
                            if (e.key === "Enter")
                              updateSpent(cat.id, Number(spentInput));
                            if (e.key === "Escape") setEditingSpent(null);
                          },
                          "data-ocid": "budget.spent.input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => updateSpent(cat.id, Number(spentInput)),
                          className: "text-[10px] px-1.5 py-0.5 rounded",
                          style: {
                            background: "rgba(99,102,241,0.2)",
                            color: "rgba(129,140,248,0.9)"
                          },
                          children: "OK"
                        }
                      )
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setEditingSpent(cat.id);
                          setSpentInput(String(cat.spent));
                        },
                        className: "text-[10px] opacity-50 hover:opacity-100 transition-opacity",
                        "data-ocid": `budget.edit_button.${idx + 1}`,
                        children: "Update spent"
                      }
                    )
                  ] })
                ]
              },
              cat.id
            );
          }),
          addingCat ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-3 space-y-2",
              style: {
                background: "var(--app-surface)",
                border: "1px dashed var(--app-border)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    placeholder: "Category name",
                    className: "w-full text-xs px-2 py-1.5 rounded bg-white/10 border border-white/20 outline-none",
                    style: { color: "var(--app-text)" },
                    value: newCatName,
                    onChange: (e) => setNewCatName(e.target.value),
                    "data-ocid": "budget.category.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    placeholder: "Monthly budget ($)",
                    className: "w-full text-xs px-2 py-1.5 rounded bg-white/10 border border-white/20 outline-none",
                    style: { color: "var(--app-text)" },
                    value: newCatBudget,
                    onChange: (e) => setNewCatBudget(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: PALETTE.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setNewCatColor(c),
                    className: "w-5 h-5 rounded-full transition-transform",
                    style: {
                      background: c,
                      transform: newCatColor === c ? "scale(1.3)" : "scale(1)",
                      outline: newCatColor === c ? "2px solid white" : "2px solid transparent",
                      outlineOffset: 1
                    }
                  },
                  c
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: addCategory,
                      className: "flex-1 text-xs py-1 rounded font-medium",
                      style: {
                        background: "rgba(99,102,241,0.2)",
                        color: "rgba(129,140,248,0.9)"
                      },
                      "data-ocid": "budget.category.submit_button",
                      children: "Add"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setAddingCat(false),
                      className: "flex-1 text-xs py-1 rounded opacity-60 hover:opacity-100",
                      children: "Cancel"
                    }
                  )
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setAddingCat(true),
              className: "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs opacity-50 hover:opacity-80 transition-opacity border border-dashed",
              style: { borderColor: "var(--app-border)" },
              "data-ocid": "budget.primary_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Add Category"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-2 border-t text-[11px] flex items-center justify-between opacity-60",
            style: { borderColor: "var(--app-border)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Total spent: $",
                totalSpent.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Unbudgeted: $",
                Math.max(0, income - totalBudget).toLocaleString()
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  BudgetPlanner
};
