import { r as reactExports, j as jsxRuntimeExports, at as Target, C as Check, X, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
const DEFAULT_DATA = {
  current: {
    id: "default_1",
    text: "Ship Sprint 27: lazy loading + 3 new apps"
  },
  queue: [
    { id: "default_2", text: "Migrate KanbanBoard to on-chain storage" },
    { id: "default_3", text: "Write documentation for App Store API" }
  ],
  done: []
};
function genId() {
  return `fb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function FocusBoard() {
  const {
    data: persisted,
    set,
    loading
  } = useCanisterKV("decentos_focusboard", DEFAULT_DATA);
  const [board, setBoard] = reactExports.useState(DEFAULT_DATA);
  const [newText, setNewText] = reactExports.useState("");
  const [inputVisible, setInputVisible] = reactExports.useState(false);
  const hydratedRef = reactExports.useRef(false);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    setBoard(persisted);
  }, [loading, persisted]);
  const save = (updated) => {
    setBoard(updated);
    set(updated);
  };
  const addToQueue = () => {
    if (!newText.trim()) return;
    const item = { id: genId(), text: newText.trim() };
    let updated;
    if (!board.current) {
      updated = { ...board, current: item };
    } else {
      updated = { ...board, queue: [...board.queue, item] };
    }
    save(updated);
    setNewText("");
    setInputVisible(false);
  };
  const markDone = () => {
    if (!board.current) return;
    const done = {
      id: board.current.id,
      text: board.current.text,
      completedAt: Date.now()
    };
    const [next, ...rest] = board.queue;
    save({ current: next ?? null, queue: rest, done: [done, ...board.done] });
  };
  const skipCurrent = () => {
    if (!board.current) return;
    const [next, ...rest] = board.queue;
    if (!next) return;
    save({ current: next, queue: [...rest, board.current], done: board.done });
  };
  const removeFromQueue = (id) => save({ ...board, queue: board.queue.filter((q) => q.id !== id) });
  const clearDone = () => save({ ...board, done: [] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: "rgba(11,15,18,0.6)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0",
            style: { borderColor: "rgba(42,58,66,0.8)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Target,
                  {
                    className: "w-4 h-4",
                    style: { color: "rgba(39,215,224,0.7)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[11px] font-semibold uppercase tracking-widest",
                    style: { color: "rgba(39,215,224,0.7)" },
                    children: "Focus Board"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setInputVisible((v) => !v);
                    setTimeout(() => {
                      var _a;
                      return (_a = inputRef.current) == null ? void 0 : _a.focus();
                    }, 50);
                  },
                  "data-ocid": "focusboard.primary_button",
                  className: "flex items-center gap-1 px-3 h-7 rounded text-[11px] font-medium transition-all",
                  style: {
                    background: "rgba(39,215,224,0.1)",
                    border: "1px solid rgba(39,215,224,0.25)",
                    color: "rgba(39,215,224,0.9)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    " Add Task"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[10px] font-semibold uppercase tracking-widest mb-3",
                style: { color: "rgba(180,200,210,0.3)" },
                children: "Now Focusing"
              }
            ),
            board.current ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-5 text-center",
                style: {
                  background: "rgba(39,215,224,0.06)",
                  border: "1px solid rgba(39,215,224,0.2)",
                  boxShadow: "0 0 32px rgba(39,215,224,0.06)"
                },
                "data-ocid": "focusboard.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-lg font-semibold leading-snug mb-5",
                      style: { color: "rgba(220,235,240,0.95)" },
                      children: board.current.text
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: markDone,
                        "data-ocid": "focusboard.confirm_button",
                        className: "flex items-center gap-2 px-5 h-9 rounded-lg text-sm font-semibold transition-all",
                        style: {
                          background: "rgba(34,197,94,0.15)",
                          border: "1px solid rgba(34,197,94,0.35)",
                          color: "rgba(74,222,128,0.9)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
                          " Done"
                        ]
                      }
                    ),
                    board.queue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: skipCurrent,
                        "data-ocid": "focusboard.secondary_button",
                        className: "px-4 h-9 rounded-lg text-sm font-medium transition-all",
                        style: {
                          background: "var(--os-border-subtle)",
                          border: "1px solid var(--os-border-subtle)",
                          color: "rgba(180,200,210,0.6)"
                        },
                        children: "Skip"
                      }
                    )
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-8 text-center",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px dashed var(--os-border-subtle)"
                },
                "data-ocid": "focusboard.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Target,
                    {
                      className: "w-8 h-8 mx-auto mb-2",
                      style: { color: "rgba(39,215,224,0.2)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "rgba(180,200,210,0.3)" }, children: "Add a task to start focusing" })
                ]
              }
            )
          ] }),
          inputVisible && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-ocid": "focusboard.panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: inputRef,
                type: "text",
                value: newText,
                onChange: (e) => setNewText(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") addToQueue();
                  if (e.key === "Escape") setInputVisible(false);
                },
                placeholder: "What needs to get done?",
                "data-ocid": "focusboard.input",
                className: "flex-1 h-8 px-3 rounded-lg text-xs outline-none",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid rgba(39,215,224,0.25)",
                  color: "rgba(220,235,240,0.9)",
                  caretColor: "rgba(39,215,224,0.9)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: addToQueue,
                "data-ocid": "focusboard.submit_button",
                className: "px-3 h-8 rounded-lg text-xs font-semibold transition-all",
                style: {
                  background: "rgba(39,215,224,0.15)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "rgba(39,215,224,0.9)"
                },
                children: "Add"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setInputVisible(false),
                "data-ocid": "focusboard.cancel_button",
                className: "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-border-subtle)",
                  color: "rgba(180,200,210,0.5)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
              }
            )
          ] }),
          board.queue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-[10px] font-semibold uppercase tracking-widest mb-2",
                style: { color: "rgba(180,200,210,0.3)" },
                children: [
                  "Up Next (",
                  board.queue.length,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: board.queue.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `focusboard.item.${i + 1}`,
                className: "flex items-center gap-3 px-3 py-2.5 rounded-lg group",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-border-subtle)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[11px] font-mono flex-shrink-0",
                      style: { color: "rgba(180,200,210,0.2)" },
                      children: i + 1
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "flex-1 text-xs",
                      style: { color: "rgba(220,235,240,0.7)" },
                      children: item.text
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeFromQueue(item.id),
                      "data-ocid": `focusboard.delete_button.${i + 1}`,
                      className: "w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                      style: { color: "rgba(252,165,165,0.6)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                    }
                  )
                ]
              },
              item.id
            )) })
          ] }),
          board.done.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-[10px] font-semibold uppercase tracking-widest",
                  style: { color: "rgba(180,200,210,0.3)" },
                  children: [
                    "Completed (",
                    board.done.length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: clearDone,
                  "data-ocid": "focusboard.delete_button",
                  className: "text-[10px] transition-colors",
                  style: { color: "rgba(180,200,210,0.25)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 inline mr-1" }),
                    "Clear"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: board.done.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `focusboard.row.${i + 1}`,
                className: "flex items-center gap-3 px-3 py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Check,
                    {
                      className: "w-3.5 h-3.5 flex-shrink-0",
                      style: { color: "rgba(34,197,94,0.5)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "flex-1 text-xs line-through",
                      style: { color: "rgba(180,200,210,0.35)" },
                      children: item.text
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px]",
                      style: { color: "rgba(180,200,210,0.2)" },
                      children: new Date(item.completedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    }
                  )
                ]
              },
              item.id
            )) })
          ] })
        ] })
      ]
    }
  );
}
export {
  FocusBoard
};
