import { BookOpen, ChevronLeft, ChevronRight, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const MOODS = [
  { emoji: "😄", label: "Great" },
  { emoji: "😊", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Low" },
  { emoji: "😢", label: "Rough" },
];

interface JournalEntry {
  content: string;
  mood: number | null;
  wordCount: number;
  updatedAt: number;
}

type JournalData = Record<string, JournalEntry>;

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function parseDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function friendlyDate(key: string): string {
  const d = parseDate(key);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function DailyJournal() {
  const { data, set: saveData } = useCanisterKV<JournalData>(
    "daily_journal_v1",
    {},
  );
  const dataRef = useRef(data);
  dataRef.current = data;

  const [currentDate, setCurrentDate] = useState(() => formatDate(new Date()));
  const [draft, setDraft] = useState("");
  const [draftMood, setDraftMood] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const prevDateRef = useRef(currentDate);

  const entry = data[currentDate] ?? null;

  // Load entry into draft when date changes
  useEffect(() => {
    if (prevDateRef.current !== currentDate) {
      prevDateRef.current = currentDate;
      setDraft(entry?.content ?? "");
      setDraftMood(entry?.mood ?? null);
      setDirty(false);
    }
  }, [currentDate, entry?.content, entry?.mood]);

  const wordCount = countWords(draft);

  const persistEntry = (content: string, mood: number | null) => {
    saveData({
      ...dataRef.current,
      [currentDate]: {
        content,
        mood,
        wordCount: countWords(content),
        updatedAt: Date.now(),
      },
    });
  };

  const saveEntry = () => {
    if (!draft.trim() && draftMood === null) return;
    persistEntry(draft, draftMood);
    setDirty(false);
    toast.success("Journal entry saved ✓");
  };

  const goDay = (delta: number) => {
    const d = parseDate(currentDate);
    d.setDate(d.getDate() + delta);
    if (d > new Date()) return;
    const newKey = formatDate(d);
    const newEntry = dataRef.current[newKey];
    setCurrentDate(newKey);
    setDraft(newEntry?.content ?? "");
    setDraftMood(newEntry?.mood ?? null);
    setDirty(false);
    prevDateRef.current = newKey;
  };

  const isToday = currentDate === formatDate(new Date());
  const isFuture = parseDate(currentDate) > new Date();

  // Autosave on change with debounce
  useEffect(() => {
    if (!dirty) return;
    const capturedDate = currentDate;
    const capturedDraft = draft;
    const capturedMood = draftMood;
    const t = setTimeout(() => {
      saveData({
        ...dataRef.current,
        [capturedDate]: {
          content: capturedDraft,
          mood: capturedMood,
          wordCount: countWords(capturedDraft),
          updatedAt: Date.now(),
        },
      });
      setDirty(false);
    }, 1500);
    return () => clearTimeout(t);
  }, [dirty, draft, draftMood, currentDate, saveData]);

  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = formatDate(d);
      if (data[key]?.content?.trim()) count++;
      else break;
    }
    return count;
  })();

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--app-border)" }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 opacity-70" />
          <span className="text-sm font-semibold">Daily Journal</span>
        </div>
        {streak > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "rgba(34,197,94,0.15)",
              color: "rgba(34,197,94,0.9)",
            }}
          >
            🔥 {streak} day streak
          </span>
        )}
      </div>

      {/* Date nav */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: "var(--app-border)" }}
      >
        <button
          type="button"
          onClick={() => goDay(-1)}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          data-ocid="journal.pagination_prev"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <div className="text-sm font-medium">{friendlyDate(currentDate)}</div>
          {isToday && (
            <div className="text-[10px] opacity-50 mt-0.5">Today</div>
          )}
        </div>
        <button
          type="button"
          onClick={() => goDay(1)}
          disabled={isToday}
          className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          data-ocid="journal.pagination_next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mood selector */}
      <div
        className="flex items-center gap-1 px-4 py-2 border-b"
        style={{ borderColor: "var(--app-border)" }}
      >
        <SmilePlus className="w-3.5 h-3.5 opacity-50 mr-1" />
        <span className="text-[11px] opacity-50 mr-2">Mood:</span>
        {MOODS.map((m, i) => (
          <button
            key={m.label}
            type="button"
            onClick={() => {
              setDraftMood(i === draftMood ? null : i);
              setDirty(true);
            }}
            title={m.label}
            data-ocid={`journal.mood.${i + 1}`}
            className="text-lg leading-none p-1 rounded transition-all"
            style={{
              opacity: draftMood === i ? 1 : 0.4,
              transform: draftMood === i ? "scale(1.25)" : "scale(1)",
              background:
                draftMood === i ? "var(--os-text-muted)" : "transparent",
            }}
          >
            {m.emoji}
          </button>
        ))}
        {draftMood !== null && (
          <span className="text-[11px] opacity-60 ml-1">
            {MOODS[draftMood]?.label}
          </span>
        )}
      </div>

      {/* Text area */}
      <div className="flex-1 relative">
        {isFuture ? (
          <div className="flex items-center justify-center h-full opacity-40 text-sm">
            Can&apos;t write entries for the future
          </div>
        ) : (
          <textarea
            className="w-full h-full resize-none p-4 text-sm leading-relaxed bg-transparent outline-none"
            style={{ color: "var(--app-text)" }}
            placeholder="What's on your mind today?"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setDirty(true);
            }}
            data-ocid="journal.textarea"
          />
        )}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-1.5 border-t text-[11px] opacity-50"
        style={{ borderColor: "var(--app-border)" }}
      >
        <span>{wordCount} words</span>
        <div className="flex items-center gap-3">
          {dirty ? (
            <span>Unsaved…</span>
          ) : entry ? (
            <span style={{ color: "rgba(34,197,94,0.8)" }}>Saved ✓</span>
          ) : null}
          <button
            type="button"
            onClick={saveEntry}
            className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
            style={{
              background: "rgba(99,102,241,0.15)",
              color: "rgba(129,140,248,0.9)",
            }}
            data-ocid="journal.save_button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
