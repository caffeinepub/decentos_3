import { r as reactExports, j as jsxRuntimeExports, g as ue } from "./index-CZGIn5x2.js";
import { B as Button } from "./button-DBwl-7M-.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
async function computeHash(text, algo) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function HashGenerator({
  windowProps: _windowProps
}) {
  const [input, setInput] = reactExports.useState("");
  const [algo, setAlgo] = reactExports.useState("SHA-256");
  const [hash, setHash] = reactExports.useState("");
  const [computing, setComputing] = reactExports.useState(false);
  const debounceRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
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
    ue.success("Hash copied");
  };
  const algos = ["SHA-1", "SHA-256", "SHA-512"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "hashgenerator.panel",
      className: "flex flex-col h-full p-4 gap-4 text-foreground",
      style: { background: "rgba(11,15,18,0.6)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-sm font-semibold",
            style: { color: "rgba(39,215,224,1)" },
            children: "Hash Generator"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: "#888" }, children: "Algorithm:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: algos.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "hashgenerator.toggle",
              onClick: () => setAlgo(a),
              className: "px-3 py-1 rounded text-xs font-mono transition-all",
              style: {
                background: algo === a ? "rgba(39,215,224,0.2)" : "rgba(42,58,66,0.4)",
                color: algo === a ? "rgba(39,215,224,1)" : "#888",
                border: `1px solid ${algo === a ? "rgba(39,215,224,0.5)" : "rgba(42,58,66,0.8)"}`
              },
              children: a
            },
            a
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: "#888" }, children: "Input Text" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              "data-ocid": "hashgenerator.textarea",
              value: input,
              onChange: (e) => setInput(e.target.value),
              placeholder: "Type or paste text to hash...",
              className: "flex-1 resize-none rounded p-2 text-sm outline-none text-foreground bg-transparent",
              style: {
                border: "1px solid rgba(42,58,66,0.8)",
                fontFamily: "monospace"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", style: { color: "#888" }, children: [
            algo,
            " Hash"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 rounded p-2",
              style: {
                background: "rgba(42,58,66,0.2)",
                border: "1px solid rgba(42,58,66,0.8)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "flex-1 text-xs font-mono break-all",
                    style: { color: computing ? "#666" : "rgba(39,215,224,0.9)" },
                    children: computing ? "Computing..." : hash || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#555" }, children: "Hash will appear here" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "hashgenerator.copy_button",
                    size: "sm",
                    variant: "outline",
                    onClick: handleCopy,
                    disabled: !hash || computing,
                    className: "h-7 px-2 text-xs shrink-0",
                    style: {
                      borderColor: "rgba(39,215,224,0.4)",
                      color: "rgba(39,215,224,1)"
                    },
                    children: "Copy"
                  }
                )
              ]
            }
          ),
          hash && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", style: { color: "#555" }, children: [
            hash.length,
            " hex chars · ",
            hash.length * 4,
            " bits"
          ] })
        ] })
      ]
    }
  );
}
export {
  HashGenerator
};
