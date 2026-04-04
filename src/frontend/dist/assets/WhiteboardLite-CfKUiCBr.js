import { r as reactExports, j as jsxRuntimeExports, T as Trash2 } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const NOTE_COLORS = {
  yellow: {
    bg: "rgba(250,204,21,0.14)",
    border: "rgba(250,204,21,0.4)",
    text: "#fbbf24"
  },
  cyan: {
    bg: "rgba(39,215,224,0.12)",
    border: "rgba(39,215,224,0.4)",
    text: "#27D7E0"
  },
  pink: {
    bg: "rgba(244,63,94,0.12)",
    border: "rgba(244,63,94,0.4)",
    text: "#f87171"
  },
  green: {
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.4)",
    text: "#4ade80"
  },
  purple: {
    bg: "rgba(168,85,247,0.14)",
    border: "rgba(168,85,247,0.4)",
    text: "#c084fc"
  }
};
const COLORS = ["yellow", "cyan", "pink", "green", "purple"];
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function WhiteboardLite() {
  const { data, set, loading } = useCanisterKV(
    "decentos_whiteboard_notes",
    []
  );
  const [notes, setNotes] = reactExports.useState([]);
  const [editingId, setEditingId] = reactExports.useState(null);
  const initialized = reactExports.useRef(false);
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!loading && !initialized.current) {
      initialized.current = true;
      setNotes(Array.isArray(data) ? data : []);
    }
  }, [loading, data]);
  const save = (next) => {
    setNotes(next);
    set(next);
  };
  const addNote = () => {
    const canvas = canvasRef.current;
    const rect = canvas == null ? void 0 : canvas.getBoundingClientRect();
    const x = rect ? Math.random() * Math.max(0, rect.width - 200) : 60;
    const y = rect ? Math.random() * Math.max(0, rect.height - 160) : 60;
    const note = {
      id: uid(),
      text: "",
      x,
      y,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    const next = [...notes, note];
    save(next);
    setEditingId(note.id);
  };
  const deleteNote = (id) => {
    save(notes.filter((n) => n.id !== id));
    if (editingId === id) setEditingId(null);
  };
  const updateText = (id, text) => {
    save(notes.map((n) => n.id === id ? { ...n, text } : n));
  };
  const setColor = (id, color) => {
    save(notes.map((n) => n.id === id ? { ...n, color } : n));
  };
  const startDrag = (noteId, e) => {
    if (e.target.closest("textarea, button")) return;
    e.preventDefault();
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    const startX = e.clientX - note.x;
    const startY = e.clientY - note.y;
    const onMove = (ev) => {
      setNotes(
        (prev) => prev.map(
          (n) => n.id === noteId ? { ...n, x: ev.clientX - startX, y: ev.clientY - startY } : n
        )
      );
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setNotes((prev) => {
        const updated = prev;
        set(updated);
        return updated;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--os-bg-app)" },
      "data-ocid": "whiteboard.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-4 py-2.5 flex-shrink-0",
            style: {
              borderBottom: "1px solid rgba(39,215,224,0.1)",
              background: "var(--os-bg-app)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: { fontSize: 13, fontWeight: 700, color: "var(--os-accent)" },
                  children: "Whiteboard"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--os-text-muted)" }, children: [
                notes.length,
                " note",
                notes.length !== 1 ? "s" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: addNote,
                  className: "ml-auto flex items-center gap-1.5 px-3 h-7 rounded text-xs font-semibold transition-colors",
                  style: {
                    background: "rgba(39,215,224,0.12)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "var(--os-accent)",
                    cursor: "pointer"
                  },
                  "data-ocid": "whiteboard.primary_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    " Add Note"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: canvasRef,
            className: "flex-1 relative overflow-hidden",
            style: {
              backgroundImage: "radial-gradient(circle, rgba(39,215,224,0.04) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            },
            onClick: (e) => {
              if (e.target === canvasRef.current) setEditingId(null);
            },
            onKeyDown: (e) => {
              if (e.key === "Escape") setEditingId(null);
            },
            role: "presentation",
            children: [
              notes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "absolute inset-0 flex flex-col items-center justify-center gap-3",
                  "data-ocid": "whiteboard.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, opacity: 0.15 }, children: "📌" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, color: "var(--os-text-muted)" }, children: 'Click "+ Add Note" to create your first sticky note' })
                  ]
                }
              ),
              notes.map((note, idx) => {
                const cols = NOTE_COLORS[note.color];
                const isEditing = editingId === note.id;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    onMouseDown: (e) => startDrag(note.id, e),
                    style: {
                      position: "absolute",
                      left: note.x,
                      top: note.y,
                      width: 192,
                      minHeight: 140,
                      background: cols.bg,
                      border: `1.5px solid ${isEditing ? cols.text : cols.border}`,
                      borderRadius: 10,
                      padding: "8px 10px",
                      boxShadow: isEditing ? `0 0 18px ${cols.text}33, 0 4px 20px rgba(0,0,0,0.5)` : "0 4px 16px rgba(0,0,0,0.4)",
                      userSelect: "none",
                      cursor: "grab",
                      zIndex: isEditing ? 10 : 1,
                      transition: "box-shadow 0.2s, border-color 0.2s"
                    },
                    "data-ocid": `whiteboard.item.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: (e) => {
                              e.stopPropagation();
                              setColor(note.id, c);
                            },
                            style: {
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: NOTE_COLORS[c].text,
                              border: note.color === c ? "1.5px solid var(--os-text-secondary)" : "1px solid var(--os-text-muted)",
                              cursor: "pointer",
                              padding: 0
                            }
                          },
                          c
                        )) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: (e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            },
                            style: {
                              background: "transparent",
                              border: "none",
                              color: "var(--os-text-muted)",
                              cursor: "pointer",
                              padding: 2,
                              lineHeight: 1
                            },
                            "data-ocid": `whiteboard.delete_button.${idx + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          value: note.text,
                          onChange: (e) => updateText(note.id, e.target.value),
                          onFocus: () => setEditingId(note.id),
                          placeholder: "Type your note...",
                          style: {
                            width: "100%",
                            minHeight: 88,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            resize: "none",
                            color: cols.text,
                            fontSize: 12,
                            lineHeight: 1.55,
                            cursor: "text",
                            fontFamily: "'Satoshi', system-ui, sans-serif"
                          },
                          "data-ocid": "whiteboard.textarea"
                        }
                      )
                    ]
                  },
                  note.id
                );
              })
            ]
          }
        )
      ]
    }
  );
}
export {
  WhiteboardLite
};
