import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Play, Plus, Square, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Project {
  id: string;
  name: string;
  color: string;
}
interface TimeEntry {
  id: string;
  projectId: string;
  date: string;
  hours: number;
  description: string;
}
interface ActiveTimer {
  projectId: string;
  startTime: number;
}
interface TTData {
  projects: Project[];
  entries: TimeEntry[];
}

const PROJECT_COLORS = [
  "rgba(39,215,224,0.8)",
  "rgba(99,102,241,0.8)",
  "rgba(236,72,153,0.8)",
  "rgba(34,197,94,0.8)",
  "rgba(249,115,22,0.8)",
  "rgba(168,85,247,0.8)",
];

const DEFAULT_DATA: TTData = {
  projects: [
    { id: "p1", name: "DecentOS Development", color: PROJECT_COLORS[0] },
    { id: "p2", name: "Design Research", color: PROJECT_COLORS[1] },
    { id: "p3", name: "Documentation", color: PROJECT_COLORS[2] },
  ],
  entries: [],
};

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
function formatHours(h: number): string {
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function TimeTracker() {
  const { data, set } = useCanisterKV<TTData>(
    "decentos_timetracker_data",
    DEFAULT_DATA,
  );
  const { projects, entries } = data;
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [manualDate, setManualDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [manualHours, setManualHours] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeTimer) {
      intervalRef.current = setInterval(
        () => setElapsed(Date.now() - activeTimer.startTime),
        1000,
      );
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTimer]);

  const addProject = () => {
    if (!newProjectName.trim()) return;
    const color = PROJECT_COLORS[projects.length % PROJECT_COLORS.length];
    set({
      ...data,
      projects: [
        ...projects,
        { id: `p${Date.now()}`, name: newProjectName.trim(), color },
      ],
    });
    setNewProjectName("");
  };

  const deleteProject = (id: string) => {
    set({
      projects: projects.filter((p) => p.id !== id),
      entries: entries.filter((e) => e.projectId !== id),
    });
    if (activeTimer?.projectId === id) setActiveTimer(null);
  };

  const startTimer = (projectId: string) => {
    if (activeTimer) stopTimer();
    setActiveTimer({ projectId, startTime: Date.now() });
  };

  const stopTimer = () => {
    if (!activeTimer) return;
    const ms = Date.now() - activeTimer.startTime;
    const hours = ms / 3600000;
    if (hours > 0.01) {
      set({
        ...data,
        entries: [
          ...entries,
          {
            id: `e${Date.now()}`,
            projectId: activeTimer.projectId,
            date: new Date().toISOString().split("T")[0],
            hours,
            description: "Timer session",
          },
        ],
      });
    }
    setActiveTimer(null);
  };

  const addManualEntry = () => {
    if (!selectedProject || !manualHours || Number.isNaN(Number(manualHours)))
      return;
    set({
      ...data,
      entries: [
        ...entries,
        {
          id: `e${Date.now()}`,
          projectId: selectedProject,
          date: manualDate,
          hours: Number.parseFloat(manualHours),
          description: manualDesc || "Manual entry",
        },
      ],
    });
    setManualHours("");
    setManualDesc("");
  };

  const getTotalHoursForProject = (projectId: string) =>
    entries
      .filter((e) => e.projectId === projectId)
      .reduce((s, e) => s + e.hours, 0);

  const today = new Date().toISOString().split("T")[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const todayTotal = entries
    .filter((e) => e.date === today)
    .reduce((s, e) => s + e.hours, 0);
  const weekTotal = entries
    .filter((e) => e.date >= weekStartStr)
    .reduce((s, e) => s + e.hours, 0);

  const panelStyle = {
    background: "var(--os-border-subtle)",
    border: "1px solid rgba(39,215,224,0.15)",
    borderRadius: 10,
  };

  return (
    <div
      className="flex flex-col h-full p-4 gap-4"
      style={{ background: "var(--os-bg-app)" }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 px-4 py-3" style={panelStyle}>
          <span
            className="text-[10px] font-mono uppercase tracking-widest"
            style={{ color: "rgba(39,215,224,0.5)" }}
          >
            Today
          </span>
          <span
            className="text-2xl font-mono font-bold"
            style={{ color: "rgba(39,215,224,0.95)" }}
          >
            {formatHours(todayTotal)}
          </span>
        </div>
        <div className="flex flex-col gap-1 px-4 py-3" style={panelStyle}>
          <span
            className="text-[10px] font-mono uppercase tracking-widest"
            style={{ color: "rgba(39,215,224,0.5)" }}
          >
            This Week
          </span>
          <span
            className="text-2xl font-mono font-bold"
            style={{ color: "rgba(39,215,224,0.95)" }}
          >
            {formatHours(weekTotal)}
          </span>
        </div>
      </div>

      {activeTimer && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg"
          style={{
            background: "rgba(39,215,224,0.06)",
            border: "1px solid rgba(39,215,224,0.3)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "rgba(39,215,224,0.9)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--os-text-primary)" }}
            >
              {projects.find((p) => p.id === activeTimer.projectId)?.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xl font-mono font-bold"
              style={{ color: "rgba(39,215,224,0.9)" }}
            >
              {formatDuration(elapsed)}
            </span>
            <Button
              size="sm"
              variant="destructive"
              onClick={stopTimer}
              data-ocid="timetracker.stop.button"
            >
              <Square className="w-3 h-3 mr-1" /> Stop
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="projects" className="flex-1 flex flex-col">
        <TabsList className="self-start" data-ocid="timetracker.tab">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="log">Log Entry</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent
          value="projects"
          className="flex-1 flex flex-col gap-3 mt-3"
        >
          <div className="flex gap-2">
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addProject()}
              placeholder="New project name..."
              data-ocid="timetracker.input"
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              onClick={addProject}
              data-ocid="timetracker.add.button"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-2 pr-2">
              {projects.map((project, i) => {
                const isActive = activeTimer?.projectId === project.id;
                const total = getTotalHoursForProject(project.id);
                return (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    data-ocid={`timetracker.item.${i + 1}`}
                    style={{
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${isActive ? "rgba(39,215,224,0.3)" : "var(--os-border-subtle)"}`,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: project.color }}
                    />
                    <span
                      className="flex-1 text-sm font-medium"
                      style={{ color: "var(--os-text-primary)" }}
                    >
                      {project.name}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "rgba(39,215,224,0.7)" }}
                    >
                      {formatHours(total)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        isActive ? stopTimer() : startTimer(project.id)
                      }
                      data-ocid={`timetracker.toggle.${i + 1}`}
                      className="w-7 h-7 flex items-center justify-center rounded transition-all"
                      style={{
                        background: isActive
                          ? "rgba(239,68,68,0.15)"
                          : "rgba(39,215,224,0.1)",
                        color: isActive
                          ? "rgba(239,68,68,0.8)"
                          : "rgba(39,215,224,0.8)",
                      }}
                    >
                      {isActive ? (
                        <Square className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      data-ocid={`timetracker.delete_button.${i + 1}`}
                      className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
              {projects.length === 0 && (
                <div
                  className="text-center py-8 text-sm"
                  style={{ color: "var(--os-text-muted)" }}
                  data-ocid="timetracker.empty_state"
                >
                  No projects yet. Create one above.
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="log" className="flex flex-col gap-3 mt-3">
          <div className="flex flex-col gap-3" style={panelStyle}>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <span
                  className="text-xs"
                  style={{ color: "rgba(39,215,224,0.7)" }}
                >
                  Project
                </span>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  data-ocid="timetracker.select"
                  className="w-full h-9 px-3 rounded-md text-sm"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-primary)",
                  }}
                >
                  <option value="">Select project...</option>
                  {projects.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      style={{ background: "var(--os-bg-app)" }}
                    >
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-xs"
                    style={{ color: "rgba(39,215,224,0.7)" }}
                  >
                    Date
                  </span>
                  <Input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="h-9 text-sm"
                    data-ocid="timetracker.date.input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-xs"
                    style={{ color: "rgba(39,215,224,0.7)" }}
                  >
                    Hours
                  </span>
                  <Input
                    type="number"
                    value={manualHours}
                    onChange={(e) => setManualHours(e.target.value)}
                    placeholder="e.g. 1.5"
                    step="0.25"
                    min="0"
                    className="h-9 text-sm"
                    data-ocid="timetracker.hours.input"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span
                  className="text-xs"
                  style={{ color: "rgba(39,215,224,0.7)" }}
                >
                  Description
                </span>
                <Input
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  placeholder="What did you work on?"
                  className="h-9 text-sm"
                  data-ocid="timetracker.desc.input"
                />
              </div>
              <Button
                onClick={addManualEntry}
                data-ocid="timetracker.log.submit_button"
                className="w-full"
              >
                <Clock className="w-4 h-4 mr-2" /> Log Time
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 flex flex-col mt-3">
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1.5 pr-2">
              {[...entries].reverse().map((entry, i) => {
                const project = projects.find((p) => p.id === entry.projectId);
                return (
                  <div
                    key={entry.id}
                    data-ocid={`timetracker.history.item.${i + 1}`}
                    className="flex items-center gap-3 px-3 py-2 rounded"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-border-subtle)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: project?.color ?? "rgba(39,215,224,0.5)",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "var(--os-text-secondary)" }}
                      >
                        {entry.description}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: "var(--os-text-muted)" }}
                      >
                        {project?.name} · {entry.date}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono flex-shrink-0"
                      style={{
                        borderColor: "rgba(39,215,224,0.3)",
                        color: "rgba(39,215,224,0.8)",
                      }}
                    >
                      {formatHours(entry.hours)}
                    </Badge>
                  </div>
                );
              })}
              {entries.length === 0 && (
                <div
                  className="text-center py-8 text-sm"
                  style={{ color: "var(--os-text-muted)" }}
                  data-ocid="timetracker.history.empty_state"
                >
                  No time entries yet.
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
