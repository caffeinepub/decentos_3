import { r as reactExports, j as jsxRuntimeExports, L as LoaderCircle, S as Search, b as CodeXml, T as Trash2 } from "./index-8tMpYjTW.js";
import { B as Badge } from "./badge-DoqMcUVj.js";
import { B as Button } from "./button-BMA-bo_z.js";
import { I as Input } from "./input-CCQCx2Ry.js";
import { S as ScrollArea } from "./scroll-area-frdS_iE5.js";
import { T as Textarea } from "./textarea-BIAzjIhr.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { S as Star } from "./star-CUwRbTIB.js";
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
const SIDEBAR_BG = "rgba(10,16,20,0.7)";
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";
const LANG_COLORS = {
  JS: "rgba(250,204,21,0.8)",
  TS: "rgba(59,130,246,0.8)",
  Python: "rgba(34,197,94,0.8)",
  Go: "rgba(96,165,250,0.8)",
  Rust: "rgba(251,146,60,0.8)",
  Mo: "rgba(39,215,224,0.8)",
  Other: "rgba(148,163,184,0.8)"
};
const LANGUAGES = [
  "JS",
  "TS",
  "Python",
  "Go",
  "Rust",
  "Mo",
  "Other"
];
function StarRating({
  rating,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => onChange == null ? void 0 : onChange(s),
      style: {
        background: "none",
        border: "none",
        padding: 0,
        cursor: onChange ? "pointer" : "default"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Star,
        {
          className: "w-3.5 h-3.5",
          style: {
            color: s <= rating ? "rgba(250,204,21,0.9)" : "var(--os-text-muted)",
            fill: s <= rating ? "rgba(250,204,21,0.9)" : "transparent"
          }
        }
      )
    },
    s
  )) });
}
const emptyForm = () => ({
  title: "",
  code: "",
  language: "TS",
  notes: "",
  rating: 3,
  tags: []
});
function CodeReviewNotes({
  windowProps: _windowProps
}) {
  const {
    data: reviews,
    set: setReviews,
    loading
  } = useCanisterKV("decentos_code_reviews", []);
  const [selected, setSelected] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(emptyForm());
  const [tagInput, setTagInput] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) => r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [reviews, search]);
  const startNew = () => {
    setForm(emptyForm());
    setTagInput("");
    setEditing(true);
    setSelected(null);
  };
  const startEdit = (r) => {
    setForm({
      title: r.title,
      code: r.code,
      language: r.language,
      notes: r.notes,
      rating: r.rating,
      tags: [...r.tags]
    });
    setTagInput("");
    setEditing(true);
  };
  const save = () => {
    if (!form.title.trim()) return;
    const now = Date.now();
    if (selected) {
      const updated = reviews.map(
        (r) => r.id === selected.id ? { ...r, ...form } : r
      );
      setReviews(updated);
      setSelected({ ...selected, ...form });
    } else {
      const entry = { id: now.toString(), ...form, createdAt: now };
      setReviews([entry, ...reviews]);
      setSelected(entry);
    }
    setEditing(false);
  };
  const deleteReview = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
    setSelected(null);
  };
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t))
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  };
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
        className: "flex flex-col",
        style: {
          width: 220,
          minWidth: 220,
          background: SIDEBAR_BG,
          borderRight: `1px solid ${BORDER}`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-3 flex-shrink-0",
              style: { borderBottom: `1px solid ${BORDER}` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Search,
                    {
                      className: "w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2",
                      style: { color: MUTED }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "codereview.search_input",
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      placeholder: "Search...",
                      style: {
                        background: "rgba(20,30,36,0.8)",
                        border: `1px solid ${BORDER}`,
                        color: TEXT,
                        fontSize: 11,
                        height: 28,
                        paddingLeft: 24
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "codereview.primary_button",
                    onClick: startNew,
                    style: {
                      width: "100%",
                      height: 28,
                      fontSize: 11,
                      background: `${ACCENT}0.12)`,
                      border: `1px solid ${ACCENT}0.3)`,
                      color: `${ACCENT}1)`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
                      " New Review"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-24 gap-1",
              "data-ocid": "codereview.empty_state",
              style: { color: MUTED },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "w-6 h-6 opacity-20" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "No reviews yet" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 flex flex-col gap-1", children: filtered.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `codereview.item.${i + 1}`,
              onClick: () => {
                setSelected(r);
                setEditing(false);
              },
              onKeyDown: (e) => e.key === "Enter" && setSelected(r),
              className: "p-2 rounded-lg cursor-pointer",
              style: {
                background: (selected == null ? void 0 : selected.id) === r.id ? `${ACCENT}0.1)` : "var(--os-border-subtle)",
                border: `1px solid ${(selected == null ? void 0 : selected.id) === r.id ? `${ACCENT}0.35)` : "transparent"}`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] font-bold",
                      style: { color: LANG_COLORS[r.language] },
                      children: r.language
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-medium truncate flex-1",
                      style: { color: TEXT },
                      children: r.title
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: r.rating })
              ]
            },
            r.id
          )) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col overflow-hidden", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold mb-4", style: { color: TEXT }, children: selected ? "Edit Review" : "New Review" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "cr-title",
              className: "text-[11px] block mb-1",
              style: { color: MUTED },
              children: "Title"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "cr-title",
              "data-ocid": "codereview.input",
              value: form.title,
              onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })),
              style: {
                background: "rgba(20,30,36,0.8)",
                border: `1px solid ${BORDER}`,
                color: TEXT,
                fontSize: 12
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "cr-lang",
                className: "text-[11px] block mb-1",
                style: { color: MUTED },
                children: "Language"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "cr-lang",
                "data-ocid": "codereview.select",
                value: form.language,
                onChange: (e) => setForm((f) => ({
                  ...f,
                  language: e.target.value
                })),
                style: {
                  width: "100%",
                  background: "rgba(20,30,36,0.8)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontSize: 12
                },
                children: LANGUAGES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: l, children: l }, l))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[11px] block mb-1",
                style: { color: MUTED },
                children: "Rating"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StarRating,
              {
                rating: form.rating,
                onChange: (r) => setForm((f) => ({ ...f, rating: r }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "cr-code",
              className: "text-[11px] block mb-1",
              style: { color: MUTED },
              children: "Code Snippet"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "cr-code",
              "data-ocid": "codereview.textarea",
              value: form.code,
              onChange: (e) => setForm((f) => ({ ...f, code: e.target.value })),
              rows: 6,
              style: {
                background: "var(--os-bg-app)",
                border: `1px solid ${BORDER}`,
                color: "rgba(180,255,180,0.85)",
                fontSize: 12,
                fontFamily: "monospace",
                resize: "vertical"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "cr-notes",
              className: "text-[11px] block mb-1",
              style: { color: MUTED },
              children: "Review Notes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "cr-notes",
              value: form.notes,
              onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })),
              rows: 4,
              style: {
                background: "rgba(20,30,36,0.8)",
                border: `1px solid ${BORDER}`,
                color: TEXT,
                fontSize: 12,
                resize: "vertical"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[11px] block mb-1",
              style: { color: MUTED },
              children: "Tags"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mb-2", children: form.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              style: {
                fontSize: 10,
                background: `${ACCENT}0.1)`,
                color: `${ACCENT}0.8)`,
                border: `1px solid ${ACCENT}0.25)`,
                cursor: "pointer"
              },
              onClick: () => setForm((f) => ({
                ...f,
                tags: f.tags.filter((x) => x !== t)
              })),
              children: [
                "#",
                t,
                " ×"
              ]
            },
            t
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: tagInput,
                onChange: (e) => setTagInput(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && addTag(),
                placeholder: "Add tag...",
                style: {
                  background: "rgba(20,30,36,0.8)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                  fontSize: 11,
                  height: 28,
                  flex: 1
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: addTag,
                style: {
                  height: 28,
                  fontSize: 11,
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: MUTED
                },
                children: "Add"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              "data-ocid": "codereview.submit_button",
              onClick: save,
              style: {
                background: `${ACCENT}0.8)`,
                border: "none",
                color: "#000",
                fontWeight: 700
              },
              children: "Save"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              "data-ocid": "codereview.cancel_button",
              onClick: () => setEditing(false),
              variant: "outline",
              style: { borderColor: BORDER, color: MUTED },
              children: "Cancel"
            }
          ),
          selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              "data-ocid": "codereview.delete_button",
              onClick: () => deleteReview(selected.id),
              variant: "outline",
              style: {
                borderColor: "rgba(248,113,113,0.3)",
                color: "rgba(248,113,113,0.7)",
                marginLeft: "auto"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ] })
    ] }) : selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-bold",
                style: { color: LANG_COLORS[selected.language] },
                children: selected.language
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold", style: { color: TEXT }, children: selected.title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: selected.rating }),
            selected.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                style: {
                  fontSize: 10,
                  background: `${ACCENT}0.08)`,
                  color: `${ACCENT}0.7)`,
                  border: `1px solid ${ACCENT}0.2)`
                },
                children: [
                  "#",
                  t
                ]
              },
              t
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            "data-ocid": "codereview.edit_button",
            onClick: () => startEdit(selected),
            style: {
              height: 28,
              fontSize: 11,
              background: `${ACCENT}0.12)`,
              border: `1px solid ${ACCENT}0.3)`,
              color: `${ACCENT}1)`
            },
            children: "Edit"
          }
        )
      ] }),
      selected.code && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] mb-2", style: { color: MUTED }, children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            className: "rounded-lg p-3 overflow-x-auto text-xs",
            style: {
              background: "var(--os-bg-app)",
              border: `1px solid ${BORDER}`,
              color: "rgba(180,255,180,0.85)",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all"
            },
            children: selected.code
          }
        )
      ] }),
      selected.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] mb-2", style: { color: MUTED }, children: "Review Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-sm leading-relaxed",
            style: { color: TEXT },
            children: selected.notes
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center gap-3",
        "data-ocid": "codereview.empty_state",
        style: { color: MUTED },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "w-10 h-10 opacity-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "Select a review or create a new one" })
        ]
      }
    ) })
  ] });
}
export {
  CodeReviewNotes
};
