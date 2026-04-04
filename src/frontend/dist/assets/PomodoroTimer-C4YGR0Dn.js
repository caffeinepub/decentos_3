import { r as reactExports, j as jsxRuntimeExports, am as motion } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
const PHASE_DURATIONS = {
  work: 25 * 60,
  shortbreak: 5 * 60,
  longbreak: 15 * 60
};
const PHASE_LABELS = {
  work: "FOCUS",
  shortbreak: "SHORT BREAK",
  longbreak: "LONG BREAK"
};
const PHASE_COLORS = {
  work: "rgba(39,215,224,0.9)",
  shortbreak: "rgba(52,211,153,0.9)",
  longbreak: "rgba(167,139,250,0.9)"
};
const PHASE_BG = {
  work: "rgba(39,215,224,0.08)",
  shortbreak: "rgba(52,211,153,0.08)",
  longbreak: "rgba(167,139,250,0.08)"
};
function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
  }
}
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
function PomodoroTimer(_props) {
  const { data: stats, set: setStats } = useCanisterKV(
    "decentos_pomodoro_stats",
    { totalSessions: 0, totalMinutes: 0 }
  );
  const [phase, setPhase] = reactExports.useState("work");
  const [secondsLeft, setSecondsLeft] = reactExports.useState(PHASE_DURATIONS.work);
  const [running, setRunning] = reactExports.useState(false);
  const [sessions, setSessions] = reactExports.useState(0);
  const intervalRef = reactExports.useRef(null);
  const total = PHASE_DURATIONS[phase];
  const progress = secondsLeft / total;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const nextPhase = reactExports.useCallback(
    (currentPhase, currentSessions) => {
      if (currentPhase === "work") {
        const newSessions = currentSessions + 1;
        return newSessions % 4 === 0 ? "longbreak" : "shortbreak";
      }
      return "work";
    },
    []
  );
  const advance = reactExports.useCallback(() => {
    setRunning(false);
    playBeep();
    setPhase((p) => {
      setSessions((s) => {
        const newSessions = p === "work" ? s + 1 : s;
        if (p === "work") {
          setStats({
            totalSessions: stats.totalSessions + 1,
            totalMinutes: stats.totalMinutes + 25
          });
        }
        const np = nextPhase(p, newSessions);
        setSecondsLeft(PHASE_DURATIONS[np]);
        return newSessions;
      });
      return nextPhase(p, sessions);
    });
  }, [nextPhase, sessions, stats, setStats]);
  reactExports.useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            advance();
            return 0;
          }
          return s - 1;
        });
      }, 1e3);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, advance]);
  const handleReset = () => {
    setRunning(false);
    setPhase("work");
    setSecondsLeft(PHASE_DURATIONS.work);
    setSessions(0);
  };
  const handleSkip = () => {
    setRunning(false);
    playBeep();
    const np = nextPhase(phase, phase === "work" ? sessions + 1 : sessions);
    if (phase === "work") setSessions((s) => s + 1);
    setPhase(np);
    setSecondsLeft(PHASE_DURATIONS[np]);
  };
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const color = PHASE_COLORS[phase];
  const bg = PHASE_BG[phase];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-between h-full p-6 select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 rounded-lg p-1",
        style: { background: "var(--os-border-subtle)" },
        children: ["work", "shortbreak", "longbreak"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setRunning(false);
              setPhase(p);
              setSecondsLeft(PHASE_DURATIONS[p]);
            },
            "data-ocid": `pomodoro.${p}.tab`,
            className: "px-3 py-1 text-xs rounded-md transition-all",
            style: {
              background: phase === p ? bg : "transparent",
              color: phase === p ? color : "var(--os-text-secondary)",
              border: phase === p ? `1px solid ${color}40` : "1px solid transparent"
            },
            children: p === "work" ? "Focus" : p === "shortbreak" ? "Short" : "Long"
          },
          p
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.p,
      {
        initial: { opacity: 0, y: -6 },
        animate: { opacity: 1, y: 0 },
        className: "text-xs font-semibold tracking-widest",
        style: { color },
        children: PHASE_LABELS[phase]
      },
      phase
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          width: "200",
          height: "200",
          viewBox: "0 0 200 200",
          role: "img",
          "aria-label": "Pomodoro timer progress",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "100",
                cy: "100",
                r: RADIUS,
                fill: "none",
                stroke: "var(--os-border-subtle)",
                strokeWidth: "10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.circle,
              {
                cx: "100",
                cy: "100",
                r: RADIUS,
                fill: "none",
                stroke: color,
                strokeWidth: "10",
                strokeLinecap: "round",
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: dashOffset,
                transform: "rotate(-90 100 100)",
                style: { filter: `drop-shadow(0 0 8px ${color})` }
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-4xl font-mono font-bold",
            style: { color, textShadow: `0 0 20px ${color}60` },
            children: [
              minutes,
              ":",
              seconds
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground mt-1", children: [
          sessions,
          " session",
          sessions !== 1 ? "s" : ""
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleReset,
          "data-ocid": "pomodoro.reset.button",
          className: "px-3 py-2 text-xs rounded-lg transition-all hover:bg-white/8 text-muted-foreground hover:text-foreground border border-white/10",
          children: "Reset"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setRunning((r) => !r),
          "data-ocid": "pomodoro.primary_button",
          className: "px-8 py-2 text-sm font-semibold rounded-xl transition-all",
          style: {
            background: running ? "var(--os-border-subtle)" : bg,
            color: running ? "var(--os-text-secondary)" : color,
            border: `1px solid ${color}50`,
            boxShadow: running ? "none" : `0 0 16px ${color}30`
          },
          children: running ? "Pause" : "Start"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleSkip,
          "data-ocid": "pomodoro.skip.button",
          className: "px-3 py-2 text-xs rounded-lg transition-all hover:bg-white/8 text-muted-foreground hover:text-foreground border border-white/10",
          children: "Skip"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-2 h-2 rounded-full transition-all",
        style: {
          background: i < sessions % 4 ? color : "var(--os-text-muted)",
          boxShadow: i < sessions % 4 ? `0 0 6px ${color}` : "none"
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex gap-6 text-center",
        style: {
          borderTop: "1px solid var(--os-border-subtle)",
          paddingTop: 12,
          width: "100%"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", style: { color }, children: stats.totalSessions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-[10px]",
                style: { color: "var(--os-text-muted)" },
                children: "total sessions"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", style: { color }, children: stats.totalMinutes }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-[10px]",
                style: { color: "var(--os-text-muted)" },
                children: "total minutes"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  PomodoroTimer
};
