import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, aE as Calendar, T as Trash2, X, aH as GraduationCap, aI as Heart } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = createLucideIcon("briefcase", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode);
const CATEGORY_CONFIG = {
  Career: {
    color: "rgba(59,130,246,0.9)",
    bg: "rgba(59,130,246,0.15)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 12 })
  },
  Personal: {
    color: "rgba(168,85,247,0.9)",
    bg: "rgba(168,85,247,0.15)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 12 })
  },
  Travel: {
    color: "rgba(34,197,94,0.9)",
    bg: "rgba(34,197,94,0.15)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 })
  },
  Health: {
    color: "rgba(239,68,68,0.9)",
    bg: "rgba(239,68,68,0.15)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 12 })
  },
  Education: {
    color: "rgba(245,158,11,0.9)",
    bg: "rgba(245,158,11,0.15)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 12 })
  }
};
const EMPTY_FORM = {
  date: "",
  title: "",
  description: "",
  category: "Career"
};
function PersonalTimeline() {
  const {
    data: events,
    set: setEvents,
    loading
  } = useCanisterKV("decentos_timeline", []);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const handleAdd = () => {
    if (!form.title || !form.date) return;
    const newEvent = {
      id: Date.now().toString(),
      ...form
    };
    setEvents([...events, newEvent]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };
  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };
  if (loading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex h-full items-center justify-center",
        style: { background: "rgba(11,15,18,0.6)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" })
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: {
        background: "rgba(11,15,18,0.6)",
        color: "rgba(220,235,240,0.9)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: { borderColor: "rgba(42,58,66,0.8)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, style: { color: "rgba(6,182,212,0.9)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: "Personal Timeline" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "timeline.open_modal_button",
                  onClick: () => setShowForm(true),
                  className: "flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-all hover:opacity-90",
                  style: {
                    background: "rgba(6,182,212,0.2)",
                    color: "rgba(6,182,212,0.9)",
                    border: "1px solid rgba(6,182,212,0.3)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                    " Add Milestone"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 overflow-y-auto px-6 py-4",
            style: {
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(42,58,66,0.8) transparent"
            },
            children: sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "timeline.empty_state",
                className: "flex flex-col items-center justify-center h-full gap-3 opacity-50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 48, style: { color: "rgba(6,182,212,0.5)" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No milestones yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowForm(true),
                      className: "text-xs px-4 py-2 rounded",
                      style: {
                        background: "rgba(6,182,212,0.2)",
                        color: "rgba(6,182,212,0.9)",
                        border: "1px solid rgba(6,182,212,0.3)"
                      },
                      children: "Add your first milestone"
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute left-[19px] top-0 bottom-0 w-px",
                  style: { background: "rgba(42,58,66,0.8)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: sorted.map((event, idx) => {
                const cfg = CATEGORY_CONFIG[event.category];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `timeline.item.${idx + 1}`,
                    className: "flex gap-4 relative",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2",
                          style: { background: cfg.bg, borderColor: cfg.color },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: cfg.color }, children: cfg.icon })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "flex-1 rounded-lg p-3 border",
                          style: {
                            background: "rgba(16,24,28,0.6)",
                            borderColor: "rgba(42,58,66,0.8)"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm truncate", children: event.title }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "span",
                                  {
                                    className: "text-xs px-2 py-0.5 rounded-full flex items-center gap-1",
                                    style: { background: cfg.bg, color: cfg.color },
                                    children: [
                                      cfg.icon,
                                      " ",
                                      event.category
                                    ]
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-50 mb-1", children: event.date }),
                              event.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-70 leading-relaxed", children: event.description })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                "data-ocid": `timeline.delete_button.${idx + 1}`,
                                onClick: () => handleDelete(event.id),
                                className: "p-1 rounded hover:bg-red-500/20 transition-colors flex-shrink-0",
                                style: { color: "rgba(239,68,68,0.7)" },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                              }
                            )
                          ] })
                        }
                      )
                    ]
                  },
                  event.id
                );
              }) })
            ] })
          }
        ),
        showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "timeline.dialog",
            className: "absolute inset-0 flex items-center justify-center z-50",
            style: { background: "rgba(0,0,0,0.6)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "w-full max-w-md mx-4 rounded-xl border p-5 shadow-2xl",
                style: {
                  background: "rgba(16,24,28,0.95)",
                  borderColor: "rgba(42,58,66,0.8)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Add Milestone" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "timeline.close_button",
                        onClick: () => setShowForm(false),
                        className: "opacity-50 hover:opacity-100",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "tl-date",
                          className: "text-xs opacity-60 mb-1 block",
                          children: "Date"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "tl-date",
                          "data-ocid": "timeline.input",
                          type: "date",
                          value: form.date,
                          onChange: (e) => setForm((p) => ({ ...p, date: e.target.value })),
                          className: "w-full px-3 py-2 rounded text-sm",
                          style: {
                            background: "rgba(42,58,66,0.4)",
                            border: "1px solid rgba(42,58,66,0.8)",
                            color: "rgba(220,235,240,0.9)",
                            colorScheme: "dark"
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "tl-title",
                          className: "text-xs opacity-60 mb-1 block",
                          children: "Title"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "tl-title",
                          "data-ocid": "timeline.input",
                          type: "text",
                          value: form.title,
                          onChange: (e) => setForm((p) => ({ ...p, title: e.target.value })),
                          placeholder: "Milestone title",
                          className: "w-full px-3 py-2 rounded text-sm",
                          style: {
                            background: "rgba(42,58,66,0.4)",
                            border: "1px solid rgba(42,58,66,0.8)",
                            color: "rgba(220,235,240,0.9)"
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "tl-cat",
                          className: "text-xs opacity-60 mb-1 block",
                          children: "Category"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "select",
                        {
                          id: "tl-cat",
                          "data-ocid": "timeline.select",
                          value: form.category,
                          onChange: (e) => setForm((p) => ({
                            ...p,
                            category: e.target.value
                          })),
                          className: "w-full px-3 py-2 rounded text-sm",
                          style: {
                            background: "rgba(42,58,66,0.4)",
                            border: "1px solid rgba(42,58,66,0.8)",
                            color: "rgba(220,235,240,0.9)"
                          },
                          children: Object.keys(CATEGORY_CONFIG).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "option",
                            {
                              value: c,
                              style: { background: "var(--os-bg-app)" },
                              children: c
                            },
                            c
                          ))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "tl-desc",
                          className: "text-xs opacity-60 mb-1 block",
                          children: "Description"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          id: "tl-desc",
                          "data-ocid": "timeline.textarea",
                          value: form.description,
                          onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
                          placeholder: "What happened?",
                          rows: 3,
                          className: "w-full px-3 py-2 rounded text-sm resize-none",
                          style: {
                            background: "rgba(42,58,66,0.4)",
                            border: "1px solid rgba(42,58,66,0.8)",
                            color: "rgba(220,235,240,0.9)"
                          }
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "timeline.cancel_button",
                        onClick: () => setShowForm(false),
                        className: "flex-1 py-2 rounded text-sm transition-colors",
                        style: {
                          background: "rgba(42,58,66,0.4)",
                          border: "1px solid rgba(42,58,66,0.6)"
                        },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "timeline.submit_button",
                        onClick: handleAdd,
                        disabled: !form.title || !form.date,
                        className: "flex-1 py-2 rounded text-sm font-medium transition-colors disabled:opacity-40",
                        style: {
                          background: "rgba(6,182,212,0.2)",
                          color: "rgba(6,182,212,0.9)",
                          border: "1px solid rgba(6,182,212,0.3)"
                        },
                        children: "Add Milestone"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  PersonalTimeline
};
