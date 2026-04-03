import { useEffect, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: 1 | 2 | 3 | 4 | 5;
  note: string;
}

const MOOD_EMOJIS: Record<number, string> = {
  1: "😢",
  2: "😟",
  3: "😐",
  4: "🙂",
  5: "😄",
};

const MOOD_LABELS: Record<number, string> = {
  1: "Awful",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const MOOD_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#84cc16",
  5: "#27D7E0",
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function MoodTracker() {
  const { data: entries, set: setEntries } = useCanisterKV<MoodEntry[]>(
    "decent-mood",
    [],
  );
  const [selectedMood, setSelectedMood] = useState<1 | 2 | 3 | 4 | 5 | null>(
    null,
  );
  const [noteText, setNoteText] = useState("");
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");

  const today = todayStr();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const todayEntry = entries.find((e) => e.date === today);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync form when today's entry exists
  useEffect(() => {
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setNoteText(todayEntry.note);
    }
  }, [todayEntry?.date, todayEntry?.mood, todayEntry?.note]);

  const handleSave = () => {
    if (!selectedMood) return;
    const newEntry: MoodEntry = {
      date: today,
      mood: selectedMood,
      note: noteText.trim(),
    };
    setEntries(
      [newEntry, ...entries.filter((e) => e.date !== today)].sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    );
  };

  // Streak: consecutive days from today backwards
  const sortedDates = entries
    .map((e) => e.date)
    .sort((a, b) => b.localeCompare(a));
  let streak = 0;
  const checkDate = new Date();
  for (let i = 0; i < 365; i++) {
    const ds = checkDate.toISOString().slice(0, 10);
    if (sortedDates.includes(ds)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else break;
  }

  const last7 = entries.slice(0, 7);
  const avgMood =
    last7.length > 0 ? last7.reduce((s, e) => s + e.mood, 0) / last7.length : 0;

  // Calendar heatmap
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = now.toLocaleString("default", { month: "long" });
  const entryByDay: Record<string, MoodEntry> = {};
  for (const e of entries) {
    const d = new Date(`${e.date}T12:00:00`);
    if (d.getFullYear() === year && d.getMonth() === month) {
      entryByDay[String(d.getDate())] = e;
    }
  }

  const moodColor = selectedMood ? MOOD_COLORS[selectedMood] : null;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "rgba(8,14,18,0.97)" }}
      data-ocid="moodtracker.panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          background: "rgba(12,22,30,0.95)",
          borderColor: "rgba(39,215,224,0.15)",
        }}
      >
        <span
          className="text-xs font-semibold"
          style={{ color: "rgba(39,215,224,1)" }}
        >
          Mood Tracker
        </span>
        <div className="flex gap-1">
          {(["today", "history"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              data-ocid={`moodtracker.${tab}.tab`}
              className="px-3 h-6 rounded text-[11px] font-medium transition-all capitalize"
              style={
                activeTab === tab
                  ? {
                      background: "rgba(39,215,224,0.15)",
                      color: "rgba(39,215,224,1)",
                      border: "1px solid rgba(39,215,224,0.3)",
                    }
                  : {
                      color: "var(--os-text-secondary)",
                      border: "1px solid transparent",
                    }
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "today" ? (
          <div className="p-4 space-y-5">
            {/* Today's entry */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.12)",
              }}
            >
              <p className="text-xs text-muted-foreground/60 mb-3">
                {todayEntry
                  ? "Update today's mood"
                  : "How are you feeling today?"}
              </p>
              <div className="flex gap-2 justify-center mb-4">
                {([1, 2, 3, 4, 5] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    data-ocid="moodtracker.toggle"
                    title={MOOD_LABELS[m]}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                    style={
                      selectedMood === m
                        ? {
                            background: `${MOOD_COLORS[m]}22`,
                            border: `1px solid ${MOOD_COLORS[m]}66`,
                            boxShadow: `0 0 12px ${MOOD_COLORS[m]}33`,
                          }
                        : { border: "1px solid transparent" }
                    }
                  >
                    <span className="text-2xl">{MOOD_EMOJIS[m]}</span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {MOOD_LABELS[m]}
                    </span>
                  </button>
                ))}
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note (optional)..."
                data-ocid="moodtracker.textarea"
                rows={2}
                className="w-full rounded-lg px-3 py-2 text-xs outline-none resize-none"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid var(--os-border-subtle)",
                  color: "var(--os-text-secondary)",
                  caretColor: "var(--os-accent)",
                }}
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!selectedMood}
                data-ocid="moodtracker.submit_button"
                className="mt-3 w-full py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
                style={{
                  background: moodColor
                    ? `${moodColor}22`
                    : "var(--os-border-subtle)",
                  border: `1px solid ${moodColor ? `${moodColor}55` : "var(--os-text-muted)"}`,
                  color: moodColor ?? "var(--os-text-muted)",
                }}
              >
                {todayEntry ? "Update Entry" : "Log Mood"}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-3 text-center"
                style={{
                  background: "rgba(39,215,224,0.05)",
                  border: "1px solid rgba(39,215,224,0.12)",
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--os-accent)" }}
                >
                  {streak}
                </div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                  Day Streak 🔥
                </div>
              </div>
              <div
                className="rounded-xl p-3 text-center"
                style={{
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-border-subtle)",
                }}
              >
                <div className="text-2xl">
                  {avgMood > 0
                    ? MOOD_EMOJIS[Math.round(avgMood) as 1 | 2 | 3 | 4 | 5]
                    : "—"}
                </div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                  7-day avg
                </div>
              </div>
            </div>

            {/* Calendar heatmap */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground/60 mb-2">
                {monthName} {year}
              </p>
              <div className="grid grid-cols-7 gap-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div
                    key={d}
                    className="text-center text-[9px] text-muted-foreground/50 pb-1"
                  >
                    {d}
                  </div>
                ))}
                {Array.from({ length: firstDay }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: empty padding cells have no stable id
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const entry = entryByDay[String(day)];
                    const isToday = day === now.getDate();
                    return (
                      <div
                        key={day}
                        className="aspect-square rounded flex items-center justify-center text-[11px]"
                        style={{
                          background: entry
                            ? `${MOOD_COLORS[entry.mood]}22`
                            : "var(--os-border-subtle)",
                          border: isToday
                            ? "1px solid rgba(39,215,224,0.5)"
                            : "1px solid transparent",
                          color: entry
                            ? MOOD_COLORS[entry.mood]
                            : "var(--os-text-muted)",
                          fontWeight: isToday ? 700 : 400,
                        }}
                        title={
                          entry
                            ? `${MOOD_LABELS[entry.mood]}${entry.note ? `: ${entry.note}` : ""}`
                            : undefined
                        }
                      >
                        {entry ? MOOD_EMOJIS[entry.mood] : day}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {entries.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground/60 text-xs"
                data-ocid="moodtracker.empty_state"
              >
                <span className="text-4xl">😶</span>
                <span>No entries yet. Log your mood to get started!</span>
              </div>
            ) : (
              entries.map((entry, i) => (
                <div
                  key={entry.date}
                  data-ocid={`moodtracker.item.${i + 1}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-border-subtle)",
                  }}
                >
                  <span className="text-xl flex-shrink-0">
                    {MOOD_EMOJIS[entry.mood]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: MOOD_COLORS[entry.mood] }}
                      >
                        {MOOD_LABELS[entry.mood]}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">
                        {entry.date}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-[11px] text-muted-foreground/60 truncate mt-0.5">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
