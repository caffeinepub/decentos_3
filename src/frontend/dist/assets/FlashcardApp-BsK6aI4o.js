import { r as reactExports, j as jsxRuntimeExports, B as BookOpen, g as ue } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { P as Pen } from "./pen-BIZ54SVC.js";
import { C as CircleCheckBig } from "./circle-check-big-CvRYHAqA.js";
import { R as RotateCcw } from "./rotate-ccw-CbOiKPu8.js";
import { C as CircleX } from "./circle-x-DbW8_JKP.js";
const ACCENT = "rgba(245,158,11,";
const INITIAL_DECKS = [
  {
    id: 1,
    name: "ICP Basics",
    cards: [
      {
        id: 1,
        front: "What is a canister?",
        back: "A canister is a smart contract on the Internet Computer — it bundles code and state together and runs on ICP nodes.",
        known: false,
        reviewCount: 0,
        lastDifficulty: null,
        lastReviewDate: null
      },
      {
        id: 2,
        front: "What is Motoko?",
        back: "Motoko is a statically-typed programming language designed specifically for writing smart contracts on the Internet Computer.",
        known: false,
        reviewCount: 0,
        lastDifficulty: null,
        lastReviewDate: null
      },
      {
        id: 3,
        front: "What are cycles?",
        back: "Cycles are the unit of resource consumption on ICP. They are used to pay for computation, memory, and network calls.",
        known: false,
        reviewCount: 0,
        lastDifficulty: null,
        lastReviewDate: null
      },
      {
        id: 4,
        front: "What is Internet Identity?",
        back: "Internet Identity is a privacy-preserving authentication system built on ICP. It creates unique, per-app anonymous identities.",
        known: false,
        reviewCount: 0,
        lastDifficulty: null,
        lastReviewDate: null
      },
      {
        id: 5,
        front: "Query vs update calls?",
        back: "Query calls are read-only, fast (ms), and don't go through consensus. Update calls modify state and require consensus (~2s).",
        known: false,
        reviewCount: 0,
        lastDifficulty: null,
        lastReviewDate: null
      }
    ]
  },
  {
    id: 2,
    name: "React Hooks",
    cards: [
      {
        id: 6,
        front: "When to use useCallback?",
        back: "Use useCallback to memoize a function reference so it doesn't change on every render — useful when passing callbacks to optimized child components.",
        known: false,
        reviewCount: 0,
        lastDifficulty: null,
        lastReviewDate: null
      },
      {
        id: 7,
        front: "What does useRef return?",
        back: "useRef returns a mutable object { current: T } that persists for the component's lifetime without triggering re-renders.",
        known: false,
        reviewCount: 0,
        lastDifficulty: null,
        lastReviewDate: null
      },
      {
        id: 8,
        front: "When does useEffect run?",
        back: "useEffect runs after every render by default. With an empty array it runs once on mount. With deps it runs when deps change.",
        known: false,
        reviewCount: 0,
        lastDifficulty: null,
        lastReviewDate: null
      }
    ]
  }
];
const TODAY = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function FlashcardApp() {
  const { data: decks, set: saveDecks } = useCanisterKV(
    "decentos_flashcards",
    INITIAL_DECKS
  );
  const [selectedDeckId, setSelectedDeckId] = reactExports.useState(1);
  const [mode, setMode] = reactExports.useState("deck");
  const [studyQueue, setStudyQueue] = reactExports.useState([]);
  const [studyIndex, setStudyIndex] = reactExports.useState(0);
  const [flipped, setFlipped] = reactExports.useState(false);
  const [studyResults, setStudyResults] = reactExports.useState(null);
  const [showAddCard, setShowAddCard] = reactExports.useState(false);
  const [newFront, setNewFront] = reactExports.useState("");
  const [newBack, setNewBack] = reactExports.useState("");
  const [editDeckName, setEditDeckName] = reactExports.useState(false);
  const [deckNameInput, setDeckNameInput] = reactExports.useState("");
  const [showAddDeck, setShowAddDeck] = reactExports.useState(false);
  const [newDeckName, setNewDeckName] = reactExports.useState("");
  const deck = decks.find((d) => d.id === selectedDeckId) ?? decks[0];
  const deckStats = reactExports.useMemo(() => {
    if (!deck) return { total: 0, reviewedToday: 0, mastery: 0 };
    const total = deck.cards.length;
    const reviewedToday = deck.cards.filter(
      (c) => c.lastReviewDate === TODAY
    ).length;
    const mastered = deck.cards.filter((c) => c.reviewCount >= 3).length;
    const mastery = total > 0 ? Math.round(mastered / total * 100) : 0;
    return { total, reviewedToday, mastery };
  }, [deck]);
  const startStudy = () => {
    if (!deck) return;
    const hardCards = deck.cards.filter((c) => c.lastDifficulty === "Hard");
    const otherCards = deck.cards.filter((c) => c.lastDifficulty !== "Hard").sort(() => Math.random() - 0.5);
    const queue = [...hardCards, ...otherCards];
    setStudyQueue(queue);
    setStudyIndex(0);
    setFlipped(false);
    setStudyResults(null);
    setMode("study");
  };
  const handleDifficulty = (difficulty) => {
    if (!deck) return;
    const card = studyQueue[studyIndex];
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const updatedCard = {
      ...card,
      reviewCount: card.reviewCount + 1,
      lastDifficulty: difficulty,
      lastReviewDate: today,
      known: difficulty !== "Hard"
    };
    const updatedDecks = decks.map(
      (d) => d.id === deck.id ? {
        ...d,
        cards: d.cards.map((c) => c.id === card.id ? updatedCard : c)
      } : d
    );
    saveDecks(updatedDecks);
    setFlipped(false);
    const next = studyIndex + 1;
    if (difficulty === "Hard") {
      const newQueue = [...studyQueue];
      newQueue.splice(studyIndex, 1);
      newQueue.push(updatedCard);
      if (newQueue.length === 0) {
        setStudyResults({ known: 0, again: 0 });
      } else {
        setStudyQueue(newQueue);
        setStudyIndex(0);
      }
    } else if (next >= studyQueue.length) {
      const knownN = studyQueue.filter((c, i) => i !== studyIndex && c.known).length + 1;
      setStudyResults({ known: knownN, again: studyQueue.length - knownN });
    } else {
      setStudyIndex(next);
    }
  };
  const addCard = () => {
    if (!newFront.trim() || !newBack.trim() || !deck) return;
    const card = {
      id: Date.now(),
      front: newFront,
      back: newBack,
      known: false,
      reviewCount: 0,
      lastDifficulty: null,
      lastReviewDate: null
    };
    const updatedDecks = decks.map(
      (d) => d.id === deck.id ? { ...d, cards: [...d.cards, card] } : d
    );
    saveDecks(updatedDecks);
    setNewFront("");
    setNewBack("");
    setShowAddCard(false);
    ue.success("Card added ✓");
  };
  const saveDeckName = () => {
    if (!deck) return;
    const updatedDecks = decks.map(
      (d) => d.id === deck.id ? { ...d, name: deckNameInput } : d
    );
    saveDecks(updatedDecks);
    setEditDeckName(false);
    ue.success("Saved to chain ✓");
  };
  const addDeck = () => {
    if (!newDeckName.trim()) return;
    const nd = { id: Date.now(), name: newDeckName, cards: [] };
    saveDecks([...decks, nd]);
    setSelectedDeckId(nd.id);
    setNewDeckName("");
    setShowAddDeck(false);
    ue.success("Deck created ✓");
  };
  const currentCard = studyQueue[studyIndex];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        height: "100%",
        background: "rgba(11,15,18,0.6)",
        color: "rgba(220,235,240,0.9)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              width: 200,
              flexShrink: 0,
              background: "rgba(10,16,20,0.7)",
              borderRight: "1px solid rgba(42,58,66,0.8)",
              display: "flex",
              flexDirection: "column"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    padding: "12px 10px 6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "rgba(180,200,210,0.4)"
                        },
                        children: "Decks"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowAddDeck(true),
                        "data-ocid": "flashcards.primary_button",
                        style: {
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: `${ACCENT}0.8)`,
                          padding: 2
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: decks.map((d) => {
                const kc = d.cards.filter((c) => c.known).length;
                const pct = d.cards.length > 0 ? kc / d.cards.length * 100 : 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedDeckId(d.id);
                      setMode("deck");
                    },
                    "data-ocid": "flashcards.tab",
                    style: {
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      cursor: "pointer",
                      background: selectedDeckId === d.id ? `${ACCENT}0.1)` : "transparent",
                      borderLeft: `2px solid ${selectedDeckId === d.id ? `${ACCENT}0.8)` : "transparent"}`,
                      border: "none"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            fontSize: 12,
                            fontWeight: 600,
                            color: "rgba(220,235,240,0.9)",
                            marginBottom: 3
                          },
                          children: d.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            fontSize: 10,
                            color: "rgba(180,200,210,0.4)",
                            marginBottom: 5
                          },
                          children: [
                            d.cards.length,
                            " cards · ",
                            kc,
                            " known"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            height: 3,
                            borderRadius: 99,
                            background: "var(--os-border-subtle)",
                            overflow: "hidden"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                height: "100%",
                                width: `${pct}%`,
                                background: `${ACCENT}0.8)`,
                                borderRadius: 99,
                                transition: "width 0.3s"
                              }
                            }
                          )
                        }
                      )
                    ]
                  },
                  d.id
                );
              }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0
            },
            children: [
              mode === "deck" && deck && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(42,58,66,0.8)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0
                    },
                    children: [
                      editDeckName ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          value: deckNameInput,
                          onChange: (e) => setDeckNameInput(e.target.value),
                          onKeyDown: (e) => e.key === "Enter" && saveDeckName(),
                          style: {
                            flex: 1,
                            background: "var(--os-border-subtle)",
                            border: "1px solid rgba(42,58,66,0.8)",
                            borderRadius: 6,
                            padding: "4px 8px",
                            fontSize: 14,
                            fontWeight: 700,
                            color: "rgba(220,235,240,0.9)",
                            outline: "none"
                          }
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "h2",
                        {
                          style: { flex: 1, fontSize: 15, fontWeight: 700, margin: 0 },
                          children: deck.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setEditDeckName(!editDeckName);
                            setDeckNameInput(deck.name);
                          },
                          "data-ocid": "flashcards.edit_button",
                          style: {
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "rgba(180,200,210,0.4)",
                            padding: 4
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setShowAddCard(true),
                          "data-ocid": "flashcards.secondary_button",
                          style: {
                            fontSize: 11,
                            padding: "4px 10px",
                            borderRadius: 6,
                            border: "1px solid rgba(42,58,66,0.6)",
                            background: "var(--os-border-subtle)",
                            color: "rgba(180,200,210,0.7)",
                            cursor: "pointer"
                          },
                          children: "+ Card"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: startStudy,
                          "data-ocid": "flashcards.open_modal_button",
                          style: {
                            fontSize: 11,
                            padding: "4px 12px",
                            borderRadius: 6,
                            background: `${ACCENT}0.15)`,
                            border: `1px solid ${ACCENT}0.5)`,
                            color: `${ACCENT}1)`,
                            cursor: "pointer"
                          },
                          children: "Study"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 8,
                      padding: "10px 16px",
                      borderBottom: "1px solid rgba(42,58,66,0.4)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              fontSize: 16,
                              fontWeight: 700,
                              color: `${ACCENT}1)`
                            },
                            children: deckStats.total
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(180,200,210,0.4)" }, children: "Total Cards" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              fontSize: 16,
                              fontWeight: 700,
                              color: "rgba(39,215,224,1)"
                            },
                            children: deckStats.reviewedToday
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(180,200,210,0.4)" }, children: "Reviewed Today" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            style: {
                              fontSize: 16,
                              fontWeight: 700,
                              color: "rgba(34,197,94,1)"
                            },
                            children: [
                              deckStats.mastery,
                              "%"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(180,200,210,0.4)" }, children: "Mastery" })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: 16 }, children: deck.cards.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "flashcards.empty_state",
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      gap: 12,
                      color: "rgba(180,200,210,0.3)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13 }, children: "No cards yet" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setShowAddCard(true),
                          style: {
                            fontSize: 12,
                            padding: "6px 16px",
                            borderRadius: 6,
                            background: `${ACCENT}0.12)`,
                            border: `1px solid ${ACCENT}0.4)`,
                            color: `${ACCENT}1)`,
                            cursor: "pointer"
                          },
                          children: "Add your first card"
                        }
                      )
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: { display: "flex", flexDirection: "column", gap: 6 },
                    children: deck.cards.map((card, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `flashcards.item.${i + 1}`,
                        style: {
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: `1px solid ${card.lastDifficulty === "Hard" ? "rgba(239,68,68,0.3)" : card.known ? `${ACCENT}0.2)` : "rgba(42,58,66,0.6)"}`,
                          background: card.lastDifficulty === "Hard" ? "rgba(239,68,68,0.05)" : card.known ? `${ACCENT}0.05)` : "rgba(18,32,38,0.5)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                style: {
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: "rgba(220,235,240,0.9)",
                                  marginBottom: 2
                                },
                                children: card.front
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                style: {
                                  fontSize: 11,
                                  color: "rgba(180,200,210,0.4)",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis"
                                },
                                children: card.back
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginLeft: 8
                              },
                              children: [
                                card.reviewCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "span",
                                  {
                                    style: {
                                      fontSize: 10,
                                      color: "rgba(180,200,210,0.4)"
                                    },
                                    children: [
                                      card.reviewCount,
                                      "×"
                                    ]
                                  }
                                ),
                                card.lastDifficulty && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    style: {
                                      fontSize: 9,
                                      padding: "1px 5px",
                                      borderRadius: 4,
                                      background: card.lastDifficulty === "Easy" ? "rgba(34,197,94,0.15)" : card.lastDifficulty === "Medium" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                                      color: card.lastDifficulty === "Easy" ? "rgba(34,197,94,0.9)" : card.lastDifficulty === "Medium" ? "rgba(245,158,11,0.9)" : "rgba(239,68,68,0.9)"
                                    },
                                    children: card.lastDifficulty
                                  }
                                ),
                                card.known && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  CircleCheckBig,
                                  {
                                    className: "w-4 h-4",
                                    style: { color: `${ACCENT}0.7)` }
                                  }
                                )
                              ]
                            }
                          )
                        ]
                      },
                      card.id
                    ))
                  }
                ) }),
                showAddCard && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                    "data-ocid": "flashcards.modal",
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
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "h3",
                            {
                              style: { fontSize: 14, fontWeight: 700, marginBottom: 16 },
                              children: "Add Card"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "label",
                              {
                                htmlFor: "fc-front",
                                style: {
                                  fontSize: 11,
                                  color: "rgba(180,200,210,0.5)",
                                  display: "block",
                                  marginBottom: 4
                                },
                                children: "Front"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "textarea",
                              {
                                id: "fc-front",
                                value: newFront,
                                onChange: (e) => setNewFront(e.target.value),
                                "data-ocid": "flashcards.textarea",
                                rows: 2,
                                style: {
                                  width: "100%",
                                  background: "var(--os-border-subtle)",
                                  border: "1px solid rgba(42,58,66,0.8)",
                                  borderRadius: 6,
                                  padding: "7px 10px",
                                  fontSize: 12,
                                  color: "rgba(220,235,240,0.9)",
                                  outline: "none",
                                  resize: "none",
                                  boxSizing: "border-box"
                                }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "label",
                              {
                                htmlFor: "fc-back",
                                style: {
                                  fontSize: 11,
                                  color: "rgba(180,200,210,0.5)",
                                  display: "block",
                                  marginBottom: 4
                                },
                                children: "Back"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "textarea",
                              {
                                id: "fc-back",
                                value: newBack,
                                onChange: (e) => setNewBack(e.target.value),
                                rows: 3,
                                style: {
                                  width: "100%",
                                  background: "var(--os-border-subtle)",
                                  border: "1px solid rgba(42,58,66,0.8)",
                                  borderRadius: 6,
                                  padding: "7px 10px",
                                  fontSize: 12,
                                  color: "rgba(220,235,240,0.9)",
                                  outline: "none",
                                  resize: "none",
                                  boxSizing: "border-box"
                                }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: addCard,
                                "data-ocid": "flashcards.save_button",
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
                                children: "Add Card"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => setShowAddCard(false),
                                "data-ocid": "flashcards.cancel_button",
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
                ),
                showAddDeck && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                    "data-ocid": "flashcards.dialog",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: "rgba(14,20,26,0.98)",
                          border: `1px solid ${ACCENT}0.3)`,
                          borderRadius: 12,
                          padding: 24,
                          width: 300
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "h3",
                            {
                              style: { fontSize: 14, fontWeight: 700, marginBottom: 16 },
                              children: "New Deck"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "text",
                              value: newDeckName,
                              onChange: (e) => setNewDeckName(e.target.value),
                              placeholder: "Deck name",
                              "data-ocid": "flashcards.input",
                              style: {
                                width: "100%",
                                background: "var(--os-border-subtle)",
                                border: "1px solid rgba(42,58,66,0.8)",
                                borderRadius: 6,
                                padding: "7px 10px",
                                fontSize: 12,
                                color: "rgba(220,235,240,0.9)",
                                outline: "none",
                                boxSizing: "border-box",
                                marginBottom: 16
                              }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: addDeck,
                                "data-ocid": "flashcards.confirm_button",
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
                                children: "Create"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => setShowAddDeck(false),
                                "data-ocid": "flashcards.close_button",
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
              ] }),
              mode === "study" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                    gap: 24
                  },
                  children: studyResults ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: "🎉" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 18, fontWeight: 700, marginBottom: 8 }, children: "Deck complete!" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        style: {
                          fontSize: 13,
                          color: "rgba(180,200,210,0.6)",
                          marginBottom: 20
                        },
                        children: [
                          "You got",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: `${ACCENT}1)`, fontWeight: 700 }, children: studyResults.known }),
                          " ",
                          "of ",
                          studyQueue.length,
                          " cards"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: startStudy,
                          "data-ocid": "flashcards.primary_button",
                          style: {
                            padding: "8px 20px",
                            borderRadius: 8,
                            background: `${ACCENT}0.15)`,
                            border: `1px solid ${ACCENT}0.5)`,
                            color: `${ACCENT}1)`,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5 inline mr-1" }),
                            "Study Again"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setMode("deck"),
                          "data-ocid": "flashcards.secondary_button",
                          style: {
                            padding: "8px 20px",
                            borderRadius: 8,
                            border: "1px solid rgba(42,58,66,0.6)",
                            background: "transparent",
                            color: "rgba(180,200,210,0.6)",
                            fontSize: 12,
                            cursor: "pointer"
                          },
                          children: "Back to Deck"
                        }
                      )
                    ] })
                  ] }) : currentCard ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(180,200,210,0.4)" }, children: [
                      studyIndex + 1,
                      " / ",
                      studyQueue.length,
                      " cards"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setFlipped((f) => !f),
                        style: {
                          perspective: 1e3,
                          cursor: "pointer",
                          width: "100%",
                          maxWidth: 440,
                          height: 200,
                          background: "none",
                          border: "none",
                          padding: 0
                        },
                        "data-ocid": "flashcards.canvas_target",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            style: {
                              position: "relative",
                              width: "100%",
                              height: "100%",
                              transition: "transform 0.5s",
                              transformStyle: "preserve-3d",
                              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  style: {
                                    position: "absolute",
                                    inset: 0,
                                    backfaceVisibility: "hidden",
                                    background: "rgba(18,32,38,0.9)",
                                    border: `1px solid ${ACCENT}0.3)`,
                                    borderRadius: 16,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 24,
                                    boxShadow: `0 0 40px ${ACCENT}0.08)`
                                  },
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "div",
                                      {
                                        style: {
                                          fontSize: 10,
                                          color: `${ACCENT}0.6)`,
                                          marginBottom: 12,
                                          textTransform: "uppercase",
                                          letterSpacing: 1
                                        },
                                        children: "Question"
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "p",
                                      {
                                        style: {
                                          fontSize: 16,
                                          fontWeight: 600,
                                          textAlign: "center",
                                          color: "rgba(220,235,240,0.9)"
                                        },
                                        children: currentCard.front
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "p",
                                      {
                                        style: {
                                          fontSize: 10,
                                          color: "rgba(180,200,210,0.3)",
                                          marginTop: 16
                                        },
                                        children: "Click to reveal"
                                      }
                                    )
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  style: {
                                    position: "absolute",
                                    inset: 0,
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)",
                                    background: `${ACCENT}0.06)`,
                                    border: `1px solid ${ACCENT}0.4)`,
                                    borderRadius: 16,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 24
                                  },
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "div",
                                      {
                                        style: {
                                          fontSize: 10,
                                          color: `${ACCENT}0.6)`,
                                          marginBottom: 12,
                                          textTransform: "uppercase",
                                          letterSpacing: 1
                                        },
                                        children: "Answer"
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "p",
                                      {
                                        style: {
                                          fontSize: 14,
                                          textAlign: "center",
                                          color: "rgba(220,235,240,0.85)",
                                          lineHeight: 1.6
                                        },
                                        children: currentCard.back
                                      }
                                    )
                                  ]
                                }
                              )
                            ]
                          }
                        )
                      }
                    ),
                    flipped && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleDifficulty("Hard"),
                          "data-ocid": "flashcards.delete_button",
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            borderRadius: 8,
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            color: "rgba(239,68,68,0.9)",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
                            " Hard"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleDifficulty("Medium"),
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            borderRadius: 8,
                            background: "rgba(245,158,11,0.1)",
                            border: "1px solid rgba(245,158,11,0.3)",
                            color: "rgba(245,158,11,0.9)",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer"
                          },
                          children: "Medium"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleDifficulty("Easy"),
                          "data-ocid": "flashcards.confirm_button",
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            borderRadius: 8,
                            background: "rgba(34,197,94,0.1)",
                            border: "1px solid rgba(34,197,94,0.3)",
                            color: "rgba(34,197,94,0.9)",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
                            " Easy"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setMode("deck"),
                        "data-ocid": "flashcards.close_button",
                        style: {
                          fontSize: 11,
                          color: "rgba(180,200,210,0.3)",
                          background: "none",
                          border: "none",
                          cursor: "pointer"
                        },
                        children: "Exit study mode"
                      }
                    )
                  ] }) : null
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  FlashcardApp
};
