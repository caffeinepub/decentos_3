import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, an as Flame, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import { C as CircleCheck } from "./circle-check-DLIDLAd8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function computeStreak(entries) {
  if (entries.length === 0) return { current: 0, longest: 0 };
  const sorted = [...new Set(entries)].sort().reverse();
  const today = todayStr();
  const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
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
  "#fb923c"
];
function genId() {
  return `h_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function HabitStreaks({ windowProps: _w }) {
  const {
    data: persisted,
    set: save,
    loading
  } = useCanisterKV("habitstreaks_v1", []);
  const [habits, setHabits] = reactExports.useState([]);
  const [adding, setAdding] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [newColor, setNewColor] = reactExports.useState(HABIT_COLORS[0]);
  const hydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (persisted.length > 0) setHabits(persisted);
  }, [loading, persisted]);
  const addHabit = reactExports.useCallback(() => {
    if (!newName.trim()) return;
    const h = {
      id: genId(),
      name: newName.trim(),
      color: newColor,
      entries: []
    };
    setHabits((prev) => {
      const updated = [h, ...prev];
      save(updated);
      return updated;
    });
    setNewName("");
    setAdding(false);
  }, [newName, newColor, save]);
  const deleteHabit = reactExports.useCallback(
    (id) => {
      setHabits((prev) => {
        const updated = prev.filter((h) => h.id !== id);
        save(updated);
        return updated;
      });
    },
    [save]
  );
  const checkIn = reactExports.useCallback(
    (id) => {
      const today2 = todayStr();
      setHabits((prev) => {
        const updated = prev.map((h) => {
          if (h.id !== id) return h;
          if (h.entries.includes(today2)) return h;
          return { ...h, entries: [...h.entries, today2] };
        });
        save(updated);
        return updated;
      });
    },
    [save]
  );
  const today = todayStr();
  const muted = "var(--os-text-secondary)";
  const panel = {
    background: "var(--os-bg-elevated)",
    border: "1px solid rgba(39,215,224,0.15)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(8,14,20,0.95)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 border-b flex-shrink-0",
            style: {
              borderColor: "rgba(39,215,224,0.12)",
              background: "rgba(10,16,20,0.7)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4", style: { color: "#F97316" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "var(--os-text-primary)" },
                    children: "Habit Streaks"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setAdding(true),
                  "data-ocid": "habitstreaks.add_button",
                  className: "flex items-center gap-1.5 px-3 h-7 rounded-lg text-[11px] font-semibold transition-all hover:brightness-125",
                  style: {
                    background: "rgba(39,215,224,0.12)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "var(--os-accent)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    " New Habit"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [
          adding && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4 space-y-3",
              style: panel,
              "data-ocid": "habitstreaks.dialog",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[12px] font-semibold",
                    style: { color: "var(--os-accent)" },
                    children: "New Habit"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: newName,
                    onChange: (e) => setNewName(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && addHabit(),
                    placeholder: "Habit name (e.g. Morning run)",
                    "data-ocid": "habitstreaks.input",
                    className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: "1px solid rgba(39,215,224,0.2)",
                      color: "var(--os-text-primary)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: HABIT_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setNewColor(c),
                    className: "w-6 h-6 rounded-full transition-all",
                    style: {
                      background: c,
                      boxShadow: newColor === c ? "0 0 0 2px var(--os-text-secondary)" : "none",
                      transform: newColor === c ? "scale(1.2)" : "scale(1)"
                    }
                  },
                  c
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: addHabit,
                      "data-ocid": "habitstreaks.submit_button",
                      className: "flex-1 h-8 rounded-lg text-[11px] font-semibold transition-all",
                      style: {
                        background: "rgba(39,215,224,0.14)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "var(--os-accent)"
                      },
                      children: "Add Habit"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setAdding(false);
                        setNewName("");
                      },
                      "data-ocid": "habitstreaks.cancel_button",
                      className: "h-8 px-4 rounded-lg text-[11px] transition-all",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid var(--os-text-muted)",
                        color: muted
                      },
                      children: "Cancel"
                    }
                  )
                ] })
              ]
            }
          ),
          habits.length === 0 && !adding && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-48 gap-3",
              "data-ocid": "habitstreaks.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Flame,
                  {
                    className: "w-12 h-12",
                    style: { color: "rgba(249,115,22,0.2)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: muted }, children: "No habits yet — start your streak!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAdding(true),
                    className: "px-4 h-8 rounded-lg text-[12px] font-semibold transition-all",
                    style: {
                      background: "rgba(39,215,224,0.12)",
                      border: "1px solid rgba(39,215,224,0.3)",
                      color: "var(--os-accent)"
                    },
                    children: "+ Add First Habit"
                  }
                )
              ]
            }
          ),
          habits.map((habit, idx) => {
            const { current, longest } = computeStreak(habit.entries);
            const checkedToday = habit.entries.includes(today);
            const flames = Array.from({ length: 14 }, (_, i) => {
              const d = /* @__PURE__ */ new Date();
              d.setDate(d.getDate() - (13 - i));
              const dateStr = d.toISOString().split("T")[0];
              return { dateStr, done: habit.entries.includes(dateStr) };
            });
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `habitstreaks.item.${idx + 1}`,
                className: "rounded-xl p-4 space-y-3",
                style: {
                  ...panel,
                  borderColor: checkedToday ? `${habit.color}40` : "rgba(39,215,224,0.15)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                          style: { background: habit.color }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-sm font-semibold",
                          style: { color: "var(--os-text-primary)" },
                          children: habit.name
                        }
                      ),
                      checkedToday && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                          style: {
                            background: `${habit.color}20`,
                            color: habit.color,
                            border: `1px solid ${habit.color}40`
                          },
                          children: "Done today ✓"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      !checkedToday && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => checkIn(habit.id),
                          "data-ocid": `habitstreaks.checkbox.${idx + 1}`,
                          className: "flex items-center gap-1 px-2.5 h-7 rounded-lg text-[11px] font-semibold transition-all hover:brightness-125",
                          style: {
                            background: `${habit.color}18`,
                            border: `1px solid ${habit.color}50`,
                            color: habit.color
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                            "Check in"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => deleteHabit(habit.id),
                          "data-ocid": `habitstreaks.delete_button.${idx + 1}`,
                          className: "w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:brightness-125",
                          style: {
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.15)",
                            color: "rgba(239,68,68,0.6)"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Flame,
                        {
                          className: "w-3.5 h-3.5",
                          style: { color: current > 0 ? "#F97316" : muted }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-sm font-bold",
                          style: { color: current > 0 ? "#F97316" : muted },
                          children: current
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", style: { color: muted }, children: "current" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Trophy,
                        {
                          className: "w-3.5 h-3.5",
                          style: { color: "rgba(251,191,36,0.7)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-sm font-bold",
                          style: { color: "rgba(251,191,36,0.9)" },
                          children: longest
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", style: { color: muted }, children: "best" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px]", style: { color: muted }, children: [
                      habit.entries.length,
                      " total days"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: flames.map(({ dateStr, done }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex-1 h-6 rounded flex items-center justify-center text-[12px]",
                      style: {
                        background: done ? `${habit.color}20` : "var(--os-border-subtle)",
                        border: done ? `1px solid ${habit.color}40` : "1px solid var(--os-border-subtle)"
                      },
                      children: done ? "🔥" : ""
                    },
                    dateStr
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[10px] text-right",
                      style: { color: "var(--os-text-muted)" },
                      children: "← 14 days"
                    }
                  )
                ]
              },
              habit.id
            );
          })
        ] })
      ]
    }
  );
}
export {
  HabitStreaks
};
