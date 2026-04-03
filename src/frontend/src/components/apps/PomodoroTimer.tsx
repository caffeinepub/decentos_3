import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type Phase = "work" | "shortbreak" | "longbreak";

const PHASE_DURATIONS: Record<Phase, number> = {
  work: 25 * 60,
  shortbreak: 5 * 60,
  longbreak: 15 * 60,
};

const PHASE_LABELS: Record<Phase, string> = {
  work: "FOCUS",
  shortbreak: "SHORT BREAK",
  longbreak: "LONG BREAK",
};

const PHASE_COLORS: Record<Phase, string> = {
  work: "rgba(39,215,224,0.9)",
  shortbreak: "rgba(52,211,153,0.9)",
  longbreak: "rgba(167,139,250,0.9)",
};

const PHASE_BG: Record<Phase, string> = {
  work: "rgba(39,215,224,0.08)",
  shortbreak: "rgba(52,211,153,0.08)",
  longbreak: "rgba(167,139,250,0.08)",
};

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio not available
  }
}

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface PomodoroStats {
  totalSessions: number;
  totalMinutes: number;
}

export function PomodoroTimer(_props: {
  windowProps?: Record<string, unknown>;
}) {
  const { data: stats, set: setStats } = useCanisterKV<PomodoroStats>(
    "decentos_pomodoro_stats",
    { totalSessions: 0, totalMinutes: 0 },
  );
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATIONS.work);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = PHASE_DURATIONS[phase];
  const progress = secondsLeft / total;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const nextPhase = useCallback(
    (currentPhase: Phase, currentSessions: number): Phase => {
      if (currentPhase === "work") {
        const newSessions = currentSessions + 1;
        return newSessions % 4 === 0 ? "longbreak" : "shortbreak";
      }
      return "work";
    },
    [],
  );

  const advance = useCallback(() => {
    setRunning(false);
    playBeep();
    setPhase((p) => {
      setSessions((s) => {
        const newSessions = p === "work" ? s + 1 : s;
        if (p === "work") {
          setStats({
            totalSessions: stats.totalSessions + 1,
            totalMinutes: stats.totalMinutes + 25,
          });
        }
        const np = nextPhase(p, newSessions);
        setSecondsLeft(PHASE_DURATIONS[np]);
        return newSessions;
      });
      return nextPhase(p, sessions);
    });
  }, [nextPhase, sessions, stats, setStats]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            advance();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running, advance]);

  const handleReset = () => {
    setRunning(false);
    setPhase("work");
    setSecondsLeft(PHASE_DURATIONS.work);
    setSessions(0);
  };

  const handleSkip = () => {
    setRunning(false);
    playBeep();
    const np = nextPhase(phase, phase === "work" ? sessions + 1 : sessions);
    if (phase === "work") setSessions((s) => s + 1);
    setPhase(np);
    setSecondsLeft(PHASE_DURATIONS[np]);
  };

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const color = PHASE_COLORS[phase];
  const bg = PHASE_BG[phase];

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 select-none">
      <div
        className="flex gap-1 rounded-lg p-1"
        style={{ background: "var(--os-border-subtle)" }}
      >
        {(["work", "shortbreak", "longbreak"] as Phase[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setRunning(false);
              setPhase(p);
              setSecondsLeft(PHASE_DURATIONS[p]);
            }}
            data-ocid={`pomodoro.${p}.tab`}
            className="px-3 py-1 text-xs rounded-md transition-all"
            style={{
              background: phase === p ? bg : "transparent",
              color: phase === p ? color : "var(--os-text-secondary)",
              border:
                phase === p ? `1px solid ${color}40` : "1px solid transparent",
            }}
          >
            {p === "work" ? "Focus" : p === "shortbreak" ? "Short" : "Long"}
          </button>
        ))}
      </div>

      <motion.p
        key={phase}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-semibold tracking-widest"
        style={{ color }}
      >
        {PHASE_LABELS[phase]}
      </motion.p>

      <div className="relative flex items-center justify-center">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          role="img"
          aria-label="Pomodoro timer progress"
        >
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="var(--os-border-subtle)"
            strokeWidth="10"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            className="text-4xl font-mono font-bold"
            style={{ color, textShadow: `0 0 20px ${color}60` }}
          >
            {minutes}:{seconds}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {sessions} session{sessions !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleReset}
          data-ocid="pomodoro.reset.button"
          className="px-3 py-2 text-xs rounded-lg transition-all hover:bg-white/8 text-muted-foreground hover:text-foreground border border-white/10"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          data-ocid="pomodoro.primary_button"
          className="px-8 py-2 text-sm font-semibold rounded-xl transition-all"
          style={{
            background: running ? "var(--os-border-subtle)" : bg,
            color: running ? "var(--os-text-secondary)" : color,
            border: `1px solid ${color}50`,
            boxShadow: running ? "none" : `0 0 16px ${color}30`,
          }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          data-ocid="pomodoro.skip.button"
          className="px-3 py-2 text-xs rounded-lg transition-all hover:bg-white/8 text-muted-foreground hover:text-foreground border border-white/10"
        >
          Skip
        </button>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i < sessions % 4 ? color : "var(--os-text-muted)",
              boxShadow: i < sessions % 4 ? `0 0 6px ${color}` : "none",
            }}
          />
        ))}
      </div>

      {/* All-time stats */}
      <div
        className="flex gap-6 text-center"
        style={{
          borderTop: "1px solid var(--os-border-subtle)",
          paddingTop: 12,
          width: "100%",
        }}
      >
        <div style={{ flex: 1 }}>
          <div className="text-xs font-bold" style={{ color }}>
            {stats.totalSessions}
          </div>
          <div
            className="text-[10px]"
            style={{ color: "var(--os-text-muted)" }}
          >
            total sessions
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="text-xs font-bold" style={{ color }}>
            {stats.totalMinutes}
          </div>
          <div
            className="text-[10px]"
            style={{ color: "var(--os-text-muted)" }}
          >
            total minutes
          </div>
        </div>
      </div>
    </div>
  );
}
