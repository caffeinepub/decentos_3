import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Moon, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const BG = "var(--os-bg-app)";
const BORDER = "var(--os-border)";
const CYAN = "var(--os-accent)";

interface DreamEntry {
  id: string;
  date: string;
  description: string;
  mood: string;
  tags: string;
  lucid: boolean;
  createdAt: number;
}

const MOODS = ["😌", "😰", "😊", "🤔", "✨"];
const MOOD_LABELS: Record<string, string> = {
  "😌": "Calm",
  "😰": "Anxious",
  "😊": "Happy",
  "🤔": "Confused",
  "✨": "Vivid",
};

function genId() {
  return `dream_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function DreamJournal({
  windowProps: _w,
}: { windowProps?: Record<string, unknown> }) {
  const {
    data: entries,
    set: saveEntries,
    loading,
  } = useCanisterKV<DreamEntry[]>("decentos_dream_journal", []);
  const [view, setView] = useState<"list" | "add">("list");
  const [search, setSearch] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newMood, setNewMood] = useState("😊");
  const [newTags, setNewTags] = useState("");
  const [newLucid, setNewLucid] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.description.toLowerCase().includes(q) ||
        e.tags.toLowerCase().includes(q),
    );
  }, [entries, search]);

  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of entries) {
      for (const t of e.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)) {
        counts[t] = (counts[t] ?? 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t);
  }, [entries]);

  const lucidPct = entries.length
    ? Math.round((entries.filter((e) => e.lucid).length / entries.length) * 100)
    : 0;

  const addEntry = () => {
    if (!newDesc.trim()) return;
    const entry: DreamEntry = {
      id: genId(),
      date: newDate,
      description: newDesc.trim(),
      mood: newMood,
      tags: newTags,
      lucid: newLucid,
      createdAt: Date.now(),
    };
    saveEntries([entry, ...entries]);
    setNewDesc("");
    setNewTags("");
    setNewLucid(false);
    setNewMood("😊");
    setView("list");
  };

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter((e) => e.id !== id));
  };

  return (
    <div
      data-ocid="dreamjournal.panel"
      className="flex flex-col h-full"
      style={{ background: BG, color: "var(--os-text-primary)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4" style={{ color: "var(--os-accent)" }} />
          <span className="text-sm font-semibold">Dream Journal</span>
        </div>
        <div className="flex gap-2">
          {view === "list" ? (
            <Button
              size="sm"
              data-ocid="dreamjournal.primary_button"
              onClick={() => setView("add")}
              style={{
                background: "rgba(39,215,224,0.15)",
                color: "var(--os-accent)",
                border: "1px solid rgba(39,215,224,0.3)",
              }}
              className="h-7 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" /> Log Dream
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              data-ocid="dreamjournal.cancel_button"
              onClick={() => setView("list")}
              className="h-7 text-xs text-muted-foreground/60"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full border-2 animate-spin"
            style={{
              borderColor: "rgba(39,215,224,0.3)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      ) : view === "add" ? (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div>
              <div className="text-xs text-muted-foreground/60 mb-1 block">
                Date
              </div>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                data-ocid="dreamjournal.input"
                className="h-8 text-xs"
                style={{
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: "var(--os-text-primary)",
                }}
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground/60 mb-1 block">
                Dream Description
              </div>
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe your dream..."
                data-ocid="dreamjournal.textarea"
                rows={5}
                style={{
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: "var(--os-text-primary)",
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground/60 mb-2 block">
                Mood
              </div>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setNewMood(m)}
                    className="text-xl rounded-lg p-2 transition-all"
                    style={{
                      background:
                        newMood === m
                          ? "rgba(39,215,224,0.2)"
                          : "var(--os-border-subtle)",
                      border: `1px solid ${newMood === m ? "rgba(39,215,224,0.5)" : BORDER}`,
                    }}
                    title={MOOD_LABELS[m]}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground/60 mb-1 block">
                Tags (comma-separated)
              </div>
              <Input
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="flying, water, work..."
                data-ocid="dreamjournal.search_input"
                className="h-8 text-xs"
                style={{
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: "var(--os-text-primary)",
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNewLucid(!newLucid)}
                data-ocid="dreamjournal.toggle"
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all"
                style={{
                  background: newLucid
                    ? "rgba(39,215,224,0.15)"
                    : "var(--os-border-subtle)",
                  border: `1px solid ${newLucid ? "rgba(39,215,224,0.4)" : BORDER}`,
                  color: newLucid ? CYAN : "var(--os-text-secondary)",
                }}
              >
                ✨ Lucid Dream
              </button>
            </div>
            <Button
              onClick={addEntry}
              data-ocid="dreamjournal.submit_button"
              disabled={!newDesc.trim()}
              className="w-full h-9 text-sm"
              style={{
                background: "rgba(39,215,224,0.2)",
                color: "var(--os-accent)",
                border: "1px solid rgba(39,215,224,0.4)",
              }}
            >
              Save Dream
            </Button>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Stats bar */}
          <div
            className="px-4 py-2 flex gap-4 shrink-0"
            style={{ borderBottom: `1px solid ${BORDER}` }}
          >
            <div className="text-xs">
              <span className="text-muted-foreground/60">Total </span>
              <span style={{ color: "var(--os-accent)" }}>
                {entries.length}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground/60">Lucid </span>
              <span style={{ color: "rgba(168,85,247,0.9)" }}>{lucidPct}%</span>
            </div>
            {topTags.length > 0 && (
              <div className="text-xs flex items-center gap-1">
                <span className="text-muted-foreground/60">Top: </span>
                {topTags.slice(0, 3).map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="text-[10px] h-4 px-1"
                    style={{
                      borderColor: "rgba(39,215,224,0.3)",
                      color: "var(--os-accent)",
                    }}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="px-4 py-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/60" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dreams or tags..."
                data-ocid="dreamjournal.search_input"
                className="h-7 pl-6 text-xs"
                style={{
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: "var(--os-text-primary)",
                }}
              />
            </div>
          </div>

          {/* List */}
          <ScrollArea className="flex-1 px-4">
            {filtered.length === 0 ? (
              <div
                data-ocid="dreamjournal.empty_state"
                className="flex flex-col items-center justify-center py-12 text-muted-foreground/60"
              >
                <Moon className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">
                  {entries.length === 0
                    ? "No dreams logged yet"
                    : "No results found"}
                </p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                {filtered.map((entry, i) => (
                  <div
                    key={entry.id}
                    data-ocid={`dreamjournal.item.${i + 1}`}
                    className="rounded-lg p-3 group"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{entry.mood}</span>
                          <span className="text-xs text-muted-foreground/60">
                            {entry.date}
                          </span>
                          {entry.lucid && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 px-1"
                              style={{
                                borderColor: "rgba(168,85,247,0.4)",
                                color: "rgba(168,85,247,0.9)",
                              }}
                            >
                              Lucid
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {entry.description}
                        </p>
                        {entry.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.tags
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean)
                              .map((t) => (
                                <Badge
                                  key={t}
                                  variant="outline"
                                  className="text-[10px] h-4 px-1"
                                  style={{
                                    borderColor: "rgba(39,215,224,0.25)",
                                    color: "rgba(39,215,224,0.7)",
                                  }}
                                >
                                  {t}
                                </Badge>
                              ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteEntry(entry.id)}
                        data-ocid={`dreamjournal.delete_button.${i + 1}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                        style={{ color: "rgba(251,113,133,0.7)" }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
