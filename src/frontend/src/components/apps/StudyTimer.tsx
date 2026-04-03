import {
  BookOpen,
  CheckCircle,
  Flame,
  RotateCcw,
  Settings2,
  SkipForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface StudyTimerState {
  streakDays: number;
  lastActiveDate: string;
  todaySessions: number;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

type Phase = "focus" | "shortBreak" | "longBreak";

const PHASE_LABELS: Record<Phase, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const PHASE_COLORS: Record<Phase, string> = {
  focus: "rgb(39,215,224)",
  shortBreak: "rgb(34,197,94)",
  longBreak: "rgb(168,85,247)",
};

function beep(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
}

export function StudyTimer() {
  const [focusMins, setFocusMins] = useState(25);
  const [shortBreakMins, setShortBreakMins] = useState(5);
  const [targetSessions, setTargetSessions] = useState(4);
  const [phase, setPhase] = useState<Phase>("focus");
  const [secondsLeft, setSecondsLeft] = useState(focusMins * 60);
  const [running, setRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { data: storage, set: saveStorage } = useCanisterKV<StudyTimerState>(
    "decentos_study_timer",
    { streakDays: 0, lastActiveDate: "", todaySessions: 0 },
  );
  const storageRef = useRef(storage);
  useEffect(() => {
    storageRef.current = storage;
  }, [storage]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = phase === "focus" ? focusMins * 60 : shortBreakMins * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const color = PHASE_COLORS[phase];

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
          }
          beep(audioCtxRef.current);
          if (phase === "focus") {
            const today = todayKey();
            const s = storageRef.current;
            const newSessions = s.todaySessions + 1;
            let newStreak = s.streakDays;
            let newLastDate = s.lastActiveDate;
            if (s.lastActiveDate !== today) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yKey = yesterday.toISOString().slice(0, 10);
              newStreak = s.lastActiveDate === yKey ? s.streakDays + 1 : 1;
              newLastDate = today;
            }
            const updated = {
              streakDays: newStreak,
              lastActiveDate: newLastDate,
              todaySessions: newSessions,
            };
            saveStorage(updated);
            setPhase("shortBreak");
            setSecondsLeft(shortBreakMins * 60);
          } else {
            setPhase("focus");
            setSecondsLeft(focusMins * 60);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running, phase, focusMins, shortBreakMins, saveStorage]);

  const toggleRunning = () => setRunning((r) => !r);

  const reset = () => {
    setRunning(false);
    clearInterval(intervalRef.current!);
    setSecondsLeft(phase === "focus" ? focusMins * 60 : shortBreakMins * 60);
  };

  const skip = () => {
    setRunning(false);
    clearInterval(intervalRef.current!);
    const next: Phase = phase === "focus" ? "shortBreak" : "focus";
    setPhase(next);
    setSecondsLeft(next === "focus" ? focusMins * 60 : shortBreakMins * 60);
  };

  const R = 70;
  const circ = 2 * Math.PI * R;
  const dash = (progress / 100) * circ;

  return (
    <div className="flex flex-col h-full" style={{ color: "#e2e8f0" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: "rgb(39,215,224)" }} />
          <span className="font-semibold text-foreground">Study Timer</span>
        </div>
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          data-ocid="studytimer.toggle"
          className="p-1 rounded transition-colors"
          style={{
            color: showSettings ? "rgb(39,215,224)" : "rgba(148,163,184,0.7)",
          }}
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {showSettings ? (
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-muted-foreground">Focus (min)</span>
              <input
                type="number"
                min={1}
                max={90}
                value={focusMins}
                onChange={(e) => {
                  setFocusMins(+e.target.value);
                  if (phase === "focus") setSecondsLeft(+e.target.value * 60);
                }}
                data-ocid="studytimer.input"
                className="w-full mt-1 px-2 py-1.5 rounded text-sm bg-muted/50 focus:outline-none"
                style={{
                  border: "1px solid var(--os-text-muted)",
                  color: "#e2e8f0",
                }}
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted-foreground">Break (min)</span>
              <input
                type="number"
                min={1}
                max={30}
                value={shortBreakMins}
                onChange={(e) => {
                  setShortBreakMins(+e.target.value);
                  if (phase !== "focus") setSecondsLeft(+e.target.value * 60);
                }}
                className="w-full mt-1 px-2 py-1.5 rounded text-sm bg-muted/50 focus:outline-none"
                style={{
                  border: "1px solid var(--os-text-muted)",
                  color: "#e2e8f0",
                }}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-muted-foreground">
              Daily session goal
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={targetSessions}
              onChange={(e) => setTargetSessions(+e.target.value)}
              className="w-full mt-1 px-2 py-1.5 rounded text-sm bg-muted/50 focus:outline-none"
              style={{
                border: "1px solid var(--os-text-muted)",
                color: "#e2e8f0",
              }}
            />
          </label>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          {/* Phase badge */}
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}40`,
              color,
            }}
          >
            {PHASE_LABELS[phase]}
          </div>

          {/* SVG ring */}
          <div className="relative">
            <svg
              width={180}
              height={180}
              viewBox="0 0 180 180"
              role="img"
              aria-label="Timer progress ring"
            >
              <circle
                cx={90}
                cy={90}
                r={R}
                fill="none"
                strokeWidth={10}
                stroke="var(--os-border-subtle)"
              />
              <circle
                cx={90}
                cy={90}
                r={R}
                fill="none"
                strokeWidth={10}
                stroke={color}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={circ / 4}
                style={{
                  transition: "stroke-dasharray 0.5s ease",
                  filter: `drop-shadow(0 0 6px ${color}80)`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl font-bold tabular-nums"
                style={{ color }}
              >
                {timeStr}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                remaining
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={reset}
              data-ocid="studytimer.secondary_button"
              className="p-2 rounded-full transition-all"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-text-muted)",
                color: "rgba(148,163,184,0.7)",
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleRunning}
              data-ocid="studytimer.primary_button"
              className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all"
              style={{
                background: `${color}20`,
                border: `2px solid ${color}60`,
                color,
              }}
            >
              {running ? "⏸" : "▶"}
            </button>
            <button
              type="button"
              onClick={skip}
              data-ocid="studytimer.toggle"
              className="p-2 rounded-full transition-all"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-text-muted)",
                color: "rgba(148,163,184,0.7)",
              }}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="font-bold text-lg">{storage.streakDays}</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                day streak
              </div>
            </div>
            <div>
              <div
                className="flex items-center justify-center gap-1"
                style={{ color: "rgb(39,215,224)" }}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold text-lg">
                  {storage.todaySessions}/{targetSessions}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                today's sessions
              </div>
            </div>
          </div>

          {/* Session progress dots */}
          <div className="flex gap-2">
            {Array.from({ length: targetSessions }, (_, i) => (
              <div
                key={`session-slot-${i + 1}`}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background:
                    i < storage.todaySessions ? color : "var(--os-text-muted)",
                  boxShadow:
                    i < storage.todaySessions ? `0 0 6px ${color}80` : "none",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
