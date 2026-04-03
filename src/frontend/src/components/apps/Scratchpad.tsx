import { useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

export function Scratchpad() {
  const { data, set, loading } = useCanisterKV<string>(
    "decentos_scratchpad",
    "",
  );
  const [text, setText] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  // Sync from canister on load
  useEffect(() => {
    if (!loading && !initializedRef.current) {
      initializedRef.current = true;
      setText(data);
    }
  }, [loading, data]);

  const handleChange = (value: string) => {
    setText(value);
    setSaveStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      set(value);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
  };

  if (loading)
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{ background: "rgba(11,15,18,0.6)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );

  return (
    <div
      className="flex flex-col h-full relative"
      style={{
        background: "rgba(11,15,18,0.6)",
        color: "rgba(220,235,240,0.9)",
      }}
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3 z-10">
        {saveStatus === "saving" && (
          <span
            data-ocid="scratchpad.loading_state"
            className="text-xs opacity-50"
          >
            Saving...
          </span>
        )}
        {saveStatus === "saved" && (
          <span
            data-ocid="scratchpad.success_state"
            className="text-xs"
            style={{ color: "rgba(6,182,212,0.8)" }}
          >
            Saved ✓
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        data-ocid="scratchpad.textarea"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start typing... auto-saves as you go."
        className="flex-1 w-full p-5 resize-none outline-none text-sm leading-relaxed"
        style={{
          background: "transparent",
          color: "rgba(220,235,240,0.9)",
          caretColor: "rgba(6,182,212,0.9)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
        spellCheck={false}
      />

      {/* Character count */}
      <div className="absolute bottom-3 right-3 text-xs opacity-30 pointer-events-none">
        {text.length.toLocaleString()} chars
      </div>
    </div>
  );
}
