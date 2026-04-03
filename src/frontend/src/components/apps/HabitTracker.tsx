import { Check, Flame, Grid, List, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Habit {
  id: string;
  name: string;
  emoji: string;
  completions: string[];
}

function getDatesBack(daysAgo: number[]): string[] {
  const today = new Date();
  return daysAgo.map((d) => {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    return date.toISOString().split("T")[0];
  });
}

const SAMPLE_HABITS: Habit[] = [
  {
    id: "1",
    name: "Morning workout",
    emoji: "💪",
    completions: getDatesBack([0, 1, 2, 3, 5]),
  },
  {
    id: "2",
    name: "Read for 30 min",
    emoji: "📚",
    completions: getDatesBack([0, 1, 3, 4, 5, 6]),
  },
  {
    id: "3",
    name: "Meditate",
    emoji: "🧘",
    completions: getDatesBack([0, 2, 4]),
  },
  {
    id: "4",
    name: "Drink 8 glasses",
    emoji: "💧",
    completions: getDatesBack([0, 1, 2]),
  },
];

function getStreak(completions: string[]): number {
  const set = new Set(completions);
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (set.has(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function getLast7Days(): string[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function getLast30Days(): string[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });
}

const HABIT_EMOJIS = ["✅", "💪", "📚", "🧘", "💧", "🏃", "🎯", "🌱"];

function GridView({ habits, today }: { habits: Habit[]; today: string }) {
  const last30 = getLast30Days();
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      {habits.length === 0 && (
        <div
          className="flex flex-col items-center justify-center h-32 gap-2"
          data-ocid="habittracker.empty_state"
        >
          <p className="text-xs" style={{ color: "rgba(180,200,210,0.3)" }}>
            No habits yet. Add one above!
          </p>
        </div>
      )}
      {habits.map((habit, hIdx) => {
        const streak = getStreak(habit.completions);
        const set = new Set(habit.completions);
        const doneCount = last30.filter((d) => set.has(d)).length;
        return (
          <div key={habit.id} data-ocid={`habittracker.item.${hIdx + 1}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{habit.emoji}</span>
              <span
                className="text-xs font-medium"
                style={{ color: "rgba(220,235,240,0.85)" }}
              >
                {habit.name}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <Flame
                  className="w-3 h-3"
                  style={{
                    color:
                      streak > 0
                        ? "rgba(251,146,60,0.8)"
                        : "rgba(180,200,210,0.2)",
                  }}
                />
                <span
                  className="text-[10px]"
                  style={{
                    color:
                      streak > 0
                        ? "rgba(251,146,60,0.7)"
                        : "rgba(180,200,210,0.3)",
                  }}
                >
                  {streak}d
                </span>
                <span
                  className="text-[10px] ml-2"
                  style={{ color: "rgba(39,215,224,0.5)" }}
                >
                  {doneCount}/30
                </span>
              </div>
            </div>
            <div
              className="grid gap-[3px]"
              style={{ gridTemplateColumns: "repeat(30, 1fr)" }}
            >
              {last30.map((d) => {
                const done = set.has(d);
                const isToday = d === today;
                return (
                  <div
                    key={d}
                    title={`${d}${done ? " ✓" : ""}`}
                    className="rounded-[2px]"
                    style={{
                      height: 12,
                      background: done
                        ? "rgba(34,197,94,0.75)"
                        : "var(--os-border-subtle)",
                      border: isToday
                        ? "1px solid rgba(39,215,224,0.6)"
                        : "none",
                      transition: "background 0.15s",
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-1">
              <span
                className="text-[9px]"
                style={{ color: "rgba(180,200,210,0.25)" }}
              >
                30 days ago
              </span>
              <span
                className="text-[9px]"
                style={{ color: "rgba(39,215,224,0.5)" }}
              >
                today
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HabitTracker() {
  const {
    data: habits,
    set: setHabitsKV,
    loading,
  } = useCanisterKV<Habit[]>("decentos_habits", SAMPLE_HABITS);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState(HABIT_EMOJIS[0]);
  const [view, setView] = useState<"list" | "grid">("list");

  const today = new Date().toISOString().split("T")[0];
  const last7 = getLast7Days();

  const toggle = (id: string) => {
    const updated = habits.map((h) => {
      if (h.id !== id) return h;
      const done = h.completions.includes(today);
      return {
        ...h,
        completions: done
          ? h.completions.filter((d) => d !== today)
          : [...h.completions, today],
      };
    });
    setHabitsKV(updated);
  };

  const deleteHabit = (id: string) => {
    setHabitsKV(habits.filter((h) => h.id !== id));
  };

  const addHabit = () => {
    if (!newName.trim()) return;
    const updated = [
      ...habits,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        emoji: newEmoji,
        completions: [],
      },
    ];
    setHabitsKV(updated);
    setNewName("");
    setShowAdd(false);
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ background: "rgba(11,15,18,0.6)" }}
      >
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "rgba(39,215,224,0.7)" }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(11,15,18,0.6)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(42,58,66,0.8)",
          background: "rgba(10,16,20,0.5)",
        }}
      >
        <div>
          <h2
            className="text-sm font-semibold"
            style={{ color: "rgba(220,235,240,0.9)" }}
          >
            Habit Tracker
          </h2>
          <p
            className="text-[10px]"
            style={{ color: "rgba(180,200,210,0.35)" }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(42,58,66,0.8)" }}
          >
            <button
              type="button"
              onClick={() => setView("list")}
              data-ocid="habittracker.list.tab"
              title="List view"
              className="w-7 h-7 flex items-center justify-center transition-all"
              style={{
                background:
                  view === "list" ? "rgba(34,197,94,0.12)" : "transparent",
                color:
                  view === "list"
                    ? "rgba(34,197,94,0.9)"
                    : "rgba(180,200,210,0.4)",
              }}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              data-ocid="habittracker.grid.tab"
              title="30-day grid view"
              className="w-7 h-7 flex items-center justify-center transition-all"
              style={{
                background:
                  view === "grid" ? "rgba(39,215,224,0.12)" : "transparent",
                color:
                  view === "grid"
                    ? "rgba(39,215,224,0.9)"
                    : "rgba(180,200,210,0.4)",
              }}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            data-ocid="habittracker.primary_button"
            className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs transition-all"
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "rgba(34,197,94,0.9)",
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      {showAdd && (
        <div
          className="p-4 border-b flex-shrink-0"
          style={{
            background: "rgba(18,32,38,0.6)",
            borderColor: "rgba(42,58,66,0.8)",
          }}
        >
          <p
            className="text-[11px] mb-2"
            style={{ color: "rgba(180,200,210,0.5)" }}
          >
            Pick an emoji and name your habit
          </p>
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {HABIT_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setNewEmoji(e)}
                data-ocid="habittracker.toggle"
                className="w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all"
                style={
                  newEmoji === e
                    ? {
                        background: "rgba(34,197,94,0.2)",
                        border: "1px solid rgba(34,197,94,0.5)",
                      }
                    : {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(42,58,66,0.4)",
                      }
                }
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Habit name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              data-ocid="habittracker.input"
              className="flex-1 h-8 px-3 rounded-md text-xs bg-white/5 border outline-none"
              style={{
                border: "1px solid rgba(42,58,66,0.8)",
                color: "rgba(220,235,240,0.9)",
              }}
            />
            <button
              type="button"
              onClick={addHabit}
              data-ocid="habittracker.submit_button"
              className="h-8 px-3 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.35)",
                color: "rgba(34,197,94,1)",
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              data-ocid="habittracker.cancel_button"
              className="h-8 px-3 rounded-lg text-xs"
              style={{ color: "rgba(180,200,210,0.5)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {view === "grid" ? (
        <GridView habits={habits} today={today} />
      ) : (
        <>
          <div
            className="flex items-center px-4 py-2 border-b flex-shrink-0"
            style={{ borderColor: "rgba(42,58,66,0.4)" }}
          >
            <div className="flex-1" />
            <div className="flex gap-1">
              {last7.map((d) => (
                <div key={d} className="w-8 text-center">
                  <span
                    className="text-[9px]"
                    style={{
                      color:
                        d === today
                          ? "rgba(34,197,94,0.8)"
                          : "rgba(180,200,210,0.3)",
                    }}
                  >
                    {new Date(`${d}T12:00:00`)
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .slice(0, 2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-10" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {habits.length === 0 && (
              <div
                className="flex flex-col items-center justify-center h-32 gap-2"
                data-ocid="habittracker.empty_state"
              >
                <p
                  className="text-xs"
                  style={{ color: "rgba(180,200,210,0.3)" }}
                >
                  No habits yet. Add one above!
                </p>
              </div>
            )}
            {habits.map((habit, i) => {
              const streak = getStreak(habit.completions);
              return (
                <div
                  key={habit.id}
                  data-ocid={`habittracker.item.${i + 1}`}
                  className="flex items-center gap-3 px-4 py-3 border-b group"
                  style={{ borderColor: "rgba(42,58,66,0.3)" }}
                >
                  <span className="text-xl flex-shrink-0">{habit.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: "rgba(220,235,240,0.85)" }}
                    >
                      {habit.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Flame
                        className="w-3 h-3"
                        style={{
                          color:
                            streak > 0
                              ? "rgba(251,146,60,0.8)"
                              : "rgba(180,200,210,0.25)",
                        }}
                      />
                      <span
                        className="text-[10px]"
                        style={{
                          color:
                            streak > 0
                              ? "rgba(251,146,60,0.7)"
                              : "rgba(180,200,210,0.3)",
                          fontWeight: streak > 0 ? 600 : 400,
                        }}
                      >
                        {streak > 0 ? `${streak} day streak` : "No streak"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {last7.map((d) => {
                      const done = habit.completions.includes(d);
                      const isToday = d === today;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={isToday ? () => toggle(habit.id) : undefined}
                          data-ocid={
                            isToday
                              ? `habittracker.checkbox.${i + 1}`
                              : undefined
                          }
                          title={
                            isToday
                              ? done
                                ? "Mark incomplete"
                                : "Mark complete"
                              : d
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={
                            done
                              ? {
                                  background: "rgba(34,197,94,0.2)",
                                  border: "1px solid rgba(34,197,94,0.4)",
                                }
                              : isToday
                                ? {
                                    background: "var(--os-border-subtle)",
                                    border: "1px solid rgba(42,58,66,0.6)",
                                    cursor: "pointer",
                                  }
                                : {
                                    background: "var(--os-border-subtle)",
                                    border: "1px solid rgba(42,58,66,0.3)",
                                    cursor: "default",
                                  }
                          }
                        >
                          {done && (
                            <Check
                              className="w-3.5 h-3.5"
                              style={{ color: "rgba(34,197,94,0.9)" }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteHabit(habit.id)}
                    data-ocid={`habittracker.delete_button.${i + 1}`}
                    className="w-7 h-7 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "rgba(248,113,113,0.7)" }}
                    title="Delete habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
