import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BarChart2,
  Bold,
  Check,
  Cloud,
  Download,
  FileText,
  FolderOpen,
  Italic,
  LayoutTemplate,
  List,
  ListOrdered,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Printer,
  Quote,
  RemoveFormatting,
  Save,
  Search,
  Strikethrough,
  Underline,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { FileMetadata } from "../../backend.d";
import { useActor } from "../../hooks/useActor";
import { useBlobStorage } from "../../hooks/useBlobStorage";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface DocFile {
  id: number;
  name: string;
}

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").trim();
  if (!text) return 0;
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function countChars(html: string): number {
  return html.replace(/<[^>]*>/g, "").length;
}

function countLines(html: string): number {
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "");
  if (!text.trim()) return 1;
  return text.split("\n").length;
}

interface ToolbarBtnProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
  "data-ocid"?: string;
}

function ToolbarBtn({
  onClick,
  title: tip,
  children,
  active,
  "data-ocid": ocid,
}: ToolbarBtnProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={tip}
      data-ocid={ocid}
      className={`w-7 h-7 flex items-center justify-center rounded transition-all text-xs ${
        active
          ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/50"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {children}
    </button>
  );
}

type SaveStatus = "idle" | "saving" | "saved";

export function WordProcessor() {
  const { actor, isFetching } = useActor();
  const { upload, isUploading: isCloudSaving } = useBlobStorage();
  const [showCloudPanel, setShowCloudPanel] = useState(false);
  const [cloudFiles, setCloudFiles] = useState<FileMetadata[]>([]);
  const [cloudFilesLoading, setCloudFilesLoading] = useState(false);
  const [cloudFileName, setCloudFileName] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedStatusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [title, setTitle] = useState("Untitled Document");
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(1);

  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [wordTarget, setWordTarget] = useState(500);
  const [showTargetEdit, setShowTargetEdit] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  const [showOpenModal, setShowOpenModal] = useState(false);
  const { data: cachedDocs, set: setCachedDocs } = useCanisterKV<DocFile[]>(
    "wordprocessor_docs",
    [],
  );
  const [docFiles, setDocFiles] = useState<DocFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const getContent = useCallback(() => {
    return editorRef.current?.innerHTML ?? "";
  }, []);

  const updateCounts = useCallback(() => {
    const html = getContent();
    setWordCount(countWords(html));
    setCharCount(countChars(html));
    setLineCount(countLines(html));
  }, [getContent]);

  // Daily word stats
  const getTodayKey = () => new Date().toISOString().slice(0, 10);
  const getDailyStats = (): Record<string, number> => {
    try {
      return JSON.parse(localStorage.getItem("wp_daily_stats") ?? "{}");
    } catch {
      return {};
    }
  };

  const handleInput = useCallback(() => {
    setHasUnsaved(true);
    setSaveStatus("idle");
    updateCounts();
    // Track daily word count
    const html = getContent();
    const wc = countWords(html);
    const today = new Date().toISOString().slice(0, 10);
    try {
      const s = JSON.parse(localStorage.getItem("wp_daily_stats") ?? "{}");
      s[today] = Math.max(s[today] ?? 0, wc);
      localStorage.setItem("wp_daily_stats", JSON.stringify(s));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCounts, getContent]);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    setHasUnsaved(true);
  }, []);

  const triggerSavedIndicator = useCallback(() => {
    setSaveStatus("saved");
    if (savedStatusTimer.current) clearTimeout(savedStatusTimer.current);
    savedStatusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
  }, []);

  const saveDocument = useCallback(async () => {
    if (!actor) return;
    setSaveStatus("saving");
    try {
      const content = getContent();
      const fullContent = JSON.stringify({ title, body: content });
      if (currentFileId !== null) {
        await actor.updateFileContent(currentFileId, fullContent);
        toast.success("Document saved");
      } else {
        const fileName = `${title.replace(/[^a-z0-9_\- ]/gi, "_")}.doc`;
        let existingId: number | null = null;
        try {
          const existing = await actor.listChildren(null);
          const match = (
            existing as { id: bigint | number; name: string }[]
          ).find((f) => f.name === fileName);
          if (match) {
            existingId = Number(match.id);
          }
        } catch {
          // listChildren failed
        }

        if (existingId !== null) {
          await actor.updateFileContent(existingId, fullContent);
          setCurrentFileId(existingId);
          setCurrentFileName(fileName);
          toast.success(`Saved as ${fileName}`);
        } else {
          const fileId = await actor.createFile(fileName, fullContent, null);
          setCurrentFileId(Number(fileId));
          setCurrentFileName(fileName);
          toast.success(`Saved as ${fileName}`);
        }
      }
      setHasUnsaved(false);
      triggerSavedIndicator();
    } catch (e) {
      console.error("Save failed:", e);
      toast.error("Failed to save document");
      setSaveStatus("idle");
    }
  }, [actor, getContent, title, currentFileId, triggerSavedIndicator]);

  const loadCloudFiles = useCallback(async () => {
    if (!actor) return;
    setCloudFilesLoading(true);
    try {
      const files = await actor.getFileMetadata();
      setCloudFiles(files.filter((f) => f.mimeType.startsWith("text/")));
    } catch {
      /* ignore */
    } finally {
      setCloudFilesLoading(false);
    }
  }, [actor]);

  const saveToCloud = useCallback(async () => {
    if (!actor) return;
    const content = getContent();
    const fileName = `${cloudFileName.trim() || title || "document"}.txt`;
    const blob = new Blob([content.replace(/<[^>]*>/g, "")], {
      type: "text/plain",
    });
    try {
      const { url } = await upload(blob);
      await actor.saveFileMetadata({
        url,
        name: fileName,
        size: BigInt(blob.size),
        mimeType: "text/plain",
      });
      toast.success("Saved to Files u2713");
      setShowCloudPanel(false);
      setCloudFileName("");
    } catch {
      toast.error("Save to Files failed");
    }
  }, [actor, upload, getContent, title, cloudFileName]);

  const openFromCloud = useCallback(
    async (fileUrl: string, fileName: string) => {
      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        // Set into editor
        if (editorRef.current) {
          editorRef.current.innerHTML = text.replace(/\n/g, "<br>");
        }
        setTitle(fileName.replace(/\.[^.]+$/, ""));
        setHasUnsaved(true);
        setShowCloudPanel(false);
        toast.success(`Opened ${fileName}`);
      } catch {
        toast.error("Failed to open file");
      }
    },
    [],
  );
  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      if (hasUnsaved && actor) {
        saveDocument();
      }
    }, 30_000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [hasUnsaved, actor, saveDocument]);

  useEffect(() => {
    return () => {
      if (savedStatusTimer.current) clearTimeout(savedStatusTimer.current);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveDocument();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        setShowFindReplace((p) => !p);
      }
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [saveDocument, focusMode]);

  const openDocument = useCallback(async () => {
    if (!actor) return;
    if (cachedDocs.length > 0 && docFiles.length === 0) {
      setDocFiles(cachedDocs);
    }
    setLoadingFiles(true);
    setShowOpenModal(true);
    try {
      const files = await actor.listChildren(null);
      const docs = (files as { id: bigint | number; name: string }[]).filter(
        (f) => f.name.endsWith(".doc"),
      );
      const mapped = docs.map((f) => ({ id: Number(f.id), name: f.name }));
      setDocFiles(mapped);
      setCachedDocs(mapped);
    } catch {
      toast.error("Failed to list documents");
    } finally {
      setLoadingFiles(false);
    }
  }, [actor, setCachedDocs, cachedDocs, docFiles.length]);

  const loadDocument = useCallback(
    async (file: DocFile) => {
      if (!actor) return;
      try {
        const raw = await actor.readFile(file.id);
        const parsed = JSON.parse(raw as string) as {
          title: string;
          body: string;
        };
        setTitle(parsed.title);
        if (editorRef.current) {
          editorRef.current.innerHTML = parsed.body;
        }
        setCurrentFileId(file.id);
        setCurrentFileName(file.name);
        setHasUnsaved(false);
        setSaveStatus("idle");
        updateCounts();
        setShowOpenModal(false);
        toast.success(`Opened ${file.name}`);
      } catch {
        toast.error("Failed to open document");
      }
    },
    [actor, updateCounts],
  );

  const newDocument = useCallback(() => {
    if (hasUnsaved) {
      if (!confirm("You have unsaved changes. Create new document anyway?"))
        return;
    }
    setTitle("Untitled Document");
    if (editorRef.current) editorRef.current.innerHTML = "";
    setCurrentFileId(null);
    setCurrentFileName(null);
    setHasUnsaved(false);
    setSaveStatus("idle");
    setWordCount(0);
    setCharCount(0);
    setLineCount(1);
  }, [hasUnsaved]);

  const exportTxt = useCallback(() => {
    const text = (editorRef.current?.innerText ?? "").trim();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [title]);

  const handlePrint = useCallback(() => {
    // Create print-only style
    const style = document.createElement("style");
    style.id = "wp-print-style";
    style.textContent = `
      @media print {
        body > * { display: none !important; }
        #wp-print-content { display: block !important; position: static !important; }
        #wp-print-content * { color: black !important; background: white !important; }
      }
    `;
    document.head.appendChild(style);
    const printDiv = document.createElement("div");
    printDiv.id = "wp-print-content";
    printDiv.style.display = "none";
    printDiv.innerHTML = `<h1>${title}</h1>${editorRef.current?.innerHTML ?? ""}`;
    document.body.appendChild(printDiv);
    window.print();
    setTimeout(() => {
      document.body.removeChild(printDiv);
      const s = document.getElementById("wp-print-style");
      if (s) document.head.removeChild(s);
    }, 500);
  }, [title]);

  const exportMd = useCallback(() => {
    const text = (editorRef.current?.innerText ?? "").trim();
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [title]);

  const handleFind = useCallback(() => {
    if (!findText) return;
    const editor = editorRef.current;
    if (!editor) return;
    for (const el of Array.from(editor.querySelectorAll(".find-highlight"))) {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent ?? ""), el);
        parent.normalize();
      }
    }
    if (!findText) return;
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null,
    );
    const textNodes: Text[] = [];
    let node = walker.nextNode();
    while (node) {
      textNodes.push(node as Text);
      node = walker.nextNode();
    }
    for (const textNode of textNodes) {
      const idx = textNode.textContent?.indexOf(findText) ?? -1;
      if (idx >= 0) {
        const before = textNode.textContent!.slice(0, idx);
        const match = textNode.textContent!.slice(idx, idx + findText.length);
        const after = textNode.textContent!.slice(idx + findText.length);
        const span = document.createElement("mark");
        span.className = "find-highlight";
        span.style.background = "rgba(39,215,224,0.35)";
        span.style.color = "inherit";
        span.textContent = match;
        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(span);
        if (after) frag.appendChild(document.createTextNode(after));
        textNode.parentNode?.replaceChild(frag, textNode);
      }
    }
  }, [findText]);

  const handleReplace = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || !findText) return;
    const mark = editor.querySelector(".find-highlight") as HTMLElement | null;
    if (mark) {
      mark.replaceWith(document.createTextNode(replaceText));
      setHasUnsaved(true);
    }
    handleFind();
  }, [findText, replaceText, handleFind]);

  const handleReplaceAll = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || !findText) return;
    for (const el of Array.from(editor.querySelectorAll(".find-highlight"))) {
      el.replaceWith(document.createTextNode(replaceText));
    }
    setHasUnsaved(true);
    handleFind();
    updateCounts();
  }, [findText, replaceText, handleFind, updateCounts]);

  // Start editing title inline
  const startTitleEdit = useCallback(() => {
    setEditingTitle(true);
    setTimeout(() => {
      titleInputRef.current?.select();
    }, 10);
  }, []);

  const commitTitleEdit = useCallback(() => {
    setEditingTitle(false);
    setHasUnsaved(true);
  }, []);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(8,14,18,0.97)" }}
      data-ocid="wordprocessor.panel"
    >
      {/* Focus mode overlay */}
      {focusMode && (
        <div
          className="absolute inset-0 z-50 flex flex-col"
          style={{ background: "rgba(6,10,14,0.98)" }}
          data-ocid="wordprocessor.focus_mode"
        >
          <div
            className="flex items-center justify-between px-6 py-2 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(39,215,224,0.1)" }}
          >
            <span className="text-xs text-muted-foreground/50">
              {title} · Focus Mode
            </span>
            <button
              type="button"
              onClick={() => setFocusMode(false)}
              className="flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <Minimize2 className="w-3 h-3" /> Exit (Esc)
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto py-12 px-8" style={{ maxWidth: 680 }}>
              <h1
                className="text-2xl font-semibold mb-6"
                style={{ color: "rgba(220,230,240,0.9)" }}
              >
                {title}
              </h1>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                className="outline-none text-base leading-relaxed"
                style={{
                  color: "rgba(200,215,230,0.8)",
                  caretColor: "rgba(39,215,224,0.8)",
                  minHeight: 400,
                }}
              />
            </div>
          </div>
          <div
            className="flex items-center gap-4 px-6 py-2 flex-shrink-0 text-[10px]"
            style={{
              borderTop: "1px solid rgba(39,215,224,0.08)",
              color: "rgba(100,120,140,0.6)",
            }}
          >
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
            <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div
        className="flex-shrink-0 flex items-center gap-0.5 px-2 py-1.5 border-b overflow-x-auto"
        style={{
          background: "rgba(12,22,30,0.95)",
          borderColor: "rgba(39,215,224,0.15)",
          scrollbarWidth: "none",
        }}
      >
        <div className="flex items-center gap-0.5 min-w-max">
          {/* File actions */}
          <ToolbarBtn
            onClick={newDocument}
            title="New Document"
            data-ocid="wordprocessor.primary_button"
          >
            <Plus className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={openDocument}
            title="Open Document"
            data-ocid="wordprocessor.open_modal_button"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={saveDocument}
            title="Save (Ctrl+S)"
            data-ocid="wordprocessor.save_button"
          >
            {saveStatus === "saving" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => {
              setShowCloudPanel(true);
              loadCloudFiles();
            }}
            title="Cloud Files"
            data-ocid="wordprocessor.cloud_files.button"
          >
            {isCloudSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Cloud className="w-3.5 h-3.5" style={{ color: "#3B82F6" }} />
            )}
          </ToolbarBtn>

          <div className="w-px h-5 bg-muted/50 mx-0.5 flex-shrink-0" />

          {/* Font family */}
          <select
            title="Font Family"
            className="h-7 text-xs px-1.5 rounded border bg-transparent text-muted-foreground hover:text-foreground cursor-pointer"
            style={{
              borderColor: "rgba(39,215,224,0.2)",
              background: "rgba(12,22,30,0.8)",
              minWidth: 90,
            }}
            defaultValue="sans-serif"
            onChange={(e) => exec("fontName", e.target.value)}
          >
            <option
              value="sans-serif"
              style={{ background: "var(--os-bg-app)" }}
            >
              Sans-serif
            </option>
            <option value="serif" style={{ background: "var(--os-bg-app)" }}>
              Serif
            </option>
            <option
              value="monospace"
              style={{ background: "var(--os-bg-app)" }}
            >
              Monospace
            </option>
            <option value="cursive" style={{ background: "var(--os-bg-app)" }}>
              Cursive
            </option>
            <option value="Georgia" style={{ background: "var(--os-bg-app)" }}>
              Georgia
            </option>
            <option value="Arial" style={{ background: "var(--os-bg-app)" }}>
              Arial
            </option>
          </select>

          {/* Font size */}
          <select
            title="Font Size"
            className="h-7 text-xs px-1.5 rounded border bg-transparent text-muted-foreground hover:text-foreground cursor-pointer ml-0.5"
            style={{
              borderColor: "rgba(39,215,224,0.2)",
              background: "rgba(12,22,30,0.8)",
            }}
            defaultValue="3"
            onChange={(e) => exec("fontSize", e.target.value)}
            data-ocid="wordprocessor.select"
          >
            <option value="1" style={{ background: "var(--os-bg-app)" }}>
              10px
            </option>
            <option value="2" style={{ background: "var(--os-bg-app)" }}>
              12px
            </option>
            <option value="3" style={{ background: "var(--os-bg-app)" }}>
              14px
            </option>
            <option value="4" style={{ background: "var(--os-bg-app)" }}>
              16px
            </option>
            <option value="5" style={{ background: "var(--os-bg-app)" }}>
              18px
            </option>
            <option value="6" style={{ background: "var(--os-bg-app)" }}>
              24px
            </option>
            <option value="7" style={{ background: "var(--os-bg-app)" }}>
              32px
            </option>
          </select>

          {/* Heading style */}
          <select
            title="Heading"
            className="h-7 text-xs px-1.5 rounded border bg-transparent text-muted-foreground hover:text-foreground cursor-pointer ml-0.5"
            style={{
              borderColor: "rgba(39,215,224,0.2)",
              background: "rgba(12,22,30,0.8)",
            }}
            defaultValue="p"
            onChange={(e) => {
              if (e.target.value === "p") exec("formatBlock", "<p>");
              else exec("formatBlock", `<${e.target.value}>`);
            }}
          >
            <option value="p" style={{ background: "var(--os-bg-app)" }}>
              Normal
            </option>
            <option value="h1" style={{ background: "var(--os-bg-app)" }}>
              H1
            </option>
            <option value="h2" style={{ background: "var(--os-bg-app)" }}>
              H2
            </option>
            <option value="h3" style={{ background: "var(--os-bg-app)" }}>
              H3
            </option>
          </select>

          <div className="w-px h-5 bg-muted/50 mx-0.5 flex-shrink-0" />

          {/* Text color */}
          <div className="relative flex items-center" title="Text Color">
            <label
              className="w-7 h-7 flex items-center justify-center rounded cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-xs font-bold select-none"
              title="Text Color"
            >
              A
              <input
                type="color"
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                onChange={(e) => exec("foreColor", e.target.value)}
              />
            </label>
          </div>

          {/* Highlight color */}
          <div className="relative flex items-center" title="Highlight Color">
            <label
              className="w-7 h-7 flex items-center justify-center rounded cursor-pointer text-yellow-400/70 hover:text-yellow-300 hover:bg-muted/50 transition-all text-xs font-bold select-none"
              title="Highlight Color"
              style={{
                textDecoration: "underline",
                textDecorationColor: "rgba(234,179,8,0.7)",
              }}
            >
              H
              <input
                type="color"
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                onChange={(e) => exec("hiliteColor", e.target.value)}
              />
            </label>
          </div>

          <div className="w-px h-5 bg-muted/50 mx-0.5 flex-shrink-0" />

          {/* Format */}
          <ToolbarBtn
            onClick={() => exec("bold")}
            title="Bold (Ctrl+B)"
            data-ocid="wordprocessor.toggle"
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => exec("italic")} title="Italic (Ctrl+I)">
            <Italic className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => exec("underline")}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => exec("strikeThrough")}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-muted/50 mx-0.5 flex-shrink-0" />

          {/* Lists */}
          <ToolbarBtn
            onClick={() => exec("insertUnorderedList")}
            title="Unordered List"
          >
            <List className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => exec("insertOrderedList")}
            title="Ordered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => exec("formatBlock", "<blockquote>")}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-muted/50 mx-0.5 flex-shrink-0" />

          {/* Alignment */}
          <ToolbarBtn onClick={() => exec("justifyLeft")} title="Align Left">
            <AlignLeft className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => exec("justifyCenter")}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => exec("justifyRight")} title="Align Right">
            <AlignRight className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => exec("justifyFull")} title="Justify">
            <AlignJustify className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-muted/50 mx-0.5 flex-shrink-0" />

          <ToolbarBtn
            onClick={() => exec("insertHorizontalRule")}
            title="Horizontal Rule"
          >
            <Minus className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => exec("removeFormat")}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-muted/50 mx-0.5 flex-shrink-0" />

          <ToolbarBtn
            onClick={() => setShowFindReplace((p) => !p)}
            title="Find & Replace (Ctrl+H)"
            active={showFindReplace}
            data-ocid="wordprocessor.toggle"
          >
            <Search className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-muted/50 mx-0.5 flex-shrink-0" />

          <ToolbarBtn
            onClick={exportTxt}
            title="Export as TXT"
            data-ocid="wordprocessor.primary_button"
          >
            <Download className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={exportMd}
            title="Export as Markdown (.md)"
            data-ocid="wordprocessor.secondary_button"
          >
            <span className="text-[9px] font-bold font-mono">.md</span>
          </ToolbarBtn>
          <div className="w-px h-5 bg-muted/50 mx-0.5 flex-shrink-0" />
          <ToolbarBtn
            onClick={() => setShowTemplates((p) => !p)}
            title="Templates"
            active={showTemplates}
            data-ocid="wordprocessor.open_modal_button"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={handlePrint}
            title="Print / Export PDF"
            data-ocid="wordprocessor.print_button"
          >
            <Printer className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => setFocusMode((p) => !p)}
            title={focusMode ? "Exit Focus Mode (Esc)" : "Focus Mode"}
            active={focusMode}
            data-ocid="wordprocessor.toggle"
          >
            {focusMode ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </ToolbarBtn>
        </div>
      </div>

      {/* Find & Replace panel */}
      {showFindReplace && (
        <div
          className="flex-shrink-0 flex items-center gap-2 px-3 py-2 border-b"
          style={{
            background: "rgba(10,20,28,0.95)",
            borderColor: "rgba(39,215,224,0.15)",
          }}
          data-ocid="wordprocessor.dialog"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <Input
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Find..."
            className="h-6 text-xs w-32"
            style={{
              background: "var(--os-border-subtle)",
              borderColor: "rgba(39,215,224,0.25)",
            }}
            data-ocid="wordprocessor.search_input"
          />
          <Input
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace..."
            className="h-6 text-xs w-32"
            style={{
              background: "var(--os-border-subtle)",
              borderColor: "rgba(39,215,224,0.25)",
            }}
            data-ocid="wordprocessor.input"
          />
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs px-2"
            onClick={handleFind}
            data-ocid="wordprocessor.secondary_button"
          >
            Find
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs px-2"
            onClick={handleReplace}
            data-ocid="wordprocessor.edit_button"
          >
            Replace
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs px-2"
            onClick={handleReplaceAll}
            data-ocid="wordprocessor.confirm_button"
          >
            All
          </Button>
          <button
            type="button"
            onClick={() => setShowFindReplace(false)}
            className="ml-auto text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            data-ocid="wordprocessor.close_button"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Templates panel */}
      {showTemplates && (
        <div
          className="absolute inset-0 z-40 flex"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          data-ocid="wordprocessor.modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTemplates(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowTemplates(false);
          }}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-72 flex flex-col overflow-hidden"
            style={{
              background: "rgba(10,18,28,0.98)",
              borderLeft: "1px solid rgba(39,215,224,0.25)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
              style={{ borderColor: "rgba(39,215,224,0.15)" }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--os-accent)" }}
              >
                Templates
              </span>
              <button
                type="button"
                onClick={() => setShowTemplates(false)}
                data-ocid="wordprocessor.close_button"
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {[
                {
                  title: "Meeting Notes",
                  preview: "Attendees, Agenda, Action Items",
                  html: "<h2>Meeting Notes</h2><p><strong>Date:</strong> </p><h3>Attendees</h3><ul><li></li></ul><h3>Agenda</h3><ol><li></li></ol><h3>Action Items</h3><ul><li> - <em>Owner</em> - Due: </li></ul>",
                },
                {
                  title: "Blog Post",
                  preview: "Title, Introduction, Body, Conclusion",
                  html: "<h1>Blog Post Title</h1><h2>Introduction</h2><p>Hook the reader here.</p><h2>Section 1</h2><p>Main point one.</p><h2>Section 2</h2><p>Main point two.</p><h2>Conclusion</h2><p>Wrap it up.</p>",
                },
                {
                  title: "Resume",
                  preview: "Name, Experience, Education, Skills",
                  html: "<h1>Your Name</h1><p>email@example.com | LinkedIn | Portfolio</p><h2>Summary</h2><p>Brief professional summary.</p><h2>Experience</h2><p><strong>Job Title</strong> — Company (Year–Year)</p><ul><li>Achievement</li></ul><h2>Education</h2><p><strong>Degree</strong> — University (Year)</p><h2>Skills</h2><p>Skill 1, Skill 2, Skill 3</p>",
                },
                {
                  title: "Project Brief",
                  preview: "Overview, Goals, Timeline, Team",
                  html: "<h1>Project Name</h1><h2>Overview</h2><p>What are we building?</p><h2>Goals</h2><ul><li>Goal 1</li><li>Goal 2</li></ul><h2>Timeline</h2><p><strong>Start:</strong> &nbsp; <strong>End:</strong> </p><h2>Team</h2><ul><li>Role — Name</li></ul>",
                },
                {
                  title: "Cover Letter",
                  preview: "Header, Body, Closing",
                  html: "<p>Your Name<br>Your Address<br>Date</p><p>Hiring Manager<br>Company Name</p><p>Dear Hiring Manager,</p><p>I am writing to express my interest in the [Role] position at [Company].</p><p>[Body paragraph about your experience.]</p><p>Thank you for your consideration.</p><p>Sincerely,<br>Your Name</p>",
                },
                {
                  title: "Daily Journal",
                  preview: "What I did, Learned, Tomorrow",
                  html: `<h2>Journal — ${new Date().toLocaleDateString()}</h2><h3>What I did today</h3><p></p><h3>What I learned</h3><p></p><h3>Tomorrow's focus</h3><ul><li></li></ul>`,
                },
              ].map((tpl) => (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => {
                    if (editorRef.current) {
                      editorRef.current.innerHTML = tpl.html;
                      setHasUnsaved(true);
                      updateCounts();
                    }
                    setShowTemplates(false);
                    toast.success("Template loaded");
                  }}
                  data-ocid="wordprocessor.item.1"
                  className="w-full text-left rounded-lg p-3 hover:bg-white/8 transition-colors group"
                  style={{ border: "1px solid var(--os-border-subtle)" }}
                >
                  <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground mb-0.5">
                    {tpl.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {tpl.preview}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document area */}
      <ScrollArea className="flex-1">
        <div className="min-h-full p-4 pb-2">
          {/* Title - editable inline */}
          <div className="flex items-center gap-2 mb-4">
            {editingTitle ? (
              <input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={commitTitleEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape")
                    commitTitleEdit();
                }}
                className="flex-1 text-2xl font-semibold bg-transparent outline-none text-foreground placeholder:text-muted-foreground/30 caret-cyan-400"
                style={{ borderBottom: "1px solid rgba(39,215,224,0.4)" }}
                data-ocid="wordprocessor.input"
              />
            ) : (
              <button
                type="button"
                className="flex-1 text-2xl font-semibold text-foreground text-left cursor-text hover:text-foreground transition-colors bg-transparent border-none p-0 outline-none"
                onClick={startTitleEdit}
                title="Click to edit title"
                data-ocid="wordprocessor.input"
              >
                {title || "Untitled Document"}
              </button>
            )}
            {saveStatus === "saved" && (
              <span
                className="flex items-center gap-1 text-xs font-medium flex-shrink-0"
                style={{ color: "rgba(34,197,94,0.9)" }}
              >
                <Check className="w-3 h-3" /> Saved ✓
              </span>
            )}
            {saveStatus === "saving" && (
              <span className="text-xs text-muted-foreground/60 flex items-center gap-1 flex-shrink-0">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
              </span>
            )}
            {hasUnsaved && saveStatus === "idle" && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: "var(--os-accent)",
                  boxShadow: "0 0 6px var(--os-accent)",
                }}
                title="Unsaved changes"
              />
            )}
          </div>

          {/* Divider */}
          <div
            className="mb-4"
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, rgba(39,215,224,0.5) 0%, rgba(39,215,224,0.05) 100%)",
            }}
          />

          {/* Editable body */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="min-h-[300px] outline-none text-sm leading-relaxed text-foreground/85"
            style={{ caretColor: "var(--os-accent)" }}
            data-ocid="wordprocessor.editor"
          />
        </div>
      </ScrollArea>

      {/* Word count progress bar */}
      {wordTarget > 0 && (
        <div
          className="flex-shrink-0 px-3 py-1"
          style={{
            background: "rgba(8,14,18,0.98)",
            borderTop: "1px solid rgba(39,215,224,0.06)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ background: "rgba(39,215,224,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (wordCount / wordTarget) * 100)}%`,
                  background:
                    wordCount >= wordTarget
                      ? "rgba(34,197,94,0.8)"
                      : wordCount >= wordTarget * 0.7
                        ? "rgba(234,179,8,0.8)"
                        : "rgba(39,215,224,0.6)",
                }}
              />
            </div>
            {showTargetEdit ? (
              <input
                type="number"
                min={50}
                max={50000}
                step={50}
                value={wordTarget}
                onChange={(e) =>
                  setWordTarget(Math.max(50, Number(e.target.value)))
                }
                onBlur={() => setShowTargetEdit(false)}
                onKeyDown={(e) => e.key === "Enter" && setShowTargetEdit(false)}
                className="w-16 text-[10px] px-1 py-0 rounded outline-none"
                style={{
                  background: "rgba(39,215,224,0.08)",
                  border: "1px solid rgba(39,215,224,0.2)",
                  color: "rgba(39,215,224,0.8)",
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowTargetEdit(true)}
                className="text-[10px] whitespace-nowrap transition-colors"
                style={{
                  color:
                    wordCount >= wordTarget
                      ? "rgba(34,197,94,0.8)"
                      : "rgba(39,215,224,0.5)",
                }}
                title="Click to set word target"
              >
                {wordCount} / {wordTarget} words
              </button>
            )}
          </div>
        </div>
      )}

      {/* Status bar */}
      <div
        className="flex-shrink-0 flex items-center gap-4 px-3 py-1.5 border-t text-[10px]"
        style={{
          background: "rgba(8,14,18,0.98)",
          borderColor: "rgba(39,215,224,0.12)",
        }}
      >
        <span className="text-muted-foreground/60" title="Word count">
          {wordCount} words
        </span>
        <span className="text-muted-foreground/60" title="Character count">
          {charCount} chars
        </span>
        <span className="text-muted-foreground/60" title="Line count">
          {lineCount} lines
        </span>
        <span
          className="text-muted-foreground/60"
          title="Estimated reading time"
        >
          {Math.max(1, Math.ceil(wordCount / 200))} min read
        </span>
        <button
          type="button"
          onClick={() => setShowStats((v) => !v)}
          title="Writing Stats"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors"
          style={{
            background: showStats ? "rgba(99,102,241,0.15)" : "transparent",
            border: showStats
              ? "1px solid rgba(99,102,241,0.3)"
              : "1px solid transparent",
            color: showStats ? "rgba(99,102,241,0.9)" : "var(--os-text-muted)",
          }}
        >
          <BarChart2 className="w-3 h-3" />
          Stats
        </button>
        {currentFileName && (
          <span className="text-muted-foreground/60 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {currentFileName}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {isFetching && (
            <span
              className="text-muted-foreground/60 text-[10px]"
              data-ocid="wordprocessor.loading_state"
            >
              Connecting...
            </span>
          )}
        </div>
      </div>

      {/* Writing Stats Panel */}
      {showStats &&
        (() => {
          const stats = getDailyStats();
          const today = getTodayKey();
          const todayCount = stats[today] ?? 0;
          const allTime = Object.values(stats).reduce((a, b) => a + b, 0);
          const last7 = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const key = d.toISOString().slice(0, 10);
            return {
              label: d.toLocaleDateString("en", { weekday: "short" }),
              count: stats[key] ?? 0,
            };
          });
          const maxCount = Math.max(...last7.map((d) => d.count), 1);
          return (
            <div
              className="flex-shrink-0 border-t p-3"
              style={{
                background: "var(--os-bg-elevated)",
                borderColor: "rgba(39,215,224,0.12)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart2
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--os-accent-color)" }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--os-text-primary)" }}
                >
                  Writing Stats
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: "Today", value: todayCount },
                  { label: "Document", value: wordCount },
                  { label: "All Time", value: allTime },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg p-2 text-center"
                    style={{
                      background: "var(--os-bg-app)",
                      border: "1px solid var(--os-border-subtle)",
                    }}
                  >
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--os-accent-color)" }}
                    >
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mb-1.5">
                7-day trend
              </p>
              <div className="flex items-end gap-1 h-12">
                {last7.map((day) => (
                  <div
                    key={day.label}
                    className="flex-1 flex flex-col items-center gap-0.5"
                  >
                    <div
                      className="w-full rounded-sm"
                      style={{
                        height: `${Math.round((day.count / maxCount) * 40)}px`,
                        minHeight: 2,
                        background:
                          day.label === last7[6].label
                            ? "var(--os-accent-color)"
                            : "var(--os-border-window)",
                      }}
                    />
                    <span className="text-[8px] text-muted-foreground">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      {/* Cloud Files Panel */}
      {showCloudPanel && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          data-ocid="wordprocessor.cloud.modal"
        >
          <div
            className="w-96 max-h-[70%] flex flex-col rounded-xl overflow-hidden"
            style={{
              background: "rgba(13,22,32,0.98)",
              border: "1px solid rgba(39,215,224,0.2)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(39,215,224,0.15)" }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--os-accent)" }}
              >
                Cloud Files
              </span>
              <button
                type="button"
                onClick={() => setShowCloudPanel(false)}
                data-ocid="wordprocessor.cloud.close_button"
                className="text-muted-foreground/60 hover:text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className="p-3 border-b"
              style={{ borderColor: "rgba(39,215,224,0.1)" }}
            >
              <div className="flex gap-2">
                <input
                  value={cloudFileName}
                  onChange={(e) => setCloudFileName(e.target.value)}
                  placeholder="Filename (optional)"
                  data-ocid="wordprocessor.cloud.input"
                  className="flex-1 bg-muted/50 border rounded px-2 py-1.5 text-xs text-muted-foreground outline-none placeholder-white/30"
                  style={{ borderColor: "rgba(39,215,224,0.2)" }}
                />
                <button
                  type="button"
                  onClick={saveToCloud}
                  disabled={isCloudSaving}
                  data-ocid="wordprocessor.cloud.save_button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                  style={{
                    background: "rgba(39,215,224,0.1)",
                    color: "var(--os-accent)",
                    border: "1px solid rgba(39,215,224,0.3)",
                  }}
                >
                  {isCloudSaving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Cloud className="w-3 h-3" />
                  )}
                  Save
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {cloudFilesLoading ? (
                <div
                  className="flex items-center justify-center py-8"
                  data-ocid="wordprocessor.cloud.loading_state"
                >
                  <Loader2 className="w-4 h-4 animate-spin text-primary/60" />
                </div>
              ) : cloudFiles.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground/60 text-xs"
                  data-ocid="wordprocessor.cloud.empty_state"
                >
                  <Cloud className="w-8 h-8" />
                  <p>No text files in cloud</p>
                </div>
              ) : (
                <div className="p-2">
                  {cloudFiles.map((f, i) => (
                    <button
                      key={f.url}
                      type="button"
                      onClick={() => openFromCloud(f.url, f.name)}
                      data-ocid={`wordprocessor.cloud.item.${i + 1}`}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
                    >
                      <FileText
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "#3B82F6" }}
                      />
                      {f.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Open File Modal */}
      {showOpenModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          data-ocid="wordprocessor.modal"
        >
          <div
            className="rounded-xl w-80 max-h-80 flex flex-col overflow-hidden"
            style={{
              background: "rgba(10,18,26,0.98)",
              border: "1px solid rgba(39,215,224,0.25)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(39,215,224,0.15)" }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--os-accent)" }}
              >
                Open Document
              </span>
              <button
                type="button"
                onClick={() => setShowOpenModal(false)}
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                data-ocid="wordprocessor.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ScrollArea className="flex-1">
              {loadingFiles ? (
                <div
                  className="flex items-center justify-center py-8 gap-2 text-muted-foreground/60 text-xs"
                  data-ocid="wordprocessor.loading_state"
                >
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                </div>
              ) : docFiles.length === 0 ? (
                <div
                  className="py-8 text-center text-muted-foreground/60 text-xs"
                  data-ocid="wordprocessor.empty_state"
                >
                  No .doc files found
                </div>
              ) : (
                <div className="p-2">
                  {docFiles.map((f, i) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => loadDocument(f)}
                      data-ocid={`wordprocessor.item.${i + 1}`}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
                    >
                      <FileText
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "var(--os-accent)" }}
                      />
                      {f.name}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
