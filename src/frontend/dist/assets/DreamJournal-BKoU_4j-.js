import { r as reactExports, j as jsxRuntimeExports, V as Moon, S as Search, T as Trash2 } from "./index-CZGIn5x2.js";
import { B as Badge } from "./badge-D2FbqHYW.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { S as ScrollArea } from "./scroll-area-0_61eqCO.js";
import { T as Textarea } from "./textarea-Bhc13Xgf.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
import "./index-B9-lQkRo.js";
import "./index-YwGfiBwk.js";
import "./index-DxR-hlVQ.js";
import "./index-DfmnWLAm.js";
import "./index-C4X58sdz.js";
import "./index-9Nd72esH.js";
import "./index-IXOTxK3N.js";
const BG = "var(--os-bg-app)";
const BORDER = "var(--os-border)";
const CYAN = "var(--os-accent)";
const MOODS = ["😌", "😰", "😊", "🤔", "✨"];
const MOOD_LABELS = {
  "😌": "Calm",
  "😰": "Anxious",
  "😊": "Happy",
  "🤔": "Confused",
  "✨": "Vivid"
};
function genId() {
  return `dream_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function DreamJournal({
  windowProps: _w
}) {
  const {
    data: entries,
    set: saveEntries,
    loading
  } = useCanisterKV("decentos_dream_journal", []);
  const [view, setView] = reactExports.useState("list");
  const [search, setSearch] = reactExports.useState("");
  const [newDesc, setNewDesc] = reactExports.useState("");
  const [newMood, setNewMood] = reactExports.useState("😊");
  const [newTags, setNewTags] = reactExports.useState("");
  const [newLucid, setNewLucid] = reactExports.useState(false);
  const [newDate, setNewDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const filtered = reactExports.useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) => e.description.toLowerCase().includes(q) || e.tags.toLowerCase().includes(q)
    );
  }, [entries, search]);
  const topTags = reactExports.useMemo(() => {
    const counts = {};
    for (const e of entries) {
      for (const t of e.tags.split(",").map((s) => s.trim()).filter(Boolean)) {
        counts[t] = (counts[t] ?? 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  }, [entries]);
  const lucidPct = entries.length ? Math.round(entries.filter((e) => e.lucid).length / entries.length * 100) : 0;
  const addEntry = () => {
    if (!newDesc.trim()) return;
    const entry = {
      id: genId(),
      date: newDate,
      description: newDesc.trim(),
      mood: newMood,
      tags: newTags,
      lucid: newLucid,
      createdAt: Date.now()
    };
    saveEntries([entry, ...entries]);
    setNewDesc("");
    setNewTags("");
    setNewLucid(false);
    setNewMood("😊");
    setView("list");
  };
  const deleteEntry = (id) => {
    saveEntries(entries.filter((e) => e.id !== id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "dreamjournal.panel",
      className: "flex flex-col h-full",
      style: { background: BG, color: "var(--os-text-primary)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 shrink-0",
            style: { borderBottom: `1px solid ${BORDER}` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-4 h-4", style: { color: "var(--os-accent)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Dream Journal" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: view === "list" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  "data-ocid": "dreamjournal.primary_button",
                  onClick: () => setView("add"),
                  style: {
                    background: "rgba(39,215,224,0.15)",
                    color: "var(--os-accent)",
                    border: "1px solid rgba(39,215,224,0.3)"
                  },
                  className: "h-7 text-xs",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
                    " Log Dream"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  "data-ocid": "dreamjournal.cancel_button",
                  onClick: () => setView("list"),
                  className: "h-7 text-xs text-muted-foreground/60",
                  children: "Cancel"
                }
              ) })
            ]
          }
        ),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-6 h-6 rounded-full border-2 animate-spin",
            style: {
              borderColor: "rgba(39,215,224,0.3)",
              borderTopColor: "transparent"
            }
          }
        ) }) : view === "add" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60 mb-1 block", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: newDate,
                onChange: (e) => setNewDate(e.target.value),
                "data-ocid": "dreamjournal.input",
                className: "h-8 text-xs",
                style: {
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: "var(--os-text-primary)"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60 mb-1 block", children: "Dream Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: newDesc,
                onChange: (e) => setNewDesc(e.target.value),
                placeholder: "Describe your dream...",
                "data-ocid": "dreamjournal.textarea",
                rows: 5,
                style: {
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: "var(--os-text-primary)",
                  fontSize: 13
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60 mb-2 block", children: "Mood" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: MOODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setNewMood(m),
                className: "text-xl rounded-lg p-2 transition-all",
                style: {
                  background: newMood === m ? "rgba(39,215,224,0.2)" : "var(--os-border-subtle)",
                  border: `1px solid ${newMood === m ? "rgba(39,215,224,0.5)" : BORDER}`
                },
                title: MOOD_LABELS[m],
                children: m
              },
              m
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60 mb-1 block", children: "Tags (comma-separated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newTags,
                onChange: (e) => setNewTags(e.target.value),
                placeholder: "flying, water, work...",
                "data-ocid": "dreamjournal.search_input",
                className: "h-8 text-xs",
                style: {
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: "var(--os-text-primary)"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setNewLucid(!newLucid),
              "data-ocid": "dreamjournal.toggle",
              className: "flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all",
              style: {
                background: newLucid ? "rgba(39,215,224,0.15)" : "var(--os-border-subtle)",
                border: `1px solid ${newLucid ? "rgba(39,215,224,0.4)" : BORDER}`,
                color: newLucid ? CYAN : "var(--os-text-secondary)"
              },
              children: "✨ Lucid Dream"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: addEntry,
              "data-ocid": "dreamjournal.submit_button",
              disabled: !newDesc.trim(),
              className: "w-full h-9 text-sm",
              style: {
                background: "rgba(39,215,224,0.2)",
                color: "var(--os-accent)",
                border: "1px solid rgba(39,215,224,0.4)"
              },
              children: "Save Dream"
            }
          )
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-2 flex gap-4 shrink-0",
              style: { borderBottom: `1px solid ${BORDER}` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Total " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-accent)" }, children: entries.length })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Lucid " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(168,85,247,0.9)" }, children: [
                    lucidPct,
                    "%"
                  ] })
                ] }),
                topTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Top: " }),
                  topTags.slice(0, 3).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-[10px] h-4 px-1",
                      style: {
                        borderColor: "rgba(39,215,224,0.3)",
                        color: "var(--os-accent)"
                      },
                      children: t
                    },
                    t
                  ))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Search dreams or tags...",
                "data-ocid": "dreamjournal.search_input",
                className: "h-7 pl-6 text-xs",
                style: {
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: "var(--os-text-primary)"
                }
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 px-4", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "dreamjournal.empty_state",
              className: "flex flex-col items-center justify-center py-12 text-muted-foreground/60",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-8 h-8 mb-2 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: entries.length === 0 ? "No dreams logged yet" : "No results found" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 py-2", children: filtered.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": `dreamjournal.item.${i + 1}`,
              className: "rounded-lg p-3 group",
              style: {
                background: "var(--os-border-subtle)",
                border: `1px solid ${BORDER}`
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: entry.mood }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: entry.date }),
                    entry.lucid && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-[10px] h-4 px-1",
                        style: {
                          borderColor: "rgba(168,85,247,0.4)",
                          color: "rgba(168,85,247,0.9)"
                        },
                        children: "Lucid"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-3", children: entry.description }),
                  entry.tags && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: entry.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-[10px] h-4 px-1",
                      style: {
                        borderColor: "rgba(39,215,224,0.25)",
                        color: "rgba(39,215,224,0.7)"
                      },
                      children: t
                    },
                    t
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => deleteEntry(entry.id),
                    "data-ocid": `dreamjournal.delete_button.${i + 1}`,
                    className: "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded",
                    style: { color: "rgba(251,113,133,0.7)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                  }
                )
              ] })
            },
            entry.id
          )) }) })
        ] })
      ]
    }
  );
}
export {
  DreamJournal
};
