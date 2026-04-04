import { r as reactExports, j as jsxRuntimeExports, aT as Palette, aK as Heart, C as Check, n as Copy, T as Trash2, g as ue } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { D as Download } from "./download-BCO-vDCJ.js";
function hexToHsl(hex) {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
function hslToHex(h, s, l) {
  const hN = (h % 360 + 360) % 360;
  const sN = s / 100;
  const lN = l / 100;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n) => {
    const k = (n + hN / 30) % 12;
    const color = lN - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function generatePalette(base, harmony) {
  const [h, s, l] = hexToHsl(base);
  switch (harmony) {
    case "complementary":
      return [
        base,
        hslToHex(h + 30, s, l),
        hslToHex(h + 60, s, l),
        hslToHex(h + 180, s, l),
        hslToHex(h + 210, s, l)
      ];
    case "analogous":
      return [
        hslToHex(h - 40, s, l),
        hslToHex(h - 20, s, l),
        base,
        hslToHex(h + 20, s, l),
        hslToHex(h + 40, s, l)
      ];
    case "triadic":
      return [
        base,
        hslToHex(h + 30, s, l),
        hslToHex(h + 120, s, l),
        hslToHex(h + 150, s, l),
        hslToHex(h + 240, s, l)
      ];
    case "split-complementary":
      return [
        base,
        hslToHex(h + 30, s, l),
        hslToHex(h + 150, s, l),
        hslToHex(h + 180, s, l),
        hslToHex(h + 210, s, l)
      ];
    case "tetradic":
      return [
        base,
        hslToHex(h + 90, s, l),
        hslToHex(h + 180, s, l),
        hslToHex(h + 270, s, l),
        hslToHex(h + 45, s, Math.min(l + 15, 90))
      ];
  }
}
const HARMONIES = [
  { id: "complementary", label: "Complement" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "split-complementary", label: "Split" },
  { id: "tetradic", label: "Tetradic" }
];
const BTN_STYLE = {
  background: "rgba(39,215,224,0.1)",
  border: "1px solid rgba(39,215,224,0.3)",
  color: "var(--os-accent)"
};
function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = reactExports.useState("#27D7E0");
  const [harmony, setHarmony] = reactExports.useState("complementary");
  const [palette, setPalette] = reactExports.useState([]);
  const [copiedIdx, setCopiedIdx] = reactExports.useState(null);
  const { data: saved, set: setSavedChain } = useCanisterKV(
    "decent_color_palettes",
    []
  );
  reactExports.useEffect(() => {
    setPalette(generatePalette(baseColor, harmony));
  }, [baseColor, harmony]);
  const copyHex = (hex, idx) => {
    navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
    ue.success(`Copied ${hex}`);
  };
  const savePalette = () => {
    const entry = {
      id: Date.now().toString(),
      name: `${harmony} – ${baseColor}`,
      colors: palette,
      harmony
    };
    const next = [entry, ...saved].slice(0, 20);
    setSavedChain(next);
    ue.success("Palette saved!");
  };
  const deleteSaved = (id) => {
    const next = saved.filter((p) => p.id !== id);
    setSavedChain(next);
  };
  const exportCSS = () => {
    const css = palette.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n");
    const blob = new Blob([`:root {
${css}
}`], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.css";
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportJSON = () => {
    const data = JSON.stringify(
      { harmony, base: baseColor, colors: palette },
      null,
      2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: "rgba(8,12,18,0.97)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 flex flex-wrap items-center gap-3 px-3 py-2",
            style: {
              borderBottom: "1px solid rgba(39,215,224,0.15)",
              background: "rgba(10,16,22,0.95)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "w-4 h-4", style: { color: "var(--os-accent)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold tracking-wider",
                    style: { color: "var(--os-accent)" },
                    children: "COLOR PALETTE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-secondary)" },
                    children: "Base"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: baseColor,
                    onChange: (e) => setBaseColor(e.target.value),
                    "data-ocid": "colorpalette.base.input",
                    className: "w-7 h-7 rounded cursor-pointer",
                    style: { padding: 0, border: "2px solid rgba(39,215,224,0.3)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] font-mono",
                    style: { color: "var(--os-text-secondary)" },
                    children: baseColor.toUpperCase()
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1", children: HARMONIES.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setHarmony(h.id),
                  "data-ocid": `colorpalette.${h.id}.tab`,
                  className: "px-2 py-1 rounded text-[10px] font-medium transition-all",
                  style: harmony === h.id ? {
                    background: "rgba(39,215,224,0.25)",
                    border: "1px solid rgba(39,215,224,0.6)",
                    color: "var(--os-accent)"
                  } : {
                    background: "transparent",
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-secondary)"
                  },
                  children: h.label
                },
                h.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: savePalette,
                    "data-ocid": "colorpalette.save.button",
                    className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all",
                    style: BTN_STYLE,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3 h-3" }),
                      "Save"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: exportCSS,
                    "data-ocid": "colorpalette.export.button",
                    className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all",
                    style: BTN_STYLE,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                      "CSS"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: exportJSON,
                    "data-ocid": "colorpalette.export_json.button",
                    className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all",
                    style: BTN_STYLE,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                      "JSON"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-[10px] tracking-widest mb-3 font-semibold",
                style: { color: "rgba(39,215,224,0.6)" },
                children: [
                  "PALETTE \\u2014 ",
                  harmony.toUpperCase()
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 h-32", children: palette.map((color, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => copyHex(color, i),
                "data-ocid": `colorpalette.item.${i + 1}`,
                className: "flex-1 rounded-lg flex flex-col items-center justify-end pb-2 gap-1 transition-all hover:scale-105 active:scale-95 relative",
                style: {
                  background: color,
                  border: "2px solid var(--os-text-muted)",
                  cursor: "pointer"
                },
                children: [
                  copiedIdx === i ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 absolute top-2 right-2 text-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3 absolute top-2 right-2 opacity-50 text-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] font-mono font-bold",
                      style: {
                        color: "rgba(0,0,0,0.7)",
                        textShadow: "0 1px 2px var(--os-text-secondary)"
                      },
                      children: color.toUpperCase()
                    }
                  )
                ]
              },
              `${harmony}-${color}`
            )) })
          ] }),
          saved.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[10px] tracking-widest mb-3 font-semibold",
                style: { color: "rgba(39,215,224,0.6)" },
                children: "SAVED PALETTES"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: saved.map((p, pidx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `colorpalette.saved.item.${pidx + 1}`,
                className: "flex items-center gap-3 p-2 rounded-lg",
                style: {
                  background: "rgba(39,215,224,0.04)",
                  border: "1px solid rgba(39,215,224,0.1)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: p.colors.map((c, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-5 h-5 rounded",
                      style: { background: c }
                    },
                    `${p.id}-${ci}`
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "flex-1 text-xs",
                      style: { color: "var(--os-text-secondary)" },
                      children: p.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => deleteSaved(p.id),
                      "data-ocid": `colorpalette.delete_button.${pidx + 1}`,
                      className: "w-6 h-6 rounded flex items-center justify-center transition-all hover:bg-red-900/30",
                      style: { color: "var(--os-text-muted)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                    }
                  )
                ]
              },
              p.id
            )) })
          ] })
        ] })
      ]
    }
  );
}
export {
  ColorPaletteGenerator
};
