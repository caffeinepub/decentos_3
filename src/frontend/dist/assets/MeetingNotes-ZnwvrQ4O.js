import { r as reactExports, j as jsxRuntimeExports, aF as ClipboardList, aG as Calendar, T as Trash2, X } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
function newMeeting() {
  return {
    id: crypto.randomUUID(),
    title: "New Meeting",
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    attendees: "",
    agenda: [{ id: crypto.randomUUID(), text: "" }],
    notes: "",
    actionItems: []
  };
}
function newAction() {
  return {
    id: crypto.randomUUID(),
    text: "",
    assignee: "",
    dueDate: "",
    done: false
  };
}
const inputStyle = {
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(42,58,66,0.7)",
  color: "var(--os-text-primary)",
  borderRadius: 6,
  padding: "5px 10px",
  fontSize: 12,
  outline: "none",
  width: "100%"
};
function MeetingNotes() {
  const { data: meetings, set: setMeetings } = useCanisterKV(
    "decent-meetings",
    []
  );
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const persist = (updated) => {
    setMeetings(updated);
  };
  const createMeeting = () => {
    const m = newMeeting();
    const updated = [m, ...meetings];
    persist(updated);
    setSelectedId(m.id);
  };
  const deleteMeeting = (id) => {
    var _a;
    const updated = meetings.filter((m) => m.id !== id);
    persist(updated);
    if (selectedId === id) setSelectedId(((_a = updated[0]) == null ? void 0 : _a.id) ?? null);
  };
  const updateMeeting = (patch) => {
    const updated = meetings.map(
      (m) => m.id === selectedId ? { ...m, ...patch } : m
    );
    persist(updated);
  };
  const selected = meetings.find((m) => m.id === selectedId) ?? null;
  const sortedMeetings = [...meetings].sort(
    (a, b) => b.date.localeCompare(a.date)
  );
  const updateAgendaItem = (id, val) => {
    if (!selected) return;
    updateMeeting({
      agenda: selected.agenda.map(
        (a) => a.id === id ? { ...a, text: val } : a
      )
    });
  };
  const addAgendaItem = () => {
    if (!selected) return;
    updateMeeting({
      agenda: [...selected.agenda, { id: crypto.randomUUID(), text: "" }]
    });
  };
  const removeAgendaItem = (id) => {
    if (!selected) return;
    updateMeeting({ agenda: selected.agenda.filter((a) => a.id !== id) });
  };
  const addAction = () => {
    if (!selected) return;
    updateMeeting({ actionItems: [...selected.actionItems, newAction()] });
  };
  const updateAction = (id, patch) => {
    if (!selected) return;
    updateMeeting({
      actionItems: selected.actionItems.map(
        (a) => a.id === id ? { ...a, ...patch } : a
      )
    });
  };
  const removeAction = (id) => {
    if (!selected) return;
    updateMeeting({
      actionItems: selected.actionItems.filter((a) => a.id !== id)
    });
  };
  const attendeeTags = (selected == null ? void 0 : selected.attendees) ? selected.attendees.split(",").map((s) => s.trim()).filter(Boolean) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full overflow-hidden",
      style: { background: "rgba(11,15,18,0.7)" },
      "data-ocid": "meetingnotes.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col flex-shrink-0",
            style: {
              width: 200,
              borderRight: "1px solid rgba(42,58,66,0.7)",
              background: "rgba(18,32,38,0.4)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between px-3 py-2.5 flex-shrink-0",
                  style: { borderBottom: "1px solid rgba(42,58,66,0.5)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4 os-cyan-text" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold os-cyan-text", children: "Meetings" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: createMeeting,
                        "data-ocid": "meetingnotes.primary_button",
                        style: {
                          background: "rgba(39,215,224,0.12)",
                          border: "1px solid rgba(39,215,224,0.3)",
                          borderRadius: 6,
                          padding: "3px 8px",
                          color: "rgba(39,215,224,0.9)",
                          fontSize: 10,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                          " New"
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: sortedMeetings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center py-8 gap-2",
                  style: { color: "var(--os-text-muted)" },
                  "data-ocid": "meetingnotes.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-8 h-8" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", children: "No meetings yet" })
                  ]
                }
              ) : sortedMeetings.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedId(m.id),
                  "data-ocid": `meetingnotes.item.${i + 1}`,
                  className: "w-full text-left px-3 py-2.5 transition-colors",
                  style: {
                    background: selectedId === m.id ? "rgba(39,215,224,0.08)" : "transparent",
                    borderLeft: selectedId === m.id ? "2px solid rgba(39,215,224,0.7)" : "2px solid transparent"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs font-medium truncate",
                        style: { color: "var(--os-text-secondary)" },
                        children: m.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[10px] mt-0.5",
                        style: { color: "var(--os-text-muted)" },
                        children: m.date
                      }
                    )
                  ]
                },
                m.id
              )) })
            ]
          }
        ),
        selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                style: { ...inputStyle, fontSize: 14, fontWeight: 600, flex: 1 },
                value: selected.title,
                onChange: (e) => updateMeeting({ title: e.target.value }),
                "data-ocid": "meetingnotes.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => deleteMeeting(selected.id),
                "data-ocid": "meetingnotes.delete_button",
                style: {
                  color: "rgba(239,68,68,0.6)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 6
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "meeting-date",
                  className: "text-[10px] text-muted-foreground uppercase tracking-wider block mb-1",
                  children: "Date"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "meeting-date",
                  type: "date",
                  style: inputStyle,
                  value: selected.date,
                  onChange: (e) => updateMeeting({ date: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "meeting-attendees",
                  className: "text-[10px] text-muted-foreground uppercase tracking-wider block mb-1",
                  children: "Attendees (comma-separated)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "meeting-attendees",
                  style: inputStyle,
                  placeholder: "Alice, Bob, Carol",
                  value: selected.attendees,
                  onChange: (e) => updateMeeting({ attendees: e.target.value })
                }
              )
            ] })
          ] }),
          attendeeTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: attendeeTags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] px-2 py-0.5 rounded-full",
              style: {
                background: "rgba(39,215,224,0.1)",
                border: "1px solid rgba(39,215,224,0.25)",
                color: "rgba(39,215,224,0.8)"
              },
              children: t
            },
            t
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: "rgba(18,32,38,0.6)",
                border: "1px solid rgba(42,58,66,0.6)",
                borderRadius: 10,
                padding: 14
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Agenda" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: addAgendaItem,
                      style: {
                        background: "rgba(39,215,224,0.08)",
                        border: "1px solid rgba(39,215,224,0.2)",
                        borderRadius: 5,
                        padding: "2px 8px",
                        color: "rgba(39,215,224,0.8)",
                        fontSize: 10,
                        cursor: "pointer"
                      },
                      children: "+ Add"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: selected.agenda.map((item, _idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        color: "rgba(39,215,224,0.5)",
                        fontSize: 12,
                        flexShrink: 0
                      },
                      children: "•"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      style: { ...inputStyle, flex: 1 },
                      placeholder: "Agenda item",
                      value: item.text,
                      onChange: (e) => updateAgendaItem(item.id, e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeAgendaItem(item.id),
                      style: {
                        color: "rgba(239,68,68,0.5)",
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                    }
                  )
                ] }, item.id)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: "rgba(18,32,38,0.6)",
                border: "1px solid rgba(42,58,66,0.6)",
                borderRadius: 10,
                padding: 14
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: selected.notes,
                    onChange: (e) => updateMeeting({ notes: e.target.value }),
                    placeholder: "Meeting notes...",
                    "data-ocid": "meetingnotes.textarea",
                    rows: 5,
                    style: {
                      ...inputStyle,
                      resize: "vertical",
                      fontFamily: "inherit",
                      lineHeight: 1.6
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: "rgba(18,32,38,0.6)",
                border: "1px solid rgba(42,58,66,0.6)",
                borderRadius: 10,
                padding: 14
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Action Items" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: addAction,
                      "data-ocid": "meetingnotes.secondary_button",
                      style: {
                        background: "rgba(39,215,224,0.08)",
                        border: "1px solid rgba(39,215,224,0.2)",
                        borderRadius: 5,
                        padding: "2px 8px",
                        color: "rgba(39,215,224,0.8)",
                        fontSize: 10,
                        cursor: "pointer"
                      },
                      children: "+ Add"
                    }
                  )
                ] }),
                selected.actionItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] text-muted-foreground text-center py-3",
                    "data-ocid": "meetingnotes.empty_state",
                    children: "No action items yet"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: selected.actionItems.map((action, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2",
                    "data-ocid": `meetingnotes.row.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: action.done,
                          onChange: (e) => updateAction(action.id, { done: e.target.checked }),
                          "data-ocid": `meetingnotes.checkbox.${i + 1}`,
                          style: {
                            accentColor: "rgba(39,215,224,0.9)",
                            flexShrink: 0
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          style: {
                            ...inputStyle,
                            flex: 2,
                            textDecoration: action.done ? "line-through" : "none",
                            opacity: action.done ? 0.5 : 1
                          },
                          placeholder: "Task...",
                          value: action.text,
                          onChange: (e) => updateAction(action.id, { text: e.target.value })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          style: { ...inputStyle, flex: 1 },
                          placeholder: "Assignee",
                          value: action.assignee,
                          onChange: (e) => updateAction(action.id, { assignee: e.target.value })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "date",
                          style: { ...inputStyle, flex: 1 },
                          value: action.dueDate,
                          onChange: (e) => updateAction(action.id, { dueDate: e.target.value })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => removeAction(action.id),
                          style: {
                            color: "rgba(239,68,68,0.5)",
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                        }
                      )
                    ]
                  },
                  action.id
                )) })
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 flex flex-col items-center justify-center gap-3",
            style: { color: "var(--os-text-muted)" },
            "data-ocid": "meetingnotes.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-12 h-12" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Select a meeting or create a new one" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: createMeeting,
                  "data-ocid": "meetingnotes.open_modal_button",
                  style: {
                    background: "rgba(39,215,224,0.1)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    borderRadius: 8,
                    padding: "8px 16px",
                    color: "rgba(39,215,224,0.85)",
                    fontSize: 12,
                    cursor: "pointer"
                  },
                  children: "New Meeting"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  MeetingNotes
};
