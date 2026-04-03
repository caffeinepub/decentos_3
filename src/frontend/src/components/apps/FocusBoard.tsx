import { Check, Plus, Target, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface FocusItem {
  id: string;
  text: string;
}
interface DoneItem {
  id: string;
  text: string;
  completedAt: number;
}
interface FocusBoardData {
  current: FocusItem | null;
  queue: FocusItem[];
  done: DoneItem[];
}

const DEFAULT_DATA: FocusBoardData = {
  current: {
    id: "default_1",
    text: "Ship Sprint 27: lazy loading + 3 new apps",
  },
  queue: [
    { id: "default_2", text: "Migrate KanbanBoard to on-chain storage" },
    { id: "default_3", text: "Write documentation for App Store API" },
  ],
  done: [],
};

function genId() {
  return `fb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function FocusBoard() {
  const {
    data: persisted,
    set,
    loading,
  } = useCanisterKV<FocusBoardData>("decentos_focusboard", DEFAULT_DATA);
  const [board, setBoard] = useState<FocusBoardData>(DEFAULT_DATA);
  const [newText, setNewText] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const hydratedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loading || hydratedRef.current) return;
    hydratedRef.current = true;
    setBoard(persisted);
  }, [loading, persisted]);

  const save = (updated: FocusBoardData) => {
    setBoard(updated);
    set(updated);
  };

  const addToQueue = () => {
    if (!newText.trim()) return;
    const item: FocusItem = { id: genId(), text: newText.trim() };
    let updated: FocusBoardData;
    if (!board.current) {
      updated = { ...board, current: item };
    } else {
      updated = { ...board, queue: [...board.queue, item] };
    }
    save(updated);
    setNewText("");
    setInputVisible(false);
  };

  const markDone = () => {
    if (!board.current) return;
    const done: DoneItem = {
      id: board.current.id,
      text: board.current.text,
      completedAt: Date.now(),
    };
    const [next, ...rest] = board.queue;
    save({ current: next ?? null, queue: rest, done: [done, ...board.done] });
  };

  const skipCurrent = () => {
    if (!board.current) return;
    const [next, ...rest] = board.queue;
    if (!next) return;
    save({ current: next, queue: [...rest, board.current], done: board.done });
  };

  const removeFromQueue = (id: string) =>
    save({ ...board, queue: board.queue.filter((q) => q.id !== id) });
  const clearDone = () => save({ ...board, done: [] });

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "rgba(11,15,18,0.6)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
        style={{ borderColor: "rgba(42,58,66,0.8)" }}
      >
        <div className="flex items-center gap-2">
          <Target
            className="w-4 h-4"
            style={{ color: "rgba(39,215,224,0.7)" }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(39,215,224,0.7)" }}
          >
            Focus Board
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setInputVisible((v) => !v);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          data-ocid="focusboard.primary_button"
          className="flex items-center gap-1 px-3 h-7 rounded text-[11px] font-medium transition-all"
          style={{
            background: "rgba(39,215,224,0.1)",
            border: "1px solid rgba(39,215,224,0.25)",
            color: "rgba(39,215,224,0.9)",
          }}
        >
          <Plus className="w-3.5 h-3.5" /> Add Task
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <section>
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "rgba(180,200,210,0.3)" }}
          >
            Now Focusing
          </p>
          {board.current ? (
            <div
              className="rounded-xl p-5 text-center"
              style={{
                background: "rgba(39,215,224,0.06)",
                border: "1px solid rgba(39,215,224,0.2)",
                boxShadow: "0 0 32px rgba(39,215,224,0.06)",
              }}
              data-ocid="focusboard.card"
            >
              <p
                className="text-lg font-semibold leading-snug mb-5"
                style={{ color: "rgba(220,235,240,0.95)" }}
              >
                {board.current.text}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={markDone}
                  data-ocid="focusboard.confirm_button"
                  className="flex items-center gap-2 px-5 h-9 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(34,197,94,0.15)",
                    border: "1px solid rgba(34,197,94,0.35)",
                    color: "rgba(74,222,128,0.9)",
                  }}
                >
                  <Check className="w-4 h-4" /> Done
                </button>
                {board.queue.length > 0 && (
                  <button
                    type="button"
                    onClick={skipCurrent}
                    data-ocid="focusboard.secondary_button"
                    className="px-4 h-9 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-border-subtle)",
                      color: "rgba(180,200,210,0.6)",
                    }}
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-8 text-center"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px dashed var(--os-border-subtle)",
              }}
              data-ocid="focusboard.empty_state"
            >
              <Target
                className="w-8 h-8 mx-auto mb-2"
                style={{ color: "rgba(39,215,224,0.2)" }}
              />
              <p className="text-sm" style={{ color: "rgba(180,200,210,0.3)" }}>
                Add a task to start focusing
              </p>
            </div>
          )}
        </section>

        {inputVisible && (
          <div className="flex gap-2" data-ocid="focusboard.panel">
            <input
              ref={inputRef}
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addToQueue();
                if (e.key === "Escape") setInputVisible(false);
              }}
              placeholder="What needs to get done?"
              data-ocid="focusboard.input"
              className="flex-1 h-8 px-3 rounded-lg text-xs outline-none"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.25)",
                color: "rgba(220,235,240,0.9)",
                caretColor: "rgba(39,215,224,0.9)",
              }}
            />
            <button
              type="button"
              onClick={addToQueue}
              data-ocid="focusboard.submit_button"
              className="px-3 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "rgba(39,215,224,0.15)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "rgba(39,215,224,0.9)",
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setInputVisible(false)}
              data-ocid="focusboard.cancel_button"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-border-subtle)",
                color: "rgba(180,200,210,0.5)",
              }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {board.queue.length > 0 && (
          <section>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(180,200,210,0.3)" }}
            >
              Up Next ({board.queue.length})
            </p>
            <div className="space-y-1.5">
              {board.queue.map((item, i) => (
                <div
                  key={item.id}
                  data-ocid={`focusboard.item.${i + 1}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg group"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-border-subtle)",
                  }}
                >
                  <span
                    className="text-[11px] font-mono flex-shrink-0"
                    style={{ color: "rgba(180,200,210,0.2)" }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="flex-1 text-xs"
                    style={{ color: "rgba(220,235,240,0.7)" }}
                  >
                    {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromQueue(item.id)}
                    data-ocid={`focusboard.delete_button.${i + 1}`}
                    className="w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "rgba(252,165,165,0.6)" }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {board.done.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "rgba(180,200,210,0.3)" }}
              >
                Completed ({board.done.length})
              </p>
              <button
                type="button"
                onClick={clearDone}
                data-ocid="focusboard.delete_button"
                className="text-[10px] transition-colors"
                style={{ color: "rgba(180,200,210,0.25)" }}
              >
                <Trash2 className="w-3 h-3 inline mr-1" />
                Clear
              </button>
            </div>
            <div className="space-y-1.5">
              {board.done.map((item, i) => (
                <div
                  key={item.id}
                  data-ocid={`focusboard.row.${i + 1}`}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <Check
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "rgba(34,197,94,0.5)" }}
                  />
                  <span
                    className="flex-1 text-xs line-through"
                    style={{ color: "rgba(180,200,210,0.35)" }}
                  >
                    {item.text}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(180,200,210,0.2)" }}
                  >
                    {new Date(item.completedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
