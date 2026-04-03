import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

type BaseField = "decimal" | "hex" | "binary" | "octal";

interface FieldConfig {
  id: BaseField;
  label: string;
  prefix: string;
  color: string;
  borderColor: string;
  bgColor: string;
  base: number;
  validator: RegExp;
}

const FIELDS: FieldConfig[] = [
  {
    id: "decimal",
    label: "Decimal",
    prefix: "DEC",
    color: "var(--os-accent)",
    borderColor: "rgba(39,215,224,0.4)",
    bgColor: "rgba(39,215,224,0.05)",
    base: 10,
    validator: /^-?[0-9]*\.?[0-9]*$/,
  },
  {
    id: "hex",
    label: "Hexadecimal",
    prefix: "HEX",
    color: "#F97316",
    borderColor: "rgba(249,115,22,0.4)",
    bgColor: "rgba(249,115,22,0.05)",
    base: 16,
    validator: /^[0-9a-fA-F]*$/,
  },
  {
    id: "binary",
    label: "Binary",
    prefix: "BIN",
    color: "#22C55E",
    borderColor: "rgba(34,197,94,0.4)",
    bgColor: "rgba(34,197,94,0.05)",
    base: 2,
    validator: /^[01 ]*$/,
  },
  {
    id: "octal",
    label: "Octal",
    prefix: "OCT",
    color: "#A855F7",
    borderColor: "rgba(168,85,247,0.4)",
    bgColor: "rgba(168,85,247,0.05)",
    base: 8,
    validator: /^[0-7]*$/,
  },
];

function toInt(val: string, base: number): number | null {
  if (!val.trim()) return null;
  // Strip spaces for binary
  const clean = val.replace(/\s/g, "");
  const n = Number.parseInt(clean, base);
  return Number.isNaN(n) ? null : n;
}

/** Format binary string with a space every 4 bits for readability */
function formatBinary(bin: string): string {
  if (!bin) return bin;
  // Pad to multiple of 4
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  return padded.match(/.{1,4}/g)?.join(" ") ?? bin;
}

function getIEEE754(decStr: string): string | null {
  const f = Number.parseFloat(decStr);
  if (Number.isNaN(f) || !decStr.includes(".")) return null;
  const buf = new ArrayBuffer(4);
  new DataView(buf).setFloat32(0, f, false);
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

export function BaseConverter() {
  const [values, setValues] = useState<Record<BaseField, string>>({
    decimal: "",
    hex: "",
    binary: "",
    octal: "",
  });
  const [copied, setCopied] = useState<BaseField | null>(null);
  const [activeField, setActiveField] = useState<BaseField>("decimal");
  const [signed, setSigned] = useState(false);

  const handleChange = useCallback(
    (field: BaseField, raw: string) => {
      const cfg = FIELDS.find((f) => f.id === field)!;
      // Allow empty
      if (!raw || raw === "-" || raw.trim() === "") {
        setValues({ decimal: "", hex: "", binary: "", octal: "" });
        return;
      }

      // For decimal allow float and negatives
      if (field === "decimal") {
        if (!/^-?[0-9]*\.?[0-9]*$/.test(raw)) return;
        setValues((prev) => ({ ...prev, decimal: raw }));
        const int = Number.parseInt(raw, 10);
        if (!Number.isNaN(int) && !raw.includes(".")) {
          const n = int;
          setValues({
            decimal: raw,
            hex: (n < 0 ? "-" : "") + Math.abs(n).toString(16).toUpperCase(),
            binary: formatBinary((n < 0 ? "-" : "") + Math.abs(n).toString(2)),
            octal: (n < 0 ? "-" : "") + Math.abs(n).toString(8),
          });
        } else {
          setValues({ decimal: raw, hex: "", binary: "", octal: "" });
        }
        return;
      }

      // Binary: allow spaces
      if (field === "binary") {
        const stripped = raw.replace(/\s/g, "");
        if (!/^[01]*$/.test(stripped)) return;
        const display = formatBinary(stripped);
        const n = toInt(stripped, 2);
        if (n === null) {
          setValues((prev) => ({ ...prev, binary: display }));
          return;
        }
        const dec = signed && stripped.length === 8 && n > 127 ? n - 256 : n;
        setValues({
          decimal: dec.toString(10),
          hex: (dec < 0 ? "-" : "") + Math.abs(dec).toString(16).toUpperCase(),
          binary: display,
          octal: (dec < 0 ? "-" : "") + Math.abs(dec).toString(8),
        });
        return;
      }

      if (!cfg.validator.test(raw)) return;
      const n = toInt(raw, cfg.base);
      if (n === null) {
        setValues((prev) => ({ ...prev, [field]: raw }));
        return;
      }
      setValues({
        decimal: n.toString(10),
        hex: n.toString(16).toUpperCase(),
        binary: formatBinary(n.toString(2)),
        octal: n.toString(8),
      });
    },
    [signed],
  );

  const handleCopy = useCallback(
    (field: BaseField) => {
      const val = values[field];
      if (!val) return;
      navigator.clipboard.writeText(val).then(() => {
        setCopied(field);
        setTimeout(() => setCopied(null), 1500);
      });
    },
    [values],
  );

  const ieee = getIEEE754(values.decimal);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(8,14,18,0.97)" }}
      data-ocid="baseconverter.panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b flex items-center justify-between"
        style={{
          background: "rgba(12,22,30,0.95)",
          borderColor: "rgba(39,215,224,0.15)",
        }}
      >
        <div>
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--os-accent)" }}
          >
            🔢 Base Converter
          </h2>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            Type in any field — all others update instantly
          </p>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={signed}
            onChange={(e) => setSigned(e.target.checked)}
            className="w-3.5 h-3.5 accent-green-400"
          />
          <span className="text-[10px] text-muted-foreground/60">
            Signed (8-bit)
          </span>
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {FIELDS.map((field) => (
          <div
            key={field.id}
            className="rounded-xl p-4"
            style={{
              background:
                activeField === field.id ? field.bgColor : "rgba(14,22,32,0.6)",
              border: `1px solid ${
                activeField === field.id
                  ? field.borderColor
                  : "var(--os-border-subtle)"
              }`,
              transition: "all 0.15s",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
                  style={{
                    background: `${field.color}18`,
                    color: field.color,
                    border: `1px solid ${field.color}40`,
                  }}
                >
                  {field.prefix}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  {field.label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(field.id)}
                data-ocid={`baseconverter.${field.id}.button`}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground/60 hover:text-foreground transition-colors"
                title="Copy"
              >
                {copied === field.id ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={values[field.id]}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onFocus={() => setActiveField(field.id)}
              placeholder={field.id === "decimal" ? "Enter a number..." : "—"}
              data-ocid={`baseconverter.${field.id}.input`}
              spellCheck={false}
              className="w-full bg-transparent outline-none text-lg font-mono tracking-wide"
              style={{ color: field.color, caretColor: field.color }}
            />
            {field.id === "binary" && values.binary && (
              <p
                className="text-[9px] mt-1"
                style={{ color: "rgba(34,197,94,0.4)" }}
              >
                Grouped in nibbles (4 bits)
              </p>
            )}
          </div>
        ))}

        {ieee && (
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(14,22,32,0.6)",
              border: "1px solid var(--os-border-subtle)",
            }}
          >
            <div className="text-[10px] font-bold tracking-widest text-muted-foreground/60 mb-2">
              IEEE 754 FLOAT (32-bit)
            </div>
            <div className="font-mono text-sm text-muted-foreground break-all leading-relaxed">
              {(() => {
                const bytes = ieee.split(" ");
                return (
                  <>
                    {bytes[0] && (
                      <>
                        <span style={{ color: "#F97316" }}>
                          {bytes[0]}
                        </span>{" "}
                      </>
                    )}
                    {bytes[1] && (
                      <>
                        <span style={{ color: "var(--os-accent)" }}>
                          {bytes[1]}
                        </span>{" "}
                      </>
                    )}
                    {bytes[2] && (
                      <>
                        <span style={{ color: "#22C55E" }}>
                          {bytes[2]}
                        </span>{" "}
                      </>
                    )}
                    {bytes[3] && (
                      <span style={{ color: "#22C55E" }}>{bytes[3]}</span>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="text-[9px] text-muted-foreground/50 mt-1">
              <span style={{ color: "#F97316" }}>sign</span>{" "}
              <span style={{ color: "var(--os-accent)" }}>exponent</span>{" "}
              <span style={{ color: "#22C55E" }}>mantissa</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
