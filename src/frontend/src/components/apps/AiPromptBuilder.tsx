import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Trash2, Wand2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

const BG = "rgba(11,15,18,0.6)";
const SIDEBAR_BG = "rgba(10,16,20,0.7)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgba(39,215,224,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.45)";
const BTN_BG = "rgba(39,215,224,0.12)";
const BTN_BORDER = "rgba(39,215,224,0.3)";

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

function extractVariables(content: string): string[] {
  const matches = content.match(/\{\{([^}]+)\}\}/g) ?? [];
  const names = matches.map((m) => m.slice(2, -2).trim());
  return [...new Set(names)];
}

export function AiPromptBuilder() {
  const { data: prompts, set: setPrompts } = useCanisterKV<Prompt[]>(
    "decent-ai-prompts",
    [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [fillMode, setFillMode] = useState(false);
  const [fillValues, setFillValues] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const filtered = prompts.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  const selectPrompt = (p: Prompt) => {
    setSelectedId(p.id);
    setTitle(p.title);
    setContent(p.content);
    setTags(p.tags);
    setFillMode(false);
    setFillValues({});
  };

  const newPrompt = () => {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setTags([]);
    setFillMode(false);
    setFillValues({});
  };

  const save = () => {
    if (!title.trim()) return;
    if (selectedId) {
      setPrompts(
        prompts.map((p) =>
          p.id === selectedId ? { ...p, title, content, tags } : p,
        ),
      );
    } else {
      const np: Prompt = {
        id: `prompt_${Date.now()}`,
        title,
        content,
        tags,
        createdAt: new Date().toISOString(),
      };
      setPrompts([np, ...prompts]);
      setSelectedId(np.id);
    }
    toast.success("Prompt saved");
  };

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter((p) => p.id !== id));
    if (selectedId === id) newPrompt();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const variables = extractVariables(content);

  const startFill = () => {
    const vals: Record<string, string> = {};
    for (const v of variables) vals[v] = "";
    setFillValues(vals);
    setFillMode(true);
  };

  const copyFilled = () => {
    let filled = content;
    for (const [k, v] of Object.entries(fillValues)) {
      filled = filled.replaceAll(`{{${k}}}`, v);
    }
    navigator.clipboard.writeText(filled);
    toast.success("Copied to clipboard!");
    setFillMode(false);
  };

  return (
    <div
      className="flex h-full"
      style={{ background: BG, color: TEXT, fontSize: 13 }}
      data-ocid="aiprompts.panel"
    >
      {/* Sidebar */}
      <div
        className="w-56 flex-shrink-0 flex flex-col border-r"
        style={{ background: SIDEBAR_BG, borderColor: BORDER }}
      >
        <div className="p-3 border-b" style={{ borderColor: BORDER }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            style={{ ...INPUT_STYLE }}
            data-ocid="aiprompts.search_input"
          />
        </div>
        <div className="p-2">
          <button
            type="button"
            onClick={newPrompt}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            style={{
              background: BTN_BG,
              border: `1px solid ${BTN_BORDER}`,
              color: CYAN,
            }}
            data-ocid="aiprompts.primary_button"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs font-medium">New Prompt</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p
              className="text-center p-4 text-xs"
              style={{ color: MUTED }}
              data-ocid="aiprompts.empty_state"
            >
              No prompts yet. Create one to get started.
            </p>
          )}
          {filtered.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="mx-2 mb-1 p-2 rounded-lg cursor-pointer transition-colors w-full text-left"
              style={{
                background:
                  selectedId === p.id ? "rgba(39,215,224,0.08)" : "transparent",
                border: `1px solid ${selectedId === p.id ? BTN_BORDER : "transparent"}`,
              }}
              onClick={() => selectPrompt(p)}
              data-ocid={`aiprompts.item.${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <p
                  className="text-xs font-medium truncate flex-1"
                  style={{ color: TEXT }}
                >
                  {p.title}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePrompt(p.id);
                  }}
                  className="ml-1 opacity-0 hover:opacity-100 transition-opacity"
                  style={{ color: "rgba(248,113,113,0.8)" }}
                  data-ocid={`aiprompts.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <p
                className="text-[10px] mt-0.5 truncate"
                style={{ color: MUTED }}
              >
                {p.content.slice(0, 60)}...
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" style={{ color: CYAN }} />
            <span className="font-semibold text-sm">AI Prompt Builder</span>
          </div>
          <div className="flex gap-2">
            {variables.length > 0 && !fillMode && (
              <button
                type="button"
                onClick={startFill}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: "rgba(168,85,247,0.15)",
                  border: "1px solid rgba(168,85,247,0.35)",
                  color: "rgba(216,180,254,0.9)",
                }}
                data-ocid="aiprompts.secondary_button"
              >
                <Wand2 className="w-3 h-3" /> Fill Variables
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!title.trim()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: BTN_BG,
                border: `1px solid ${BTN_BORDER}`,
                color: CYAN,
                opacity: title.trim() ? 1 : 0.5,
              }}
              data-ocid="aiprompts.save_button"
            >
              Save
            </button>
          </div>
        </div>

        {fillMode ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm" style={{ color: CYAN }}>
                Fill in Variables
              </h3>
              <button
                type="button"
                onClick={() => setFillMode(false)}
                style={{ color: MUTED }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {Object.keys(fillValues).map((v) => (
                <div key={v}>
                  <p
                    className="block text-[10px] font-semibold mb-1"
                    style={{ color: CYAN }}
                  >{`{{${v}}}`}</p>
                  <input
                    value={fillValues[v]}
                    onChange={(e) =>
                      setFillValues({ ...fillValues, [v]: e.target.value })
                    }
                    placeholder={`Value for ${v}`}
                    style={INPUT_STYLE}
                    data-ocid="aiprompts.input"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={copyFilled}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium"
              style={{
                background: BTN_BG,
                border: `1px solid ${BTN_BORDER}`,
                color: CYAN,
              }}
              data-ocid="aiprompts.button"
            >
              <Copy className="w-4 h-4" /> Copy Filled Prompt
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                TITLE
              </p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Code Review Prompt"
                style={INPUT_STYLE}
                data-ocid="aiprompts.input"
              />
            </div>
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                PROMPT{" "}
                {variables.length > 0 && (
                  <span style={{ color: MUTED }}>
                    ({variables.length} variable
                    {variables.length !== 1 ? "s" : ""} detected)
                  </span>
                )}
              </p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  "Write your prompt here. Use {{variable}} for placeholders.\n\nExample:\nReview this code for {{language}}:\n\n{{code}}"
                }
                style={{
                  ...INPUT_STYLE,
                  minHeight: 200,
                  resize: "vertical",
                  fontFamily: "monospace",
                }}
                data-ocid="aiprompts.textarea"
              />
              {variables.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {variables.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 rounded text-[10px]"
                      style={{
                        background: "rgba(168,85,247,0.15)",
                        color: "rgba(216,180,254,0.9)",
                        border: "1px solid rgba(168,85,247,0.25)",
                      }}
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                TAGS
              </p>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add tag..."
                  style={{ ...INPUT_STYLE, flex: 1 }}
                  data-ocid="aiprompts.input"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{
                    background: BTN_BG,
                    border: `1px solid ${BTN_BORDER}`,
                    color: CYAN,
                  }}
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tags.map((t) => (
                    <Badge
                      key={t}
                      className="cursor-pointer text-[10px] gap-1"
                      style={{
                        background: BTN_BG,
                        border: `1px solid ${BTN_BORDER}`,
                        color: CYAN,
                      }}
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                    >
                      {t} <X className="w-2.5 h-2.5" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {selectedId && (
              <div>
                <p
                  className="block text-[10px] font-semibold mb-1"
                  style={{ color: CYAN }}
                >
                  COPY RAW
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(content);
                    toast.success("Copied!");
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT,
                  }}
                  data-ocid="aiprompts.button"
                >
                  <Copy className="w-3 h-3" /> Copy Prompt as-is
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
