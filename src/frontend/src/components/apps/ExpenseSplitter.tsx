import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgb(39,215,224)";

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
}

interface SplitterData {
  participants: string[];
  expenses: Expense[];
}

function calcSettlement(participants: string[], expenses: Expense[]): string[] {
  if (participants.length < 2 || expenses.length === 0) return [];
  const n = participants.length;
  const paid: Record<string, number> = {};
  for (const p of participants) paid[p] = 0;
  for (const e of expenses) {
    if (paid[e.paidBy] !== undefined) paid[e.paidBy] += e.amount;
  }
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const share = total / n;
  const net: Record<string, number> = {};
  for (const p of participants) net[p] = paid[p] - share;

  const creditors = participants
    .filter((p) => net[p] > 0.005)
    .map((p) => ({ name: p, amount: net[p] }));
  const debtors = participants
    .filter((p) => net[p] < -0.005)
    .map((p) => ({ name: p, amount: -net[p] }));
  const settlements: string[] = [];

  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci];
    const d = debtors[di];
    const amount = Math.min(c.amount, d.amount);
    settlements.push(`${d.name} pays ${c.name} $${amount.toFixed(2)}`);
    c.amount -= amount;
    d.amount -= amount;
    if (c.amount < 0.005) ci++;
    if (d.amount < 0.005) di++;
  }
  return settlements;
}

export function ExpenseSplitter() {
  const { data, set: setData } = useCanisterKV<SplitterData>(
    "decentos_expense_splitter",
    {
      participants: [],
      expenses: [],
    },
  );
  const [newPerson, setNewPerson] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expPaidBy, setExpPaidBy] = useState("");

  function addParticipant() {
    const name = newPerson.trim();
    if (!name || data.participants.includes(name)) return;
    setData({ ...data, participants: [...data.participants, name] });
    setNewPerson("");
    if (!expPaidBy) setExpPaidBy(name);
  }

  function removeParticipant(name: string) {
    setData({
      participants: data.participants.filter((p) => p !== name),
      expenses: data.expenses.filter((e) => e.paidBy !== name),
    });
  }

  function addExpense() {
    const amount = Number.parseFloat(expAmount);
    if (!expDesc.trim() || Number.isNaN(amount) || amount <= 0 || !expPaidBy)
      return;
    const expense: Expense = {
      id: Date.now().toString(),
      description: expDesc.trim(),
      amount,
      paidBy: expPaidBy,
    };
    setData({ ...data, expenses: [...data.expenses, expense] });
    setExpDesc("");
    setExpAmount("");
  }

  function removeExpense(id: string) {
    setData({ ...data, expenses: data.expenses.filter((e) => e.id !== id) });
  }

  const settlements = calcSettlement(data.participants, data.expenses);
  const total = data.expenses.reduce((s, e) => s + e.amount, 0);

  const sectionStyle: React.CSSProperties = {
    background: "var(--os-bg-elevated)",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: CYAN,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 10,
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--os-border-subtle)",
    border: `1px solid ${BORDER}`,
    borderRadius: 5,
    padding: "4px 8px",
    color: "#e2e8f0",
    fontSize: 12,
    outline: "none",
  };

  return (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        background: BG,
        color: "#e2e8f0",
        fontSize: 13,
        padding: 14,
      }}
    >
      {/* Participants */}
      <div style={sectionStyle}>
        <div style={labelStyle}>👥 Participants</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <input
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addParticipant()}
            placeholder="Name"
            data-ocid="splitter.input"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={addParticipant}
            data-ocid="splitter.primary_button"
            style={{
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
              gap: 4,
            }}
          >
            <Plus style={{ width: 14, height: 14 }} /> Add
          </button>
        </div>
        {data.participants.length === 0 && (
          <div
            data-ocid="splitter.empty_state"
            style={{ fontSize: 11, color: "var(--os-text-muted)" }}
          >
            No participants yet
          </div>
        )}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {data.participants.map((p) => (
            <span
              key={p}
              style={{
                background: "rgba(39,215,224,0.1)",
                border: "1px solid rgba(39,215,224,0.25)",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 12,
                color: CYAN,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {p}
              <button
                type="button"
                onClick={() => removeParticipant(p)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--os-text-secondary)",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X style={{ width: 11, height: 11 }} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Expenses */}
      <div style={sectionStyle}>
        <div style={labelStyle}>💳 Expenses</div>
        {data.participants.length >= 2 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              placeholder="Description"
              style={{ ...inputStyle, flex: 2, minWidth: 100 }}
            />
            <input
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              placeholder="$0.00"
              type="number"
              min="0"
              step="0.01"
              style={{ ...inputStyle, width: 80 }}
            />
            <select
              value={expPaidBy}
              onChange={(e) => setExpPaidBy(e.target.value)}
              data-ocid="splitter.select"
              style={{ ...inputStyle, minWidth: 90 }}
            >
              <option value="">Paid by…</option>
              {data.participants.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addExpense}
              data-ocid="splitter.submit_button"
              style={{
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
                gap: 4,
              }}
            >
              <Plus style={{ width: 14, height: 14 }} /> Add
            </button>
          </div>
        )}
        {data.participants.length < 2 && (
          <div
            style={{
              fontSize: 11,
              color: "var(--os-text-muted)",
              marginBottom: 8,
            }}
          >
            Add at least 2 participants first
          </div>
        )}
        {data.expenses.length === 0 && (
          <div style={{ fontSize: 11, color: "var(--os-text-muted)" }}>
            No expenses yet
          </div>
        )}
        {data.expenses.map((e, i) => (
          <div
            key={e.id}
            data-ocid={`splitter.item.${i + 1}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px",
              marginBottom: 4,
              background: "var(--os-border-subtle)",
              borderRadius: 5,
              border: "1px solid rgba(42,58,66,0.5)",
            }}
          >
            <span style={{ flex: 1, fontSize: 12 }}>{e.description}</span>
            <span style={{ color: CYAN, fontWeight: 700, marginRight: 8 }}>
              ${e.amount.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "var(--os-text-secondary)",
                marginRight: 8,
              }}
            >
              by {e.paidBy}
            </span>
            <button
              type="button"
              onClick={() => removeExpense(e.id)}
              data-ocid={`splitter.delete_button.${i + 1}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#f87171",
                padding: 2,
              }}
            >
              <Trash2 style={{ width: 13, height: 13 }} />
            </button>
          </div>
        ))}
        {data.expenses.length > 0 && (
          <div
            style={{
              textAlign: "right",
              fontSize: 12,
              color: "var(--os-text-secondary)",
              marginTop: 6,
            }}
          >
            Total:{" "}
            <strong style={{ color: "#e2e8f0" }}>${total.toFixed(2)}</strong>
          </div>
        )}
      </div>

      {/* Settlement */}
      <div style={sectionStyle}>
        <div style={labelStyle}>⚖️ Settlement</div>
        {settlements.length === 0 ? (
          <div style={{ fontSize: 11, color: "var(--os-text-muted)" }}>
            {data.participants.length < 2
              ? "Add participants and expenses to see settlement"
              : "Everyone is settled up! 🎉"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {settlements.map((s) => (
              <div
                key={s}
                data-ocid="splitter.row"
                style={{
                  padding: "8px 12px",
                  background: "rgba(39,215,224,0.06)",
                  border: "1px solid rgba(39,215,224,0.15)",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "#e2e8f0",
                }}
              >
                💸 {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
