import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Copy,
  Download,
  HardDrive,
  Keyboard,
  Loader2,
  LogOut,
  Monitor,
  Moon,
  RefreshCw,
  Settings as SettingsIcon,
  Shield,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DEV_MODE, useAuth } from "../../context/AuthContext";
import { useOS } from "../../context/OSContext";
import { useActor } from "../../hooks/useActor";
import { useInstalledApps } from "../../hooks/useInstalledApps";
import {
  useCyclesBalance,
  useGetSystemTime,
  useListAllGrantedPermissions,
  useListInstalledApps,
  useRevokePermissions,
  useUninstallApp,
} from "../../hooks/useQueries";
import { Switch } from "../ui/switch";

interface SettingsProps {
  windowProps?: Record<string, unknown>;
}

function formatCycles(cycles: bigint): string {
  const n = Number(cycles);
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T cycles`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}G cycles`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M cycles`;
  return `${n} cycles`;
}

function bigintNsToDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleString();
}

const WALLPAPERS = [
  {
    id: "midnight",
    label: "Midnight",
    value:
      "radial-gradient(ellipse at 30% 40%, #1a0533 0%, #0d1a2e 40%, #0a0f1e 100%)",
  },
  {
    id: "forest",
    label: "Deep Forest",
    value:
      "radial-gradient(ellipse at 40% 60%, #0d2b0a 0%, #0a1f08 50%, #040d03 100%)",
  },
  {
    id: "crimson",
    label: "Crimson",
    value:
      "radial-gradient(ellipse at 60% 30%, #2d0010 0%, #1a0008 50%, #0a0004 100%)",
  },
  {
    id: "ocean",
    label: "Ocean Deep",
    value:
      "radial-gradient(ellipse at 30% 70%, #003d5c 0%, #001a2c 50%, #00080f 100%)",
  },
  {
    id: "cosmic",
    label: "Cosmic",
    value:
      "radial-gradient(ellipse at 50% 30%, #2d0060 0%, #0d0022 50%, #05000f 100%)",
  },
  {
    id: "amber",
    label: "Amber Night",
    value:
      "radial-gradient(ellipse at 40% 40%, #3d2500 0%, #1a0f00 50%, #080400 100%)",
  },
  {
    id: "rose",
    label: "Rose Noir",
    value:
      "radial-gradient(ellipse at 60% 60%, #3d0028 0%, #1a0010 50%, #080005 100%)",
  },
  {
    id: "arctic",
    label: "Arctic",
    value:
      "radial-gradient(ellipse at 30% 30%, #003040 0%, #001520 50%, #000a10 100%)",
  },
  {
    id: "obsidian",
    label: "Obsidian",
    value:
      "radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #0d0d0d 50%, #030303 100%)",
  },
  {
    id: "terracotta",
    label: "Terracotta",
    value:
      "radial-gradient(ellipse at 40% 40%, #3d1500 0%, #1a0800 50%, #080300 100%)",
  },
  {
    id: "steel",
    label: "Steel Storm",
    value:
      "radial-gradient(ellipse at 60% 30%, #1a2535 0%, #0a0f1a 50%, #040608 100%)",
  },
  {
    id: "emerald",
    label: "Emerald",
    value:
      "radial-gradient(ellipse at 30% 60%, #003d22 0%, #001a10 50%, #000805 100%)",
  },
];

const ACCENT_COLORS = [
  { name: "cyan" as const, label: "Cyan", hex: "#818cf8" },
  { name: "purple" as const, label: "Purple", hex: "#A855F7" },
  { name: "amber" as const, label: "Amber", hex: "#F59E0B" },
  { name: "green" as const, label: "Green", hex: "#22C55E" },
  { name: "rose" as const, label: "Rose", hex: "#F43F5E" },
];

type SettingsTab =
  | "appearance"
  | "notifications"
  | "privacy"
  | "system"
  | "account"
  | "shortcuts"
  | "desktop";

// Core apps always listed in notifications
const CORE_APP_NOTIF_LIST = [
  { appId: "notes", name: "Notes" },
  { appId: "calendar", name: "Calendar" },
  { appId: "taskmanager", name: "Task Manager" },
  { appId: "filemanager", name: "File Manager" },
  { appId: "terminal", name: "Terminal" },
  { appId: "appstore", name: "App Store" },
  { appId: "passwordmanager", name: "Password Manager" },
  { appId: "spreadsheet", name: "Spreadsheet" },
];

export function Settings({ windowProps: _windowProps }: SettingsProps) {
  const { actor, isFetching } = useActor();
  const { isAuthenticated, principal: authPrincipal, logout } = useAuth();
  const [cloudStorageUsed, setCloudStorageUsed] = useState<bigint>(BigInt(0));
  const [cloudStorageLoading, setCloudStorageLoading] = useState(false);
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const {
    session,
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
  } = useOS();

  const { installedApps: localInstalledApps } = useInstalledApps();
  const qc = useQueryClient();

  const { data: systemTime, refetch: refetchTime } = useGetSystemTime();
  const { data: cycles } = useCyclesBalance();
  const { data: grantedPerms, isLoading: loadingPerms } =
    useListAllGrantedPermissions();
  const { data: installedApps } = useListInstalledApps();
  const revokePermissions = useRevokePermissions();
  const uninstallApp = useUninstallApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [clockFormat, setClockFormat] = useState<"12h" | "24h">(
    () => (localStorage.getItem("decentos_clock") as "12h" | "24h") ?? "24h",
  );

  const handleClockFormat = (fmt: "12h" | "24h") => {
    setClockFormat(fmt);
    localStorage.setItem("decentos_clock", fmt);
    document.dispatchEvent(
      new CustomEvent("decentos:clockformat", { detail: fmt }),
    );
  };
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { data: osVersion } = useQuery<string>({
    queryKey: ["osVersion"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getOSVersion();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: principal } = useQuery<string>({
    queryKey: ["principalText"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getPrincipalAsText();
    },
    enabled: !!actor && !isFetching,
  });

  const handleRefresh = () => {
    refetchTime();
    qc.invalidateQueries({ queryKey: ["cyclesBalance"] });
    qc.invalidateQueries({ queryKey: ["allGrantedPermissions"] });
    toast.success("System info refreshed");
  };

  const handleRevoke = async (appId: number, appName: string) => {
    try {
      await revokePermissions.mutateAsync(appId);
      await uninstallApp.mutateAsync(appId);
      toast.success(`${appName} permissions revoked`);
    } catch {
      toast.error("Failed to revoke permissions");
    }
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleCopyPrincipal = () => {
    const p = authPrincipal || principal || session?.principal;
    if (!p) return;
    navigator.clipboard.writeText(p).then(() => {
      setCopiedPrincipal(true);
      setTimeout(() => setCopiedPrincipal(false), 2000);
    });
  };

  const storageUsed = (JSON.stringify(localStorage).length / 1024).toFixed(1);

  useEffect(() => {
    if (!actor || isFetching) return;
    setCloudStorageLoading(true);
    actor
      .getTotalStorageBytesUsed()
      .then((used) => setCloudStorageUsed(used))
      .catch(() => {})
      .finally(() => setCloudStorageLoading(false));
  }, [actor, isFetching]);

  const handleExportData = () => {
    const exportData: Record<string, unknown> = {};
    const appKeys = [
      "decentos_notes",
      "decentos_calendar",
      "decentos_tasks",
      "decentos_bookmarks",
      "decentos_journal",
      "decentos_budget",
      "decentos_habits",
      "decentos_contacts",
      "decentos_passwords",
      "decentos_recipes",
      "decentos_mindmap",
      "decentos_flashcards",
      "decentos_planner",
      "decentos_wiki",
      "decentos_goals",
      "decentos_stickynotes",
      "decentos_readinglist",
      "decentos_mood",
      "decentos_water",
      "decentos_sleep",
      "decentos_standup",
      "decentos_crm",
      "decentos_secure_notes",
      "decentos_snippets",
      "decentos_vocabnotes",
      "decentos_installed_apps",
      "decentos_notifications",
      "decentos_session",
    ];
    for (const key of appKeys) {
      const val = localStorage.getItem(key);
      if (val) {
        try {
          exportData[key] = JSON.parse(val);
        } catch {
          exportData[key] = val;
        }
      }
    }
    exportData.export_timestamp = new Date().toISOString();
    exportData.os_version = osVersion ?? "unknown";
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `decentos-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const getAppName = (appId: number) =>
    installedApps?.find((a) => a.id === appId)?.name ?? `App #${appId}`;

  const sectionStyle = {
    background: "var(--os-bg-elevated)",
    border: "1px solid var(--os-border-subtle)",
  };

  const btnBase = "px-3 py-1.5 rounded text-xs transition-colors border";
  const btnActive = {
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.5)",
    color: "rgba(99,102,241,0.95)",
  };
  const btnInactive = {
    background: "var(--os-bg-app)",
    border: "1px solid var(--os-border-subtle)",
    color: "var(--os-text-secondary)",
  };

  // Build notification app list: core + installed marketplace apps
  const allNotifApps = [
    ...CORE_APP_NOTIF_LIST,
    ...localInstalledApps.map((a) => ({ appId: a.appId, name: a.name })),
  ].filter(
    (app, idx, arr) => arr.findIndex((a) => a.appId === app.appId) === idx,
  );

  const TABS: { id: SettingsTab; label: string; subtitle: string }[] = [
    {
      id: "appearance",
      label: "Appearance",
      subtitle: "Theme, wallpaper, and display",
    },
    {
      id: "notifications",
      label: "Notifications",
      subtitle: "Choose which apps can send alerts",
    },
    {
      id: "privacy",
      label: "Privacy",
      subtitle: "Download or delete your on-chain data",
    },
    {
      id: "system",
      label: "System",
      subtitle: "Startup apps, storage, and reset",
    },
    {
      id: "account",
      label: "Account",
      subtitle: "Identity and authentication",
    },
    {
      id: "shortcuts",
      label: "Shortcuts",
      subtitle: "Keyboard shortcut reference",
    },
  ];

  const displayPrincipal =
    authPrincipal || principal || session?.principal || "Unknown";

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "var(--os-bg-app)" }}
      data-ocid="settings.panel"
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center gap-3 flex-shrink-0"
        style={{
          borderColor: "var(--os-border-subtle)",
          background: "var(--os-bg-app)",
        }}
      >
        <SettingsIcon className="w-5 h-5 os-cyan-text" />
        <div>
          <h2 className="text-sm font-semibold os-cyan-text">Settings</h2>
          <p className="text-[10px] text-muted-foreground">
            System configuration & preferences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-0 px-2 flex-shrink-0 overflow-x-auto"
        style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`settings.${tab.id}.tab`}
            className="px-3 py-2 text-xs capitalize transition-colors whitespace-nowrap flex-shrink-0 flex flex-col items-start gap-0.5"
            style={{
              color:
                activeTab === tab.id
                  ? "var(--os-accent-color)"
                  : "var(--os-text-secondary)",
              borderBottom:
                activeTab === tab.id
                  ? "2px solid var(--os-accent-color)"
                  : "2px solid transparent",
            }}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span
                style={{
                  fontSize: 9,
                  color: "var(--os-text-muted)",
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                {tab.subtitle}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── APPEARANCE TAB ─── */}
      {activeTab === "appearance" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Theme toggle */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Theme
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                data-ocid="settings.theme_dark.button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all"
                style={{
                  background:
                    theme === "dark"
                      ? "var(--os-accent-color-alpha)"
                      : "var(--os-bg-elevated)",
                  border:
                    theme === "dark"
                      ? "1px solid var(--os-accent-color-border)"
                      : "1px solid var(--os-border-subtle)",
                  color:
                    theme === "dark"
                      ? "var(--os-accent-color)"
                      : "var(--os-text-secondary)",
                }}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                data-ocid="settings.theme_light.button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all"
                style={{
                  background:
                    theme === "light"
                      ? "var(--os-accent-color-alpha)"
                      : "var(--os-bg-elevated)",
                  border:
                    theme === "light"
                      ? "1px solid var(--os-accent-color-border)"
                      : "1px solid var(--os-border-subtle)",
                  color:
                    theme === "light"
                      ? "var(--os-accent-color)"
                      : "var(--os-text-secondary)",
                }}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
            </div>
          </section>

          {/* Accent Color */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Accent Color
            </h3>
            <div className="flex items-center gap-3">
              {ACCENT_COLORS.map((c) => {
                const isActive = accentColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.label}
                    onClick={() => setAccentColor(c.name)}
                    data-ocid={`settings.accent_${c.name}.button`}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: c.hex,
                      border: isActive
                        ? "3px solid white"
                        : "3px solid transparent",
                      outline: isActive ? `2px solid ${c.hex}` : "none",
                      outlineOffset: 2,
                      transition: "all 0.15s",
                      flexShrink: 0,
                    }}
                  />
                );
              })}
            </div>
          </section>

          {/* Font Size */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Font Size
            </h3>
            <div className="flex items-center gap-2">
              {(["small", "medium", "large"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFontSize(s)}
                  data-ocid={`settings.fontsize_${s}.button`}
                  className={btnBase}
                  style={fontSize === s ? btnActive : btnInactive}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* UI Density */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              UI Density
            </h3>
            <div className="flex items-center gap-2">
              {(["compact", "comfortable", "spacious"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setUiDensity(d)}
                  data-ocid={`settings.density_${d}.button`}
                  className={btnBase}
                  style={uiDensity === d ? btnActive : btnInactive}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Clock Format */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Clock Format
            </h3>
            <div className="flex items-center gap-2">
              {(["12h", "24h"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => handleClockFormat(fmt)}
                  data-ocid={`settings.clock_${fmt}.button`}
                  className={btnBase}
                  style={clockFormat === fmt ? btnActive : btnInactive}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </section>

          {/* Dock Customization */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Dock
            </h3>
            <div className="space-y-4 rounded-lg p-3" style={sectionStyle}>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Position</p>
                <div className="flex items-center gap-2">
                  {(["bottom"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setDockPosition(pos)}
                      data-ocid={`settings.dock_pos_${pos}.button`}
                      className={btnBase}
                      style={dockPosition === pos ? btnActive : btnInactive}
                    >
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Icon Size</p>
                <div className="flex items-center gap-2">
                  {(["small", "medium", "large"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDockSize(s)}
                      data-ocid={`settings.dock_size_${s}.button`}
                      className={btnBase}
                      style={dockSize === s ? btnActive : btnInactive}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground/80">Magnification</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Hover to zoom dock icons
                  </p>
                </div>
                <Switch
                  checked={dockMagnification}
                  onCheckedChange={setDockMagnification}
                  data-ocid="settings.dock_magnify.switch"
                />
              </div>
            </div>
          </section>

          {/* Wallpaper */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Wallpaper
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {WALLPAPERS.map((wp) => {
                const isActive = wallpaper === wp.value;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => setWallpaper(wp.value)}
                    data-ocid={`settings.wallpaper_${wp.id}.button`}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div
                      className="w-full h-16 rounded-lg transition-all"
                      style={{
                        background: wp.value,
                        outline: isActive
                          ? "2px solid var(--os-accent-color)"
                          : "2px solid transparent",
                        outlineOffset: 2,
                        boxShadow: isActive
                          ? "0 0 14px rgba(var(--os-accent-r),var(--os-accent-g),var(--os-accent-b),0.3)"
                          : "0 0 0 1px var(--os-border-subtle)",
                      }}
                    />
                    <span
                      className="text-[9px] transition-colors"
                      style={{
                        color: isActive
                          ? "var(--os-accent-color)"
                          : "var(--os-text-secondary)",
                      }}
                    >
                      {wp.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="settings.wallpaper_upload.button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
                style={{
                  background: "var(--os-bg-app)",
                  border:
                    "1px dashed rgba(var(--os-accent-r),var(--os-accent-g),var(--os-accent-b),0.4)",
                  color: "var(--os-accent-color)",
                  cursor: "pointer",
                }}
              >
                ↑ Upload Custom
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const dataUrl = ev.target?.result as string;
                    if (dataUrl) setWallpaper(dataUrl);
                  };
                  reader.readAsDataURL(file);
                }}
              />
              {wallpaper.startsWith("data:") && (
                <div className="flex items-center gap-2">
                  <img
                    src={wallpaper}
                    alt="Custom wallpaper"
                    style={{
                      width: 52,
                      height: 34,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "2px solid rgba(99,102,241,0.6)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setWallpaper(
                        "linear-gradient(135deg, #0B0F12 0%, #0D1620 50%, #0B0F12 100%)",
                      )
                    }
                    data-ocid="settings.wallpaper_remove.button"
                    className="text-[10px] px-2 py-1 rounded transition-colors"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "rgba(239,68,68,0.8)",
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ─── NOTIFICATIONS TAB ─── */}
      {activeTab === "notifications" && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground/80">
                App Notifications
              </p>
              <p className="text-[10px] text-muted-foreground">
                Control which apps can send notifications
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {allNotifApps.map((app) => {
              const enabled = notificationPrefs[app.appId] !== false;
              return (
                <div
                  key={app.appId}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                  style={{
                    background: "var(--os-bg-elevated)",
                    border: "1px solid var(--os-border-subtle)",
                  }}
                  data-ocid={`settings.notif_${app.appId}.row`}
                >
                  <span className="text-xs text-foreground/80">{app.name}</span>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(v) => setNotificationPref(app.appId, v)}
                    data-ocid={`settings.notif_${app.appId}.switch`}
                  />
                </div>
              );
            })}
          </div>

          {allNotifApps.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground/40"
              data-ocid="settings.notif.empty_state"
            >
              <Bell className="w-8 h-8" />
              <p className="text-xs">No apps installed</p>
            </div>
          )}
        </div>
      )}

      {/* ─── PRIVACY TAB ─── */}
      {activeTab === "privacy" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <section data-ocid="settings.export_section">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Your Data
            </h3>
            <div className="rounded-lg p-3" style={sectionStyle}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-foreground/80 font-medium">
                    Download My Data
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Export all your on-chain and local app data as a JSON file.
                    Your data belongs to you.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  data-ocid="settings.export.primary_button"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors flex-shrink-0"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.35)",
                    color: "rgba(99,102,241,0.85)",
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>
          </section>

          <section data-ocid="settings.storage_section">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Storage
            </h3>
            <div className="rounded-lg p-3 space-y-3" style={sectionStyle}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Local Cache
                </span>
                <span className="text-xs font-mono text-foreground/80">
                  ~{storageUsed} KB
                </span>
              </div>
              <div
                className="h-px"
                style={{ background: "var(--os-border-subtle)" }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-primary/60" />
                  <span className="text-xs text-muted-foreground">
                    Cloud Storage
                  </span>
                </div>
                <span className="text-xs font-mono os-cyan-text">
                  {cloudStorageLoading
                    ? "Loading..."
                    : (() => {
                        const n = Number(cloudStorageUsed);
                        if (n < 1024) return `${n} B`;
                        if (n < 1024 * 1024)
                          return `${(n / 1024).toFixed(1)} KB`;
                        if (n < 1024 * 1024 * 1024)
                          return `${(n / (1024 * 1024)).toFixed(1)} MB`;
                        return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                      })()}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground/50">
                    Capacity
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/50">
                    400 GB max
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--os-border-subtle)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (Number(cloudStorageUsed) /
                          (400 * 1024 * 1024 * 1024)) *
                          100,
                        100,
                      )}%`,
                      background:
                        "linear-gradient(90deg, #818cf8 0%, #3B82F6 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section data-ocid="settings.permissions_section">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              App Permissions
            </h3>
            {loadingPerms ? (
              <div
                className="flex items-center justify-center py-6"
                data-ocid="settings.loading_state"
              >
                <Loader2 className="w-4 h-4 animate-spin text-primary/60" />
              </div>
            ) : !grantedPerms || grantedPerms.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground/40"
                data-ocid="settings.empty_state"
              >
                <Shield className="w-8 h-8" />
                <p className="text-xs">No app permissions granted</p>
              </div>
            ) : (
              <div className="space-y-2">
                {grantedPerms.map((grant, i) => (
                  <div
                    key={grant.appId}
                    className="rounded-lg p-3"
                    style={sectionStyle}
                    data-ocid="settings.permissions_section.row"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-foreground">
                            {getAppName(grant.appId)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {grant.permissions.map((perm) => (
                            <span
                              key={perm}
                              className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
                              style={{
                                background: "rgba(255,200,0,0.06)",
                                border: "1px solid rgba(255,200,0,0.15)",
                                color: "rgba(255,200,0,0.7)",
                              }}
                            >
                              <Shield className="w-2 h-2" />
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleRevoke(grant.appId, getAppName(grant.appId))
                        }
                        data-ocid={`settings.revoke_button.${i + 1}`}
                        className="flex items-center gap-1 px-2 h-7 rounded text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ─── SYSTEM TAB ─── */}
      {activeTab === "system" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <section data-ocid="settings.system_section">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System
              </h3>
              <button
                type="button"
                onClick={handleRefresh}
                data-ocid="settings.secondary_button"
                className="flex items-center gap-1 px-2 h-6 rounded text-[10px] text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
            <div className="rounded-lg p-3 space-y-2" style={sectionStyle}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  OS Version
                </span>
                <span className="text-xs font-mono os-cyan-text">
                  {osVersion ? `DecentOS ${osVersion}` : "Loading..."}
                </span>
              </div>
              <div
                className="h-px"
                style={{ background: "var(--os-border-subtle)" }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  System Time
                </span>
                <span className="text-xs font-mono text-foreground/80">
                  {systemTime && systemTime > BigInt(0)
                    ? bigintNsToDate(systemTime)
                    : "Fetching..."}
                </span>
              </div>
              <div
                className="h-px"
                style={{ background: "var(--os-border-subtle)" }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Network</span>
                <span
                  className="text-xs font-mono"
                  style={{ color: "rgba(74,222,128,0.9)" }}
                >
                  ● Internet Computer
                </span>
              </div>
            </div>
          </section>

          <section data-ocid="settings.identity_section">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Identity
            </h3>
            <div className="rounded-lg p-3 space-y-2" style={sectionStyle}>
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">
                  Principal
                </span>
                <span className="text-[10px] font-mono text-foreground/80 break-all">
                  {principal || session?.principal || "Fetching..."}
                </span>
              </div>
              <div
                className="h-px"
                style={{ background: "var(--os-border-subtle)" }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Display Name
                </span>
                <span className="text-xs text-foreground/80">
                  {session?.displayName ?? "—"}
                </span>
              </div>
              <div
                className="h-px"
                style={{ background: "var(--os-border-subtle)" }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Cycles Balance
                </span>
                <span className="text-xs font-mono os-cyan-text">
                  {cycles !== undefined
                    ? formatCycles(cycles)
                    : session?.cyclesBalance !== undefined
                      ? formatCycles(session.cyclesBalance)
                      : "—"}
                </span>
              </div>
            </div>
          </section>

          <section data-ocid="settings.reset_section">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Danger Zone
            </h3>
            <div className="rounded-lg p-3" style={sectionStyle}>
              {!showResetConfirm ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-foreground/80">Reset OS</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Clears all local data and restarts the OS
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    data-ocid="settings.delete_button"
                    className="px-3 py-1.5 rounded text-xs transition-colors"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "rgba(239,68,68,0.85)",
                    }}
                  >
                    Reset OS
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p
                    className="text-xs"
                    style={{ color: "rgba(239,68,68,0.9)" }}
                  >
                    ⚠️ This will clear all local data. This cannot be undone.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      data-ocid="settings.confirm_button"
                      className="px-3 py-1.5 rounded text-xs transition-colors"
                      style={{
                        background: "rgba(239,68,68,0.15)",
                        border: "1px solid rgba(239,68,68,0.5)",
                        color: "rgba(239,68,68,0.9)",
                      }}
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      data-ocid="settings.cancel_button"
                      className="px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
                      style={{
                        background: "var(--os-bg-app)",
                        border: "1px solid var(--os-border-subtle)",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ─── ACCOUNT TAB ─── */}
      {activeTab === "account" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Identity card */}
          <section data-ocid="settings.account_section">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Identity
            </h3>
            <div className="rounded-lg p-4 space-y-4" style={sectionStyle}>
              {/* Avatar + Status */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.25)",
                  }}
                >
                  <User
                    className="w-6 h-6"
                    style={{ color: "rgba(165,180,252,0.9)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--os-text-primary)" }}
                  >
                    {session?.displayName ?? "Anonymous"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: isAuthenticated
                          ? "rgba(74,222,128,0.9)"
                          : "rgba(251,191,36,0.9)",
                      }}
                    />
                    <p
                      className="text-[10px]"
                      style={{ color: "var(--os-text-muted)" }}
                    >
                      {DEV_MODE
                        ? "Dev Mode (anonymous)"
                        : isAuthenticated
                          ? "Authenticated via Internet Identity"
                          : "Not authenticated"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="h-px"
                style={{ background: "var(--os-border-subtle)" }}
              />

              {/* Principal ID */}
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  Principal ID
                </p>
                <div
                  className="flex items-start gap-2 p-2 rounded-lg"
                  style={{ background: "var(--os-bg-app)" }}
                >
                  <span
                    className="text-[10px] font-mono break-all flex-1 leading-relaxed"
                    style={{ color: "var(--os-text-secondary)" }}
                    data-ocid="settings.account.principal"
                  >
                    {displayPrincipal}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPrincipal}
                    data-ocid="settings.account.copy_button"
                    className="flex-shrink-0 p-1.5 rounded transition-colors"
                    style={{
                      background: copiedPrincipal
                        ? "rgba(74,222,128,0.15)"
                        : "var(--os-border-subtle)",
                      color: copiedPrincipal
                        ? "rgba(74,222,128,0.9)"
                        : "var(--os-text-muted)",
                    }}
                    title="Copy principal ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                {copiedPrincipal && (
                  <p
                    className="text-[9px] mt-1"
                    style={{ color: "rgba(74,222,128,0.8)" }}
                    data-ocid="settings.account.success_state"
                  >
                    Copied to clipboard!
                  </p>
                )}
              </div>

              <div
                className="h-px"
                style={{ background: "var(--os-border-subtle)" }}
              />

              {/* Data isolation note */}
              <div
                className="rounded-lg p-3 text-[10px] leading-relaxed"
                style={{
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  color: "var(--os-text-muted)",
                }}
              >
                <span
                  className="font-semibold block mb-1"
                  style={{ color: "rgba(165,180,252,0.8)" }}
                >
                  🔒 On-chain data isolation
                </span>
                Your notes, files, calendar events, and all app data are stored
                on the Internet Computer blockchain, isolated to your Internet
                Identity principal. Nobody else can read or modify your data.
              </div>
            </div>
          </section>

          {/* Sign Out */}
          {!DEV_MODE && isAuthenticated && (
            <section data-ocid="settings.signout_section">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Session
              </h3>
              <div className="rounded-lg p-3" style={sectionStyle}>
                {!showSignOutConfirm ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-foreground/80">Sign Out</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Clears your session. Your on-chain data is safe.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSignOutConfirm(true)}
                      data-ocid="settings.signout.button"
                      className="flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "rgba(239,68,68,0.8)",
                      }}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p
                      className="text-xs"
                      style={{ color: "rgba(239,68,68,0.9)" }}
                    >
                      Sign out of your Internet Identity session?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowSignOutConfirm(false);
                        }}
                        data-ocid="settings.signout.confirm_button"
                        className="px-3 py-1.5 rounded text-xs transition-colors"
                        style={{
                          background: "rgba(239,68,68,0.15)",
                          border: "1px solid rgba(239,68,68,0.5)",
                          color: "rgba(239,68,68,0.9)",
                        }}
                      >
                        Confirm Sign Out
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSignOutConfirm(false)}
                        data-ocid="settings.signout.cancel_button"
                        className="px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
                        style={{
                          background: "var(--os-bg-app)",
                          border: "1px solid var(--os-border-subtle)",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
          {/* Dev mode notice */}
          {DEV_MODE && (
            <div
              className="rounded-lg p-3 text-[10px]"
              style={{
                background: "rgba(217,119,6,0.06)",
                border: "1px solid rgba(217,119,6,0.2)",
                color: "rgba(251,191,36,0.7)",
              }}
              data-ocid="settings.devmode_notice"
            >
              <span className="font-semibold block mb-1">
                ⚡ Development Mode Active
              </span>
              Internet Identity is disabled. All users share the same anonymous
              session. To enable per-user data isolation, set{" "}
              <code className="font-mono">DEV_MODE = false</code> in
              AuthContext.tsx.
            </div>
          )}
        </div>
      )}

      {/* ─── SHORTCUTS TAB ─── */}
      {activeTab === "shortcuts" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <section data-ocid="settings.shortcuts.section">
            <div className="flex items-center gap-2 mb-3">
              <Keyboard
                className="w-4 h-4"
                style={{ color: "var(--os-accent-color)" }}
              />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Keyboard Shortcuts
              </h3>
            </div>
            <div className="rounded-lg overflow-hidden" style={sectionStyle}>
              {[
                { keys: ["⌘", "Space"], action: "Spotlight Search" },
                { keys: ["⌘", "W"], action: "Close window" },
                { keys: ["⌘", "M"], action: "Minimize window" },
                { keys: ["⌘", "Tab"], action: "Cycle windows" },
                { keys: ["⌘", ","], action: "Open Settings" },
                {
                  keys: ["↑", "↓", "←", "→"],
                  action: "Navigate desktop icons",
                },
                { keys: ["⌘", "A"], action: "Select all (in apps)" },
                { keys: ["⌘", "Z"], action: "Undo (in editors)" },
                { keys: ["⌘", "S"], action: "Save (in editors)" },
                { keys: ["⌘", "F"], action: "Find (in editors)" },
              ].map((shortcut, si) => (
                <div
                  key={shortcut.action}
                  className="flex items-center justify-between px-3 py-2.5"
                  style={{
                    borderBottom:
                      si < 9 ? "1px solid var(--os-border-subtle)" : "none",
                  }}
                >
                  <span
                    className="text-xs"
                    style={{ color: "var(--os-text-secondary)" }}
                  >
                    {shortcut.action}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((k) => (
                      <span
                        key={k + shortcut.action}
                        className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold"
                        style={{
                          background: "var(--os-bg-elevated)",
                          border: "1px solid var(--os-border-window)",
                          color: "var(--os-text-primary)",
                          minWidth: 20,
                          boxShadow: "0 1px 0 var(--os-border-window)",
                        }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 px-1">
              On Windows/Linux, replace ⌘ with Ctrl.
            </p>
          </section>
        </div>
      )}

      {activeTab === "desktop" && (
        <DesktopManageSection sectionStyle={sectionStyle} />
      )}
    </div>
  );
}

const DESKTOP_HIDDEN_KEY = "decentos_desktop_hidden";

function DesktopManageSection({
  sectionStyle,
}: { sectionStyle: React.CSSProperties }) {
  const { installedApps } = useInstalledApps();
  const [hidden, setHidden] = React.useState<Set<string>>(() => {
    try {
      const arr: string[] = JSON.parse(
        localStorage.getItem(DESKTOP_HIDDEN_KEY) ?? "[]",
      );
      return new Set(arr);
    } catch {
      return new Set();
    }
  });

  const toggleApp = (appId: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) next.delete(appId);
      else next.add(appId);
      localStorage.setItem(DESKTOP_HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const CORE_APPS = [
    { appId: "filemanager", name: "File Manager" },
    { appId: "appstore", name: "App Store" },
    { appId: "terminal", name: "Terminal" },
    { appId: "notes", name: "Notes" },
    { appId: "wordprocessor", name: "WriteOS" },
    { appId: "calendar", name: "Calendar" },
    { appId: "spreadsheet", name: "Spreadsheet" },
    { appId: "codeeditor", name: "Code Editor" },
    { appId: "calculator", name: "Calculator" },
    { appId: "browser", name: "Browser" },
  ];

  const allApps = [
    ...CORE_APPS,
    ...installedApps
      .filter((a) => !CORE_APPS.some((c) => c.appId === a.appId))
      .map((a) => ({ appId: a.appId, name: a.name })),
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <section data-ocid="settings.desktop.section">
        <div className="flex items-center gap-2 mb-3">
          <Monitor
            className="w-4 h-4"
            style={{ color: "var(--os-accent-color)" }}
          />
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Manage Desktop Apps
          </h3>
        </div>
        <p className="text-xs mb-3" style={{ color: "var(--os-text-muted)" }}>
          Toggle which apps appear in the desktop icon grid. Hidden apps are
          still accessible from the App Store.
        </p>
        <div className="rounded-lg overflow-hidden" style={sectionStyle}>
          {allApps.map((app, i) => (
            <div
              key={app.appId}
              className="flex items-center justify-between px-3 py-2.5"
              style={{
                borderBottom:
                  i < allApps.length - 1
                    ? "1px solid var(--os-border-subtle)"
                    : "none",
              }}
            >
              <span
                className="text-xs"
                style={{ color: "var(--os-text-secondary)" }}
              >
                {app.name}
              </span>
              <Switch
                checked={!hidden.has(app.appId)}
                onCheckedChange={() => toggleApp(app.appId)}
                data-ocid={`settings.desktop.${app.appId}.toggle`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
