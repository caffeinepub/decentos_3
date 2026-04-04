import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, av as Target, aJ as GraduationCap, aS as Plane, X, C as Check } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { S as Shield } from "./shield-DHJOVrKO.js";
import { P as Pencil } from "./pencil-COUdXnEp.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
      key: "5owen"
    }
  ],
  ["circle", { cx: "7", cy: "17", r: "2", key: "u2ysq9" }],
  ["path", { d: "M9 17h6", key: "r8uit2" }],
  ["circle", { cx: "17", cy: "17", r: "2", key: "axvx0g" }]
];
const Car = createLucideIcon("car", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", key: "hou9p0" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode);
const CATEGORY_ICONS = {
  "Emergency Fund": Shield,
  Vacation: Plane,
  Gadget: ShoppingBag,
  Home: House,
  Car,
  Education: GraduationCap,
  Other: Target
};
const CATEGORY_COLORS = {
  "Emergency Fund": "#22c55e",
  Vacation: "#27D7E0",
  Gadget: "#a78bfa",
  Home: "#f59e0b",
  Car: "#f97316",
  Education: "#3b82f6",
  Other: "#64748b"
};
function genId() {
  return `goal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function FinancialGoals({
  windowProps: _w
}) {
  const {
    data: persisted,
    set: save,
    loading
  } = useCanisterKV("financial_goals", []);
  const [goals, setGoals] = reactExports.useState([]);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [addFundsId, setAddFundsId] = reactExports.useState(null);
  const [addAmount, setAddAmount] = reactExports.useState("");
  const [editingId, setEditingId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    category: "Other",
    target: 1e3,
    deadline: ""
  });
  const hydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (persisted.length > 0) setGoals(persisted);
    else {
      const defaults = [
        {
          id: genId(),
          name: "Emergency Fund",
          category: "Emergency Fund",
          target: 1e4,
          current: 3200,
          deadline: "2025-12-31"
        },
        {
          id: genId(),
          name: "Japan Trip",
          category: "Vacation",
          target: 4500,
          current: 1200,
          deadline: "2025-07-01"
        },
        {
          id: genId(),
          name: "New Laptop",
          category: "Gadget",
          target: 2e3,
          current: 800,
          deadline: "2025-04-01"
        }
      ];
      setGoals(defaults);
      save(defaults);
    }
  }, [loading, persisted, save]);
  const addGoal = reactExports.useCallback(() => {
    if (!form.name.trim() || form.target <= 0) return;
    const g = {
      id: genId(),
      ...form,
      current: 0,
      name: form.name.trim()
    };
    setGoals((prev) => {
      const updated = [...prev, g];
      save(updated);
      return updated;
    });
    setForm({ name: "", category: "Other", target: 1e3, deadline: "" });
    setShowAdd(false);
  }, [form, save]);
  const deleteGoal = reactExports.useCallback(
    (id) => {
      setGoals((prev) => {
        const updated = prev.filter((g) => g.id !== id);
        save(updated);
        return updated;
      });
    },
    [save]
  );
  const applyFunds = reactExports.useCallback(() => {
    const amt = Number.parseFloat(addAmount);
    if (!addFundsId || Number.isNaN(amt) || amt <= 0) {
      setAddFundsId(null);
      return;
    }
    setGoals((prev) => {
      const updated = prev.map(
        (g) => g.id === addFundsId ? { ...g, current: Math.min(g.target, g.current + amt) } : g
      );
      save(updated);
      return updated;
    });
    setAddFundsId(null);
    setAddAmount("");
  }, [addFundsId, addAmount, save]);
  const totalTarget = goals.reduce((a, g) => a + g.target, 0);
  const totalCurrent = goals.reduce((a, g) => a + g.current, 0);
  const overallPct = totalTarget > 0 ? Math.round(totalCurrent / totalTarget * 100) : 0;
  const muted = "var(--os-text-secondary)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(8,14,20,0.95)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-3 border-b flex items-center gap-3 flex-shrink-0",
            style: {
              borderColor: "rgba(39,215,224,0.12)",
              background: "rgba(10,16,20,0.6)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4", style: { color: "var(--os-accent)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[11px] font-semibold",
                    style: { color: "var(--os-text-primary)" },
                    children: "Financial Goals"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px]", style: { color: muted }, children: [
                  "$",
                  totalCurrent.toLocaleString(),
                  " saved of $",
                  totalTarget.toLocaleString(),
                  " total"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-24 h-1.5 rounded-full overflow-hidden",
                    style: { background: "var(--os-border-subtle)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full transition-all",
                        style: {
                          width: `${overallPct}%`,
                          background: "var(--os-accent)"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[11px] font-bold",
                    style: { color: "var(--os-accent)" },
                    children: [
                      overallPct,
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAdd(true),
                  "data-ocid": "financialgoals.add_button",
                  className: "flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-semibold transition-all hover:brightness-125",
                  style: {
                    background: "rgba(39,215,224,0.12)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "var(--os-accent)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    "Add Goal"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [
          goals.length === 0 && !showAdd ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-full gap-3",
              "data-ocid": "financialgoals.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Target,
                  {
                    className: "w-12 h-12",
                    style: { color: "rgba(39,215,224,0.15)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: muted }, children: "No goals yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowAdd(true),
                    className: "px-4 h-8 rounded-lg text-xs font-semibold transition-all",
                    style: {
                      background: "rgba(39,215,224,0.12)",
                      border: "1px solid rgba(39,215,224,0.3)",
                      color: "var(--os-accent)"
                    },
                    children: "+ Create First Goal"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: goals.map((g, i) => {
            const Icon = CATEGORY_ICONS[g.category];
            const color = CATEGORY_COLORS[g.category];
            const pct = g.target > 0 ? Math.round(g.current / g.target * 100) : 0;
            const completed = pct >= 100;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `financialgoals.card.${i + 1}`,
                className: "rounded-xl p-3 flex flex-col gap-2 relative",
                style: {
                  background: "var(--os-bg-elevated)",
                  border: `1px solid ${completed ? `${color}55` : "rgba(39,215,224,0.12)"}`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        style: {
                          background: `${color}18`,
                          border: `1px solid ${color}33`
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4", style: { color } })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[12px] font-semibold truncate",
                          style: { color: "var(--os-text-primary)" },
                          children: g.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", style: { color: muted }, children: g.category })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setEditingId(g.id);
                          },
                          "data-ocid": `financialgoals.edit_button.${i + 1}`,
                          className: "w-6 h-6 rounded flex items-center justify-center transition-all",
                          style: {
                            background: "var(--os-border-subtle)",
                            color: muted
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => deleteGoal(g.id),
                          "data-ocid": `financialgoals.delete_button.${i + 1}`,
                          className: "w-6 h-6 rounded flex items-center justify-center transition-all",
                          style: {
                            background: "rgba(239,68,68,0.07)",
                            color: "rgba(239,68,68,0.5)"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold", style: { color }, children: [
                      "$",
                      g.current.toLocaleString()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px]", style: { color: muted }, children: [
                      "of $",
                      g.target.toLocaleString()
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
                          className: "h-full rounded-full transition-all duration-500",
                          style: {
                            width: `${Math.min(100, pct)}%`,
                            background: color
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-[10px] font-semibold",
                        style: { color },
                        children: [
                          pct,
                          "%"
                        ]
                      }
                    ),
                    g.deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px]", style: { color: muted }, children: [
                      "by ",
                      g.deadline
                    ] })
                  ] }),
                  addFundsId === g.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 0,
                        step: 10,
                        placeholder: "Amount",
                        value: addAmount,
                        onChange: (e) => setAddAmount(e.target.value),
                        "data-ocid": `financialgoals.input.${i + 1}`,
                        onKeyDown: (e) => {
                          if (e.key === "Enter") applyFunds();
                          if (e.key === "Escape") setAddFundsId(null);
                        },
                        className: "flex-1 px-2 py-1 rounded text-[11px] outline-none",
                        style: {
                          background: "var(--os-border-subtle)",
                          border: "1px solid rgba(39,215,224,0.2)",
                          color: "var(--os-text-primary)",
                          colorScheme: "dark"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: applyFunds,
                        "data-ocid": `financialgoals.confirm_button.${i + 1}`,
                        className: "w-7 h-7 rounded flex items-center justify-center",
                        style: { background: `${color}22`, color },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setAddFundsId(null),
                        "data-ocid": `financialgoals.cancel_button.${i + 1}`,
                        className: "w-7 h-7 rounded flex items-center justify-center",
                        style: {
                          background: "var(--os-border-subtle)",
                          color: muted
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                      }
                    )
                  ] }) : !completed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setAddFundsId(g.id);
                        setAddAmount("");
                      },
                      "data-ocid": `financialgoals.secondary_button.${i + 1}`,
                      className: "w-full h-7 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all hover:brightness-125 mt-1",
                      style: {
                        background: `${color}12`,
                        border: `1px solid ${color}30`,
                        color
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                        " Add Funds"
                      ]
                    }
                  ),
                  completed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 py-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3", style: { color } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[11px] font-semibold",
                        style: { color },
                        children: "Goal Reached! 🎉"
                      }
                    )
                  ] })
                ]
              },
              g.id
            );
          }) }),
          showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-4 rounded-xl p-4 space-y-3",
              "data-ocid": "financialgoals.modal",
              style: {
                background: "var(--os-bg-elevated)",
                border: "1px solid rgba(39,215,224,0.2)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[12px] font-semibold",
                    style: { color: "var(--os-accent)" },
                    children: "New Savings Goal"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Goal name",
                    value: form.name,
                    onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })),
                    "data-ocid": "financialgoals.input",
                    className: "w-full px-2 py-1.5 rounded text-[12px] outline-none",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: "1px solid rgba(39,215,224,0.18)",
                      color: "var(--os-text-primary)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: form.category,
                      onChange: (e) => setForm((p) => ({
                        ...p,
                        category: e.target.value
                      })),
                      "data-ocid": "financialgoals.select",
                      className: "flex-1 px-2 py-1.5 rounded text-[12px] outline-none",
                      style: {
                        background: "rgba(10,16,20,0.9)",
                        border: "1px solid rgba(39,215,224,0.18)",
                        color: "var(--os-text-primary)",
                        colorScheme: "dark"
                      },
                      children: Object.keys(CATEGORY_ICONS).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      placeholder: "Target $",
                      min: 1,
                      value: form.target,
                      onChange: (e) => setForm((p) => ({ ...p, target: Number(e.target.value) })),
                      className: "w-28 px-2 py-1.5 rounded text-[12px] outline-none",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(39,215,224,0.18)",
                        color: "var(--os-text-primary)",
                        colorScheme: "dark"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "date",
                      value: form.deadline,
                      onChange: (e) => setForm((p) => ({ ...p, deadline: e.target.value })),
                      className: "w-36 px-2 py-1.5 rounded text-[12px] outline-none",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(39,215,224,0.18)",
                        color: "var(--os-text-primary)",
                        colorScheme: "dark"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: addGoal,
                      "data-ocid": "financialgoals.submit_button",
                      className: "flex-1 h-8 rounded-lg text-[12px] font-semibold transition-all",
                      style: {
                        background: "rgba(39,215,224,0.12)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "var(--os-accent)"
                      },
                      children: "Create Goal"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowAdd(false),
                      "data-ocid": "financialgoals.cancel_button",
                      className: "h-8 px-4 rounded-lg text-[12px] transition-all",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid var(--os-text-muted)",
                        color: muted
                      },
                      children: "Cancel"
                    }
                  )
                ] })
              ]
            }
          ),
          editingId && (() => {
            const g = goals.find((x) => x.id === editingId);
            if (!g) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "fixed inset-0 flex items-center justify-center z-50",
                style: { background: "rgba(0,0,0,0.6)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-xl p-4 w-72 space-y-3",
                    "data-ocid": "financialgoals.dialog",
                    style: {
                      background: "var(--os-bg-app)",
                      border: "1px solid rgba(39,215,224,0.25)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[12px] font-semibold",
                          style: { color: "var(--os-accent)" },
                          children: "Edit Goal"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          value: g.name,
                          onChange: (e) => setGoals(
                            (prev) => prev.map(
                              (x) => x.id === editingId ? { ...x, name: e.target.value } : x
                            )
                          ),
                          "data-ocid": "financialgoals.textarea",
                          className: "w-full px-2 py-1.5 rounded text-[12px] outline-none",
                          style: {
                            background: "var(--os-border-subtle)",
                            border: "1px solid rgba(39,215,224,0.18)",
                            color: "var(--os-text-primary)"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "number",
                            value: g.target,
                            min: g.current,
                            onChange: (e) => setGoals(
                              (prev) => prev.map(
                                (x) => x.id === editingId ? { ...x, target: Number(e.target.value) } : x
                              )
                            ),
                            placeholder: "Target $",
                            className: "flex-1 px-2 py-1.5 rounded text-[12px] outline-none",
                            style: {
                              background: "var(--os-border-subtle)",
                              border: "1px solid rgba(39,215,224,0.18)",
                              color: "var(--os-text-primary)",
                              colorScheme: "dark"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "date",
                            value: g.deadline,
                            onChange: (e) => setGoals(
                              (prev) => prev.map(
                                (x) => x.id === editingId ? { ...x, deadline: e.target.value } : x
                              )
                            ),
                            className: "flex-1 px-2 py-1.5 rounded text-[12px] outline-none",
                            style: {
                              background: "var(--os-border-subtle)",
                              border: "1px solid rgba(39,215,224,0.18)",
                              color: "var(--os-text-primary)",
                              colorScheme: "dark"
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              save(goals);
                              setEditingId(null);
                            },
                            "data-ocid": "financialgoals.save_button",
                            className: "flex-1 h-8 rounded-lg text-[12px] font-semibold",
                            style: {
                              background: "rgba(39,215,224,0.12)",
                              border: "1px solid rgba(39,215,224,0.3)",
                              color: "var(--os-accent)"
                            },
                            children: "Save"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setEditingId(null),
                            "data-ocid": "financialgoals.close_button",
                            className: "h-8 px-4 rounded-lg text-[12px]",
                            style: {
                              background: "var(--os-border-subtle)",
                              border: "1px solid var(--os-text-muted)",
                              color: muted
                            },
                            children: "Cancel"
                          }
                        )
                      ] })
                    ]
                  }
                )
              }
            );
          })()
        ] })
      ]
    }
  );
}
export {
  FinancialGoals as default
};
