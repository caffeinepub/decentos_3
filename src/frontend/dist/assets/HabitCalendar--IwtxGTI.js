import { r as reactExports, j as jsxRuntimeExports, T as Trash2, e as ChevronLeft, f as ChevronRight } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const DEFAULT_DATA = {
  habits: ["Morning Exercise", "Read 20 min", "Drink 8 cups water"],
  checks: {}
};
function dKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function HabitCalendar() {
  const { data, set } = useCanisterKV(
    "decent_habit_calendar",
    DEFAULT_DATA
  );
  const [selectedHabit, setSelectedHabit] = reactExports.useState(
    DEFAULT_DATA.habits[0] ?? ""
  );
  const [newHabit, setNewHabit] = reactExports.useState("");
  const today = /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = reactExports.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = reactExports.useState(today.getMonth());
  const addHabit = () => {
    const name = newHabit.trim();
    if (!name || data.habits.includes(name)) return;
    set({ ...data, habits: [...data.habits, name] });
    setSelectedHabit(name);
    setNewHabit("");
  };
  const deleteHabit = (name) => {
    const habits = data.habits.filter((h) => h !== name);
    const checks = { ...data.checks };
    delete checks[name];
    set({ habits, checks });
    if (selectedHabit === name) setSelectedHabit(habits[0] ?? "");
  };
  const toggleDay = (dayKey) => {
    const habitChecks2 = { ...data.checks[selectedHabit] ?? {} };
    habitChecks2[dayKey] = !habitChecks2[dayKey];
    set({ ...data, checks: { ...data.checks, [selectedHabit]: habitChecks2 } });
  };
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstDay }, (_, i) => ({
      key: `pre-${i}`,
      day: null
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      key: dKey(viewYear, viewMonth, i + 1),
      day: i + 1
    }))
  ];
  while (cells.length % 7 !== 0)
    cells.push({ key: `post-${cells.length}`, day: null });
  const habitChecks = data.checks[selectedHabit] ?? {};
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const k = dKey(d.getFullYear(), d.getMonth(), d.getDate());
    if (habitChecks[k]) streak++;
    else break;
  }
  let checkedThisMonth = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const maxDay = viewYear === today.getFullYear() && viewMonth === today.getMonth() ? today.getDate() : daysInMonth;
    if (d <= maxDay && habitChecks[dKey(viewYear, viewMonth, d)])
      checkedThisMonth++;
  }
  const maxDays = viewYear === today.getFullYear() && viewMonth === today.getMonth() ? today.getDate() : daysInMonth;
  const completionPct = maxDays > 0 ? Math.round(checkedThisMonth / maxDays * 100) : 0;
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex", style: { background: "rgba(0,0,0,0.3)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col border-r border-border",
        style: { width: 180, background: "var(--os-border-subtle)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2.5 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-cyan-400", children: "Habits" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-2 flex flex-col gap-1", children: data.habits.map((habit) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "group flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all",
              style: {
                background: selectedHabit === habit ? "rgba(39,215,224,0.1)" : "transparent",
                border: `1px solid ${selectedHabit === habit ? "rgba(39,215,224,0.3)" : "transparent"}`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSelectedHabit(habit),
                    className: "flex-1 text-xs truncate text-left bg-transparent border-none p-0 cursor-pointer",
                    style: {
                      color: selectedHabit === habit ? "rgba(39,215,224,0.9)" : "var(--os-text-secondary)"
                    },
                    "data-ocid": "habitcalendar.item",
                    children: habit
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => deleteHabit(habit),
                    className: "opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/20 text-muted-foreground/60 hover:text-red-400 transition-all",
                    "data-ocid": "habitcalendar.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 10 })
                  }
                )
              ]
            },
            habit
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "flex-1 min-w-0 bg-muted/50 border border-border rounded px-2 py-1 text-[11px] text-muted-foreground outline-none focus:border-cyan-400/50 placeholder-white/25",
                placeholder: "New habit...",
                value: newHabit,
                onChange: (e) => setNewHabit(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && addHabit(),
                "data-ocid": "habitcalendar.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: addHabit,
                className: "p-1.5 rounded text-cyan-400 hover:bg-cyan-400/10 transition-colors",
                "data-ocid": "habitcalendar.button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col overflow-hidden p-3", children: selectedHabit ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: prevMonth,
            className: "p-1 rounded hover:bg-muted/50 text-muted-foreground/60 hover:text-muted-foreground transition-colors",
            "data-ocid": "habitcalendar.button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-muted-foreground flex-1 text-center", children: [
          MONTHS[viewMonth],
          " ",
          viewYear
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: nextMonth,
            className: "p-1 rounded hover:bg-muted/50 text-muted-foreground/60 hover:text-muted-foreground transition-colors",
            "data-ocid": "habitcalendar.button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-cyan-400/80 mb-2 truncate", children: selectedHabit }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1 mb-1", children: DAYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center text-[9px] font-semibold text-muted-foreground/60 py-0.5",
          children: d
        },
        d
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1 flex-1", children: cells.map(({ key: cellKey, day }) => {
        if (!day) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, cellKey);
        const key = dKey(viewYear, viewMonth, day);
        const checked = !!habitChecks[key];
        const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => toggleDay(key),
            className: "aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium transition-all hover:scale-105",
            style: {
              background: checked ? "rgba(39,215,224,0.75)" : "var(--os-border-subtle)",
              border: isToday ? "1.5px solid rgba(39,215,224,0.6)" : "1px solid var(--os-border-subtle)",
              color: checked ? "rgba(0,0,0,0.85)" : isToday ? "rgba(39,215,224,0.9)" : "var(--os-text-secondary)",
              fontWeight: isToday ? "700" : "500"
            },
            "data-ocid": "habitcalendar.toggle",
            children: day
          },
          key
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 rounded-lg p-2.5 text-center",
            style: {
              background: "rgba(39,215,224,0.06)",
              border: "1px solid rgba(39,215,224,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mb-0.5", children: "Current Streak" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-cyan-400", children: streak }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground/60", children: "days" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 rounded-lg p-2.5 text-center",
            style: {
              background: "rgba(34,197,94,0.06)",
              border: "1px solid rgba(34,197,94,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mb-0.5", children: "This Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-lg font-bold",
                  style: { color: "rgba(34,197,94,0.9)" },
                  children: [
                    completionPct,
                    "%"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-muted-foreground/60", children: [
                checkedThisMonth,
                "/",
                maxDays,
                " days"
              ] })
            ]
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center",
        "data-ocid": "habitcalendar.empty_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: "Add a habit to start tracking" })
      }
    ) })
  ] });
}
export {
  HabitCalendar
};
