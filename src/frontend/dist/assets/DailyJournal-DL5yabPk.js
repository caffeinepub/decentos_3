import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as BookOpen, e as ChevronLeft, f as ChevronRight, g as ue } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M22 11v1a10 10 0 1 1-9-10", key: "ew0xw9" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }],
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }]
];
const SmilePlus = createLucideIcon("smile-plus", __iconNode);
const MOODS = [
  { emoji: "😄", label: "Great" },
  { emoji: "😊", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Low" },
  { emoji: "😢", label: "Rough" }
];
function formatDate(date) {
  return date.toISOString().split("T")[0];
}
function parseDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function friendlyDate(key) {
  const d = parseDate(key);
  return d.toLocaleDateString(void 0, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
function DailyJournal() {
  var _a;
  const { data, set: saveData } = useCanisterKV(
    "daily_journal_v1",
    {}
  );
  const dataRef = reactExports.useRef(data);
  dataRef.current = data;
  const [currentDate, setCurrentDate] = reactExports.useState(() => formatDate(/* @__PURE__ */ new Date()));
  const [draft, setDraft] = reactExports.useState("");
  const [draftMood, setDraftMood] = reactExports.useState(null);
  const [dirty, setDirty] = reactExports.useState(false);
  const prevDateRef = reactExports.useRef(currentDate);
  const entry = data[currentDate] ?? null;
  reactExports.useEffect(() => {
    if (prevDateRef.current !== currentDate) {
      prevDateRef.current = currentDate;
      setDraft((entry == null ? void 0 : entry.content) ?? "");
      setDraftMood((entry == null ? void 0 : entry.mood) ?? null);
      setDirty(false);
    }
  }, [currentDate, entry == null ? void 0 : entry.content, entry == null ? void 0 : entry.mood]);
  const wordCount = countWords(draft);
  const persistEntry = (content, mood) => {
    saveData({
      ...dataRef.current,
      [currentDate]: {
        content,
        mood,
        wordCount: countWords(content),
        updatedAt: Date.now()
      }
    });
  };
  const saveEntry = () => {
    if (!draft.trim() && draftMood === null) return;
    persistEntry(draft, draftMood);
    setDirty(false);
    ue.success("Journal entry saved ✓");
  };
  const goDay = (delta) => {
    const d = parseDate(currentDate);
    d.setDate(d.getDate() + delta);
    if (d > /* @__PURE__ */ new Date()) return;
    const newKey = formatDate(d);
    const newEntry = dataRef.current[newKey];
    setCurrentDate(newKey);
    setDraft((newEntry == null ? void 0 : newEntry.content) ?? "");
    setDraftMood((newEntry == null ? void 0 : newEntry.mood) ?? null);
    setDirty(false);
    prevDateRef.current = newKey;
  };
  const isToday = currentDate === formatDate(/* @__PURE__ */ new Date());
  const isFuture = parseDate(currentDate) > /* @__PURE__ */ new Date();
  reactExports.useEffect(() => {
    if (!dirty) return;
    const capturedDate = currentDate;
    const capturedDraft = draft;
    const capturedMood = draftMood;
    const t = setTimeout(() => {
      saveData({
        ...dataRef.current,
        [capturedDate]: {
          content: capturedDraft,
          mood: capturedMood,
          wordCount: countWords(capturedDraft),
          updatedAt: Date.now()
        }
      });
      setDirty(false);
    }, 1500);
    return () => clearTimeout(t);
  }, [dirty, draft, draftMood, currentDate, saveData]);
  const streak = (() => {
    var _a2, _b;
    let count = 0;
    const today = /* @__PURE__ */ new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = formatDate(d);
      if ((_b = (_a2 = data[key]) == null ? void 0 : _a2.content) == null ? void 0 : _b.trim()) count++;
      else break;
    }
    return count;
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--app-bg)", color: "var(--app-text)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: { borderColor: "var(--app-border)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 opacity-70" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Daily Journal" })
              ] }),
              streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-xs px-2 py-0.5 rounded-full font-medium",
                  style: {
                    background: "rgba(34,197,94,0.15)",
                    color: "rgba(34,197,94,0.9)"
                  },
                  children: [
                    "🔥 ",
                    streak,
                    " day streak"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-2 border-b",
            style: { borderColor: "var(--app-border)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => goDay(-1),
                  className: "p-1.5 rounded hover:bg-white/10 transition-colors",
                  "data-ocid": "journal.pagination_prev",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: friendlyDate(currentDate) }),
                isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] opacity-50 mt-0.5", children: "Today" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => goDay(1),
                  disabled: isToday,
                  className: "p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                  "data-ocid": "journal.pagination_next",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1 px-4 py-2 border-b",
            style: { borderColor: "var(--app-border)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SmilePlus, { className: "w-3.5 h-3.5 opacity-50 mr-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] opacity-50 mr-2", children: "Mood:" }),
              MOODS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setDraftMood(i === draftMood ? null : i);
                    setDirty(true);
                  },
                  title: m.label,
                  "data-ocid": `journal.mood.${i + 1}`,
                  className: "text-lg leading-none p-1 rounded transition-all",
                  style: {
                    opacity: draftMood === i ? 1 : 0.4,
                    transform: draftMood === i ? "scale(1.25)" : "scale(1)",
                    background: draftMood === i ? "var(--os-text-muted)" : "transparent"
                  },
                  children: m.emoji
                },
                m.label
              )),
              draftMood !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] opacity-60 ml-1", children: (_a = MOODS[draftMood]) == null ? void 0 : _a.label })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative", children: isFuture ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full opacity-40 text-sm", children: "Can't write entries for the future" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            className: "w-full h-full resize-none p-4 text-sm leading-relaxed bg-transparent outline-none",
            style: { color: "var(--app-text)" },
            placeholder: "What's on your mind today?",
            value: draft,
            onChange: (e) => {
              setDraft(e.target.value);
              setDirty(true);
            },
            "data-ocid": "journal.textarea"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-1.5 border-t text-[11px] opacity-50",
            style: { borderColor: "var(--app-border)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                wordCount,
                " words"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                dirty ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Unsaved…" }) : entry ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(34,197,94,0.8)" }, children: "Saved ✓" }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: saveEntry,
                    className: "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                    style: {
                      background: "rgba(99,102,241,0.15)",
                      color: "rgba(129,140,248,0.9)"
                    },
                    "data-ocid": "journal.save_button",
                    children: "Save"
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
  DailyJournal
};
