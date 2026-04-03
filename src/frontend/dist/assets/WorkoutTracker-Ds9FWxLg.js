import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, f as ChevronRight, aE as Calendar, T as Trash2, aO as Layers, D as TrendingUp } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z",
      key: "9m4mmf"
    }
  ],
  ["path", { d: "m2.5 21.5 1.4-1.4", key: "17g3f0" }],
  ["path", { d: "m20.1 3.9 1.4-1.4", key: "1qn309" }],
  [
    "path",
    {
      d: "M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z",
      key: "1t2c92"
    }
  ],
  ["path", { d: "m9.6 14.4 4.8-4.8", key: "6umqxw" }]
];
const Dumbbell = createLucideIcon("dumbbell", __iconNode);
function genId() {
  return `ws_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function genExId() {
  return `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function getWeekStart() {
  const d = /* @__PURE__ */ new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function WorkoutTracker({
  windowProps: _w
}) {
  const {
    data: persisted,
    set: save,
    loading
  } = useCanisterKV("workout_sessions", []);
  const [sessions, setSessions] = reactExports.useState([]);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [addingEx, setAddingEx] = reactExports.useState(false);
  const [newEx, setNewEx] = reactExports.useState({
    name: "",
    sets: 3,
    reps: 10,
    weight: 0,
    unit: "kg"
  });
  const hydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (persisted.length > 0) {
      setSessions(persisted);
      setSelectedId(persisted[0].id);
    }
  }, [loading, persisted]);
  const selected = sessions.find((s) => s.id === selectedId) ?? null;
  const createSession = reactExports.useCallback(() => {
    const s = {
      id: genId(),
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      name: "New Workout",
      exercises: []
    };
    setSessions((prev) => {
      const updated = [s, ...prev];
      save(updated);
      return updated;
    });
    setSelectedId(s.id);
  }, [save]);
  const deleteSession = reactExports.useCallback(
    (id) => {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        save(updated);
        return updated;
      });
      setSelectedId((prev) => prev === id ? null : prev);
    },
    [save]
  );
  const updateSession = reactExports.useCallback(
    (id, patch) => {
      setSessions((prev) => {
        const updated = prev.map((s) => s.id === id ? { ...s, ...patch } : s);
        save(updated);
        return updated;
      });
    },
    [save]
  );
  const addExercise = reactExports.useCallback(() => {
    if (!selectedId || !newEx.name.trim()) return;
    const ex = { id: genExId(), ...newEx, name: newEx.name.trim() };
    setSessions((prev) => {
      const updated = prev.map(
        (s) => s.id === selectedId ? { ...s, exercises: [...s.exercises, ex] } : s
      );
      save(updated);
      return updated;
    });
    setNewEx({ name: "", sets: 3, reps: 10, weight: 0, unit: "kg" });
    setAddingEx(false);
  }, [selectedId, newEx, save]);
  const removeExercise = reactExports.useCallback(
    (exId) => {
      if (!selectedId) return;
      setSessions((prev) => {
        const updated = prev.map(
          (s) => s.id === selectedId ? { ...s, exercises: s.exercises.filter((e) => e.id !== exId) } : s
        );
        save(updated);
        return updated;
      });
    },
    [selectedId, save]
  );
  const weekStart = getWeekStart();
  const weekSessions = sessions.filter((s) => new Date(s.date) >= weekStart);
  const weekTotalSets = weekSessions.reduce(
    (acc, s) => acc + s.exercises.reduce((a, e) => a + e.sets, 0),
    0
  );
  const prMap = {};
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
    border: "1px solid rgba(39,215,224,0.18)"
  };
  const muted = "var(--os-text-secondary)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: { background: "rgba(8,14,20,0.95)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-48 flex-shrink-0 flex flex-col border-r",
        style: {
          borderColor: "rgba(39,215,224,0.12)",
          background: "rgba(10,16,20,0.8)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0",
              style: { borderColor: "rgba(39,215,224,0.12)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold",
                    style: { color: "var(--os-text-primary)" },
                    children: "Sessions"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: createSession,
                    "data-ocid": "workout.add_button",
                    className: "w-6 h-6 rounded flex items-center justify-center transition-all hover:brightness-125",
                    style: {
                      background: "rgba(39,215,224,0.12)",
                      border: "1px solid rgba(39,215,224,0.3)",
                      color: "var(--os-accent)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-2 border-b",
              style: {
                borderColor: "rgba(39,215,224,0.08)",
                background: "rgba(39,215,224,0.04)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[9px] font-semibold uppercase tracking-wider mb-1",
                    style: { color: "rgba(39,215,224,0.6)" },
                    children: "This Week"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-sm font-bold",
                        style: { color: "var(--os-accent)" },
                        children: weekSessions.length
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px]", style: { color: muted }, children: "sessions" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-sm font-bold",
                        style: { color: "var(--os-accent)" },
                        children: weekTotalSets
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px]", style: { color: muted }, children: "sets" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: sessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-center", "data-ocid": "workout.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", style: { color: muted }, children: "No sessions yet" }) }) : sessions.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `workout.item.${i + 1}`,
              onClick: () => setSelectedId(s.id),
              className: "w-full text-left px-3 py-2.5 flex items-center gap-2 transition-all border-b",
              style: {
                borderColor: "rgba(39,215,224,0.06)",
                background: selectedId === s.id ? "rgba(39,215,224,0.1)" : "transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Dumbbell,
                  {
                    className: "w-3 h-3 flex-shrink-0",
                    style: {
                      color: selectedId === s.id ? "var(--os-accent)" : muted
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[11px] font-semibold truncate",
                      style: {
                        color: selectedId === s.id ? "var(--os-text-primary)" : "var(--os-text-secondary)"
                      },
                      children: s.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px]", style: { color: muted }, children: [
                    s.date,
                    " · ",
                    s.exercises.length,
                    " exercises"
                  ] })
                ] }),
                selectedId === s.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronRight,
                  {
                    className: "w-3 h-3 flex-shrink-0",
                    style: { color: "var(--os-accent)" }
                  }
                )
              ]
            },
            s.id
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: !selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl p-3",
            style: {
              background: "var(--os-bg-elevated)",
              border: "1px solid rgba(39,215,224,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px] font-semibold mb-1",
                  style: { color: "rgba(39,215,224,0.6)" },
                  children: "TOTAL SESSIONS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-2xl font-bold",
                  style: { color: "var(--os-text-primary)" },
                  children: sessions.length
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl p-3",
            style: {
              background: "var(--os-bg-elevated)",
              border: `1px solid ${weekSessions.length >= 3 ? "rgba(34,197,94,0.3)" : "rgba(39,215,224,0.15)"}`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px] font-semibold mb-1",
                  style: { color: "rgba(39,215,224,0.6)" },
                  children: "THIS WEEK"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-2xl font-bold",
                  style: {
                    color: weekSessions.length >= 3 ? "#22c55e" : "var(--os-text-primary)"
                  },
                  children: [
                    weekSessions.length,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-sm font-normal ml-1",
                        style: { color: "var(--os-text-muted)" },
                        children: "/3"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px]",
                  style: { color: "var(--os-text-muted)" },
                  children: "weekly target"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl p-3",
            style: {
              background: "var(--os-bg-elevated)",
              border: "1px solid rgba(39,215,224,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px] font-semibold mb-1",
                  style: { color: "rgba(39,215,224,0.6)" },
                  children: "EXERCISES TRACKED"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-2xl font-bold",
                  style: { color: "var(--os-text-primary)" },
                  children: Object.keys(prMap).length
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px]",
                  style: { color: "var(--os-text-muted)" },
                  children: "unique exercises"
                }
              )
            ]
          }
        )
      ] }),
      Object.keys(prMap).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl p-3",
          style: {
            background: "var(--os-bg-elevated)",
            border: "1px solid rgba(39,215,224,0.15)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[10px] font-semibold mb-2",
                style: { color: "rgba(39,215,224,0.6)" },
                children: "PERSONAL BESTS"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: Object.entries(prMap).map(([name, pr]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[12px] capitalize",
                      style: { color: "var(--os-text-primary)" },
                      children: name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-[12px] font-bold",
                      style: { color: "var(--os-accent)" },
                      children: [
                        pr.weight,
                        pr.unit
                      ]
                    }
                  )
                ]
              },
              name
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dumbbell,
          {
            className: "w-10 h-10",
            style: { color: "rgba(39,215,224,0.15)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: muted }, children: "Select a session to view details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: createSession,
            className: "px-4 h-8 rounded-lg text-xs font-semibold transition-all",
            style: {
              background: "rgba(39,215,224,0.12)",
              border: "1px solid rgba(39,215,224,0.3)",
              color: "var(--os-accent)"
            },
            children: "+ New Session"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "px-4 py-3 border-b flex items-center gap-3 flex-shrink-0",
          style: {
            borderColor: "rgba(39,215,224,0.12)",
            background: "rgba(10,16,20,0.5)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Calendar,
              {
                className: "w-4 h-4",
                style: { color: "rgba(39,215,224,0.6)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: selected.name,
                onChange: (e) => updateSession(selected.id, { name: e.target.value }),
                "data-ocid": "workout.input",
                className: "flex-1 bg-transparent outline-none text-sm font-semibold",
                style: { color: "var(--os-text-primary)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "date",
                value: selected.date,
                onChange: (e) => updateSession(selected.id, { date: e.target.value }),
                className: "bg-transparent outline-none text-xs",
                style: { color: muted, colorScheme: "dark" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => deleteSession(selected.id),
                "data-ocid": "workout.delete_button",
                className: "w-6 h-6 rounded flex items-center justify-center transition-all hover:brightness-125",
                style: {
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "rgba(239,68,68,0.7)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-2", children: [
        selected.exercises.length === 0 && !addingEx && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-32 gap-2",
            "data-ocid": "workout.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Layers,
                {
                  className: "w-8 h-8",
                  style: { color: "rgba(39,215,224,0.2)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px]", style: { color: muted }, children: "No exercises yet" })
            ]
          }
        ),
        selected.exercises.map((ex, i) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `workout.row.${i + 1}`,
              className: "flex items-center gap-3 px-3 py-2.5 rounded-lg",
              style: { ...panel, background: "var(--os-bg-elevated)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[12px] font-semibold",
                      style: { color: "var(--os-text-primary)" },
                      children: ex.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px]", style: { color: muted }, children: [
                    ex.sets,
                    " sets × ",
                    ex.reps,
                    " reps",
                    ex.weight > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      " ",
                      "·",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--os-accent)" }, children: [
                        ex.weight,
                        ex.unit
                      ] })
                    ] })
                  ] })
                ] }),
                ((_a = prMap[ex.name.toLowerCase()]) == null ? void 0 : _a.weight) === ex.weight && ex.weight > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[9px] px-1.5 py-0.5 rounded-full font-bold",
                    style: {
                      background: "rgba(39,215,224,0.15)",
                      color: "var(--os-accent)",
                      border: "1px solid rgba(39,215,224,0.3)"
                    },
                    children: "PR"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeExercise(ex.id),
                    "data-ocid": `workout.delete_button.${i + 1}`,
                    className: "w-6 h-6 rounded flex items-center justify-center transition-all hover:brightness-125",
                    style: {
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.15)",
                      color: "rgba(239,68,68,0.6)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                  }
                )
              ]
            },
            ex.id
          );
        }),
        addingEx ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg p-3 space-y-2",
            style: { ...panel, background: "var(--os-bg-elevated)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[11px] font-semibold",
                  style: { color: "var(--os-accent)" },
                  children: "Add Exercise"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Exercise name (e.g. Bench Press)",
                  value: newEx.name,
                  onChange: (e) => setNewEx((p) => ({ ...p, name: e.target.value })),
                  "data-ocid": "workout.textarea",
                  className: "w-full px-2 py-1.5 rounded text-[12px] outline-none",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(39,215,224,0.2)",
                    color: "var(--os-text-primary)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                ["sets", "reps"].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] block mb-1",
                      style: { color: muted },
                      children: field.charAt(0).toUpperCase() + field.slice(1)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 1,
                      value: newEx[field],
                      onChange: (e) => setNewEx((p) => ({
                        ...p,
                        [field]: Math.max(1, Number(e.target.value))
                      })),
                      className: "w-full px-2 py-1 rounded text-[12px] outline-none",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(39,215,224,0.15)",
                        color: "var(--os-text-primary)",
                        colorScheme: "dark"
                      }
                    }
                  )
                ] }, field)),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] block mb-1",
                      style: { color: muted },
                      children: "Weight"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      step: 0.5,
                      value: newEx.weight,
                      onChange: (e) => setNewEx((p) => ({
                        ...p,
                        weight: Number(e.target.value)
                      })),
                      className: "w-full px-2 py-1 rounded text-[12px] outline-none",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(39,215,224,0.15)",
                        color: "var(--os-text-primary)",
                        colorScheme: "dark"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] block mb-1",
                      style: { color: muted },
                      children: "Unit"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: newEx.unit,
                      onChange: (e) => setNewEx((p) => ({
                        ...p,
                        unit: e.target.value
                      })),
                      className: "w-full px-2 py-1 rounded text-[12px] outline-none",
                      style: {
                        background: "rgba(10,16,20,0.9)",
                        border: "1px solid rgba(39,215,224,0.15)",
                        color: "var(--os-text-primary)",
                        colorScheme: "dark"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "kg", children: "kg" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "lbs", children: "lbs" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: addExercise,
                    "data-ocid": "workout.submit_button",
                    className: "flex-1 h-7 rounded text-[11px] font-semibold transition-all",
                    style: {
                      background: "rgba(39,215,224,0.12)",
                      border: "1px solid rgba(39,215,224,0.3)",
                      color: "var(--os-accent)"
                    },
                    children: "Add"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAddingEx(false),
                    "data-ocid": "workout.cancel_button",
                    className: "h-7 px-3 rounded text-[11px] transition-all",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-text-muted)",
                      color: muted
                    },
                    children: "Cancel"
                  }
                )
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setAddingEx(true),
            "data-ocid": "workout.secondary_button",
            className: "w-full h-9 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-125",
            style: {
              background: "rgba(39,215,224,0.07)",
              border: "1px dashed rgba(39,215,224,0.25)",
              color: "rgba(39,215,224,0.7)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              "Add Exercise"
            ]
          }
        )
      ] }),
      Object.keys(prMap).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-4 py-2 border-t flex-shrink-0 overflow-x-auto",
          style: {
            borderColor: "rgba(39,215,224,0.1)",
            background: "rgba(10,16,20,0.5)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-max", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TrendingUp,
              {
                className: "w-3 h-3 flex-shrink-0",
                style: { color: "rgba(39,215,224,0.6)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-semibold",
                style: { color: "rgba(39,215,224,0.6)" },
                children: "PRs:"
              }
            ),
            Object.entries(prMap).slice(0, 5).map(([name, pr]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[10px]",
                style: { color: "var(--os-text-secondary)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-primary)" }, children: name }),
                  " ",
                  pr.weight,
                  pr.unit
                ]
              },
              name
            ))
          ] })
        }
      )
    ] }) })
  ] });
}
export {
  WorkoutTracker as default
};
