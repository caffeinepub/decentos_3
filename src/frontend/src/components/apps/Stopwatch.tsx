import { Flag, RotateCcw, Square, Timer } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Lap {
  index: number;
  lapTime: number;
  cumulative: number;
}

function formatTime(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cc = Math.floor((ms % 1000) / 10);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cc).padStart(2, "0")}`;
}

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const baseElapsedRef = useRef(0);
  const lastLapCumRef = useRef(0);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsed(baseElapsedRef.current + (Date.now() - startTimeRef.current));
    }, 33);
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    baseElapsedRef.current += Date.now() - startTimeRef.current;
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    baseElapsedRef.current = 0;
    lastLapCumRef.current = 0;
    setElapsed(0);
    setRunning(false);
    setLaps([]);
  }, []);

  const addLap = useCallback(() => {
    if (!running) return;
    const cumulative = elapsed;
    const lapTime = cumulative - lastLapCumRef.current;
    lastLapCumRef.current = cumulative;
    setLaps((prev) => [
      { index: prev.length + 1, lapTime, cumulative },
      ...prev,
    ]);
  }, [elapsed, running]);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  const lapTimes = laps.map((l) => l.lapTime);
  const fastest = lapTimes.length > 1 ? Math.min(...lapTimes) : null;
  const slowest = lapTimes.length > 1 ? Math.max(...lapTimes) : null;

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(11,15,18,0.6)" }}
    >
      <div className="flex flex-col items-center justify-center py-8 flex-shrink-0">
        <div className="flex items-center gap-2 mb-5">
          <Timer
            className="w-4 h-4"
            style={{ color: "rgba(39,215,224,0.5)" }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(39,215,224,0.5)" }}
          >
            Stopwatch
          </span>
        </div>
        <div
          className="font-mono font-bold tracking-tight select-none"
          style={{
            fontSize: "clamp(32px,6vw,52px)",
            color: running
              ? "rgba(39,215,224,0.95)"
              : elapsed > 0
                ? "rgba(220,235,240,0.9)"
                : "rgba(220,235,240,0.4)",
            textShadow: running ? "0 0 24px rgba(39,215,224,0.4)" : "none",
            transition: "color 0.3s, text-shadow 0.3s",
            letterSpacing: "-0.02em",
          }}
          data-ocid="stopwatch.panel"
        >
          {formatTime(elapsed)}
        </div>
        {running && laps.length > 0 && (
          <div
            className="mt-2 text-sm font-mono"
            style={{ color: "rgba(180,200,210,0.35)" }}
          >
            Lap {laps.length + 1}: {formatTime(elapsed - lastLapCumRef.current)}
          </div>
        )}
        <div className="flex items-center gap-4 mt-8">
          <button
            type="button"
            onClick={reset}
            disabled={elapsed === 0}
            data-ocid="stopwatch.secondary_button"
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
              color: "rgba(180,200,210,0.7)",
            }}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={running ? stop : start}
            data-ocid="stopwatch.primary_button"
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
            style={{
              background: running
                ? "rgba(239,68,68,0.15)"
                : "rgba(39,215,224,0.15)",
              border: running
                ? "2px solid rgba(239,68,68,0.5)"
                : "2px solid rgba(39,215,224,0.5)",
              color: running ? "rgba(252,165,165,0.9)" : "rgba(39,215,224,0.9)",
              boxShadow: running
                ? "0 0 24px rgba(239,68,68,0.15)"
                : "0 0 24px rgba(39,215,224,0.1)",
            }}
          >
            {running ? (
              <Square className="w-6 h-6" fill="currentColor" />
            ) : (
              <span className="font-semibold text-sm tracking-wider">GO</span>
            )}
          </button>
          <button
            type="button"
            onClick={addLap}
            disabled={!running}
            data-ocid="stopwatch.toggle"
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
              color: "rgba(180,200,210,0.7)",
            }}
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {laps.length > 0 ? (
        <div
          className="flex-1 overflow-y-auto border-t"
          style={{ borderColor: "rgba(42,58,66,0.8)" }}
        >
          <div
            className="px-4 py-2 grid text-[10px] font-semibold uppercase tracking-widest"
            style={{
              color: "rgba(180,200,210,0.3)",
              gridTemplateColumns: "2rem 1fr 1fr",
            }}
          >
            <span>#</span>
            <span>Lap</span>
            <span>Total</span>
          </div>
          {laps.map((lap, i) => {
            const isFastest = fastest !== null && lap.lapTime === fastest;
            const isSlowest = slowest !== null && lap.lapTime === slowest;
            return (
              <div
                key={lap.index}
                data-ocid={`stopwatch.item.${i + 1}`}
                className="px-4 py-2.5 grid items-center text-[12px] font-mono"
                style={{
                  gridTemplateColumns: "2rem 1fr 1fr",
                  borderBottom: "1px solid rgba(42,58,66,0.3)",
                  background: isFastest
                    ? "rgba(34,197,94,0.05)"
                    : isSlowest
                      ? "rgba(239,68,68,0.05)"
                      : "transparent",
                }}
              >
                <span style={{ color: "rgba(180,200,210,0.3)" }}>
                  {lap.index}
                </span>
                <span
                  style={{
                    color: isFastest
                      ? "rgba(74,222,128,0.9)"
                      : isSlowest
                        ? "rgba(252,165,165,0.9)"
                        : "rgba(220,235,240,0.8)",
                  }}
                >
                  {formatTime(lap.lapTime)}
                  {isFastest && (
                    <span
                      className="ml-1.5 text-[9px]"
                      style={{ color: "rgba(74,222,128,0.6)" }}
                    >
                      ▲ best
                    </span>
                  )}
                  {isSlowest && (
                    <span
                      className="ml-1.5 text-[9px]"
                      style={{ color: "rgba(252,165,165,0.6)" }}
                    >
                      ▼ slow
                    </span>
                  )}
                </span>
                <span style={{ color: "rgba(180,200,210,0.45)" }}>
                  {formatTime(lap.cumulative)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="flex-1 flex items-center justify-center"
          data-ocid="stopwatch.empty_state"
        >
          <p className="text-xs" style={{ color: "rgba(180,200,210,0.2)" }}>
            Press GO then Flag to record laps
          </p>
        </div>
      )}
    </div>
  );
}
