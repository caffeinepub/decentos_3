import { r as reactExports, j as jsxRuntimeExports, T as Trash2, aJ as WandSparkles, X, m as Copy, g as ue } from "./index-CZGIn5x2.js";
import { B as Badge } from "./badge-D2FbqHYW.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
const BG = "rgba(11,15,18,0.6)";
const SIDEBAR_BG = "rgba(10,16,20,0.7)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgba(39,215,224,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.45)";
const BTN_BG = "rgba(39,215,224,0.12)";
const BTN_BORDER = "rgba(39,215,224,0.3)";
const INPUT_STYLE = {
  background: "var(--os-border-subtle)",
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  color: TEXT,
  padding: "6px 10px",
  fontSize: 12,
  outline: "none",
  width: "100%"
};
function extractVariables(content) {
  const matches = content.match(/\{\{([^}]+)\}\}/g) ?? [];
  const names = matches.map((m) => m.slice(2, -2).trim());
  return [...new Set(names)];
}
function AiPromptBuilder() {
  const { data: prompts, set: setPrompts } = useCanisterKV(
    "decent-ai-prompts",
    []
  );
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [title, setTitle] = reactExports.useState("");
  const [content, setContent] = reactExports.useState("");
  const [tagInput, setTagInput] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState([]);
  const [fillMode, setFillMode] = reactExports.useState(false);
  const [fillValues, setFillValues] = reactExports.useState({});
  const [search, setSearch] = reactExports.useState("");
  const filtered = prompts.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );
  const selectPrompt = (p) => {
    setSelectedId(p.id);
    setTitle(p.title);
    setContent(p.content);
    setTags(p.tags);
    setFillMode(false);
    setFillValues({});
  };
  const newPrompt = () => {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setTags([]);
    setFillMode(false);
    setFillValues({});
  };
  const save = () => {
    if (!title.trim()) return;
    if (selectedId) {
      setPrompts(
        prompts.map(
          (p) => p.id === selectedId ? { ...p, title, content, tags } : p
        )
      );
    } else {
      const np = {
        id: `prompt_${Date.now()}`,
        title,
        content,
        tags,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      setPrompts([np, ...prompts]);
      setSelectedId(np.id);
    }
    ue.success("Prompt saved");
  };
  const deletePrompt = (id) => {
    setPrompts(prompts.filter((p) => p.id !== id));
    if (selectedId === id) newPrompt();
  };
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };
  const variables = extractVariables(content);
  const startFill = () => {
    const vals = {};
    for (const v of variables) vals[v] = "";
    setFillValues(vals);
    setFillMode(true);
  };
  const copyFilled = () => {
    let filled = content;
    for (const [k, v] of Object.entries(fillValues)) {
      filled = filled.replaceAll(`{{${k}}}`, v);
    }
    navigator.clipboard.writeText(filled);
    ue.success("Copied to clipboard!");
    setFillMode(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full",
      style: { background: BG, color: TEXT, fontSize: 13 },
      "data-ocid": "aiprompts.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-56 flex-shrink-0 flex flex-col border-r",
            style: { background: SIDEBAR_BG, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-b", style: { borderColor: BORDER }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search prompts...",
                  style: { ...INPUT_STYLE },
                  "data-ocid": "aiprompts.search_input"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: newPrompt,
                  className: "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                  style: {
                    background: BTN_BG,
                    border: `1px solid ${BTN_BORDER}`,
                    color: CYAN
                  },
                  "data-ocid": "aiprompts.primary_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "New Prompt" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
                filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-center p-4 text-xs",
                    style: { color: MUTED },
                    "data-ocid": "aiprompts.empty_state",
                    children: "No prompts yet. Create one to get started."
                  }
                ),
                filtered.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "mx-2 mb-1 p-2 rounded-lg cursor-pointer transition-colors w-full text-left",
                    style: {
                      background: selectedId === p.id ? "rgba(39,215,224,0.08)" : "transparent",
                      border: `1px solid ${selectedId === p.id ? BTN_BORDER : "transparent"}`
                    },
                    onClick: () => selectPrompt(p),
                    "data-ocid": `aiprompts.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs font-medium truncate flex-1",
                            style: { color: TEXT },
                            children: p.title
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: (e) => {
                              e.stopPropagation();
                              deletePrompt(p.id);
                            },
                            className: "ml-1 opacity-0 hover:opacity-100 transition-opacity",
                            style: { color: "rgba(248,113,113,0.8)" },
                            "data-ocid": `aiprompts.delete_button.${i + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: "text-[10px] mt-0.5 truncate",
                          style: { color: MUTED },
                          children: [
                            p.content.slice(0, 60),
                            "..."
                          ]
                        }
                      )
                    ]
                  },
                  p.id
                ))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-4 border-b flex items-center justify-between",
              style: { borderColor: BORDER },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "w-4 h-4", style: { color: CYAN } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: "AI Prompt Builder" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  variables.length > 0 && !fillMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: startFill,
                      className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      style: {
                        background: "rgba(168,85,247,0.15)",
                        border: "1px solid rgba(168,85,247,0.35)",
                        color: "rgba(216,180,254,0.9)"
                      },
                      "data-ocid": "aiprompts.secondary_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "w-3 h-3" }),
                        " Fill Variables"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: save,
                      disabled: !title.trim(),
                      className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      style: {
                        background: BTN_BG,
                        border: `1px solid ${BTN_BORDER}`,
                        color: CYAN,
                        opacity: title.trim() ? 1 : 0.5
                      },
                      "data-ocid": "aiprompts.save_button",
                      children: "Save"
                    }
                  )
                ] })
              ]
            }
          ),
          fillMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", style: { color: CYAN }, children: "Fill in Variables" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFillMode(false),
                  style: { color: MUTED },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Object.keys(fillValues).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "block text-[10px] font-semibold mb-1",
                  style: { color: CYAN },
                  children: `{{${v}}}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: fillValues[v],
                  onChange: (e) => setFillValues({ ...fillValues, [v]: e.target.value }),
                  placeholder: `Value for ${v}`,
                  style: INPUT_STYLE,
                  "data-ocid": "aiprompts.input"
                }
              )
            ] }, v)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: copyFilled,
                className: "mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium",
                style: {
                  background: BTN_BG,
                  border: `1px solid ${BTN_BORDER}`,
                  color: CYAN
                },
                "data-ocid": "aiprompts.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }),
                  " Copy Filled Prompt"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "block text-[10px] font-semibold mb-1",
                  style: { color: CYAN },
                  children: "TITLE"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                  placeholder: "e.g. Code Review Prompt",
                  style: INPUT_STYLE,
                  "data-ocid": "aiprompts.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "block text-[10px] font-semibold mb-1",
                  style: { color: CYAN },
                  children: [
                    "PROMPT",
                    " ",
                    variables.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: MUTED }, children: [
                      "(",
                      variables.length,
                      " variable",
                      variables.length !== 1 ? "s" : "",
                      " detected)"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: content,
                  onChange: (e) => setContent(e.target.value),
                  placeholder: "Write your prompt here. Use {{variable}} for placeholders.\n\nExample:\nReview this code for {{language}}:\n\n{{code}}",
                  style: {
                    ...INPUT_STYLE,
                    minHeight: 200,
                    resize: "vertical",
                    fontFamily: "monospace"
                  },
                  "data-ocid": "aiprompts.textarea"
                }
              ),
              variables.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: variables.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "px-2 py-0.5 rounded text-[10px]",
                  style: {
                    background: "rgba(168,85,247,0.15)",
                    color: "rgba(216,180,254,0.9)",
                    border: "1px solid rgba(168,85,247,0.25)"
                  },
                  children: `{{${v}}}`
                },
                v
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "block text-[10px] font-semibold mb-1",
                  style: { color: CYAN },
                  children: "TAGS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: tagInput,
                    onChange: (e) => setTagInput(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && addTag(),
                    placeholder: "Add tag...",
                    style: { ...INPUT_STYLE, flex: 1 },
                    "data-ocid": "aiprompts.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: addTag,
                    className: "px-3 py-1.5 rounded-lg text-xs",
                    style: {
                      background: BTN_BG,
                      border: `1px solid ${BTN_BORDER}`,
                      color: CYAN
                    },
                    children: "Add"
                  }
                )
              ] }),
              tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  className: "cursor-pointer text-[10px] gap-1",
                  style: {
                    background: BTN_BG,
                    border: `1px solid ${BTN_BORDER}`,
                    color: CYAN
                  },
                  onClick: () => setTags(tags.filter((x) => x !== t)),
                  children: [
                    t,
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-2.5 h-2.5" })
                  ]
                },
                t
              )) })
            ] }),
            selectedId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "block text-[10px] font-semibold mb-1",
                  style: { color: CYAN },
                  children: "COPY RAW"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    navigator.clipboard.writeText(content);
                    ue.success("Copied!");
                  },
                  className: "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT
                  },
                  "data-ocid": "aiprompts.button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }),
                    " Copy Prompt as-is"
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
  AiPromptBuilder
};
