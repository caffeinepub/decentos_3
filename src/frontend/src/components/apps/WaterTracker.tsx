import { Droplets, Minus, Plus } from "lucide-react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface DayData {
  date: string;
  glasses: number;
}
interface WaterData {
  target: number;
  history: DayData[];
}

const DEFAULT_DATA: WaterData = { target: 8, history: [] };

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

export function WaterTracker() {
  const { data, set } = useCanisterKV<WaterData>(
    "decentos_watertracker",
    DEFAULT_DATA,
  );
  const today = todayStr();
  const todayGlasses = data.history.find((d) => d.date === today)?.glasses ?? 0;

  const updateToday = (delta: number) => {
    const newGlasses = Math.max(0, todayGlasses + delta);
    const newHistory = [
      ...data.history.filter((d) => d.date !== today),
      { date: today, glasses: newGlasses },
    ];
    set({
      ...data,
      history: newHistory
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30),
    });
  };

  const streak = (() => {
    let count = 0;
    const d = new Date();
    d.setDate(d.getDate() - 1);
    while (true) {
      const ds = d.toISOString().slice(0, 10);
      const entry = data.history.find((h) => h.date === ds);
      if (entry && entry.glasses >= data.target) {
        count++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    if (todayGlasses >= data.target) count++;
    return count;
  })();

  const last7 = getLast7Days();
  const weekData = last7.map((date) => ({
    date,
    glasses: data.history.find((d) => d.date === date)?.glasses ?? 0,
    label: new Date(`${date}T12:00:00`).toLocaleDateString([], {
      weekday: "short",
    }),
  }));
  const progress = Math.min(1, todayGlasses / data.target);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const maxWeekGlasses = Math.max(
    ...weekData.map((d) => d.glasses),
    data.target,
  );

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        background: "rgba(9,13,16,0.9)",
        color: "var(--os-text-primary)",
      }}
      data-ocid="watertracker.panel"
    >
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b"
        style={{
          borderColor: "rgba(39,215,224,0.15)",
          background: "rgba(18,32,38,0.6)",
        }}
      >
        <div className="flex items-center gap-2">
          <Droplets
            className="w-5 h-5"
            style={{ color: "rgba(39,215,224,1)" }}
          />
          <span className="font-semibold text-sm tracking-wide">
            Water Tracker
          </span>
        </div>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--os-text-secondary)" }}
        >
          <span>🔥 {streak} day streak</span>
          <span style={{ color: "rgba(39,215,224,0.7)" }}>|</span>
          <span>Target:</span>
          <input
            type="number"
            min={1}
            max={20}
            value={data.target}
            onChange={(e) =>
              set({
                ...data,
                target: Math.max(1, Number.parseInt(e.target.value, 10) || 8),
              })
            }
            data-ocid="watertracker.input"
            className="w-10 text-center bg-transparent border-b outline-none text-xs"
            style={{
              borderColor: "rgba(39,215,224,0.3)",
              color: "rgba(39,215,224,1)",
            }}
          />
          <span>glasses</span>
        </div>
      </div>
      <div className="flex flex-col items-center py-6 flex-shrink-0">
        <div className="relative">
          <svg width={170} height={170} data-ocid="watertracker.canvas_target">
            <title>Hydration Progress</title>
            <circle
              cx={85}
              cy={85}
              r={radius}
              fill="none"
              stroke="rgba(39,215,224,0.1)"
              strokeWidth={12}
            />
            <circle
              cx={85}
              cy={85}
              r={radius}
              fill="none"
              stroke="rgba(39,215,224,0.85)"
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 85 85)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-bold"
              style={{ color: "rgba(39,215,224,1)" }}
            >
              {todayGlasses}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--os-text-secondary)" }}
            >
              of {data.target} glasses
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => updateToday(-1)}
            data-ocid="watertracker.secondary_button"
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
            }}
          >
            <Minus
              className="w-5 h-5"
              style={{ color: "var(--os-text-secondary)" }}
            />
          </button>
          <div className="text-center">
            <div
              className="text-xs"
              style={{ color: "var(--os-text-secondary)" }}
            >
              {new Date().toLocaleDateString([], {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{
                color:
                  progress >= 1
                    ? "rgba(39,215,224,1)"
                    : "var(--os-text-secondary)",
              }}
            >
              {progress >= 1
                ? "🎉 Goal reached!"
                : `${data.target - todayGlasses} more to go`}
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateToday(1)}
            data-ocid="watertracker.primary_button"
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(39,215,224,0.15)",
              border: "1px solid rgba(39,215,224,0.4)",
            }}
          >
            <Plus className="w-5 h-5" style={{ color: "rgba(39,215,224,1)" }} />
          </button>
        </div>
      </div>
      <div
        className="mx-4 mb-4 p-4 rounded-xl flex-shrink-0"
        style={{
          background: "rgba(18,32,38,0.5)",
          border: "1px solid rgba(39,215,224,0.1)",
        }}
      >
        <div
          className="text-xs font-semibold mb-3"
          style={{ color: "var(--os-text-secondary)" }}
        >
          Last 7 Days
        </div>
        <div className="flex items-end gap-2 h-20">
          {weekData.map((day) => {
            const isToday = day.date === today;
            const barH =
              maxWeekGlasses > 0 ? (day.glasses / maxWeekGlasses) * 64 : 0;
            const hitTarget = day.glasses >= data.target;
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="text-[9px]"
                  style={{
                    color: hitTarget
                      ? "rgba(39,215,224,1)"
                      : "var(--os-text-muted)",
                  }}
                >
                  {day.glasses > 0 ? day.glasses : ""}
                </div>
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: Math.max(barH, day.glasses > 0 ? 4 : 2),
                    background: isToday
                      ? "rgba(39,215,224,0.8)"
                      : hitTarget
                        ? "rgba(39,215,224,0.4)"
                        : "var(--os-border-subtle)",
                    minHeight: 2,
                  }}
                />
                <div
                  className="text-[9px]"
                  style={{
                    color: isToday
                      ? "rgba(39,215,224,1)"
                      : "var(--os-text-muted)",
                  }}
                >
                  {day.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
