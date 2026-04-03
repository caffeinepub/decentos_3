import { r as reactExports, j as jsxRuntimeExports, X } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { P as Plus } from "./plus-VsWMR4PA.js";
const PRESET_ZONES = [
  { city: "UTC", timezone: "UTC" },
  { city: "New York", timezone: "America/New_York" },
  { city: "London", timezone: "Europe/London" },
  { city: "Tokyo", timezone: "Asia/Tokyo" },
  { city: "Sydney", timezone: "Australia/Sydney" },
  { city: "Dubai", timezone: "Asia/Dubai" }
];
const AVAILABLE_TIMEZONES = [
  { city: "Los Angeles", timezone: "America/Los_Angeles" },
  { city: "Chicago", timezone: "America/Chicago" },
  { city: "Toronto", timezone: "America/Toronto" },
  { city: "São Paulo", timezone: "America/Sao_Paulo" },
  { city: "Paris", timezone: "Europe/Paris" },
  { city: "Berlin", timezone: "Europe/Berlin" },
  { city: "Moscow", timezone: "Europe/Moscow" },
  { city: "Istanbul", timezone: "Europe/Istanbul" },
  { city: "Mumbai", timezone: "Asia/Kolkata" },
  { city: "Singapore", timezone: "Asia/Singapore" },
  { city: "Shanghai", timezone: "Asia/Shanghai" },
  { city: "Seoul", timezone: "Asia/Seoul" },
  { city: "Hong Kong", timezone: "Asia/Hong_Kong" },
  { city: "Bangkok", timezone: "Asia/Bangkok" },
  { city: "Karachi", timezone: "Asia/Karachi" },
  { city: "Cairo", timezone: "Africa/Cairo" },
  { city: "Lagos", timezone: "Africa/Lagos" },
  { city: "Nairobi", timezone: "Africa/Nairobi" },
  { city: "Auckland", timezone: "Pacific/Auckland" },
  { city: "Honolulu", timezone: "Pacific/Honolulu" },
  { city: "Anchorage", timezone: "America/Anchorage" },
  { city: "Mexico City", timezone: "America/Mexico_City" }
];
function getTimeInfo(timezone) {
  const now = /* @__PURE__ */ new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const dateStr = now.toLocaleDateString("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  const utcNow = /* @__PURE__ */ new Date();
  const localStr = utcNow.toLocaleString("en-US", { timeZone: timezone });
  const tzDate = new Date(localStr);
  const utcDate = new Date(utcNow.toLocaleString("en-US", { timeZone: "UTC" }));
  const diffMs = tzDate.getTime() - utcDate.getTime();
  const diffHours = diffMs / (1e3 * 60 * 60);
  const sign = diffHours >= 0 ? "+" : "-";
  const absHours = Math.floor(Math.abs(diffHours));
  const absMins = Math.round((Math.abs(diffHours) - absHours) * 60);
  const offsetStr = `UTC${sign}${String(absHours).padStart(2, "0")}:${String(absMins).padStart(2, "0")}`;
  return { timeStr, dateStr, offsetStr };
}
const STORAGE_KEY = "decentos_worldclock_zones";
function WorldClock() {
  const [tick, setTick] = reactExports.useState(0);
  const { data: customZones, set: setCustomZonesKV } = useCanisterKV(STORAGE_KEY, []);
  const [selectedTz, setSelectedTz] = reactExports.useState("");
  reactExports.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1e3);
    return () => clearInterval(id);
  }, []);
  const allZones = [
    ...PRESET_ZONES.map((z) => ({ ...z, isPreset: true })),
    ...customZones.map((z) => ({ ...z, isPreset: false }))
  ];
  const addZone = () => {
    if (!selectedTz) return;
    const found = AVAILABLE_TIMEZONES.find((z) => z.timezone === selectedTz);
    if (!found) return;
    if (allZones.some((z) => z.timezone === selectedTz)) return;
    setCustomZonesKV([
      ...customZones,
      { city: found.city, timezone: found.timezone }
    ]);
    setSelectedTz("");
  };
  const removeZone = (timezone) => {
    setCustomZonesKV(customZones.filter((z) => z.timezone !== timezone));
  };
  const availableToAdd = AVAILABLE_TIMEZONES.filter(
    (z) => !allZones.some((a) => a.timezone === z.timezone)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(8,14,18,0.97)" },
      "data-ocid": "worldclock.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 flex items-center justify-between px-4 py-3 border-b",
            style: {
              background: "rgba(12,22,30,0.95)",
              borderColor: "rgba(39,215,224,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-sm font-semibold",
                  style: { color: "var(--os-accent)" },
                  children: "🌍 World Clock"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: selectedTz,
                    onChange: (e) => setSelectedTz(e.target.value),
                    className: "h-7 text-xs px-2 rounded border bg-transparent text-muted-foreground hover:text-foreground",
                    style: {
                      borderColor: "rgba(39,215,224,0.25)",
                      background: "rgba(10,18,26,0.9)",
                      minWidth: 140
                    },
                    "data-ocid": "worldclock.select",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", style: { background: "var(--os-bg-app)" }, children: "Add timezone..." }),
                      availableToAdd.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "option",
                        {
                          value: z.timezone,
                          style: { background: "var(--os-bg-app)" },
                          children: z.city
                        },
                        z.timezone
                      ))
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: addZone,
                    disabled: !selectedTz,
                    "data-ocid": "worldclock.primary_button",
                    className: "h-7 px-3 rounded text-xs font-semibold transition-all disabled:opacity-40 flex items-center gap-1",
                    style: {
                      background: "rgba(39,215,224,0.15)",
                      border: "1px solid rgba(39,215,224,0.35)",
                      color: "var(--os-accent)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                      " Add"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-2 gap-3",
            style: {
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))"
            },
            children: allZones.map((zone) => {
              const { timeStr, dateStr, offsetStr } = getTimeInfo(zone.timezone);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative rounded-xl p-4",
                  style: {
                    background: "rgba(18,30,42,0.7)",
                    border: "1px solid rgba(39,215,224,0.15)",
                    backdropFilter: "blur(8px)"
                  },
                  children: [
                    !zone.isPreset && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeZone(zone.timezone),
                        "data-ocid": "worldclock.delete_button",
                        className: "absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/20 text-muted-foreground/60 hover:text-red-400 transition-colors",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60 font-medium mb-1", children: zone.city }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "text-2xl font-bold tracking-tight font-mono mb-1",
                        style: {
                          color: "var(--os-accent)",
                          textShadow: "0 0 20px rgba(39,215,224,0.4)"
                        },
                        children: timeStr
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60", children: dateStr }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "text-[10px] mt-1 px-1.5 py-0.5 rounded inline-block",
                        style: {
                          background: "rgba(39,215,224,0.08)",
                          color: "rgba(39,215,224,0.7)",
                          border: "1px solid rgba(39,215,224,0.15)"
                        },
                        children: offsetStr
                      }
                    )
                  ]
                },
                zone.timezone
              );
            })
          }
        ) })
      ]
    }
  );
}
export {
  WorldClock
};
