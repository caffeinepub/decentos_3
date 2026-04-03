import { Check, Code2, Copy, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Tab = "json" | "base64" | "hash" | "baseconv" | "regex";

const TABS: { id: Tab; label: string }[] = [
  { id: "json", label: "JSON" },
  { id: "base64", label: "Base64" },
  { id: "hash", label: "Hash" },
  { id: "baseconv", label: "BaseConv" },
  { id: "regex", label: "Regex" },
];

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(label ? `${label} copied` : "Copied");
    });
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all flex-shrink-0"
      style={{
        background: copied ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.15)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(124,58,237,0.3)"}`,
        color: copied ? "#22C55E" : "rgba(167,139,250,0.9)",
      }}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {label && <span className="ml-0.5">{copied ? "Copied" : label}</span>}
    </button>
  );
}

// ── JSON Tab ────────────────────────────────────────────────────────────────
function JsonTab() {
  const [input, setInput] = useState(
    `{\n  "name": "DecentOS",\n  "version": 1,\n  "features": ["json", "base64", "hash"]\n}`,
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"format" | "minify" | "validate">("format");

  const process = useCallback(
    (m: "format" | "minify" | "validate") => {
      setMode(m);
      setError("");
      try {
        const parsed = JSON.parse(input);
        if (m === "format") {
          setOutput(JSON.stringify(parsed, null, 2));
        } else if (m === "minify") {
          setOutput(JSON.stringify(parsed));
        } else {
          setOutput(
            `✅ Valid JSON\n\nType: ${Array.isArray(parsed) ? "Array" : typeof parsed}\nKeys: ${typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? Object.keys(parsed).length : "N/A"}`,
          );
        }
      } catch (e) {
        setError(`❌ ${(e as Error).message}`);
        setOutput("");
      }
    },
    [input],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional init
  useEffect(() => {
    process("format");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-1 flex-shrink-0">
        {(["format", "minify", "validate"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => process(m)}
            className="px-3 py-1.5 rounded text-xs capitalize transition-all"
            style={{
              background:
                mode === m ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.08)",
              border: `1px solid ${mode === m ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.2)"}`,
              color: mode === m ? "#a78bfa" : "var(--os-text-secondary)",
            }}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="flex gap-3 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-1">
          <span
            className="text-[10px] uppercase tracking-wide"
            style={{ color: "var(--os-text-muted)" }}
          >
            Input
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              lineHeight: 1.6,
            }}
            spellCheck={false}
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] uppercase tracking-wide"
              style={{ color: "var(--os-text-muted)" }}
            >
              Output
            </span>
            <CopyButton text={output} />
          </div>
          {error ? (
            <div
              className="flex-1 rounded-lg p-3 text-xs font-mono"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              className="flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none"
              style={{
                background: "var(--os-bg-elevated)",
                border: "1px solid var(--os-border-subtle)",
                color: "var(--os-text-primary)",
                lineHeight: 1.6,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Base64 Tab ───────────────────────────────────────────────────────────────
function Base64Tab() {
  const [input, setInput] = useState("Hello, DecentOS!");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = useCallback(
    (m: "encode" | "decode", val?: string) => {
      const text = val ?? input;
      setMode(m);
      try {
        if (m === "encode") {
          setOutput(btoa(unescape(encodeURIComponent(text))));
        } else {
          setOutput(decodeURIComponent(escape(atob(text))));
        }
      } catch {
        setOutput("❌ Invalid input for decode");
      }
    },
    [input],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional init
  useEffect(() => {
    process("encode");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-1 flex-shrink-0">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => process(m)}
            className="px-3 py-1.5 rounded text-xs capitalize transition-all"
            style={{
              background:
                mode === m ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.08)",
              border: `1px solid ${mode === m ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.2)"}`,
              color: mode === m ? "#a78bfa" : "var(--os-text-secondary)",
            }}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="flex gap-3 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-1">
          <span
            className="text-[10px] uppercase tracking-wide"
            style={{ color: "var(--os-text-muted)" }}
          >
            Input
          </span>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              process(mode, e.target.value);
            }}
            className="flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              lineHeight: 1.6,
            }}
            spellCheck={false}
            placeholder={
              mode === "decode"
                ? "Base64 encoded string..."
                : "Text to encode..."
            }
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] uppercase tracking-wide"
              style={{ color: "var(--os-text-muted)" }}
            >
              Output
            </span>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={output}
            className="flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              lineHeight: 1.6,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Hash Tab ─────────────────────────────────────────────────────────────────
function sha256Hex(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest("SHA-256", data).then((buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  );
}

function sha1Hex(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest("SHA-1", data).then((buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  );
}

/** Simple CRC32 (pure JS, no crypto.subtle needed) */
function crc32(str: string): string {
  const table: number[] = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  const bytes = new TextEncoder().encode(str);
  for (const byte of bytes) {
    crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}

function HashTab() {
  const [input, setInput] = useState("Hello, DecentOS!");
  const [sha256, setSha256] = useState("");
  const [sha1, setSha1] = useState("");
  const [crc32val, setCrc32val] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const computeHashes = useCallback(async (val: string) => {
    if (!val) {
      setSha256("");
      setSha1("");
      setCrc32val("");
      return;
    }
    const [s256, s1] = await Promise.all([sha256Hex(val), sha1Hex(val)]);
    setSha256(s256);
    setSha1(s1);
    setCrc32val(crc32(val));
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional init
  useEffect(() => {
    computeHashes(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (val: string) => {
    setInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => computeHashes(val), 200);
  };

  const hashRows = [
    { label: "SHA-256", value: sha256, color: "#a78bfa" },
    { label: "SHA-1", value: sha1, color: "#60a5fa" },
    { label: "CRC-32", value: crc32val, color: "#34d399" },
  ];

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex flex-col gap-1 flex-shrink-0">
        <span
          className="text-[10px] uppercase tracking-wide"
          style={{ color: "var(--os-text-muted)" }}
        >
          Input Text
        </span>
        <textarea
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          rows={3}
          className="resize-none rounded-lg p-3 text-xs font-mono outline-none"
          style={{
            background: "var(--os-bg-elevated)",
            border: "1px solid var(--os-border-subtle)",
            color: "var(--os-text-primary)",
            lineHeight: 1.6,
          }}
          spellCheck={false}
          placeholder="Enter text to hash..."
        />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {hashRows.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-lg p-3"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold" style={{ color }}>
                {label}
              </span>
              <CopyButton text={value} label="Copy" />
            </div>
            <p
              className="text-[11px] font-mono break-all leading-relaxed"
              style={{ color: "var(--os-text-secondary)" }}
            >
              {value || <span style={{ opacity: 0.3 }}>—</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BaseConv Tab ─────────────────────────────────────────────────────────────
function BaseConvTab() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState<"2" | "8" | "10" | "16">("10");
  const [toBase, setToBase] = useState<"2" | "8" | "10" | "16">("16");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const convert = useCallback((val: string, from: string, to: string) => {
    setError("");
    if (!val.trim()) {
      setResult("");
      return;
    }
    try {
      const decimal = Number.parseInt(val.trim(), Number(from));
      if (Number.isNaN(decimal)) {
        setError("Invalid number for selected base");
        setResult("");
        return;
      }
      setResult(decimal.toString(Number(to)).toUpperCase());
    } catch {
      setError("Conversion error");
      setResult("");
    }
  }, []);

  useEffect(() => {
    convert(input, fromBase, toBase);
  }, [input, fromBase, toBase, convert]);

  const bases = ["2", "8", "10", "16"] as const;
  const baseLabels: Record<string, string> = {
    "2": "Binary",
    "8": "Octal",
    "10": "Decimal",
    "16": "Hexadecimal",
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span
            className="text-[10px] uppercase tracking-wide"
            style={{ color: "var(--os-text-muted)" }}
          >
            From Base
          </span>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(e.target.value as typeof fromBase)}
            className="rounded-lg px-3 py-2 text-xs outline-none"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              colorScheme: "dark",
            }}
          >
            {bases.map((b) => (
              <option key={b} value={b}>
                Base {b} — {baseLabels[b]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span
            className="text-[10px] uppercase tracking-wide"
            style={{ color: "var(--os-text-muted)" }}
          >
            To Base
          </span>
          <select
            value={toBase}
            onChange={(e) => setToBase(e.target.value as typeof toBase)}
            className="rounded-lg px-3 py-2 text-xs outline-none"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              colorScheme: "dark",
            }}
          >
            {bases.map((b) => (
              <option key={b} value={b}>
                Base {b} — {baseLabels[b]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span
          className="text-[10px] uppercase tracking-wide"
          style={{ color: "var(--os-text-muted)" }}
        >
          Input ({baseLabels[fromBase]})
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="rounded-lg px-3 py-2.5 text-sm font-mono outline-none"
          style={{
            background: "var(--os-bg-elevated)",
            border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "var(--os-border-subtle)"}`,
            color: "var(--os-text-primary)",
          }}
          placeholder={`Enter ${baseLabels[fromBase].toLowerCase()} number...`}
        />
        {error && (
          <p className="text-[11px]" style={{ color: "#f87171" }}>
            {error}
          </p>
        )}
      </div>
      {result && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[11px]"
              style={{ color: "var(--os-text-muted)" }}
            >
              {baseLabels[fromBase]} → {baseLabels[toBase]}
            </span>
            <CopyButton text={result} />
          </div>
          <p
            className="text-2xl font-mono font-bold tracking-wider"
            style={{ color: "#a78bfa" }}
          >
            {result}
          </p>
        </div>
      )}
      {/* Quick reference grid */}
      {input && !error && (
        <div className="grid grid-cols-4 gap-2 flex-shrink-0">
          {bases.map((b) => {
            let val = "";
            try {
              val = Number.parseInt(input.trim(), Number(fromBase))
                .toString(Number(b))
                .toUpperCase();
            } catch {
              /* ignore */
            }
            return (
              <div
                key={b}
                className="rounded-lg p-2 text-center"
                style={{
                  background: "var(--os-bg-elevated)",
                  border: `1px solid ${b === toBase ? "rgba(124,58,237,0.5)" : "var(--os-border-subtle)"}`,
                }}
              >
                <p
                  className="text-[9px] mb-1"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  Base {b}
                </p>
                <p
                  className="text-[11px] font-mono font-semibold truncate"
                  style={{
                    color:
                      b === toBase ? "#a78bfa" : "var(--os-text-secondary)",
                  }}
                >
                  {val || "—"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Regex Tab ─────────────────────────────────────────────────────────────────
function RegexTab() {
  const [pattern, setPattern] = useState("\\b\\w{5,}\\b");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testStr, setTestStr] = useState(
    "The quick brown fox jumps over the lazy dog.\nA sample string with multiple words.",
  );
  const [matchCount, setMatchCount] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [highlighted, setHighlighted] = useState("");

  const runRegex = useCallback(() => {
    setError("");
    if (!pattern) {
      setMatchCount(0);
      setMatches([]);
      setHighlighted(testStr);
      return;
    }
    try {
      const flagStr = Object.entries(flags)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join("");
      const re = new RegExp(pattern, flagStr || "g");
      const found = testStr.match(flags.g ? re : re) ?? [];
      setMatches(found);
      setMatchCount(found.length);
      // Build highlighted string (escape HTML)
      const esc = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const reForHl = new RegExp(
        pattern,
        flagStr.includes("g") ? flagStr : `${flagStr}g`,
      );
      const hl = esc(testStr).replace(
        new RegExp(reForHl.source, reForHl.flags),
        (m) =>
          `<mark style="background:rgba(124,58,237,0.35);color:#e9d5ff;border-radius:2px">${esc(m)}</mark>`,
      );
      setHighlighted(hl);
    } catch (e) {
      setError((e as Error).message);
      setMatchCount(0);
      setMatches([]);
      setHighlighted("");
    }
  }, [pattern, flags, testStr]);

  useEffect(() => {
    runRegex();
  }, [runRegex]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Pattern input */}
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-wide"
            style={{ color: "var(--os-text-muted)" }}
          >
            Pattern
          </span>
          {/* Flags */}
          <div className="flex items-center gap-2">
            {(["g", "i", "m"] as const).map((f) => (
              <label
                key={f}
                className="flex items-center gap-1 cursor-pointer text-xs select-none"
              >
                <input
                  type="checkbox"
                  checked={flags[f]}
                  onChange={(e) =>
                    setFlags((prev) => ({ ...prev, [f]: e.target.checked }))
                  }
                  className="w-3 h-3"
                />
                <span
                  className="font-mono font-semibold"
                  style={{
                    color: flags[f] ? "#a78bfa" : "var(--os-text-muted)",
                  }}
                >
                  /{f}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono"
            style={{ color: "var(--os-text-muted)" }}
          >
            /
          </span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full rounded-lg pl-6 pr-3 py-2.5 text-sm font-mono outline-none"
            style={{
              background: "var(--os-bg-elevated)",
              border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(124,58,237,0.4)"}`,
              color: "#a78bfa",
            }}
            placeholder="Your regex pattern..."
          />
        </div>
        {error && (
          <p className="text-[11px]" style={{ color: "#f87171" }}>
            ❌ {error}
          </p>
        )}
      </div>

      {/* Test string */}
      <div className="flex flex-col gap-1 flex-1 min-h-0">
        <span
          className="text-[10px] uppercase tracking-wide flex-shrink-0"
          style={{ color: "var(--os-text-muted)" }}
        >
          Test String
        </span>
        <textarea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          className="flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none"
          style={{
            background: "var(--os-bg-elevated)",
            border: "1px solid var(--os-border-subtle)",
            color: "var(--os-text-primary)",
            lineHeight: 1.7,
          }}
          spellCheck={false}
        />
      </div>

      {/* Results */}
      <div className="flex-shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold"
            style={{
              color: matchCount > 0 ? "#a78bfa" : "var(--os-text-muted)",
            }}
          >
            {matchCount} match{matchCount !== 1 ? "es" : ""}
          </span>
          {matchCount > 0 && (
            <div className="flex flex-wrap gap-1">
              {matches.slice(0, 8).map((m, i) => (
                <span
                  key={`m-${m.slice(0, 8)}-${i}`}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                  style={{
                    background: "rgba(124,58,237,0.2)",
                    color: "#c4b5fd",
                    border: "1px solid rgba(124,58,237,0.3)",
                  }}
                >
                  {m}
                </span>
              ))}
              {matches.length > 8 && (
                <span
                  className="text-[10px]"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  +{matches.length - 8} more
                </span>
              )}
            </div>
          )}
        </div>
        {highlighted && (
          <div
            className="rounded-lg p-3 text-[11px] font-mono leading-relaxed max-h-24 overflow-y-auto"
            style={{
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-secondary)",
              whiteSpace: "pre-wrap",
            }}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional regex highlighting
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function DeveloperToolkit() {
  const [activeTab, setActiveTab] = useState<Tab>("json");

  const renderTab = () => {
    switch (activeTab) {
      case "json":
        return <JsonTab />;
      case "base64":
        return <Base64Tab />;
      case "hash":
        return <HashTab />;
      case "baseconv":
        return <BaseConvTab />;
      case "regex":
        return <RegexTab />;
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--os-bg-app)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(124,58,237,0.2)",
          background: "var(--os-bg-app)",
        }}
      >
        <Code2 className="w-4 h-4 flex-shrink-0" style={{ color: "#a78bfa" }} />
        <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>
          Developer Toolkit
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full ml-1"
          style={{
            background: "rgba(124,58,237,0.1)",
            color: "rgba(167,139,250,0.7)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          5 tools
        </span>
      </div>

      {/* Tab bar */}
      <div
        className="flex border-b flex-shrink-0 px-3"
        style={{ borderColor: "rgba(124,58,237,0.15)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`devtoolkit.${tab.id}.tab`}
            className="px-3 py-2 text-xs font-medium transition-colors"
            style={{
              borderBottom:
                activeTab === tab.id
                  ? "2px solid rgba(124,58,237,0.8)"
                  : "2px solid transparent",
              color:
                activeTab === tab.id ? "#a78bfa" : "var(--os-text-secondary)",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{renderTab()}</div>
    </div>
  );
}
