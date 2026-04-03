import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Settings,
  SkipForward,
  Timer,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type Phase = "work" | "short" | "long";

interface SessionRecord {
  timestamp: number;
  type: Phase;
  durationMin: number;
}

interface PomodoroConfig {
  workMin: number;
  shortMin: number;
  longMin: number;
}

const DEFAULT_CONFIG: PomodoroConfig = {
  workMin: 25,
  shortMin: 5,
  longMin: 15,
};

function phaseLabel(p: Phase) {
  return p === "work" ? "Work" : p === "short" ? "Short Break" : "Long Break";
}

function phaseColor(p: Phase) {
  return p === "work"
    ? "rgba(39,215,224,1)"
    : p === "short"
      ? "rgba(99,202,128,1)"
      : "rgba(147,112,219,1)";
}

function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // ignore
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

interface PomodoroTimerV2Props {
  windowProps?: Record<string, unknown>;
}

export function PomodoroTimerV2({
  windowProps: _windowProps,
}: PomodoroTimerV2Props) {
  const { data: savedHistory, set: saveHistory } = useCanisterKV<
    SessionRecord[]
  >("pomodorov2_history", []);
  const { data: savedConfig, set: saveConfig } = useCanisterKV<PomodoroConfig>(
    "pomodorov2_config",
    DEFAULT_CONFIG,
  );

  const [config, setConfig] = useState<PomodoroConfig>(DEFAULT_CONFIG);
  const [phase, setPhase] = useState<Phase>("work");
  const [sessionCount, setSessionCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_CONFIG.workMin * 60);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const configLoaded = useRef(false);

  // Load from canister once
  useEffect(() => {
    if (configLoaded.current) return;
    if (savedConfig && savedConfig !== DEFAULT_CONFIG) {
      setConfig(savedConfig);
      setSecondsLeft(savedConfig.workMin * 60);
      configLoaded.current = true;
    }
  }, [savedConfig]);

  useEffect(() => {
    if (savedHistory.length > 0 && history.length === 0) {
      setHistory(savedHistory);
    }
  }, [savedHistory, history.length]);

  const phaseDuration = useCallback(
    (p: Phase) => {
      return p === "work"
        ? config.workMin
        : p === "short"
          ? config.shortMin
          : config.longMin;
    },
    [config],
  );

  const advancePhase = useCallback(() => {
    setRunning(false);
    const newRecord: SessionRecord = {
      timestamp: Date.now(),
      type: phase,
      durationMin: phaseDuration(phase),
    };
    const updated = [newRecord, ...history].slice(0, 50);
    setHistory(updated);
    saveHistory(updated);

    let nextPhase: Phase;
    let nextCount = sessionCount;
    if (phase === "work") {
      nextCount = sessionCount + 1;
      setSessionCount(nextCount);
      nextPhase = nextCount % 4 === 0 ? "long" : "short";
    } else {
      nextPhase = "work";
    }
    setPhase(nextPhase);
    setSecondsLeft(phaseDuration(nextPhase) * 60);
    beep();
    toast.success(
      `${phaseLabel(phase)} complete! Starting ${phaseLabel(nextPhase)}.`,
      { duration: 3000 },
    );
  }, [phase, sessionCount, history, saveHistory, phaseDuration]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            advancePhase();
            return 0;
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
  }, [running, advancePhase]);

  const reset = () => {
    setRunning(false);
    setSecondsLeft(phaseDuration(phase) * 60);
  };

  const skip = () => {
    setRunning(false);
    advancePhase();
  };

  const applyConfig = (cfg: PomodoroConfig) => {
    setConfig(cfg);
    saveConfig(cfg);
    setRunning(false);
    setSecondsLeft(cfg.workMin * 60);
    setPhase("work");
    setShowSettings(false);
    toast.success("Settings updated");
  };

  const totalSec = phaseDuration(phase) * 60;
  const progress = secondsLeft / totalSec;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const RADIUS = 72;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const color = phaseColor(phase);

  const today = todayKey();
  const todaySessions = history.filter(
    (h) =>
      h.type === "work" &&
      new Date(h.timestamp).toISOString().slice(0, 10) === today,
  );
  const todayFocusMin = todaySessions.reduce((s, h) => s + h.durationMin, 0);

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "rgba(8,12,16,0.97)" }}
      data-ocid="pomodorov2.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(39,215,224,0.12)",
          background: "rgba(12,20,28,0.9)",
        }}
      >
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-semibold" style={{ color }}>
            Pomodoro 2.0
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          data-ocid="pomodorov2.toggle"
          className="flex items-center gap-1 text-xs px-2 py-1 rounded"
          style={{
            color: "var(--os-text-secondary)",
            background: showSettings ? "rgba(39,215,224,0.1)" : "transparent",
          }}
        >
          <Settings className="w-3 h-3" />
          {showSettings ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && <SettingsPanel config={config} onApply={applyConfig} />}

      <div className="flex-1 overflow-y-auto">
        {/* Timer */}
        <div className="flex flex-col items-center py-6 gap-4">
          {/* Phase label */}
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color }}
          >
            {phaseLabel(phase)} — Session {sessionCount + 1}
          </div>

          {/* SVG ring */}
          <div className="relative">
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              aria-hidden="true"
            >
              <circle
                cx="90"
                cy="90"
                r={RADIUS}
                fill="none"
                stroke="var(--os-border-subtle)"
                strokeWidth="8"
              />
              <circle
                cx="90"
                cy="90"
                r={RADIUS}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 90 90)"
                style={{
                  transition: running ? "stroke-dashoffset 1s linear" : "none",
                  filter: `drop-shadow(0 0 8px ${color})`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-4xl font-mono font-bold"
                style={{ color, textShadow: `0 0 20px ${color}` }}
              >
                {mm}:{ss}
              </span>
              <span
                className="text-xs mt-1"
                style={{ color: "var(--os-text-secondary)" }}
              >
                {running ? "Running" : "Paused"}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={reset}
              data-ocid="pomodorov2.secondary_button"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-text-muted)",
              }}
            >
              <RotateCcw
                className="w-4 h-4"
                style={{ color: "var(--os-text-secondary)" }}
              />
            </button>
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              data-ocid="pomodorov2.primary_button"
              className="w-16 h-16 rounded-full font-bold text-sm transition-all"
              style={{
                background: `rgba(${color === "rgba(39,215,224,1)" ? "39,215,224" : color === "rgba(99,202,128,1)" ? "99,202,128" : "147,112,219"},0.15)`,
                border: `2px solid ${color}`,
                color,
                boxShadow: running ? `0 0 24px ${color}40` : "none",
              }}
            >
              {running ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              onClick={skip}
              data-ocid="pomodorov2.toggle"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-text-muted)",
              }}
            >
              <SkipForward
                className="w-4 h-4"
                style={{ color: "var(--os-text-secondary)" }}
              />
            </button>
          </div>

          {/* Daily stats */}
          <div className="flex gap-4 text-center">
            <div
              className="px-4 py-2 rounded-lg"
              style={{
                background: "rgba(39,215,224,0.07)",
                border: "1px solid rgba(39,215,224,0.15)",
              }}
            >
              <div
                className="text-lg font-bold"
                style={{ color: "var(--os-accent)" }}
              >
                {todaySessions.length}
              </div>
              <div className="text-[10px] text-muted-foreground/60">
                Sessions Today
              </div>
            </div>
            <div
              className="px-4 py-2 rounded-lg"
              style={{
                background: "rgba(39,215,224,0.07)",
                border: "1px solid rgba(39,215,224,0.15)",
              }}
            >
              <div
                className="text-lg font-bold"
                style={{ color: "var(--os-accent)" }}
              >
                {todayFocusMin}m
              </div>
              <div className="text-[10px] text-muted-foreground/60">
                Focus Today
              </div>
            </div>
          </div>
        </div>

        {/* Session history */}
        {history.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3
                className="w-3.5 h-3.5"
                style={{ color: "rgba(39,215,224,0.7)" }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "rgba(39,215,224,0.7)" }}
              >
                Recent Sessions
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {history.slice(0, 10).map((s, i) => (
                <div
                  key={s.timestamp}
                  data-ocid={`pomodorov2.item.${i + 1}`}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-border-subtle)",
                  }}
                >
                  <span style={{ color: phaseColor(s.type) }}>
                    {phaseLabel(s.type)}
                  </span>
                  <span style={{ color: "var(--os-text-secondary)" }}>
                    {s.durationMin}m
                  </span>
                  <span style={{ color: "var(--os-text-muted)" }}>
                    {new Date(s.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsPanel({
  config,
  onApply,
}: { config: PomodoroConfig; onApply: (c: PomodoroConfig) => void }) {
  const [work, setWork] = useState(config.workMin);
  const [short, setShort] = useState(config.shortMin);
  const [long, setLong] = useState(config.longMin);

  return (
    <div
      className="px-4 py-3 border-b flex-shrink-0"
      style={{
        background: "rgba(15,25,35,0.9)",
        borderColor: "rgba(39,215,224,0.1)",
      }}
    >
      <div className="grid grid-cols-3 gap-3 mb-3">
        {(
          [
            { label: "Work", min: 5, max: 60, val: work, set: setWork },
            {
              label: "Short Break",
              min: 1,
              max: 15,
              val: short,
              set: setShort,
            },
            { label: "Long Break", min: 5, max: 30, val: long, set: setLong },
          ] as Array<{
            label: string;
            min: number;
            max: number;
            val: number;
            set: (v: number) => void;
          }>
        ).map((item) => (
          <div key={item.label} className="text-center">
            <span className="text-[10px] text-muted-foreground/60 block mb-1">
              {item.label}
            </span>
            <input
              type="number"
              min={item.min}
              max={item.max}
              value={item.val}
              onChange={(e) => item.set(Number(e.target.value))}
              className="w-full text-center text-sm font-bold rounded-lg px-2 py-1.5 outline-none"
              style={{
                background: "rgba(39,215,224,0.08)",
                border: "1px solid rgba(39,215,224,0.2)",
                color: "var(--os-accent)",
              }}
            />
            <span className="text-[9px] text-muted-foreground/60">min</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onApply({ workMin: work, shortMin: short, longMin: long })
        }
        data-ocid="pomodorov2.save_button"
        className="w-full py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: "rgba(39,215,224,0.15)",
          border: "1px solid rgba(39,215,224,0.3)",
          color: "var(--os-accent)",
        }}
      >
        Apply Settings
      </button>
    </div>
  );
}
