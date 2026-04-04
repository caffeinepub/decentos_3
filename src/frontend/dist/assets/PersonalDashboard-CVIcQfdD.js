import { r as reactExports, j as jsxRuntimeExports, aP as LayoutDashboard, V as Settings, a3 as Monitor } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
const QUOTES = [
  "The best way to predict the future is to create it.",
  "It always seems impossible until it's done.",
  "Code is like poetry — the best is concise and expressive.",
  "Build things that matter. Ship things that work.",
  "Discipline is the bridge between goals and accomplishment.",
  "The only way to do great work is to love what you do.",
  "Small daily improvements lead to staggering long-term results.",
  "Done is better than perfect.",
  "The secret of getting ahead is getting started.",
  "Simplicity is the ultimate sophistication.",
  "Move fast and fix things.",
  "Focus is saying no to a hundred good ideas.",
  "Make it work, make it right, make it fast.",
  "Every expert was once a beginner.",
  "Your most unhappy customers are your greatest source of learning.",
  "The best error message is the one that never shows up.",
  "First, solve the problem. Then, write the code.",
  "Programs must be written for people to read.",
  "Perfection is achieved when there is nothing left to remove.",
  "The computer was born to solve problems that did not exist before."
];
function getQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 0).getTime()) / 864e5
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
function loadRecent() {
  try {
    const raw = localStorage.getItem("spotlight_recent");
    if (!raw) return [];
    return JSON.parse(raw).slice(0, 5);
  } catch {
    return [];
  }
}
function ClockWidget() {
  const [time, setTime] = reactExports.useState(() => /* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const id = setInterval(() => setTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "font-bold tracking-widest",
        style: {
          fontSize: 38,
          color: "rgb(39,215,224)",
          fontFamily: "'JetBrains Mono', monospace",
          textShadow: "0 0 20px rgba(39,215,224,0.4)"
        },
        children: [
          h,
          ":",
          m,
          ":",
          s
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-50 mt-1", children: dateStr })
  ] });
}
function NoteWidget() {
  const { data: savedNote, set: saveNote } = useCanisterKV(
    "decent_dashboard_note",
    ""
  );
  const [note, setNote] = reactExports.useState("");
  const saveTimeout = reactExports.useRef(null);
  const hydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setNote(savedNote);
  }, [savedNote]);
  const handleChange = (val) => {
    setNote(val);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveNote(val), 600);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-ocid": "personal-dashboard.textarea",
      value: note,
      onChange: (e) => handleChange(e.target.value),
      placeholder: "Quick note...",
      className: "w-full flex-1 resize-none text-sm",
      style: {
        background: "transparent",
        border: "none",
        outline: "none",
        color: "#c8c8d4",
        minHeight: 80
      }
    }
  );
}
function RecentAppsWidget() {
  const recent = loadRecent();
  if (recent.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-40", children: "No recent apps" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: recent.map((appId) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "px-2 py-1 rounded-md text-xs",
      style: {
        background: "rgba(39,215,224,0.1)",
        color: "rgb(39,215,224)",
        border: "1px solid rgba(39,215,224,0.2)"
      },
      children: appId
    },
    appId
  )) });
}
function SystemWidget() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const res = `${window.screen.width}×${window.screen.height}`;
  const ua = navigator.userAgent.split(" ").slice(-2).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 text-xs", children: [
    ["Timezone", tz],
    ["Resolution", res],
    ["Browser", ua]
  ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-50", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", children: v })
  ] }, k)) });
}
const WIDGET_LABELS = {
  clock: "Clock",
  note: "Quick Note",
  recent: "Recent Apps",
  quote: "Daily Quote",
  system: "System Status"
};
const DEFAULT_CONFIG = {
  clock: true,
  note: true,
  recent: true,
  quote: true,
  system: true
};
function PersonalDashboard() {
  const { data: savedConfig, set: persistConfig } = useCanisterKV("decent_dashboard_config", DEFAULT_CONFIG);
  const [config, setConfig] = reactExports.useState(DEFAULT_CONFIG);
  const configHydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (configHydratedRef.current) return;
    configHydratedRef.current = true;
    setConfig(savedConfig);
  }, [savedConfig]);
  const [configuring, setConfiguring] = reactExports.useState(false);
  const toggle = (key) => {
    const next = { ...config, [key]: !config[key] };
    setConfig(next);
    persistConfig(next);
  };
  const quote = getQuote();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: "rgba(5,5,10,0.95)", color: "#e8e8ee" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 flex-shrink-0",
            style: { borderBottom: "1px solid rgba(39,215,224,0.1)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LayoutDashboard,
                  {
                    style: { color: "rgb(39,215,224)", width: 18, height: 18 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: "Personal Dashboard" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "personal-dashboard.open_modal_button",
                  onClick: () => setConfiguring(true),
                  className: "p-1.5 rounded-lg hover:bg-white/10 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { width: 14, height: 14, className: "opacity-50" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          config.clock && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "personal-dashboard.card",
              className: "col-span-2 rounded-xl p-4",
              style: {
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest opacity-40 mb-2", children: "Clock" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ClockWidget, {})
              ]
            }
          ),
          config.quote && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "personal-dashboard.panel",
              className: "col-span-2 rounded-xl p-4",
              style: {
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest opacity-40 mb-2", children: "Daily Quote" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm italic opacity-80 leading-relaxed", children: [
                  "“",
                  quote,
                  "”"
                ] })
              ]
            }
          ),
          config.note && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "personal-dashboard.card",
              className: "col-span-2 rounded-xl p-3",
              style: {
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest opacity-40 mb-2", children: "Quick Note" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(NoteWidget, {})
              ]
            }
          ),
          config.recent && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "personal-dashboard.card",
              className: "rounded-xl p-3",
              style: {
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest opacity-40 mb-2", children: "Recent Apps" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(RecentAppsWidget, {})
              ]
            }
          ),
          config.system && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "personal-dashboard.card",
              className: "rounded-xl p-3",
              style: {
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest opacity-40 mb-2", children: "System" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SystemWidget, {})
              ]
            }
          )
        ] }) }),
        configuring && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 z-[9999] flex items-center justify-center",
            style: { background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" },
            onClick: () => setConfiguring(false),
            onKeyDown: (e) => e.key === "Escape" && setConfiguring(false),
            role: "presentation",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "personal-dashboard.dialog",
                className: "rounded-2xl p-5 w-72",
                style: {
                  background: "rgba(10,15,25,0.98)",
                  border: "1px solid rgba(39,215,224,0.25)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.8)"
                },
                onClick: (e) => e.stopPropagation(),
                onKeyDown: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Monitor,
                      {
                        style: { color: "rgb(39,215,224)", width: 16, height: 16 }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: "Widgets" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Object.keys(WIDGET_LABELS).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: WIDGET_LABELS[key] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "personal-dashboard.toggle",
                        onClick: () => toggle(key),
                        className: "relative w-9 h-5 rounded-full transition-colors",
                        style: {
                          background: config[key] ? "rgba(39,215,224,0.4)" : "var(--os-text-muted)",
                          border: "1px solid rgba(39,215,224,0.3)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "absolute top-0.5 w-4 h-4 rounded-full transition-all",
                            style: {
                              left: config[key] ? "calc(100% - 18px)" : "2px",
                              background: config[key] ? "rgb(39,215,224)" : "var(--os-text-muted)"
                            }
                          }
                        )
                      }
                    )
                  ] }, key)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "personal-dashboard.close_button",
                      onClick: () => setConfiguring(false),
                      className: "mt-4 w-full py-2 rounded-lg text-xs",
                      style: {
                        background: "rgba(39,215,224,0.12)",
                        color: "rgb(39,215,224)",
                        border: "1px solid rgba(39,215,224,0.2)"
                      },
                      children: "Done"
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  PersonalDashboard,
  PersonalDashboard as default
};
