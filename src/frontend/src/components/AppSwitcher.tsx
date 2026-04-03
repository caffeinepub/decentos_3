import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppIcon } from "../AppIcons";
import { useFocusContext, useOS } from "../context/OSContext";

interface AppSwitcherProps {
  onClose: () => void;
}

export function AppSwitcher({ onClose }: AppSwitcherProps) {
  const { windows, bringToFront, restoreWindow } = useOS();
  const { focusedWindowId } = useFocusContext();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Only show non-minimized + minimized open windows
  const openWindows = windows;

  // Find initial selection based on current focused window
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only on mount
  useEffect(() => {
    const idx = openWindows.findIndex((w) => w.id === focusedWindowId);
    // Start at next window (like macOS)
    const nextIdx = (idx + 1) % Math.max(openWindows.length, 1);
    setSelectedIndex(nextIdx);
  }, []);

  const switchToSelected = useCallback(
    (idx: number) => {
      const win = openWindows[idx];
      if (!win) return;
      if (win.minimized) restoreWindow(win.id);
      else bringToFront(win.id);
      onClose();
    },
    [openWindows, bringToFront, restoreWindow, onClose],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Tab") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          e.shiftKey
            ? (prev - 1 + openWindows.length) % openWindows.length
            : (prev + 1) % openWindows.length,
        );
        return;
      }
      if (e.key === "Enter") {
        switchToSelected(selectedIndex);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      // When Meta/Ctrl released, confirm selection
      if (e.key === "Meta" || e.key === "Control") {
        switchToSelected(selectedIndex);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [openWindows, selectedIndex, switchToSelected, onClose]);

  if (openWindows.length === 0) {
    onClose();
    return null;
  }

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 99998 }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      data-ocid="appswitcher.panel"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 8 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl"
        style={{
          background: "rgba(20,20,30,0.88)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.08)",
          minWidth: 280,
          maxWidth: "min(80vw, 640px)",
        }}
      >
        <div className="flex items-end gap-3 flex-wrap justify-center">
          {openWindows.map((win, idx) => (
            <button
              key={win.id}
              type="button"
              data-ocid={`appswitcher.item.${idx + 1}`}
              onClick={() => switchToSelected(idx)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className="flex flex-col items-center gap-1.5 transition-all duration-100 outline-none"
            >
              <div
                className="rounded-xl overflow-hidden transition-all duration-100"
                style={{
                  width: idx === selectedIndex ? 72 : 56,
                  height: idx === selectedIndex ? 72 : 56,
                  outline:
                    idx === selectedIndex
                      ? "2px solid rgba(var(--os-accent-r),var(--os-accent-g),var(--os-accent-b),0.8)"
                      : "2px solid transparent",
                  outlineOffset: 2,
                  opacity: win.minimized ? 0.55 : 1,
                }}
              >
                <AppIcon
                  appId={win.appId}
                  size={idx === selectedIndex ? 72 : 56}
                />
              </div>
              <span
                className="text-[10px] max-w-[80px] truncate text-center leading-tight"
                style={{
                  color:
                    idx === selectedIndex
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.5)",
                }}
              >
                {win.title}
              </span>
            </button>
          ))}
        </div>

        {openWindows[selectedIndex] && (
          <div
            className="text-[11px] font-medium"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {openWindows[selectedIndex].minimized ? "Minimized" : ""}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
