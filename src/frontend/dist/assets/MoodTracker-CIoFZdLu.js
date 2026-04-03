import { r as reactExports, j as jsxRuntimeExports } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
const MOOD_EMOJIS = {
  1: "😢",
  2: "😟",
  3: "😐",
  4: "🙂",
  5: "😄"
};
const MOOD_LABELS = {
  1: "Awful",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great"
};
const MOOD_COLORS = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#84cc16",
  5: "#27D7E0"
};
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function MoodTracker() {
  const { data: entries, set: setEntries } = useCanisterKV(
    "decent-mood",
    []
  );
  const [selectedMood, setSelectedMood] = reactExports.useState(
    null
  );
  const [noteText, setNoteText] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("today");
  const today = todayStr();
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayEntry = entries.find((e) => e.date === today);
  reactExports.useEffect(() => {
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setNoteText(todayEntry.note);
    }
  }, [todayEntry == null ? void 0 : todayEntry.date, todayEntry == null ? void 0 : todayEntry.mood, todayEntry == null ? void 0 : todayEntry.note]);
  const handleSave = () => {
    if (!selectedMood) return;
    const newEntry = {
      date: today,
      mood: selectedMood,
      note: noteText.trim()
    };
    setEntries(
      [newEntry, ...entries.filter((e) => e.date !== today)].sort(
        (a, b) => b.date.localeCompare(a.date)
      )
    );
  };
  const sortedDates = entries.map((e) => e.date).sort((a, b) => b.localeCompare(a));
  let streak = 0;
  const checkDate = /* @__PURE__ */ new Date();
  for (let i = 0; i < 365; i++) {
    const ds = checkDate.toISOString().slice(0, 10);
    if (sortedDates.includes(ds)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else break;
  }
  const last7 = entries.slice(0, 7);
  const avgMood = last7.length > 0 ? last7.reduce((s, e) => s + e.mood, 0) / last7.length : 0;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = now.toLocaleString("default", { month: "long" });
  const entryByDay = {};
  for (const e of entries) {
    const d = /* @__PURE__ */ new Date(`${e.date}T12:00:00`);
    if (d.getFullYear() === year && d.getMonth() === month) {
      entryByDay[String(d.getDate())] = e;
    }
  }
  const moodColor = selectedMood ? MOOD_COLORS[selectedMood] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: "rgba(8,14,18,0.97)" },
      "data-ocid": "moodtracker.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b",
            style: {
              background: "rgba(12,22,30,0.95)",
              borderColor: "rgba(39,215,224,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs font-semibold",
                  style: { color: "rgba(39,215,224,1)" },
                  children: "Mood Tracker"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["today", "history"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTab(tab),
                  "data-ocid": `moodtracker.${tab}.tab`,
                  className: "px-3 h-6 rounded text-[11px] font-medium transition-all capitalize",
                  style: activeTab === tab ? {
                    background: "rgba(39,215,224,0.15)",
                    color: "rgba(39,215,224,1)",
                    border: "1px solid rgba(39,215,224,0.3)"
                  } : {
                    color: "var(--os-text-secondary)",
                    border: "1px solid transparent"
                  },
                  children: tab
                },
                tab
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: activeTab === "today" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4",
              style: {
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.12)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mb-3", children: todayEntry ? "Update today's mood" : "How are you feeling today?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 justify-center mb-4", children: [1, 2, 3, 4, 5].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSelectedMood(m),
                    "data-ocid": "moodtracker.toggle",
                    title: MOOD_LABELS[m],
                    className: "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                    style: selectedMood === m ? {
                      background: `${MOOD_COLORS[m]}22`,
                      border: `1px solid ${MOOD_COLORS[m]}66`,
                      boxShadow: `0 0 12px ${MOOD_COLORS[m]}33`
                    } : { border: "1px solid transparent" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: MOOD_EMOJIS[m] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: MOOD_LABELS[m] })
                    ]
                  },
                  m
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: noteText,
                    onChange: (e) => setNoteText(e.target.value),
                    placeholder: "Add a note (optional)...",
                    "data-ocid": "moodtracker.textarea",
                    rows: 2,
                    className: "w-full rounded-lg px-3 py-2 text-xs outline-none resize-none",
                    style: {
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--os-border-subtle)",
                      color: "var(--os-text-secondary)",
                      caretColor: "var(--os-accent)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleSave,
                    disabled: !selectedMood,
                    "data-ocid": "moodtracker.submit_button",
                    className: "mt-3 w-full py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40",
                    style: {
                      background: moodColor ? `${moodColor}22` : "var(--os-border-subtle)",
                      border: `1px solid ${moodColor ? `${moodColor}55` : "var(--os-text-muted)"}`,
                      color: moodColor ?? "var(--os-text-muted)"
                    },
                    children: todayEntry ? "Update Entry" : "Log Mood"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-3 text-center",
                style: {
                  background: "rgba(39,215,224,0.05)",
                  border: "1px solid rgba(39,215,224,0.12)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "text-2xl font-bold",
                      style: { color: "var(--os-accent)" },
                      children: streak
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60 mt-0.5", children: "Day Streak 🔥" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-3 text-center",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-border-subtle)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: avgMood > 0 ? MOOD_EMOJIS[Math.round(avgMood)] : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60 mt-0.5", children: "7-day avg" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] font-semibold text-muted-foreground/60 mb-2", children: [
              monthName,
              " ",
              year
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-1", children: [
              ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-center text-[9px] text-muted-foreground/50 pb-1",
                  children: d
                },
                d
              )),
              Array.from({ length: firstDay }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: empty padding cells have no stable id
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, `empty-${i}`)
              )),
              Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => {
                  const entry = entryByDay[String(day)];
                  const isToday = day === now.getDate();
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "aspect-square rounded flex items-center justify-center text-[11px]",
                      style: {
                        background: entry ? `${MOOD_COLORS[entry.mood]}22` : "var(--os-border-subtle)",
                        border: isToday ? "1px solid rgba(39,215,224,0.5)" : "1px solid transparent",
                        color: entry ? MOOD_COLORS[entry.mood] : "var(--os-text-muted)",
                        fontWeight: isToday ? 700 : 400
                      },
                      title: entry ? `${MOOD_LABELS[entry.mood]}${entry.note ? `: ${entry.note}` : ""}` : void 0,
                      children: entry ? MOOD_EMOJIS[entry.mood] : day
                    },
                    day
                  );
                }
              )
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground/60 text-xs",
            "data-ocid": "moodtracker.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "😶" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No entries yet. Log your mood to get started!" })
            ]
          }
        ) : entries.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `moodtracker.item.${i + 1}`,
            className: "flex items-center gap-3 rounded-xl px-3 py-2.5",
            style: {
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-border-subtle)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl flex-shrink-0", children: MOOD_EMOJIS[entry.mood] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-semibold",
                      style: { color: MOOD_COLORS[entry.mood] },
                      children: MOOD_LABELS[entry.mood]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: entry.date })
                ] }),
                entry.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/60 truncate mt-0.5", children: entry.note })
              ] })
            ]
          },
          entry.date
        )) }) })
      ]
    }
  );
}
export {
  MoodTracker
};
