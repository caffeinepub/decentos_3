import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  waketime: string;
  hours: number;
  quality: number; // 1-5 stars
}

interface SleepData {
  entries: SleepEntry[];
  goalHours: number;
}

function calcHours(bedtime: string, waketime: string): number {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = waketime.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

interface Props {
  windowProps?: Record<string, unknown>;
}

export function SleepTracker(_: Props) {
  const { data: sleepData, set: saveSleepData } = useCanisterKV<SleepData>(
    "decentos_sleep_tracker",
    { entries: [], goalHours: 8 },
  );
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [bedtime, setBedtime] = useState("22:30");
  const [waketime, setWaketime] = useState("06:30");
  const [quality, setQuality] = useState(4);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("8");

  const entries = sleepData.entries;
  const goalHours = sleepData.goalHours;

  const addEntry = () => {
    if (!bedtime || !waketime) {
      toast.error("Enter bedtime and wake time");
      return;
    }
    const hours = calcHours(bedtime, waketime);
    const entry: SleepEntry = {
      id: `${Date.now()}`,
      date,
      bedtime,
      waketime,
      hours,
      quality,
    };
    saveSleepData({ ...sleepData, entries: [entry, ...entries] });
    toast.success(`Logged ${hours}h sleep ✓`);
  };

  const deleteEntry = (id: string) => {
    saveSleepData({
      ...sleepData,
      entries: entries.filter((e) => e.id !== id),
    });
  };

  const saveGoal = () => {
    const g = Number.parseFloat(goalInput);
    if (!Number.isNaN(g) && g > 0) {
      saveSleepData({ ...sleepData, goalHours: g });
      toast.success("Goal updated ✓");
    }
    setEditingGoal(false);
  };

  const last7 = useMemo(() => entries.slice(0, 7).reverse(), [entries]);
  const avgHours = useMemo(() => {
    if (last7.length === 0) return 0;
    return (
      Math.round((last7.reduce((a, e) => a + e.hours, 0) / last7.length) * 10) /
      10
    );
  }, [last7]);

  const maxH = Math.max(...last7.map((e) => e.hours), goalHours, 8);

  const qualityColor = (q: number) =>
    q >= 5 ? "#27D7E0" : q >= 3 ? "#F59E0B" : "#EF4444";

  const hoursColor = (h: number) =>
    h >= goalHours ? "#27D7E0" : h >= goalHours * 0.8 ? "#F59E0B" : "#EF4444";

  return (
    <div
      className="flex h-full flex-col gap-4 overflow-hidden p-4"
      style={{ background: "rgba(11,15,18,0.7)" }}
    >
      {/* Form */}
      <div className="rounded-xl border border-border bg-muted/50 p-4">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground/60">Date</Label>
            <Input
              data-ocid="sleeptracker.input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-border bg-muted/50 text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground/60">Bedtime</Label>
            <Input
              data-ocid="sleeptracker.input"
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="border-border bg-muted/50 text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground/60">
              Wake Time
            </Label>
            <Input
              data-ocid="sleeptracker.input"
              type="time"
              value={waketime}
              onChange={(e) => setWaketime(e.target.value)}
              className="border-border bg-muted/50 text-foreground"
            />
          </div>
        </div>
        {/* Quality rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground/60">Quality:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuality(s)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  opacity: s <= quality ? 1 : 0.25,
                }}
              >
                ★
              </button>
            ))}
          </div>
          <span className="text-xs" style={{ color: qualityColor(quality) }}>
            {["Poor", "Fair", "Good", "Great", "Excellent"][quality - 1]}
          </span>
        </div>
        <Button
          data-ocid="sleeptracker.submit_button"
          className="w-full font-semibold"
          style={{ background: "var(--os-accent)", color: "#000" }}
          onClick={addEntry}
        >
          Log Sleep
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-muted/50 p-3 text-center">
          <div className="text-xs text-muted-foreground/60">7-Day Avg</div>
          <div
            className="text-xl font-bold"
            style={{ color: hoursColor(avgHours) }}
          >
            {avgHours}h
          </div>
        </div>
        <div className="rounded-xl border border-border bg-muted/50 p-3 text-center">
          <div className="text-xs text-muted-foreground/60">Sleep Goal</div>
          {editingGoal ? (
            <div className="flex items-center gap-1 justify-center">
              <input
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onBlur={saveGoal}
                onKeyDown={(e) => e.key === "Enter" && saveGoal()}
                className="w-12 text-center text-sm bg-transparent border-b border-white/30 outline-none text-foreground"
              />
              <span className="text-xs text-muted-foreground/60">h</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setGoalInput(String(goalHours));
                setEditingGoal(true);
              }}
              className="text-xl font-bold"
              style={{
                color: "var(--os-accent)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {goalHours}h
            </button>
          )}
          <div className="text-[10px] text-muted-foreground/60">
            tap to edit
          </div>
        </div>
        <div className="rounded-xl border border-border bg-muted/50 p-3 text-center">
          <div className="text-xs text-muted-foreground/60">Entries</div>
          <div className="text-xl font-bold text-foreground">
            {entries.length}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      {last7.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <div className="mb-2 text-xs text-muted-foreground/60">
            Last 7 nights
          </div>
          <div className="flex h-28 items-end gap-2">
            {last7.map((e) => (
              <div
                key={e.id}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t relative"
                  style={{
                    height: `${(e.hours / maxH) * 90}px`,
                    background: qualityColor(e.quality ?? 3),
                    minHeight: "4px",
                  }}
                />
                {/* Goal line marker */}
                <div
                  style={{
                    position: "absolute",
                    bottom: `${(goalHours / maxH) * 90}px`,
                    left: 0,
                    right: 0,
                    height: 1,
                    borderTop: "1px dashed var(--os-text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <span className="text-[9px] text-muted-foreground/60">
                  {e.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
              <span
                style={{
                  width: 12,
                  borderTop: "1px dashed var(--os-text-muted)",
                  display: "inline-block",
                }}
              />
              {goalHours}h goal
            </span>
            <span
              className="flex items-center gap-1 text-[10px]"
              style={{ color: "var(--os-accent)" }}
            >
              ★★★★★ Excellent
            </span>
            <span
              className="flex items-center gap-1 text-[10px]"
              style={{ color: "#F59E0B" }}
            >
              ★★★ Good
            </span>
            <span
              className="flex items-center gap-1 text-[10px]"
              style={{ color: "#EF4444" }}
            >
              ★ Poor
            </span>
          </div>
        </div>
      )}

      {/* Entry list */}
      <div className="flex-1 overflow-hidden rounded-xl border border-border">
        <ScrollArea className="h-full">
          {entries.length === 0 ? (
            <div
              data-ocid="sleeptracker.empty_state"
              className="flex h-24 items-center justify-center text-sm text-muted-foreground/60"
            >
              No sleep entries yet
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {entries.map((e, i) => (
                <div
                  key={e.id}
                  data-ocid={`sleeptracker.item.${i + 1}`}
                  className="flex items-center justify-between px-4 py-2"
                >
                  <div>
                    <div className="text-sm text-foreground">{e.date}</div>
                    <div className="text-xs text-muted-foreground/60">
                      {e.bedtime} → {e.waketime}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: hoursColor(e.hours) }}
                      >
                        {e.hours}h
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: qualityColor(e.quality ?? 3) }}
                      >
                        {"★".repeat(e.quality ?? 3)}
                      </span>
                    </div>
                    <Button
                      data-ocid={`sleeptracker.delete_button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteEntry(e.id)}
                      className="h-6 w-6 p-0 text-muted-foreground/60 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
