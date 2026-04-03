import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useOSEventBus } from "../../context/OSEventBusContext";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type RepeatOption = "none" | "daily" | "weekly" | "monthly";

type EventCategory = "Work" | "Personal" | "Health" | "Other";

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  description: string;
  color: string;
  repeat?: RepeatOption;
  allDay?: boolean;
  category?: EventCategory;
}

const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  Work: "#3b82f6",
  Personal: "#22c55e",
  Health: "#ef4444",
  Other: "#6b7280",
};

const EVENT_COLORS = [
  { label: "Cyan", value: "#818cf8" },
  { label: "Orange", value: "#F97316" },
  { label: "Green", value: "#22C55E" },
  { label: "Red", value: "#EF4444" },
  { label: "Purple", value: "#A855F7" },
  { label: "Yellow", value: "#EAB308" },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const HOUR_H = 48; // px per hour in week view
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function newEmptyEvent(): Omit<CalendarEvent, "id" | "date"> {
  return {
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    color: EVENT_COLORS[0].value,
    repeat: "none",
    allDay: false,
    category: "Work",
  };
}

function timeToMinutes(time: string): number {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function minutesToPx(minutes: number): number {
  return (minutes / 60) * HOUR_H;
}

// Get the Sunday of the week containing a given date
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

type ModalMode = "add" | "edit";
type CalendarView = "month" | "week" | "day" | "agenda";

export function Calendar() {
  const today = new Date();
  const { subscribe } = useOSEventBus();
  const [view, setView] = useState<CalendarView>("month");
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(today));
  const [dragEventId, setDragEventId] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [weekEventDrag, setWeekEventDrag] = useState<{
    eventId: string;
    startY: number;
    startX: number;
    origStartTime: string;
    origEndTime: string;
    origDate: string;
    previewDate: string;
    previewStart: string;
    previewEnd: string;
  } | null>(null);
  const { data: persistedEvents, set: persistEvents } = useCanisterKV<
    CalendarEvent[]
  >("decentos_calendar_events", []);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calHydratedRef = useRef(false);

  useEffect(() => {
    if (calHydratedRef.current) return;
    calHydratedRef.current = true;
    if (persistedEvents.length > 0) setEvents(persistedEvents);
  }, [persistedEvents]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const weekScrollRef = useRef<HTMLDivElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState(newEmptyEvent());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [popupEvent, setPopupEvent] = useState<CalendarEvent | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  // Week view drag-to-create state
  const [weekDragState, setWeekDragState] = useState<{
    dayKey: string;
    startHour: number;
    endHour: number;
  } | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const [dayViewDate, setDayViewDate] = useState<Date>(() => new Date(today));
  const [quickAddText, setQuickAddText] = useState("");
  const [quickAddPopover, setQuickAddPopover] = useState<{
    date: string;
    x: number;
    y: number;
  } | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickTime, setQuickTime] = useState("");
  const quickTitleRef = useRef<HTMLInputElement>(null);

  // Tick current time every minute
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Scroll week view to current hour on mount
  useEffect(() => {
    if (view === "week" && weekScrollRef.current) {
      const scrollTo = minutesToPx(currentTime.getHours() * 60) - 100;
      weekScrollRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, [view, currentTime]);

  const saveEvents = useCallback(
    (evts: CalendarEvent[]) => {
      setEvents(evts);
      persistEvents(evts);
    },
    [persistEvents],
  );

  useEffect(() => {
    if (modalOpen) setTimeout(() => titleRef.current?.focus(), 50);
  }, [modalOpen]);

  // Subscribe to open-calendar event from other apps
  useEffect(() => {
    const unsub = subscribe("open-calendar", (payload) => {
      const p = payload as { title?: string; date?: string };
      const dateStr = p.date ?? new Date().toISOString().split("T")[0];
      setSelectedDate(dateStr);
      setModalMode("add");
      setEditingEvent(null);
      setDeleteConfirmId(null);
      setForm({
        ...newEmptyEvent(),
        title: p.title ?? "",
      });
      setModalOpen(true);
    });
    return unsub;
  }, [subscribe]);

  // Day nav
  const prevDay = useCallback(() => {
    setDayViewDate((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() - 1);
      return nd;
    });
  }, []);
  const nextDay = useCallback(() => {
    setDayViewDate((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() + 1);
      return nd;
    });
  }, []);

  // Natural language quick-add parser
  const parseEventText = useCallback(
    (text: string) => {
      const lower = text.toLowerCase();
      let title = text;
      let date = formatDateKey(today);
      let startTime = "";
      // Date extraction
      if (/\btoday\b/.test(lower)) {
        date = formatDateKey(today);
        title = title.replace(/\btoday\b/gi, "").trim();
      } else if (/\btomorrow\b/.test(lower)) {
        const d = new Date(today);
        d.setDate(d.getDate() + 1);
        date = formatDateKey(d);
        title = title.replace(/\btomorrow\b/gi, "").trim();
      } else {
        const days = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const nextMatch = lower.match(
          /\b(?:next )?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/,
        );
        if (nextMatch) {
          const target = days.indexOf(nextMatch[1] ?? "");
          const d = new Date(today);
          const cur = d.getDay();
          let diff = target - cur;
          if (diff <= 0 || /\bnext\b/.test(lower)) diff += 7;
          d.setDate(d.getDate() + diff);
          date = formatDateKey(d);
          title = title
            .replace(new RegExp(`\\b(?:next )?${nextMatch[1]}\\b`, "gi"), "")
            .trim();
        }
      }
      // Time extraction
      const timeMatch = lower.match(
        /\bat\s*(\d{1,2})(?::(\d{2}))?(am|pm)?\b|\b(\d{1,2})(?::(\d{2}))?(am|pm)\b/,
      );
      if (timeMatch) {
        let h = Number.parseInt(timeMatch[1] ?? timeMatch[4] ?? "0");
        const m = Number.parseInt(timeMatch[2] ?? timeMatch[5] ?? "0");
        const ampm = timeMatch[3] ?? timeMatch[6];
        if (ampm === "pm" && h < 12) h += 12;
        if (ampm === "am" && h === 12) h = 0;
        startTime = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        title = title.replace(timeMatch[0], "").trim();
      }
      title = title
        .replace(/\bat\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      return { title: title || "New Event", date, startTime };
    },
    [today],
  );

  const handleQuickAddBar = useCallback(() => {
    if (!quickAddText.trim()) return;
    const parsed = parseEventText(quickAddText);
    setSelectedDate(parsed.date);
    setModalMode("add");
    setEditingEvent(null);
    setDeleteConfirmId(null);
    setForm({
      ...newEmptyEvent(),
      title: parsed.title,
      startTime: parsed.startTime,
      endTime: parsed.startTime
        ? `${String(Number.parseInt(parsed.startTime.split(":")[0] ?? "0") + 1).padStart(2, "0")}:00`
        : "",
    });
    setModalOpen(true);
    setQuickAddText("");
  }, [quickAddText, parseEventText]);

  // Month nav
  const prevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }, [viewMonth]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }, [viewMonth]);

  const goToday = useCallback(() => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setWeekStart(getWeekStart(today));
    setDayViewDate(new Date(today));
  }, [today]);

  // Week nav
  const prevWeek = useCallback(() => {
    setWeekStart((d) => addDays(d, -7));
  }, []);

  const nextWeek = useCallback(() => {
    setWeekStart((d) => addDays(d, 7));
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const todayKey = dateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const openAddModal = (day: number, e?: React.MouseEvent) => {
    if (e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const key = dateKey(viewYear, viewMonth, day);
      setQuickAddPopover({ date: key, x: rect.left, y: rect.bottom + 4 });
      setQuickTitle("");
      setQuickTime("");
      setTimeout(() => quickTitleRef.current?.focus(), 50);
    } else {
      const key = dateKey(viewYear, viewMonth, day);
      setSelectedDate(key);
      setModalMode("add");
      setForm(newEmptyEvent());
      setEditingEvent(null);
      setDeleteConfirmId(null);
      setModalOpen(true);
    }
  };

  const handleQuickAdd = () => {
    if (!quickTitle.trim() || !quickAddPopover) return;
    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date: quickAddPopover.date,
      title: quickTitle.trim(),
      startTime: quickTime || "",
      endTime: "",
      description: "",
      color: EVENT_COLORS[0]?.value ?? "#818cf8",
      allDay: !quickTime,
    };
    saveEvents([...events, newEvt]);
    setQuickAddPopover(null);
    setQuickTitle("");
    setQuickTime("");
    toast.success("Event added");
  };

  const openFullModalFromQuick = () => {
    if (!quickAddPopover) return;
    setSelectedDate(quickAddPopover.date);
    setModalMode("add");
    setForm({ ...newEmptyEvent(), title: quickTitle, startTime: quickTime });
    setEditingEvent(null);
    setDeleteConfirmId(null);
    setQuickAddPopover(null);
    setModalOpen(true);
  };

  const openAddModalForWeek = (dayKey: string, hour: number) => {
    setSelectedDate(dayKey);
    setModalMode("add");
    setForm({
      ...newEmptyEvent(),
      startTime: `${String(hour).padStart(2, "0")}:00`,
      endTime: `${String(Math.min(hour + 1, 23)).padStart(2, "0")}:00`,
    });
    setEditingEvent(null);
    setDeleteConfirmId(null);
    setModalOpen(true);
  };

  const openEditModal = (evt: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(evt.date);
    setModalMode("edit");
    setEditingEvent(evt);
    setForm({
      title: evt.title,
      startTime: evt.startTime,
      endTime: evt.endTime,
      description: evt.description,
      color: evt.color,
      allDay: evt.allDay ?? false,
      repeat: evt.repeat ?? "none",
      category: evt.category ?? "Work",
    });
    setDeleteConfirmId(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !selectedDate) return;
    if (modalMode === "add") {
      const newEvt: CalendarEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: selectedDate,
        ...form,
        title: form.title.trim(),
      };
      saveEvents([...events, newEvt]);
    } else if (editingEvent) {
      saveEvents(
        events.map((e) =>
          e.id === editingEvent.id
            ? { ...editingEvent, ...form, title: form.title.trim() }
            : e,
        ),
      );
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    saveEvents(events.filter((e) => e.id !== id));
    setDeleteConfirmId(null);
    setModalOpen(false);
  };

  const [activeFilter, setActiveFilter] = useState<EventCategory | "All">(
    "All",
  );
  const filteredEvents =
    activeFilter === "All"
      ? events
      : events.filter(
          (e) =>
            e.category === activeFilter ||
            (!e.category && activeFilter === "Other"),
        );

  const dayEventsMap: Record<string, CalendarEvent[]> = {};
  for (const evt of filteredEvents) {
    if (!dayEventsMap[evt.date]) dayEventsMap[evt.date] = [];
    dayEventsMap[evt.date].push(evt);
  }

  const cells: Array<{ key: string; day: number | null }> = [
    ...Array.from({ length: firstDayOfWeek }, (_, pos) => ({
      key: `${viewYear}-${viewMonth}-blank-${pos}`,
      day: null,
    })),
    ...Array.from({ length: daysInMonth }, (_, pos) => ({
      key: dateKey(viewYear, viewMonth, pos + 1),
      day: pos + 1,
    })),
  ];

  // Week view days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    return { date: d, key: formatDateKey(d) };
  });

  const weekLabel = `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} \u2013 ${MONTH_NAMES[addDays(weekStart, 6).getMonth()]} ${addDays(weekStart, 6).getDate()}, ${addDays(weekStart, 6).getFullYear()}`;

  // Current time indicator offset
  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const nowPx = minutesToPx(nowMinutes);
  const isCurrentWeek =
    formatDateKey(getWeekStart(today)) === formatDateKey(weekStart);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--os-bg-app, #1c1c1e)" }}
      data-ocid="calendar.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{
          borderColor: "var(--os-border-subtle)",
          background: "var(--os-bg-elevated)",
        }}
      >
        <button
          type="button"
          onClick={
            view === "month" ? prevMonth : view === "week" ? prevWeek : prevDay
          }
          data-ocid="calendar.pagination_prev"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <h2
            className="text-sm font-semibold"
            style={{ color: "rgba(99,102,241,1)" }}
          >
            {/* Category filter bar */}
            <div
              className="flex items-center gap-1.5 px-4 py-1.5 border-b flex-shrink-0 overflow-x-auto"
              style={{ borderColor: "var(--os-border-subtle)" }}
            >
              {(
                ["All", "Work", "Personal", "Health", "Other"] as Array<
                  EventCategory | "All"
                >
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className="px-2.5 py-0.5 rounded text-[10px] whitespace-nowrap transition-all"
                  style={{
                    background:
                      activeFilter === cat
                        ? cat === "All"
                          ? "rgba(99,102,241,0.25)"
                          : `${EVENT_CATEGORY_COLORS[cat as EventCategory]}25`
                        : "var(--os-border-subtle)",
                    color:
                      activeFilter === cat
                        ? cat === "All"
                          ? "#818cf8"
                          : EVENT_CATEGORY_COLORS[cat as EventCategory]
                        : "var(--os-text-secondary)",
                    border:
                      activeFilter === cat
                        ? cat === "All"
                          ? "1px solid rgba(99,102,241,0.4)"
                          : `1px solid ${EVENT_CATEGORY_COLORS[cat as EventCategory]}44`
                        : "1px solid var(--os-border-subtle)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {view === "month"
              ? `${MONTH_NAMES[viewMonth]} ${viewYear}`
              : view === "week"
                ? weekLabel
                : view === "day"
                  ? `${DAY_NAMES_FULL[dayViewDate.getDay()]}, ${MONTH_NAMES[dayViewDate.getMonth()]} ${dayViewDate.getDate()}`
                  : "Upcoming Events"}
          </h2>
          <button
            type="button"
            onClick={goToday}
            data-ocid="calendar.secondary_button"
            className="text-[10px] px-2 py-0.5 rounded hover:bg-muted/50 text-muted-foreground/60 hover:text-foreground transition-colors"
            style={{ border: "1px solid var(--os-border-subtle)" }}
          >
            Today
          </button>
          {/* View toggle */}
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(99,102,241,0.2)" }}
          >
            {(["month", "week", "day", "agenda"] as CalendarView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setView(v);
                  if (v === "day") setDayViewDate(new Date(today));
                }}
                data-ocid="calendar.tab"
                className="text-[10px] px-2 py-0.5 transition-colors capitalize"
                style={{
                  background:
                    view === v ? "rgba(99,102,241,0.2)" : "transparent",
                  color: view === v ? "#818cf8" : "var(--os-text-secondary)",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={
            view === "month" ? nextMonth : view === "week" ? nextWeek : nextDay
          }
          data-ocid="calendar.pagination_next"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick-add bar */}
      <div
        className="px-3 py-1.5 flex-shrink-0"
        style={{
          borderBottom: "1px solid var(--os-border-subtle)",
          background: "var(--os-bg-elevated)",
        }}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={quickAddText}
            onChange={(e) => setQuickAddText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuickAddBar()}
            placeholder="Quick add... e.g. 'team sync tomorrow 2pm'"
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: "var(--os-text-secondary)", padding: "4px 0" }}
          />
          {quickAddText && (
            <button
              type="button"
              onClick={handleQuickAddBar}
              className="text-[10px] px-2 py-0.5 rounded"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "rgba(99,102,241,0.9)",
              }}
            >
              Add
            </button>
          )}
        </div>
      </div>

      {view === "month" ? (
        <>
          {/* Day labels */}
          <div
            className="grid grid-cols-7 px-2 py-1 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}
          >
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-semibold tracking-widest"
                style={{ color: "var(--os-text-muted)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 grid grid-cols-7 p-2 gap-1 overflow-y-auto content-start">
            {cells.map(({ key, day }) => {
              if (day === null) return <div key={key} />;
              const isToday = key === todayKey;
              const dayEvts = dayEventsMap[key] ?? [];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={(e) => {
                    if (!dragEventId) openAddModal(day, e);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverKey(key);
                  }}
                  onDragLeave={() => setDragOverKey(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverKey(null);
                    if (!dragEventId) return;
                    setEvents((prev) => {
                      const updated = prev.map((ev) =>
                        ev.id === dragEventId ? { ...ev, date: key } : ev,
                      );
                      persistEvents(updated);
                      return updated;
                    });
                    setDragEventId(null);
                  }}
                  data-ocid={`calendar.item.${day}`}
                  className="flex flex-col rounded-lg p-1 min-h-[52px] hover:bg-muted/50 transition-colors text-left"
                  style={{
                    border:
                      dragOverKey === key && dragEventId
                        ? "1px solid rgba(99,102,241,0.7)"
                        : isToday
                          ? "1px solid rgba(99,102,241,0.6)"
                          : "1px solid var(--os-border-subtle)",
                    background:
                      dragOverKey === key && dragEventId
                        ? "rgba(99,102,241,0.1)"
                        : isToday
                          ? "rgba(99,102,241,0.06)"
                          : "var(--os-border-subtle)",
                  }}
                >
                  <span
                    className="text-[11px] font-semibold mb-1"
                    style={{
                      color: isToday
                        ? "rgba(99,102,241,1)"
                        : "var(--os-text-secondary)",
                    }}
                  >
                    {day}
                  </span>
                  <div className="flex flex-col gap-0.5 w-full">
                    {dayEvts.slice(0, 2).map((evt) => (
                      <button
                        key={evt.id}
                        type="button"
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          setDragEventId(evt.id);
                        }}
                        onDragEnd={() => setDragEventId(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopupEvent(evt);
                          setPopupPos({ x: e.clientX, y: e.clientY });
                        }}
                        className="text-[8px] font-medium leading-tight truncate rounded px-1 text-left w-full group hover:opacity-80 transition-opacity flex items-center gap-0.5"
                        style={{
                          background: `${evt.color}22`,
                          color: evt.color,
                          border: `1px solid ${evt.color}44`,
                          cursor: "grab",
                        }}
                      >
                        {evt.startTime && (
                          <span className="opacity-70">{evt.startTime}</span>
                        )}
                        <span className="truncate">{evt.title}</span>
                        {evt.repeat && evt.repeat !== "none" && (
                          <span
                            className="text-[7px] opacity-60 flex-shrink-0"
                            title={evt.repeat}
                          >
                            ↻
                          </span>
                        )}
                        <Edit2 className="w-2 h-2 flex-shrink-0 opacity-0 group-hover:opacity-60" />
                      </button>
                    ))}
                    {dayEvts.length > 2 && (
                      <span className="text-[8px] text-muted-foreground/50">
                        +{dayEvts.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : view === "agenda" ? (
        /* ---- AGENDA VIEW ---- */
        <div className="flex-1 overflow-y-auto p-4">
          {(() => {
            const agendaDays: {
              key: string;
              date: Date;
              evts: CalendarEvent[];
            }[] = [];
            for (let i = 0; i < 60; i++) {
              const d = new Date(today);
              d.setDate(d.getDate() + i);
              const k = formatDateKey(d);
              const evts = (dayEventsMap[k] ?? []).filter(
                (e) => !e.allDay || e.allDay,
              );
              if (evts.length > 0) agendaDays.push({ key: k, date: d, evts });
            }
            if (agendaDays.length === 0)
              return (
                <div
                  className="flex flex-col items-center justify-center h-full gap-2"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  <p className="text-sm">
                    No upcoming events in the next 60 days
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(formatDateKey(today));
                      setModalMode("add");
                      setForm(newEmptyEvent());
                      setEditingEvent(null);
                      setDeleteConfirmId(null);
                      setModalOpen(true);
                    }}
                    className="text-xs px-3 py-1.5 rounded"
                    style={{
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "rgba(99,102,241,0.9)",
                    }}
                  >
                    + Add Event
                  </button>
                </div>
              );
            return agendaDays.map(({ key: dk, date: dd, evts }) => (
              <div key={dk} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{
                      color:
                        dk === formatDateKey(today)
                          ? "rgba(99,102,241,1)"
                          : "var(--os-text-muted)",
                    }}
                  >
                    {dk === formatDateKey(today) ? "TODAY • " : ""}
                    {DAY_NAMES_FULL[dd.getDay()]}, {MONTH_NAMES[dd.getMonth()]}{" "}
                    {dd.getDate()}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--os-border-subtle)" }}
                  />
                </div>
                <div className="space-y-1.5">
                  {evts
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((evt) => (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={(e) => openEditModal(evt, e)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg text-left hover:opacity-80 transition-opacity"
                        style={{
                          background: `${evt.color}11`,
                          border: `1px solid ${evt.color}33`,
                        }}
                      >
                        <div
                          className="w-0.5 h-8 rounded-full flex-shrink-0"
                          style={{ background: evt.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs font-medium truncate"
                            style={{ color: "var(--os-text-primary)" }}
                          >
                            {evt.title}
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: "var(--os-text-muted)" }}
                          >
                            {evt.allDay
                              ? "All day"
                              : `${evt.startTime}${evt.endTime ? ` – ${evt.endTime}` : ""}`}
                          </p>
                        </div>
                        {evt.category && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              background: `${EVENT_CATEGORY_COLORS[evt.category]}22`,
                              color: EVENT_CATEGORY_COLORS[evt.category],
                              border: `1px solid ${EVENT_CATEGORY_COLORS[evt.category]}44`,
                            }}
                          >
                            {evt.category}
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            ));
          })()}
        </div>
      ) : view === "day" ? (
        /* ---- DAY VIEW ---- */
        <div className="flex flex-col flex-1 overflow-hidden">
          <div
            className="flex flex-shrink-0 border-b"
            style={{ borderColor: "rgba(99,102,241,0.1)" }}
          >
            <div className="w-12 flex-shrink-0" />
            <div
              className="flex-1 text-center py-1.5"
              style={{
                background:
                  formatDateKey(dayViewDate) === todayKey
                    ? "rgba(99,102,241,0.05)"
                    : "transparent",
              }}
            >
              <p
                className="text-[9px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--os-text-muted)" }}
              >
                {DAY_NAMES_FULL[dayViewDate.getDay()]}
              </p>
              <p
                className="text-sm font-bold"
                style={{
                  color:
                    formatDateKey(dayViewDate) === todayKey
                      ? "#818cf8"
                      : "var(--os-text-secondary)",
                }}
              >
                {dayViewDate.getDate()}
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div
              className="flex"
              style={{ height: `${HOUR_H * 24}px`, position: "relative" }}
            >
              <div className="w-12 flex-shrink-0 relative">
                {HOURS.map((hour) => (
                  <div
                    key={`hour-${hour}`}
                    className="absolute right-1 text-[9px]"
                    style={{
                      top: hour * HOUR_H - 6,
                      color: "var(--os-text-muted)",
                    }}
                  >
                    {String(hour).padStart(2, "0")}:00
                  </div>
                ))}
              </div>
              <div
                className="flex-1 relative"
                style={{
                  borderLeft: "1px solid var(--os-border-subtle)",
                  background:
                    formatDateKey(dayViewDate) === todayKey
                      ? "rgba(99,102,241,0.01)"
                      : "transparent",
                }}
              >
                {HOURS.map((hour) => (
                  <div
                    key={`hour-${hour}`}
                    role="button"
                    tabIndex={0}
                    className="absolute w-full hover:bg-muted/50 transition-colors cursor-crosshair"
                    style={{
                      top: hour * HOUR_H,
                      height: HOUR_H,
                      borderTop: "1px solid var(--os-border-subtle)",
                    }}
                    onClick={() =>
                      openAddModalForWeek(formatDateKey(dayViewDate), hour)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      openAddModalForWeek(formatDateKey(dayViewDate), hour)
                    }
                  />
                ))}
                {(dayEventsMap[formatDateKey(dayViewDate)] ?? [])
                  .filter((e) => e.startTime && !e.allDay)
                  .map((evt) => {
                    const startMin = timeToMinutes(evt.startTime);
                    const endMin = timeToMinutes(evt.endTime);
                    const duration = Math.max(endMin - startMin, 30);
                    const isBeingDragged = weekEventDrag?.eventId === evt.id;
                    const displayStart = isBeingDragged
                      ? weekEventDrag.previewStart
                      : evt.startTime;
                    const displayStartMin = timeToMinutes(displayStart);
                    const currentDayKey = formatDateKey(dayViewDate);
                    return (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={(e) => {
                          if (!weekEventDrag) openEditModal(evt, e);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setWeekEventDrag({
                            eventId: evt.id,
                            startY: e.clientY,
                            startX: e.clientX,
                            origStartTime: evt.startTime,
                            origEndTime: evt.endTime,
                            origDate: currentDayKey,
                            previewDate: currentDayKey,
                            previewStart: evt.startTime,
                            previewEnd: evt.endTime,
                          });
                        }}
                        className="absolute left-1 right-1 rounded text-left px-1.5 py-0.5 overflow-hidden hover:opacity-90"
                        style={{
                          top: minutesToPx(
                            isBeingDragged ? displayStartMin : startMin,
                          ),
                          height: Math.max(minutesToPx(duration), 20),
                          background: `${evt.color}22`,
                          border: `1px solid ${evt.color}55`,
                          color: evt.color,
                          zIndex: isBeingDragged ? 20 : 2,
                          cursor: "grab",
                          opacity: isBeingDragged ? 0.7 : 1,
                          transform: isBeingDragged
                            ? "scale(0.97)"
                            : "scale(1)",
                          transition: isBeingDragged
                            ? "none"
                            : "opacity 0.15s, transform 0.15s",
                        }}
                      >
                        <p className="text-[9px] font-semibold truncate">
                          {evt.title}
                        </p>
                        <p className="text-[8px] opacity-70">
                          {displayStart}–{evt.endTime}
                        </p>
                      </button>
                    );
                  })}
                {formatDateKey(dayViewDate) === todayKey && (
                  <div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{ top: nowPx, zIndex: 10 }}
                  >
                    <div
                      className="h-0.5 w-full"
                      style={{ background: "rgba(239,68,68,0.8)" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ---- WEEK VIEW ---- */
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Day header row */}
          <div
            className="flex flex-shrink-0 border-b"
            style={{ borderColor: "rgba(99,102,241,0.1)" }}
          >
            {/* Time gutter header */}
            <div className="w-12 flex-shrink-0" />
            {weekDays.map(({ date, key }) => {
              const isToday = key === todayKey;
              return (
                <div
                  key={key}
                  className="flex-1 text-center py-1.5"
                  style={{
                    borderLeft: "1px solid var(--os-border-subtle)",
                    background: isToday
                      ? "rgba(99,102,241,0.05)"
                      : "transparent",
                  }}
                >
                  <p
                    className="text-[9px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    {DAY_NAMES_FULL[date.getDay()].slice(0, 3)}
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: isToday ? "#818cf8" : "var(--os-text-secondary)",
                    }}
                  >
                    {date.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* All-day events banner row */}
          {weekDays.some(({ key }) =>
            (dayEventsMap[key] ?? []).some((e) => e.allDay),
          ) && (
            <div
              className="flex flex-shrink-0 border-b"
              style={{ borderColor: "rgba(99,102,241,0.1)" }}
            >
              <div className="w-12 flex-shrink-0 text-[8px] text-muted-foreground/50 flex items-center justify-end pr-1">
                all-day
              </div>
              {weekDays.map(({ key: dayKey }) => {
                const allDayEvts = (dayEventsMap[dayKey] ?? []).filter(
                  (e) => e.allDay,
                );
                return (
                  <div
                    key={dayKey}
                    className="flex-1 px-0.5 py-0.5 space-y-0.5 min-h-[20px]"
                    style={{ borderLeft: "1px solid var(--os-border-subtle)" }}
                  >
                    {allDayEvts.map((evt) => (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={(e) => openEditModal(evt, e)}
                        className="w-full rounded text-left px-1.5 py-0.5 text-[9px] font-semibold truncate hover:opacity-80 transition-opacity"
                        style={{
                          background: `${evt.color}33`,
                          border: `1px solid ${evt.color}66`,
                          color: evt.color,
                        }}
                      >
                        {evt.title}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Scrollable time grid */}
          <div
            ref={weekScrollRef}
            className="flex-1 overflow-y-auto"
            onMouseLeave={() => {
              setWeekDragState(null);
            }}
            onMouseUp={() => {
              setWeekDragState(null);
              if (weekEventDrag) {
                const { eventId, previewDate, previewStart, previewEnd } =
                  weekEventDrag;
                setEvents((prev) => {
                  const updated = prev.map((ev) =>
                    ev.id === eventId
                      ? {
                          ...ev,
                          date: previewDate,
                          startTime: previewStart,
                          endTime: previewEnd,
                        }
                      : ev,
                  );
                  persistEvents(updated);
                  return updated;
                });
                setWeekEventDrag(null);
              }
            }}
            onMouseMove={(e) => {
              if (weekEventDrag) {
                const dy = e.clientY - weekEventDrag.startY;
                const minutesDelta = Math.round(((dy / HOUR_H) * 60) / 15) * 15;
                const origStart = timeToMinutes(weekEventDrag.origStartTime);
                const origEnd = timeToMinutes(weekEventDrag.origEndTime);
                const dur = origEnd - origStart;
                const newStart = Math.max(
                  0,
                  Math.min(23 * 60, origStart + minutesDelta),
                );
                const newEnd = newStart + dur;
                const fmt = (m: number) =>
                  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
                setWeekEventDrag((prev) =>
                  prev
                    ? {
                        ...prev,
                        previewStart: fmt(newStart),
                        previewEnd: fmt(Math.min(1440, newEnd)),
                      }
                    : prev,
                );
              }
            }}
          >
            <div
              className="flex"
              style={{ height: `${HOUR_H * 24}px`, position: "relative" }}
            >
              {/* Hour labels */}
              <div className="w-12 flex-shrink-0 relative">
                {HOURS.map((hour) => (
                  <div
                    key={`hour-${hour}`}
                    className="absolute right-1 text-[9px] text-muted-foreground/50"
                    style={{ top: hour * HOUR_H - 6 }}
                  >
                    {String(hour).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map(({ key: dayKey }) => {
                const isToday = dayKey === todayKey;
                const dayEvts = (dayEventsMap[dayKey] ?? []).filter(
                  (e) => e.startTime && e.endTime && !e.allDay,
                );

                return (
                  <div
                    key={dayKey}
                    className="flex-1 relative"
                    style={{
                      borderLeft: "1px solid var(--os-border-subtle)",
                      background: isToday
                        ? "rgba(99,102,241,0.02)"
                        : "transparent",
                    }}
                  >
                    {/* Hour grid lines */}
                    {HOURS.map((hour) => (
                      <div
                        key={`hour-${hour}`}
                        className="absolute w-full hover:bg-muted/50 transition-colors cursor-crosshair"
                        style={{
                          top: hour * HOUR_H,
                          height: HOUR_H,
                          borderTop: "1px solid var(--os-border-subtle)",
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setWeekDragState({
                            dayKey,
                            startHour: hour,
                            endHour: hour,
                          });
                        }}
                        onMouseEnter={() => {
                          setWeekDragState((prev) =>
                            prev && prev.dayKey === dayKey
                              ? { ...prev, endHour: hour }
                              : prev,
                          );
                        }}
                        onMouseUp={() => {
                          if (
                            weekDragState &&
                            weekDragState.dayKey === dayKey
                          ) {
                            const start = Math.min(
                              weekDragState.startHour,
                              hour,
                            );
                            const end =
                              Math.max(weekDragState.startHour, hour) + 1;
                            setWeekDragState(null);
                            openAddModalForWeek(dayKey, start);
                            setForm((f) => ({
                              ...f,
                              startTime: `${String(start).padStart(2, "0")}:00`,
                              endTime: `${String(Math.min(end, 23)).padStart(2, "0")}:00`,
                            }));
                          }
                        }}
                      />
                    ))}
                    {/* Drag preview */}
                    {weekDragState?.dayKey === dayKey && (
                      <div
                        className="absolute left-0.5 right-0.5 pointer-events-none rounded"
                        style={{
                          top:
                            Math.min(
                              weekDragState.startHour,
                              weekDragState.endHour,
                            ) * HOUR_H,
                          height:
                            (Math.abs(
                              weekDragState.endHour - weekDragState.startHour,
                            ) +
                              1) *
                            HOUR_H,
                          background: "rgba(99,102,241,0.15)",
                          border: "1px dashed rgba(99,102,241,0.5)",
                          zIndex: 3,
                        }}
                      />
                    )}

                    {/* Events */}
                    {dayEvts.map((evt) => {
                      const startMin = timeToMinutes(evt.startTime);
                      const endMin = timeToMinutes(evt.endTime);
                      const duration = Math.max(endMin - startMin, 30);
                      const top = minutesToPx(startMin);
                      const height = minutesToPx(duration);
                      return (
                        <button
                          key={evt.id}
                          type="button"
                          onClick={(e) => openEditModal(evt, e)}
                          className="absolute left-0.5 right-0.5 rounded text-left px-1.5 py-0.5 overflow-hidden group hover:opacity-90 transition-opacity"
                          style={{
                            top,
                            height: Math.max(height, 20),
                            background: `${evt.color}22`,
                            border: `1px solid ${evt.color}55`,
                            color: evt.color,
                            zIndex: 2,
                          }}
                        >
                          <p className="text-[9px] font-semibold leading-tight truncate">
                            {evt.title}
                          </p>
                          {height > 28 && (
                            <p className="text-[8px] opacity-70">
                              {evt.startTime}\u2013{evt.endTime}
                            </p>
                          )}
                        </button>
                      );
                    })}

                    {/* Current time indicator */}
                    {isCurrentWeek && isToday && (
                      <div
                        className="absolute left-0 right-0 pointer-events-none"
                        style={{ top: nowPx, zIndex: 10 }}
                      >
                        <div
                          className="h-0.5 w-full"
                          style={{ background: "rgba(239,68,68,0.8)" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full absolute -top-0.5 -left-1"
                          style={{ background: "#EF4444" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick-add popover */}
      {quickAddPopover && (
        <div
          className="fixed z-50"
          style={{
            left: Math.min(quickAddPopover.x, window.innerWidth - 260),
            top: quickAddPopover.y,
          }}
          data-ocid="calendar.popover"
        >
          <div
            className="rounded-xl p-3 flex flex-col gap-2"
            style={{
              width: 240,
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-window)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <input
              ref={quickTitleRef}
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleQuickAdd();
                if (e.key === "Escape") setQuickAddPopover(null);
              }}
              placeholder="Event title"
              data-ocid="calendar.input"
              className="w-full rounded px-2 py-1 text-xs outline-none"
              style={{
                background: "var(--os-bg-app)",
                border: "1px solid var(--os-border-subtle)",
                color: "var(--os-text-primary)",
              }}
            />
            <input
              type="time"
              value={quickTime}
              onChange={(e) => setQuickTime(e.target.value)}
              className="w-full rounded px-2 py-1 text-xs outline-none"
              style={{
                background: "var(--os-bg-app)",
                border: "1px solid var(--os-border-subtle)",
                color: "var(--os-text-primary)",
              }}
            />
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleQuickAdd}
                data-ocid="calendar.primary_button"
                className="flex-1 py-1 rounded text-xs font-medium transition-all"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.35)",
                  color: "rgba(99,102,241,1)",
                }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={openFullModalFromQuick}
                data-ocid="calendar.secondary_button"
                className="text-xs py-1 px-2 rounded transition-colors"
                style={{
                  color: "var(--os-text-secondary)",
                  background: "var(--os-border-subtle)",
                }}
              >
                More options
              </button>
            </div>
          </div>
        </div>
      )}
      {quickAddPopover && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss
        <div
          className="fixed inset-0 z-40"
          onClick={() => setQuickAddPopover(null)}
        />
      )}

      {/* Empty state hint */}
      {events.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 5, top: 80 }}
        >
          <p
            style={{
              fontSize: 11,
              color: "var(--os-text-muted)",
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            Nothing here yet — click any day to add an event
          </p>
        </div>
      )}

      {/* Event Form Sidebar */}
      {modalOpen && (
        <div
          className="absolute inset-0 z-40"
          data-ocid="calendar.modal"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="absolute inset-0"
            style={{ pointerEvents: "auto", cursor: "default" }}
            role="presentation"
            onClick={() => setModalOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setModalOpen(false);
            }}
          />
        </div>
      )}
      <div
        className="absolute top-0 bottom-0 right-0 flex flex-col overflow-hidden z-50"
        data-ocid="calendar.modal"
        style={{
          width: 300,
          background: "var(--os-bg-window)",
          borderLeft: "1px solid rgba(99,102,241,0.25)",
          boxShadow: modalOpen ? "-8px 0 32px rgba(0,0,0,0.4)" : "none",
          transform: modalOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className="flex flex-col overflow-hidden h-full"
          style={{ background: "var(--os-bg-window)" }}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "rgba(99,102,241,0.15)" }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "#818cf8" }}
            >
              {modalMode === "add"
                ? `Add Event \u2014 ${selectedDate}`
                : `Edit Event \u2014 ${selectedDate}`}
            </span>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              data-ocid="calendar.close_button"
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Title */}
            <input
              ref={titleRef}
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Event title *"
              data-ocid="calendar.input"
              className="w-full rounded-lg px-3 py-2 text-xs bg-transparent outline-none"
              style={{
                border: "1px solid rgba(99,102,241,0.25)",
                color: "var(--os-text-primary)",
              }}
            />

            {/* All day toggle */}
            <label
              className="flex items-center gap-2 cursor-pointer"
              data-ocid="calendar.allday.toggle"
            >
              <input
                type="checkbox"
                checked={form.allDay ?? false}
                onChange={(e) =>
                  setForm((f) => ({ ...f, allDay: e.target.checked }))
                }
                className="w-3.5 h-3.5 accent-cyan-400"
              />
              <span
                className="text-[11px]"
                style={{ color: "var(--os-text-secondary)" }}
              >
                All day
              </span>
            </label>

            {/* Start / End time */}
            {!form.allDay && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-muted-foreground/60 mb-1 block">
                    Start time
                  </span>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, startTime: e.target.value }))
                    }
                    className="w-full rounded-lg px-2 py-1.5 text-xs bg-transparent outline-none"
                    style={{
                      border: "1px solid var(--os-border-subtle)",
                      color: "var(--os-text-primary)",
                      colorScheme: "dark",
                    }}
                  />
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground/60 mb-1 block">
                    End time
                  </span>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, endTime: e.target.value }))
                    }
                    className="w-full rounded-lg px-2 py-1.5 text-xs bg-transparent outline-none"
                    style={{
                      border: "1px solid var(--os-border-subtle)",
                      color: "var(--os-text-primary)",
                      colorScheme: "dark",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Description (optional)"
              rows={2}
              className="w-full rounded-lg px-3 py-2 text-xs bg-transparent outline-none resize-none"
              style={{
                border: "1px solid var(--os-text-muted)",
                color: "var(--os-text-secondary)",
              }}
            />

            {/* Category picker */}
            <div>
              <span className="text-[9px] text-muted-foreground/60 mb-1.5 block">
                Category
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  ["Work", "Personal", "Health", "Other"] as EventCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: cat }))}
                    className="px-2 py-0.5 rounded text-[10px] transition-all"
                    style={{
                      background:
                        form.category === cat
                          ? `${EVENT_CATEGORY_COLORS[cat]}33`
                          : "var(--os-border-subtle)",
                      color:
                        form.category === cat
                          ? EVENT_CATEGORY_COLORS[cat]
                          : "var(--os-text-secondary)",
                      border:
                        form.category === cat
                          ? `1px solid ${EVENT_CATEGORY_COLORS[cat]}66`
                          : "1px solid var(--os-text-muted)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <span className="text-[9px] text-muted-foreground/60 mb-1.5 block">
                Color
              </span>
              <div className="flex items-center gap-2">
                {EVENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                    title={c.label}
                    className="w-6 h-6 rounded-full transition-all"
                    style={{
                      background: c.value,
                      transform:
                        form.color === c.value ? "scale(1.25)" : "scale(1)",
                      boxShadow:
                        form.color === c.value ? `0 0 8px ${c.value}` : "none",
                      border:
                        form.color === c.value
                          ? "2px solid white"
                          : "2px solid transparent",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Repeat */}
            <div>
              <span className="text-[9px] text-muted-foreground/60 mb-1.5 block">
                Repeat
              </span>
              <select
                value={form.repeat ?? "none"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    repeat: e.target.value as RepeatOption,
                  }))
                }
                className="w-full rounded-lg px-3 py-1.5 text-xs outline-none"
                style={{
                  background: "var(--os-bg-elevated)",
                  border: "1px solid var(--os-border-subtle)",
                  color: "var(--os-text-primary)",
                  colorScheme: "dark",
                }}
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={!form.title.trim()}
                data-ocid="calendar.primary_button"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.35)",
                  color: "#818cf8",
                }}
              >
                {modalMode === "add" ? (
                  <>
                    <Plus className="w-3.5 h-3.5" /> Add Event
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3.5 h-3.5" /> Save Changes
                  </>
                )}
              </button>

              {modalMode === "edit" &&
                editingEvent &&
                (deleteConfirmId === editingEvent.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(editingEvent.id)}
                      data-ocid="calendar.confirm_button"
                      className="text-[10px] px-2 py-1.5 rounded"
                      style={{
                        background: "rgba(239,68,68,0.2)",
                        color: "#EF4444",
                        border: "1px solid rgba(239,68,68,0.35)",
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      data-ocid="calendar.cancel_button"
                      className="text-[10px] px-2 py-1.5 rounded text-muted-foreground/60 hover:text-foreground"
                      style={{ border: "1px solid var(--os-text-muted)" }}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(editingEvent.id)}
                    data-ocid="calendar.delete_button"
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-muted-foreground/60 hover:text-red-400 transition-colors"
                    style={{ border: "1px solid var(--os-border-subtle)" }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
      {/* Event Detail Popup */}
      {popupEvent && popupPos && (
        <div
          role="presentation"
          onClick={() => {
            setPopupEvent(null);
            setPopupPos(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setPopupEvent(null);
              setPopupPos(null);
            }
          }}
          style={{ position: "fixed", inset: 0, zIndex: 1000 }}
        >
          <div
            role="presentation"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              left: Math.min(popupPos.x + 8, window.innerWidth - 220),
              top: Math.min(popupPos.y + 8, window.innerHeight - 160),
              width: 200,
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              borderRadius: 10,
              padding: "12px 14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              zIndex: 1001,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: popupEvent.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "var(--os-text-primary)",
                  fontWeight: 600,
                  fontSize: 13,
                  flex: 1,
                }}
              >
                {popupEvent.title}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPopupEvent(null);
                  setPopupPos(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--os-text-muted)",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
            {(popupEvent.startTime || popupEvent.endTime) && (
              <div
                style={{
                  color: "var(--os-text-secondary)",
                  fontSize: 11,
                  marginBottom: 4,
                }}
              >
                🕐 {popupEvent.startTime}
                {popupEvent.endTime ? ` – ${popupEvent.endTime}` : ""}
              </div>
            )}
            {popupEvent.category && (
              <div
                style={{
                  color: "var(--os-text-secondary)",
                  fontSize: 11,
                  marginBottom: 4,
                }}
              >
                📂 {popupEvent.category}
              </div>
            )}
            {popupEvent.description && (
              <div
                style={{
                  color: "var(--os-text-muted)",
                  fontSize: 11,
                  marginTop: 6,
                  borderTop: "1px solid var(--os-border-subtle)",
                  paddingTop: 6,
                }}
              >
                {popupEvent.description}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                openEditModal(popupEvent, {} as React.MouseEvent);
                setPopupEvent(null);
                setPopupPos(null);
              }}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "5px",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: 6,
                color: "#818cf8",
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Edit Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
