import { FileText } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppIcon } from "../AppIcons";
import { useOS } from "../context/OSContext";

const RECENT_KEY = "decentos_recent_apps";
const MAX_RECENT = 5;

function getRecentApps(): SpotlightApp[] {
  try {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as {
      appId: string;
      title: string;
      icon: string;
    }[];
    return stored
      .map(
        (r) =>
          SPOTLIGHT_APPS.find((a) => a.appId === r.appId) ??
          (r as SpotlightApp),
      )
      .filter(Boolean)
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

function trackRecentApp(app: SpotlightApp) {
  try {
    const existing = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as {
      appId: string;
    }[];
    const filtered = existing.filter((a) => a.appId !== app.appId);
    const updated = [
      { appId: app.appId, title: app.title, icon: app.icon },
      ...filtered,
    ].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {}
}

interface SpotlightApp {
  appId: string;
  title: string;
  icon: string;
}

const SPOTLIGHT_APPS: SpotlightApp[] = [
  { appId: "filemanager", title: "File Manager", icon: "folder" },
  { appId: "terminal", title: "Terminal", icon: "terminal" },
  { appId: "notes", title: "Notes", icon: "notes" },
  { appId: "appstore", title: "App Store", icon: "appstore" },
  { appId: "codeeditor", title: "Code Editor", icon: "codeeditor" },
  { appId: "processmonitor", title: "Process Monitor", icon: "processmonitor" },
  { appId: "calculator", title: "Calculator", icon: "calculator" },
  { appId: "texteditor", title: "Text Editor", icon: "texteditor" },
  { appId: "wordprocessor", title: "WriteOS", icon: "wordprocessor" },
  { appId: "browser", title: "Browser", icon: "browser" },
  { appId: "musicplayer", title: "Music Player", icon: "musicplayer" },
  { appId: "imageviewer", title: "Image Viewer", icon: "imageviewer" },
  { appId: "dashboard", title: "Dashboard", icon: "dashboard" },
  { appId: "spreadsheet", title: "Spreadsheet", icon: "spreadsheet" },
  { appId: "calendar", title: "Calendar", icon: "calendar" },
  { appId: "passwordmanager", title: "Passwords", icon: "passwordmanager" },
  { appId: "drawing", title: "Drawing", icon: "drawing" },
  { appId: "taskmanager", title: "Task Manager", icon: "taskmanager" },
  { appId: "settings", title: "Settings", icon: "settings" },
  { appId: "pomodoro", title: "Pomodoro", icon: "pomodoro" },
  { appId: "timetracker", title: "Time Tracker", icon: "timetracker" },
  { appId: "personalwiki", title: "Personal Wiki", icon: "personalwiki" },
  { appId: "goaltracker", title: "Goal Tracker", icon: "goaltracker" },
  { appId: "stickynotes", title: "Sticky Notes", icon: "stickynotes" },
  { appId: "jsonformatter", title: "JSON Formatter", icon: "jsonformatter" },
  { appId: "base64tool", title: "Base64 Tool", icon: "base64tool" },
  { appId: "colorpicker", title: "Color Picker", icon: "colorpicker" },
  { appId: "regextester", title: "Regex Tester", icon: "regextester" },
  { appId: "hashgenerator", title: "Hash Generator", icon: "hashgenerator" },
];

function fuzzyMatch(
  query: string,
  text: string,
): { match: boolean; indices: number[] } {
  if (!query) return { match: true, indices: [] };
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const indices: number[] = [];
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) {
      indices.push(i);
      qi++;
    }
  }
  return { match: qi === q.length, indices };
}

function HighlightedText({
  text,
  indices,
}: { text: string; indices: number[] }) {
  const set = new Set(indices);
  const parts: { char: string; highlight: boolean; key: string }[] = text
    .split("")
    .map((char, i) => ({ char, highlight: set.has(i), key: `c${i}` }));

  return (
    <span>
      {parts.map((part) =>
        part.highlight ? (
          <span
            key={part.key}
            style={{ color: "rgba(99,102,241,1)", fontWeight: 700 }}
          >
            {part.char}
          </span>
        ) : (
          <span key={part.key}>{part.char}</span>
        ),
      )}
    </span>
  );
}

interface NoteMatch {
  id: string;
  title: string;
  content: string;
}

function searchNotes(query: string): NoteMatch[] {
  if (query.length < 2) return [];
  try {
    const raw = localStorage.getItem("decentos_notes");
    if (!raw) return [];
    const notes = JSON.parse(raw) as {
      id: string;
      title: string;
      content: string;
    }[];
    return notes
      .filter(
        (n) =>
          n.title?.toLowerCase().includes(query.toLowerCase()) ||
          n.content?.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 3);
  } catch {
    return [];
  }
}

interface SpotlightProps {
  onClose: () => void;
}

export function Spotlight({ onClose }: SpotlightProps) {
  const { openApp } = useOS();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentApps, setRecentApps] = useState<SpotlightApp[]>(() =>
    getRecentApps(),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const noteResults = searchNotes(query);

  const results = SPOTLIGHT_APPS.map((app) => {
    const byId = fuzzyMatch(query, app.appId);
    const byTitle = fuzzyMatch(query, app.title);
    if (byTitle.match)
      return { app, indices: byTitle.indices, score: byTitle.indices.length };
    if (byId.match)
      return { app, indices: byId.indices, score: byId.indices.length };
    return null;
  })
    .filter(Boolean)
    .slice(0, 6) as { app: SpotlightApp; indices: number[]; score: number }[];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setSelectedIndex(0);
    },
    [],
  );

  const launch = useCallback(
    (app: SpotlightApp) => {
      trackRecentApp(app);
      setRecentApps(getRecentApps());
      openApp(app.appId, app.title);
      onClose();
    },
    [openApp, onClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (results[selectedIndex]) {
          launch(results[selectedIndex].app);
        }
      }
    },
    [results, selectedIndex, launch, onClose],
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[99999] flex items-start justify-center"
        style={{
          paddingTop: "20vh",
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
        data-ocid="spotlight.modal"
      >
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(540px, 90vw)",
            background: "rgba(10,18,24,0.95)",
            border: "1px solid rgba(99,102,241,0.35)",
            borderRadius: 16,
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Search input */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              borderBottom:
                results.length > 0 ? "1px solid rgba(99,102,241,0.12)" : "none",
            }}
          >
            <AppIcon appId="regextester" size={16} />
            <input
              ref={inputRef}
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              placeholder="Search apps..."
              data-ocid="spotlight.search_input"
              className="flex-1 bg-transparent outline-none text-sm font-mono"
              style={{
                color: "rgba(255,255,255,0.9)",
                caretColor: "rgba(99,102,241,0.9)",
                borderBottom: "2px solid rgba(99,102,241,0.5)",
                paddingBottom: 4,
              }}
            />
            <kbd
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "rgba(99,102,241,0.5)",
              }}
            >
              ESC
            </kbd>
          </div>

          {/* Recent Apps (shown when query is empty) */}
          {!query && recentApps.length > 0 && (
            <div
              className="px-3 py-2"
              style={{ borderBottom: results.length > 0 ? "none" : "none" }}
            >
              <p
                className="text-[10px] font-mono uppercase tracking-widest mb-2"
                style={{ color: "rgba(99,102,241,0.4)" }}
              >
                Recent
              </p>
              <div className="flex flex-wrap gap-1.5">
                {recentApps.map((app) => (
                  <button
                    key={app.appId}
                    type="button"
                    onClick={() => launch(app)}
                    data-ocid="spotlight.recent.button"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:scale-[1.03]"
                    style={{
                      background: "rgba(99,102,241,0.06)",
                      border: "1px solid rgba(99,102,241,0.18)",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    <AppIcon appId={app.appId} size={14} />
                    <span>{app.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="py-1">
              {results.map((result, i) => (
                <button
                  key={result.app.appId}
                  type="button"
                  onClick={() => launch(result.app)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  data-ocid={`spotlight.item.${i + 1}`}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  style={{
                    background:
                      i === selectedIndex
                        ? "rgba(99,102,241,0.08)"
                        : "transparent",
                    borderLeft:
                      i === selectedIndex
                        ? "2px solid rgba(99,102,241,0.7)"
                        : "2px solid transparent",
                  }}
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <AppIcon appId={result.app.appId} size={18} />
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    <HighlightedText
                      text={result.app.title}
                      indices={result.indices}
                    />
                  </span>
                  {i === selectedIndex && (
                    <span
                      className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        color: "rgba(99,102,241,0.5)",
                      }}
                    >
                      ↵ open
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Notes results */}
          {query.length >= 2 && noteResults.length > 0 && (
            <div>
              <div
                className="px-4 py-1.5 text-[9px] font-semibold tracking-widest uppercase"
                style={{
                  color: "rgba(99,102,241,0.45)",
                  borderBottom: "1px solid rgba(99,102,241,0.08)",
                }}
              >
                Notes
              </div>
              {noteResults.map((note, i) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => {
                    openApp("notes", "Notes");
                    onClose();
                  }}
                  data-ocid={`spotlight.note.item.${i + 1}`}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  style={{ background: "transparent" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(99,102,241,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <FileText
                      className="w-4 h-4"
                      style={{ color: "rgba(99,102,241,0.6)" }}
                    />
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {note.title || "Untitled"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {query && results.length === 0 && noteResults.length === 0 && (
            <div
              className="px-4 py-6 text-center text-sm"
              style={{ color: "rgba(255,255,255,0.3)" }}
              data-ocid="spotlight.empty_state"
            >
              No apps found for &ldquo;{query}&rdquo;
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
