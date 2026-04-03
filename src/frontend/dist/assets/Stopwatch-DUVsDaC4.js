import { r as reactExports, j as jsxRuntimeExports, aF as Timer, aG as Flag } from "./index-CZGIn5x2.js";
import { R as RotateCcw } from "./rotate-ccw-CflrNuEr.js";
import { S as Square } from "./square-ClZfPILt.js";
function formatTime(ms) {
  const h = Math.floor(ms / 36e5);
  const m = Math.floor(ms % 36e5 / 6e4);
  const s = Math.floor(ms % 6e4 / 1e3);
  const cc = Math.floor(ms % 1e3 / 10);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cc).padStart(2, "0")}`;
}
function Stopwatch() {
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [running, setRunning] = reactExports.useState(false);
  const [laps, setLaps] = reactExports.useState([]);
  const intervalRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(0);
  const baseElapsedRef = reactExports.useRef(0);
  const lastLapCumRef = reactExports.useRef(0);
  const start = reactExports.useCallback(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsed(baseElapsedRef.current + (Date.now() - startTimeRef.current));
    }, 33);
    setRunning(true);
  }, []);
  const stop = reactExports.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    baseElapsedRef.current += Date.now() - startTimeRef.current;
    setRunning(false);
  }, []);
  const reset = reactExports.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    baseElapsedRef.current = 0;
    lastLapCumRef.current = 0;
    setElapsed(0);
    setRunning(false);
    setLaps([]);
  }, []);
  const addLap = reactExports.useCallback(() => {
    if (!running) return;
    const cumulative = elapsed;
    const lapTime = cumulative - lastLapCumRef.current;
    lastLapCumRef.current = cumulative;
    setLaps((prev) => [
      { index: prev.length + 1, lapTime, cumulative },
      ...prev
    ]);
  }, [elapsed, running]);
  reactExports.useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );
  const lapTimes = laps.map((l) => l.lapTime);
  const fastest = lapTimes.length > 1 ? Math.min(...lapTimes) : null;
  const slowest = lapTimes.length > 1 ? Math.max(...lapTimes) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(11,15,18,0.6)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Timer,
              {
                className: "w-4 h-4",
                style: { color: "rgba(39,215,224,0.5)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[11px] font-semibold uppercase tracking-widest",
                style: { color: "rgba(39,215,224,0.5)" },
                children: "Stopwatch"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono font-bold tracking-tight select-none",
              style: {
                fontSize: "clamp(32px,6vw,52px)",
                color: running ? "rgba(39,215,224,0.95)" : elapsed > 0 ? "rgba(220,235,240,0.9)" : "rgba(220,235,240,0.4)",
                textShadow: running ? "0 0 24px rgba(39,215,224,0.4)" : "none",
                transition: "color 0.3s, text-shadow 0.3s",
                letterSpacing: "-0.02em"
              },
              "data-ocid": "stopwatch.panel",
              children: formatTime(elapsed)
            }
          ),
          running && laps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-2 text-sm font-mono",
              style: { color: "rgba(180,200,210,0.35)" },
              children: [
                "Lap ",
                laps.length + 1,
                ": ",
                formatTime(elapsed - lastLapCumRef.current)
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: reset,
                disabled: elapsed === 0,
                "data-ocid": "stopwatch.secondary_button",
                className: "w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-text-muted)",
                  color: "rgba(180,200,210,0.7)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: running ? stop : start,
                "data-ocid": "stopwatch.primary_button",
                className: "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                style: {
                  background: running ? "rgba(239,68,68,0.15)" : "rgba(39,215,224,0.15)",
                  border: running ? "2px solid rgba(239,68,68,0.5)" : "2px solid rgba(39,215,224,0.5)",
                  color: running ? "rgba(252,165,165,0.9)" : "rgba(39,215,224,0.9)",
                  boxShadow: running ? "0 0 24px rgba(239,68,68,0.15)" : "0 0 24px rgba(39,215,224,0.1)"
                },
                children: running ? /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-6 h-6", fill: "currentColor" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm tracking-wider", children: "GO" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: addLap,
                disabled: !running,
                "data-ocid": "stopwatch.toggle",
                className: "w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-text-muted)",
                  color: "rgba(180,200,210,0.7)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        laps.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 overflow-y-auto border-t",
            style: { borderColor: "rgba(42,58,66,0.8)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "px-4 py-2 grid text-[10px] font-semibold uppercase tracking-widest",
                  style: {
                    color: "rgba(180,200,210,0.3)",
                    gridTemplateColumns: "2rem 1fr 1fr"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "#" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Lap" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" })
                  ]
                }
              ),
              laps.map((lap, i) => {
                const isFastest = fastest !== null && lap.lapTime === fastest;
                const isSlowest = slowest !== null && lap.lapTime === slowest;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `stopwatch.item.${i + 1}`,
                    className: "px-4 py-2.5 grid items-center text-[12px] font-mono",
                    style: {
                      gridTemplateColumns: "2rem 1fr 1fr",
                      borderBottom: "1px solid rgba(42,58,66,0.3)",
                      background: isFastest ? "rgba(34,197,94,0.05)" : isSlowest ? "rgba(239,68,68,0.05)" : "transparent"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(180,200,210,0.3)" }, children: lap.index }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          style: {
                            color: isFastest ? "rgba(74,222,128,0.9)" : isSlowest ? "rgba(252,165,165,0.9)" : "rgba(220,235,240,0.8)"
                          },
                          children: [
                            formatTime(lap.lapTime),
                            isFastest && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "ml-1.5 text-[9px]",
                                style: { color: "rgba(74,222,128,0.6)" },
                                children: "▲ best"
                              }
                            ),
                            isSlowest && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "ml-1.5 text-[9px]",
                                style: { color: "rgba(252,165,165,0.6)" },
                                children: "▼ slow"
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(180,200,210,0.45)" }, children: formatTime(lap.cumulative) })
                    ]
                  },
                  lap.index
                );
              })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 flex items-center justify-center",
            "data-ocid": "stopwatch.empty_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "rgba(180,200,210,0.2)" }, children: "Press GO then Flag to record laps" })
          }
        )
      ]
    }
  );
}
export {
  Stopwatch
};
