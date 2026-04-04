import { r as reactExports, j as jsxRuntimeExports } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
function Scratchpad() {
  const { data, set, loading } = useCanisterKV(
    "decentos_scratchpad",
    ""
  );
  const [text, setText] = reactExports.useState("");
  const [saveStatus, setSaveStatus] = reactExports.useState(
    "idle"
  );
  const debounceRef = reactExports.useRef(null);
  const initializedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!loading && !initializedRef.current) {
      initializedRef.current = true;
      setText(data);
    }
  }, [loading, data]);
  const handleChange = (value) => {
    setText(value);
    setSaveStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      set(value);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2e3);
    }, 800);
  };
  if (loading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex h-full items-center justify-center",
        style: { background: "rgba(11,15,18,0.6)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" })
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full relative",
      style: {
        background: "rgba(11,15,18,0.6)",
        color: "rgba(220,235,240,0.9)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-3 z-10", children: [
          saveStatus === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "data-ocid": "scratchpad.loading_state",
              className: "text-xs opacity-50",
              children: "Saving..."
            }
          ),
          saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "data-ocid": "scratchpad.success_state",
              className: "text-xs",
              style: { color: "rgba(6,182,212,0.8)" },
              children: "Saved ✓"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            "data-ocid": "scratchpad.textarea",
            value: text,
            onChange: (e) => handleChange(e.target.value),
            placeholder: "Start typing... auto-saves as you go.",
            className: "flex-1 w-full p-5 resize-none outline-none text-sm leading-relaxed",
            style: {
              background: "transparent",
              color: "rgba(220,235,240,0.9)",
              caretColor: "rgba(6,182,212,0.9)",
              fontFamily: "'JetBrains Mono', monospace"
            },
            spellCheck: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 right-3 text-xs opacity-30 pointer-events-none", children: [
          text.length.toLocaleString(),
          " chars"
        ] })
      ]
    }
  );
}
export {
  Scratchpad
};
