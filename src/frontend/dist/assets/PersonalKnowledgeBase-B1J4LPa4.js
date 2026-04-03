import { c as createLucideIcon, r as reactExports, g as ue, j as jsxRuntimeExports, B as BookOpen, S as Search, X, aS as GitBranch, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode);
function parseLinks(content) {
  const matches = content.match(/\[\[([^\]]+)\]\]/g) ?? [];
  return matches.map((m) => m.slice(2, -2).trim());
}
function renderContent(content, notes, onNavigate) {
  const parts = content.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part) => {
    const linkMatch = part.match(/^\[\[([^\]]+)\]\]$/);
    if (linkMatch) {
      const title = linkMatch[1];
      const exists = notes.some(
        (n) => n.title.toLowerCase() === title.toLowerCase()
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onNavigate(title),
          style: {
            color: exists ? "#27D7E0" : "rgba(248,113,113,0.8)",
            textDecoration: "underline",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            padding: 0,
            font: "inherit"
          },
          title: exists ? `Open ${title}` : `Create ${title}`,
          children: part
        },
        part
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: part }, part);
  });
}
function PersonalKnowledgeBase() {
  const { data: savedNotes, set: persistNotes } = useCanisterKV(
    "decentos_knowledge_base",
    []
  );
  const [notes, setNotes] = reactExports.useState([]);
  const hydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (savedNotes.length > 0) setNotes(savedNotes);
  }, [savedNotes]);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [editTitle, setEditTitle] = reactExports.useState("");
  const [editContent, setEditContent] = reactExports.useState("");
  const [isDirty, setIsDirty] = reactExports.useState(false);
  const [panelView, setPanelView] = reactExports.useState("notes");
  const contentRef = reactExports.useRef(null);
  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;
  const filteredNotes = reactExports.useMemo(() => {
    if (!search) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);
  const saveNotes = reactExports.useCallback(
    (updated) => {
      setNotes(updated);
      persistNotes(updated);
    },
    [persistNotes]
  );
  const createNote = reactExports.useCallback(
    (initialTitle = "") => {
      const id = `note-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const now = Date.now();
      const newNote = {
        id,
        title: initialTitle || `Note ${notes.length + 1}`,
        content: "",
        createdAt: now,
        updatedAt: now
      };
      const updated = [newNote, ...notes];
      saveNotes(updated);
      setSelectedId(id);
      setEditTitle(newNote.title);
      setEditContent("");
      setIsDirty(false);
      setTimeout(() => {
        var _a;
        return (_a = contentRef.current) == null ? void 0 : _a.focus();
      }, 50);
      ue.success("Note created");
    },
    [notes, saveNotes]
  );
  const selectNote = reactExports.useCallback(
    (note) => {
      if (isDirty && selectedNote) {
        const updated = notes.map(
          (n) => n.id === selectedNote.id ? {
            ...n,
            title: editTitle,
            content: editContent,
            updatedAt: Date.now()
          } : n
        );
        saveNotes(updated);
      }
      setSelectedId(note.id);
      setEditTitle(note.title);
      setEditContent(note.content);
      setIsDirty(false);
    },
    [isDirty, selectedNote, notes, editTitle, editContent, saveNotes]
  );
  const saveNote = reactExports.useCallback(() => {
    if (!selectedNote) return;
    const updated = notes.map(
      (n) => n.id === selectedNote.id ? {
        ...n,
        title: editTitle.trim() || selectedNote.title,
        content: editContent,
        updatedAt: Date.now()
      } : n
    );
    saveNotes(updated);
    setIsDirty(false);
    ue.success("Saved to chain ✓");
  }, [selectedNote, notes, editTitle, editContent, saveNotes]);
  const deleteNote = reactExports.useCallback(
    (id) => {
      var _a, _b, _c;
      const updated = notes.filter((n) => n.id !== id);
      saveNotes(updated);
      if (selectedId === id) {
        setSelectedId(((_a = updated[0]) == null ? void 0 : _a.id) ?? null);
        setEditTitle(((_b = updated[0]) == null ? void 0 : _b.title) ?? "");
        setEditContent(((_c = updated[0]) == null ? void 0 : _c.content) ?? "");
        setIsDirty(false);
      }
      ue.success("Note deleted");
    },
    [notes, selectedId, saveNotes]
  );
  const navigateToTitle = reactExports.useCallback(
    (title) => {
      const existing = notes.find(
        (n) => n.title.toLowerCase() === title.toLowerCase()
      );
      if (existing) {
        selectNote(existing);
      } else {
        createNote(title);
      }
    },
    [notes, selectNote, createNote]
  );
  const graphData = reactExports.useMemo(() => {
    const edges = [];
    for (const note of notes) {
      const links = parseLinks(note.content);
      for (const link of links) {
        const target = notes.find(
          (n) => n.title.toLowerCase() === link.toLowerCase()
        );
        if (target) edges.push({ from: note.id, to: target.id });
      }
    }
    return edges;
  }, [notes]);
  const graphPositions = reactExports.useMemo(() => {
    const pos = {};
    const N = notes.length;
    if (N === 0) return pos;
    const W = 340;
    const H = 220;
    notes.forEach((note, i) => {
      const angle = i / N * 2 * Math.PI;
      const r = Math.min(W, H) * 0.35;
      pos[note.id] = {
        x: W / 2 + r * Math.cos(angle),
        y: H / 2 + r * Math.sin(angle)
      };
    });
    return pos;
  }, [notes]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full",
      style: { background: "rgba(9,13,16,0.9)" },
      "data-ocid": "knowledgebase.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-52 flex-shrink-0 flex flex-col border-r",
            style: {
              borderColor: "rgba(39,215,224,0.12)",
              background: "rgba(14,22,28,0.7)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 px-3 py-2.5 border-b flex-shrink-0",
                  style: { borderColor: "rgba(39,215,224,0.1)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      BookOpen,
                      {
                        className: "w-3.5 h-3.5",
                        style: { color: "var(--os-accent)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-semibold flex-1",
                        style: { color: "var(--os-accent)" },
                        children: "Knowledge Base"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => createNote(),
                        "data-ocid": "knowledgebase.primary_button",
                        className: "w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 transition-colors",
                        style: { color: "rgba(39,215,224,0.7)" },
                        title: "New note",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1.5 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Search,
                  {
                    className: "absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3",
                    style: { color: "rgba(39,215,224,0.4)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Search notes...",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    "data-ocid": "knowledgebase.search_input",
                    className: "w-full h-6 pl-6 pr-5 rounded text-[10px] outline-none",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: "1px solid rgba(39,215,224,0.15)",
                      color: "var(--os-text-primary)"
                    }
                  }
                ),
                search && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSearch(""),
                    className: "absolute right-1.5 top-1/2 -translate-y-1/2",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      X,
                      {
                        className: "w-2.5 h-2.5",
                        style: { color: "var(--os-text-muted)" }
                      }
                    )
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex mx-2 mb-1.5 rounded overflow-hidden flex-shrink-0",
                  style: { border: "1px solid rgba(39,215,224,0.15)" },
                  children: ["notes", "graph"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setPanelView(v),
                      "data-ocid": `knowledgebase.${v}.tab`,
                      className: "flex-1 text-[9px] py-1 capitalize transition-colors flex items-center justify-center gap-0.5",
                      style: {
                        background: panelView === v ? "rgba(39,215,224,0.15)" : "transparent",
                        color: panelView === v ? "#27D7E0" : "var(--os-text-muted)"
                      },
                      children: [
                        v === "notes" ? /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(GitBranch, { className: "w-2.5 h-2.5" }),
                        v
                      ]
                    },
                    v
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: panelView === "notes" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1 space-y-0.5", children: filteredNotes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-center py-8 text-[10px]",
                  style: { color: "var(--os-text-muted)" },
                  "data-ocid": "knowledgebase.empty_state",
                  children: search ? "No results" : "No notes yet"
                }
              ) : filteredNotes.map((note, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `knowledgebase.item.${idx + 1}`,
                  className: "group relative rounded px-2 py-1.5 cursor-pointer transition-all",
                  style: {
                    background: selectedId === note.id ? "rgba(39,215,224,0.1)" : "transparent",
                    border: selectedId === note.id ? "1px solid rgba(39,215,224,0.25)" : "1px solid transparent"
                  },
                  onClick: () => selectNote(note),
                  onKeyDown: (e) => e.key === "Enter" && selectNote(note),
                  tabIndex: 0,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[11px] font-medium truncate pr-4",
                        style: {
                          color: selectedId === note.id ? "#27D7E0" : "var(--os-text-secondary)"
                        },
                        children: note.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[9px] truncate mt-0.5",
                        style: { color: "var(--os-text-muted)" },
                        children: note.content.slice(0, 50) || "Empty note"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        },
                        "data-ocid": `knowledgebase.delete_button.${idx + 1}`,
                        className: "absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-muted-foreground/60 hover:text-red-400 transition-all",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-2.5 h-2.5" })
                      }
                    )
                  ]
                },
                note.id
              )) }) : (
                /* Graph view */
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2", children: notes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] text-center py-8",
                    style: { color: "var(--os-text-muted)" },
                    children: "No notes to graph"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    width: "100%",
                    viewBox: "0 0 340 220",
                    style: { overflow: "visible" },
                    "aria-label": "Knowledge graph",
                    role: "img",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Knowledge graph" }),
                      graphData.map((edge) => {
                        const from = graphPositions[edge.from];
                        const to = graphPositions[edge.to];
                        if (!from || !to) return null;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: from.x,
                            y1: from.y,
                            x2: to.x,
                            y2: to.y,
                            stroke: "rgba(39,215,224,0.2)",
                            strokeWidth: 1
                          },
                          `${edge.from}-${edge.to}`
                        );
                      }),
                      notes.map((note) => {
                        const pos = graphPositions[note.id];
                        if (!pos) return null;
                        const isSelected = note.id === selectedId;
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "g",
                          {
                            onClick: () => selectNote(note),
                            onKeyDown: (e) => e.key === "Enter" && selectNote(note),
                            style: { cursor: "pointer" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "circle",
                                {
                                  cx: pos.x,
                                  cy: pos.y,
                                  r: isSelected ? 8 : 5,
                                  fill: isSelected ? "#27D7E0" : "rgba(39,215,224,0.4)",
                                  stroke: isSelected ? "rgba(39,215,224,0.8)" : "none",
                                  strokeWidth: 2
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "text",
                                {
                                  x: pos.x,
                                  y: pos.y + 16,
                                  textAnchor: "middle",
                                  fontSize: 7,
                                  fill: "var(--os-text-secondary)",
                                  children: [
                                    note.title.slice(0, 12),
                                    note.title.length > 12 ? "…" : ""
                                  ]
                                }
                              )
                            ]
                          },
                          note.id
                        );
                      })
                    ]
                  }
                ) })
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col min-w-0", children: selectedNote ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-4 py-2 border-b flex-shrink-0",
              style: {
                borderColor: "rgba(39,215,224,0.12)",
                background: "rgba(14,22,28,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: editTitle,
                    onChange: (e) => {
                      setEditTitle(e.target.value);
                      setIsDirty(true);
                    },
                    onKeyDown: (e) => {
                      var _a;
                      return e.key === "Enter" && ((_a = contentRef.current) == null ? void 0 : _a.focus());
                    },
                    "data-ocid": "knowledgebase.input",
                    placeholder: "Note title",
                    className: "flex-1 bg-transparent outline-none text-sm font-semibold",
                    style: { color: "var(--os-text-primary)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  isDirty && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[9px] px-1.5 py-0.5 rounded",
                      style: {
                        background: "rgba(234,179,8,0.15)",
                        color: "rgba(234,179,8,0.8)",
                        border: "1px solid rgba(234,179,8,0.2)"
                      },
                      children: "Unsaved"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: saveNote,
                      "data-ocid": "knowledgebase.save_button",
                      className: "px-3 h-6 rounded text-[10px] font-semibold transition-all",
                      style: {
                        background: "rgba(39,215,224,0.12)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "var(--os-accent)"
                      },
                      children: "Save"
                    }
                  )
                ] })
              ]
            }
          ),
          parseLinks(editContent).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-4 py-1.5 flex-shrink-0 overflow-x-auto",
              style: {
                borderBottom: "1px solid rgba(39,215,224,0.08)",
                background: "rgba(39,215,224,0.03)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link2,
                  {
                    className: "w-3 h-3 flex-shrink-0",
                    style: { color: "rgba(39,215,224,0.5)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 flex-wrap", children: parseLinks(editContent).map((link) => {
                  const exists = notes.some(
                    (n) => n.title.toLowerCase() === link.toLowerCase()
                  );
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => navigateToTitle(link),
                      className: "px-1.5 py-0.5 rounded text-[9px] transition-all",
                      style: {
                        background: exists ? "rgba(39,215,224,0.1)" : "rgba(248,113,113,0.1)",
                        border: exists ? "1px solid rgba(39,215,224,0.25)" : "1px solid rgba(248,113,113,0.25)",
                        color: exists ? "#27D7E0" : "rgba(248,113,113,0.8)"
                      },
                      children: link
                    },
                    link
                  );
                }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                ref: contentRef,
                value: editContent,
                onChange: (e) => {
                  setEditContent(e.target.value);
                  setIsDirty(true);
                },
                onKeyDown: (e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                    e.preventDefault();
                    saveNote();
                  }
                },
                "data-ocid": "knowledgebase.editor",
                placeholder: "Write your note here...\n\nTip: Use [[Note Title]] to link to other notes.\nLinks in cyan = note exists, red = not yet created.",
                className: "flex-1 p-4 bg-transparent outline-none resize-none text-xs font-mono leading-relaxed",
                style: {
                  color: "var(--os-text-secondary)",
                  borderRight: "1px solid rgba(39,215,224,0.08)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex-1 p-4 overflow-y-auto text-xs leading-relaxed",
                style: { color: "var(--os-text-primary)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "text-[9px] mb-2",
                      style: { color: "var(--os-text-muted)" },
                      children: "PREVIEW"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap break-words", children: renderContent(editContent, notes, navigateToTitle) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-1.5 flex items-center gap-4 flex-shrink-0 border-t",
              style: {
                borderColor: "rgba(39,215,224,0.08)",
                background: "rgba(14,22,28,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[9px]",
                    style: { color: "var(--os-text-muted)" },
                    children: [
                      "Created ",
                      new Date(selectedNote.createdAt).toLocaleDateString()
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[9px]",
                    style: { color: "var(--os-text-muted)" },
                    children: [
                      "Updated ",
                      new Date(selectedNote.updatedAt).toLocaleDateString()
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[9px] ml-auto",
                    style: { color: "var(--os-text-muted)" },
                    children: "Ctrl+S to save"
                  }
                )
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 flex flex-col items-center justify-center gap-4",
            "data-ocid": "knowledgebase.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                BookOpen,
                {
                  className: "w-12 h-12",
                  style: { color: "rgba(39,215,224,0.15)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-semibold mb-1",
                    style: { color: "var(--os-text-secondary)" },
                    children: "No note selected"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "var(--os-text-muted)" }, children: "Create a note or select one from the sidebar" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => createNote(),
                  "data-ocid": "knowledgebase.open_modal_button",
                  className: "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                  style: {
                    background: "rgba(39,215,224,0.1)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "var(--os-accent)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    "Create First Note"
                  ]
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
export {
  PersonalKnowledgeBase
};
