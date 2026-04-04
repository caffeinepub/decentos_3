import { r as reactExports, j as jsxRuntimeExports, aG as Calendar, aY as StickyNote, ad as Clock, R as RefreshCw } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Pause } from "./pause-4HbYDkez.js";
import { P as Play } from "./play-BQFY022i.js";
const POMODORO_MINUTES = 25;
function MindCalendar() {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const { data: quickNotes, set: saveQuickNotes } = useCanisterKV(
    "mindcalendar_notes",
    ""
  );
  const { data: allEvents } = useCanisterKV("calendar_events", []);
  const todayEvents = allEvents.filter((e) => e.date === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const [timerSeconds, setTimerSeconds] = reactExports.useState(POMODORO_MINUTES * 60);
  const [timerRunning, setTimerRunning] = reactExports.useState(false);
  const [timerSession, setTimerSession] = reactExports.useState(0);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setTimerSession((s) => s + 1);
            return POMODORO_MINUTES * 60;
          }
          return prev - 1;
        });
      }, 1e3);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);
  function resetTimer() {
    setTimerRunning(false);
    setTimerSeconds(POMODORO_MINUTES * 60);
  }
  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
  const seconds = (timerSeconds % 60).toString().padStart(2, "0");
  const progressPct = (POMODORO_MINUTES * 60 - timerSeconds) / (POMODORO_MINUTES * 60) * 100;
  const now = /* @__PURE__ */ new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: {
        background: "var(--os-bg-app)",
        color: "var(--os-text-primary)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-4 py-3 border-b",
            style: { borderColor: "var(--os-border)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 15, style: { color: "var(--os-accent)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-semibold text-sm",
                    style: { color: "var(--os-text-primary)" },
                    children: dayName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs ml-2",
                    style: { color: "var(--os-text-muted)" },
                    children: dateStr
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col w-1/2 border-r overflow-hidden",
              style: { borderColor: "var(--os-border)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-1.5 px-4 py-2 border-b",
                    style: { borderColor: "var(--os-border)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { size: 12, style: { color: "var(--os-text-muted)" } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs font-medium",
                          style: { color: "var(--os-text-muted)" },
                          children: "Quick Notes"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    className: "flex-1 w-full text-sm p-4 resize-none outline-none",
                    style: {
                      background: "transparent",
                      color: "var(--os-text-primary)",
                      lineHeight: "1.6"
                    },
                    placeholder: "Jot down thoughts, ideas, tasks for today...",
                    value: quickNotes,
                    onChange: (e) => saveQuickNotes(e.target.value)
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5 px-4 py-2 border-b",
                style: { borderColor: "var(--os-border)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, style: { color: "var(--os-text-muted)" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-medium",
                      style: { color: "var(--os-text-muted)" },
                      children: "Today's Schedule"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-3", children: todayEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex flex-col items-center justify-center h-24",
                "data-ocid": "mindcalendar.empty_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs",
                    style: { color: "var(--os-text-muted)" },
                    children: "No events today"
                  }
                )
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: todayEvents.map((evt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": `mindcalendar.item.${idx + 1}`,
                className: "flex items-start gap-2 px-3 py-2 rounded-lg text-xs",
                style: {
                  background: `${evt.color}18`,
                  borderLeft: `3px solid ${evt.color}`
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-medium",
                      style: { color: "var(--os-text-primary)" },
                      children: evt.title
                    }
                  ),
                  !evt.allDay && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "var(--os-text-muted)" }, children: [
                    evt.startTime,
                    " – ",
                    evt.endTime
                  ] }),
                  evt.allDay && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--os-text-muted)" }, children: "All day" })
                ] })
              },
              evt.id
            )) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "border-t px-4 py-3",
            style: { borderColor: "var(--os-border)", flexShrink: 0 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-medium",
                    style: { color: "var(--os-text-muted)" },
                    children: "Focus"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-xl font-bold",
                    style: {
                      color: timerRunning ? "var(--os-accent)" : "var(--os-text-primary)"
                    },
                    children: [
                      minutes,
                      ":",
                      seconds
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 h-1.5 rounded-full overflow-hidden",
                  style: { background: "var(--os-bg-secondary)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full transition-all duration-1000",
                      style: {
                        width: `${progressPct}%`,
                        background: "var(--os-accent)"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setTimerRunning((r) => !r),
                    className: "p-1.5 rounded-lg transition-colors hover:opacity-80",
                    style: {
                      background: "var(--os-accent)",
                      color: "var(--os-text-primary)"
                    },
                    children: timerRunning ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 12 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: resetTimer,
                    className: "p-1.5 rounded-lg transition-colors",
                    style: {
                      background: "var(--os-bg-secondary)",
                      color: "var(--os-text-muted)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12 })
                  }
                )
              ] }),
              timerSession > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", style: { color: "var(--os-text-muted)" }, children: [
                "🍅 ×",
                timerSession
              ] })
            ] })
          }
        )
      ]
    }
  );
}
export {
  MindCalendar as default
};
