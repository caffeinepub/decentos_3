import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as BookOpen, ap as Flame } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { R as RotateCcw } from "./rotate-ccw-CbOiKPu8.js";
import { S as SkipForward } from "./skip-forward-CovBJiE2.js";
import { C as CircleCheckBig } from "./circle-check-big-CvRYHAqA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode);
function todayKey() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
const PHASE_LABELS = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break"
};
const PHASE_COLORS = {
  focus: "rgb(39,215,224)",
  shortBreak: "rgb(34,197,94)",
  longBreak: "rgb(168,85,247)"
};
function beep(ctx) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.8);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
}
function StudyTimer() {
  const [focusMins, setFocusMins] = reactExports.useState(25);
  const [shortBreakMins, setShortBreakMins] = reactExports.useState(5);
  const [targetSessions, setTargetSessions] = reactExports.useState(4);
  const [phase, setPhase] = reactExports.useState("focus");
  const [secondsLeft, setSecondsLeft] = reactExports.useState(focusMins * 60);
  const [running, setRunning] = reactExports.useState(false);
  const [showSettings, setShowSettings] = reactExports.useState(false);
  const { data: storage, set: saveStorage } = useCanisterKV(
    "decentos_study_timer",
    { streakDays: 0, lastActiveDate: "", todaySessions: 0 }
  );
  const storageRef = reactExports.useRef(storage);
  reactExports.useEffect(() => {
    storageRef.current = storage;
  }, [storage]);
  const audioCtxRef = reactExports.useRef(null);
  const intervalRef = reactExports.useRef(null);
  const totalSeconds = phase === "focus" ? focusMins * 60 : shortBreakMins * 60;
  const progress = (totalSeconds - secondsLeft) / totalSeconds * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const color = PHASE_COLORS[phase];
  reactExports.useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
          }
          beep(audioCtxRef.current);
          if (phase === "focus") {
            const today = todayKey();
            const s = storageRef.current;
            const newSessions = s.todaySessions + 1;
            let newStreak = s.streakDays;
            let newLastDate = s.lastActiveDate;
            if (s.lastActiveDate !== today) {
              const yesterday = /* @__PURE__ */ new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yKey = yesterday.toISOString().slice(0, 10);
              newStreak = s.lastActiveDate === yKey ? s.streakDays + 1 : 1;
              newLastDate = today;
            }
            const updated = {
              streakDays: newStreak,
              lastActiveDate: newLastDate,
              todaySessions: newSessions
            };
            saveStorage(updated);
            setPhase("shortBreak");
            setSecondsLeft(shortBreakMins * 60);
          } else {
            setPhase("focus");
            setSecondsLeft(focusMins * 60);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(intervalRef.current);
  }, [running, phase, focusMins, shortBreakMins, saveStorage]);
  const toggleRunning = () => setRunning((r) => !r);
  const reset = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    setSecondsLeft(phase === "focus" ? focusMins * 60 : shortBreakMins * 60);
  };
  const skip = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    const next = phase === "focus" ? "shortBreak" : "focus";
    setPhase(next);
    setSecondsLeft(next === "focus" ? focusMins * 60 : shortBreakMins * 60);
  };
  const R = 70;
  const circ = 2 * Math.PI * R;
  const dash = progress / 100 * circ;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", style: { color: "#e2e8f0" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-4 py-3",
        style: { borderBottom: "1px solid var(--os-border-subtle)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4", style: { color: "rgb(39,215,224)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Study Timer" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowSettings((s) => !s),
              "data-ocid": "studytimer.toggle",
              className: "p-1 rounded transition-colors",
              style: {
                color: showSettings ? "rgb(39,215,224)" : "rgba(148,163,184,0.7)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-4 h-4" })
            }
          )
        ]
      }
    ),
    showSettings ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Focus (min)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 1,
              max: 90,
              value: focusMins,
              onChange: (e) => {
                setFocusMins(+e.target.value);
                if (phase === "focus") setSecondsLeft(+e.target.value * 60);
              },
              "data-ocid": "studytimer.input",
              className: "w-full mt-1 px-2 py-1.5 rounded text-sm bg-muted/50 focus:outline-none",
              style: {
                border: "1px solid var(--os-text-muted)",
                color: "#e2e8f0"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Break (min)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 1,
              max: 30,
              value: shortBreakMins,
              onChange: (e) => {
                setShortBreakMins(+e.target.value);
                if (phase !== "focus") setSecondsLeft(+e.target.value * 60);
              },
              className: "w-full mt-1 px-2 py-1.5 rounded text-sm bg-muted/50 focus:outline-none",
              style: {
                border: "1px solid var(--os-text-muted)",
                color: "#e2e8f0"
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Daily session goal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: 1,
            max: 20,
            value: targetSessions,
            onChange: (e) => setTargetSessions(+e.target.value),
            className: "w-full mt-1 px-2 py-1.5 rounded text-sm bg-muted/50 focus:outline-none",
            style: {
              border: "1px solid var(--os-text-muted)",
              color: "#e2e8f0"
            }
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-6 px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-3 py-1 rounded-full text-xs font-semibold",
          style: {
            background: `${color}15`,
            border: `1px solid ${color}40`,
            color
          },
          children: PHASE_LABELS[phase]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: 180,
            height: 180,
            viewBox: "0 0 180 180",
            role: "img",
            "aria-label": "Timer progress ring",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: 90,
                  cy: 90,
                  r: R,
                  fill: "none",
                  strokeWidth: 10,
                  stroke: "var(--os-border-subtle)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: 90,
                  cy: 90,
                  r: R,
                  fill: "none",
                  strokeWidth: 10,
                  stroke: color,
                  strokeLinecap: "round",
                  strokeDasharray: `${dash} ${circ - dash}`,
                  strokeDashoffset: circ / 4,
                  style: {
                    transition: "stroke-dasharray 0.5s ease",
                    filter: `drop-shadow(0 0 6px ${color}80)`
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-3xl font-bold tabular-nums",
              style: { color },
              children: timeStr
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mt-1", children: "remaining" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: reset,
            "data-ocid": "studytimer.secondary_button",
            className: "p-2 rounded-full transition-all",
            style: {
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
              color: "rgba(148,163,184,0.7)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: toggleRunning,
            "data-ocid": "studytimer.primary_button",
            className: "w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all",
            style: {
              background: `${color}20`,
              border: `2px solid ${color}60`,
              color
            },
            children: running ? "⏸" : "▶"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: skip,
            "data-ocid": "studytimer.toggle",
            className: "p-2 rounded-full transition-all",
            style: {
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
              color: "rgba(148,163,184,0.7)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 text-orange-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: storage.streakDays })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "day streak" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-center gap-1",
              style: { color: "rgb(39,215,224)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-lg", children: [
                  storage.todaySessions,
                  "/",
                  targetSessions
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "today's sessions" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: Array.from({ length: targetSessions }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-2.5 h-2.5 rounded-full",
          style: {
            background: i < storage.todaySessions ? color : "var(--os-text-muted)",
            boxShadow: i < storage.todaySessions ? `0 0 6px ${color}80` : "none"
          }
        },
        `session-slot-${i + 1}`
      )) })
    ] })
  ] });
}
export {
  StudyTimer
};
