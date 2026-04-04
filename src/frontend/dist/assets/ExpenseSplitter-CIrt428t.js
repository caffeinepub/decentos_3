import { r as reactExports, j as jsxRuntimeExports, X, T as Trash2 } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgb(39,215,224)";
function calcSettlement(participants, expenses) {
  if (participants.length < 2 || expenses.length === 0) return [];
  const n = participants.length;
  const paid = {};
  for (const p of participants) paid[p] = 0;
  for (const e of expenses) {
    if (paid[e.paidBy] !== void 0) paid[e.paidBy] += e.amount;
  }
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const share = total / n;
  const net = {};
  for (const p of participants) net[p] = paid[p] - share;
  const creditors = participants.filter((p) => net[p] > 5e-3).map((p) => ({ name: p, amount: net[p] }));
  const debtors = participants.filter((p) => net[p] < -5e-3).map((p) => ({ name: p, amount: -net[p] }));
  const settlements = [];
  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci];
    const d = debtors[di];
    const amount = Math.min(c.amount, d.amount);
    settlements.push(`${d.name} pays ${c.name} $${amount.toFixed(2)}`);
    c.amount -= amount;
    d.amount -= amount;
    if (c.amount < 5e-3) ci++;
    if (d.amount < 5e-3) di++;
  }
  return settlements;
}
function ExpenseSplitter() {
  const { data, set: setData } = useCanisterKV(
    "decentos_expense_splitter",
    {
      participants: [],
      expenses: []
    }
  );
  const [newPerson, setNewPerson] = reactExports.useState("");
  const [expDesc, setExpDesc] = reactExports.useState("");
  const [expAmount, setExpAmount] = reactExports.useState("");
  const [expPaidBy, setExpPaidBy] = reactExports.useState("");
  function addParticipant() {
    const name = newPerson.trim();
    if (!name || data.participants.includes(name)) return;
    setData({ ...data, participants: [...data.participants, name] });
    setNewPerson("");
    if (!expPaidBy) setExpPaidBy(name);
  }
  function removeParticipant(name) {
    setData({
      participants: data.participants.filter((p) => p !== name),
      expenses: data.expenses.filter((e) => e.paidBy !== name)
    });
  }
  function addExpense() {
    const amount = Number.parseFloat(expAmount);
    if (!expDesc.trim() || Number.isNaN(amount) || amount <= 0 || !expPaidBy)
      return;
    const expense = {
      id: Date.now().toString(),
      description: expDesc.trim(),
      amount,
      paidBy: expPaidBy
    };
    setData({ ...data, expenses: [...data.expenses, expense] });
    setExpDesc("");
    setExpAmount("");
  }
  function removeExpense(id) {
    setData({ ...data, expenses: data.expenses.filter((e) => e.id !== id) });
  }
  const settlements = calcSettlement(data.participants, data.expenses);
  const total = data.expenses.reduce((s, e) => s + e.amount, 0);
  const sectionStyle = {
    background: "var(--os-bg-elevated)",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14
  };
  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: CYAN,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 10
  };
  const inputStyle = {
    background: "var(--os-border-subtle)",
    border: `1px solid ${BORDER}`,
    borderRadius: 5,
    padding: "4px 8px",
    color: "#e2e8f0",
    fontSize: 12,
    outline: "none"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        height: "100%",
        overflow: "auto",
        background: BG,
        color: "#e2e8f0",
        fontSize: 13,
        padding: 14
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "👥 Participants" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginBottom: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newPerson,
                onChange: (e) => setNewPerson(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && addParticipant(),
                placeholder: "Name",
                "data-ocid": "splitter.input",
                style: { ...inputStyle, flex: 1 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: addParticipant,
                "data-ocid": "splitter.primary_button",
                style: {
                  background: CYAN,
                  color: "#000",
                  border: "none",
                  borderRadius: 5,
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { style: { width: 14, height: 14 } }),
                  " Add"
                ]
              }
            )
          ] }),
          data.participants.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "splitter.empty_state",
              style: { fontSize: 11, color: "var(--os-text-muted)" },
              children: "No participants yet"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: data.participants.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              style: {
                background: "rgba(39,215,224,0.1)",
                border: "1px solid rgba(39,215,224,0.25)",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 12,
                color: CYAN,
                display: "flex",
                alignItems: "center",
                gap: 5
              },
              children: [
                p,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeParticipant(p),
                    style: {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--os-text-secondary)",
                      padding: 0,
                      display: "flex",
                      alignItems: "center"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { style: { width: 11, height: 11 } })
                  }
                )
              ]
            },
            p
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "💳 Expenses" }),
          data.participants.length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                gap: 6,
                marginBottom: 10,
                flexWrap: "wrap"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: expDesc,
                    onChange: (e) => setExpDesc(e.target.value),
                    placeholder: "Description",
                    style: { ...inputStyle, flex: 2, minWidth: 100 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: expAmount,
                    onChange: (e) => setExpAmount(e.target.value),
                    placeholder: "$0.00",
                    type: "number",
                    min: "0",
                    step: "0.01",
                    style: { ...inputStyle, width: 80 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: expPaidBy,
                    onChange: (e) => setExpPaidBy(e.target.value),
                    "data-ocid": "splitter.select",
                    style: { ...inputStyle, minWidth: 90 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Paid by…" }),
                      data.participants.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p, children: p }, p))
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: addExpense,
                    "data-ocid": "splitter.submit_button",
                    style: {
                      background: CYAN,
                      color: "#000",
                      border: "none",
                      borderRadius: 5,
                      padding: "4px 12px",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { style: { width: 14, height: 14 } }),
                      " Add"
                    ]
                  }
                )
              ]
            }
          ),
          data.participants.length < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 11,
                color: "var(--os-text-muted)",
                marginBottom: 8
              },
              children: "Add at least 2 participants first"
            }
          ),
          data.expenses.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "var(--os-text-muted)" }, children: "No expenses yet" }),
          data.expenses.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `splitter.item.${i + 1}`,
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 8px",
                marginBottom: 4,
                background: "var(--os-border-subtle)",
                borderRadius: 5,
                border: "1px solid rgba(42,58,66,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, fontSize: 12 }, children: e.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: CYAN, fontWeight: 700, marginRight: 8 }, children: [
                  "$",
                  e.amount.toFixed(2)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: {
                      fontSize: 10,
                      color: "var(--os-text-secondary)",
                      marginRight: 8
                    },
                    children: [
                      "by ",
                      e.paidBy
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeExpense(e.id),
                    "data-ocid": `splitter.delete_button.${i + 1}`,
                    style: {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#f87171",
                      padding: 2
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { style: { width: 13, height: 13 } })
                  }
                )
              ]
            },
            e.id
          )),
          data.expenses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                textAlign: "right",
                fontSize: 12,
                color: "var(--os-text-secondary)",
                marginTop: 6
              },
              children: [
                "Total:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { style: { color: "#e2e8f0" }, children: [
                  "$",
                  total.toFixed(2)
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle, children: "⚖️ Settlement" }),
          settlements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "var(--os-text-muted)" }, children: data.participants.length < 2 ? "Add participants and expenses to see settlement" : "Everyone is settled up! 🎉" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: settlements.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "splitter.row",
              style: {
                padding: "8px 12px",
                background: "rgba(39,215,224,0.06)",
                border: "1px solid rgba(39,215,224,0.15)",
                borderRadius: 6,
                fontSize: 13,
                color: "#e2e8f0"
              },
              children: [
                "💸 ",
                s
              ]
            },
            s
          )) })
        ] })
      ]
    }
  );
}
export {
  ExpenseSplitter
};
