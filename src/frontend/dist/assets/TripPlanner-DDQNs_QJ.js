import { r as reactExports, j as jsxRuntimeExports, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
const DEFAULT_TRIPS = [
  {
    id: "t1",
    destination: "Tokyo, Japan",
    from: "2026-04-10",
    to: "2026-04-20",
    description: "Cherry blossom season trip — temples, ramen, and culture",
    status: "planning",
    itinerary: [
      {
        id: "i1",
        date: "2026-04-10",
        title: "Arrival",
        description: "Land at Narita, check-in Shinjuku hotel"
      },
      {
        id: "i2",
        date: "2026-04-11",
        title: "Shibuya & Harajuku",
        description: "Explore crossing, Takeshita St, Meiji Shrine"
      }
    ],
    packing: [
      { id: "pk1", label: "Passport", packed: false },
      { id: "pk2", label: "JR Pass", packed: false },
      { id: "pk3", label: "Yen cash", packed: false }
    ],
    budget: [
      { id: "b1", label: "Flights", cost: 1200, category: "Transport" },
      {
        id: "b2",
        label: "Hotel (10 nights)",
        cost: 1500,
        category: "Accommodation"
      }
    ],
    notes: "Get pocket WiFi at airport. Buy IC card for trains."
  }
];
const STATUS_COLORS = {
  planning: "rgba(249,115,22,0.8)",
  confirmed: "rgba(34,197,94,0.8)",
  completed: "rgba(148,163,184,0.8)"
};
const bg = { background: "rgba(9,13,20,0.9)", color: "var(--os-text-primary)" };
const panel = {
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(39,215,224,0.12)",
  borderRadius: 8
};
const inp = {
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(39,215,224,0.15)",
  color: "var(--os-text-primary)",
  borderRadius: 6,
  padding: "6px 10px",
  outline: "none",
  fontSize: 12
};
function genId() {
  return Math.random().toString(36).slice(2, 9);
}
function TripPlanner() {
  var _a;
  const { data: trips, set: setTrips } = useCanisterKV(
    "trips_data",
    DEFAULT_TRIPS
  );
  const [selectedId, setSelectedId] = reactExports.useState(
    ((_a = trips[0]) == null ? void 0 : _a.id) ?? null
  );
  const [tripTab, setTripTab] = reactExports.useState("overview");
  const [showNewTrip, setShowNewTrip] = reactExports.useState(false);
  const [newDest, setNewDest] = reactExports.useState("");
  const [newFrom, setNewFrom] = reactExports.useState("");
  const [newTo, setNewTo] = reactExports.useState("");
  const [newDesc, setNewDesc] = reactExports.useState("");
  const [newDay, setNewDay] = reactExports.useState("");
  const [newDayTitle, setNewDayTitle] = reactExports.useState("");
  const [newDayDesc, setNewDayDesc] = reactExports.useState("");
  const [newPack, setNewPack] = reactExports.useState("");
  const [newBudgetLabel, setNewBudgetLabel] = reactExports.useState("");
  const [newBudgetCost, setNewBudgetCost] = reactExports.useState("");
  const [newBudgetCat, setNewBudgetCat] = reactExports.useState("");
  const trip = trips.find((t) => t.id === selectedId) ?? null;
  const updateTrip = (updated) => setTrips(trips.map((t) => t.id === updated.id ? updated : t));
  const addTrip = () => {
    if (!newDest.trim()) return;
    const t = {
      id: genId(),
      destination: newDest.trim(),
      from: newFrom,
      to: newTo,
      description: newDesc.trim(),
      status: "planning",
      itinerary: [],
      packing: [],
      budget: [],
      notes: ""
    };
    setTrips([...trips, t]);
    setSelectedId(t.id);
    setShowNewTrip(false);
    setNewDest("");
    setNewFrom("");
    setNewTo("");
    setNewDesc("");
  };
  const deleteTrip = (id) => {
    var _a2;
    setTrips(trips.filter((t) => t.id !== id));
    if (selectedId === id)
      setSelectedId(((_a2 = trips.find((t) => t.id !== id)) == null ? void 0 : _a2.id) ?? null);
  };
  const TRIP_TABS = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "packing", label: "Packing" },
    { id: "budget", label: "Budget" },
    { id: "notes", label: "Notes" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: bg, "data-ocid": "tripplanner.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col border-r flex-shrink-0",
        style: {
          width: 200,
          borderColor: "rgba(39,215,224,0.1)",
          background: "rgba(10,15,22,0.8)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0",
              style: { borderColor: "rgba(39,215,224,0.1)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold",
                    style: { color: "rgba(39,215,224,0.8)" },
                    children: "Trips"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowNewTrip(true),
                    "data-ocid": "tripplanner.primary_button",
                    className: "w-6 h-6 rounded flex items-center justify-center transition-all",
                    style: {
                      background: "rgba(39,215,224,0.12)",
                      border: "1px solid rgba(39,215,224,0.3)",
                      color: "rgba(39,215,224,0.9)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: trips.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-full p-4 text-center",
              "data-ocid": "tripplanner.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-2", children: "✈️" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/60", children: "No trips yet" })
              ]
            }
          ) : trips.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "group border-b",
              style: { borderColor: "var(--os-border-subtle)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setSelectedId(t.id);
                    setTripTab("overview");
                  },
                  className: "w-full text-left px-3 py-2.5 transition-all",
                  style: {
                    background: selectedId === t.id ? "rgba(39,215,224,0.07)" : "transparent",
                    borderLeft: selectedId === t.id ? "2px solid rgba(39,215,224,0.6)" : "2px solid transparent"
                  },
                  "data-ocid": "tripplanner.item",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold text-muted-foreground truncate", children: t.destination }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[9px] px-1.5 py-0.5 rounded",
                          style: {
                            background: `${STATUS_COLORS[t.status]}22`,
                            color: STATUS_COLORS[t.status]
                          },
                          children: t.status
                        }
                      ),
                      t.from && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground/50", children: t.from.slice(0, 7) })
                    ] })
                  ]
                }
              )
            },
            t.id
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col min-w-0", children: showNewTrip ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", "data-ocid": "tripplanner.modal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "text-sm font-semibold mb-3",
          style: { color: "rgba(39,215,224,1)" },
          children: "New Trip"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: newDest,
            onChange: (e) => setNewDest(e.target.value),
            placeholder: "Destination",
            style: { ...inp, gridColumn: "span 2" },
            "data-ocid": "tripplanner.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: newFrom,
            onChange: (e) => setNewFrom(e.target.value),
            type: "date",
            style: inp,
            "data-ocid": "tripplanner.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: newTo,
            onChange: (e) => setNewTo(e.target.value),
            type: "date",
            style: inp,
            "data-ocid": "tripplanner.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: newDesc,
            onChange: (e) => setNewDesc(e.target.value),
            placeholder: "Description",
            style: { ...inp, gridColumn: "span 2" },
            "data-ocid": "tripplanner.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: addTrip,
            "data-ocid": "tripplanner.confirm_button",
            className: "px-4 py-1.5 rounded text-xs font-semibold",
            style: {
              background: "rgba(39,215,224,0.15)",
              border: "1px solid rgba(39,215,224,0.4)",
              color: "rgba(39,215,224,1)"
            },
            children: "Create Trip"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowNewTrip(false),
            "data-ocid": "tripplanner.cancel_button",
            className: "px-4 py-1.5 rounded text-xs text-muted-foreground/60",
            children: "Cancel"
          }
        )
      ] })
    ] }) : trip ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-4 py-3 border-b flex-shrink-0",
          style: {
            borderColor: "rgba(39,215,224,0.1)",
            background: "rgba(12,18,26,0.8)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-sm font-bold",
                  style: { color: "rgba(39,215,224,1)" },
                  children: trip.destination
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                trip.from && trip.to && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/60", children: [
                  trip.from,
                  " → ",
                  trip.to
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: trip.status,
                    onChange: (e) => updateTrip({
                      ...trip,
                      status: e.target.value
                    }),
                    "data-ocid": "tripplanner.select",
                    className: "text-[10px] px-1.5 py-0.5 rounded border-0 cursor-pointer outline-none",
                    style: {
                      background: `${STATUS_COLORS[trip.status]}22`,
                      color: STATUS_COLORS[trip.status]
                    },
                    children: ["planning", "confirmed", "completed"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => deleteTrip(trip.id),
                "data-ocid": "tripplanner.delete_button",
                className: "p-1.5 rounded hover:bg-red-500/10 transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-red-500/50" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex border-b flex-shrink-0 overflow-x-auto",
          style: { borderColor: "rgba(39,215,224,0.08)" },
          children: TRIP_TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setTripTab(t.id),
              "data-ocid": "tripplanner.tab",
              className: "px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors",
              style: {
                borderBottom: tripTab === t.id ? "2px solid rgba(39,215,224,0.8)" : "2px solid transparent",
                color: tripTab === t.id ? "rgba(39,215,224,1)" : "var(--os-text-muted)"
              },
              children: t.label
            },
            t.id
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [
        tripTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: panel, className: "p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60 mb-1", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: trip.description,
                onChange: (e) => updateTrip({ ...trip, description: e.target.value }),
                rows: 3,
                placeholder: "What's this trip about?",
                "data-ocid": "tripplanner.textarea",
                className: "w-full bg-transparent outline-none text-sm resize-none",
                style: { color: "var(--os-text-secondary)" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: panel, className: "p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60 mb-1", children: "Duration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-lg font-bold",
                  style: { color: "rgba(39,215,224,1)" },
                  children: trip.from && trip.to ? Math.max(
                    1,
                    Math.round(
                      (new Date(trip.to).getTime() - new Date(trip.from).getTime()) / 864e5
                    )
                  ) : "—"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60", children: "days" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: panel, className: "p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60 mb-1", children: "Budget" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-lg font-bold",
                  style: { color: "rgba(39,215,224,1)" },
                  children: [
                    "$",
                    trip.budget.reduce((s, b) => s + b.cost, 0).toLocaleString()
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60", children: "estimated" })
            ] })
          ] })
        ] }),
        tripTab === "itinerary" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newDay,
                onChange: (e) => setNewDay(e.target.value),
                type: "date",
                style: { ...inp, flex: "0 0 auto" },
                "data-ocid": "tripplanner.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newDayTitle,
                onChange: (e) => setNewDayTitle(e.target.value),
                placeholder: "Day title",
                style: { ...inp, flex: 1 },
                "data-ocid": "tripplanner.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newDayDesc,
                onChange: (e) => setNewDayDesc(e.target.value),
                placeholder: "Details",
                style: { ...inp, flex: 1 },
                "data-ocid": "tripplanner.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (!newDayTitle.trim()) return;
                  updateTrip({
                    ...trip,
                    itinerary: [
                      ...trip.itinerary,
                      {
                        id: genId(),
                        date: newDay,
                        title: newDayTitle.trim(),
                        description: newDayDesc.trim()
                      }
                    ].sort((a, b) => a.date.localeCompare(b.date))
                  });
                  setNewDay("");
                  setNewDayTitle("");
                  setNewDayDesc("");
                },
                "data-ocid": "tripplanner.add_button",
                className: "px-3 py-1 rounded text-xs font-semibold flex-shrink-0",
                style: {
                  background: "rgba(39,215,224,0.15)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "rgba(39,215,224,1)"
                },
                children: "+"
              }
            )
          ] }),
          trip.itinerary.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-sm text-muted-foreground/60",
              "data-ocid": "tripplanner.empty_state",
              children: "No itinerary yet"
            }
          ) : trip.itinerary.map((day, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: panel,
              className: "flex items-start gap-3 p-3",
              "data-ocid": `tripplanner.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex-shrink-0 text-center",
                    style: { minWidth: 48 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60", children: day.date && (/* @__PURE__ */ new Date(
                        `${day.date}T12:00:00`
                      )).toLocaleDateString([], { weekday: "short" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60", children: day.date && (/* @__PURE__ */ new Date(
                        `${day.date}T12:00:00`
                      )).toLocaleDateString([], {
                        month: "short",
                        day: "numeric"
                      }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-muted-foreground", children: day.title }),
                  day.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground/60 mt-0.5", children: day.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => updateTrip({
                      ...trip,
                      itinerary: trip.itinerary.filter(
                        (d) => d.id !== day.id
                      )
                    }),
                    "data-ocid": "tripplanner.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 text-red-500/40" })
                  }
                )
              ]
            },
            day.id
          ))
        ] }),
        tripTab === "packing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newPack,
                onChange: (e) => setNewPack(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && newPack.trim()) {
                    updateTrip({
                      ...trip,
                      packing: [
                        ...trip.packing,
                        {
                          id: genId(),
                          label: newPack.trim(),
                          packed: false
                        }
                      ]
                    });
                    setNewPack("");
                  }
                },
                placeholder: "Add packing item...",
                style: { ...inp, flex: 1 },
                "data-ocid": "tripplanner.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (!newPack.trim()) return;
                  updateTrip({
                    ...trip,
                    packing: [
                      ...trip.packing,
                      {
                        id: genId(),
                        label: newPack.trim(),
                        packed: false
                      }
                    ]
                  });
                  setNewPack("");
                },
                "data-ocid": "tripplanner.add_button",
                className: "px-3 py-1 rounded text-xs font-semibold flex-shrink-0",
                style: {
                  background: "rgba(39,215,224,0.15)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "rgba(39,215,224,1)"
                },
                children: "+"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground/60 mb-1", children: [
            trip.packing.filter((p) => p.packed).length,
            "/",
            trip.packing.length,
            " packed"
          ] }),
          trip.packing.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: { ...panel, opacity: item.packed ? 0.6 : 1 },
              className: "flex items-center gap-3 px-3 py-2",
              "data-ocid": `tripplanner.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: item.packed,
                    onChange: () => updateTrip({
                      ...trip,
                      packing: trip.packing.map(
                        (p) => p.id === item.id ? { ...p, packed: !p.packed } : p
                      )
                    }),
                    "data-ocid": "tripplanner.checkbox",
                    className: "w-4 h-4 cursor-pointer",
                    style: { accentColor: "rgba(39,215,224,1)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "flex-1 text-sm",
                    style: {
                      color: "var(--os-text-secondary)",
                      textDecoration: item.packed ? "line-through" : "none"
                    },
                    children: item.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => updateTrip({
                      ...trip,
                      packing: trip.packing.filter(
                        (p) => p.id !== item.id
                      )
                    }),
                    "data-ocid": "tripplanner.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 text-red-500/40" })
                  }
                )
              ]
            },
            item.id
          )),
          trip.packing.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-sm text-muted-foreground/60",
              "data-ocid": "tripplanner.empty_state",
              children: "Nothing packed yet"
            }
          )
        ] }),
        tripTab === "budget" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newBudgetLabel,
                onChange: (e) => setNewBudgetLabel(e.target.value),
                placeholder: "Item",
                style: { ...inp, flex: 2 },
                "data-ocid": "tripplanner.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newBudgetCat,
                onChange: (e) => setNewBudgetCat(e.target.value),
                placeholder: "Category",
                style: { ...inp, flex: 1 },
                "data-ocid": "tripplanner.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newBudgetCost,
                onChange: (e) => setNewBudgetCost(e.target.value),
                type: "number",
                placeholder: "$",
                style: { ...inp, flex: "0 0 60px", width: 60 },
                "data-ocid": "tripplanner.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (!newBudgetLabel.trim()) return;
                  updateTrip({
                    ...trip,
                    budget: [
                      ...trip.budget,
                      {
                        id: genId(),
                        label: newBudgetLabel.trim(),
                        cost: Number.parseFloat(newBudgetCost) || 0,
                        category: newBudgetCat.trim()
                      }
                    ]
                  });
                  setNewBudgetLabel("");
                  setNewBudgetCost("");
                  setNewBudgetCat("");
                },
                "data-ocid": "tripplanner.add_button",
                className: "px-3 py-1 rounded text-xs font-semibold flex-shrink-0",
                style: {
                  background: "rgba(39,215,224,0.15)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "rgba(39,215,224,1)"
                },
                children: "+"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-2 rounded-lg mb-2",
              style: {
                background: "rgba(39,215,224,0.06)",
                border: "1px solid rgba(39,215,224,0.15)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/60", children: [
                  "Total:",
                  " "
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-sm font-bold",
                    style: { color: "rgba(39,215,224,1)" },
                    children: [
                      "$",
                      trip.budget.reduce((s, b) => s + b.cost, 0).toLocaleString()
                    ]
                  }
                )
              ]
            }
          ),
          trip.budget.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: panel,
              className: "flex items-center gap-3 px-3 py-2",
              "data-ocid": `tripplanner.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: item.label }),
                  item.category && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60", children: item.category })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-sm font-mono font-semibold",
                    style: { color: "rgba(39,215,224,0.9)" },
                    children: [
                      "$",
                      item.cost.toLocaleString()
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => updateTrip({
                      ...trip,
                      budget: trip.budget.filter((b) => b.id !== item.id)
                    }),
                    "data-ocid": "tripplanner.delete_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 text-red-500/40" })
                  }
                )
              ]
            },
            item.id
          )),
          trip.budget.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-sm text-muted-foreground/60",
              "data-ocid": "tripplanner.empty_state",
              children: "No budget items yet"
            }
          )
        ] }),
        tripTab === "notes" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: trip.notes,
            onChange: (e) => updateTrip({ ...trip, notes: e.target.value }),
            placeholder: "Trip notes, reminders, tips...",
            "data-ocid": "tripplanner.textarea",
            className: "w-full h-full min-h-48 bg-transparent outline-none text-sm resize-none",
            style: { color: "var(--os-text-secondary)", lineHeight: 1.7 }
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center gap-3",
        "data-ocid": "tripplanner.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "✈️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground/60", children: "Select or create a trip" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowNewTrip(true),
              "data-ocid": "tripplanner.primary_button",
              className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium",
              style: {
                background: "rgba(39,215,224,0.12)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "rgba(39,215,224,0.9)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                " New Trip"
              ]
            }
          )
        ]
      }
    ) })
  ] });
}
export {
  TripPlanner
};
