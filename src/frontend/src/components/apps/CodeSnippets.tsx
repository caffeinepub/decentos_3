import { Check, Copy, Plus, Scissors, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
}

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Motoko",
  "HTML",
  "CSS",
  "Bash",
  "Other",
];
const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  Motoko: "#27D7E0",
  HTML: "#e34f26",
  CSS: "#1572b6",
  Bash: "#89e051",
  Other: "#8B5CF6",
};

let snippetCounter = 0;

export function CodeSnippets() {
  const { data: snippets, set: setSnippets } = useCanisterKV<Snippet[]>(
    "codesnippets-data",
    [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const selected = snippets.find((s) => s.id === selectedId) ?? null;
  const filtered = snippets.filter(
    (s) =>
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.language.toLowerCase().includes(search.toLowerCase()),
  );

  const createNew = () => {
    const newSnippet: Snippet = {
      id: `snippet-${++snippetCounter}-${Date.now()}`,
      title: "New Snippet",
      language: "JavaScript",
      code: "",
    };
    const updated = [newSnippet, ...snippets];
    setSnippets(updated);
    setSelectedId(newSnippet.id);
  };

  const updateSnippet = (field: keyof Snippet, value: string) => {
    if (!selectedId) return;
    setSnippets(
      snippets.map((s) => (s.id === selectedId ? { ...s, [field]: value } : s)),
    );
  };

  const deleteSnippet = (id: string) => {
    const updated = snippets.filter((s) => s.id !== id);
    setSnippets(updated);
    if (selectedId === id) setSelectedId(updated[0]?.id ?? null);
    setDeleteConfirmId(null);
    toast.success("Snippet deleted");
  };

  const copyCode = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Copied to clipboard");
    });
  };

  return (
    <div
      className="flex h-full"
      style={{ background: "rgba(8,14,18,0.97)" }}
      data-ocid="codesnippets.panel"
    >
      <div
        className="flex flex-col border-r flex-shrink-0"
        style={{
          width: 200,
          borderColor: "rgba(39,215,224,0.12)",
          background: "rgba(10,18,26,0.8)",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-2 py-2 border-b flex-shrink-0"
          style={{ borderColor: "rgba(39,215,224,0.12)" }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            data-ocid="codesnippets.search_input"
            className="flex-1 h-6 px-2 rounded text-[11px] outline-none"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-secondary)",
            }}
          />
          <button
            type="button"
            onClick={createNew}
            data-ocid="codesnippets.primary_button"
            title="New Snippet"
            className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: "rgba(39,215,224,0.15)",
              border: "1px solid rgba(39,215,224,0.3)",
              color: "rgba(39,215,224,1)",
            }}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-24 gap-2 text-muted-foreground/50"
              data-ocid="codesnippets.empty_state"
            >
              <Scissors className="w-6 h-6" />
              <span className="text-[10px]">
                {search ? "No results" : "No snippets yet"}
              </span>
            </div>
          ) : (
            filtered.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedId(s.id)}
                data-ocid={`codesnippets.item.${i + 1}`}
                className="w-full text-left px-3 py-2.5 transition-all border-b"
                style={{
                  background:
                    selectedId === s.id
                      ? "rgba(39,215,224,0.07)"
                      : "transparent",
                  borderColor: "var(--os-border-subtle)",
                  borderLeft:
                    selectedId === s.id
                      ? "2px solid rgba(39,215,224,0.6)"
                      : "2px solid transparent",
                }}
              >
                <div className="text-[11px] font-medium text-muted-foreground truncate">
                  {s.title}
                </div>
                <div className="mt-0.5">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                    style={{
                      background: `${LANG_COLORS[s.language] ?? "#8B5CF6"}22`,
                      color: LANG_COLORS[s.language] ?? "#8B5CF6",
                      border: `1px solid ${LANG_COLORS[s.language] ?? "#8B5CF6"}44`,
                    }}
                  >
                    {s.language}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        {selected ? (
          <>
            <div
              className="flex items-center gap-2 px-3 py-2 border-b flex-shrink-0"
              style={{
                borderColor: "rgba(39,215,224,0.12)",
                background: "rgba(12,22,30,0.8)",
              }}
            >
              <input
                type="text"
                value={selected.title}
                onChange={(e) => updateSnippet("title", e.target.value)}
                data-ocid="codesnippets.input"
                className="flex-1 text-sm font-semibold bg-transparent outline-none"
                style={{
                  color: "var(--os-text-primary)",
                  caretColor: "var(--os-accent)",
                }}
                placeholder="Snippet title"
              />
              <select
                value={selected.language}
                onChange={(e) => updateSnippet("language", e.target.value)}
                data-ocid="codesnippets.select"
                className="h-6 text-[11px] px-1.5 rounded border cursor-pointer outline-none"
                style={{
                  background: `${LANG_COLORS[selected.language] ?? "#8B5CF6"}18`,
                  borderColor: `${LANG_COLORS[selected.language] ?? "#8B5CF6"}44`,
                  color: LANG_COLORS[selected.language] ?? "#8B5CF6",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option
                    key={l}
                    value={l}
                    style={{ background: "var(--os-bg-app)" }}
                  >
                    {l}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={copyCode}
                data-ocid="codesnippets.button"
                title="Copy code"
                className="w-7 h-7 rounded flex items-center justify-center transition-all"
                style={{
                  background: copied
                    ? "rgba(39,215,224,0.2)"
                    : "var(--os-border-subtle)",
                  border: copied
                    ? "1px solid rgba(39,215,224,0.4)"
                    : "1px solid var(--os-text-muted)",
                  color: copied
                    ? "var(--os-accent)"
                    : "var(--os-text-secondary)",
                }}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              {deleteConfirmId === selected.id ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => deleteSnippet(selected.id)}
                    data-ocid="codesnippets.confirm_button"
                    className="text-[10px] px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(248,113,113,0.15)",
                      color: "rgba(248,113,113,1)",
                      border: "1px solid rgba(248,113,113,0.3)",
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(null)}
                    data-ocid="codesnippets.cancel_button"
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{
                      background: "var(--os-border-subtle)",
                      color: "var(--os-text-secondary)",
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(selected.id)}
                  data-ocid="codesnippets.delete_button"
                  className="w-7 h-7 rounded flex items-center justify-center transition-all"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-border-subtle)",
                    color: "var(--os-text-muted)",
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <textarea
              value={selected.code}
              onChange={(e) => updateSnippet("code", e.target.value)}
              data-ocid="codesnippets.editor"
              spellCheck={false}
              className="flex-1 w-full p-4 text-xs outline-none resize-none font-mono"
              style={{
                background: "transparent",
                color: "rgba(220,240,255,0.85)",
                caretColor: "var(--os-accent)",
                lineHeight: 1.7,
                tabSize: 2,
              }}
              placeholder="Paste or type your code snippet here..."
            />
            <div
              className="flex-shrink-0 flex items-center px-4 py-1.5 border-t text-[10px] text-muted-foreground/50"
              style={{ borderColor: "var(--os-border-subtle)" }}
            >
              <span>{selected.code.split("\n").length} lines</span>
              <span className="mx-2">·</span>
              <span>{selected.code.length} chars</span>
            </div>
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground/30"
            data-ocid="codesnippets.empty_state"
          >
            <Scissors className="w-12 h-12" />
            <p className="text-sm">Select a snippet or create a new one</p>
            <button
              type="button"
              onClick={createNew}
              data-ocid="codesnippets.primary_button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "rgba(39,215,224,0.12)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "rgba(39,215,224,0.9)",
              }}
            >
              <Plus className="w-3.5 h-3.5" /> New Snippet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
