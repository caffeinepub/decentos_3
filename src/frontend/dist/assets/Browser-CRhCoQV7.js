import { i as useActor, r as reactExports, af as useMutation, j as jsxRuntimeExports, ag as ArrowRight, L as LoaderCircle, R as RefreshCw, ah as Globe, X, ai as Bookmark } from "./index-8tMpYjTW.js";
import { A as ArrowLeft } from "./arrow-left-Dr7Sy1mH.js";
const BOOKMARKS = [
  { label: "example.com", url: "https://example.com" },
  { label: "httpbin /get", url: "https://httpbin.org/get" },
  { label: "first website", url: "http://info.cern.ch" }
];
function looksLikeHtml(body) {
  const trimmed = body.trimStart().toLowerCase();
  return trimmed.startsWith("<!doctype") || trimmed.startsWith("<html") || trimmed.startsWith("<head") || trimmed.startsWith("<") && !trimmed.startsWith("<?xml");
}
function Browser({ windowProps: _ }) {
  var _a;
  const { actor, isFetching: actorFetching } = useActor();
  const isConnecting = actorFetching && !actor;
  const [url, setUrl] = reactExports.useState("https://example.com");
  const [inputUrl, setInputUrl] = reactExports.useState("https://example.com");
  const [response, setResponse] = reactExports.useState(null);
  const [historyStack, setHistoryStack] = reactExports.useState([]);
  const [historyIndex, setHistoryIndex] = reactExports.useState(-1);
  const [error, setError] = reactExports.useState(null);
  const [pendingUrl, setPendingUrl] = reactExports.useState(null);
  const inputRef = reactExports.useRef(null);
  const fetchMutation = useMutation({
    mutationFn: async (fetchUrl) => {
      if (!actor) throw new Error("Not connected to ICP network");
      return actor.fetchUrl(fetchUrl);
    },
    onSuccess: (data, fetchUrl) => {
      setResponse(data);
      setError(null);
      setUrl(fetchUrl);
      setHistoryStack((prev) => {
        const newStack = [...prev.slice(0, historyIndex + 1), fetchUrl];
        setHistoryIndex(newStack.length - 1);
        return newStack;
      });
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "Unexpected error from ICP network";
      setError(msg);
      setResponse(null);
    }
  });
  reactExports.useEffect(() => {
    if (actor && pendingUrl) {
      fetchMutation.mutate(pendingUrl);
      setPendingUrl(null);
    }
  }, [actor, pendingUrl, fetchMutation.mutate]);
  const navigate = (navUrl) => {
    const normalized = navUrl.startsWith("http") ? navUrl : `https://${navUrl}`;
    setInputUrl(normalized);
    if (!actor) {
      setPendingUrl(normalized);
      return;
    }
    fetchMutation.mutate(normalized);
  };
  const goBack = () => {
    if (historyIndex > 0) {
      const prev = historyStack[historyIndex - 1];
      setHistoryIndex((i) => i - 1);
      setInputUrl(prev);
      setUrl(prev);
      if (actor) fetchMutation.mutate(prev);
      else setPendingUrl(prev);
    }
  };
  const goForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const next = historyStack[historyIndex + 1];
      setHistoryIndex((i) => i + 1);
      setInputUrl(next);
      setUrl(next);
      if (actor) fetchMutation.mutate(next);
      else setPendingUrl(next);
    }
  };
  const isHtml = response ? looksLikeHtml(response.body) : false;
  const statusOk = response && response.statusCode >= 200 && response.statusCode < 300;
  const byteSize = response ? new TextEncoder().encode(response.body).length : 0;
  const srcDoc = response && isHtml ? `<base href="${url}">
${response.body}` : "";
  const contentType = ((_a = response == null ? void 0 : response.headers.find((h) => h.name.toLowerCase() === "content-type")) == null ? void 0 : _a.value) ?? "";
  const barStyle = {
    borderColor: "rgba(42,58,66,0.8)",
    background: "rgba(18,32,38,0.5)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--os-bg-app)" },
      "data-ocid": "browser.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-2 py-2 border-b",
            style: barStyle,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: goBack,
                  disabled: historyIndex <= 0,
                  "data-ocid": "browser.secondary_button",
                  title: "Back",
                  className: "w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors disabled:opacity-30 text-muted-foreground hover:text-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: goForward,
                  disabled: historyIndex >= historyStack.length - 1,
                  "data-ocid": "browser.secondary_button",
                  title: "Forward",
                  className: "w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors disabled:opacity-30 text-muted-foreground hover:text-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => actor && fetchMutation.mutate(url),
                  "data-ocid": "browser.toggle",
                  title: "Refresh",
                  className: "w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground",
                  children: fetchMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex-1 flex items-center gap-2 px-3 h-7 rounded-lg",
                  style: {
                    background: "rgba(6,18,22,0.9)",
                    border: "1px solid rgba(39,215,224,0.2)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3 text-primary/50 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: inputRef,
                        value: inputUrl,
                        onChange: (e) => setInputUrl(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && navigate(inputUrl),
                        "data-ocid": "browser.input",
                        className: "flex-1 bg-transparent text-xs font-mono text-foreground outline-none",
                        placeholder: "Enter URL..."
                      }
                    ),
                    inputUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          var _a2;
                          setInputUrl("");
                          (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
                        },
                        className: "text-muted-foreground/40 hover:text-muted-foreground transition-colors",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => navigate(inputUrl),
                  disabled: fetchMutation.isPending || isConnecting,
                  "data-ocid": "browser.primary_button",
                  className: "px-3 h-7 rounded text-xs font-semibold transition-all disabled:opacity-50",
                  style: {
                    background: "rgba(39,215,224,0.12)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "rgba(39,215,224,1)"
                  },
                  children: isConnecting ? "Wait..." : "Go"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-1.5 border-b",
            style: {
              borderColor: "rgba(42,58,66,0.5)",
              background: "rgba(12,20,24,0.4)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-3 h-3 text-muted-foreground/40 flex-shrink-0" }),
              BOOKMARKS.map((bm) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => navigate(bm.url),
                  "data-ocid": "browser.link",
                  className: "text-[10px] font-mono px-2 py-0.5 rounded transition-colors hover:text-primary",
                  style: {
                    background: "rgba(39,215,224,0.06)",
                    border: "1px solid rgba(39,215,224,0.12)",
                    color: "rgba(39,215,224,0.7)"
                  },
                  children: bm.label
                },
                bm.url
              ))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-1.5 flex-shrink-0 text-xs",
            style: {
              background: "rgba(251,191,36,0.06)",
              borderBottom: "1px solid rgba(251,191,36,0.25)",
              color: "rgba(251,191,36,0.85)"
            },
            "data-ocid": "browser.disclaimer.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm flex-shrink-0", "aria-hidden": "true", children: "⚠" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Web Reader Mode" }),
                " — Due to ICP blockchain constraints, only raw HTML is available. JavaScript, CSS, and images are not loaded."
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden relative", children: [
          isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 flex items-center justify-center z-10",
              style: { background: "rgba(9,13,16,0.75)" },
              "data-ocid": "browser.loading_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LoaderCircle,
                  {
                    className: "w-7 h-7 animate-spin",
                    style: { color: "rgba(39,215,224,0.7)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-mono",
                    style: { color: "rgba(39,215,224,0.6)" },
                    children: "Connecting to ICP network..."
                  }
                )
              ] })
            }
          ),
          fetchMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 flex items-center justify-center z-10",
              style: { background: "rgba(9,13,16,0.7)" },
              "data-ocid": "browser.loading_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LoaderCircle,
                  {
                    className: "w-8 h-8 animate-spin",
                    style: { color: "rgba(39,215,224,0.8)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground/60", children: "Loading..." })
              ] })
            }
          ),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 flex items-center justify-center p-6",
              "data-ocid": "browser.error_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "max-w-sm w-full rounded-xl p-6 text-center",
                  style: {
                    background: "rgba(255,60,60,0.06)",
                    border: "1px solid rgba(255,60,60,0.2)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      X,
                      {
                        className: "w-8 h-8 mx-auto mb-3",
                        style: { color: "rgba(255,80,80,0.8)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-destructive mb-1", children: "Connection Error" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 font-mono break-words", children: error }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => navigate(url),
                        className: "mt-4 px-4 h-7 rounded text-xs font-semibold",
                        style: {
                          background: "rgba(39,215,224,0.12)",
                          border: "1px solid rgba(39,215,224,0.3)",
                          color: "rgba(39,215,224,1)"
                        },
                        children: "Retry"
                      }
                    )
                  ]
                }
              )
            }
          ),
          !error && response && !statusOk && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 flex items-center justify-center p-6",
              "data-ocid": "browser.error_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "max-w-sm w-full rounded-xl p-6 text-center",
                  style: {
                    background: "rgba(255,150,0,0.06)",
                    border: "1px solid rgba(255,150,0,0.2)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-2xl font-bold font-mono mb-2",
                        style: { color: "rgba(255,180,0,0.9)" },
                        children: response.statusCode
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground/60", children: "The server returned an error response." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "pre",
                      {
                        className: "mt-3 text-xs text-left text-muted-foreground/50 overflow-auto max-h-32 p-2 rounded",
                        style: { background: "rgba(0,0,0,0.3)" },
                        children: response.body.slice(0, 500)
                      }
                    )
                  ]
                }
              )
            }
          ),
          !error && !fetchMutation.isPending && !response && !isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-center h-full flex-col gap-3",
              "data-ocid": "browser.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Globe,
                  {
                    className: "w-12 h-12",
                    style: { color: "rgba(39,215,224,0.2)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/30 font-mono text-center px-6", children: "Enter a URL and press Go. Note: some sites may be unavailable due to ICP network restrictions." })
              ]
            }
          ),
          !error && response && statusOk && (isHtml ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "iframe",
            {
              srcDoc,
              sandbox: "allow-scripts",
              title: "Browser content",
              className: "w-full h-full border-0",
              style: { background: "var(--os-text-primary)" },
              "data-ocid": "browser.canvas_target"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "pre",
            {
              className: "w-full h-full overflow-auto p-4 text-xs font-mono leading-relaxed",
              style: {
                color: "rgba(39,215,224,0.85)",
                background: "rgba(6,14,18,1)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all"
              },
              "data-ocid": "browser.canvas_target",
              children: response.body
            }
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1 text-[10px] font-mono border-t flex items-center justify-between",
            style: {
              borderColor: "rgba(42,58,66,0.5)",
              background: "rgba(12,20,24,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    color: isConnecting ? "rgba(39,215,224,0.5)" : response ? statusOk ? "rgba(39,215,224,0.7)" : "rgba(255,100,100,0.7)" : "var(--os-text-muted)"
                  },
                  children: isConnecting ? "Connecting..." : response ? `HTTP ${response.statusCode}` : "No response"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/40", children: [
                isHtml ? "text/html" : contentType ? contentType.split(";")[0] : "—",
                response ? ` · ${(byteSize / 1024).toFixed(1)} KB` : ""
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  Browser
};
