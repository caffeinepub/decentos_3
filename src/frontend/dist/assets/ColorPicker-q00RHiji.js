import { r as reactExports, j as jsxRuntimeExports, m as Copy, g as ue } from "./index-CZGIn5x2.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { S as Slider } from "./slider-Dqduz-Nj.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
import "./index-IXOTxK3N.js";
import "./index-DxR-hlVQ.js";
import "./index-DfmnWLAm.js";
import "./index-CY_eMQHg.js";
import "./index-9Nd72esH.js";
import "./index-DTcg9m71.js";
import "./index-B9-lQkRo.js";
import "./index-D8sJW3Ik.js";
const PALETTE_KEY = "colorpicker-palette";
const HISTORY_KEY = "colorpicker-history";
const MAX_PALETTE = 16;
const MAX_HISTORY = 12;
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}
function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}
function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}
function hslToRgb(h, s, l) {
  const hn = h / 360;
  const sn = s / 100;
  const ln = l / 100;
  let r;
  let g;
  let b;
  if (sn === 0) {
    r = g = b = ln;
  } else {
    const hue2rgb = (p2, q2, t) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p2 + (q2 - p2) * 6 * tt;
      if (tt < 1 / 2) return q2;
      if (tt < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - tt) * 6;
      return p2;
    };
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
    const p = 2 * ln - q;
    r = hue2rgb(p, q, hn + 1 / 3);
    g = hue2rgb(p, q, hn);
    b = hue2rgb(p, q, hn - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
function ColorPicker({ windowProps: _windowProps }) {
  const { data: palette, set: setPaletteKV } = useCanisterKV(
    PALETTE_KEY,
    []
  );
  const { data: history, set: setHistoryKV } = useCanisterKV(
    HISTORY_KEY,
    []
  );
  const [color, setColor] = reactExports.useState("#27D7E0");
  const [activeTab, setActiveTab] = reactExports.useState("rgb");
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hexStr = color.toUpperCase();
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const copyValue = (value) => {
    navigator.clipboard.writeText(value);
    ue.success(`Copied: ${value}`, { duration: 1500 });
  };
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      if (!history.includes(color)) {
        const newHistory = [color, ...history].slice(0, MAX_HISTORY);
        setHistoryKV(newHistory);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [color]);
  const updateRgb = (r, g, b) => {
    setColor(rgbToHex(r, g, b));
  };
  const updateHsl = (h, s, l) => {
    const { r, g, b } = hslToRgb(h, s, l);
    setColor(rgbToHex(r, g, b));
  };
  const addToPalette = () => {
    if (palette.includes(color)) {
      ue("Already in palette");
      return;
    }
    if (palette.length >= MAX_PALETTE) {
      ue.error("Palette full");
      return;
    }
    setPaletteKV([...palette, color]);
    ue.success("Color saved to palette");
  };
  const removeFromPalette = (c) => setPaletteKV(palette.filter((x) => x !== c));
  const cellStyle = {
    background: "rgba(20,32,42,0.6)",
    border: "1px solid rgba(39,215,224,0.12)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "colorpicker.panel",
      className: "flex flex-col h-full overflow-y-auto text-foreground",
      style: {
        background: "rgba(11,15,18,0.6)",
        padding: 14,
        gap: 12,
        display: "flex",
        flexDirection: "column"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-sm font-semibold flex-shrink-0",
            style: { color: "rgb(39,215,224)" },
            children: "🎨 Color Picker"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-xl flex-shrink-0 cursor-pointer",
              style: {
                background: color,
                border: "2px solid var(--os-text-muted)",
                boxShadow: `0 0 20px ${color}44`
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "color",
                  value: color,
                  onChange: (e) => setColor(e.target.value),
                  "data-ocid": "colorpicker.input",
                  className: "w-8 h-7 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: hexStr,
                  onChange: (e) => {
                    const v = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor(v);
                  },
                  "data-ocid": "colorpicker.search_input",
                  className: "text-xs px-2 py-1 rounded border outline-none font-mono flex-1",
                  style: {
                    background: "rgba(20,30,38,0.8)",
                    border: "1px solid rgba(39,215,224,0.25)",
                    color: "#E8EEF2"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [
              ["HEX", hexStr],
              ["RGB", rgbStr],
              ["HSL", hslStr]
            ].map(([label, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => copyValue(val),
                "data-ocid": "colorpicker.secondary_button",
                className: "flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono transition-all hover:opacity-80",
                style: {
                  background: "rgba(39,215,224,0.12)",
                  color: "rgb(39,215,224)",
                  border: "1px solid rgba(39,215,224,0.2)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-2.5 h-2.5" }),
                  label
                ]
              },
              label
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-3 flex-shrink-0", style: cellStyle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-3", children: ["rgb", "hsl"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab(t),
              className: "px-3 py-0.5 rounded text-xs font-mono transition-all",
              style: {
                background: activeTab === t ? "rgba(39,215,224,0.2)" : "transparent",
                color: activeTab === t ? "rgb(39,215,224)" : "var(--os-text-secondary)",
                border: `1px solid ${activeTab === t ? "rgba(39,215,224,0.4)" : "transparent"}`
              },
              children: t.toUpperCase()
            },
            t
          )) }),
          activeTab === "rgb" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: [
            {
              label: "R",
              value: rgb.r,
              max: 255,
              gradient: "linear-gradient(to right, #000, #ff0000)",
              update: (v) => updateRgb(v, rgb.g, rgb.b)
            },
            {
              label: "G",
              value: rgb.g,
              max: 255,
              gradient: "linear-gradient(to right, #000, #00ff00)",
              update: (v) => updateRgb(rgb.r, v, rgb.b)
            },
            {
              label: "B",
              value: rgb.b,
              max: 255,
              gradient: "linear-gradient(to right, #000, #0000ff)",
              update: (v) => updateRgb(rgb.r, rgb.g, v)
            }
          ].map(({ label, value, max, update }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-mono w-3",
                style: { color: "var(--os-text-secondary)" },
                children: label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Slider,
              {
                value: [value],
                min: 0,
                max,
                step: 1,
                onValueChange: ([v]) => update(v)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-mono w-6 text-right",
                style: { color: "var(--os-text-secondary)" },
                children: value
              }
            )
          ] }, label)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: [
            {
              label: "H",
              value: hsl.h,
              max: 360,
              update: (v) => updateHsl(v, hsl.s, hsl.l)
            },
            {
              label: "S",
              value: hsl.s,
              max: 100,
              update: (v) => updateHsl(hsl.h, v, hsl.l)
            },
            {
              label: "L",
              value: hsl.l,
              max: 100,
              update: (v) => updateHsl(hsl.h, hsl.s, v)
            }
          ].map(({ label, value, max, update }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-mono w-3",
                style: { color: "var(--os-text-secondary)" },
                children: label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Slider,
              {
                value: [value],
                min: 0,
                max,
                step: 1,
                onValueChange: ([v]) => update(v)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[10px] font-mono w-6 text-right",
                style: { color: "var(--os-text-secondary)" },
                children: [
                  value,
                  label !== "H" ? "%" : "°"
                ]
              }
            )
          ] }, label)) })
        ] }),
        history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[10px] font-medium uppercase tracking-wider mb-1.5",
              style: { color: "var(--os-text-muted)" },
              children: "Recent"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: history.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              title: c.toUpperCase(),
              onClick: () => setColor(c),
              "data-ocid": `colorpicker.item.${i + 1}`,
              className: "w-6 h-6 rounded-md border transition-all hover:scale-110",
              style: {
                background: c,
                borderColor: c === color ? "var(--os-text-primary)" : "var(--os-text-muted)"
              }
            },
            c
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-medium uppercase tracking-wider",
                style: { color: "var(--os-text-muted)" },
                children: "Saved Palette"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-5 text-[10px] px-2",
                onClick: addToPalette,
                "data-ocid": "colorpicker.save_button",
                children: "+ Save"
              }
            )
          ] }),
          palette.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[11px] text-center py-3",
              style: { color: "var(--os-text-muted)" },
              children: "No colors saved yet"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: palette.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              title: `${c.toUpperCase()} — double-click to remove`,
              onClick: () => setColor(c),
              onDoubleClick: () => removeFromPalette(c),
              "data-ocid": "colorpicker.toggle",
              className: "w-7 h-7 rounded-lg border-2 transition-all hover:scale-110",
              style: {
                background: c,
                borderColor: c === color ? "var(--os-text-primary)" : "transparent"
              }
            },
            c
          )) }),
          palette.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-[10px] mt-1",
              style: { color: "var(--os-text-muted)" },
              children: "Double-click to remove"
            }
          )
        ] })
      ]
    }
  );
}
export {
  ColorPicker
};
