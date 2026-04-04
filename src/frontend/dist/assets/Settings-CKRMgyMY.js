import { r as reactExports, j as jsxRuntimeExports, i as useActor, G as useAuth, u as useOS, v as useInstalledApps, H as useQueryClient, J as useGetSystemTime, K as useCyclesBalance, N as useListAllGrantedPermissions, O as useListInstalledApps, A as useRevokePermissions, y as useUninstallApp, Q as useQuery, V as Settings$1, W as Moon, Y as Sun, Z as Bell, L as LoaderCircle, T as Trash2, R as RefreshCw, _ as DEV_MODE, $ as User, n as Copy, a0 as LogOut, a1 as Keyboard, g as ue, a2 as React2, a3 as Monitor } from "./index-8tMpYjTW.js";
import { c as composeEventHandlers } from "./index-Bh3wJO-k.js";
import { u as useComposedRefs, c as cn } from "./utils-CLTBVgOB.js";
import { c as createContextScope } from "./index-H3VjlnDK.js";
import { u as useControllableState } from "./index-DQZl7YVg.js";
import { u as usePrevious, a as useSize } from "./index-Bn6t7Tej.js";
import { P as Primitive } from "./index-DQsGwgle.js";
import { D as Download } from "./download-BCO-vDCJ.js";
import { H as HardDrive } from "./hard-drive-DuGhljbC.js";
import { S as Shield } from "./shield-DHJOVrKO.js";
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
function formatCycles(cycles) {
  const n = Number(cycles);
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T cycles`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}G cycles`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M cycles`;
  return `${n} cycles`;
}
function bigintNsToDate(ns) {
  const ms = Number(ns / BigInt(1e6));
  return new Date(ms).toLocaleString();
}
const WALLPAPERS = [
  {
    id: "midnight",
    label: "Midnight",
    value: "radial-gradient(ellipse at 30% 40%, #1a0533 0%, #0d1a2e 40%, #0a0f1e 100%)"
  },
  {
    id: "forest",
    label: "Deep Forest",
    value: "radial-gradient(ellipse at 40% 60%, #0d2b0a 0%, #0a1f08 50%, #040d03 100%)"
  },
  {
    id: "crimson",
    label: "Crimson",
    value: "radial-gradient(ellipse at 60% 30%, #2d0010 0%, #1a0008 50%, #0a0004 100%)"
  },
  {
    id: "ocean",
    label: "Ocean Deep",
    value: "radial-gradient(ellipse at 30% 70%, #003d5c 0%, #001a2c 50%, #00080f 100%)"
  },
  {
    id: "cosmic",
    label: "Cosmic",
    value: "radial-gradient(ellipse at 50% 30%, #2d0060 0%, #0d0022 50%, #05000f 100%)"
  },
  {
    id: "amber",
    label: "Amber Night",
    value: "radial-gradient(ellipse at 40% 40%, #3d2500 0%, #1a0f00 50%, #080400 100%)"
  },
  {
    id: "rose",
    label: "Rose Noir",
    value: "radial-gradient(ellipse at 60% 60%, #3d0028 0%, #1a0010 50%, #080005 100%)"
  },
  {
    id: "arctic",
    label: "Arctic",
    value: "radial-gradient(ellipse at 30% 30%, #003040 0%, #001520 50%, #000a10 100%)"
  },
  {
    id: "obsidian",
    label: "Obsidian",
    value: "radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #0d0d0d 50%, #030303 100%)"
  },
  {
    id: "terracotta",
    label: "Terracotta",
    value: "radial-gradient(ellipse at 40% 40%, #3d1500 0%, #1a0800 50%, #080300 100%)"
  },
  {
    id: "steel",
    label: "Steel Storm",
    value: "radial-gradient(ellipse at 60% 30%, #1a2535 0%, #0a0f1a 50%, #040608 100%)"
  },
  {
    id: "emerald",
    label: "Emerald",
    value: "radial-gradient(ellipse at 30% 60%, #003d22 0%, #001a10 50%, #000805 100%)"
  }
];
const ACCENT_COLORS = [
  { name: "cyan", label: "Cyan", hex: "#818cf8" },
  { name: "purple", label: "Purple", hex: "#A855F7" },
  { name: "amber", label: "Amber", hex: "#F59E0B" },
  { name: "green", label: "Green", hex: "#22C55E" },
  { name: "rose", label: "Rose", hex: "#F43F5E" }
];
const CORE_APP_NOTIF_LIST = [
  { appId: "notes", name: "Notes" },
  { appId: "calendar", name: "Calendar" },
  { appId: "taskmanager", name: "Task Manager" },
  { appId: "filemanager", name: "File Manager" },
  { appId: "terminal", name: "Terminal" },
  { appId: "appstore", name: "App Store" },
  { appId: "passwordmanager", name: "Password Manager" },
  { appId: "spreadsheet", name: "Spreadsheet" }
];
function Settings({ windowProps: _windowProps }) {
  const { actor, isFetching } = useActor();
  const { isAuthenticated, principal: authPrincipal, logout } = useAuth();
  const [cloudStorageUsed, setCloudStorageUsed] = reactExports.useState(BigInt(0));
  const [cloudStorageLoading, setCloudStorageLoading] = reactExports.useState(false);
  const [copiedPrincipal, setCopiedPrincipal] = reactExports.useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = reactExports.useState(false);
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
    setNotificationPref
  } = useOS();
  const { installedApps: localInstalledApps } = useInstalledApps();
  const qc = useQueryClient();
  const { data: systemTime, refetch: refetchTime } = useGetSystemTime();
  const { data: cycles } = useCyclesBalance();
  const { data: grantedPerms, isLoading: loadingPerms } = useListAllGrantedPermissions();
  const { data: installedApps } = useListInstalledApps();
  const revokePermissions = useRevokePermissions();
  const uninstallApp = useUninstallApp();
  const fileInputRef = reactExports.useRef(null);
  const [activeTab, setActiveTab] = reactExports.useState("appearance");
  const [clockFormat, setClockFormat] = reactExports.useState(
    () => localStorage.getItem("decentos_clock") ?? "24h"
  );
  const handleClockFormat = (fmt) => {
    setClockFormat(fmt);
    localStorage.setItem("decentos_clock", fmt);
    document.dispatchEvent(
      new CustomEvent("decentos:clockformat", { detail: fmt })
    );
  };
  const [showResetConfirm, setShowResetConfirm] = reactExports.useState(false);
  const { data: osVersion } = useQuery({
    queryKey: ["osVersion"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getOSVersion();
    },
    enabled: !!actor && !isFetching
  });
  const { data: principal } = useQuery({
    queryKey: ["principalText"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getPrincipalAsText();
    },
    enabled: !!actor && !isFetching
  });
  const handleRefresh = () => {
    refetchTime();
    qc.invalidateQueries({ queryKey: ["cyclesBalance"] });
    qc.invalidateQueries({ queryKey: ["allGrantedPermissions"] });
    ue.success("System info refreshed");
  };
  const handleRevoke = async (appId, appName) => {
    try {
      await revokePermissions.mutateAsync(appId);
      await uninstallApp.mutateAsync(appId);
      ue.success(`${appName} permissions revoked`);
    } catch {
      ue.error("Failed to revoke permissions");
    }
  };
  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };
  const handleCopyPrincipal = () => {
    const p = authPrincipal || principal || (session == null ? void 0 : session.principal);
    if (!p) return;
    navigator.clipboard.writeText(p).then(() => {
      setCopiedPrincipal(true);
      setTimeout(() => setCopiedPrincipal(false), 2e3);
    });
  };
  const storageUsed = (JSON.stringify(localStorage).length / 1024).toFixed(1);
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    setCloudStorageLoading(true);
    actor.getTotalStorageBytesUsed().then((used) => setCloudStorageUsed(used)).catch(() => {
    }).finally(() => setCloudStorageLoading(false));
  }, [actor, isFetching]);
  const handleExportData = () => {
    const exportData = {};
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
      "decentos_session"
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
    exportData.export_timestamp = (/* @__PURE__ */ new Date()).toISOString();
    exportData.os_version = osVersion ?? "unknown";
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `decentos-data-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("Data exported successfully");
  };
  const getAppName = (appId) => {
    var _a;
    return ((_a = installedApps == null ? void 0 : installedApps.find((a) => a.id === appId)) == null ? void 0 : _a.name) ?? `App #${appId}`;
  };
  const sectionStyle = {
    background: "var(--os-bg-elevated)",
    border: "1px solid var(--os-border-subtle)"
  };
  const btnBase = "px-3 py-1.5 rounded text-xs transition-colors border";
  const btnActive = {
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.5)",
    color: "rgba(99,102,241,0.95)"
  };
  const btnInactive = {
    background: "var(--os-bg-app)",
    border: "1px solid var(--os-border-subtle)",
    color: "var(--os-text-secondary)"
  };
  const allNotifApps = [
    ...CORE_APP_NOTIF_LIST,
    ...localInstalledApps.map((a) => ({ appId: a.appId, name: a.name }))
  ].filter(
    (app, idx, arr) => arr.findIndex((a) => a.appId === app.appId) === idx
  );
  const TABS = [
    {
      id: "appearance",
      label: "Appearance",
      subtitle: "Theme, wallpaper, and display"
    },
    {
      id: "notifications",
      label: "Notifications",
      subtitle: "Choose which apps can send alerts"
    },
    {
      id: "privacy",
      label: "Privacy",
      subtitle: "Download or delete your on-chain data"
    },
    {
      id: "system",
      label: "System",
      subtitle: "Startup apps, storage, and reset"
    },
    {
      id: "account",
      label: "Account",
      subtitle: "Identity and authentication"
    },
    {
      id: "shortcuts",
      label: "Shortcuts",
      subtitle: "Keyboard shortcut reference"
    }
  ];
  const displayPrincipal = authPrincipal || principal || (session == null ? void 0 : session.principal) || "Unknown";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: "var(--os-bg-app)" },
      "data-ocid": "settings.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-3 border-b flex items-center gap-3 flex-shrink-0",
            style: {
              borderColor: "var(--os-border-subtle)",
              background: "var(--os-bg-app)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings$1, { className: "w-5 h-5 os-cyan-text" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold os-cyan-text", children: "Settings" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "System configuration & preferences" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-0 px-2 flex-shrink-0 overflow-x-auto",
            style: { borderBottom: "1px solid var(--os-border-subtle)" },
            children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(tab.id),
                "data-ocid": `settings.${tab.id}.tab`,
                className: "px-3 py-2 text-xs capitalize transition-colors whitespace-nowrap flex-shrink-0 flex flex-col items-start gap-0.5",
                style: {
                  color: activeTab === tab.id ? "var(--os-accent-color)" : "var(--os-text-secondary)",
                  borderBottom: activeTab === tab.id ? "2px solid var(--os-accent-color)" : "2px solid transparent"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label }),
                  activeTab === tab.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        fontSize: 9,
                        color: "var(--os-text-muted)",
                        fontWeight: 400,
                        textTransform: "none",
                        letterSpacing: 0
                      },
                      children: tab.subtitle
                    }
                  )
                ]
              },
              tab.id
            ))
          }
        ),
        activeTab === "appearance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Theme" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setTheme("dark"),
                  "data-ocid": "settings.theme_dark.button",
                  className: "flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all",
                  style: {
                    background: theme === "dark" ? "var(--os-accent-color-alpha)" : "var(--os-bg-elevated)",
                    border: theme === "dark" ? "1px solid var(--os-accent-color-border)" : "1px solid var(--os-border-subtle)",
                    color: theme === "dark" ? "var(--os-accent-color)" : "var(--os-text-secondary)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-3.5 h-3.5" }),
                    "Dark"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setTheme("light"),
                  "data-ocid": "settings.theme_light.button",
                  className: "flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all",
                  style: {
                    background: theme === "light" ? "var(--os-accent-color-alpha)" : "var(--os-bg-elevated)",
                    border: theme === "light" ? "1px solid var(--os-accent-color-border)" : "1px solid var(--os-border-subtle)",
                    color: theme === "light" ? "var(--os-accent-color)" : "var(--os-text-secondary)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-3.5 h-3.5" }),
                    "Light"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Accent Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: ACCENT_COLORS.map((c) => {
              const isActive = accentColor === c.name;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  title: c.label,
                  onClick: () => setAccentColor(c.name),
                  "data-ocid": `settings.accent_${c.name}.button`,
                  style: {
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: c.hex,
                    border: isActive ? "3px solid white" : "3px solid transparent",
                    outline: isActive ? `2px solid ${c.hex}` : "none",
                    outlineOffset: 2,
                    transition: "all 0.15s",
                    flexShrink: 0
                  }
                },
                c.name
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Font Size" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: ["small", "medium", "large"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setFontSize(s),
                "data-ocid": `settings.fontsize_${s}.button`,
                className: btnBase,
                style: fontSize === s ? btnActive : btnInactive,
                children: s.charAt(0).toUpperCase() + s.slice(1)
              },
              s
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "UI Density" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: ["compact", "comfortable", "spacious"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setUiDensity(d),
                "data-ocid": `settings.density_${d}.button`,
                className: btnBase,
                style: uiDensity === d ? btnActive : btnInactive,
                children: d.charAt(0).toUpperCase() + d.slice(1)
              },
              d
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Clock Format" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: ["12h", "24h"].map((fmt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleClockFormat(fmt),
                "data-ocid": `settings.clock_${fmt}.button`,
                className: btnBase,
                style: clockFormat === fmt ? btnActive : btnInactive,
                children: fmt
              },
              fmt
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Dock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-lg p-3", style: sectionStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Position" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: ["bottom"].map((pos) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDockPosition(pos),
                    "data-ocid": `settings.dock_pos_${pos}.button`,
                    className: btnBase,
                    style: dockPosition === pos ? btnActive : btnInactive,
                    children: pos.charAt(0).toUpperCase() + pos.slice(1)
                  },
                  pos
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Icon Size" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: ["small", "medium", "large"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDockSize(s),
                    "data-ocid": `settings.dock_size_${s}.button`,
                    className: btnBase,
                    style: dockSize === s ? btnActive : btnInactive,
                    children: s.charAt(0).toUpperCase() + s.slice(1)
                  },
                  s
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80", children: "Magnification" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Hover to zoom dock icons" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: dockMagnification,
                    onCheckedChange: setDockMagnification,
                    "data-ocid": "settings.dock_magnify.switch"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Wallpaper" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 mb-3", children: WALLPAPERS.map((wp) => {
              const isActive = wallpaper === wp.value;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setWallpaper(wp.value),
                  "data-ocid": `settings.wallpaper_${wp.id}.button`,
                  className: "flex flex-col items-center gap-1 group",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-full h-16 rounded-lg transition-all",
                        style: {
                          background: wp.value,
                          outline: isActive ? "2px solid var(--os-accent-color)" : "2px solid transparent",
                          outlineOffset: 2,
                          boxShadow: isActive ? "0 0 14px rgba(var(--os-accent-r),var(--os-accent-g),var(--os-accent-b),0.3)" : "0 0 0 1px var(--os-border-subtle)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[9px] transition-colors",
                        style: {
                          color: isActive ? "var(--os-accent-color)" : "var(--os-text-secondary)"
                        },
                        children: wp.label
                      }
                    )
                  ]
                },
                wp.id
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  "data-ocid": "settings.wallpaper_upload.button",
                  className: "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors",
                  style: {
                    background: "var(--os-bg-app)",
                    border: "1px dashed rgba(var(--os-accent-r),var(--os-accent-g),var(--os-accent-b),0.4)",
                    color: "var(--os-accent-color)",
                    cursor: "pointer"
                  },
                  children: "↑ Upload Custom"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: (e) => {
                    var _a;
                    const file = (_a = e.target.files) == null ? void 0 : _a[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      var _a2;
                      const dataUrl = (_a2 = ev.target) == null ? void 0 : _a2.result;
                      if (dataUrl) setWallpaper(dataUrl);
                    };
                    reader.readAsDataURL(file);
                  }
                }
              ),
              wallpaper.startsWith("data:") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: wallpaper,
                    alt: "Custom wallpaper",
                    style: {
                      width: 52,
                      height: 34,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "2px solid rgba(99,102,241,0.6)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setWallpaper(
                      "linear-gradient(135deg, #0B0F12 0%, #0D1620 50%, #0B0F12 100%)"
                    ),
                    "data-ocid": "settings.wallpaper_remove.button",
                    className: "text-[10px] px-2 py-1 rounded transition-colors",
                    style: {
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "rgba(239,68,68,0.8)"
                    },
                    children: "Remove"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        activeTab === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground/80", children: "App Notifications" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Control which apps can send notifications" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: allNotifApps.map((app) => {
            const enabled = notificationPrefs[app.appId] !== false;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-3 py-2.5 rounded-lg",
                style: {
                  background: "var(--os-bg-elevated)",
                  border: "1px solid var(--os-border-subtle)"
                },
                "data-ocid": `settings.notif_${app.appId}.row`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/80", children: app.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: enabled,
                      onCheckedChange: (v) => setNotificationPref(app.appId, v),
                      "data-ocid": `settings.notif_${app.appId}.switch`
                    }
                  )
                ]
              },
              app.appId
            );
          }) }),
          allNotifApps.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground/40",
              "data-ocid": "settings.notif.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-8 h-8" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No apps installed" })
              ]
            }
          )
        ] }),
        activeTab === "privacy" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.export_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Your Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg p-3", style: sectionStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 font-medium", children: "Download My Data" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Export all your on-chain and local app data as a JSON file. Your data belongs to you." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleExportData,
                  "data-ocid": "settings.export.primary_button",
                  className: "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors flex-shrink-0",
                  style: {
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.35)",
                    color: "rgba(99,102,241,0.85)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                    "Export"
                  ]
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.storage_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Storage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-3 space-y-3", style: sectionStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Local Cache" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-foreground/80", children: [
                  "~",
                  storageUsed,
                  " KB"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-px",
                  style: { background: "var(--os-border-subtle)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-3.5 h-3.5 text-primary/60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Cloud Storage" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono os-cyan-text", children: cloudStorageLoading ? "Loading..." : (() => {
                  const n = Number(cloudStorageUsed);
                  if (n < 1024) return `${n} B`;
                  if (n < 1024 * 1024)
                    return `${(n / 1024).toFixed(1)} KB`;
                  if (n < 1024 * 1024 * 1024)
                    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
                  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                })() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50", children: "Capacity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground/50", children: "400 GB max" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-1.5 rounded-full overflow-hidden",
                    style: { background: "var(--os-border-subtle)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full transition-all",
                        style: {
                          width: `${Math.min(
                            Number(cloudStorageUsed) / (400 * 1024 * 1024 * 1024) * 100,
                            100
                          )}%`,
                          background: "linear-gradient(90deg, #818cf8 0%, #3B82F6 100%)"
                        }
                      }
                    )
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.permissions_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "App Permissions" }),
            loadingPerms ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center py-6",
                "data-ocid": "settings.loading_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-primary/60" })
              }
            ) : !grantedPerms || grantedPerms.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground/40",
                "data-ocid": "settings.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-8 h-8" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No app permissions granted" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: grantedPerms.map((grant, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "rounded-lg p-3",
                style: sectionStyle,
                "data-ocid": "settings.permissions_section.row",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: getAppName(grant.appId) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: grant.permissions.map((perm) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded",
                        style: {
                          background: "rgba(255,200,0,0.06)",
                          border: "1px solid rgba(255,200,0,0.15)",
                          color: "rgba(255,200,0,0.7)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-2 h-2" }),
                          perm
                        ]
                      },
                      perm
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleRevoke(grant.appId, getAppName(grant.appId)),
                      "data-ocid": `settings.revoke_button.${i + 1}`,
                      className: "flex items-center gap-1 px-2 h-7 rounded text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                        "Revoke"
                      ]
                    }
                  )
                ] })
              },
              grant.appId
            )) })
          ] })
        ] }),
        activeTab === "system" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.system_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "System" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleRefresh,
                  "data-ocid": "settings.secondary_button",
                  className: "flex items-center gap-1 px-2 h-6 rounded text-[10px] text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
                    "Refresh"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-3 space-y-2", style: sectionStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "OS Version" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono os-cyan-text", children: osVersion ? `DecentOS ${osVersion}` : "Loading..." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-px",
                  style: { background: "var(--os-border-subtle)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "System Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-foreground/80", children: systemTime && systemTime > BigInt(0) ? bigintNsToDate(systemTime) : "Fetching..." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-px",
                  style: { background: "var(--os-border-subtle)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Network" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-mono",
                    style: { color: "rgba(74,222,128,0.9)" },
                    children: "● Internet Computer"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.identity_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Identity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-3 space-y-2", style: sectionStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block mb-0.5", children: "Principal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-foreground/80 break-all", children: principal || (session == null ? void 0 : session.principal) || "Fetching..." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-px",
                  style: { background: "var(--os-border-subtle)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Display Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/80", children: (session == null ? void 0 : session.displayName) ?? "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-px",
                  style: { background: "var(--os-border-subtle)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Cycles Balance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono os-cyan-text", children: cycles !== void 0 ? formatCycles(cycles) : (session == null ? void 0 : session.cyclesBalance) !== void 0 ? formatCycles(session.cyclesBalance) : "—" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.reset_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Danger Zone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg p-3", style: sectionStyle, children: !showResetConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80", children: "Reset OS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Clears all local data and restarts the OS" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowResetConfirm(true),
                  "data-ocid": "settings.delete_button",
                  className: "px-3 py-1.5 rounded text-xs transition-colors",
                  style: {
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "rgba(239,68,68,0.85)"
                  },
                  children: "Reset OS"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs",
                  style: { color: "rgba(239,68,68,0.9)" },
                  children: "⚠️ This will clear all local data. This cannot be undone."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleReset,
                    "data-ocid": "settings.confirm_button",
                    className: "px-3 py-1.5 rounded text-xs transition-colors",
                    style: {
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.5)",
                      color: "rgba(239,68,68,0.9)"
                    },
                    children: "Confirm Reset"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowResetConfirm(false),
                    "data-ocid": "settings.cancel_button",
                    className: "px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground transition-colors",
                    style: {
                      background: "var(--os-bg-app)",
                      border: "1px solid var(--os-border-subtle)"
                    },
                    children: "Cancel"
                  }
                )
              ] })
            ] }) })
          ] })
        ] }),
        activeTab === "account" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.account_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Identity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-4 space-y-4", style: sectionStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    style: {
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.25)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      User,
                      {
                        className: "w-6 h-6",
                        style: { color: "rgba(165,180,252,0.9)" }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-semibold",
                      style: { color: "var(--os-text-primary)" },
                      children: (session == null ? void 0 : session.displayName) ?? "Anonymous"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "w-1.5 h-1.5 rounded-full",
                        style: {
                          background: isAuthenticated ? "rgba(74,222,128,0.9)" : "rgba(251,191,36,0.9)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[10px]",
                        style: { color: "var(--os-text-muted)" },
                        children: isAuthenticated ? "Authenticated via Internet Identity" : "Not authenticated"
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-px",
                  style: { background: "var(--os-border-subtle)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] font-semibold uppercase tracking-wider mb-2",
                    style: { color: "var(--os-text-muted)" },
                    children: "Principal ID"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-2 p-2 rounded-lg",
                    style: { background: "var(--os-bg-app)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] font-mono break-all flex-1 leading-relaxed",
                          style: { color: "var(--os-text-secondary)" },
                          "data-ocid": "settings.account.principal",
                          children: displayPrincipal
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: handleCopyPrincipal,
                          "data-ocid": "settings.account.copy_button",
                          className: "flex-shrink-0 p-1.5 rounded transition-colors",
                          style: {
                            background: copiedPrincipal ? "rgba(74,222,128,0.15)" : "var(--os-border-subtle)",
                            color: copiedPrincipal ? "rgba(74,222,128,0.9)" : "var(--os-text-muted)"
                          },
                          title: "Copy principal ID",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
                        }
                      )
                    ]
                  }
                ),
                copiedPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[9px] mt-1",
                    style: { color: "rgba(74,222,128,0.8)" },
                    "data-ocid": "settings.account.success_state",
                    children: "Copied to clipboard!"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-px",
                  style: { background: "var(--os-border-subtle)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg p-3 text-[10px] leading-relaxed",
                  style: {
                    background: "rgba(99,102,241,0.06)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    color: "var(--os-text-muted)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-semibold block mb-1",
                        style: { color: "rgba(165,180,252,0.8)" },
                        children: "🔒 On-chain data isolation"
                      }
                    ),
                    "Your notes, files, calendar events, and all app data are stored on the Internet Computer blockchain, isolated to your Internet Identity principal. Nobody else can read or modify your data."
                  ]
                }
              )
            ] })
          ] }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.signout_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Session" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg p-3", style: sectionStyle, children: !showSignOutConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80", children: "Sign Out" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Clears your session. Your on-chain data is safe." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowSignOutConfirm(true),
                  "data-ocid": "settings.signout.button",
                  className: "flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors",
                  style: {
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "rgba(239,68,68,0.8)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-3.5 h-3.5" }),
                    "Sign Out"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs",
                  style: { color: "rgba(239,68,68,0.9)" },
                  children: "Sign out of your Internet Identity session?"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      logout();
                      setShowSignOutConfirm(false);
                    },
                    "data-ocid": "settings.signout.confirm_button",
                    className: "px-3 py-1.5 rounded text-xs transition-colors",
                    style: {
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.5)",
                      color: "rgba(239,68,68,0.9)"
                    },
                    children: "Confirm Sign Out"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowSignOutConfirm(false),
                    "data-ocid": "settings.signout.cancel_button",
                    className: "px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground transition-colors",
                    style: {
                      background: "var(--os-bg-app)",
                      border: "1px solid var(--os-border-subtle)"
                    },
                    children: "Cancel"
                  }
                )
              ] })
            ] }) })
          ] }),
          DEV_MODE
        ] }),
        activeTab === "shortcuts" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.shortcuts.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Keyboard,
              {
                className: "w-4 h-4",
                style: { color: "var(--os-accent-color)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Keyboard Shortcuts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg overflow-hidden", style: sectionStyle, children: [
            { keys: ["⌘", "Space"], action: "Spotlight Search" },
            { keys: ["⌘", "W"], action: "Close window" },
            { keys: ["⌘", "M"], action: "Minimize window" },
            { keys: ["⌘", "Tab"], action: "Cycle windows" },
            { keys: ["⌘", ","], action: "Open Settings" },
            {
              keys: ["↑", "↓", "←", "→"],
              action: "Navigate desktop icons"
            },
            { keys: ["⌘", "A"], action: "Select all (in apps)" },
            { keys: ["⌘", "Z"], action: "Undo (in editors)" },
            { keys: ["⌘", "S"], action: "Save (in editors)" },
            { keys: ["⌘", "F"], action: "Find (in editors)" }
          ].map((shortcut, si) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-3 py-2.5",
              style: {
                borderBottom: si < 9 ? "1px solid var(--os-border-subtle)" : "none"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs",
                    style: { color: "var(--os-text-secondary)" },
                    children: shortcut.action
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: shortcut.keys.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold",
                    style: {
                      background: "var(--os-bg-elevated)",
                      border: "1px solid var(--os-border-window)",
                      color: "var(--os-text-primary)",
                      minWidth: 20,
                      boxShadow: "0 1px 0 var(--os-border-window)"
                    },
                    children: k
                  },
                  k + shortcut.action
                )) })
              ]
            },
            shortcut.action
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-2 px-1", children: "On Windows/Linux, replace ⌘ with Ctrl." })
        ] }) }),
        activeTab === "desktop" && /* @__PURE__ */ jsxRuntimeExports.jsx(DesktopManageSection, { sectionStyle })
      ]
    }
  );
}
const DESKTOP_HIDDEN_KEY = "decentos_desktop_hidden";
function DesktopManageSection({
  sectionStyle
}) {
  const { installedApps } = useInstalledApps();
  const [hidden, setHidden] = React2.useState(() => {
    try {
      const arr = JSON.parse(
        localStorage.getItem(DESKTOP_HIDDEN_KEY) ?? "[]"
      );
      return new Set(arr);
    } catch {
      return /* @__PURE__ */ new Set();
    }
  });
  const toggleApp = (appId) => {
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
    { appId: "browser", name: "Browser" }
  ];
  const allApps = [
    ...CORE_APPS,
    ...installedApps.filter((a) => !CORE_APPS.some((c) => c.appId === a.appId)).map((a) => ({ appId: a.appId, name: a.name }))
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.desktop.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Monitor,
        {
          className: "w-4 h-4",
          style: { color: "var(--os-accent-color)" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Manage Desktop Apps" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mb-3", style: { color: "var(--os-text-muted)" }, children: "Toggle which apps appear in the desktop icon grid. Hidden apps are still accessible from the App Store." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg overflow-hidden", style: sectionStyle, children: allApps.map((app, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-3 py-2.5",
        style: {
          borderBottom: i < allApps.length - 1 ? "1px solid var(--os-border-subtle)" : "none"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs",
              style: { color: "var(--os-text-secondary)" },
              children: app.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: !hidden.has(app.appId),
              onCheckedChange: () => toggleApp(app.appId),
              "data-ocid": `settings.desktop.${app.appId}.toggle`
            }
          )
        ]
      },
      app.appId
    )) })
  ] }) });
}
export {
  Settings
};
