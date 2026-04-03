interface Props {
  windowProps?: Record<string, unknown>;
}

const SHORTCUT_CATEGORIES = [
  {
    name: "System",
    emoji: "⚙️",
    shortcuts: [
      { keys: ["Cmd", "Space"], desc: "Open Spotlight Search" },
      {
        keys: ["Ctrl", "Space"],
        desc: "Open Spotlight Search (Windows/Linux)",
      },
      { keys: ["Esc"], desc: "Close Spotlight / Close modal" },
    ],
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
      { keys: ["Drag ◢ corner"], desc: "Resize window" },
    ],
  },
  {
    name: "Navigation",
    emoji: "🧭",
    shortcuts: [
      { keys: ["Double-click icon"], desc: "Open app" },
      { keys: ["Right-click icon"], desc: "Context menu (open / pin)" },
      { keys: ["Click taskbar icon"], desc: "Toggle minimize / restore" },
    ],
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
      { keys: ["Tab"], desc: "Indent in Code Editor" },
    ],
  },
];

function KbdKey({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-xs font-semibold"
      style={{
        background: "rgba(39,215,224,0.12)",
        border: "1px solid rgba(39,215,224,0.3)",
        color: "var(--os-accent)",
      }}
    >
      {label}
    </span>
  );
}

export function KeyboardShortcuts(_: Props) {
  return (
    <div
      className="h-full overflow-y-auto p-4"
      style={{ background: "rgba(11,15,18,0.7)" }}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Keyboard Shortcuts
        </h2>
        <p className="text-xs text-muted-foreground/60">
          Quick reference for all DecentOS shortcuts
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SHORTCUT_CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            data-ocid="shortcuts.card"
            className="rounded-xl border border-border bg-muted/50 p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <span>{cat.emoji}</span>
              <span className="text-sm font-semibold text-foreground">
                {cat.name}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {cat.shortcuts.map((s) => (
                <div
                  key={s.desc}
                  className="flex items-start justify-between gap-2"
                >
                  <span className="text-xs text-muted-foreground/60">
                    {s.desc}
                  </span>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1">
                    {s.keys.map((k) => (
                      <KbdKey key={k} label={k} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
