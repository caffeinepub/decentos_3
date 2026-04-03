import { FolderOpen, RefreshCw, Search, Settings, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppIcon } from "../AppIcons";
import type { DesktopFolder } from "../context/FolderContext";
import { useFolders } from "../context/FolderContext";
import { useFocusContext, useOS } from "../context/OSContext";
import { useInstalledApps } from "../hooks/useInstalledApps";
import { AppSwitcher } from "./AppSwitcher";
import { MenuBar } from "./MenuBar";
import { hasBeenOnboarded } from "./Onboarding";
import { OnboardingV2 } from "./OnboardingV2";
import { SetupChecklist } from "./SetupChecklist";
import { Spotlight } from "./Spotlight";
import { Taskbar, usePinnedApps } from "./Taskbar";
import { Window } from "./Window";

const CORE_DESKTOP_APPS = [
  {
    appId: "filemanager",
    title: "File Manager",
    icon: <AppIcon appId="filemanager" size={32} />,
    category: "System",
  },
  {
    appId: "appstore",
    title: "App Store",
    icon: <AppIcon appId="appstore" size={32} />,
    category: "System",
  },
  {
    appId: "terminal",
    title: "Terminal",
    icon: <AppIcon appId="terminal" size={32} />,
    category: "System",
  },
  {
    appId: "notes",
    title: "Notes",
    icon: <AppIcon appId="notes" size={32} />,
    category: "Productivity",
  },
  {
    appId: "wordprocessor",
    title: "WriteOS",
    icon: <AppIcon appId="wordprocessor" size={32} />,
    category: "Productivity",
  },
  {
    appId: "calendar",
    title: "Calendar",
    icon: <AppIcon appId="calendar" size={32} />,
    category: "Productivity",
  },
  {
    appId: "spreadsheet",
    title: "Spreadsheet",
    icon: <AppIcon appId="spreadsheet" size={32} />,
    category: "Productivity",
  },
  {
    appId: "codeeditor",
    title: "Code Editor",
    icon: <AppIcon appId="codeeditor" size={32} />,
    category: "Developer",
  },
  {
    appId: "calculator",
    title: "Calculator",
    icon: <AppIcon appId="calculator" size={32} />,
    category: "Utilities",
  },
  {
    appId: "browser",
    title: "Browser",
    icon: <AppIcon appId="browser" size={32} />,
    category: "Utilities",
  },
];

const MARKETPLACE_CATEGORY_MAP: Record<string, string> = {
  processmonitor: "System",
  texteditor: "Productivity",
  settings: "System",
  clipboard: "Utilities",
  pomodoro: "Productivity",
  drawing: "Media",
  taskmanager: "Productivity",
  passwordmanager: "Utilities",
  contactmanager: "Productivity",
  journal: "Productivity",
  budget: "Productivity",
  markdown: "Developer",
  converter: "Utilities",
  habittracker: "Productivity",
  bookmarks: "Utilities",
  planner: "Productivity",
  flashcards: "Productivity",
  recipes: "Productivity",
  mindmap: "Productivity",
  portfolio: "Utilities",
  timetracker: "Productivity",
  personalwiki: "Productivity",
  goaltracker: "Productivity",
  stickynotes: "Utilities",
  jsonformatter: "Developer",
  base64tool: "Developer",
  colorpicker: "Developer",
  regextester: "Developer",
  hashgenerator: "Developer",
  worldclock: "Utilities",
  baseconverter: "Developer",
  encryption: "Security",
  qrcode: "Utilities",
  loancalc: "Finance",
  sleeptracker: "Health",
  shortcuts: "System",
  personalfinance: "Finance",
  vocabnotes: "Productivity",
  moodtracker: "Productivity",
  codesnippets: "Developer",
  musicplayer: "Media",
  imageviewer: "Media",
  dashboard: "System",
  standup: "Productivity",
  habitpro: "Health",
  readinglist: "Productivity",
  dailylog: "Productivity",
  splitter: "Finance",
  personalcrm: "Productivity",
  financedashboard: "Finance",
  securenotes: "Security",
  watertracker: "Health",
  networth: "Finance",
  languagenotes: "Productivity",
  invoicegenerator: "Productivity",
  meetingnotes: "Productivity",
  kanban: "Productivity",
  markdowneditor: "Developer",
  habitcalendar: "Health",
  "photo-journal": "Health",
  "personal-dashboard": "Productivity",
  networkmonitor: "Developer",
  dreamjournal: "Health",
  passwordgen: "Developer",
  pomodorov2: "Productivity",
  filenotes: "Productivity",
  workout: "Health",
  apitester: "Developer",
  financialgoals: "Finance",
  habitstreaks: "Health",
  financecalc: "Finance",
  meetingplanner: "Productivity",
  aiwriting: "Productivity",
  expensereport: "Finance",
  mindcalendar: "Productivity",
  dailyjournal: "Productivity",
  budgetplanner: "Finance",
  systeminfo: "System",
};

// Category -> tile background color (vibrant iOS-style)
const CATEGORY_COLORS: Record<string, { bg: string; border: string }> = {
  System: {
    bg: "linear-gradient(145deg, #3b82f6, #2563eb)",
    border: "rgba(0,0,0,0.15)",
  },
  Productivity: {
    bg: "linear-gradient(145deg, #f59e0b, #d97706)",
    border: "rgba(0,0,0,0.15)",
  },
  Developer: {
    bg: "linear-gradient(145deg, #8b5cf6, #7c3aed)",
    border: "rgba(0,0,0,0.15)",
  },
  Health: {
    bg: "linear-gradient(145deg, #ef4444, #dc2626)",
    border: "rgba(0,0,0,0.15)",
  },
  Finance: {
    bg: "linear-gradient(145deg, #10b981, #059669)",
    border: "rgba(0,0,0,0.15)",
  },
  Utilities: {
    bg: "linear-gradient(145deg, #6366f1, #4f46e5)",
    border: "rgba(0,0,0,0.15)",
  },
  Security: {
    bg: "linear-gradient(145deg, #ef4444, #dc2626)",
    border: "rgba(0,0,0,0.15)",
  },
  Media: {
    bg: "linear-gradient(145deg, #ec4899, #db2777)",
    border: "rgba(0,0,0,0.15)",
  },
  Other: {
    bg: "linear-gradient(145deg, #64748b, #475569)",
    border: "rgba(0,0,0,0.15)",
  },
};

function getAppCategory(appId: string): string {
  const coreApp = CORE_DESKTOP_APPS.find((a) => a.appId === appId);
  if (coreApp) return coreApp.category ?? "System";
  return MARKETPLACE_CATEGORY_MAP[appId] ?? "Other";
}

function getCategoryColors(appId: string) {
  const cat = getAppCategory(appId);
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.Other;
}

const CORE_APP_IDS = new Set(CORE_DESKTOP_APPS.map((a) => a.appId));

interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
}

interface DesktopApp {
  appId: string;
  title: string;
  icon: React.ReactNode;
  category?: string;
}

const ICON_ORDER_KEY = "decentos_icon_order";
const DESKTOP_HIDDEN_KEY = "decentos_desktop_hidden";

function useDesktopHidden() {
  const [hidden, setHidden] = useState<Set<string>>(() => {
    try {
      const arr: string[] = JSON.parse(
        localStorage.getItem(DESKTOP_HIDDEN_KEY) ?? "[]",
      );
      return new Set(arr);
    } catch {
      return new Set();
    }
  });

  const hideApp = (appId: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.add(appId);
      localStorage.setItem(DESKTOP_HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const showApp = (appId: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.delete(appId);
      localStorage.setItem(DESKTOP_HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  return { hidden, hideApp, showApp };
}

interface FolderIconProps {
  folder: DesktopFolder;
  onOpen: (folder: DesktopFolder) => void;
}

const FolderIcon = React.memo(function FolderIcon({
  folder,
  onOpen,
}: FolderIconProps) {
  const previewIds = folder.appIds.slice(0, 4);
  return (
    <button
      key={folder.id}
      type="button"
      onClick={() => onOpen(folder)}
      data-ocid="desktop.folder.button"
      className="os-icon-button group"
    >
      <span
        className="flex items-center justify-center relative w-[34px] h-[34px] rounded-xl overflow-hidden"
        style={{
          background: "rgba(120, 120, 130, 0.35)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {previewIds.length === 0 ? (
          <FolderOpen
            style={{ width: 20, height: 20, color: "rgba(255,255,255,0.9)" }}
          />
        ) : (
          <span
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              padding: 4,
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            {[0, 1, 2, 3].map((idx) =>
              previewIds[idx] ? (
                <AppIcon
                  key={previewIds[idx]}
                  appId={previewIds[idx]}
                  size={12}
                />
              ) : (
                <span key={idx} style={{ width: 12, height: 12 }} />
              ),
            )}
          </span>
        )}
      </span>
      <span
        className="text-[10px] font-medium text-center leading-tight px-1 w-full"
        style={{
          color: "rgba(255, 255, 255, 0.92)",
          textShadow: "0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
      >
        {folder.name}
      </span>
    </button>
  );
});

const APP_DISPLAY_NAMES: Record<string, string> = {
  jsonformatter: "JSON Formatter",
  base64tool: "Base64 Tool",
  colorpicker: "Color Picker",
  regextester: "Regex Tester",
  hashgenerator: "Hash Generator",
  baseconverter: "Base Converter",
  difftool: "Diff Tool",
  codesnippets: "Code Snippets",
  loancalc: "Loan Calculator",
  splitter: "Expense Split",
  personalfinance: "Personal Finance",
  financedashboard: "Finance Dashboard",
  networth: "Net Worth",
  subscriptions: "Subscriptions",
  sleeptracker: "Sleep Tracker",
  watertracker: "Water Tracker",
  moodtracker: "Mood Tracker",
  habitpro: "Habit Pro",
  habitcalendar: "Habit Calendar",
  passwordmanager: "Password Manager",
  contactmanager: "Contact Manager",
  taskmanager: "Task Manager",
  processmonitor: "Process Monitor",
  wordprocessor: "WriteOS",
  markdowneditor: "Markdown Editor",
  networkmonitor: "Network Monitor",
  colorpalettegenerator: "Color Palette",
  markdownresume: "MD Resume",
  financialgoals: "Finance Goals",
  habitstreaks: "Habit Streaks",
  financecalc: "Finance Calc",
  meetingplanner: "Meeting Planner",
  systeminfo: "System Info",
};

interface FolderPopoverProps {
  folder: DesktopFolder;
  onClose: () => void;
  onLaunchApp: (appId: string, title: string) => void;
  onRemoveApp: (folderId: string, appId: string) => void;
}

function FolderPopover({
  folder,
  onClose,
  onLaunchApp,
  onRemoveApp,
}: FolderPopoverProps) {
  const appCount = folder.appIds.length;
  // Use 3 columns unless fewer than 3 items
  const cols = Math.min(appCount, 3);

  return (
    <div
      className="fixed inset-0 z-[99998] flex items-center justify-center"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="rounded-2xl p-4"
        aria-modal="true"
        aria-label={folder.name}
        style={{
          background: "var(--os-bg-window)",
          border: "1px solid var(--os-border-dock)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
          minWidth: 340,
          maxWidth: 420,
          width: "max-content",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="desktop.folder.modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Neutral white folder icon, not cyan */}
            <FolderOpen
              className="w-4 h-4"
              style={{ color: "var(--os-text-secondary)" }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--os-text-primary)" }}
            >
              {folder.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="desktop.folder.close_button"
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
            style={{ color: "var(--os-text-secondary)" }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* App grid */}
        {appCount === 0 ? (
          <div
            className="text-xs text-center py-6"
            style={{ color: "var(--os-text-muted)" }}
          >
            No apps in this folder
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: "10px",
              justifyItems: "center",
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            {folder.appIds.map((appId) => {
              const name =
                APP_DISPLAY_NAMES[appId] ??
                appId
                  .replace(/([a-z])([A-Z])/g, "$1 $2")
                  .replace(/^./, (s) => s.toUpperCase());
              const colors = getCategoryColors(appId);
              return (
                <div
                  key={appId}
                  className="flex flex-col items-center gap-1.5 group"
                  style={{ width: 80 }}
                >
                  {/* Icon tile with overflow visible for ✕ badge */}
                  <div className="relative" style={{ overflow: "visible" }}>
                    <button
                      type="button"
                      onClick={() => {
                        onLaunchApp(appId, name);
                        onClose();
                      }}
                      data-ocid="desktop.folder.item.button"
                      className="w-14 h-14 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <AppIcon appId={appId} size={24} />
                    </button>
                    {/* Remove badge — positioned outside tile */}
                    <button
                      type="button"
                      onClick={() => onRemoveApp(folder.id, appId)}
                      data-ocid="desktop.folder.delete_button"
                      className="absolute items-center justify-center hidden group-hover:flex transition-all"
                      style={{
                        top: -6,
                        right: -6,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "rgba(220,50,50,0.95)",
                        color: "var(--os-text-primary)",
                        zIndex: 50,
                        border: "1.5px solid var(--os-text-muted)",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                      }}
                      title="Remove from folder"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  {/* Label — 2 lines, no truncation */}
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--os-text-secondary)",
                      textAlign: "center",
                      lineHeight: 1.3,
                      wordBreak: "break-word",
                      hyphens: "auto",
                      width: "100%",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface DesktopIconGridProps {
  apps: DesktopApp[];
  folders: DesktopFolder[];
  openApp: (appId: string, title: string) => void;
  pin: (app: { appId: string; title: string; icon: string }) => void;
  unpin: (appId: string) => void;
  isPinned: (appId: string) => boolean;
  onRemoveFromFolder: (folderId: string, appId: string) => void;
  onHideApp: (appId: string) => void;
  onAddToFolder: (folderId: string, appId: string) => void;
  onCreateFolder: (name: string, appId: string) => void;
}

const DesktopIconGrid = React.memo(function DesktopIconGrid({
  apps,
  folders,
  openApp,
  pin,
  unpin,
  isPinned,
  onRemoveFromFolder,
  onHideApp,
  onAddToFolder,
  onCreateFolder,
}: DesktopIconGridProps) {
  const [openFolder, setOpenFolder] = React.useState<DesktopFolder | null>(
    null,
  );
  const MENUBAR_HEIGHT = "calc(1.75rem + env(safe-area-inset-top))";
  const TASKBAR_HEIGHT = "calc(3rem + env(safe-area-inset-bottom))";

  const [orderedApps, setOrderedApps] = useState<DesktopApp[]>(() => {
    try {
      const saved: string[] = JSON.parse(
        localStorage.getItem(ICON_ORDER_KEY) ?? "[]",
      );
      if (!saved.length) return apps;
      const map = new Map(apps.map((a) => [a.appId, a]));
      const sorted = saved
        .map((id) => map.get(id))
        .filter(Boolean) as DesktopApp[];
      const remaining = apps.filter((a) => !saved.includes(a.appId));
      return [...sorted, ...remaining];
    } catch {
      return apps;
    }
  });
  const [dragOver, setDragOver] = useState<string | null>(null);
  // Track the source app being dragged
  const dragSrcRef = useRef<string | null>(null);
  // Track whether a drag actually occurred to suppress the subsequent onClick
  const didDragRef = useRef(false);

  useEffect(() => {
    setOrderedApps((prev) => {
      const prevIds = new Set(prev.map((a) => a.appId));
      const newApps = apps.filter((a) => !prevIds.has(a.appId));
      const removedIds = new Set(apps.map((a) => a.appId));
      const filtered = prev.filter((a) => removedIds.has(a.appId));
      return [...filtered, ...newApps];
    });
  }, [apps]);

  const saveOrder = (ordered: DesktopApp[]) => {
    localStorage.setItem(
      ICON_ORDER_KEY,
      JSON.stringify(ordered.map((a) => a.appId)),
    );
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    appId: string,
  ) => {
    dragSrcRef.current = appId;
    didDragRef.current = true;
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (
    e: React.DragEvent<HTMLButtonElement>,
    appId: string,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(appId);
  };
  const handleDrop = (
    e: React.DragEvent<HTMLButtonElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    const srcId = dragSrcRef.current;
    if (!srcId || srcId === targetId) {
      setDragOver(null);
      return;
    }
    setOrderedApps((prev) => {
      const updated = [...prev];
      const srcIdx = updated.findIndex((a) => a.appId === srcId);
      const tgtIdx = updated.findIndex((a) => a.appId === targetId);
      if (srcIdx === -1 || tgtIdx === -1) return prev;
      const [removed] = updated.splice(srcIdx, 1);
      updated.splice(tgtIdx, 0, removed);
      saveOrder(updated);
      return updated;
    });
    setDragOver(null);
    dragSrcRef.current = null;
  };
  const handleDragEnd = () => {
    setDragOver(null);
    dragSrcRef.current = null;
    // didDragRef stays true — the browser fires onClick after dragend;
    // the onClick handler will consume and reset it.
  };

  const renderItems = useMemo(() => {
    const items: Array<
      | { type: "app"; app: DesktopApp }
      | { type: "folder"; folder: DesktopFolder }
    > = [];
    for (const app of orderedApps) {
      items.push({ type: "app", app });
    }
    for (const folder of folders) {
      items.push({ type: "folder", folder });
    }
    return items;
  }, [orderedApps, folders]);

  return (
    <>
      <div
        className="absolute overflow-y-auto"
        style={{
          top: MENUBAR_HEIGHT,
          left: 8,
          width: "calc(4 * 72px + 3 * 8px + 32px)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 72px)",
          gap: "12px 8px",
          padding: "16px 8px 8px",
          alignContent: "start",
          maxHeight: `calc(100dvh - ${MENUBAR_HEIGHT} - ${TASKBAR_HEIGHT} - 0.5rem)`,
        }}
        data-ocid="desktop.panel"
      >
        {renderItems.map((item) => {
          if (item.type === "folder") {
            return (
              <FolderIcon
                key={item.folder.id}
                folder={item.folder}
                onOpen={(f) => setOpenFolder(f)}
              />
            );
          }

          const { app } = item;
          return (
            <button
              key={app.appId}
              type="button"
              draggable
              onDragStart={(e) => handleDragStart(e, app.appId)}
              onDragOver={(e) => handleDragOver(e, app.appId)}
              onDrop={(e) => handleDrop(e, app.appId)}
              onDragEnd={handleDragEnd}
              onClick={() => {
                // Suppress the click that fires after a drag ends
                if (didDragRef.current) {
                  didDragRef.current = false;
                  return;
                }
                openApp(app.appId, app.title);
              }}
              style={{
                outline:
                  dragOver === app.appId
                    ? "2px solid rgba(147,197,253,0.6)"
                    : undefined,
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const pinned = isPinned(app.appId);
                const isDark =
                  document.documentElement.getAttribute("data-theme") !==
                  "light";
                const menuBg = isDark ? "var(--os-bg-app)" : "#fff";
                const menuBorder = isDark
                  ? "var(--os-text-muted)"
                  : "rgba(0,0,0,0.12)";
                const menuText = isDark
                  ? "var(--os-text-secondary)"
                  : "rgba(0,0,0,0.82)";
                const menuStyle = `position:fixed;z-index:999999;background:${menuBg};border:1px solid ${menuBorder};border-radius:10px;padding:4px;min-width:172px;box-shadow:0 12px 40px rgba(0,0,0,0.7);backdrop-filter:blur(16px);`;
                const btnStyle = `display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;color:${menuText};font-size:12px;cursor:pointer;border-radius:6px;text-align:left;`;
                const menuEl = document.createElement("div");
                menuEl.setAttribute("data-desktop-icon-menu", "true");
                menuEl.style.cssText = `${menuStyle}left:${e.clientX}px;top:${e.clientY}px;`;

                const showMain = () => {
                  menuEl.innerHTML = `
                    <button data-action="open" style="${btnStyle}">🚀 Open</button>
                    <button data-action="pin" style="${btnStyle}">${pinned ? "📌 Unpin from Taskbar" : "📌 Pin to Taskbar"}</button>
                    <button data-action="add-to-folder" style="${btnStyle}">📂 Add to Folder ▶</button>
                    <div style="height:1px;background:${menuBorder};margin:2px 0;"></div>
                    <button data-action="hide" style="${btnStyle}">👁 Hide from Desktop</button>
                  `;
                  attachListeners();
                };

                const showFolderList = () => {
                  const folderItems = folders
                    .map(
                      (f) =>
                        `<button data-action="add-folder-${f.id}" style="${btnStyle}">📁 ${f.name}</button>`,
                    )
                    .join("");
                  menuEl.innerHTML = `
                    <button data-action="back" style="${btnStyle}">← Back</button>
                    <div style="height:1px;background:${menuBorder};margin:2px 0;"></div>
                    ${folderItems}
                    <button data-action="new-folder" style="${btnStyle}">✚ New Folder…</button>
                  `;
                  attachListeners();
                };

                const attachListeners = () => {
                  menuEl.addEventListener(
                    "click",
                    (ev) => {
                      const btn = (ev.target as HTMLElement).closest(
                        "[data-action]",
                      ) as HTMLElement | null;
                      if (!btn) return;
                      const action = btn.dataset.action ?? "";
                      if (action === "open") {
                        openApp(app.appId, app.title);
                        cleanup();
                      } else if (action === "pin") {
                        if (isPinned(app.appId)) unpin(app.appId);
                        else
                          pin({
                            appId: app.appId,
                            title: app.title,
                            icon: "📌",
                          });
                        cleanup();
                      } else if (action === "add-to-folder") {
                        showFolderList();
                      } else if (action === "back") {
                        showMain();
                      } else if (action === "new-folder") {
                        const name = window.prompt("Folder name:");
                        if (name?.trim()) {
                          onCreateFolder(name.trim(), app.appId);
                        }
                        cleanup();
                      } else if (action === "hide") {
                        onHideApp(app.appId);
                        cleanup();
                      } else if (action.startsWith("add-folder-")) {
                        const fid = action.replace("add-folder-", "");
                        onAddToFolder(fid, app.appId);
                        cleanup();
                      }
                    },
                    { once: false },
                  );
                };

                const cleanup = () => {
                  if (document.body.contains(menuEl))
                    document.body.removeChild(menuEl);
                  document.removeEventListener("click", closeOnOutside);
                };

                showMain();
                document.body.appendChild(menuEl);

                const closeOnOutside = (ev: MouseEvent) => {
                  if (!menuEl.contains(ev.target as Node)) {
                    cleanup();
                  }
                };
                setTimeout(
                  () => document.addEventListener("click", closeOnOutside),
                  10,
                );
              }}
              data-ocid={`desktop.${app.appId}.button`}
              className="os-icon-button group"
            >
              <span className="flex items-center justify-center">
                {app.icon}
              </span>
              <span
                className="text-[10px] font-medium text-center leading-tight px-1 w-full"
                style={{
                  color: "rgba(255, 255, 255, 0.92)",
                  textShadow:
                    "0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  wordBreak: "break-word",
                  minHeight: "2.6rem",
                  lineHeight: "1.3",
                }}
              >
                {app.title}
              </span>
            </button>
          );
        })}
      </div>

      {openFolder && (
        <FolderPopover
          folder={openFolder}
          onClose={() => setOpenFolder(null)}
          onLaunchApp={openApp}
          onRemoveApp={(folderId, appId) => {
            onRemoveFromFolder(folderId, appId);
          }}
        />
      )}
    </>
  );
});

export function Desktop() {
  const {
    windows,
    openApp,
    wallpaper,
    session,
    setSession,
    closeWindow,
    minimizeWindow,
  } = useOS();
  const { folders, addFolder, addAppToFolder, removeAppFromFolder } =
    useFolders();
  const { hidden, hideApp } = useDesktopHidden();
  const { pin, unpin, isPinned } = usePinnedApps();
  const { installedApps } = useInstalledApps();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    visible: false,
  });
  const { focusedWindowId } = useFocusContext();
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !hasBeenOnboarded(),
  );
  const desktopRef = useRef<HTMLDivElement>(null);

  const dynamicInstalledApps = useMemo<DesktopApp[]>(
    () =>
      installedApps
        .filter((a) => !CORE_APP_IDS.has(a.appId))
        .map((a) => ({
          appId: a.appId,
          title: a.name,
          category: MARKETPLACE_CATEGORY_MAP[a.appId] ?? "Other",
          icon: <AppIcon appId={a.appId} size={30} />,
        })),
    [installedApps],
  );

  const allDesktopApps = useMemo<DesktopApp[]>(
    () =>
      [...CORE_DESKTOP_APPS, ...dynamicInstalledApps].filter(
        (a) => !hidden.has(a.appId),
      ),
    [dynamicInstalledApps, hidden],
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".os-window")) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (contextMenu.visible) {
      const handler = () => closeContextMenu();
      document.addEventListener("click", handler);
      document.addEventListener("contextmenu", handler);
      return () => {
        document.removeEventListener("click", handler);
        document.removeEventListener("contextmenu", handler);
      };
    }
  }, [contextMenu.visible, closeContextMenu]);

  const spotlightOpenRef = React.useRef(spotlightOpen);
  useEffect(() => {
    spotlightOpenRef.current = spotlightOpen;
  }, [spotlightOpen]);

  const focusedWindowIdRef = useRef(focusedWindowId);
  useEffect(() => {
    focusedWindowIdRef.current = focusedWindowId;
  }, [focusedWindowId]);
  const appSwitcherOpenRef = useRef(appSwitcherOpen);
  useEffect(() => {
    appSwitcherOpenRef.current = appSwitcherOpen;
  }, [appSwitcherOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        setSpotlightOpen((prev) => !prev);
        return;
      }
      if (e.key === "Escape" && spotlightOpenRef.current) {
        setSpotlightOpen(false);
        return;
      }
      // Cmd+W — close focused window
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === "w" &&
        !appSwitcherOpenRef.current
      ) {
        e.preventDefault();
        const id = focusedWindowIdRef.current;
        if (id) closeWindow(id);
        return;
      }
      // Cmd+M — minimize focused window
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === "m" &&
        !appSwitcherOpenRef.current
      ) {
        e.preventDefault();
        const id = focusedWindowIdRef.current;
        if (id) minimizeWindow(id);
        return;
      }
      // Cmd+Tab — app switcher
      if ((e.metaKey || e.ctrlKey) && e.key === "Tab") {
        e.preventDefault();
        if (!appSwitcherOpenRef.current) setAppSwitcherOpen(true);
        return;
      }
    };
    const handleSpotlightEvent = () => setSpotlightOpen(true);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("decentos:spotlight", handleSpotlightEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("decentos:spotlight", handleSpotlightEvent);
    };
  }, [closeWindow, minimizeWindow]);

  const handleGroupByCategory = useCallback(() => {
    const appsByCategory = new Map<string, string[]>();
    for (const app of allDesktopApps) {
      const cat = getAppCategory(app.appId);
      if (!appsByCategory.has(cat)) appsByCategory.set(cat, []);
      appsByCategory.get(cat)!.push(app.appId);
    }
    for (const [cat, appIds] of appsByCategory.entries()) {
      if (appIds.length < 2) continue;
      const existing = folders.find((f) => f.name === cat);
      if (existing) {
        for (const appId of appIds) addAppToFolder(existing.id, appId);
      } else {
        addFolder(cat, cat);
        // Re-check: folder just added — add apps after state settles via event
        setTimeout(() => {
          const updated = JSON.parse(
            localStorage.getItem("decentos_folders") ?? "[]",
          ) as import("../context/FolderContext").DesktopFolder[];
          const newFolder = updated.find(
            (f: import("../context/FolderContext").DesktopFolder) =>
              f.name === cat,
          );
          if (newFolder) {
            for (const appId of appIds) {
              const item = updated.find(
                (f: import("../context/FolderContext").DesktopFolder) =>
                  f.id === newFolder.id,
              );
              if (item && !item.appIds.includes(appId)) {
                addAppToFolder(newFolder.id, appId);
              }
            }
          }
        }, 50);
      }
    }
  }, [allDesktopApps, folders, addFolder, addAppToFolder]);

  const contextMenuItems = [
    {
      label: "Launch App",
      icon: <Search className="w-3.5 h-3.5" />,
      action: () => setSpotlightOpen(true),
    },
    {
      label: "Group by Category",
      icon: <RefreshCw className="w-3.5 h-3.5" />,
      action: handleGroupByCategory,
    },
    {
      label: "Change Wallpaper",
      icon: <Settings className="w-3.5 h-3.5" />,
      action: () => openApp("settings", "Settings"),
    },
    {
      label: "Refresh Desktop",
      icon: <RefreshCw className="w-3.5 h-3.5" />,
      action: () => window.location.reload(),
    },
  ];

  if (showOnboarding) {
    return (
      <OnboardingV2
        onDone={(_userType, appId, displayName) => {
          setShowOnboarding(false);
          if (displayName && session) {
            setSession({ ...session, displayName });
          }
          if (appId) {
            const appTitleMap: Record<string, string> = {
              notes: "Notes",
              codeeditor: "Code Editor",
              terminal: "Terminal",
            };
            openApp(appId, appTitleMap[appId] ?? appId);
          }
        }}
      />
    );
  }

  return (
    <div
      ref={desktopRef}
      className="relative w-full h-full overflow-hidden"
      style={
        wallpaper.startsWith("data:")
          ? {
              backgroundImage: `url(${wallpaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: wallpaper }
      }
      onContextMenu={handleContextMenu}
    >
      <MenuBar />

      <DesktopIconGrid
        apps={allDesktopApps}
        folders={folders}
        openApp={openApp}
        pin={pin}
        unpin={unpin}
        isPinned={isPinned}
        onRemoveFromFolder={removeAppFromFolder}
        onHideApp={hideApp}
        onAddToFolder={addAppToFolder}
        onCreateFolder={(name, appId) => {
          addFolder(name, getAppCategory(appId));
          setTimeout(() => {
            const updated = JSON.parse(
              localStorage.getItem("decentos_folders") ?? "[]",
            ) as import("../context/FolderContext").DesktopFolder[];
            const newF = updated.find(
              (f: import("../context/FolderContext").DesktopFolder) =>
                f.name === name,
            );
            if (newF) addAppToFolder(newF.id, appId);
          }, 50);
        }}
      />

      {windows.map((win) => (
        <Window key={win.id} window={win} />
      ))}

      {contextMenu.visible && (
        <div
          className="absolute z-[9998] rounded-xl overflow-hidden"
          style={{
            left: Math.min(
              contextMenu.x,
              document.documentElement.clientWidth - 180,
            ),
            top: Math.min(
              contextMenu.y,
              document.documentElement.clientHeight - 120,
            ),
            background: "var(--os-bg-window)",
            border: "1px solid var(--os-border-dock)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            minWidth: 168,
          }}
          data-ocid="desktop.context_menu"
        >
          {contextMenuItems.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                item.action();
                closeContextMenu();
              }}
              data-ocid={`desktop.context_menu.item.${i + 1}`}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground/75 hover:text-foreground transition-colors text-left"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--os-border-subtle)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
              }}
            >
              <span className="text-foreground/50 flex-shrink-0">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {spotlightOpen && <Spotlight onClose={() => setSpotlightOpen(false)} />}

      <AnimatePresence>
        {appSwitcherOpen && (
          <AppSwitcher onClose={() => setAppSwitcherOpen(false)} />
        )}
      </AnimatePresence>

      <SetupChecklist />

      <Taskbar />
    </div>
  );
}
