import { CheckCircle2, Flame, Plus, Trash2, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Habit {
  id: string;
  name: string;
  color: string;
  entries: string[];
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function computeStreak(entries: string[]): {
  current: number;
  longest: number;
} {
  if (entries.length === 0) return { current: 0, longest: 0 };
  const sorted = [...new Set(entries)].sort().reverse();
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let current = 0;
  if (sorted[0] === today || sorted[0] === yesterday) {
    let check = sorted[0];
    for (const d of sorted) {
      if (d === check) {
        current++;
        const prev = new Date(check);
        prev.setDate(prev.getDate() - 1);
        check = prev.toISOString().split("T")[0];
      } else break;
    }
  }

  let longest = 0;
  let run = 1;
  const asc = [...new Set(entries)].sort();
  for (let i = 1; i < asc.length; i++) {
    const prev = new Date(asc[i - 1]);
    prev.setDate(prev.getDate() + 1);
    if (prev.toISOString().split("T")[0] === asc[i]) {
      run++;
    } else {
      longest = Math.max(longest, run);
      run = 1;
    }
  }
  longest = Math.max(longest, run);

  return { current, longest };
}

const HABIT_COLORS = [
  "#27D7E0",
  "#22c55e",
  "#f59e0b",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
];

function genId() {
  return `h_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

interface HabitStreaksProps {
  windowProps?: Record<string, unknown>;
}

export function HabitStreaks({ windowProps: _w }: HabitStreaksProps) {
  const {
    data: persisted,
    set: save,
    loading,
  } = useCanisterKV<Habit[]>("habitstreaks_v1", []);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(HABIT_COLORS[0]);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (persisted.length > 0) setHabits(persisted);
  }, [loading, persisted]);

  const addHabit = useCallback(() => {
    if (!newName.trim()) return;
    const h: Habit = {
      id: genId(),
      name: newName.trim(),
      color: newColor,
      entries: [],
    };
    setHabits((prev) => {
      const updated = [h, ...prev];
      save(updated);
      return updated;
    });
    setNewName("");
    setAdding(false);
  }, [newName, newColor, save]);

  const deleteHabit = useCallback(
    (id: string) => {
      setHabits((prev) => {
        const updated = prev.filter((h) => h.id !== id);
        save(updated);
        return updated;
      });
    },
    [save],
  );

  const checkIn = useCallback(
    (id: string) => {
      const today = todayStr();
      setHabits((prev) => {
        const updated = prev.map((h) => {
          if (h.id !== id) return h;
          if (h.entries.includes(today)) return h;
          return { ...h, entries: [...h.entries, today] };
        });
        save(updated);
        return updated;
      });
    },
    [save],
  );

  const today = todayStr();
  const muted = "var(--os-text-secondary)";
  const panel = {
    background: "var(--os-bg-elevated)",
    border: "1px solid rgba(39,215,224,0.15)",
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(8,14,20,0.95)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(39,215,224,0.12)",
          background: "rgba(10,16,20,0.7)",
        }}
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4" style={{ color: "#F97316" }} />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--os-text-primary)" }}
          >
            Habit Streaks
          </span>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          data-ocid="habitstreaks.add_button"
          className="flex items-center gap-1.5 px-3 h-7 rounded-lg text-[11px] font-semibold transition-all hover:brightness-125"
          style={{
            background: "rgba(39,215,224,0.12)",
            border: "1px solid rgba(39,215,224,0.3)",
            color: "var(--os-accent)",
          }}
        >
          <Plus className="w-3.5 h-3.5" /> New Habit
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {adding && (
          <div
            className="rounded-xl p-4 space-y-3"
            style={panel}
            data-ocid="habitstreaks.dialog"
          >
            <p
              className="text-[12px] font-semibold"
              style={{ color: "var(--os-accent)" }}
            >
              New Habit
            </p>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              placeholder="Habit name (e.g. Morning run)"
              data-ocid="habitstreaks.input"
              className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.2)",
                color: "var(--os-text-primary)",
              }}
            />
            <div className="flex gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className="w-6 h-6 rounded-full transition-all"
                  style={{
                    background: c,
                    boxShadow:
                      newColor === c
                        ? "0 0 0 2px var(--os-text-secondary)"
                        : "none",
                    transform: newColor === c ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addHabit}
                data-ocid="habitstreaks.submit_button"
                className="flex-1 h-8 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  background: "rgba(39,215,224,0.14)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "var(--os-accent)",
                }}
              >
                Add Habit
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setNewName("");
                }}
                data-ocid="habitstreaks.cancel_button"
                className="h-8 px-4 rounded-lg text-[11px] transition-all"
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

        {habits.length === 0 && !adding && (
          <div
            className="flex flex-col items-center justify-center h-48 gap-3"
            data-ocid="habitstreaks.empty_state"
          >
            <Flame
              className="w-12 h-12"
              style={{ color: "rgba(249,115,22,0.2)" }}
            />
            <p className="text-sm" style={{ color: muted }}>
              No habits yet — start your streak!
            </p>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="px-4 h-8 rounded-lg text-[12px] font-semibold transition-all"
              style={{
                background: "rgba(39,215,224,0.12)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "var(--os-accent)",
              }}
            >
              + Add First Habit
            </button>
          </div>
        )}

        {habits.map((habit, idx) => {
          const { current, longest } = computeStreak(habit.entries);
          const checkedToday = habit.entries.includes(today);
          const flames = Array.from({ length: 14 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            const dateStr = d.toISOString().split("T")[0];
            return { dateStr, done: habit.entries.includes(dateStr) };
          });

          return (
            <div
              key={habit.id}
              data-ocid={`habitstreaks.item.${idx + 1}`}
              className="rounded-xl p-4 space-y-3"
              style={{
                ...panel,
                borderColor: checkedToday
                  ? `${habit.color}40`
                  : "rgba(39,215,224,0.15)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: habit.color }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--os-text-primary)" }}
                  >
                    {habit.name}
                  </span>
                  {checkedToday && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{
                        background: `${habit.color}20`,
                        color: habit.color,
                        border: `1px solid ${habit.color}40`,
                      }}
                    >
                      Done today ✓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!checkedToday && (
                    <button
                      type="button"
                      onClick={() => checkIn(habit.id)}
                      data-ocid={`habitstreaks.checkbox.${idx + 1}`}
                      className="flex items-center gap-1 px-2.5 h-7 rounded-lg text-[11px] font-semibold transition-all hover:brightness-125"
                      style={{
                        background: `${habit.color}18`,
                        border: `1px solid ${habit.color}50`,
                        color: habit.color,
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Check in
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteHabit(habit.id)}
                    data-ocid={`habitstreaks.delete_button.${idx + 1}`}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:brightness-125"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.15)",
                      color: "rgba(239,68,68,0.6)",
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <Flame
                    className="w-3.5 h-3.5"
                    style={{ color: current > 0 ? "#F97316" : muted }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: current > 0 ? "#F97316" : muted }}
                  >
                    {current}
                  </span>
                  <span className="text-[11px]" style={{ color: muted }}>
                    current
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy
                    className="w-3.5 h-3.5"
                    style={{ color: "rgba(251,191,36,0.7)" }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: "rgba(251,191,36,0.9)" }}
                  >
                    {longest}
                  </span>
                  <span className="text-[11px]" style={{ color: muted }}>
                    best
                  </span>
                </div>
                <span className="text-[11px]" style={{ color: muted }}>
                  {habit.entries.length} total days
                </span>
              </div>
              <div className="flex gap-1">
                {flames.map(({ dateStr, done }) => (
                  <div
                    key={dateStr}
                    className="flex-1 h-6 rounded flex items-center justify-center text-[12px]"
                    style={{
                      background: done
                        ? `${habit.color}20`
                        : "var(--os-border-subtle)",
                      border: done
                        ? `1px solid ${habit.color}40`
                        : "1px solid var(--os-border-subtle)",
                    }}
                  >
                    {done ? "🔥" : ""}
                  </div>
                ))}
              </div>
              <p
                className="text-[10px] text-right"
                style={{ color: "var(--os-text-muted)" }}
              >
                ← 14 days
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
