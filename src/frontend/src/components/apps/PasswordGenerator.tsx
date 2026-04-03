import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw, Shield, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const BG = "rgba(11,15,18,0.7)";
const BORDER = "var(--os-text-muted)";
const CYAN = "var(--os-accent)";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMS = "0123456789";
const SYMS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generatePassword(
  length: number,
  upper: boolean,
  lower: boolean,
  nums: boolean,
  syms: boolean,
): string {
  let charset = "";
  if (upper) charset += UPPER;
  if (lower) charset += LOWER;
  if (nums) charset += NUMS;
  if (syms) charset += SYMS;
  if (!charset) charset = LOWER;
  let pw = "";
  // Ensure at least one char from each enabled set
  const required: string[] = [];
  if (upper) required.push(UPPER[Math.floor(Math.random() * UPPER.length)]);
  if (lower) required.push(LOWER[Math.floor(Math.random() * LOWER.length)]);
  if (nums) required.push(NUMS[Math.floor(Math.random() * NUMS.length)]);
  if (syms) required.push(SYMS[Math.floor(Math.random() * SYMS.length)]);
  for (let i = required.length; i < length; i++) {
    pw += charset[Math.floor(Math.random() * charset.length)];
  }
  // Shuffle required into result
  const all = (pw + required.join("")).split("");
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.join("").slice(0, length);
}

function calcStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 14) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { score, label: "Weak", color: "rgb(239,68,68)" };
  if (score <= 3) return { score, label: "Fair", color: "rgb(234,179,8)" };
  if (score <= 4) return { score, label: "Strong", color: "rgb(34,197,94)" };
  return { score, label: "Very Strong", color: "var(--os-accent)" };
}

export function PasswordGenerator({
  windowProps: _w,
}: { windowProps?: Record<string, unknown> }) {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(false);
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const strength = useMemo(() => calcStrength(password), [password]);

  const generate = useCallback(() => {
    const pw = generatePassword(length, upper, lower, nums, syms);
    setPassword(pw);
    setHistory((prev) => [pw, ...prev.filter((p) => p !== pw)].slice(0, 10));
  }, [length, upper, lower, nums, syms]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!", { duration: 1500 });
    });
  };

  const ToggleBtn = ({
    label,
    active,
    onClick,
  }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        background: active
          ? "rgba(39,215,224,0.15)"
          : "var(--os-border-subtle)",
        border: `1px solid ${active ? "rgba(39,215,224,0.4)" : BORDER}`,
        color: active ? CYAN : "var(--os-text-secondary)",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      data-ocid="passwordgenerator.panel"
      className="flex flex-col h-full"
      style={{ background: BG, color: "var(--os-text-primary)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <Shield className="w-4 h-4" style={{ color: "var(--os-accent)" }} />
        <span className="text-sm font-semibold">Password Generator</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Length slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-muted-foreground/60">
              Password Length
            </span>
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: "rgba(39,215,224,0.3)",
                color: "var(--os-accent)",
              }}
            >
              {length}
            </Badge>
          </div>
          <Slider
            min={8}
            max={64}
            step={1}
            value={[length]}
            onValueChange={([v]) => setLength(v)}
            data-ocid="passwordgenerator.toggle"
            className="w-full"
          />
        </div>

        {/* Options */}
        <div>
          <p className="text-xs text-muted-foreground/60 mb-2">
            Character Types
          </p>
          <div className="flex flex-wrap gap-2">
            <ToggleBtn
              label="Uppercase A-Z"
              active={upper}
              onClick={() => setUpper(!upper)}
            />
            <ToggleBtn
              label="Lowercase a-z"
              active={lower}
              onClick={() => setLower(!lower)}
            />
            <ToggleBtn
              label="Numbers 0-9"
              active={nums}
              onClick={() => setNums(!nums)}
            />
            <ToggleBtn
              label="Symbols !@#"
              active={syms}
              onClick={() => setSyms(!syms)}
            />
          </div>
        </div>

        {/* Generate */}
        <Button
          onClick={generate}
          data-ocid="passwordgenerator.primary_button"
          className="w-full h-9 text-sm font-semibold"
          style={{
            background: "rgba(39,215,224,0.2)",
            color: "var(--os-accent)",
            border: "1px solid rgba(39,215,224,0.4)",
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Generate Password
        </Button>

        {/* Result */}
        {password && (
          <div
            className="rounded-lg p-4 space-y-3"
            style={{
              background: "rgba(39,215,224,0.05)",
              border: "1px solid rgba(39,215,224,0.2)",
            }}
          >
            <div className="flex items-center gap-2">
              <Input
                value={password}
                readOnly
                data-ocid="passwordgenerator.input"
                className="flex-1 h-9 font-mono text-sm"
                style={{
                  background: "var(--os-border-subtle)",
                  border: `1px solid ${BORDER}`,
                  color: "var(--os-text-primary)",
                }}
              />
              <Button
                size="icon"
                onClick={() => copyToClipboard(password)}
                data-ocid="passwordgenerator.secondary_button"
                className="h-9 w-9 shrink-0"
                style={{
                  background: "rgba(39,215,224,0.15)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  color: "var(--os-accent)",
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {/* Strength */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground/60">Strength</span>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--os-text-muted)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(strength.score / 6) * 100}%`,
                    background: strength.color,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground/60">
                Recent Passwords
              </p>
              <button
                type="button"
                onClick={() => setHistory([])}
                data-ocid="passwordgenerator.delete_button"
                className="text-xs text-muted-foreground/60 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="space-y-1">
              {history.map((pw, i) => (
                <div
                  key={`hist-${pw.slice(0, 8)}-${i}`}
                  data-ocid={`passwordgenerator.item.${i + 1}`}
                  className="flex items-center gap-2 group rounded px-2 py-1"
                  style={{ background: "var(--os-border-subtle)" }}
                >
                  <span className="flex-1 font-mono text-xs text-muted-foreground truncate">
                    {pw}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(pw)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "rgba(39,215,224,0.7)" }}
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
