import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type TxType = "income" | "expense";

interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  note: string;
  date: string;
}

const INCOME_CATS = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const EXPENSE_CATS = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];

const SAMPLE_TXS: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 4200,
    category: "Salary",
    note: "March salary",
    date: "2026-03-01",
  },
  {
    id: "2",
    type: "income",
    amount: 850,
    category: "Freelance",
    note: "ICP consulting",
    date: "2026-03-10",
  },
  {
    id: "3",
    type: "expense",
    amount: 120,
    category: "Food",
    note: "Weekly groceries",
    date: "2026-03-15",
  },
  {
    id: "4",
    type: "expense",
    amount: 45,
    category: "Transport",
    note: "Monthly transit pass",
    date: "2026-03-02",
  },
  {
    id: "5",
    type: "expense",
    amount: 299,
    category: "Entertainment",
    note: "Tech conference ticket",
    date: "2026-03-18",
  },
];

export function BudgetTracker() {
  const {
    data: transactions,
    set: setTransactionsKV,
    loading,
  } = useCanisterKV<Transaction[]>("decentos_budget", SAMPLE_TXS);
  const [showForm, setShowForm] = useState(false);
  const [txType, setTxType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [note, setNote] = useState("");

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
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
        date: new Date().toISOString().split("T")[0],
      },
      ...transactions,
    ]);
    setAmount("");
    setNote("");
    setShowForm(false);
  };

  if (loading)
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{ background: "rgba(11,15,18,0.6)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(11,15,18,0.6)" }}
    >
      <div
        className="flex gap-3 p-4 border-b flex-shrink-0"
        style={{ borderColor: "rgba(42,58,66,0.8)" }}
      >
        <div
          className="flex-1 rounded-xl p-3"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <p
            className="text-[10px] mb-1"
            style={{ color: "rgba(16,185,129,0.6)" }}
          >
            Income
          </p>
          <p
            className="text-base font-bold"
            style={{ color: "rgba(16,185,129,0.9)" }}
          >
            ${totalIncome.toLocaleString()}
          </p>
        </div>
        <div
          className="flex-1 rounded-xl p-3"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <p
            className="text-[10px] mb-1"
            style={{ color: "rgba(239,68,68,0.6)" }}
          >
            Expenses
          </p>
          <p
            className="text-base font-bold"
            style={{ color: "rgba(239,68,68,0.9)" }}
          >
            ${totalExpense.toLocaleString()}
          </p>
        </div>
        <div
          className="flex-1 rounded-xl p-3"
          style={{
            background:
              balance >= 0 ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
            border: `1px solid ${balance >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`,
          }}
        >
          <p
            className="text-[10px] mb-1"
            style={{ color: "rgba(180,200,210,0.5)" }}
          >
            Balance
          </p>
          <p
            className="text-base font-bold"
            style={{
              color:
                balance >= 0 ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)",
            }}
          >
            ${Math.abs(balance).toLocaleString()}
          </p>
        </div>
      </div>
      {showForm && (
        <div
          className="p-4 border-b flex-shrink-0"
          style={{
            background: "rgba(18,32,38,0.5)",
            borderColor: "rgba(42,58,66,0.8)",
          }}
        >
          <div className="flex gap-2 mb-3">
            {(["expense", "income"] as TxType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTxType(t);
                  setCategory(
                    t === "income" ? INCOME_CATS[0] : EXPENSE_CATS[0],
                  );
                }}
                data-ocid={`budget.${t}.toggle`}
                className="flex-1 h-7 rounded text-xs capitalize transition-all"
                style={
                  txType === t
                    ? {
                        background:
                          t === "income"
                            ? "rgba(16,185,129,0.2)"
                            : "rgba(239,68,68,0.2)",
                        border: `1px solid ${t === "income" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                        color:
                          t === "income"
                            ? "rgba(16,185,129,1)"
                            : "rgba(239,68,68,1)",
                      }
                    : {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(42,58,66,0.5)",
                        color: "rgba(180,200,210,0.5)",
                      }
                }
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <DollarSign
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: "rgba(180,200,210,0.4)" }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-ocid="budget.input"
                className="w-full h-8 pl-7 pr-3 rounded-md text-xs bg-white/5 border outline-none"
                style={{
                  border: "1px solid rgba(42,58,66,0.8)",
                  color: "rgba(220,235,240,0.9)",
                }}
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              data-ocid="budget.select"
              className="flex-1 h-8 px-2 rounded-md text-xs bg-white/5 border outline-none"
              style={{
                border: "1px solid rgba(42,58,66,0.8)",
                color: "rgba(220,235,240,0.9)",
                background: "rgba(18,32,38,0.9)",
              }}
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            data-ocid="budget.note.input"
            className="w-full h-8 px-3 mb-2 rounded-md text-xs bg-white/5 border outline-none"
            style={{
              border: "1px solid rgba(42,58,66,0.8)",
              color: "rgba(220,235,240,0.9)",
            }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addTx}
              data-ocid="budget.submit_button"
              className="flex-1 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "rgba(16,185,129,0.14)",
                border: "1px solid rgba(16,185,129,0.35)",
                color: "rgba(16,185,129,1)",
              }}
            >
              Add Transaction
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              data-ocid="budget.cancel_button"
              className="h-8 px-3 rounded-lg text-xs transition-colors"
              style={{ color: "rgba(180,200,210,0.5)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <div
          className="flex items-center justify-between px-4 py-2 sticky top-0"
          style={{
            background: "rgba(11,15,18,0.8)",
            borderBottom: "1px solid rgba(42,58,66,0.5)",
          }}
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(180,200,210,0.3)" }}
          >
            Transactions
          </span>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            data-ocid="budget.primary_button"
            className="flex items-center gap-1 h-6 px-2.5 rounded text-[10px] transition-all"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "rgba(16,185,129,0.9)",
            }}
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        {transactions.length === 0 && (
          <div
            className="flex flex-col items-center justify-center h-24 gap-1"
            data-ocid="budget.empty_state"
          >
            <p className="text-xs" style={{ color: "rgba(180,200,210,0.3)" }}>
              No transactions yet
            </p>
          </div>
        )}
        <div className="divide-y" style={{ borderColor: "rgba(42,58,66,0.3)" }}>
          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              data-ocid={`budget.item.${i + 1}`}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    tx.type === "income"
                      ? "rgba(16,185,129,0.12)"
                      : "rgba(239,68,68,0.12)",
                }}
              >
                {tx.type === "income" ? (
                  <ArrowUpRight
                    className="w-3.5 h-3.5"
                    style={{ color: "rgba(16,185,129,0.8)" }}
                  />
                ) : (
                  <ArrowDownLeft
                    className="w-3.5 h-3.5"
                    style={{ color: "rgba(239,68,68,0.8)" }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "rgba(220,235,240,0.85)" }}
                  >
                    {tx.category}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(180,200,210,0.35)" }}
                  >
                    {tx.date}
                  </span>
                </div>
                {tx.note && (
                  <p
                    className="text-[10px] truncate"
                    style={{ color: "rgba(180,200,210,0.4)" }}
                  >
                    {tx.note}
                  </p>
                )}
              </div>
              <span
                className="text-sm font-semibold flex-shrink-0"
                style={{
                  color:
                    tx.type === "income"
                      ? "rgba(16,185,129,0.9)"
                      : "rgba(239,68,68,0.9)",
                }}
              >
                {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() =>
                  setTransactionsKV(transactions.filter((t) => t.id !== tx.id))
                }
                data-ocid={`budget.delete_button.${i + 1}`}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/10 transition-colors"
              >
                <Trash2
                  className="w-3 h-3"
                  style={{ color: "rgba(239,68,68,0.4)" }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
