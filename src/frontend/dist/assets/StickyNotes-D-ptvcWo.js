import { r as reactExports, j as jsxRuntimeExports, X, T as Trash2 } from "./index-CZGIn5x2.js";
import { a as Dialog, b as DialogContent } from "./dialog-BCz03eSL.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { T as Textarea } from "./textarea-Bhc13Xgf.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import "./index-DxR-hlVQ.js";
import "./utils-C29Fbx4G.js";
import "./index-DfmnWLAm.js";
import "./index-uZuUQcbU.js";
import "./index-CY_eMQHg.js";
import "./index-B9-lQkRo.js";
import "./index-C4X58sdz.js";
import "./index-YwGfiBwk.js";
const NOTE_COLORS = [
  {
    name: "Yellow",
    bg: "rgba(234,179,8,0.18)",
    border: "rgba(234,179,8,0.35)",
    text: "rgba(253,224,71,0.9)"
  },
  {
    name: "Cyan",
    bg: "rgba(39,215,224,0.12)",
    border: "rgba(39,215,224,0.35)",
    text: "rgba(39,215,224,0.9)"
  },
  {
    name: "Pink",
    bg: "rgba(236,72,153,0.15)",
    border: "rgba(236,72,153,0.35)",
    text: "rgba(249,168,212,0.9)"
  },
  {
    name: "Green",
    bg: "rgba(34,197,94,0.13)",
    border: "rgba(34,197,94,0.35)",
    text: "rgba(74,222,128,0.9)"
  },
  {
    name: "Orange",
    bg: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.35)",
    text: "rgba(253,186,116,0.9)"
  },
  {
    name: "Purple",
    bg: "rgba(168,85,247,0.15)",
    border: "rgba(168,85,247,0.35)",
    text: "rgba(216,180,254,0.9)"
  }
];
const DEFAULT_NOTES = [
  {
    id: "sn1",
    title: "ICP Ideas",
    body: "Explore inter-canister communication for real-time features\n\nLook into cycles management best practices",
    color: "Cyan",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "sn2",
    title: "Today's Focus",
    body: "Ship the new app components\nReview PR feedback\nWrite docs",
    color: "Yellow",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "sn3",
    title: "Read Later",
    body: "ICP developer docs on certified queries\nMotoko base library reference",
    color: "Purple",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "sn4",
    title: "App Ideas",
    body: "Voice memo recorder (on-chain)\nDecentralized bookmark sync\nP2P file sharing via ICP",
    color: "Green",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
function StickyNotes() {
  const { data: notes, set: setNotes } = useCanisterKV(
    "decentos_sticky_notes",
    DEFAULT_NOTES
  );
  const [expandedNote, setExpandedNote] = reactExports.useState(null);
  const [editTitle, setEditTitle] = reactExports.useState("");
  const [editBody, setEditBody] = reactExports.useState("");
  const [editColor, setEditColor] = reactExports.useState("Yellow");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [newTitle, setNewTitle] = reactExports.useState("");
  const [newBody, setNewBody] = reactExports.useState("");
  const [newColor, setNewColor] = reactExports.useState("Yellow");
  const openNote = (note) => {
    setExpandedNote(note);
    setEditTitle(note.title);
    setEditBody(note.body);
    setEditColor(note.color);
  };
  const saveExpanded = () => {
    if (!expandedNote) return;
    setNotes(
      notes.map(
        (n) => n.id === expandedNote.id ? { ...n, title: editTitle, body: editBody, color: editColor } : n
      )
    );
    setExpandedNote(null);
  };
  const deleteNote = (id, e) => {
    e == null ? void 0 : e.stopPropagation();
    setNotes(notes.filter((n) => n.id !== id));
    if ((expandedNote == null ? void 0 : expandedNote.id) === id) setExpandedNote(null);
  };
  const addNote = () => {
    if (!newTitle.trim() && !newBody.trim()) return;
    setNotes([
      ...notes,
      {
        id: `sn${Date.now()}`,
        title: newTitle || "New Note",
        body: newBody,
        color: newColor,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ]);
    setNewTitle("");
    setNewBody("");
    setNewColor("Yellow");
    setShowAdd(false);
  };
  const getColorStyle = (colorName) => NOTE_COLORS.find((c) => c.name === colorName) ?? NOTE_COLORS[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--os-bg-app)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-2.5",
            style: { borderBottom: "1px solid var(--os-border-subtle)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-sm font-medium",
                  style: { color: "var(--os-text-primary)" },
                  children: "Sticky Notes"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAdd(true),
                  "data-ocid": "stickynotes.add.button",
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  style: {
                    background: "rgba(39,215,224,0.1)",
                    border: "1px solid rgba(39,215,224,0.25)",
                    color: "rgba(39,215,224,0.9)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    " New Note"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
            notes.map((note, i) => {
              const cs = getColorStyle(note.color);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => openNote(note),
                  "data-ocid": `stickynotes.item.${i + 1}`,
                  className: "relative flex flex-col gap-2 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] text-left w-full",
                  style: {
                    background: cs.bg,
                    border: `1px solid ${cs.border}`,
                    minHeight: 120
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => deleteNote(note.id, e),
                        "data-ocid": `stickynotes.delete_button.${i + 1}`,
                        className: "absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded opacity-0 hover:opacity-100 transition-opacity",
                        style: {
                          background: "rgba(0,0,0,0.3)",
                          color: "var(--os-text-secondary)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                      }
                    ),
                    note.title && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        className: "text-xs font-bold pr-5 truncate",
                        style: { color: cs.text },
                        children: note.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs leading-relaxed line-clamp-5",
                        style: { color: "var(--os-text-primary)" },
                        children: note.body
                      }
                    )
                  ]
                },
                note.id
              );
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowAdd(true),
                "data-ocid": "stickynotes.new_tile.button",
                className: "flex flex-col items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02]",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px dashed var(--os-text-muted)",
                  minHeight: 120
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Plus,
                    {
                      className: "w-6 h-6",
                      style: { color: "var(--os-text-muted)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: "var(--os-text-muted)" }, children: "New note" })
                ]
              }
            )
          ] }),
          notes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-12",
              "data-ocid": "stickynotes.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "var(--os-text-muted)" }, children: "No notes yet. Create one!" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: !!expandedNote,
            onOpenChange: (o) => {
              if (!o) saveExpanded();
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DialogContent,
              {
                className: "max-w-md",
                style: {
                  background: expandedNote ? getColorStyle(expandedNote.color).bg : "rgba(10,18,24,0.97)",
                  border: `1px solid ${expandedNote ? getColorStyle(expandedNote.color).border : "var(--os-text-muted)"}`,
                  backdropFilter: "blur(20px)"
                },
                "data-ocid": "stickynotes.edit.dialog",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: editTitle,
                        onChange: (e) => setEditTitle(e.target.value),
                        placeholder: "Note title...",
                        "data-ocid": "stickynotes.title.input",
                        className: "flex-1 bg-transparent border-0 border-b rounded-none text-base font-bold px-0 focus-visible:ring-0",
                        style: {
                          borderColor: expandedNote ? getColorStyle(expandedNote.color).border : "var(--os-text-muted)",
                          color: expandedNote ? getColorStyle(expandedNote.color).text : "var(--os-text-primary)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => expandedNote && deleteNote(expandedNote.id),
                        "data-ocid": "stickynotes.modal.delete_button",
                        className: "text-muted-foreground hover:text-red-400 transition-colors",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      value: editBody,
                      onChange: (e) => setEditBody(e.target.value),
                      "data-ocid": "stickynotes.body.textarea",
                      placeholder: "Write your note...",
                      rows: 8,
                      className: "bg-transparent border-0 resize-none focus-visible:ring-0 text-sm p-0",
                      style: { color: "var(--os-text-secondary)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs",
                        style: { color: "var(--os-text-secondary)" },
                        children: "Color:"
                      }
                    ),
                    NOTE_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditColor(c.name),
                        "data-ocid": "stickynotes.color.toggle",
                        className: "w-5 h-5 rounded-full transition-transform",
                        style: {
                          background: c.bg,
                          border: `2px solid ${editColor === c.name ? c.text : c.border}`,
                          transform: editColor === c.name ? "scale(1.3)" : "scale(1)"
                        },
                        title: c.name
                      },
                      c.name
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: saveExpanded,
                        "data-ocid": "stickynotes.save.button",
                        className: "ml-auto text-xs px-3 py-1.5 rounded-lg transition-all",
                        style: {
                          background: "rgba(39,215,224,0.15)",
                          color: "rgba(39,215,224,0.9)",
                          border: "1px solid rgba(39,215,224,0.3)"
                        },
                        children: "Save"
                      }
                    )
                  ] })
                ] })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DialogContent,
          {
            className: "max-w-sm",
            style: {
              background: "rgba(10,18,24,0.97)",
              border: "1px solid rgba(39,215,224,0.2)"
            },
            "data-ocid": "stickynotes.add.dialog",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "text-base font-semibold",
                  style: { color: "rgba(39,215,224,0.9)" },
                  children: "New Sticky Note"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: newTitle,
                  onChange: (e) => setNewTitle(e.target.value),
                  placeholder: "Title (optional)",
                  "data-ocid": "stickynotes.new_title.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: newBody,
                  onChange: (e) => setNewBody(e.target.value),
                  placeholder: "What's on your mind?",
                  rows: 5,
                  "data-ocid": "stickynotes.new_body.textarea"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs",
                    style: { color: "var(--os-text-secondary)" },
                    children: "Color:"
                  }
                ),
                NOTE_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setNewColor(c.name),
                    className: "w-5 h-5 rounded-full transition-transform",
                    style: {
                      background: c.bg,
                      border: `2px solid ${newColor === c.name ? c.text : c.border}`,
                      transform: newColor === c.name ? "scale(1.3)" : "scale(1)"
                    },
                    title: c.name
                  },
                  c.name
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowAdd(false),
                    "data-ocid": "stickynotes.add.cancel_button",
                    className: "text-xs px-3 py-1.5 rounded text-muted-foreground hover:text-foreground",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: addNote,
                    "data-ocid": "stickynotes.add.confirm_button",
                    className: "text-xs px-4 py-1.5 rounded-lg",
                    style: {
                      background: "rgba(39,215,224,0.15)",
                      color: "rgba(39,215,224,0.9)",
                      border: "1px solid rgba(39,215,224,0.3)"
                    },
                    children: "Add Note"
                  }
                )
              ] })
            ] })
          }
        ) })
      ]
    }
  );
}
export {
  StickyNotes
};
