import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  GraduationCap,
  List,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type Category = "Behavioral" | "Technical" | "System Design" | "Culture";
type Status = "unreviewed" | "mastered" | "needs-work";

interface Question {
  id: string;
  category: Category;
  question: string;
  answer: string;
  status: Status;
}

const BG = "rgba(11,15,18,0.6)";
const SIDEBAR_BG = "rgba(10,16,20,0.7)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgba(39,215,224,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.45)";
const BTN_BG = "rgba(39,215,224,0.12)";
const BTN_BORDER = "rgba(39,215,224,0.3)";

const CATEGORY_COLORS: Record<Category, string> = {
  Behavioral: "rgba(168,85,247,0.8)",
  Technical: "rgba(39,215,224,0.8)",
  "System Design": "rgba(245,158,11,0.8)",
  Culture: "rgba(34,197,94,0.8)",
};

const CATEGORIES: Category[] = [
  "Behavioral",
  "Technical",
  "System Design",
  "Culture",
];

const INPUT_STYLE: React.CSSProperties = {
  background: "var(--os-border-subtle)",
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  color: TEXT,
  padding: "6px 10px",
  fontSize: 12,
  outline: "none",
  width: "100%",
};

export function InterviewPrep() {
  const { data: questions, set: setQuestions } = useCanisterKV<Question[]>(
    "decent-interview-prep",
    [],
  );
  const [mode, setMode] = useState<"list" | "flashcard">("list");
  const [filterCat, setFilterCat] = useState<Category | "All">("All");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    category: "Behavioral" as Category,
    question: "",
    answer: "",
  });
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const filtered = questions.filter(
    (q) => filterCat === "All" || q.category === filterCat,
  );
  const mastered = questions.filter((q) => q.status === "mastered").length;
  const progress =
    questions.length > 0 ? Math.round((mastered / questions.length) * 100) : 0;

  const addQuestion = () => {
    if (!form.question.trim()) return;
    const nq: Question = {
      id: `q_${Date.now()}`,
      ...form,
      status: "unreviewed",
    };
    setQuestions([...questions, nq]);
    setForm({ category: "Behavioral", question: "", answer: "" });
    setShowAdd(false);
  };

  const deleteQuestion = (id: string) =>
    setQuestions(questions.filter((q) => q.id !== id));

  const setStatus = (id: string, status: Status) =>
    setQuestions(questions.map((q) => (q.id === id ? { ...q, status } : q)));

  const flashcardDeck = filtered.filter((q) => q.status !== "mastered");
  const currentCard = flashcardDeck[cardIndex] ?? null;

  const nextCard = () => {
    setShowAnswer(false);
    setCardIndex((i) => (i + 1) % Math.max(flashcardDeck.length, 1));
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: BG, color: TEXT, fontSize: 13 }}
      data-ocid="interviewprep.panel"
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" style={{ color: CYAN }} />
            <span className="font-semibold text-sm">Interview Prep</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("list");
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={
                mode === "list"
                  ? {
                      background: BTN_BG,
                      border: `1px solid ${BTN_BORDER}`,
                      color: CYAN,
                    }
                  : {
                      background: "transparent",
                      border: `1px solid ${BORDER}`,
                      color: MUTED,
                    }
              }
              data-ocid="interviewprep.tab"
            >
              <List className="w-3 h-3 inline mr-1" />
              List
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("flashcard");
                setCardIndex(0);
                setShowAnswer(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={
                mode === "flashcard"
                  ? {
                      background: BTN_BG,
                      border: `1px solid ${BTN_BORDER}`,
                      color: CYAN,
                    }
                  : {
                      background: "transparent",
                      border: `1px solid ${BORDER}`,
                      color: MUTED,
                    }
              }
              data-ocid="interviewprep.tab"
            >
              Flashcard
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(!showAdd)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: BTN_BG,
                border: `1px solid ${BTN_BORDER}`,
                color: CYAN,
              }}
              data-ocid="interviewprep.primary_button"
            >
              <Plus className="w-3 h-3 inline mr-1" />
              Add Q&A
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <Progress value={progress} className="flex-1 h-1.5" />
          <span className="text-xs whitespace-nowrap" style={{ color: MUTED }}>
            {mastered}/{questions.length} mastered ({progress}%)
          </span>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div
          className="p-4 border-b"
          style={{ borderColor: BORDER, background: "rgba(10,16,20,0.8)" }}
          data-ocid="interviewprep.modal"
        >
          <div className="space-y-3">
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                CATEGORY
              </p>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Category })
                }
                style={INPUT_STYLE}
                data-ocid="interviewprep.select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                QUESTION
              </p>
              <textarea
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="Interview question..."
                style={{ ...INPUT_STYLE, minHeight: 60, resize: "vertical" }}
                data-ocid="interviewprep.textarea"
              />
            </div>
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                YOUR ANSWER
              </p>
              <textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                placeholder="Write your answer..."
                style={{ ...INPUT_STYLE, minHeight: 80, resize: "vertical" }}
                data-ocid="interviewprep.textarea"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addQuestion}
                disabled={!form.question.trim()}
                className="flex-1 py-2 rounded-lg text-xs font-medium"
                style={{
                  background: BTN_BG,
                  border: `1px solid ${BTN_BORDER}`,
                  color: CYAN,
                  opacity: form.question.trim() ? 1 : 0.5,
                }}
                data-ocid="interviewprep.save_button"
              >
                Add Question
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-lg text-xs"
                style={{
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                }}
                data-ocid="interviewprep.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div
        className="px-4 py-2 flex gap-2 border-b overflow-x-auto"
        style={{ borderColor: BORDER, background: SIDEBAR_BG }}
      >
        <button
          type="button"
          onClick={() => setFilterCat("All")}
          className="px-3 py-1 rounded-full text-xs whitespace-nowrap"
          style={{
            background: filterCat === "All" ? BTN_BG : "transparent",
            border: `1px solid ${filterCat === "All" ? BTN_BORDER : BORDER}`,
            color: filterCat === "All" ? CYAN : MUTED,
          }}
          data-ocid="interviewprep.tab"
        >
          All ({questions.length})
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilterCat(c)}
            className="px-3 py-1 rounded-full text-xs whitespace-nowrap"
            style={{
              background: filterCat === c ? BTN_BG : "transparent",
              border: `1px solid ${filterCat === c ? BTN_BORDER : BORDER}`,
              color: filterCat === c ? CYAN : MUTED,
            }}
            data-ocid="interviewprep.tab"
          >
            {c} ({questions.filter((q) => q.category === c).length})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {mode === "flashcard" ? (
          flashcardDeck.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full"
              style={{ color: MUTED }}
              data-ocid="interviewprep.empty_state"
            >
              <CheckCircle2
                className="w-12 h-12 mb-3"
                style={{ color: "rgba(34,197,94,0.5)" }}
              />
              <p className="text-sm font-medium" style={{ color: TEXT }}>
                All mastered!
              </p>
              <p className="text-xs mt-1">
                Switch to list view to review all Q&As
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs" style={{ color: MUTED }}>
                {cardIndex + 1} / {flashcardDeck.length} remaining
              </p>
              <button
                type="button"
                className="w-full max-w-lg p-6 rounded-2xl cursor-pointer transition-all text-left"
                style={{
                  background: "rgba(10,16,20,0.8)",
                  border: `1px solid ${BORDER}`,
                  minHeight: 200,
                }}
                onClick={() => setShowAnswer(!showAnswer)}
                data-ocid="interviewprep.card"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    style={{
                      background: "rgba(39,215,224,0.12)",
                      color: CATEGORY_COLORS[currentCard.category],
                      border: "none",
                      fontSize: 10,
                    }}
                  >
                    {currentCard.category}
                  </Badge>
                </div>
                <p className="text-sm font-medium mb-4" style={{ color: TEXT }}>
                  {currentCard.question}
                </p>
                {showAnswer ? (
                  <div>
                    <div
                      className="border-t pt-4"
                      style={{ borderColor: BORDER }}
                    >
                      <p
                        className="text-xs font-semibold mb-2"
                        style={{ color: CYAN }}
                      >
                        ANSWER
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "rgba(220,235,240,0.8)" }}
                      >
                        {currentCard.answer || "No answer written yet."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: MUTED }}>
                    Tap to reveal answer
                  </p>
                )}
              </button>
              {showAnswer && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus(currentCard.id, "needs-work");
                      nextCard();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                      background: "rgba(248,113,113,0.12)",
                      border: "1px solid rgba(248,113,113,0.3)",
                      color: "rgba(248,113,113,0.9)",
                    }}
                    data-ocid="interviewprep.button"
                  >
                    <XCircle className="w-4 h-4" /> Needs Work
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus(currentCard.id, "mastered");
                      nextCard();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "rgba(34,197,94,0.9)",
                    }}
                    data-ocid="interviewprep.button"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mastered
                  </button>
                  <button
                    type="button"
                    onClick={nextCard}
                    className="px-4 py-2 rounded-xl text-sm"
                    style={{
                      background: BTN_BG,
                      border: `1px solid ${BTN_BORDER}`,
                      color: CYAN,
                    }}
                    data-ocid="interviewprep.button"
                  >
                    Skip →
                  </button>
                </div>
              )}
            </div>
          )
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full"
            style={{ color: MUTED }}
            data-ocid="interviewprep.empty_state"
          >
            <GraduationCap className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No questions yet</p>
            <p className="text-xs mt-1">Add your first Q&A above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((q, i) => (
              <div
                key={q.id}
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(10,16,20,0.6)",
                  border: `1px solid ${BORDER}`,
                }}
                data-ocid={`interviewprep.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(39,215,224,0.08)",
                          color: CATEGORY_COLORS[q.category],
                        }}
                      >
                        {q.category}
                      </span>
                      {q.status === "mastered" && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(34,197,94,0.12)",
                            color: "rgba(134,239,172,0.9)",
                          }}
                        >
                          ✓ Mastered
                        </span>
                      )}
                      {q.status === "needs-work" && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(248,113,113,0.12)",
                            color: "rgba(248,113,113,0.9)",
                          }}
                        >
                          Needs Work
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium" style={{ color: TEXT }}>
                      {q.question}
                    </p>
                    {q.answer && (
                      <p className="text-xs mt-1" style={{ color: MUTED }}>
                        {q.answer.slice(0, 100)}
                        {q.answer.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setStatus(
                          q.id,
                          q.status === "mastered" ? "unreviewed" : "mastered",
                        )
                      }
                      className="p-1.5 rounded-lg"
                      style={{
                        color:
                          q.status === "mastered"
                            ? "rgba(34,197,94,0.9)"
                            : MUTED,
                        background: "var(--os-border-subtle)",
                      }}
                      data-ocid={`interviewprep.checkbox.${i + 1}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(q.id)}
                      className="p-1.5 rounded-lg"
                      style={{
                        color: "rgba(248,113,113,0.7)",
                        background: "rgba(248,113,113,0.06)",
                      }}
                      data-ocid={`interviewprep.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
