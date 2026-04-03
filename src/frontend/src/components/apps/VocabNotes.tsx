import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface VocabPair {
  id: string;
  word: string;
  definition: string;
}

export function VocabNotes({
  windowProps: _windowProps,
}: { windowProps?: Record<string, unknown> }) {
  const { data: pairs, set: setPairs } = useCanisterKV<VocabPair[]>(
    "decentos_vocab_notes",
    [],
  );
  const [mode, setMode] = useState<"list" | "quiz">("list");
  const [newWord, setNewWord] = useState("");
  const [newDef, setNewDef] = useState("");
  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizInput, setQuizInput] = useState("");
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const addPair = () => {
    if (!newWord.trim() || !newDef.trim()) return;
    const pair: VocabPair = {
      id: Date.now().toString(),
      word: newWord.trim(),
      definition: newDef.trim(),
    };
    const updated = [...pairs, pair];
    setPairs(updated);
    setNewWord("");
    setNewDef("");
  };

  const deletePair = (id: string) => {
    const updated = pairs.filter((p) => p.id !== id);
    setPairs(updated);
  };

  const checkAnswer = () => {
    if (!pairs.length) return;
    const current = pairs[quizIndex % pairs.length];
    const isCorrect =
      quizInput.trim().toLowerCase() === current.definition.toLowerCase();
    setQuizResult(isCorrect ? "correct" : "wrong");
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextCard = () => {
    setQuizIndex((prev) => (prev + 1) % Math.max(1, pairs.length));
    setQuizInput("");
    setQuizResult(null);
  };

  const sectionStyle = {
    background: "rgba(18,32,38,0.6)",
    border: "1px solid rgba(42,58,66,0.7)",
  };

  const currentCard = pairs.length ? pairs[quizIndex % pairs.length] : null;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "rgba(11,15,18,0.7)" }}
      data-ocid="vocabnotes.panel"
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0"
        style={{
          borderColor: "rgba(42,58,66,0.8)",
          background: "rgba(18,32,38,0.5)",
        }}
      >
        <div>
          <h2 className="text-sm font-semibold os-cyan-text">Vocab Notes</h2>
          <p className="text-[10px] text-muted-foreground">
            {pairs.length} words saved
          </p>
        </div>
        <div className="flex items-center gap-1">
          {(["list", "quiz"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              data-ocid={`vocabnotes.${m}.tab`}
              className="px-3 py-1 rounded text-xs capitalize transition-colors"
              style={{
                background:
                  mode === m
                    ? "rgba(39,215,224,0.15)"
                    : "var(--os-border-subtle)",
                border:
                  mode === m
                    ? "1px solid rgba(39,215,224,0.5)"
                    : "1px solid rgba(42,58,66,0.5)",
                color:
                  mode === m
                    ? "rgba(39,215,224,0.9)"
                    : "var(--os-text-secondary)",
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {mode === "list" && (
        <>
          {/* Add Pair */}
          <div
            className="px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(42,58,66,0.4)" }}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                data-ocid="vocabnotes.input"
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none rounded px-2.5 py-1.5"
                style={sectionStyle}
              />
              <input
                type="text"
                placeholder="Definition"
                value={newDef}
                onChange={(e) => setNewDef(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPair()}
                data-ocid="vocabnotes.textarea"
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none rounded px-2.5 py-1.5"
                style={sectionStyle}
              />
              <button
                type="button"
                onClick={addPair}
                data-ocid="vocabnotes.primary_button"
                className="px-3 py-1.5 rounded text-xs flex-shrink-0 transition-colors"
                style={{
                  background: "rgba(39,215,224,0.12)",
                  border: "1px solid rgba(39,215,224,0.35)",
                  color: "rgba(39,215,224,0.9)",
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Pairs list */}
          <div className="flex-1 overflow-y-auto p-4">
            {pairs.length === 0 ? (
              <div
                className="flex items-center justify-center h-full text-muted-foreground/30 text-xs"
                data-ocid="vocabnotes.empty_state"
              >
                No words yet. Add some above!
              </div>
            ) : (
              <div className="space-y-1.5">
                {pairs.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between rounded-lg px-3 py-2 gap-3"
                    style={sectionStyle}
                    data-ocid={`vocabnotes.item.${i + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold os-cyan-text">
                        {p.word}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {p.definition}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deletePair(p.id)}
                      data-ocid={`vocabnotes.delete_button.${i + 1}`}
                      className="text-muted-foreground/40 hover:text-destructive transition-colors mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {mode === "quiz" && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center gap-4">
          {pairs.length === 0 ? (
            <p className="text-xs text-muted-foreground/40">
              Add some words first in List mode.
            </p>
          ) : (
            <>
              {/* Score */}
              <div className="text-[10px] text-muted-foreground mb-2">
                Score:{" "}
                <span className="os-cyan-text font-mono">
                  {score.correct}/{score.total}
                </span>
              </div>

              {/* Card */}
              <div
                className="w-full max-w-sm rounded-xl p-6 text-center"
                style={{
                  background: "rgba(18,32,38,0.8)",
                  border: "1px solid rgba(39,215,224,0.2)",
                }}
                data-ocid="vocabnotes.card"
              >
                <p className="text-base font-bold os-cyan-text mb-1">
                  {currentCard?.word}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Card {(quizIndex % pairs.length) + 1} of {pairs.length}
                </p>
              </div>

              {/* Answer input */}
              {quizResult === null ? (
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="Type the definition…"
                    value={quizInput}
                    onChange={(e) => setQuizInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                    data-ocid="vocabnotes.input"
                    className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none rounded px-3 py-2"
                    style={sectionStyle}
                  />
                  <button
                    type="button"
                    onClick={checkAnswer}
                    data-ocid="vocabnotes.submit_button"
                    className="px-3 py-2 rounded text-xs flex-shrink-0 transition-colors"
                    style={{
                      background: "rgba(39,215,224,0.12)",
                      border: "1px solid rgba(39,215,224,0.35)",
                      color: "rgba(39,215,224,0.9)",
                    }}
                  >
                    Check
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="text-lg font-bold"
                    style={{
                      color:
                        quizResult === "correct"
                          ? "rgba(74,222,128,0.9)"
                          : "rgba(251,113,133,0.9)",
                    }}
                  >
                    {quizResult === "correct" ? "✓ Correct!" : "✗ Wrong"}
                  </div>
                  {quizResult === "wrong" && (
                    <p className="text-xs text-muted-foreground">
                      Answer:{" "}
                      <span className="text-foreground/80">
                        {currentCard?.definition}
                      </span>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={nextCard}
                    data-ocid="vocabnotes.secondary_button"
                    className="px-4 py-2 rounded text-xs transition-colors"
                    style={{
                      background: "rgba(39,215,224,0.1)",
                      border: "1px solid rgba(39,215,224,0.3)",
                      color: "rgba(39,215,224,0.85)",
                    }}
                  >
                    Next Card →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
