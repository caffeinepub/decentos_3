import { r as reactExports, j as jsxRuntimeExports, T as Trash2, ab as Clock } from "./index-CZGIn5x2.js";
import { B as Badge } from "./badge-D2FbqHYW.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { S as ScrollArea } from "./scroll-area-0_61eqCO.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DpmLlbMX.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { S as Square } from "./square-ClZfPILt.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import { P as Play } from "./play-BWBgGvVq.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
import "./index-B9-lQkRo.js";
import "./index-YwGfiBwk.js";
import "./index-DxR-hlVQ.js";
import "./index-DfmnWLAm.js";
import "./index-C4X58sdz.js";
import "./index-9Nd72esH.js";
import "./index-IXOTxK3N.js";
import "./index-D8sJW3Ik.js";
import "./index-uZuUQcbU.js";
import "./index-CY_eMQHg.js";
const PROJECT_COLORS = [
  "rgba(39,215,224,0.8)",
  "rgba(99,102,241,0.8)",
  "rgba(236,72,153,0.8)",
  "rgba(34,197,94,0.8)",
  "rgba(249,115,22,0.8)",
  "rgba(168,85,247,0.8)"
];
const DEFAULT_DATA = {
  projects: [
    { id: "p1", name: "DecentOS Development", color: PROJECT_COLORS[0] },
    { id: "p2", name: "Design Research", color: PROJECT_COLORS[1] },
    { id: "p3", name: "Documentation", color: PROJECT_COLORS[2] }
  ],
  entries: []
};
function formatDuration(ms) {
  const s = Math.floor(ms / 1e3);
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
function formatHours(h) {
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
function TimeTracker() {
  var _a;
  const { data, set } = useCanisterKV(
    "decentos_timetracker_data",
    DEFAULT_DATA
  );
  const { projects, entries } = data;
  const [activeTimer, setActiveTimer] = reactExports.useState(null);
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [newProjectName, setNewProjectName] = reactExports.useState("");
  const [selectedProject, setSelectedProject] = reactExports.useState("");
  const [manualDate, setManualDate] = reactExports.useState(
    (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const [manualHours, setManualHours] = reactExports.useState("");
  const [manualDesc, setManualDesc] = reactExports.useState("");
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (activeTimer) {
      intervalRef.current = setInterval(
        () => setElapsed(Date.now() - activeTimer.startTime),
        1e3
      );
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTimer]);
  const addProject = () => {
    if (!newProjectName.trim()) return;
    const color = PROJECT_COLORS[projects.length % PROJECT_COLORS.length];
    set({
      ...data,
      projects: [
        ...projects,
        { id: `p${Date.now()}`, name: newProjectName.trim(), color }
      ]
    });
    setNewProjectName("");
  };
  const deleteProject = (id) => {
    set({
      projects: projects.filter((p) => p.id !== id),
      entries: entries.filter((e) => e.projectId !== id)
    });
    if ((activeTimer == null ? void 0 : activeTimer.projectId) === id) setActiveTimer(null);
  };
  const startTimer = (projectId) => {
    if (activeTimer) stopTimer();
    setActiveTimer({ projectId, startTime: Date.now() });
  };
  const stopTimer = () => {
    if (!activeTimer) return;
    const ms = Date.now() - activeTimer.startTime;
    const hours = ms / 36e5;
    if (hours > 0.01) {
      set({
        ...data,
        entries: [
          ...entries,
          {
            id: `e${Date.now()}`,
            projectId: activeTimer.projectId,
            date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            hours,
            description: "Timer session"
          }
        ]
      });
    }
    setActiveTimer(null);
  };
  const addManualEntry = () => {
    if (!selectedProject || !manualHours || Number.isNaN(Number(manualHours)))
      return;
    set({
      ...data,
      entries: [
        ...entries,
        {
          id: `e${Date.now()}`,
          projectId: selectedProject,
          date: manualDate,
          hours: Number.parseFloat(manualHours),
          description: manualDesc || "Manual entry"
        }
      ]
    });
    setManualHours("");
    setManualDesc("");
  };
  const getTotalHoursForProject = (projectId) => entries.filter((e) => e.projectId === projectId).reduce((s, e) => s + e.hours, 0);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const weekStart = /* @__PURE__ */ new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const todayTotal = entries.filter((e) => e.date === today).reduce((s, e) => s + e.hours, 0);
  const weekTotal = entries.filter((e) => e.date >= weekStartStr).reduce((s, e) => s + e.hours, 0);
  const panelStyle = {
    background: "var(--os-border-subtle)",
    border: "1px solid rgba(39,215,224,0.15)",
    borderRadius: 10
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full p-4 gap-4",
      style: { background: "var(--os-bg-app)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 px-4 py-3", style: panelStyle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-mono uppercase tracking-widest",
                style: { color: "rgba(39,215,224,0.5)" },
                children: "Today"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-2xl font-mono font-bold",
                style: { color: "rgba(39,215,224,0.95)" },
                children: formatHours(todayTotal)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 px-4 py-3", style: panelStyle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-mono uppercase tracking-widest",
                style: { color: "rgba(39,215,224,0.5)" },
                children: "This Week"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-2xl font-mono font-bold",
                style: { color: "rgba(39,215,224,0.95)" },
                children: formatHours(weekTotal)
              }
            )
          ] })
        ] }),
        activeTimer && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 rounded-lg",
            style: {
              background: "rgba(39,215,224,0.06)",
              border: "1px solid rgba(39,215,224,0.3)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-2 h-2 rounded-full animate-pulse",
                    style: { background: "rgba(39,215,224,0.9)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm font-medium",
                    style: { color: "var(--os-text-primary)" },
                    children: (_a = projects.find((p) => p.id === activeTimer.projectId)) == null ? void 0 : _a.name
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xl font-mono font-bold",
                    style: { color: "rgba(39,215,224,0.9)" },
                    children: formatDuration(elapsed)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "destructive",
                    onClick: stopTimer,
                    "data-ocid": "timetracker.stop.button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-3 h-3 mr-1" }),
                      " Stop"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "projects", className: "flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "self-start", "data-ocid": "timetracker.tab", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "projects", children: "Projects" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "log", children: "Log Entry" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "history", children: "History" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsContent,
            {
              value: "projects",
              className: "flex-1 flex flex-col gap-3 mt-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: newProjectName,
                      onChange: (e) => setNewProjectName(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && addProject(),
                      placeholder: "New project name...",
                      "data-ocid": "timetracker.input",
                      className: "h-8 text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      onClick: addProject,
                      "data-ocid": "timetracker.add.button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 pr-2", children: [
                  projects.map((project, i) => {
                    const isActive = (activeTimer == null ? void 0 : activeTimer.projectId) === project.id;
                    const total = getTotalHoursForProject(project.id);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        "data-ocid": `timetracker.item.${i + 1}`,
                        style: {
                          background: "var(--os-border-subtle)",
                          border: `1px solid ${isActive ? "rgba(39,215,224,0.3)" : "var(--os-border-subtle)"}`
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                              style: { background: project.color }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "flex-1 text-sm font-medium",
                              style: { color: "var(--os-text-primary)" },
                              children: project.name
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-xs font-mono",
                              style: { color: "rgba(39,215,224,0.7)" },
                              children: formatHours(total)
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => isActive ? stopTimer() : startTimer(project.id),
                              "data-ocid": `timetracker.toggle.${i + 1}`,
                              className: "w-7 h-7 flex items-center justify-center rounded transition-all",
                              style: {
                                background: isActive ? "rgba(239,68,68,0.15)" : "rgba(39,215,224,0.1)",
                                color: isActive ? "rgba(239,68,68,0.8)" : "rgba(39,215,224,0.8)"
                              },
                              children: isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => deleteProject(project.id),
                              "data-ocid": `timetracker.delete_button.${i + 1}`,
                              className: "w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-red-400 transition-colors",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ]
                      },
                      project.id
                    );
                  }),
                  projects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "text-center py-8 text-sm",
                      style: { color: "var(--os-text-muted)" },
                      "data-ocid": "timetracker.empty_state",
                      children: "No projects yet. Create one above."
                    }
                  )
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "log", className: "flex flex-col gap-3 mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", style: panelStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs",
                  style: { color: "rgba(39,215,224,0.7)" },
                  children: "Project"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: selectedProject,
                  onChange: (e) => setSelectedProject(e.target.value),
                  "data-ocid": "timetracker.select",
                  className: "w-full h-9 px-3 rounded-md text-sm",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-primary)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select project..." }),
                    projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "option",
                      {
                        value: p.id,
                        style: { background: "var(--os-bg-app)" },
                        children: p.name
                      },
                      p.id
                    ))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs",
                    style: { color: "rgba(39,215,224,0.7)" },
                    children: "Date"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "date",
                    value: manualDate,
                    onChange: (e) => setManualDate(e.target.value),
                    className: "h-9 text-sm",
                    "data-ocid": "timetracker.date.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs",
                    style: { color: "rgba(39,215,224,0.7)" },
                    children: "Hours"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    value: manualHours,
                    onChange: (e) => setManualHours(e.target.value),
                    placeholder: "e.g. 1.5",
                    step: "0.25",
                    min: "0",
                    className: "h-9 text-sm",
                    "data-ocid": "timetracker.hours.input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs",
                  style: { color: "rgba(39,215,224,0.7)" },
                  children: "Description"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: manualDesc,
                  onChange: (e) => setManualDesc(e.target.value),
                  placeholder: "What did you work on?",
                  className: "h-9 text-sm",
                  "data-ocid": "timetracker.desc.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: addManualEntry,
                "data-ocid": "timetracker.log.submit_button",
                className: "w-full",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 mr-2" }),
                  " Log Time"
                ]
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", className: "flex-1 flex flex-col mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 pr-2", children: [
            [...entries].reverse().map((entry, i) => {
              const project = projects.find((p) => p.id === entry.projectId);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `timetracker.history.item.${i + 1}`,
                  className: "flex items-center gap-3 px-3 py-2 rounded",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-border-subtle)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "w-2 h-2 rounded-full flex-shrink-0",
                        style: {
                          background: (project == null ? void 0 : project.color) ?? "rgba(39,215,224,0.5)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-medium truncate",
                          style: { color: "var(--os-text-secondary)" },
                          children: entry.description
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: "text-[10px]",
                          style: { color: "var(--os-text-muted)" },
                          children: [
                            project == null ? void 0 : project.name,
                            " · ",
                            entry.date
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-[10px] font-mono flex-shrink-0",
                        style: {
                          borderColor: "rgba(39,215,224,0.3)",
                          color: "rgba(39,215,224,0.8)"
                        },
                        children: formatHours(entry.hours)
                      }
                    )
                  ]
                },
                entry.id
              );
            }),
            entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-center py-8 text-sm",
                style: { color: "var(--os-text-muted)" },
                "data-ocid": "timetracker.history.empty_state",
                children: "No time entries yet."
              }
            )
          ] }) }) })
        ] })
      ]
    }
  );
}
export {
  TimeTracker
};
