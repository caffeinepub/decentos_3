import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useState } from "react";

const DONE_KEY = "decent_os_setup_checklist_done";
const USER_TYPE_KEY = "decent_os_user_type";

const TASKS: Record<string, string[]> = {
  personal: [
    "Open Notes and write your first entry",
    "Add an event to Calendar",
    "Upload a file to File Manager",
    "Explore the App Store",
  ],
  developer: [
    "Open Terminal and type `help`",
    "Open Code Editor and create a file",
    "Open Process Monitor",
    "Browse Developer Tools in App Store",
  ],
  poweruser: [
    "Open Terminal (type `help` for commands)",
    "Open Process Monitor",
    "Customize your dock in Settings",
  ],
};

export function SetupChecklist() {
  const [done, setDone] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [userType, setUserType] = useState<string>("personal");

  useEffect(() => {
    try {
      if (localStorage.getItem(DONE_KEY) === "true") {
        setDone(true);
        return;
      }
      const ut = localStorage.getItem(USER_TYPE_KEY) ?? "personal";
      setUserType(ut);
      const tasks = TASKS[ut] ?? TASKS.personal;
      setChecked(new Array(tasks.length).fill(false));
    } catch {}
  }, []);

  if (done) return null;

  const tasks = TASKS[userType] ?? TASKS.personal;

  const toggleCheck = (i: number) => {
    const next = checked.map((v, idx) => (idx === i ? !v : v));
    setChecked(next);
    if (next.every(Boolean)) {
      dismiss();
    }
  };

  const dismiss = () => {
    try {
      localStorage.setItem(DONE_KEY, "true");
    } catch {}
    setDone(true);
  };

  const completedCount = checked.filter(Boolean).length;

  return (
    <div
      data-ocid="setup_checklist.card"
      style={{
        position: "absolute",
        bottom: 80,
        left: 16,
        maxWidth: 224,
        background: "var(--os-bg-elevated)",
        border: "1px solid var(--os-border-subtle)",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px",
          borderBottom: collapsed
            ? "none"
            : "1px solid var(--os-border-subtle)",
          gap: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--os-text-primary)",
            }}
          >
            Getting Started
          </span>
          <span
            style={{
              fontSize: 10,
              color: "var(--os-text-muted)",
              background: "var(--os-border-subtle)",
              borderRadius: 999,
              padding: "1px 5px",
            }}
          >
            {completedCount}/{tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          data-ocid="setup_checklist.toggle"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--os-text-muted)",
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
        <button
          type="button"
          onClick={dismiss}
          data-ocid="setup_checklist.close_button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--os-text-muted)",
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={11} />
        </button>
      </div>

      {/* Tasks */}
      {!collapsed && (
        <div style={{ padding: "6px 10px 10px" }}>
          {tasks.map((task, i) => (
            <label
              key={task}
              data-ocid={`setup_checklist.checkbox.${i + 1}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <input
                type="checkbox"
                checked={checked[i] ?? false}
                onChange={() => toggleCheck(i)}
                style={{
                  marginTop: 2,
                  accentColor: "var(--os-accent-color)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: checked[i]
                    ? "var(--os-text-muted)"
                    : "var(--os-text-primary)",
                  textDecoration: checked[i] ? "line-through" : "none",
                  lineHeight: 1.4,
                }}
              >
                {task}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
