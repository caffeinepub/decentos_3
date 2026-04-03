import { r as reactExports, j as jsxRuntimeExports, b as CodeXml, a3 as ChevronDown, M as Minimize2, aA as Clipboard, g as ue, f as ChevronRight } from "./index-CZGIn5x2.js";
function getType(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}
const TYPE_COLORS = {
  string: "rgb(34,197,94)",
  number: "rgb(245,158,11)",
  boolean: "rgb(39,215,224)",
  null: "rgba(148,163,184,0.7)",
  object: "rgba(226,232,240,0.9)",
  array: "rgba(226,232,240,0.9)"
};
function JsonNode({
  keyName,
  value,
  path,
  depth,
  forceExpand,
  forceCollapse
}) {
  const type = getType(value);
  const isExpandable = type === "object" || type === "array";
  const [open, setOpen] = reactExports.useState(depth < 2);
  const handleToggle = () => setOpen((o) => !o);
  const isOpen = forceCollapse ? false : forceExpand ? true : open;
  const copyPath = () => {
    navigator.clipboard.writeText(path).then(() => ue.success(`Copied: ${path}`));
  };
  const renderKey = keyName !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: copyPath,
      className: "text-blue-300 hover:text-blue-200 hover:underline transition-colors text-xs",
      title: `Copy path: ${path}`,
      children: [
        '"',
        keyName,
        '"'
      ]
    }
  ) : null;
  if (!isExpandable) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1 py-0.5",
        style: { paddingLeft: depth * 16 },
        children: [
          renderKey && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            renderKey,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 text-xs", children: ": " })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-mono",
              style: { color: TYPE_COLORS[type] },
              children: type === "string" ? `"${value}"` : String(value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/30", children: type })
        ]
      }
    );
  }
  const entries = type === "array" ? value.map(
    (v, i) => [String(i), v]
  ) : Object.entries(value);
  const bracket = type === "array" ? ["[", "]"] : ["{", "}"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { paddingLeft: depth * 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "flex items-center gap-1 py-0.5 cursor-pointer w-full text-left",
        onClick: handleToggle,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 inline" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 inline" }) }),
          renderKey && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            renderKey,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 text-xs", children: ": " })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-mono",
              style: { color: TYPE_COLORS[type] },
              children: [
                bracket[0],
                !isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/50", children: [
                  entries.length,
                  " ",
                  type === "array" ? "items" : "keys"
                ] }),
                !isOpen && bracket[1]
              ]
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      entries.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        JsonNode,
        {
          keyName: type === "array" ? null : k,
          value: v,
          path: type === "array" ? `${path}[${k}]` : `${path}.${k}`,
          depth: depth + 1,
          forceExpand,
          forceCollapse
        },
        k
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-xs font-mono",
          style: { color: TYPE_COLORS[type] },
          children: bracket[1]
        }
      )
    ] })
  ] });
}
function DataVisualizer() {
  const [input, setInput] = reactExports.useState(`{
  "name": "DecentOS",
  "version": "39.0",
  "features": ["filesystem", "apps", "marketplace"],
  "stats": {
    "apps": 63,
    "decentralized": true,
    "blockchain": "ICP"
  }
}`);
  const [forceExpand, setForceExpand] = reactExports.useState(false);
  const [forceCollapse, setForceCollapse] = reactExports.useState(false);
  const parsed = reactExports.useMemo(() => {
    try {
      return { value: JSON.parse(input), error: null };
    } catch (e) {
      return { value: null, error: e.message };
    }
  }, [input]);
  const handleExpandAll = () => {
    setForceCollapse(false);
    setForceExpand(true);
    setTimeout(() => setForceExpand(false), 100);
  };
  const handleCollapseAll = () => {
    setForceExpand(false);
    setForceCollapse(true);
    setTimeout(() => setForceCollapse(false), 100);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", style: { color: "#e2e8f0" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-4 py-3",
        style: { borderBottom: "1px solid var(--os-border-subtle)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "w-4 h-4", style: { color: "rgb(39,215,224)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Data Visualizer" })
          ] }),
          parsed.value !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleExpandAll,
                "data-ocid": "datavisualizer.primary_button",
                className: "flex items-center gap-1 px-2 py-1 rounded text-xs transition-all",
                style: {
                  background: "rgba(39,215,224,0.08)",
                  border: "1px solid rgba(39,215,224,0.2)",
                  color: "rgb(39,215,224)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3" }),
                  " Expand All"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleCollapseAll,
                "data-ocid": "datavisualizer.secondary_button",
                className: "flex items-center gap-1 px-2 py-1 rounded text-xs transition-all",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-text-muted)",
                  color: "rgba(148,163,184,0.7)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "w-3 h-3" }),
                  " Collapse All"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => navigator.clipboard.writeText(JSON.stringify(JSON.parse(input), null, 2)).then(() => ue.success("Copied!")),
                "data-ocid": "datavisualizer.toggle",
                className: "flex items-center gap-1 px-2 py-1 rounded text-xs transition-all",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid var(--os-text-muted)",
                  color: "rgba(148,163,184,0.7)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "w-3 h-3" }),
                  " Copy"
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "px-4 pt-3 pb-2",
          style: { borderBottom: "1px solid var(--os-border-subtle)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: input,
                onChange: (e) => setInput(e.target.value),
                "data-ocid": "datavisualizer.editor",
                placeholder: "Paste JSON here...",
                rows: 5,
                className: "w-full resize-none rounded text-xs font-mono p-2 bg-muted/50 focus:outline-none",
                style: {
                  border: parsed.error ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--os-border-subtle)",
                  color: parsed.error ? "rgb(252,165,165)" : "#e2e8f0"
                }
              }
            ),
            parsed.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "datavisualizer.error_state",
                className: "text-xs text-red-400 mt-1",
                children: parsed.error
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto px-4 py-3", children: parsed.value !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        JsonNode,
        {
          keyName: null,
          value: parsed.value,
          path: "root",
          depth: 0,
          forceExpand,
          forceCollapse
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "datavisualizer.empty_state",
          className: "text-center py-12 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "w-8 h-8 mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Paste valid JSON above to explore it" })
          ]
        }
      ) })
    ] })
  ] });
}
export {
  DataVisualizer
};
