import {
  BookOpen,
  GitBranch,
  Link2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface KBNote {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

function parseLinks(content: string): string[] {
  const matches = content.match(/\[\[([^\]]+)\]\]/g) ?? [];
  return matches.map((m) => m.slice(2, -2).trim());
}

function renderContent(
  content: string,
  notes: KBNote[],
  onNavigate: (title: string) => void,
): React.ReactNode[] {
  const parts = content.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part) => {
    const linkMatch = part.match(/^\[\[([^\]]+)\]\]$/);
    if (linkMatch) {
      const title = linkMatch[1];
      const exists = notes.some(
        (n) => n.title.toLowerCase() === title.toLowerCase(),
      );
      return (
        <button
          key={part}
          type="button"
          onClick={() => onNavigate(title)}
          style={{
            color: exists ? "#27D7E0" : "rgba(248,113,113,0.8)",
            textDecoration: "underline",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            padding: 0,
            font: "inherit",
          }}
          title={exists ? `Open ${title}` : `Create ${title}`}
        >
          {part}
        </button>
      );
    }
    return <span key={part}>{part}</span>;
  });
}

type PanelView = "notes" | "graph";

export function PersonalKnowledgeBase() {
  const { data: savedNotes, set: persistNotes } = useCanisterKV<KBNote[]>(
    "decentos_knowledge_base",
    [],
  );
  const [notes, setNotes] = useState<KBNote[]>([]);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (savedNotes.length > 0) setNotes(savedNotes);
  }, [savedNotes]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>("notes");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  const filteredNotes = useMemo(() => {
    if (!search) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q),
    );
  }, [notes, search]);

  const saveNotes = useCallback(
    (updated: KBNote[]) => {
      setNotes(updated);
      persistNotes(updated);
    },
    [persistNotes],
  );

  const createNote = useCallback(
    (initialTitle = "") => {
      const id = `note-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const now = Date.now();
      const newNote: KBNote = {
        id,
        title: initialTitle || `Note ${notes.length + 1}`,
        content: "",
        createdAt: now,
        updatedAt: now,
      };
      const updated = [newNote, ...notes];
      saveNotes(updated);
      setSelectedId(id);
      setEditTitle(newNote.title);
      setEditContent("");
      setIsDirty(false);
      setTimeout(() => contentRef.current?.focus(), 50);
      toast.success("Note created");
    },
    [notes, saveNotes],
  );

  const selectNote = useCallback(
    (note: KBNote) => {
      if (isDirty && selectedNote) {
        // auto-save on navigate
        const updated = notes.map((n) =>
          n.id === selectedNote.id
            ? {
                ...n,
                title: editTitle,
                content: editContent,
                updatedAt: Date.now(),
              }
            : n,
        );
        saveNotes(updated);
      }
      setSelectedId(note.id);
      setEditTitle(note.title);
      setEditContent(note.content);
      setIsDirty(false);
    },
    [isDirty, selectedNote, notes, editTitle, editContent, saveNotes],
  );

  const saveNote = useCallback(() => {
    if (!selectedNote) return;
    const updated = notes.map((n) =>
      n.id === selectedNote.id
        ? {
            ...n,
            title: editTitle.trim() || selectedNote.title,
            content: editContent,
            updatedAt: Date.now(),
          }
        : n,
    );
    saveNotes(updated);
    setIsDirty(false);
    toast.success("Saved to chain ✓");
  }, [selectedNote, notes, editTitle, editContent, saveNotes]);

  const deleteNote = useCallback(
    (id: string) => {
      const updated = notes.filter((n) => n.id !== id);
      saveNotes(updated);
      if (selectedId === id) {
        setSelectedId(updated[0]?.id ?? null);
        setEditTitle(updated[0]?.title ?? "");
        setEditContent(updated[0]?.content ?? "");
        setIsDirty(false);
      }
      toast.success("Note deleted");
    },
    [notes, selectedId, saveNotes],
  );

  const navigateToTitle = useCallback(
    (title: string) => {
      const existing = notes.find(
        (n) => n.title.toLowerCase() === title.toLowerCase(),
      );
      if (existing) {
        selectNote(existing);
      } else {
        createNote(title);
      }
    },
    [notes, selectNote, createNote],
  );

  // Build graph edges
  const graphData = useMemo(() => {
    const edges: Array<{ from: string; to: string }> = [];
    for (const note of notes) {
      const links = parseLinks(note.content);
      for (const link of links) {
        const target = notes.find(
          (n) => n.title.toLowerCase() === link.toLowerCase(),
        );
        if (target) edges.push({ from: note.id, to: target.id });
      }
    }
    return edges;
  }, [notes]);

  // Simple force-directed layout approximation for graph
  const graphPositions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    const N = notes.length;
    if (N === 0) return pos;
    const W = 340;
    const H = 220;
    notes.forEach((note, i) => {
      const angle = (i / N) * 2 * Math.PI;
      const r = Math.min(W, H) * 0.35;
      pos[note.id] = {
        x: W / 2 + r * Math.cos(angle),
        y: H / 2 + r * Math.sin(angle),
      };
    });
    return pos;
  }, [notes]);

  return (
    <div
      className="flex h-full"
      style={{ background: "rgba(9,13,16,0.9)" }}
      data-ocid="knowledgebase.panel"
    >
      {/* Sidebar */}
      <div
        className="w-52 flex-shrink-0 flex flex-col border-r"
        style={{
          borderColor: "rgba(39,215,224,0.12)",
          background: "rgba(14,22,28,0.7)",
        }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 border-b flex-shrink-0"
          style={{ borderColor: "rgba(39,215,224,0.1)" }}
        >
          <BookOpen
            className="w-3.5 h-3.5"
            style={{ color: "var(--os-accent)" }}
          />
          <span
            className="text-xs font-semibold flex-1"
            style={{ color: "var(--os-accent)" }}
          >
            Knowledge Base
          </span>
          <button
            type="button"
            onClick={() => createNote()}
            data-ocid="knowledgebase.primary_button"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 transition-colors"
            style={{ color: "rgba(39,215,224,0.7)" }}
            title="New note"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-2 py-1.5 flex-shrink-0">
          <div className="relative">
            <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3"
              style={{ color: "rgba(39,215,224,0.4)" }}
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="knowledgebase.search_input"
              className="w-full h-6 pl-6 pr-5 rounded text-[10px] outline-none"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.15)",
                color: "var(--os-text-primary)",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2"
              >
                <X
                  className="w-2.5 h-2.5"
                  style={{ color: "var(--os-text-muted)" }}
                />
              </button>
            )}
          </div>
        </div>

        {/* View tabs */}
        <div
          className="flex mx-2 mb-1.5 rounded overflow-hidden flex-shrink-0"
          style={{ border: "1px solid rgba(39,215,224,0.15)" }}
        >
          {(["notes", "graph"] as PanelView[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setPanelView(v)}
              data-ocid={`knowledgebase.${v}.tab`}
              className="flex-1 text-[9px] py-1 capitalize transition-colors flex items-center justify-center gap-0.5"
              style={{
                background:
                  panelView === v ? "rgba(39,215,224,0.15)" : "transparent",
                color: panelView === v ? "#27D7E0" : "var(--os-text-muted)",
              }}
            >
              {v === "notes" ? (
                <BookOpen className="w-2.5 h-2.5" />
              ) : (
                <GitBranch className="w-2.5 h-2.5" />
              )}
              {v}
            </button>
          ))}
        </div>

        {/* Notes list or graph */}
        <div className="flex-1 overflow-y-auto">
          {panelView === "notes" ? (
            <div className="px-1 space-y-0.5">
              {filteredNotes.length === 0 ? (
                <div
                  className="text-center py-8 text-[10px]"
                  style={{ color: "var(--os-text-muted)" }}
                  data-ocid="knowledgebase.empty_state"
                >
                  {search ? "No results" : "No notes yet"}
                </div>
              ) : (
                filteredNotes.map((note, idx) => (
                  <button
                    type="button"
                    key={note.id}
                    data-ocid={`knowledgebase.item.${idx + 1}`}
                    className="group relative rounded px-2 py-1.5 cursor-pointer transition-all"
                    style={{
                      background:
                        selectedId === note.id
                          ? "rgba(39,215,224,0.1)"
                          : "transparent",
                      border:
                        selectedId === note.id
                          ? "1px solid rgba(39,215,224,0.25)"
                          : "1px solid transparent",
                    }}
                    onClick={() => selectNote(note)}
                    onKeyDown={(e) => e.key === "Enter" && selectNote(note)}
                    tabIndex={0}
                  >
                    <p
                      className="text-[11px] font-medium truncate pr-4"
                      style={{
                        color:
                          selectedId === note.id
                            ? "#27D7E0"
                            : "var(--os-text-secondary)",
                      }}
                    >
                      {note.title}
                    </p>
                    <p
                      className="text-[9px] truncate mt-0.5"
                      style={{ color: "var(--os-text-muted)" }}
                    >
                      {note.content.slice(0, 50) || "Empty note"}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      data-ocid={`knowledgebase.delete_button.${idx + 1}`}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-muted-foreground/60 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </button>
                ))
              )}
            </div>
          ) : (
            /* Graph view */
            <div className="p-2">
              {notes.length === 0 ? (
                <p
                  className="text-[10px] text-center py-8"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  No notes to graph
                </p>
              ) : (
                <svg
                  width="100%"
                  viewBox="0 0 340 220"
                  style={{ overflow: "visible" }}
                  aria-label="Knowledge graph"
                  role="img"
                >
                  <title>Knowledge graph</title>
                  {/* Edges */}
                  {graphData.map((edge) => {
                    const from = graphPositions[edge.from];
                    const to = graphPositions[edge.to];
                    if (!from || !to) return null;
                    return (
                      <line
                        key={`${edge.from}-${edge.to}`}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke="rgba(39,215,224,0.2)"
                        strokeWidth={1}
                      />
                    );
                  })}
                  {/* Nodes */}
                  {notes.map((note) => {
                    const pos = graphPositions[note.id];
                    if (!pos) return null;
                    const isSelected = note.id === selectedId;
                    return (
                      <g
                        key={note.id}
                        onClick={() => selectNote(note)}
                        onKeyDown={(e) => e.key === "Enter" && selectNote(note)}
                        style={{ cursor: "pointer" }}
                      >
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? 8 : 5}
                          fill={isSelected ? "#27D7E0" : "rgba(39,215,224,0.4)"}
                          stroke={isSelected ? "rgba(39,215,224,0.8)" : "none"}
                          strokeWidth={2}
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 16}
                          textAnchor="middle"
                          fontSize={7}
                          fill="var(--os-text-secondary)"
                        >
                          {note.title.slice(0, 12)}
                          {note.title.length > 12 ? "…" : ""}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedNote ? (
          <>
            {/* Editor header */}
            <div
              className="flex items-center gap-2 px-4 py-2 border-b flex-shrink-0"
              style={{
                borderColor: "rgba(39,215,224,0.12)",
                background: "rgba(14,22,28,0.5)",
              }}
            >
              <input
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  setIsDirty(true);
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" && contentRef.current?.focus()
                }
                data-ocid="knowledgebase.input"
                placeholder="Note title"
                className="flex-1 bg-transparent outline-none text-sm font-semibold"
                style={{ color: "var(--os-text-primary)" }}
              />
              <div className="flex items-center gap-1.5">
                {isDirty && (
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(234,179,8,0.15)",
                      color: "rgba(234,179,8,0.8)",
                      border: "1px solid rgba(234,179,8,0.2)",
                    }}
                  >
                    Unsaved
                  </span>
                )}
                <button
                  type="button"
                  onClick={saveNote}
                  data-ocid="knowledgebase.save_button"
                  className="px-3 h-6 rounded text-[10px] font-semibold transition-all"
                  style={{
                    background: "rgba(39,215,224,0.12)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "var(--os-accent)",
                  }}
                >
                  Save
                </button>
              </div>
            </div>

            {/* Backlinks / outgoing links */}
            {parseLinks(editContent).length > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-1.5 flex-shrink-0 overflow-x-auto"
                style={{
                  borderBottom: "1px solid rgba(39,215,224,0.08)",
                  background: "rgba(39,215,224,0.03)",
                }}
              >
                <Link2
                  className="w-3 h-3 flex-shrink-0"
                  style={{ color: "rgba(39,215,224,0.5)" }}
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {parseLinks(editContent).map((link) => {
                    const exists = notes.some(
                      (n) => n.title.toLowerCase() === link.toLowerCase(),
                    );
                    return (
                      <button
                        key={link}
                        type="button"
                        onClick={() => navigateToTitle(link)}
                        className="px-1.5 py-0.5 rounded text-[9px] transition-all"
                        style={{
                          background: exists
                            ? "rgba(39,215,224,0.1)"
                            : "rgba(248,113,113,0.1)",
                          border: exists
                            ? "1px solid rgba(39,215,224,0.25)"
                            : "1px solid rgba(248,113,113,0.25)",
                          color: exists ? "#27D7E0" : "rgba(248,113,113,0.8)",
                        }}
                      >
                        {link}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Editor textarea and rendered preview */}
            <div className="flex-1 flex overflow-hidden">
              {/* Raw editor */}
              <textarea
                ref={contentRef}
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  setIsDirty(true);
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                    e.preventDefault();
                    saveNote();
                  }
                }}
                data-ocid="knowledgebase.editor"
                placeholder={
                  "Write your note here...\n\nTip: Use [[Note Title]] to link to other notes.\nLinks in cyan = note exists, red = not yet created."
                }
                className="flex-1 p-4 bg-transparent outline-none resize-none text-xs font-mono leading-relaxed"
                style={{
                  color: "var(--os-text-secondary)",
                  borderRight: "1px solid rgba(39,215,224,0.08)",
                }}
              />
              {/* Rendered preview */}
              <div
                className="flex-1 p-4 overflow-y-auto text-xs leading-relaxed"
                style={{ color: "var(--os-text-primary)" }}
              >
                <div
                  className="text-[9px] mb-2"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  PREVIEW
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {renderContent(editContent, notes, navigateToTitle)}
                </div>
              </div>
            </div>

            {/* Footer: note metadata */}
            <div
              className="px-4 py-1.5 flex items-center gap-4 flex-shrink-0 border-t"
              style={{
                borderColor: "rgba(39,215,224,0.08)",
                background: "rgba(14,22,28,0.5)",
              }}
            >
              <span
                className="text-[9px]"
                style={{ color: "var(--os-text-muted)" }}
              >
                Created {new Date(selectedNote.createdAt).toLocaleDateString()}
              </span>
              <span
                className="text-[9px]"
                style={{ color: "var(--os-text-muted)" }}
              >
                Updated {new Date(selectedNote.updatedAt).toLocaleDateString()}
              </span>
              <span
                className="text-[9px] ml-auto"
                style={{ color: "var(--os-text-muted)" }}
              >
                Ctrl+S to save
              </span>
            </div>
          </>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4"
            data-ocid="knowledgebase.empty_state"
          >
            <BookOpen
              className="w-12 h-12"
              style={{ color: "rgba(39,215,224,0.15)" }}
            />
            <div className="text-center">
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "var(--os-text-secondary)" }}
              >
                No note selected
              </p>
              <p className="text-xs" style={{ color: "var(--os-text-muted)" }}>
                Create a note or select one from the sidebar
              </p>
            </div>
            <button
              type="button"
              onClick={() => createNote()}
              data-ocid="knowledgebase.open_modal_button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "rgba(39,215,224,0.1)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "var(--os-accent)",
              }}
            >
              <Plus className="w-4 h-4" />
              Create First Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
