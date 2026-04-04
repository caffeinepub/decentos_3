import { r as reactExports, j as jsxRuntimeExports, T as Trash2, aG as Calendar, ad as Clock, U as Users } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { C as CircleCheck } from "./circle-check-D5a8ZkZt.js";
import { P as Pen } from "./pen-BIZ54SVC.js";
function genId() {
  return `mtg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
const blankForm = {
  title: "",
  attendees: "",
  date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
  time: "09:00",
  duration: 30,
  agenda: ""
};
const inputSt = {
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(39,215,224,0.2)",
  color: "var(--os-text-primary)",
  colorScheme: "dark"
};
const lbl = { color: "var(--os-text-secondary)" };
function MeetingPlanner({ windowProps: _w }) {
  const {
    data: persisted,
    set: save,
    loading
  } = useCanisterKV("meetingplanner_v1", []);
  const [meetings, setMeetings] = reactExports.useState([]);
  const [view, setView] = reactExports.useState("list");
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(blankForm);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const hydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (persisted.length > 0) setMeetings(persisted);
  }, [loading, persisted]);
  const openNew = () => {
    setEditing(null);
    setForm(blankForm);
    setView("form");
  };
  const openEdit = (m) => {
    setEditing(m);
    const { id: _id, completed: _c, ...rest } = m;
    setForm(rest);
    setView("form");
  };
  const saveMeeting = reactExports.useCallback(() => {
    if (!form.title.trim()) return;
    setMeetings((prev) => {
      const updated = editing ? prev.map((m) => m.id === editing.id ? { ...editing, ...form } : m) : [{ id: genId(), completed: false, ...form }, ...prev];
      save(updated);
      return updated;
    });
    setView("list");
    setEditing(null);
  }, [form, editing, save]);
  const deleteMeeting = reactExports.useCallback(
    (id) => {
      setMeetings((prev) => {
        const u = prev.filter((m) => m.id !== id);
        save(u);
        return u;
      });
      if (selectedId === id) setSelectedId(null);
    },
    [save, selectedId]
  );
  const toggleComplete = reactExports.useCallback(
    (id) => {
      setMeetings((prev) => {
        const u = prev.map(
          (m) => m.id === id ? { ...m, completed: !m.completed } : m
        );
        save(u);
        return u;
      });
    },
    [save]
  );
  const sorted = [...meetings].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
  });
  const selected = meetings.find((m) => m.id === selectedId) ?? null;
  const muted = "var(--os-text-secondary)";
  const panel = {
    background: "var(--os-bg-elevated)",
    border: "1px solid rgba(39,215,224,0.15)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: { background: "rgba(8,14,20,0.95)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-56 flex-shrink-0 flex flex-col border-r",
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
                    children: "Meetings"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: openNew,
                    "data-ocid": "meetingplanner.add_button",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-3 text-center",
              "data-ocid": "meetingplanner.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", style: { color: muted }, children: "No meetings yet" })
            }
          ) : sorted.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `meetingplanner.item.${i + 1}`,
              onClick: () => {
                setSelectedId(m.id);
                setView("list");
              },
              className: "w-full text-left px-3 py-2.5 border-b transition-all",
              style: {
                borderColor: "rgba(39,215,224,0.06)",
                background: selectedId === m.id ? "rgba(39,215,224,0.1)" : "transparent",
                opacity: m.completed ? 0.55 : 1
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[11px] font-semibold truncate",
                    style: {
                      color: selectedId === m.id ? "var(--os-text-primary)" : "var(--os-text-secondary)",
                      textDecoration: m.completed ? "line-through" : "none"
                    },
                    children: m.title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] mt-0.5", style: { color: muted }, children: [
                  m.date,
                  " · ",
                  m.time
                ] })
              ]
            },
            m.id
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: view === "form" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-sm font-semibold",
          style: { color: "var(--os-text-primary)" },
          children: editing ? "Edit Meeting" : "New Meeting"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: form.title,
            onChange: (e) => setForm((p) => ({ ...p, title: e.target.value })),
            placeholder: "Meeting title",
            "data-ocid": "meetingplanner.input",
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Attendees (comma-separated)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: form.attendees,
            onChange: (e) => setForm((p) => ({ ...p, attendees: e.target.value })),
            placeholder: "Alice, Bob, Carol",
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: form.date,
              onChange: (e) => setForm((p) => ({ ...p, date: e.target.value })),
              className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
              style: inputSt
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "time",
              value: form.time,
              onChange: (e) => setForm((p) => ({ ...p, time: e.target.value })),
              className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
              style: inputSt
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Duration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: form.duration,
              onChange: (e) => setForm((p) => ({ ...p, duration: Number(e.target.value) })),
              className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
              style: { ...inputSt, background: "rgba(10,16,20,0.9)" },
              children: [15, 30, 45, 60, 90, 120].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v, children: formatDuration(v) }, v))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Agenda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: form.agenda,
            onChange: (e) => setForm((p) => ({ ...p, agenda: e.target.value })),
            placeholder: "Meeting agenda and topics...",
            rows: 4,
            "data-ocid": "meetingplanner.textarea",
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none resize-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: saveMeeting,
            "data-ocid": "meetingplanner.submit_button",
            className: "flex-1 h-8 rounded-lg text-[12px] font-semibold transition-all",
            style: {
              background: "rgba(39,215,224,0.14)",
              border: "1px solid rgba(39,215,224,0.3)",
              color: "var(--os-accent)"
            },
            children: editing ? "Save Changes" : "Schedule Meeting"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setView("list"),
            "data-ocid": "meetingplanner.cancel_button",
            className: "h-8 px-4 rounded-lg text-[12px] transition-all",
            style: {
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
              color: muted
            },
            children: "Cancel"
          }
        )
      ] })
    ] }) : selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "text-base font-semibold flex-1 min-w-0",
            style: {
              color: "var(--os-text-primary)",
              textDecoration: selected.completed ? "line-through" : "none"
            },
            children: selected.title
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-3 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => toggleComplete(selected.id),
              "data-ocid": "meetingplanner.toggle",
              className: "flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-[11px] font-semibold transition-all",
              style: {
                background: selected.completed ? "rgba(34,197,94,0.12)" : "var(--os-border-subtle)",
                border: selected.completed ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--os-text-muted)",
                color: selected.completed ? "#22c55e" : muted
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                selected.completed ? "Completed" : "Mark Done"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => openEdit(selected),
              "data-ocid": "meetingplanner.edit_button",
              className: "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
              style: {
                background: "rgba(39,215,224,0.08)",
                border: "1px solid rgba(39,215,224,0.2)",
                color: "var(--os-accent)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3 h-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => deleteMeeting(selected.id),
              "data-ocid": "meetingplanner.delete_button",
              className: "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
              style: {
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
                color: "rgba(239,68,68,0.6)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 flex-1 rounded-xl p-3",
              style: panel,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Calendar,
                  {
                    className: "w-4 h-4 flex-shrink-0",
                    style: { color: "rgba(39,215,224,0.6)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", style: { color: muted }, children: "Date & Time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-[12px] font-semibold",
                      style: { color: "var(--os-text-primary)" },
                      children: [
                        selected.date,
                        " at ",
                        selected.time
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 flex-1 rounded-xl p-3",
              style: panel,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Clock,
                  {
                    className: "w-4 h-4 flex-shrink-0",
                    style: { color: "rgba(39,215,224,0.6)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", style: { color: muted }, children: "Duration" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[12px] font-semibold",
                      style: { color: "var(--os-text-primary)" },
                      children: formatDuration(selected.duration)
                    }
                  )
                ] })
              ]
            }
          )
        ] }),
        selected.attendees && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl p-3", style: panel, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Users,
              {
                className: "w-3.5 h-3.5",
                style: { color: "rgba(39,215,224,0.6)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[11px] font-semibold",
                style: { color: "rgba(39,215,224,0.8)" },
                children: "Attendees"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: selected.attendees.split(",").map((a) => a.trim()).filter(Boolean).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[11px] px-2 py-0.5 rounded-full",
              style: {
                background: "rgba(39,215,224,0.1)",
                color: "rgba(39,215,224,0.9)",
                border: "1px solid rgba(39,215,224,0.2)"
              },
              children: a
            },
            a
          )) })
        ] }),
        selected.agenda && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl p-3", style: panel, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-[11px] font-semibold mb-2",
              style: { color: "rgba(39,215,224,0.8)" },
              children: "Agenda"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-[12px] leading-relaxed whitespace-pre-wrap",
              style: { color: "var(--os-text-primary)" },
              children: selected.agenda
            }
          )
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center gap-3",
        "data-ocid": "meetingplanner.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Calendar,
            {
              className: "w-12 h-12",
              style: { color: "rgba(39,215,224,0.15)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: muted }, children: "Select a meeting or schedule a new one" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: openNew,
              className: "px-4 h-8 rounded-lg text-[12px] font-semibold transition-all",
              style: {
                background: "rgba(39,215,224,0.12)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "var(--os-accent)"
              },
              children: "+ Schedule Meeting"
            }
          )
        ]
      }
    ) })
  ] });
}
export {
  MeetingPlanner
};
