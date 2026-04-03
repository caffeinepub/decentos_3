import { r as reactExports, j as jsxRuntimeExports, aL as Wifi, T as Trash2, ab as Clock, a3 as ChevronDown, f as ChevronRight, X } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { S as Send } from "./send-jovXziLb.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];
function NetworkMonitor() {
  const [method, setMethod] = reactExports.useState("GET");
  const [url, setUrl] = reactExports.useState("");
  const [headers, setHeaders] = reactExports.useState([
    { id: "1", key: "", value: "" }
  ]);
  const [body, setBody] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [response, setResponse] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const { data: history, set: setHistoryChain } = useCanisterKV(
    "decent_network_monitor_history",
    []
  );
  const [showHeaders, setShowHeaders] = reactExports.useState(false);
  const send = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    const start = performance.now();
    try {
      const reqHeaders = {};
      for (const h of headers) {
        if (h.key.trim()) reqHeaders[h.key.trim()] = h.value.trim();
      }
      const opts = { method, headers: reqHeaders };
      if (method !== "GET" && method !== "DELETE" && body.trim()) {
        opts.body = body;
      }
      const res = await fetch(url.trim(), opts);
      const elapsed = Math.round(performance.now() - start);
      const resText = await res.text();
      let parsed = null;
      try {
        parsed = JSON.parse(resText);
      } catch {
      }
      const resHeaders = {};
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });
      setResponse({
        status: res.status,
        time: elapsed,
        headers: resHeaders,
        body: resText,
        parsed
      });
      const entry = {
        id: Date.now().toString(),
        method,
        url: url.trim(),
        status: res.status,
        time: elapsed,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      };
      const updated = [entry, ...history].slice(0, 10);
      setHistoryChain(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };
  const loadFromHistory = (entry) => {
    setMethod(entry.method);
    setUrl(entry.url);
  };
  const clearHistory = () => {
    setHistoryChain([]);
  };
  const statusColor = (s) => s >= 200 && s < 300 ? "rgb(39,215,160)" : s >= 400 ? "rgb(255,100,100)" : "rgb(255,200,80)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: {
        background: "rgba(5,5,10,0.95)",
        color: "#e8e8ee",
        fontSize: 13
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-4 py-3 flex-shrink-0",
            style: { borderBottom: "1px solid rgba(39,215,224,0.1)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { style: { color: "rgb(39,215,224)", width: 18, height: 18 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Network Monitor" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-48 flex-shrink-0 flex flex-col overflow-hidden",
              style: { borderRight: "1px solid rgba(39,215,224,0.1)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between px-3 py-2",
                    style: { borderBottom: "1px solid rgba(39,215,224,0.08)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs opacity-50 font-medium", children: "HISTORY" }),
                      history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: clearHistory, title: "Clear", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Trash2,
                        {
                          width: 12,
                          height: 12,
                          className: "opacity-40 hover:opacity-70"
                        }
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] opacity-30 text-center mt-6", children: "No history" }) : history.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `network-monitor.item.${idx + 1}`,
                    onClick: () => loadFromHistory(entry),
                    className: "w-full text-left px-3 py-2 hover:bg-white/5 transition-colors",
                    style: { borderBottom: "1px solid var(--os-border-subtle)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-[9px] font-bold px-1 py-0.5 rounded",
                            style: {
                              background: "rgba(39,215,224,0.15)",
                              color: "rgb(39,215,224)"
                            },
                            children: entry.method
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: { color: statusColor(entry.status), fontSize: 10 },
                            children: entry.status
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] opacity-60 truncate", children: entry.url }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5 opacity-40", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { width: 9, height: 9 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px]", children: [
                          entry.time,
                          "ms · ",
                          entry.timestamp
                        ] })
                      ] })
                    ]
                  },
                  entry.id
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-3 flex-shrink-0",
                style: { borderBottom: "1px solid rgba(39,215,224,0.08)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        "data-ocid": "network-monitor.select",
                        value: method,
                        onChange: (e) => setMethod(e.target.value),
                        className: "rounded-lg px-2 py-1.5 text-xs font-bold",
                        style: {
                          background: "rgba(39,215,224,0.12)",
                          border: "1px solid rgba(39,215,224,0.25)",
                          color: "rgb(39,215,224)",
                          outline: "none"
                        },
                        children: METHODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "option",
                          {
                            value: m,
                            style: { background: "var(--os-bg-app)" },
                            children: m
                          },
                          m
                        ))
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        "data-ocid": "network-monitor.input",
                        type: "text",
                        value: url,
                        onChange: (e) => setUrl(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && send(),
                        placeholder: "https://api.example.com/endpoint",
                        className: "flex-1 rounded-lg px-3 py-1.5 text-xs",
                        style: {
                          background: "var(--os-border-subtle)",
                          border: "1px solid rgba(39,215,224,0.2)",
                          color: "#e8e8ee",
                          outline: "none"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "network-monitor.primary_button",
                        onClick: send,
                        disabled: loading || !url.trim(),
                        className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        style: {
                          background: loading ? "rgba(39,215,224,0.08)" : "rgba(39,215,224,0.18)",
                          color: "rgb(39,215,224)",
                          border: "1px solid rgba(39,215,224,0.3)",
                          opacity: loading || !url.trim() ? 0.6 : 1
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { width: 12, height: 12 }),
                          loading ? "Sending..." : "Send"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowHeaders(!showHeaders),
                        className: "flex items-center gap-1 text-[11px] opacity-50 hover:opacity-80 transition-opacity mb-1",
                        children: [
                          showHeaders ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { width: 12, height: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { width: 12, height: 12 }),
                          "Headers"
                        ]
                      }
                    ),
                    showHeaders && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      headers.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            "data-ocid": "network-monitor.input",
                            type: "text",
                            placeholder: "Key",
                            value: h.key,
                            onChange: (e) => {
                              setHeaders(
                                (prev) => prev.map(
                                  (x) => x.id === h.id ? { ...x, key: e.target.value } : x
                                )
                              );
                            },
                            className: "flex-1 rounded px-2 py-1 text-[11px]",
                            style: {
                              background: "var(--os-border-subtle)",
                              border: "1px solid var(--os-text-muted)",
                              color: "#e8e8ee",
                              outline: "none"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "Value",
                            value: h.value,
                            onChange: (e) => {
                              setHeaders(
                                (prev) => prev.map(
                                  (x) => x.id === h.id ? { ...x, value: e.target.value } : x
                                )
                              );
                            },
                            className: "flex-1 rounded px-2 py-1 text-[11px]",
                            style: {
                              background: "var(--os-border-subtle)",
                              border: "1px solid var(--os-text-muted)",
                              color: "#e8e8ee",
                              outline: "none"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setHeaders(
                              (prev) => prev.filter((x) => x.id !== h.id)
                            ),
                            className: "opacity-40 hover:opacity-70",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { width: 12, height: 12 })
                          }
                        )
                      ] }, h.id)),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setHeaders((prev) => [
                            ...prev,
                            { id: Date.now().toString(), key: "", value: "" }
                          ]),
                          className: "flex items-center gap-1 text-[11px] opacity-40 hover:opacity-70",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { width: 10, height: 10 }),
                            " Add Header"
                          ]
                        }
                      )
                    ] })
                  ] }),
                  (method === "POST" || method === "PUT" || method === "PATCH") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      "data-ocid": "network-monitor.textarea",
                      rows: 3,
                      value: body,
                      onChange: (e) => setBody(e.target.value),
                      placeholder: "Request body (JSON, text, etc.)",
                      className: "w-full rounded-lg px-3 py-2 text-xs resize-none",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid var(--os-text-muted)",
                        color: "#e8e8ee",
                        outline: "none",
                        fontFamily: "'JetBrains Mono', monospace"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] opacity-30 mt-1", children: "Note: For true on-chain HTTP outcalls, use the Terminal app" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-3", children: [
              loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "network-monitor.loading_state",
                  className: "flex items-center gap-2 opacity-50",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-4 h-4 rounded-full border-2 animate-spin",
                        style: {
                          borderColor: "rgba(39,215,224,0.3)",
                          borderTopColor: "transparent"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Sending request..." })
                  ]
                }
              ),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "network-monitor.error_state",
                  className: "rounded-lg p-3 text-xs",
                  style: {
                    background: "rgba(255,60,60,0.1)",
                    border: "1px solid rgba(255,60,60,0.2)",
                    color: "rgb(255,120,120)"
                  },
                  children: error
                }
              ),
              response && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "network-monitor.success_state",
                  className: "space-y-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-lg font-bold",
                          style: { color: statusColor(response.status) },
                          children: response.status
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs opacity-50", children: [
                        response.time,
                        "ms"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "text-[11px] opacity-50 cursor-pointer hover:opacity-80 select-none", children: [
                        "Response Headers (",
                        Object.keys(response.headers).length,
                        ")"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "mt-2 rounded-lg p-2 text-[11px] space-y-1",
                          style: {
                            background: "var(--os-border-subtle)",
                            fontFamily: "monospace"
                          },
                          children: Object.entries(response.headers).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgb(39,215,224)" }, children: [
                              k,
                              ": "
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70", children: v })
                          ] }, k))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] opacity-50 mb-1", children: "Body" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "pre",
                        {
                          className: "rounded-lg p-3 text-[11px] overflow-x-auto",
                          style: {
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid var(--os-border-subtle)",
                            fontFamily: "'JetBrains Mono', monospace",
                            color: response.parsed !== null ? "rgb(180,220,180)" : "#c0c0c8",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all"
                          },
                          children: response.parsed !== null ? JSON.stringify(response.parsed, null, 2) : response.body || "(empty)"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  NetworkMonitor,
  NetworkMonitor as default
};
