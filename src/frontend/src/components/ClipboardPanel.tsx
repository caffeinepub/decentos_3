import { Clipboard, Copy, Pin, PinOff, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useClipboard } from "../context/ClipboardContext";

interface ClipboardPanelProps {
  open: boolean;
  onClose: () => void;
}

function timeAgo(ts: number) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function ClipboardPanel({ open, onClose }: ClipboardPanelProps) {
  const { clips, pinClip, unpinClip, removeClip, clearHistory, copyClip } =
    useClipboard();

  const handleCopy = (id: string, text: string) => {
    copyClip(id);
    toast.success("Copied to clipboard");
    void text;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute bottom-14 right-3 w-80 max-h-[460px] flex flex-col rounded-xl overflow-hidden z-[10000]"
          style={{
            background: "rgba(11,18,22,0.96)",
            border: "1px solid rgba(99,102,241,0.25)",
            boxShadow:
              "0 0 40px rgba(99,102,241,0.08), 0 20px 60px rgba(0,0,0,0.7)",
            backdropFilter: "blur(20px)",
          }}
          data-ocid="clipboard.panel"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0"
            style={{
              borderColor: "rgba(99,102,241,0.15)",
              background: "rgba(18,32,38,0.6)",
            }}
          >
            <div className="flex items-center gap-2">
              <Clipboard
                className="w-4 h-4"
                style={{ color: "rgba(99,102,241,0.9)" }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "rgba(99,102,241,0.9)" }}
              >
                Clipboard
              </span>
              {clips.length > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    color: "rgba(99,102,241,0.7)",
                  }}
                >
                  {clips.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {clips.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  data-ocid="clipboard.delete_button"
                  className="text-[10px] px-2 py-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                data-ocid="clipboard.close_button"
                className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            {clips.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-32 gap-2"
                data-ocid="clipboard.empty_state"
              >
                <Clipboard className="w-8 h-8 text-muted-foreground/20" />
                <p className="text-xs text-muted-foreground/40">
                  Nothing copied yet
                </p>
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-1">
                {clips.map((clip, i) => (
                  <div
                    key={clip.id}
                    data-ocid={`clipboard.item.${i + 1}`}
                    className="group rounded-lg px-3 py-2 transition-colors cursor-default"
                    style={{
                      background: clip.pinned
                        ? "rgba(99,102,241,0.05)"
                        : "rgba(255,255,255,0.02)",
                      border: clip.pinned
                        ? "1px solid rgba(99,102,241,0.15)"
                        : "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-foreground/80 flex-1 min-w-0 line-clamp-2 font-mono leading-relaxed">
                        {clip.text}
                      </p>
                      <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleCopy(clip.id, clip.text)}
                          data-ocid={`clipboard.secondary_button.${i + 1}`}
                          className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            clip.pinned ? unpinClip(clip.id) : pinClip(clip.id)
                          }
                          data-ocid={`clipboard.toggle.${i + 1}`}
                          className="w-6 h-6 flex items-center justify-center rounded transition-colors"
                          style={
                            clip.pinned ? { color: "rgba(99,102,241,0.8)" } : {}
                          }
                          title={clip.pinned ? "Unpin" : "Pin"}
                        >
                          {clip.pinned ? (
                            <PinOff className="w-3 h-3" />
                          ) : (
                            <Pin className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeClip(clip.id)}
                          data-ocid={`clipboard.delete_button.${i + 1}`}
                          className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {clip.pinned && (
                        <Pin
                          className="w-2.5 h-2.5"
                          style={{ color: "rgba(99,102,241,0.6)" }}
                        />
                      )}
                      <span className="text-[10px] text-muted-foreground/40">
                        {timeAgo(clip.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
