import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface JsonFormatterProps {
  windowProps?: Record<string, unknown>;
}

export function JsonFormatter({
  windowProps: _windowProps,
}: JsonFormatterProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const validate = (text: string): boolean => {
    try {
      JSON.parse(text);
      setError("");
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      return false;
    }
  };

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const handleValidate = () => {
    if (!input.trim()) return;
    const valid = validate(input);
    if (valid) toast.success("Valid JSON ✓");
    else toast.error("Invalid JSON");
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const lineCount = input ? input.split("\n").length : 0;
  const charCount = input.length;

  return (
    <div
      data-ocid="jsonformatter.panel"
      style={{ background: "rgba(11,15,18,0.6)", fontFamily: "monospace" }}
      className="flex flex-col h-full text-foreground"
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: "rgba(42,58,66,0.8)" }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: "rgba(39,215,224,1)" }}
        >
          JSON Formatter
        </span>
        <div className="flex gap-1 ml-auto">
          <Button
            data-ocid="jsonformatter.format_button"
            size="sm"
            variant="outline"
            onClick={handleFormat}
            className="h-7 px-2 text-xs border"
            style={{
              borderColor: "rgba(39,215,224,0.4)",
              color: "rgba(39,215,224,1)",
            }}
          >
            Format
          </Button>
          <Button
            data-ocid="jsonformatter.minify_button"
            size="sm"
            variant="outline"
            onClick={handleMinify}
            className="h-7 px-2 text-xs border"
            style={{
              borderColor: "rgba(39,215,224,0.4)",
              color: "rgba(39,215,224,1)",
            }}
          >
            Minify
          </Button>
          <Button
            data-ocid="jsonformatter.validate_button"
            size="sm"
            variant="outline"
            onClick={handleValidate}
            className="h-7 px-2 text-xs border"
            style={{
              borderColor: "rgba(39,215,224,0.4)",
              color: "rgba(39,215,224,1)",
            }}
          >
            Validate
          </Button>
          <Button
            data-ocid="jsonformatter.copy_button"
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!output}
            className="h-7 px-2 text-xs border"
            style={{
              borderColor: "rgba(39,215,224,0.4)",
              color: "rgba(39,215,224,1)",
            }}
          >
            Copy
          </Button>
          <Button
            data-ocid="jsonformatter.clear_button"
            size="sm"
            variant="outline"
            onClick={handleClear}
            className="h-7 px-2 text-xs border"
            style={{ borderColor: "rgba(42,58,66,0.8)", color: "#888" }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          data-ocid="jsonformatter.error_state"
          className="px-3 py-2 text-xs"
          style={{
            background: "rgba(239,68,68,0.15)",
            color: "#f87171",
            borderBottom: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Panels */}
      <div className="flex flex-1 overflow-hidden gap-0">
        <div
          className="flex flex-col flex-1 overflow-hidden"
          style={{ borderRight: "1px solid rgba(42,58,66,0.8)" }}
        >
          <div
            className="px-3 py-1 text-xs"
            style={{
              color: "#888",
              borderBottom: "1px solid rgba(42,58,66,0.5)",
            }}
          >
            Input
          </div>
          <textarea
            data-ocid="jsonformatter.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
            spellCheck={false}
            className="flex-1 resize-none bg-transparent p-3 text-xs outline-none text-foreground"
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              color: error && input ? "#f87171" : undefined,
            }}
          />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <div
            className="px-3 py-1 text-xs"
            style={{
              color: "#888",
              borderBottom: "1px solid rgba(42,58,66,0.5)",
            }}
          >
            Output
          </div>
          <textarea
            data-ocid="jsonformatter.textarea"
            value={output}
            readOnly
            placeholder="Formatted output will appear here..."
            spellCheck={false}
            className="flex-1 resize-none bg-transparent p-3 text-xs outline-none"
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              color: "rgba(39,215,224,0.9)",
            }}
          />
        </div>
      </div>

      {/* Status bar */}
      <div
        className="px-3 py-1 text-xs flex gap-4"
        style={{ borderTop: "1px solid rgba(42,58,66,0.8)", color: "#666" }}
      >
        <span>Lines: {lineCount}</span>
        <span>Chars: {charCount}</span>
      </div>
    </div>
  );
}
