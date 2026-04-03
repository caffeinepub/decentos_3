import { r as reactExports, j as jsxRuntimeExports, aK as CreditCard, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import { C as CircleAlert } from "./circle-alert-m71Brf6C.js";
const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgba(39,215,224,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.45)";
const BTN_BG = "rgba(39,215,224,0.12)";
const BTN_BORDER = "rgba(39,215,224,0.3)";
const INPUT_STYLE = {
  background: "var(--os-border-subtle)",
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  color: TEXT,
  padding: "6px 10px",
  fontSize: 12,
  outline: "none",
  width: "100%"
};
const CATEGORY_COLORS = {
  streaming: "rgba(168,85,247,0.8)",
  software: "rgba(39,215,224,0.8)",
  utilities: "rgba(245,158,11,0.8)",
  other: "rgba(148,163,184,0.8)"
};
function getRenewalStatus(dateStr) {
  const diff = (new Date(dateStr).getTime() - Date.now()) / 864e5;
  if (diff < 0) return "overdue";
  if (diff < 7) return "soon";
  return "ok";
}
const EMPTY = {
  name: "",
  cost: 0,
  billingCycle: "monthly",
  renewalDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  category: "software",
  status: "active",
  notes: ""
};
function SubscriptionTracker() {
  const { data: subs, set: setSubs } = useCanisterKV(
    "decent-subscriptions",
    []
  );
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY);
  const activeSubs = subs.filter((s) => s.status === "active");
  const monthlyTotal = activeSubs.reduce((sum, s) => {
    return sum + (s.billingCycle === "monthly" ? s.cost : s.cost / 12);
  }, 0);
  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowAdd(true);
  };
  const openEdit = (s) => {
    setForm({
      name: s.name,
      cost: s.cost,
      billingCycle: s.billingCycle,
      renewalDate: s.renewalDate,
      category: s.category,
      status: s.status,
      notes: s.notes
    });
    setEditId(s.id);
    setShowAdd(true);
  };
  const saveSub = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setSubs(subs.map((s) => s.id === editId ? { ...s, ...form } : s));
    } else {
      setSubs([...subs, { id: `sub_${Date.now()}`, ...form }]);
    }
    setShowAdd(false);
    setEditId(null);
  };
  const deleteSub = (id) => setSubs(subs.filter((s) => s.id !== id));
  const sorted = [...subs].sort(
    (a, b) => a.renewalDate.localeCompare(b.renewalDate)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: BG, color: TEXT, fontSize: 13 },
      "data-ocid": "subscriptions.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-4 border-b flex items-center justify-between",
            style: { borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4", style: { color: CYAN } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: "Subscription Tracker" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: openAdd,
                  className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium",
                  style: {
                    background: BTN_BG,
                    border: `1px solid ${BTN_BORDER}`,
                    color: CYAN
                  },
                  "data-ocid": "subscriptions.primary_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                    " Add"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-3 border-b",
            style: { borderColor: BORDER, background: "rgba(39,215,224,0.04)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: MUTED }, children: "Total Monthly Cost" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold", style: { color: CYAN }, children: [
                  "$",
                  monthlyTotal.toFixed(2),
                  "/mo"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex gap-4 text-xs", style: { color: MUTED }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  activeSubs.length,
                  " active subscription",
                  activeSubs.length !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "$",
                  (monthlyTotal * 12).toFixed(2),
                  "/yr"
                ] })
              ] })
            ]
          }
        ),
        showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-4 border-b",
            style: { borderColor: BORDER, background: "rgba(10,16,20,0.8)" },
            "data-ocid": "subscriptions.modal",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "block text-[10px] font-semibold mb-1",
                      style: { color: CYAN },
                      children: "NAME"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: form.name,
                      onChange: (e) => setForm({ ...form, name: e.target.value }),
                      placeholder: "Netflix, Spotify...",
                      style: INPUT_STYLE,
                      "data-ocid": "subscriptions.input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "block text-[10px] font-semibold mb-1",
                      style: { color: CYAN },
                      children: "COST ($)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: form.cost,
                      onChange: (e) => setForm({ ...form, cost: Number(e.target.value) }),
                      style: INPUT_STYLE,
                      "data-ocid": "subscriptions.input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "block text-[10px] font-semibold mb-1",
                      style: { color: CYAN },
                      children: "BILLING"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: form.billingCycle,
                      onChange: (e) => setForm({
                        ...form,
                        billingCycle: e.target.value
                      }),
                      style: INPUT_STYLE,
                      "data-ocid": "subscriptions.select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "monthly", children: "Monthly" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yearly", children: "Yearly" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "block text-[10px] font-semibold mb-1",
                      style: { color: CYAN },
                      children: "RENEWAL DATE"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "date",
                      value: form.renewalDate,
                      onChange: (e) => setForm({ ...form, renewalDate: e.target.value }),
                      style: INPUT_STYLE,
                      "data-ocid": "subscriptions.input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "block text-[10px] font-semibold mb-1",
                      style: { color: CYAN },
                      children: "CATEGORY"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: form.category,
                      onChange: (e) => setForm({ ...form, category: e.target.value }),
                      style: INPUT_STYLE,
                      "data-ocid": "subscriptions.select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "streaming", children: "Streaming" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "software", children: "Software" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "utilities", children: "Utilities" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "Other" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "block text-[10px] font-semibold mb-1",
                      style: { color: CYAN },
                      children: "STATUS"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: form.status,
                      onChange: (e) => setForm({ ...form, status: e.target.value }),
                      style: INPUT_STYLE,
                      "data-ocid": "subscriptions.select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Active" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cancelled", children: "Cancelled" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "block text-[10px] font-semibold mb-1",
                      style: { color: CYAN },
                      children: "NOTES"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: form.notes,
                      onChange: (e) => setForm({ ...form, notes: e.target.value }),
                      placeholder: "Optional notes",
                      style: INPUT_STYLE,
                      "data-ocid": "subscriptions.input"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: saveSub,
                    disabled: !form.name.trim(),
                    className: "flex-1 py-2 rounded-lg text-xs font-medium",
                    style: {
                      background: BTN_BG,
                      border: `1px solid ${BTN_BORDER}`,
                      color: CYAN,
                      opacity: form.name.trim() ? 1 : 0.5
                    },
                    "data-ocid": "subscriptions.save_button",
                    children: editId ? "Update" : "Add Subscription"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowAdd(false),
                    className: "px-4 py-2 rounded-lg text-xs",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT
                    },
                    "data-ocid": "subscriptions.cancel_button",
                    children: "Cancel"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-full",
            style: { color: MUTED },
            "data-ocid": "subscriptions.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-10 h-10 mb-3 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No subscriptions yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Add your first subscription above" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: sorted.map((s, i) => {
          const status = getRenewalStatus(s.renewalDate);
          const renewColor = status === "overdue" ? "rgba(248,113,113,0.9)" : status === "soon" ? "rgba(251,191,36,0.9)" : MUTED;
          const monthlyCost = s.billingCycle === "monthly" ? s.cost : s.cost / 12;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-3 rounded-xl flex items-center gap-3",
              style: {
                background: "rgba(10,16,20,0.6)",
                border: `1px solid ${s.status === "cancelled" ? "rgba(42,58,66,0.4)" : BORDER}`,
                opacity: s.status === "cancelled" ? 0.6 : 1
              },
              "data-ocid": `subscriptions.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-2 h-2 rounded-full flex-shrink-0",
                    style: { background: CATEGORY_COLORS[s.category] }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-medium text-sm truncate",
                        style: { color: TEXT },
                        children: s.name
                      }
                    ),
                    s.status === "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] px-1.5 py-0.5 rounded",
                        style: {
                          background: "rgba(148,163,184,0.15)",
                          color: MUTED
                        },
                        children: "cancelled"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: MUTED }, children: s.category }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-xs flex items-center gap-1",
                        style: { color: renewColor },
                        children: [
                          status !== "ok" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3" }),
                          "Renews ",
                          new Date(s.renewalDate).toLocaleDateString()
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold", style: { color: CYAN }, children: [
                    "$",
                    s.cost.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", style: { color: MUTED }, children: s.billingCycle === "yearly" ? `$${monthlyCost.toFixed(2)}/mo` : "monthly" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => openEdit(s),
                      className: "p-1.5 rounded-lg transition-colors",
                      style: { color: CYAN, background: BTN_BG },
                      "data-ocid": `subscriptions.edit_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Plus,
                        {
                          className: "w-3 h-3",
                          style: { transform: "rotate(45deg)" }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => deleteSub(s.id),
                      className: "p-1.5 rounded-lg transition-colors",
                      style: {
                        color: "rgba(248,113,113,0.8)",
                        background: "rgba(248,113,113,0.08)"
                      },
                      "data-ocid": `subscriptions.delete_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                    }
                  )
                ] })
              ]
            },
            s.id
          );
        }) }) })
      ]
    }
  );
}
export {
  SubscriptionTracker
};
