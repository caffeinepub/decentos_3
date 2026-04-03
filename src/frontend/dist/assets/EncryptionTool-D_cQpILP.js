import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as Lock, m as Copy, g as ue } from "./index-CZGIn5x2.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { L as Label } from "./label-CGkVOZPp.js";
import { T as Textarea } from "./textarea-Bhc13Xgf.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
import "./index-B9-lQkRo.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
];
const LockOpen = createLucideIcon("lock-open", __iconNode);
function xorCipher(text, password) {
  if (!password) return text;
  const key = password.split("").map((c) => c.charCodeAt(0));
  return text.split("").map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key[i % key.length])).join("");
}
function toBase64(str) {
  try {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
  } catch {
    return btoa(unescape(encodeURIComponent(str)));
  }
}
function fromBase64(str) {
  try {
    const bytes = atob(str);
    return new TextDecoder().decode(
      new Uint8Array(bytes.split("").map((c) => c.charCodeAt(0)))
    );
  } catch {
    return decodeURIComponent(escape(atob(str)));
  }
}
function EncryptionTool(_) {
  const [input, setInput] = reactExports.useState("");
  const [output, setOutput] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("encrypt");
  const handleProcess = () => {
    if (!password) {
      ue.error("Enter a password");
      return;
    }
    if (!input.trim()) {
      ue.error("Enter some text");
      return;
    }
    try {
      if (mode === "encrypt") {
        const ciphered = xorCipher(input, password);
        setOutput(toBase64(ciphered));
        ue.success("Text encrypted");
      } else {
        const decoded = fromBase64(input.trim());
        const plain = xorCipher(decoded, password);
        setOutput(plain);
        ue.success("Text decrypted");
      }
    } catch {
      ue.error("Failed — check your input and password");
    }
  };
  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    ue.success("Copied to clipboard");
  };
  const glassPanel = "rounded-xl border border-border bg-muted/50 p-4";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full flex-col gap-4 p-4",
      style: { background: "rgba(11,15,18,0.7)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "encryption.encrypt_button",
                size: "sm",
                variant: mode === "encrypt" ? "default" : "outline",
                onClick: () => setMode("encrypt"),
                style: mode === "encrypt" ? { background: "var(--os-accent)", color: "#000" } : {},
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mr-1 h-3.5 w-3.5" }),
                  " Encrypt"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "encryption.decrypt_button",
                size: "sm",
                variant: mode === "decrypt" ? "default" : "outline",
                onClick: () => setMode("decrypt"),
                style: mode === "decrypt" ? { background: "var(--os-accent)", color: "#000" } : {},
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "mr-1 h-3.5 w-3.5" }),
                  " Decrypt"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-1 min-w-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "encryption.input",
                type: "password",
                placeholder: "Enter encryption password…",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                className: "border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/60"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col gap-2 ${glassPanel}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: mode === "encrypt" ? "Plaintext" : "Ciphertext (Base64)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                "data-ocid": "encryption.textarea",
                placeholder: mode === "encrypt" ? "Enter text to encrypt…" : "Paste Base64 cipher…",
                value: input,
                onChange: (e) => setInput(e.target.value),
                className: "flex-1 resize-none border-border bg-transparent text-foreground placeholder:text-muted-foreground/60 font-mono text-sm",
                style: { minHeight: "180px" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col gap-2 ${glassPanel}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: mode === "encrypt" ? "Ciphertext (Base64)" : "Plaintext" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "encryption.secondary_button",
                  size: "sm",
                  variant: "ghost",
                  className: "h-6 px-2 text-xs text-muted-foreground/60 hover:text-foreground",
                  onClick: copyOutput,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-1 h-3 w-3" }),
                    " Copy"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                readOnly: true,
                value: output,
                placeholder: "Output appears here…",
                className: "flex-1 resize-none border-border bg-transparent text-muted-foreground placeholder:text-muted-foreground/30 font-mono text-sm",
                style: { minHeight: "180px" }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "encryption.submit_button",
            onClick: handleProcess,
            className: "w-full font-semibold",
            style: { background: "var(--os-accent)", color: "#000" },
            children: mode === "encrypt" ? "Encrypt" : "Decrypt"
          }
        )
      ]
    }
  );
}
export {
  EncryptionTool
};
