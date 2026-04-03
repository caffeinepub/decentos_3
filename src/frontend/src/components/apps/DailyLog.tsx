import { Plus } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgb(39,215,224)";

interface LogEntry {
  id: string;
  date: string;
  did: string;
  doing: string;
  blockers: string;
  ts: number;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(d: string) {
  const dt = new Date(`${d}T12:00:00`);
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function DailyLog() {
  const { data: entries, set: setEntries } = useCanisterKV<LogEntry[]>(
    "decent-daily-log",
    [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  function newEntry() {
    const entry: LogEntry = {
      id: Date.now().toString(),
      date: today(),
      did: "",
      doing: "",
      blockers: "",
      ts: Date.now(),
    };
    setEntries([entry, ...entries]);
    setSelectedId(entry.id);
  }

  function updateField(
    id: string,
    field: "did" | "doing" | "blockers",
    value: string,
  ) {
    setEntries(
      entries.map((e) =>
        e.id === id ? { ...e, [field]: value, ts: Date.now() } : e,
      ),
    );
  }

  const selected = entries.find((e) => e.id === selectedId) ?? null;

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    return (
      !q ||
      e.did.toLowerCase().includes(q) ||
      e.doing.toLowerCase().includes(q) ||
      e.blockers.toLowerCase().includes(q)
    );
  });

  // Group by date
  const groups: Record<string, LogEntry[]> = {};
  for (const e of filtered) {
    if (!groups[e.date]) groups[e.date] = [];
    groups[e.date].push(e);
  }
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const fields: Array<["did" | "doing" | "blockers", string, string]> = [
    ["did", "✅ Did", "What did you accomplish?"],
    ["doing", "🔄 Doing", "What are you working on now?"],
    ["blockers", "⚠️ Blockers", "Any blockers or impediments?"],
  ];

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
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 220,
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
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              data-ocid="dailylog.search_input"
              style={{
                flex: 1,
                background: "var(--os-border-subtle)",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                padding: "3px 7px",
                color: "#e2e8f0",
                fontSize: 11,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={newEntry}
              data-ocid="dailylog.primary_button"
              title="New Entry"
              style={{
                background: CYAN,
                color: "#000",
                border: "none",
                borderRadius: 4,
                padding: "3px 7px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Plus style={{ width: 14, height: 14 }} />
            </button>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {entries.length === 0 && (
              <div
                data-ocid="dailylog.empty_state"
                style={{
                  padding: 16,
                  color: "var(--os-text-muted)",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                No entries. Click + to start.
              </div>
            )}
            {sortedDates.map((date) => (
              <div key={date}>
                <div
                  style={{
                    padding: "4px 10px",
                    fontSize: 10,
                    color: CYAN,
                    background: "rgba(39,215,224,0.05)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(42,58,66,0.4)",
                  }}
                >
                  {date === today() ? "Today" : formatDate(date)}
                </div>
                {groups[date].map((entry, i) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setSelectedId(entry.id)}
                    data-ocid={`dailylog.item.${i + 1}`}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "7px 10px",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(42,58,66,0.3)",
                      background:
                        selectedId === entry.id
                          ? "rgba(39,215,224,0.07)"
                          : "transparent",
                      borderLeft:
                        selectedId === entry.id
                          ? `2px solid ${CYAN}`
                          : "2px solid transparent",
                      border: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--os-text-secondary)",
                        marginBottom: 2,
                      }}
                    >
                      {new Date(entry.ts).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color:
                          selectedId === entry.id
                            ? "#e2e8f0"
                            : "var(--os-text-secondary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {entry.did ? entry.did.slice(0, 40) : "(empty)"}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Entry editor */}
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {selected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14, color: CYAN }}>
                  {selected.date === today()
                    ? "Today"
                    : formatDate(selected.date)}
                </div>
                <div style={{ fontSize: 10, color: "var(--os-text-muted)" }}>
                  {new Date(selected.ts).toLocaleTimeString()}
                </div>
              </div>
              {fields.map(([field, label, placeholder]) => (
                <div key={field}>
                  <div
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--os-text-secondary)",
                      marginBottom: 5,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {label}
                  </div>
                  <textarea
                    value={selected[field]}
                    onChange={(e) =>
                      updateField(selected.id, field, e.target.value)
                    }
                    placeholder={placeholder}
                    data-ocid="dailylog.textarea"
                    rows={4}
                    style={{
                      width: "100%",
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                      padding: "8px 10px",
                      color: "#e2e8f0",
                      fontSize: 12,
                      outline: "none",
                      resize: "vertical",
                      lineHeight: 1.6,
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(39,215,224,0.4)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BORDER;
                    }}
                  />
                </div>
              ))}
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
              <Plus style={{ width: 36, height: 36, opacity: 0.3 }} />
              <div style={{ fontSize: 12 }}>
                Click + to start a new daily log
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
