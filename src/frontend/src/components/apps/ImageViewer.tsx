import {
  ChevronLeft,
  ChevronRight,
  FileImage,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

interface ImageMeta {
  width: number;
  height: number;
}

export function ImageViewer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fitToWindow, setFitToWindow] = useState(true);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [meta, setMeta] = useState<ImageMeta | null>(null);
  const [metaPanelOpen, setMetaPanelOpen] = useState(true);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const current = images[currentIndex] ?? null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on index change
  useEffect(() => {
    setPanOffset({ x: 0, y: 0 });
    setZoom(1);
    setMeta(null);
  }, [currentIndex]);

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImages = files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size,
      type: f.type,
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (e.target) e.target.value = "";
  }, []);

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setMeta({ width: img.naturalWidth, height: img.naturalHeight });
    },
    [],
  );

  const applyZoom = useCallback((delta: number) => {
    setFitToWindow(false);
    setZoom((z) => Math.min(5, Math.max(0.1, z + delta)));
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      applyZoom(e.deltaY < 0 ? 0.1 : -0.1);
    },
    [applyZoom],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isPanning.current = true;
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        ox: panOffset.x,
        oy: panOffset.y,
      };
    },
    [panOffset],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setPanOffset({
      x: panStart.current.ox + (e.clientX - panStart.current.x),
      y: panStart.current.oy + (e.clientY - panStart.current.y),
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-transparent text-foreground"
      data-ocid="imageviewer.panel"
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0"
        style={{ borderColor: "rgba(39,215,224,0.15)" }}
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          data-ocid="imageviewer.upload_button"
          className="px-3 py-1 text-xs rounded border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
        >
          Open File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        <div className="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          onClick={() => applyZoom(-0.2)}
          data-ocid="imageviewer.secondary_button"
          className="p-1 rounded hover:bg-white/8 transition-colors text-muted-foreground hover:text-foreground"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-muted-foreground w-12 text-center">
          {fitToWindow ? "Fit" : `${Math.round(zoom * 100)}%`}
        </span>
        <button
          type="button"
          onClick={() => applyZoom(0.2)}
          data-ocid="imageviewer.button"
          className="p-1 rounded hover:bg-white/8 transition-colors text-muted-foreground hover:text-foreground"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setFitToWindow(true);
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          data-ocid="imageviewer.toggle"
          className="p-1 rounded hover:bg-white/8 transition-colors"
          style={{ color: fitToWindow ? "#27D7E0" : undefined }}
          title="Fit to window"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        {current && (
          <span className="ml-2 text-xs text-muted-foreground truncate max-w-[180px]">
            {current.name}
          </span>
        )}
        {images.length > 1 && (
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((i) => (i - 1 + images.length) % images.length)
              }
              data-ocid="imageviewer.pagination_prev"
              className="p-1 rounded hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1}/{images.length}
            </span>
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => (i + 1) % images.length)}
              data-ocid="imageviewer.pagination_next"
              className="p-1 rounded hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        {current && (
          <button
            type="button"
            onClick={() => setMetaPanelOpen((o) => !o)}
            data-ocid="imageviewer.secondary_button"
            className="p-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors ml-1"
          >
            Info
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main image area */}
        <div
          className="flex-1 overflow-hidden relative flex items-center justify-center"
          style={{
            cursor: fitToWindow ? "default" : "grab",
            background: "rgba(0,0,0,0.3)",
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          data-ocid="imageviewer.canvas_target"
        >
          {!current ? (
            <div
              className="flex flex-col items-center gap-3"
              data-ocid="imageviewer.empty_state"
            >
              <FileImage
                className="w-16 h-16 opacity-20"
                style={{ color: "var(--os-accent)" }}
              />
              <p className="text-sm text-muted-foreground">
                Open an image file to view it
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="imageviewer.upload_button"
                className="mt-1 px-4 py-2 text-xs rounded border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              >
                Open File
              </button>
            </div>
          ) : (
            <img
              src={current.url}
              alt={current.name}
              onLoad={handleImageLoad}
              style={{
                transform: fitToWindow
                  ? "none"
                  : `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                maxWidth: fitToWindow ? "100%" : "none",
                maxHeight: fitToWindow ? "100%" : "none",
                objectFit: fitToWindow ? "contain" : undefined,
                userSelect: "none",
                pointerEvents: "none",
                transition: isPanning.current ? "none" : "transform 0.05s",
              }}
            />
          )}
        </div>

        {/* Metadata panel */}
        {metaPanelOpen && current && (
          <div
            className="w-44 flex-shrink-0 border-l p-3 flex flex-col gap-2 overflow-y-auto"
            style={{ borderColor: "rgba(39,215,224,0.15)" }}
          >
            <p
              className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: "var(--os-accent)" }}
            >
              Image Info
            </p>
            <div className="space-y-1.5">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  Filename
                </p>
                <p className="text-xs break-all">{current.name}</p>
              </div>
              {meta && (
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                    Dimensions
                  </p>
                  <p className="text-xs font-mono">
                    {meta.width} × {meta.height}
                  </p>
                </div>
              )}
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  Size
                </p>
                <p className="text-xs font-mono">{fmtSize(current.size)}</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  Type
                </p>
                <p className="text-xs font-mono">{current.type || "image/*"}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex gap-1.5 px-2 py-1.5 overflow-x-auto border-t flex-shrink-0"
          style={{ borderColor: "rgba(39,215,224,0.15)" }}
          data-ocid="imageviewer.list"
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setCurrentIndex(i)}
              data-ocid={`imageviewer.item.${i + 1}`}
              className="flex-shrink-0 w-12 h-12 rounded overflow-hidden transition-all"
              style={{
                border:
                  i === currentIndex
                    ? "2px solid #27D7E0"
                    : "2px solid rgba(39,215,224,0.15)",
                boxShadow:
                  i === currentIndex ? "0 0 8px rgba(39,215,224,0.4)" : "none",
              }}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
