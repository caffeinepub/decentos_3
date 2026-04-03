import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type HashAlgo = "SHA-1" | "SHA-256" | "SHA-512";

async function computeHash(text: string, algo: HashAlgo): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface HashGeneratorProps {
  windowProps?: Record<string, unknown>;
}

export function HashGenerator({
  windowProps: _windowProps,
}: HashGeneratorProps) {
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<HashAlgo>("SHA-256");
  const [hash, setHash] = useState("");
  const [computing, setComputing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) {
      setHash("");
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setComputing(true);
      try {
        const result = await computeHash(input, algo);
        setHash(result);
      } catch {
        setHash("[error computing hash]");
      } finally {
        setComputing(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, algo]);

  const handleCopy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    toast.success("Hash copied");
  };

  const algos: HashAlgo[] = ["SHA-1", "SHA-256", "SHA-512"];

  return (
    <div
      data-ocid="hashgenerator.panel"
      className="flex flex-col h-full p-4 gap-4 text-foreground"
      style={{ background: "rgba(11,15,18,0.6)" }}
    >
      <span
        className="text-sm font-semibold"
        style={{ color: "rgba(39,215,224,1)" }}
      >
        Hash Generator
      </span>

      {/* Algorithm selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "#888" }}>
          Algorithm:
        </span>
        <div className="flex gap-1">
          {algos.map((a) => (
            <button
              type="button"
              key={a}
              data-ocid="hashgenerator.toggle"
              onClick={() => setAlgo(a)}
              className="px-3 py-1 rounded text-xs font-mono transition-all"
              style={{
                background:
                  algo === a ? "rgba(39,215,224,0.2)" : "rgba(42,58,66,0.4)",
                color: algo === a ? "rgba(39,215,224,1)" : "#888",
                border: `1px solid ${algo === a ? "rgba(39,215,224,0.5)" : "rgba(42,58,66,0.8)"}`,
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="text-xs" style={{ color: "#888" }}>
          Input Text
        </div>
        <textarea
          data-ocid="hashgenerator.textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to hash..."
          className="flex-1 resize-none rounded p-2 text-sm outline-none text-foreground bg-transparent"
          style={{
            border: "1px solid rgba(42,58,66,0.8)",
            fontFamily: "monospace",
          }}
        />
      </div>

      {/* Output */}
      <div className="flex flex-col gap-2">
        <div className="text-xs" style={{ color: "#888" }}>
          {algo} Hash
        </div>
        <div
          className="flex items-center gap-2 rounded p-2"
          style={{
            background: "rgba(42,58,66,0.2)",
            border: "1px solid rgba(42,58,66,0.8)",
          }}
        >
          <span
            className="flex-1 text-xs font-mono break-all"
            style={{ color: computing ? "#666" : "rgba(39,215,224,0.9)" }}
          >
            {computing
              ? "Computing..."
              : hash || (
                  <span style={{ color: "#555" }}>Hash will appear here</span>
                )}
          </span>
          <Button
            data-ocid="hashgenerator.copy_button"
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!hash || computing}
            className="h-7 px-2 text-xs shrink-0"
            style={{
              borderColor: "rgba(39,215,224,0.4)",
              color: "rgba(39,215,224,1)",
            }}
          >
            Copy
          </Button>
        </div>
        {hash && (
          <div className="text-xs" style={{ color: "#555" }}>
            {hash.length} hex chars · {hash.length * 4} bits
          </div>
        )}
      </div>
    </div>
  );
}
