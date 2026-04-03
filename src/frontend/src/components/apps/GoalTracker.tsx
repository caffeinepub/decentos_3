import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Circle, Plus, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Milestone {
  id: string;
  text: string;
  done: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: "Personal" | "Work" | "Health" | "Learning";
  milestones: Milestone[];
}

const CATEGORIES = ["All", "Personal", "Work", "Health", "Learning"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Personal: "rgba(168,85,247,0.7)",
  Work: "rgba(99,102,241,0.7)",
  Health: "rgba(34,197,94,0.7)",
  Learning: "rgba(39,215,224,0.7)",
};

function GoalCard({
  goal,
  onEdit,
  onDelete,
}: { goal: Goal; onEdit: (g: Goal) => void; onDelete: (id: string) => void }) {
  const milestoneProgress =
    goal.milestones.length > 0
      ? Math.round(
          (goal.milestones.filter((m) => m.done).length /
            goal.milestones.length) *
            100,
        )
      : goal.progress;
  const displayProgress =
    goal.milestones.length > 0 ? milestoneProgress : goal.progress;
  const daysLeft = Math.ceil(
    (new Date(goal.targetDate).getTime() - Date.now()) / 86400000,
  );
  const color = CATEGORY_COLORS[goal.category] ?? "rgba(39,215,224,0.7)";

  return (
    <button
      type="button"
      className="flex flex-col gap-3 p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-1px] w-full text-left"
      style={{
        background: "rgba(10,18,24,0.7)",
        border: `1px solid ${color.replace("0.7", "0.2")}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
      onClick={() => onEdit(goal)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-sm truncate"
            style={{ color: "var(--os-text-primary)" }}
          >
            {goal.title}
          </h3>
          <p
            className="text-xs mt-0.5 line-clamp-2"
            style={{ color: "var(--os-text-secondary)" }}
          >
            {goal.description}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(goal.id);
          }}
          className="flex-shrink-0 text-muted-foreground hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          className="text-[10px] px-2 py-0"
          style={{
            background: color.replace("0.7", "0.15"),
            color,
            border: `1px solid ${color.replace("0.7", "0.3")}`,
          }}
        >
          {goal.category}
        </Badge>
        <span
          className="text-[10px] ml-auto"
          style={{
            color:
              daysLeft < 14 ? "rgba(239,68,68,0.7)" : "var(--os-text-muted)",
          }}
        >
          {daysLeft > 0 ? `${daysLeft}d left` : "Overdue"}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px]">
          <span style={{ color: "var(--os-text-secondary)" }}>Progress</span>
          <span style={{ color }}>{displayProgress}%</span>
        </div>
        <Progress
          value={displayProgress}
          className="h-1.5"
          style={{ background: "var(--os-border-subtle)" }}
        />
      </div>
      {goal.milestones.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {goal.milestones.slice(0, 4).map((m) => (
            <div key={m.id} className="flex items-center gap-1">
              {m.done ? (
                <CheckCircle2 className="w-3 h-3" style={{ color }} />
              ) : (
                <Circle
                  className="w-3 h-3"
                  style={{ color: "var(--os-text-muted)" }}
                />
              )}
              <span
                className="text-[10px] truncate max-w-[80px]"
                style={{
                  color: m.done
                    ? "var(--os-text-secondary)"
                    : "var(--os-text-muted)",
                }}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

export function GoalTracker() {
  const { data: goals, set: setGoals } = useCanisterKV<Goal[]>(
    "decent-goals",
    [],
  );
  const [filter, setFilter] = useState<"All" | Goal["category"]>("All");
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    category: "Personal",
    progress: 0,
    milestones: [],
  });
  const [newMilestone, setNewMilestone] = useState("");

  const filteredGoals = goals.filter(
    (g) => filter === "All" || g.category === filter,
  );

  const deleteGoal = (id: string) => setGoals(goals.filter((g) => g.id !== id));

  const saveEditGoal = () => {
    if (!editGoal) return;
    setGoals(goals.map((g) => (g.id === editGoal.id ? editGoal : g)));
    setEditGoal(null);
  };

  const addGoal = () => {
    if (!newGoal.title?.trim()) return;
    const goal: Goal = {
      id: `g${Date.now()}`,
      title: newGoal.title ?? "",
      description: newGoal.description ?? "",
      targetDate:
        newGoal.targetDate ??
        new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      progress: newGoal.progress ?? 0,
      category: (newGoal.category as Goal["category"]) ?? "Personal",
      milestones: newGoal.milestones ?? [],
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
        { id: `m${Date.now()}`, text: newMilestone.trim(), done: false },
      ],
    });
    setNewMilestone("");
  };

  const toggleMilestone = (milestoneId: string) => {
    if (!editGoal) return;
    const updated = editGoal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, done: !m.done } : m,
    );
    const doneCount = updated.filter((m) => m.done).length;
    const autoProgress =
      updated.length > 0
        ? Math.round((doneCount / updated.length) * 100)
        : editGoal.progress;
    setEditGoal({ ...editGoal, milestones: updated, progress: autoProgress });
  };

  return (
    <div
      className="flex flex-col h-full p-4 gap-4"
      style={{ background: "var(--os-bg-app)" }}
    >
      {/* Filter tabs + add button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              data-ocid={`goals.${cat.toLowerCase()}.tab`}
              className="px-3 py-1 rounded-full text-xs transition-all"
              style={
                filter === cat
                  ? {
                      background:
                        CATEGORY_COLORS[cat] ?? "rgba(39,215,224,0.15)",
                      color: "var(--os-text-primary)",
                    }
                  : {
                      background: "var(--os-border-subtle)",
                      color: "var(--os-text-secondary)",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={() => setShowAdd(true)}
          data-ocid="goals.add.button"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Goal
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-2">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={setEditGoal}
              onDelete={deleteGoal}
            />
          ))}
          {filteredGoals.length === 0 && (
            <div
              className="col-span-2 text-center py-12"
              data-ocid="goals.empty_state"
            >
              <Target
                className="w-10 h-10 mx-auto mb-2"
                style={{ color: "rgba(39,215,224,0.2)" }}
              />
              <p className="text-sm" style={{ color: "var(--os-text-muted)" }}>
                No goals in this category.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Edit goal dialog */}
      <Dialog open={!!editGoal} onOpenChange={(o) => !o && setEditGoal(null)}>
        <DialogContent
          className="max-w-lg"
          style={{
            background: "rgba(10,18,24,0.97)",
            border: "1px solid rgba(39,215,224,0.2)",
          }}
          data-ocid="goals.edit.dialog"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "rgba(39,215,224,0.9)" }}>
              Edit Goal
            </DialogTitle>
          </DialogHeader>
          {editGoal && (
            <div className="flex flex-col gap-4">
              <Input
                value={editGoal.title}
                onChange={(e) =>
                  setEditGoal({ ...editGoal, title: e.target.value })
                }
                placeholder="Goal title"
                data-ocid="goals.title.input"
              />
              <Textarea
                value={editGoal.description}
                onChange={(e) =>
                  setEditGoal({ ...editGoal, description: e.target.value })
                }
                placeholder="Description"
                rows={2}
                data-ocid="goals.desc.textarea"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span
                    className="text-xs"
                    style={{ color: "rgba(39,215,224,0.7)" }}
                  >
                    Target Date
                  </span>
                  <Input
                    type="date"
                    value={editGoal.targetDate}
                    onChange={(e) =>
                      setEditGoal({ ...editGoal, targetDate: e.target.value })
                    }
                    className="h-9"
                    data-ocid="goals.date.input"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className="text-xs"
                    style={{ color: "rgba(39,215,224,0.7)" }}
                  >
                    Category
                  </span>
                  <select
                    value={editGoal.category}
                    onChange={(e) =>
                      setEditGoal({
                        ...editGoal,
                        category: e.target.value as Goal["category"],
                      })
                    }
                    data-ocid="goals.category.select"
                    className="h-9 px-3 rounded-md text-sm"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-text-muted)",
                      color: "var(--os-text-primary)",
                    }}
                  >
                    {["Personal", "Work", "Health", "Learning"].map((c) => (
                      <option
                        key={c}
                        value={c}
                        style={{ background: "var(--os-bg-app)" }}
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "rgba(39,215,224,0.7)" }}
                  >
                    Progress
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: "rgba(39,215,224,0.9)" }}
                  >
                    {editGoal.progress}%
                  </span>
                </div>
                <Slider
                  value={[editGoal.progress]}
                  onValueChange={([v]) =>
                    setEditGoal({ ...editGoal, progress: v })
                  }
                  max={100}
                  step={5}
                  data-ocid="goals.progress.toggle"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="text-xs"
                  style={{ color: "rgba(39,215,224,0.7)" }}
                >
                  Milestones
                </span>
                <div className="flex flex-col gap-1">
                  {editGoal.milestones.map((m) => (
                    <div key={m.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleMilestone(m.id)}
                        className="flex-shrink-0"
                      >
                        {m.done ? (
                          <CheckCircle2
                            className="w-4 h-4"
                            style={{ color: "rgba(39,215,224,0.8)" }}
                          />
                        ) : (
                          <Circle
                            className="w-4 h-4"
                            style={{ color: "var(--os-text-muted)" }}
                          />
                        )}
                      </button>
                      <span
                        className="text-sm"
                        style={{
                          color: m.done
                            ? "var(--os-text-secondary)"
                            : "var(--os-text-secondary)",
                          textDecoration: m.done ? "line-through" : "none",
                        }}
                      >
                        {m.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addMilestoneToEdit()}
                    placeholder="Add milestone..."
                    className="h-8 text-sm"
                    data-ocid="goals.milestone.input"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addMilestoneToEdit}
                    data-ocid="goals.milestone.add.button"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setEditGoal(null)}
                  data-ocid="goals.cancel.button"
                >
                  Cancel
                </Button>
                <Button onClick={saveEditGoal} data-ocid="goals.save.button">
                  Save Goal
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add goal dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent
          className="max-w-md"
          style={{
            background: "rgba(10,18,24,0.97)",
            border: "1px solid rgba(39,215,224,0.2)",
          }}
          data-ocid="goals.add.dialog"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "rgba(39,215,224,0.9)" }}>
              New Goal
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              value={newGoal.title ?? ""}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              placeholder="What do you want to achieve?"
              data-ocid="goals.new_title.input"
            />
            <Textarea
              value={newGoal.description ?? ""}
              onChange={(e) =>
                setNewGoal({ ...newGoal, description: e.target.value })
              }
              placeholder="Description (optional)"
              rows={2}
              data-ocid="goals.new_desc.textarea"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs"
                  style={{ color: "rgba(39,215,224,0.7)" }}
                >
                  Target Date
                </span>
                <Input
                  type="date"
                  value={newGoal.targetDate ?? ""}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetDate: e.target.value })
                  }
                  className="h-9"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs"
                  style={{ color: "rgba(39,215,224,0.7)" }}
                >
                  Category
                </span>
                <select
                  value={newGoal.category ?? "Personal"}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      category: e.target.value as Goal["category"],
                    })
                  }
                  className="h-9 px-3 rounded-md text-sm"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-primary)",
                  }}
                >
                  {["Personal", "Work", "Health", "Learning"].map((c) => (
                    <option
                      key={c}
                      value={c}
                      style={{ background: "var(--os-bg-app)" }}
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowAdd(false)}
                data-ocid="goals.add_cancel.button"
              >
                Cancel
              </Button>
              <Button onClick={addGoal} data-ocid="goals.add_confirm.button">
                Create Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
