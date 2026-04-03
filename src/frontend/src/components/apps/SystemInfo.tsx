import { Button } from "@/components/ui/button";
import {
  Activity,
  Copy,
  Cpu,
  Database,
  HardDrive,
  Package,
  Server,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInstalledApps } from "../../context/InstalledAppsContext";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface SystemInfoProps {
  windowProps?: Record<string, unknown>;
}

function formatMemory(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatCycles(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return String(n);
}

export function SystemInfo({ windowProps: _windowProps }: SystemInfoProps) {
  const { installedApps } = useInstalledApps();
  const { data: notes, set: setNotes } = useCanisterKV<string>(
    "systeminfo-notes",
    "",
  );
  const [notesValue, setNotesValue] = useState("");
  const [uptime, setUptime] = useState(0);

  // Mock system stats — realistic ICP canister values
  const cycles = 847_392_847_219;
  const stableMemoryBytes = 4_821_330;
  const heapBytes = 12_450_882;
  const installedCount = installedApps.length;

  useEffect(() => {
    setNotesValue(notes);
  }, [notes]);

  // Uptime counter (random start, seconds since mount)
  useEffect(() => {
    const base = Math.floor(Math.random() * 86400 * 3); // up to 3 days
    setUptime(base);
    const interval = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (secs: number) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const generateReport = () => {
    return [
      "DecentOS System Report",
      `Generated: ${new Date().toISOString()}`,
      "",
      "OS Version: DecentOS v63",
      `Cycles Balance: ${formatCycles(cycles)} (${cycles.toLocaleString()} raw)`,
      `Stable Memory: ${formatMemory(stableMemoryBytes)}`,
      `Heap Memory: ${formatMemory(heapBytes)}`,
      `Installed Apps: ${installedCount}`,
      `Uptime: ${formatUptime(uptime)}`,
      "Platform: Internet Computer (ICP)",
    ].join("\n");
  };

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport());
    toast.success("System report copied to clipboard");
  };

  const stats = [
    {
      icon: <Server className="w-4 h-4" style={{ color: "rgb(39,215,224)" }} />,
      label: "OS Version",
      value: "DecentOS v63",
    },
    {
      icon: <Zap className="w-4 h-4" style={{ color: "#FEBC2E" }} />,
      label: "Cycles Balance",
      value: `${formatCycles(cycles)}`,
    },
    {
      icon: <HardDrive className="w-4 h-4" style={{ color: "#28C840" }} />,
      label: "Stable Memory",
      value: formatMemory(stableMemoryBytes),
    },
    {
      icon: <Cpu className="w-4 h-4" style={{ color: "#a78bfa" }} />,
      label: "Heap Memory",
      value: formatMemory(heapBytes),
    },
    {
      icon: (
        <Package className="w-4 h-4" style={{ color: "rgb(39,215,224)" }} />
      ),
      label: "Installed Apps",
      value: String(installedCount),
    },
    {
      icon: <Activity className="w-4 h-4" style={{ color: "#f472b6" }} />,
      label: "Uptime",
      value: formatUptime(uptime),
    },
    {
      icon: (
        <Database className="w-4 h-4" style={{ color: "rgb(39,215,224)" }} />
      ),
      label: "Platform",
      value: "Internet Computer",
    },
  ];

  return (
    <div
      data-ocid="systeminfo.panel"
      className="flex flex-col h-full overflow-y-auto"
      style={{
        background: "rgba(11,15,18,0.6)",
        padding: 16,
        gap: 16,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Server
            className="w-5 h-5"
            style={{
              color: "rgb(39,215,224)",
              filter: "drop-shadow(0 0 6px rgba(39,215,224,0.5))",
            }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: "rgb(39,215,224)" }}
          >
            System Information
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs gap-1"
          onClick={copyReport}
          data-ocid="systeminfo.primary_button"
          style={{
            color: "rgb(39,215,224)",
            border: "1px solid rgba(39,215,224,0.3)",
          }}
        >
          <Copy className="w-3 h-3" />
          Copy Report
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-2 flex-shrink-0">
        {stats.map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5"
            style={{
              background: "rgba(20,32,42,0.6)",
              border: "1px solid rgba(39,215,224,0.1)",
            }}
          >
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: "var(--os-text-muted)" }}
              >
                {label}
              </div>
              <div
                className="text-sm font-mono font-medium"
                style={{ color: "var(--os-text-primary)" }}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Memory bar */}
      <div
        className="rounded-lg p-3 flex-shrink-0"
        style={{
          background: "rgba(20,32,42,0.6)",
          border: "1px solid rgba(39,215,224,0.1)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--os-text-secondary)" }}
          >
            Stable Memory Usage
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(39,215,224,0.8)" }}
          >
            {formatMemory(stableMemoryBytes)} / 400 GB
          </span>
        </div>
        <div
          className="h-1.5 rounded-full"
          style={{ background: "var(--os-border-subtle)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${(stableMemoryBytes / (400 * 1024 * 1024 * 1024)) * 100}%`,
              background:
                "linear-gradient(to right, rgba(39,215,224,0.8), rgba(39,215,224,0.4))",
              minWidth: 4,
            }}
          />
        </div>
        <p
          className="text-[10px] mt-1.5"
          style={{ color: "var(--os-text-muted)" }}
        >
          400 GB total canister capacity
        </p>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2 flex-1">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--os-text-secondary)" }}
        >
          System Notes
        </span>
        <textarea
          data-ocid="systeminfo.textarea"
          value={notesValue}
          onChange={(e) => setNotesValue(e.target.value)}
          onBlur={() => {
            if (notesValue !== notes) setNotes(notesValue);
          }}
          placeholder="Add notes about this system instance..."
          className="flex-1 resize-none rounded-lg p-2 text-xs outline-none"
          style={{
            background: "rgba(20,32,42,0.6)",
            border: "1px solid rgba(39,215,224,0.1)",
            color: "var(--os-text-primary)",
            fontFamily: "monospace",
            minHeight: 80,
          }}
        />
      </div>
    </div>
  );
}
