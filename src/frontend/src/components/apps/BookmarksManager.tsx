import {
  Bookmark,
  Edit2,
  ExternalLink,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

const SAMPLE_BOOKMARKS: BookmarkItem[] = [
  {
    id: 1,
    title: "Internet Computer Protocol",
    url: "https://internetcomputer.org",
    description:
      "The official ICP documentation and developer resources for building on the blockchain.",
    tags: ["blockchain", "reference", "icp"],
  },
  {
    id: 2,
    title: "Motoko Language Guide",
    url: "https://internetcomputer.org/docs/current/motoko/main/motoko",
    description:
      "Complete language guide for Motoko, the native smart contract language for ICP.",
    tags: ["reference", "motoko", "icp"],
  },
  {
    id: 3,
    title: "DFINITY Foundation",
    url: "https://dfinity.org",
    description:
      "Research and engineering organization behind the Internet Computer.",
    tags: ["blockchain", "reading"],
  },
  {
    id: 4,
    title: "Vite Build Tool",
    url: "https://vitejs.dev",
    description:
      "Next generation frontend tooling with instant HMR and blazing fast builds.",
    tags: ["tools", "reference"],
  },
];

const ACCENT = "rgba(99,102,241,";

interface FormState {
  url: string;
  title: string;
  description: string;
  tags: string;
}

const EMPTY_FORM: FormState = { url: "", title: "", description: "", tags: "" };

export function BookmarksManager() {
  const {
    data: bookmarks,
    set: setBookmarksKV,
    loading,
  } = useCanisterKV<BookmarkItem[]>("decentos_bookmarks", SAMPLE_BOOKMARKS);
  const [selected, setSelected] = useState<BookmarkItem | null>(
    SAMPLE_BOOKMARKS[0],
  );
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)));

  const filtered = bookmarks.filter((b) => {
    const matchTag = activeTag === "All" || b.tags.includes(activeTag);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q);
    return matchTag && matchSearch;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (b: BookmarkItem) => {
    setEditingId(b.id);
    setForm({
      url: b.url,
      title: b.title,
      description: b.description,
      tags: b.tags.join(", "),
    });
    setShowForm(true);
  };

  const handleSave = () => {
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!form.url || !form.title) return;
    if (editingId !== null) {
      const updated = bookmarks.map((b) =>
        b.id === editingId ? { ...b, ...form, tags } : b,
      );
      setBookmarksKV(updated);
      if (selected?.id === editingId) {
        setSelected((prev) => (prev ? { ...prev, ...form, tags } : prev));
      }
    } else {
      const nb: BookmarkItem = {
        id: Date.now(),
        title: form.title,
        url: form.url,
        description: form.description,
        tags,
      };
      setBookmarksKV([...bookmarks, nb]);
      setSelected(nb);
    }
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setBookmarksKV(bookmarks.filter((b) => b.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  if (loading)
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{ background: "rgba(11,15,18,0.6)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );

  return (
    <div
      className="flex h-full relative"
      style={{
        background: "rgba(11,15,18,0.6)",
        color: "rgba(220,235,240,0.9)",
      }}
    >
      {/* Sidebar */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{
          width: 240,
          background: "rgba(10,16,20,0.7)",
          borderRight: "1px solid rgba(42,58,66,0.8)",
        }}
      >
        {/* Search */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="bookmarks.search_input"
            style={{
              width: "100%",
              background: "var(--os-border-subtle)",
              border: "1px solid rgba(42,58,66,0.8)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 12,
              color: "rgba(220,235,240,0.9)",
              outline: "none",
            }}
          />
        </div>

        {/* Tag filters */}
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {["All", ...allTags].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              data-ocid="bookmarks.tab"
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 99,
                border: "1px solid",
                borderColor:
                  activeTag === tag ? `${ACCENT}0.7)` : "rgba(42,58,66,0.8)",
                background:
                  activeTag === tag ? `${ACCENT}0.15)` : "transparent",
                color:
                  activeTag === tag ? `${ACCENT}1)` : "rgba(180,200,210,0.5)",
                cursor: "pointer",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Bookmark list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div
              data-ocid="bookmarks.empty_state"
              className="flex flex-col items-center justify-center h-32 gap-2"
              style={{ color: "rgba(180,200,210,0.3)" }}
            >
              <Bookmark className="w-6 h-6" />
              <p style={{ fontSize: 11 }}>No bookmarks</p>
            </div>
          )}
          {filtered.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelected(b)}
              className="w-full text-left px-3 py-2.5 transition-colors"
              style={{
                background:
                  selected?.id === b.id ? `${ACCENT}0.1)` : "transparent",
                borderLeft: `2px solid ${selected?.id === b.id ? `${ACCENT}0.8)` : "transparent"}`,
              }}
            >
              <div
                className="font-medium truncate"
                style={{ fontSize: 12, color: "rgba(220,235,240,0.9)" }}
              >
                {b.title}
              </div>
              <div
                className="truncate"
                style={{ fontSize: 10, color: "rgba(180,200,210,0.4)" }}
              >
                {b.url}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {b.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 9,
                      padding: "1px 5px",
                      borderRadius: 99,
                      background: `${ACCENT}0.12)`,
                      color: `${ACCENT}0.8)`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Status bar */}
        <div
          style={{
            padding: "8px 12px",
            borderTop: "1px solid rgba(42,58,66,0.6)",
            fontSize: 10,
            color: "rgba(180,200,210,0.4)",
          }}
        >
          {filtered.length} / {bookmarks.length} bookmarks
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid rgba(42,58,66,0.8)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={openAdd}
            data-ocid="bookmarks.primary_button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              padding: "5px 12px",
              background: `${ACCENT}0.15)`,
              border: `1px solid ${ACCENT}0.5)`,
              borderRadius: 6,
              color: `${ACCENT}1)`,
              cursor: "pointer",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Bookmark
          </button>
        </div>

        {/* Content */}
        {selected ? (
          <div style={{ padding: 20, flex: 1, overflowY: "auto" }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "rgba(220,235,240,0.95)",
                    marginBottom: 4,
                  }}
                >
                  {selected.title}
                </h2>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 12,
                    color: `${ACCENT}0.9)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    textDecoration: "none",
                    wordBreak: "break-all",
                  }}
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  {selected.url}
                </a>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(selected)}
                  data-ocid="bookmarks.edit_button"
                  style={{
                    padding: "5px 8px",
                    borderRadius: 6,
                    border: "1px solid rgba(42,58,66,0.8)",
                    background: "var(--os-border-subtle)",
                    color: "rgba(180,200,210,0.7)",
                    cursor: "pointer",
                  }}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(selected.id)}
                  data-ocid="bookmarks.delete_button"
                  style={{
                    padding: "5px 8px",
                    borderRadius: 6,
                    border: "1px solid rgba(220,50,50,0.2)",
                    background: "rgba(220,50,50,0.06)",
                    color: "rgba(220,80,80,0.8)",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {selected.description && (
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(180,200,210,0.7)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {selected.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5" style={{ color: `${ACCENT}0.6)` }} />
              {selected.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 99,
                    border: `1px solid ${ACCENT}0.3)`,
                    background: `${ACCENT}0.1)`,
                    color: `${ACCENT}0.9)`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div
            data-ocid="bookmarks.empty_state"
            className="flex-1 flex flex-col items-center justify-center gap-3"
            style={{ color: "rgba(180,200,210,0.3)" }}
          >
            <Bookmark className="w-12 h-12" />
            <p style={{ fontSize: 14 }}>
              Select a bookmark or add your first one
            </p>
            <button
              type="button"
              onClick={openAdd}
              style={{
                fontSize: 12,
                padding: "6px 16px",
                borderRadius: 6,
                background: `${ACCENT}0.12)`,
                border: `1px solid ${ACCENT}0.4)`,
                color: `${ACCENT}1)`,
                cursor: "pointer",
              }}
            >
              Add your first bookmark
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit form overlay */}
      {showForm && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          data-ocid="bookmarks.modal"
        >
          <div
            style={{
              background: "rgba(14,20,26,0.98)",
              border: `1px solid ${ACCENT}0.3)`,
              borderRadius: 12,
              padding: 24,
              width: 360,
              boxShadow: `0 0 40px ${ACCENT}0.1)`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700 }}>
                {editingId ? "Edit Bookmark" : "Add Bookmark"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                data-ocid="bookmarks.close_button"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(180,200,210,0.5)",
                  cursor: "pointer",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(["url", "title", "description", "tags"] as const).map((field) => (
              <div key={field} style={{ marginBottom: 12 }}>
                <label
                  htmlFor={`bm-field-${field}`}
                  style={{
                    fontSize: 11,
                    color: "rgba(180,200,210,0.5)",
                    display: "block",
                    marginBottom: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {field === "tags" ? "Tags (comma-separated)" : field}
                </label>
                <input
                  id={`bm-field-${field}`}
                  type="text"
                  value={form[field]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field]: e.target.value }))
                  }
                  data-ocid="bookmarks.input"
                  style={{
                    width: "100%",
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(42,58,66,0.8)",
                    borderRadius: 6,
                    padding: "7px 10px",
                    fontSize: 12,
                    color: "rgba(220,235,240,0.9)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                type="button"
                onClick={handleSave}
                data-ocid="bookmarks.save_button"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 6,
                  background: `${ACCENT}0.15)`,
                  border: `1px solid ${ACCENT}0.5)`,
                  color: `${ACCENT}1)`,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {editingId ? "Save Changes" : "Add Bookmark"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                data-ocid="bookmarks.cancel_button"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 6,
                  border: "1px solid rgba(42,58,66,0.6)",
                  background: "transparent",
                  color: "rgba(180,200,210,0.6)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
