import { DollarSign, PiggyBank, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface ExpenseCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
}

interface BudgetData {
  income: number;
  month: string;
  categories: ExpenseCategory[];
}

const PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  { id: "c1", name: "Housing", budget: 1500, spent: 1500, color: "#3b82f6" },
  {
    id: "c2",
    name: "Food & Dining",
    budget: 600,
    spent: 420,
    color: "#10b981",
  },
  { id: "c3", name: "Transport", budget: 300, spent: 185, color: "#f59e0b" },
  {
    id: "c4",
    name: "Entertainment",
    budget: 200,
    spent: 250,
    color: "#ef4444",
  },
  { id: "c5", name: "Utilities", budget: 150, spent: 130, color: "#8b5cf6" },
];

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(m: string): string {
  const [y, mo] = m.split("-").map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function genId() {
  return `cat_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
}

const DEFAULT_DATA: BudgetData = {
  income: 5000,
  month: currentMonth(),
  categories: DEFAULT_CATEGORIES,
};

export function BudgetPlanner() {
  const { data, set: saveData } = useCanisterKV<BudgetData>(
    "budget_planner_v1",
    DEFAULT_DATA,
  );
  const dataRef = useRef(data);
  dataRef.current = data;

  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatBudget, setNewCatBudget] = useState("");
  const [newCatColor, setNewCatColor] = useState(PALETTE[0]);
  const [editingSpent, setEditingSpent] = useState<string | null>(null);
  const [spentInput, setSpentInput] = useState("");

  const income = data?.income ?? 5000;
  const categories = data?.categories ?? DEFAULT_CATEGORIES;
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const remaining = income - totalSpent;

  const save = (patch: Partial<BudgetData>) => {
    saveData({ ...(dataRef.current ?? DEFAULT_DATA), ...patch });
    toast.success("Budget updated ✓");
  };

  const updateSpent = (id: string, spent: number) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, spent: Math.max(0, spent) } : c,
    );
    save({ categories: updated });
    setEditingSpent(null);
  };

  const removeCategory = (id: string) => {
    save({ categories: categories.filter((c) => c.id !== id) });
  };

  const addCategory = () => {
    if (!newCatName.trim() || !newCatBudget) return;
    const newCat: ExpenseCategory = {
      id: genId(),
      name: newCatName.trim(),
      budget: Number(newCatBudget),
      spent: 0,
      color: newCatColor,
    };
    save({ categories: [...categories, newCat] });
    setNewCatName("");
    setNewCatBudget("");
    setAddingCat(false);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--app-border)" }}
      >
        <div className="flex items-center gap-2">
          <PiggyBank className="w-4 h-4 opacity-70" />
          <span className="text-sm font-semibold">
            Budget Planner — {monthLabel(data?.month ?? currentMonth())}
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div
        className="grid grid-cols-3 gap-px border-b"
        style={{
          borderColor: "var(--app-border)",
          background: "var(--app-border)",
        }}
      >
        {[
          { label: "Income", value: income, color: "rgba(34,197,94,0.8)" },
          {
            label: "Budgeted",
            value: totalBudget,
            color: "rgba(99,102,241,0.8)",
          },
          {
            label: "Remaining",
            value: remaining,
            color:
              remaining >= 0 ? "rgba(34,197,94,0.8)" : "rgba(239,68,68,0.8)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center py-3"
            style={{ background: "var(--app-surface)" }}
          >
            <span className="text-[10px] opacity-50 mb-0.5">{s.label}</span>
            <span className="text-base font-bold" style={{ color: s.color }}>
              ${s.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Edit income */}
      <div
        className="px-4 py-2 border-b flex items-center gap-2"
        style={{ borderColor: "var(--app-border)" }}
      >
        <DollarSign className="w-3.5 h-3.5 opacity-50" />
        <span className="text-xs opacity-60">Monthly income:</span>
        {editingIncome ? (
          <>
            <input
              type="number"
              className="text-xs px-2 py-0.5 rounded w-24 bg-white/10 border border-white/20 outline-none"
              style={{ color: "var(--app-text)" }}
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const n = Number(incomeInput);
                  if (!Number.isNaN(n) && n > 0) save({ income: n });
                  setEditingIncome(false);
                }
                if (e.key === "Escape") setEditingIncome(false);
              }}
              data-ocid="budget.income.input"
            />
            <button
              type="button"
              onClick={() => {
                const n = Number(incomeInput);
                if (!Number.isNaN(n) && n > 0) save({ income: n });
                setEditingIncome(false);
              }}
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "rgba(99,102,241,0.2)",
                color: "rgba(129,140,248,0.9)",
              }}
              data-ocid="budget.income.save_button"
            >
              Save
            </button>
          </>
        ) : (
          <button
            type="button"
            className="text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ color: "rgba(34,197,94,0.8)" }}
            onClick={() => {
              setIncomeInput(String(income));
              setEditingIncome(true);
            }}
            data-ocid="budget.income.edit_button"
          >
            ${income.toLocaleString()} ✏️
          </button>
        )}
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {categories.map((cat, idx) => {
          const pct =
            cat.budget > 0 ? Math.min(100, (cat.spent / cat.budget) * 100) : 0;
          const over = cat.spent > cat.budget;
          return (
            <div
              key={cat.id}
              className="rounded-lg p-3"
              style={{
                background: "var(--app-surface)",
                border: "1px solid var(--app-border)",
              }}
              data-ocid={`budget.item.${idx + 1}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: over
                        ? "rgba(239,68,68,0.9)"
                        : "rgba(34,197,94,0.8)",
                    }}
                  >
                    ${cat.spent} / ${cat.budget}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCategory(cat.id)}
                    className="p-0.5 rounded hover:bg-red-500/20 transition-colors opacity-50 hover:opacity-100"
                    data-ocid={`budget.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "var(--os-border-subtle)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: over ? "#ef4444" : cat.color,
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] opacity-40">
                  {over
                    ? `$${cat.spent - cat.budget} over`
                    : `$${cat.budget - cat.spent} left`}
                </span>
                {editingSpent === cat.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      className="text-[10px] px-1.5 py-0.5 rounded w-16 bg-white/10 border border-white/20 outline-none"
                      style={{ color: "var(--app-text)" }}
                      value={spentInput}
                      onChange={(e) => setSpentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          updateSpent(cat.id, Number(spentInput));
                        if (e.key === "Escape") setEditingSpent(null);
                      }}
                      data-ocid="budget.spent.input"
                    />
                    <button
                      type="button"
                      onClick={() => updateSpent(cat.id, Number(spentInput))}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(99,102,241,0.2)",
                        color: "rgba(129,140,248,0.9)",
                      }}
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSpent(cat.id);
                      setSpentInput(String(cat.spent));
                    }}
                    className="text-[10px] opacity-50 hover:opacity-100 transition-opacity"
                    data-ocid={`budget.edit_button.${idx + 1}`}
                  >
                    Update spent
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add category */}
        {addingCat ? (
          <div
            className="rounded-lg p-3 space-y-2"
            style={{
              background: "var(--app-surface)",
              border: "1px dashed var(--app-border)",
            }}
          >
            <input
              placeholder="Category name"
              className="w-full text-xs px-2 py-1.5 rounded bg-white/10 border border-white/20 outline-none"
              style={{ color: "var(--app-text)" }}
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              data-ocid="budget.category.input"
            />
            <input
              type="number"
              placeholder="Monthly budget ($)"
              className="w-full text-xs px-2 py-1.5 rounded bg-white/10 border border-white/20 outline-none"
              style={{ color: "var(--app-text)" }}
              value={newCatBudget}
              onChange={(e) => setNewCatBudget(e.target.value)}
            />
            <div className="flex gap-1">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCatColor(c)}
                  className="w-5 h-5 rounded-full transition-transform"
                  style={{
                    background: c,
                    transform: newCatColor === c ? "scale(1.3)" : "scale(1)",
                    outline:
                      newCatColor === c
                        ? "2px solid white"
                        : "2px solid transparent",
                    outlineOffset: 1,
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addCategory}
                className="flex-1 text-xs py-1 rounded font-medium"
                style={{
                  background: "rgba(99,102,241,0.2)",
                  color: "rgba(129,140,248,0.9)",
                }}
                data-ocid="budget.category.submit_button"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setAddingCat(false)}
                className="flex-1 text-xs py-1 rounded opacity-60 hover:opacity-100"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingCat(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs opacity-50 hover:opacity-80 transition-opacity border border-dashed"
            style={{ borderColor: "var(--app-border)" }}
            data-ocid="budget.primary_button"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Category
          </button>
        )}
      </div>

      {/* Footer totals */}
      <div
        className="px-4 py-2 border-t text-[11px] flex items-center justify-between opacity-60"
        style={{ borderColor: "var(--app-border)" }}
      >
        <span>Total spent: ${totalSpent.toLocaleString()}</span>
        <span>
          Unbudgeted: ${Math.max(0, income - totalBudget).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
