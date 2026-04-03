import { ClipboardCopy, GitCompare } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
}

function computeDiff(original: string, modified: string): DiffLine[] {
  const linesA = original.split("\n");
  const linesB = modified.split("\n");
  const m = linesA.length;
  const n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        linesA[i - 1] === linesB[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  let i = m;
  let j = n;
  const trace: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      trace.push({ type: "unchanged", content: linesA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      trace.push({ type: "added", content: linesB[j - 1] });
      j--;
    } else {
      trace.push({ type: "removed", content: linesA[i - 1] });
      i--;
    }
  }
  return trace.reverse();
}

const SAMPLE_ORIGINAL = `function greet(name) {
  console.log("Hello, " + name);
  return name;
}

const user = "World";`;

const SAMPLE_MODIFIED = `function greet(name: string): void {
  console.log(\`Hello, \${name}!\`);
}

const user = "DecentOS";
greet(user);`;

export function DiffTool() {
  const [original, setOriginal] = useState(SAMPLE_ORIGINAL);
  const [modified, setModified] = useState(SAMPLE_MODIFIED);
  const diff = useMemo(
    () => computeDiff(original, modified),
    [original, modified],
  );
  const addedCount = diff.filter((l) => l.type === "added").length;
  const removedCount = diff.filter((l) => l.type === "removed").length;

  const copyDiff = () => {
    const text = diff
      .map(
        (l) =>
          `${l.type === "added" ? "+" : l.type === "removed" ? "-" : " "} ${l.content}`,
      )
      .join("\n");
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Diff copied"));
  };

  return (
    <div
      className="flex flex-col h-full text-xs"
      style={{ background: "rgba(11,15,18,0.6)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: "rgba(42,58,66,0.8)" }}
      >
        <div className="flex items-center gap-2">
          <GitCompare
            className="w-3.5 h-3.5"
            style={{ color: "rgba(39,215,224,0.7)" }}
          />
          <span
            className="font-semibold uppercase tracking-widest text-[10px]"
            style={{ color: "rgba(39,215,224,0.7)" }}
          >
            Diff Tool
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold ml-2"
            style={{
              background: "rgba(34,197,94,0.1)",
              color: "rgba(74,222,128,0.9)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            +{addedCount}
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
            style={{
              background: "rgba(239,68,68,0.1)",
              color: "rgba(252,165,165,0.9)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            -{removedCount}
          </span>
        </div>
        <button
          type="button"
          onClick={copyDiff}
          data-ocid="difftool.primary_button"
          className="flex items-center gap-1.5 px-3 h-7 rounded text-[11px] font-medium transition-all"
          style={{
            background: "rgba(39,215,224,0.1)",
            border: "1px solid rgba(39,215,224,0.25)",
            color: "rgba(39,215,224,0.9)",
          }}
        >
          <ClipboardCopy className="w-3 h-3" /> Copy Diff
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <div
          className="flex flex-col flex-1"
          style={{ borderRight: "1px solid rgba(42,58,66,0.6)" }}
        >
          <div
            className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest flex-shrink-0"
            style={{
              background: "rgba(239,68,68,0.07)",
              borderBottom: "1px solid rgba(42,58,66,0.6)",
              color: "rgba(252,165,165,0.6)",
            }}
          >
            Original
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            data-ocid="difftool.textarea"
            spellCheck={false}
            className="flex-1 w-full p-3 resize-none outline-none font-mono text-[11px] leading-relaxed"
            style={{
              background: "rgba(239,68,68,0.03)",
              color: "rgba(220,235,240,0.8)",
              caretColor: "rgba(39,215,224,0.9)",
            }}
            placeholder="Paste original text here..."
          />
        </div>
        <div className="flex flex-col flex-1">
          <div
            className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest flex-shrink-0"
            style={{
              background: "rgba(34,197,94,0.07)",
              borderBottom: "1px solid rgba(42,58,66,0.6)",
              color: "rgba(74,222,128,0.6)",
            }}
          >
            Modified
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            data-ocid="difftool.search_input"
            spellCheck={false}
            className="flex-1 w-full p-3 resize-none outline-none font-mono text-[11px] leading-relaxed"
            style={{
              background: "rgba(34,197,94,0.03)",
              color: "rgba(220,235,240,0.8)",
              caretColor: "rgba(39,215,224,0.9)",
            }}
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      <div
        className="border-t flex-shrink-0"
        style={{
          borderColor: "rgba(42,58,66,0.8)",
          maxHeight: "38%",
          overflowY: "auto",
        }}
      >
        <div
          className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest sticky top-0"
          style={{
            background: "rgba(10,16,20,0.9)",
            borderBottom: "1px solid rgba(42,58,66,0.5)",
            color: "rgba(180,200,210,0.4)",
          }}
        >
          Diff Output
        </div>
        <div className="font-mono" data-ocid="difftool.panel">
          {diff.map((line, idx) => (
            <div
              key={`${line.type}-${idx}-${line.content.slice(0, 10)}`}
              className="px-4 py-0.5 flex items-start gap-3"
              style={{
                background:
                  line.type === "added"
                    ? "rgba(34,197,94,0.08)"
                    : line.type === "removed"
                      ? "rgba(239,68,68,0.08)"
                      : "transparent",
                borderLeft:
                  line.type === "added"
                    ? "2px solid rgba(34,197,94,0.5)"
                    : line.type === "removed"
                      ? "2px solid rgba(239,68,68,0.5)"
                      : "2px solid transparent",
              }}
            >
              <span
                className="w-4 flex-shrink-0 text-center select-none"
                style={{
                  color:
                    line.type === "added"
                      ? "rgba(74,222,128,0.7)"
                      : line.type === "removed"
                        ? "rgba(252,165,165,0.7)"
                        : "rgba(180,200,210,0.2)",
                }}
              >
                {line.type === "added"
                  ? "+"
                  : line.type === "removed"
                    ? "-"
                    : " "}
              </span>
              <span
                className="flex-1 whitespace-pre-wrap break-all"
                style={{
                  color:
                    line.type === "added"
                      ? "rgba(134,239,172,0.9)"
                      : line.type === "removed"
                        ? "rgba(252,165,165,0.8)"
                        : "rgba(180,200,210,0.55)",
                }}
              >
                {line.content || " "}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
