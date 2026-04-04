import { r as reactExports, j as jsxRuntimeExports, T as Trash2 } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
const CATEGORIES = [
  {
    id: "income",
    label: "Income",
    color: "rgba(74,222,128,0.9)",
    bg: "rgba(74,222,128,0.08)"
  },
  {
    id: "expenses",
    label: "Expenses",
    color: "rgba(251,113,133,0.9)",
    bg: "rgba(251,113,133,0.08)"
  },
  {
    id: "assets",
    label: "Assets",
    color: "rgba(74,222,128,0.9)",
    bg: "rgba(74,222,128,0.08)"
  },
  {
    id: "liabilities",
    label: "Liabilities",
    color: "rgba(251,191,36,0.9)",
    bg: "rgba(251,191,36,0.08)"
  }
];
function sum(entries) {
  return entries.reduce((acc, e) => acc + e.amount, 0);
}
function PersonalFinance({
  windowProps: _windowProps
}) {
  const { data, set: setData } = useCanisterKV(
    "decentos_personal_finance",
    { income: [], expenses: [], assets: [], liabilities: [] }
  );
  const [activeTab, setActiveTab] = reactExports.useState("income");
  const [newName, setNewName] = reactExports.useState("");
  const [newAmount, setNewAmount] = reactExports.useState("");
  const netWorth = sum(data.assets) + sum(data.income) - sum(data.expenses) - sum(data.liabilities);
  const addEntry = () => {
    const amt = Number.parseFloat(newAmount);
    if (!newName.trim() || Number.isNaN(amt)) return;
    const entry = {
      id: Date.now().toString(),
      name: newName.trim(),
      amount: amt
    };
    const updated = { ...data, [activeTab]: [...data[activeTab], entry] };
    setData(updated);
    setNewName("");
    setNewAmount("");
  };
  const deleteEntry = (cat, id) => {
    const updated = { ...data, [cat]: data[cat].filter((e) => e.id !== id) };
    setData(updated);
  };
  const activeCat = CATEGORIES.find((c) => c.id === activeTab);
  const sectionStyle = {
    background: "rgba(18,32,38,0.6)",
    border: "1px solid rgba(42,58,66,0.7)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: "rgba(11,15,18,0.7)" },
      "data-ocid": "personalfinance.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-3 flex-shrink-0",
            style: {
              background: "rgba(18,32,38,0.8)",
              borderBottom: "1px solid rgba(42,58,66,0.7)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5", children: "Net Worth" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-2xl font-bold font-mono",
                  style: {
                    color: netWorth >= 0 ? "rgba(74,222,128,0.95)" : "rgba(251,113,133,0.95)"
                  },
                  children: [
                    netWorth >= 0 ? "+" : "-",
                    "$",
                    Math.abs(netWorth).toLocaleString("en-US", {
                      minimumFractionDigits: 2
                    })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-0 px-4 flex-shrink-0",
            style: { borderBottom: "1px solid rgba(42,58,66,0.5)" },
            children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(c.id),
                "data-ocid": `personalfinance.${c.id}.tab`,
                className: "px-4 py-2 text-xs capitalize transition-colors",
                style: {
                  color: activeTab === c.id ? c.color : "var(--os-text-secondary)",
                  borderBottom: activeTab === c.id ? `2px solid ${c.color}` : "2px solid transparent"
                },
                children: c.label
              },
              c.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-4 py-3 flex-shrink-0",
            style: { borderBottom: "1px solid rgba(42,58,66,0.4)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Name",
                  value: newName,
                  onChange: (e) => setNewName(e.target.value),
                  "data-ocid": "personalfinance.input",
                  className: "flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none rounded px-2.5 py-1.5",
                  style: sectionStyle
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  placeholder: "Amount",
                  value: newAmount,
                  onChange: (e) => setNewAmount(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && addEntry(),
                  "data-ocid": "personalfinance.textarea",
                  className: "w-28 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none rounded px-2.5 py-1.5",
                  style: sectionStyle
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: addEntry,
                  "data-ocid": "personalfinance.primary_button",
                  className: "px-3 py-1.5 rounded text-xs transition-colors flex-shrink-0",
                  style: {
                    background: activeCat.bg,
                    border: `1px solid ${activeCat.color}40`,
                    color: activeCat.color
                  },
                  children: "Add"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: data[activeTab].length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/30",
            "data-ocid": "personalfinance.empty_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", children: [
              "No ",
              activeCat.label.toLowerCase(),
              " entries yet"
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: data[activeTab].map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-lg px-3 py-2",
            style: sectionStyle,
            "data-ocid": `personalfinance.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/80", children: entry.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-mono font-semibold",
                    style: { color: activeCat.color },
                    children: [
                      "$",
                      entry.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2
                      })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => deleteEntry(activeTab, entry.id),
                    "data-ocid": `personalfinance.delete_button.${i + 1}`,
                    className: "text-muted-foreground/40 hover:text-destructive transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ]
          },
          entry.id
        )) }) })
      ]
    }
  );
}
export {
  PersonalFinance
};
