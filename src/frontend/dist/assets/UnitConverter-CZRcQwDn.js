import { r as reactExports, j as jsxRuntimeExports, am as ArrowLeftRight } from "./index-CZGIn5x2.js";
const UNITS = {
  Length: [
    { label: "Meters (m)", toBase: (v) => v, fromBase: (v) => v },
    {
      label: "Kilometers (km)",
      toBase: (v) => v * 1e3,
      fromBase: (v) => v / 1e3
    },
    {
      label: "Miles (mi)",
      toBase: (v) => v * 1609.344,
      fromBase: (v) => v / 1609.344
    },
    {
      label: "Feet (ft)",
      toBase: (v) => v * 0.3048,
      fromBase: (v) => v / 0.3048
    },
    {
      label: "Inches (in)",
      toBase: (v) => v * 0.0254,
      fromBase: (v) => v / 0.0254
    },
    {
      label: "Centimeters (cm)",
      toBase: (v) => v / 100,
      fromBase: (v) => v * 100
    },
    {
      label: "Millimeters (mm)",
      toBase: (v) => v / 1e3,
      fromBase: (v) => v * 1e3
    },
    {
      label: "Yards (yd)",
      toBase: (v) => v * 0.9144,
      fromBase: (v) => v / 0.9144
    },
    {
      label: "Nautical Miles (nmi)",
      toBase: (v) => v * 1852,
      fromBase: (v) => v / 1852
    }
  ],
  Weight: [
    { label: "Kilograms (kg)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Grams (g)", toBase: (v) => v / 1e3, fromBase: (v) => v * 1e3 },
    {
      label: "Pounds (lb)",
      toBase: (v) => v * 0.453592,
      fromBase: (v) => v / 0.453592
    },
    {
      label: "Ounces (oz)",
      toBase: (v) => v * 0.0283495,
      fromBase: (v) => v / 0.0283495
    },
    {
      label: "Metric Tons (t)",
      toBase: (v) => v * 1e3,
      fromBase: (v) => v / 1e3
    },
    {
      label: "Stone (st)",
      toBase: (v) => v * 6.35029,
      fromBase: (v) => v / 6.35029
    }
  ],
  Temperature: [
    { label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
    {
      label: "Fahrenheit (°F)",
      toBase: (v) => (v - 32) * 5 / 9,
      fromBase: (v) => v * 9 / 5 + 32
    },
    {
      label: "Kelvin (K)",
      toBase: (v) => v - 273.15,
      fromBase: (v) => v + 273.15
    }
  ],
  Speed: [
    { label: "m/s", toBase: (v) => v, fromBase: (v) => v },
    { label: "km/h", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { label: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    {
      label: "knots",
      toBase: (v) => v * 0.514444,
      fromBase: (v) => v / 0.514444
    },
    { label: "ft/s", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    {
      label: "Mach (sea level)",
      toBase: (v) => v * 340.29,
      fromBase: (v) => v / 340.29
    }
  ],
  Pressure: [
    { label: "Pascal (Pa)", toBase: (v) => v, fromBase: (v) => v },
    {
      label: "Kilopascal (kPa)",
      toBase: (v) => v * 1e3,
      fromBase: (v) => v / 1e3
    },
    { label: "Bar", toBase: (v) => v * 1e5, fromBase: (v) => v / 1e5 },
    { label: "PSI", toBase: (v) => v * 6894.76, fromBase: (v) => v / 6894.76 },
    {
      label: "Atmosphere (atm)",
      toBase: (v) => v * 101325,
      fromBase: (v) => v / 101325
    },
    {
      label: "mmHg (Torr)",
      toBase: (v) => v * 133.322,
      fromBase: (v) => v / 133.322
    }
  ],
  Energy: [
    { label: "Joules (J)", toBase: (v) => v, fromBase: (v) => v },
    {
      label: "Kilojoules (kJ)",
      toBase: (v) => v * 1e3,
      fromBase: (v) => v / 1e3
    },
    {
      label: "Calories (cal)",
      toBase: (v) => v * 4.184,
      fromBase: (v) => v / 4.184
    },
    {
      label: "Kilocalories (kcal)",
      toBase: (v) => v * 4184,
      fromBase: (v) => v / 4184
    },
    {
      label: "Watt-hours (Wh)",
      toBase: (v) => v * 3600,
      fromBase: (v) => v / 3600
    },
    { label: "kWh", toBase: (v) => v * 36e5, fromBase: (v) => v / 36e5 },
    { label: "BTU", toBase: (v) => v * 1055.06, fromBase: (v) => v / 1055.06 },
    {
      label: "Electronvolt (eV)",
      toBase: (v) => v * 16022e-23,
      fromBase: (v) => v / 16022e-23
    }
  ],
  Data: [
    { label: "Bytes (B)", toBase: (v) => v, fromBase: (v) => v },
    {
      label: "Kilobytes (KB)",
      toBase: (v) => v * 1024,
      fromBase: (v) => v / 1024
    },
    {
      label: "Megabytes (MB)",
      toBase: (v) => v * 1024 ** 2,
      fromBase: (v) => v / 1024 ** 2
    },
    {
      label: "Gigabytes (GB)",
      toBase: (v) => v * 1024 ** 3,
      fromBase: (v) => v / 1024 ** 3
    },
    {
      label: "Terabytes (TB)",
      toBase: (v) => v * 1024 ** 4,
      fromBase: (v) => v / 1024 ** 4
    },
    { label: "Bits (b)", toBase: (v) => v / 8, fromBase: (v) => v * 8 }
  ]
};
const CATEGORIES = [
  "Length",
  "Weight",
  "Temperature",
  "Speed",
  "Pressure",
  "Energy",
  "Data"
];
const CATEGORY_ICONS = {
  Length: "📏",
  Weight: "⚖️",
  Temperature: "🌡️",
  Speed: "💨",
  Pressure: "🔵",
  Energy: "⚡",
  Data: "💾"
};
function UnitConverter() {
  const [category, setCategory] = reactExports.useState("Length");
  const [fromIdx, setFromIdx] = reactExports.useState(0);
  const [toIdx, setToIdx] = reactExports.useState(1);
  const [input, setInput] = reactExports.useState("1");
  const units = UNITS[category];
  const convert = () => {
    const v = Number.parseFloat(input);
    if (Number.isNaN(v)) return "—";
    const base = units[fromIdx].toBase(v);
    const result = units[toIdx].fromBase(base);
    if (Math.abs(result) >= 1e9 || Math.abs(result) < 1e-4 && result !== 0)
      return result.toExponential(4);
    return Number(result.toFixed(6)).toString();
  };
  const swap = () => {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(11,15,18,0.6)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-shrink-0 px-3 pt-3 pb-0 overflow-x-auto",
            style: { scrollbarWidth: "none" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 min-w-max", children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setCategory(cat);
                  setFromIdx(0);
                  setToIdx(1);
                },
                "data-ocid": `converter.${cat.toLowerCase()}.tab`,
                className: "h-7 px-2.5 rounded text-[11px] transition-all flex items-center gap-1 flex-shrink-0",
                style: category === cat ? {
                  background: "rgba(6,182,212,0.15)",
                  border: "1px solid rgba(6,182,212,0.4)",
                  color: "rgba(6,182,212,1)"
                } : {
                  background: "var(--os-border-subtle)",
                  border: "1px solid rgba(42,58,66,0.5)",
                  color: "rgba(180,200,210,0.5)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: CATEGORY_ICONS[cat] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cat })
                ]
              },
              cat
            )) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4",
              style: {
                background: "rgba(18,32,38,0.7)",
                border: "1px solid rgba(42,58,66,0.8)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "block text-[10px] mb-2 uppercase tracking-widest",
                    style: { color: "rgba(6,182,212,0.6)" },
                    children: "From"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: fromIdx,
                    onChange: (e) => setFromIdx(Number(e.target.value)),
                    "data-ocid": "converter.select",
                    className: "w-full h-8 px-2 mb-3 rounded-md text-xs border outline-none",
                    style: {
                      background: "rgba(10,16,20,0.8)",
                      border: "1px solid rgba(42,58,66,0.8)",
                      color: "rgba(220,235,240,0.9)"
                    },
                    children: units.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i, children: u.label }, u.label))
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    "data-ocid": "converter.input",
                    className: "w-full h-10 px-3 rounded-md text-lg font-bold border outline-none",
                    style: {
                      background: "rgba(6,182,212,0.06)",
                      border: "1px solid rgba(6,182,212,0.25)",
                      color: "rgba(6,182,212,1)"
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: swap,
              "data-ocid": "converter.toggle",
              className: "w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110",
              style: {
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.3)"
              },
              title: "Swap units",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ArrowLeftRight,
                {
                  className: "w-4 h-4",
                  style: { color: "rgba(6,182,212,0.8)" }
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4",
              style: {
                background: "rgba(18,32,38,0.7)",
                border: "1px solid rgba(42,58,66,0.8)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "block text-[10px] mb-2 uppercase tracking-widest",
                    style: { color: "rgba(180,200,210,0.5)" },
                    children: "To"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: toIdx,
                    onChange: (e) => setToIdx(Number(e.target.value)),
                    "data-ocid": "converter.to.select",
                    className: "w-full h-8 px-2 mb-3 rounded-md text-xs border outline-none",
                    style: {
                      background: "rgba(10,16,20,0.8)",
                      border: "1px solid rgba(42,58,66,0.8)",
                      color: "rgba(220,235,240,0.9)"
                    },
                    children: units.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i, children: u.label }, u.label))
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full h-10 px-3 rounded-md text-lg font-bold border flex items-center",
                    style: {
                      background: "rgba(0,0,0,0.2)",
                      border: "1px solid rgba(42,58,66,0.5)",
                      color: "rgba(220,235,240,0.95)"
                    },
                    "data-ocid": "converter.success_state",
                    children: convert()
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-center text-[10px]",
              style: { color: "rgba(180,200,210,0.25)" },
              children: "All conversions happen locally — no network required"
            }
          )
        ] })
      ]
    }
  );
}
export {
  UnitConverter
};
