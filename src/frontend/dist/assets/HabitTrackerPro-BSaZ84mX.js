import { r as reactExports, j as jsxRuntimeExports, X, C as Check, T as Trash2, g as ue } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
function todayKey() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getLast28Days() {
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    days.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    );
  }
  return days;
}
function calcStreaks(completions) {
  if (completions.length === 0) return { current: 0, longest: 0 };
  const sorted = [...completions].sort();
  const set = new Set(sorted);
  let current = 0;
  const today = todayKey();
  let check = /* @__PURE__ */ new Date();
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
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const dateStr of sorted) {
    const d = /* @__PURE__ */ new Date(`${dateStr}T00:00:00`);
    if (prev) {
      const diff = (d.getTime() - prev.getTime()) / 864e5;
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
function HabitTrackerPro() {
  const today = todayKey();
  const last28 = getLast28Days();
  const { data: store, set: _setStore } = useCanisterKV(
    "decent-habits-pro",
    { habits: [] }
  );
  const [newName, setNewName] = reactExports.useState("");
  const [newEmoji, setNewEmoji] = reactExports.useState("✅");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const save = _setStore;
  const toggle = (habitId) => {
    const updated = store.habits.map((h) => {
      if (h.id !== habitId) return h;
      const has = h.completions.includes(today);
      return {
        ...h,
        completions: has ? h.completions.filter((d) => d !== today) : [...h.completions, today]
      };
    });
    save({ habits: updated });
  };
  const addHabit = () => {
    if (!newName.trim()) {
      ue.error("Enter a habit name");
      return;
    }
    const h = {
      id: `h-${Date.now()}`,
      name: newName.trim(),
      emoji: newEmoji || "✅",
      createdAt: today,
      completions: []
    };
    save({ habits: [...store.habits, h] });
    setNewName("");
    setNewEmoji("✅");
    setShowAdd(false);
    ue.success(`Habit "${h.name}" added`);
  };
  const deleteHabit = (id) => {
    save({ habits: store.habits.filter((h) => h.id !== id) });
    setDeleteId(null);
    ue.success("Habit deleted");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(9,13,16,0.95)" },
      "data-ocid": "habitpro.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 flex items-center justify-between px-4 py-3 border-b",
            style: {
              background: "rgba(12,22,30,0.9)",
              borderColor: "rgba(39,215,224,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "var(--os-accent)" },
                    children: "Habit Tracker Pro"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5", children: today })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAdd((p) => !p),
                  "data-ocid": "habitpro.primary_button",
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  style: {
                    background: "rgba(39,215,224,0.12)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "var(--os-accent)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    " Add Habit"
                  ]
                }
              )
            ]
          }
        ),
        showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 px-4 py-3 border-b flex items-center gap-2",
            style: {
              background: "rgba(39,215,224,0.04)",
              borderColor: "rgba(39,215,224,0.15)"
            },
            "data-ocid": "habitpro.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: newEmoji,
                  onChange: (e) => setNewEmoji(e.target.value),
                  maxLength: 2,
                  className: "w-10 text-center text-lg bg-transparent outline-none rounded",
                  style: { border: "1px solid var(--os-text-muted)" },
                  placeholder: "✅"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: newName,
                  onChange: (e) => setNewName(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && addHabit(),
                  placeholder: "Habit name...",
                  "data-ocid": "habitpro.input",
                  className: "flex-1 rounded-lg px-3 py-1.5 text-xs bg-transparent outline-none",
                  style: {
                    border: "1px solid rgba(39,215,224,0.25)",
                    color: "var(--os-text-primary)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: addHabit,
                  "data-ocid": "habitpro.confirm_button",
                  className: "px-3 py-1.5 rounded-lg text-xs font-semibold",
                  style: {
                    background: "rgba(39,215,224,0.15)",
                    border: "1px solid rgba(39,215,224,0.35)",
                    color: "var(--os-accent)"
                  },
                  children: "Add"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAdd(false),
                  "data-ocid": "habitpro.cancel_button",
                  className: "text-muted-foreground/60 hover:text-muted-foreground transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: store.habits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 text-center",
            "data-ocid": "habitpro.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-3", children: "🌱" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: "No habits yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: 'Click "Add Habit" to start building your routine' })
            ]
          }
        ) : store.habits.map((habit, i) => {
          const { current, longest } = calcStreaks(habit.completions);
          const doneToday = habit.completions.includes(today);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl overflow-hidden",
              style: {
                background: "var(--os-border-subtle)",
                border: doneToday ? "1px solid rgba(39,215,224,0.3)" : "1px solid var(--os-border-subtle)"
              },
              "data-ocid": `habitpro.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggle(habit.id),
                      "data-ocid": `habitpro.checkbox.${i + 1}`,
                      className: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                      style: {
                        background: doneToday ? "rgba(39,215,224,0.2)" : "var(--os-border-subtle)",
                        border: doneToday ? "2px solid rgba(39,215,224,0.6)" : "2px solid var(--os-text-muted)"
                      },
                      children: doneToday ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Check,
                        {
                          className: "w-4 h-4",
                          style: { color: "var(--os-accent)" }
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: habit.emoji })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: `text-sm font-medium ${doneToday ? "text-foreground" : "text-muted-foreground"}`,
                        children: [
                          habit.emoji,
                          " ",
                          habit.name
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "text-[10px]",
                          style: { color: "var(--os-accent)" },
                          children: [
                            "🔥 ",
                            current,
                            " day",
                            current !== 1 ? "s" : ""
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/60", children: [
                        "Best: ",
                        longest
                      ] })
                    ] })
                  ] }),
                  deleteId === habit.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => deleteHabit(habit.id),
                        "data-ocid": "habitpro.confirm_button",
                        className: "text-[10px] px-2 py-1 rounded",
                        style: {
                          background: "rgba(239,68,68,0.15)",
                          color: "#EF4444",
                          border: "1px solid rgba(239,68,68,0.3)"
                        },
                        children: "Delete"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setDeleteId(null),
                        "data-ocid": "habitpro.cancel_button",
                        className: "text-[10px] px-2 py-1 rounded text-muted-foreground/60 hover:text-foreground",
                        style: { border: "1px solid var(--os-text-muted)" },
                        children: "No"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setDeleteId(habit.id),
                      "data-ocid": `habitpro.delete_button.${i + 1}`,
                      className: "w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/15 text-muted-foreground/30 hover:text-red-400 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "px-3 pb-3",
                    style: { borderTop: "1px solid var(--os-border-subtle)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground/50 uppercase tracking-widest mt-2 mb-1.5", children: "Last 28 days" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-0.5", children: last28.map((day) => {
                        const done = habit.completions.includes(day);
                        const isToday = day === today;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            title: day,
                            className: "aspect-square rounded-sm",
                            style: {
                              background: done ? "rgba(39,215,224,0.6)" : "var(--os-border-subtle)",
                              outline: isToday ? "1px solid rgba(39,215,224,0.5)" : "none"
                            }
                          },
                          day
                        );
                      }) })
                    ]
                  }
                )
              ]
            },
            habit.id
          );
        }) })
      ]
    }
  );
}
export {
  HabitTrackerPro
};
