import {
  Clipboard,
  Cpu,
  FileText,
  Folder,
  LogOut,
  Pin,
  Settings,
  Store,
  Terminal as TerminalIcon,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { useClipboard } from "../context/ClipboardContext";
import { useOS } from "../context/OSContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCyclesBalance } from "../hooks/useQueries";
import { ClipboardPanel } from "./ClipboardPanel";
import { DecentOSLogo } from "./DecentOSLogo";

const APP_ICONS: Record<string, React.ReactNode> = {
  filemanager: <Folder className="w-4 h-4" />,
  notes: <FileText className="w-4 h-4" />,
  appstore: <Store className="w-4 h-4" />,
  terminal: <TerminalIcon className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
};

function formatCycles(cycles: bigint): string {
  const n = Number(cycles);
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}G`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return `${n}`;
}

function truncateTitle(title: string, max = 10): string {
  return title.length > max ? `${title.slice(0, max)}…` : title;
}

const PINNED_KEY = "decentos_pinned_apps";

interface PinnedApp {
  appId: string;
  title: string;
  icon: string;
}

function getPinnedApps(): PinnedApp[] {
  try {
    return JSON.parse(localStorage.getItem(PINNED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function savePinnedApps(apps: PinnedApp[]) {
  localStorage.setItem(PINNED_KEY, JSON.stringify(apps));
}

const APP_EMOJIS: Record<string, string> = {
  filemanager: "📁",
  terminal: "💻",
  notes: "📝",
  appstore: "🏪",
  codeeditor: "⌨️",
  processmonitor: "📊",
  calculator: "🔢",
  texteditor: "📄",
  wordprocessor: "📖",
  browser: "🌐",
  musicplayer: "🎵",
  imageviewer: "🖼️",
  dashboard: "📈",
  spreadsheet: "📊",
  calendar: "📅",
  passwordmanager: "🔐",
  drawing: "🎨",
  taskmanager: "✅",
  pomodoro: "⏱️",
  contactmanager: "👤",
  journal: "📓",
  budget: "💰",
  markdown: "📝",
  converter: "🔄",
  habittracker: "✅",
  bookmarks: "🔖",
  planner: "📅",
  flashcards: "🃏",
  recipes: "🍳",
  mindmap: "🧠",
  portfolio: "📈",
  timetracker: "⏱️",
  personalwiki: "📚",
  goaltracker: "🎯",
  stickynotes: "📌",
  settings: "⚙️",
};

export function usePinnedApps() {
  const [pinned, setPinned] = useState<PinnedApp[]>(getPinnedApps);
  const pin = (app: PinnedApp) => {
    setPinned((prev) => {
      if (prev.some((p) => p.appId === app.appId)) return prev;
      const next = [...prev, app];
      savePinnedApps(next);
      return next;
    });
  };
  const unpin = (appId: string) => {
    setPinned((prev) => {
      const next = prev.filter((p) => p.appId !== appId);
      savePinnedApps(next);
      return next;
    });
  };
  const isPinned = (appId: string) => pinned.some((p) => p.appId === appId);
  return { pinned, pin, unpin, isPinned };
}

const DOCK_SIZE_PX: Record<string, number> = {
  small: 36,
  medium: 44,
  large: 56,
};

// ── Dock icon button ────────────────────────────────────────────────────────────────────────────────────
function DockBtn({
  onClick,
  onContextMenu,
  title,
  active,
  minimized,
  "data-ocid": ocid,
  children,
  sizePx = 40,
  magnify = true,
  distFromHovered = Number.POSITIVE_INFINITY,
}: {
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  title?: string;
  active?: boolean;
  minimized?: boolean;
  "data-ocid"?: string;
  children: React.ReactNode;
  sizePx?: number;
  magnify?: boolean;
  distFromHovered?: number;
}) {
  const [hovered, setHovered] = useState(false);

  // Wave magnification: center=1.4x, adjacent=1.25x, next=1.1x, rest=1x
  const waveScale = magnify
    ? distFromHovered === 0
      ? 1.4
      : distFromHovered === 1
        ? 1.25
        : distFromHovered === 2
          ? 1.1
          : 1
    : 1;

  const waveY = magnify
    ? distFromHovered === 0
      ? -6
      : distFromHovered === 1
        ? -3
        : distFromHovered === 2
          ? -1
          : 0
    : 0;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onContextMenu={onContextMenu}
      data-ocid={ocid}
      className="relative flex items-center justify-center rounded-xl flex-shrink-0"
      animate={{
        scale: waveScale,
        y: waveY,
        backgroundColor: hovered
          ? "var(--os-border-dock)"
          : active
            ? "var(--os-border-subtle)"
            : "transparent",
        color:
          hovered || distFromHovered === 0
            ? "var(--os-text-primary)"
            : active
              ? "var(--os-text-primary)"
              : "var(--os-text-secondary)",
      }}
      whileTap={{ scale: waveScale * 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        width: sizePx,
        height: sizePx,
        originY: 1,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {children}
      {/* Hover tooltip */}
      {title && hovered && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="absolute pointer-events-none whitespace-nowrap text-[11px] font-medium px-2 py-0.5 rounded-md"
          style={{
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--os-bg-elevated)",
            border: "1px solid var(--os-border-subtle)",
            color: "var(--os-text-primary)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
          }}
        >
          {title}
        </motion.span>
      )}
      {/* Active dot */}
      {active && (
        <span
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 5,
            height: 5,
            background: "var(--os-accent-color-border)",
          }}
        />
      )}
      {/* Minimized dot (dashed style) */}
      {minimized && !active && (
        <span
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 5,
            height: 5,
            background: "transparent",
            border: "1.5px solid rgba(255,255,255,0.15)",
            opacity: 0.7,
          }}
        />
      )}
    </motion.button>
  );
}

// ── Window chip ──
function WindowChip({
  window: w,
  onToggle,
}: {
  window: { id: string; appId: string; title: string; minimized: boolean };
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onToggle}
      data-ocid="taskbar.window.button"
      title={w.title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center gap-1.5 flex-shrink-0 px-2.5 h-7 rounded-lg text-[11px] font-medium transition-all"
      style={{
        maxWidth: 110,
        color: w.minimized
          ? "var(--os-text-muted)"
          : hovered
            ? "var(--os-text-primary)"
            : "var(--os-text-secondary)",
        background: w.minimized
          ? "var(--os-border-subtle)"
          : hovered
            ? "var(--os-border-dock)"
            : "var(--os-border-subtle)",
        border: "1px solid var(--os-border-subtle)",
      }}
    >
      <span className="opacity-60">
        {APP_ICONS[w.appId] ?? <Cpu className="w-3 h-3" />}
      </span>
      <span className="truncate">{truncateTitle(w.title)}</span>
      {!w.minimized && (
        <span
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: "var(--os-text-secondary)" }}
        />
      )}
    </button>
  );
}

export function Taskbar() {
  const {
    session,
    windows,
    restoreWindow,
    minimizeWindow,
    openApp,
    dockPosition,
    dockSize,
    dockMagnification,
  } = useOS();
  const { data: cycles } = useCyclesBalance();
  const { clips } = useClipboard();
  const { pinned, unpin } = usePinnedApps();
  const { clear } = useInternetIdentity();
  const [clipboardOpen, setClipboardOpen] = useState(false);

  const hasPinned = clips.some((c) => c.pinned);
  const sizePx = DOCK_SIZE_PX[dockSize] ?? 44;
  const [hoveredDockIndex, setHoveredDockIndex] = useState<number | null>(null);
  const isVertical = dockPosition === "left" || dockPosition === "right";

  const cyclesDisplay =
    cycles !== undefined
      ? formatCycles(cycles)
      : session?.cyclesBalance !== undefined
        ? formatCycles(session.cyclesBalance)
        : "—";

  const principalSnippet = session?.principal
    ? `${session.principal.slice(0, 8)}…`
    : "";

  const DOCK_APPS = [
    { appId: "filemanager", title: "File Manager" },
    { appId: "terminal", title: "Terminal" },
    { appId: "notes", title: "Notes" },
    { appId: "appstore", title: "App Store" },
    { appId: "settings", title: "Settings" },
  ];

  const wrapperClass = `os-taskbar-wrapper${
    dockPosition === "left"
      ? " dock-left"
      : dockPosition === "right"
        ? " dock-right"
        : ""
  }`;

  const dockFlexDir = isVertical ? "flex-col" : "flex-row";
  const dockHeight = isVertical ? undefined : 56;
  const dockWidth = isVertical ? sizePx + 16 : undefined;
  const dockPad = isVertical ? "py-3" : "px-3";
  const dividerClass = isVertical ? "h-px w-6 my-1" : "w-px h-6 mx-1";

  useEffect(() => {
    const handleClickOutside = () => setClipboardOpen(false);
    if (clipboardOpen) {
      setTimeout(
        () => document.addEventListener("click", handleClickOutside),
        10,
      );
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [clipboardOpen]);

  return (
    <div className={wrapperClass} data-ocid="taskbar.panel">
      {/* ── Main floating dock pill ── */}
      <div
        className={`os-taskbar flex ${dockFlexDir} items-center gap-1 ${dockPad}`}
        style={{ height: dockHeight, width: dockWidth }}
      >
        {/* Logo */}
        <button
          type="button"
          data-ocid="taskbar.link"
          title="DecentOS"
          className="flex items-center justify-center mr-1"
          style={{ flexShrink: 0 }}
          onClick={() => {}}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.1)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              flexShrink: 0,
            }}
          >
            <DecentOSLogo size={22} />
          </span>
        </button>

        {/* Divider */}
        <div
          className={dividerClass}
          style={{ background: "var(--os-border-subtle)", flexShrink: 0 }}
        />

        {/* Pinned apps */}
        {pinned.length > 0 && (
          <>
            {pinned.map((app) => (
              <DockBtn
                key={app.appId}
                onClick={() => openApp(app.appId, app.title)}
                data-ocid="taskbar.pinned.button"
                title={app.title}
                sizePx={sizePx}
                magnify={dockMagnification}
                onContextMenu={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
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
                  const btnStyle = `display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;color:${menuText};font-size:12px;cursor:pointer;border-radius:6px;text-align:left;`;
                  const menuEl = document.createElement("div");
                  menuEl.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;z-index:999999;background:${menuBg};border:1px solid ${menuBorder};border-radius:10px;padding:4px;min-width:160px;box-shadow:0 12px 40px rgba(0,0,0,0.7);backdrop-filter:blur(16px);`;
                  menuEl.innerHTML = `<button data-action="open" style="${btnStyle}">🚀 Open</button><button data-action="remove" style="${btnStyle}">🗑 Remove from Dock</button>`;
                  const cleanup = () => {
                    if (document.body.contains(menuEl))
                      document.body.removeChild(menuEl);
                    document.removeEventListener("click", closeOnOutside);
                  };
                  menuEl.addEventListener("click", (ev) => {
                    const btn = (ev.target as HTMLElement).closest(
                      "[data-action]",
                    ) as HTMLElement | null;
                    if (btn?.dataset.action === "open")
                      openApp(app.appId, app.title);
                    if (btn?.dataset.action === "remove") unpin(app.appId);
                    cleanup();
                  });
                  document.body.appendChild(menuEl);
                  const closeOnOutside = (ev: MouseEvent) => {
                    if (!menuEl.contains(ev.target as Node)) cleanup();
                  };
                  setTimeout(
                    () => document.addEventListener("click", closeOnOutside),
                    10,
                  );
                }}
              >
                <span className="text-base">
                  {APP_EMOJIS[app.appId] ?? <Pin className="w-4 h-4" />}
                </span>
              </DockBtn>
            ))}
            <div
              className={dividerClass}
              style={{ background: "var(--os-border-subtle)", flexShrink: 0 }}
            />
          </>
        )}

        {/* Fixed dock apps */}
        {DOCK_APPS.map((app, idx) => {
          const isOpen = windows.some(
            (w) => w.appId === app.appId && !w.minimized,
          );
          const dist =
            hoveredDockIndex === null
              ? Number.POSITIVE_INFINITY
              : Math.abs(idx - hoveredDockIndex);
          return (
            <div
              key={app.appId}
              onMouseEnter={() => setHoveredDockIndex(idx)}
              onMouseLeave={() => setHoveredDockIndex(null)}
            >
              <DockBtn
                onClick={() => openApp(app.appId, app.title)}
                data-ocid={`taskbar.${app.appId}.button`}
                title={app.title}
                active={isOpen}
                sizePx={sizePx}
                magnify={dockMagnification}
                distFromHovered={dist}
              >
                {APP_ICONS[app.appId]}
              </DockBtn>
            </div>
          );
        })}

        {/* Open windows overflow */}
        {windows.length > 0 && (
          <>
            <div
              className={dividerClass}
              style={{ background: "var(--os-border-subtle)", flexShrink: 0 }}
            />
            <div
              className={`flex ${dockFlexDir} items-center gap-1 ${
                isVertical ? "max-h-[280px]" : "max-w-[280px]"
              } overflow-x-auto scrollbar-none`}
            >
              {windows.map((w) => (
                <WindowChip
                  key={w.id}
                  window={w}
                  onToggle={() =>
                    w.minimized ? restoreWindow(w.id) : minimizeWindow(w.id)
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        <div
          className={dividerClass}
          style={{ background: "var(--os-border-subtle)", flexShrink: 0 }}
        />

        {/* Clipboard */}
        <div className="relative">
          <DockBtn
            onClick={() => setClipboardOpen((v) => !v)}
            data-ocid="taskbar.clipboard.button"
            title="Clipboard Manager"
            active={clipboardOpen}
            sizePx={sizePx}
            magnify={dockMagnification}
          >
            <Clipboard className="w-4 h-4" />
            {hasPinned && (
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "oklch(0.83 0.13 196)" }}
              />
            )}
          </DockBtn>
          <ClipboardPanel
            open={clipboardOpen}
            onClose={() => setClipboardOpen(false)}
          />
        </div>

        {/* Cycles indicator */}
        <div
          className="flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-[11px] font-mono flex-shrink-0"
          style={{
            background: "var(--os-border-subtle)",
            border: "1px solid var(--os-border-subtle)",
            color: "var(--os-text-secondary)",
          }}
          title={`Cycles balance: ${cyclesDisplay}`}
          data-ocid="taskbar.cycles.panel"
        >
          <Cpu className="w-3 h-3 os-cyan-text" />
          <span className="os-cyan-text font-semibold">{cyclesDisplay}</span>
          <span style={{ color: "var(--os-text-muted)", fontSize: 10 }}>
            cyc
          </span>
        </div>

        {/* Principal */}
        {principalSnippet && (
          <div
            className={`${isVertical ? "flex" : "hidden lg:flex"} items-center gap-1.5 px-2 h-7 rounded-lg text-[10px] font-mono flex-shrink-0`}
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-border-subtle)",
              color: "var(--os-text-muted)",
            }}
            title={session?.principal}
            data-ocid="taskbar.principal.panel"
          >
            <Wifi className="w-3 h-3 text-green-400" />
            {principalSnippet}
          </div>
        )}

        {/* Logout button — only shown when logged in */}
        {principalSnippet && (
          <DockBtn
            onClick={clear}
            data-ocid="taskbar.logout.button"
            title="Sign out"
            sizePx={sizePx}
            magnify={dockMagnification}
          >
            <LogOut
              className="w-4 h-4"
              style={{ color: "oklch(0.65 0.18 25)" }}
            />
          </DockBtn>
        )}
      </div>
    </div>
  );
}
