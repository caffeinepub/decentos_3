import { r as reactExports, j as jsxRuntimeExports, T as Trash2, g as ue } from "./index-CZGIn5x2.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { L as Label } from "./label-CGkVOZPp.js";
import { S as ScrollArea } from "./scroll-area-0_61eqCO.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
import "./index-B9-lQkRo.js";
import "./index-YwGfiBwk.js";
import "./index-DxR-hlVQ.js";
import "./index-DfmnWLAm.js";
import "./index-C4X58sdz.js";
import "./index-9Nd72esH.js";
import "./index-IXOTxK3N.js";
function calcHours(bedtime, waketime) {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = waketime.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return Math.round(mins / 60 * 10) / 10;
}
function SleepTracker(_) {
  const { data: sleepData, set: saveSleepData } = useCanisterKV(
    "decentos_sleep_tracker",
    { entries: [], goalHours: 8 }
  );
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [bedtime, setBedtime] = reactExports.useState("22:30");
  const [waketime, setWaketime] = reactExports.useState("06:30");
  const [quality, setQuality] = reactExports.useState(4);
  const [editingGoal, setEditingGoal] = reactExports.useState(false);
  const [goalInput, setGoalInput] = reactExports.useState("8");
  const entries = sleepData.entries;
  const goalHours = sleepData.goalHours;
  const addEntry = () => {
    if (!bedtime || !waketime) {
      ue.error("Enter bedtime and wake time");
      return;
    }
    const hours = calcHours(bedtime, waketime);
    const entry = {
      id: `${Date.now()}`,
      date,
      bedtime,
      waketime,
      hours,
      quality
    };
    saveSleepData({ ...sleepData, entries: [entry, ...entries] });
    ue.success(`Logged ${hours}h sleep ✓`);
  };
  const deleteEntry = (id) => {
    saveSleepData({
      ...sleepData,
      entries: entries.filter((e) => e.id !== id)
    });
  };
  const saveGoal = () => {
    const g = Number.parseFloat(goalInput);
    if (!Number.isNaN(g) && g > 0) {
      saveSleepData({ ...sleepData, goalHours: g });
      ue.success("Goal updated ✓");
    }
    setEditingGoal(false);
  };
  const last7 = reactExports.useMemo(() => entries.slice(0, 7).reverse(), [entries]);
  const avgHours = reactExports.useMemo(() => {
    if (last7.length === 0) return 0;
    return Math.round(last7.reduce((a, e) => a + e.hours, 0) / last7.length * 10) / 10;
  }, [last7]);
  const maxH = Math.max(...last7.map((e) => e.hours), goalHours, 8);
  const qualityColor = (q) => q >= 5 ? "#27D7E0" : q >= 3 ? "#F59E0B" : "#EF4444";
  const hoursColor = (h) => h >= goalHours ? "#27D7E0" : h >= goalHours * 0.8 ? "#F59E0B" : "#EF4444";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full flex-col gap-4 overflow-hidden p-4",
      style: { background: "rgba(11,15,18,0.7)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/50 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "sleeptracker.input",
                  type: "date",
                  value: date,
                  onChange: (e) => setDate(e.target.value),
                  className: "border-border bg-muted/50 text-foreground"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: "Bedtime" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "sleeptracker.input",
                  type: "time",
                  value: bedtime,
                  onChange: (e) => setBedtime(e.target.value),
                  className: "border-border bg-muted/50 text-foreground"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: "Wake Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "sleeptracker.input",
                  type: "time",
                  value: waketime,
                  onChange: (e) => setWaketime(e.target.value),
                  className: "border-border bg-muted/50 text-foreground"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: "Quality:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setQuality(s),
                style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  opacity: s <= quality ? 1 : 0.25
                },
                children: "★"
              },
              s
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: qualityColor(quality) }, children: ["Poor", "Fair", "Good", "Great", "Excellent"][quality - 1] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "sleeptracker.submit_button",
              className: "w-full font-semibold",
              style: { background: "var(--os-accent)", color: "#000" },
              onClick: addEntry,
              children: "Log Sleep"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/50 p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60", children: "7-Day Avg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-xl font-bold",
                style: { color: hoursColor(avgHours) },
                children: [
                  avgHours,
                  "h"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/50 p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60", children: "Sleep Goal" }),
            editingGoal ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: goalInput,
                  onChange: (e) => setGoalInput(e.target.value),
                  onBlur: saveGoal,
                  onKeyDown: (e) => e.key === "Enter" && saveGoal(),
                  className: "w-12 text-center text-sm bg-transparent border-b border-white/30 outline-none text-foreground"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: "h" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setGoalInput(String(goalHours));
                  setEditingGoal(true);
                },
                className: "text-xl font-bold",
                style: {
                  color: "var(--os-accent)",
                  background: "none",
                  border: "none",
                  cursor: "pointer"
                },
                children: [
                  goalHours,
                  "h"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60", children: "tap to edit" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/50 p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60", children: "Entries" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-foreground", children: entries.length })
          ] })
        ] }),
        last7.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/50 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs text-muted-foreground/60", children: "Last 7 nights" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-28 items-end gap-2", children: last7.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-1 flex-col items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full rounded-t relative",
                    style: {
                      height: `${e.hours / maxH * 90}px`,
                      background: qualityColor(e.quality ?? 3),
                      minHeight: "4px"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      bottom: `${goalHours / maxH * 90}px`,
                      left: 0,
                      right: 0,
                      height: 1,
                      borderTop: "1px dashed var(--os-text-muted)",
                      pointerEvents: "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground/60", children: e.date.slice(5) })
              ]
            },
            e.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-muted-foreground/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    width: 12,
                    borderTop: "1px dashed var(--os-text-muted)",
                    display: "inline-block"
                  }
                }
              ),
              goalHours,
              "h goal"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "flex items-center gap-1 text-[10px]",
                style: { color: "var(--os-accent)" },
                children: "★★★★★ Excellent"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "flex items-center gap-1 text-[10px]",
                style: { color: "#F59E0B" },
                children: "★★★ Good"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "flex items-center gap-1 text-[10px]",
                style: { color: "#EF4444" },
                children: "★ Poor"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-full", children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "sleeptracker.empty_state",
            className: "flex h-24 items-center justify-center text-sm text-muted-foreground/60",
            children: "No sleep entries yet"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-white/5", children: entries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `sleeptracker.item.${i + 1}`,
            className: "flex items-center justify-between px-4 py-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children: e.date }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground/60", children: [
                  e.bedtime,
                  " → ",
                  e.waketime
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-sm font-semibold",
                      style: { color: hoursColor(e.hours) },
                      children: [
                        e.hours,
                        "h"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs",
                      style: { color: qualityColor(e.quality ?? 3) },
                      children: "★".repeat(e.quality ?? 3)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `sleeptracker.delete_button.${i + 1}`,
                    size: "sm",
                    variant: "ghost",
                    onClick: () => deleteEntry(e.id),
                    className: "h-6 w-6 p-0 text-muted-foreground/60 hover:text-red-400",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                  }
                )
              ] })
            ]
          },
          e.id
        )) }) }) })
      ]
    }
  );
}
export {
  SleepTracker
};
