import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Loader2, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const ACCENT = "rgba(39,215,224,";
const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";
const CARD_BG = "rgba(14,20,26,0.8)";

interface MetricDef {
  id: string;
  name: string;
  unit: string;
  color: string;
}

interface StatEntry {
  id: string;
  metricId: string;
  value: number;
  date: string;
  note: string;
}

interface LifeStatsData {
  metrics: MetricDef[];
  entries: StatEntry[];
}

const PRESET_METRICS: MetricDef[] = [
  { id: "weight", name: "Weight", unit: "kg", color: "var(--os-accent)" },
  { id: "sleep", name: "Sleep", unit: "hrs", color: "#8B5CF6" },
  { id: "energy", name: "Energy", unit: "/10", color: "#F59E0B" },
];

const DEFAULT_DATA: LifeStatsData = { metrics: PRESET_METRICS, entries: [] };

const METRIC_COLORS = [
  "#27D7E0",
  "#8B5CF6",
  "#F59E0B",
  "#22C55E",
  "#F97316",
  "#EC4899",
  "#A78BFA",
];

function BarChart({
  entries,
  metric,
}: { entries: StatEntry[]; metric: MetricDef }) {
  const last30 = entries.filter((e) => e.metricId === metric.id).slice(-30);
  if (last30.length === 0)
    return (
      <div className="text-xs" style={{ color: MUTED }}>
        No data yet
      </div>
    );

  const values = last30.map((e) => e.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const W = 400;
  const H = 80;
  const barW = Math.max(4, (W - last30.length * 2) / last30.length);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H + 20}`}
      style={{ overflow: "visible" }}
    >
      <title>{metric.name} chart</title>
      {last30.map((e, i) => {
        const h = Math.max(3, ((e.value - min) / range) * H);
        const x = i * (barW + 2);
        const y = H - h;
        return (
          <g key={e.id}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={2}
              fill={metric.color}
              opacity={0.7}
            />
            {i === last30.length - 1 && (
              <text
                x={x + barW / 2}
                y={H + 15}
                textAnchor="middle"
                fill={MUTED}
                fontSize={9}
              >
                {e.date.slice(5)}
              </text>
            )}
            {i === 0 && (
              <text
                x={x + barW / 2}
                y={H + 15}
                textAnchor="middle"
                fill={MUTED}
                fontSize={9}
              >
                {e.date.slice(5)}
              </text>
            )}
          </g>
        );
      })}
      {/* Value range labels */}
      <text x={W + 4} y={4} fill={MUTED} fontSize={9} textAnchor="start">
        {max.toFixed(1)}
      </text>
      <text x={W + 4} y={H} fill={MUTED} fontSize={9} textAnchor="start">
        {min.toFixed(1)}
      </text>
    </svg>
  );
}

export function LifeStats({
  windowProps: _windowProps,
}: { windowProps?: Record<string, unknown> }) {
  const {
    data,
    set: setData,
    loading,
  } = useCanisterKV<LifeStatsData>("decentos_lifestats", DEFAULT_DATA);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [showLogEntry, setShowLogEntry] = useState(false);
  const [newMetricName, setNewMetricName] = useState("");
  const [newMetricUnit, setNewMetricUnit] = useState("");
  const [newMetricColor, setNewMetricColor] = useState(METRIC_COLORS[0]);
  const [logValue, setLogValue] = useState("");
  const [logNote, setLogNote] = useState("");
  const [logDate, setLogDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const activeMetric = useMemo(
    () =>
      data.metrics.find((m) => m.id === selectedMetric) ??
      data.metrics[0] ??
      null,
    [data.metrics, selectedMetric],
  );

  const addMetric = () => {
    if (!newMetricName.trim()) return;
    const metric: MetricDef = {
      id: Date.now().toString(),
      name: newMetricName.trim(),
      unit: newMetricUnit.trim() || "unit",
      color: newMetricColor,
    };
    setData({ ...data, metrics: [...data.metrics, metric] });
    setNewMetricName("");
    setNewMetricUnit("");
    setShowAddMetric(false);
  };

  const deleteMetric = (id: string) => {
    setData({
      metrics: data.metrics.filter((m) => m.id !== id),
      entries: data.entries.filter((e) => e.metricId !== id),
    });
    if (selectedMetric === id) setSelectedMetric(null);
  };

  const logEntry = () => {
    if (!activeMetric || !logValue) return;
    const entry: StatEntry = {
      id: Date.now().toString(),
      metricId: activeMetric.id,
      value: Number.parseFloat(logValue),
      date: logDate,
      note: logNote,
    };
    setData({ ...data, entries: [...data.entries, entry] });
    setLogValue("");
    setLogNote("");
    setShowLogEntry(false);
  };

  const deleteEntry = (id: string) => {
    setData({ ...data, entries: data.entries.filter((e) => e.id !== id) });
  };

  const metricEntries = useMemo(
    () =>
      activeMetric
        ? data.entries
            .filter((e) => e.metricId === activeMetric.id)
            .slice(-30)
            .reverse()
        : [],
    [data.entries, activeMetric],
  );

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ background: BG }}
      >
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: `${ACCENT}0.7)` }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full" style={{ background: BG, color: TEXT }}>
      {/* Sidebar: metric list */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{
          width: 180,
          background: "rgba(10,16,20,0.7)",
          borderRight: `1px solid ${BORDER}`,
        }}
      >
        <div
          className="px-3 py-3 flex-shrink-0"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <div className="text-xs font-semibold mb-2" style={{ color: TEXT }}>
            Metrics
          </div>
          <Button
            type="button"
            data-ocid="lifestats.primary_button"
            onClick={() => setShowAddMetric((v) => !v)}
            style={{
              width: "100%",
              height: 26,
              fontSize: 11,
              background: `${ACCENT}0.1)`,
              border: `1px solid ${ACCENT}0.25)`,
              color: `${ACCENT}0.9)`,
            }}
          >
            <Plus className="w-3 h-3 mr-1" /> Add Metric
          </Button>
          {showAddMetric && (
            <div className="mt-2 flex flex-col gap-1.5">
              <Input
                data-ocid="lifestats.input"
                value={newMetricName}
                onChange={(e) => setNewMetricName(e.target.value)}
                placeholder="Name (e.g. Steps)"
                style={{
                  height: 26,
                  fontSize: 11,
                  background: "rgba(20,30,36,0.9)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                }}
              />
              <Input
                value={newMetricUnit}
                onChange={(e) => setNewMetricUnit(e.target.value)}
                placeholder="Unit (e.g. km)"
                style={{
                  height: 26,
                  fontSize: 11,
                  background: "rgba(20,30,36,0.9)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                }}
              />
              <div className="flex gap-1 flex-wrap">
                {METRIC_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewMetricColor(c)}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: c,
                      border:
                        newMetricColor === c
                          ? "2px solid white"
                          : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  data-ocid="lifestats.submit_button"
                  onClick={addMetric}
                  style={{
                    flex: 1,
                    height: 24,
                    fontSize: 10,
                    background: `${ACCENT}0.8)`,
                    border: "none",
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  data-ocid="lifestats.cancel_button"
                  onClick={() => setShowAddMetric(false)}
                  style={{
                    flex: 1,
                    height: 24,
                    fontSize: 10,
                    background: "var(--os-border-subtle)",
                    border: `1px solid ${BORDER}`,
                    color: MUTED,
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 flex flex-col gap-1">
            {data.metrics.map((m, i) => (
              <div
                key={m.id}
                data-ocid={`lifestats.item.${i + 1}`}
                className="group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer"
                style={{
                  background:
                    activeMetric?.id === m.id
                      ? "var(--os-border-subtle)"
                      : "transparent",
                  border: `1px solid ${activeMetric?.id === m.id ? BORDER : "transparent"}`,
                }}
                onClick={() => setSelectedMetric(m.id)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedMetric(m.id)}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: m.color,
                    flexShrink: 0,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-medium truncate"
                    style={{ color: TEXT }}
                  >
                    {m.name}
                  </div>
                  <div className="text-[10px]" style={{ color: MUTED }}>
                    {m.unit}
                  </div>
                </div>
                {!PRESET_METRICS.find((p) => p.id === m.id) && (
                  <button
                    type="button"
                    data-ocid={`lifestats.delete_button.${i + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMetric(m.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(248,113,113,0.6)",
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeMetric ? (
          <>
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{
                borderBottom: `1px solid ${BORDER}`,
                background: "rgba(10,16,20,0.4)",
              }}
            >
              <Activity
                className="w-4 h-4"
                style={{ color: activeMetric.color }}
              />
              <div>
                <div className="text-sm font-bold" style={{ color: TEXT }}>
                  {activeMetric.name}
                </div>
                <div className="text-[10px]" style={{ color: MUTED }}>
                  tracked in {activeMetric.unit} • {metricEntries.length}{" "}
                  entries
                </div>
              </div>
              <div className="flex-1" />
              <Button
                type="button"
                data-ocid="lifestats.open_modal_button"
                onClick={() => setShowLogEntry((v) => !v)}
                style={{
                  height: 28,
                  fontSize: 11,
                  background: `${activeMetric.color}22`,
                  border: `1px solid ${activeMetric.color}55`,
                  color: activeMetric.color,
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Log Entry
              </Button>
            </div>

            {showLogEntry && (
              <div
                className="p-4 flex-shrink-0"
                style={{
                  background: "rgba(14,22,28,0.8)",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                    <label
                      htmlFor="ls-value"
                      className="text-[11px]"
                      style={{ color: MUTED }}
                    >
                      Value ({activeMetric.unit})
                    </label>
                    <Input
                      id="ls-value"
                      type="number"
                      data-ocid="lifestats.input"
                      value={logValue}
                      onChange={(e) => setLogValue(e.target.value)}
                      style={{
                        height: 30,
                        fontSize: 12,
                        background: "rgba(20,30,36,0.9)",
                        border: `1px solid ${BORDER}`,
                        color: TEXT,
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                    <label
                      htmlFor="ls-date"
                      className="text-[11px]"
                      style={{ color: MUTED }}
                    >
                      Date
                    </label>
                    <Input
                      id="ls-date"
                      type="date"
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      style={{
                        height: 30,
                        fontSize: 12,
                        background: "rgba(20,30,36,0.9)",
                        border: `1px solid ${BORDER}`,
                        color: TEXT,
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1" style={{ flex: 2 }}>
                    <label
                      htmlFor="ls-note"
                      className="text-[11px]"
                      style={{ color: MUTED }}
                    >
                      Note (optional)
                    </label>
                    <Input
                      id="ls-note"
                      value={logNote}
                      onChange={(e) => setLogNote(e.target.value)}
                      style={{
                        height: 30,
                        fontSize: 12,
                        background: "rgba(20,30,36,0.9)",
                        border: `1px solid ${BORDER}`,
                        color: TEXT,
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    data-ocid="lifestats.confirm_button"
                    onClick={logEntry}
                    style={{
                      height: 28,
                      fontSize: 11,
                      background: `${activeMetric.color}cc`,
                      border: "none",
                      color: "#000",
                      fontWeight: 700,
                    }}
                  >
                    Log
                  </Button>
                  <Button
                    type="button"
                    data-ocid="lifestats.cancel_button"
                    onClick={() => setShowLogEntry(false)}
                    style={{
                      height: 28,
                      fontSize: 11,
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      color: MUTED,
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div
              className="p-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${BORDER}` }}
            >
              <BarChart entries={data.entries} metric={activeMetric} />
            </div>

            <ScrollArea className="flex-1">
              {metricEntries.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  data-ocid="lifestats.empty_state"
                  style={{ color: MUTED }}
                >
                  <span className="text-xs">
                    No entries yet. Log your first{" "}
                    {activeMetric.name.toLowerCase()} value above.
                  </span>
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-2">
                  {metricEntries.map((e, i) => (
                    <div
                      key={e.id}
                      data-ocid={`lifestats.row.${i + 1}`}
                      className="group flex items-center gap-3 p-2 rounded-lg"
                      style={{
                        background: CARD_BG,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <div
                        className="text-base font-bold"
                        style={{ color: activeMetric.color }}
                      >
                        {e.value}
                        <span className="text-xs ml-1" style={{ color: MUTED }}>
                          {activeMetric.unit}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: MUTED }}>
                        {e.date}
                      </div>
                      {e.note && (
                        <div
                          className="text-xs flex-1 truncate"
                          style={{ color: TEXT }}
                        >
                          {e.note}
                        </div>
                      )}
                      <button
                        type="button"
                        data-ocid={`lifestats.delete_button.${i + 1}`}
                        onClick={() => deleteEntry(e.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "rgba(248,113,113,0.5)",
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3"
            data-ocid="lifestats.empty_state"
            style={{ color: MUTED }}
          >
            <Activity className="w-10 h-10 opacity-20" />
            <div className="text-sm">Select a metric to view and log data</div>
          </div>
        )}
      </div>
    </div>
  );
}
