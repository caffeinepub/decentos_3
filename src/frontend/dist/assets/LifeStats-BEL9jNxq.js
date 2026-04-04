import { r as reactExports, j as jsxRuntimeExports, L as LoaderCircle, T as Trash2, a9 as Activity } from "./index-8tMpYjTW.js";
import { B as Button } from "./button-BMA-bo_z.js";
import { I as Input } from "./input-CCQCx2Ry.js";
import { S as ScrollArea } from "./scroll-area-frdS_iE5.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import "./utils-CLTBVgOB.js";
import "./index-Dt4skXFn.js";
import "./index-DQsGwgle.js";
import "./index-BlmlyJvC.js";
import "./index-Bh3wJO-k.js";
import "./index-H3VjlnDK.js";
import "./index-B5o_Z5wf.js";
import "./index-BeS__rWb.js";
import "./index-IXOTxK3N.js";
const ACCENT = "rgba(39,215,224,";
const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";
const CARD_BG = "rgba(14,20,26,0.8)";
const PRESET_METRICS = [
  { id: "weight", name: "Weight", unit: "kg", color: "var(--os-accent)" },
  { id: "sleep", name: "Sleep", unit: "hrs", color: "#8B5CF6" },
  { id: "energy", name: "Energy", unit: "/10", color: "#F59E0B" }
];
const DEFAULT_DATA = { metrics: PRESET_METRICS, entries: [] };
const METRIC_COLORS = [
  "#27D7E0",
  "#8B5CF6",
  "#F59E0B",
  "#22C55E",
  "#F97316",
  "#EC4899",
  "#A78BFA"
];
function BarChart({
  entries,
  metric
}) {
  const last30 = entries.filter((e) => e.metricId === metric.id).slice(-30);
  if (last30.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: MUTED }, children: "No data yet" });
  const values = last30.map((e) => e.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 400;
  const H = 80;
  const barW = Math.max(4, (W - last30.length * 2) / last30.length);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "100%",
      viewBox: `0 0 ${W} ${H + 20}`,
      style: { overflow: "visible" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
          metric.name,
          " chart"
        ] }),
        last30.map((e, i) => {
          const h = Math.max(3, (e.value - min) / range * H);
          const x = i * (barW + 2);
          const y = H - h;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "rect",
              {
                x,
                y,
                width: barW,
                height: h,
                rx: 2,
                fill: metric.color,
                opacity: 0.7
              }
            ),
            i === last30.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "text",
              {
                x: x + barW / 2,
                y: H + 15,
                textAnchor: "middle",
                fill: MUTED,
                fontSize: 9,
                children: e.date.slice(5)
              }
            ),
            i === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "text",
              {
                x: x + barW / 2,
                y: H + 15,
                textAnchor: "middle",
                fill: MUTED,
                fontSize: 9,
                children: e.date.slice(5)
              }
            )
          ] }, e.id);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: W + 4, y: 4, fill: MUTED, fontSize: 9, textAnchor: "start", children: max.toFixed(1) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: W + 4, y: H, fill: MUTED, fontSize: 9, textAnchor: "start", children: min.toFixed(1) })
      ]
    }
  );
}
function LifeStats({
  windowProps: _windowProps
}) {
  const {
    data,
    set: setData,
    loading
  } = useCanisterKV("decentos_lifestats", DEFAULT_DATA);
  const [selectedMetric, setSelectedMetric] = reactExports.useState(null);
  const [showAddMetric, setShowAddMetric] = reactExports.useState(false);
  const [showLogEntry, setShowLogEntry] = reactExports.useState(false);
  const [newMetricName, setNewMetricName] = reactExports.useState("");
  const [newMetricUnit, setNewMetricUnit] = reactExports.useState("");
  const [newMetricColor, setNewMetricColor] = reactExports.useState(METRIC_COLORS[0]);
  const [logValue, setLogValue] = reactExports.useState("");
  const [logNote, setLogNote] = reactExports.useState("");
  const [logDate, setLogDate] = reactExports.useState(
    (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const activeMetric = reactExports.useMemo(
    () => data.metrics.find((m) => m.id === selectedMetric) ?? data.metrics[0] ?? null,
    [data.metrics, selectedMetric]
  );
  const addMetric = () => {
    if (!newMetricName.trim()) return;
    const metric = {
      id: Date.now().toString(),
      name: newMetricName.trim(),
      unit: newMetricUnit.trim() || "unit",
      color: newMetricColor
    };
    setData({ ...data, metrics: [...data.metrics, metric] });
    setNewMetricName("");
    setNewMetricUnit("");
    setShowAddMetric(false);
  };
  const deleteMetric = (id) => {
    setData({
      metrics: data.metrics.filter((m) => m.id !== id),
      entries: data.entries.filter((e) => e.metricId !== id)
    });
    if (selectedMetric === id) setSelectedMetric(null);
  };
  const logEntry = () => {
    if (!activeMetric || !logValue) return;
    const entry = {
      id: Date.now().toString(),
      metricId: activeMetric.id,
      value: Number.parseFloat(logValue),
      date: logDate,
      note: logNote
    };
    setData({ ...data, entries: [...data.entries, entry] });
    setLogValue("");
    setLogNote("");
    setShowLogEntry(false);
  };
  const deleteEntry = (id) => {
    setData({ ...data, entries: data.entries.filter((e) => e.id !== id) });
  };
  const metricEntries = reactExports.useMemo(
    () => activeMetric ? data.entries.filter((e) => e.metricId === activeMetric.id).slice(-30).reverse() : [],
    [data.entries, activeMetric]
  );
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center h-full",
        style: { background: BG },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          LoaderCircle,
          {
            className: "w-6 h-6 animate-spin",
            style: { color: `${ACCENT}0.7)` }
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: { background: BG, color: TEXT }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col flex-shrink-0",
        style: {
          width: 180,
          background: "rgba(10,16,20,0.7)",
          borderRight: `1px solid ${BORDER}`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-3 flex-shrink-0",
              style: { borderBottom: `1px solid ${BORDER}` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold mb-2", style: { color: TEXT }, children: "Metrics" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "lifestats.primary_button",
                    onClick: () => setShowAddMetric((v) => !v),
                    style: {
                      width: "100%",
                      height: 26,
                      fontSize: 11,
                      background: `${ACCENT}0.1)`,
                      border: `1px solid ${ACCENT}0.25)`,
                      color: `${ACCENT}0.9)`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
                      " Add Metric"
                    ]
                  }
                ),
                showAddMetric && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "lifestats.input",
                      value: newMetricName,
                      onChange: (e) => setNewMetricName(e.target.value),
                      placeholder: "Name (e.g. Steps)",
                      style: {
                        height: 26,
                        fontSize: 11,
                        background: "rgba(20,30,36,0.9)",
                        border: `1px solid ${BORDER}`,
                        color: TEXT
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: newMetricUnit,
                      onChange: (e) => setNewMetricUnit(e.target.value),
                      placeholder: "Unit (e.g. km)",
                      style: {
                        height: 26,
                        fontSize: 11,
                        background: "rgba(20,30,36,0.9)",
                        border: `1px solid ${BORDER}`,
                        color: TEXT
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: METRIC_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setNewMetricColor(c),
                      style: {
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: c,
                        border: newMetricColor === c ? "2px solid white" : "2px solid transparent",
                        cursor: "pointer"
                      }
                    },
                    c
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        "data-ocid": "lifestats.submit_button",
                        onClick: addMetric,
                        style: {
                          flex: 1,
                          height: 24,
                          fontSize: 10,
                          background: `${ACCENT}0.8)`,
                          border: "none",
                          color: "#000",
                          fontWeight: 700
                        },
                        children: "Add"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        "data-ocid": "lifestats.cancel_button",
                        onClick: () => setShowAddMetric(false),
                        style: {
                          flex: 1,
                          height: 24,
                          fontSize: 10,
                          background: "var(--os-border-subtle)",
                          border: `1px solid ${BORDER}`,
                          color: MUTED
                        },
                        children: "Cancel"
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 flex flex-col gap-1", children: data.metrics.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `lifestats.item.${i + 1}`,
              className: "group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer",
              style: {
                background: (activeMetric == null ? void 0 : activeMetric.id) === m.id ? "var(--os-border-subtle)" : "transparent",
                border: `1px solid ${(activeMetric == null ? void 0 : activeMetric.id) === m.id ? BORDER : "transparent"}`
              },
              onClick: () => setSelectedMetric(m.id),
              onKeyDown: (e) => e.key === "Enter" && setSelectedMetric(m.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: m.color,
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "text-xs font-medium truncate",
                      style: { color: TEXT },
                      children: m.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px]", style: { color: MUTED }, children: m.unit })
                ] }),
                !PRESET_METRICS.find((p) => p.id === m.id) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `lifestats.delete_button.${i + 1}`,
                    onClick: (e) => {
                      e.stopPropagation();
                      deleteMetric(m.id);
                    },
                    className: "opacity-0 group-hover:opacity-100 transition-opacity",
                    style: {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(248,113,113,0.6)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                  }
                )
              ]
            },
            m.id
          )) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col overflow-hidden", children: activeMetric ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 px-4 py-3 flex-shrink-0",
          style: {
            borderBottom: `1px solid ${BORDER}`,
            background: "rgba(10,16,20,0.4)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Activity,
              {
                className: "w-4 h-4",
                style: { color: activeMetric.color }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", style: { color: TEXT }, children: activeMetric.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px]", style: { color: MUTED }, children: [
                "tracked in ",
                activeMetric.unit,
                " • ",
                metricEntries.length,
                " ",
                "entries"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                "data-ocid": "lifestats.open_modal_button",
                onClick: () => setShowLogEntry((v) => !v),
                style: {
                  height: 28,
                  fontSize: 11,
                  background: `${activeMetric.color}22`,
                  border: `1px solid ${activeMetric.color}55`,
                  color: activeMetric.color
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
                  " Log Entry"
                ]
              }
            )
          ]
        }
      ),
      showLogEntry && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "p-4 flex-shrink-0",
          style: {
            background: "rgba(14,22,28,0.8)",
            borderBottom: `1px solid ${BORDER}`
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", style: { flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "ls-value",
                    className: "text-[11px]",
                    style: { color: MUTED },
                    children: [
                      "Value (",
                      activeMetric.unit,
                      ")"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "ls-value",
                    type: "number",
                    "data-ocid": "lifestats.input",
                    value: logValue,
                    onChange: (e) => setLogValue(e.target.value),
                    style: {
                      height: 30,
                      fontSize: 12,
                      background: "rgba(20,30,36,0.9)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", style: { flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "ls-date",
                    className: "text-[11px]",
                    style: { color: MUTED },
                    children: "Date"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "ls-date",
                    type: "date",
                    value: logDate,
                    onChange: (e) => setLogDate(e.target.value),
                    style: {
                      height: 30,
                      fontSize: 12,
                      background: "rgba(20,30,36,0.9)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", style: { flex: 2 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "ls-note",
                    className: "text-[11px]",
                    style: { color: MUTED },
                    children: "Note (optional)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "ls-note",
                    value: logNote,
                    onChange: (e) => setLogNote(e.target.value),
                    style: {
                      height: 30,
                      fontSize: 12,
                      background: "rgba(20,30,36,0.9)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT
                    }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  "data-ocid": "lifestats.confirm_button",
                  onClick: logEntry,
                  style: {
                    height: 28,
                    fontSize: 11,
                    background: `${activeMetric.color}cc`,
                    border: "none",
                    color: "#000",
                    fontWeight: 700
                  },
                  children: "Log"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  "data-ocid": "lifestats.cancel_button",
                  onClick: () => setShowLogEntry(false),
                  style: {
                    height: 28,
                    fontSize: 11,
                    background: "var(--os-border-subtle)",
                    border: `1px solid ${BORDER}`,
                    color: MUTED
                  },
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "p-4 flex-shrink-0",
          style: { borderBottom: `1px solid ${BORDER}` },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart, { entries: data.entries, metric: activeMetric })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: metricEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col items-center justify-center h-24 gap-2",
          "data-ocid": "lifestats.empty_state",
          style: { color: MUTED },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", children: [
            "No entries yet. Log your first",
            " ",
            activeMetric.name.toLowerCase(),
            " value above."
          ] })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 flex flex-col gap-2", children: metricEntries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `lifestats.row.${i + 1}`,
          className: "group flex items-center gap-3 p-2 rounded-lg",
          style: {
            background: CARD_BG,
            border: `1px solid ${BORDER}`
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-base font-bold",
                style: { color: activeMetric.color },
                children: [
                  e.value,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs ml-1", style: { color: MUTED }, children: activeMetric.unit })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: MUTED }, children: e.date }),
            e.note && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-xs flex-1 truncate",
                style: { color: TEXT },
                children: e.note
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `lifestats.delete_button.${i + 1}`,
                onClick: () => deleteEntry(e.id),
                className: "opacity-0 group-hover:opacity-100 transition-opacity ml-auto",
                style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(248,113,113,0.5)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
              }
            )
          ]
        },
        e.id
      )) }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center gap-3",
        "data-ocid": "lifestats.empty_state",
        style: { color: MUTED },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-10 h-10 opacity-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "Select a metric to view and log data" })
        ]
      }
    ) })
  ] });
}
export {
  LifeStats
};
