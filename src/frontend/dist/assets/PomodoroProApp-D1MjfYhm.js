import { r as reactExports, g as ue, j as jsxRuntimeExports, Z as Bell, ap as Flame, V as Settings } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { R as RotateCcw } from "./rotate-ccw-CbOiKPu8.js";
import { S as SkipForward } from "./skip-forward-CovBJiE2.js";
const DEFAULT_SETTINGS = {
  workMin: 25,
  shortMin: 5,
  longMin: 15,
  autoAdvance: false,
  label: "Deep Work"
};
const PHASE_COLORS = {
  work: "rgba(39,215,224,1)",
  short: "rgba(34,197,94,1)",
  long: "rgba(168,85,247,1)"
};
const PHASE_LABEL = {
  work: "Focus Session",
  short: "Short Break",
  long: "Long Break"
};
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function CircleProgress({
  pct,
  color,
  radius = 80
}) {
  const stroke = 6;
  const size = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      style: { transform: "rotate(-90deg)" },
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            fill: "none",
            stroke: "var(--os-border-subtle)",
            strokeWidth: stroke
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            fill: "none",
            stroke: color,
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            style: { transition: "stroke-dashoffset 0.5s ease, stroke 0.4s ease" }
          }
        )
      ]
    }
  );
}
function PomodoroProApp() {
  const {
    data: savedSettings,
    set: setSettings,
    loading: loadingSettings
  } = useCanisterKV(
    "decentos_pomodoro_pro_settings",
    DEFAULT_SETTINGS
  );
  const {
    data: savedHistory,
    set: setHistoryKV,
    loading: loadingHistory
  } = useCanisterKV("decentos_pomodoro_pro_history", {
    streakDays: [],
    sessionsToday: []
  });
  const [settings, setLocalSettings] = reactExports.useState(DEFAULT_SETTINGS);
  const [history, setLocalHistory] = reactExports.useState({
    streakDays: [],
    sessionsToday: []
  });
  const [showSettings, setShowSettings] = reactExports.useState(false);
  const [phase, setPhase] = reactExports.useState("work");
  const [timeLeft, setTimeLeft] = reactExports.useState(25 * 60);
  const [running, setRunning] = reactExports.useState(false);
  const [sessionCount, setSessionCount] = reactExports.useState(0);
  const intervalRef = reactExports.useRef(null);
  const settingsInit = reactExports.useRef(false);
  const historyInit = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!loadingSettings && !settingsInit.current) {
      settingsInit.current = true;
      const s = (savedSettings == null ? void 0 : savedSettings.workMin) ? savedSettings : DEFAULT_SETTINGS;
      setLocalSettings(s);
      setTimeLeft(s.workMin * 60);
    }
  }, [loadingSettings, savedSettings]);
  reactExports.useEffect(() => {
    if (!loadingHistory && !historyInit.current) {
      historyInit.current = true;
      const h = (savedHistory == null ? void 0 : savedHistory.streakDays) ? savedHistory : { streakDays: [], sessionsToday: [] };
      setLocalHistory(h);
      const today = h.sessionsToday.find((s) => s.date === todayStr());
      setSessionCount((today == null ? void 0 : today.count) ?? 0);
    }
  }, [loadingHistory, savedHistory]);
  const phaseDuration = reactExports.useCallback((p, s) => {
    if (p === "work") return s.workMin * 60;
    if (p === "short") return s.shortMin * 60;
    return s.longMin * 60;
  }, []);
  const totalTime = phaseDuration(phase, settings);
  const pct = totalTime > 0 ? timeLeft / totalTime : 0;
  const phaseColor = PHASE_COLORS[phase];
  const advancePhase = reactExports.useCallback(
    (currentPhase, count, s, autoAdv) => {
      let next = "short";
      let newCount = count;
      if (currentPhase === "work") {
        newCount = count + 1;
        next = newCount % 4 === 0 ? "long" : "short";
        ue.success(`Session complete! ${PHASE_LABEL[next]} starting.`, {
          duration: 4e3
        });
      } else {
        next = "work";
        ue.success("Break over! Time to focus.", { duration: 3e3 });
      }
      setPhase(next);
      setTimeLeft(phaseDuration(next, s));
      setSessionCount(newCount);
      return { next, newCount, autoAdv };
    },
    [phaseDuration]
  );
  reactExports.useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (phase === "work") {
            const today = todayStr();
            setLocalHistory((h) => {
              const existing = h.sessionsToday.find((s) => s.date === today);
              const newSessions = existing ? h.sessionsToday.map(
                (s) => s.date === today ? { ...s, count: s.count + 1 } : s
              ) : [...h.sessionsToday, { date: today, count: 1 }];
              const streakDays = h.streakDays.includes(today) ? h.streakDays : [...h.streakDays, today].slice(-60);
              const next = {
                streakDays,
                sessionsToday: newSessions.slice(-30)
              };
              setHistoryKV(next);
              return next;
            });
          }
          const { autoAdv } = advancePhase(
            phase,
            sessionCount,
            settings,
            settings.autoAdvance
          );
          setRunning(autoAdv);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, phase, settings, sessionCount, advancePhase, setHistoryKV]);
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const handleSaveSettings = (s) => {
    setLocalSettings(s);
    setSettings(s);
    setRunning(false);
    setPhase("work");
    setTimeLeft(s.workMin * 60);
    setShowSettings(false);
    ue.success("Settings saved ✓");
  };
  const streak = (() => {
    const days = history.streakDays.sort();
    if (days.length === 0) return 0;
    let streak2 = 0;
    let cur = /* @__PURE__ */ new Date();
    cur.setHours(0, 0, 0, 0);
    for (let i = days.length - 1; i >= 0; i--) {
      const d = new Date(days[i]);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((cur.getTime() - d.getTime()) / 864e5);
      if (diff <= 1) {
        streak2++;
        cur = d;
      } else break;
    }
    return streak2;
  })();
  const boxStyle = {
    background: "rgba(8,14,22,0.95)",
    color: "rgba(232,238,242,0.9)"
  };
  if (showSettings) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsPanel,
      {
        settings,
        onSave: handleSaveSettings,
        onCancel: () => setShowSettings(false)
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full items-center justify-center gap-6",
      style: boxStyle,
      "data-ocid": "pomodoro_pro.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 10,
                letterSpacing: "0.2em",
                color: phaseColor,
                fontWeight: 700,
                opacity: 0.8,
                textTransform: "uppercase",
                marginBottom: 4
              },
              children: settings.label || PHASE_LABEL[phase]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "var(--os-text-muted)" }, children: PHASE_LABEL[phase] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleProgress, { pct, color: phaseColor, radius: 80 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 36,
                      fontWeight: 700,
                      color: "rgba(232,238,242,0.95)",
                      letterSpacing: "-0.02em"
                    },
                    children: [
                      mm,
                      ":",
                      ss
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      fontSize: 10,
                      color: "var(--os-text-muted)",
                      marginTop: 2
                    },
                    children: [
                      "Session #",
                      sessionCount + 1
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setRunning(false);
                setTimeLeft(phaseDuration(phase, settings));
              },
              style: {
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-text-muted)",
                color: "var(--os-text-secondary)",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer"
              },
              "data-ocid": "pomodoro_pro.secondary_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setRunning((r) => !r),
              style: {
                background: phaseColor,
                color: "#000",
                borderRadius: 10,
                padding: "10px 32px",
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
                minWidth: 100,
                transition: "opacity 0.2s"
              },
              "data-ocid": "pomodoro_pro.primary_button",
              children: running ? "Pause" : "Start"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setRunning(false);
                advancePhase(phase, sessionCount, settings, false);
              },
              style: {
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-text-muted)",
                color: "var(--os-text-secondary)",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer"
              },
              "data-ocid": "pomodoro_pro.toggle",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Stat,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-3.5 h-3.5" }),
              label: "Today",
              value: String(sessionCount),
              color: phaseColor
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Stat,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5" }),
              label: "Streak",
              value: `${streak}d`,
              color: "#F97316"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Stat,
            {
              icon: null,
              label: "Auto",
              value: settings.autoAdvance ? "ON" : "OFF",
              color: "var(--os-text-muted)"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowSettings(true),
            style: {
              position: "absolute",
              top: 12,
              right: 12,
              background: "transparent",
              border: "none",
              color: "var(--os-text-muted)",
              cursor: "pointer"
            },
            "data-ocid": "pomodoro_pro.open_modal_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4" })
          }
        )
      ]
    }
  );
}
function Stat({
  icon,
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          color,
          marginBottom: 2
        },
        children: [
          icon,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16, fontWeight: 700 }, children: value })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          fontSize: 10,
          color: "var(--os-text-muted)",
          letterSpacing: "0.08em"
        },
        children: label.toUpperCase()
      }
    )
  ] });
}
function SettingsPanel({
  settings,
  onSave,
  onCancel
}) {
  const [local, setLocal] = reactExports.useState(settings);
  const inp = (field, min, max) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type: "number",
      min,
      max,
      value: local[field],
      onChange: (e) => setLocal((s) => ({
        ...s,
        [field]: Math.min(max, Math.max(min, Number(e.target.value)))
      })),
      style: {
        width: 64,
        background: "rgba(15,22,30,0.9)",
        border: "1px solid rgba(39,215,224,0.25)",
        color: "rgba(232,238,242,0.9)",
        borderRadius: 6,
        padding: "4px 8px",
        fontSize: 13,
        outline: "none",
        textAlign: "center"
      }
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full p-6 gap-5",
      style: {
        background: "rgba(8,14,22,0.95)",
        color: "rgba(232,238,242,0.9)"
      },
      "data-ocid": "pomodoro_pro.modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h3",
          {
            style: {
              fontSize: 16,
              fontWeight: 700,
              color: "var(--os-accent)",
              marginBottom: 0
            },
            children: "Timer Settings"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Session Label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: local.label,
              onChange: (e) => setLocal((s) => ({ ...s, label: e.target.value })),
              style: {
                background: "rgba(15,22,30,0.9)",
                border: "1px solid rgba(39,215,224,0.25)",
                color: "rgba(232,238,242,0.9)",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 13,
                outline: "none",
                width: 140
              },
              "data-ocid": "pomodoro_pro.input"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Work (min)", children: inp("workMin", 5, 60) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Short Break (min)", children: inp("shortMin", 1, 30) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Long Break (min)", children: inp("longMin", 5, 60) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Auto Advance", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setLocal((s) => ({ ...s, autoAdvance: !s.autoAdvance })),
              style: {
                background: local.autoAdvance ? "rgba(39,215,224,0.15)" : "var(--os-border-subtle)",
                border: `1px solid ${local.autoAdvance ? "rgba(39,215,224,0.4)" : "var(--os-text-muted)"}`,
                color: local.autoAdvance ? "#27D7E0" : "var(--os-text-secondary)",
                borderRadius: 6,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer"
              },
              "data-ocid": "pomodoro_pro.toggle",
              children: local.autoAdvance ? "ON" : "OFF"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onSave(local),
              style: {
                background: "rgba(39,215,224,0.15)",
                border: "1px solid rgba(39,215,224,0.4)",
                color: "var(--os-accent)",
                borderRadius: 8,
                padding: "8px 24px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer"
              },
              "data-ocid": "pomodoro_pro.save_button",
              children: "Save"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onCancel,
              style: {
                background: "transparent",
                border: "1px solid var(--os-text-muted)",
                color: "var(--os-text-secondary)",
                borderRadius: 8,
                padding: "8px 24px",
                fontSize: 13,
                cursor: "pointer"
              },
              "data-ocid": "pomodoro_pro.cancel_button",
              children: "Cancel"
            }
          )
        ] })
      ]
    }
  );
}
function Row({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: "var(--os-text-secondary)" }, children: label }),
    children
  ] });
}
export {
  PomodoroProApp
};
