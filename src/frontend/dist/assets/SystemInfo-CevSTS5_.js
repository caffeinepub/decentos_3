import { v as useInstalledApps, r as reactExports, j as jsxRuntimeExports, aa as Server, ac as Zap, ab as Cpu, P as Package, a9 as Activity, aW as Database, n as Copy, g as ue } from "./index-8tMpYjTW.js";
import { B as Button } from "./button-BMA-bo_z.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { H as HardDrive } from "./hard-drive-DuGhljbC.js";
import "./utils-CLTBVgOB.js";
import "./index-Dt4skXFn.js";
function formatMemory(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
function formatCycles(n) {
  return `${(n / 1e9).toFixed(2)}B`;
}
function SystemInfo({ windowProps: _windowProps }) {
  const { installedApps } = useInstalledApps();
  const { data: notes, set: setNotes } = useCanisterKV(
    "systeminfo-notes",
    ""
  );
  const [notesValue, setNotesValue] = reactExports.useState("");
  const [uptime, setUptime] = reactExports.useState(0);
  const cycles = 847392847219;
  const stableMemoryBytes = 4821330;
  const heapBytes = 12450882;
  const installedCount = installedApps.length;
  reactExports.useEffect(() => {
    setNotesValue(notes);
  }, [notes]);
  reactExports.useEffect(() => {
    const base = Math.floor(Math.random() * 86400 * 3);
    setUptime(base);
    const interval = setInterval(() => setUptime((u) => u + 1), 1e3);
    return () => clearInterval(interval);
  }, []);
  const formatUptime = (secs) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor(secs % 86400 / 3600);
    const m = Math.floor(secs % 3600 / 60);
    const s = secs % 60;
    if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };
  const generateReport = () => {
    return [
      "DecentOS System Report",
      `Generated: ${(/* @__PURE__ */ new Date()).toISOString()}`,
      "",
      "OS Version: DecentOS v63",
      `Cycles Balance: ${formatCycles(cycles)} (${cycles.toLocaleString()} raw)`,
      `Stable Memory: ${formatMemory(stableMemoryBytes)}`,
      `Heap Memory: ${formatMemory(heapBytes)}`,
      `Installed Apps: ${installedCount}`,
      `Uptime: ${formatUptime(uptime)}`,
      "Platform: Internet Computer (ICP)"
    ].join("\n");
  };
  const copyReport = () => {
    navigator.clipboard.writeText(generateReport());
    ue.success("System report copied to clipboard");
  };
  const stats = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-4 h-4", style: { color: "rgb(39,215,224)" } }),
      label: "OS Version",
      value: "DecentOS v63"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4", style: { color: "#FEBC2E" } }),
      label: "Cycles Balance",
      value: `${formatCycles(cycles)}`
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-4 h-4", style: { color: "#28C840" } }),
      label: "Stable Memory",
      value: formatMemory(stableMemoryBytes)
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-4 h-4", style: { color: "#a78bfa" } }),
      label: "Heap Memory",
      value: formatMemory(heapBytes)
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4", style: { color: "rgb(39,215,224)" } }),
      label: "Installed Apps",
      value: String(installedCount)
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4", style: { color: "#f472b6" } }),
      label: "Uptime",
      value: formatUptime(uptime)
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4", style: { color: "rgb(39,215,224)" } }),
      label: "Platform",
      value: "Internet Computer"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "systeminfo.panel",
      className: "flex flex-col h-full overflow-y-auto",
      style: {
        background: "rgba(11,15,18,0.6)",
        padding: 16,
        gap: 16,
        display: "flex",
        flexDirection: "column"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Server,
              {
                className: "w-5 h-5",
                style: {
                  color: "rgb(39,215,224)",
                  filter: "drop-shadow(0 0 6px rgba(39,215,224,0.5))"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-sm font-semibold",
                style: { color: "rgb(39,215,224)" },
                children: "System Information"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-7 text-xs gap-1",
              onClick: copyReport,
              "data-ocid": "systeminfo.primary_button",
              style: {
                color: "rgb(39,215,224)",
                border: "1px solid rgba(39,215,224,0.3)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }),
                "Copy Report"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 flex-shrink-0", children: stats.map(({ icon, label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 rounded-lg px-3 py-2.5",
            style: {
              background: "rgba(20,32,42,0.6)",
              border: "1px solid rgba(39,215,224,0.1)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-[10px] font-medium uppercase tracking-wider",
                    style: { color: "var(--os-text-muted)" },
                    children: label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-sm font-mono font-medium",
                    style: { color: "var(--os-text-primary)" },
                    children: value
                  }
                )
              ] })
            ]
          },
          label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg p-3 flex-shrink-0",
            style: {
              background: "rgba(20,32,42,0.6)",
              border: "1px solid rgba(39,215,224,0.1)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-medium",
                    style: { color: "var(--os-text-secondary)" },
                    children: "Stable Memory Usage"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-mono",
                    style: { color: "rgba(39,215,224,0.8)" },
                    children: [
                      formatMemory(stableMemoryBytes),
                      " / 400 GB"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-1.5 rounded-full",
                  style: { background: "var(--os-border-subtle)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full",
                      style: {
                        width: `${stableMemoryBytes / (400 * 1024 * 1024 * 1024) * 100}%`,
                        background: "linear-gradient(to right, rgba(39,215,224,0.8), rgba(39,215,224,0.4))",
                        minWidth: 4
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px] mt-1.5",
                  style: { color: "var(--os-text-muted)" },
                  children: "400 GB total canister capacity"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-medium",
              style: { color: "var(--os-text-secondary)" },
              children: "System Notes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              "data-ocid": "systeminfo.textarea",
              value: notesValue,
              onChange: (e) => setNotesValue(e.target.value),
              onBlur: () => {
                if (notesValue !== notes) setNotes(notesValue);
              },
              placeholder: "Add notes about this system instance...",
              className: "flex-1 resize-none rounded-lg p-2 text-xs outline-none",
              style: {
                background: "rgba(20,32,42,0.6)",
                border: "1px solid rgba(39,215,224,0.1)",
                color: "var(--os-text-primary)",
                fontFamily: "monospace",
                minHeight: 80
              }
            }
          )
        ] })
      ]
    }
  );
}
export {
  SystemInfo
};
