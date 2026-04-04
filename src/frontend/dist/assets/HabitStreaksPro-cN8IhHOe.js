import { r as reactExports, j as jsxRuntimeExports, ap as Flame, T as Trash2, g as ue } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
  "#ec4899",
  "#84cc16"
];
function toYMD(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function calcCurrentStreak(completions) {
  if (completions.length === 0) return 0;
  const set = new Set(completions);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const d = new Date(today);
  while (true) {
    if (set.has(toYMD(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
function calcLongestStreak(completions) {
  if (completions.length === 0) return 0;
  const sorted = [...completions].sort();
  let longest = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] ?? "");
    const curr = new Date(sorted[i] ?? "");
    const diff = (curr.getTime() - prev.getTime()) / 864e5;
    if (diff === 1) {
      cur++;
      if (cur > longest) longest = cur;
    } else if (diff > 1) {
      cur = 1;
    }
  }
  return longest;
}
function buildHeatmapDays() {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 363 - start.getDay());
  const days = [];
  const cur = new Date(start);
  let week = 0;
  while (cur <= today) {
    days.push({ date: toYMD(cur), week, dow: cur.getDay() });
    cur.setDate(cur.getDate() + 1);
    if (cur.getDay() === 0) week++;
  }
  return days;
}
function HeatmapCell({
  date,
  filled,
  color
}) {
  const [hovered, setHovered] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative",
      style: { width: 12, height: 12 },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: 12,
              height: 12,
              borderRadius: 2,
              background: filled ? color : "var(--os-border-subtle)",
              opacity: filled ? 0.9 : 1,
              border: `1px solid ${filled ? `${color}44` : "var(--os-border-subtle)"}`,
              cursor: "default"
            }
          }
        ),
        hovered && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 10,
              color: "var(--os-text-primary)",
              whiteSpace: "nowrap",
              zIndex: 10,
              pointerEvents: "none"
            },
            children: date
          }
        )
      ]
    }
  );
}
function HabitStreaksPro() {
  const {
    data: rawData,
    set: setRawData,
    loading: isLoading
  } = useCanisterKV("habit_streaks_pro", "");
  const [habits, setHabits] = reactExports.useState([]);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [newName, setNewName] = reactExports.useState("");
  const [newColor, setNewColor] = reactExports.useState(COLORS[0] ?? "#22c55e");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const hydrated = reactExports.useRef(false);
  reactExports.useEffect(() => {
    var _a;
    if (hydrated.current || isLoading) return;
    hydrated.current = true;
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed)) {
          setHabits(parsed);
          if (parsed.length > 0) setSelectedId(((_a = parsed[0]) == null ? void 0 : _a.id) ?? null);
        }
      } catch {
      }
    } else {
      const today = /* @__PURE__ */ new Date();
      const sample = [
        {
          id: "h1",
          name: "Morning Exercise",
          color: "#22c55e",
          completions: Array.from({ length: 30 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - i * 1.3);
            return toYMD(d);
          }).filter((_, i) => i % 2 === 0 || i % 3 === 0)
        },
        {
          id: "h2",
          name: "Daily Reading",
          color: "#3b82f6",
          completions: Array.from({ length: 45 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            return toYMD(d);
          }).filter((_, i) => i % 3 !== 2)
        },
        {
          id: "h3",
          name: "Meditation",
          color: "#a855f7",
          completions: Array.from({ length: 60 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - i * 0.8);
            return toYMD(d);
          })
        }
      ];
      setHabits(sample);
      setSelectedId("h1");
    }
  }, [rawData, isLoading]);
  const persist = reactExports.useCallback(
    (updated) => {
      setRawData(JSON.stringify(updated));
    },
    [setRawData]
  );
  const selectedHabit = habits.find((h) => h.id === selectedId) ?? null;
  const heatmapDays = reactExports.useMemo(() => buildHeatmapDays(), []);
  const maxWeek = heatmapDays.reduce((max, d) => Math.max(max, d.week), 0);
  const completionSet = reactExports.useMemo(
    () => new Set((selectedHabit == null ? void 0 : selectedHabit.completions) ?? []),
    [selectedHabit]
  );
  const todayStr = toYMD(/* @__PURE__ */ new Date());
  const markedToday = completionSet.has(todayStr);
  const currentStreak = reactExports.useMemo(
    () => calcCurrentStreak((selectedHabit == null ? void 0 : selectedHabit.completions) ?? []),
    [selectedHabit]
  );
  const longestStreak = reactExports.useMemo(
    () => calcLongestStreak((selectedHabit == null ? void 0 : selectedHabit.completions) ?? []),
    [selectedHabit]
  );
  const totalCompletions = (selectedHabit == null ? void 0 : selectedHabit.completions.length) ?? 0;
  const completionRate = reactExports.useMemo(() => {
    if (!selectedHabit) return 0;
    const daysInHeatmap = heatmapDays.length;
    return Math.round(totalCompletions / daysInHeatmap * 100);
  }, [selectedHabit, totalCompletions, heatmapDays]);
  const handleMarkToday = () => {
    if (!selectedHabit) return;
    const updated = habits.map((h) => {
      if (h.id !== selectedHabit.id) return h;
      const already = h.completions.includes(todayStr);
      return {
        ...h,
        completions: already ? h.completions.filter((c) => c !== todayStr) : [...h.completions, todayStr]
      };
    });
    setHabits(updated);
    persist(updated);
    ue.success(
      markedToday ? "Unmarked today" : "Marked today! Keep it up 🔥"
    );
  };
  const handleAddHabit = () => {
    if (!newName.trim()) return;
    const newHabit = {
      id: `habit-${Date.now()}`,
      name: newName.trim(),
      color: newColor,
      completions: []
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    persist(updated);
    setSelectedId(newHabit.id);
    setNewName("");
    setShowAdd(false);
    ue.success("Habit added");
  };
  const handleDeleteHabit = (id) => {
    var _a;
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    persist(updated);
    if (selectedId === id) setSelectedId(((_a = updated[0]) == null ? void 0 : _a.id) ?? null);
    ue.success("Habit deleted");
  };
  const weeks = reactExports.useMemo(() => {
    const w = [];
    for (let i = 0; i <= maxWeek; i++) {
      w.push({ week: i, days: heatmapDays.filter((d) => d.week === i) });
    }
    return w;
  }, [heatmapDays, maxWeek]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full",
      style: { background: "var(--os-bg-app)" },
      "data-ocid": "habitstreakspro.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col w-52 flex-shrink-0 border-r",
            style: {
              background: "var(--os-bg-sidebar)",
              borderColor: "var(--os-border-subtle)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0",
                  style: { borderColor: "var(--os-border-subtle)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-bold tracking-wide",
                        style: { color: "var(--os-text-primary)" },
                        children: "Habits"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowAdd((v) => !v),
                        "data-ocid": "habitstreakspro.primary_button",
                        className: "flex items-center justify-center w-5 h-5 rounded",
                        style: {
                          background: "var(--os-accent-color-alpha)",
                          border: "1px solid var(--os-accent-color-border)",
                          color: "rgba(99,102,241,0.9)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                      }
                    )
                  ]
                }
              ),
              showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "px-3 py-2 border-b flex flex-col gap-2",
                  style: { borderColor: "var(--os-border-subtle)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        value: newName,
                        onChange: (e) => setNewName(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && handleAddHabit(),
                        placeholder: "Habit name",
                        "data-ocid": "habitstreakspro.input",
                        className: "w-full rounded px-2 py-1 text-xs outline-none",
                        style: {
                          background: "var(--os-bg-elevated)",
                          border: "1px solid var(--os-border-subtle)",
                          color: "var(--os-text-primary)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setNewColor(c),
                        style: {
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          background: c,
                          border: newColor === c ? "2px solid var(--os-text-primary)" : "2px solid transparent"
                        }
                      },
                      c
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleAddHabit,
                        "data-ocid": "habitstreakspro.submit_button",
                        className: "text-xs py-1 rounded font-medium",
                        style: {
                          background: "rgba(99,102,241,0.15)",
                          border: "1px solid rgba(99,102,241,0.35)",
                          color: "rgba(99,102,241,1)"
                        },
                        children: "Add Habit"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto py-1", children: habits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-xs text-center py-6 px-3",
                  style: { color: "var(--os-text-muted)" },
                  "data-ocid": "habitstreakspro.empty_state",
                  children: [
                    "No habits yet.",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "Add one to get started."
                  ]
                }
              ) : habits.map((h, i) => {
                const streak = calcCurrentStreak(h.completions);
                const isSelected = h.id === selectedId;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `habitstreakspro.item.${i + 1}`,
                    onClick: () => setSelectedId(h.id),
                    onKeyDown: (e) => e.key === "Enter" && setSelectedId(h.id),
                    className: "w-full flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors",
                    style: {
                      background: isSelected ? "var(--os-bg-elevated)" : "transparent",
                      borderLeft: isSelected ? `3px solid ${h.color}` : "3px solid transparent"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: h.color,
                            flexShrink: 0
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "flex-1 text-xs truncate font-medium",
                          style: { color: "var(--os-text-primary)" },
                          children: h.name
                        }
                      ),
                      streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "flex items-center gap-0.5 text-[10px] font-bold",
                          style: { color: h.color },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3 h-3" }),
                            streak
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            handleDeleteHabit(h.id);
                          },
                          "data-ocid": `habitstreakspro.delete_button.${i + 1}`,
                          className: "opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded hover:bg-destructive/20 transition-all",
                          style: { color: "var(--os-text-muted)" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                        }
                      )
                    ]
                  },
                  h.id
                );
              }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col overflow-hidden", children: selectedHabit ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0",
              style: {
                borderColor: "var(--os-border-subtle)",
                background: "var(--os-bg-elevated)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: selectedHabit.color
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-sm font-bold",
                      style: { color: "var(--os-text-primary)" },
                      children: selectedHabit.name
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleMarkToday,
                    "data-ocid": "habitstreakspro.toggle",
                    className: "flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-semibold transition-all",
                    style: {
                      background: markedToday ? `${selectedHabit.color}22` : "var(--os-bg-app)",
                      border: `1px solid ${markedToday ? selectedHabit.color : "var(--os-border-subtle)"}`,
                      color: markedToday ? selectedHabit.color : "var(--os-text-secondary)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3 h-3" }),
                      markedToday ? "Marked today ✓" : "Mark today"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs font-semibold mb-2",
                style: { color: "var(--os-text-secondary)" },
                children: "Activity — last 52 weeks"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "overflow-x-auto pb-2",
                "data-ocid": "habitstreakspro.chart_point",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-[3px]", children: weeks.map(({ week, days }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-[3px]", children: [
                  week === 0 && days[0] && days[0].dow > 0 && Array.from({ length: days[0].dow }, (_, i) => i).map(
                    (i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: { width: 12, height: 12 }
                      },
                      `spacer-${week}-${i}`
                    )
                  ),
                  days.map(({ date, dow }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    HeatmapCell,
                    {
                      date,
                      filled: completionSet.has(date),
                      color: selectedHabit.color
                    },
                    `${week}-${dow}`
                  ))
                ] }, week)) })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center gap-6 px-4 py-3 border-t flex-shrink-0",
              style: {
                borderColor: "var(--os-border-subtle)",
                background: "var(--os-bg-elevated)"
              },
              children: [
                {
                  label: "Current Streak",
                  value: `${currentStreak}d`,
                  color: selectedHabit.color
                },
                {
                  label: "Longest Streak",
                  value: `${longestStreak}d`,
                  color: "var(--os-text-primary)"
                },
                {
                  label: "Total",
                  value: `${totalCompletions}`,
                  color: "var(--os-text-primary)"
                },
                {
                  label: "Rate",
                  value: `${completionRate}%`,
                  color: completionRate >= 50 ? "#22c55e" : "#f59e0b"
                }
              ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-muted)" },
                    children: label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", style: { color }, children: value })
              ] }, label))
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center flex-1 gap-3",
            "data-ocid": "habitstreakspro.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Flame,
                {
                  className: "w-12 h-12",
                  style: { color: "var(--os-text-muted)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm",
                  style: { color: "var(--os-text-secondary)" },
                  children: "Select or add a habit to get started"
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
export {
  HabitStreaksPro
};
