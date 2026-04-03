import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface StickyNote {
  id: string;
  title: string;
  body: string;
  color: string;
  createdAt: string;
}

const NOTE_COLORS = [
  {
    name: "Yellow",
    bg: "rgba(234,179,8,0.18)",
    border: "rgba(234,179,8,0.35)",
    text: "rgba(253,224,71,0.9)",
  },
  {
    name: "Cyan",
    bg: "rgba(39,215,224,0.12)",
    border: "rgba(39,215,224,0.35)",
    text: "rgba(39,215,224,0.9)",
  },
  {
    name: "Pink",
    bg: "rgba(236,72,153,0.15)",
    border: "rgba(236,72,153,0.35)",
    text: "rgba(249,168,212,0.9)",
  },
  {
    name: "Green",
    bg: "rgba(34,197,94,0.13)",
    border: "rgba(34,197,94,0.35)",
    text: "rgba(74,222,128,0.9)",
  },
  {
    name: "Orange",
    bg: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.35)",
    text: "rgba(253,186,116,0.9)",
  },
  {
    name: "Purple",
    bg: "rgba(168,85,247,0.15)",
    border: "rgba(168,85,247,0.35)",
    text: "rgba(216,180,254,0.9)",
  },
];

const DEFAULT_NOTES: StickyNote[] = [
  {
    id: "sn1",
    title: "ICP Ideas",
    body: "Explore inter-canister communication for real-time features\n\nLook into cycles management best practices",
    color: "Cyan",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sn2",
    title: "Today's Focus",
    body: "Ship the new app components\nReview PR feedback\nWrite docs",
    color: "Yellow",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sn3",
    title: "Read Later",
    body: "ICP developer docs on certified queries\nMotoko base library reference",
    color: "Purple",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sn4",
    title: "App Ideas",
    body: "Voice memo recorder (on-chain)\nDecentralized bookmark sync\nP2P file sharing via ICP",
    color: "Green",
    createdAt: new Date().toISOString(),
  },
];

export function StickyNotes() {
  const { data: notes, set: setNotes } = useCanisterKV<StickyNote[]>(
    "decentos_sticky_notes",
    DEFAULT_NOTES,
  );
  const [expandedNote, setExpandedNote] = useState<StickyNote | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editColor, setEditColor] = useState("Yellow");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newColor, setNewColor] = useState("Yellow");

  const openNote = (note: StickyNote) => {
    setExpandedNote(note);
    setEditTitle(note.title);
    setEditBody(note.body);
    setEditColor(note.color);
  };

  const saveExpanded = () => {
    if (!expandedNote) return;
    setNotes(
      notes.map((n) =>
        n.id === expandedNote.id
          ? { ...n, title: editTitle, body: editBody, color: editColor }
          : n,
      ),
    );

    setExpandedNote(null);
  };

  const deleteNote = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes(notes.filter((n) => n.id !== id));
    if (expandedNote?.id === id) setExpandedNote(null);
  };

  const addNote = () => {
    if (!newTitle.trim() && !newBody.trim()) return;
    setNotes([
      ...notes,
      {
        id: `sn${Date.now()}`,
        title: newTitle || "New Note",
        body: newBody,
        color: newColor,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewTitle("");
    setNewBody("");
    setNewColor("Yellow");
    setShowAdd(false);
  };

  const getColorStyle = (colorName: string) =>
    NOTE_COLORS.find((c) => c.name === colorName) ?? NOTE_COLORS[0];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--os-bg-app)" }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: "var(--os-text-primary)" }}
        >
          Sticky Notes
        </span>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          data-ocid="stickynotes.add.button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(39,215,224,0.1)",
            border: "1px solid rgba(39,215,224,0.25)",
            color: "rgba(39,215,224,0.9)",
          }}
        >
          <Plus className="w-3.5 h-3.5" /> New Note
        </button>
      </div>

      {/* Notes grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {notes.map((note, i) => {
            const cs = getColorStyle(note.color);
            return (
              <button
                type="button"
                key={note.id}
                onClick={() => openNote(note)}
                data-ocid={`stickynotes.item.${i + 1}`}
                className="relative flex flex-col gap-2 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] text-left w-full"
                style={{
                  background: cs.bg,
                  border: `1px solid ${cs.border}`,
                  minHeight: 120,
                }}
              >
                <button
                  type="button"
                  onClick={(e) => deleteNote(note.id, e)}
                  data-ocid={`stickynotes.delete_button.${i + 1}`}
                  className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    color: "var(--os-text-secondary)",
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
                {note.title && (
                  <h3
                    className="text-xs font-bold pr-5 truncate"
                    style={{ color: cs.text }}
                  >
                    {note.title}
                  </h3>
                )}
                <p
                  className="text-xs leading-relaxed line-clamp-5"
                  style={{ color: "var(--os-text-primary)" }}
                >
                  {note.body}
                </p>
              </button>
            );
          })}

          {/* Quick add tile */}
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            data-ocid="stickynotes.new_tile.button"
            className="flex flex-col items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px dashed var(--os-text-muted)",
              minHeight: 120,
            }}
          >
            <Plus
              className="w-6 h-6"
              style={{ color: "var(--os-text-muted)" }}
            />
            <span className="text-xs" style={{ color: "var(--os-text-muted)" }}>
              New note
            </span>
          </button>
        </div>

        {notes.length === 0 && (
          <div
            className="text-center py-12"
            data-ocid="stickynotes.empty_state"
          >
            <p className="text-sm" style={{ color: "var(--os-text-muted)" }}>
              No notes yet. Create one!
            </p>
          </div>
        )}
      </div>

      {/* Expand/edit modal */}
      <Dialog
        open={!!expandedNote}
        onOpenChange={(o) => {
          if (!o) saveExpanded();
        }}
      >
        <DialogContent
          className="max-w-md"
          style={{
            background: expandedNote
              ? getColorStyle(expandedNote.color).bg
              : "rgba(10,18,24,0.97)",
            border: `1px solid ${expandedNote ? getColorStyle(expandedNote.color).border : "var(--os-text-muted)"}`,
            backdropFilter: "blur(20px)",
          }}
          data-ocid="stickynotes.edit.dialog"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Note title..."
                data-ocid="stickynotes.title.input"
                className="flex-1 bg-transparent border-0 border-b rounded-none text-base font-bold px-0 focus-visible:ring-0"
                style={{
                  borderColor: expandedNote
                    ? getColorStyle(expandedNote.color).border
                    : "var(--os-text-muted)",
                  color: expandedNote
                    ? getColorStyle(expandedNote.color).text
                    : "var(--os-text-primary)",
                }}
              />
              <button
                type="button"
                onClick={() => expandedNote && deleteNote(expandedNote.id)}
                data-ocid="stickynotes.modal.delete_button"
                className="text-muted-foreground hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              data-ocid="stickynotes.body.textarea"
              placeholder="Write your note..."
              rows={8}
              className="bg-transparent border-0 resize-none focus-visible:ring-0 text-sm p-0"
              style={{ color: "var(--os-text-secondary)" }}
            />
            <div className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{ color: "var(--os-text-secondary)" }}
              >
                Color:
              </span>
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setEditColor(c.name)}
                  data-ocid="stickynotes.color.toggle"
                  className="w-5 h-5 rounded-full transition-transform"
                  style={{
                    background: c.bg,
                    border: `2px solid ${editColor === c.name ? c.text : c.border}`,
                    transform: editColor === c.name ? "scale(1.3)" : "scale(1)",
                  }}
                  title={c.name}
                />
              ))}
              <button
                type="button"
                onClick={saveExpanded}
                data-ocid="stickynotes.save.button"
                className="ml-auto text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: "rgba(39,215,224,0.15)",
                  color: "rgba(39,215,224,0.9)",
                  border: "1px solid rgba(39,215,224,0.3)",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add note modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent
          className="max-w-sm"
          style={{
            background: "rgba(10,18,24,0.97)",
            border: "1px solid rgba(39,215,224,0.2)",
          }}
          data-ocid="stickynotes.add.dialog"
        >
          <div className="flex flex-col gap-3">
            <h3
              className="text-base font-semibold"
              style={{ color: "rgba(39,215,224,0.9)" }}
            >
              New Sticky Note
            </h3>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title (optional)"
              data-ocid="stickynotes.new_title.input"
            />
            <Textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              data-ocid="stickynotes.new_body.textarea"
            />
            <div className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{ color: "var(--os-text-secondary)" }}
              >
                Color:
              </span>
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setNewColor(c.name)}
                  className="w-5 h-5 rounded-full transition-transform"
                  style={{
                    background: c.bg,
                    border: `2px solid ${newColor === c.name ? c.text : c.border}`,
                    transform: newColor === c.name ? "scale(1.3)" : "scale(1)",
                  }}
                  title={c.name}
                />
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                data-ocid="stickynotes.add.cancel_button"
                className="text-xs px-3 py-1.5 rounded text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addNote}
                data-ocid="stickynotes.add.confirm_button"
                className="text-xs px-4 py-1.5 rounded-lg"
                style={{
                  background: "rgba(39,215,224,0.15)",
                  color: "rgba(39,215,224,0.9)",
                  border: "1px solid rgba(39,215,224,0.3)",
                }}
              >
                Add Note
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
