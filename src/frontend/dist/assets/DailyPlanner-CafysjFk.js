import { r as reactExports, j as jsxRuntimeExports, e as ChevronLeft, f as ChevronRight, T as Trash2, g as ue } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { R as Repeat } from "./repeat-D_VPTtMG.js";
const ACCENT = "rgba(6,182,212,";
const HOUR_H = 60;
const TIMELINE_START = 6;
const TIMELINE_END = 23;
const HOURS = Array.from(
  { length: TIMELINE_END - TIMELINE_START + 1 },
  (_, i) => TIMELINE_START + i
);
const EVENT_COLORS = [
  "rgba(6,182,212,",
  "rgba(99,102,241,",
  "rgba(245,158,11,",
  "rgba(34,197,94,",
  "rgba(239,68,68,"
];
const COLOR_LABELS = ["Teal", "Indigo", "Amber", "Green", "Red"];
function toDateKey(d) {
  return d.toISOString().slice(0, 10);
}
function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function eventTop(e) {
  return (e.startHour - TIMELINE_START + e.startMin / 60) * HOUR_H;
}
function eventHeight(e) {
  const startTotal = e.startHour * 60 + e.startMin;
  const endTotal = e.endHour * 60 + e.endMin;
  return Math.max(24, (endTotal - startTotal) / 60 * HOUR_H);
}
const TODAY = toDateKey(/* @__PURE__ */ new Date());
const SAMPLE_EVENTS = [
  {
    id: 1,
    date: TODAY,
    title: "Morning Stand-up",
    startHour: 9,
    startMin: 0,
    endHour: 9,
    endMin: 30,
    colorIdx: 0,
    recurring: true
  },
  {
    id: 2,
    date: TODAY,
    title: "Deep Work: Canister Dev",
    startHour: 10,
    startMin: 0,
    endHour: 12,
    endMin: 0,
    colorIdx: 1
  },
  {
    id: 3,
    date: TODAY,
    title: "Lunch & Reading",
    startHour: 13,
    startMin: 0,
    endHour: 14,
    endMin: 0,
    colorIdx: 3
  }
];
const EMPTY_FORM = {
  title: "",
  startHour: 9,
  startMin: 0,
  endHour: 10,
  endMin: 0,
  colorIdx: 0,
  recurring: false
};
function DailyPlanner() {
  const { data: events, set: saveEvents } = useCanisterKV(
    "decentos_daily_planner",
    SAMPLE_EVENTS
  );
  const [currentDate, setCurrentDate] = reactExports.useState(/* @__PURE__ */ new Date());
  const [showForm, setShowForm] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [hoveredId, setHoveredId] = reactExports.useState(null);
  const [now, setNow] = reactExports.useState(/* @__PURE__ */ new Date());
  const timelineRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(t);
  }, []);
  reactExports.useEffect(() => {
    if (toDateKey(currentDate) === TODAY && timelineRef.current) {
      const scrollTo = Math.max(
        0,
        (now.getHours() - TIMELINE_START - 1) * HOUR_H
      );
      timelineRef.current.scrollTop = scrollTo;
    }
  }, [currentDate, now]);
  const dateKey = toDateKey(currentDate);
  const dayEvents = events.filter(
    (e) => e.date === dateKey || e.recurring && e.date !== dateKey
  );
  const isToday = dateKey === TODAY;
  const nowTop = isToday ? (now.getHours() - TIMELINE_START + now.getMinutes() / 60) * HOUR_H : null;
  const prevDay = () => setCurrentDate((d) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() - 1);
    return nd;
  });
  const nextDay = () => setCurrentDate((d) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + 1);
    return nd;
  });
  const goToday = () => setCurrentDate(/* @__PURE__ */ new Date());
  const handleHourClick = (hour) => {
    setForm({
      ...EMPTY_FORM,
      startHour: hour,
      endHour: Math.min(TIMELINE_END, hour + 1)
    });
    setShowForm(true);
  };
  const handleSave = () => {
    if (!form.title.trim()) return;
    const ev = { id: Date.now(), date: dateKey, ...form };
    const updated = [...events, ev];
    saveEvents(updated);
    setShowForm(false);
    setForm(EMPTY_FORM);
    ue.success("Saved to chain ✓");
  };
  const handleDelete = (id) => {
    saveEvents(events.filter((e) => e.id !== id));
  };
  const pad = (n) => String(n).padStart(2, "0");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "rgba(11,15,18,0.6)",
        color: "rgba(220,235,240,0.9)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              borderBottom: "1px solid rgba(42,58,66,0.8)",
              flexShrink: 0,
              background: "rgba(10,16,20,0.6)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: prevDay,
                  "data-ocid": "planner.pagination_prev",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(42,58,66,0.6)",
                    borderRadius: 6,
                    padding: "4px 8px",
                    color: "rgba(220,235,240,0.7)",
                    cursor: "pointer"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 700 }, children: formatDate(currentDate) }),
                isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: `${ACCENT}0.8)` }, children: "Today" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: nextDay,
                  "data-ocid": "planner.pagination_next",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(42,58,66,0.6)",
                    borderRadius: 6,
                    padding: "4px 8px",
                    color: "rgba(220,235,240,0.7)",
                    cursor: "pointer"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: goToday,
                  "data-ocid": "planner.secondary_button",
                  style: {
                    fontSize: 11,
                    padding: "4px 12px",
                    borderRadius: 6,
                    background: `${ACCENT}0.1)`,
                    border: `1px solid ${ACCENT}0.3)`,
                    color: `${ACCENT}0.9)`,
                    cursor: "pointer"
                  },
                  children: "Today"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setForm(EMPTY_FORM);
                    setShowForm(true);
                  },
                  "data-ocid": "planner.primary_button",
                  style: {
                    fontSize: 11,
                    padding: "4px 12px",
                    borderRadius: 6,
                    background: `${ACCENT}0.15)`,
                    border: `1px solid ${ACCENT}0.5)`,
                    color: `${ACCENT}1)`,
                    cursor: "pointer"
                  },
                  children: "+ Event"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: timelineRef,
            style: { flex: 1, overflowY: "auto", position: "relative" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", minHeight: HOURS.length * HOUR_H }, children: [
              HOURS.map((hour) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleHourClick(hour),
                  "data-ocid": "planner.canvas_target",
                  style: {
                    position: "absolute",
                    top: (hour - TIMELINE_START) * HOUR_H,
                    left: 0,
                    right: 0,
                    height: HOUR_H,
                    display: "flex",
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(42,58,66,0.3)",
                    padding: 0,
                    textAlign: "left"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        fontSize: 10,
                        color: "rgba(180,200,210,0.3)",
                        padding: "4px 8px",
                        userSelect: "none",
                        pointerEvents: "none"
                      },
                      children: hour === 12 ? "12pm" : hour > 12 ? `${hour - 12}pm` : `${hour}am`
                    }
                  )
                },
                hour
              )),
              nowTop !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: 44,
                    right: 0,
                    top: nowTop,
                    height: 2,
                    background: `${ACCENT}0.8)`,
                    zIndex: 10,
                    pointerEvents: "none"
                  }
                }
              ),
              dayEvents.map((ev) => {
                const color = EVENT_COLORS[ev.colorIdx] ?? EVENT_COLORS[0];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    onMouseEnter: () => setHoveredId(ev.id),
                    onMouseLeave: () => setHoveredId(null),
                    style: {
                      position: "absolute",
                      left: 48,
                      right: 8,
                      top: eventTop(ev),
                      height: eventHeight(ev),
                      background: `${color}0.15)`,
                      border: `1px solid ${color}0.5)`,
                      borderRadius: 6,
                      padding: "4px 8px",
                      zIndex: 5,
                      overflow: "hidden"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            fontSize: 12,
                            fontWeight: 600,
                            color: `${color}1)`,
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                          },
                          children: [
                            ev.recurring && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Repeat,
                              {
                                style: {
                                  width: 10,
                                  height: 10,
                                  flexShrink: 0,
                                  opacity: 0.7
                                }
                              }
                            ),
                            ev.title
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            fontSize: 10,
                            color: "rgba(180,200,210,0.5)",
                            marginTop: 2
                          },
                          children: [
                            pad(ev.startHour),
                            ":",
                            pad(ev.startMin),
                            " – ",
                            pad(ev.endHour),
                            ":",
                            pad(ev.endMin)
                          ]
                        }
                      ),
                      hoveredId === ev.id && !ev.recurring && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            handleDelete(ev.id);
                          },
                          style: {
                            position: "absolute",
                            top: 4,
                            right: 4,
                            background: "rgba(239,68,68,0.2)",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            padding: 2,
                            color: "rgba(239,68,68,0.9)"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { style: { width: 12, height: 12 } })
                        }
                      )
                    ]
                  },
                  `${ev.id}-${dateKey}`
                );
              })
            ] })
          }
        ),
        showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50
            },
            "data-ocid": "planner.modal",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "rgba(14,20,26,0.98)",
                  border: `1px solid ${ACCENT}0.3)`,
                  borderRadius: 12,
                  padding: 24,
                  width: 340
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: 14, fontWeight: 700, marginBottom: 16 }, children: "Add Event" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "planner-title",
                        style: {
                          fontSize: 11,
                          color: "rgba(180,200,210,0.5)",
                          display: "block",
                          marginBottom: 4
                        },
                        children: "Title"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "planner-title",
                        value: form.title,
                        onChange: (e) => setForm({ ...form, title: e.target.value }),
                        "data-ocid": "planner.input",
                        style: {
                          width: "100%",
                          background: "var(--os-border-subtle)",
                          border: "1px solid rgba(42,58,66,0.8)",
                          borderRadius: 6,
                          padding: "7px 10px",
                          fontSize: 13,
                          color: "rgba(220,235,240,0.9)",
                          outline: "none",
                          boxSizing: "border-box"
                        }
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                        marginBottom: 12
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              htmlFor: "planner-start",
                              style: {
                                fontSize: 11,
                                color: "rgba(180,200,210,0.5)",
                                display: "block",
                                marginBottom: 4
                              },
                              children: "Start"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "select",
                            {
                              id: "planner-start",
                              value: `${form.startHour}:${form.startMin}`,
                              onChange: (e) => {
                                const [h, m] = e.target.value.split(":").map(Number);
                                setForm({ ...form, startHour: h, startMin: m });
                              },
                              style: {
                                width: "100%",
                                background: "rgba(20,30,36,0.9)",
                                border: "1px solid rgba(42,58,66,0.8)",
                                borderRadius: 6,
                                padding: "6px 8px",
                                fontSize: 12,
                                color: "rgba(220,235,240,0.9)",
                                outline: "none"
                              },
                              children: HOURS.flatMap(
                                (h) => [0, 15, 30, 45].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: `${h}:${m}`, children: [
                                  pad(h),
                                  ":",
                                  pad(m)
                                ] }, `${h}:${m}`))
                              )
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              htmlFor: "planner-end",
                              style: {
                                fontSize: 11,
                                color: "rgba(180,200,210,0.5)",
                                display: "block",
                                marginBottom: 4
                              },
                              children: "End"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "select",
                            {
                              id: "planner-end",
                              value: `${form.endHour}:${form.endMin}`,
                              onChange: (e) => {
                                const [h, m] = e.target.value.split(":").map(Number);
                                setForm({ ...form, endHour: h, endMin: m });
                              },
                              style: {
                                width: "100%",
                                background: "rgba(20,30,36,0.9)",
                                border: "1px solid rgba(42,58,66,0.8)",
                                borderRadius: 6,
                                padding: "6px 8px",
                                fontSize: 12,
                                color: "rgba(220,235,240,0.9)",
                                outline: "none"
                              },
                              children: HOURS.flatMap(
                                (h) => [0, 15, 30, 45].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: `${h}:${m}`, children: [
                                  pad(h),
                                  ":",
                                  pad(m)
                                ] }, `${h}:${m}`))
                              )
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: 11,
                          color: "rgba(180,200,210,0.5)",
                          marginBottom: 6
                        },
                        children: "Color"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6 }, children: EVENT_COLORS.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        title: COLOR_LABELS[i],
                        onClick: () => setForm({ ...form, colorIdx: i }),
                        style: {
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: `${c}0.8)`,
                          border: form.colorIdx === i ? "2px solid white" : "2px solid transparent",
                          cursor: "pointer"
                        }
                      },
                      c
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 16
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": "planner.toggle",
                            onClick: () => setForm({ ...form, recurring: !form.recurring }),
                            style: {
                              width: 36,
                              height: 20,
                              borderRadius: 10,
                              background: form.recurring ? `${ACCENT}0.8)` : "var(--os-text-muted)",
                              border: "none",
                              cursor: "pointer",
                              position: "relative",
                              transition: "background 0.2s"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  position: "absolute",
                                  top: 2,
                                  left: form.recurring ? 18 : 2,
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  background: "var(--os-text-primary)",
                                  transition: "left 0.2s"
                                }
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 12, color: "rgba(180,200,210,0.7)" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Repeat,
                            {
                              style: {
                                width: 12,
                                height: 12,
                                display: "inline",
                                marginRight: 4
                              }
                            }
                          ),
                          "Repeat daily"
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleSave,
                        "data-ocid": "planner.save_button",
                        style: {
                          flex: 1,
                          padding: "8px",
                          borderRadius: 6,
                          background: `${ACCENT}0.15)`,
                          border: `1px solid ${ACCENT}0.5)`,
                          color: `${ACCENT}1)`,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer"
                        },
                        children: "Save Event"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowForm(false),
                        "data-ocid": "planner.cancel_button",
                        style: {
                          flex: 1,
                          padding: "8px",
                          borderRadius: 6,
                          border: "1px solid rgba(42,58,66,0.6)",
                          background: "transparent",
                          color: "rgba(180,200,210,0.6)",
                          fontSize: 12,
                          cursor: "pointer"
                        },
                        children: "Cancel"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  DailyPlanner
};
