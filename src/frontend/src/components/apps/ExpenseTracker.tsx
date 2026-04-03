import { DollarSign, PlusCircle, Trash2, TrendingDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Utilities",
  "Other",
] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Food: "rgba(245,158,11,",
  Transport: "rgba(6,182,212,",
  Entertainment: "rgba(168,85,247,",
  Health: "rgba(34,197,94,",
  Shopping: "rgba(236,72,153,",
  Utilities: "rgba(99,102,241,",
  Other: "rgba(148,163,184,",
};

interface Expense {
  id: number;
  amount: number;
  category: Category;
  date: string;
  notes: string;
}

export function ExpenseTracker() {
  const { data: expenses, set: setExpenses } = useCanisterKV<Expense[]>(
    "decent-expenses",
    [],
  );
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "overview">("list");

  const addExpense = () => {
    const val = Number.parseFloat(amount);
    if (!amount || Number.isNaN(val) || val <= 0) return;
    const newExpense: Expense = {
      id: Date.now(),
      amount: val,
      category,
      date,
      notes,
    };
    setExpenses(
      [newExpense, ...expenses].sort((a, b) => b.date.localeCompare(a.date)),
    );
    setAmount("");
    setNotes("");
  };

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);

  const byCategory = useMemo(() => {
    const map: Partial<Record<Category, number>> = {};
    for (const e of monthExpenses) {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    }
    return map;
  }, [monthExpenses]);

  const maxCatVal = Math.max(...Object.values(byCategory), 1);

  return (
    <div
      className="flex flex-col h-full text-sm"
      style={{ background: "transparent", color: "#e2e8f0" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <DollarSign
            className="w-4 h-4"
            style={{ color: "rgb(39,215,224)" }}
          />
          <span className="font-semibold text-foreground">Expense Tracker</span>
        </div>
        <div className="flex gap-1">
          {(["list", "overview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              data-ocid={`expense.${t}.tab`}
              onClick={() => setActiveTab(t)}
              className="px-3 py-1 rounded text-xs capitalize transition-all"
              style={{
                background:
                  activeTab === t
                    ? "rgba(39,215,224,0.15)"
                    : "var(--os-border-subtle)",
                border: `1px solid ${activeTab === t ? "rgba(39,215,224,0.4)" : "var(--os-border-subtle)"}`,
                color:
                  activeTab === t ? "rgb(39,215,224)" : "rgba(148,163,184,0.8)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Add expense form */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
      >
        <div className="flex flex-wrap gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addExpense()}
            data-ocid="expense.input"
            className="flex-1 min-w-[80px] px-2 py-1.5 rounded text-xs bg-muted/50 border focus:outline-none focus:border-cyan-500/50"
            style={{
              border: "1px solid var(--os-text-muted)",
              color: "#e2e8f0",
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            data-ocid="expense.select"
            className="px-2 py-1.5 rounded text-xs bg-muted/50 focus:outline-none"
            style={{
              border: "1px solid var(--os-text-muted)",
              color: "#e2e8f0",
            }}
          >
            {CATEGORIES.map((c) => (
              <option
                key={c}
                value={c}
                style={{ background: "var(--os-bg-app)" }}
              >
                {c}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-2 py-1.5 rounded text-xs bg-muted/50 focus:outline-none"
            style={{
              border: "1px solid var(--os-text-muted)",
              color: "#e2e8f0",
            }}
          />
          <input
            type="text"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addExpense()}
            data-ocid="expense.textarea"
            className="flex-1 min-w-[120px] px-2 py-1.5 rounded text-xs bg-muted/50 focus:outline-none"
            style={{
              border: "1px solid var(--os-text-muted)",
              color: "#e2e8f0",
            }}
          />
          <button
            type="button"
            onClick={addExpense}
            data-ocid="expense.add_button"
            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-all"
            style={{
              background: "rgba(39,215,224,0.12)",
              border: "1px solid rgba(39,215,224,0.3)",
              color: "rgb(39,215,224)",
            }}
          >
            <PlusCircle className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 py-3">
        {activeTab === "list" ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">
                This month:{" "}
                {now.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="font-bold" style={{ color: "rgb(39,215,224)" }}>
                ${monthTotal.toFixed(2)}
              </span>
            </div>
            {expenses.length === 0 ? (
              <div
                data-ocid="expense.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <TrendingDown className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No expenses yet. Add your first one above.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {expenses.map((e, i) => (
                  <div
                    key={e.id}
                    data-ocid={`expense.item.${i + 1}`}
                    className="flex items-center gap-3 px-3 py-2 rounded group"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-border-subtle)",
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: `${CATEGORY_COLORS[e.category]}0.8)`,
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: `${CATEGORY_COLORS[e.category]}0.7)` }}
                    >
                      {e.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {e.date}
                    </span>
                    <span className="text-xs text-muted-foreground truncate flex-1">
                      {e.notes}
                    </span>
                    <span className="font-semibold text-foreground flex-shrink-0">
                      ${e.amount.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExpense(e.id)}
                      data-ocid={`expense.delete_button.${i + 1}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-1">
                Total this month
              </div>
              <div className="text-2xl font-bold text-foreground">
                ${monthTotal.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => {
                const val = byCategory[cat] ?? 0;
                const pct = (val / maxCatVal) * 100;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: `${CATEGORY_COLORS[cat]}0.8)` }}>
                        {cat}
                      </span>
                      <span className="text-foreground">${val.toFixed(2)}</span>
                    </div>
                    <div
                      className="h-2 rounded-full"
                      style={{ background: "var(--os-border-subtle)" }}
                    >
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: `${CATEGORY_COLORS[cat]}0.7)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
