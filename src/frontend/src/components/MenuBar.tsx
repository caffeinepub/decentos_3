import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Copy,
  LogOut,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DEV_MODE, useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useOS } from "../context/OSContext";

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Mini monthly calendar popover
function ClockPopover({
  time,
  calendarOffset,
  setCalendarOffset,
}: {
  time: Date;
  calendarOffset: number;
  setCalendarOffset: (offset: number) => void;
}) {
  const today = new Date();
  const displayMonth = new Date(
    today.getFullYear(),
    today.getMonth() + calendarOffset,
    1,
  );
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const monthName = displayMonth.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d: number | null) =>
    d !== null && calendarOffset === 0 && d === today.getDate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full mt-1 rounded-xl overflow-hidden"
      style={{
        background: "rgba(24,24,36,0.96)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
        width: 240,
        zIndex: 9999,
      }}
    >
      {/* Current time */}
      <div
        className="px-4 pt-4 pb-3 text-center"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="text-3xl font-semibold tabular-nums"
          style={{ color: "rgba(255,255,255,0.95)", letterSpacing: "-0.5px" }}
        >
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div
          className="text-[12px] mt-0.5"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {time.toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Calendar */}
      <div className="px-3 py-3">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            data-ocid="menubar.calendar.prev"
            onClick={() => setCalendarOffset(calendarOffset - 1)}
            className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span
            className="text-[12px] font-medium"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {monthName} {year}
          </span>
          <button
            type="button"
            data-ocid="menubar.calendar.next"
            onClick={() => setCalendarOffset(calendarOffset + 1)}
            className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {[
            ["Su", "0"],
            ["Mo", "1"],
            ["Tu", "2"],
            ["We", "3"],
            ["Th", "4"],
            ["Fr", "5"],
            ["Sa", "6"],
          ].map(([label, k]) => (
            <div
              key={k}
              className="text-center text-[10px] font-medium"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {label[0]}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((d, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: calendar cells by position
              key={i}
              className="flex items-center justify-center h-7 text-[11px] rounded-full transition-colors"
              style={{
                color:
                  d === null
                    ? "transparent"
                    : isToday(d)
                      ? "white"
                      : "rgba(255,255,255,0.7)",
                background: isToday(d)
                  ? "var(--os-accent-color)"
                  : "transparent",
                fontWeight: isToday(d) ? 700 : 400,
              }}
            >
              {d ?? ""}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function MenuBar() {
  const { session } = useOS();
  const { isAuthenticated, principal, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [clockFormat, setClockFormat] = useState<"12h" | "24h">(
    () => (localStorage.getItem("decentos_clock") as "12h" | "24h") ?? "24h",
  );
  const [showNotifs, setShowNotifs] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showClockPopover, setShowClockPopover] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0); // months offset
  const clockRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllRead, clearAll } =
    useNotifications();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close clock popover on outside click
  useEffect(() => {
    if (!showClockPopover) return;
    const handler = (e: MouseEvent) => {
      if (clockRef.current && !clockRef.current.contains(e.target as Node)) {
        setShowClockPopover(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showClockPopover]);

  // Close notification panel on outside click
  useEffect(() => {
    if (!showNotifs) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifs]);

  // Close identity panel on outside click
  useEffect(() => {
    if (!showIdentity) return;
    const handler = (e: MouseEvent) => {
      if (
        identityRef.current &&
        !identityRef.current.contains(e.target as Node)
      ) {
        setShowIdentity(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showIdentity]);

  useEffect(() => {
    const handler = (e: Event) => {
      const fmt = (e as CustomEvent).detail as "12h" | "24h";
      setClockFormat(fmt);
    };
    document.addEventListener("decentos:clockformat", handler);
    return () => document.removeEventListener("decentos:clockformat", handler);
  }, []);

  const clockStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: clockFormat === "12h",
  });

  const dateStr = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const openSpotlight = () =>
    document.dispatchEvent(new Event("decentos:spotlight"));

  const handleBellClick = () => {
    setShowNotifs((v) => !v);
    setShowIdentity(false);
    if (!showNotifs && unreadCount > 0) markAllRead();
  };

  const handleIdentityClick = () => {
    setShowIdentity((v) => !v);
    setShowNotifs(false);
  };

  const handleCopyPrincipal = () => {
    if (!principal) return;
    navigator.clipboard.writeText(principal).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const typeColor = (type: string) => {
    if (type === "success") return "#22C55E";
    if (type === "error") return "#EF4444";
    return "rgba(99,102,241,0.9)";
  };

  const isDevMode = DEV_MODE || session?.displayName === "Developer";

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between"
      style={{
        height: "calc(28px + env(safe-area-inset-top))",
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: 16,
        paddingRight: 16,
        background: "var(--os-bg-menubar)",
        backdropFilter: "blur(30px) saturate(160%)",
        WebkitBackdropFilter: "blur(30px) saturate(160%)",
        borderBottom: "1px solid var(--os-border-subtle)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
      }}
      data-ocid="menubar.panel"
    >
      {/* ── Left: OS brand ── */}
      <div className="flex items-center gap-3">
        <span
          className="text-[12px] tracking-[0.06em]"
          style={{
            fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
            fontWeight: 700,
            color: "var(--os-text-primary)",
          }}
        >
          DecentOS
        </span>
        {isDevMode && (
          <span
            className="hidden sm:inline-flex items-center text-[10px] rounded-full px-2 py-0.5"
            style={{
              background: "rgba(217,119,6,0.18)",
              border: "1px solid rgba(217,119,6,0.45)",
              color: "var(--os-dev-badge-text)",
              fontWeight: 600,
            }}
          >
            Dev Mode
          </span>
        )}
      </div>

      {/* ── Center: clock ── */}
      <div
        ref={clockRef}
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <button
          type="button"
          data-ocid="menubar.clock.button"
          onClick={() => setShowClockPopover((v) => !v)}
          className="flex items-center gap-2 text-[12px] font-medium px-2 py-0.5 rounded transition-all"
          style={{
            color: "var(--os-text-primary)",
            background: showClockPopover
              ? "var(--os-border-subtle)"
              : "transparent",
          }}
        >
          <span>{dateStr}</span>
          <span style={{ color: "var(--os-text-muted)" }}>·</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{clockStr}</span>
        </button>

        <AnimatePresence>
          {showClockPopover && (
            <ClockPopover
              time={time}
              calendarOffset={calendarOffset}
              setCalendarOffset={setCalendarOffset}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Right: tray ── */}
      <div className="flex items-center gap-0.5">
        {/* Spotlight */}
        <button
          type="button"
          onClick={openSpotlight}
          data-ocid="menubar.search_button"
          title="Search (Ctrl+Space)"
          className="flex items-center justify-center w-7 h-6 rounded transition-all"
          style={{ color: "var(--os-text-secondary)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "var(--os-border-subtle)";
            (e.currentTarget as HTMLElement).style.color =
              "var(--os-text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color =
              "var(--os-text-secondary)";
          }}
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Identity chip — shown when II is active (non-DEV_MODE) */}
        {!DEV_MODE && isAuthenticated && principal && (
          <div className="relative" ref={identityRef}>
            <button
              type="button"
              onClick={handleIdentityClick}
              data-ocid="menubar.identity.button"
              title="Identity"
              className="flex items-center gap-1.5 h-6 px-2 rounded transition-all text-[10px] font-mono"
              style={{
                background: showIdentity
                  ? "var(--os-border-subtle)"
                  : "transparent",
                color: "var(--os-text-secondary)",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--os-border-subtle)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--os-border-subtle)";
              }}
              onMouseLeave={(e) => {
                if (!showIdentity) {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "transparent";
                }
              }}
            >
              {/* Avatar circle */}
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                style={{
                  background: "var(--os-accent-color)",
                  color: "#fff",
                }}
              >
                {principal.slice(0, 1).toUpperCase()}
              </span>
              <span style={{ color: "var(--os-text-secondary)" }}>
                {principal.slice(0, 5)}…
              </span>
            </button>

            {/* Identity dropdown */}
            {showIdentity && (
              <div
                className="absolute right-0 top-full mt-1 w-72 rounded-xl overflow-hidden z-[99999]"
                style={{
                  background: "var(--os-bg-window)",
                  border: "1px solid var(--os-border-dock)",
                  backdropFilter: "blur(30px)",
                  boxShadow: "var(--os-shadow-window)",
                }}
                data-ocid="menubar.identity.panel"
              >
                <div
                  className="p-3 space-y-2"
                  style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
                >
                  <p
                    className="text-[10px] font-semibold"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    INTERNET IDENTITY
                  </p>
                  <div
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: "var(--os-bg-elevated)" }}
                  >
                    <span
                      className="text-[9px] font-mono break-all flex-1 leading-relaxed"
                      style={{ color: "var(--os-text-secondary)" }}
                    >
                      {principal}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPrincipal}
                      data-ocid="menubar.copy_principal.button"
                      className="flex-shrink-0 p-1 rounded transition-colors"
                      style={{ color: "var(--os-text-muted)" }}
                      title="Copy principal"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  {copied && (
                    <p
                      className="text-[9px] text-center"
                      style={{ color: "rgba(74,222,128,0.8)" }}
                    >
                      Copied!
                    </p>
                  )}
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowIdentity(false);
                      logout();
                    }}
                    data-ocid="menubar.signout.button"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
                    style={{ color: "rgba(239,68,68,0.85)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(239,68,68,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notification bell */}
        <div className="relative" ref={panelRef}>
          <button
            type="button"
            onClick={handleBellClick}
            data-ocid="menubar.toggle"
            title="Notifications"
            className="flex items-center justify-center w-7 h-6 rounded transition-all relative"
            style={{
              color:
                unreadCount > 0
                  ? "var(--os-text-primary)"
                  : "var(--os-text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--os-border-subtle)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-[8px] font-bold"
                style={{
                  width: 14,
                  height: 14,
                  background: "#ff5f57",
                  color: "#ffffff",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification panel */}
          {showNotifs && (
            <div
              className="absolute right-0 top-full mt-1 w-80 rounded-xl overflow-hidden z-[99999]"
              style={{
                background: "var(--os-bg-window)",
                border: "1px solid var(--os-border-dock)",
                backdropFilter: "blur(30px)",
                boxShadow: "var(--os-shadow-window)",
              }}
              data-ocid="menubar.notifications.panel"
            >
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
              >
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: "var(--os-text-primary)" }}
                >
                  Notifications
                </span>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    data-ocid="menubar.clear_notifications.button"
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors"
                    style={{ color: "var(--os-text-muted)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--os-border-subtle)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--os-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--os-text-muted)";
                    }}
                  >
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div
                    className="px-4 py-6 text-center text-[12px]"
                    style={{ color: "var(--os-text-muted)" }}
                    data-ocid="menubar.notifications.empty_state"
                  >
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-2.5 flex items-start gap-2.5"
                      style={{
                        borderBottom: "1px solid var(--os-border-subtle)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: typeColor(n.type) }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[12px] font-medium leading-snug"
                          style={{ color: "var(--os-text-primary)" }}
                        >
                          {n.message}
                        </p>
                        <p
                          className="text-[10px] mt-0.5"
                          style={{ color: "var(--os-text-muted)" }}
                        >
                          {timeAgo(n.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
