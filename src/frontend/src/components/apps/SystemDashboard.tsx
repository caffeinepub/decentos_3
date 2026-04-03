import { useEffect, useRef, useState } from "react";
import type { SystemStats } from "../../backend.d";
import { useOS } from "../../context/OSContext";
import { useActor } from "../../hooks/useActor";

interface ActivityEntry {
  uid: number;
  time: string;
  message: string;
}

function fmtCycles(n: bigint): string {
  const num = Number(n);
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  return num.toString();
}

function fmtUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

const PAGE_LOAD = Date.now();
let activityCounter = 0;

export function SystemDashboard() {
  const { windows } = useOS();
  const { actor } = useActor();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [uptime, setUptime] = useState(0);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const prevWindowsRef = useRef<string[]>([]);

  // fetch system stats
  useEffect(() => {
    const doFetch = async () => {
      if (!actor) return;
      try {
        const s = await actor.getSystemStats();
        setStats(s);
      } catch {}
    };
    doFetch();
    const id = setInterval(doFetch, 2000);
    return () => clearInterval(id);
  }, [actor]);

  // uptime ticker
  useEffect(() => {
    const id = setInterval(() => setUptime(Date.now() - PAGE_LOAD), 1000);
    return () => clearInterval(id);
  }, []);

  // activity tracking
  useEffect(() => {
    const currentIds = windows.map((w) => w.id);
    const prevIds = prevWindowsRef.current;

    const opened = windows.filter((w) => !prevIds.includes(w.id));
    const closed = prevIds.filter((id) => !currentIds.includes(id));

    const now = new Date().toLocaleTimeString();
    const entries: ActivityEntry[] = [];

    for (const w of opened) {
      entries.push({
        uid: ++activityCounter,
        time: now,
        message: `${w.title} opened`,
      });
    }
    for (const id of closed) {
      entries.push({
        uid: ++activityCounter,
        time: now,
        message: `Window ${id} closed`,
      });
    }

    if (entries.length > 0) {
      setActivity((prev) => [...entries, ...prev].slice(0, 50));
    }

    prevWindowsRef.current = currentIds;
  }, [windows]);

  // window type counts
  const windowCounts: Record<string, number> = {};
  for (const w of windows) {
    windowCounts[w.appId] = (windowCounts[w.appId] ?? 0) + 1;
  }
  const maxCount = Math.max(1, ...Object.values(windowCounts));

  const cyclesTotal = stats ? Number(stats.simulatedCyclesBalance) : 0;
  const cyclesMax = 1_000_000_000_000;
  const cyclesPct = Math.min(100, (cyclesTotal / cyclesMax) * 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (cyclesPct / 100) * circumference;

  const StatCard = ({
    label,
    value,
    sub,
    accent = false,
  }: { label: string; value: string; sub?: string; accent?: boolean }) => (
    <div
      className="flex-1 rounded-lg p-3 flex flex-col gap-1"
      style={{
        background: "rgba(39,215,224,0.04)",
        border: `1px solid rgba(39,215,224,${accent ? 0.4 : 0.15})`,
      }}
    >
      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      <p
        className="text-lg font-bold font-mono leading-none"
        style={{ color: accent ? "#27D7E0" : undefined }}
      >
        {value}
      </p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );

  return (
    <div
      className="flex flex-col gap-3 p-4 h-full overflow-y-auto text-foreground"
      data-ocid="dashboard.panel"
    >
      {/* Stat cards */}
      <div className="flex gap-2" data-ocid="dashboard.row">
        <StatCard label="OS Version" value={stats?.osVersion ?? "—"} accent />
        <StatCard
          label="Active Windows"
          value={String(windows.filter((w) => !w.minimized).length)}
          sub={`${windows.length} total`}
        />
        <StatCard
          label="Cycles Balance"
          value={stats ? fmtCycles(stats.simulatedCyclesBalance) : "—"}
          sub="simulated"
        />
        <StatCard
          label="Uptime"
          value={fmtUptime(uptime)}
          sub="since page load"
        />
      </div>

      {/* Charts row */}
      <div className="flex gap-3 flex-1 min-h-0">
        {/* Window Activity bar chart */}
        <div
          className="flex-1 rounded-lg p-3 flex flex-col gap-2"
          style={{
            background: "rgba(39,215,224,0.03)",
            border: "1px solid rgba(39,215,224,0.12)",
          }}
          data-ocid="dashboard.card"
        >
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
            Window Activity
          </p>
          {Object.keys(windowCounts).length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">No windows open</p>
            </div>
          ) : (
            <div className="flex-1 flex items-end gap-2 pb-1">
              {Object.entries(windowCounts).map(([appId, count]) => (
                <div
                  key={appId}
                  className="flex flex-col items-center gap-1 flex-1"
                >
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${(count / maxCount) * 60}px`,
                      background:
                        "linear-gradient(to top, #27D7E0, rgba(39,215,224,0.3))",
                      boxShadow: "0 0 8px rgba(39,215,224,0.3)",
                    }}
                  />
                  <p className="text-[9px] text-muted-foreground truncate w-full text-center">
                    {appId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cycles gauge */}
        <div
          className="w-40 rounded-lg p-3 flex flex-col items-center justify-center gap-2"
          style={{
            background: "rgba(39,215,224,0.03)",
            border: "1px solid rgba(39,215,224,0.12)",
          }}
          data-ocid="dashboard.card"
        >
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
            Cycles Usage
          </p>
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            aria-label={`Cycles usage: ${cyclesPct.toFixed(0)}%`}
            role="img"
          >
            <title>Cycles Usage Gauge</title>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="rgba(39,215,224,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#27D7E0"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{
                transition: "stroke-dashoffset 0.5s ease",
                filter: "drop-shadow(0 0 4px #27D7E0)",
              }}
            />
            <text
              x="50"
              y="46"
              textAnchor="middle"
              fill="#27D7E0"
              fontSize="14"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {cyclesPct.toFixed(0)}%
            </text>
            <text
              x="50"
              y="58"
              textAnchor="middle"
              fill="var(--os-text-secondary)"
              fontSize="7"
              fontFamily="monospace"
            >
              of 1T
            </text>
          </svg>
          <p
            className="text-[10px] font-mono"
            style={{ color: "var(--os-accent)" }}
          >
            {stats ? fmtCycles(stats.simulatedCyclesBalance) : "—"}
          </p>
        </div>
      </div>

      {/* Recent Activity log */}
      <div
        className="rounded-lg flex flex-col"
        style={{
          background: "rgba(39,215,224,0.03)",
          border: "1px solid rgba(39,215,224,0.12)",
          maxHeight: 160,
        }}
        data-ocid="dashboard.list"
      >
        <div
          className="px-3 py-2 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground border-b flex-shrink-0"
          style={{ borderColor: "rgba(39,215,224,0.1)" }}
        >
          Recent Activity
        </div>
        <div className="overflow-y-auto flex-1">
          {activity.length === 0 ? (
            <div
              className="px-3 py-3 text-xs text-muted-foreground"
              data-ocid="dashboard.empty_state"
            >
              No activity yet. Open some apps!
            </div>
          ) : (
            activity.map((entry, i) => (
              <div
                key={entry.uid}
                className="px-3 py-1.5 flex items-center gap-3 border-b text-xs"
                style={{ borderColor: "rgba(39,215,224,0.05)" }}
                data-ocid={`dashboard.item.${i + 1}`}
              >
                <span className="font-mono text-muted-foreground text-[10px] flex-shrink-0">
                  {entry.time}
                </span>
                <span className="text-foreground/80">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
