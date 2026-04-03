import { r as reactExports, j as jsxRuntimeExports, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
function VocabNotes({
  windowProps: _windowProps
}) {
  const { data: pairs, set: setPairs } = useCanisterKV(
    "decentos_vocab_notes",
    []
  );
  const [mode, setMode] = reactExports.useState("list");
  const [newWord, setNewWord] = reactExports.useState("");
  const [newDef, setNewDef] = reactExports.useState("");
  const [quizIndex, setQuizIndex] = reactExports.useState(0);
  const [quizInput, setQuizInput] = reactExports.useState("");
  const [quizResult, setQuizResult] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState({ correct: 0, total: 0 });
  const addPair = () => {
    if (!newWord.trim() || !newDef.trim()) return;
    const pair = {
      id: Date.now().toString(),
      word: newWord.trim(),
      definition: newDef.trim()
    };
    const updated = [...pairs, pair];
    setPairs(updated);
    setNewWord("");
    setNewDef("");
  };
  const deletePair = (id) => {
    const updated = pairs.filter((p) => p.id !== id);
    setPairs(updated);
  };
  const checkAnswer = () => {
    if (!pairs.length) return;
    const current = pairs[quizIndex % pairs.length];
    const isCorrect = quizInput.trim().toLowerCase() === current.definition.toLowerCase();
    setQuizResult(isCorrect ? "correct" : "wrong");
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };
  const nextCard = () => {
    setQuizIndex((prev) => (prev + 1) % Math.max(1, pairs.length));
    setQuizInput("");
    setQuizResult(null);
  };
  const sectionStyle = {
    background: "rgba(18,32,38,0.6)",
    border: "1px solid rgba(42,58,66,0.7)"
  };
  const currentCard = pairs.length ? pairs[quizIndex % pairs.length] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: "rgba(11,15,18,0.7)" },
      "data-ocid": "vocabnotes.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-3 border-b flex items-center justify-between flex-shrink-0",
            style: {
              borderColor: "rgba(42,58,66,0.8)",
              background: "rgba(18,32,38,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold os-cyan-text", children: "Vocab Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  pairs.length,
                  " words saved"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: ["list", "quiz"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setMode(m),
                  "data-ocid": `vocabnotes.${m}.tab`,
                  className: "px-3 py-1 rounded text-xs capitalize transition-colors",
                  style: {
                    background: mode === m ? "rgba(39,215,224,0.15)" : "var(--os-border-subtle)",
                    border: mode === m ? "1px solid rgba(39,215,224,0.5)" : "1px solid rgba(42,58,66,0.5)",
                    color: mode === m ? "rgba(39,215,224,0.9)" : "var(--os-text-secondary)"
                  },
                  children: m.charAt(0).toUpperCase() + m.slice(1)
                },
                m
              )) })
            ]
          }
        ),
        mode === "list" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-4 py-3 flex-shrink-0",
              style: { borderBottom: "1px solid rgba(42,58,66,0.4)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Word",
                    value: newWord,
                    onChange: (e) => setNewWord(e.target.value),
                    "data-ocid": "vocabnotes.input",
                    className: "flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none rounded px-2.5 py-1.5",
                    style: sectionStyle
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Definition",
                    value: newDef,
                    onChange: (e) => setNewDef(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && addPair(),
                    "data-ocid": "vocabnotes.textarea",
                    className: "flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none rounded px-2.5 py-1.5",
                    style: sectionStyle
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: addPair,
                    "data-ocid": "vocabnotes.primary_button",
                    className: "px-3 py-1.5 rounded text-xs flex-shrink-0 transition-colors",
                    style: {
                      background: "rgba(39,215,224,0.12)",
                      border: "1px solid rgba(39,215,224,0.35)",
                      color: "rgba(39,215,224,0.9)"
                    },
                    children: "Add"
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: pairs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center h-full text-muted-foreground/30 text-xs",
              "data-ocid": "vocabnotes.empty_state",
              children: "No words yet. Add some above!"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: pairs.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start justify-between rounded-lg px-3 py-2 gap-3",
              style: sectionStyle,
              "data-ocid": `vocabnotes.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold os-cyan-text", children: p.word }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 leading-snug", children: p.definition })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => deletePair(p.id),
                    "data-ocid": `vocabnotes.delete_button.${i + 1}`,
                    className: "text-muted-foreground/40 hover:text-destructive transition-colors mt-0.5",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            },
            p.id
          )) }) })
        ] }),
        mode === "quiz" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center gap-4", children: pairs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/40", children: "Add some words first in List mode." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mb-2", children: [
            "Score:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "os-cyan-text font-mono", children: [
              score.correct,
              "/",
              score.total
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-full max-w-sm rounded-xl p-6 text-center",
              style: {
                background: "rgba(18,32,38,0.8)",
                border: "1px solid rgba(39,215,224,0.2)"
              },
              "data-ocid": "vocabnotes.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold os-cyan-text mb-1", children: currentCard == null ? void 0 : currentCard.word }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  "Card ",
                  quizIndex % pairs.length + 1,
                  " of ",
                  pairs.length
                ] })
              ]
            }
          ),
          quizResult === null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full max-w-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Type the definition…",
                value: quizInput,
                onChange: (e) => setQuizInput(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && checkAnswer(),
                "data-ocid": "vocabnotes.input",
                className: "flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none rounded px-3 py-2",
                style: sectionStyle
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: checkAnswer,
                "data-ocid": "vocabnotes.submit_button",
                className: "px-3 py-2 rounded text-xs flex-shrink-0 transition-colors",
                style: {
                  background: "rgba(39,215,224,0.12)",
                  border: "1px solid rgba(39,215,224,0.35)",
                  color: "rgba(39,215,224,0.9)"
                },
                children: "Check"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-lg font-bold",
                style: {
                  color: quizResult === "correct" ? "rgba(74,222,128,0.9)" : "rgba(251,113,133,0.9)"
                },
                children: quizResult === "correct" ? "✓ Correct!" : "✗ Wrong"
              }
            ),
            quizResult === "wrong" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Answer:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: currentCard == null ? void 0 : currentCard.definition })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: nextCard,
                "data-ocid": "vocabnotes.secondary_button",
                className: "px-4 py-2 rounded text-xs transition-colors",
                style: {
                  background: "rgba(39,215,224,0.1)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "rgba(39,215,224,0.85)"
                },
                children: "Next Card →"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
export {
  VocabNotes
};
