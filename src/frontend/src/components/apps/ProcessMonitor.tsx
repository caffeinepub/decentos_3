import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Cpu, RefreshCw, Server, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProcessSummary, SystemStats } from "../../backend.d";
import { useOS } from "../../context/OSContext";
import { useActor } from "../../hooks/useActor";

function formatUptime(startTimeBigInt: bigint): string {
  const startMs = Number(startTimeBigInt / BigInt(1_000_000));
  const nowMs = Date.now();
  const diffSec = Math.floor((nowMs - startMs) / 1000);
  if (diffSec < 60) return `${diffSec}s`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ${diffSec % 60}s`;
  return `${Math.floor(diffSec / 3600)}h ${Math.floor((diffSec % 3600) / 60)}m`;
}

function formatSystemUptime(): string {
  const nowMs = Date.now();
  const startMs = nowMs - (performance.now() || 0);
  const diffSec = Math.floor((nowMs - startMs) / 1000);
  if (diffSec < 60) return `${diffSec}s`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
  return `${Math.floor(diffSec / 3600)}h ${Math.floor((diffSec % 3600) / 60)}m`;
}

function formatSystemTime(t: bigint): string {
  const ms = Number(t / BigInt(1_000_000));
  return new Date(ms).toLocaleTimeString();
}

function formatCycles(c: bigint): string {
  if (c > BigInt(1_000_000_000)) return `${(Number(c) / 1e9).toFixed(2)}B`;
  if (c > BigInt(1_000_000)) return `${(Number(c) / 1e6).toFixed(2)}M`;
  if (c > BigInt(1_000)) return `${(Number(c) / 1e3).toFixed(1)}K`;
  return `${c}`;
}

function totalMemoryKB(processes: ProcessSummary[]): number {
  return processes.reduce((acc, p) => acc + Number(p.memoryUsage) / 1024, 0);
}

function MemSparkline({ history }: { history: number[] }) {
  if (history.length < 2) return null;
  const max = Math.max(...history, 1);
  const W = 60;
  const H = 20;
  const pts = history
    .map((v, i) => {
      const x = (i / (history.length - 1)) * W;
      const y = H - (v / max) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      width={W}
      height={H}
      style={{ overflow: "visible", flexShrink: 0 }}
      aria-hidden="true"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="rgba(39,215,224,0.6)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProcessMonitor() {
  const { windows, closeWindow } = useOS();
  const { actor, isFetching } = useActor();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [processes, setProcesses] = useState<ProcessSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmKillId, setConfirmKillId] = useState<string | null>(null);
  const memHistoryRef = useRef<Record<string, number[]>>({});

  const fetchData = useCallback(async () => {
    if (!actor || isFetching) return;
    setLoading(true);
    try {
      const appIds = windows
        .filter((w) => !Number.isNaN(Number(w.appId)))
        .map((w) => Number(w.appId));
      const [sysStats, procs] = await Promise.all([
        actor.getSystemStats(),
        actor.listRunningProcesses(new Uint32Array(appIds)),
      ]);
      setStats(sysStats);
      setProcesses(procs);
      // Update memory history
      for (const proc of procs) {
        const key = String(proc.appId);
        const hist = memHistoryRef.current[key] ?? [];
        hist.push(Number(proc.memoryUsage) / 1024);
        if (hist.length > 10) hist.shift();
        memHistoryRef.current[key] = hist;
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching, windows]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const openWindows = windows.filter((w) => !w.minimized);

  const maxMem = Math.max(1, ...processes.map((p) => Number(p.memoryUsage)));
  const maxCycles = Math.max(
    1,
    ...processes.map((p) => Number(p.cyclesUsed ?? BigInt(0))),
  );

  const handleKillConfirmed = (winId: string) => {
    closeWindow(winId);
    setConfirmKillId(null);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(8,12,16,0.97)" }}
    >
      {/* System Overview Panel */}
      <div
        className="flex-shrink-0 px-3 py-2"
        style={{
          borderBottom: "1px solid rgba(39,215,224,0.15)",
          background: "rgba(11,20,26,0.9)",
        }}
        data-ocid="processmonitor.panel"
      >
        <div className="flex items-center gap-1 mb-2">
          <Activity className="w-4 h-4 os-cyan-text" />
          <span className="text-xs font-semibold os-cyan-text tracking-wider">
            PROCESS MONITOR
          </span>
          {loading && (
            <RefreshCw className="w-3 h-3 text-muted-foreground/50 animate-spin ml-auto" />
          )}
        </div>

        {/* System Overview */}
        <div
          className="grid grid-cols-3 gap-2 mb-2 p-2 rounded"
          style={{
            background: "rgba(39,215,224,0.04)",
            border: "1px solid rgba(39,215,224,0.08)",
          }}
          data-ocid="processmonitor.section"
        >
          <div className="flex items-center gap-1.5">
            <Server
              className="w-3 h-3"
              style={{ color: "rgba(39,215,224,0.6)" }}
            />
            <div>
              <p
                className="text-[9px]"
                style={{ color: "var(--os-text-muted)" }}
              >
                Running Apps
              </p>
              <p
                className="text-xs font-bold font-mono"
                style={{ color: "var(--os-accent)" }}
              >
                {openWindows.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu
              className="w-3 h-3"
              style={{ color: "rgba(39,215,224,0.6)" }}
            />
            <div>
              <p
                className="text-[9px]"
                style={{ color: "var(--os-text-muted)" }}
              >
                Total Memory
              </p>
              <p
                className="text-xs font-bold font-mono"
                style={{ color: "var(--os-accent)" }}
              >
                {totalMemoryKB(processes).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap
              className="w-3 h-3"
              style={{ color: "rgba(39,215,224,0.6)" }}
            />
            <div>
              <p
                className="text-[9px]"
                style={{ color: "var(--os-text-muted)" }}
              >
                Uptime
              </p>
              <p
                className="text-xs font-bold font-mono"
                style={{ color: "var(--os-accent)" }}
              >
                {formatSystemUptime()}
              </p>
            </div>
          </div>
        </div>

        {stats ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              {
                label: "OS Version",
                value: stats.osVersion,
                icon: <Cpu className="w-3 h-3" />,
              },
              {
                label: "System Time",
                value: formatSystemTime(stats.systemTime),
                icon: null,
              },
              {
                label: "Cycles Balance",
                value: formatCycles(stats.simulatedCyclesBalance),
                icon: <Zap className="w-3 h-3" />,
              },
              {
                label: "Installed Apps",
                value: String(stats.totalInstalledApps),
                icon: null,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded px-2 py-1.5"
                style={{
                  background: "rgba(39,215,224,0.05)",
                  border: "1px solid rgba(39,215,224,0.1)",
                }}
              >
                <div className="flex items-center gap-1 text-muted-foreground/60 text-[10px] mb-0.5">
                  {stat.icon}
                  {stat.label}
                </div>
                <div className="text-xs font-mono os-cyan-text font-semibold">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="h-12 rounded animate-pulse"
            style={{ background: "rgba(39,215,224,0.05)" }}
            data-ocid="processmonitor.loading_state"
          />
        )}
      </div>

      {/* Process Table */}
      <ScrollArea className="flex-1">
        <table className="w-full text-xs">
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(39,215,224,0.15)",
                background: "rgba(11,20,26,0.8)",
              }}
            >
              {[
                "PID",
                "App Name",
                "Memory",
                "Cycles",
                "Uptime",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-[10px] font-semibold tracking-wider"
                  style={{ color: "rgba(39,215,224,0.6)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {openWindows.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div
                    className="flex flex-col items-center justify-center gap-2 py-12"
                    data-ocid="processmonitor.empty_state"
                  >
                    <Activity className="w-8 h-8 text-muted-foreground/20" />
                    <p className="text-muted-foreground/40 text-xs">
                      No processes running
                    </p>
                    <p className="text-muted-foreground/25 text-[10px]">
                      Open apps from the desktop to see them here
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              openWindows.map((win, idx) => {
                const proc = processes.find(
                  (p) => String(p.appId) === win.appId,
                );
                const memPct = proc
                  ? Math.round((Number(proc.memoryUsage) / maxMem) * 100)
                  : 0;
                const cyclesPct = proc?.cyclesUsed
                  ? Math.round((Number(proc.cyclesUsed) / maxCycles) * 100)
                  : 0;
                const isConfirming = confirmKillId === win.id;

                return (
                  <tr
                    key={win.id}
                    data-ocid={`processmonitor.row.item.${idx + 1}`}
                    className="group transition-colors"
                    style={{
                      borderBottom: "1px solid rgba(39,215,224,0.06)",
                      background:
                        idx % 2 === 0 ? "rgba(39,215,224,0.02)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = "rgba(39,215,224,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background =
                        idx % 2 === 0 ? "rgba(39,215,224,0.02)" : "transparent";
                    }}
                  >
                    <td className="px-3 py-2 font-mono text-muted-foreground/50">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 font-semibold text-foreground/80">
                      {win.title}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-muted-foreground/70 text-[10px]">
                            {proc
                              ? `${(Number(proc.memoryUsage) / 1024).toFixed(1)} KB`
                              : "\u2014"}
                          </span>
                          {proc && (
                            <MemSparkline
                              history={
                                memHistoryRef.current[String(proc.appId)] ?? []
                              }
                            />
                          )}
                        </div>
                        {proc && (
                          <Progress
                            value={memPct}
                            className="h-1 w-16"
                            style={{
                              background: "rgba(39,215,224,0.1)",
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-muted-foreground/70 text-[10px]">
                          {proc?.cyclesUsed != null
                            ? formatCycles(proc.cyclesUsed)
                            : "\u2014"}
                        </span>
                        {proc?.cyclesUsed != null && (
                          <Progress
                            value={cyclesPct}
                            className="h-1 w-16"
                            style={{
                              background: "rgba(39,215,224,0.1)",
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground/70">
                      {proc ? formatUptime(proc.startTime) : "\u2014"}
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        className="text-[9px] px-1.5 py-0"
                        style={{
                          background: "rgba(39,215,224,0.15)",
                          color: "var(--os-accent)",
                          border: "1px solid rgba(39,215,224,0.3)",
                        }}
                      >
                        Running
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      {isConfirming ? (
                        <div
                          className="flex items-center gap-1"
                          data-ocid={`processmonitor.confirm.${idx + 1}.dialog`}
                        >
                          <span
                            className="text-[9px]"
                            style={{ color: "var(--os-text-secondary)" }}
                          >
                            Sure?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleKillConfirmed(win.id)}
                            data-ocid={`processmonitor.confirm_button.${idx + 1}`}
                            className="px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors"
                            style={{
                              background: "rgba(239,68,68,0.2)",
                              color: "#EF4444",
                              border: "1px solid rgba(239,68,68,0.4)",
                            }}
                          >
                            Kill
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmKillId(null)}
                            data-ocid={`processmonitor.cancel_button.${idx + 1}`}
                            className="px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors"
                            style={{
                              background: "transparent",
                              color: "var(--os-text-secondary)",
                              border: "1px solid var(--os-border-window)",
                            }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-destructive hover:bg-destructive/20 hover:text-destructive"
                          onClick={() => setConfirmKillId(win.id)}
                          data-ocid={`processmonitor.delete_button.${idx + 1}`}
                        >
                          Kill
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
