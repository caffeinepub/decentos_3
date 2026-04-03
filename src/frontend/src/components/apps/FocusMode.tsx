import {
  CheckCircle,
  CloudRain,
  Coffee,
  Pause,
  Play,
  RotateCcw,
  Target,
  Volume2,
  VolumeX,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AmbientSound = "none" | "whitenoise" | "rain" | "cafe";

interface Session {
  id: string;
  duration: number; // seconds
  sound: AmbientSound;
  completedAt: number;
}

const STORAGE_KEY = "decentos_focusmode_sessions";
const DEFAULT_DURATION = 25 * 60; // 25 minutes

function loadSessions(): Session[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return `${m}m`;
}

// Web Audio API ambient sound generators
function createWhiteNoise(ctx: AudioContext): AudioNode {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start();
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  source.connect(gain);
  return gain;
}

function createRainNoise(ctx: AudioContext): AudioNode {
  // Pink-ish noise via filtered white noise
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start();
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 900;
  const filter2 = ctx.createBiquadFilter();
  filter2.type = "lowpass";
  filter2.frequency.value = 6000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  source.connect(filter);
  filter.connect(filter2);
  filter2.connect(gain);
  return gain;
}

function createCafeNoise(ctx: AudioContext): AudioNode {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start();
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 400;
  filter.Q.value = 0.3;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  source.connect(filter);
  filter.connect(gain);
  return gain;
}

const SOUND_OPTIONS: {
  id: AmbientSound;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "none", label: "Silent", icon: VolumeX },
  { id: "whitenoise", label: "White Noise", icon: Wind },
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "cafe", label: "Café", icon: Coffee },
];

const PRESET_DURATIONS = [
  { label: "5m", value: 5 * 60 },
  { label: "15m", value: 15 * 60 },
  { label: "25m", value: 25 * 60 },
  { label: "50m", value: 50 * 60 },
];

export function FocusMode() {
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_DURATION);
  const [remaining, setRemaining] = useState(DEFAULT_DURATION);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState<AmbientSound>("none");
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodeRef = useRef<AudioNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            // Log completed session
            const newSession: Session = {
              id: `session-${Date.now()}`,
              duration: totalSeconds,
              sound,
              completedAt: Date.now(),
            };
            setSessions((prev) => {
              const updated = [newSession, ...prev].slice(0, 10);
              saveSessions(updated);
              return updated;
            });
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
  }, [running, totalSeconds, sound]);

  // Audio management
  useEffect(() => {
    if (sound === "none" || !running) {
      if (audioNodeRef.current) {
        try {
          (audioNodeRef.current as GainNode).gain.setValueAtTime(
            0,
            audioCtxRef.current!.currentTime,
          );
        } catch {}
        audioNodeRef.current = null;
      }
      if (audioCtxRef.current && sound === "none") {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    // Disconnect old node
    if (audioNodeRef.current) {
      try {
        (audioNodeRef.current as GainNode).gain.setValueAtTime(
          0,
          ctx.currentTime,
        );
      } catch {}
      audioNodeRef.current = null;
    }

    let node: AudioNode;
    if (sound === "whitenoise") node = createWhiteNoise(ctx);
    else if (sound === "rain") node = createRainNoise(ctx);
    else node = createCafeNoise(ctx);

    node.connect(ctx.destination);
    audioNodeRef.current = node;

    return () => {
      try {
        (node as GainNode).gain.setValueAtTime(0, ctx.currentTime);
      } catch {}
    };
  }, [sound, running]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  const progress =
    totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 90;
  const dashOffset = circumference * (1 - progress);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setRemaining(totalSeconds);
  };
  const setPreset = (secs: number) => {
    setRunning(false);
    setTotalSeconds(secs);
    setRemaining(secs);
  };

  const soundActive = sound !== "none" && running;

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "var(--os-bg-app)",
        color: "var(--os-text-primary)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 pt-4 pb-3 border-b"
        style={{ borderColor: "var(--os-border-subtle)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)" }}
        >
          <Target className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--os-text-primary)" }}
          >
            Focus Mode
          </h2>
          <p className="text-[10px]" style={{ color: "var(--os-text-muted)" }}>
            Deep work, one session at a time
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto px-6 py-5 gap-6">
        {/* Preset durations */}
        <div className="flex gap-2">
          {PRESET_DURATIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPreset(p.value)}
              className="px-3 h-7 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:
                  totalSeconds === p.value
                    ? "rgba(124,58,237,0.25)"
                    : "var(--os-bg-elevated)",
                border:
                  totalSeconds === p.value
                    ? "1px solid rgba(124,58,237,0.5)"
                    : "1px solid var(--os-border-subtle)",
                color:
                  totalSeconds === p.value
                    ? "rgba(167,139,250,1)"
                    : "var(--os-text-secondary)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Circular timer */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 220, height: 220 }}
        >
          <svg
            width="220"
            height="220"
            className="-rotate-90"
            aria-label="Focus timer progress"
            role="img"
          >
            <circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              stroke="var(--os-border-subtle)"
              strokeWidth="8"
            />
            <circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              stroke={
                remaining === 0
                  ? "rgba(74,222,128,0.9)"
                  : "rgba(124,58,237,0.9)"
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-mono font-bold"
              style={{
                fontSize: 48,
                letterSpacing: "-0.04em",
                color:
                  remaining === 0
                    ? "rgba(74,222,128,0.9)"
                    : "var(--os-text-primary)",
              }}
            >
              {formatTime(remaining)}
            </span>
            {remaining === 0 ? (
              <span
                className="text-xs mt-1"
                style={{ color: "rgba(74,222,128,0.8)" }}
              >
                Session complete!
              </span>
            ) : (
              <span
                className="text-[11px] mt-1"
                style={{ color: "var(--os-text-muted)" }}
              >
                {running ? "Focusing…" : "Ready"}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {running ? (
            <button
              type="button"
              onClick={handlePause}
              data-ocid="focusmode.toggle"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background: "rgba(124,58,237,0.2)",
                border: "2px solid rgba(124,58,237,0.5)",
                color: "rgba(167,139,250,1)",
              }}
            >
              <Pause className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStart}
              data-ocid="focusmode.toggle"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background:
                  remaining === 0
                    ? "rgba(74,222,128,0.15)"
                    : "rgba(124,58,237,0.2)",
                border:
                  remaining === 0
                    ? "2px solid rgba(74,222,128,0.4)"
                    : "2px solid rgba(124,58,237,0.5)",
                color:
                  remaining === 0
                    ? "rgba(74,222,128,0.9)"
                    : "rgba(167,139,250,1)",
              }}
            >
              <Play className="w-5 h-5 ml-0.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            data-ocid="focusmode.secondary_button"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1.5px solid var(--os-border-subtle)",
              color: "var(--os-text-secondary)",
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient sound picker */}
        <div className="w-full max-w-xs">
          <p
            className="text-[10px] font-semibold mb-2 uppercase tracking-widest"
            style={{ color: "var(--os-text-muted)" }}
          >
            Ambient Sound
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SOUND_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = sound === opt.id;
              const isPlaying = active && soundActive;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSound(opt.id)}
                  data-ocid="focusmode.toggle"
                  className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all"
                  style={{
                    background: active
                      ? "rgba(124,58,237,0.18)"
                      : "var(--os-bg-elevated)",
                    border: active
                      ? "1px solid rgba(124,58,237,0.4)"
                      : "1px solid var(--os-border-subtle)",
                  }}
                >
                  <div className="relative">
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: active
                          ? "rgba(167,139,250,1)"
                          : "var(--os-text-secondary)",
                      }}
                    />
                    {isPlaying && (
                      <span
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                        style={{ background: "rgba(74,222,128,0.9)" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: active
                        ? "rgba(167,139,250,0.9)"
                        : "var(--os-text-muted)",
                    }}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Session log */}
        {sessions.length > 0 && (
          <div className="w-full max-w-xs">
            <p
              className="text-[10px] font-semibold mb-2 uppercase tracking-widest"
              style={{ color: "var(--os-text-muted)" }}
            >
              Recent Sessions
            </p>
            <div className="space-y-1.5">
              {sessions.slice(0, 5).map((s, i) => {
                const opt = SOUND_OPTIONS.find((o) => o.id === s.sound);
                const Icon = opt?.icon ?? Volume2;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                    data-ocid={`focusmode.item.${i + 1}`}
                    style={{
                      background: "var(--os-bg-elevated)",
                      border: "1px solid var(--os-border-subtle)",
                    }}
                  >
                    <CheckCircle
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: "rgba(74,222,128,0.7)" }}
                    />
                    <span
                      className="flex-1 text-xs"
                      style={{ color: "var(--os-text-primary)" }}
                    >
                      {formatDuration(s.duration)} session
                    </span>
                    <Icon
                      className="w-3 h-3 flex-shrink-0"
                      style={{ color: "var(--os-text-muted)" }}
                    />
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--os-text-muted)" }}
                    >
                      {new Date(s.completedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div
            className="w-full max-w-xs flex flex-col items-center gap-2 py-4"
            data-ocid="focusmode.empty_state"
          >
            <Target
              className="w-8 h-8"
              style={{ color: "var(--os-text-muted)" }}
            />
            <p className="text-xs" style={{ color: "var(--os-text-muted)" }}>
              Complete a session to start your log
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
