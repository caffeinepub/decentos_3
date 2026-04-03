import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Clipboard,
  Loader2,
  Pin,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const ACCENT = "rgba(39,215,224,";
const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";
const CARD_BG = "rgba(16,24,30,0.8)";

type Category = "Text" | "Code" | "URL" | "Other";

interface ClipboardEntry {
  id: string;
  content: string;
  category: Category;
  pinned: boolean;
  createdAt: number;
}

const CATEGORY_COLORS: Record<Category, string> = {
  Text: "rgba(59,130,246,",
  Code: "rgba(250,204,21,",
  URL: "rgba(34,197,94,",
  Other: "rgba(148,163,184,",
};

function timeSince(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function SmartClipboard({
  windowProps: _windowProps,
}: { windowProps?: Record<string, unknown> }) {
  const {
    data: entries,
    set: setEntries,
    loading,
  } = useCanisterKV<ClipboardEntry[]>("decentos_smart_clipboard", []);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Text");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = q
      ? entries.filter((e) => e.content.toLowerCase().includes(q))
      : entries;
    return [...list.filter((e) => e.pinned), ...list.filter((e) => !e.pinned)];
  }, [entries, search]);

  const addEntry = () => {
    if (!newContent.trim()) return;
    const entry: ClipboardEntry = {
      id: Date.now().toString(),
      content: newContent.trim(),
      category: newCategory,
      pinned: false,
      createdAt: Date.now(),
    };
    setEntries([entry, ...entries]);
    setNewContent("");
    setShowAdd(false);
    toast.success("Entry saved");
  };

  const togglePin = (id: string) => {
    setEntries(
      entries.map((e) => (e.id === id ? { ...e, pinned: !e.pinned } : e)),
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => toast.success("Copied!"))
      .catch(() => toast.error("Copy failed"));
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ background: BG }}
      >
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: `${ACCENT}0.7)` }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: BG, color: TEXT }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{
          borderBottom: `1px solid ${BORDER}`,
          background: "rgba(10,16,20,0.6)",
        }}
      >
        <Clipboard
          className="w-4 h-4 flex-shrink-0"
          style={{ color: `${ACCENT}0.7)` }}
        />
        <span className="text-sm font-semibold" style={{ color: TEXT }}>
          Smart Clipboard
        </span>
        <span className="text-xs ml-1" style={{ color: MUTED }}>
          {entries.length} entries
        </span>
        <div className="flex-1" />
        <Button
          type="button"
          data-ocid="smartclipboard.primary_button"
          onClick={() => setShowAdd((v) => !v)}
          style={{
            height: 28,
            fontSize: 11,
            background: `${ACCENT}0.12)`,
            border: `1px solid ${ACCENT}0.3)`,
            color: `${ACCENT}1)`,
            padding: "0 10px",
          }}
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>

      {/* Add panel */}
      {showAdd && (
        <div
          className="flex-shrink-0 p-4"
          style={{
            background: "rgba(14,22,28,0.8)",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <Textarea
            data-ocid="smartclipboard.textarea"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Paste or type your content here..."
            rows={4}
            style={{
              background: "rgba(20,30,36,0.8)",
              border: `1px solid ${BORDER}`,
              color: TEXT,
              fontSize: 12,
              resize: "vertical",
              marginBottom: 10,
            }}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: MUTED }}>
              Category:
            </span>
            <div className="flex gap-1">
              {(["Text", "Code", "URL", "Other"] as Category[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  data-ocid="smartclipboard.toggle"
                  onClick={() => setNewCategory(cat)}
                  className="px-2 py-0.5 rounded text-[11px] transition-all"
                  style={{
                    background:
                      newCategory === cat
                        ? `${CATEGORY_COLORS[cat]}0.2)`
                        : "var(--os-border-subtle)",
                    border: `1px solid ${newCategory === cat ? `${CATEGORY_COLORS[cat]}0.5)` : BORDER}`,
                    color:
                      newCategory === cat ? `${CATEGORY_COLORS[cat]}1)` : MUTED,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <Button
              type="button"
              data-ocid="smartclipboard.submit_button"
              onClick={addEntry}
              style={{
                height: 28,
                fontSize: 11,
                background: `${ACCENT}0.8)`,
                border: "none",
                color: "#000",
                fontWeight: 700,
              }}
            >
              Save
            </Button>
            <Button
              type="button"
              data-ocid="smartclipboard.cancel_button"
              onClick={() => setShowAdd(false)}
              variant="outline"
              style={{
                height: 28,
                fontSize: 11,
                borderColor: BORDER,
                color: MUTED,
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div
        className="px-4 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(42,58,66,0.4)" }}
      >
        <div className="relative">
          <Search
            className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: MUTED }}
          />
          <Input
            data-ocid="smartclipboard.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            style={{
              background: "var(--os-bg-elevated)",
              border: `1px solid ${BORDER}`,
              color: TEXT,
              fontSize: 12,
              height: 30,
              paddingLeft: 28,
            }}
          />
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-32 gap-2"
            data-ocid="smartclipboard.empty_state"
            style={{ color: MUTED }}
          >
            <Clipboard className="w-8 h-8 opacity-20" />
            <span className="text-xs">
              {search ? "No matches" : "No entries yet — add one above"}
            </span>
          </div>
        ) : (
          <div className="p-3 flex flex-col gap-2">
            {filtered.map((entry, i) => (
              <div
                key={entry.id}
                data-ocid={`smartclipboard.item.${i + 1}`}
                className="group rounded-lg p-3"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${entry.pinned ? `${ACCENT}0.3)` : BORDER}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    style={{
                      fontSize: 10,
                      padding: "1px 6px",
                      background: `${CATEGORY_COLORS[entry.category]}0.12)`,
                      color: `${CATEGORY_COLORS[entry.category]}1)`,
                      border: `1px solid ${CATEGORY_COLORS[entry.category]}0.3)`,
                    }}
                  >
                    {entry.category}
                  </Badge>
                  {entry.pinned && (
                    <Star
                      className="w-3 h-3"
                      style={{ color: "rgba(250,204,21,0.8)" }}
                    />
                  )}
                  <span
                    className="text-[10px] ml-auto"
                    style={{ color: MUTED }}
                  >
                    {timeSince(entry.createdAt)}
                  </span>
                </div>
                <pre
                  className="text-xs mb-2 whitespace-pre-wrap break-all"
                  style={{
                    color: TEXT,
                    fontFamily:
                      entry.category === "Code" ? "monospace" : "inherit",
                    maxHeight: 100,
                    overflow: "hidden",
                  }}
                >
                  {entry.content}
                </pre>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(entry.content)}
                    className="px-2 py-0.5 rounded text-[11px] transition-all"
                    style={{
                      background: `${ACCENT}0.1)`,
                      border: `1px solid ${ACCENT}0.25)`,
                      color: `${ACCENT}0.8)`,
                    }}
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePin(entry.id)}
                    data-ocid={`smartclipboard.toggle.${i + 1}`}
                    className="p-1 rounded transition-all"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                    }}
                    title={entry.pinned ? "Unpin" : "Pin"}
                  >
                    <Pin
                      className="w-3 h-3"
                      style={{
                        color: entry.pinned ? "rgba(250,204,21,0.8)" : MUTED,
                      }}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEntry(entry.id)}
                    data-ocid={`smartclipboard.delete_button.${i + 1}`}
                    className="p-1 rounded transition-all ml-auto"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                    }}
                    title="Delete"
                  >
                    <Trash2
                      className="w-3 h-3"
                      style={{ color: "rgba(248,113,113,0.6)" }}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
