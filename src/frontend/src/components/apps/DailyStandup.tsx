import {
  ChevronDown,
  ChevronRight,
  Clipboard,
  Clock,
  Edit2,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface StandupEntry {
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  savedAt: string;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function DailyStandup() {
  const today = todayKey();
  const { data: allEntries, set: setAllEntries } = useCanisterKV<
    StandupEntry[]
  >("decentos_standup_data", []);
  const [yesterday, setYesterday] = useState("");
  const [todayText, setTodayText] = useState("");
  const [blockers, setBlockers] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const existing = allEntries.find((e) => e.date === today) ?? null;
  const history = allEntries
    .filter((e) => e.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  useEffect(() => {
    if (existing && !isEditing) {
      setYesterday(existing.yesterday);
      setTodayText(existing.today);
      setBlockers(existing.blockers);
    }
  }, [existing, isEditing]);

  const handleSave = () => {
    if (!yesterday.trim() && !todayText.trim()) {
      toast.error("Please fill in at least one field");
      return;
    }
    const entry: StandupEntry = {
      date: today,
      yesterday: yesterday.trim(),
      today: todayText.trim(),
      blockers: blockers.trim(),
      savedAt: new Date().toLocaleTimeString(),
    };
    const updated = [...allEntries.filter((e) => e.date !== today), entry];
    setAllEntries(updated);
    setIsEditing(false);
    toast.success("Standup saved");
  };

  const copyStandup = (entry: StandupEntry) => {
    const lines: string[] = [`📅 Standup — ${entry.date}`];
    if (entry.yesterday) lines.push(`\n✅ Yesterday:\n${entry.yesterday}`);
    if (entry.today) lines.push(`\n🔨 Today:\n${entry.today}`);
    if (entry.blockers) lines.push(`\n🚧 Blockers:\n${entry.blockers}`);
    navigator.clipboard
      .writeText(lines.join("\n"))
      .then(() => toast.success("Standup copied to clipboard"))
      .catch(() => toast.error("Could not copy"));
  };

  const startEdit = () => {
    if (existing) {
      setYesterday(existing.yesterday);
      setTodayText(existing.today);
      setBlockers(existing.blockers);
    }
    setIsEditing(true);
  };

  const showForm = !existing || isEditing;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "var(--os-bg-app)" }}
      data-ocid="standup.panel"
    >
      <div
        className="flex-shrink-0 px-4 py-3 border-b"
        style={{
          background: "var(--os-bg-window-header)",
          borderColor: "var(--os-border-subtle)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--os-text-primary)" }}
            >
              Daily Standup
            </h2>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: "var(--os-text-muted)" }}
            >
              {today}
            </p>
          </div>
          {existing && !isEditing && (
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] flex items-center gap-1"
                style={{ color: "#22c55e" }}
              >
                <Clock className="w-3 h-3" /> Logged at {existing.savedAt}
              </span>
              <button
                type="button"
                onClick={() => copyStandup(existing)}
                data-ocid="standup.secondary_button"
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors"
                style={{
                  border: "1px solid var(--os-border-window)",
                  color: "var(--os-text-secondary)",
                  background: "var(--os-border-subtle)",
                }}
              >
                <Clipboard className="w-3 h-3" /> Copy
              </button>
              <button
                type="button"
                onClick={startEdit}
                data-ocid="standup.edit_button"
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors"
                style={{
                  border: "1px solid rgba(99,102,241,0.35)",
                  color: "rgba(99,102,241,1)",
                  background: "rgba(99,102,241,0.08)",
                }}
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {existing && !isEditing && (
          <div
            className="mx-4 mt-4 rounded-xl p-4"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-window)",
            }}
            data-ocid="standup.card"
          >
            <p
              className="text-[10px] font-semibold mb-3"
              style={{ color: "#22c55e" }}
            >
              ✓ Already logged today
            </p>
            <div className="space-y-3">
              <div>
                <p
                  className="text-[9px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  Yesterday
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  {existing.yesterday || "—"}
                </p>
              </div>
              <div>
                <p
                  className="text-[9px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  Today
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  {existing.today || "—"}
                </p>
              </div>
              {existing.blockers && (
                <div>
                  <p
                    className="text-[9px] font-semibold uppercase tracking-widest mb-1"
                    style={{ color: "rgba(239,68,68,0.7)" }}
                  >
                    Blockers
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--os-text-secondary)" }}
                  >
                    {existing.blockers}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {showForm && (
          <div className="mx-4 mt-4 space-y-3">
            {(
              [
                {
                  label: "What did you do yesterday?",
                  val: yesterday,
                  sv: setYesterday,
                  ph: "Completed the auth flow, reviewed PRs...",
                  borderColor: "var(--os-border-window)",
                },
                {
                  label: "What will you do today?",
                  val: todayText,
                  sv: setTodayText,
                  ph: "Work on the dashboard, write tests...",
                  borderColor: "var(--os-border-window)",
                },
                {
                  label: "Any blockers?",
                  val: blockers,
                  sv: setBlockers,
                  ph: "None / Waiting on design review...",
                  borderColor: "rgba(239,68,68,0.25)",
                },
              ] as {
                label: string;
                val: string;
                sv: (v: string) => void;
                ph: string;
                borderColor: string;
              }[]
            ).map(({ label, val, sv, ph, borderColor }) => (
              <div key={label}>
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest block mb-1.5"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  {label}
                </p>
                <textarea
                  value={val}
                  onChange={(e) => sv(e.target.value)}
                  rows={3}
                  placeholder={ph}
                  data-ocid="standup.textarea"
                  className="w-full rounded-lg px-3 py-2 text-xs outline-none resize-none"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: `1px solid ${borderColor}`,
                    color: "var(--os-text-primary)",
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                data-ocid="standup.submit_button"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.4)",
                  color: "rgba(99,102,241,1)",
                }}
              >
                <Save className="w-3.5 h-3.5" /> Save Standup
              </button>
              {existing && !isEditing && (
                <button
                  type="button"
                  onClick={() => existing && copyStandup(existing)}
                  data-ocid="standup.secondary_button"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-border-window)",
                    color: "var(--os-text-secondary)",
                  }}
                >
                  <Clipboard className="w-3.5 h-3.5" /> Copy
                </button>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  data-ocid="standup.cancel_button"
                  className="px-4 py-2 rounded-lg text-xs transition-colors"
                  style={{
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-secondary)",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mx-4 mt-6 mb-4">
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--os-text-muted)" }}
            >
              Past Standups
            </p>
            <div className="space-y-2" data-ocid="standup.list">
              {history.map((entry, i) => (
                <div
                  key={entry.date}
                  className="rounded-lg overflow-hidden"
                  style={{
                    background: "var(--os-bg-elevated)",
                    border: "1px solid var(--os-border-subtle)",
                  }}
                  data-ocid={`standup.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsed((c) => ({
                        ...c,
                        [entry.date]: !c[entry.date],
                      }))
                    }
                    className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                    style={{ color: "var(--os-text-secondary)" }}
                  >
                    <span className="font-medium">{entry.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyStandup(entry);
                        }}
                        className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          color: "var(--os-text-muted)",
                          background: "var(--os-border-subtle)",
                        }}
                      >
                        <Clipboard className="w-2.5 h-2.5" />
                      </button>
                      {collapsed[entry.date] ? (
                        <ChevronRight
                          className="w-3.5 h-3.5"
                          style={{ color: "var(--os-text-muted)" }}
                        />
                      ) : (
                        <ChevronDown
                          className="w-3.5 h-3.5"
                          style={{ color: "var(--os-text-muted)" }}
                        />
                      )}
                    </div>
                  </button>
                  {!collapsed[entry.date] && (
                    <div
                      className="px-3 pb-3 space-y-2"
                      style={{ borderTop: "1px solid var(--os-border-subtle)" }}
                    >
                      {entry.yesterday && (
                        <div className="pt-2">
                          <p
                            className="text-[9px] uppercase tracking-widest mb-1"
                            style={{ color: "var(--os-text-muted)" }}
                          >
                            Yesterday
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--os-text-secondary)" }}
                          >
                            {entry.yesterday}
                          </p>
                        </div>
                      )}
                      {entry.today && (
                        <div>
                          <p
                            className="text-[9px] uppercase tracking-widest mb-1"
                            style={{ color: "var(--os-text-muted)" }}
                          >
                            Today
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--os-text-secondary)" }}
                          >
                            {entry.today}
                          </p>
                        </div>
                      )}
                      {entry.blockers && (
                        <div>
                          <p
                            className="text-[9px] uppercase tracking-widest mb-1"
                            style={{ color: "rgba(239,68,68,0.6)" }}
                          >
                            Blockers
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--os-text-secondary)" }}
                          >
                            {entry.blockers}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!existing && history.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-10 text-center"
            data-ocid="standup.empty_state"
          >
            <p className="text-2xl mb-2">🧑‍💻</p>
            <p className="text-xs" style={{ color: "var(--os-text-muted)" }}>
              Log your first standup above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
