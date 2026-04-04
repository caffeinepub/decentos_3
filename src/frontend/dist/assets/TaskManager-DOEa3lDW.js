import { r as reactExports, j as jsxRuntimeExports, d as SquareCheckBig, ak as Columns2, al as Grid3x3, R as RefreshCw, a5 as ChevronDown, f as ChevronRight, T as Trash2 } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { L as List } from "./list-IfiP4J1J.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { P as Pause } from "./pause-4HbYDkez.js";
import { P as Play } from "./play-BQFY022i.js";
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const PRIORITY_COLORS = {
  high: {
    dot: "rgba(248,113,113,1)",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
    label: "rgba(248,113,113,0.9)"
  },
  medium: {
    dot: "rgba(251,191,36,1)",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
    label: "rgba(251,191,36,0.9)"
  },
  low: {
    dot: "rgba(74,222,128,1)",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.25)",
    label: "rgba(74,222,128,0.9)"
  }
};
function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date((/* @__PURE__ */ new Date()).toDateString());
}
function toYMD(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseNaturalDate(input) {
  const s = input.trim().toLowerCase();
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  if (s === "today") return toYMD(today);
  if (s === "tomorrow") {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return toYMD(d);
  }
  if (s === "yesterday") {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return toYMD(d);
  }
  const inMatch = s.match(/^in (\d+) (day|days|week|weeks)$/);
  if (inMatch) {
    const n = Number.parseInt(inMatch[1] ?? "0");
    const unit = inMatch[2] ?? "";
    const d = new Date(today);
    d.setDate(d.getDate() + (unit.startsWith("week") ? n * 7 : n));
    return toYMD(d);
  }
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  const nextMatch = s.match(
    /^(?:next )?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/
  );
  if (nextMatch) {
    const targetDay = dayNames.indexOf(nextMatch[1] ?? "");
    const d = new Date(today);
    const currentDay = d.getDay();
    let diff = targetDay - currentDay;
    if (diff <= 0 || s.startsWith("next ")) diff += 7;
    d.setDate(d.getDate() + diff);
    return toYMD(d);
  }
  return input;
}
function advanceDueDate(dueDate, repeat) {
  const base = dueDate ? new Date(dueDate) : /* @__PURE__ */ new Date();
  base.setHours(0, 0, 0, 0);
  if (repeat === "daily") base.setDate(base.getDate() + 1);
  else if (repeat === "weekly") base.setDate(base.getDate() + 7);
  else if (repeat === "monthly") base.setMonth(base.getMonth() + 1);
  return toYMD(base);
}
function tagHashColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "rgba(99,102,241,0.85)",
    "rgba(168,85,247,0.85)",
    "rgba(236,72,153,0.85)",
    "rgba(245,158,11,0.85)",
    "rgba(16,185,129,0.85)",
    "rgba(59,130,246,0.85)",
    "rgba(239,68,68,0.85)",
    "rgba(20,184,166,0.85)"
  ];
  return colors[Math.abs(hash) % colors.length];
}
function TaskManager({ windowProps: _windowProps }) {
  const { data: persistedTasks, set: saveTasks } = useCanisterKV(
    "decentos_tasks",
    []
  );
  const [tasks, setTasksState] = reactExports.useState([]);
  const taskHydratedRef = reactExports.useRef(false);
  const [viewMode, setViewMode] = reactExports.useState("list");
  const [dragTaskId, setDragTaskId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (taskHydratedRef.current) return;
    taskHydratedRef.current = true;
    if (persistedTasks.length > 0) {
      setTasksState(
        persistedTasks.map((t) => ({
          status: t.completed ? "done" : "todo",
          repeat: "none",
          ...t
        }))
      );
    }
  }, [persistedTasks]);
  const [filter, setFilter] = reactExports.useState("all");
  const [sortBy, setSortBy] = reactExports.useState("created");
  const [tagFilter, setTagFilter] = reactExports.useState(null);
  const [newTagsInput, setNewTagsInput] = reactExports.useState("");
  const [newTitle, setNewTitle] = reactExports.useState("");
  const [newPriority, setNewPriority] = reactExports.useState(
    "medium"
  );
  const [newNotes, setNewNotes] = reactExports.useState("");
  const [newDueDateInput, setNewDueDateInput] = reactExports.useState("");
  const [newRepeat, setNewRepeat] = reactExports.useState("none");
  const [showForm, setShowForm] = reactExports.useState(false);
  const [expandedSubtasks, setExpandedSubtasks] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [addingSubtaskFor, setAddingSubtaskFor] = reactExports.useState(null);
  const [subtaskInput, setSubtaskInput] = reactExports.useState("");
  const titleInputRef = reactExports.useRef(null);
  const timerIntervalsRef = reactExports.useRef(
    /* @__PURE__ */ new Map()
  );
  reactExports.useEffect(() => {
    var _a;
    if (showForm) (_a = titleInputRef.current) == null ? void 0 : _a.focus();
  }, [showForm]);
  reactExports.useEffect(() => {
    return () => {
      for (const id of timerIntervalsRef.current.values()) clearInterval(id);
    };
  }, []);
  const toggleTimer = reactExports.useCallback(
    (taskId) => {
      setTasksState((prev) => {
        const next = prev.map((t) => {
          if (t.id !== taskId && t.timerActive) {
            const iid = timerIntervalsRef.current.get(t.id);
            if (iid !== void 0) {
              clearInterval(iid);
              timerIntervalsRef.current.delete(t.id);
            }
            return { ...t, timerActive: false };
          }
          if (t.id === taskId) {
            const wasActive = t.timerActive;
            if (wasActive) {
              const iid2 = timerIntervalsRef.current.get(t.id);
              if (iid2 !== void 0) {
                clearInterval(iid2);
                timerIntervalsRef.current.delete(t.id);
              }
              return { ...t, timerActive: false };
            }
            const iid = setInterval(() => {
              setTasksState((inner) => {
                const updated = inner.map(
                  (tt) => tt.id === taskId ? { ...tt, timeSpent: (tt.timeSpent ?? 0) + 1 } : tt
                );
                saveTasks(updated);
                return updated;
              });
            }, 1e3);
            timerIntervalsRef.current.set(t.id, iid);
            return { ...t, timerActive: true };
          }
          return t;
        });
        saveTasks(next);
        return next;
      });
    },
    [saveTasks]
  );
  function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ${seconds % 60}s`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
  }
  const setTasks = reactExports.useCallback(
    (updater) => {
      setTasksState((prev) => {
        const next = updater(prev);
        saveTasks(next);
        return next;
      });
    },
    [saveTasks]
  );
  const addTask = reactExports.useCallback(() => {
    if (!newTitle.trim()) return;
    const resolvedDue = parseNaturalDate(newDueDateInput);
    const task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      notes: newNotes.trim(),
      completed: false,
      createdAt: Date.now(),
      dueDate: resolvedDue || void 0,
      subtasks: [],
      status: "todo",
      repeat: newRepeat ?? "none",
      tags: newTagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    };
    setTasks((prev) => [task, ...prev]);
    setNewTitle("");
    setNewNotes("");
    setNewPriority("medium");
    setNewDueDateInput("");
    setNewRepeat("none");
    setNewTagsInput("");
    setShowForm(false);
  }, [
    newTitle,
    newPriority,
    newNotes,
    newDueDateInput,
    newRepeat,
    newTagsInput,
    setTasks
  ]);
  const toggleTask = reactExports.useCallback(
    (id) => {
      setTasks((prev) => {
        const task = prev.find((t) => t.id === id);
        if (!task) return prev;
        const nowCompleted = !task.completed;
        let result = prev.map(
          (t) => t.id === id ? {
            ...t,
            completed: nowCompleted,
            status: nowCompleted ? "done" : "todo"
          } : t
        );
        if (nowCompleted && task.repeat && task.repeat !== "none") {
          const next = {
            ...task,
            id: `task-${Date.now()}-recur`,
            completed: false,
            status: "todo",
            createdAt: Date.now(),
            dueDate: advanceDueDate(task.dueDate, task.repeat)
          };
          result = [next, ...result];
        }
        return result;
      });
    },
    [setTasks]
  );
  const moveTaskStatus = reactExports.useCallback(
    (id, status) => {
      setTasks(
        (prev) => prev.map(
          (t) => t.id === id ? { ...t, status, completed: status === "done" } : t
        )
      );
    },
    [setTasks]
  );
  const deleteTask = reactExports.useCallback(
    (id) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks]
  );
  const addSubtask = reactExports.useCallback(
    (taskId) => {
      if (!subtaskInput.trim()) return;
      setTasks(
        (prev) => prev.map(
          (t) => t.id === taskId ? {
            ...t,
            subtasks: [
              ...t.subtasks ?? [],
              {
                id: `sub-${Date.now()}`,
                title: subtaskInput.trim(),
                completed: false
              }
            ]
          } : t
        )
      );
      setSubtaskInput("");
      setAddingSubtaskFor(null);
    },
    [subtaskInput, setTasks]
  );
  const toggleSubtask = reactExports.useCallback(
    (taskId, subtaskId) => {
      setTasks(
        (prev) => prev.map(
          (t) => t.id === taskId ? {
            ...t,
            subtasks: (t.subtasks ?? []).map(
              (s) => s.id === subtaskId ? { ...s, completed: !s.completed } : s
            )
          } : t
        )
      );
    },
    [setTasks]
  );
  const deleteSubtask = reactExports.useCallback(
    (taskId, subtaskId) => {
      setTasks(
        (prev) => prev.map(
          (t) => t.id === taskId ? {
            ...t,
            subtasks: (t.subtasks ?? []).filter((s) => s.id !== subtaskId)
          } : t
        )
      );
    },
    [setTasks]
  );
  const toggleSubtaskExpand = (taskId) => {
    setExpandedSubtasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };
  const filteredAndSorted = reactExports.useMemo(() => {
    let result = tasks;
    if (filter === "active") result = result.filter((t) => !t.completed);
    else if (filter === "completed") result = result.filter((t) => t.completed);
    if (tagFilter)
      result = result.filter((t) => (t.tags ?? []).includes(tagFilter));
    return [...result].sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === "priority")
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return b.createdAt - a.createdAt;
    });
  }, [tasks, filter, sortBy, tagFilter]);
  const counts = reactExports.useMemo(
    () => ({
      high: tasks.filter((t) => !t.completed && t.priority === "high").length,
      medium: tasks.filter((t) => !t.completed && t.priority === "medium").length,
      low: tasks.filter((t) => !t.completed && t.priority === "low").length
    }),
    [tasks]
  );
  const kanbanCols = [
    {
      id: "todo",
      label: "To Do",
      color: "rgba(99,102,241,1)",
      headerBg: "rgba(99,102,241,0.12)"
    },
    {
      id: "inprogress",
      label: "In Progress",
      color: "rgba(251,191,36,1)",
      headerBg: "rgba(251,191,36,0.1)"
    },
    {
      id: "done",
      label: "Done",
      color: "rgba(74,222,128,1)",
      headerBg: "rgba(74,222,128,0.1)"
    }
  ];
  const renderTaskCard = (task, i, isKanban = false) => {
    const colors = PRIORITY_COLORS[task.priority];
    const overdue = isOverdue(task.dueDate) && !task.completed;
    const subtasks = task.subtasks ?? [];
    const isExpanded = expandedSubtasks.has(task.id);
    const isAddingSub = addingSubtaskFor === task.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        draggable: isKanban,
        onDragStart: () => setDragTaskId(task.id),
        onDragEnd: () => setDragTaskId(null),
        className: "rounded-lg overflow-hidden transition-colors",
        style: {
          background: "var(--os-bg-elevated)",
          border: "1px solid rgba(55,55,65,0.7)",
          opacity: task.completed && !isKanban ? 0.55 : 1,
          cursor: isKanban ? "grab" : "default"
        },
        "data-ocid": `taskmanager.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleTask(task.id),
                "data-ocid": `taskmanager.checkbox.${i + 1}`,
                "aria-label": task.completed ? "Mark incomplete" : "Mark complete",
                className: "mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 transition-colors flex items-center justify-center",
                style: {
                  borderColor: task.completed ? "rgba(99,102,241,0.5)" : colors.dot,
                  background: task.completed ? "rgba(99,102,241,0.15)" : "transparent"
                },
                children: task.completed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    width: "10",
                    height: "10",
                    viewBox: "0 0 10 10",
                    fill: "none",
                    "aria-hidden": "true",
                    role: "img",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Checkmark" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          d: "M2 5l2.5 2.5L8 3",
                          stroke: "rgba(99,102,241,0.9)",
                          strokeWidth: "1.5",
                          strokeLinecap: "round",
                          strokeLinejoin: "round"
                        }
                      )
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm font-medium",
                    style: {
                      color: task.completed ? "var(--os-text-muted)" : "var(--os-text-primary)",
                      textDecoration: task.completed ? "line-through" : "none"
                    },
                    children: task.title
                  }
                ),
                !task.completed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      toggleTimer(task.id);
                    },
                    title: task.timerActive ? "Pause timer" : "Start timer",
                    className: "flex items-center justify-center w-4 h-4 rounded flex-shrink-0 transition-colors",
                    style: {
                      background: task.timerActive ? "rgba(99,102,241,0.2)" : "transparent",
                      color: task.timerActive ? "rgba(99,102,241,1)" : "var(--os-text-muted)"
                    },
                    children: task.timerActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-2.5 h-2.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[9px] px-1.5 py-0.5 rounded capitalize font-mono flex-shrink-0",
                    style: {
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      color: colors.label
                    },
                    children: task.priority
                  }
                ),
                task.repeat && task.repeat !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 flex items-center gap-0.5",
                    style: {
                      background: "rgba(99,102,241,0.08)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      color: "rgba(99,102,241,0.7)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-2 h-2" }),
                      " ",
                      task.repeat
                    ]
                  }
                ),
                task.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[9px] px-1.5 py-0.5 rounded font-mono flex-shrink-0",
                    style: {
                      background: overdue ? "rgba(239,68,68,0.1)" : "var(--os-border-subtle)",
                      border: `1px solid ${overdue ? "rgba(239,68,68,0.4)" : "var(--os-text-muted)"}`,
                      color: overdue ? "rgba(239,68,68,0.9)" : "var(--os-text-secondary)"
                    },
                    children: [
                      overdue ? "⚠ " : "",
                      task.dueDate
                    ]
                  }
                )
              ] }),
              (task.tags ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: (task.tags ?? []).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setTagFilter(tagFilter === tag ? null : tag),
                  className: "px-1.5 py-0.5 rounded text-[10px] font-medium transition-all",
                  style: {
                    background: `${tagHashColor(tag)}22`,
                    border: `1px solid ${tagHashColor(tag)}55`,
                    color: tagHashColor(tag)
                  },
                  children: [
                    "#",
                    tag
                  ]
                },
                tag
              )) }),
              task.notes && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[11px] mt-0.5 truncate",
                  style: { color: "var(--os-text-muted)" },
                  children: task.notes
                }
              ),
              (task.timeSpent ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-[10px] mt-0.5 font-mono",
                  style: {
                    color: task.timerActive ? "rgba(99,102,241,0.9)" : "var(--os-text-muted)"
                  },
                  children: [
                    "⏱ ",
                    formatTime(task.timeSpent ?? 0),
                    task.timerActive && " (running)"
                  ]
                }
              ),
              subtasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => toggleSubtaskExpand(task.id),
                  className: "flex items-center gap-1 mt-1 text-[10px] transition-colors",
                  style: { color: "var(--os-text-secondary)" },
                  children: [
                    isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" }),
                    subtasks.filter((s) => s.completed).length,
                    "/",
                    subtasks.length,
                    " ",
                    "subtasks"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setAddingSubtaskFor(isAddingSub ? null : task.id);
                    setSubtaskInput("");
                    setExpandedSubtasks((prev) => {
                      const next = new Set(prev);
                      next.add(task.id);
                      return next;
                    });
                  },
                  title: "Add subtask",
                  "data-ocid": `taskmanager.add_subtask.${i + 1}`,
                  className: "w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10",
                  style: { color: "rgba(99,102,241,0.6)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteTask(task.id),
                  "data-ocid": `taskmanager.delete_button.${i + 1}`,
                  "aria-label": "Delete task",
                  className: "w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20",
                  style: { color: "rgba(248,113,113,0.7)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                }
              )
            ] })
          ] }),
          isExpanded && subtasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-3 pb-2 space-y-1",
              style: { borderTop: "1px solid rgba(55,55,65,0.5)" },
              children: subtasks.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 py-1 group/sub",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleSubtask(task.id, sub.id),
                        className: "w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
                        style: {
                          borderColor: sub.completed ? "rgba(99,102,241,0.5)" : "var(--os-text-muted)",
                          background: sub.completed ? "rgba(99,102,241,0.15)" : "transparent"
                        },
                        children: sub.completed && /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "7", height: "7", viewBox: "0 0 7 7", fill: "none", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "done" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "path",
                            {
                              d: "M1 3.5l1.5 1.5L6 2",
                              stroke: "rgba(99,102,241,0.9)",
                              strokeWidth: "1.2",
                              strokeLinecap: "round",
                              strokeLinejoin: "round"
                            }
                          )
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "flex-1 text-xs",
                        style: {
                          color: sub.completed ? "var(--os-text-muted)" : "var(--os-text-secondary)",
                          textDecoration: sub.completed ? "line-through" : "none"
                        },
                        children: sub.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => deleteSubtask(task.id, sub.id),
                        className: "opacity-0 group-hover/sub:opacity-100 transition-opacity w-4 h-4 flex items-center justify-center",
                        style: { color: "rgba(248,113,113,0.5)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-2.5 h-2.5" })
                      }
                    )
                  ]
                },
                sub.id
              ))
            }
          ),
          isAddingSub && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 pb-2 flex items-center gap-2",
              style: { borderTop: "1px solid rgba(55,55,65,0.4)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronRight,
                  {
                    className: "w-3 h-3 flex-shrink-0",
                    style: { color: "var(--os-text-muted)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    autoFocus: true,
                    type: "text",
                    value: subtaskInput,
                    onChange: (e) => setSubtaskInput(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") addSubtask(task.id);
                      if (e.key === "Escape") setAddingSubtaskFor(null);
                    },
                    placeholder: "Add subtask...",
                    className: "flex-1 bg-transparent outline-none text-xs",
                    style: {
                      color: "var(--os-text-secondary)",
                      borderBottom: "1px solid rgba(99,102,241,0.3)",
                      paddingBottom: 2
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => addSubtask(task.id),
                    className: "text-[10px] px-2 py-0.5 rounded",
                    style: {
                      background: "rgba(99,102,241,0.1)",
                      color: "rgba(99,102,241,0.8)",
                      border: "1px solid rgba(99,102,241,0.25)"
                    },
                    children: "Add"
                  }
                )
              ]
            }
          )
        ]
      },
      task.id
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--os-bg-app)" },
      "data-ocid": "taskmanager.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-3 border-b flex-shrink-0",
            style: {
              borderColor: "var(--os-border-subtle)",
              background: "var(--os-bg-elevated)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SquareCheckBig,
                    {
                      className: "w-4 h-4",
                      style: { color: "rgba(99,102,241,0.9)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h2",
                    {
                      className: "text-sm font-semibold",
                      style: { color: "rgba(99,102,241,0.9)" },
                      children: "Task Manager"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex rounded overflow-hidden",
                      style: { border: "1px solid rgba(99,102,241,0.2)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setViewMode("list"),
                            title: "List view",
                            className: "w-7 h-6 flex items-center justify-center transition-colors",
                            style: {
                              background: viewMode === "list" ? "rgba(99,102,241,0.18)" : "transparent",
                              color: viewMode === "list" ? "rgba(99,102,241,0.9)" : "var(--os-text-muted)"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "w-3 h-3" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setViewMode("kanban"),
                            title: "Kanban view",
                            className: "w-7 h-6 flex items-center justify-center transition-colors",
                            style: {
                              background: viewMode === "kanban" ? "rgba(99,102,241,0.18)" : "transparent",
                              color: viewMode === "kanban" ? "rgba(99,102,241,0.9)" : "var(--os-text-muted)"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Columns2, { className: "w-3 h-3" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setViewMode("matrix"),
                            title: "Eisenhower Matrix",
                            className: "w-7 h-6 flex items-center justify-center transition-colors",
                            style: {
                              background: viewMode === "matrix" ? "rgba(99,102,241,0.18)" : "transparent",
                              color: viewMode === "matrix" ? "rgba(99,102,241,0.9)" : "var(--os-text-muted)"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "w-3 h-3" })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowForm((v) => !v),
                      "data-ocid": "taskmanager.primary_button",
                      className: "flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-medium transition-colors",
                      style: {
                        background: showForm ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.3)",
                        color: "rgba(99,102,241,0.9)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                        "New Task"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                ["high", "medium", "low"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-2 h-2 rounded-full",
                      style: { background: PRIORITY_COLORS[p].dot }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-[10px] font-mono capitalize",
                      style: { color: PRIORITY_COLORS[p].label },
                      children: [
                        counts[p],
                        " ",
                        p
                      ]
                    }
                  )
                ] }, p)),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "ml-auto text-[10px]",
                    style: { color: "var(--os-text-muted)" },
                    children: [
                      tasks.filter((t) => !t.completed).length,
                      " active / ",
                      tasks.length,
                      " ",
                      "total"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-3 flex-shrink-0 space-y-2",
            style: {
              borderBottom: "1px solid rgba(55,55,65,0.5)",
              background: "rgba(99,102,241,0.03)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: titleInputRef,
                  type: "text",
                  value: newTitle,
                  onChange: (e) => setNewTitle(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && addTask(),
                  placeholder: "Task title...",
                  "data-ocid": "taskmanager.input",
                  className: "w-full bg-transparent outline-none text-sm",
                  style: {
                    color: "var(--os-text-primary)",
                    borderBottom: "1px solid rgba(99,102,241,0.3)",
                    paddingBottom: 4
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-muted)" },
                    children: "Priority:"
                  }
                ),
                ["high", "medium", "low"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setNewPriority(p),
                    "data-ocid": `taskmanager.${p}_priority.toggle`,
                    className: "px-2 py-0.5 rounded text-[10px] capitalize transition-all",
                    style: {
                      background: newPriority === p ? PRIORITY_COLORS[p].bg : "transparent",
                      border: `1px solid ${newPriority === p ? PRIORITY_COLORS[p].border : "rgba(55,55,65,0.5)"}`,
                      color: newPriority === p ? PRIORITY_COLORS[p].label : "var(--os-text-secondary)"
                    },
                    children: p
                  },
                  p
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-muted)" },
                    children: "Due:"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: newDueDateInput,
                    onChange: (e) => setNewDueDateInput(e.target.value),
                    onBlur: (e) => setNewDueDateInput(parseNaturalDate(e.target.value)),
                    placeholder: "today, tomorrow, next friday, in 3 days...",
                    "data-ocid": "taskmanager.duedate.input",
                    className: "flex-1 bg-transparent outline-none text-xs",
                    style: {
                      color: "var(--os-text-primary)",
                      border: "1px solid rgba(55,55,65,0.5)",
                      borderRadius: 4,
                      padding: "2px 6px"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-muted)" },
                    children: "Repeat:"
                  }
                ),
                ["none", "daily", "weekly", "monthly"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setNewRepeat(r),
                    className: "px-2 py-0.5 rounded text-[10px] capitalize transition-all",
                    style: {
                      background: newRepeat === r ? "rgba(99,102,241,0.12)" : "transparent",
                      border: `1px solid ${newRepeat === r ? "rgba(99,102,241,0.35)" : "rgba(55,55,65,0.5)"}`,
                      color: newRepeat === r ? "rgba(99,102,241,0.9)" : "var(--os-text-secondary)"
                    },
                    children: r
                  },
                  r
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: newTagsInput,
                  onChange: (e) => setNewTagsInput(e.target.value),
                  placeholder: "Tags (comma separated, e.g. work, urgent)",
                  "data-ocid": "taskmanager.tags_input",
                  className: "w-full bg-transparent outline-none text-xs",
                  style: {
                    color: "var(--os-text-secondary)",
                    borderBottom: "1px solid rgba(55,55,65,0.4)",
                    paddingBottom: 4
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: newNotes,
                  onChange: (e) => setNewNotes(e.target.value),
                  placeholder: "Notes (optional)",
                  "data-ocid": "taskmanager.textarea",
                  className: "w-full bg-transparent outline-none text-xs",
                  style: {
                    color: "var(--os-text-secondary)",
                    borderBottom: "1px solid rgba(55,55,65,0.4)",
                    paddingBottom: 4
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowForm(false),
                    "data-ocid": "taskmanager.cancel_button",
                    className: "px-3 h-7 rounded text-xs transition-colors",
                    style: { color: "var(--os-text-secondary)" },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: addTask,
                    "data-ocid": "taskmanager.submit_button",
                    className: "px-3 h-7 rounded text-xs font-medium transition-colors",
                    style: {
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "rgba(99,102,241,0.9)"
                    },
                    children: "Add Task"
                  }
                )
              ] })
            ]
          }
        ),
        viewMode === "list" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-0 px-4 py-2 flex-shrink-0",
            style: { borderBottom: "1px solid rgba(55,55,65,0.4)" },
            children: [
              ["all", "active", "completed"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFilter(f),
                  "data-ocid": `taskmanager.${f}.tab`,
                  className: "px-3 py-1 text-xs capitalize transition-colors rounded",
                  style: {
                    color: filter === f ? "rgba(99,102,241,0.9)" : "var(--os-text-secondary)",
                    background: filter === f ? "rgba(99,102,241,0.08)" : "transparent"
                  },
                  children: f
                },
                f
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] mr-1",
                  style: { color: "var(--os-text-muted)" },
                  children: "Sort:"
                }
              ),
              ["created", "dueDate", "priority"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSortBy(s),
                  "data-ocid": `taskmanager.sort_${s}.toggle`,
                  className: "px-2 py-0.5 text-[10px] rounded transition-colors",
                  style: {
                    color: sortBy === s ? "rgba(99,102,241,0.9)" : "var(--os-text-muted)",
                    background: sortBy === s ? "rgba(99,102,241,0.08)" : "transparent"
                  },
                  children: s === "created" ? "Date Added" : s === "dueDate" ? "Due" : "Priority"
                },
                s
              )),
              (() => {
                const allTags = Array.from(
                  new Set(tasks.flatMap((t) => t.tags ?? []))
                );
                if (allTags.length === 0) return null;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-px h-4 mx-1",
                      style: { background: "rgba(55,55,65,0.5)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: tagFilter ?? "",
                      onChange: (e) => setTagFilter(e.target.value || null),
                      "data-ocid": "taskmanager.select",
                      className: "text-[10px] px-2 py-0.5 rounded outline-none",
                      style: {
                        background: tagFilter ? "rgba(99,102,241,0.08)" : "transparent",
                        border: "1px solid rgba(55,55,65,0.5)",
                        color: tagFilter ? "rgba(99,102,241,0.9)" : "var(--os-text-muted)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All tags" }),
                        allTags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: t, children: [
                          "#",
                          t
                        ] }, t))
                      ]
                    }
                  )
                ] });
              })()
            ]
          }
        ),
        viewMode === "list" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-3 space-y-2", children: filteredAndSorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-full gap-3",
            style: { color: "var(--os-text-muted)" },
            "data-ocid": "taskmanager.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-10 h-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: filter === "completed" ? "No completed tasks" : filter === "active" ? "No active tasks" : "No tasks yet — add one above" })
            ]
          }
        ) : filteredAndSorted.map((task, i) => renderTaskCard(task, i)) }) : viewMode === "matrix" ? (
          /* Eisenhower Matrix */
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-3 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 h-full min-h-[400px]", children: [
            {
              urgent: true,
              important: true,
              label: "Do First",
              sublabel: "Urgent + Important",
              color: "#ef4444",
              bg: "rgba(239,68,68,0.06)",
              border: "rgba(239,68,68,0.25)"
            },
            {
              urgent: false,
              important: true,
              label: "Schedule",
              sublabel: "Not Urgent + Important",
              color: "#3b82f6",
              bg: "rgba(59,130,246,0.06)",
              border: "rgba(59,130,246,0.25)"
            },
            {
              urgent: true,
              important: false,
              label: "Delegate",
              sublabel: "Urgent + Not Important",
              color: "#f59e0b",
              bg: "rgba(245,158,11,0.06)",
              border: "rgba(245,158,11,0.25)"
            },
            {
              urgent: false,
              important: false,
              label: "Eliminate",
              sublabel: "Not Urgent + Not Important",
              color: "#6b7280",
              bg: "rgba(107,114,128,0.06)",
              border: "rgba(107,114,128,0.25)"
            }
          ].map((quadrant) => {
            const qTasks = tasks.filter((t) => {
              if (t.completed) return false;
              const u = t.urgent ?? true;
              const imp = t.important ?? true;
              return u === quadrant.urgent && imp === quadrant.important;
            });
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl flex flex-col overflow-hidden",
                style: {
                  background: quadrant.bg,
                  border: `1px solid ${quadrant.border}`
                },
                onDragOver: (e) => e.preventDefault(),
                onDrop: () => {
                  if (dragTaskId) {
                    setTasksState((prev) => {
                      const next = prev.map(
                        (t) => t.id === dragTaskId ? {
                          ...t,
                          urgent: quadrant.urgent,
                          important: quadrant.important
                        } : t
                      );
                      saveTasks(next);
                      return next;
                    });
                    setDragTaskId(null);
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "px-3 py-2 flex-shrink-0",
                      style: { borderBottom: `1px solid ${quadrant.border}` },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs font-semibold",
                            style: { color: quadrant.color },
                            children: quadrant.label
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-[9px] mt-0.5",
                            style: { color: "var(--os-text-muted)" },
                            children: quadrant.sublabel
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1.5", children: qTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex items-center justify-center h-10 rounded",
                      style: {
                        border: `1px dashed ${quadrant.border}`,
                        color: "var(--os-text-muted)"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Drop tasks here" })
                    }
                  ) : qTasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      draggable: true,
                      onDragStart: () => setDragTaskId(task.id),
                      className: "flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-grab",
                      style: {
                        background: "var(--os-bg-elevated)",
                        border: "1px solid var(--os-border-subtle)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => toggleTask(task.id),
                            className: "flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center",
                            style: { borderColor: quadrant.color }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-[11px] flex-1 truncate",
                            style: { color: "var(--os-text-primary)" },
                            children: task.title
                          }
                        )
                      ]
                    },
                    task.id
                  )) })
                ]
              },
              quadrant.label
            );
          }) }) })
        ) : (
          /* Kanban Board */
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex gap-3 p-3 overflow-x-auto overflow-y-hidden", children: kanbanCols.map((col) => {
            const colTasks = tasks.filter(
              (t) => (t.status ?? (t.completed ? "done" : "todo")) === col.id
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col flex-shrink-0 w-64 rounded-xl overflow-hidden",
                style: {
                  background: "var(--os-bg-elevated)",
                  border: "1px solid rgba(55,55,65,0.6)"
                },
                onDragOver: (e) => e.preventDefault(),
                onDrop: () => {
                  if (dragTaskId) {
                    moveTaskStatus(dragTaskId, col.id);
                    setDragTaskId(null);
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between px-3 py-2.5 flex-shrink-0",
                      style: {
                        background: col.headerBg,
                        borderBottom: `1px solid ${col.color}22`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-xs font-semibold",
                            style: { color: col.color },
                            children: col.label
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                            style: { background: `${col.color}18`, color: col.color },
                            children: colTasks.length
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-2", children: colTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex items-center justify-center h-16 rounded-lg",
                      style: {
                        border: `1px dashed ${col.color}30`,
                        color: "var(--os-text-muted)"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Drop tasks here" })
                    }
                  ) : colTasks.map((task, i) => renderTaskCard(task, i, true)) })
                ]
              },
              col.id
            );
          }) })
        )
      ]
    }
  );
}
export {
  TaskManager
};
