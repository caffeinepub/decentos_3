import {
  Car,
  Check,
  GraduationCap,
  Home,
  Pencil,
  Plane,
  Plus,
  Shield,
  ShoppingBag,
  Target,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type GoalCategory =
  | "Emergency Fund"
  | "Vacation"
  | "Gadget"
  | "Home"
  | "Car"
  | "Education"
  | "Other";

interface SavingsGoal {
  id: string;
  name: string;
  category: GoalCategory;
  target: number;
  current: number;
  deadline: string;
}

const CATEGORY_ICONS: Record<
  GoalCategory,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  "Emergency Fund": Shield,
  Vacation: Plane,
  Gadget: ShoppingBag,
  Home: Home,
  Car: Car,
  Education: GraduationCap,
  Other: Target,
};

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  "Emergency Fund": "#22c55e",
  Vacation: "#27D7E0",
  Gadget: "#a78bfa",
  Home: "#f59e0b",
  Car: "#f97316",
  Education: "#3b82f6",
  Other: "#64748b",
};

function genId() {
  return `goal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

interface FinancialGoalsProps {
  windowProps?: Record<string, unknown>;
}

export default function FinancialGoals({
  windowProps: _w,
}: FinancialGoalsProps) {
  const {
    data: persisted,
    set: save,
    loading,
  } = useCanisterKV<SavingsGoal[]>("financial_goals", []);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addFundsId, setAddFundsId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SavingsGoal, "id" | "current">>({
    name: "",
    category: "Other",
    target: 1000,
    deadline: "",
  });
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (persisted.length > 0) setGoals(persisted);
    else {
      const defaults: SavingsGoal[] = [
        {
          id: genId(),
          name: "Emergency Fund",
          category: "Emergency Fund",
          target: 10000,
          current: 3200,
          deadline: "2025-12-31",
        },
        {
          id: genId(),
          name: "Japan Trip",
          category: "Vacation",
          target: 4500,
          current: 1200,
          deadline: "2025-07-01",
        },
        {
          id: genId(),
          name: "New Laptop",
          category: "Gadget",
          target: 2000,
          current: 800,
          deadline: "2025-04-01",
        },
      ];
      setGoals(defaults);
      save(defaults);
    }
  }, [loading, persisted, save]);

  const addGoal = useCallback(() => {
    if (!form.name.trim() || form.target <= 0) return;
    const g: SavingsGoal = {
      id: genId(),
      ...form,
      current: 0,
      name: form.name.trim(),
    };
    setGoals((prev) => {
      const updated = [...prev, g];
      save(updated);
      return updated;
    });
    setForm({ name: "", category: "Other", target: 1000, deadline: "" });
    setShowAdd(false);
  }, [form, save]);

  const deleteGoal = useCallback(
    (id: string) => {
      setGoals((prev) => {
        const updated = prev.filter((g) => g.id !== id);
        save(updated);
        return updated;
      });
    },
    [save],
  );

  const applyFunds = useCallback(() => {
    const amt = Number.parseFloat(addAmount);
    if (!addFundsId || Number.isNaN(amt) || amt <= 0) {
      setAddFundsId(null);
      return;
    }
    setGoals((prev) => {
      const updated = prev.map((g) =>
        g.id === addFundsId
          ? { ...g, current: Math.min(g.target, g.current + amt) }
          : g,
      );
      save(updated);
      return updated;
    });
    setAddFundsId(null);
    setAddAmount("");
  }, [addFundsId, addAmount, save]);

  const totalTarget = goals.reduce((a, g) => a + g.target, 0);
  const totalCurrent = goals.reduce((a, g) => a + g.current, 0);
  const overallPct =
    totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  const muted = "var(--os-text-secondary)";

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(8,14,20,0.95)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center gap-3 flex-shrink-0"
        style={{
          borderColor: "rgba(39,215,224,0.12)",
          background: "rgba(10,16,20,0.6)",
        }}
      >
        <Target className="w-4 h-4" style={{ color: "var(--os-accent)" }} />
        <div className="flex-1">
          <p
            className="text-[11px] font-semibold"
            style={{ color: "var(--os-text-primary)" }}
          >
            Financial Goals
          </p>
          <p className="text-[10px]" style={{ color: muted }}>
            ${totalCurrent.toLocaleString()} saved of $
            {totalTarget.toLocaleString()} total
          </p>
        </div>
        {/* Overall bar */}
        <div className="flex items-center gap-2">
          <div
            className="w-24 h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--os-border-subtle)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${overallPct}%`,
                background: "var(--os-accent)",
              }}
            />
          </div>
          <span
            className="text-[11px] font-bold"
            style={{ color: "var(--os-accent)" }}
          >
            {overallPct}%
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          data-ocid="financialgoals.add_button"
          className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-semibold transition-all hover:brightness-125"
          style={{
            background: "rgba(39,215,224,0.12)",
            border: "1px solid rgba(39,215,224,0.3)",
            color: "var(--os-accent)",
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Goal
        </button>
      </div>

      {/* Goals grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {goals.length === 0 && !showAdd ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-3"
            data-ocid="financialgoals.empty_state"
          >
            <Target
              className="w-12 h-12"
              style={{ color: "rgba(39,215,224,0.15)" }}
            />
            <p className="text-sm" style={{ color: muted }}>
              No goals yet
            </p>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="px-4 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "rgba(39,215,224,0.12)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "var(--os-accent)",
              }}
            >
              + Create First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {goals.map((g, i) => {
              const Icon = CATEGORY_ICONS[g.category];
              const color = CATEGORY_COLORS[g.category];
              const pct =
                g.target > 0 ? Math.round((g.current / g.target) * 100) : 0;
              const completed = pct >= 100;
              return (
                <div
                  key={g.id}
                  data-ocid={`financialgoals.card.${i + 1}`}
                  className="rounded-xl p-3 flex flex-col gap-2 relative"
                  style={{
                    background: "var(--os-bg-elevated)",
                    border: `1px solid ${completed ? `${color}55` : "rgba(39,215,224,0.12)"}`,
                  }}
                >
                  {/* Card header */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${color}18`,
                        border: `1px solid ${color}33`,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[12px] font-semibold truncate"
                        style={{ color: "var(--os-text-primary)" }}
                      >
                        {g.name}
                      </p>
                      <p className="text-[10px]" style={{ color: muted }}>
                        {g.category}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(g.id);
                        }}
                        data-ocid={`financialgoals.edit_button.${i + 1}`}
                        className="w-6 h-6 rounded flex items-center justify-center transition-all"
                        style={{
                          background: "var(--os-border-subtle)",
                          color: muted,
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteGoal(g.id)}
                        data-ocid={`financialgoals.delete_button.${i + 1}`}
                        className="w-6 h-6 rounded flex items-center justify-center transition-all"
                        style={{
                          background: "rgba(239,68,68,0.07)",
                          color: "rgba(239,68,68,0.5)",
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-bold" style={{ color }}>
                      ${g.current.toLocaleString()}
                    </span>
                    <span className="text-[11px]" style={{ color: muted }}>
                      of ${g.target.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--os-border-subtle)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color }}
                    >
                      {pct}%
                    </span>
                    {g.deadline && (
                      <span className="text-[10px]" style={{ color: muted }}>
                        by {g.deadline}
                      </span>
                    )}
                  </div>

                  {/* Add funds inline */}
                  {addFundsId === g.id ? (
                    <div className="flex gap-1.5 mt-1">
                      <input
                        type="number"
                        min={0}
                        step={10}
                        placeholder="Amount"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        data-ocid={`financialgoals.input.${i + 1}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") applyFunds();
                          if (e.key === "Escape") setAddFundsId(null);
                        }}
                        className="flex-1 px-2 py-1 rounded text-[11px] outline-none"
                        style={{
                          background: "var(--os-border-subtle)",
                          border: "1px solid rgba(39,215,224,0.2)",
                          color: "var(--os-text-primary)",
                          colorScheme: "dark",
                        }}
                      />
                      <button
                        type="button"
                        onClick={applyFunds}
                        data-ocid={`financialgoals.confirm_button.${i + 1}`}
                        className="w-7 h-7 rounded flex items-center justify-center"
                        style={{ background: `${color}22`, color }}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddFundsId(null)}
                        data-ocid={`financialgoals.cancel_button.${i + 1}`}
                        className="w-7 h-7 rounded flex items-center justify-center"
                        style={{
                          background: "var(--os-border-subtle)",
                          color: muted,
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    !completed && (
                      <button
                        type="button"
                        onClick={() => {
                          setAddFundsId(g.id);
                          setAddAmount("");
                        }}
                        data-ocid={`financialgoals.secondary_button.${i + 1}`}
                        className="w-full h-7 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all hover:brightness-125 mt-1"
                        style={{
                          background: `${color}12`,
                          border: `1px solid ${color}30`,
                          color,
                        }}
                      >
                        <Plus className="w-3 h-3" /> Add Funds
                      </button>
                    )
                  )}

                  {completed && (
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      <Check className="w-3 h-3" style={{ color }} />
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color }}
                      >
                        Goal Reached! 🎉
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add goal form */}
        {showAdd && (
          <div
            className="mt-4 rounded-xl p-4 space-y-3"
            data-ocid="financialgoals.modal"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1px solid rgba(39,215,224,0.2)",
            }}
          >
            <p
              className="text-[12px] font-semibold"
              style={{ color: "var(--os-accent)" }}
            >
              New Savings Goal
            </p>
            <input
              type="text"
              placeholder="Goal name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              data-ocid="financialgoals.input"
              className="w-full px-2 py-1.5 rounded text-[12px] outline-none"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.18)",
                color: "var(--os-text-primary)",
              }}
            />
            <div className="flex gap-2">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    category: e.target.value as GoalCategory,
                  }))
                }
                data-ocid="financialgoals.select"
                className="flex-1 px-2 py-1.5 rounded text-[12px] outline-none"
                style={{
                  background: "rgba(10,16,20,0.9)",
                  border: "1px solid rgba(39,215,224,0.18)",
                  color: "var(--os-text-primary)",
                  colorScheme: "dark",
                }}
              >
                {Object.keys(CATEGORY_ICONS).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Target $"
                min={1}
                value={form.target}
                onChange={(e) =>
                  setForm((p) => ({ ...p, target: Number(e.target.value) }))
                }
                className="w-28 px-2 py-1.5 rounded text-[12px] outline-none"
                style={{
                  background: "var(--os-border-subtle)",
                  border: "1px solid rgba(39,215,224,0.18)",
                  color: "var(--os-text-primary)",
                  colorScheme: "dark",
                }}
              />
              <input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deadline: e.target.value }))
                }
                className="w-36 px-2 py-1.5 rounded text-[12px] outline-none"
                style={{
                  background: "var(--os-border-subtle)",
                  border: "1px solid rgba(39,215,224,0.18)",
                  color: "var(--os-text-primary)",
                  colorScheme: "dark",
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addGoal}
                data-ocid="financialgoals.submit_button"
                className="flex-1 h-8 rounded-lg text-[12px] font-semibold transition-all"
                style={{
                  background: "rgba(39,215,224,0.12)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "var(--os-accent)",
                }}
              >
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                data-ocid="financialgoals.cancel_button"
                className="h-8 px-4 rounded-lg text-[12px] transition-all"
                style={{
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-text-muted)",
                  color: muted,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit modal placeholder - just delete + readd for simplicity */}
        {editingId &&
          (() => {
            const g = goals.find((x) => x.id === editingId);
            if (!g) return null;
            return (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ background: "rgba(0,0,0,0.6)" }}
              >
                <div
                  className="rounded-xl p-4 w-72 space-y-3"
                  data-ocid="financialgoals.dialog"
                  style={{
                    background: "var(--os-bg-app)",
                    border: "1px solid rgba(39,215,224,0.25)",
                  }}
                >
                  <p
                    className="text-[12px] font-semibold"
                    style={{ color: "var(--os-accent)" }}
                  >
                    Edit Goal
                  </p>
                  <input
                    type="text"
                    value={g.name}
                    onChange={(e) =>
                      setGoals((prev) =>
                        prev.map((x) =>
                          x.id === editingId
                            ? { ...x, name: e.target.value }
                            : x,
                        ),
                      )
                    }
                    data-ocid="financialgoals.textarea"
                    className="w-full px-2 py-1.5 rounded text-[12px] outline-none"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: "1px solid rgba(39,215,224,0.18)",
                      color: "var(--os-text-primary)",
                    }}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={g.target}
                      min={g.current}
                      onChange={(e) =>
                        setGoals((prev) =>
                          prev.map((x) =>
                            x.id === editingId
                              ? { ...x, target: Number(e.target.value) }
                              : x,
                          ),
                        )
                      }
                      placeholder="Target $"
                      className="flex-1 px-2 py-1.5 rounded text-[12px] outline-none"
                      style={{
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(39,215,224,0.18)",
                        color: "var(--os-text-primary)",
                        colorScheme: "dark",
                      }}
                    />
                    <input
                      type="date"
                      value={g.deadline}
                      onChange={(e) =>
                        setGoals((prev) =>
                          prev.map((x) =>
                            x.id === editingId
                              ? { ...x, deadline: e.target.value }
                              : x,
                          ),
                        )
                      }
                      className="flex-1 px-2 py-1.5 rounded text-[12px] outline-none"
                      style={{
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(39,215,224,0.18)",
                        color: "var(--os-text-primary)",
                        colorScheme: "dark",
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        save(goals);
                        setEditingId(null);
                      }}
                      data-ocid="financialgoals.save_button"
                      className="flex-1 h-8 rounded-lg text-[12px] font-semibold"
                      style={{
                        background: "rgba(39,215,224,0.12)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "var(--os-accent)",
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      data-ocid="financialgoals.close_button"
                      className="h-8 px-4 rounded-lg text-[12px]"
                      style={{
                        background: "var(--os-border-subtle)",
                        border: "1px solid var(--os-text-muted)",
                        color: muted,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
}
