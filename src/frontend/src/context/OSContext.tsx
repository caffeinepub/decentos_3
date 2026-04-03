import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface OSSession {
  principal: string;
  displayName: string;
  cyclesBalance: bigint;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  zIndex: number;
  props?: Record<string, unknown>;
}

// Must match the "midnight" wallpaper value in Settings.tsx exactly
const DEFAULT_WALLPAPER =
  "radial-gradient(ellipse at 30% 40%, #1a0533 0%, #0d1a2e 40%, #0a0f1e 100%)";

type AccentColor = "cyan" | "purple" | "amber" | "green" | "rose";
type FontSize = "small" | "medium" | "large";
type UiDensity = "compact" | "comfortable" | "spacious";
export type OSTheme = "dark" | "light";
export type DockPosition = "bottom" | "left" | "right";
export type DockSize = "small" | "medium" | "large";

const ACCENT_COLOR_MAP: Record<AccentColor, string> = {
  cyan: "oklch(0.82 0.12 196)",
  purple: "oklch(0.75 0.18 280)",
  amber: "oklch(0.82 0.15 80)",
  green: "oklch(0.78 0.15 150)",
  rose: "oklch(0.72 0.18 15)",
};

const ACCENT_RGB_MAP: Record<AccentColor, [number, number, number]> = {
  cyan: [34, 211, 238],
  purple: [139, 92, 246],
  amber: [251, 191, 36],
  green: [52, 211, 153],
  rose: [251, 113, 133],
};

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "13px",
  medium: "15px",
  large: "17px",
};

// ─── Focus Context ───
interface FocusContextType {
  focusedWindowId: string | null;
}

const FocusContext = createContext<FocusContextType>({ focusedWindowId: null });

export function useFocusContext() {
  return useContext(FocusContext);
}

// ─── OS Context ───
interface OSContextType {
  session: OSSession | null;
  setSession: (session: OSSession | null) => void;
  windows: WindowState[];
  openApp: (
    appId: string,
    title: string,
    props?: Record<string, unknown>,
  ) => string;
  closeWindow: (id: string) => void;
  closeApp: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPos: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  updateCycles: (balance: bigint) => void;
  maxZIndex: number;
  wallpaper: string;
  setWallpaper: (bg: string) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  uiDensity: UiDensity;
  setUiDensity: (density: UiDensity) => void;
  // New settings
  theme: OSTheme;
  setTheme: (t: OSTheme) => void;
  dockPosition: DockPosition;
  setDockPosition: (p: DockPosition) => void;
  dockSize: DockSize;
  setDockSize: (s: DockSize) => void;
  dockMagnification: boolean;
  setDockMagnification: (v: boolean) => void;
  notificationPrefs: Record<string, boolean>;
  setNotificationPref: (appId: string, enabled: boolean) => void;
  isNotificationEnabled: (appId: string) => boolean;
}

const OSContext = createContext<OSContextType | null>(null);

const APP_DEFAULTS: Record<string, { width: number; height: number }> = {
  filemanager: { width: 700, height: 480 },
  notes: { width: 560, height: 420 },
  appstore: { width: 680, height: 500 },
  terminal: { width: 640, height: 420 },
  codeeditor: { width: 760, height: 520 },
  processmonitor: { width: 780, height: 500 },
  calculator: { width: 340, height: 520 },
  texteditor: { width: 620, height: 480 },
  browser: { width: 800, height: 560 },
  musicplayer: { width: 680, height: 440 },
  imageviewer: { width: 720, height: 520 },
  dashboard: { width: 820, height: 560 },
  wordprocessor: { width: 760, height: 540 },
  spreadsheet: { width: 900, height: 560 },
  calendar: { width: 720, height: 560 },
  passwordmanager: { width: 580, height: 500 },
  drawing: { width: 800, height: 560 },
  taskmanager: { width: 600, height: 500 },
  pomodoro: { width: 360, height: 460 },
  contactmanager: { width: 640, height: 520 },
  journal: { width: 680, height: 520 },
  budget: { width: 640, height: 500 },
  markdown: { width: 800, height: 540 },
  converter: { width: 420, height: 480 },
  habittracker: { width: 600, height: 500 },
  bookmarks: { width: 700, height: 500 },
  planner: { width: 620, height: 580 },
  flashcards: { width: 680, height: 520 },
  recipes: { width: 760, height: 540 },
  mindmap: { width: 820, height: 580 },
  portfolio: { width: 720, height: 520 },
  worldclock: { width: 680, height: 500 },
  baseconverter: { width: 500, height: 520 },
  encryption: { width: 680, height: 520 },
  qrcode: { width: 460, height: 520 },
  loancalc: { width: 640, height: 540 },
  sleeptracker: { width: 640, height: 520 },
  shortcuts: { width: 600, height: 520 },
  personalfinance: { width: 680, height: 520 },
  vocabnotes: { width: 580, height: 480 },
  readinglist: { width: 720, height: 520 },
  dailylog: { width: 700, height: 520 },
  splitter: { width: 640, height: 540 },
  personalcrm: { width: 760, height: 540 },
  financedashboard: { width: 840, height: 560 },
  securenotes: { width: 640, height: 520 },
  watertracker: { width: 420, height: 560 },
  networth: { width: 720, height: 540 },
  languagenotes: { width: 640, height: 520 },
  expensetracker: { width: 680, height: 520 },
  studytimer: { width: 420, height: 560 },
  datavisualizer: { width: 720, height: 540 },
  invoicegenerator: { width: 760, height: 520 },
  meetingnotes: { width: 680, height: 520 },
  kanban: { width: 820, height: 560 },
  markdowneditor: { width: 760, height: 540 },
  habitcalendar: { width: 640, height: 520 },
  difftool: { width: 720, height: 520 },
  stopwatch: { width: 360, height: 440 },
  focusboard: { width: 540, height: 480 },
  timeline: { width: 720, height: 520 },
  scratchpad: { width: 500, height: 440 },
  "ai-prompts": { width: 680, height: 520 },
  subscriptions: { width: 680, height: 520 },
  "interview-prep": { width: 720, height: 540 },
  medicalrecords: { width: 760, height: 560 },
  tripplanner: { width: 800, height: 580 },
  pomodorov2: { width: 380, height: 500 },
  networkmonitor: { width: 680, height: 520 },
};

let windowCounter = 0;

function loadNotifPrefs(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem("decentos_notif_prefs");
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function OSProvider({
  children,
  initialSession = null,
}: {
  children: React.ReactNode;
  initialSession?: OSSession | null;
}) {
  const [session, setSession] = useState<OSSession | null>(initialSession);
  const [windows, setWindows] = useState<WindowState[]>(() => {
    try {
      const saved = localStorage.getItem("decentos_session");
      if (!saved) return [];
      const parsed: Array<{
        appId: string;
        title: string;
        x: number;
        y: number;
        width: number;
        height: number;
      }> = JSON.parse(saved);
      return parsed.map((w, i) => ({
        id: `window-restore-${i}`,
        appId: w.appId,
        title: w.title,
        x: w.x,
        y: w.y,
        width: w.width,
        height: w.height,
        minimized: false,
        zIndex: 20 + i,
      }));
    } catch {
      return [];
    }
  });
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const zIndexRef = useRef(10);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [wallpaper, setWallpaperState] = useState<string>(
    () => localStorage.getItem("decentos_wallpaper") ?? DEFAULT_WALLPAPER,
  );
  const [accentColor, setAccentColorState] = useState<AccentColor>(
    () => (localStorage.getItem("decentos_accent") as AccentColor) ?? "cyan",
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(
    () => (localStorage.getItem("decentos_fontsize") as FontSize) ?? "medium",
  );
  const [uiDensity, setUiDensityState] = useState<UiDensity>(
    () =>
      (localStorage.getItem("decentos_density") as UiDensity) ?? "comfortable",
  );
  const [theme, setThemeState] = useState<OSTheme>(
    () => (localStorage.getItem("decentos_theme") as OSTheme) ?? "dark",
  );
  const [dockPosition, setDockPositionState] = useState<DockPosition>(
    () =>
      (localStorage.getItem("decentos_dock_position") as DockPosition) ??
      "bottom",
  );
  const [dockSize, setDockSizeState] = useState<DockSize>(
    () => (localStorage.getItem("decentos_dock_size") as DockSize) ?? "medium",
  );
  const [dockMagnification, setDockMagnificationState] = useState<boolean>(
    () => localStorage.getItem("decentos_dock_magnify") !== "false",
  );
  const [notificationPrefs, setNotificationPrefsState] =
    useState<Record<string, boolean>>(loadNotifPrefs);

  const setWallpaper = useCallback((bg: string) => {
    localStorage.setItem("decentos_wallpaper", bg);
    setWallpaperState(bg);
  }, []);

  const setAccentColor = useCallback((color: AccentColor) => {
    localStorage.setItem("decentos_accent", color);
    setAccentColorState(color);
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    localStorage.setItem("decentos_fontsize", size);
    setFontSizeState(size);
  }, []);

  const setUiDensity = useCallback((density: UiDensity) => {
    localStorage.setItem("decentos_density", density);
    setUiDensityState(density);
  }, []);

  const setTheme = useCallback((t: OSTheme) => {
    localStorage.setItem("decentos_theme", t);
    setThemeState(t);
    // Apply immediately to DOM — don't wait for the effect
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.colorScheme =
      t === "light" ? "light" : "dark";
  }, []);

  const setDockPosition = useCallback((p: DockPosition) => {
    localStorage.setItem("decentos_dock_position", p);
    setDockPositionState(p);
  }, []);

  const setDockSize = useCallback((s: DockSize) => {
    localStorage.setItem("decentos_dock_size", s);
    setDockSizeState(s);
  }, []);

  const setDockMagnification = useCallback((v: boolean) => {
    localStorage.setItem("decentos_dock_magnify", String(v));
    setDockMagnificationState(v);
  }, []);

  const setNotificationPref = useCallback((appId: string, enabled: boolean) => {
    setNotificationPrefsState((prev) => {
      const next = { ...prev, [appId]: enabled };
      localStorage.setItem("decentos_notif_prefs", JSON.stringify(next));
      return next;
    });
  }, []);

  const isNotificationEnabled = useCallback(
    (appId: string) => {
      return notificationPrefs[appId] !== false;
    },
    [notificationPrefs],
  );

  // Apply CSS variables when settings change
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--os-accent-color",
      ACCENT_COLOR_MAP[accentColor],
    );
    const [r, g, b] = ACCENT_RGB_MAP[accentColor];
    document.documentElement.style.setProperty("--os-accent-r", String(r));
    document.documentElement.style.setProperty("--os-accent-g", String(g));
    document.documentElement.style.setProperty("--os-accent-b", String(b));
    document.documentElement.style.setProperty(
      "--os-accent-color-alpha",
      `rgba(${r},${g},${b},0.2)`,
    );
    document.documentElement.style.setProperty(
      "--os-accent-color-border",
      `rgba(${r},${g},${b},0.4)`,
    );
  }, [accentColor]);

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZE_MAP[fontSize];
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.setAttribute("data-density", uiDensity);
  }, [uiDensity]);

  // Sync theme to DOM (the early script in main.tsx handles first render)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme =
      theme === "light" ? "light" : "dark";
  }, [theme]);

  // Persist open windows to localStorage (debounced)
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const toSave = windows
        .filter((w) => !w.minimized)
        .map(({ appId, title, x, y, width, height }) => ({
          appId,
          title,
          x,
          y,
          width,
          height,
        }));
      localStorage.setItem("decentos_session", JSON.stringify(toSave));
    }, 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [windows]);

  const MENU_H = 28;
  const TASK_H = 48;

  const openApp = useCallback(
    (appId: string, title: string, props?: Record<string, unknown>): string => {
      const id = `window-${++windowCounter}`;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rawDefaults = APP_DEFAULTS[appId] ?? { width: 600, height: 400 };
      const w = Math.min(rawDefaults.width, vw - 16);
      const h = Math.min(rawDefaults.height, vh - MENU_H - TASK_H - 8);
      const defaults = { width: w, height: h };
      const cascade = (windowCounter % 8) * 20;
      zIndexRef.current += 1;
      const spawnX = vw < 768 ? Math.max(0, (vw - w) / 2) : 80 + cascade;
      const spawnY = MENU_H + 8 + cascade;
      const maxX = Math.max(0, vw - w);
      const maxY = Math.max(MENU_H, vh - TASK_H - h);
      setWindows((prev) => [
        ...prev,
        {
          id,
          appId,
          title,
          x: Math.min(spawnX, maxX),
          y: Math.min(spawnY, maxY),
          width: defaults.width,
          height: defaults.height,
          minimized: false,
          zIndex: zIndexRef.current,
          props,
        },
      ]);
      setFocusedWindowId(id);
      return id;
    },
    [],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const closeApp = closeWindow;

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    zIndexRef.current += 1;
    const z = zIndexRef.current;
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: z } : w,
      ),
    );
    setFocusedWindowId(id);
  }, []);

  const bringToFront = useCallback((id: string) => {
    zIndexRef.current += 1;
    const z = zIndexRef.current;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
    );
    setFocusedWindowId(id);
  }, []);

  const updateWindowPos = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const updateWindowSize = useCallback(
    (id: string, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, width, height } : w)),
      );
    },
    [],
  );

  const updateCycles = useCallback((balance: bigint) => {
    setSession((prev) => (prev ? { ...prev, cyclesBalance: balance } : prev));
  }, []);

  const osValue = useMemo<OSContextType>(
    () => ({
      session,
      setSession,
      windows,
      openApp,
      closeWindow,
      closeApp,
      minimizeWindow,
      restoreWindow,
      bringToFront,
      updateWindowPos,
      updateWindowSize,
      updateCycles,
      maxZIndex: zIndexRef.current,
      wallpaper,
      setWallpaper,
      accentColor,
      setAccentColor,
      fontSize,
      setFontSize,
      uiDensity,
      setUiDensity,
      theme,
      setTheme,
      dockPosition,
      setDockPosition,
      dockSize,
      setDockSize,
      dockMagnification,
      setDockMagnification,
      notificationPrefs,
      setNotificationPref,
      isNotificationEnabled,
    }),
    [
      session,
      windows,
      openApp,
      closeWindow,
      closeApp,
      minimizeWindow,
      restoreWindow,
      bringToFront,
      updateWindowPos,
      updateWindowSize,
      updateCycles,
      wallpaper,
      setWallpaper,
      accentColor,
      setAccentColor,
      fontSize,
      setFontSize,
      uiDensity,
      setUiDensity,
      theme,
      setTheme,
      dockPosition,
      setDockPosition,
      dockSize,
      setDockSize,
      dockMagnification,
      setDockMagnification,
      notificationPrefs,
      setNotificationPref,
      isNotificationEnabled,
    ],
  );

  const focusValue = useMemo<FocusContextType>(
    () => ({ focusedWindowId }),
    [focusedWindowId],
  );

  return (
    <OSContext.Provider value={osValue}>
      <FocusContext.Provider value={focusValue}>
        {children}
      </FocusContext.Provider>
    </OSContext.Provider>
  );
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within OSProvider");
  return ctx;
}
