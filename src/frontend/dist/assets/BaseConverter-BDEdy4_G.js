import { r as reactExports, j as jsxRuntimeExports, C as Check, n as Copy } from "./index-8tMpYjTW.js";
const FIELDS = [
  {
    id: "decimal",
    label: "Decimal",
    prefix: "DEC",
    color: "var(--os-accent)",
    borderColor: "rgba(39,215,224,0.4)",
    bgColor: "rgba(39,215,224,0.05)",
    base: 10,
    validator: /^-?[0-9]*\.?[0-9]*$/
  },
  {
    id: "hex",
    label: "Hexadecimal",
    prefix: "HEX",
    color: "#F97316",
    borderColor: "rgba(249,115,22,0.4)",
    bgColor: "rgba(249,115,22,0.05)",
    base: 16,
    validator: /^[0-9a-fA-F]*$/
  },
  {
    id: "binary",
    label: "Binary",
    prefix: "BIN",
    color: "#22C55E",
    borderColor: "rgba(34,197,94,0.4)",
    bgColor: "rgba(34,197,94,0.05)",
    base: 2,
    validator: /^[01 ]*$/
  },
  {
    id: "octal",
    label: "Octal",
    prefix: "OCT",
    color: "#A855F7",
    borderColor: "rgba(168,85,247,0.4)",
    bgColor: "rgba(168,85,247,0.05)",
    base: 8,
    validator: /^[0-7]*$/
  }
];
function toInt(val, base) {
  if (!val.trim()) return null;
  const clean = val.replace(/\s/g, "");
  const n = Number.parseInt(clean, base);
  return Number.isNaN(n) ? null : n;
}
function formatBinary(bin) {
  var _a;
  if (!bin) return bin;
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  return ((_a = padded.match(/.{1,4}/g)) == null ? void 0 : _a.join(" ")) ?? bin;
}
function getIEEE754(decStr) {
  const f = Number.parseFloat(decStr);
  if (Number.isNaN(f) || !decStr.includes(".")) return null;
  const buf = new ArrayBuffer(4);
  new DataView(buf).setFloat32(0, f, false);
  const bytes = new Uint8Array(buf);
  return Array.from(bytes).map((b) => b.toString(2).padStart(8, "0")).join(" ");
}
function BaseConverter() {
  const [values, setValues] = reactExports.useState({
    decimal: "",
    hex: "",
    binary: "",
    octal: ""
  });
  const [copied, setCopied] = reactExports.useState(null);
  const [activeField, setActiveField] = reactExports.useState("decimal");
  const [signed, setSigned] = reactExports.useState(false);
  const handleChange = reactExports.useCallback(
    (field, raw) => {
      const cfg = FIELDS.find((f) => f.id === field);
      if (!raw || raw === "-" || raw.trim() === "") {
        setValues({ decimal: "", hex: "", binary: "", octal: "" });
        return;
      }
      if (field === "decimal") {
        if (!/^-?[0-9]*\.?[0-9]*$/.test(raw)) return;
        setValues((prev) => ({ ...prev, decimal: raw }));
        const int = Number.parseInt(raw, 10);
        if (!Number.isNaN(int) && !raw.includes(".")) {
          const n2 = int;
          setValues({
            decimal: raw,
            hex: (n2 < 0 ? "-" : "") + Math.abs(n2).toString(16).toUpperCase(),
            binary: formatBinary((n2 < 0 ? "-" : "") + Math.abs(n2).toString(2)),
            octal: (n2 < 0 ? "-" : "") + Math.abs(n2).toString(8)
          });
        } else {
          setValues({ decimal: raw, hex: "", binary: "", octal: "" });
        }
        return;
      }
      if (field === "binary") {
        const stripped = raw.replace(/\s/g, "");
        if (!/^[01]*$/.test(stripped)) return;
        const display = formatBinary(stripped);
        const n2 = toInt(stripped, 2);
        if (n2 === null) {
          setValues((prev) => ({ ...prev, binary: display }));
          return;
        }
        const dec = signed && stripped.length === 8 && n2 > 127 ? n2 - 256 : n2;
        setValues({
          decimal: dec.toString(10),
          hex: (dec < 0 ? "-" : "") + Math.abs(dec).toString(16).toUpperCase(),
          binary: display,
          octal: (dec < 0 ? "-" : "") + Math.abs(dec).toString(8)
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
        octal: n.toString(8)
      });
    },
    [signed]
  );
  const handleCopy = reactExports.useCallback(
    (field) => {
      const val = values[field];
      if (!val) return;
      navigator.clipboard.writeText(val).then(() => {
        setCopied(field);
        setTimeout(() => setCopied(null), 1500);
      });
    },
    [values]
  );
  const ieee = getIEEE754(values.decimal);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(8,14,18,0.97)" },
      "data-ocid": "baseconverter.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 px-4 py-3 border-b flex items-center justify-between",
            style: {
              background: "rgba(12,22,30,0.95)",
              borderColor: "rgba(39,215,224,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "var(--os-accent)" },
                    children: "🔢 Base Converter"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5", children: "Type in any field — all others update instantly" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: signed,
                    onChange: (e) => setSigned(e.target.checked),
                    className: "w-3.5 h-3.5 accent-green-400"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: "Signed (8-bit)" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [
          FIELDS.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4",
              style: {
                background: activeField === field.id ? field.bgColor : "rgba(14,22,32,0.6)",
                border: `1px solid ${activeField === field.id ? field.borderColor : "var(--os-border-subtle)"}`,
                transition: "all 0.15s"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] font-bold tracking-widest px-2 py-0.5 rounded",
                        style: {
                          background: `${field.color}18`,
                          color: field.color,
                          border: `1px solid ${field.color}40`
                        },
                        children: field.prefix
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: field.label })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleCopy(field.id),
                      "data-ocid": `baseconverter.${field.id}.button`,
                      className: "w-7 h-7 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground/60 hover:text-foreground transition-colors",
                      title: "Copy",
                      children: copied === field.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: values[field.id],
                    onChange: (e) => handleChange(field.id, e.target.value),
                    onFocus: () => setActiveField(field.id),
                    placeholder: field.id === "decimal" ? "Enter a number..." : "—",
                    "data-ocid": `baseconverter.${field.id}.input`,
                    spellCheck: false,
                    className: "w-full bg-transparent outline-none text-lg font-mono tracking-wide",
                    style: { color: field.color, caretColor: field.color }
                  }
                ),
                field.id === "binary" && values.binary && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[9px] mt-1",
                    style: { color: "rgba(34,197,94,0.4)" },
                    children: "Grouped in nibbles (4 bits)"
                  }
                )
              ]
            },
            field.id
          )),
          ieee && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4",
              style: {
                background: "rgba(14,22,32,0.6)",
                border: "1px solid var(--os-border-subtle)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold tracking-widest text-muted-foreground/60 mb-2", children: "IEEE 754 FLOAT (32-bit)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm text-muted-foreground break-all leading-relaxed", children: (() => {
                  const bytes = ieee.split(" ");
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    bytes[0] && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#F97316" }, children: bytes[0] }),
                      " "
                    ] }),
                    bytes[1] && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-accent)" }, children: bytes[1] }),
                      " "
                    ] }),
                    bytes[2] && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#22C55E" }, children: bytes[2] }),
                      " "
                    ] }),
                    bytes[3] && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#22C55E" }, children: bytes[3] })
                  ] });
                })() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-muted-foreground/50 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#F97316" }, children: "sign" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-accent)" }, children: "exponent" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#22C55E" }, children: "mantissa" })
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  BaseConverter
};
