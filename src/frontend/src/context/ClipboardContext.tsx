import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ClipItem {
  id: string;
  text: string;
  timestamp: number;
  pinned: boolean;
}

interface ClipboardContextValue {
  clips: ClipItem[];
  pinClip: (id: string) => void;
  unpinClip: (id: string) => void;
  removeClip: (id: string) => void;
  clearHistory: () => void;
  copyClip: (id: string) => void;
  addClip: (text: string) => void;
}

const ClipboardContext = createContext<ClipboardContextValue | null>(null);

export function ClipboardProvider({ children }: { children: React.ReactNode }) {
  const [clips, setClips] = useState<ClipItem[]>([]);
  const lastTextRef = useRef("");

  const addClip = useCallback((text: string) => {
    if (!text.trim() || text === lastTextRef.current) return;
    lastTextRef.current = text;
    setClips((prev) => {
      const newItem: ClipItem = {
        id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        timestamp: Date.now(),
        pinned: false,
      };
      const filtered = prev.filter((c) => c.text !== text);
      const updated = [newItem, ...filtered];
      return updated.slice(0, 20);
    });
  }, []);

  useEffect(() => {
    const handleCopy = () => {
      // Small delay to let clipboard actually be set
      setTimeout(() => {
        navigator.clipboard
          .readText()
          .then((text) => {
            if (text) addClip(text);
          })
          .catch(() => {
            /* permission denied */
          });
      }, 100);
    };
    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, [addClip]);

  const pinClip = useCallback((id: string) => {
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: true } : c)),
    );
  }, []);

  const unpinClip = useCallback((id: string) => {
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: false } : c)),
    );
  }, []);

  const removeClip = useCallback((id: string) => {
    setClips((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setClips((prev) => prev.filter((c) => c.pinned));
  }, []);

  const copyClip = useCallback(
    (id: string) => {
      const clip = clips.find((c) => c.id === id);
      if (clip) {
        navigator.clipboard.writeText(clip.text).catch(() => {});
        lastTextRef.current = clip.text;
      }
    },
    [clips],
  );

  const sortedClips = [
    ...clips.filter((c) => c.pinned),
    ...clips.filter((c) => !c.pinned),
  ];

  return (
    <ClipboardContext.Provider
      value={{
        clips: sortedClips,
        pinClip,
        unpinClip,
        removeClip,
        clearHistory,
        copyClip,
        addClip,
      }}
    >
      {children}
    </ClipboardContext.Provider>
  );
}

export function useClipboard() {
  const ctx = useContext(ClipboardContext);
  if (!ctx)
    throw new Error("useClipboard must be used within ClipboardProvider");
  return ctx;
}
