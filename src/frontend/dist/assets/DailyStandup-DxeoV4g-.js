import { r as reactExports, j as jsxRuntimeExports, ab as Clock, aA as Clipboard, f as ChevronRight, a3 as ChevronDown, g as ue } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Pen } from "./pen-fZsCY6fQ.js";
import { S as Save } from "./save-yx67L3vf.js";
function todayKey() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function DailyStandup() {
  const today = todayKey();
  const { data: allEntries, set: setAllEntries } = useCanisterKV("decentos_standup_data", []);
  const [yesterday, setYesterday] = reactExports.useState("");
  const [todayText, setTodayText] = reactExports.useState("");
  const [blockers, setBlockers] = reactExports.useState("");
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [collapsed, setCollapsed] = reactExports.useState({});
  const existing = allEntries.find((e) => e.date === today) ?? null;
  const history = allEntries.filter((e) => e.date !== today).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);
  reactExports.useEffect(() => {
    if (existing && !isEditing) {
      setYesterday(existing.yesterday);
      setTodayText(existing.today);
      setBlockers(existing.blockers);
    }
  }, [existing, isEditing]);
  const handleSave = () => {
    if (!yesterday.trim() && !todayText.trim()) {
      ue.error("Please fill in at least one field");
      return;
    }
    const entry = {
      date: today,
      yesterday: yesterday.trim(),
      today: todayText.trim(),
      blockers: blockers.trim(),
      savedAt: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    };
    const updated = [...allEntries.filter((e) => e.date !== today), entry];
    setAllEntries(updated);
    setIsEditing(false);
    ue.success("Standup saved");
  };
  const copyStandup = (entry) => {
    const lines = [`📅 Standup — ${entry.date}`];
    if (entry.yesterday) lines.push(`
✅ Yesterday:
${entry.yesterday}`);
    if (entry.today) lines.push(`
🔨 Today:
${entry.today}`);
    if (entry.blockers) lines.push(`
🚧 Blockers:
${entry.blockers}`);
    navigator.clipboard.writeText(lines.join("\n")).then(() => ue.success("Standup copied to clipboard")).catch(() => ue.error("Could not copy"));
  };
  const startEdit = () => {
    if (existing) {
      setYesterday(existing.yesterday);
      setTodayText(existing.today);
      setBlockers(existing.blockers);
    }
    setIsEditing(true);
  };
  const showForm = !existing || isEditing;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: "var(--os-bg-app)" },
      "data-ocid": "standup.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-shrink-0 px-4 py-3 border-b",
            style: {
              background: "var(--os-bg-window-header)",
              borderColor: "var(--os-border-subtle)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "var(--os-text-primary)" },
                    children: "Daily Standup"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] mt-0.5",
                    style: { color: "var(--os-text-muted)" },
                    children: today
                  }
                )
              ] }),
              existing && !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[10px] flex items-center gap-1",
                    style: { color: "#22c55e" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                      " Logged at ",
                      existing.savedAt
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => copyStandup(existing),
                    "data-ocid": "standup.secondary_button",
                    className: "flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors",
                    style: {
                      border: "1px solid var(--os-border-window)",
                      color: "var(--os-text-secondary)",
                      background: "var(--os-border-subtle)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "w-3 h-3" }),
                      " Copy"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: startEdit,
                    "data-ocid": "standup.edit_button",
                    className: "flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors",
                    style: {
                      border: "1px solid rgba(99,102,241,0.35)",
                      color: "rgba(99,102,241,1)",
                      background: "rgba(99,102,241,0.08)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3 h-3" }),
                      " Edit"
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
          existing && !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mx-4 mt-4 rounded-xl p-4",
              style: {
                background: "var(--os-bg-elevated)",
                border: "1px solid var(--os-border-window)"
              },
              "data-ocid": "standup.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] font-semibold mb-3",
                    style: { color: "#22c55e" },
                    children: "✓ Already logged today"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[9px] font-semibold uppercase tracking-widest mb-1",
                        style: { color: "var(--os-text-muted)" },
                        children: "Yesterday"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs",
                        style: { color: "var(--os-text-secondary)" },
                        children: existing.yesterday || "—"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[9px] font-semibold uppercase tracking-widest mb-1",
                        style: { color: "var(--os-text-muted)" },
                        children: "Today"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs",
                        style: { color: "var(--os-text-secondary)" },
                        children: existing.today || "—"
                      }
                    )
                  ] }),
                  existing.blockers && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[9px] font-semibold uppercase tracking-widest mb-1",
                        style: { color: "rgba(239,68,68,0.7)" },
                        children: "Blockers"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs",
                        style: { color: "var(--os-text-secondary)" },
                        children: existing.blockers
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-4 mt-4 space-y-3", children: [
            [
              {
                label: "What did you do yesterday?",
                val: yesterday,
                sv: setYesterday,
                ph: "Completed the auth flow, reviewed PRs...",
                borderColor: "var(--os-border-window)"
              },
              {
                label: "What will you do today?",
                val: todayText,
                sv: setTodayText,
                ph: "Work on the dashboard, write tests...",
                borderColor: "var(--os-border-window)"
              },
              {
                label: "Any blockers?",
                val: blockers,
                sv: setBlockers,
                ph: "None / Waiting on design review...",
                borderColor: "rgba(239,68,68,0.25)"
              }
            ].map(({ label, val, sv, ph, borderColor }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px] font-semibold uppercase tracking-widest block mb-1.5",
                  style: { color: "var(--os-text-muted)" },
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: val,
                  onChange: (e) => sv(e.target.value),
                  rows: 3,
                  placeholder: ph,
                  "data-ocid": "standup.textarea",
                  className: "w-full rounded-lg px-3 py-2 text-xs outline-none resize-none",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: `1px solid ${borderColor}`,
                    color: "var(--os-text-primary)"
                  }
                }
              )
            ] }, label)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleSave,
                  "data-ocid": "standup.submit_button",
                  className: "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                  style: {
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.4)",
                    color: "rgba(99,102,241,1)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                    " Save Standup"
                  ]
                }
              ),
              existing && !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => existing && copyStandup(existing),
                  "data-ocid": "standup.secondary_button",
                  className: "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-border-window)",
                    color: "var(--os-text-secondary)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "w-3.5 h-3.5" }),
                    " Copy"
                  ]
                }
              ),
              isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setIsEditing(false),
                  "data-ocid": "standup.cancel_button",
                  className: "px-4 py-2 rounded-lg text-xs transition-colors",
                  style: {
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-secondary)"
                  },
                  children: "Cancel"
                }
              )
            ] })
          ] }),
          history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-4 mt-6 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[10px] font-semibold uppercase tracking-widest mb-3",
                style: { color: "var(--os-text-muted)" },
                children: "Past Standups"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "standup.list", children: history.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg overflow-hidden",
                style: {
                  background: "var(--os-bg-elevated)",
                  border: "1px solid var(--os-border-subtle)"
                },
                "data-ocid": `standup.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setCollapsed((c) => ({
                        ...c,
                        [entry.date]: !c[entry.date]
                      })),
                      className: "w-full flex items-center justify-between px-3 py-2 text-xs transition-colors",
                      style: { color: "var(--os-text-secondary)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: entry.date }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: (e) => {
                                e.stopPropagation();
                                copyStandup(entry);
                              },
                              className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded",
                              style: {
                                color: "var(--os-text-muted)",
                                background: "var(--os-border-subtle)"
                              },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "w-2.5 h-2.5" })
                            }
                          ),
                          collapsed[entry.date] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ChevronRight,
                            {
                              className: "w-3.5 h-3.5",
                              style: { color: "var(--os-text-muted)" }
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ChevronDown,
                            {
                              className: "w-3.5 h-3.5",
                              style: { color: "var(--os-text-muted)" }
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  !collapsed[entry.date] && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "px-3 pb-3 space-y-2",
                      style: { borderTop: "1px solid var(--os-border-subtle)" },
                      children: [
                        entry.yesterday && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-[9px] uppercase tracking-widest mb-1",
                              style: { color: "var(--os-text-muted)" },
                              children: "Yesterday"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-xs",
                              style: { color: "var(--os-text-secondary)" },
                              children: entry.yesterday
                            }
                          )
                        ] }),
                        entry.today && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-[9px] uppercase tracking-widest mb-1",
                              style: { color: "var(--os-text-muted)" },
                              children: "Today"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-xs",
                              style: { color: "var(--os-text-secondary)" },
                              children: entry.today
                            }
                          )
                        ] }),
                        entry.blockers && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-[9px] uppercase tracking-widest mb-1",
                              style: { color: "rgba(239,68,68,0.6)" },
                              children: "Blockers"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-xs",
                              style: { color: "var(--os-text-secondary)" },
                              children: entry.blockers
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ]
              },
              entry.date
            )) })
          ] }),
          !existing && history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-10 text-center",
              "data-ocid": "standup.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl mb-2", children: "🧑‍💻" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "var(--os-text-muted)" }, children: "Log your first standup above" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  DailyStandup
};
