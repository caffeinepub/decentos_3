import { u as useOS, i as useActor, r as reactExports, j as jsxRuntimeExports, a9 as Activity, R as RefreshCw, aa as Server, ab as Cpu, ac as Zap } from "./index-8tMpYjTW.js";
import { B as Badge } from "./badge-DoqMcUVj.js";
import { B as Button } from "./button-BMA-bo_z.js";
import { P as Progress } from "./progress-DDd4SXAK.js";
import { S as ScrollArea } from "./scroll-area-frdS_iE5.js";
import "./utils-CLTBVgOB.js";
import "./index-Dt4skXFn.js";
import "./index-H3VjlnDK.js";
import "./index-DQsGwgle.js";
import "./index-BlmlyJvC.js";
import "./index-Bh3wJO-k.js";
import "./index-B5o_Z5wf.js";
import "./index-BeS__rWb.js";
import "./index-IXOTxK3N.js";
function formatUptime(startTimeBigInt) {
  const startMs = Number(startTimeBigInt / BigInt(1e6));
  const nowMs = Date.now();
  const diffSec = Math.floor((nowMs - startMs) / 1e3);
  if (diffSec < 60) return `${diffSec}s`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ${diffSec % 60}s`;
  return `${Math.floor(diffSec / 3600)}h ${Math.floor(diffSec % 3600 / 60)}m`;
}
function formatSystemUptime() {
  const nowMs = Date.now();
  const startMs = nowMs - (performance.now() || 0);
  const diffSec = Math.floor((nowMs - startMs) / 1e3);
  if (diffSec < 60) return `${diffSec}s`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
  return `${Math.floor(diffSec / 3600)}h ${Math.floor(diffSec % 3600 / 60)}m`;
}
function formatSystemTime(t) {
  const ms = Number(t / BigInt(1e6));
  return new Date(ms).toLocaleTimeString();
}
function formatCycles(c) {
  if (c > BigInt(1e9)) return `${(Number(c) / 1e9).toFixed(2)}B`;
  if (c > BigInt(1e6)) return `${(Number(c) / 1e6).toFixed(2)}M`;
  if (c > BigInt(1e3)) return `${(Number(c) / 1e3).toFixed(1)}K`;
  return `${c}`;
}
function totalMemoryKB(processes) {
  return processes.reduce((acc, p) => acc + Number(p.memoryUsage) / 1024, 0);
}
function MemSparkline({ history }) {
  if (history.length < 2) return null;
  const max = Math.max(...history, 1);
  const W = 60;
  const H = 20;
  const pts = history.map((v, i) => {
    const x = i / (history.length - 1) * W;
    const y = H - v / max * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      width: W,
      height: H,
      style: { overflow: "visible", flexShrink: 0 },
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "polyline",
        {
          points: pts,
          fill: "none",
          stroke: "rgba(39,215,224,0.6)",
          strokeWidth: 1.5,
          strokeLinejoin: "round",
          strokeLinecap: "round"
        }
      )
    }
  );
}
function ProcessMonitor() {
  const { windows, closeWindow } = useOS();
  const { actor, isFetching } = useActor();
  const [stats, setStats] = reactExports.useState(null);
  const [processes, setProcesses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [confirmKillId, setConfirmKillId] = reactExports.useState(null);
  const memHistoryRef = reactExports.useRef({});
  const fetchData = reactExports.useCallback(async () => {
    if (!actor || isFetching) return;
    setLoading(true);
    try {
      const appIds = windows.filter((w) => !Number.isNaN(Number(w.appId))).map((w) => Number(w.appId));
      const [sysStats, procs] = await Promise.all([
        actor.getSystemStats(),
        actor.listRunningProcesses(new Uint32Array(appIds))
      ]);
      setStats(sysStats);
      setProcesses(procs);
      for (const proc of procs) {
        const key = String(proc.appId);
        const hist = memHistoryRef.current[key] ?? [];
        hist.push(Number(proc.memoryUsage) / 1024);
        if (hist.length > 10) hist.shift();
        memHistoryRef.current[key] = hist;
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching, windows]);
  reactExports.useEffect(() => {
    fetchData();
  }, [fetchData]);
  reactExports.useEffect(() => {
    const interval = setInterval(fetchData, 3e3);
    return () => clearInterval(interval);
  }, [fetchData]);
  const openWindows = windows.filter((w) => !w.minimized);
  const maxMem = Math.max(1, ...processes.map((p) => Number(p.memoryUsage)));
  const maxCycles = Math.max(
    1,
    ...processes.map((p) => Number(p.cyclesUsed ?? BigInt(0)))
  );
  const handleKillConfirmed = (winId) => {
    closeWindow(winId);
    setConfirmKillId(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(8,12,16,0.97)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 px-3 py-2",
            style: {
              borderBottom: "1px solid rgba(39,215,224,0.15)",
              background: "rgba(11,20,26,0.9)"
            },
            "data-ocid": "processmonitor.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 os-cyan-text" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold os-cyan-text tracking-wider", children: "PROCESS MONITOR" }),
                loading && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 text-muted-foreground/50 animate-spin ml-auto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "grid grid-cols-3 gap-2 mb-2 p-2 rounded",
                  style: {
                    background: "rgba(39,215,224,0.04)",
                    border: "1px solid rgba(39,215,224,0.08)"
                  },
                  "data-ocid": "processmonitor.section",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Server,
                        {
                          className: "w-3 h-3",
                          style: { color: "rgba(39,215,224,0.6)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-[9px]",
                            style: { color: "var(--os-text-muted)" },
                            children: "Running Apps"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs font-bold font-mono",
                            style: { color: "var(--os-accent)" },
                            children: openWindows.length
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Cpu,
                        {
                          className: "w-3 h-3",
                          style: { color: "rgba(39,215,224,0.6)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-[9px]",
                            style: { color: "var(--os-text-muted)" },
                            children: "Total Memory"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "p",
                          {
                            className: "text-xs font-bold font-mono",
                            style: { color: "var(--os-accent)" },
                            children: [
                              totalMemoryKB(processes).toFixed(1),
                              " KB"
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Zap,
                        {
                          className: "w-3 h-3",
                          style: { color: "rgba(39,215,224,0.6)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-[9px]",
                            style: { color: "var(--os-text-muted)" },
                            children: "Uptime"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs font-bold font-mono",
                            style: { color: "var(--os-accent)" },
                            children: formatSystemUptime()
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              ),
              stats ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4", children: [
                {
                  label: "OS Version",
                  value: stats.osVersion,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-3 h-3" })
                },
                {
                  label: "System Time",
                  value: formatSystemTime(stats.systemTime),
                  icon: null
                },
                {
                  label: "Cycles Balance",
                  value: formatCycles(stats.simulatedCyclesBalance),
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" })
                },
                {
                  label: "Installed Apps",
                  value: String(stats.totalInstalledApps),
                  icon: null
                }
              ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded px-2 py-1.5",
                  style: {
                    background: "rgba(39,215,224,0.05)",
                    border: "1px solid rgba(39,215,224,0.1)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-muted-foreground/60 text-[10px] mb-0.5", children: [
                      stat.icon,
                      stat.label
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono os-cyan-text font-semibold", children: stat.value })
                  ]
                },
                stat.label
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-12 rounded animate-pulse",
                  style: { background: "rgba(39,215,224,0.05)" },
                  "data-ocid": "processmonitor.loading_state"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "tr",
            {
              style: {
                borderBottom: "1px solid rgba(39,215,224,0.15)",
                background: "rgba(11,20,26,0.8)"
              },
              children: [
                "PID",
                "App Name",
                "Memory",
                "Cycles",
                "Uptime",
                "Status",
                "Actions"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "text-left px-3 py-2 text-[10px] font-semibold tracking-wider",
                  style: { color: "rgba(39,215,224,0.6)" },
                  children: h
                },
                h
              ))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: openWindows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center gap-2 py-12",
              "data-ocid": "processmonitor.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-8 h-8 text-muted-foreground/20" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/40 text-xs", children: "No processes running" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/25 text-[10px]", children: "Open apps from the desktop to see them here" })
              ]
            }
          ) }) }) : openWindows.map((win, idx) => {
            const proc = processes.find(
              (p) => String(p.appId) === win.appId
            );
            const memPct = proc ? Math.round(Number(proc.memoryUsage) / maxMem * 100) : 0;
            const cyclesPct = (proc == null ? void 0 : proc.cyclesUsed) ? Math.round(Number(proc.cyclesUsed) / maxCycles * 100) : 0;
            const isConfirming = confirmKillId === win.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                "data-ocid": `processmonitor.row.item.${idx + 1}`,
                className: "group transition-colors",
                style: {
                  borderBottom: "1px solid rgba(39,215,224,0.06)",
                  background: idx % 2 === 0 ? "rgba(39,215,224,0.02)" : "transparent"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "rgba(39,215,224,0.06)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = idx % 2 === 0 ? "rgba(39,215,224,0.02)" : "transparent";
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-muted-foreground/50", children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-semibold text-foreground/80", children: win.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground/70 text-[10px]", children: proc ? `${(Number(proc.memoryUsage) / 1024).toFixed(1)} KB` : "—" }),
                      proc && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MemSparkline,
                        {
                          history: memHistoryRef.current[String(proc.appId)] ?? []
                        }
                      )
                    ] }),
                    proc && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Progress,
                      {
                        value: memPct,
                        className: "h-1 w-16",
                        style: {
                          background: "rgba(39,215,224,0.1)"
                        }
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground/70 text-[10px]", children: (proc == null ? void 0 : proc.cyclesUsed) != null ? formatCycles(proc.cyclesUsed) : "—" }),
                    (proc == null ? void 0 : proc.cyclesUsed) != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Progress,
                      {
                        value: cyclesPct,
                        className: "h-1 w-16",
                        style: {
                          background: "rgba(39,215,224,0.1)"
                        }
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-muted-foreground/70", children: proc ? formatUptime(proc.startTime) : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: "text-[9px] px-1.5 py-0",
                      style: {
                        background: "rgba(39,215,224,0.15)",
                        color: "var(--os-accent)",
                        border: "1px solid rgba(39,215,224,0.3)"
                      },
                      children: "Running"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: isConfirming ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-1",
                      "data-ocid": `processmonitor.confirm.${idx + 1}.dialog`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-[9px]",
                            style: { color: "var(--os-text-secondary)" },
                            children: "Sure?"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleKillConfirmed(win.id),
                            "data-ocid": `processmonitor.confirm_button.${idx + 1}`,
                            className: "px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors",
                            style: {
                              background: "rgba(239,68,68,0.2)",
                              color: "#EF4444",
                              border: "1px solid rgba(239,68,68,0.4)"
                            },
                            children: "Kill"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setConfirmKillId(null),
                            "data-ocid": `processmonitor.cancel_button.${idx + 1}`,
                            className: "px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors",
                            style: {
                              background: "transparent",
                              color: "var(--os-text-secondary)",
                              border: "1px solid var(--os-border-window)"
                            },
                            children: "No"
                          }
                        )
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-6 px-2 text-[10px] text-destructive hover:bg-destructive/20 hover:text-destructive",
                      onClick: () => setConfirmKillId(win.id),
                      "data-ocid": `processmonitor.delete_button.${idx + 1}`,
                      children: "Kill"
                    }
                  ) })
                ]
              },
              win.id
            );
          }) })
        ] }) })
      ]
    }
  );
}
export {
  ProcessMonitor
};
