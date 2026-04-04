import { r as reactExports, j as jsxRuntimeExports, g as ue } from "./index-8tMpYjTW.js";
import { B as Button } from "./button-BMA-bo_z.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DIiy63UD.js";
import "./utils-CLTBVgOB.js";
import "./index-Dt4skXFn.js";
import "./index-Bh3wJO-k.js";
import "./index-H3VjlnDK.js";
import "./index-D9DFwgcF.js";
import "./index-B-YdETFI.js";
import "./index-DQsGwgle.js";
import "./index-B5o_Z5wf.js";
import "./index-DQZl7YVg.js";
import "./index-BeS__rWb.js";
import "./index-BlmlyJvC.js";
function Base64Tool({ windowProps: _windowProps }) {
  const [encodeInput, setEncodeInput] = reactExports.useState("");
  const [encodeOutput, setEncodeOutput] = reactExports.useState("");
  const [decodeInput, setDecodeInput] = reactExports.useState("");
  const [decodeOutput, setDecodeOutput] = reactExports.useState("");
  const [decodeError, setDecodeError] = reactExports.useState("");
  const handleEncode = () => {
    try {
      setEncodeOutput(btoa(unescape(encodeURIComponent(encodeInput))));
    } catch {
      setEncodeOutput("");
      ue.error("Encode failed");
    }
  };
  const handleDecode = () => {
    try {
      setDecodeOutput(decodeURIComponent(escape(atob(decodeInput.trim()))));
      setDecodeError("");
    } catch {
      setDecodeOutput("");
      setDecodeError("Invalid Base64 — unable to decode");
    }
  };
  const handleCopyEncode = () => {
    if (!encodeOutput) return;
    navigator.clipboard.writeText(encodeOutput);
    ue.success("Copied");
  };
  const handleCopyDecode = () => {
    if (!decodeOutput) return;
    navigator.clipboard.writeText(decodeOutput);
    ue.success("Copied");
  };
  const panelStyle = {
    background: "rgba(11,15,18,0.6)",
    border: "1px solid rgba(42,58,66,0.8)"
  };
  const fieldLabel = (text) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: "#888" }, children: text });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "base64tool.panel",
      className: "flex flex-col h-full p-3 gap-3 text-foreground",
      style: { background: "rgba(11,15,18,0.6)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-sm font-semibold",
            style: { color: "rgba(39,215,224,1)" },
            children: "Base64 Tool"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "encode", className: "flex flex-col flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              className: "w-fit",
              style: { background: "rgba(42,58,66,0.4)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TabsTrigger,
                  {
                    "data-ocid": "base64tool.encode_tab",
                    value: "encode",
                    className: "text-xs",
                    children: "Encode"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TabsTrigger,
                  {
                    "data-ocid": "base64tool.decode_tab",
                    value: "decode",
                    className: "text-xs",
                    children: "Decode"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "encode", className: "flex flex-col flex-1 gap-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 gap-2", children: [
            fieldLabel("Text Input"),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                "data-ocid": "base64tool.input",
                value: encodeInput,
                onChange: (e) => setEncodeInput(e.target.value),
                placeholder: "Enter text to encode...",
                className: "flex-1 resize-none rounded p-2 text-xs outline-none text-foreground",
                style: { ...panelStyle, fontFamily: "monospace", minHeight: 80 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "base64tool.submit_button",
                size: "sm",
                onClick: handleEncode,
                className: "self-start h-7 px-3 text-xs",
                style: {
                  background: "rgba(39,215,224,0.15)",
                  color: "rgba(39,215,224,1)",
                  border: "1px solid rgba(39,215,224,0.4)"
                },
                children: "Encode →"
              }
            ),
            fieldLabel("Base64 Output"),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                "data-ocid": "base64tool.textarea",
                value: encodeOutput,
                readOnly: true,
                placeholder: "Base64 encoded result...",
                className: "flex-1 resize-none rounded p-2 text-xs outline-none",
                style: {
                  ...panelStyle,
                  fontFamily: "monospace",
                  color: "rgba(39,215,224,0.9)",
                  minHeight: 80
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "base64tool.copy_button",
                size: "sm",
                variant: "outline",
                onClick: handleCopyEncode,
                disabled: !encodeOutput,
                className: "self-start h-7 px-3 text-xs",
                style: { borderColor: "rgba(42,58,66,0.8)", color: "#aaa" },
                children: "Copy Output"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "decode", className: "flex flex-col flex-1 gap-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 gap-2", children: [
            fieldLabel("Base64 Input"),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                "data-ocid": "base64tool.input",
                value: decodeInput,
                onChange: (e) => {
                  setDecodeInput(e.target.value);
                  setDecodeError("");
                },
                placeholder: "Paste Base64 string here...",
                className: "flex-1 resize-none rounded p-2 text-xs outline-none text-foreground",
                style: {
                  ...panelStyle,
                  fontFamily: "monospace",
                  minHeight: 80,
                  borderColor: decodeError ? "rgba(239,68,68,0.5)" : void 0
                }
              }
            ),
            decodeError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "base64tool.error_state",
                className: "text-xs",
                style: { color: "#f87171" },
                children: [
                  "⚠ ",
                  decodeError
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "base64tool.submit_button",
                size: "sm",
                onClick: handleDecode,
                className: "self-start h-7 px-3 text-xs",
                style: {
                  background: "rgba(39,215,224,0.15)",
                  color: "rgba(39,215,224,1)",
                  border: "1px solid rgba(39,215,224,0.4)"
                },
                children: "Decode →"
              }
            ),
            fieldLabel("Decoded Output"),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                "data-ocid": "base64tool.textarea",
                value: decodeOutput,
                readOnly: true,
                placeholder: "Decoded text will appear here...",
                className: "flex-1 resize-none rounded p-2 text-xs outline-none",
                style: {
                  ...panelStyle,
                  fontFamily: "monospace",
                  color: "rgba(39,215,224,0.9)",
                  minHeight: 80
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "base64tool.copy_button",
                size: "sm",
                variant: "outline",
                onClick: handleCopyDecode,
                disabled: !decodeOutput,
                className: "self-start h-7 px-3 text-xs",
                style: { borderColor: "rgba(42,58,66,0.8)", color: "#aaa" },
                children: "Copy Output"
              }
            )
          ] }) })
        ] })
      ]
    }
  );
}
export {
  Base64Tool
};
