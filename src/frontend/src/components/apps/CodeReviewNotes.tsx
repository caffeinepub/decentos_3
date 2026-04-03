import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Code2, Loader2, Plus, Search, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const ACCENT = "rgba(39,215,224,";
const BG = "rgba(11,15,18,0.6)";
const SIDEBAR_BG = "rgba(10,16,20,0.7)";
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";

type Language = "JS" | "TS" | "Python" | "Go" | "Rust" | "Mo" | "Other";

interface ReviewNote {
  id: string;
  title: string;
  code: string;
  language: Language;
  notes: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  createdAt: number;
}

const LANG_COLORS: Record<Language, string> = {
  JS: "rgba(250,204,21,0.8)",
  TS: "rgba(59,130,246,0.8)",
  Python: "rgba(34,197,94,0.8)",
  Go: "rgba(96,165,250,0.8)",
  Rust: "rgba(251,146,60,0.8)",
  Mo: "rgba(39,215,224,0.8)",
  Other: "rgba(148,163,184,0.8)",
};

const LANGUAGES: Language[] = [
  "JS",
  "TS",
  "Python",
  "Go",
  "Rust",
  "Mo",
  "Other",
];

function StarRating({
  rating,
  onChange,
}: { rating: number; onChange?: (r: 1 | 2 | 3 | 4 | 5) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s as 1 | 2 | 3 | 4 | 5)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: onChange ? "pointer" : "default",
          }}
        >
          <Star
            className="w-3.5 h-3.5"
            style={{
              color:
                s <= rating ? "rgba(250,204,21,0.9)" : "var(--os-text-muted)",
              fill: s <= rating ? "rgba(250,204,21,0.9)" : "transparent",
            }}
          />
        </button>
      ))}
    </div>
  );
}

const emptyForm = (): Omit<ReviewNote, "id" | "createdAt"> => ({
  title: "",
  code: "",
  language: "TS",
  notes: "",
  rating: 3,
  tags: [],
});

export function CodeReviewNotes({
  windowProps: _windowProps,
}: { windowProps?: Record<string, unknown> }) {
  const {
    data: reviews,
    set: setReviews,
    loading,
  } = useCanisterKV<ReviewNote[]>("decentos_code_reviews", []);
  const [selected, setSelected] = useState<ReviewNote | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [tagInput, setTagInput] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [reviews, search]);

  const startNew = () => {
    setForm(emptyForm());
    setTagInput("");
    setEditing(true);
    setSelected(null);
  };
  const startEdit = (r: ReviewNote) => {
    setForm({
      title: r.title,
      code: r.code,
      language: r.language,
      notes: r.notes,
      rating: r.rating,
      tags: [...r.tags],
    });
    setTagInput("");
    setEditing(true);
  };

  const save = () => {
    if (!form.title.trim()) return;
    const now = Date.now();
    if (selected) {
      const updated = reviews.map((r) =>
        r.id === selected.id ? { ...r, ...form } : r,
      );
      setReviews(updated);
      setSelected({ ...selected, ...form });
    } else {
      const entry: ReviewNote = { id: now.toString(), ...form, createdAt: now };
      setReviews([entry, ...reviews]);
      setSelected(entry);
    }
    setEditing(false);
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    setSelected(null);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t))
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
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
    <div className="flex h-full" style={{ background: BG, color: TEXT }}>
      {/* Left sidebar */}
      <div
        className="flex flex-col"
        style={{
          width: 220,
          minWidth: 220,
          background: SIDEBAR_BG,
          borderRight: `1px solid ${BORDER}`,
        }}
      >
        <div
          className="p-3 flex-shrink-0"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <div className="relative mb-2">
            <Search
              className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: MUTED }}
            />
            <Input
              data-ocid="codereview.search_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                background: "rgba(20,30,36,0.8)",
                border: `1px solid ${BORDER}`,
                color: TEXT,
                fontSize: 11,
                height: 28,
                paddingLeft: 24,
              }}
            />
          </div>
          <Button
            type="button"
            data-ocid="codereview.primary_button"
            onClick={startNew}
            style={{
              width: "100%",
              height: 28,
              fontSize: 11,
              background: `${ACCENT}0.12)`,
              border: `1px solid ${ACCENT}0.3)`,
              color: `${ACCENT}1)`,
            }}
          >
            <Plus className="w-3 h-3 mr-1" /> New Review
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-24 gap-1"
              data-ocid="codereview.empty_state"
              style={{ color: MUTED }}
            >
              <Code2 className="w-6 h-6 opacity-20" />
              <span className="text-xs">No reviews yet</span>
            </div>
          ) : (
            <div className="p-2 flex flex-col gap-1">
              {filtered.map((r, i) => (
                <div
                  key={r.id}
                  data-ocid={`codereview.item.${i + 1}`}
                  onClick={() => {
                    setSelected(r);
                    setEditing(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(r)}
                  className="p-2 rounded-lg cursor-pointer"
                  style={{
                    background:
                      selected?.id === r.id
                        ? `${ACCENT}0.1)`
                        : "var(--os-border-subtle)",
                    border: `1px solid ${selected?.id === r.id ? `${ACCENT}0.35)` : "transparent"}`,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: LANG_COLORS[r.language] }}
                    >
                      {r.language}
                    </span>
                    <span
                      className="text-xs font-medium truncate flex-1"
                      style={{ color: TEXT }}
                    >
                      {r.title}
                    </span>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {editing ? (
          <div className="flex-1 overflow-auto p-4">
            <div className="text-sm font-bold mb-4" style={{ color: TEXT }}>
              {selected ? "Edit Review" : "New Review"}
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="cr-title"
                  className="text-[11px] block mb-1"
                  style={{ color: MUTED }}
                >
                  Title
                </label>
                <Input
                  id="cr-title"
                  data-ocid="codereview.input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  style={{
                    background: "rgba(20,30,36,0.8)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT,
                    fontSize: 12,
                  }}
                />
              </div>
              <div className="flex gap-3">
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor="cr-lang"
                    className="text-[11px] block mb-1"
                    style={{ color: MUTED }}
                  >
                    Language
                  </label>
                  <select
                    id="cr-lang"
                    data-ocid="codereview.select"
                    value={form.language}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        language: e.target.value as Language,
                      }))
                    }
                    style={{
                      width: "100%",
                      background: "rgba(20,30,36,0.8)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                      borderRadius: 6,
                      padding: "6px 8px",
                      fontSize: 12,
                    }}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    className="text-[11px] block mb-1"
                    style={{ color: MUTED }}
                  >
                    Rating
                  </span>
                  <StarRating
                    rating={form.rating}
                    onChange={(r) => setForm((f) => ({ ...f, rating: r }))}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="cr-code"
                  className="text-[11px] block mb-1"
                  style={{ color: MUTED }}
                >
                  Code Snippet
                </label>
                <Textarea
                  id="cr-code"
                  data-ocid="codereview.textarea"
                  value={form.code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, code: e.target.value }))
                  }
                  rows={6}
                  style={{
                    background: "var(--os-bg-app)",
                    border: `1px solid ${BORDER}`,
                    color: "rgba(180,255,180,0.85)",
                    fontSize: 12,
                    fontFamily: "monospace",
                    resize: "vertical",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="cr-notes"
                  className="text-[11px] block mb-1"
                  style={{ color: MUTED }}
                >
                  Review Notes
                </label>
                <Textarea
                  id="cr-notes"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  rows={4}
                  style={{
                    background: "rgba(20,30,36,0.8)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT,
                    fontSize: 12,
                    resize: "vertical",
                  }}
                />
              </div>
              <div>
                <span
                  className="text-[11px] block mb-1"
                  style={{ color: MUTED }}
                >
                  Tags
                </span>
                <div className="flex flex-wrap gap-1 mb-2">
                  {form.tags.map((t) => (
                    <Badge
                      key={t}
                      style={{
                        fontSize: 10,
                        background: `${ACCENT}0.1)`,
                        color: `${ACCENT}0.8)`,
                        border: `1px solid ${ACCENT}0.25)`,
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          tags: f.tags.filter((x) => x !== t),
                        }))
                      }
                    >
                      #{t} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="Add tag..."
                    style={{
                      background: "rgba(20,30,36,0.8)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                      fontSize: 11,
                      height: 28,
                      flex: 1,
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    style={{
                      height: 28,
                      fontSize: 11,
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      color: MUTED,
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  data-ocid="codereview.submit_button"
                  onClick={save}
                  style={{
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
                  data-ocid="codereview.cancel_button"
                  onClick={() => setEditing(false)}
                  variant="outline"
                  style={{ borderColor: BORDER, color: MUTED }}
                >
                  Cancel
                </Button>
                {selected && (
                  <Button
                    type="button"
                    data-ocid="codereview.delete_button"
                    onClick={() => deleteReview(selected.id)}
                    variant="outline"
                    style={{
                      borderColor: "rgba(248,113,113,0.3)",
                      color: "rgba(248,113,113,0.7)",
                      marginLeft: "auto",
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : selected ? (
          <div className="flex-1 overflow-auto p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold"
                    style={{ color: LANG_COLORS[selected.language] }}
                  >
                    {selected.language}
                  </span>
                  <h2 className="text-base font-bold" style={{ color: TEXT }}>
                    {selected.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={selected.rating} />
                  {selected.tags.map((t) => (
                    <Badge
                      key={t}
                      style={{
                        fontSize: 10,
                        background: `${ACCENT}0.08)`,
                        color: `${ACCENT}0.7)`,
                        border: `1px solid ${ACCENT}0.2)`,
                      }}
                    >
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                data-ocid="codereview.edit_button"
                onClick={() => startEdit(selected)}
                style={{
                  height: 28,
                  fontSize: 11,
                  background: `${ACCENT}0.12)`,
                  border: `1px solid ${ACCENT}0.3)`,
                  color: `${ACCENT}1)`,
                }}
              >
                Edit
              </Button>
            </div>
            {selected.code && (
              <div className="mb-4">
                <div className="text-[11px] mb-2" style={{ color: MUTED }}>
                  Code
                </div>
                <pre
                  className="rounded-lg p-3 overflow-x-auto text-xs"
                  style={{
                    background: "var(--os-bg-app)",
                    border: `1px solid ${BORDER}`,
                    color: "rgba(180,255,180,0.85)",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {selected.code}
                </pre>
              </div>
            )}
            {selected.notes && (
              <div>
                <div className="text-[11px] mb-2" style={{ color: MUTED }}>
                  Review Notes
                </div>
                <div
                  className="text-sm leading-relaxed"
                  style={{ color: TEXT }}
                >
                  {selected.notes}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3"
            data-ocid="codereview.empty_state"
            style={{ color: MUTED }}
          >
            <Code2 className="w-10 h-10 opacity-20" />
            <div className="text-sm">Select a review or create a new one</div>
          </div>
        )}
      </div>
    </div>
  );
}
