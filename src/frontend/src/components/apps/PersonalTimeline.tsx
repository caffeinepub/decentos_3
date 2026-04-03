import {
  Briefcase,
  Calendar,
  GraduationCap,
  Heart,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type Category = "Career" | "Personal" | "Travel" | "Health" | "Education";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: Category;
}

const CATEGORY_CONFIG: Record<
  Category,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  Career: {
    color: "rgba(59,130,246,0.9)",
    bg: "rgba(59,130,246,0.15)",
    icon: <Briefcase size={12} />,
  },
  Personal: {
    color: "rgba(168,85,247,0.9)",
    bg: "rgba(168,85,247,0.15)",
    icon: <Heart size={12} />,
  },
  Travel: {
    color: "rgba(34,197,94,0.9)",
    bg: "rgba(34,197,94,0.15)",
    icon: <MapPin size={12} />,
  },
  Health: {
    color: "rgba(239,68,68,0.9)",
    bg: "rgba(239,68,68,0.15)",
    icon: <Heart size={12} />,
  },
  Education: {
    color: "rgba(245,158,11,0.9)",
    bg: "rgba(245,158,11,0.15)",
    icon: <GraduationCap size={12} />,
  },
};

const EMPTY_FORM = {
  date: "",
  title: "",
  description: "",
  category: "Career" as Category,
};

export function PersonalTimeline() {
  const {
    data: events,
    set: setEvents,
    loading,
  } = useCanisterKV<TimelineEvent[]>("decentos_timeline", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  const handleAdd = () => {
    if (!form.title || !form.date) return;
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      ...form,
    };
    setEvents([...events, newEvent]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
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
      className="flex flex-col h-full"
      style={{
        background: "rgba(11,15,18,0.6)",
        color: "rgba(220,235,240,0.9)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "rgba(42,58,66,0.8)" }}
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} style={{ color: "rgba(6,182,212,0.9)" }} />
          <span className="font-semibold text-sm">Personal Timeline</span>
        </div>
        <button
          type="button"
          data-ocid="timeline.open_modal_button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-all hover:opacity-90"
          style={{
            background: "rgba(6,182,212,0.2)",
            color: "rgba(6,182,212,0.9)",
            border: "1px solid rgba(6,182,212,0.3)",
          }}
        >
          <Plus size={12} /> Add Milestone
        </button>
      </div>

      {/* Timeline */}
      <div
        className="flex-1 overflow-y-auto px-6 py-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(42,58,66,0.8) transparent",
        }}
      >
        {sorted.length === 0 ? (
          <div
            data-ocid="timeline.empty_state"
            className="flex flex-col items-center justify-center h-full gap-3 opacity-50"
          >
            <Calendar size={48} style={{ color: "rgba(6,182,212,0.5)" }} />
            <p className="text-sm">No milestones yet</p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="text-xs px-4 py-2 rounded"
              style={{
                background: "rgba(6,182,212,0.2)",
                color: "rgba(6,182,212,0.9)",
                border: "1px solid rgba(6,182,212,0.3)",
              }}
            >
              Add your first milestone
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[19px] top-0 bottom-0 w-px"
              style={{ background: "rgba(42,58,66,0.8)" }}
            />
            <div className="space-y-6">
              {sorted.map((event, idx) => {
                const cfg = CATEGORY_CONFIG[event.category];
                return (
                  <div
                    key={event.id}
                    data-ocid={`timeline.item.${idx + 1}`}
                    className="flex gap-4 relative"
                  >
                    {/* Dot */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2"
                      style={{ background: cfg.bg, borderColor: cfg.color }}
                    >
                      <span style={{ color: cfg.color }}>{cfg.icon}</span>
                    </div>
                    {/* Card */}
                    <div
                      className="flex-1 rounded-lg p-3 border"
                      style={{
                        background: "rgba(16,24,28,0.6)",
                        borderColor: "rgba(42,58,66,0.8)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-sm truncate">
                              {event.title}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{ background: cfg.bg, color: cfg.color }}
                            >
                              {cfg.icon} {event.category}
                            </span>
                          </div>
                          <p className="text-xs opacity-50 mb-1">
                            {event.date}
                          </p>
                          {event.description && (
                            <p className="text-xs opacity-70 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          data-ocid={`timeline.delete_button.${idx + 1}`}
                          onClick={() => handleDelete(event.id)}
                          className="p-1 rounded hover:bg-red-500/20 transition-colors flex-shrink-0"
                          style={{ color: "rgba(239,68,68,0.7)" }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showForm && (
        <div
          data-ocid="timeline.dialog"
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full max-w-md mx-4 rounded-xl border p-5 shadow-2xl"
            style={{
              background: "rgba(16,24,28,0.95)",
              borderColor: "rgba(42,58,66,0.8)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Add Milestone</h3>
              <button
                type="button"
                data-ocid="timeline.close_button"
                onClick={() => setShowForm(false)}
                className="opacity-50 hover:opacity-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="tl-date"
                  className="text-xs opacity-60 mb-1 block"
                >
                  Date
                </label>
                <input
                  id="tl-date"
                  data-ocid="timeline.input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    background: "rgba(42,58,66,0.4)",
                    border: "1px solid rgba(42,58,66,0.8)",
                    color: "rgba(220,235,240,0.9)",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="tl-title"
                  className="text-xs opacity-60 mb-1 block"
                >
                  Title
                </label>
                <input
                  id="tl-title"
                  data-ocid="timeline.input"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Milestone title"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    background: "rgba(42,58,66,0.4)",
                    border: "1px solid rgba(42,58,66,0.8)",
                    color: "rgba(220,235,240,0.9)",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="tl-cat"
                  className="text-xs opacity-60 mb-1 block"
                >
                  Category
                </label>
                <select
                  id="tl-cat"
                  data-ocid="timeline.select"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      category: e.target.value as Category,
                    }))
                  }
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    background: "rgba(42,58,66,0.4)",
                    border: "1px solid rgba(42,58,66,0.8)",
                    color: "rgba(220,235,240,0.9)",
                  }}
                >
                  {Object.keys(CATEGORY_CONFIG).map((c) => (
                    <option
                      key={c}
                      value={c}
                      style={{ background: "var(--os-bg-app)" }}
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="tl-desc"
                  className="text-xs opacity-60 mb-1 block"
                >
                  Description
                </label>
                <textarea
                  id="tl-desc"
                  data-ocid="timeline.textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="What happened?"
                  rows={3}
                  className="w-full px-3 py-2 rounded text-sm resize-none"
                  style={{
                    background: "rgba(42,58,66,0.4)",
                    border: "1px solid rgba(42,58,66,0.8)",
                    color: "rgba(220,235,240,0.9)",
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                data-ocid="timeline.cancel_button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded text-sm transition-colors"
                style={{
                  background: "rgba(42,58,66,0.4)",
                  border: "1px solid rgba(42,58,66,0.6)",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="timeline.submit_button"
                onClick={handleAdd}
                disabled={!form.title || !form.date}
                className="flex-1 py-2 rounded text-sm font-medium transition-colors disabled:opacity-40"
                style={{
                  background: "rgba(6,182,212,0.2)",
                  color: "rgba(6,182,212,0.9)",
                  border: "1px solid rgba(6,182,212,0.3)",
                }}
              >
                Add Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
