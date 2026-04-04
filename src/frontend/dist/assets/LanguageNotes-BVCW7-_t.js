import { r as reactExports, j as jsxRuntimeExports, aE as Languages, S as Search, T as Trash2 } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { S as Shuffle } from "./shuffle-imsUgQ8_.js";
import { C as CircleCheckBig } from "./circle-check-big-CvRYHAqA.js";
import { C as CircleX } from "./circle-x-DbW8_JKP.js";
const DEFAULT_DATA = {
  language: "Spanish",
  entries: [
    {
      id: "e1",
      word: "Hola",
      translation: "Hello",
      example: "¡Hola, cómo estás?",
      correct: 3,
      attempts: 4
    },
    {
      id: "e2",
      word: "Gracias",
      translation: "Thank you",
      example: "Muchas gracias por tu ayuda.",
      correct: 5,
      attempts: 5
    },
    {
      id: "e3",
      word: "Por favor",
      translation: "Please",
      example: "¿Puedes ayudarme, por favor?",
      correct: 2,
      attempts: 3
    }
  ]
};
function genId() {
  return Math.random().toString(36).slice(2, 9);
}
function LanguageNotes() {
  const { data, set } = useCanisterKV(
    "decentos_languagenotes",
    DEFAULT_DATA
  );
  const [tab, setTab] = reactExports.useState("list");
  const [search, setSearch] = reactExports.useState("");
  const [newWord, setNewWord] = reactExports.useState("");
  const [newTranslation, setNewTranslation] = reactExports.useState("");
  const [newExample, setNewExample] = reactExports.useState("");
  const [quizIndex, setQuizIndex] = reactExports.useState(0);
  const [quizInput, setQuizInput] = reactExports.useState("");
  const [quizRevealed, setQuizRevealed] = reactExports.useState(false);
  const [quizResult, setQuizResult] = reactExports.useState(null);
  const [quizOrder, setQuizOrder] = reactExports.useState([]);
  const shuffleQuiz = () => {
    const ids = data.entries.map((e) => e.id).sort(() => Math.random() - 0.5);
    setQuizOrder(ids);
    setQuizIndex(0);
    setQuizInput("");
    setQuizRevealed(false);
    setQuizResult(null);
  };
  const addEntry = () => {
    if (!newWord.trim() || !newTranslation.trim()) return;
    const entry = {
      id: genId(),
      word: newWord.trim(),
      translation: newTranslation.trim(),
      example: newExample.trim(),
      correct: 0,
      attempts: 0
    };
    set({ ...data, entries: [...data.entries, entry] });
    setNewWord("");
    setNewTranslation("");
    setNewExample("");
  };
  const deleteEntry = (id) => set({ ...data, entries: data.entries.filter((e) => e.id !== id) });
  const filtered = data.entries.filter(
    (e) => e.word.toLowerCase().includes(search.toLowerCase()) || e.translation.toLowerCase().includes(search.toLowerCase())
  );
  const totalAccuracy = data.entries.reduce((s, e) => s + e.attempts, 0) > 0 ? Math.round(
    data.entries.reduce((s, e) => s + e.correct, 0) / data.entries.reduce((s, e) => s + e.attempts, 0) * 100
  ) : 0;
  const currentQuizEntry = quizOrder.length > 0 && quizIndex < quizOrder.length ? data.entries.find((e) => e.id === quizOrder[quizIndex]) : null;
  const handleQuizCheck = () => {
    if (!currentQuizEntry) return;
    const correct = quizInput.trim().toLowerCase() === currentQuizEntry.translation.trim().toLowerCase();
    setQuizResult(correct);
    setQuizRevealed(true);
    set({
      ...data,
      entries: data.entries.map(
        (e) => e.id === currentQuizEntry.id ? {
          ...e,
          attempts: e.attempts + 1,
          correct: e.correct + (correct ? 1 : 0)
        } : e
      )
    });
  };
  const handleQuizNext = () => {
    setQuizIndex((i) => i + 1);
    setQuizInput("");
    setQuizRevealed(false);
    setQuizResult(null);
  };
  const panelStyle = {
    background: "rgba(18,32,38,0.5)",
    border: "1px solid rgba(39,215,224,0.1)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: {
        background: "rgba(9,13,16,0.9)",
        color: "var(--os-text-primary)"
      },
      "data-ocid": "languagenotes.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0",
            style: {
              borderColor: "rgba(39,215,224,0.15)",
              background: "rgba(18,32,38,0.6)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Languages,
                  {
                    className: "w-4 h-4",
                    style: { color: "rgba(39,215,224,1)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: data.language,
                    onChange: (e) => set({ ...data, language: e.target.value }),
                    placeholder: "Language name...",
                    className: "bg-transparent text-sm font-semibold outline-none tracking-wide w-32",
                    style: { color: "rgba(39,215,224,1)" },
                    "data-ocid": "languagenotes.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3 text-xs",
                  style: { color: "var(--os-text-secondary)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      data.entries.length,
                      " words"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Accuracy:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(39,215,224,1)" }, children: [
                        totalAccuracy,
                        "%"
                      ] })
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex border-b flex-shrink-0",
            style: {
              borderColor: "rgba(39,215,224,0.1)",
              background: "rgba(12,20,26,0.5)"
            },
            children: ["list", "add", "quiz"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setTab(t);
                  if (t === "quiz") shuffleQuiz();
                },
                "data-ocid": "languagenotes.tab",
                className: "px-5 py-2 text-xs font-semibold capitalize transition-colors",
                style: {
                  borderBottom: tab === t ? "2px solid rgba(39,215,224,0.8)" : "2px solid transparent",
                  color: tab === t ? "rgba(39,215,224,1)" : "var(--os-text-muted)"
                },
                children: t === "list" ? "Vocabulary" : t === "add" ? "Add Word" : "Quiz Mode"
              },
              t
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [
          tab === "list" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2",
                style: panelStyle,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Search,
                    {
                      className: "w-3.5 h-3.5",
                      style: { color: "var(--os-text-muted)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      placeholder: `Search ${data.language} words...`,
                      className: "flex-1 bg-transparent text-sm outline-none",
                      style: { color: "var(--os-text-secondary)" },
                      "data-ocid": "languagenotes.search_input"
                    }
                  )
                ]
              }
            ),
            filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-center py-8 text-sm",
                style: { color: "var(--os-text-muted)" },
                "data-ocid": "languagenotes.empty_state",
                children: "No words yet. Add some in the Add Word tab."
              }
            ),
            filtered.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 px-3 py-2 rounded-lg",
                style: panelStyle,
                "data-ocid": `languagenotes.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-semibold text-sm",
                          style: { color: "rgba(39,215,224,1)" },
                          children: entry.word
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs",
                          style: { color: "var(--os-text-muted)" },
                          children: "→"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-sm",
                          style: { color: "var(--os-text-secondary)" },
                          children: entry.translation
                        }
                      )
                    ] }),
                    entry.example && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "text-[11px] mt-0.5 truncate",
                        style: { color: "var(--os-text-muted)" },
                        children: entry.example
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "text-[10px]",
                      style: { color: "var(--os-text-muted)" },
                      children: entry.attempts > 0 ? `${Math.round(entry.correct / entry.attempts * 100)}%` : ""
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => deleteEntry(entry.id),
                      "data-ocid": "languagenotes.delete_button",
                      className: "p-1 rounded hover:bg-red-500/10 transition-colors flex-shrink-0",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Trash2,
                        {
                          className: "w-3.5 h-3.5",
                          style: { color: "rgba(255,100,100,0.5)" }
                        }
                      )
                    }
                  )
                ]
              },
              entry.id
            ))
          ] }),
          tab === "add" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 max-w-md", children: [
            [
              {
                label: `${data.language} Word`,
                val: newWord,
                sv: setNewWord,
                ph: "e.g. Bonjour"
              },
              {
                label: "English Translation",
                val: newTranslation,
                sv: setNewTranslation,
                ph: "e.g. Hello"
              }
            ].map(({ label, val, sv, ph }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-[11px] font-semibold uppercase tracking-widest",
                  style: { color: "var(--os-text-secondary)" },
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: val,
                  onChange: (e) => sv(e.target.value),
                  placeholder: ph,
                  className: "px-3 py-2 rounded-lg text-sm outline-none",
                  style: {
                    background: "rgba(18,32,38,0.7)",
                    border: "1px solid rgba(39,215,224,0.15)",
                    color: "var(--os-text-primary)"
                  },
                  "data-ocid": "languagenotes.input"
                }
              )
            ] }, label)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-[11px] font-semibold uppercase tracking-widest",
                  style: { color: "var(--os-text-secondary)" },
                  children: "Example Sentence (optional)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: newExample,
                  onChange: (e) => setNewExample(e.target.value),
                  placeholder: "e.g. Bonjour, comment ça va?",
                  rows: 2,
                  className: "px-3 py-2 rounded-lg text-sm outline-none resize-none",
                  style: {
                    background: "rgba(18,32,38,0.7)",
                    border: "1px solid rgba(39,215,224,0.15)",
                    color: "var(--os-text-primary)"
                  },
                  "data-ocid": "languagenotes.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: addEntry,
                disabled: !newWord.trim() || !newTranslation.trim(),
                "data-ocid": "languagenotes.submit_button",
                className: "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                style: {
                  background: newWord && newTranslation ? "rgba(39,215,224,0.15)" : "var(--os-border-subtle)",
                  border: "1px solid rgba(39,215,224,0.25)",
                  color: newWord && newTranslation ? "rgba(39,215,224,1)" : "var(--os-text-muted)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  " Add Word"
                ]
              }
            )
          ] }),
          tab === "quiz" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-4", children: data.entries.length < 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-sm",
              style: { color: "var(--os-text-muted)" },
              "data-ocid": "languagenotes.empty_state",
              children: "Add some words first!"
            }
          ) : quizIndex >= quizOrder.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-4 py-8",
              "data-ocid": "languagenotes.success_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "🎉" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-lg font-bold",
                    style: { color: "rgba(39,215,224,1)" },
                    children: "Quiz Complete!"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "text-sm",
                    style: { color: "var(--os-text-secondary)" },
                    children: [
                      "Overall accuracy: ",
                      totalAccuracy,
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: shuffleQuiz,
                    "data-ocid": "languagenotes.primary_button",
                    className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold",
                    style: {
                      background: "rgba(39,215,224,0.15)",
                      border: "1px solid rgba(39,215,224,0.3)",
                      color: "rgba(39,215,224,1)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "w-4 h-4" }),
                      " Retry"
                    ]
                  }
                )
              ]
            }
          ) : currentQuizEntry ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-full max-w-sm flex flex-col gap-4",
              "data-ocid": "languagenotes.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "text-xs text-center",
                    style: { color: "var(--os-text-muted)" },
                    children: [
                      quizIndex + 1,
                      " / ",
                      quizOrder.length
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-2xl p-6 text-center",
                    style: {
                      background: "rgba(18,32,38,0.7)",
                      border: "1px solid rgba(39,215,224,0.15)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "text-2xl font-bold mb-1",
                          style: { color: "rgba(39,215,224,1)" },
                          children: currentQuizEntry.word
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "text-xs",
                          style: { color: "var(--os-text-muted)" },
                          children: data.language
                        }
                      ),
                      currentQuizEntry.example && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "mt-3 text-xs italic",
                          style: { color: "var(--os-text-muted)" },
                          children: [
                            '"',
                            currentQuizEntry.example,
                            '"'
                          ]
                        }
                      )
                    ]
                  }
                ),
                !quizRevealed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: quizInput,
                      onChange: (e) => setQuizInput(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && handleQuizCheck(),
                      placeholder: "Type the English translation...",
                      className: "flex-1 px-3 py-2 rounded-lg text-sm outline-none",
                      style: {
                        background: "rgba(18,32,38,0.7)",
                        border: "1px solid rgba(39,215,224,0.15)",
                        color: "var(--os-text-primary)"
                      },
                      "data-ocid": "languagenotes.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleQuizCheck,
                      "data-ocid": "languagenotes.submit_button",
                      className: "px-4 py-2 rounded-lg text-sm font-semibold",
                      style: {
                        background: "rgba(39,215,224,0.15)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "rgba(39,215,224,1)"
                      },
                      children: "Check"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-2 px-4 py-3 rounded-lg",
                      "data-ocid": "languagenotes.success_state",
                      style: {
                        background: quizResult ? "rgba(39,215,224,0.08)" : "rgba(255,100,100,0.08)",
                        border: `1px solid ${quizResult ? "rgba(39,215,224,0.3)" : "rgba(255,100,100,0.3)"}`
                      },
                      children: [
                        quizResult ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheckBig,
                          {
                            className: "w-4 h-4 flex-shrink-0",
                            style: { color: "rgba(39,215,224,1)" }
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleX,
                          {
                            className: "w-4 h-4 flex-shrink-0",
                            style: { color: "rgba(255,100,100,1)" }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "text-sm font-semibold",
                              style: {
                                color: quizResult ? "rgba(39,215,224,1)" : "rgba(255,120,120,1)"
                              },
                              children: quizResult ? "Correct!" : "Incorrect"
                            }
                          ),
                          !quizResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: "text-xs mt-0.5",
                              style: { color: "var(--os-text-secondary)" },
                              children: [
                                "Answer:",
                                " ",
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-primary)" }, children: currentQuizEntry.translation })
                              ]
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleQuizNext,
                      "data-ocid": "languagenotes.primary_button",
                      className: "px-4 py-2 rounded-lg text-sm font-semibold",
                      style: {
                        background: "rgba(39,215,224,0.15)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "rgba(39,215,224,1)"
                      },
                      children: "Next →"
                    }
                  )
                ] })
              ]
            }
          ) : null })
        ] })
      ]
    }
  );
}
export {
  LanguageNotes
};
