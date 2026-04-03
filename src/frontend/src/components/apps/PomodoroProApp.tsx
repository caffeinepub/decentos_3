import { Bell, Flame, RotateCcw, Settings, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type Phase = "work" | "short" | "long";

interface PomodoroSettings {
  workMin: number;
  shortMin: number;
  longMin: number;
  autoAdvance: boolean;
  label: string;
}

interface PomodoroHistory {
  streakDays: string[];
  sessionsToday: { date: string; count: number }[];
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workMin: 25,
  shortMin: 5,
  longMin: 15,
  autoAdvance: false,
  label: "Deep Work",
};

const PHASE_COLORS: Record<Phase, string> = {
  work: "rgba(39,215,224,1)",
  short: "rgba(34,197,94,1)",
  long: "rgba(168,85,247,1)",
};

const PHASE_LABEL: Record<Phase, string> = {
  work: "Focus Session",
  short: "Short Break",
  long: "Long Break",
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function CircleProgress({
  pct,
  color,
  radius = 80,
}: { pct: number; color: string; radius?: number }) {
  const stroke = 6;
  const size = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)" }}
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--os-border-subtle)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.4s ease" }}
      />
    </svg>
  );
}

export function PomodoroProApp() {
  const {
    data: savedSettings,
    set: setSettings,
    loading: loadingSettings,
  } = useCanisterKV<PomodoroSettings>(
    "decentos_pomodoro_pro_settings",
    DEFAULT_SETTINGS,
  );
  const {
    data: savedHistory,
    set: setHistoryKV,
    loading: loadingHistory,
  } = useCanisterKV<PomodoroHistory>("decentos_pomodoro_pro_history", {
    streakDays: [],
    sessionsToday: [],
  });

  const [settings, setLocalSettings] =
    useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [history, setLocalHistory] = useState<PomodoroHistory>({
    streakDays: [],
    sessionsToday: [],
  });
  const [showSettings, setShowSettings] = useState(false);
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settingsInit = useRef(false);
  const historyInit = useRef(false);

  useEffect(() => {
    if (!loadingSettings && !settingsInit.current) {
      settingsInit.current = true;
      const s = savedSettings?.workMin ? savedSettings : DEFAULT_SETTINGS;
      setLocalSettings(s);
      setTimeLeft(s.workMin * 60);
    }
  }, [loadingSettings, savedSettings]);

  useEffect(() => {
    if (!loadingHistory && !historyInit.current) {
      historyInit.current = true;
      const h = savedHistory?.streakDays
        ? savedHistory
        : { streakDays: [], sessionsToday: [] };
      setLocalHistory(h);
      const today = h.sessionsToday.find((s) => s.date === todayStr());
      setSessionCount(today?.count ?? 0);
    }
  }, [loadingHistory, savedHistory]);

  const phaseDuration = useCallback((p: Phase, s: PomodoroSettings) => {
    if (p === "work") return s.workMin * 60;
    if (p === "short") return s.shortMin * 60;
    return s.longMin * 60;
  }, []);

  const totalTime = phaseDuration(phase, settings);
  const pct = totalTime > 0 ? timeLeft / totalTime : 0;
  const phaseColor = PHASE_COLORS[phase];

  const advancePhase = useCallback(
    (
      currentPhase: Phase,
      count: number,
      s: PomodoroSettings,
      autoAdv: boolean,
    ) => {
      let next: Phase = "short";
      let newCount = count;
      if (currentPhase === "work") {
        newCount = count + 1;
        next = newCount % 4 === 0 ? "long" : "short";
        toast.success(`Session complete! ${PHASE_LABEL[next]} starting.`, {
          duration: 4000,
        });
      } else {
        next = "work";
        toast.success("Break over! Time to focus.", { duration: 3000 });
      }
      setPhase(next);
      setTimeLeft(phaseDuration(next, s));
      setSessionCount(newCount);
      return { next, newCount, autoAdv };
    },
    [phaseDuration],
  );

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          // Record session if work phase ended
          if (phase === "work") {
            const today = todayStr();
            setLocalHistory((h) => {
              const existing = h.sessionsToday.find((s) => s.date === today);
              const newSessions = existing
                ? h.sessionsToday.map((s) =>
                    s.date === today ? { ...s, count: s.count + 1 } : s,
                  )
                : [...h.sessionsToday, { date: today, count: 1 }];
              const streakDays = h.streakDays.includes(today)
                ? h.streakDays
                : [...h.streakDays, today].slice(-60);
              const next = {
                streakDays,
                sessionsToday: newSessions.slice(-30),
              };
              setHistoryKV(next);
              return next;
            });
          }
          const { autoAdv } = advancePhase(
            phase,
            sessionCount,
            settings,
            settings.autoAdvance,
          );
          setRunning(autoAdv);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, phase, settings, sessionCount, advancePhase, setHistoryKV]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const handleSaveSettings = (s: PomodoroSettings) => {
    setLocalSettings(s);
    setSettings(s);
    setRunning(false);
    setPhase("work");
    setTimeLeft(s.workMin * 60);
    setShowSettings(false);
    toast.success("Settings saved ✓");
  };

  const streak = (() => {
    const days = history.streakDays.sort();
    if (days.length === 0) return 0;
    let streak = 0;
    let cur = new Date();
    cur.setHours(0, 0, 0, 0);
    for (let i = days.length - 1; i >= 0; i--) {
      const d = new Date(days[i]);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((cur.getTime() - d.getTime()) / 86400000);
      if (diff <= 1) {
        streak++;
        cur = d;
      } else break;
    }
    return streak;
  })();

  const boxStyle = {
    background: "rgba(8,14,22,0.95)",
    color: "rgba(232,238,242,0.9)",
  };

  if (showSettings) {
    return (
      <SettingsPanel
        settings={settings}
        onSave={handleSaveSettings}
        onCancel={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div
      className="flex flex-col h-full items-center justify-center gap-6"
      style={boxStyle}
      data-ocid="pomodoro_pro.panel"
    >
      {/* Phase label */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            color: phaseColor,
            fontWeight: 700,
            opacity: 0.8,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {settings.label || PHASE_LABEL[phase]}
        </div>
        <div style={{ fontSize: 13, color: "var(--os-text-muted)" }}>
          {PHASE_LABEL[phase]}
        </div>
      </div>

      {/* Ring */}
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircleProgress pct={pct} color={phaseColor} radius={80} />
        <div style={{ position: "absolute", textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 36,
              fontWeight: 700,
              color: "rgba(232,238,242,0.95)",
              letterSpacing: "-0.02em",
            }}
          >
            {mm}:{ss}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--os-text-muted)",
              marginTop: 2,
            }}
          >
            Session #{sessionCount + 1}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setTimeLeft(phaseDuration(phase, settings));
          }}
          style={{
            background: "var(--os-border-subtle)",
            border: "1px solid var(--os-text-muted)",
            color: "var(--os-text-secondary)",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
          }}
          data-ocid="pomodoro_pro.secondary_button"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          style={{
            background: phaseColor,
            color: "#000",
            borderRadius: 10,
            padding: "10px 32px",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            minWidth: 100,
            transition: "opacity 0.2s",
          }}
          data-ocid="pomodoro_pro.primary_button"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            advancePhase(phase, sessionCount, settings, false);
          }}
          style={{
            background: "var(--os-border-subtle)",
            border: "1px solid var(--os-text-muted)",
            color: "var(--os-text-secondary)",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
          }}
          data-ocid="pomodoro_pro.toggle"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Stats row */}
      <div className="flex gap-6">
        <Stat
          icon={<Bell className="w-3.5 h-3.5" />}
          label="Today"
          value={String(sessionCount)}
          color={phaseColor}
        />
        <Stat
          icon={<Flame className="w-3.5 h-3.5" />}
          label="Streak"
          value={`${streak}d`}
          color="#F97316"
        />
        <Stat
          icon={null}
          label="Auto"
          value={settings.autoAdvance ? "ON" : "OFF"}
          color="var(--os-text-muted)"
        />
      </div>

      {/* Settings button */}
      <button
        type="button"
        onClick={() => setShowSettings(true)}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "transparent",
          border: "none",
          color: "var(--os-text-muted)",
          cursor: "pointer",
        }}
        data-ocid="pomodoro_pro.open_modal_button"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  color,
}: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          color,
          marginBottom: 2,
        }}
      >
        {icon}
        <span style={{ fontSize: 16, fontWeight: 700 }}>{value}</span>
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--os-text-muted)",
          letterSpacing: "0.08em",
        }}
      >
        {label.toUpperCase()}
      </div>
    </div>
  );
}

function SettingsPanel({
  settings,
  onSave,
  onCancel,
}: {
  settings: PomodoroSettings;
  onSave: (s: PomodoroSettings) => void;
  onCancel: () => void;
}) {
  const [local, setLocal] = useState(settings);
  const inp = (field: keyof PomodoroSettings, min: number, max: number) => (
    <input
      type="number"
      min={min}
      max={max}
      value={local[field] as number}
      onChange={(e) =>
        setLocal((s) => ({
          ...s,
          [field]: Math.min(max, Math.max(min, Number(e.target.value))),
        }))
      }
      style={{
        width: 64,
        background: "rgba(15,22,30,0.9)",
        border: "1px solid rgba(39,215,224,0.25)",
        color: "rgba(232,238,242,0.9)",
        borderRadius: 6,
        padding: "4px 8px",
        fontSize: 13,
        outline: "none",
        textAlign: "center",
      }}
    />
  );
  return (
    <div
      className="flex flex-col h-full p-6 gap-5"
      style={{
        background: "rgba(8,14,22,0.95)",
        color: "rgba(232,238,242,0.9)",
      }}
      data-ocid="pomodoro_pro.modal"
    >
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "var(--os-accent)",
          marginBottom: 0,
        }}
      >
        Timer Settings
      </h3>
      <div className="flex flex-col gap-4">
        <Row label="Session Label">
          <input
            value={local.label}
            onChange={(e) => setLocal((s) => ({ ...s, label: e.target.value }))}
            style={{
              background: "rgba(15,22,30,0.9)",
              border: "1px solid rgba(39,215,224,0.25)",
              color: "rgba(232,238,242,0.9)",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 13,
              outline: "none",
              width: 140,
            }}
            data-ocid="pomodoro_pro.input"
          />
        </Row>
        <Row label="Work (min)">{inp("workMin", 5, 60)}</Row>
        <Row label="Short Break (min)">{inp("shortMin", 1, 30)}</Row>
        <Row label="Long Break (min)">{inp("longMin", 5, 60)}</Row>
        <Row label="Auto Advance">
          <button
            type="button"
            onClick={() =>
              setLocal((s) => ({ ...s, autoAdvance: !s.autoAdvance }))
            }
            style={{
              background: local.autoAdvance
                ? "rgba(39,215,224,0.15)"
                : "var(--os-border-subtle)",
              border: `1px solid ${local.autoAdvance ? "rgba(39,215,224,0.4)" : "var(--os-text-muted)"}`,
              color: local.autoAdvance ? "#27D7E0" : "var(--os-text-secondary)",
              borderRadius: 6,
              padding: "4px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
            data-ocid="pomodoro_pro.toggle"
          >
            {local.autoAdvance ? "ON" : "OFF"}
          </button>
        </Row>
      </div>
      <div className="flex gap-3 mt-auto">
        <button
          type="button"
          onClick={() => onSave(local)}
          style={{
            background: "rgba(39,215,224,0.15)",
            border: "1px solid rgba(39,215,224,0.4)",
            color: "var(--os-accent)",
            borderRadius: 8,
            padding: "8px 24px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
          data-ocid="pomodoro_pro.save_button"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "transparent",
            border: "1px solid var(--os-text-muted)",
            color: "var(--os-text-secondary)",
            borderRadius: 8,
            padding: "8px 24px",
            fontSize: 13,
            cursor: "pointer",
          }}
          data-ocid="pomodoro_pro.cancel_button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontSize: 13, color: "var(--os-text-secondary)" }}>
        {label}
      </span>
      {children}
    </div>
  );
}
