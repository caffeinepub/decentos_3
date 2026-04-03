import {
  ChevronDown,
  ChevronRight,
  Clipboard,
  Code2,
  Minimize2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [k: string]: JsonValue };

interface NodeProps {
  keyName: string | null;
  value: JsonValue;
  path: string;
  depth: number;
  forceExpand: boolean;
  forceCollapse: boolean;
}

function getType(v: JsonValue): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

const TYPE_COLORS: Record<string, string> = {
  string: "rgb(34,197,94)",
  number: "rgb(245,158,11)",
  boolean: "rgb(39,215,224)",
  null: "rgba(148,163,184,0.7)",
  object: "rgba(226,232,240,0.9)",
  array: "rgba(226,232,240,0.9)",
};

function JsonNode({
  keyName,
  value,
  path,
  depth,
  forceExpand,
  forceCollapse,
}: NodeProps) {
  const type = getType(value);
  const isExpandable = type === "object" || type === "array";
  const [open, setOpen] = useState(depth < 2);

  const handleToggle = () => setOpen((o) => !o);

  const isOpen = forceCollapse ? false : forceExpand ? true : open;

  const copyPath = () => {
    navigator.clipboard
      .writeText(path)
      .then(() => toast.success(`Copied: ${path}`));
  };

  const renderKey =
    keyName !== null ? (
      <button
        type="button"
        onClick={copyPath}
        className="text-blue-300 hover:text-blue-200 hover:underline transition-colors text-xs"
        title={`Copy path: ${path}`}
      >
        "{keyName}"
      </button>
    ) : null;

  if (!isExpandable) {
    return (
      <div
        className="flex items-center gap-1 py-0.5"
        style={{ paddingLeft: depth * 16 }}
      >
        {renderKey && (
          <>
            {renderKey}
            <span className="text-muted-foreground/50 text-xs">: </span>
          </>
        )}
        <span
          className="text-xs font-mono"
          style={{ color: TYPE_COLORS[type] }}
        >
          {type === "string" ? `"${value as string}"` : String(value)}
        </span>
        <span className="text-[10px] text-muted-foreground/30">{type}</span>
      </div>
    );
  }

  const entries =
    type === "array"
      ? (value as JsonValue[]).map(
          (v, i) => [String(i), v] as [string, JsonValue],
        )
      : Object.entries(value as Record<string, JsonValue>);

  const bracket = type === "array" ? ["[", "]"] : ["{", "}"];

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <button
        type="button"
        className="flex items-center gap-1 py-0.5 cursor-pointer w-full text-left"
        onClick={handleToggle}
      >
        <span className="text-muted-foreground/40 text-xs">
          {isOpen ? (
            <ChevronDown className="w-3 h-3 inline" />
          ) : (
            <ChevronRight className="w-3 h-3 inline" />
          )}
        </span>
        {renderKey && (
          <>
            {renderKey}
            <span className="text-muted-foreground/50 text-xs">: </span>
          </>
        )}
        <span
          className="text-xs font-mono"
          style={{ color: TYPE_COLORS[type] }}
        >
          {bracket[0]}
          {!isOpen && (
            <span className="text-muted-foreground/50">
              {entries.length} {type === "array" ? "items" : "keys"}
            </span>
          )}
          {!isOpen && bracket[1]}
        </span>
      </button>
      {isOpen && (
        <div>
          {entries.map(([k, v]) => (
            <JsonNode
              key={k}
              keyName={type === "array" ? null : k}
              value={v}
              path={type === "array" ? `${path}[${k}]` : `${path}.${k}`}
              depth={depth + 1}
              forceExpand={forceExpand}
              forceCollapse={forceCollapse}
            />
          ))}
          <div
            className="text-xs font-mono"
            style={{ color: TYPE_COLORS[type] }}
          >
            {bracket[1]}
          </div>
        </div>
      )}
    </div>
  );
}

export function DataVisualizer() {
  const [input, setInput] = useState(`{
  "name": "DecentOS",
  "version": "39.0",
  "features": ["filesystem", "apps", "marketplace"],
  "stats": {
    "apps": 63,
    "decentralized": true,
    "blockchain": "ICP"
  }
}`);
  const [forceExpand, setForceExpand] = useState(false);
  const [forceCollapse, setForceCollapse] = useState(false);

  const parsed = useMemo(() => {
    try {
      return { value: JSON.parse(input) as JsonValue, error: null };
    } catch (e) {
      return { value: null, error: (e as Error).message };
    }
  }, [input]);

  const handleExpandAll = () => {
    setForceCollapse(false);
    setForceExpand(true);
    setTimeout(() => setForceExpand(false), 100);
  };

  const handleCollapseAll = () => {
    setForceExpand(false);
    setForceCollapse(true);
    setTimeout(() => setForceCollapse(false), 100);
  };

  return (
    <div className="flex flex-col h-full" style={{ color: "#e2e8f0" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4" style={{ color: "rgb(39,215,224)" }} />
          <span className="font-semibold text-foreground">Data Visualizer</span>
        </div>
        {parsed.value !== null && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExpandAll}
              data-ocid="datavisualizer.primary_button"
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
              style={{
                background: "rgba(39,215,224,0.08)",
                border: "1px solid rgba(39,215,224,0.2)",
                color: "rgb(39,215,224)",
              }}
            >
              <ChevronDown className="w-3 h-3" /> Expand All
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              data-ocid="datavisualizer.secondary_button"
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-text-muted)",
                color: "rgba(148,163,184,0.7)",
              }}
            >
              <Minimize2 className="w-3 h-3" /> Collapse All
            </button>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard
                  .writeText(JSON.stringify(JSON.parse(input), null, 2))
                  .then(() => toast.success("Copied!"))
              }
              data-ocid="datavisualizer.toggle"
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid var(--os-text-muted)",
                color: "rgba(148,163,184,0.7)",
              }}
            >
              <Clipboard className="w-3 h-3" /> Copy
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        {/* Input textarea */}
        <div
          className="px-4 pt-3 pb-2"
          style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            data-ocid="datavisualizer.editor"
            placeholder="Paste JSON here..."
            rows={5}
            className="w-full resize-none rounded text-xs font-mono p-2 bg-muted/50 focus:outline-none"
            style={{
              border: parsed.error
                ? "1px solid rgba(239,68,68,0.4)"
                : "1px solid var(--os-border-subtle)",
              color: parsed.error ? "rgb(252,165,165)" : "#e2e8f0",
            }}
          />
          {parsed.error && (
            <p
              data-ocid="datavisualizer.error_state"
              className="text-xs text-red-400 mt-1"
            >
              {parsed.error}
            </p>
          )}
        </div>

        {/* Tree view */}
        <div className="flex-1 overflow-auto px-4 py-3">
          {parsed.value !== null ? (
            <JsonNode
              keyName={null}
              value={parsed.value}
              path="root"
              depth={0}
              forceExpand={forceExpand}
              forceCollapse={forceCollapse}
            />
          ) : (
            <div
              data-ocid="datavisualizer.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <Code2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Paste valid JSON above to explore it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
