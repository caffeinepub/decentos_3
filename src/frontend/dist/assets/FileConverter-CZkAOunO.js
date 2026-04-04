import { r as reactExports, g as ue, j as jsxRuntimeExports, R as RefreshCw, C as Check } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { C as ClipboardCopy } from "./clipboard-copy-CR2CYUdP.js";
const FORMAT_LABELS = {
  json: "JSON",
  csv: "CSV",
  yaml: "YAML",
  xml: "XML"
};
function parseJson(text) {
  return JSON.parse(text);
}
function stringifyJson(data) {
  return JSON.stringify(data, null, 2);
}
function parseCsv(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2)
    throw new Error("CSV must have at least a header and one data row");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"|$/g, ""));
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"|$/g, ""));
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = vals[i] ?? "";
    });
    return obj;
  });
}
function stringifyCsv(data) {
  if (!Array.isArray(data))
    throw new Error("CSV output requires an array of objects");
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map(
    (row) => headers.map((h) => {
      const v = String(row[h] ?? "");
      return v.includes(",") ? `"${v}"` : v;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
function parseYaml(text) {
  const result = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([\w\-]+):\s*(.*)/);
    if (m) result[m[1]] = m[2].trim();
  }
  return result;
}
function stringifyYaml(data) {
  if (Array.isArray(data)) {
    return data.map((item, i) => {
      const entries = Object.entries(item);
      return `- # item ${i + 1}
${entries.map(([k, v]) => `  ${k}: ${v}`).join("\n")}`;
    }).join("\n");
  }
  return Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
}
function parseXml(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const root = doc.documentElement;
  if (root.nodeName === "parsererror") throw new Error("Invalid XML");
  const result = {};
  for (const child of Array.from(root.children)) {
    result[child.tagName] = child.textContent ?? "";
  }
  return result;
}
function stringifyXml(data) {
  if (Array.isArray(data)) {
    const items = data.map((item) => {
      const inner2 = Object.entries(item).map(([k, v]) => `  <${k}>${v}</${k}>`).join("\n");
      return `  <item>
${inner2}
  </item>`;
    }).join("\n");
    return `<root>
${items}
</root>`;
  }
  const inner = Object.entries(data).map(([k, v]) => `  <${k}>${v}</${k}>`).join("\n");
  return `<root>
${inner}
</root>`;
}
function convertData(text, from, to) {
  if (!text.trim()) return "";
  let parsed;
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
function FileConverter() {
  const {
    data: historyData,
    set: saveHistory,
    loading
  } = useCanisterKV("decentos_fileconverter_history", []);
  const [inputText, setInputText] = reactExports.useState("");
  const [outputText, setOutputText] = reactExports.useState("");
  const [fromFormat, setFromFormat] = reactExports.useState("json");
  const [toFormat, setToFormat] = reactExports.useState("csv");
  const [error, setError] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(false);
  const [history, setHistory] = reactExports.useState([]);
  const initialized = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!loading && !initialized.current) {
      initialized.current = true;
      setHistory(Array.isArray(historyData) ? historyData : []);
    }
  }, [loading, historyData]);
  const handleConvert = reactExports.useCallback(() => {
    setError("");
    setOutputText("");
    try {
      const result = convertData(inputText, fromFormat, toFormat);
      setOutputText(result);
      const entry = {
        from: fromFormat,
        to: toFormat,
        inputSnippet: inputText.slice(0, 60),
        ts: Date.now()
      };
      const next = [entry, ...history].slice(0, 5);
      setHistory(next);
      saveHistory(next);
      ue.success("Converted successfully ✓");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  }, [inputText, fromFormat, toFormat, history, saveHistory]);
  const handleCopy = reactExports.useCallback(() => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }, [outputText]);
  const btnStyle = {
    background: "rgba(39,215,224,0.12)",
    border: "1px solid rgba(39,215,224,0.3)",
    color: "var(--os-accent)",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 600
  };
  const selectStyle = {
    background: "rgba(15,22,30,0.9)",
    border: "1px solid rgba(39,215,224,0.2)",
    color: "rgba(232,238,242,0.85)",
    borderRadius: 6,
    padding: "4px 8px",
    fontSize: 12,
    outline: "none",
    cursor: "pointer"
  };
  const textareaStyle = {
    flex: 1,
    resize: "none",
    outline: "none",
    background: "var(--os-bg-app)",
    border: "1px solid rgba(39,215,224,0.15)",
    borderRadius: 8,
    color: "rgba(232,238,242,0.85)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    padding: 12,
    lineHeight: 1.6
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: {
        background: "rgba(8,14,20,0.95)",
        color: "rgba(232,238,242,0.9)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-4 py-3 flex-shrink-0",
            style: { borderBottom: "1px solid rgba(39,215,224,0.1)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: { color: "var(--os-accent)", fontSize: 13, fontWeight: 700 },
                  children: "File Converter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-muted)", fontSize: 11 }, children: "JSON · CSV · YAML · XML" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 gap-3 p-3 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 gap-2 min-h-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--os-text-secondary)" }, children: "Input" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: fromFormat,
                  onChange: (e) => setFromFormat(e.target.value),
                  style: selectStyle,
                  "data-ocid": "fileconverter.select",
                  children: Object.keys(FORMAT_LABELS).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f, children: FORMAT_LABELS[f] }, f))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: inputText,
                onChange: (e) => setInputText(e.target.value),
                placeholder: `Paste ${FORMAT_LABELS[fromFormat]} here...`,
                style: textareaStyle,
                "data-ocid": "fileconverter.textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleConvert,
                style: {
                  ...btnStyle,
                  padding: "10px 16px",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                },
                "data-ocid": "fileconverter.primary_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                  "Convert"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  fontSize: 10,
                  color: "rgba(39,215,224,0.5)",
                  textAlign: "center"
                },
                children: [
                  FORMAT_LABELS[fromFormat],
                  " →",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  FORMAT_LABELS[toFormat]
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 gap-2 min-h-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--os-text-secondary)" }, children: "Output" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: toFormat,
                  onChange: (e) => setToFormat(e.target.value),
                  style: selectStyle,
                  "data-ocid": "fileconverter.select",
                  children: Object.keys(FORMAT_LABELS).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f, children: FORMAT_LABELS[f] }, f))
                }
              ),
              outputText && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleCopy,
                  style: {
                    ...btnStyle,
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  },
                  "data-ocid": "fileconverter.secondary_button",
                  children: [
                    copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "w-3 h-3" }),
                    copied ? "Copied!" : "Copy"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: outputText,
                readOnly: true,
                placeholder: "Output will appear here...",
                style: { ...textareaStyle, opacity: outputText ? 1 : 0.5 },
                "data-ocid": "fileconverter.textarea"
              }
            )
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mx-3 mb-2 px-3 py-2 rounded text-xs",
            style: {
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171"
            },
            "data-ocid": "fileconverter.error_state",
            children: error
          }
        ),
        history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 pb-3 flex-shrink-0",
            style: {
              borderTop: "1px solid rgba(39,215,224,0.08)",
              paddingTop: 8
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 10,
                    color: "var(--os-text-muted)",
                    marginBottom: 6
                  },
                  children: "Recent conversions"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: history.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    fontSize: 10,
                    color: "rgba(39,215,224,0.7)",
                    background: "rgba(39,215,224,0.06)",
                    border: "1px solid rgba(39,215,224,0.15)",
                    borderRadius: 4,
                    padding: "2px 8px"
                  },
                  children: [
                    FORMAT_LABELS[h.from],
                    " → ",
                    FORMAT_LABELS[h.to]
                  ]
                },
                `${h.ts}-${i}`
              )) })
            ]
          }
        )
      ]
    }
  );
}
export {
  FileConverter
};
