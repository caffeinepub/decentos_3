import { j as jsxRuntimeExports } from "./index-8tMpYjTW.js";
const SHORTCUT_CATEGORIES = [
  {
    name: "System",
    emoji: "⚙️",
    shortcuts: [
      { keys: ["Cmd", "Space"], desc: "Open Spotlight Search" },
      {
        keys: ["Ctrl", "Space"],
        desc: "Open Spotlight Search (Windows/Linux)"
      },
      { keys: ["Esc"], desc: "Close Spotlight / Close modal" }
    ]
  },
  {
    name: "Window Management",
    emoji: "🪟",
    shortcuts: [
      { keys: ["Drag → Left edge"], desc: "Snap window to left half" },
      { keys: ["Drag → Right edge"], desc: "Snap window to right half" },
      { keys: ["Click titlebar button"], desc: "Minimize / Restore window" },
      { keys: ["⊠ button"], desc: "Close window" },
      { keys: ["⛶ button"], desc: "Maximize / Restore window" },
      { keys: ["Drag titlebar"], desc: "Move window" },
      { keys: ["Drag ◢ corner"], desc: "Resize window" }
    ]
  },
  {
    name: "Navigation",
    emoji: "🧭",
    shortcuts: [
      { keys: ["Double-click icon"], desc: "Open app" },
      { keys: ["Right-click icon"], desc: "Context menu (open / pin)" },
      { keys: ["Click taskbar icon"], desc: "Toggle minimize / restore" }
    ]
  },
  {
    name: "Apps",
    emoji: "📦",
    shortcuts: [
      { keys: ["Cmd", "S"], desc: "Save (in WriteOS, Notes, Text Editor)" },
      { keys: ["Cmd", "Z"], desc: "Undo (in Drawing, Code Editor)" },
      { keys: ["Cmd", "C"], desc: "Copy to system clipboard" },
      { keys: ["Cmd", "V"], desc: "Paste from system clipboard" },
      { keys: ["Enter"], desc: "Submit / Confirm action" },
      { keys: ["Tab"], desc: "Indent in Code Editor" }
    ]
  }
];
function KbdKey({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-xs font-semibold",
      style: {
        background: "rgba(39,215,224,0.12)",
        border: "1px solid rgba(39,215,224,0.3)",
        color: "var(--os-accent)"
      },
      children: label
    }
  );
}
function KeyboardShortcuts(_) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4",
      style: { background: "rgba(11,15,18,0.7)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Keyboard Shortcuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: "Quick reference for all DecentOS shortcuts" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: SHORTCUT_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "shortcuts.card",
            className: "rounded-xl border border-border bg-muted/50 p-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cat.emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: cat.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2.5", children: cat.shortcuts.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start justify-between gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: s.desc }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 flex-wrap justify-end gap-1", children: s.keys.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(KbdKey, { label: k }, k)) })
                  ]
                },
                s.desc
              )) })
            ]
          },
          cat.name
        )) })
      ]
    }
  );
}
export {
  KeyboardShortcuts
};
