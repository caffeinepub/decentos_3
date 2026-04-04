import { r as reactExports, j as jsxRuntimeExports, b as CodeXml, C as Check, n as Copy, g as ue } from "./index-8tMpYjTW.js";
const TABS = [
  { id: "json", label: "JSON" },
  { id: "base64", label: "Base64" },
  { id: "hash", label: "Hash" },
  { id: "baseconv", label: "BaseConv" },
  { id: "regex", label: "Regex" }
];
function CopyButton({ text, label }) {
  const [copied, setCopied] = reactExports.useState(false);
  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      ue.success(label ? `${label} copied` : "Copied");
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: copy,
      className: "flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all flex-shrink-0",
      style: {
        background: copied ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.15)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(124,58,237,0.3)"}`,
        color: copied ? "#22C55E" : "rgba(167,139,250,0.9)"
      },
      title: "Copy to clipboard",
      children: [
        copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }),
        label && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5", children: copied ? "Copied" : label })
      ]
    }
  );
}
function JsonTab() {
  const [input, setInput] = reactExports.useState(
    `{
  "name": "DecentOS",
  "version": 1,
  "features": ["json", "base64", "hash"]
}`
  );
  const [output, setOutput] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("format");
  const process = reactExports.useCallback(
    (m) => {
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
            `✅ Valid JSON

Type: ${Array.isArray(parsed) ? "Array" : typeof parsed}
Keys: ${typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? Object.keys(parsed).length : "N/A"}`
          );
        }
      } catch (e) {
        setError(`❌ ${e.message}`);
        setOutput("");
      }
    },
    [input]
  );
  reactExports.useEffect(() => {
    process("format");
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-shrink-0", children: ["format", "minify", "validate"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => process(m),
        className: "px-3 py-1.5 rounded text-xs capitalize transition-all",
        style: {
          background: mode === m ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.08)",
          border: `1px solid ${mode === m ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.2)"}`,
          color: mode === m ? "#a78bfa" : "var(--os-text-secondary)"
        },
        children: m
      },
      m
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-1 min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] uppercase tracking-wide",
            style: { color: "var(--os-text-muted)" },
            children: "Input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: input,
            onChange: (e) => setInput(e.target.value),
            className: "flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none",
            style: {
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              lineHeight: 1.6
            },
            spellCheck: false
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] uppercase tracking-wide",
              style: { color: "var(--os-text-muted)" },
              children: "Output"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: output })
        ] }),
        error ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 rounded-lg p-3 text-xs font-mono",
            style: {
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171"
            },
            children: error
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            readOnly: true,
            value: output,
            className: "flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none",
            style: {
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              lineHeight: 1.6
            }
          }
        )
      ] })
    ] })
  ] });
}
function Base64Tab() {
  const [input, setInput] = reactExports.useState("Hello, DecentOS!");
  const [output, setOutput] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("encode");
  const process = reactExports.useCallback(
    (m, val) => {
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
    [input]
  );
  reactExports.useEffect(() => {
    process("encode");
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-shrink-0", children: ["encode", "decode"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => process(m),
        className: "px-3 py-1.5 rounded text-xs capitalize transition-all",
        style: {
          background: mode === m ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.08)",
          border: `1px solid ${mode === m ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.2)"}`,
          color: mode === m ? "#a78bfa" : "var(--os-text-secondary)"
        },
        children: m
      },
      m
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-1 min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] uppercase tracking-wide",
            style: { color: "var(--os-text-muted)" },
            children: "Input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: input,
            onChange: (e) => {
              setInput(e.target.value);
              process(mode, e.target.value);
            },
            className: "flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none",
            style: {
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              lineHeight: 1.6
            },
            spellCheck: false,
            placeholder: mode === "decode" ? "Base64 encoded string..." : "Text to encode..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] uppercase tracking-wide",
              style: { color: "var(--os-text-muted)" },
              children: "Output"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: output })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            readOnly: true,
            value: output,
            className: "flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none",
            style: {
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              lineHeight: 1.6
            }
          }
        )
      ] })
    ] })
  ] });
}
function sha256Hex(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest("SHA-256", data).then(
    (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
  );
}
function sha1Hex(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest("SHA-1", data).then(
    (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
  );
}
function crc32(str) {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      if (c & 1) c = 3988292384 ^ c >>> 1;
      else c = c >>> 1;
    }
    table[i] = c;
  }
  let crc = 4294967295;
  const bytes = new TextEncoder().encode(str);
  for (const byte of bytes) {
    crc = table[(crc ^ byte) & 255] ^ crc >>> 8;
  }
  return ((crc ^ 4294967295) >>> 0).toString(16).padStart(8, "0");
}
function HashTab() {
  const [input, setInput] = reactExports.useState("Hello, DecentOS!");
  const [sha256, setSha256] = reactExports.useState("");
  const [sha1, setSha1] = reactExports.useState("");
  const [crc32val, setCrc32val] = reactExports.useState("");
  const debounceRef = reactExports.useRef(null);
  const computeHashes = reactExports.useCallback(async (val) => {
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
  reactExports.useEffect(() => {
    computeHashes(input);
  }, []);
  const handleChange = (val) => {
    setInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => computeHashes(val), 200);
  };
  const hashRows = [
    { label: "SHA-256", value: sha256, color: "#a78bfa" },
    { label: "SHA-1", value: sha1, color: "#60a5fa" },
    { label: "CRC-32", value: crc32val, color: "#34d399" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-[10px] uppercase tracking-wide",
          style: { color: "var(--os-text-muted)" },
          children: "Input Text"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: input,
          onChange: (e) => handleChange(e.target.value),
          rows: 3,
          className: "resize-none rounded-lg p-3 text-xs font-mono outline-none",
          style: {
            background: "var(--os-bg-elevated)",
            border: "1px solid var(--os-border-subtle)",
            color: "var(--os-text-primary)",
            lineHeight: 1.6
          },
          spellCheck: false,
          placeholder: "Enter text to hash..."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 flex-1", children: hashRows.map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg p-3",
        style: {
          background: "var(--os-bg-elevated)",
          border: "1px solid var(--os-border-subtle)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold", style: { color }, children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: value, label: "Copy" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-[11px] font-mono break-all leading-relaxed",
              style: { color: "var(--os-text-secondary)" },
              children: value || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.3 }, children: "—" })
            }
          )
        ]
      },
      label
    )) })
  ] });
}
function BaseConvTab() {
  const [input, setInput] = reactExports.useState("255");
  const [fromBase, setFromBase] = reactExports.useState("10");
  const [toBase, setToBase] = reactExports.useState("16");
  const [result, setResult] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const convert = reactExports.useCallback((val, from, to) => {
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
  reactExports.useEffect(() => {
    convert(input, fromBase, toBase);
  }, [input, fromBase, toBase, convert]);
  const bases = ["2", "8", "10", "16"];
  const baseLabels = {
    "2": "Binary",
    "8": "Octal",
    "10": "Decimal",
    "16": "Hexadecimal"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] uppercase tracking-wide",
            style: { color: "var(--os-text-muted)" },
            children: "From Base"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: fromBase,
            onChange: (e) => setFromBase(e.target.value),
            className: "rounded-lg px-3 py-2 text-xs outline-none",
            style: {
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              colorScheme: "dark"
            },
            children: bases.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: b, children: [
              "Base ",
              b,
              " — ",
              baseLabels[b]
            ] }, b))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] uppercase tracking-wide",
            style: { color: "var(--os-text-muted)" },
            children: "To Base"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: toBase,
            onChange: (e) => setToBase(e.target.value),
            className: "rounded-lg px-3 py-2 text-xs outline-none",
            style: {
              background: "var(--os-bg-elevated)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-primary)",
              colorScheme: "dark"
            },
            children: bases.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: b, children: [
              "Base ",
              b,
              " — ",
              baseLabels[b]
            ] }, b))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "text-[10px] uppercase tracking-wide",
          style: { color: "var(--os-text-muted)" },
          children: [
            "Input (",
            baseLabels[fromBase],
            ")"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: input,
          onChange: (e) => setInput(e.target.value),
          className: "rounded-lg px-3 py-2.5 text-sm font-mono outline-none",
          style: {
            background: "var(--os-bg-elevated)",
            border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "var(--os-border-subtle)"}`,
            color: "var(--os-text-primary)"
          },
          placeholder: `Enter ${baseLabels[fromBase].toLowerCase()} number...`
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", style: { color: "#f87171" }, children: error })
    ] }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-4",
        style: {
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.3)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[11px]",
                style: { color: "var(--os-text-muted)" },
                children: [
                  baseLabels[fromBase],
                  " → ",
                  baseLabels[toBase]
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: result })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-2xl font-mono font-bold tracking-wider",
              style: { color: "#a78bfa" },
              children: result
            }
          )
        ]
      }
    ),
    input && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 flex-shrink-0", children: bases.map((b) => {
      let val = "";
      try {
        val = Number.parseInt(input.trim(), Number(fromBase)).toString(Number(b)).toUpperCase();
      } catch {
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg p-2 text-center",
          style: {
            background: "var(--os-bg-elevated)",
            border: `1px solid ${b === toBase ? "rgba(124,58,237,0.5)" : "var(--os-border-subtle)"}`
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-[9px] mb-1",
                style: { color: "var(--os-text-muted)" },
                children: [
                  "Base ",
                  b
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[11px] font-mono font-semibold truncate",
                style: {
                  color: b === toBase ? "#a78bfa" : "var(--os-text-secondary)"
                },
                children: val || "—"
              }
            )
          ]
        },
        b
      );
    }) })
  ] });
}
function RegexTab() {
  const [pattern, setPattern] = reactExports.useState("\\b\\w{5,}\\b");
  const [flags, setFlags] = reactExports.useState({ g: true, i: false, m: false });
  const [testStr, setTestStr] = reactExports.useState(
    "The quick brown fox jumps over the lazy dog.\nA sample string with multiple words."
  );
  const [matchCount, setMatchCount] = reactExports.useState(0);
  const [matches, setMatches] = reactExports.useState([]);
  const [error, setError] = reactExports.useState("");
  const [highlighted, setHighlighted] = reactExports.useState("");
  const runRegex = reactExports.useCallback(() => {
    setError("");
    if (!pattern) {
      setMatchCount(0);
      setMatches([]);
      setHighlighted(testStr);
      return;
    }
    try {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");
      const re = new RegExp(pattern, flagStr || "g");
      const found = testStr.match(flags.g ? re : re) ?? [];
      setMatches(found);
      setMatchCount(found.length);
      const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const reForHl = new RegExp(
        pattern,
        flagStr.includes("g") ? flagStr : `${flagStr}g`
      );
      const hl = esc(testStr).replace(
        new RegExp(reForHl.source, reForHl.flags),
        (m) => `<mark style="background:rgba(124,58,237,0.35);color:#e9d5ff;border-radius:2px">${esc(m)}</mark>`
      );
      setHighlighted(hl);
    } catch (e) {
      setError(e.message);
      setMatchCount(0);
      setMatches([]);
      setHighlighted("");
    }
  }, [pattern, flags, testStr]);
  reactExports.useEffect(() => {
    runRegex();
  }, [runRegex]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] uppercase tracking-wide",
            style: { color: "var(--os-text-muted)" },
            children: "Pattern"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: ["g", "i", "m"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "flex items-center gap-1 cursor-pointer text-xs select-none",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flags[f],
                  onChange: (e) => setFlags((prev) => ({ ...prev, [f]: e.target.checked })),
                  className: "w-3 h-3"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono font-semibold",
                  style: {
                    color: flags[f] ? "#a78bfa" : "var(--os-text-muted)"
                  },
                  children: [
                    "/",
                    f
                  ]
                }
              )
            ]
          },
          f
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono",
            style: { color: "var(--os-text-muted)" },
            children: "/"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: pattern,
            onChange: (e) => setPattern(e.target.value),
            className: "w-full rounded-lg pl-6 pr-3 py-2.5 text-sm font-mono outline-none",
            style: {
              background: "var(--os-bg-elevated)",
              border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(124,58,237,0.4)"}`,
              color: "#a78bfa"
            },
            placeholder: "Your regex pattern..."
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px]", style: { color: "#f87171" }, children: [
        "❌ ",
        error
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-1 min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-[10px] uppercase tracking-wide flex-shrink-0",
          style: { color: "var(--os-text-muted)" },
          children: "Test String"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: testStr,
          onChange: (e) => setTestStr(e.target.value),
          className: "flex-1 resize-none rounded-lg p-3 text-xs font-mono outline-none",
          style: {
            background: "var(--os-bg-elevated)",
            border: "1px solid var(--os-border-subtle)",
            color: "var(--os-text-primary)",
            lineHeight: 1.7
          },
          spellCheck: false
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-xs font-semibold",
            style: {
              color: matchCount > 0 ? "#a78bfa" : "var(--os-text-muted)"
            },
            children: [
              matchCount,
              " match",
              matchCount !== 1 ? "es" : ""
            ]
          }
        ),
        matchCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
          matches.slice(0, 8).map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "px-1.5 py-0.5 rounded text-[10px] font-mono",
              style: {
                background: "rgba(124,58,237,0.2)",
                color: "#c4b5fd",
                border: "1px solid rgba(124,58,237,0.3)"
              },
              children: m
            },
            `m-${m.slice(0, 8)}-${i}`
          )),
          matches.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-[10px]",
              style: { color: "var(--os-text-muted)" },
              children: [
                "+",
                matches.length - 8,
                " more"
              ]
            }
          )
        ] })
      ] }),
      highlighted && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-lg p-3 text-[11px] font-mono leading-relaxed max-h-24 overflow-y-auto",
          style: {
            background: "var(--os-bg-elevated)",
            border: "1px solid var(--os-border-subtle)",
            color: "var(--os-text-secondary)",
            whiteSpace: "pre-wrap"
          },
          dangerouslySetInnerHTML: { __html: highlighted }
        }
      )
    ] })
  ] });
}
function DeveloperToolkit() {
  const [activeTab, setActiveTab] = reactExports.useState("json");
  const renderTab = () => {
    switch (activeTab) {
      case "json":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(JsonTab, {});
      case "base64":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Base64Tab, {});
      case "hash":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(HashTab, {});
      case "baseconv":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(BaseConvTab, {});
      case "regex":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RegexTab, {});
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--os-bg-app)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-4 py-2.5 border-b flex-shrink-0",
            style: {
              borderColor: "rgba(124,58,237,0.2)",
              background: "var(--os-bg-app)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "w-4 h-4 flex-shrink-0", style: { color: "#a78bfa" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", style: { color: "#a78bfa" }, children: "Developer Toolkit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] px-1.5 py-0.5 rounded-full ml-1",
                  style: {
                    background: "rgba(124,58,237,0.1)",
                    color: "rgba(167,139,250,0.7)",
                    border: "1px solid rgba(124,58,237,0.2)"
                  },
                  children: "5 tools"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex border-b flex-shrink-0 px-3",
            style: { borderColor: "rgba(124,58,237,0.15)" },
            children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(tab.id),
                "data-ocid": `devtoolkit.${tab.id}.tab`,
                className: "px-3 py-2 text-xs font-medium transition-colors",
                style: {
                  borderBottom: activeTab === tab.id ? "2px solid rgba(124,58,237,0.8)" : "2px solid transparent",
                  color: activeTab === tab.id ? "#a78bfa" : "var(--os-text-secondary)",
                  marginBottom: -1
                },
                children: tab.label
              },
              tab.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: renderTab() })
      ]
    }
  );
}
export {
  DeveloperToolkit
};
