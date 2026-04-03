import {
  ChevronDown,
  ChevronRight,
  Clock,
  Plus,
  Send,
  Trash2,
  Wifi,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Header {
  id: string;
  key: string;
  value: string;
}

interface HistoryEntry {
  id: string;
  method: string;
  url: string;
  status: number;
  time: number;
  timestamp: string;
}

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

// History persistence handled via useCanisterKV

export function NetworkMonitor() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([
    { id: "1", key: "", value: "" },
  ]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    time: number;
    headers: Record<string, string>;
    body: string;
    parsed: unknown;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: history, set: setHistoryChain } = useCanisterKV<HistoryEntry[]>(
    "decent_network_monitor_history",
    [],
  );
  const [showHeaders, setShowHeaders] = useState(false);

  const send = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    const start = performance.now();
    try {
      const reqHeaders: Record<string, string> = {};
      for (const h of headers) {
        if (h.key.trim()) reqHeaders[h.key.trim()] = h.value.trim();
      }
      const opts: RequestInit = { method, headers: reqHeaders };
      if (method !== "GET" && method !== "DELETE" && body.trim()) {
        opts.body = body;
      }
      const res = await fetch(url.trim(), opts);
      const elapsed = Math.round(performance.now() - start);
      const resText = await res.text();
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(resText);
      } catch {}
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });
      setResponse({
        status: res.status,
        time: elapsed,
        headers: resHeaders,
        body: resText,
        parsed,
      });

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        method,
        url: url.trim(),
        status: res.status,
        time: elapsed,
        timestamp: new Date().toLocaleTimeString(),
      };
      const updated = [entry, ...history].slice(0, 10);
      setHistoryChain(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setMethod(entry.method);
    setUrl(entry.url);
  };

  const clearHistory = () => {
    setHistoryChain([]);
  };

  const statusColor = (s: number) =>
    s >= 200 && s < 300
      ? "rgb(39,215,160)"
      : s >= 400
        ? "rgb(255,100,100)"
        : "rgb(255,200,80)";

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "rgba(5,5,10,0.95)",
        color: "#e8e8ee",
        fontSize: 13,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(39,215,224,0.1)" }}
      >
        <Wifi style={{ color: "rgb(39,215,224)", width: 18, height: 18 }} />
        <span className="font-semibold">Network Monitor</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: History */}
        <div
          className="w-48 flex-shrink-0 flex flex-col overflow-hidden"
          style={{ borderRight: "1px solid rgba(39,215,224,0.1)" }}
        >
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{ borderBottom: "1px solid rgba(39,215,224,0.08)" }}
          >
            <span className="text-xs opacity-50 font-medium">HISTORY</span>
            {history.length > 0 && (
              <button type="button" onClick={clearHistory} title="Clear">
                <Trash2
                  width={12}
                  height={12}
                  className="opacity-40 hover:opacity-70"
                />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-[11px] opacity-30 text-center mt-6">
                No history
              </p>
            ) : (
              history.map((entry, idx) => (
                <button
                  key={entry.id}
                  type="button"
                  data-ocid={`network-monitor.item.${idx + 1}`}
                  onClick={() => loadFromHistory(entry)}
                  className="w-full text-left px-3 py-2 hover:bg-white/5 transition-colors"
                  style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="text-[9px] font-bold px-1 py-0.5 rounded"
                      style={{
                        background: "rgba(39,215,224,0.15)",
                        color: "rgb(39,215,224)",
                      }}
                    >
                      {entry.method}
                    </span>
                    <span
                      style={{ color: statusColor(entry.status), fontSize: 10 }}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-60 truncate">{entry.url}</p>
                  <div className="flex items-center gap-1 mt-0.5 opacity-40">
                    <Clock width={9} height={9} />
                    <span className="text-[9px]">
                      {entry.time}ms · {entry.timestamp}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Request + Response */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Request builder */}
          <div
            className="p-3 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(39,215,224,0.08)" }}
          >
            {/* URL bar */}
            <div className="flex gap-2 mb-2">
              <select
                data-ocid="network-monitor.select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="rounded-lg px-2 py-1.5 text-xs font-bold"
                style={{
                  background: "rgba(39,215,224,0.12)",
                  border: "1px solid rgba(39,215,224,0.25)",
                  color: "rgb(39,215,224)",
                  outline: "none",
                }}
              >
                {METHODS.map((m) => (
                  <option
                    key={m}
                    value={m}
                    style={{ background: "var(--os-bg-app)" }}
                  >
                    {m}
                  </option>
                ))}
              </select>
              <input
                data-ocid="network-monitor.input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="https://api.example.com/endpoint"
                className="flex-1 rounded-lg px-3 py-1.5 text-xs"
                style={{
                  background: "var(--os-border-subtle)",
                  border: "1px solid rgba(39,215,224,0.2)",
                  color: "#e8e8ee",
                  outline: "none",
                }}
              />
              <button
                type="button"
                data-ocid="network-monitor.primary_button"
                onClick={send}
                disabled={loading || !url.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: loading
                    ? "rgba(39,215,224,0.08)"
                    : "rgba(39,215,224,0.18)",
                  color: "rgb(39,215,224)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  opacity: loading || !url.trim() ? 0.6 : 1,
                }}
              >
                <Send width={12} height={12} />
                {loading ? "Sending..." : "Send"}
              </button>
            </div>

            {/* Headers */}
            <div className="mb-2">
              <button
                type="button"
                onClick={() => setShowHeaders(!showHeaders)}
                className="flex items-center gap-1 text-[11px] opacity-50 hover:opacity-80 transition-opacity mb-1"
              >
                {showHeaders ? (
                  <ChevronDown width={12} height={12} />
                ) : (
                  <ChevronRight width={12} height={12} />
                )}
                Headers
              </button>
              {showHeaders && (
                <div className="space-y-1">
                  {headers.map((h) => (
                    <div key={h.id} className="flex gap-2">
                      <input
                        data-ocid="network-monitor.input"
                        type="text"
                        placeholder="Key"
                        value={h.key}
                        onChange={(e) => {
                          setHeaders((prev) =>
                            prev.map((x) =>
                              x.id === h.id ? { ...x, key: e.target.value } : x,
                            ),
                          );
                        }}
                        className="flex-1 rounded px-2 py-1 text-[11px]"
                        style={{
                          background: "var(--os-border-subtle)",
                          border: "1px solid var(--os-text-muted)",
                          color: "#e8e8ee",
                          outline: "none",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={h.value}
                        onChange={(e) => {
                          setHeaders((prev) =>
                            prev.map((x) =>
                              x.id === h.id
                                ? { ...x, value: e.target.value }
                                : x,
                            ),
                          );
                        }}
                        className="flex-1 rounded px-2 py-1 text-[11px]"
                        style={{
                          background: "var(--os-border-subtle)",
                          border: "1px solid var(--os-text-muted)",
                          color: "#e8e8ee",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setHeaders((prev) =>
                            prev.filter((x) => x.id !== h.id),
                          )
                        }
                        className="opacity-40 hover:opacity-70"
                      >
                        <X width={12} height={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setHeaders((prev) => [
                        ...prev,
                        { id: Date.now().toString(), key: "", value: "" },
                      ])
                    }
                    className="flex items-center gap-1 text-[11px] opacity-40 hover:opacity-70"
                  >
                    <Plus width={10} height={10} /> Add Header
                  </button>
                </div>
              )}
            </div>

            {/* Body */}
            {(method === "POST" || method === "PUT" || method === "PATCH") && (
              <textarea
                data-ocid="network-monitor.textarea"
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Request body (JSON, text, etc.)"
                className="w-full rounded-lg px-3 py-2 text-xs resize-none"
                style={{
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-text-muted)",
                  color: "#e8e8ee",
                  outline: "none",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            )}

            <p className="text-[10px] opacity-30 mt-1">
              Note: For true on-chain HTTP outcalls, use the Terminal app
            </p>
          </div>

          {/* Response */}
          <div className="flex-1 overflow-y-auto p-3">
            {loading && (
              <div
                data-ocid="network-monitor.loading_state"
                className="flex items-center gap-2 opacity-50"
              >
                <div
                  className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "rgba(39,215,224,0.3)",
                    borderTopColor: "transparent",
                  }}
                />
                <span className="text-xs">Sending request...</span>
              </div>
            )}
            {error && (
              <div
                data-ocid="network-monitor.error_state"
                className="rounded-lg p-3 text-xs"
                style={{
                  background: "rgba(255,60,60,0.1)",
                  border: "1px solid rgba(255,60,60,0.2)",
                  color: "rgb(255,120,120)",
                }}
              >
                {error}
              </div>
            )}
            {response && (
              <div
                data-ocid="network-monitor.success_state"
                className="space-y-3"
              >
                {/* Status */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-lg font-bold"
                    style={{ color: statusColor(response.status) }}
                  >
                    {response.status}
                  </span>
                  <span className="text-xs opacity-50">{response.time}ms</span>
                </div>

                {/* Response Headers */}
                <details className="group">
                  <summary className="text-[11px] opacity-50 cursor-pointer hover:opacity-80 select-none">
                    Response Headers ({Object.keys(response.headers).length})
                  </summary>
                  <div
                    className="mt-2 rounded-lg p-2 text-[11px] space-y-1"
                    style={{
                      background: "var(--os-border-subtle)",
                      fontFamily: "monospace",
                    }}
                  >
                    {Object.entries(response.headers).map(([k, v]) => (
                      <div key={k}>
                        <span style={{ color: "rgb(39,215,224)" }}>{k}: </span>
                        <span className="opacity-70">{v}</span>
                      </div>
                    ))}
                  </div>
                </details>

                {/* Body */}
                <div>
                  <p className="text-[11px] opacity-50 mb-1">Body</p>
                  <pre
                    className="rounded-lg p-3 text-[11px] overflow-x-auto"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid var(--os-border-subtle)",
                      fontFamily: "'JetBrains Mono', monospace",
                      color:
                        response.parsed !== null
                          ? "rgb(180,220,180)"
                          : "#c0c0c8",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                    }}
                  >
                    {response.parsed !== null
                      ? JSON.stringify(response.parsed, null, 2)
                      : response.body || "(empty)"}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkMonitor;
