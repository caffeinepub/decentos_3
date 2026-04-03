import {
  Calendar,
  ChevronRight,
  Dumbbell,
  Layers,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  unit: "kg" | "lbs";
}

interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
}

function genId() {
  return `ws_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function genExId() {
  return `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

interface WorkoutTrackerProps {
  windowProps?: Record<string, unknown>;
}

export default function WorkoutTracker({
  windowProps: _w,
}: WorkoutTrackerProps) {
  const {
    data: persisted,
    set: save,
    loading,
  } = useCanisterKV<WorkoutSession[]>("workout_sessions", []);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addingEx, setAddingEx] = useState(false);
  const [newEx, setNewEx] = useState<Omit<Exercise, "id">>({
    name: "",
    sets: 3,
    reps: 10,
    weight: 0,
    unit: "kg",
  });
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (persisted.length > 0) {
      setSessions(persisted);
      setSelectedId(persisted[0].id);
    }
  }, [loading, persisted]);

  const selected = sessions.find((s) => s.id === selectedId) ?? null;

  const createSession = useCallback(() => {
    const s: WorkoutSession = {
      id: genId(),
      date: new Date().toISOString().split("T")[0],
      name: "New Workout",
      exercises: [],
    };
    setSessions((prev) => {
      const updated = [s, ...prev];
      save(updated);
      return updated;
    });
    setSelectedId(s.id);
  }, [save]);

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        save(updated);
        return updated;
      });
      setSelectedId((prev) => (prev === id ? null : prev));
    },
    [save],
  );

  const updateSession = useCallback(
    (id: string, patch: Partial<WorkoutSession>) => {
      setSessions((prev) => {
        const updated = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
        save(updated);
        return updated;
      });
    },
    [save],
  );

  const addExercise = useCallback(() => {
    if (!selectedId || !newEx.name.trim()) return;
    const ex: Exercise = { id: genExId(), ...newEx, name: newEx.name.trim() };
    setSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === selectedId ? { ...s, exercises: [...s.exercises, ex] } : s,
      );
      save(updated);
      return updated;
    });
    setNewEx({ name: "", sets: 3, reps: 10, weight: 0, unit: "kg" });
    setAddingEx(false);
  }, [selectedId, newEx, save]);

  const removeExercise = useCallback(
    (exId: string) => {
      if (!selectedId) return;
      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === selectedId
            ? { ...s, exercises: s.exercises.filter((e) => e.id !== exId) }
            : s,
        );
        save(updated);
        return updated;
      });
    },
    [selectedId, save],
  );

  // Weekly stats
  const weekStart = getWeekStart();
  const weekSessions = sessions.filter((s) => new Date(s.date) >= weekStart);
  const weekTotalSets = weekSessions.reduce(
    (acc, s) => acc + s.exercises.reduce((a, e) => a + e.sets, 0),
    0,
  );

  // PRs: best weight per exercise name across all sessions
  const prMap: Record<string, { weight: number; unit: string }> = {};
  for (const s of sessions) {
    for (const e of s.exercises) {
      const key = e.name.toLowerCase();
      if (!prMap[key] || e.weight > prMap[key].weight) {
        prMap[key] = { weight: e.weight, unit: e.unit };
      }
    }
  }

  const panel = {
    background: "rgba(8,14,20,0.95)",
    border: "1px solid rgba(39,215,224,0.18)",
  };
  const muted = "var(--os-text-secondary)";

  return (
    <div className="flex h-full" style={{ background: "rgba(8,14,20,0.95)" }}>
      {/* Sidebar */}
      <div
        className="w-48 flex-shrink-0 flex flex-col border-r"
        style={{
          borderColor: "rgba(39,215,224,0.12)",
          background: "rgba(10,16,20,0.8)",
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0"
          style={{ borderColor: "rgba(39,215,224,0.12)" }}
        >
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--os-text-primary)" }}
          >
            Sessions
          </span>
          <button
            type="button"
            onClick={createSession}
            data-ocid="workout.add_button"
            className="w-6 h-6 rounded flex items-center justify-center transition-all hover:brightness-125"
            style={{
              background: "rgba(39,215,224,0.12)",
              border: "1px solid rgba(39,215,224,0.3)",
              color: "var(--os-accent)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Weekly stats strip */}
        <div
          className="px-3 py-2 border-b"
          style={{
            borderColor: "rgba(39,215,224,0.08)",
            background: "rgba(39,215,224,0.04)",
          }}
        >
          <p
            className="text-[9px] font-semibold uppercase tracking-wider mb-1"
            style={{ color: "rgba(39,215,224,0.6)" }}
          >
            This Week
          </p>
          <div className="flex gap-3">
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--os-accent)" }}
              >
                {weekSessions.length}
              </p>
              <p className="text-[9px]" style={{ color: muted }}>
                sessions
              </p>
            </div>
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--os-accent)" }}
              >
                {weekTotalSets}
              </p>
              <p className="text-[9px]" style={{ color: muted }}>
                sets
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-3 text-center" data-ocid="workout.empty_state">
              <p className="text-[11px]" style={{ color: muted }}>
                No sessions yet
              </p>
            </div>
          ) : (
            sessions.map((s, i) => (
              <button
                key={s.id}
                type="button"
                data-ocid={`workout.item.${i + 1}`}
                onClick={() => setSelectedId(s.id)}
                className="w-full text-left px-3 py-2.5 flex items-center gap-2 transition-all border-b"
                style={{
                  borderColor: "rgba(39,215,224,0.06)",
                  background:
                    selectedId === s.id
                      ? "rgba(39,215,224,0.1)"
                      : "transparent",
                }}
              >
                <Dumbbell
                  className="w-3 h-3 flex-shrink-0"
                  style={{
                    color: selectedId === s.id ? "var(--os-accent)" : muted,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[11px] font-semibold truncate"
                    style={{
                      color:
                        selectedId === s.id
                          ? "var(--os-text-primary)"
                          : "var(--os-text-secondary)",
                    }}
                  >
                    {s.name}
                  </p>
                  <p className="text-[10px]" style={{ color: muted }}>
                    {s.date} · {s.exercises.length} exercises
                  </p>
                </div>
                {selectedId === s.id && (
                  <ChevronRight
                    className="w-3 h-3 flex-shrink-0"
                    style={{ color: "var(--os-accent)" }}
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!selected ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Stats panel */}
            <div className="grid grid-cols-3 gap-3">
              <div
                className="rounded-xl p-3"
                style={{
                  background: "var(--os-bg-elevated)",
                  border: "1px solid rgba(39,215,224,0.15)",
                }}
              >
                <p
                  className="text-[10px] font-semibold mb-1"
                  style={{ color: "rgba(39,215,224,0.6)" }}
                >
                  TOTAL SESSIONS
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--os-text-primary)" }}
                >
                  {sessions.length}
                </p>
              </div>
              <div
                className="rounded-xl p-3"
                style={{
                  background: "var(--os-bg-elevated)",
                  border: `1px solid ${weekSessions.length >= 3 ? "rgba(34,197,94,0.3)" : "rgba(39,215,224,0.15)"}`,
                }}
              >
                <p
                  className="text-[10px] font-semibold mb-1"
                  style={{ color: "rgba(39,215,224,0.6)" }}
                >
                  THIS WEEK
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    color:
                      weekSessions.length >= 3
                        ? "#22c55e"
                        : "var(--os-text-primary)",
                  }}
                >
                  {weekSessions.length}
                  <span
                    className="text-sm font-normal ml-1"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    /3
                  </span>
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  weekly target
                </p>
              </div>
              <div
                className="rounded-xl p-3"
                style={{
                  background: "var(--os-bg-elevated)",
                  border: "1px solid rgba(39,215,224,0.15)",
                }}
              >
                <p
                  className="text-[10px] font-semibold mb-1"
                  style={{ color: "rgba(39,215,224,0.6)" }}
                >
                  EXERCISES TRACKED
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--os-text-primary)" }}
                >
                  {Object.keys(prMap).length}
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  unique exercises
                </p>
              </div>
            </div>
            {Object.keys(prMap).length > 0 && (
              <div
                className="rounded-xl p-3"
                style={{
                  background: "var(--os-bg-elevated)",
                  border: "1px solid rgba(39,215,224,0.15)",
                }}
              >
                <p
                  className="text-[10px] font-semibold mb-2"
                  style={{ color: "rgba(39,215,224,0.6)" }}
                >
                  PERSONAL BESTS
                </p>
                <div className="space-y-1.5">
                  {Object.entries(prMap).map(([name, pr]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between"
                    >
                      <span
                        className="text-[12px] capitalize"
                        style={{ color: "var(--os-text-primary)" }}
                      >
                        {name}
                      </span>
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: "var(--os-accent)" }}
                      >
                        {pr.weight}
                        {pr.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col items-center gap-3 pt-4">
              <Dumbbell
                className="w-10 h-10"
                style={{ color: "rgba(39,215,224,0.15)" }}
              />
              <p className="text-sm" style={{ color: muted }}>
                Select a session to view details
              </p>
              <button
                type="button"
                onClick={createSession}
                className="px-4 h-8 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: "rgba(39,215,224,0.12)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "var(--os-accent)",
                }}
              >
                + New Session
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Session header */}
            <div
              className="px-4 py-3 border-b flex items-center gap-3 flex-shrink-0"
              style={{
                borderColor: "rgba(39,215,224,0.12)",
                background: "rgba(10,16,20,0.5)",
              }}
            >
              <Calendar
                className="w-4 h-4"
                style={{ color: "rgba(39,215,224,0.6)" }}
              />
              <input
                type="text"
                value={selected.name}
                onChange={(e) =>
                  updateSession(selected.id, { name: e.target.value })
                }
                data-ocid="workout.input"
                className="flex-1 bg-transparent outline-none text-sm font-semibold"
                style={{ color: "var(--os-text-primary)" }}
              />
              <input
                type="date"
                value={selected.date}
                onChange={(e) =>
                  updateSession(selected.id, { date: e.target.value })
                }
                className="bg-transparent outline-none text-xs"
                style={{ color: muted, colorScheme: "dark" }}
              />
              <button
                type="button"
                onClick={() => deleteSession(selected.id)}
                data-ocid="workout.delete_button"
                className="w-6 h-6 rounded flex items-center justify-center transition-all hover:brightness-125"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "rgba(239,68,68,0.7)",
                }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Exercises list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {selected.exercises.length === 0 && !addingEx && (
                <div
                  className="flex flex-col items-center justify-center h-32 gap-2"
                  data-ocid="workout.empty_state"
                >
                  <Layers
                    className="w-8 h-8"
                    style={{ color: "rgba(39,215,224,0.2)" }}
                  />
                  <p className="text-[12px]" style={{ color: muted }}>
                    No exercises yet
                  </p>
                </div>
              )}

              {selected.exercises.map((ex, i) => (
                <div
                  key={ex.id}
                  data-ocid={`workout.row.${i + 1}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                  style={{ ...panel, background: "var(--os-bg-elevated)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12px] font-semibold"
                      style={{ color: "var(--os-text-primary)" }}
                    >
                      {ex.name}
                    </p>
                    <p className="text-[11px]" style={{ color: muted }}>
                      {ex.sets} sets × {ex.reps} reps
                      {ex.weight > 0 && (
                        <>
                          {" "}
                          ·{" "}
                          <span style={{ color: "var(--os-accent)" }}>
                            {ex.weight}
                            {ex.unit}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  {/* Check PR */}
                  {prMap[ex.name.toLowerCase()]?.weight === ex.weight &&
                    ex.weight > 0 && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{
                          background: "rgba(39,215,224,0.15)",
                          color: "var(--os-accent)",
                          border: "1px solid rgba(39,215,224,0.3)",
                        }}
                      >
                        PR
                      </span>
                    )}
                  <button
                    type="button"
                    onClick={() => removeExercise(ex.id)}
                    data-ocid={`workout.delete_button.${i + 1}`}
                    className="w-6 h-6 rounded flex items-center justify-center transition-all hover:brightness-125"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.15)",
                      color: "rgba(239,68,68,0.6)",
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add exercise form */}
              {addingEx ? (
                <div
                  className="rounded-lg p-3 space-y-2"
                  style={{ ...panel, background: "var(--os-bg-elevated)" }}
                >
                  <p
                    className="text-[11px] font-semibold"
                    style={{ color: "var(--os-accent)" }}
                  >
                    Add Exercise
                  </p>
                  <input
                    type="text"
                    placeholder="Exercise name (e.g. Bench Press)"
                    value={newEx.name}
                    onChange={(e) =>
                      setNewEx((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="workout.textarea"
                    className="w-full px-2 py-1.5 rounded text-[12px] outline-none"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: "1px solid rgba(39,215,224,0.2)",
                      color: "var(--os-text-primary)",
                    }}
                  />
                  <div className="flex gap-2">
                    {(["sets", "reps"] as const).map((field) => (
                      <div key={field} className="flex-1">
                        <span
                          className="text-[10px] block mb-1"
                          style={{ color: muted }}
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={newEx[field]}
                          onChange={(e) =>
                            setNewEx((p) => ({
                              ...p,
                              [field]: Math.max(1, Number(e.target.value)),
                            }))
                          }
                          className="w-full px-2 py-1 rounded text-[12px] outline-none"
                          style={{
                            background: "var(--os-border-subtle)",
                            border: "1px solid rgba(39,215,224,0.15)",
                            color: "var(--os-text-primary)",
                            colorScheme: "dark",
                          }}
                        />
                      </div>
                    ))}
                    <div className="flex-1">
                      <span
                        className="text-[10px] block mb-1"
                        style={{ color: muted }}
                      >
                        Weight
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={newEx.weight}
                        onChange={(e) =>
                          setNewEx((p) => ({
                            ...p,
                            weight: Number(e.target.value),
                          }))
                        }
                        className="w-full px-2 py-1 rounded text-[12px] outline-none"
                        style={{
                          background: "var(--os-border-subtle)",
                          border: "1px solid rgba(39,215,224,0.15)",
                          color: "var(--os-text-primary)",
                          colorScheme: "dark",
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <span
                        className="text-[10px] block mb-1"
                        style={{ color: muted }}
                      >
                        Unit
                      </span>
                      <select
                        value={newEx.unit}
                        onChange={(e) =>
                          setNewEx((p) => ({
                            ...p,
                            unit: e.target.value as "kg" | "lbs",
                          }))
                        }
                        className="w-full px-2 py-1 rounded text-[12px] outline-none"
                        style={{
                          background: "rgba(10,16,20,0.9)",
                          border: "1px solid rgba(39,215,224,0.15)",
                          color: "var(--os-text-primary)",
                          colorScheme: "dark",
                        }}
                      >
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={addExercise}
                      data-ocid="workout.submit_button"
                      className="flex-1 h-7 rounded text-[11px] font-semibold transition-all"
                      style={{
                        background: "rgba(39,215,224,0.12)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "var(--os-accent)",
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingEx(false)}
                      data-ocid="workout.cancel_button"
                      className="h-7 px-3 rounded text-[11px] transition-all"
                      style={{
                        background: "var(--os-border-subtle)",
                        border: "1px solid var(--os-text-muted)",
                        color: muted,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingEx(true)}
                  data-ocid="workout.secondary_button"
                  className="w-full h-9 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-125"
                  style={{
                    background: "rgba(39,215,224,0.07)",
                    border: "1px dashed rgba(39,215,224,0.25)",
                    color: "rgba(39,215,224,0.7)",
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Exercise
                </button>
              )}
            </div>

            {/* PR summary footer */}
            {Object.keys(prMap).length > 0 && (
              <div
                className="px-4 py-2 border-t flex-shrink-0 overflow-x-auto"
                style={{
                  borderColor: "rgba(39,215,224,0.1)",
                  background: "rgba(10,16,20,0.5)",
                }}
              >
                <div className="flex items-center gap-3 min-w-max">
                  <TrendingUp
                    className="w-3 h-3 flex-shrink-0"
                    style={{ color: "rgba(39,215,224,0.6)" }}
                  />
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: "rgba(39,215,224,0.6)" }}
                  >
                    PRs:
                  </span>
                  {Object.entries(prMap)
                    .slice(0, 5)
                    .map(([name, pr]) => (
                      <span
                        key={name}
                        className="text-[10px]"
                        style={{ color: "var(--os-text-secondary)" }}
                      >
                        <span style={{ color: "var(--os-text-primary)" }}>
                          {name}
                        </span>{" "}
                        {pr.weight}
                        {pr.unit}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
