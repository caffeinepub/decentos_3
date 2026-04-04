import { r as reactExports, j as jsxRuntimeExports, az as UserCheck, T as Trash2, aA as MessageSquare, X } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const REL_COLORS = {
  Personal: "rgba(39,215,224,0.8)",
  Professional: "rgba(99,179,237,0.85)",
  Partner: "rgba(246,135,179,0.85)",
  Family: "rgba(134,239,172,0.85)"
};
const REL_BG = {
  Personal: "rgba(39,215,224,0.12)",
  Professional: "rgba(99,179,237,0.12)",
  Partner: "rgba(246,135,179,0.12)",
  Family: "rgba(134,239,172,0.12)"
};
function genId() {
  return `crm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
const EMPTY = {
  name: "",
  company: "",
  email: "",
  phone: "",
  relationship: "Personal",
  lastContacted: "",
  followUp: "",
  notes: ""
};
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "block text-[10px] font-semibold mb-0.5",
        style: { color: "rgba(39,215,224,0.6)" },
        children: label
      }
    ),
    children
  ] });
}
const INPUT_STYLE = {
  width: "100%",
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(39,215,224,0.15)",
  borderRadius: 6,
  color: "rgba(220,235,240,0.9)",
  padding: "4px 8px",
  fontSize: 12,
  outline: "none"
};
function PersonalCRM() {
  const { data: contacts, set: setContacts } = useCanisterKV(
    "decent-crm",
    []
  );
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(EMPTY);
  const [logEntry, setLogEntry] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    if (!search) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
    );
  }, [contacts, search]);
  const selected = contacts.find((c) => c.id === selectedId) ?? null;
  const addContact = reactExports.useCallback(() => {
    if (!form.name.trim()) return;
    const contact = { id: genId(), ...form };
    const updated = [contact, ...contacts];
    setContacts(updated);
    setSelectedId(contact.id);
    setShowAdd(false);
    setForm(EMPTY);
  }, [contacts, form, setContacts]);
  const deleteContact = reactExports.useCallback(
    (id) => {
      var _a;
      const updated = contacts.filter((c) => c.id !== id);
      setContacts(updated);
      setSelectedId(((_a = updated[0]) == null ? void 0 : _a.id) ?? null);
    },
    [contacts, setContacts]
  );
  const updateField = reactExports.useCallback(
    (field, value) => {
      if (!selectedId) return;
      const updated = contacts.map(
        (c) => c.id === selectedId ? { ...c, [field]: value } : c
      );
      setContacts(updated);
    },
    [contacts, selectedId, setContacts]
  );
  const logInteraction = reactExports.useCallback(() => {
    if (!selectedId || !logEntry.trim()) return;
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleString();
    const entry = `[${timestamp}] ${logEntry.trim()}`;
    const note = (selected == null ? void 0 : selected.notes) ? `${entry}

${selected.notes}` : entry;
    updateField("notes", note);
    updateField("lastContacted", (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    setLogEntry("");
  }, [selectedId, logEntry, selected, updateField]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: { background: "rgba(11,15,18,0.6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-52 flex-shrink-0 flex flex-col border-r",
        style: {
          borderColor: "rgba(42,58,66,0.8)",
          background: "rgba(10,16,20,0.8)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0",
              style: {
                borderColor: "rgba(42,58,66,0.8)",
                background: "rgba(18,32,38,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground/80", children: "Contacts" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setShowAdd(true);
                      setForm(EMPTY);
                    },
                    "data-ocid": "personalcrm.add_button",
                    className: "flex items-center justify-center w-6 h-6 rounded transition-all hover:bg-muted/50",
                    style: {
                      background: "rgba(39,215,224,0.1)",
                      border: "1px solid rgba(39,215,224,0.3)",
                      color: "rgba(39,215,224,0.9)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-2 py-2 border-b flex-shrink-0",
              style: { borderColor: "rgba(42,58,66,0.4)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search...",
                  "data-ocid": "personalcrm.search_input",
                  className: "w-full px-2 py-1 text-[10px] rounded outline-none",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(39,215,224,0.15)",
                    color: "var(--os-text-primary)"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-full gap-2 p-4",
              "data-ocid": "personalcrm.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UserCheck,
                  {
                    className: "w-8 h-8",
                    style: { color: "rgba(39,215,224,0.2)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 text-center", children: search ? "No matches" : "No contacts yet" })
              ]
            }
          ) : filtered.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSelectedId(c.id),
              "data-ocid": `personalcrm.item.${i + 1}`,
              className: "w-full text-left px-3 py-2.5 border-b group transition-colors",
              style: {
                borderColor: "rgba(42,58,66,0.4)",
                background: selectedId === c.id ? "rgba(39,215,224,0.08)" : "transparent",
                borderLeft: selectedId === c.id ? "2px solid rgba(39,215,224,0.6)" : "2px solid transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-medium truncate",
                      style: {
                        color: selectedId === c.id ? "rgba(39,215,224,0.9)" : "rgba(200,220,230,0.8)"
                      },
                      children: c.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0",
                      style: {
                        background: REL_BG[c.relationship],
                        color: REL_COLORS[c.relationship]
                      },
                      children: c.relationship
                    }
                  )
                ] }),
                c.lastContacted && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5", children: [
                  "Last: ",
                  c.lastContacted
                ] })
              ]
            },
            c.id
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-4 py-3 border-b flex-shrink-0",
          style: {
            borderColor: "rgba(42,58,66,0.6)",
            background: "rgba(18,32,38,0.5)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  style: {
                    background: REL_BG[selected.relationship],
                    color: REL_COLORS[selected.relationship]
                  },
                  children: selected.name.charAt(0).toUpperCase()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: selected.name }),
                selected.company && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60", children: selected.company })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => deleteContact(selected.id),
                "data-ocid": "personalcrm.delete_button",
                className: "text-destructive/50 hover:text-destructive transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            style: INPUT_STYLE,
            value: selected.name,
            onChange: (e) => updateField("name", e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Company", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            style: INPUT_STYLE,
            value: selected.company,
            onChange: (e) => updateField("company", e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            style: INPUT_STYLE,
            type: "email",
            value: selected.email,
            onChange: (e) => updateField("email", e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            style: INPUT_STYLE,
            value: selected.phone,
            onChange: (e) => updateField("phone", e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Relationship", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            style: INPUT_STYLE,
            value: selected.relationship,
            onChange: (e) => updateField("relationship", e.target.value),
            "data-ocid": "personalcrm.select",
            children: [
              "Personal",
              "Professional",
              "Partner",
              "Family"
            ].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last Contacted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            style: INPUT_STYLE,
            type: "date",
            value: selected.lastContacted,
            onChange: (e) => updateField("lastContacted", e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Follow-up Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            style: INPUT_STYLE,
            type: "date",
            value: selected.followUp,
            onChange: (e) => updateField("followUp", e.target.value)
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "block text-[10px] font-semibold mb-1",
            style: { color: "rgba(39,215,224,0.6)" },
            children: "Log Interaction"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              style: { ...INPUT_STYLE, flex: 1 },
              value: logEntry,
              onChange: (e) => setLogEntry(e.target.value),
              placeholder: "What happened? (Enter to log)",
              "data-ocid": "personalcrm.input",
              onKeyDown: (e) => e.key === "Enter" && logInteraction()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: logInteraction,
              "data-ocid": "personalcrm.primary_button",
              className: "flex items-center gap-1 px-3 py-1 rounded text-xs transition-all",
              style: {
                background: "rgba(39,215,224,0.15)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "rgba(39,215,224,0.9)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-3 h-3" }),
                " Log"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "block text-[10px] font-semibold mb-1",
            style: { color: "rgba(39,215,224,0.6)" },
            children: "Conversation Log & Notes"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: selected.notes,
            onChange: (e) => updateField("notes", e.target.value),
            "data-ocid": "personalcrm.editor",
            rows: 6,
            className: "w-full text-xs font-mono resize-none outline-none p-2 rounded leading-relaxed",
            style: {
              background: "var(--os-border-subtle)",
              border: "1px solid rgba(39,215,224,0.15)",
              color: "rgba(200,220,230,0.8)",
              caretColor: "rgba(39,215,224,0.8)"
            }
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center gap-3",
        "data-ocid": "personalcrm.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            UserCheck,
            {
              className: "w-14 h-14",
              style: { color: "rgba(39,215,224,0.15)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground/60", children: "Select a contact or add a new one" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setShowAdd(true);
                setForm(EMPTY);
              },
              "data-ocid": "personalcrm.open_modal_button",
              className: "flex items-center gap-1.5 px-4 h-8 rounded text-xs font-semibold transition-all",
              style: {
                background: "rgba(39,215,224,0.12)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "rgba(39,215,224,1)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                " Add Contact"
              ]
            }
          )
        ]
      }
    ) }),
    showAdd && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 z-50 flex items-center justify-center",
        style: { background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" },
        "data-ocid": "personalcrm.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl w-96 flex flex-col overflow-hidden",
            style: {
              background: "rgba(10,18,26,0.98)",
              border: "1px solid rgba(39,215,224,0.25)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.7)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between px-4 py-3 border-b",
                  style: { borderColor: "rgba(39,215,224,0.15)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-sm font-semibold",
                        style: { color: "var(--os-accent)" },
                        children: "Add Contact"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowAdd(false),
                        className: "text-muted-foreground/60 hover:text-muted-foreground",
                        "data-ocid": "personalcrm.close_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 grid grid-cols-2 gap-3", children: [
                [
                  ["name", "Name *"],
                  ["company", "Company"],
                  ["email", "Email"],
                  ["phone", "Phone"]
                ].map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    style: INPUT_STYLE,
                    value: form[key],
                    onChange: (e) => setForm((p) => ({ ...p, [key]: e.target.value })),
                    "data-ocid": key === "name" ? "personalcrm.input" : void 0
                  }
                ) }, key)),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Relationship", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    style: INPUT_STYLE,
                    value: form.relationship,
                    onChange: (e) => setForm((p) => ({
                      ...p,
                      relationship: e.target.value
                    })),
                    children: [
                      "Personal",
                      "Professional",
                      "Partner",
                      "Family"
                    ].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 flex justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowAdd(false),
                    "data-ocid": "personalcrm.cancel_button",
                    className: "px-4 h-8 rounded text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: addContact,
                    "data-ocid": "personalcrm.submit_button",
                    disabled: !form.name.trim(),
                    className: "px-4 h-8 rounded text-xs font-semibold transition-all disabled:opacity-40",
                    style: {
                      background: "rgba(39,215,224,0.15)",
                      border: "1px solid rgba(39,215,224,0.35)",
                      color: "rgba(39,215,224,1)"
                    },
                    children: "Add Contact"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  PersonalCRM
};
