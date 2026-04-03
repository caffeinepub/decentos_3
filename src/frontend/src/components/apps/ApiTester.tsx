import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  Plus,
  Send,
  Trash2,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Header {
  id: string;
  key: string;
  value: string;
}

interface ResponseData {
  status: number;
  statusText: string;
  time: number;
  body: string;
  contentType: string;
  error?: string;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "#27D7E0",
  POST: "#22c55e",
  PUT: "#f59e0b",
  DELETE: "#ef4444",
  PATCH: "#a78bfa",
};

function genId() {
  return `h_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return "#22c55e";
  if (status >= 400 && status < 500) return "#f59e0b";
  return "#ef4444";
}

function prettyJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

interface HistoryEntry {
  method: string;
  url: string;
  responseStatus: number;
  responseTime: number;
  timestamp: string;
}

interface ApiTesterProps {
  windowProps?: Record<string, unknown>;
}

export default function ApiTester({ windowProps: _w }: ApiTesterProps) {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/posts/1",
  );
  const [headers, setHeaders] = useState<Header[]>([
    { id: genId(), key: "Accept", value: "application/json" },
  ]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"headers" | "body" | "response">(
    "headers",
  );
  const abortRef = useRef<AbortController | null>(null);
  const { data: history, set: setHistory } = useCanisterKV<HistoryEntry[]>(
    "apitester_history",
    [],
  );

  const addHeader = () => {
    setHeaders((prev) => [...prev, { id: genId(), key: "", value: "" }]);
  };

  const removeHeader = (id: string) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  const updateHeader = (id: string, field: "key" | "value", val: string) => {
    setHeaders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h)),
    );
  };

  const sendRequest = async () => {
    if (!url.trim()) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setActiveTab("response");
    const start = Date.now();
    try {
      const hdrs: Record<string, string> = {};
      for (const h of headers) {
        if (h.key.trim()) hdrs[h.key.trim()] = h.value;
      }
      const init: RequestInit = {
        method,
        headers: hdrs,
        signal: abortRef.current.signal,
      };
      if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
        init.body = body;
      }
      const res = await fetch(url, init);
      const elapsed = Date.now() - start;
      const text = await res.text();
      setResponse({
        status: res.status,
        statusText: res.statusText,
        time: elapsed,
        body: text,
        contentType: res.headers.get("content-type") ?? "",
      });
      const entry: HistoryEntry = {
        method,
        url,
        responseStatus: res.status,
        responseTime: elapsed,
        timestamp: new Date().toISOString(),
      };
      setHistory([entry, ...history].slice(0, 5));
    } catch (err: unknown) {
      const elapsed = Date.now() - start;
      const isCors =
        err instanceof TypeError &&
        (err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError"));
      setResponse({
        status: 0,
        statusText: "Error",
        time: elapsed,
        body: "",
        contentType: "",
        error: isCors
          ? "CORS error: the server doesn't allow requests from browsers. Try a public API like https://jsonplaceholder.typicode.com/posts"
          : String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const isBodyMethod = ["POST", "PUT", "PATCH"].includes(method);

  const _panel = {
    background: "rgba(8,14,20,0.95)",
    border: "1px solid rgba(39,215,224,0.15)",
  };
  const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };
  const muted = "var(--os-text-secondary)";

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(8,14,20,0.95)", ...mono }}
    >
      {/* URL bar */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(39,215,224,0.12)",
          background: "rgba(10,16,20,0.7)",
        }}
      >
        {/* Method pills */}
        <div className="flex gap-1">
          {(["GET", "POST", "PUT", "DELETE", "PATCH"] as HttpMethod[]).map(
            (m) => (
              <button
                key={m}
                type="button"
                data-ocid={`apitester.${m.toLowerCase()}_button`}
                onClick={() => setMethod(m)}
                className="px-2 py-1 rounded text-[10px] font-bold transition-all"
                style={{
                  background:
                    method === m
                      ? `${METHOD_COLORS[m]}22`
                      : "var(--os-border-subtle)",
                  border:
                    method === m
                      ? `1px solid ${METHOD_COLORS[m]}55`
                      : "1px solid var(--os-border-subtle)",
                  color: method === m ? METHOD_COLORS[m] : muted,
                }}
              >
                {m}
              </button>
            ),
          )}
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendRequest();
          }}
          placeholder="https://api.example.com/endpoint"
          data-ocid="apitester.input"
          className="flex-1 px-2 py-1 rounded text-[12px] outline-none"
          style={{
            background: "var(--os-border-subtle)",
            border: "1px solid rgba(39,215,224,0.15)",
            color: "var(--os-text-primary)",
            ...mono,
          }}
        />
        <button
          type="button"
          onClick={sendRequest}
          disabled={loading}
          data-ocid="apitester.submit_button"
          className="flex items-center gap-1.5 h-7 px-3 rounded font-semibold text-[11px] transition-all"
          style={{
            background: loading
              ? "rgba(39,215,224,0.07)"
              : "rgba(39,215,224,0.15)",
            border: "1px solid rgba(39,215,224,0.35)",
            color: loading ? "rgba(39,215,224,0.4)" : "#27D7E0",
          }}
        >
          {loading ? (
            <Clock className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-0 border-b flex-shrink-0"
        style={{ borderColor: "rgba(39,215,224,0.1)" }}
      >
        {(
          ["headers", ...(isBodyMethod ? ["body"] : []), "response"] as Array<
            "headers" | "body" | "response"
          >
        ).map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`apitester.${tab}_tab`}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-[11px] font-semibold capitalize transition-all relative"
            style={{
              color: activeTab === tab ? "#27D7E0" : muted,
              borderBottom:
                activeTab === tab
                  ? "2px solid #27D7E0"
                  : "2px solid transparent",
            }}
          >
            {tab}
            {tab === "response" && response && (
              <span
                className="ml-1.5 text-[9px] px-1 py-0.5 rounded-full"
                style={{
                  background: `${getStatusColor(response.status)}22`,
                  color: getStatusColor(response.status),
                }}
              >
                {response.status || "ERR"}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "headers" && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] font-semibold"
                style={{ color: "rgba(39,215,224,0.7)" }}
              >
                REQUEST HEADERS
              </p>
              <button
                type="button"
                onClick={addHeader}
                data-ocid="apitester.add_button"
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all"
                style={{
                  background: "rgba(39,215,224,0.08)",
                  border: "1px solid rgba(39,215,224,0.2)",
                  color: "var(--os-accent)",
                }}
              >
                <Plus className="w-2.5 h-2.5" /> Add
              </button>
            </div>
            {headers.map((h, i) => (
              <div
                key={h.id}
                data-ocid={`apitester.row.${i + 1}`}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Header name"
                  value={h.key}
                  onChange={(e) => updateHeader(h.id, "key", e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded text-[11px] outline-none"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(39,215,224,0.12)",
                    color: "var(--os-text-secondary)",
                    ...mono,
                  }}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={h.value}
                  onChange={(e) => updateHeader(h.id, "value", e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded text-[11px] outline-none"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(39,215,224,0.12)",
                    color: "var(--os-text-secondary)",
                    ...mono,
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeHeader(h.id)}
                  data-ocid={`apitester.delete_button.${i + 1}`}
                  className="w-7 h-7 rounded flex items-center justify-center transition-all"
                  style={{
                    background: "rgba(239,68,68,0.07)",
                    border: "1px solid rgba(239,68,68,0.15)",
                    color: "rgba(239,68,68,0.6)",
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "body" && isBodyMethod && (
          <div className="flex-1 flex flex-col p-3">
            <p
              className="text-[10px] font-semibold mb-2"
              style={{ color: "rgba(39,215,224,0.7)" }}
            >
              REQUEST BODY
            </p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={'{ "key": "value" }'}
              data-ocid="apitester.textarea"
              className="flex-1 p-2 rounded resize-none text-[12px] outline-none leading-relaxed"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.15)",
                color: "var(--os-text-primary)",
                ...mono,
              }}
            />
          </div>
        )}

        {activeTab === "response" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {!response && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <Zap
                  className="w-10 h-10"
                  style={{ color: "rgba(39,215,224,0.15)" }}
                />
                <p
                  className="text-[12px]"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  Send a request to see the response
                </p>
              </div>
            )}
            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div
                  data-ocid="apitester.loading_state"
                  className="flex flex-col items-center gap-2"
                >
                  <Clock
                    className="w-8 h-8 animate-spin"
                    style={{ color: "rgba(39,215,224,0.4)" }}
                  />
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    Sending request...
                  </p>
                </div>
              </div>
            )}
            {response && !loading && (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Response meta bar */}
                <div
                  className="flex items-center gap-3 px-3 py-2 border-b flex-shrink-0"
                  style={{
                    borderColor: "rgba(39,215,224,0.1)",
                    background: "rgba(10,16,20,0.6)",
                  }}
                >
                  {response.error ? (
                    <AlertCircle
                      className="w-3.5 h-3.5"
                      style={{ color: "#ef4444" }}
                    />
                  ) : (
                    <CheckCircle2
                      className="w-3.5 h-3.5"
                      style={{ color: getStatusColor(response.status) }}
                    />
                  )}
                  {response.status > 0 && (
                    <span
                      className="text-[12px] font-bold"
                      style={{ color: getStatusColor(response.status) }}
                    >
                      {response.status} {response.statusText}
                    </span>
                  )}
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    {response.time}ms
                  </span>
                  {response.contentType && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(39,215,224,0.08)",
                        color: "rgba(39,215,224,0.6)",
                      }}
                    >
                      {response.contentType.split(";")[0]}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div
                  className="flex-1 overflow-y-auto p-3"
                  data-ocid={
                    response.error
                      ? "apitester.error_state"
                      : "apitester.success_state"
                  }
                >
                  {response.error ? (
                    <div
                      className="flex gap-2 p-3 rounded-lg"
                      style={{
                        background: "rgba(239,68,68,0.07)",
                        border: "1px solid rgba(239,68,68,0.2)",
                      }}
                    >
                      <Info
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: "#ef4444" }}
                      />
                      <p
                        className="text-[12px] leading-relaxed"
                        style={{ color: "var(--os-text-primary)" }}
                      >
                        {response.error}
                      </p>
                    </div>
                  ) : (
                    <pre
                      className="text-[11px] leading-relaxed whitespace-pre-wrap break-all"
                      style={{ color: "var(--os-text-secondary)", ...mono }}
                    >
                      {response.contentType.includes("json")
                        ? prettyJson(response.body)
                        : response.body || "(empty body)"}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {/* History */}
        {history.length > 0 && (
          <div
            className="border-t flex-shrink-0"
            style={{
              borderColor: "rgba(39,215,224,0.1)",
              background: "rgba(10,16,20,0.6)",
            }}
          >
            <p
              className="text-[10px] font-semibold px-3 py-1.5"
              style={{ color: "rgba(39,215,224,0.6)" }}
            >
              RECENT REQUESTS
            </p>
            {history.map((h, i) => (
              <button
                key={h.timestamp}
                type="button"
                data-ocid={`apitester.row.${i + 1}`}
                onClick={() => {
                  setMethod(h.method as HttpMethod);
                  setUrl(h.url);
                }}
                className="w-full flex items-center gap-3 px-3 py-1.5 text-left hover:bg-white/5 transition-all border-t"
                style={{ borderColor: "var(--os-border-subtle)" }}
              >
                <span
                  className="text-[10px] font-bold w-12 flex-shrink-0"
                  style={{
                    color: METHOD_COLORS[h.method as HttpMethod] ?? "#27D7E0",
                  }}
                >
                  {h.method}
                </span>
                <span
                  className="flex-1 text-[11px] truncate"
                  style={{
                    color: "var(--os-text-secondary)",
                    fontFamily: "monospace",
                  }}
                >
                  {h.url}
                </span>
                <span
                  className="text-[10px] flex-shrink-0"
                  style={{
                    color:
                      h.responseStatus >= 200 && h.responseStatus < 300
                        ? "#22c55e"
                        : "#ef4444",
                  }}
                >
                  {h.responseStatus || "ERR"}
                </span>
                <span
                  className="text-[10px] flex-shrink-0"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  {h.responseTime}ms
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
