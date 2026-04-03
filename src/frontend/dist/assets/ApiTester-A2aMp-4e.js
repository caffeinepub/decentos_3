import { r as reactExports, j as jsxRuntimeExports, ab as Clock, T as Trash2, aa as Zap, aP as Info } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { S as Send } from "./send-jovXziLb.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import { C as CircleAlert } from "./circle-alert-m71Brf6C.js";
import { C as CircleCheck } from "./circle-check-DLIDLAd8.js";
const METHOD_COLORS = {
  GET: "#27D7E0",
  POST: "#22c55e",
  PUT: "#f59e0b",
  DELETE: "#ef4444",
  PATCH: "#a78bfa"
};
function genId() {
  return `h_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
}
function getStatusColor(status) {
  if (status >= 200 && status < 300) return "#22c55e";
  if (status >= 400 && status < 500) return "#f59e0b";
  return "#ef4444";
}
function prettyJson(str) {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}
function ApiTester({ windowProps: _w }) {
  const [method, setMethod] = reactExports.useState("GET");
  const [url, setUrl] = reactExports.useState(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  const [headers, setHeaders] = reactExports.useState([
    { id: genId(), key: "Accept", value: "application/json" }
  ]);
  const [body, setBody] = reactExports.useState("");
  const [response, setResponse] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState(
    "headers"
  );
  const abortRef = reactExports.useRef(null);
  const { data: history, set: setHistory } = useCanisterKV(
    "apitester_history",
    []
  );
  const addHeader = () => {
    setHeaders((prev) => [...prev, { id: genId(), key: "", value: "" }]);
  };
  const removeHeader = (id) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  };
  const updateHeader = (id, field, val) => {
    setHeaders(
      (prev) => prev.map((h) => h.id === id ? { ...h, [field]: val } : h)
    );
  };
  const sendRequest = async () => {
    if (!url.trim()) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setActiveTab("response");
    const start = Date.now();
    try {
      const hdrs = {};
      for (const h of headers) {
        if (h.key.trim()) hdrs[h.key.trim()] = h.value;
      }
      const init = {
        method,
        headers: hdrs,
        signal: abortRef.current.signal
      };
      if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
        init.body = body;
      }
      const res = await fetch(url, init);
      const elapsed = Date.now() - start;
      const text = await res.text();
      setResponse({
        status: res.status,
        statusText: res.statusText,
        time: elapsed,
        body: text,
        contentType: res.headers.get("content-type") ?? ""
      });
      const entry = {
        method,
        url,
        responseStatus: res.status,
        responseTime: elapsed,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      setHistory([entry, ...history].slice(0, 5));
    } catch (err) {
      const elapsed = Date.now() - start;
      const isCors = err instanceof TypeError && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"));
      setResponse({
        status: 0,
        statusText: "Error",
        time: elapsed,
        body: "",
        contentType: "",
        error: isCors ? "CORS error: the server doesn't allow requests from browsers. Try a public API like https://jsonplaceholder.typicode.com/posts" : String(err)
      });
    } finally {
      setLoading(false);
    }
  };
  const isBodyMethod = ["POST", "PUT", "PATCH"].includes(method);
  const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };
  const muted = "var(--os-text-secondary)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(8,14,20,0.95)", ...mono },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-2.5 border-b flex-shrink-0",
            style: {
              borderColor: "rgba(39,215,224,0.12)",
              background: "rgba(10,16,20,0.7)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["GET", "POST", "PUT", "DELETE", "PATCH"].map(
                (m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `apitester.${m.toLowerCase()}_button`,
                    onClick: () => setMethod(m),
                    className: "px-2 py-1 rounded text-[10px] font-bold transition-all",
                    style: {
                      background: method === m ? `${METHOD_COLORS[m]}22` : "var(--os-border-subtle)",
                      border: method === m ? `1px solid ${METHOD_COLORS[m]}55` : "1px solid var(--os-border-subtle)",
                      color: method === m ? METHOD_COLORS[m] : muted
                    },
                    children: m
                  },
                  m
                )
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: url,
                  onChange: (e) => setUrl(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") sendRequest();
                  },
                  placeholder: "https://api.example.com/endpoint",
                  "data-ocid": "apitester.input",
                  className: "flex-1 px-2 py-1 rounded text-[12px] outline-none",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(39,215,224,0.15)",
                    color: "var(--os-text-primary)",
                    ...mono
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: sendRequest,
                  disabled: loading,
                  "data-ocid": "apitester.submit_button",
                  className: "flex items-center gap-1.5 h-7 px-3 rounded font-semibold text-[11px] transition-all",
                  style: {
                    background: loading ? "rgba(39,215,224,0.07)" : "rgba(39,215,224,0.15)",
                    border: "1px solid rgba(39,215,224,0.35)",
                    color: loading ? "rgba(39,215,224,0.4)" : "#27D7E0"
                  },
                  children: [
                    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" }),
                    loading ? "Sending..." : "Send"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex gap-0 border-b flex-shrink-0",
            style: { borderColor: "rgba(39,215,224,0.1)" },
            children: ["headers", ...isBodyMethod ? ["body"] : [], "response"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `apitester.${tab}_tab`,
                onClick: () => setActiveTab(tab),
                className: "px-4 py-2 text-[11px] font-semibold capitalize transition-all relative",
                style: {
                  color: activeTab === tab ? "#27D7E0" : muted,
                  borderBottom: activeTab === tab ? "2px solid #27D7E0" : "2px solid transparent"
                },
                children: [
                  tab,
                  tab === "response" && response && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "ml-1.5 text-[9px] px-1 py-0.5 rounded-full",
                      style: {
                        background: `${getStatusColor(response.status)}22`,
                        color: getStatusColor(response.status)
                      },
                      children: response.status || "ERR"
                    }
                  )
                ]
              },
              tab
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex flex-col", children: [
          activeTab === "headers" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-3 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px] font-semibold",
                  style: { color: "rgba(39,215,224,0.7)" },
                  children: "REQUEST HEADERS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: addHeader,
                  "data-ocid": "apitester.add_button",
                  className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all",
                  style: {
                    background: "rgba(39,215,224,0.08)",
                    border: "1px solid rgba(39,215,224,0.2)",
                    color: "var(--os-accent)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-2.5 h-2.5" }),
                    " Add"
                  ]
                }
              )
            ] }),
            headers.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `apitester.row.${i + 1}`,
                className: "flex gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "Header name",
                      value: h.key,
                      onChange: (e) => updateHeader(h.id, "key", e.target.value),
                      className: "flex-1 px-2 py-1.5 rounded text-[11px] outline-none",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(39,215,224,0.12)",
                        color: "var(--os-text-secondary)",
                        ...mono
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "Value",
                      value: h.value,
                      onChange: (e) => updateHeader(h.id, "value", e.target.value),
                      className: "flex-1 px-2 py-1.5 rounded text-[11px] outline-none",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(39,215,224,0.12)",
                        color: "var(--os-text-secondary)",
                        ...mono
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeHeader(h.id),
                      "data-ocid": `apitester.delete_button.${i + 1}`,
                      className: "w-7 h-7 rounded flex items-center justify-center transition-all",
                      style: {
                        background: "rgba(239,68,68,0.07)",
                        border: "1px solid rgba(239,68,68,0.15)",
                        color: "rgba(239,68,68,0.6)"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                    }
                  )
                ]
              },
              h.id
            ))
          ] }),
          activeTab === "body" && isBodyMethod && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[10px] font-semibold mb-2",
                style: { color: "rgba(39,215,224,0.7)" },
                children: "REQUEST BODY"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: body,
                onChange: (e) => setBody(e.target.value),
                placeholder: '{ "key": "value" }',
                "data-ocid": "apitester.textarea",
                className: "flex-1 p-2 rounded resize-none text-[12px] outline-none leading-relaxed",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid rgba(39,215,224,0.15)",
                  color: "var(--os-text-primary)",
                  ...mono
                }
              }
            )
          ] }),
          activeTab === "response" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
            !response && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Zap,
                {
                  className: "w-10 h-10",
                  style: { color: "rgba(39,215,224,0.15)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[12px]",
                  style: { color: "var(--os-text-muted)" },
                  children: "Send a request to see the response"
                }
              )
            ] }),
            loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "apitester.loading_state",
                className: "flex flex-col items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Clock,
                    {
                      className: "w-8 h-8 animate-spin",
                      style: { color: "rgba(39,215,224,0.4)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[11px]",
                      style: { color: "var(--os-text-muted)" },
                      children: "Sending request..."
                    }
                  )
                ]
              }
            ) }),
            response && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3 px-3 py-2 border-b flex-shrink-0",
                  style: {
                    borderColor: "rgba(39,215,224,0.1)",
                    background: "rgba(10,16,20,0.6)"
                  },
                  children: [
                    response.error ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleAlert,
                      {
                        className: "w-3.5 h-3.5",
                        style: { color: "#ef4444" }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheck,
                      {
                        className: "w-3.5 h-3.5",
                        style: { color: getStatusColor(response.status) }
                      }
                    ),
                    response.status > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-[12px] font-bold",
                        style: { color: getStatusColor(response.status) },
                        children: [
                          response.status,
                          " ",
                          response.statusText
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-[11px]",
                        style: { color: "var(--os-text-muted)" },
                        children: [
                          response.time,
                          "ms"
                        ]
                      }
                    ),
                    response.contentType && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] px-2 py-0.5 rounded-full",
                        style: {
                          background: "rgba(39,215,224,0.08)",
                          color: "rgba(39,215,224,0.6)"
                        },
                        children: response.contentType.split(";")[0]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 overflow-y-auto p-3",
                  "data-ocid": response.error ? "apitester.error_state" : "apitester.success_state",
                  children: response.error ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex gap-2 p-3 rounded-lg",
                      style: {
                        background: "rgba(239,68,68,0.07)",
                        border: "1px solid rgba(239,68,68,0.2)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Info,
                          {
                            className: "w-4 h-4 flex-shrink-0 mt-0.5",
                            style: { color: "#ef4444" }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-[12px] leading-relaxed",
                            style: { color: "var(--os-text-primary)" },
                            children: response.error
                          }
                        )
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "pre",
                    {
                      className: "text-[11px] leading-relaxed whitespace-pre-wrap break-all",
                      style: { color: "var(--os-text-secondary)", ...mono },
                      children: response.contentType.includes("json") ? prettyJson(response.body) : response.body || "(empty body)"
                    }
                  )
                }
              )
            ] })
          ] }),
          history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border-t flex-shrink-0",
              style: {
                borderColor: "rgba(39,215,224,0.1)",
                background: "rgba(10,16,20,0.6)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] font-semibold px-3 py-1.5",
                    style: { color: "rgba(39,215,224,0.6)" },
                    children: "RECENT REQUESTS"
                  }
                ),
                history.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `apitester.row.${i + 1}`,
                    onClick: () => {
                      setMethod(h.method);
                      setUrl(h.url);
                    },
                    className: "w-full flex items-center gap-3 px-3 py-1.5 text-left hover:bg-white/5 transition-all border-t",
                    style: { borderColor: "var(--os-border-subtle)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] font-bold w-12 flex-shrink-0",
                          style: {
                            color: METHOD_COLORS[h.method] ?? "#27D7E0"
                          },
                          children: h.method
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "flex-1 text-[11px] truncate",
                          style: {
                            color: "var(--os-text-secondary)",
                            fontFamily: "monospace"
                          },
                          children: h.url
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] flex-shrink-0",
                          style: {
                            color: h.responseStatus >= 200 && h.responseStatus < 300 ? "#22c55e" : "#ef4444"
                          },
                          children: h.responseStatus || "ERR"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "text-[10px] flex-shrink-0",
                          style: { color: "var(--os-text-muted)" },
                          children: [
                            h.responseTime,
                            "ms"
                          ]
                        }
                      )
                    ]
                  },
                  h.timestamp
                ))
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  ApiTester as default
};
