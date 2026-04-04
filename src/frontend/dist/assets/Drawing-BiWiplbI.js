import { c as createLucideIcon, i as useActor, r as reactExports, g as ue, j as jsxRuntimeExports, T as Trash2, L as LoaderCircle } from "./index-8tMpYjTW.js";
import { u as useBlobStorage, C as Cloud } from "./useBlobStorage-DlbSabeR.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { R as RotateCcw } from "./rotate-ccw-CbOiKPu8.js";
import { D as Download } from "./download-BCO-vDCJ.js";
import { M as Minus } from "./minus-CGR_xxir.js";
import { S as Square } from "./square-CG7Mjh8J.js";
import { C as Circle } from "./circle-hWBTDN2v.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z",
      key: "nt11vn"
    }
  ],
  [
    "path",
    {
      d: "m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18",
      key: "15qc1e"
    }
  ],
  ["path", { d: "m2.3 2.3 7.286 7.286", key: "1wuzzi" }],
  ["circle", { cx: "11", cy: "11", r: "2", key: "xmgehs" }]
];
const PenTool = createLucideIcon("pen-tool", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", key: "1p45f6" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }]
];
const RotateCw = createLucideIcon("rotate-cw", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 4v16", key: "1654pz" }],
  ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2", key: "e0r10z" }],
  ["path", { d: "M9 20h6", key: "s66wpe" }]
];
const Type = createLucideIcon("type", __iconNode);
const PRESET_COLORS = [
  "#27D7E0",
  "#3B82F6",
  "var(--os-text-primary)",
  "#000000",
  "#EF4444",
  "#22C55E",
  "#FACC15",
  "#F97316"
];
const TOOLS = [
  { id: "pen", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PenTool, { className: "w-4 h-4" }), label: "Pen" },
  { id: "eraser", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" }), label: "Eraser" },
  { id: "line", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" }), label: "Line" },
  { id: "rect", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-4 h-4" }), label: "Rect" },
  { id: "circle", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "w-4 h-4" }), label: "Circle" },
  { id: "text", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "w-4 h-4" }), label: "Text" }
];
const TEXT_FONT_SIZES = [
  { label: "S", size: 14 },
  { label: "M", size: 20 },
  { label: "L", size: 28 }
];
function Drawing() {
  const { actor } = useActor();
  const { upload, isUploading: isSavingToFiles } = useBlobStorage();
  const { data: savedDrawing, set: setSavedDrawing } = useCanisterKV(
    "decentos_drawing",
    ""
  );
  const savedDrawingRef = reactExports.useRef(savedDrawing);
  savedDrawingRef.current = savedDrawing;
  const setSavedDrawingRef = reactExports.useRef(setSavedDrawing);
  setSavedDrawingRef.current = setSavedDrawing;
  const canvasRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const isDrawing = reactExports.useRef(false);
  const lastPos = reactExports.useRef({ x: 0, y: 0 });
  const snapshotRef = reactExports.useRef(null);
  const history = reactExports.useRef([]);
  const toolRef = reactExports.useRef("pen");
  const colorRef = reactExports.useRef("#27D7E0");
  const strokeWidthRef = reactExports.useRef(3);
  const textSizeRef = reactExports.useRef(20);
  const [tool, setToolState] = reactExports.useState("pen");
  const [color, setColorState] = reactExports.useState("#27D7E0");
  const [strokeWidth, setStrokeWidthState] = reactExports.useState(3);
  const [historyLen, setHistoryLen] = reactExports.useState(0);
  const [showClearConfirm, setShowClearConfirm] = reactExports.useState(false);
  const redoStack = reactExports.useRef([]);
  const [textFontSizeLabel, setTextFontSizeLabel] = reactExports.useState("M");
  const [textOverlay, setTextOverlay] = reactExports.useState(null);
  const textareaRef = reactExports.useRef(null);
  const setTool = (t) => {
    toolRef.current = t;
    setToolState(t);
    setTextOverlay(null);
  };
  const setColor = (c) => {
    colorRef.current = c;
    setColorState(c);
  };
  const setStrokeWidth = (w) => {
    strokeWidthRef.current = w;
    setStrokeWidthState(w);
  };
  const saveSnapshot = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    history.current = [...history.current.slice(-19), snap];
    redoStack.current = [];
    setHistoryLen(history.current.length);
  }, []);
  const redo = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || redoStack.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const next = redoStack.current[redoStack.current.length - 1];
    redoStack.current = redoStack.current.slice(0, -1);
    history.current = [...history.current, next];
    ctx.putImageData(next, 0, 0);
    setHistoryLen(history.current.length);
  }, []);
  const undo = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const last = history.current[history.current.length - 1];
    if (last) redoStack.current = [...redoStack.current.slice(-19), last];
    const newHistory = history.current.slice(0, -1);
    history.current = newHistory;
    if (newHistory.length > 0) {
      ctx.putImageData(newHistory[newHistory.length - 1], 0, 0);
    } else {
      ctx.fillStyle = "#0B0F12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setHistoryLen(history.current.length);
  }, []);
  const clearCanvas = reactExports.useCallback(() => {
    setShowClearConfirm(true);
  }, []);
  const confirmClear = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    saveSnapshot();
    ctx.fillStyle = "#0B0F12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setShowClearConfirm(false);
  }, [saveSnapshot]);
  const exportPng = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);
  const saveToFiles = reactExports.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !actor) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        const timestamp = Date.now();
        const { url } = await upload(blob);
        await actor.saveFileMetadata({
          url,
          name: `drawing-${timestamp}.png`,
          size: BigInt(blob.size),
          mimeType: "image/png"
        });
        ue.success("Saved to Files u2713");
      } catch (e) {
        console.error("Save to files failed", e);
        ue.error("Save to Files failed");
      }
    }, "image/png");
  }, [actor, upload]);
  const initCanvas = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const existing = canvas.width > 0 ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);
    ctx.fillStyle = "#0B0F12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (existing) ctx.putImageData(existing, 0, 0);
  }, []);
  const commitText = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !textOverlay || !textOverlay.value.trim()) {
      setTextOverlay(null);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    saveSnapshot();
    ctx.font = `${textSizeRef.current}px sans-serif`;
    ctx.fillStyle = colorRef.current;
    ctx.globalCompositeOperation = "source-over";
    const lines = textOverlay.value.split("\n");
    lines.forEach((line, i) => {
      ctx.fillText(
        line,
        textOverlay.x,
        textOverlay.y + i * textSizeRef.current * 1.3
      );
    });
    setTextOverlay(null);
  }, [textOverlay, saveSnapshot]);
  reactExports.useEffect(() => {
    if (textOverlay && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textOverlay]);
  reactExports.useEffect(() => {
    const handleKeyboard = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "z" && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [undo, redo]);
  reactExports.useEffect(() => {
    initCanvas();
    const observer = new ResizeObserver(initCanvas);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [initCanvas]);
  const savedLoadedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (savedLoadedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas || !savedDrawingRef.current) return;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0);
    };
    img.src = savedDrawingRef.current;
    savedLoadedRef.current = true;
  }, []);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseDown = (e) => {
      e.preventDefault();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const currentTool = toolRef.current;
      if (currentTool === "text") {
        const pos2 = getPos(e);
        setTextOverlay({ x: pos2.x, y: pos2.y, value: "" });
        return;
      }
      isDrawing.current = true;
      const pos = getPos(e);
      lastPos.current = pos;
      if (currentTool === "pen" || currentTool === "eraser") {
        saveSnapshot();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      } else {
        snapshotRef.current = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        saveSnapshot();
      }
    };
    const onMouseMove = (e) => {
      if (!isDrawing.current) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const pos = getPos(e);
      const currentTool = toolRef.current;
      const currentColor = colorRef.current;
      const currentWidth = strokeWidthRef.current;
      if (currentTool === "pen") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPos.current = pos;
      } else if (currentTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = currentWidth * 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPos.current = pos;
      } else if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentWidth;
        ctx.lineCap = "round";
        const start = lastPos.current;
        if (currentTool === "line") {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        } else if (currentTool === "rect") {
          ctx.beginPath();
          ctx.strokeRect(start.x, start.y, pos.x - start.x, pos.y - start.y);
        } else if (currentTool === "circle") {
          const rx = Math.abs(pos.x - start.x) / 2;
          const ry = Math.abs(pos.y - start.y) / 2;
          const cx = start.x + (pos.x - start.x) / 2;
          const cy = start.y + (pos.y - start.y) / 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };
    const onMouseUp = () => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.globalCompositeOperation = "source-over";
      snapshotRef.current = null;
      const dataUrl = canvas.toDataURL("image/png");
      setSavedDrawingRef.current(dataUrl);
    };
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
    };
  }, [saveSnapshot]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--os-bg-app)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-2 flex-shrink-0 flex-wrap",
            style: {
              background: "rgba(13,22,32,0.95)",
              borderBottom: "1px solid rgba(39,215,224,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: TOOLS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  title: t.label,
                  onClick: () => setTool(t.id),
                  "data-ocid": `drawing.${t.id}.toggle`,
                  className: "w-7 h-7 rounded flex items-center justify-center transition-colors text-xs font-medium",
                  style: {
                    background: tool === t.id ? "rgba(39,215,224,0.2)" : "transparent",
                    color: tool === t.id ? "#27D7E0" : "var(--os-text-secondary)",
                    border: tool === t.id ? "1px solid rgba(39,215,224,0.5)" : "1px solid transparent"
                  },
                  children: t.icon
                },
                t.id
              )) }),
              tool === "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-secondary)" },
                    children: "Size"
                  }
                ),
                TEXT_FONT_SIZES.map((fs) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      textSizeRef.current = fs.size;
                      setTextFontSizeLabel(fs.label);
                    },
                    "data-ocid": `drawing.textsize_${fs.label.toLowerCase()}.toggle`,
                    className: "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all",
                    style: {
                      background: textFontSizeLabel === fs.label ? "rgba(39,215,224,0.2)" : "transparent",
                      color: textFontSizeLabel === fs.label ? "#27D7E0" : "var(--os-text-secondary)",
                      border: textFontSizeLabel === fs.label ? "1px solid rgba(39,215,224,0.5)" : "1px solid transparent"
                    },
                    children: fs.label
                  },
                  fs.label
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { width: 1, height: 20, background: "var(--os-text-muted)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                PRESET_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setColor(c),
                    "data-ocid": "drawing.color.toggle",
                    className: "w-5 h-5 rounded-full transition-all",
                    style: {
                      background: c,
                      border: color === c ? "2px solid #27D7E0" : "2px solid var(--os-text-muted)",
                      transform: color === c ? "scale(1.2)" : "scale(1)"
                    }
                  },
                  c
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: color,
                    onChange: (e) => setColor(e.target.value),
                    "data-ocid": "drawing.color.input",
                    className: "w-5 h-5 rounded cursor-pointer",
                    style: {
                      padding: 0,
                      border: "2px solid var(--os-text-muted)",
                      background: "none"
                    },
                    title: "Custom color"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { width: 1, height: 20, background: "var(--os-text-muted)" }
                }
              ),
              tool !== "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: "Size" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 1,
                    max: 20,
                    value: strokeWidth,
                    onChange: (e) => setStrokeWidth(Number(e.target.value)),
                    "data-ocid": "drawing.stroke.input",
                    className: "w-20 h-1 accent-cyan-400"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground w-4", children: strokeWidth })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { width: 1, height: 20, background: "var(--os-text-muted)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: undo,
                  disabled: historyLen === 0,
                  "data-ocid": "drawing.undo.button",
                  title: "Undo (Ctrl+Z)",
                  className: "w-7 h-7 rounded flex items-center justify-center transition-colors",
                  style: {
                    background: "transparent",
                    color: historyLen > 0 ? "var(--os-text-secondary)" : "var(--os-text-muted)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: redo,
                  disabled: redoStack.current.length === 0,
                  "data-ocid": "drawing.redo.button",
                  title: "Redo (Ctrl+Y)",
                  className: "w-7 h-7 rounded flex items-center justify-center transition-colors",
                  style: {
                    background: "transparent",
                    color: redoStack.current.length > 0 ? "var(--os-text-secondary)" : "var(--os-text-muted)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: clearCanvas,
                  "data-ocid": "drawing.delete_button",
                  title: "Clear canvas",
                  className: "w-7 h-7 rounded flex items-center justify-center transition-colors",
                  style: {
                    background: "transparent",
                    color: "var(--os-text-secondary)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: exportPng,
                  "data-ocid": "drawing.export.button",
                  title: "Export PNG",
                  className: "flex items-center gap-1 px-2 h-7 rounded text-[10px] font-medium transition-colors",
                  style: {
                    background: "rgba(39,215,224,0.1)",
                    color: "var(--os-accent)",
                    border: "1px solid rgba(39,215,224,0.3)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                    "Export PNG"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: saveToFiles,
                  disabled: isSavingToFiles,
                  "data-ocid": "drawing.save_to_files.button",
                  title: "Save to Cloud Files",
                  className: "flex items-center gap-1 px-2 h-7 rounded text-[10px] font-medium transition-colors",
                  style: {
                    background: "rgba(59,130,246,0.1)",
                    color: "#3B82F6",
                    border: "1px solid rgba(59,130,246,0.3)"
                  },
                  children: [
                    isSavingToFiles ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "w-3 h-3" }),
                    "Save to Files"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "flex-1 relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              "data-ocid": "drawing.canvas_target",
              style: {
                display: "block",
                cursor: tool === "text" ? "text" : tool === "eraser" ? "cell" : "crosshair",
                width: "100%",
                height: "100%"
              }
            }
          ),
          textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: textareaRef,
              value: textOverlay.value,
              onChange: (e) => setTextOverlay(
                (prev) => prev ? { ...prev, value: e.target.value } : null
              ),
              onBlur: commitText,
              onKeyDown: (e) => {
                if (e.key === "Escape") {
                  setTextOverlay(null);
                } else if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  commitText();
                }
              },
              "data-ocid": "drawing.text.input",
              className: "absolute resize-none outline-none rounded",
              style: {
                left: textOverlay.x,
                top: textOverlay.y - textSizeRef.current,
                minWidth: 80,
                minHeight: textSizeRef.current * 1.5,
                fontSize: textSizeRef.current,
                fontFamily: "sans-serif",
                color,
                background: "rgba(0,0,0,0.4)",
                border: "1px dashed rgba(39,215,224,0.5)",
                padding: "2px 4px",
                lineHeight: 1.3
              },
              placeholder: "Type here..."
            }
          ),
          tool === "text" && !textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] pointer-events-none",
              style: {
                background: "rgba(0,0,0,0.6)",
                color: "var(--os-text-secondary)",
                border: "1px solid rgba(39,215,224,0.2)"
              },
              children: "Click anywhere on canvas to add text"
            }
          )
        ] }),
        showClearConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              backdropFilter: "blur(4px)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "rgba(12,20,30,0.98)",
                  border: "1px solid rgba(39,215,224,0.25)",
                  borderRadius: 12,
                  padding: "28px 32px",
                  textAlign: "center",
                  maxWidth: 320,
                  boxShadow: "0 0 40px rgba(0,0,0,0.8)"
                },
                "data-ocid": "drawing.dialog",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TriangleAlert,
                    {
                      className: "w-8 h-8 mx-auto mb-3",
                      style: { color: "#FACC15" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      style: {
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#E8EEF2",
                        marginBottom: 8
                      },
                      children: "Clear Canvas?"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      style: {
                        fontSize: 13,
                        color: "var(--os-text-secondary)",
                        marginBottom: 24
                      },
                      children: "This will erase all content on the canvas. This action can be undone."
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: confirmClear,
                        style: {
                          flex: 1,
                          background: "rgba(239,68,68,0.15)",
                          border: "1px solid rgba(239,68,68,0.4)",
                          color: "#f87171",
                          borderRadius: 7,
                          padding: "8px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer"
                        },
                        "data-ocid": "drawing.confirm_button",
                        children: "Clear"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowClearConfirm(false),
                        style: {
                          flex: 1,
                          background: "var(--os-border-subtle)",
                          border: "1px solid var(--os-text-muted)",
                          color: "var(--os-text-secondary)",
                          borderRadius: 7,
                          padding: "8px 16px",
                          fontSize: 13,
                          cursor: "pointer"
                        },
                        "data-ocid": "drawing.cancel_button",
                        children: "Cancel"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  Drawing
};
