import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Globe,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { HttpResponse } from "../../backend.d";
import { useActor } from "../../hooks/useActor";

const BOOKMARKS = [
  { label: "example.com", url: "https://example.com" },
  { label: "httpbin /get", url: "https://httpbin.org/get" },
  { label: "first website", url: "http://info.cern.ch" },
];

interface BrowserProps {
  windowProps?: Record<string, unknown>;
}

function looksLikeHtml(body: string): boolean {
  const trimmed = body.trimStart().toLowerCase();
  return (
    trimmed.startsWith("<!doctype") ||
    trimmed.startsWith("<html") ||
    trimmed.startsWith("<head") ||
    (trimmed.startsWith("<") && !trimmed.startsWith("<?xml"))
  );
}

export function Browser({ windowProps: _ }: BrowserProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const isConnecting = actorFetching && !actor;
  const [url, setUrl] = useState("https://example.com");
  const [inputUrl, setInputUrl] = useState("https://example.com");
  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMutation = useMutation({
    mutationFn: async (fetchUrl: string): Promise<HttpResponse> => {
      if (!actor) throw new Error("Not connected to ICP network");
      return actor.fetchUrl(fetchUrl);
    },
    onSuccess: (data: HttpResponse, fetchUrl: string) => {
      setResponse(data);
      setError(null);
      setUrl(fetchUrl);
      setHistoryStack((prev) => {
        const newStack = [...prev.slice(0, historyIndex + 1), fetchUrl];
        setHistoryIndex(newStack.length - 1);
        return newStack;
      });
    },
    onError: (err) => {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Unexpected error from ICP network";
      setError(msg);
      setResponse(null);
    },
  });

  // Auto-trigger fetch once actor becomes available after a pending navigation
  useEffect(() => {
    if (actor && pendingUrl) {
      fetchMutation.mutate(pendingUrl);
      setPendingUrl(null);
    }
  }, [actor, pendingUrl, fetchMutation.mutate]);

  const navigate = (navUrl: string) => {
    const normalized = navUrl.startsWith("http") ? navUrl : `https://${navUrl}`;
    setInputUrl(normalized);
    if (!actor) {
      // Actor not ready -- queue the navigation
      setPendingUrl(normalized);
      return;
    }
    fetchMutation.mutate(normalized);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prev = historyStack[historyIndex - 1];
      setHistoryIndex((i) => i - 1);
      setInputUrl(prev);
      setUrl(prev);
      if (actor) fetchMutation.mutate(prev);
      else setPendingUrl(prev);
    }
  };

  const goForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const next = historyStack[historyIndex + 1];
      setHistoryIndex((i) => i + 1);
      setInputUrl(next);
      setUrl(next);
      if (actor) fetchMutation.mutate(next);
      else setPendingUrl(next);
    }
  };

  const isHtml = response ? looksLikeHtml(response.body) : false;
  const statusOk =
    response && response.statusCode >= 200 && response.statusCode < 300;
  const byteSize = response
    ? new TextEncoder().encode(response.body).length
    : 0;

  const srcDoc =
    response && isHtml
      ? `<base href="${url}">
${response.body}`
      : "";

  const contentType =
    response?.headers.find((h) => h.name.toLowerCase() === "content-type")
      ?.value ?? "";

  const barStyle = {
    borderColor: "rgba(42,58,66,0.8)",
    background: "rgba(18,32,38,0.5)",
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--os-bg-app)" }}
      data-ocid="browser.panel"
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-2 py-2 border-b"
        style={barStyle}
      >
        <button
          type="button"
          onClick={goBack}
          disabled={historyIndex <= 0}
          data-ocid="browser.secondary_button"
          title="Back"
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors disabled:opacity-30 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={goForward}
          disabled={historyIndex >= historyStack.length - 1}
          data-ocid="browser.secondary_button"
          title="Forward"
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors disabled:opacity-30 text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => actor && fetchMutation.mutate(url)}
          data-ocid="browser.toggle"
          title="Refresh"
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          {fetchMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </button>

        {/* Address bar */}
        <div
          className="flex-1 flex items-center gap-2 px-3 h-7 rounded-lg"
          style={{
            background: "rgba(6,18,22,0.9)",
            border: "1px solid rgba(39,215,224,0.2)",
          }}
        >
          <Globe className="w-3 h-3 text-primary/50 flex-shrink-0" />
          <input
            ref={inputRef}
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(inputUrl)}
            data-ocid="browser.input"
            className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none"
            placeholder="Enter URL..."
          />
          {inputUrl && (
            <button
              type="button"
              onClick={() => {
                setInputUrl("");
                inputRef.current?.focus();
              }}
              className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate(inputUrl)}
          disabled={fetchMutation.isPending || isConnecting}
          data-ocid="browser.primary_button"
          className="px-3 h-7 rounded text-xs font-semibold transition-all disabled:opacity-50"
          style={{
            background: "rgba(39,215,224,0.12)",
            border: "1px solid rgba(39,215,224,0.3)",
            color: "rgba(39,215,224,1)",
          }}
        >
          {isConnecting ? "Wait..." : "Go"}
        </button>
      </div>

      {/* Bookmarks bar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b"
        style={{
          borderColor: "rgba(42,58,66,0.5)",
          background: "rgba(12,20,24,0.4)",
        }}
      >
        <Bookmark className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
        {BOOKMARKS.map((bm) => (
          <button
            key={bm.url}
            type="button"
            onClick={() => navigate(bm.url)}
            data-ocid="browser.link"
            className="text-[10px] font-mono px-2 py-0.5 rounded transition-colors hover:text-primary"
            style={{
              background: "rgba(39,215,224,0.06)",
              border: "1px solid rgba(39,215,224,0.12)",
              color: "rgba(39,215,224,0.7)",
            }}
          >
            {bm.label}
          </button>
        ))}
      </div>

      {/* Web Reader Mode disclaimer */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 flex-shrink-0 text-xs"
        style={{
          background: "rgba(251,191,36,0.06)",
          borderBottom: "1px solid rgba(251,191,36,0.25)",
          color: "rgba(251,191,36,0.85)",
        }}
        data-ocid="browser.disclaimer.panel"
      >
        <span className="text-sm flex-shrink-0" aria-hidden="true">
          ⚠
        </span>
        <span>
          <strong>Web Reader Mode</strong> — Due to ICP blockchain constraints,
          only raw HTML is available. JavaScript, CSS, and images are not
          loaded.
        </span>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden relative">
        {/* ICP actor connecting overlay */}
        {isConnecting && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: "rgba(9,13,16,0.75)" }}
            data-ocid="browser.loading_state"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2
                className="w-7 h-7 animate-spin"
                style={{ color: "rgba(39,215,224,0.7)" }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: "rgba(39,215,224,0.6)" }}
              >
                Connecting to ICP network...
              </span>
            </div>
          </div>
        )}

        {fetchMutation.isPending && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: "rgba(9,13,16,0.7)" }}
            data-ocid="browser.loading_state"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: "rgba(39,215,224,0.8)" }}
              />
              <span className="text-xs font-mono text-muted-foreground/60">
                Loading...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div
            className="absolute inset-0 flex items-center justify-center p-6"
            data-ocid="browser.error_state"
          >
            <div
              className="max-w-sm w-full rounded-xl p-6 text-center"
              style={{
                background: "rgba(255,60,60,0.06)",
                border: "1px solid rgba(255,60,60,0.2)",
              }}
            >
              <X
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: "rgba(255,80,80,0.8)" }}
              />
              <p className="text-sm font-semibold text-destructive mb-1">
                Connection Error
              </p>
              <p className="text-xs text-muted-foreground/60 font-mono break-words">
                {error}
              </p>
              <button
                type="button"
                onClick={() => navigate(url)}
                className="mt-4 px-4 h-7 rounded text-xs font-semibold"
                style={{
                  background: "rgba(39,215,224,0.12)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "rgba(39,215,224,1)",
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!error && response && !statusOk && (
          <div
            className="absolute inset-0 flex items-center justify-center p-6"
            data-ocid="browser.error_state"
          >
            <div
              className="max-w-sm w-full rounded-xl p-6 text-center"
              style={{
                background: "rgba(255,150,0,0.06)",
                border: "1px solid rgba(255,150,0,0.2)",
              }}
            >
              <p
                className="text-2xl font-bold font-mono mb-2"
                style={{ color: "rgba(255,180,0,0.9)" }}
              >
                {response.statusCode}
              </p>
              <p className="text-sm text-muted-foreground/60">
                The server returned an error response.
              </p>
              <pre
                className="mt-3 text-xs text-left text-muted-foreground/50 overflow-auto max-h-32 p-2 rounded"
                style={{ background: "rgba(0,0,0,0.3)" }}
              >
                {response.body.slice(0, 500)}
              </pre>
            </div>
          </div>
        )}

        {!error && !fetchMutation.isPending && !response && !isConnecting && (
          <div
            className="flex items-center justify-center h-full flex-col gap-3"
            data-ocid="browser.empty_state"
          >
            <Globe
              className="w-12 h-12"
              style={{ color: "rgba(39,215,224,0.2)" }}
            />
            <p className="text-xs text-muted-foreground/30 font-mono text-center px-6">
              Enter a URL and press Go. Note: some sites may be unavailable due
              to ICP network restrictions.
            </p>
          </div>
        )}

        {!error &&
          response &&
          statusOk &&
          (isHtml ? (
            <iframe
              srcDoc={srcDoc}
              sandbox="allow-scripts"
              title="Browser content"
              className="w-full h-full border-0"
              style={{ background: "var(--os-text-primary)" }}
              data-ocid="browser.canvas_target"
            />
          ) : (
            <pre
              className="w-full h-full overflow-auto p-4 text-xs font-mono leading-relaxed"
              style={{
                color: "rgba(39,215,224,0.85)",
                background: "rgba(6,14,18,1)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
              data-ocid="browser.canvas_target"
            >
              {response.body}
            </pre>
          ))}
      </div>

      {/* Status bar */}
      <div
        className="px-3 py-1 text-[10px] font-mono border-t flex items-center justify-between"
        style={{
          borderColor: "rgba(42,58,66,0.5)",
          background: "rgba(12,20,24,0.5)",
        }}
      >
        <span
          style={{
            color: isConnecting
              ? "rgba(39,215,224,0.5)"
              : response
                ? statusOk
                  ? "rgba(39,215,224,0.7)"
                  : "rgba(255,100,100,0.7)"
                : "var(--os-text-muted)",
          }}
        >
          {isConnecting
            ? "Connecting..."
            : response
              ? `HTTP ${response.statusCode}`
              : "No response"}
        </span>
        <span className="text-muted-foreground/40">
          {isHtml
            ? "text/html"
            : contentType
              ? contentType.split(";")[0]
              : "\u2014"}
          {response ? ` \u00b7 ${(byteSize / 1024).toFixed(1)} KB` : ""}
        </span>
      </div>
    </div>
  );
}
