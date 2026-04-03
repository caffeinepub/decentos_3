import { Calendar, ClipboardList, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  done: boolean;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  attendees: string;
  agenda: { id: string; text: string }[];
  notes: string;
  actionItems: ActionItem[];
}

function newMeeting(): Meeting {
  return {
    id: crypto.randomUUID(),
    title: "New Meeting",
    date: new Date().toISOString().slice(0, 10),
    attendees: "",
    agenda: [{ id: crypto.randomUUID(), text: "" }],
    notes: "",
    actionItems: [],
  };
}

function newAction(): ActionItem {
  return {
    id: crypto.randomUUID(),
    text: "",
    assignee: "",
    dueDate: "",
    done: false,
  };
}

const inputStyle = {
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(42,58,66,0.7)",
  color: "var(--os-text-primary)",
  borderRadius: 6,
  padding: "5px 10px",
  fontSize: 12,
  outline: "none",
  width: "100%",
};

export function MeetingNotes() {
  const { data: meetings, set: setMeetings } = useCanisterKV<Meeting[]>(
    "decent-meetings",
    [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const persist = (updated: Meeting[]) => {
    setMeetings(updated);
  };

  const createMeeting = () => {
    const m = newMeeting();
    const updated = [m, ...meetings];
    persist(updated);
    setSelectedId(m.id);
  };

  const deleteMeeting = (id: string) => {
    const updated = meetings.filter((m) => m.id !== id);
    persist(updated);
    if (selectedId === id) setSelectedId(updated[0]?.id ?? null);
  };

  const updateMeeting = (patch: Partial<Meeting>) => {
    const updated = meetings.map((m) =>
      m.id === selectedId ? { ...m, ...patch } : m,
    );
    persist(updated);
  };

  const selected = meetings.find((m) => m.id === selectedId) ?? null;

  const sortedMeetings = [...meetings].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const updateAgendaItem = (id: string, val: string) => {
    if (!selected) return;
    updateMeeting({
      agenda: selected.agenda.map((a) =>
        a.id === id ? { ...a, text: val } : a,
      ),
    });
  };

  const addAgendaItem = () => {
    if (!selected) return;
    updateMeeting({
      agenda: [...selected.agenda, { id: crypto.randomUUID(), text: "" }],
    });
  };

  const removeAgendaItem = (id: string) => {
    if (!selected) return;
    updateMeeting({ agenda: selected.agenda.filter((a) => a.id !== id) });
  };

  const addAction = () => {
    if (!selected) return;
    updateMeeting({ actionItems: [...selected.actionItems, newAction()] });
  };

  const updateAction = (id: string, patch: Partial<ActionItem>) => {
    if (!selected) return;
    updateMeeting({
      actionItems: selected.actionItems.map((a) =>
        a.id === id ? { ...a, ...patch } : a,
      ),
    });
  };

  const removeAction = (id: string) => {
    if (!selected) return;
    updateMeeting({
      actionItems: selected.actionItems.filter((a) => a.id !== id),
    });
  };

  const attendeeTags = selected?.attendees
    ? selected.attendees
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ background: "rgba(11,15,18,0.7)" }}
      data-ocid="meetingnotes.panel"
    >
      {/* Sidebar */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{
          width: 200,
          borderRight: "1px solid rgba(42,58,66,0.7)",
          background: "rgba(18,32,38,0.4)",
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-2.5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(42,58,66,0.5)" }}
        >
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 os-cyan-text" />
            <span className="text-xs font-semibold os-cyan-text">Meetings</span>
          </div>
          <button
            type="button"
            onClick={createMeeting}
            data-ocid="meetingnotes.primary_button"
            style={{
              background: "rgba(39,215,224,0.12)",
              border: "1px solid rgba(39,215,224,0.3)",
              borderRadius: 6,
              padding: "3px 8px",
              color: "rgba(39,215,224,0.9)",
              fontSize: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Plus className="w-3 h-3" /> New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedMeetings.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 gap-2"
              style={{ color: "var(--os-text-muted)" }}
              data-ocid="meetingnotes.empty_state"
            >
              <Calendar className="w-8 h-8" />
              <p className="text-[10px]">No meetings yet</p>
            </div>
          ) : (
            sortedMeetings.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedId(m.id)}
                data-ocid={`meetingnotes.item.${i + 1}`}
                className="w-full text-left px-3 py-2.5 transition-colors"
                style={{
                  background:
                    selectedId === m.id
                      ? "rgba(39,215,224,0.08)"
                      : "transparent",
                  borderLeft:
                    selectedId === m.id
                      ? "2px solid rgba(39,215,224,0.7)"
                      : "2px solid transparent",
                }}
              >
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  {m.title}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  {m.date}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail pane */}
      {selected ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Title + delete */}
          <div className="flex items-center gap-3">
            <input
              style={{ ...inputStyle, fontSize: 14, fontWeight: 600, flex: 1 }}
              value={selected.title}
              onChange={(e) => updateMeeting({ title: e.target.value })}
              data-ocid="meetingnotes.input"
            />
            <button
              type="button"
              onClick={() => deleteMeeting(selected.id)}
              data-ocid="meetingnotes.delete_button"
              style={{
                color: "rgba(239,68,68,0.6)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Date + Attendees */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="meeting-date"
                className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1"
              >
                Date
              </label>
              <input
                id="meeting-date"
                type="date"
                style={inputStyle}
                value={selected.date}
                onChange={(e) => updateMeeting({ date: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="meeting-attendees"
                className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1"
              >
                Attendees (comma-separated)
              </label>
              <input
                id="meeting-attendees"
                style={inputStyle}
                placeholder="Alice, Bob, Carol"
                value={selected.attendees}
                onChange={(e) => updateMeeting({ attendees: e.target.value })}
              />
            </div>
          </div>
          {attendeeTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {attendeeTags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(39,215,224,0.1)",
                    border: "1px solid rgba(39,215,224,0.25)",
                    color: "rgba(39,215,224,0.8)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Agenda */}
          <div
            style={{
              background: "rgba(18,32,38,0.6)",
              border: "1px solid rgba(42,58,66,0.6)",
              borderRadius: 10,
              padding: 14,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Agenda
              </h3>
              <button
                type="button"
                onClick={addAgendaItem}
                style={{
                  background: "rgba(39,215,224,0.08)",
                  border: "1px solid rgba(39,215,224,0.2)",
                  borderRadius: 5,
                  padding: "2px 8px",
                  color: "rgba(39,215,224,0.8)",
                  fontSize: 10,
                  cursor: "pointer",
                }}
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {selected.agenda.map((item, _idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span
                    style={{
                      color: "rgba(39,215,224,0.5)",
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    •
                  </span>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="Agenda item"
                    value={item.text}
                    onChange={(e) => updateAgendaItem(item.id, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeAgendaItem(item.id)}
                    style={{
                      color: "rgba(239,68,68,0.5)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div
            style={{
              background: "rgba(18,32,38,0.6)",
              border: "1px solid rgba(42,58,66,0.6)",
              borderRadius: 10,
              padding: 14,
            }}
          >
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Notes
            </h3>
            <textarea
              value={selected.notes}
              onChange={(e) => updateMeeting({ notes: e.target.value })}
              placeholder="Meeting notes..."
              data-ocid="meetingnotes.textarea"
              rows={5}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: 1.6,
              }}
            />
          </div>

          {/* Action Items */}
          <div
            style={{
              background: "rgba(18,32,38,0.6)",
              border: "1px solid rgba(42,58,66,0.6)",
              borderRadius: 10,
              padding: 14,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Action Items
              </h3>
              <button
                type="button"
                onClick={addAction}
                data-ocid="meetingnotes.secondary_button"
                style={{
                  background: "rgba(39,215,224,0.08)",
                  border: "1px solid rgba(39,215,224,0.2)",
                  borderRadius: 5,
                  padding: "2px 8px",
                  color: "rgba(39,215,224,0.8)",
                  fontSize: 10,
                  cursor: "pointer",
                }}
              >
                + Add
              </button>
            </div>
            {selected.actionItems.length === 0 ? (
              <p
                className="text-[10px] text-muted-foreground text-center py-3"
                data-ocid="meetingnotes.empty_state"
              >
                No action items yet
              </p>
            ) : (
              <div className="space-y-2">
                {selected.actionItems.map((action, i) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-2"
                    data-ocid={`meetingnotes.row.${i + 1}`}
                  >
                    <input
                      type="checkbox"
                      checked={action.done}
                      onChange={(e) =>
                        updateAction(action.id, { done: e.target.checked })
                      }
                      data-ocid={`meetingnotes.checkbox.${i + 1}`}
                      style={{
                        accentColor: "rgba(39,215,224,0.9)",
                        flexShrink: 0,
                      }}
                    />
                    <input
                      style={{
                        ...inputStyle,
                        flex: 2,
                        textDecoration: action.done ? "line-through" : "none",
                        opacity: action.done ? 0.5 : 1,
                      }}
                      placeholder="Task..."
                      value={action.text}
                      onChange={(e) =>
                        updateAction(action.id, { text: e.target.value })
                      }
                    />
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Assignee"
                      value={action.assignee}
                      onChange={(e) =>
                        updateAction(action.id, { assignee: e.target.value })
                      }
                    />
                    <input
                      type="date"
                      style={{ ...inputStyle, flex: 1 }}
                      value={action.dueDate}
                      onChange={(e) =>
                        updateAction(action.id, { dueDate: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeAction(action.id)}
                      style={{
                        color: "rgba(239,68,68,0.5)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="flex-1 flex flex-col items-center justify-center gap-3"
          style={{ color: "var(--os-text-muted)" }}
          data-ocid="meetingnotes.empty_state"
        >
          <ClipboardList className="w-12 h-12" />
          <p className="text-sm">Select a meeting or create a new one</p>
          <button
            type="button"
            onClick={createMeeting}
            data-ocid="meetingnotes.open_modal_button"
            style={{
              background: "rgba(39,215,224,0.1)",
              border: "1px solid rgba(39,215,224,0.3)",
              borderRadius: 8,
              padding: "8px 16px",
              color: "rgba(39,215,224,0.85)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            New Meeting
          </button>
        </div>
      )}
    </div>
  );
}
