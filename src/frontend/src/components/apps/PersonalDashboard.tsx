import { LayoutDashboard, Monitor, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const QUOTES = [
  "The best way to predict the future is to create it.",
  "It always seems impossible until it's done.",
  "Code is like poetry — the best is concise and expressive.",
  "Build things that matter. Ship things that work.",
  "Discipline is the bridge between goals and accomplishment.",
  "The only way to do great work is to love what you do.",
  "Small daily improvements lead to staggering long-term results.",
  "Done is better than perfect.",
  "The secret of getting ahead is getting started.",
  "Simplicity is the ultimate sophistication.",
  "Move fast and fix things.",
  "Focus is saying no to a hundred good ideas.",
  "Make it work, make it right, make it fast.",
  "Every expert was once a beginner.",
  "Your most unhappy customers are your greatest source of learning.",
  "The best error message is the one that never shows up.",
  "First, solve the problem. Then, write the code.",
  "Programs must be written for people to read.",
  "Perfection is achieved when there is nothing left to remove.",
  "The computer was born to solve problems that did not exist before.",
];

function getQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

// loadConfig, saveConfig, loadNote replaced by useCanisterKV in PersonalDashboard/NoteWidget

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem("spotlight_recent");
    if (!raw) return [];
    return (JSON.parse(raw) as string[]).slice(0, 5);
  } catch {
    return [];
  }
}

function ClockWidget() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div
        className="font-bold tracking-widest"
        style={{
          fontSize: 38,
          color: "rgb(39,215,224)",
          fontFamily: "'JetBrains Mono', monospace",
          textShadow: "0 0 20px rgba(39,215,224,0.4)",
        }}
      >
        {h}:{m}:{s}
      </div>
      <p className="text-xs opacity-50 mt-1">{dateStr}</p>
    </div>
  );
}

function NoteWidget() {
  const { data: savedNote, set: saveNote } = useCanisterKV<string>(
    "decent_dashboard_note",
    "",
  );
  const [note, setNote] = useState("");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setNote(savedNote);
  }, [savedNote]);

  const handleChange = (val: string) => {
    setNote(val);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveNote(val), 600);
  };

  return (
    <textarea
      data-ocid="personal-dashboard.textarea"
      value={note}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Quick note..."
      className="w-full flex-1 resize-none text-sm"
      style={{
        background: "transparent",
        border: "none",
        outline: "none",
        color: "#c8c8d4",
        minHeight: 80,
      }}
    />
  );
}

function RecentAppsWidget() {
  const recent = loadRecent();
  if (recent.length === 0) {
    return <p className="text-xs opacity-40">No recent apps</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {recent.map((appId) => (
        <span
          key={appId}
          className="px-2 py-1 rounded-md text-xs"
          style={{
            background: "rgba(39,215,224,0.1)",
            color: "rgb(39,215,224)",
            border: "1px solid rgba(39,215,224,0.2)",
          }}
        >
          {appId}
        </span>
      ))}
    </div>
  );
}

function SystemWidget() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const res = `${window.screen.width}×${window.screen.height}`;
  const ua = navigator.userAgent.split(" ").slice(-2).join(" ");

  return (
    <div className="space-y-1.5 text-xs">
      {(
        [
          ["Timezone", tz],
          ["Resolution", res],
          ["Browser", ua],
        ] as [string, string][]
      ).map(([k, v]) => (
        <div key={k} className="flex justify-between">
          <span className="opacity-50">{k}</span>
          <span className="font-mono text-[11px]">{v}</span>
        </div>
      ))}
    </div>
  );
}

const WIDGET_LABELS: Record<string, string> = {
  clock: "Clock",
  note: "Quick Note",
  recent: "Recent Apps",
  quote: "Daily Quote",
  system: "System Status",
};

const DEFAULT_CONFIG: Record<string, boolean> = {
  clock: true,
  note: true,
  recent: true,
  quote: true,
  system: true,
};

export function PersonalDashboard() {
  const { data: savedConfig, set: persistConfig } = useCanisterKV<
    Record<string, boolean>
  >("decent_dashboard_config", DEFAULT_CONFIG);
  const [config, setConfig] = useState<Record<string, boolean>>(DEFAULT_CONFIG);
  const configHydratedRef = useRef(false);
  useEffect(() => {
    if (configHydratedRef.current) return;
    configHydratedRef.current = true;
    setConfig(savedConfig);
  }, [savedConfig]);
  const [configuring, setConfiguring] = useState(false);

  const toggle = (key: string) => {
    const next = { ...config, [key]: !config[key] };
    setConfig(next);
    persistConfig(next);
  };

  const quote = getQuote();

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "rgba(5,5,10,0.95)", color: "#e8e8ee" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(39,215,224,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <LayoutDashboard
            style={{ color: "rgb(39,215,224)", width: 18, height: 18 }}
          />
          <span className="font-semibold text-sm">Personal Dashboard</span>
        </div>
        <button
          type="button"
          data-ocid="personal-dashboard.open_modal_button"
          onClick={() => setConfiguring(true)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Settings width={14} height={14} className="opacity-50" />
        </button>
      </div>

      {/* Widgets */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {config.clock && (
            <div
              data-ocid="personal-dashboard.card"
              className="col-span-2 rounded-xl p-4"
              style={{
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)",
              }}
            >
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">
                Clock
              </p>
              <ClockWidget />
            </div>
          )}

          {config.quote && (
            <div
              data-ocid="personal-dashboard.panel"
              className="col-span-2 rounded-xl p-4"
              style={{
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)",
              }}
            >
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">
                Daily Quote
              </p>
              <p className="text-sm italic opacity-80 leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
            </div>
          )}

          {config.note && (
            <div
              data-ocid="personal-dashboard.card"
              className="col-span-2 rounded-xl p-3"
              style={{
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)",
              }}
            >
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">
                Quick Note
              </p>
              <NoteWidget />
            </div>
          )}

          {config.recent && (
            <div
              data-ocid="personal-dashboard.card"
              className="rounded-xl p-3"
              style={{
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)",
              }}
            >
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">
                Recent Apps
              </p>
              <RecentAppsWidget />
            </div>
          )}

          {config.system && (
            <div
              data-ocid="personal-dashboard.card"
              className="rounded-xl p-3"
              style={{
                background: "rgba(10,20,35,0.8)",
                border: "1px solid rgba(39,215,224,0.15)",
              }}
            >
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">
                System
              </p>
              <SystemWidget />
            </div>
          )}
        </div>
      </div>

      {/* Config Modal */}
      {configuring && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
          onClick={() => setConfiguring(false)}
          onKeyDown={(e) => e.key === "Escape" && setConfiguring(false)}
          role="presentation"
        >
          <div
            data-ocid="personal-dashboard.dialog"
            className="rounded-2xl p-5 w-72"
            style={{
              background: "rgba(10,15,25,0.98)",
              border: "1px solid rgba(39,215,224,0.25)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <Monitor
                style={{ color: "rgb(39,215,224)", width: 16, height: 16 }}
              />
              <h3 className="font-semibold text-sm">Widgets</h3>
            </div>
            <div className="space-y-2">
              {Object.keys(WIDGET_LABELS).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{WIDGET_LABELS[key]}</span>
                  <button
                    type="button"
                    data-ocid="personal-dashboard.toggle"
                    onClick={() => toggle(key)}
                    className="relative w-9 h-5 rounded-full transition-colors"
                    style={{
                      background: config[key]
                        ? "rgba(39,215,224,0.4)"
                        : "var(--os-text-muted)",
                      border: "1px solid rgba(39,215,224,0.3)",
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                      style={{
                        left: config[key] ? "calc(100% - 18px)" : "2px",
                        background: config[key]
                          ? "rgb(39,215,224)"
                          : "var(--os-text-muted)",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              data-ocid="personal-dashboard.close_button"
              onClick={() => setConfiguring(false)}
              className="mt-4 w-full py-2 rounded-lg text-xs"
              style={{
                background: "rgba(39,215,224,0.12)",
                color: "rgb(39,215,224)",
                border: "1px solid rgba(39,215,224,0.2)",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalDashboard;
