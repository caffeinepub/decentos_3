import {
  CheckCircle,
  Languages,
  Plus,
  Search,
  Shuffle,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface VocabEntry {
  id: string;
  word: string;
  translation: string;
  example: string;
  correct: number;
  attempts: number;
}

interface LangData {
  language: string;
  entries: VocabEntry[];
}

const DEFAULT_DATA: LangData = {
  language: "Spanish",
  entries: [
    {
      id: "e1",
      word: "Hola",
      translation: "Hello",
      example: "¡Hola, cómo estás?",
      correct: 3,
      attempts: 4,
    },
    {
      id: "e2",
      word: "Gracias",
      translation: "Thank you",
      example: "Muchas gracias por tu ayuda.",
      correct: 5,
      attempts: 5,
    },
    {
      id: "e3",
      word: "Por favor",
      translation: "Please",
      example: "¿Puedes ayudarme, por favor?",
      correct: 2,
      attempts: 3,
    },
  ],
};

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

type Tab = "list" | "add" | "quiz";

export function LanguageNotes() {
  const { data, set } = useCanisterKV<LangData>(
    "decentos_languagenotes",
    DEFAULT_DATA,
  );
  const [tab, setTab] = useState<Tab>("list");
  const [search, setSearch] = useState("");
  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newExample, setNewExample] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizInput, setQuizInput] = useState("");
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);
  const [quizOrder, setQuizOrder] = useState<string[]>([]);

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
    const entry: VocabEntry = {
      id: genId(),
      word: newWord.trim(),
      translation: newTranslation.trim(),
      example: newExample.trim(),
      correct: 0,
      attempts: 0,
    };
    set({ ...data, entries: [...data.entries, entry] });
    setNewWord("");
    setNewTranslation("");
    setNewExample("");
  };

  const deleteEntry = (id: string) =>
    set({ ...data, entries: data.entries.filter((e) => e.id !== id) });

  const filtered = data.entries.filter(
    (e) =>
      e.word.toLowerCase().includes(search.toLowerCase()) ||
      e.translation.toLowerCase().includes(search.toLowerCase()),
  );

  const totalAccuracy =
    data.entries.reduce((s, e) => s + e.attempts, 0) > 0
      ? Math.round(
          (data.entries.reduce((s, e) => s + e.correct, 0) /
            data.entries.reduce((s, e) => s + e.attempts, 0)) *
            100,
        )
      : 0;

  const currentQuizEntry =
    quizOrder.length > 0 && quizIndex < quizOrder.length
      ? data.entries.find((e) => e.id === quizOrder[quizIndex])
      : null;

  const handleQuizCheck = () => {
    if (!currentQuizEntry) return;
    const correct =
      quizInput.trim().toLowerCase() ===
      currentQuizEntry.translation.trim().toLowerCase();
    setQuizResult(correct);
    setQuizRevealed(true);
    set({
      ...data,
      entries: data.entries.map((e) =>
        e.id === currentQuizEntry.id
          ? {
              ...e,
              attempts: e.attempts + 1,
              correct: e.correct + (correct ? 1 : 0),
            }
          : e,
      ),
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
    border: "1px solid rgba(39,215,224,0.1)",
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "rgba(9,13,16,0.9)",
        color: "var(--os-text-primary)",
      }}
      data-ocid="languagenotes.panel"
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(39,215,224,0.15)",
          background: "rgba(18,32,38,0.6)",
        }}
      >
        <div className="flex items-center gap-2">
          <Languages
            className="w-4 h-4"
            style={{ color: "rgba(39,215,224,1)" }}
          />
          <input
            value={data.language}
            onChange={(e) => set({ ...data, language: e.target.value })}
            placeholder="Language name..."
            className="bg-transparent text-sm font-semibold outline-none tracking-wide w-32"
            style={{ color: "rgba(39,215,224,1)" }}
            data-ocid="languagenotes.input"
          />
        </div>
        <div
          className="flex items-center gap-3 text-xs"
          style={{ color: "var(--os-text-secondary)" }}
        >
          <span>{data.entries.length} words</span>
          <span>
            Accuracy:{" "}
            <span style={{ color: "rgba(39,215,224,1)" }}>
              {totalAccuracy}%
            </span>
          </span>
        </div>
      </div>
      <div
        className="flex border-b flex-shrink-0"
        style={{
          borderColor: "rgba(39,215,224,0.1)",
          background: "rgba(12,20,26,0.5)",
        }}
      >
        {(["list", "add", "quiz"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              if (t === "quiz") shuffleQuiz();
            }}
            data-ocid="languagenotes.tab"
            className="px-5 py-2 text-xs font-semibold capitalize transition-colors"
            style={{
              borderBottom:
                tab === t
                  ? "2px solid rgba(39,215,224,0.8)"
                  : "2px solid transparent",
              color: tab === t ? "rgba(39,215,224,1)" : "var(--os-text-muted)",
            }}
          >
            {t === "list"
              ? "Vocabulary"
              : t === "add"
                ? "Add Word"
                : "Quiz Mode"}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "list" && (
          <div className="flex flex-col gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2"
              style={panelStyle}
            >
              <Search
                className="w-3.5 h-3.5"
                style={{ color: "var(--os-text-muted)" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${data.language} words...`}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--os-text-secondary)" }}
                data-ocid="languagenotes.search_input"
              />
            </div>
            {filtered.length === 0 && (
              <div
                className="text-center py-8 text-sm"
                style={{ color: "var(--os-text-muted)" }}
                data-ocid="languagenotes.empty_state"
              >
                No words yet. Add some in the Add Word tab.
              </div>
            )}
            {filtered.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={panelStyle}
                data-ocid={`languagenotes.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "rgba(39,215,224,1)" }}
                    >
                      {entry.word}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--os-text-muted)" }}
                    >
                      →
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--os-text-secondary)" }}
                    >
                      {entry.translation}
                    </span>
                  </div>
                  {entry.example && (
                    <div
                      className="text-[11px] mt-0.5 truncate"
                      style={{ color: "var(--os-text-muted)" }}
                    >
                      {entry.example}
                    </div>
                  )}
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  {entry.attempts > 0
                    ? `${Math.round((entry.correct / entry.attempts) * 100)}%`
                    : ""}
                </div>
                <button
                  type="button"
                  onClick={() => deleteEntry(entry.id)}
                  data-ocid="languagenotes.delete_button"
                  className="p-1 rounded hover:bg-red-500/10 transition-colors flex-shrink-0"
                >
                  <Trash2
                    className="w-3.5 h-3.5"
                    style={{ color: "rgba(255,100,100,0.5)" }}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
        {tab === "add" && (
          <div className="flex flex-col gap-3 max-w-md">
            {(
              [
                {
                  label: `${data.language} Word`,
                  val: newWord,
                  sv: setNewWord,
                  ph: "e.g. Bonjour",
                },
                {
                  label: "English Translation",
                  val: newTranslation,
                  sv: setNewTranslation,
                  ph: "e.g. Hello",
                },
              ] as {
                label: string;
                val: string;
                sv: (v: string) => void;
                ph: string;
              }[]
            ).map(({ label, val, sv, ph }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <div
                  className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  {label}
                </div>
                <input
                  value={val}
                  onChange={(e) => sv(e.target.value)}
                  placeholder={ph}
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: "rgba(18,32,38,0.7)",
                    border: "1px solid rgba(39,215,224,0.15)",
                    color: "var(--os-text-primary)",
                  }}
                  data-ocid="languagenotes.input"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <div
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--os-text-secondary)" }}
              >
                Example Sentence (optional)
              </div>
              <textarea
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="e.g. Bonjour, comment ça va?"
                rows={2}
                className="px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={{
                  background: "rgba(18,32,38,0.7)",
                  border: "1px solid rgba(39,215,224,0.15)",
                  color: "var(--os-text-primary)",
                }}
                data-ocid="languagenotes.textarea"
              />
            </div>
            <button
              type="button"
              onClick={addEntry}
              disabled={!newWord.trim() || !newTranslation.trim()}
              data-ocid="languagenotes.submit_button"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background:
                  newWord && newTranslation
                    ? "rgba(39,215,224,0.15)"
                    : "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.25)",
                color:
                  newWord && newTranslation
                    ? "rgba(39,215,224,1)"
                    : "var(--os-text-muted)",
              }}
            >
              <Plus className="w-4 h-4" /> Add Word
            </button>
          </div>
        )}
        {tab === "quiz" && (
          <div className="flex flex-col items-center gap-4">
            {data.entries.length < 1 ? (
              <div
                className="text-center py-8 text-sm"
                style={{ color: "var(--os-text-muted)" }}
                data-ocid="languagenotes.empty_state"
              >
                Add some words first!
              </div>
            ) : quizIndex >= quizOrder.length ? (
              <div
                className="flex flex-col items-center gap-4 py-8"
                data-ocid="languagenotes.success_state"
              >
                <div className="text-4xl">🎉</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: "rgba(39,215,224,1)" }}
                >
                  Quiz Complete!
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  Overall accuracy: {totalAccuracy}%
                </div>
                <button
                  type="button"
                  onClick={shuffleQuiz}
                  data-ocid="languagenotes.primary_button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{
                    background: "rgba(39,215,224,0.15)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "rgba(39,215,224,1)",
                  }}
                >
                  <Shuffle className="w-4 h-4" /> Retry
                </button>
              </div>
            ) : currentQuizEntry ? (
              <div
                className="w-full max-w-sm flex flex-col gap-4"
                data-ocid="languagenotes.card"
              >
                <div
                  className="text-xs text-center"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  {quizIndex + 1} / {quizOrder.length}
                </div>
                <div
                  className="rounded-2xl p-6 text-center"
                  style={{
                    background: "rgba(18,32,38,0.7)",
                    border: "1px solid rgba(39,215,224,0.15)",
                  }}
                >
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: "rgba(39,215,224,1)" }}
                  >
                    {currentQuizEntry.word}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    {data.language}
                  </div>
                  {currentQuizEntry.example && (
                    <div
                      className="mt-3 text-xs italic"
                      style={{ color: "var(--os-text-muted)" }}
                    >
                      "{currentQuizEntry.example}"
                    </div>
                  )}
                </div>
                {!quizRevealed ? (
                  <div className="flex gap-2">
                    <input
                      value={quizInput}
                      onChange={(e) => setQuizInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleQuizCheck()}
                      placeholder="Type the English translation..."
                      className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: "rgba(18,32,38,0.7)",
                        border: "1px solid rgba(39,215,224,0.15)",
                        color: "var(--os-text-primary)",
                      }}
                      data-ocid="languagenotes.input"
                    />
                    <button
                      type="button"
                      onClick={handleQuizCheck}
                      data-ocid="languagenotes.submit_button"
                      className="px-4 py-2 rounded-lg text-sm font-semibold"
                      style={{
                        background: "rgba(39,215,224,0.15)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "rgba(39,215,224,1)",
                      }}
                    >
                      Check
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div
                      className="flex items-center gap-2 px-4 py-3 rounded-lg"
                      data-ocid="languagenotes.success_state"
                      style={{
                        background: quizResult
                          ? "rgba(39,215,224,0.08)"
                          : "rgba(255,100,100,0.08)",
                        border: `1px solid ${quizResult ? "rgba(39,215,224,0.3)" : "rgba(255,100,100,0.3)"}`,
                      }}
                    >
                      {quizResult ? (
                        <CheckCircle
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: "rgba(39,215,224,1)" }}
                        />
                      ) : (
                        <XCircle
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: "rgba(255,100,100,1)" }}
                        />
                      )}
                      <div>
                        <div
                          className="text-sm font-semibold"
                          style={{
                            color: quizResult
                              ? "rgba(39,215,224,1)"
                              : "rgba(255,120,120,1)",
                          }}
                        >
                          {quizResult ? "Correct!" : "Incorrect"}
                        </div>
                        {!quizResult && (
                          <div
                            className="text-xs mt-0.5"
                            style={{ color: "var(--os-text-secondary)" }}
                          >
                            Answer:{" "}
                            <span style={{ color: "var(--os-text-primary)" }}>
                              {currentQuizEntry.translation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleQuizNext}
                      data-ocid="languagenotes.primary_button"
                      className="px-4 py-2 rounded-lg text-sm font-semibold"
                      style={{
                        background: "rgba(39,215,224,0.15)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "rgba(39,215,224,1)",
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
