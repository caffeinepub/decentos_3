import { Check, ClipboardCopy, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type Format = "json" | "csv" | "yaml" | "xml";

const FORMAT_LABELS: Record<Format, string> = {
  json: "JSON",
  csv: "CSV",
  yaml: "YAML",
  xml: "XML",
};

function parseJson(text: string): unknown {
  return JSON.parse(text);
}

function stringifyJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2)
    throw new Error("CSV must have at least a header and one data row");
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"|$/g, ""));
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"|$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = vals[i] ?? "";
    });
    return obj;
  });
}

function stringifyCsv(data: unknown): string {
  if (!Array.isArray(data))
    throw new Error("CSV output requires an array of objects");
  if (data.length === 0) return "";
  const headers = Object.keys(data[0] as Record<string, unknown>);
  const rows = data.map((row: Record<string, unknown>) =>
    headers
      .map((h) => {
        const v = String(row[h] ?? "");
        return v.includes(",") ? `"${v}"` : v;
      })
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

function parseYaml(text: string): unknown {
  const result: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([\w\-]+):\s*(.*)/);
    if (m) result[m[1]] = m[2].trim();
  }
  return result;
}

function stringifyYaml(data: unknown): string {
  if (Array.isArray(data)) {
    return data
      .map((item, i) => {
        const entries = Object.entries(item as Record<string, unknown>);
        return `- # item ${i + 1}\n${entries.map(([k, v]) => `  ${k}: ${v}`).join("\n")}`;
      })
      .join("\n");
  }
  return Object.entries(data as Record<string, unknown>)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function parseXml(text: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const root = doc.documentElement;
  if (root.nodeName === "parsererror") throw new Error("Invalid XML");
  const result: Record<string, string> = {};
  for (const child of Array.from(root.children)) {
    result[child.tagName] = child.textContent ?? "";
  }
  return result;
}

function stringifyXml(data: unknown): string {
  if (Array.isArray(data)) {
    const items = data
      .map((item) => {
        const inner = Object.entries(item as Record<string, unknown>)
          .map(([k, v]) => `  <${k}>${v}</${k}>`)
          .join("\n");
        return `  <item>\n${inner}\n  </item>`;
      })
      .join("\n");
    return `<root>\n${items}\n</root>`;
  }
  const inner = Object.entries(data as Record<string, unknown>)
    .map(([k, v]) => `  <${k}>${v}</${k}>`)
    .join("\n");
  return `<root>\n${inner}\n</root>`;
}

function convertData(text: string, from: Format, to: Format): string {
  if (!text.trim()) return "";
  let parsed: unknown;
  switch (from) {
    case "json":
      parsed = parseJson(text);
      break;
    case "csv":
      parsed = parseCsv(text);
      break;
    case "yaml":
      parsed = parseYaml(text);
      break;
    case "xml":
      parsed = parseXml(text);
      break;
  }
  switch (to) {
    case "json":
      return stringifyJson(parsed);
    case "csv":
      return stringifyCsv(parsed);
    case "yaml":
      return stringifyYaml(parsed);
    case "xml":
      return stringifyXml(parsed);
  }
}

interface Conversion {
  from: Format;
  to: Format;
  inputSnippet: string;
  ts: number;
}

export function FileConverter() {
  const {
    data: historyData,
    set: saveHistory,
    loading,
  } = useCanisterKV<Conversion[]>("decentos_fileconverter_history", []);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fromFormat, setFromFormat] = useState<Format>("json");
  const [toFormat, setToFormat] = useState<Format>("csv");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Conversion[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!loading && !initialized.current) {
      initialized.current = true;
      setHistory(Array.isArray(historyData) ? historyData : []);
    }
  }, [loading, historyData]);

  const handleConvert = useCallback(() => {
    setError("");
    setOutputText("");
    try {
      const result = convertData(inputText, fromFormat, toFormat);
      setOutputText(result);
      const entry: Conversion = {
        from: fromFormat,
        to: toFormat,
        inputSnippet: inputText.slice(0, 60),
        ts: Date.now(),
      };
      const next = [entry, ...history].slice(0, 5);
      setHistory(next);
      saveHistory(next);
      toast.success("Converted successfully ✓");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  }, [inputText, fromFormat, toFormat, history, saveHistory]);

  const handleCopy = useCallback(() => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const btnStyle = {
    background: "rgba(39,215,224,0.12)",
    border: "1px solid rgba(39,215,224,0.3)",
    color: "var(--os-accent)",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 600,
  };

  const selectStyle = {
    background: "rgba(15,22,30,0.9)",
    border: "1px solid rgba(39,215,224,0.2)",
    color: "rgba(232,238,242,0.85)",
    borderRadius: 6,
    padding: "4px 8px",
    fontSize: 12,
    outline: "none",
    cursor: "pointer",
  };

  const textareaStyle = {
    flex: 1,
    resize: "none" as const,
    outline: "none",
    background: "var(--os-bg-app)",
    border: "1px solid rgba(39,215,224,0.15)",
    borderRadius: 8,
    color: "rgba(232,238,242,0.85)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    padding: 12,
    lineHeight: 1.6,
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "rgba(8,14,20,0.95)",
        color: "rgba(232,238,242,0.9)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(39,215,224,0.1)" }}
      >
        <span
          style={{ color: "var(--os-accent)", fontSize: 13, fontWeight: 700 }}
        >
          File Converter
        </span>
        <span style={{ color: "var(--os-text-muted)", fontSize: 11 }}>
          JSON · CSV · YAML · XML
        </span>
      </div>

      {/* Main panels */}
      <div className="flex flex-1 gap-3 p-3 min-h-0">
        {/* Input */}
        <div className="flex flex-col flex-1 gap-2 min-h-0">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11, color: "var(--os-text-secondary)" }}>
              Input
            </span>
            <select
              value={fromFormat}
              onChange={(e) => setFromFormat(e.target.value as Format)}
              style={selectStyle}
              data-ocid="fileconverter.select"
            >
              {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
                <option key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Paste ${FORMAT_LABELS[fromFormat]} here...`}
            style={textareaStyle}
            data-ocid="fileconverter.textarea"
          />
        </div>

        {/* Convert button */}
        <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleConvert}
            style={{
              ...btnStyle,
              padding: "10px 16px",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            data-ocid="fileconverter.primary_button"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Convert
          </button>
          <div
            style={{
              fontSize: 10,
              color: "rgba(39,215,224,0.5)",
              textAlign: "center",
            }}
          >
            {FORMAT_LABELS[fromFormat]} →<br />
            {FORMAT_LABELS[toFormat]}
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col flex-1 gap-2 min-h-0">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11, color: "var(--os-text-secondary)" }}>
              Output
            </span>
            <select
              value={toFormat}
              onChange={(e) => setToFormat(e.target.value as Format)}
              style={selectStyle}
              data-ocid="fileconverter.select"
            >
              {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
                <option key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </option>
              ))}
            </select>
            {outputText && (
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  ...btnStyle,
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
                data-ocid="fileconverter.secondary_button"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <ClipboardCopy className="w-3 h-3" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={outputText}
            readOnly
            placeholder="Output will appear here..."
            style={{ ...textareaStyle, opacity: outputText ? 1 : 0.5 }}
            data-ocid="fileconverter.textarea"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mx-3 mb-2 px-3 py-2 rounded text-xs"
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
          }}
          data-ocid="fileconverter.error_state"
        >
          {error}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div
          className="px-3 pb-3 flex-shrink-0"
          style={{
            borderTop: "1px solid rgba(39,215,224,0.08)",
            paddingTop: 8,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "var(--os-text-muted)",
              marginBottom: 6,
            }}
          >
            Recent conversions
          </div>
          <div className="flex gap-2 flex-wrap">
            {history.map((h, i) => (
              <div
                key={`${h.ts}-${i}`}
                style={{
                  fontSize: 10,
                  color: "rgba(39,215,224,0.7)",
                  background: "rgba(39,215,224,0.06)",
                  border: "1px solid rgba(39,215,224,0.15)",
                  borderRadius: 4,
                  padding: "2px 8px",
                }}
              >
                {FORMAT_LABELS[h.from]} → {FORMAT_LABELS[h.to]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
