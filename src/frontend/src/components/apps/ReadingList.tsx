import { BookmarkPlus, Copy, ExternalLink, Tag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgb(39,215,224)";

interface ReadingItem {
  id: string;
  url: string;
  title: string;
  notes: string;
  tags: string[];
  savedAt: number;
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function ReadingList() {
  const { data: items, set: setItemsKV } = useCanisterKV<ReadingItem[]>(
    "decentos_readinglist",
    [],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  const selectedItem = items.find((i) => i.id === selected) ?? null;

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.url.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q);
    const matchTag = !tagFilter || item.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });

  function addItem() {
    if (!url.trim()) return;
    const newItem: ReadingItem = {
      id: Date.now().toString(),
      url: url.trim(),
      title: title.trim() || getDomain(url.trim()),
      notes: notes.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      savedAt: Date.now(),
    };
    setItemsKV([newItem, ...items]);
    setSelected(newItem.id);
    setUrl("");
    setTitle("");
    setNotes("");
    setTags("");
  }

  function deleteItem(id: string) {
    setItemsKV(items.filter((i) => i.id !== id));
    if (selected === id) setSelected(null);
  }

  function exportMarkdown() {
    const md = items
      .map((i) => `- [${i.title}](${i.url})${i.notes ? ` — ${i.notes}` : ""}`)
      .join("\n");
    navigator.clipboard.writeText(md).catch(() => {});
  }

  const allTags = Array.from(new Set(items.flatMap((i) => i.tags)));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: BG,
        color: "#e2e8f0",
        fontSize: 13,
      }}
    >
      {/* Add form */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: `1px solid ${BORDER}`,
          background: "var(--os-bg-elevated)",
        }}
      >
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (!title) setTitle(getDomain(e.target.value));
            }}
            placeholder="https://..."
            data-ocid="readinglist.input"
            style={{
              flex: 2,
              background: "var(--os-border-subtle)",
              border: `1px solid ${BORDER}`,
              borderRadius: 5,
              padding: "4px 8px",
              color: "#e2e8f0",
              fontSize: 12,
              outline: "none",
            }}
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (auto)"
            style={{
              flex: 1,
              background: "var(--os-border-subtle)",
              border: `1px solid ${BORDER}`,
              borderRadius: 5,
              padding: "4px 8px",
              color: "#e2e8f0",
              fontSize: 12,
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={addItem}
            data-ocid="readinglist.primary_button"
            style={{
              background: CYAN,
              color: "#000",
              border: "none",
              borderRadius: 5,
              padding: "4px 12px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <BookmarkPlus style={{ width: 14, height: 14 }} /> Save
          </button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={1}
            style={{
              flex: 2,
              background: "var(--os-border-subtle)",
              border: `1px solid ${BORDER}`,
              borderRadius: 5,
              padding: "4px 8px",
              color: "#e2e8f0",
              fontSize: 12,
              outline: "none",
              resize: "none",
            }}
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            style={{
              flex: 1,
              background: "var(--os-border-subtle)",
              border: `1px solid ${BORDER}`,
              borderRadius: 5,
              padding: "4px 8px",
              color: "#e2e8f0",
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 240,
            borderRight: `1px solid ${BORDER}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px 10px",
              borderBottom: `1px solid ${BORDER}`,
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              data-ocid="readinglist.search_input"
              style={{
                flex: 1,
                minWidth: 80,
                background: "var(--os-border-subtle)",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                padding: "3px 7px",
                color: "#e2e8f0",
                fontSize: 11,
                outline: "none",
              }}
            />
            {tagFilter && (
              <button
                type="button"
                onClick={() => setTagFilter(null)}
                style={{
                  background: "rgba(39,215,224,0.15)",
                  border: `1px solid ${CYAN}`,
                  borderRadius: 3,
                  padding: "1px 6px",
                  fontSize: 10,
                  color: CYAN,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Tag style={{ width: 9, height: 9 }} />
                {tagFilter}
                <X style={{ width: 9, height: 9 }} />
              </button>
            )}
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 && (
              <div
                data-ocid="readinglist.empty_state"
                style={{
                  padding: 16,
                  color: "var(--os-text-muted)",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                No items yet
              </div>
            )}
            {filtered.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item.id)}
                data-ocid={`readinglist.item.${i + 1}`}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(42,58,66,0.4)",
                  background:
                    selected === item.id
                      ? "rgba(39,215,224,0.08)"
                      : "transparent",
                  borderLeft:
                    selected === item.id
                      ? `2px solid ${CYAN}`
                      : "2px solid transparent",
                  border: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 12,
                    color: selected === item.id ? CYAN : "#e2e8f0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--os-text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {getDomain(item.url)}
                </div>
                {item.tags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 3,
                      marginTop: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "rgba(39,215,224,0.1)",
                          border: "1px solid rgba(39,215,224,0.2)",
                          borderRadius: 2,
                          padding: "0 4px",
                          fontSize: 9,
                          color: CYAN,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
          {allTags.length > 0 && (
            <div
              style={{
                padding: "6px 10px",
                borderTop: `1px solid ${BORDER}`,
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  style={{
                    background:
                      tagFilter === tag
                        ? "rgba(39,215,224,0.2)"
                        : "rgba(39,215,224,0.07)",
                    border: "1px solid rgba(39,215,224,0.2)",
                    borderRadius: 3,
                    padding: "1px 5px",
                    fontSize: 10,
                    color: CYAN,
                    cursor: "pointer",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {selectedItem ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: CYAN,
                    flex: 1,
                    marginRight: 8,
                  }}
                >
                  {selectedItem.title}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={exportMarkdown}
                    data-ocid="readinglist.secondary_button"
                    title="Export all as Markdown"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 4,
                      padding: "4px 8px",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                    }}
                  >
                    <Copy style={{ width: 12, height: 12 }} /> Export
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(selectedItem.id)}
                    data-ocid="readinglist.delete_button"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      borderRadius: 4,
                      padding: "4px 8px",
                      cursor: "pointer",
                      color: "#f87171",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                    }}
                  >
                    <Trash2 style={{ width: 12, height: 12 }} /> Delete
                  </button>
                </div>
              </div>
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: CYAN,
                  fontSize: 12,
                  marginBottom: 12,
                  textDecoration: "none",
                  wordBreak: "break-all",
                }}
              >
                <ExternalLink
                  style={{ width: 12, height: 12, flexShrink: 0 }}
                />
                {selectedItem.url}
              </a>
              {selectedItem.notes && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--os-text-secondary)",
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Notes
                  </div>
                  <div
                    style={{
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                      padding: "8px 10px",
                      fontSize: 12,
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedItem.notes}
                  </div>
                </div>
              )}
              {selectedItem.tags.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--os-text-secondary)",
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Tags
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {selectedItem.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "rgba(39,215,224,0.1)",
                          border: "1px solid rgba(39,215,224,0.25)",
                          borderRadius: 4,
                          padding: "2px 8px",
                          fontSize: 11,
                          color: CYAN,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ fontSize: 10, color: "var(--os-text-muted)" }}>
                Saved {new Date(selectedItem.savedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--os-text-muted)",
                gap: 8,
              }}
            >
              <BookmarkPlus style={{ width: 36, height: 36, opacity: 0.3 }} />
              <div style={{ fontSize: 12 }}>
                Select an item or save a new URL
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
