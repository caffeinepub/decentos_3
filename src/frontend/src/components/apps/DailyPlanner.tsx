import { ChevronLeft, ChevronRight, Repeat, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const ACCENT = "rgba(6,182,212,";
const HOUR_H = 60;
const TIMELINE_START = 6;
const TIMELINE_END = 23;
const HOURS = Array.from(
  { length: TIMELINE_END - TIMELINE_START + 1 },
  (_, i) => TIMELINE_START + i,
);

const EVENT_COLORS = [
  "rgba(6,182,212,",
  "rgba(99,102,241,",
  "rgba(245,158,11,",
  "rgba(34,197,94,",
  "rgba(239,68,68,",
];

const COLOR_LABELS = ["Teal", "Indigo", "Amber", "Green", "Red"];

interface PlannerEvent {
  id: number;
  date: string;
  title: string;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  colorIdx: number;
  recurring?: boolean;
}

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function eventTop(e: PlannerEvent) {
  return (e.startHour - TIMELINE_START + e.startMin / 60) * HOUR_H;
}

function eventHeight(e: PlannerEvent) {
  const startTotal = e.startHour * 60 + e.startMin;
  const endTotal = e.endHour * 60 + e.endMin;
  return Math.max(24, ((endTotal - startTotal) / 60) * HOUR_H);
}

const TODAY = toDateKey(new Date());

const SAMPLE_EVENTS: PlannerEvent[] = [
  {
    id: 1,
    date: TODAY,
    title: "Morning Stand-up",
    startHour: 9,
    startMin: 0,
    endHour: 9,
    endMin: 30,
    colorIdx: 0,
    recurring: true,
  },
  {
    id: 2,
    date: TODAY,
    title: "Deep Work: Canister Dev",
    startHour: 10,
    startMin: 0,
    endHour: 12,
    endMin: 0,
    colorIdx: 1,
  },
  {
    id: 3,
    date: TODAY,
    title: "Lunch & Reading",
    startHour: 13,
    startMin: 0,
    endHour: 14,
    endMin: 0,
    colorIdx: 3,
  },
];

interface FormState {
  title: string;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  colorIdx: number;
  recurring: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  startHour: 9,
  startMin: 0,
  endHour: 10,
  endMin: 0,
  colorIdx: 0,
  recurring: false,
};

export function DailyPlanner() {
  const { data: events, set: saveEvents } = useCanisterKV<PlannerEvent[]>(
    "decentos_daily_planner",
    SAMPLE_EVENTS,
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [now, setNow] = useState(new Date());
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (toDateKey(currentDate) === TODAY && timelineRef.current) {
      const scrollTo = Math.max(
        0,
        (now.getHours() - TIMELINE_START - 1) * HOUR_H,
      );
      timelineRef.current.scrollTop = scrollTo;
    }
  }, [currentDate, now]);

  const dateKey = toDateKey(currentDate);

  // Include recurring events from any day
  const dayEvents = events.filter(
    (e) => e.date === dateKey || (e.recurring && e.date !== dateKey),
  );
  const isToday = dateKey === TODAY;

  const nowTop = isToday
    ? (now.getHours() - TIMELINE_START + now.getMinutes() / 60) * HOUR_H
    : null;

  const prevDay = () =>
    setCurrentDate((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() - 1);
      return nd;
    });
  const nextDay = () =>
    setCurrentDate((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() + 1);
      return nd;
    });
  const goToday = () => setCurrentDate(new Date());

  const handleHourClick = (hour: number) => {
    setForm({
      ...EMPTY_FORM,
      startHour: hour,
      endHour: Math.min(TIMELINE_END, hour + 1),
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const ev: PlannerEvent = { id: Date.now(), date: dateKey, ...form };
    const updated = [...events, ev];
    saveEvents(updated);
    setShowForm(false);
    setForm(EMPTY_FORM);
    toast.success("Saved to chain ✓");
  };

  const handleDelete = (id: number) => {
    saveEvents(events.filter((e) => e.id !== id));
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "rgba(11,15,18,0.6)",
        color: "rgba(220,235,240,0.9)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderBottom: "1px solid rgba(42,58,66,0.8)",
          flexShrink: 0,
          background: "rgba(10,16,20,0.6)",
        }}
      >
        <button
          type="button"
          onClick={prevDay}
          data-ocid="planner.pagination_prev"
          style={{
            background: "var(--os-border-subtle)",
            border: "1px solid rgba(42,58,66,0.6)",
            borderRadius: 6,
            padding: "4px 8px",
            color: "rgba(220,235,240,0.7)",
            cursor: "pointer",
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {formatDate(currentDate)}
          </div>
          {isToday && (
            <div style={{ fontSize: 10, color: `${ACCENT}0.8)` }}>Today</div>
          )}
        </div>
        <button
          type="button"
          onClick={nextDay}
          data-ocid="planner.pagination_next"
          style={{
            background: "var(--os-border-subtle)",
            border: "1px solid rgba(42,58,66,0.6)",
            borderRadius: 6,
            padding: "4px 8px",
            color: "rgba(220,235,240,0.7)",
            cursor: "pointer",
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={goToday}
          data-ocid="planner.secondary_button"
          style={{
            fontSize: 11,
            padding: "4px 12px",
            borderRadius: 6,
            background: `${ACCENT}0.1)`,
            border: `1px solid ${ACCENT}0.3)`,
            color: `${ACCENT}0.9)`,
            cursor: "pointer",
          }}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY_FORM);
            setShowForm(true);
          }}
          data-ocid="planner.primary_button"
          style={{
            fontSize: 11,
            padding: "4px 12px",
            borderRadius: 6,
            background: `${ACCENT}0.15)`,
            border: `1px solid ${ACCENT}0.5)`,
            color: `${ACCENT}1)`,
            cursor: "pointer",
          }}
        >
          + Event
        </button>
      </div>

      {/* Timeline */}
      <div
        ref={timelineRef}
        style={{ flex: 1, overflowY: "auto", position: "relative" }}
      >
        <div style={{ position: "relative", minHeight: HOURS.length * HOUR_H }}>
          {/* Hour rows */}
          {HOURS.map((hour) => (
            <button
              type="button"
              key={hour}
              onClick={() => handleHourClick(hour)}
              data-ocid="planner.canvas_target"
              style={{
                position: "absolute",
                top: (hour - TIMELINE_START) * HOUR_H,
                left: 0,
                right: 0,
                height: HOUR_H,
                display: "flex",
                cursor: "pointer",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(42,58,66,0.3)",
                padding: 0,
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(180,200,210,0.3)",
                  padding: "4px 8px",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {hour === 12
                  ? "12pm"
                  : hour > 12
                    ? `${hour - 12}pm`
                    : `${hour}am`}
              </span>
            </button>
          ))}

          {/* Now indicator */}
          {nowTop !== null && (
            <div
              style={{
                position: "absolute",
                left: 44,
                right: 0,
                top: nowTop,
                height: 2,
                background: `${ACCENT}0.8)`,
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Events */}
          {dayEvents.map((ev) => {
            const color = EVENT_COLORS[ev.colorIdx] ?? EVENT_COLORS[0];
            return (
              <div
                key={`${ev.id}-${dateKey}`}
                onMouseEnter={() => setHoveredId(ev.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "absolute",
                  left: 48,
                  right: 8,
                  top: eventTop(ev),
                  height: eventHeight(ev),
                  background: `${color}0.15)`,
                  border: `1px solid ${color}0.5)`,
                  borderRadius: 6,
                  padding: "4px 8px",
                  zIndex: 5,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: `${color}1)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {ev.recurring && (
                    <Repeat
                      style={{
                        width: 10,
                        height: 10,
                        flexShrink: 0,
                        opacity: 0.7,
                      }}
                    />
                  )}
                  {ev.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(180,200,210,0.5)",
                    marginTop: 2,
                  }}
                >
                  {pad(ev.startHour)}:{pad(ev.startMin)} – {pad(ev.endHour)}:
                  {pad(ev.endMin)}
                </div>
                {hoveredId === ev.id && !ev.recurring && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(ev.id);
                    }}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(239,68,68,0.2)",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      padding: 2,
                      color: "rgba(239,68,68,0.9)",
                    }}
                  >
                    <Trash2 style={{ width: 12, height: 12 }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showForm && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          data-ocid="planner.modal"
        >
          <div
            style={{
              background: "rgba(14,20,26,0.98)",
              border: `1px solid ${ACCENT}0.3)`,
              borderRadius: 12,
              padding: 24,
              width: 340,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
              Add Event
            </h3>

            <div style={{ marginBottom: 12 }}>
              <label
                htmlFor="planner-title"
                style={{
                  fontSize: 11,
                  color: "rgba(180,200,210,0.5)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Title
              </label>
              <input
                id="planner-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-ocid="planner.input"
                style={{
                  width: "100%",
                  background: "var(--os-border-subtle)",
                  border: "1px solid rgba(42,58,66,0.8)",
                  borderRadius: 6,
                  padding: "7px 10px",
                  fontSize: 13,
                  color: "rgba(220,235,240,0.9)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div>
                <label
                  htmlFor="planner-start"
                  style={{
                    fontSize: 11,
                    color: "rgba(180,200,210,0.5)",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Start
                </label>
                <select
                  id="planner-start"
                  value={`${form.startHour}:${form.startMin}`}
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(":").map(Number);
                    setForm({ ...form, startHour: h, startMin: m });
                  }}
                  style={{
                    width: "100%",
                    background: "rgba(20,30,36,0.9)",
                    border: "1px solid rgba(42,58,66,0.8)",
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: 12,
                    color: "rgba(220,235,240,0.9)",
                    outline: "none",
                  }}
                >
                  {HOURS.flatMap((h) =>
                    [0, 15, 30, 45].map((m) => (
                      <option key={`${h}:${m}`} value={`${h}:${m}`}>
                        {pad(h)}:{pad(m)}
                      </option>
                    )),
                  )}
                </select>
              </div>
              <div>
                <label
                  htmlFor="planner-end"
                  style={{
                    fontSize: 11,
                    color: "rgba(180,200,210,0.5)",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  End
                </label>
                <select
                  id="planner-end"
                  value={`${form.endHour}:${form.endMin}`}
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(":").map(Number);
                    setForm({ ...form, endHour: h, endMin: m });
                  }}
                  style={{
                    width: "100%",
                    background: "rgba(20,30,36,0.9)",
                    border: "1px solid rgba(42,58,66,0.8)",
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: 12,
                    color: "rgba(220,235,240,0.9)",
                    outline: "none",
                  }}
                >
                  {HOURS.flatMap((h) =>
                    [0, 15, 30, 45].map((m) => (
                      <option key={`${h}:${m}`} value={`${h}:${m}`}>
                        {pad(h)}:{pad(m)}
                      </option>
                    )),
                  )}
                </select>
              </div>
            </div>

            {/* Color */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(180,200,210,0.5)",
                  marginBottom: 6,
                }}
              >
                Color
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {EVENT_COLORS.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    title={COLOR_LABELS[i]}
                    onClick={() => setForm({ ...form, colorIdx: i })}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: `${c}0.8)`,
                      border:
                        form.colorIdx === i
                          ? "2px solid white"
                          : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Recurring toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <button
                type="button"
                data-ocid="planner.toggle"
                onClick={() => setForm({ ...form, recurring: !form.recurring })}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  background: form.recurring
                    ? `${ACCENT}0.8)`
                    : "var(--os-text-muted)",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: form.recurring ? 18 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "var(--os-text-primary)",
                    transition: "left 0.2s",
                  }}
                />
              </button>
              <span style={{ fontSize: 12, color: "rgba(180,200,210,0.7)" }}>
                <Repeat
                  style={{
                    width: 12,
                    height: 12,
                    display: "inline",
                    marginRight: 4,
                  }}
                />
                Repeat daily
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={handleSave}
                data-ocid="planner.save_button"
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
                Save Event
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                data-ocid="planner.cancel_button"
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
