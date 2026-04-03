import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, l as Maximize2, e as ChevronLeft, f as ChevronRight } from "./index-CZGIn5x2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["circle", { cx: "10", cy: "12", r: "2", key: "737tya" }],
  ["path", { d: "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22", key: "wt3hpn" }]
];
const FileImage = createLucideIcon("file-image", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomIn = createLucideIcon("zoom-in", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomOut = createLucideIcon("zoom-out", __iconNode);
function ImageViewer() {
  const fileInputRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const [images, setImages] = reactExports.useState([]);
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [zoom, setZoom] = reactExports.useState(1);
  const [fitToWindow, setFitToWindow] = reactExports.useState(true);
  const [panOffset, setPanOffset] = reactExports.useState({ x: 0, y: 0 });
  const [meta, setMeta] = reactExports.useState(null);
  const [metaPanelOpen, setMetaPanelOpen] = reactExports.useState(true);
  const isPanning = reactExports.useRef(false);
  const panStart = reactExports.useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const current = images[currentIndex] ?? null;
  reactExports.useEffect(() => {
    setPanOffset({ x: 0, y: 0 });
    setZoom(1);
    setMeta(null);
  }, [currentIndex]);
  const handleFiles = reactExports.useCallback((e) => {
    const files = Array.from(e.target.files ?? []);
    const newImages = files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size,
      type: f.type
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (e.target) e.target.value = "";
  }, []);
  const handleImageLoad = reactExports.useCallback(
    (e) => {
      const img = e.currentTarget;
      setMeta({ width: img.naturalWidth, height: img.naturalHeight });
    },
    []
  );
  const applyZoom = reactExports.useCallback((delta) => {
    setFitToWindow(false);
    setZoom((z) => Math.min(5, Math.max(0.1, z + delta)));
  }, []);
  const handleWheel = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      applyZoom(e.deltaY < 0 ? 0.1 : -0.1);
    },
    [applyZoom]
  );
  const handleMouseDown = reactExports.useCallback(
    (e) => {
      isPanning.current = true;
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        ox: panOffset.x,
        oy: panOffset.y
      };
    },
    [panOffset]
  );
  const handleMouseMove = reactExports.useCallback((e) => {
    if (!isPanning.current) return;
    setPanOffset({
      x: panStart.current.ox + (e.clientX - panStart.current.x),
      y: panStart.current.oy + (e.clientY - panStart.current.y)
    });
  }, []);
  const handleMouseUp = reactExports.useCallback(() => {
    isPanning.current = false;
  }, []);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight")
        setCurrentIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setCurrentIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "+" || e.key === "=") applyZoom(0.2);
      if (e.key === "-") applyZoom(-0.2);
      if (e.key === "0") {
        setFitToWindow(true);
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length, applyZoom]);
  const fmtSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      className: "flex flex-col h-full bg-transparent text-foreground",
      "data-ocid": "imageviewer.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0",
            style: { borderColor: "rgba(39,215,224,0.15)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  "data-ocid": "imageviewer.upload_button",
                  className: "px-3 py-1 text-xs rounded border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-colors",
                  children: "Open File"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: "image/*",
                  multiple: true,
                  className: "hidden",
                  onChange: handleFiles
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-border mx-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => applyZoom(-0.2),
                  "data-ocid": "imageviewer.secondary_button",
                  className: "p-1 rounded hover:bg-white/8 transition-colors text-muted-foreground hover:text-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground w-12 text-center", children: fitToWindow ? "Fit" : `${Math.round(zoom * 100)}%` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => applyZoom(0.2),
                  "data-ocid": "imageviewer.button",
                  className: "p-1 rounded hover:bg-white/8 transition-colors text-muted-foreground hover:text-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setFitToWindow(true);
                    setZoom(1);
                    setPanOffset({ x: 0, y: 0 });
                  },
                  "data-ocid": "imageviewer.toggle",
                  className: "p-1 rounded hover:bg-white/8 transition-colors",
                  style: { color: fitToWindow ? "#27D7E0" : void 0 },
                  title: "Fit to window",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-4 h-4" })
                }
              ),
              current && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-muted-foreground truncate max-w-[180px]", children: current.name }),
              images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setCurrentIndex((i) => (i - 1 + images.length) % images.length),
                    "data-ocid": "imageviewer.pagination_prev",
                    className: "p-1 rounded hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  currentIndex + 1,
                  "/",
                  images.length
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setCurrentIndex((i) => (i + 1) % images.length),
                    "data-ocid": "imageviewer.pagination_next",
                    className: "p-1 rounded hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                  }
                )
              ] }),
              current && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setMetaPanelOpen((o) => !o),
                  "data-ocid": "imageviewer.secondary_button",
                  className: "p-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors ml-1",
                  children: "Info"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 overflow-hidden relative flex items-center justify-center",
              style: {
                cursor: fitToWindow ? "default" : "grab",
                background: "rgba(0,0,0,0.3)"
              },
              onWheel: handleWheel,
              onMouseDown: handleMouseDown,
              onMouseMove: handleMouseMove,
              onMouseUp: handleMouseUp,
              onMouseLeave: handleMouseUp,
              "data-ocid": "imageviewer.canvas_target",
              children: !current ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center gap-3",
                  "data-ocid": "imageviewer.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FileImage,
                      {
                        className: "w-16 h-16 opacity-20",
                        style: { color: "var(--os-accent)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Open an image file to view it" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          var _a;
                          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                        },
                        "data-ocid": "imageviewer.upload_button",
                        className: "mt-1 px-4 py-2 text-xs rounded border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-colors",
                        children: "Open File"
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: current.url,
                  alt: current.name,
                  onLoad: handleImageLoad,
                  style: {
                    transform: fitToWindow ? "none" : `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                    maxWidth: fitToWindow ? "100%" : "none",
                    maxHeight: fitToWindow ? "100%" : "none",
                    objectFit: fitToWindow ? "contain" : void 0,
                    userSelect: "none",
                    pointerEvents: "none",
                    transition: isPanning.current ? "none" : "transform 0.05s"
                  }
                }
              )
            }
          ),
          metaPanelOpen && current && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-44 flex-shrink-0 border-l p-3 flex flex-col gap-2 overflow-y-auto",
              style: { borderColor: "rgba(39,215,224,0.15)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] font-semibold tracking-widest uppercase",
                    style: { color: "var(--os-accent)" },
                    children: "Image Info"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wider", children: "Filename" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs break-all", children: current.name })
                  ] }),
                  meta && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wider", children: "Dimensions" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono", children: [
                      meta.width,
                      " × ",
                      meta.height
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wider", children: "Size" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono", children: fmtSize(current.size) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wider", children: "Type" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono", children: current.type || "image/*" })
                  ] })
                ] })
              ]
            }
          )
        ] }),
        images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex gap-1.5 px-2 py-1.5 overflow-x-auto border-t flex-shrink-0",
            style: { borderColor: "rgba(39,215,224,0.15)" },
            "data-ocid": "imageviewer.list",
            children: images.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setCurrentIndex(i),
                "data-ocid": `imageviewer.item.${i + 1}`,
                className: "flex-shrink-0 w-12 h-12 rounded overflow-hidden transition-all",
                style: {
                  border: i === currentIndex ? "2px solid #27D7E0" : "2px solid rgba(39,215,224,0.15)",
                  boxShadow: i === currentIndex ? "0 0 8px rgba(39,215,224,0.4)" : "none"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: img.url,
                    alt: img.name,
                    className: "w-full h-full object-cover"
                  }
                )
              },
              img.url
            ))
          }
        )
      ]
    }
  );
}
export {
  ImageViewer
};
