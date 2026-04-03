import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const PRESETS: {
  label: string;
  pattern: string;
  flags: string;
  description: string;
}[] = [
  {
    label: "Email",
    pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    description: "Email address",
  },
  {
    label: "URL",
    pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*",
    flags: "gi",
    description: "HTTP/HTTPS URL",
  },
  {
    label: "Phone",
    pattern: "[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,3}[-\\s.]?[0-9]{4,6}",
    flags: "g",
    description: "Phone number",
  },
  {
    label: "Date",
    pattern: "\\d{1,2}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{2,4}",
    flags: "g",
    description: "Date (various formats)",
  },
  {
    label: "IPv4",
    pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b",
    flags: "g",
    description: "IPv4 address",
  },
  {
    label: "Hex Color",
    pattern: "#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b",
    flags: "g",
    description: "Hex color code",
  },
  {
    label: "JSON Key",
    pattern: '"([^"]+)"\\s*:',
    flags: "g",
    description: "JSON object key",
  },
  {
    label: "Numbers",
    pattern: "-?\\d+(\\.\\d+)?",
    flags: "g",
    description: "Integer or decimal",
  },
];

interface RegexTesterProps {
  windowProps?: Record<string, unknown>;
}

export function RegexTester({ windowProps: _windowProps }: RegexTesterProps) {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  const toggleFlag = (f: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [f]: !prev[f] }));
  };

  const flagStr = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setPattern(preset.pattern);
    const pFlags = { g: false, i: false, m: false, s: false };
    for (const f of preset.flags) {
      if (f in pFlags) pFlags[f as keyof typeof pFlags] = true;
    }
    setFlags(pFlags);
    setShowPresets(false);
    toast.success(`Preset applied: ${preset.label}`);
  };

  const copyPattern = () => {
    if (!pattern) {
      toast.error("No pattern to copy");
      return;
    }
    navigator.clipboard.writeText(`/${pattern}/${flagStr}`);
    toast.success("Pattern copied");
  };

  const { highlighted, matches, error } = useMemo(() => {
    if (!pattern || !testString) {
      return {
        highlighted: testString
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;"),
        matches: [],
        error: "",
      };
    }
    try {
      new RegExp(pattern, flagStr);
      const found: string[] = [];
      let lastIndex = 0;
      const parts: { text: string; isMatch: boolean }[] = [];
      const safeRe = new RegExp(
        pattern,
        flagStr.includes("g") ? flagStr : `${flagStr}g`,
      );

      let m = safeRe.exec(testString);
      while (m !== null) {
        if (m.index > lastIndex)
          parts.push({
            text: testString.slice(lastIndex, m.index),
            isMatch: false,
          });
        parts.push({ text: m[0], isMatch: true });
        found.push(m[0]);
        lastIndex = safeRe.lastIndex;
        if (!flagStr.includes("g")) break;
        if (m[0].length === 0) safeRe.lastIndex++;
        m = safeRe.exec(testString);
      }
      if (lastIndex < testString.length)
        parts.push({ text: testString.slice(lastIndex), isMatch: false });
      if (parts.length === 0) parts.push({ text: testString, isMatch: false });

      const html = parts
        .map((p) =>
          p.isMatch
            ? `<mark style="background:rgba(39,215,224,0.28);color:rgba(39,215,224,1);border-radius:3px;padding:0 2px">${p.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</mark>`
            : p.text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;"),
        )
        .join("");

      return { highlighted: html, matches: found, error: "" };
    } catch (e: unknown) {
      return {
        highlighted: testString
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;"),
        matches: [],
        error: e instanceof Error ? e.message : "Invalid regex",
      };
    }
  }, [pattern, flagStr, testString]);

  const inputBorder = (hasError: boolean) => ({
    borderColor: hasError ? "rgba(239,68,68,0.5)" : "rgba(39,215,224,0.2)",
  });

  return (
    <div
      data-ocid="regextester.panel"
      className="flex flex-col h-full text-foreground overflow-hidden"
      style={{
        background: "rgba(11,15,18,0.6)",
        padding: 12,
        gap: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <span
          className="text-sm font-semibold"
          style={{ color: "rgb(39,215,224)" }}
        >
          Regex Tester
        </span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-[10px] px-2"
            onClick={() => setShowPresets((v) => !v)}
            data-ocid="regextester.secondary_button"
            style={{ color: showPresets ? "rgb(39,215,224)" : undefined }}
          >
            Presets
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-[10px] px-2 gap-0.5"
            onClick={copyPattern}
            data-ocid="regextester.primary_button"
          >
            <Copy className="w-2.5 h-2.5" /> Copy
          </Button>
        </div>
      </div>

      {/* Presets panel */}
      {showPresets && (
        <div
          data-ocid="regextester.popover"
          className="rounded-lg p-2 flex-shrink-0 grid grid-cols-2 gap-1"
          style={{
            background: "rgba(20,32,42,0.8)",
            border: "1px solid rgba(39,215,224,0.15)",
          }}
        >
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              title={p.description}
              className="text-left px-2 py-1.5 rounded text-xs transition-all hover:bg-white/5"
              style={{
                border: "1px solid rgba(39,215,224,0.1)",
                color: "var(--os-text-primary)",
              }}
            >
              <span
                className="font-medium"
                style={{ color: "rgb(39,215,224)" }}
              >
                {p.label}
              </span>
              <span
                className="block text-[10px] truncate"
                style={{ color: "var(--os-text-muted)" }}
              >
                {p.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Pattern row */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span
          className="text-sm font-mono"
          style={{ color: "var(--os-text-muted)" }}
        >
          /
        </span>
        <input
          data-ocid="regextester.input"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="enter pattern"
          className="flex-1 bg-transparent border rounded px-2 py-1 text-sm outline-none text-foreground font-mono"
          style={{ ...inputBorder(!!error), background: "rgba(20,32,42,0.6)" }}
        />
        <span
          className="text-sm font-mono"
          style={{ color: "var(--os-text-muted)" }}
        >
          /
        </span>
        <span
          className="text-sm font-mono w-6"
          style={{ color: "rgba(39,215,224,0.8)" }}
        >
          {flagStr}
        </span>
      </div>

      {/* Flags */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {(["g", "i", "m", "s"] as const).map((f) => (
          <div key={f} className="flex items-center gap-1">
            <Checkbox
              id={`flag-${f}`}
              checked={flags[f]}
              onCheckedChange={() => toggleFlag(f)}
            />
            <Label
              htmlFor={`flag-${f}`}
              className="text-xs cursor-pointer"
              style={{ color: "#aaa" }}
            >
              {f}
            </Label>
          </div>
        ))}
        {error && (
          <span
            data-ocid="regextester.error_state"
            className="text-xs ml-auto"
            style={{ color: "#f87171" }}
          >
            ⚠ {error}
          </span>
        )}
      </div>

      {/* Test string */}
      <div className="flex flex-col gap-1 flex-shrink-0">
        <div
          className="text-[10px] font-medium uppercase tracking-wider"
          style={{ color: "var(--os-text-muted)" }}
        >
          Test String
        </div>
        <textarea
          data-ocid="regextester.textarea"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
          className="resize-none rounded p-2 text-sm outline-none text-foreground bg-transparent"
          style={{
            border: "1px solid rgba(39,215,224,0.15)",
            background: "rgba(20,32,42,0.6)",
            minHeight: 72,
            fontFamily: "monospace",
          }}
        />
      </div>

      {/* Highlighted result */}
      <div className="flex flex-col gap-1 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <div
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: "var(--os-text-muted)" }}
          >
            Result
          </div>
          <span
            className="text-[10px] font-mono"
            style={{
              color:
                matches.length > 0 ? "rgb(39,215,224)" : "var(--os-text-muted)",
            }}
          >
            {matches.length} match{matches.length !== 1 ? "es" : ""}
          </span>
        </div>
        <div
          className="rounded p-2 text-sm overflow-auto flex-1 whitespace-pre-wrap break-all"
          style={{
            border: "1px solid rgba(39,215,224,0.12)",
            background: "rgba(20,32,42,0.5)",
            fontFamily: "monospace",
            minHeight: 48,
          }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — all user text is HTML-escaped, only <mark> tags added
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>

      {/* Match list */}
      {matches.length > 0 && (
        <div className="flex flex-col gap-1 flex-shrink-0">
          <div
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: "var(--os-text-muted)" }}
          >
            Matches
          </div>
          <div className="flex flex-wrap gap-1">
            {matches.slice(0, 50).map((m, i) => (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: match list has no stable IDs
                key={i}
                data-ocid={`regextester.item.${i + 1}`}
                className="px-2 py-0.5 rounded text-xs font-mono cursor-pointer transition-all hover:opacity-80"
                style={{
                  background: "rgba(39,215,224,0.12)",
                  color: "rgb(39,215,224)",
                  border: "1px solid rgba(39,215,224,0.25)",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(m);
                  toast.success("Copied");
                }}
                title="Click to copy"
              >
                {m || "(empty)"}
              </button>
            ))}
            {matches.length > 50 && (
              <span className="text-xs" style={{ color: "#666" }}>
                +{matches.length - 50} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
