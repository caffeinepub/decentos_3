import { r as reactExports, j as jsxRuntimeExports, g as ue } from "./index-8tMpYjTW.js";
import { B as Button } from "./button-BMA-bo_z.js";
import "./utils-CLTBVgOB.js";
import "./index-Dt4skXFn.js";
function JsonFormatter({
  windowProps: _windowProps
}) {
  const [input, setInput] = reactExports.useState("");
  const [output, setOutput] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const validate = (text) => {
    try {
      JSON.parse(text);
      setError("");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      return false;
    }
  };
  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };
  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };
  const handleValidate = () => {
    if (!input.trim()) return;
    const valid = validate(input);
    if (valid) ue.success("Valid JSON ✓");
    else ue.error("Invalid JSON");
  };
  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    ue.success("Copied to clipboard");
  };
  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };
  const lineCount = input ? input.split("\n").length : 0;
  const charCount = input.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "jsonformatter.panel",
      style: { background: "rgba(11,15,18,0.6)", fontFamily: "monospace" },
      className: "flex flex-col h-full text-foreground",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-2 border-b",
            style: { borderColor: "rgba(42,58,66,0.8)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-sm font-semibold",
                  style: { color: "rgba(39,215,224,1)" },
                  children: "JSON Formatter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 ml-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "jsonformatter.format_button",
                    size: "sm",
                    variant: "outline",
                    onClick: handleFormat,
                    className: "h-7 px-2 text-xs border",
                    style: {
                      borderColor: "rgba(39,215,224,0.4)",
                      color: "rgba(39,215,224,1)"
                    },
                    children: "Format"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "jsonformatter.minify_button",
                    size: "sm",
                    variant: "outline",
                    onClick: handleMinify,
                    className: "h-7 px-2 text-xs border",
                    style: {
                      borderColor: "rgba(39,215,224,0.4)",
                      color: "rgba(39,215,224,1)"
                    },
                    children: "Minify"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "jsonformatter.validate_button",
                    size: "sm",
                    variant: "outline",
                    onClick: handleValidate,
                    className: "h-7 px-2 text-xs border",
                    style: {
                      borderColor: "rgba(39,215,224,0.4)",
                      color: "rgba(39,215,224,1)"
                    },
                    children: "Validate"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "jsonformatter.copy_button",
                    size: "sm",
                    variant: "outline",
                    onClick: handleCopy,
                    disabled: !output,
                    className: "h-7 px-2 text-xs border",
                    style: {
                      borderColor: "rgba(39,215,224,0.4)",
                      color: "rgba(39,215,224,1)"
                    },
                    children: "Copy"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "jsonformatter.clear_button",
                    size: "sm",
                    variant: "outline",
                    onClick: handleClear,
                    className: "h-7 px-2 text-xs border",
                    style: { borderColor: "rgba(42,58,66,0.8)", color: "#888" },
                    children: "Clear"
                  }
                )
              ] })
            ]
          }
        ),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "jsonformatter.error_state",
            className: "px-3 py-2 text-xs",
            style: {
              background: "rgba(239,68,68,0.15)",
              color: "#f87171",
              borderBottom: "1px solid rgba(239,68,68,0.3)"
            },
            children: [
              "⚠ ",
              error
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden gap-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col flex-1 overflow-hidden",
              style: { borderRight: "1px solid rgba(42,58,66,0.8)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-3 py-1 text-xs",
                    style: {
                      color: "#888",
                      borderBottom: "1px solid rgba(42,58,66,0.5)"
                    },
                    children: "Input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    "data-ocid": "jsonformatter.input",
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    placeholder: "Paste JSON here...",
                    spellCheck: false,
                    className: "flex-1 resize-none bg-transparent p-3 text-xs outline-none text-foreground",
                    style: {
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      color: error && input ? "#f87171" : void 0
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "px-3 py-1 text-xs",
                style: {
                  color: "#888",
                  borderBottom: "1px solid rgba(42,58,66,0.5)"
                },
                children: "Output"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                "data-ocid": "jsonformatter.textarea",
                value: output,
                readOnly: true,
                placeholder: "Formatted output will appear here...",
                spellCheck: false,
                className: "flex-1 resize-none bg-transparent p-3 text-xs outline-none",
                style: {
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  color: "rgba(39,215,224,0.9)"
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1 text-xs flex gap-4",
            style: { borderTop: "1px solid rgba(42,58,66,0.8)", color: "#666" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Lines: ",
                lineCount
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Chars: ",
                charCount
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  JsonFormatter
};
