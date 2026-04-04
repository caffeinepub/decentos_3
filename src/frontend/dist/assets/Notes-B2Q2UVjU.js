import { c as createLucideIcon, u as useOS, a as useOSEventBus, r as reactExports, j as jsxRuntimeExports, B as BookOpen, C as Check, S as Search, X, F as FileText, T as Trash2, b as CodeXml, U as Users, d as SquareCheckBig } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { F as FolderPlus } from "./folder-plus-QrvUSRL0.js";
import { S as Star } from "./star-CUwRbTIB.js";
import { P as Pencil } from "./pencil-COUdXnEp.js";
import { E as Eye } from "./eye-DdII2rDh.js";
import { D as Download } from "./download-BCO-vDCJ.js";
import { C as CalendarPlus } from "./calendar-plus-CBqrzt1Q.js";
import { B as Bold, I as Italic } from "./italic-H3QB-IXR.js";
import { H as Heading1 } from "./heading-1-acFoPaw9.js";
import { L as List } from "./list-IfiP4J1J.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4 12h8", key: "17cfdx" }],
  ["path", { d: "M4 18V6", key: "1rz3zl" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }],
  ["path", { d: "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1", key: "9jr5yi" }]
];
const Heading2 = createLucideIcon("heading-2", __iconNode);
const NOTE_LABELS = [
  {
    id: "Personal",
    color: "rgba(34,197,94,0.85)",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.3)"
  },
  {
    id: "Work",
    color: "rgba(59,130,246,0.85)",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.3)"
  },
  {
    id: "Ideas",
    color: "rgba(249,115,22,0.85)",
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.3)"
  },
  {
    id: "Archive",
    color: "rgba(148,163,184,0.85)",
    bg: "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.3)"
  }
];
const TEMPLATES = [
  {
    id: "blank",
    name: "Blank",
    icon: FileText,
    description: "Start from scratch",
    content: "",
    accent: "rgba(99,102,241,0.15)",
    border: "rgba(99,102,241,0.3)",
    color: "rgba(99,102,241,0.9)"
  },
  {
    id: "meeting",
    name: "Meeting Notes",
    icon: Users,
    description: "Agenda, attendees & action items",
    content: "# Meeting Notes\n**Date:** {{date}}\n**Attendees:** \n\n## Agenda\n- \n\n## Discussion\n\n\n## Action Items\n- [ ] \n\n## Next Meeting\n",
    accent: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.3)",
    color: "rgba(59,130,246,0.9)"
  },
  {
    id: "daily",
    name: "Daily Journal",
    icon: BookOpen,
    description: "Gratitude, priorities & reflection",
    content: "# {{date}}\n\n## Today I'm grateful for\n- \n\n## Top 3 priorities\n1. \n2. \n3. \n\n## Notes\n\n\n## Tomorrow\n",
    accent: "rgba(168,85,247,0.15)",
    border: "rgba(168,85,247,0.3)",
    color: "rgba(168,85,247,0.9)"
  },
  {
    id: "todo",
    name: "Quick To-Do",
    icon: SquareCheckBig,
    description: "Prioritized task list",
    content: "# To-Do\n\n## High Priority\n- [ ] \n\n## Normal\n- [ ] \n\n## Someday\n- [ ] \n",
    accent: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.3)",
    color: "rgba(34,197,94,0.9)"
  }
];
function suggestTag(content) {
  const lower = content.toLowerCase();
  if (/meeting|agenda|attendees/.test(lower)) return "meeting";
  if (/recipe|ingredient|tbsp/.test(lower)) return "recipe";
  if (/workout|exercise|reps/.test(lower)) return "fitness";
  if (/budget|expense|\$/.test(lower)) return "finance";
  if (/todo|\[ \]/.test(lower)) return "tasks";
  return null;
}
function getTitleFromContent(content) {
  const firstLine = content.split("\n")[0].trim();
  return firstLine.length > 0 ? firstLine.slice(0, 50) : "Untitled";
}
function genId() {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function renderMarkdown(md) {
  let html = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(
    /```([\s\S]*?)```/g,
    (_m, code) => `<pre style="background:var(--os-bg-elevated);border:1px solid var(--os-text-muted);border-radius:6px;padding:10px 12px;overflow-x:auto;margin:8px 0"><code style="font-family:monospace;font-size:11px;color:rgba(99,102,241,0.9)">${code.trim()}</code></pre>`
  );
  html = html.replace(
    /`([^`]+)`/g,
    (_m, c) => `<code style="background:rgba(0,0,0,0.35);border:1px solid var(--os-border-subtle);border-radius:3px;padding:1px 5px;font-family:monospace;font-size:11px;color:rgba(200,200,240,0.9)">${c}</code>`
  );
  html = html.replace(
    /^### (.+)$/gm,
    (_m, t) => `<h3 style="font-size:14px;font-weight:600;color:var(--os-text-primary);margin:12px 0 4px">${t}</h3>`
  );
  html = html.replace(
    /^## (.+)$/gm,
    (_m, t) => `<h2 style="font-size:16px;font-weight:700;color:var(--os-text-primary);margin:16px 0 6px">${t}</h2>`
  );
  html = html.replace(
    /^# (.+)$/gm,
    (_m, t) => `<h1 style="font-size:20px;font-weight:800;color:rgba(129,140,248,1);margin:20px 0 8px">${t}</h1>`
  );
  html = html.replace(
    /^---$/gm,
    `<hr style="border:none;border-top:1px solid rgba(99,102,241,0.2);margin:12px 0"/>`
  );
  html = html.replace(
    /\*\*\*(.+?)\*\*\*/g,
    (_m, t) => `<strong><em>${t}</em></strong>`
  );
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    (_m, t) => `<strong style="font-weight:700;color:var(--os-text-primary)">${t}</strong>`
  );
  html = html.replace(
    /\*(.+?)\*/g,
    (_m, t) => `<em style="font-style:italic;color:var(--os-text-primary)">${t}</em>`
  );
  html = html.replace(
    /~~(.+?)~~/g,
    (_m, t) => `<s style="color:var(--os-text-secondary);text-decoration:line-through">${t}</s>`
  );
  html = html.replace(
    /^&gt; (.+)$/gm,
    (_m, t) => `<blockquote style="border-left:3px solid rgba(129,140,248,0.5);padding-left:12px;margin:8px 0;color:var(--os-text-secondary);font-style:italic">${t}</blockquote>`
  );
  html = html.replace(
    /^[\-\*] (.+)$/gm,
    (_m, t) => `<li style="list-style:disc inside;margin:2px 0;padding-left:4px;color:var(--os-text-secondary)">${t}</li>`
  );
  html = html.replace(
    /^\d+\. (.+)$/gm,
    (_m, t) => `<li style="list-style:decimal inside;margin:2px 0;padding-left:4px;color:var(--os-text-secondary)">${t}</li>`
  );
  html = html.replace(/\n\n/g, "<br/><br/>");
  html = html.replace(/\n/g, "<br/>");
  html = html.replace(
    /\[\[([^\]]+)\]\]/g,
    (_m, title) => `<span class="note-link" data-title="${title.replace(/"/g, "&quot;")}" style="background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);border-radius:4px;padding:1px 6px;cursor:pointer;color:rgba(129,140,248,0.9);font-size:0.9em;">${title}</span>`
  );
  return html;
}
function NoteLinkPreview({
  content,
  onNoteLink
}) {
  const divRef = reactExports.useRef(null);
  const html = reactExports.useMemo(() => renderMarkdown(content), [content]);
  reactExports.useEffect(() => {
    const div = divRef.current;
    if (!div) return;
    const links = div.querySelectorAll(".note-link");
    const handlers = [];
    for (const link of links) {
      const title = link.dataset.title ?? "";
      const handler = () => onNoteLink(title);
      link.addEventListener("click", handler);
      handlers.push(() => link.removeEventListener("click", handler));
    }
    return () => {
      for (const cleanup of handlers) cleanup();
    };
  }, [html, onNoteLink]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: divRef,
      className: "flex-1 overflow-y-auto p-4 text-sm leading-relaxed",
      style: { color: "var(--os-text-secondary)" },
      dangerouslySetInnerHTML: { __html: html }
    }
  );
}
function Notes({ windowProps: _windowProps }) {
  const { openApp } = useOS();
  const { emit } = useOSEventBus();
  const {
    data: persistedNotes,
    set: saveNotes,
    loading: notesLoading
  } = useCanisterKV("decentos_notes", []);
  const [notes, setNotes] = reactExports.useState([]);
  const [selectedId, setSelectedId] = reactExports.useState("");
  const hydratedRef = reactExports.useRef(false);
  const { data: persistedNotebooks, set: saveNotebooks } = useCanisterKV("notes_notebooks", []);
  const [notebooks, setNotebooks] = reactExports.useState([]);
  const [selectedNotebook, setSelectedNotebook] = reactExports.useState("all");
  const [addingNotebook, setAddingNotebook] = reactExports.useState(false);
  const [newNotebookName, setNewNotebookName] = reactExports.useState("");
  const notebooksRef = reactExports.useRef(false);
  const [previewMode, setPreviewMode] = reactExports.useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (notebooksRef.current) return;
    if (persistedNotebooks.length > 0) {
      notebooksRef.current = true;
      setNotebooks(persistedNotebooks);
    }
  }, [persistedNotebooks]);
  reactExports.useEffect(() => {
    if (notesLoading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (persistedNotes.length > 0) {
      const migrated = persistedNotes.map((n) => ({
        ...n,
        tags: n.tags ?? []
      }));
      setNotes(migrated);
      setSelectedId(migrated[0].id);
    } else {
      const initial = {
        id: genId(),
        title: "Welcome to Notes",
        content: "Welcome to Notes\n\nThis is your decentralized note-taking app. Notes are stored on-chain and persist between sessions.\n\nTips:\n• Click New Note to create a note\n• Choose from templates for common formats\n• Notes auto-save as you type\n• First line becomes the title\n• Add tags for organization\n\n## Markdown Support\n\nToggle **preview mode** to render markdown. Try:\n\n- **bold text**\n- *italic text*\n- `inline code`",
        tags: ["welcome"],
        updatedAt: Date.now(),
        pinned: false
      };
      setNotes([initial]);
      setSelectedId(initial.id);
      saveNotes([initial]);
    }
  }, [notesLoading, persistedNotes, saveNotes]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [activeTag, setActiveTag] = reactExports.useState(null);
  const [labelFilter, setLabelFilter] = reactExports.useState(null);
  const [tagInput, setTagInput] = reactExports.useState("");
  const [editingTags, setEditingTags] = reactExports.useState(false);
  const debounceRef = reactExports.useRef(null);
  const textareaRef = reactExports.useRef(null);
  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;
  const allTags = reactExports.useMemo(() => {
    const tagSet = /* @__PURE__ */ new Set();
    for (const n of notes) {
      for (const t of n.tags) {
        tagSet.add(t);
      }
    }
    return Array.from(tagSet).sort();
  }, [notes]);
  const suggestedTag = reactExports.useMemo(() => {
    if (!selectedNote) return null;
    return suggestTag(selectedNote.content);
  }, [selectedNote]);
  const filteredNotes = reactExports.useMemo(() => {
    let result = [...notes];
    if (selectedNotebook !== "all") {
      result = result.filter((n) => n.notebookId === selectedNotebook);
    }
    if (activeTag) {
      result = result.filter((n) => n.tags.includes(activeTag));
    }
    if (labelFilter) {
      result = result.filter((n) => n.label === labelFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return [
      ...result.filter((n) => n.pinned),
      ...result.filter((n) => !n.pinned)
    ];
  }, [notes, searchQuery, selectedNotebook, activeTag, labelFilter]);
  const createFromTemplate = reactExports.useCallback(
    (content) => {
      const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      const resolved = content.replace(/\{\{date\}\}/g, today);
      const newNote = {
        id: genId(),
        title: resolved ? getTitleFromContent(resolved) : "Untitled",
        content: resolved,
        tags: [],
        updatedAt: Date.now(),
        pinned: false
      };
      setNotes((prev) => {
        const updated = [newNote, ...prev];
        saveNotes(updated);
        return updated;
      });
      setSelectedId(newNote.id);
      setPreviewMode(false);
      setShowTemplatePicker(false);
    },
    [saveNotes]
  );
  const deleteNote = reactExports.useCallback(
    (id, e) => {
      e.stopPropagation();
      setNotes((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        saveNotes(updated);
        return updated;
      });
      if (selectedId === id) {
        const remaining = notes.filter((n) => n.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : "");
      }
    },
    [selectedId, notes, saveNotes]
  );
  const togglePin = reactExports.useCallback(
    (id, e) => {
      e.stopPropagation();
      setNotes((prev) => {
        const updated = prev.map(
          (n) => n.id === id ? { ...n, pinned: !n.pinned } : n
        );
        saveNotes(updated);
        return updated;
      });
    },
    [saveNotes]
  );
  const handleContentChange = reactExports.useCallback(
    (value) => {
      if (!selectedId) return;
      setNotes(
        (prev) => prev.map(
          (n) => n.id === selectedId ? {
            ...n,
            content: value,
            title: getTitleFromContent(value),
            updatedAt: Date.now()
          } : n
        )
      );
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setNotes((prev) => {
          saveNotes(prev);
          return prev;
        });
      }, 500);
    },
    [selectedId, saveNotes]
  );
  const exportNote = reactExports.useCallback(() => {
    if (!selectedNote) return;
    const blob = new Blob([selectedNote.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedNote.title.replace(/[^a-z0-9_\- ]/gi, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedNote]);
  const addTag = reactExports.useCallback(
    (raw) => {
      if (!selectedId) return;
      const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
      if (!tag) return;
      setNotes((prev) => {
        const updated = prev.map(
          (n) => n.id === selectedId && !n.tags.includes(tag) ? { ...n, tags: [...n.tags, tag] } : n
        );
        saveNotes(updated);
        return updated;
      });
      setTagInput("");
    },
    [selectedId, saveNotes]
  );
  const removeTag = reactExports.useCallback(
    (tag) => {
      if (!selectedId) return;
      setNotes((prev) => {
        const updated = prev.map(
          (n) => n.id === selectedId ? { ...n, tags: n.tags.filter((t) => t !== tag) } : n
        );
        saveNotes(updated);
        return updated;
      });
    },
    [selectedId, saveNotes]
  );
  const setNoteLabel = reactExports.useCallback(
    (label) => {
      if (!selectedId) return;
      setNotes((prev) => {
        const updated = prev.map(
          (n) => n.id === selectedId ? { ...n, label } : n
        );
        saveNotes(updated);
        return updated;
      });
    },
    [selectedId, saveNotes]
  );
  const scheduleNote = reactExports.useCallback(() => {
    if (!selectedNote) return;
    emit("open-calendar", {
      title: selectedNote.title,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    openApp("calendar", "Calendar");
  }, [selectedNote, emit, openApp]);
  const applyFormat = reactExports.useCallback(
    (type) => {
      const ta = textareaRef.current;
      if (!ta || !selectedId) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const sel = val.slice(start, end);
      if (type === "h1" || type === "h2" || type === "bullet") {
        const lineStart = val.lastIndexOf("\n", start - 1) + 1;
        const lineEnd = val.indexOf("\n", start);
        const line = val.slice(lineStart, lineEnd === -1 ? void 0 : lineEnd);
        const prefix = type === "h1" ? "# " : type === "h2" ? "## " : "- ";
        const cleanLine = line.replace(/^(#{1,2}\s|- )/, "");
        const newLine = prefix + cleanLine;
        const newVal2 = val.slice(0, lineStart) + newLine + (lineEnd === -1 ? "" : val.slice(lineEnd));
        handleContentChange(newVal2);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = lineStart + newLine.length;
          ta.focus();
        });
        return;
      }
      const wrap = type === "bold" ? "**" : type === "italic" ? "*" : "`";
      const inner = sel || (type === "code" ? "code" : type);
      const insert = `${wrap}${inner}${wrap}`;
      const newVal = val.slice(0, start) + insert + val.slice(end);
      handleContentChange(newVal);
      requestAnimationFrame(() => {
        if (sel) {
          ta.selectionStart = start;
          ta.selectionEnd = start + insert.length;
        } else {
          ta.selectionStart = ta.selectionEnd = start + wrap.length + inner.length;
        }
        ta.focus();
      });
    },
    [selectedId, handleContentChange]
  );
  reactExports.useEffect(() => {
    setTagInput("");
    setEditingTags(false);
    setPreviewMode(false);
  }, [selectedId]);
  reactExports.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);
  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString(void 0, { month: "short", day: "numeric" });
  };
  const wordCount = (selectedNote == null ? void 0 : selectedNote.content.trim()) === "" ? 0 : (selectedNote == null ? void 0 : selectedNote.content.trim().split(/\s+/).length) ?? 0;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: { background: "var(--os-bg-app)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-52 flex-shrink-0 flex flex-col border-r overflow-hidden",
        style: {
          borderColor: "var(--os-border-subtle)",
          background: "var(--os-bg-app)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0",
              style: {
                borderColor: "var(--os-border-subtle)",
                background: "var(--os-bg-elevated)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold",
                    style: { color: "var(--os-text-primary)" },
                    children: "Notes"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowTemplatePicker(true),
                    "data-ocid": "notes.add_button",
                    className: "flex items-center justify-center w-6 h-6 rounded transition-all hover:opacity-80",
                    style: {
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "rgba(99,102,241,0.9)"
                    },
                    title: "New Note",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-2 py-1.5 border-b flex-shrink-0 flex flex-wrap gap-1",
              style: {
                borderColor: "var(--os-border-subtle)",
                background: "var(--os-bg-app)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setLabelFilter(null),
                    className: "text-[9px] px-2 py-0.5 rounded-full transition-all",
                    style: {
                      background: labelFilter === null ? "rgba(99,102,241,0.2)" : "var(--os-border-subtle)",
                      color: labelFilter === null ? "rgba(99,102,241,1)" : "var(--os-text-muted)",
                      border: `1px solid ${labelFilter === null ? "rgba(99,102,241,0.4)" : "var(--os-border-subtle)"}`
                    },
                    children: "All"
                  }
                ),
                NOTE_LABELS.map((lbl) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setLabelFilter(lbl.id === labelFilter ? null : lbl.id),
                    className: "text-[9px] px-2 py-0.5 rounded-full transition-all",
                    style: {
                      background: labelFilter === lbl.id ? lbl.bg : "var(--os-border-subtle)",
                      color: labelFilter === lbl.id ? lbl.color : "var(--os-text-muted)",
                      border: `1px solid ${labelFilter === lbl.id ? lbl.border : "var(--os-border-subtle)"}`
                    },
                    children: lbl.id
                  },
                  lbl.id
                ))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-2 py-2 border-b flex-shrink-0",
              style: {
                borderColor: "var(--os-border-subtle)",
                background: "var(--os-bg-app)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[9px] font-semibold uppercase tracking-wider",
                      style: { color: "rgba(99,102,241,0.5)" },
                      children: "Notebooks"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setAddingNotebook(true),
                      title: "New Notebook",
                      className: "w-4 h-4 rounded flex items-center justify-center transition-all hover:opacity-80",
                      style: { color: "rgba(99,102,241,0.6)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "w-3 h-3" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelectedNotebook("all"),
                      "data-ocid": "notes.notebook.tab",
                      className: "flex items-center gap-1.5 w-full text-left px-2 py-1 rounded text-[10px] transition-all",
                      style: {
                        background: selectedNotebook === "all" ? "rgba(99,102,241,0.1)" : "transparent",
                        color: selectedNotebook === "all" ? "rgba(99,102,241,0.9)" : "var(--os-text-secondary)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-2.5 h-2.5" }),
                        " All Notes",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "ml-auto text-[9px]",
                            style: { color: "var(--os-text-muted)" },
                            children: notes.length
                          }
                        )
                      ]
                    }
                  ),
                  notebooks.map((nb) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelectedNotebook(nb.id),
                      className: "flex items-center gap-1.5 w-full text-left px-2 py-1 rounded text-[10px] transition-all",
                      style: {
                        background: selectedNotebook === nb.id ? "rgba(99,102,241,0.1)" : "transparent",
                        color: selectedNotebook === nb.id ? "rgba(99,102,241,0.9)" : "var(--os-text-secondary)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-2.5 h-2.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate flex-1", children: nb.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "ml-auto text-[9px]",
                            style: { color: "var(--os-text-muted)" },
                            children: notes.filter((n) => n.notebookId === nb.id).length
                          }
                        )
                      ]
                    },
                    nb.id
                  )),
                  addingNotebook && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        value: newNotebookName,
                        onChange: (e) => setNewNotebookName(e.target.value),
                        placeholder: "Notebook name",
                        "data-ocid": "notes.notebook.input",
                        onKeyDown: (e) => {
                          if (e.key === "Enter" && newNotebookName.trim()) {
                            const nb = {
                              id: `nb_${Date.now()}`,
                              name: newNotebookName.trim()
                            };
                            const updated = [...notebooks, nb];
                            setNotebooks(updated);
                            saveNotebooks(updated);
                            setNewNotebookName("");
                            setAddingNotebook(false);
                            setSelectedNotebook(nb.id);
                          } else if (e.key === "Escape") {
                            setAddingNotebook(false);
                            setNewNotebookName("");
                          }
                        },
                        className: "flex-1 px-1.5 py-0.5 rounded text-[10px] outline-none",
                        style: {
                          background: "var(--os-bg-elevated)",
                          border: "1px solid rgba(99,102,241,0.25)",
                          color: "var(--os-text-secondary)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          if (newNotebookName.trim()) {
                            const nb = {
                              id: `nb_${Date.now()}`,
                              name: newNotebookName.trim()
                            };
                            const updated = [...notebooks, nb];
                            setNotebooks(updated);
                            saveNotebooks(updated);
                            setNewNotebookName("");
                            setAddingNotebook(false);
                            setSelectedNotebook(nb.id);
                          }
                        },
                        "data-ocid": "notes.notebook.confirm_button",
                        className: "w-4 h-4 rounded flex items-center justify-center",
                        style: { color: "rgba(99,102,241,0.8)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" })
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-2 py-2 border-b flex-shrink-0",
              style: { borderColor: "var(--os-border-subtle)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Search,
                  {
                    className: "absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3",
                    style: { color: "rgba(99,102,241,0.4)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    placeholder: "Search notes...",
                    "data-ocid": "notes.search_input",
                    className: "w-full pl-6 pr-5 py-1 text-[10px] rounded outline-none",
                    style: {
                      background: "var(--os-bg-elevated)",
                      border: "1px solid rgba(99,102,241,0.15)",
                      color: "var(--os-text-primary)"
                    }
                  }
                ),
                searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSearchQuery(""),
                    className: "absolute right-2 top-1/2 -translate-y-1/2",
                    style: { color: "var(--os-text-muted)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                  }
                )
              ] })
            }
          ),
          allTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-2 pb-1.5 flex flex-wrap gap-1 border-b flex-shrink-0",
              style: { borderColor: "var(--os-border-subtle)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setActiveTag(null),
                    "data-ocid": "notes.tab",
                    className: "text-[9px] px-2 py-0.5 rounded-full transition-colors",
                    style: {
                      background: activeTag === null ? "rgba(99,102,241,0.2)" : "var(--os-border-subtle)",
                      color: activeTag === null ? "rgba(99,102,241,1)" : "var(--os-text-muted)",
                      border: activeTag === null ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--os-text-muted)"
                    },
                    children: "All"
                  }
                ),
                allTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setActiveTag(activeTag === tag ? null : tag),
                    "data-ocid": "notes.tab",
                    className: "text-[9px] px-2 py-0.5 rounded-full transition-colors",
                    style: {
                      background: activeTag === tag ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.08)",
                      color: activeTag === tag ? "rgba(99,102,241,1)" : "rgba(99,102,241,0.6)",
                      border: activeTag === tag ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(99,102,241,0.15)"
                    },
                    children: tag
                  },
                  tag
                ))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: filteredNotes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-full gap-3 p-4",
              "data-ocid": "notes.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FileText,
                  {
                    className: "w-10 h-10",
                    style: { color: "rgba(99,102,241,0.15)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] text-center",
                    style: { color: "var(--os-text-muted)" },
                    children: searchQuery ? "No matching notes" : "No notes yet"
                  }
                ),
                !searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowTemplatePicker(true),
                    "data-ocid": "notes.primary_button",
                    className: "text-[10px] px-3 py-1.5 rounded-lg transition-all",
                    style: {
                      background: "rgba(99,102,241,0.12)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "rgba(99,102,241,0.9)"
                    },
                    children: "+ Create your first note"
                  }
                )
              ]
            }
          ) : filteredNotes.map((note, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSelectedId(note.id),
              "data-ocid": `notes.item.${i + 1}`,
              className: "w-full text-left px-3 py-2 border-b group relative transition-colors",
              style: {
                borderColor: "var(--os-border-subtle)",
                background: selectedId === note.id ? "rgba(99,102,241,0.08)" : "transparent",
                borderLeft: selectedId === note.id ? "2px solid rgba(99,102,241,0.6)" : "2px solid transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-1 min-w-0", children: [
                    note.pinned && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Star,
                      {
                        className: "w-2.5 h-2.5 flex-shrink-0",
                        style: {
                          color: "rgba(234,179,8,0.8)",
                          fill: "rgba(234,179,8,0.8)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-medium truncate",
                        style: {
                          color: selectedId === note.id ? "rgba(99,102,241,0.9)" : "var(--os-text-secondary)"
                        },
                        children: searchQuery && note.title.toLowerCase().includes(searchQuery.toLowerCase()) ? (() => {
                          const idx = note.title.toLowerCase().indexOf(searchQuery.toLowerCase());
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            note.title.slice(0, idx),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "mark",
                              {
                                style: {
                                  background: "rgba(99,102,241,0.3)",
                                  color: "inherit",
                                  borderRadius: 2,
                                  padding: "0 1px"
                                },
                                children: note.title.slice(
                                  idx,
                                  idx + searchQuery.length
                                )
                              }
                            ),
                            note.title.slice(idx + searchQuery.length)
                          ] });
                        })() : note.title
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 flex-shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => togglePin(note.id, e),
                        "data-ocid": `notes.toggle.${i + 1}`,
                        title: note.pinned ? "Unpin" : "Pin note",
                        className: "opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all",
                        style: {
                          color: note.pinned ? "rgba(234,179,8,0.8)" : "var(--os-text-muted)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Star,
                          {
                            className: "w-3 h-3",
                            style: {
                              fill: note.pinned ? "rgba(234,179,8,0.8)" : "none"
                            }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => deleteNote(note.id, e),
                        "data-ocid": `notes.delete_button.${i + 1}`,
                        className: "opacity-0 group-hover:opacity-100 flex-shrink-0 text-destructive/60 hover:text-destructive transition-all",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] mt-0.5",
                    style: { color: "var(--os-text-muted)" },
                    children: formatDate(note.updatedAt)
                  }
                ),
                note.label && (() => {
                  const lbl = NOTE_LABELS.find((l) => l.id === note.label);
                  return lbl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "inline-block text-[9px] px-1.5 py-0.5 rounded-full mt-1",
                      style: {
                        background: lbl.bg,
                        color: lbl.color,
                        border: `1px solid ${lbl.border}`
                      },
                      children: note.label
                    }
                  ) : null;
                })(),
                note.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-1", children: [
                  note.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[9px] px-1.5 py-0.5 rounded-full",
                      style: {
                        background: "rgba(99,102,241,0.12)",
                        color: "rgba(99,102,241,0.7)",
                        border: "1px solid rgba(99,102,241,0.2)"
                      },
                      children: tag
                    },
                    tag
                  )),
                  note.tags.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-[9px]",
                      style: { color: "var(--os-text-muted)" },
                      children: [
                        "+",
                        note.tags.length - 2
                      ]
                    }
                  )
                ] })
              ]
            },
            note.id
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      selectedNote ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center flex-wrap gap-1.5 px-3 py-2 border-b flex-shrink-0",
            style: {
              borderColor: "var(--os-border-subtle)",
              background: "var(--os-bg-elevated)"
            },
            children: [
              selectedNote.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full",
                  style: {
                    background: "rgba(99,102,241,0.12)",
                    color: "rgba(99,102,241,0.8)",
                    border: "1px solid rgba(99,102,241,0.25)"
                  },
                  children: [
                    tag,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeTag(tag),
                        style: { color: "var(--os-text-muted)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-2.5 h-2.5" })
                      }
                    )
                  ]
                },
                tag
              )),
              editingTags ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: tagInput,
                  onChange: (e) => setTagInput(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag(tagInput);
                    } else if (e.key === "Escape") {
                      setEditingTags(false);
                    }
                  },
                  onBlur: () => {
                    if (tagInput) addTag(tagInput);
                    setEditingTags(false);
                  },
                  placeholder: "tag name...",
                  "data-ocid": "notes.input",
                  className: "text-[10px] px-2 py-0.5 rounded outline-none w-24",
                  style: {
                    background: "var(--os-bg-elevated)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "var(--os-text-secondary)"
                  }
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setEditingTags(true),
                  "data-ocid": "notes.toggle",
                  className: "text-[10px] px-2 py-0.5 rounded-full transition-colors",
                  style: {
                    background: "var(--os-bg-elevated)",
                    border: "1px dashed var(--os-text-muted)",
                    color: "var(--os-text-muted)"
                  },
                  children: "+ add tag"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: selectedNote.label ?? "",
                    onChange: (e) => setNoteLabel(e.target.value || void 0),
                    title: "Set label",
                    "data-ocid": "notes.select",
                    className: "h-6 text-[10px] px-1 rounded outline-none",
                    style: {
                      background: "var(--os-bg-elevated)",
                      border: "1px solid var(--os-border-subtle)",
                      color: "var(--os-text-secondary)",
                      colorScheme: "dark"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No label" }),
                      NOTE_LABELS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: l.id, children: l.id }, l.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPreviewMode((v) => !v),
                    "data-ocid": "notes.toggle",
                    title: previewMode ? "Edit mode" : "Preview markdown",
                    className: "flex items-center justify-center w-6 h-6 rounded transition-all",
                    style: {
                      background: previewMode ? "rgba(99,102,241,0.15)" : "transparent",
                      border: previewMode ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--os-text-muted)",
                      color: previewMode ? "rgba(99,102,241,0.9)" : "var(--os-text-secondary)"
                    },
                    children: previewMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: exportNote,
                    "data-ocid": "notes.primary_button",
                    title: "Export as .md file",
                    className: "flex items-center justify-center w-6 h-6 rounded transition-all",
                    style: {
                      color: "var(--os-text-secondary)",
                      border: "1px solid var(--os-text-muted)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: scheduleNote,
                    "data-ocid": "notes.calendar_button",
                    title: "Schedule in Calendar",
                    className: "flex items-center justify-center w-6 h-6 rounded transition-all",
                    style: {
                      color: "rgba(99,102,241,0.6)",
                      border: "1px solid rgba(99,102,241,0.2)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ]
          }
        ),
        suggestedTag && !selectedNote.tags.includes(suggestedTag) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-1 flex-shrink-0",
            style: {
              background: "rgba(99,102,241,0.03)",
              borderBottom: "1px solid var(--os-border-subtle)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px]",
                  style: { color: "var(--os-text-muted)" },
                  children: "Suggested:"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => addTag(suggestedTag),
                  className: "text-[10px] px-2 py-0.5 rounded-full transition-all hover:opacity-80",
                  style: {
                    background: "rgba(99,102,241,0.1)",
                    color: "rgba(99,102,241,0.85)",
                    border: "1px solid rgba(99,102,241,0.25)"
                  },
                  children: [
                    "+ ",
                    suggestedTag
                  ]
                }
              )
            ]
          }
        ),
        !previewMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1 px-3 py-1.5 border-b flex-shrink-0",
            style: {
              borderColor: "var(--os-border-subtle)",
              background: "var(--os-bg-app)"
            },
            children: [
              [
                {
                  type: "bold",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "w-3 h-3" }),
                  title: "Bold (**text**)"
                },
                {
                  type: "italic",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "w-3 h-3" }),
                  title: "Italic (*text*)"
                },
                {
                  type: "code",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "w-3 h-3" }),
                  title: "Inline code"
                },
                {
                  type: "h1",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heading1, { className: "w-3.5 h-3.5" }),
                  title: "Heading 1"
                },
                {
                  type: "h2",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heading2, { className: "w-3.5 h-3.5" }),
                  title: "Heading 2"
                },
                {
                  type: "bullet",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "w-3 h-3" }),
                  title: "Bullet list"
                }
              ].map(({ type, icon, title }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onMouseDown: (e) => {
                    e.preventDefault();
                    applyFormat(type);
                  },
                  title,
                  className: "flex items-center justify-center w-6 h-6 rounded transition-all hover:opacity-80",
                  style: {
                    color: "var(--os-text-secondary)",
                    border: "1px solid var(--os-border-subtle)"
                  },
                  children: icon
                },
                type
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-px h-4 mx-1",
                  style: { background: "var(--os-border-subtle)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[9px]",
                  style: { color: "var(--os-text-muted)" },
                  children: "md formatting"
                }
              )
            ]
          }
        ),
        previewMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteLinkPreview,
          {
            content: selectedNote.content,
            onNoteLink: (title) => {
              const found = notes.find(
                (n) => n.title.toLowerCase() === title.toLowerCase()
              );
              if (found) setSelectedId(found.id);
            }
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            ref: textareaRef,
            value: selectedNote.content,
            onChange: (e) => handleContentChange(e.target.value),
            "data-ocid": "notes.editor",
            placeholder: "Start writing... (supports **markdown**)",
            className: "flex-1 p-4 bg-transparent text-sm font-mono outline-none resize-none leading-relaxed",
            style: {
              color: "var(--os-text-primary)",
              caretColor: "rgba(99,102,241,0.8)"
            },
            spellCheck: false
          },
          selectedNote.id
        ),
        !previewMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-4 pb-1 text-[10px]",
            style: { color: "var(--os-text-muted)" },
            children: "Tip: Type [[note title]] to link notes"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center flex-1 gap-4",
          "data-ocid": "notes.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FileText,
              {
                className: "w-14 h-14",
                style: { color: "rgba(99,102,241,0.12)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm font-semibold",
                  style: { color: "var(--os-text-secondary)" },
                  children: "No note selected"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs mt-1",
                  style: { color: "var(--os-text-muted)" },
                  children: "Select a note from the sidebar or create a new one"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowTemplatePicker(true),
                "data-ocid": "notes.add_button",
                className: "flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]",
                style: {
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.35)",
                  color: "rgba(99,102,241,1)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Create your first note"
                ]
              }
            )
          ]
        }
      ),
      selectedNote && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "px-3 py-1 text-[10px] font-mono border-t flex items-center justify-between flex-shrink-0",
          style: { borderColor: "var(--os-border-subtle)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--os-text-muted)" }, children: [
                wordCount,
                " words",
                " · ",
                "~",
                readMinutes,
                " min read"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--os-text-muted)" }, children: [
                selectedNote.content.split("\n").length,
                " lines"
              ] }),
              previewMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "flex items-center gap-1",
                  style: { color: "rgba(99,102,241,0.6)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-2.5 h-2.5" }),
                    " preview"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--os-text-muted)" }, children: [
              "Auto-saved · ",
              selectedNote.content.length,
              " chars"
            ] })
          ]
        }
      )
    ] }),
    showTemplatePicker && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 flex items-center justify-center z-50",
        style: {
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)"
        },
        "data-ocid": "notes.modal",
        onClick: (e) => {
          if (e.target === e.currentTarget) setShowTemplatePicker(false);
        },
        onKeyDown: (e) => {
          if (e.key === "Escape") setShowTemplatePicker(false);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl w-80 overflow-hidden",
            style: {
              background: "var(--os-bg-app)",
              border: "1px solid rgba(99,102,241,0.25)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.05)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between px-4 py-3 border-b",
                  style: {
                    borderColor: "var(--os-border-subtle)",
                    background: "var(--os-bg-elevated)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Plus,
                        {
                          className: "w-3.5 h-3.5",
                          style: { color: "rgba(99,102,241,0.9)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-sm font-semibold",
                          style: { color: "var(--os-text-primary)" },
                          children: "New Note"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowTemplatePicker(false),
                        "data-ocid": "notes.close_button",
                        className: "w-6 h-6 flex items-center justify-center rounded transition-all hover:opacity-70",
                        style: { color: "var(--os-text-muted)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 grid grid-cols-2 gap-2", children: TEMPLATES.map((tmpl) => {
                const Icon = tmpl.icon;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => createFromTemplate(tmpl.content),
                    "data-ocid": `notes.template_${tmpl.id}.button`,
                    className: "flex flex-col items-start gap-2 p-3 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]",
                    style: {
                      background: tmpl.accent,
                      border: `1px solid ${tmpl.border}`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          style: {
                            background: "rgba(0,0,0,0.2)",
                            border: `1px solid ${tmpl.border}`
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4", style: { color: tmpl.color } })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs font-semibold leading-tight",
                            style: { color: tmpl.color },
                            children: tmpl.name
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-[9px] mt-0.5 leading-tight",
                            style: { color: "var(--os-text-muted)" },
                            children: tmpl.description
                          }
                        )
                      ] })
                    ]
                  },
                  tmpl.id
                );
              }) })
            ]
          }
        )
      }
    )
  ] });
}
export {
  Notes
};
