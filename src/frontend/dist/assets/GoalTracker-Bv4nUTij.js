import { r as reactExports, j as jsxRuntimeExports, at as Target, T as Trash2 } from "./index-CZGIn5x2.js";
import { B as Badge } from "./badge-D2FbqHYW.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { a as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-BCz03eSL.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { P as Progress } from "./progress-D5FDkJK5.js";
import { S as ScrollArea } from "./scroll-area-0_61eqCO.js";
import { S as Slider } from "./slider-Dqduz-Nj.js";
import { T as Textarea } from "./textarea-Bhc13Xgf.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import { C as CircleCheck } from "./circle-check-DLIDLAd8.js";
import { C as Circle } from "./circle-IQ0J3sbP.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
import "./index-DxR-hlVQ.js";
import "./index-DfmnWLAm.js";
import "./index-uZuUQcbU.js";
import "./index-CY_eMQHg.js";
import "./index-B9-lQkRo.js";
import "./index-C4X58sdz.js";
import "./index-YwGfiBwk.js";
import "./index-9Nd72esH.js";
import "./index-IXOTxK3N.js";
import "./index-DTcg9m71.js";
import "./index-D8sJW3Ik.js";
const CATEGORIES = ["All", "Personal", "Work", "Health", "Learning"];
const CATEGORY_COLORS = {
  Personal: "rgba(168,85,247,0.7)",
  Work: "rgba(99,102,241,0.7)",
  Health: "rgba(34,197,94,0.7)",
  Learning: "rgba(39,215,224,0.7)"
};
function GoalCard({
  goal,
  onEdit,
  onDelete
}) {
  const milestoneProgress = goal.milestones.length > 0 ? Math.round(
    goal.milestones.filter((m) => m.done).length / goal.milestones.length * 100
  ) : goal.progress;
  const displayProgress = goal.milestones.length > 0 ? milestoneProgress : goal.progress;
  const daysLeft = Math.ceil(
    (new Date(goal.targetDate).getTime() - Date.now()) / 864e5
  );
  const color = CATEGORY_COLORS[goal.category] ?? "rgba(39,215,224,0.7)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      className: "flex flex-col gap-3 p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-1px] w-full text-left",
      style: {
        background: "rgba(10,18,24,0.7)",
        border: `1px solid ${color.replace("0.7", "0.2")}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
      },
      onClick: () => onEdit(goal),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "font-semibold text-sm truncate",
                style: { color: "var(--os-text-primary)" },
                children: goal.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs mt-0.5 line-clamp-2",
                style: { color: "var(--os-text-secondary)" },
                children: goal.description
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                onDelete(goal.id);
              },
              className: "flex-shrink-0 text-muted-foreground hover:text-red-400 transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "text-[10px] px-2 py-0",
              style: {
                background: color.replace("0.7", "0.15"),
                color,
                border: `1px solid ${color.replace("0.7", "0.3")}`
              },
              children: goal.category
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] ml-auto",
              style: {
                color: daysLeft < 14 ? "rgba(239,68,68,0.7)" : "var(--os-text-muted)"
              },
              children: daysLeft > 0 ? `${daysLeft}d left` : "Overdue"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-secondary)" }, children: "Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color }, children: [
              displayProgress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: displayProgress,
              className: "h-1.5",
              style: { background: "var(--os-border-subtle)" }
            }
          )
        ] }),
        goal.milestones.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: goal.milestones.slice(0, 4).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          m.done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3", style: { color } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Circle,
            {
              className: "w-3 h-3",
              style: { color: "var(--os-text-muted)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] truncate max-w-[80px]",
              style: {
                color: m.done ? "var(--os-text-secondary)" : "var(--os-text-muted)"
              },
              children: m.text
            }
          )
        ] }, m.id)) })
      ]
    }
  );
}
function GoalTracker() {
  const { data: goals, set: setGoals } = useCanisterKV(
    "decent-goals",
    []
  );
  const [filter, setFilter] = reactExports.useState("All");
  const [editGoal, setEditGoal] = reactExports.useState(null);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [newGoal, setNewGoal] = reactExports.useState({
    category: "Personal",
    progress: 0,
    milestones: []
  });
  const [newMilestone, setNewMilestone] = reactExports.useState("");
  const filteredGoals = goals.filter(
    (g) => filter === "All" || g.category === filter
  );
  const deleteGoal = (id) => setGoals(goals.filter((g) => g.id !== id));
  const saveEditGoal = () => {
    if (!editGoal) return;
    setGoals(goals.map((g) => g.id === editGoal.id ? editGoal : g));
    setEditGoal(null);
  };
  const addGoal = () => {
    var _a;
    if (!((_a = newGoal.title) == null ? void 0 : _a.trim())) return;
    const goal = {
      id: `g${Date.now()}`,
      title: newGoal.title ?? "",
      description: newGoal.description ?? "",
      targetDate: newGoal.targetDate ?? new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
      progress: newGoal.progress ?? 0,
      category: newGoal.category ?? "Personal",
      milestones: newGoal.milestones ?? []
    };
    setGoals([...goals, goal]);
    setNewGoal({ category: "Personal", progress: 0, milestones: [] });
    setShowAdd(false);
  };
  const addMilestoneToEdit = () => {
    if (!editGoal || !newMilestone.trim()) return;
    setEditGoal({
      ...editGoal,
      milestones: [
        ...editGoal.milestones,
        { id: `m${Date.now()}`, text: newMilestone.trim(), done: false }
      ]
    });
    setNewMilestone("");
  };
  const toggleMilestone = (milestoneId) => {
    if (!editGoal) return;
    const updated = editGoal.milestones.map(
      (m) => m.id === milestoneId ? { ...m, done: !m.done } : m
    );
    const doneCount = updated.filter((m) => m.done).length;
    const autoProgress = updated.length > 0 ? Math.round(doneCount / updated.length * 100) : editGoal.progress;
    setEditGoal({ ...editGoal, milestones: updated, progress: autoProgress });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full p-4 gap-4",
      style: { background: "var(--os-bg-app)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setFilter(cat),
              "data-ocid": `goals.${cat.toLowerCase()}.tab`,
              className: "px-3 py-1 rounded-full text-xs transition-all",
              style: filter === cat ? {
                background: CATEGORY_COLORS[cat] ?? "rgba(39,215,224,0.15)",
                color: "var(--os-text-primary)"
              } : {
                background: "var(--os-border-subtle)",
                color: "var(--os-text-secondary)"
              },
              children: cat
            },
            cat
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => setShowAdd(true),
              "data-ocid": "goals.add.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
                " Add Goal"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pr-2", children: [
          filteredGoals.map((goal) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            GoalCard,
            {
              goal,
              onEdit: setEditGoal,
              onDelete: deleteGoal
            },
            goal.id
          )),
          filteredGoals.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "col-span-2 text-center py-12",
              "data-ocid": "goals.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Target,
                  {
                    className: "w-10 h-10 mx-auto mb-2",
                    style: { color: "rgba(39,215,224,0.2)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "var(--os-text-muted)" }, children: "No goals in this category." })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editGoal, onOpenChange: (o) => !o && setEditGoal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-lg",
            style: {
              background: "rgba(10,18,24,0.97)",
              border: "1px solid rgba(39,215,224,0.2)"
            },
            "data-ocid": "goals.edit.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: { color: "rgba(39,215,224,0.9)" }, children: "Edit Goal" }) }),
              editGoal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: editGoal.title,
                    onChange: (e) => setEditGoal({ ...editGoal, title: e.target.value }),
                    placeholder: "Goal title",
                    "data-ocid": "goals.title.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    value: editGoal.description,
                    onChange: (e) => setEditGoal({ ...editGoal, description: e.target.value }),
                    placeholder: "Description",
                    rows: 2,
                    "data-ocid": "goals.desc.textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs",
                        style: { color: "rgba(39,215,224,0.7)" },
                        children: "Target Date"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "date",
                        value: editGoal.targetDate,
                        onChange: (e) => setEditGoal({ ...editGoal, targetDate: e.target.value }),
                        className: "h-9",
                        "data-ocid": "goals.date.input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs",
                        style: { color: "rgba(39,215,224,0.7)" },
                        children: "Category"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        value: editGoal.category,
                        onChange: (e) => setEditGoal({
                          ...editGoal,
                          category: e.target.value
                        }),
                        "data-ocid": "goals.category.select",
                        className: "h-9 px-3 rounded-md text-sm",
                        style: {
                          background: "var(--os-border-subtle)",
                          border: "1px solid var(--os-text-muted)",
                          color: "var(--os-text-primary)"
                        },
                        children: ["Personal", "Work", "Health", "Learning"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "option",
                          {
                            value: c,
                            style: { background: "var(--os-bg-app)" },
                            children: c
                          },
                          c
                        ))
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs",
                        style: { color: "rgba(39,215,224,0.7)" },
                        children: "Progress"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-xs font-mono",
                        style: { color: "rgba(39,215,224,0.9)" },
                        children: [
                          editGoal.progress,
                          "%"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Slider,
                    {
                      value: [editGoal.progress],
                      onValueChange: ([v]) => setEditGoal({ ...editGoal, progress: v }),
                      max: 100,
                      step: 5,
                      "data-ocid": "goals.progress.toggle"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs",
                      style: { color: "rgba(39,215,224,0.7)" },
                      children: "Milestones"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: editGoal.milestones.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleMilestone(m.id),
                        className: "flex-shrink-0",
                        children: m.done ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheck,
                          {
                            className: "w-4 h-4",
                            style: { color: "rgba(39,215,224,0.8)" }
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Circle,
                          {
                            className: "w-4 h-4",
                            style: { color: "var(--os-text-muted)" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-sm",
                        style: {
                          color: m.done ? "var(--os-text-secondary)" : "var(--os-text-secondary)",
                          textDecoration: m.done ? "line-through" : "none"
                        },
                        children: m.text
                      }
                    )
                  ] }, m.id)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: newMilestone,
                        onChange: (e) => setNewMilestone(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && addMilestoneToEdit(),
                        placeholder: "Add milestone...",
                        className: "h-8 text-sm",
                        "data-ocid": "goals.milestone.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: addMilestoneToEdit,
                        "data-ocid": "goals.milestone.add.button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      onClick: () => setEditGoal(null),
                      "data-ocid": "goals.cancel.button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveEditGoal, "data-ocid": "goals.save.button", children: "Save Goal" })
                ] })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-md",
            style: {
              background: "rgba(10,18,24,0.97)",
              border: "1px solid rgba(39,215,224,0.2)"
            },
            "data-ocid": "goals.add.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: { color: "rgba(39,215,224,0.9)" }, children: "New Goal" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: newGoal.title ?? "",
                    onChange: (e) => setNewGoal({ ...newGoal, title: e.target.value }),
                    placeholder: "What do you want to achieve?",
                    "data-ocid": "goals.new_title.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    value: newGoal.description ?? "",
                    onChange: (e) => setNewGoal({ ...newGoal, description: e.target.value }),
                    placeholder: "Description (optional)",
                    rows: 2,
                    "data-ocid": "goals.new_desc.textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs",
                        style: { color: "rgba(39,215,224,0.7)" },
                        children: "Target Date"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "date",
                        value: newGoal.targetDate ?? "",
                        onChange: (e) => setNewGoal({ ...newGoal, targetDate: e.target.value }),
                        className: "h-9"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs",
                        style: { color: "rgba(39,215,224,0.7)" },
                        children: "Category"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        value: newGoal.category ?? "Personal",
                        onChange: (e) => setNewGoal({
                          ...newGoal,
                          category: e.target.value
                        }),
                        className: "h-9 px-3 rounded-md text-sm",
                        style: {
                          background: "var(--os-border-subtle)",
                          border: "1px solid var(--os-text-muted)",
                          color: "var(--os-text-primary)"
                        },
                        children: ["Personal", "Work", "Health", "Learning"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "option",
                          {
                            value: c,
                            style: { background: "var(--os-bg-app)" },
                            children: c
                          },
                          c
                        ))
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      onClick: () => setShowAdd(false),
                      "data-ocid": "goals.add_cancel.button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addGoal, "data-ocid": "goals.add_confirm.button", children: "Create Goal" })
                ] })
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
export {
  GoalTracker
};
