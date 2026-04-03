import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const PALETTE_KEY = "colorpicker-palette";
const HISTORY_KEY = "colorpicker-history";
const MAX_PALETTE = 16;
const MAX_HISTORY = 12;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
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
    l: Math.round(l * 100),
  };
}

function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  const hn = h / 360;
  const sn = s / 100;
  const ln = l / 100;
  let r: number;
  let g: number;
  let b: number;
  if (sn === 0) {
    r = g = b = ln;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
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
    b: Math.round(b * 255),
  };
}

interface ColorPickerProps {
  windowProps?: Record<string, unknown>;
}

export function ColorPicker({ windowProps: _windowProps }: ColorPickerProps) {
  const { data: palette, set: setPaletteKV } = useCanisterKV<string[]>(
    PALETTE_KEY,
    [],
  );
  const { data: history, set: setHistoryKV } = useCanisterKV<string[]>(
    HISTORY_KEY,
    [],
  );
  const [color, setColor] = useState("#27D7E0");
  const [activeTab, setActiveTab] = useState<"rgb" | "hsl">("rgb");

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const hexStr = color.toUpperCase();
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${value}`, { duration: 1500 });
  };

  // Add to history on color change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only trigger on color change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!history.includes(color)) {
        const newHistory = [color, ...history].slice(0, MAX_HISTORY);
        setHistoryKV(newHistory);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [color]);

  const updateRgb = (r: number, g: number, b: number) => {
    setColor(rgbToHex(r, g, b));
  };

  const updateHsl = (h: number, s: number, l: number) => {
    const { r, g, b } = hslToRgb(h, s, l);
    setColor(rgbToHex(r, g, b));
  };

  const addToPalette = () => {
    if (palette.includes(color)) {
      toast("Already in palette");
      return;
    }
    if (palette.length >= MAX_PALETTE) {
      toast.error("Palette full");
      return;
    }
    setPaletteKV([...palette, color]);
    toast.success("Color saved to palette");
  };

  const removeFromPalette = (c: string) =>
    setPaletteKV(palette.filter((x) => x !== c));

  const cellStyle = {
    background: "rgba(20,32,42,0.6)",
    border: "1px solid rgba(39,215,224,0.12)",
  };

  return (
    <div
      data-ocid="colorpicker.panel"
      className="flex flex-col h-full overflow-y-auto text-foreground"
      style={{
        background: "rgba(11,15,18,0.6)",
        padding: 14,
        gap: 12,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span
        className="text-sm font-semibold flex-shrink-0"
        style={{ color: "rgb(39,215,224)" }}
      >
        🎨 Color Picker
      </span>

      {/* Main color preview + input */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="w-16 h-16 rounded-xl flex-shrink-0 cursor-pointer"
          style={{
            background: color,
            border: "2px solid var(--os-text-muted)",
            boxShadow: `0 0 20px ${color}44`,
          }}
        />
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              data-ocid="colorpicker.input"
              className="w-8 h-7 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
            />
            <input
              type="text"
              value={hexStr}
              onChange={(e) => {
                const v = e.target.value.startsWith("#")
                  ? e.target.value
                  : `#${e.target.value}`;
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor(v);
              }}
              data-ocid="colorpicker.search_input"
              className="text-xs px-2 py-1 rounded border outline-none font-mono flex-1"
              style={{
                background: "rgba(20,30,38,0.8)",
                border: "1px solid rgba(39,215,224,0.25)",
                color: "#E8EEF2",
              }}
            />
          </div>
          {/* Quick copy buttons */}
          <div className="flex gap-1">
            {(
              [
                ["HEX", hexStr],
                ["RGB", rgbStr],
                ["HSL", hslStr],
              ] as [string, string][]
            ).map(([label, val]) => (
              <button
                key={label}
                type="button"
                onClick={() => copyValue(val)}
                data-ocid="colorpicker.secondary_button"
                className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono transition-all hover:opacity-80"
                style={{
                  background: "rgba(39,215,224,0.12)",
                  color: "rgb(39,215,224)",
                  border: "1px solid rgba(39,215,224,0.2)",
                }}
              >
                <Copy className="w-2.5 h-2.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="rounded-lg p-3 flex-shrink-0" style={cellStyle}>
        {/* Tab toggle */}
        <div className="flex gap-1 mb-3">
          {(["rgb", "hsl"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className="px-3 py-0.5 rounded text-xs font-mono transition-all"
              style={{
                background:
                  activeTab === t ? "rgba(39,215,224,0.2)" : "transparent",
                color:
                  activeTab === t
                    ? "rgb(39,215,224)"
                    : "var(--os-text-secondary)",
                border: `1px solid ${activeTab === t ? "rgba(39,215,224,0.4)" : "transparent"}`,
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === "rgb" ? (
          <div className="flex flex-col gap-3">
            {[
              {
                label: "R",
                value: rgb.r,
                max: 255,
                gradient: "linear-gradient(to right, #000, #ff0000)",
                update: (v: number) => updateRgb(v, rgb.g, rgb.b),
              },
              {
                label: "G",
                value: rgb.g,
                max: 255,
                gradient: "linear-gradient(to right, #000, #00ff00)",
                update: (v: number) => updateRgb(rgb.r, v, rgb.b),
              },
              {
                label: "B",
                value: rgb.b,
                max: 255,
                gradient: "linear-gradient(to right, #000, #0000ff)",
                update: (v: number) => updateRgb(rgb.r, rgb.g, v),
              },
            ].map(({ label, value, max, update }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono w-3"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  {label}
                </span>
                <div className="flex-1">
                  <Slider
                    value={[value]}
                    min={0}
                    max={max}
                    step={1}
                    onValueChange={([v]) => update(v)}
                  />
                </div>
                <span
                  className="text-[10px] font-mono w-6 text-right"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {[
              {
                label: "H",
                value: hsl.h,
                max: 360,
                update: (v: number) => updateHsl(v, hsl.s, hsl.l),
              },
              {
                label: "S",
                value: hsl.s,
                max: 100,
                update: (v: number) => updateHsl(hsl.h, v, hsl.l),
              },
              {
                label: "L",
                value: hsl.l,
                max: 100,
                update: (v: number) => updateHsl(hsl.h, hsl.s, v),
              },
            ].map(({ label, value, max, update }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono w-3"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  {label}
                </span>
                <div className="flex-1">
                  <Slider
                    value={[value]}
                    min={0}
                    max={max}
                    step={1}
                    onValueChange={([v]) => update(v)}
                  />
                </div>
                <span
                  className="text-[10px] font-mono w-6 text-right"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  {value}
                  {label !== "H" ? "%" : "°"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color history */}
      {history.length > 0 && (
        <div className="flex-shrink-0">
          <div
            className="text-[10px] font-medium uppercase tracking-wider mb-1.5"
            style={{ color: "var(--os-text-muted)" }}
          >
            Recent
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((c, i) => (
              <button
                key={c}
                type="button"
                title={c.toUpperCase()}
                onClick={() => setColor(c)}
                data-ocid={`colorpicker.item.${i + 1}`}
                className="w-6 h-6 rounded-md border transition-all hover:scale-110"
                style={{
                  background: c,
                  borderColor:
                    c === color
                      ? "var(--os-text-primary)"
                      : "var(--os-text-muted)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Saved palette */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: "var(--os-text-muted)" }}
          >
            Saved Palette
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 text-[10px] px-2"
            onClick={addToPalette}
            data-ocid="colorpicker.save_button"
          >
            + Save
          </Button>
        </div>
        {palette.length === 0 ? (
          <div
            className="text-[11px] text-center py-3"
            style={{ color: "var(--os-text-muted)" }}
          >
            No colors saved yet
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {palette.map((c) => (
              <button
                key={c}
                type="button"
                title={`${c.toUpperCase()} — double-click to remove`}
                onClick={() => setColor(c)}
                onDoubleClick={() => removeFromPalette(c)}
                data-ocid="colorpicker.toggle"
                className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110"
                style={{
                  background: c,
                  borderColor:
                    c === color ? "var(--os-text-primary)" : "transparent",
                }}
              />
            ))}
          </div>
        )}
        {palette.length > 0 && (
          <p
            className="text-[10px] mt-1"
            style={{ color: "var(--os-text-muted)" }}
          >
            Double-click to remove
          </p>
        )}
      </div>
    </div>
  );
}
