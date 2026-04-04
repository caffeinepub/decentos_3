import { r as reactExports, j as jsxRuntimeExports, L as LoaderCircle, aC as Clipboard, S as Search, aV as Pin, T as Trash2, g as ue } from "./index-8tMpYjTW.js";
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
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";
const CARD_BG = "rgba(16,24,30,0.8)";
const CATEGORY_COLORS = {
  Text: "rgba(59,130,246,",
  Code: "rgba(250,204,21,",
  URL: "rgba(34,197,94,",
  Other: "rgba(148,163,184,"
};
function timeSince(ts) {
  const diff = Date.now() - ts;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function SmartClipboard({
  windowProps: _windowProps
}) {
  const {
    data: entries,
    set: setEntries,
    loading
  } = useCanisterKV("decentos_smart_clipboard", []);
  const [search, setSearch] = reactExports.useState("");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [newContent, setNewContent] = reactExports.useState("");
  const [newCategory, setNewCategory] = reactExports.useState("Text");
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    const list = q ? entries.filter((e) => e.content.toLowerCase().includes(q)) : entries;
    return [...list.filter((e) => e.pinned), ...list.filter((e) => !e.pinned)];
  }, [entries, search]);
  const addEntry = () => {
    if (!newContent.trim()) return;
    const entry = {
      id: Date.now().toString(),
      content: newContent.trim(),
      category: newCategory,
      pinned: false,
      createdAt: Date.now()
    };
    setEntries([entry, ...entries]);
    setNewContent("");
    setShowAdd(false);
    ue.success("Entry saved");
  };
  const togglePin = (id) => {
    setEntries(
      entries.map((e) => e.id === id ? { ...e, pinned: !e.pinned } : e)
    );
  };
  const deleteEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
  };
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content).then(() => ue.success("Copied!")).catch(() => ue.error("Copy failed"));
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: BG, color: TEXT },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-4 py-3 flex-shrink-0",
            style: {
              borderBottom: `1px solid ${BORDER}`,
              background: "rgba(10,16,20,0.6)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Clipboard,
                {
                  className: "w-4 h-4 flex-shrink-0",
                  style: { color: `${ACCENT}0.7)` }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: { color: TEXT }, children: "Smart Clipboard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs ml-1", style: { color: MUTED }, children: [
                entries.length,
                " entries"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  "data-ocid": "smartclipboard.primary_button",
                  onClick: () => setShowAdd((v) => !v),
                  style: {
                    height: 28,
                    fontSize: 11,
                    background: `${ACCENT}0.12)`,
                    border: `1px solid ${ACCENT}0.3)`,
                    color: `${ACCENT}1)`,
                    padding: "0 10px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
                    " Add"
                  ]
                }
              )
            ]
          }
        ),
        showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 p-4",
            style: {
              background: "rgba(14,22,28,0.8)",
              borderBottom: `1px solid ${BORDER}`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  "data-ocid": "smartclipboard.textarea",
                  value: newContent,
                  onChange: (e) => setNewContent(e.target.value),
                  placeholder: "Paste or type your content here...",
                  rows: 4,
                  style: {
                    background: "rgba(20,30,36,0.8)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT,
                    fontSize: 12,
                    resize: "vertical",
                    marginBottom: 10
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: MUTED }, children: "Category:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["Text", "Code", "URL", "Other"].map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "smartclipboard.toggle",
                    onClick: () => setNewCategory(cat),
                    className: "px-2 py-0.5 rounded text-[11px] transition-all",
                    style: {
                      background: newCategory === cat ? `${CATEGORY_COLORS[cat]}0.2)` : "var(--os-border-subtle)",
                      border: `1px solid ${newCategory === cat ? `${CATEGORY_COLORS[cat]}0.5)` : BORDER}`,
                      color: newCategory === cat ? `${CATEGORY_COLORS[cat]}1)` : MUTED
                    },
                    children: cat
                  },
                  cat
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "smartclipboard.submit_button",
                    onClick: addEntry,
                    style: {
                      height: 28,
                      fontSize: 11,
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
                    "data-ocid": "smartclipboard.cancel_button",
                    onClick: () => setShowAdd(false),
                    variant: "outline",
                    style: {
                      height: 28,
                      fontSize: 11,
                      borderColor: BORDER,
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
            className: "px-4 py-2 flex-shrink-0",
            style: { borderBottom: "1px solid rgba(42,58,66,0.4)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Search,
                {
                  className: "w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2",
                  style: { color: MUTED }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "smartclipboard.search_input",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search entries...",
                  style: {
                    background: "var(--os-bg-elevated)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT,
                    fontSize: 12,
                    height: 30,
                    paddingLeft: 28
                  }
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-32 gap-2",
            "data-ocid": "smartclipboard.empty_state",
            style: { color: MUTED },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "w-8 h-8 opacity-20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: search ? "No matches" : "No entries yet — add one above" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 flex flex-col gap-2", children: filtered.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `smartclipboard.item.${i + 1}`,
            className: "group rounded-lg p-3",
            style: {
              background: CARD_BG,
              border: `1px solid ${entry.pinned ? `${ACCENT}0.3)` : BORDER}`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    style: {
                      fontSize: 10,
                      padding: "1px 6px",
                      background: `${CATEGORY_COLORS[entry.category]}0.12)`,
                      color: `${CATEGORY_COLORS[entry.category]}1)`,
                      border: `1px solid ${CATEGORY_COLORS[entry.category]}0.3)`
                    },
                    children: entry.category
                  }
                ),
                entry.pinned && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Star,
                  {
                    className: "w-3 h-3",
                    style: { color: "rgba(250,204,21,0.8)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] ml-auto",
                    style: { color: MUTED },
                    children: timeSince(entry.createdAt)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "pre",
                {
                  className: "text-xs mb-2 whitespace-pre-wrap break-all",
                  style: {
                    color: TEXT,
                    fontFamily: entry.category === "Code" ? "monospace" : "inherit",
                    maxHeight: 100,
                    overflow: "hidden"
                  },
                  children: entry.content
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => copyToClipboard(entry.content),
                    className: "px-2 py-0.5 rounded text-[11px] transition-all",
                    style: {
                      background: `${ACCENT}0.1)`,
                      border: `1px solid ${ACCENT}0.25)`,
                      color: `${ACCENT}0.8)`
                    },
                    children: "Copy"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => togglePin(entry.id),
                    "data-ocid": `smartclipboard.toggle.${i + 1}`,
                    className: "p-1 rounded transition-all",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`
                    },
                    title: entry.pinned ? "Unpin" : "Pin",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Pin,
                      {
                        className: "w-3 h-3",
                        style: {
                          color: entry.pinned ? "rgba(250,204,21,0.8)" : MUTED
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => deleteEntry(entry.id),
                    "data-ocid": `smartclipboard.delete_button.${i + 1}`,
                    className: "p-1 rounded transition-all ml-auto",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`
                    },
                    title: "Delete",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Trash2,
                      {
                        className: "w-3 h-3",
                        style: { color: "rgba(248,113,113,0.6)" }
                      }
                    )
                  }
                )
              ] })
            ]
          },
          entry.id
        )) }) })
      ]
    }
  );
}
export {
  SmartClipboard
};
