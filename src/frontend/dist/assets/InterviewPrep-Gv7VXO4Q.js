import { r as reactExports, j as jsxRuntimeExports, aH as GraduationCap, T as Trash2 } from "./index-CZGIn5x2.js";
import { B as Badge } from "./badge-D2FbqHYW.js";
import { P as Progress } from "./progress-D5FDkJK5.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { L as List } from "./list-Ba7j3EJY.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
import { C as CircleCheck } from "./circle-check-DLIDLAd8.js";
import { C as CircleX } from "./circle-x-CFbueiud.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
import "./index-DfmnWLAm.js";
import "./index-B9-lQkRo.js";
const BG = "rgba(11,15,18,0.6)";
const SIDEBAR_BG = "rgba(10,16,20,0.7)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgba(39,215,224,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.45)";
const BTN_BG = "rgba(39,215,224,0.12)";
const BTN_BORDER = "rgba(39,215,224,0.3)";
const CATEGORY_COLORS = {
  Behavioral: "rgba(168,85,247,0.8)",
  Technical: "rgba(39,215,224,0.8)",
  "System Design": "rgba(245,158,11,0.8)",
  Culture: "rgba(34,197,94,0.8)"
};
const CATEGORIES = [
  "Behavioral",
  "Technical",
  "System Design",
  "Culture"
];
const INPUT_STYLE = {
  background: "var(--os-border-subtle)",
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  color: TEXT,
  padding: "6px 10px",
  fontSize: 12,
  outline: "none",
  width: "100%"
};
function InterviewPrep() {
  const { data: questions, set: setQuestions } = useCanisterKV(
    "decent-interview-prep",
    []
  );
  const [mode, setMode] = reactExports.useState("list");
  const [filterCat, setFilterCat] = reactExports.useState("All");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    category: "Behavioral",
    question: "",
    answer: ""
  });
  const [cardIndex, setCardIndex] = reactExports.useState(0);
  const [showAnswer, setShowAnswer] = reactExports.useState(false);
  const filtered = questions.filter(
    (q) => filterCat === "All" || q.category === filterCat
  );
  const mastered = questions.filter((q) => q.status === "mastered").length;
  const progress = questions.length > 0 ? Math.round(mastered / questions.length * 100) : 0;
  const addQuestion = () => {
    if (!form.question.trim()) return;
    const nq = {
      id: `q_${Date.now()}`,
      ...form,
      status: "unreviewed"
    };
    setQuestions([...questions, nq]);
    setForm({ category: "Behavioral", question: "", answer: "" });
    setShowAdd(false);
  };
  const deleteQuestion = (id) => setQuestions(questions.filter((q) => q.id !== id));
  const setStatus = (id, status) => setQuestions(questions.map((q) => q.id === id ? { ...q, status } : q));
  const flashcardDeck = filtered.filter((q) => q.status !== "mastered");
  const currentCard = flashcardDeck[cardIndex] ?? null;
  const nextCard = () => {
    setShowAnswer(false);
    setCardIndex((i) => (i + 1) % Math.max(flashcardDeck.length, 1));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: BG, color: TEXT, fontSize: 13 },
      "data-ocid": "interviewprep.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b", style: { borderColor: BORDER }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-4 h-4", style: { color: CYAN } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: "Interview Prep" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setMode("list");
                  },
                  className: "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  style: mode === "list" ? {
                    background: BTN_BG,
                    border: `1px solid ${BTN_BORDER}`,
                    color: CYAN
                  } : {
                    background: "transparent",
                    border: `1px solid ${BORDER}`,
                    color: MUTED
                  },
                  "data-ocid": "interviewprep.tab",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "w-3 h-3 inline mr-1" }),
                    "List"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setMode("flashcard");
                    setCardIndex(0);
                    setShowAnswer(false);
                  },
                  className: "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  style: mode === "flashcard" ? {
                    background: BTN_BG,
                    border: `1px solid ${BTN_BORDER}`,
                    color: CYAN
                  } : {
                    background: "transparent",
                    border: `1px solid ${BORDER}`,
                    color: MUTED
                  },
                  "data-ocid": "interviewprep.tab",
                  children: "Flashcard"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAdd(!showAdd),
                  className: "px-3 py-1.5 rounded-lg text-xs font-medium",
                  style: {
                    background: BTN_BG,
                    border: `1px solid ${BTN_BORDER}`,
                    color: CYAN
                  },
                  "data-ocid": "interviewprep.primary_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 inline mr-1" }),
                    "Add Q&A"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "flex-1 h-1.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs whitespace-nowrap", style: { color: MUTED }, children: [
              mastered,
              "/",
              questions.length,
              " mastered (",
              progress,
              "%)"
            ] })
          ] })
        ] }),
        showAdd && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "p-4 border-b",
            style: { borderColor: BORDER, background: "rgba(10,16,20,0.8)" },
            "data-ocid": "interviewprep.modal",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "block text-[10px] font-semibold mb-1",
                    style: { color: CYAN },
                    children: "CATEGORY"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: form.category,
                    onChange: (e) => setForm({ ...form, category: e.target.value }),
                    style: INPUT_STYLE,
                    "data-ocid": "interviewprep.select",
                    children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "block text-[10px] font-semibold mb-1",
                    style: { color: CYAN },
                    children: "QUESTION"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: form.question,
                    onChange: (e) => setForm({ ...form, question: e.target.value }),
                    placeholder: "Interview question...",
                    style: { ...INPUT_STYLE, minHeight: 60, resize: "vertical" },
                    "data-ocid": "interviewprep.textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "block text-[10px] font-semibold mb-1",
                    style: { color: CYAN },
                    children: "YOUR ANSWER"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: form.answer,
                    onChange: (e) => setForm({ ...form, answer: e.target.value }),
                    placeholder: "Write your answer...",
                    style: { ...INPUT_STYLE, minHeight: 80, resize: "vertical" },
                    "data-ocid": "interviewprep.textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: addQuestion,
                    disabled: !form.question.trim(),
                    className: "flex-1 py-2 rounded-lg text-xs font-medium",
                    style: {
                      background: BTN_BG,
                      border: `1px solid ${BTN_BORDER}`,
                      color: CYAN,
                      opacity: form.question.trim() ? 1 : 0.5
                    },
                    "data-ocid": "interviewprep.save_button",
                    children: "Add Question"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowAdd(false),
                    className: "px-4 py-2 rounded-lg text-xs",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT
                    },
                    "data-ocid": "interviewprep.cancel_button",
                    children: "Cancel"
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-2 flex gap-2 border-b overflow-x-auto",
            style: { borderColor: BORDER, background: SIDEBAR_BG },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setFilterCat("All"),
                  className: "px-3 py-1 rounded-full text-xs whitespace-nowrap",
                  style: {
                    background: filterCat === "All" ? BTN_BG : "transparent",
                    border: `1px solid ${filterCat === "All" ? BTN_BORDER : BORDER}`,
                    color: filterCat === "All" ? CYAN : MUTED
                  },
                  "data-ocid": "interviewprep.tab",
                  children: [
                    "All (",
                    questions.length,
                    ")"
                  ]
                }
              ),
              CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setFilterCat(c),
                  className: "px-3 py-1 rounded-full text-xs whitespace-nowrap",
                  style: {
                    background: filterCat === c ? BTN_BG : "transparent",
                    border: `1px solid ${filterCat === c ? BTN_BORDER : BORDER}`,
                    color: filterCat === c ? CYAN : MUTED
                  },
                  "data-ocid": "interviewprep.tab",
                  children: [
                    c,
                    " (",
                    questions.filter((q) => q.category === c).length,
                    ")"
                  ]
                },
                c
              ))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: mode === "flashcard" ? flashcardDeck.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-full",
            style: { color: MUTED },
            "data-ocid": "interviewprep.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircleCheck,
                {
                  className: "w-12 h-12 mb-3",
                  style: { color: "rgba(34,197,94,0.5)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", style: { color: TEXT }, children: "All mastered!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Switch to list view to review all Q&As" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", style: { color: MUTED }, children: [
            cardIndex + 1,
            " / ",
            flashcardDeck.length,
            " remaining"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full max-w-lg p-6 rounded-2xl cursor-pointer transition-all text-left",
              style: {
                background: "rgba(10,16,20,0.8)",
                border: `1px solid ${BORDER}`,
                minHeight: 200
              },
              onClick: () => setShowAnswer(!showAnswer),
              "data-ocid": "interviewprep.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    style: {
                      background: "rgba(39,215,224,0.12)",
                      color: CATEGORY_COLORS[currentCard.category],
                      border: "none",
                      fontSize: 10
                    },
                    children: currentCard.category
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-4", style: { color: TEXT }, children: currentCard.question }),
                showAnswer ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border-t pt-4",
                    style: { borderColor: BORDER },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-semibold mb-2",
                          style: { color: CYAN },
                          children: "ANSWER"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-sm",
                          style: { color: "rgba(220,235,240,0.8)" },
                          children: currentCard.answer || "No answer written yet."
                        }
                      )
                    ]
                  }
                ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: MUTED }, children: "Tap to reveal answer" })
              ]
            }
          ),
          showAnswer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setStatus(currentCard.id, "needs-work");
                  nextCard();
                },
                className: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
                style: {
                  background: "rgba(248,113,113,0.12)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  color: "rgba(248,113,113,0.9)"
                },
                "data-ocid": "interviewprep.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
                  " Needs Work"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setStatus(currentCard.id, "mastered");
                  nextCard();
                },
                className: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
                style: {
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "rgba(34,197,94,0.9)"
                },
                "data-ocid": "interviewprep.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                  " Mastered"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: nextCard,
                className: "px-4 py-2 rounded-xl text-sm",
                style: {
                  background: BTN_BG,
                  border: `1px solid ${BTN_BORDER}`,
                  color: CYAN
                },
                "data-ocid": "interviewprep.button",
                children: "Skip →"
              }
            )
          ] })
        ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-full",
            style: { color: MUTED },
            "data-ocid": "interviewprep.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-10 h-10 mb-3 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No questions yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Add your first Q&A above" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "p-3 rounded-xl",
            style: {
              background: "rgba(10,16,20,0.6)",
              border: `1px solid ${BORDER}`
            },
            "data-ocid": `interviewprep.item.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] px-2 py-0.5 rounded-full",
                      style: {
                        background: "rgba(39,215,224,0.08)",
                        color: CATEGORY_COLORS[q.category]
                      },
                      children: q.category
                    }
                  ),
                  q.status === "mastered" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] px-2 py-0.5 rounded-full",
                      style: {
                        background: "rgba(34,197,94,0.12)",
                        color: "rgba(134,239,172,0.9)"
                      },
                      children: "✓ Mastered"
                    }
                  ),
                  q.status === "needs-work" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] px-2 py-0.5 rounded-full",
                      style: {
                        background: "rgba(248,113,113,0.12)",
                        color: "rgba(248,113,113,0.9)"
                      },
                      children: "Needs Work"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium", style: { color: TEXT }, children: q.question }),
                q.answer && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs mt-1", style: { color: MUTED }, children: [
                  q.answer.slice(0, 100),
                  q.answer.length > 100 ? "..." : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setStatus(
                      q.id,
                      q.status === "mastered" ? "unreviewed" : "mastered"
                    ),
                    className: "p-1.5 rounded-lg",
                    style: {
                      color: q.status === "mastered" ? "rgba(34,197,94,0.9)" : MUTED,
                      background: "var(--os-border-subtle)"
                    },
                    "data-ocid": `interviewprep.checkbox.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => deleteQuestion(q.id),
                    className: "p-1.5 rounded-lg",
                    style: {
                      color: "rgba(248,113,113,0.7)",
                      background: "rgba(248,113,113,0.06)"
                    },
                    "data-ocid": `interviewprep.delete_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ] })
          },
          q.id
        )) }) })
      ]
    }
  );
}
export {
  InterviewPrep
};
