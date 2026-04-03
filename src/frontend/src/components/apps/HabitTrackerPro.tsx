import { Check, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  completions: string[]; // YYYY-MM-DD
}

interface Store {
  habits: Habit[];
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getLast28Days(): string[] {
  const days: string[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  }
  return days;
}

function calcStreaks(completions: string[]): {
  current: number;
  longest: number;
} {
  if (completions.length === 0) return { current: 0, longest: 0 };
  const sorted = [...completions].sort();
  const set = new Set(sorted);

  // Current streak (from today backwards)
  let current = 0;
  const today = todayKey();
  let check = new Date();
  while (true) {
    const key = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, "0")}-${String(check.getDate()).padStart(2, "0")}`;
    if (key > today) {
      check.setDate(check.getDate() - 1);
      continue;
    }
    if (set.has(key)) {
      current++;
      check.setDate(check.getDate() - 1);
    } else break;
  }

  // Longest streak
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const dateStr of sorted) {
    const d = new Date(`${dateStr}T00:00:00`);
    if (prev) {
      const diff = (d.getTime() - prev.getTime()) / 86400000;
      if (diff === 1) {
        run++;
      } else {
        run = 1;
      }
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = d;
  }

  return { current, longest };
}

export function HabitTrackerPro() {
  const today = todayKey();
  const last28 = getLast28Days();

  const { data: store, set: _setStore } = useCanisterKV<Store>(
    "decent-habits-pro",
    { habits: [] },
  );

  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("✅");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const save = _setStore;

  const toggle = (habitId: string) => {
    const updated = store.habits.map((h) => {
      if (h.id !== habitId) return h;
      const has = h.completions.includes(today);
      return {
        ...h,
        completions: has
          ? h.completions.filter((d) => d !== today)
          : [...h.completions, today],
      };
    });
    save({ habits: updated });
  };

  const addHabit = () => {
    if (!newName.trim()) {
      toast.error("Enter a habit name");
      return;
    }
    const h: Habit = {
      id: `h-${Date.now()}`,
      name: newName.trim(),
      emoji: newEmoji || "✅",
      createdAt: today,
      completions: [],
    };
    save({ habits: [...store.habits, h] });
    setNewName("");
    setNewEmoji("✅");
    setShowAdd(false);
    toast.success(`Habit "${h.name}" added`);
  };

  const deleteHabit = (id: string) => {
    save({ habits: store.habits.filter((h) => h.id !== id) });
    setDeleteId(null);
    toast.success("Habit deleted");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(9,13,16,0.95)" }}
      data-ocid="habitpro.panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "rgba(12,22,30,0.9)",
          borderColor: "rgba(39,215,224,0.15)",
        }}
      >
        <div>
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--os-accent)" }}
          >
            Habit Tracker Pro
          </h2>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{today}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((p) => !p)}
          data-ocid="habitpro.primary_button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: "rgba(39,215,224,0.12)",
            border: "1px solid rgba(39,215,224,0.3)",
            color: "var(--os-accent)",
          }}
        >
          <Plus className="w-3.5 h-3.5" /> Add Habit
        </button>
      </div>

      {/* Add habit form */}
      {showAdd && (
        <div
          className="flex-shrink-0 px-4 py-3 border-b flex items-center gap-2"
          style={{
            background: "rgba(39,215,224,0.04)",
            borderColor: "rgba(39,215,224,0.15)",
          }}
          data-ocid="habitpro.dialog"
        >
          <input
            type="text"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            maxLength={2}
            className="w-10 text-center text-lg bg-transparent outline-none rounded"
            style={{ border: "1px solid var(--os-text-muted)" }}
            placeholder="✅"
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            placeholder="Habit name..."
            data-ocid="habitpro.input"
            className="flex-1 rounded-lg px-3 py-1.5 text-xs bg-transparent outline-none"
            style={{
              border: "1px solid rgba(39,215,224,0.25)",
              color: "var(--os-text-primary)",
            }}
          />
          <button
            type="button"
            onClick={addHabit}
            data-ocid="habitpro.confirm_button"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              background: "rgba(39,215,224,0.15)",
              border: "1px solid rgba(39,215,224,0.35)",
              color: "var(--os-accent)",
            }}
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(false)}
            data-ocid="habitpro.cancel_button"
            className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Habit list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {store.habits.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="habitpro.empty_state"
          >
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              No habits yet
            </p>
            <p className="text-xs text-muted-foreground/60">
              Click "Add Habit" to start building your routine
            </p>
          </div>
        ) : (
          store.habits.map((habit, i) => {
            const { current, longest } = calcStreaks(habit.completions);
            const doneToday = habit.completions.includes(today);

            return (
              <div
                key={habit.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "var(--os-border-subtle)",
                  border: doneToday
                    ? "1px solid rgba(39,215,224,0.3)"
                    : "1px solid var(--os-border-subtle)",
                }}
                data-ocid={`habitpro.item.${i + 1}`}
              >
                {/* Row */}
                <div className="flex items-center gap-3 px-3 py-3">
                  <button
                    type="button"
                    onClick={() => toggle(habit.id)}
                    data-ocid={`habitpro.checkbox.${i + 1}`}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: doneToday
                        ? "rgba(39,215,224,0.2)"
                        : "var(--os-border-subtle)",
                      border: doneToday
                        ? "2px solid rgba(39,215,224,0.6)"
                        : "2px solid var(--os-text-muted)",
                    }}
                  >
                    {doneToday ? (
                      <Check
                        className="w-4 h-4"
                        style={{ color: "var(--os-accent)" }}
                      />
                    ) : (
                      <span className="text-sm">{habit.emoji}</span>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          doneToday
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {habit.emoji} {habit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--os-accent)" }}
                      >
                        🔥 {current} day{current !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">
                        Best: {longest}
                      </span>
                    </div>
                  </div>

                  {deleteId === habit.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => deleteHabit(habit.id)}
                        data-ocid="habitpro.confirm_button"
                        className="text-[10px] px-2 py-1 rounded"
                        style={{
                          background: "rgba(239,68,68,0.15)",
                          color: "#EF4444",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(null)}
                        data-ocid="habitpro.cancel_button"
                        className="text-[10px] px-2 py-1 rounded text-muted-foreground/60 hover:text-foreground"
                        style={{ border: "1px solid var(--os-text-muted)" }}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteId(habit.id)}
                      data-ocid={`habitpro.delete_button.${i + 1}`}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/15 text-muted-foreground/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 4-week heatmap */}
                <div
                  className="px-3 pb-3"
                  style={{ borderTop: "1px solid var(--os-border-subtle)" }}
                >
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-widest mt-2 mb-1.5">
                    Last 28 days
                  </p>
                  <div className="grid grid-cols-7 gap-0.5">
                    {last28.map((day) => {
                      const done = habit.completions.includes(day);
                      const isToday = day === today;
                      return (
                        <div
                          key={day}
                          title={day}
                          className="aspect-square rounded-sm"
                          style={{
                            background: done
                              ? "rgba(39,215,224,0.6)"
                              : "var(--os-border-subtle)",
                            outline: isToday
                              ? "1px solid rgba(39,215,224,0.5)"
                              : "none",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
