import { c as createLucideIcon, u as useOS, a as useOSEventBus, r as reactExports, j as jsxRuntimeExports, S as Search, $ as User, X, T as Trash2 } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { C as CalendarPlus } from "./calendar-plus-CBqrzt1Q.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { P as Pen } from "./pen-BIZ54SVC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
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
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
function hashColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
    "#14b8a6"
  ];
  return colors[Math.abs(hash) % colors.length];
}
function getInitials(name) {
  var _a, _b, _c;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (((_a = parts[0]) == null ? void 0 : _a.charAt(0)) ?? "").toUpperCase();
  return ((((_b = parts[0]) == null ? void 0 : _b.charAt(0)) ?? "") + (((_c = parts[parts.length - 1]) == null ? void 0 : _c.charAt(0)) ?? "")).toUpperCase();
}
const GROUPS = ["All", "Home", "Work", "Family", "Other"];
const GROUP_COLORS = {
  All: "#6366f1",
  Home: "#10b981",
  Work: "#3b82f6",
  Family: "#f59e0b",
  Other: "#8b5cf6"
};
function ContactManager() {
  const { openApp } = useOS();
  const { emit } = useOSEventBus();
  const { data: contacts, set: setContacts } = useCanisterKV(
    "decent-contacts",
    []
  );
  const [search, setSearch] = reactExports.useState("");
  const [activeGroup, setActiveGroup] = reactExports.useState("All");
  const [editing, setEditing] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    group: "Other"
  });
  const filtered = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchGroup = activeGroup === "All" || (c.group ?? "Other") === activeGroup;
    return matchSearch && matchGroup;
  });
  const openCreate = () => {
    setForm({ name: "", email: "", phone: "", notes: "", group: "Other" });
    setEditing(null);
    setCreating(true);
  };
  const openEdit = (c) => {
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      notes: c.notes,
      group: c.group ?? "Other"
    });
    setEditing(c);
    setCreating(true);
  };
  const saveContact = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setContacts(
        contacts.map((c) => c.id === editing.id ? { ...c, ...form } : c)
      );
    } else {
      setContacts([...contacts, { id: Date.now().toString(), ...form }]);
    }
    setCreating(false);
    setEditing(null);
  };
  const deleteContact = (id) => setContacts(contacts.filter((c) => c.id !== id));
  const scheduleMeeting = (contact) => {
    emit("open-calendar", {
      title: `Meeting with ${contact.name}`,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    openApp("calendar", "Calendar");
  };
  const sendEmail = (contact) => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full",
      style: {
        background: "var(--os-bg-app)",
        color: "var(--os-text-primary)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-56 flex-shrink-0 flex flex-col border-r",
            style: {
              borderColor: "var(--os-border-subtle)",
              background: "var(--os-bg-sidebar)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "p-3 border-b",
                  style: { borderColor: "var(--os-border-subtle)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Search,
                      {
                        className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5",
                        style: { color: "var(--os-text-muted)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "Search contacts…",
                        value: search,
                        onChange: (e) => setSearch(e.target.value),
                        "data-ocid": "contactmanager.search_input",
                        className: "w-full h-8 pl-8 pr-3 rounded-md text-xs outline-none",
                        style: {
                          background: "var(--os-bg-elevated)",
                          border: "1px solid var(--os-border-subtle)",
                          color: "var(--os-text-primary)"
                        }
                      }
                    )
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex flex-col px-2 py-2 gap-0.5 border-b",
                  style: { borderColor: "var(--os-border-subtle)" },
                  children: GROUPS.map((g) => {
                    const count = g === "All" ? contacts.length : contacts.filter((c) => (c.group ?? "Other") === g).length;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setActiveGroup(g),
                        "data-ocid": "contactmanager.tab",
                        className: "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all text-left",
                        style: {
                          background: activeGroup === g ? `${GROUP_COLORS[g]}22` : "transparent",
                          color: activeGroup === g ? GROUP_COLORS[g] : "var(--os-text-secondary)",
                          fontWeight: activeGroup === g ? 600 : 400
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: g }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-[10px] px-1.5 py-0.5 rounded-full",
                              style: {
                                background: activeGroup === g ? `${GROUP_COLORS[g]}33` : "var(--os-bg-elevated)",
                                color: activeGroup === g ? GROUP_COLORS[g] : "var(--os-text-muted)"
                              },
                              children: count
                            }
                          )
                        ]
                      },
                      g
                    );
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto py-1", children: [
                filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center justify-center h-24 gap-1",
                    "data-ocid": "contactmanager.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        User,
                        {
                          className: "w-6 h-6",
                          style: { color: "var(--os-text-muted)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[11px]",
                          style: { color: "var(--os-text-muted)" },
                          children: "No contacts"
                        }
                      )
                    ]
                  }
                ),
                filtered.map((c, i) => {
                  const color = hashColor(c.name);
                  const initials = getInitials(c.name);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-1 px-2 py-1.5 hover:bg-muted/30 transition-colors group",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => openEdit(c),
                            "data-ocid": `contactmanager.item.${i + 1}`,
                            className: "flex-1 text-left flex items-center gap-2 min-w-0",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  className: "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0",
                                  style: {
                                    background: `${color}28`,
                                    color,
                                    border: `1.5px solid ${color}44`
                                  },
                                  children: initials
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "p",
                                  {
                                    className: "text-xs font-medium truncate",
                                    style: { color: "var(--os-text-primary)" },
                                    children: c.name
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "p",
                                  {
                                    className: "text-[10px] truncate",
                                    style: { color: "var(--os-text-muted)" },
                                    children: c.email || c.phone || (c.group ?? "Other")
                                  }
                                )
                              ] })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0", children: [
                          c.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => sendEmail(c),
                              "data-ocid": `contactmanager.email_button.${i + 1}`,
                              title: `Email ${c.name}`,
                              className: "w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-muted/50",
                              style: { color: "var(--os-text-secondary)" },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => scheduleMeeting(c),
                              "data-ocid": `contactmanager.calendar_button.${i + 1}`,
                              title: `Schedule meeting with ${c.name}`,
                              className: "w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-muted/50",
                              style: { color: "var(--os-text-secondary)" },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ] })
                      ]
                    },
                    c.id
                  );
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "p-3 border-t",
                  style: { borderColor: "var(--os-border-subtle)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: openCreate,
                      "data-ocid": "contactmanager.primary_button",
                      className: "w-full h-8 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all",
                      style: {
                        background: "rgba(59,130,246,0.12)",
                        border: "1px solid rgba(59,130,246,0.3)",
                        color: "rgba(96,165,250,0.9)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                        "New Contact"
                      ]
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col", children: creating ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-5 overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "text-sm font-semibold",
                style: { color: "var(--os-text-primary)" },
                children: editing ? "Edit Contact" : "New Contact"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setCreating(false),
                className: "w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors",
                "data-ocid": "contactmanager.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  X,
                  {
                    className: "w-3.5 h-3.5",
                    style: { color: "var(--os-text-secondary)" }
                  }
                )
              }
            )
          ] }),
          form.name && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold",
              style: {
                background: `${hashColor(form.name)}28`,
                color: hashColor(form.name),
                border: `2px solid ${hashColor(form.name)}44`
              },
              children: getInitials(form.name)
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 max-w-sm", children: [
            ["name", "email", "phone"].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "block text-[11px] mb-1 capitalize",
                  style: { color: "var(--os-text-muted)" },
                  children: field
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: field === "email" ? "email" : "text",
                  value: form[field],
                  onChange: (e) => setForm((prev) => ({ ...prev, [field]: e.target.value })),
                  "data-ocid": "contactmanager.input",
                  className: "w-full h-8 px-3 rounded-md text-xs outline-none",
                  style: {
                    background: "var(--os-bg-elevated)",
                    border: "1px solid var(--os-border-subtle)",
                    color: "var(--os-text-primary)"
                  }
                }
              )
            ] }, field)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "block text-[11px] mb-1",
                  style: { color: "var(--os-text-muted)" },
                  children: "Group"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: ["Home", "Work", "Family", "Other"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setForm((prev) => ({ ...prev, group: g })),
                  className: "px-2.5 h-6 rounded-lg text-[11px] font-medium transition-all",
                  style: {
                    background: form.group === g ? `${GROUP_COLORS[g]}22` : "var(--os-bg-elevated)",
                    border: form.group === g ? `1px solid ${GROUP_COLORS[g]}66` : "1px solid var(--os-border-subtle)",
                    color: form.group === g ? GROUP_COLORS[g] : "var(--os-text-muted)"
                  },
                  children: g
                },
                g
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "block text-[11px] mb-1",
                  style: { color: "var(--os-text-muted)" },
                  children: "Notes"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: form.notes,
                  onChange: (e) => setForm((prev) => ({ ...prev, notes: e.target.value })),
                  rows: 3,
                  "data-ocid": "contactmanager.textarea",
                  className: "w-full px-3 py-2 rounded-md text-xs outline-none resize-none",
                  style: {
                    background: "var(--os-bg-elevated)",
                    border: "1px solid var(--os-border-subtle)",
                    color: "var(--os-text-primary)"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: saveContact,
                  "data-ocid": "contactmanager.save_button",
                  className: "flex-1 h-8 rounded-lg text-xs font-semibold transition-all",
                  style: {
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    color: "rgba(96,165,250,1)"
                  },
                  children: editing ? "Save Changes" : "Create Contact"
                }
              ),
              editing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    deleteContact(editing.id);
                    setCreating(false);
                  },
                  "data-ocid": "contactmanager.delete_button",
                  className: "h-8 px-3 rounded-lg text-xs transition-colors",
                  style: {
                    color: "rgba(248,113,113,0.7)",
                    border: "1px solid rgba(248,113,113,0.2)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-14 h-14 rounded-2xl flex items-center justify-center",
              style: {
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                User,
                {
                  className: "w-7 h-7",
                  style: { color: "rgba(96,165,250,0.6)" }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "var(--os-text-muted)" }, children: "Select a contact or create a new one" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: openCreate,
              "data-ocid": "contactmanager.open_modal_button",
              className: "mt-1 px-4 h-8 rounded-lg text-xs font-semibold transition-all",
              style: {
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "rgba(96,165,250,0.9)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 inline mr-1" }),
                "New Contact"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute bottom-0 left-0 right-0 h-6 border-t flex items-center px-4 gap-4",
            style: {
              borderColor: "var(--os-border-subtle)",
              background: "var(--os-bg-sidebar)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3 h-3", style: { color: "rgba(59,130,246,0.6)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-muted)" },
                    children: [
                      contacts.length,
                      " contacts"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3", style: { color: "rgba(59,130,246,0.4)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-muted)" },
                    children: "Private & on-chain"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Phone,
                  {
                    className: "w-3 h-3",
                    style: { color: "rgba(59,130,246,0.4)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-muted)" },
                    children: [
                      filtered.length,
                      " shown"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Pen,
                  {
                    className: "w-3 h-3",
                    style: { color: "rgba(59,130,246,0.4)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-muted)" },
                    children: "Click to edit"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  ContactManager
};
