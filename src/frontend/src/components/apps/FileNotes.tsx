import { FileText, Plus, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";

type NotesMap = Record<string, string>;

const STORAGE_KEY = "filenotes_data";

interface FileNotesProps {
  windowProps?: Record<string, unknown>;
}

export function FileNotes({ windowProps: _windowProps }: FileNotesProps) {
  const { actor } = useActor();
  const [notes, setNotes] = useState<NotesMap>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [content, setContent] = useState("");
  const [loaded, setLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load on mount
  useEffect(() => {
    if (loaded) return;
    async function load() {
      try {
        if (actor) {
          const raw = await actor.kvGet(STORAGE_KEY);
          if (raw != null) {
            const parsed = JSON.parse(raw) as NotesMap;
            setNotes(parsed);
            const firstKey = Object.keys(parsed)[0] ?? null;
            setSelectedKey(firstKey);
            if (firstKey) setContent(parsed[firstKey] ?? "");
            setLoaded(true);
            return;
          }
        }
      } catch {
        // fall through
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as NotesMap;
          setNotes(parsed);
          const firstKey = Object.keys(parsed)[0] ?? null;
          setSelectedKey(firstKey);
          if (firstKey) setContent(parsed[firstKey] ?? "");
        }
      } catch {
        // ignore
      }
      setLoaded(true);
    }
    load();
  }, [actor, loaded]);

  const persistNotes = useCallback(
    (updated: NotesMap) => {
      const json = JSON.stringify(updated);
      try {
        localStorage.setItem(STORAGE_KEY, json);
      } catch {
        /* ignore */
      }
      if (actor) {
        actor
          .kvSet(STORAGE_KEY, json)
          .then(() => toast.success("Saved to chain ✓", { duration: 1500 }))
          .catch(() => {
            /* silent */
          });
      }
    },
    [actor],
  );

  const handleContentChange = (val: string) => {
    setContent(val);
    if (!selectedKey) return;
    const updated = { ...notes, [selectedKey]: val };
    setNotes(updated);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persistNotes(updated), 800);
  };

  const selectKey = (key: string) => {
    setSelectedKey(key);
    setContent(notes[key] ?? "");
  };

  const addKey = () => {
    const key = newKey.trim();
    if (!key || notes[key] !== undefined) return;
    const updated = { ...notes, [key]: "" };
    setNotes(updated);
    setSelectedKey(key);
    setContent("");
    setNewKey("");
    persistNotes(updated);
  };

  const deleteKey = (key: string) => {
    const updated = { ...notes };
    delete updated[key];
    setNotes(updated);
    if (selectedKey === key) {
      const remaining = Object.keys(updated);
      const next = remaining[0] ?? null;
      setSelectedKey(next);
      setContent(next ? updated[next] : "");
    }
    persistNotes(updated);
  };

  const keys = Object.keys(notes);

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ background: "rgba(8,12,16,0.97)" }}
      data-ocid="filenotes.panel"
    >
      {/* Sidebar */}
      <div
        className="w-44 flex-shrink-0 flex flex-col border-r"
        style={{
          borderColor: "rgba(39,215,224,0.1)",
          background: "rgba(10,18,26,0.8)",
        }}
      >
        <div
          className="p-2 border-b"
          style={{ borderColor: "rgba(39,215,224,0.1)" }}
        >
          <div className="flex gap-1">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKey()}
              placeholder="New topic..."
              data-ocid="filenotes.input"
              className="flex-1 min-w-0 text-xs px-2 py-1.5 rounded-lg outline-none"
              style={{
                background: "rgba(39,215,224,0.07)",
                border: "1px solid rgba(39,215,224,0.2)",
                color: "var(--os-text-secondary)",
                caretColor: "#27D7E0",
              }}
            />
            <button
              type="button"
              onClick={addKey}
              disabled={!newKey.trim()}
              data-ocid="filenotes.primary_button"
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
              style={{
                background: "rgba(39,215,224,0.15)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "var(--os-accent)",
              }}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {keys.length === 0 ? (
            <div
              className="text-[10px] text-center py-6 px-2"
              style={{ color: "var(--os-text-muted)" }}
            >
              Add a topic above to start
            </div>
          ) : (
            keys.map((key, i) => (
              <div
                key={key}
                data-ocid={`filenotes.item.${i + 1}`}
                className="group flex items-center gap-1 px-2 py-1.5 mx-1 rounded-lg cursor-pointer transition-all"
                style={{
                  background:
                    selectedKey === key
                      ? "rgba(39,215,224,0.1)"
                      : "transparent",
                  border:
                    selectedKey === key
                      ? "1px solid rgba(39,215,224,0.2)"
                      : "1px solid transparent",
                }}
                onClick={() => selectKey(key)}
                onKeyDown={(e) => e.key === "Enter" && selectKey(key)}
              >
                <FileText
                  className="w-3 h-3 flex-shrink-0"
                  style={{
                    color:
                      selectedKey === key ? "#27D7E0" : "var(--os-text-muted)",
                  }}
                />
                <span
                  className="flex-1 min-w-0 text-xs truncate"
                  style={{
                    color:
                      selectedKey === key
                        ? "var(--os-text-primary)"
                        : "var(--os-text-secondary)",
                  }}
                >
                  {key}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteKey(key);
                  }}
                  data-ocid={`filenotes.delete_button.${i + 1}`}
                  className="w-4 h-4 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedKey ? (
          <>
            <div
              className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0"
              style={{
                borderColor: "rgba(39,215,224,0.1)",
                background: "rgba(12,20,28,0.7)",
              }}
            >
              <div className="flex items-center gap-2">
                <FileText
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--os-accent)" }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--os-text-primary)" }}
                >
                  {selectedKey}
                </span>
              </div>
              <div
                className="flex items-center gap-1 text-[10px]"
                style={{ color: "var(--os-text-muted)" }}
              >
                <Save className="w-3 h-3" />
                Auto-saving
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              data-ocid="filenotes.textarea"
              placeholder={`Notes for ${selectedKey}...`}
              className="flex-1 w-full p-3 text-sm outline-none resize-none"
              style={{
                background: "transparent",
                color: "var(--os-text-secondary)",
                caretColor: "#27D7E0",
                fontFamily: "JetBrains Mono, monospace",
                lineHeight: 1.6,
              }}
            />
          </>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3"
            data-ocid="filenotes.empty_state"
          >
            <FileText
              className="w-10 h-10"
              style={{ color: "rgba(39,215,224,0.2)" }}
            />
            <div className="text-center">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--os-text-muted)" }}
              >
                No topic selected
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--os-text-muted)" }}
              >
                Create a topic in the sidebar to attach notes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
