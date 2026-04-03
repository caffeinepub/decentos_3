import { r as reactExports, j as jsxRuntimeExports, T as Trash2, C as Check, X } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import { P as Pen } from "./pen-fZsCY6fQ.js";
const INITIAL_COLUMNS = [
  {
    id: "backlog",
    title: "Backlog",
    color: "rgba(148,163,184,0.8)",
    cards: [
      {
        id: "c1",
        title: "Research competitors",
        description: "Survey top 5 competitors",
        priority: "Low"
      },
      { id: "c2", title: "Define MVP scope", priority: "High" }
    ]
  },
  {
    id: "todo",
    title: "To Do",
    color: "rgba(96,165,250,0.9)",
    cards: [
      {
        id: "c3",
        title: "Design system setup",
        description: "Colors, typography, tokens",
        priority: "High"
      },
      { id: "c4", title: "Write unit tests", priority: "Med" }
    ]
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "rgba(251,191,36,0.9)",
    cards: [
      {
        id: "c5",
        title: "Build auth flow",
        description: "Login, logout, session",
        priority: "High"
      }
    ]
  },
  {
    id: "done",
    title: "Done",
    color: "rgba(34,197,94,0.9)",
    cards: [
      { id: "c6", title: "Project kickoff", priority: "Med" },
      { id: "c7", title: "Repo setup", priority: "Low" }
    ]
  }
];
const PRIORITY_COLORS = {
  High: "rgba(239,68,68,0.85)",
  Med: "rgba(251,191,36,0.85)",
  Low: "rgba(100,116,139,0.85)"
};
function generateId() {
  return `k${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
}
function KanbanBoard() {
  const {
    data: persistedColumns,
    set: saveColumns,
    loading
  } = useCanisterKV("decentos_kanban", INITIAL_COLUMNS);
  const [columns, setColumns] = reactExports.useState(INITIAL_COLUMNS);
  const [addingIn, setAddingIn] = reactExports.useState(null);
  const [newTitle, setNewTitle] = reactExports.useState("");
  const [newDesc, setNewDesc] = reactExports.useState("");
  const [newPriority, setNewPriority] = reactExports.useState("Med");
  const [editCard, setEditCard] = reactExports.useState(null);
  const dragRef = reactExports.useRef(null);
  const overColRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const hydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    setColumns(persistedColumns);
  }, [loading, persistedColumns]);
  const saveTimeoutRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!hydratedRef.current) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveColumns(columns), 500);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [columns, saveColumns]);
  const addCard = (colId) => {
    if (!newTitle.trim()) return;
    const card = {
      id: generateId(),
      title: newTitle.trim(),
      description: newDesc.trim() || void 0,
      priority: newPriority
    };
    setColumns(
      (prev) => prev.map(
        (col) => col.id === colId ? { ...col, cards: [...col.cards, card] } : col
      )
    );
    setNewTitle("");
    setNewDesc("");
    setNewPriority("Med");
    setAddingIn(null);
  };
  const deleteCard = (colId, cardId) => setColumns(
    (prev) => prev.map(
      (col) => col.id === colId ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) } : col
    )
  );
  const saveEdit = () => {
    if (!editCard) return;
    setColumns(
      (prev) => prev.map(
        (col) => col.id === editCard.colId ? {
          ...col,
          cards: col.cards.map(
            (c) => c.id === editCard.card.id ? editCard.card : c
          )
        } : col
      )
    );
    setEditCard(null);
  };
  const onPointerDown = reactExports.useCallback(
    (e, colId, cardId) => {
      if (e.target.closest("button")) return;
      const cardEl = e.currentTarget;
      const rect = cardEl.getBoundingClientRect();
      const ghost = cardEl.cloneNode(true);
      ghost.style.cssText = `position:fixed;top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;opacity:0.7;pointer-events:none;z-index:9999;transform:rotate(2deg);transition:none;`;
      document.body.appendChild(ghost);
      dragRef.current = {
        cardId,
        fromColId: colId,
        cardEl,
        ghost,
        startX: e.clientX,
        startY: e.clientY
      };
      cardEl.style.opacity = "0.3";
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    []
  );
  const onPointerMove = reactExports.useCallback((e) => {
    var _a;
    const d = dragRef.current;
    if (!d) return;
    const rect = d.cardEl.getBoundingClientRect();
    d.ghost.style.top = `${rect.top + (e.clientY - d.startY)}px`;
    d.ghost.style.left = `${rect.left + (e.clientX - d.startX)}px`;
    const colEls = ((_a = containerRef.current) == null ? void 0 : _a.querySelectorAll("[data-col-id]")) ?? [];
    for (const el of Array.from(colEls)) {
      const colRect = el.getBoundingClientRect();
      const over = e.clientX >= colRect.left && e.clientX <= colRect.right && e.clientY >= colRect.top && e.clientY <= colRect.bottom;
      el.style.outline = over ? "1px solid rgba(39,215,224,0.3)" : "";
      if (over) overColRef.current = el.dataset.colId ?? null;
    }
  }, []);
  const onPointerUp = reactExports.useCallback(() => {
    var _a;
    const d = dragRef.current;
    if (!d) return;
    d.ghost.remove();
    d.cardEl.style.opacity = "";
    const targetColId = overColRef.current;
    if (targetColId && targetColId !== d.fromColId) {
      setColumns((prev) => {
        let movingCard;
        const next = prev.map((col) => {
          if (col.id === d.fromColId) {
            const newCards = col.cards.filter((c) => {
              if (c.id === d.cardId) {
                movingCard = c;
                return false;
              }
              return true;
            });
            return { ...col, cards: newCards };
          }
          return col;
        });
        if (movingCard)
          return next.map(
            (col) => col.id === targetColId ? { ...col, cards: [...col.cards, movingCard] } : col
          );
        return next;
      });
    }
    const clearEls = ((_a = containerRef.current) == null ? void 0 : _a.querySelectorAll("[data-col-id]")) ?? [];
    for (const el of Array.from(clearEls)) {
      el.style.outline = "";
    }
    dragRef.current = null;
    overColRef.current = null;
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      className: "flex h-full gap-3 p-4 overflow-x-auto",
      style: { background: "rgba(11,15,18,0.6)" },
      onPointerMove,
      onPointerUp,
      children: [
        columns.map((col, colIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-col-id": col.id,
            "data-ocid": `kanban.item.${colIndex + 1}`,
            className: "flex flex-col flex-shrink-0 rounded-xl",
            style: {
              width: 220,
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-border-subtle)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "px-3 py-2.5 flex items-center justify-between",
                  style: { borderBottom: "1px solid var(--os-border-subtle)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-2 h-2 rounded-full",
                          style: { background: col.color }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs font-semibold",
                          style: { color: "rgba(220,235,240,0.8)" },
                          children: col.title
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] px-1.5 rounded-full",
                          style: {
                            background: "var(--os-border-subtle)",
                            color: "rgba(180,200,210,0.5)"
                          },
                          children: col.cards.length
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setAddingIn(col.id);
                          setNewTitle("");
                          setNewDesc("");
                        },
                        "data-ocid": `kanban.edit_button.${colIndex + 1}`,
                        className: "w-5 h-5 rounded flex items-center justify-center",
                        style: { color: "rgba(180,200,210,0.4)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-2 space-y-2", children: [
                col.cards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "kanban.card",
                    className: "rounded-lg p-2.5 cursor-grab active:cursor-grabbing group",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-border-subtle)",
                      touchAction: "none"
                    },
                    onPointerDown: (e) => onPointerDown(e, col.id, card.id),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-[11px] font-medium leading-snug flex-1",
                            style: { color: "rgba(220,235,240,0.85)" },
                            children: card.title
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setEditCard({ colId: col.id, card: { ...card } }),
                              "data-ocid": "kanban.edit_button",
                              className: "w-4 h-4 flex items-center justify-center rounded",
                              style: { color: "rgba(39,215,224,0.6)" },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-2.5 h-2.5" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => deleteCard(col.id, card.id),
                              "data-ocid": "kanban.delete_button",
                              className: "w-4 h-4 flex items-center justify-center rounded",
                              style: { color: "rgba(252,165,165,0.6)" },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-2.5 h-2.5" })
                            }
                          )
                        ] })
                      ] }),
                      card.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[10px] mt-1 leading-relaxed",
                          style: { color: "rgba(180,200,210,0.45)" },
                          children: card.description
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase",
                          style: {
                            background: `${PRIORITY_COLORS[card.priority]}22`,
                            color: PRIORITY_COLORS[card.priority],
                            border: `1px solid ${PRIORITY_COLORS[card.priority]}44`
                          },
                          children: card.priority
                        }
                      ) })
                    ]
                  },
                  card.id
                )),
                addingIn === col.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-lg p-2.5 space-y-2",
                    style: {
                      background: "rgba(39,215,224,0.05)",
                      border: "1px solid rgba(39,215,224,0.2)"
                    },
                    "data-ocid": "kanban.panel",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          placeholder: "Card title...",
                          value: newTitle,
                          onChange: (e) => setNewTitle(e.target.value),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") addCard(col.id);
                            if (e.key === "Escape") setAddingIn(null);
                          },
                          "data-ocid": "kanban.input",
                          className: "w-full h-7 px-2 rounded text-[11px] outline-none",
                          style: {
                            background: "var(--os-border-subtle)",
                            border: "1px solid rgba(39,215,224,0.2)",
                            color: "rgba(220,235,240,0.9)",
                            caretColor: "rgba(39,215,224,0.9)"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          placeholder: "Description (optional)",
                          value: newDesc,
                          onChange: (e) => setNewDesc(e.target.value),
                          className: "w-full h-7 px-2 rounded text-[11px] outline-none",
                          style: {
                            background: "var(--os-border-subtle)",
                            border: "1px solid rgba(42,58,66,0.6)",
                            color: "rgba(220,235,240,0.7)"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          value: newPriority,
                          onChange: (e) => setNewPriority(e.target.value),
                          "data-ocid": "kanban.select",
                          className: "w-full h-7 px-2 rounded text-[11px] outline-none",
                          style: {
                            background: "var(--os-border-subtle)",
                            border: "1px solid rgba(42,58,66,0.6)",
                            color: "rgba(220,235,240,0.7)"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "High", children: "High Priority" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Med", children: "Medium Priority" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Low", children: "Low Priority" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => addCard(col.id),
                            "data-ocid": "kanban.submit_button",
                            className: "flex items-center gap-1 px-3 h-6 rounded text-[10px] font-semibold transition-all",
                            style: {
                              background: "rgba(39,215,224,0.15)",
                              border: "1px solid rgba(39,215,224,0.3)",
                              color: "rgba(39,215,224,0.9)"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
                              " Add"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => setAddingIn(null),
                            "data-ocid": "kanban.cancel_button",
                            className: "px-3 h-6 rounded text-[10px] transition-all",
                            style: { color: "rgba(180,200,210,0.5)" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 inline" }),
                              " Cancel"
                            ]
                          }
                        )
                      ] })
                    ]
                  }
                )
              ] })
            ]
          },
          col.id
        )),
        editCard && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 flex items-center justify-center",
            style: { zIndex: 1e3, background: "rgba(0,0,0,0.5)" },
            "data-ocid": "kanban.modal",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "w-80 rounded-xl p-5 space-y-3",
                style: {
                  background: "rgba(14,20,26,0.98)",
                  border: "1px solid rgba(39,215,224,0.2)",
                  backdropFilter: "blur(24px)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "text-sm font-semibold",
                      style: { color: "rgba(220,235,240,0.9)" },
                      children: "Edit Card"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: editCard.card.title,
                      onChange: (e) => setEditCard(
                        (prev) => prev ? { ...prev, card: { ...prev.card, title: e.target.value } } : null
                      ),
                      className: "w-full h-8 px-3 rounded text-xs outline-none",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(42,58,66,0.8)",
                        color: "rgba(220,235,240,0.9)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      value: editCard.card.description ?? "",
                      onChange: (e) => setEditCard(
                        (prev) => prev ? {
                          ...prev,
                          card: { ...prev.card, description: e.target.value }
                        } : null
                      ),
                      placeholder: "Description...",
                      className: "w-full h-20 px-3 py-2 rounded text-xs outline-none resize-none",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(42,58,66,0.6)",
                        color: "rgba(220,235,240,0.7)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: saveEdit,
                        "data-ocid": "kanban.confirm_button",
                        className: "flex-1 h-8 rounded text-xs font-semibold transition-all",
                        style: {
                          background: "rgba(39,215,224,0.15)",
                          border: "1px solid rgba(39,215,224,0.35)",
                          color: "rgba(39,215,224,0.9)"
                        },
                        children: "Save"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditCard(null),
                        "data-ocid": "kanban.close_button",
                        className: "flex-1 h-8 rounded text-xs transition-all",
                        style: {
                          color: "rgba(180,200,210,0.6)",
                          border: "1px solid rgba(42,58,66,0.5)"
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
  KanbanBoard
};
