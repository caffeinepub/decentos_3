import { r as reactExports, j as jsxRuntimeExports, B as BookOpen, e as ChevronLeft } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const MOODS = ["😊", "😐", "😔", "🔥", "😴"];
const MOOD_LABELS = ["Happy", "Neutral", "Sad", "Energized", "Tired"];
const SAMPLE_ENTRIES = [
  {
    id: "1",
    date: "2026-03-24",
    mood: "🔥",
    title: "Launched on the blockchain",
    body: "Today DecentOS went live. It felt surreal — a full operating system running entirely on-chain. No servers, no central authority. Just pure decentralization.\n\nThe deployment was smooth. Cycles usage is reasonable. The glassmorphic UI looks stunning on both desktop and iPad."
  },
  {
    id: "2",
    date: "2026-03-23",
    mood: "😊",
    title: "App store is growing",
    body: "Added six new apps to the marketplace today: Contact Manager, Journal, Budget Tracker, Markdown Viewer, Unit Converter, and Habit Tracker.\n\nUsers can now install them directly from the App Store."
  },
  {
    id: "3",
    date: "2026-03-20",
    mood: "😐",
    title: "Browser limitations",
    body: "Had a long debugging session trying to get the browser to load modern websites. ICP HTTP outcalls just can't execute JavaScript. It's a platform constraint, not a bug.\n\nUpdated the UI to set expectations. Moving on."
  }
];
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function Journal() {
  const {
    data: persistedEntries,
    set: saveEntries,
    loading
  } = useCanisterKV("decentos_journal", SAMPLE_ENTRIES);
  const [entries, setEntries] = reactExports.useState(SAMPLE_ENTRIES);
  const [selected, setSelected] = reactExports.useState(null);
  const [composing, setComposing] = reactExports.useState(false);
  const [mood, setMood] = reactExports.useState(MOODS[0]);
  const [title, setTitle] = reactExports.useState("");
  const [body, setBody] = reactExports.useState("");
  const hydratedRef = reactExports.useRef(false);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  reactExports.useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (persistedEntries.length > 0) setEntries(persistedEntries);
  }, [loading, persistedEntries]);
  const startNew = () => {
    setMood(MOODS[0]);
    setTitle("");
    setBody("");
    setSelected(null);
    setComposing(true);
  };
  const saveEntry = () => {
    if (!title.trim() && !body.trim()) return;
    const entry = {
      id: Date.now().toString(),
      date: today,
      mood,
      title: title || "Untitled",
      body
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setSelected(entry);
    setComposing(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: { background: "rgba(11,15,18,0.6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-52 flex-shrink-0 flex flex-col border-r",
        style: {
          borderColor: "rgba(42,58,66,0.8)",
          background: "rgba(10,16,20,0.7)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-3 border-b flex items-center justify-between",
              style: { borderColor: "rgba(42,58,66,0.8)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[11px] font-semibold uppercase tracking-widest",
                    style: { color: "rgba(139,92,246,0.7)" },
                    children: "Journal"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: startNew,
                    "data-ocid": "journal.primary_button",
                    className: "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                    style: {
                      background: "rgba(139,92,246,0.15)",
                      border: "1px solid rgba(139,92,246,0.3)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Plus,
                      {
                        className: "w-3.5 h-3.5",
                        style: { color: "rgba(167,139,250,0.9)" }
                      }
                    )
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto py-1", children: [
            entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center h-24 gap-1",
                "data-ocid": "journal.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    BookOpen,
                    {
                      className: "w-6 h-6",
                      style: { color: "rgba(139,92,246,0.2)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[11px]",
                      style: { color: "rgba(180,200,210,0.3)" },
                      children: "No entries yet"
                    }
                  )
                ]
              }
            ),
            entries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setSelected(e);
                  setComposing(false);
                },
                "data-ocid": `journal.item.${i + 1}`,
                className: "w-full text-left px-3 py-2.5 transition-colors",
                style: (selected == null ? void 0 : selected.id) === e.id ? {
                  background: "rgba(139,92,246,0.1)",
                  borderLeft: "2px solid rgba(139,92,246,0.6)"
                } : { borderLeft: "2px solid transparent" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: e.mood }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px]",
                        style: { color: "rgba(180,200,210,0.35)" },
                        children: formatDate(e.date)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs font-medium truncate",
                      style: { color: "rgba(220,235,240,0.8)" },
                      children: e.title
                    }
                  )
                ]
              },
              e.id
            ))
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col min-w-0", children: composing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col p-5 gap-4 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setComposing(false),
            className: "w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors",
            "data-ocid": "journal.close_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChevronLeft,
              {
                className: "w-4 h-4",
                style: { color: "rgba(180,200,210,0.5)" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs",
            style: { color: "rgba(180,200,210,0.4)" },
            children: formatDate(today)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-[11px] mb-2",
            style: { color: "rgba(180,200,210,0.5)" },
            children: "How are you feeling?"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: MOODS.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMood(m),
            "data-ocid": "journal.mood.toggle",
            title: MOOD_LABELS[idx],
            className: "w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all",
            style: mood === m ? {
              background: "rgba(139,92,246,0.2)",
              border: "1px solid rgba(139,92,246,0.5)"
            } : {
              background: "var(--os-border-subtle)",
              border: "1px solid rgba(42,58,66,0.5)"
            },
            children: m
          },
          m
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Entry title...",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          "data-ocid": "journal.input",
          className: "w-full h-9 px-3 rounded-md text-sm font-medium bg-white/5 border outline-none",
          style: {
            border: "1px solid rgba(42,58,66,0.8)",
            color: "rgba(220,235,240,0.95)"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          placeholder: "Write your thoughts...",
          value: body,
          onChange: (e) => setBody(e.target.value),
          "data-ocid": "journal.textarea",
          className: "flex-1 min-h-[160px] w-full px-3 py-2.5 rounded-md text-xs bg-white/5 border outline-none resize-none leading-relaxed",
          style: {
            border: "1px solid rgba(42,58,66,0.8)",
            color: "rgba(220,235,240,0.85)"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: saveEntry,
          "data-ocid": "journal.submit_button",
          className: "self-end px-5 h-8 rounded-lg text-xs font-semibold transition-all",
          style: {
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.4)",
            color: "rgba(167,139,250,1)"
          },
          children: "Save Entry"
        }
      )
    ] }) : selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-5 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: selected.mood }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-sm font-semibold",
              style: { color: "rgba(220,235,240,0.95)" },
              children: selected.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-[10px]",
              style: { color: "rgba(180,200,210,0.4)" },
              children: formatDate(selected.date)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs leading-relaxed whitespace-pre-wrap",
          style: { color: "rgba(180,200,210,0.7)" },
          children: selected.body
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-14 h-14 rounded-2xl flex items-center justify-center",
          style: {
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.2)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            BookOpen,
            {
              className: "w-7 h-7",
              style: { color: "rgba(139,92,246,0.6)" }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "rgba(180,200,210,0.35)" }, children: "Select an entry or write a new one" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: startNew,
          "data-ocid": "journal.open_modal_button",
          className: "mt-1 px-4 h-8 rounded-lg text-xs font-semibold transition-all",
          style: {
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "rgba(167,139,250,0.9)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 inline mr-1" }),
            "New Entry"
          ]
        }
      )
    ] }) })
  ] });
}
export {
  Journal
};
