import {
  Calendar,
  Clock,
  Pause,
  Play,
  RefreshCw,
  StickyNote,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface CalEvent {
  id: string;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  allDay?: boolean;
}

const POMODORO_MINUTES = 25;

export default function MindCalendar() {
  const today = new Date().toISOString().split("T")[0];
  const { data: quickNotes, set: saveQuickNotes } = useCanisterKV<string>(
    "mindcalendar_notes",
    "",
  );
  const { data: allEvents } = useCanisterKV<CalEvent[]>("calendar_events", []);

  const todayEvents = allEvents
    .filter((e) => e.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Pomodoro timer
  const [timerSeconds, setTimerSeconds] = useState(POMODORO_MINUTES * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSession, setTimerSession] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setTimerSession((s) => s + 1);
            return POMODORO_MINUTES * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  function resetTimer() {
    setTimerRunning(false);
    setTimerSeconds(POMODORO_MINUTES * 60);
  }

  const minutes = Math.floor(timerSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timerSeconds % 60).toString().padStart(2, "0");
  const progressPct =
    ((POMODORO_MINUTES * 60 - timerSeconds) / (POMODORO_MINUTES * 60)) * 100;

  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "var(--os-bg-app)",
        color: "var(--os-text-primary)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "var(--os-border)" }}
      >
        <Calendar size={15} style={{ color: "var(--os-accent)" }} />
        <div>
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--os-text-primary)" }}
          >
            {dayName}
          </span>
          <span
            className="text-xs ml-2"
            style={{ color: "var(--os-text-muted)" }}
          >
            {dateStr}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: quick notes */}
        <div
          className="flex flex-col w-1/2 border-r overflow-hidden"
          style={{ borderColor: "var(--os-border)" }}
        >
          <div
            className="flex items-center gap-1.5 px-4 py-2 border-b"
            style={{ borderColor: "var(--os-border)" }}
          >
            <StickyNote size={12} style={{ color: "var(--os-text-muted)" }} />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--os-text-muted)" }}
            >
              Quick Notes
            </span>
          </div>
          <textarea
            className="flex-1 w-full text-sm p-4 resize-none outline-none"
            style={{
              background: "transparent",
              color: "var(--os-text-primary)",
              lineHeight: "1.6",
            }}
            placeholder="Jot down thoughts, ideas, tasks for today..."
            value={quickNotes}
            onChange={(e) => saveQuickNotes(e.target.value)}
          />
        </div>

        {/* Right: today's calendar */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div
            className="flex items-center gap-1.5 px-4 py-2 border-b"
            style={{ borderColor: "var(--os-border)" }}
          >
            <Clock size={12} style={{ color: "var(--os-text-muted)" }} />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--os-text-muted)" }}
            >
              Today's Schedule
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {todayEvents.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-24"
                data-ocid="mindcalendar.empty_state"
              >
                <p
                  className="text-xs"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  No events today
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayEvents.map((evt, idx) => (
                  <div
                    key={evt.id}
                    data-ocid={`mindcalendar.item.${idx + 1}`}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
                    style={{
                      background: `${evt.color}18`,
                      borderLeft: `3px solid ${evt.color}`,
                    }}
                  >
                    <div className="flex-1">
                      <p
                        className="font-medium"
                        style={{ color: "var(--os-text-primary)" }}
                      >
                        {evt.title}
                      </p>
                      {!evt.allDay && (
                        <p style={{ color: "var(--os-text-muted)" }}>
                          {evt.startTime} – {evt.endTime}
                        </p>
                      )}
                      {evt.allDay && (
                        <p style={{ color: "var(--os-text-muted)" }}>All day</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Focus Timer */}
      <div
        className="border-t px-4 py-3"
        style={{ borderColor: "var(--os-border)", flexShrink: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--os-text-muted)" }}
            >
              Focus
            </span>
            <span
              className="font-mono text-xl font-bold"
              style={{
                color: timerRunning
                  ? "var(--os-accent)"
                  : "var(--os-text-primary)",
              }}
            >
              {minutes}:{seconds}
            </span>
          </div>
          {/* Progress bar */}
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--os-bg-secondary)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progressPct}%`,
                background: "var(--os-accent)",
              }}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTimerRunning((r) => !r)}
              className="p-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{
                background: "var(--os-accent)",
                color: "var(--os-text-primary)",
              }}
            >
              {timerRunning ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <button
              type="button"
              onClick={resetTimer}
              className="p-1.5 rounded-lg transition-colors"
              style={{
                background: "var(--os-bg-secondary)",
                color: "var(--os-text-muted)",
              }}
            >
              <RefreshCw size={12} />
            </button>
          </div>
          {timerSession > 0 && (
            <span className="text-xs" style={{ color: "var(--os-text-muted)" }}>
              🍅 ×{timerSession}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
