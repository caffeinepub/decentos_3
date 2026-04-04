import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, av as Target } from "./index-8tMpYjTW.js";
import { P as Pause } from "./pause-4HbYDkez.js";
import { P as Play } from "./play-BQFY022i.js";
import { R as RotateCcw } from "./rotate-ccw-CbOiKPu8.js";
import { V as Volume2 } from "./volume-2-CkOzDXDC.js";
import { C as CircleCheckBig } from "./circle-check-big-CvRYHAqA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "M16 14v6", key: "1j4efv" }],
  ["path", { d: "M8 14v6", key: "17c4r9" }],
  ["path", { d: "M12 16v6", key: "c8a4gj" }]
];
const CloudRain = createLucideIcon("cloud-rain", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M14 2v2", key: "6buw04" }],
  [
    "path",
    {
      d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
      key: "pwadti"
    }
  ],
  ["path", { d: "M6 2v2", key: "colzsn" }]
];
const Coffee = createLucideIcon("coffee", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
];
const VolumeX = createLucideIcon("volume-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2", key: "148xed" }],
  ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2", key: "1u4tom" }],
  ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2", key: "75valh" }]
];
const Wind = createLucideIcon("wind", __iconNode);
const STORAGE_KEY = "decentos_focusmode_sessions";
const DEFAULT_DURATION = 25 * 60;
function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  return `${m}m`;
}
function createWhiteNoise(ctx) {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start();
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  source.connect(gain);
  return gain;
}
function createRainNoise(ctx) {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start();
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 900;
  const filter2 = ctx.createBiquadFilter();
  filter2.type = "lowpass";
  filter2.frequency.value = 6e3;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  source.connect(filter);
  filter.connect(filter2);
  filter2.connect(gain);
  return gain;
}
function createCafeNoise(ctx) {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start();
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 400;
  filter.Q.value = 0.3;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  source.connect(filter);
  filter.connect(gain);
  return gain;
}
const SOUND_OPTIONS = [
  { id: "none", label: "Silent", icon: VolumeX },
  { id: "whitenoise", label: "White Noise", icon: Wind },
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "cafe", label: "Café", icon: Coffee }
];
const PRESET_DURATIONS = [
  { label: "5m", value: 5 * 60 },
  { label: "15m", value: 15 * 60 },
  { label: "25m", value: 25 * 60 },
  { label: "50m", value: 50 * 60 }
];
function FocusMode() {
  const [totalSeconds, setTotalSeconds] = reactExports.useState(DEFAULT_DURATION);
  const [remaining, setRemaining] = reactExports.useState(DEFAULT_DURATION);
  const [running, setRunning] = reactExports.useState(false);
  const [sound, setSound] = reactExports.useState("none");
  const [sessions, setSessions] = reactExports.useState(() => loadSessions());
  const audioCtxRef = reactExports.useRef(null);
  const audioNodeRef = reactExports.useRef(null);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            const newSession = {
              id: `session-${Date.now()}`,
              duration: totalSeconds,
              sound,
              completedAt: Date.now()
            };
            setSessions((prev2) => {
              const updated = [newSession, ...prev2].slice(0, 10);
              saveSessions(updated);
              return updated;
            });
            return 0;
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
  }, [running, totalSeconds, sound]);
  reactExports.useEffect(() => {
    if (sound === "none" || !running) {
      if (audioNodeRef.current) {
        try {
          audioNodeRef.current.gain.setValueAtTime(
            0,
            audioCtxRef.current.currentTime
          );
        } catch {
        }
        audioNodeRef.current = null;
      }
      if (audioCtxRef.current && sound === "none") {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (audioNodeRef.current) {
      try {
        audioNodeRef.current.gain.setValueAtTime(
          0,
          ctx.currentTime
        );
      } catch {
      }
      audioNodeRef.current = null;
    }
    let node;
    if (sound === "whitenoise") node = createWhiteNoise(ctx);
    else if (sound === "rain") node = createRainNoise(ctx);
    else node = createCafeNoise(ctx);
    node.connect(ctx.destination);
    audioNodeRef.current = node;
    return () => {
      try {
        node.gain.setValueAtTime(0, ctx.currentTime);
      } catch {
      }
    };
  }, [sound, running]);
  reactExports.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);
  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 90;
  const dashOffset = circumference * (1 - progress);
  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setRemaining(totalSeconds);
  };
  const setPreset = (secs) => {
    setRunning(false);
    setTotalSeconds(secs);
    setRemaining(secs);
  };
  const soundActive = sound !== "none" && running;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: {
        background: "var(--os-bg-app)",
        color: "var(--os-text-primary)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-5 pt-4 pb-3 border-b",
            style: { borderColor: "var(--os-border-subtle)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-7 h-7 rounded-lg flex items-center justify-center",
                  style: { background: "linear-gradient(135deg,#7c3aed,#5b21b6)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4 text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "var(--os-text-primary)" },
                    children: "Focus Mode"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", style: { color: "var(--os-text-muted)" }, children: "Deep work, one session at a time" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-start overflow-y-auto px-6 py-5 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: PRESET_DURATIONS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setPreset(p.value),
              className: "px-3 h-7 rounded-lg text-xs font-semibold transition-all",
              style: {
                background: totalSeconds === p.value ? "rgba(124,58,237,0.25)" : "var(--os-bg-elevated)",
                border: totalSeconds === p.value ? "1px solid rgba(124,58,237,0.5)" : "1px solid var(--os-border-subtle)",
                color: totalSeconds === p.value ? "rgba(167,139,250,1)" : "var(--os-text-secondary)"
              },
              children: p.label
            },
            p.value
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative flex items-center justify-center",
              style: { width: 220, height: 220 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    width: "220",
                    height: "220",
                    className: "-rotate-90",
                    "aria-label": "Focus timer progress",
                    role: "img",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "110",
                          cy: "110",
                          r: "90",
                          fill: "none",
                          stroke: "var(--os-border-subtle)",
                          strokeWidth: "8"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "110",
                          cy: "110",
                          r: "90",
                          fill: "none",
                          stroke: remaining === 0 ? "rgba(74,222,128,0.9)" : "rgba(124,58,237,0.9)",
                          strokeWidth: "8",
                          strokeLinecap: "round",
                          strokeDasharray: circumference,
                          strokeDashoffset: dashOffset,
                          style: {
                            transition: "stroke-dashoffset 1s linear, stroke 0.5s ease"
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
                      className: "font-mono font-bold",
                      style: {
                        fontSize: 48,
                        letterSpacing: "-0.04em",
                        color: remaining === 0 ? "rgba(74,222,128,0.9)" : "var(--os-text-primary)"
                      },
                      children: formatTime(remaining)
                    }
                  ),
                  remaining === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs mt-1",
                      style: { color: "rgba(74,222,128,0.8)" },
                      children: "Session complete!"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[11px] mt-1",
                      style: { color: "var(--os-text-muted)" },
                      children: running ? "Focusing…" : "Ready"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            running ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handlePause,
                "data-ocid": "focusmode.toggle",
                className: "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                style: {
                  background: "rgba(124,58,237,0.2)",
                  border: "2px solid rgba(124,58,237,0.5)",
                  color: "rgba(167,139,250,1)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-5 h-5" })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleStart,
                "data-ocid": "focusmode.toggle",
                className: "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                style: {
                  background: remaining === 0 ? "rgba(74,222,128,0.15)" : "rgba(124,58,237,0.2)",
                  border: remaining === 0 ? "2px solid rgba(74,222,128,0.4)" : "2px solid rgba(124,58,237,0.5)",
                  color: remaining === 0 ? "rgba(74,222,128,0.9)" : "rgba(167,139,250,1)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 ml-0.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleReset,
                "data-ocid": "focusmode.secondary_button",
                className: "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                style: {
                  background: "var(--os-bg-elevated)",
                  border: "1.5px solid var(--os-border-subtle)",
                  color: "var(--os-text-secondary)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[10px] font-semibold mb-2 uppercase tracking-widest",
                style: { color: "var(--os-text-muted)" },
                children: "Ambient Sound"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: SOUND_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = sound === opt.id;
              const isPlaying = active && soundActive;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setSound(opt.id),
                  "data-ocid": "focusmode.toggle",
                  className: "flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all",
                  style: {
                    background: active ? "rgba(124,58,237,0.18)" : "var(--os-bg-elevated)",
                    border: active ? "1px solid rgba(124,58,237,0.4)" : "1px solid var(--os-border-subtle)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Icon,
                        {
                          className: "w-4 h-4",
                          style: {
                            color: active ? "rgba(167,139,250,1)" : "var(--os-text-secondary)"
                          }
                        }
                      ),
                      isPlaying && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full",
                          style: { background: "rgba(74,222,128,0.9)" }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] font-medium",
                        style: {
                          color: active ? "rgba(167,139,250,0.9)" : "var(--os-text-muted)"
                        },
                        children: opt.label
                      }
                    )
                  ]
                },
                opt.id
              );
            }) })
          ] }),
          sessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[10px] font-semibold mb-2 uppercase tracking-widest",
                style: { color: "var(--os-text-muted)" },
                children: "Recent Sessions"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: sessions.slice(0, 5).map((s, i) => {
              const opt = SOUND_OPTIONS.find((o) => o.id === s.sound);
              const Icon = (opt == null ? void 0 : opt.icon) ?? Volume2;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2.5 px-3 py-2 rounded-lg",
                  "data-ocid": `focusmode.item.${i + 1}`,
                  style: {
                    background: "var(--os-bg-elevated)",
                    border: "1px solid var(--os-border-subtle)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheckBig,
                      {
                        className: "w-3.5 h-3.5 flex-shrink-0",
                        style: { color: "rgba(74,222,128,0.7)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "flex-1 text-xs",
                        style: { color: "var(--os-text-primary)" },
                        children: [
                          formatDuration(s.duration),
                          " session"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Icon,
                      {
                        className: "w-3 h-3 flex-shrink-0",
                        style: { color: "var(--os-text-muted)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px]",
                        style: { color: "var(--os-text-muted)" },
                        children: new Date(s.completedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      }
                    )
                  ]
                },
                s.id
              );
            }) })
          ] }),
          sessions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-full max-w-xs flex flex-col items-center gap-2 py-4",
              "data-ocid": "focusmode.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Target,
                  {
                    className: "w-8 h-8",
                    style: { color: "var(--os-text-muted)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "var(--os-text-muted)" }, children: "Complete a session to start your log" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  FocusMode
};
