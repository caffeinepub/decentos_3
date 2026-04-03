import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Cloud,
  Code,
  Copy,
  FilePlus,
  FolderOpen,
  Loader2,
  Save,
  Search,
  X as XIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { FileMetadata, FileNodeView } from "../../backend.d";
import { useOSEventBus } from "../../context/OSEventBusContext";
import { useActor } from "../../hooks/useActor";
import { useBlobStorage } from "../../hooks/useBlobStorage";
import {
  useCreateFile,
  useListChildren,
  useUpdateFileContent,
} from "../../hooks/useQueries";

type Language =
  | "motoko"
  | "typescript"
  | "javascript"
  | "python"
  | "rust"
  | "go"
  | "yaml"
  | "toml"
  | "html"
  | "css"
  | "json"
  | "markdown"
  | "shell"
  | "plaintext";

const LANGUAGE_LABELS: Record<Language, string> = {
  motoko: "Motoko",
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  rust: "Rust",
  go: "Go",
  yaml: "YAML",
  toml: "TOML",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  markdown: "Markdown",
  shell: "Shell",
  plaintext: "Plain Text",
};

function detectLanguage(filename: string): Language {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".mo")) return "motoko";
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "typescript";
  if (lower.endsWith(".js") || lower.endsWith(".jsx")) return "javascript";
  if (lower.endsWith(".py")) return "python";
  if (lower.endsWith(".rs")) return "rust";
  if (lower.endsWith(".go")) return "go";
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) return "yaml";
  if (lower.endsWith(".toml")) return "toml";
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html";
  if (lower.endsWith(".css")) return "css";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".md") || lower.endsWith(".markdown")) return "markdown";
  if (
    lower.endsWith(".sh") ||
    lower.endsWith(".bash") ||
    lower.endsWith(".zsh")
  )
    return "shell";
  return "plaintext";
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Syntax highlighters ──────────────────────────────────────────────────────

function highlightByKeywords(
  code: string,
  keywords: string[],
  commentPrefixes: string[],
  stringPatterns: RegExp[],
): string {
  const escaped = escapeHtml(code);
  const lines = escaped.split("\n");

  return lines
    .map((line) => {
      // Find first comment
      let commentStart = -1;
      let commentPrefix = "";
      for (const prefix of commentPrefixes) {
        const idx = line.indexOf(prefix);
        if (idx >= 0 && (commentStart < 0 || idx < commentStart)) {
          commentStart = idx;
          commentPrefix = prefix;
        }
      }

      let codePart = commentStart >= 0 ? line.slice(0, commentStart) : line;
      const commentPart = commentStart >= 0 ? line.slice(commentStart) : null;

      // Strings
      for (const sp of stringPatterns) {
        codePart = codePart.replace(
          sp,
          (m) => `<span style="color:#a8d4a0">${m}</span>`,
        );
      }

      // Numbers
      codePart = codePart.replace(
        /\b(\d+\.?\d*)\b/g,
        `<span style="color:#e6c07b">$1</span>`,
      );

      // Keywords
      for (const kw of keywords) {
        const re = new RegExp(`\\b${kw}\\b`, "g");
        codePart = codePart.replace(
          re,
          `<span style="color:#27D7E0">${kw}</span>`,
        );
      }

      if (commentPart !== null) {
        void commentPrefix;
        return `${codePart}<span style="color:#5a7a5a;font-style:italic">${commentPart}</span>`;
      }
      return codePart;
    })
    .join("\n");
}

const MOTOKO_KEYWORDS = [
  "actor",
  "func",
  "let",
  "var",
  "if",
  "else",
  "return",
  "async",
  "await",
  "public",
  "shared",
  "query",
  "import",
  "type",
  "class",
  "object",
  "switch",
  "case",
  "for",
  "while",
  "do",
  "not",
  "and",
  "or",
  "null",
  "true",
  "false",
  "stable",
  "flexible",
];

const TS_KEYWORDS = [
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "class",
  "interface",
  "type",
  "enum",
  "import",
  "export",
  "from",
  "default",
  "async",
  "await",
  "new",
  "this",
  "extends",
  "implements",
  "public",
  "private",
  "protected",
  "static",
  "readonly",
  "null",
  "undefined",
  "true",
  "false",
  "void",
  "never",
  "any",
  "string",
  "number",
  "boolean",
  "try",
  "catch",
  "throw",
  "typeof",
  "instanceof",
  "of",
  "in",
];

const PYTHON_KEYWORDS = [
  "def",
  "class",
  "import",
  "from",
  "return",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "with",
  "as",
  "try",
  "except",
  "finally",
  "raise",
  "pass",
  "break",
  "continue",
  "lambda",
  "and",
  "or",
  "not",
  "in",
  "is",
  "True",
  "False",
  "None",
  "yield",
  "async",
  "await",
  "self",
];

const RUST_KEYWORDS = [
  "fn",
  "let",
  "mut",
  "const",
  "struct",
  "enum",
  "impl",
  "trait",
  "use",
  "pub",
  "mod",
  "type",
  "where",
  "for",
  "while",
  "loop",
  "if",
  "else",
  "match",
  "return",
  "self",
  "Self",
  "super",
  "crate",
  "true",
  "false",
  "move",
  "ref",
  "async",
  "await",
];

function highlightHTML(code: string): string {
  return escapeHtml(code)
    .replace(/(&lt;\/?[a-zA-Z][^&]*?&gt;)/g, (tag) =>
      tag
        .replace(
          /(&lt;\/?[a-zA-Z][a-zA-Z0-9-]*)/g,
          (t) => `<span style="color:#27D7E0">${t}</span>`,
        )
        .replace(
          /(\s[a-zA-Z-]+)(?==)/g,
          `<span style="color:#a78bfa">$1</span>`,
        )
        .replace(/("[^"]*")/g, `<span style="color:#a8d4a0">$1</span>`),
    )
    .replace(
      /(&lt;!--.*?--&gt;)/gs,
      (c) => `<span style="color:#5a7a5a;font-style:italic">${c}</span>`,
    );
}

function highlightCSS(code: string): string {
  return escapeHtml(code)
    .replace(
      /(\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/)/g,
      (c) => `<span style="color:#5a7a5a;font-style:italic">${c}</span>`,
    )
    .replace(
      /([.#][\w-]+(?::[\w-]+)?)/g,
      `<span style="color:#f472b6">$1</span>`,
    )
    .replace(/([\w-]+)\s*:/g, `<span style="color:#27D7E0">$1</span>:`)
    .replace(
      /(:\s*)([^;{}]+)/g,
      (_, colon, val) => `${colon}<span style="color:#a8d4a0">${val}</span>`,
    )
    .replace(/@[\w-]+/g, (m) => `<span style="color:#e6c07b">${m}</span>`);
}

function highlightJSON(code: string): string {
  return escapeHtml(code)
    .replace(
      /("[^"]*")\s*:/g,
      (_, key) => `<span style="color:#27D7E0">${key}</span>:`,
    )
    .replace(
      /:\s*("[^"]*")/g,
      (_, val) => `: <span style="color:#a8d4a0">${val}</span>`,
    )
    .replace(/\b(true|false|null)\b/g, `<span style="color:#f472b6">$1</span>`)
    .replace(
      /:\s*(-?\d+\.?\d*)/g,
      (_, num) => `: <span style="color:#e6c07b">${num}</span>`,
    );
}

const GO_KEYWORDS = [
  "package",
  "import",
  "func",
  "var",
  "const",
  "type",
  "struct",
  "interface",
  "if",
  "else",
  "for",
  "range",
  "switch",
  "case",
  "default",
  "return",
  "go",
  "defer",
  "chan",
  "map",
  "make",
  "new",
  "nil",
  "true",
  "false",
  "break",
  "continue",
  "fallthrough",
  "select",
  "goroutine",
  "error",
];

function highlightYAML(code: string): string {
  return escapeHtml(code)
    .replace(
      /(^[ \t]*[-?][ \t]+)/gm,
      (m) => `<span style="color:#27D7E0">${m}</span>`,
    )
    .replace(
      /^([ \t]*)([\w-]+):/gm,
      (_, indent, key) => `${indent}<span style="color:#a78bfa">${key}</span>:`,
    )
    .replace(
      /#.*/g,
      (c) => `<span style="color:#5a7a5a;font-style:italic">${c}</span>`,
    )
    .replace(
      /("[^"]*"|'[^']*')/g,
      (m) => `<span style="color:#a8d4a0">${m}</span>`,
    );
}

function highlightShell(code: string): string {
  return escapeHtml(code)
    .replace(
      /#.*/g,
      (c) => `<span style="color:#5a7a5a;font-style:italic">${c}</span>`,
    )
    .replace(/\$(\w+)/g, `<span style="color:#27D7E0">$$$1</span>`)
    .replace(
      /\b(if|then|else|fi|for|do|done|while|case|esac|function|echo|export|source|return|exit|cd|ls|grep|awk|sed|cat|rm|mkdir|cp|mv)\b/g,
      (m) => `<span style="color:#a78bfa">${m}</span>`,
    )
    .replace(/("([^"]*)")/g, `<span style="color:#a8d4a0">$1</span>`);
}

function highlightMarkdown(code: string): string {
  return escapeHtml(code)
    .replace(
      /^(#{1,6}[ \t].+)$/gm,
      (m) => `<span style="color:#27D7E0;font-weight:bold">${m}</span>`,
    )
    .replace(
      /\*\*([^*]+)\*\*/g,
      `<strong style="color:#e9d5ff">**$1**</strong>`,
    )
    .replace(/\*([^*]+)\*/g, `<em style="color:#a8d4a0">*$1*</em>`)
    .replace(
      /^([ \t]*[-*+][ \t]+)/gm,
      (m) => `<span style="color:#f472b6">${m}</span>`,
    )
    .replace(
      /^([ \t]*\d+\.[ \t]+)/gm,
      (m) => `<span style="color:#e6c07b">${m}</span>`,
    )
    .replace(/`([^`]+)`/g, `<span style="color:#fbbf24">\`$1\`</span>`)
    .replace(
      /^(>[ \t].*)/gm,
      (m) => `<span style="color:#9ca3af;font-style:italic">${m}</span>`,
    );
}

function highlightCode(code: string, lang: Language): string {
  switch (lang) {
    case "motoko":
      return highlightByKeywords(code, MOTOKO_KEYWORDS, ["//"], [/"[^"]*"/g]);
    case "typescript":
    case "javascript":
      return highlightByKeywords(
        code,
        TS_KEYWORDS,
        ["//"],
        [/"[^"]*"|'[^']*'|`[^`]*`/g],
      );
    case "python":
      return highlightByKeywords(
        code,
        PYTHON_KEYWORDS,
        ["#"],
        [/"""[^"]*"""|"[^"]*"|'[^']*'/g],
      );
    case "rust":
      return highlightByKeywords(code, RUST_KEYWORDS, ["//"], [/"[^"]*"/g]);
    case "go":
      return highlightByKeywords(
        code,
        GO_KEYWORDS,
        ["//"],
        [/"[^"]*"|`[^`]*`/g],
      );
    case "yaml":
      return highlightYAML(code);
    case "toml":
      return highlightYAML(code); // similar structure
    case "markdown":
      return highlightMarkdown(code);
    case "shell":
      return highlightShell(code);
    case "html":
      return highlightHTML(code);
    case "css":
      return highlightCSS(code);
    case "json":
      return highlightJSON(code);
    default:
      return escapeHtml(code);
  }
}

export function CodeEditor() {
  // Multi-tab state
  interface EditorTab {
    id: string;
    file: FileNodeView | null;
    content: string;
    savedContent: string;
    language: Language;
    label: string;
  }

  const newTab = (
    file: FileNodeView | null,
    content = "",
    lang: Language = "plaintext",
  ): EditorTab => ({
    id: `tab-${Date.now()}-${Math.random()}`,
    file,
    content,
    savedContent: content,
    language: lang,
    label: file?.name ?? "Untitled",
  });

  const [tabs, setTabs] = useState<EditorTab[]>([newTab(null)]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const _activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const [openFile, setOpenFile] = useState<FileNodeView | null>(null);
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [language, setLanguage] = useState<Language>("plaintext");
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [showOrientationCard, setShowOrientationCard] = useState<boolean>(
    () => {
      try {
        return (
          localStorage.getItem("decentos_codeeditor_orientation_shown") !==
          "true"
        );
      } catch {
        return true;
      }
    },
  );
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Search panel state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatchCount, setSearchMatchCount] = useState(0);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);
  const { actor } = useActor();
  const { upload, isUploading: isCloudSaving } = useBlobStorage();
  const [showCloudPanel, setShowCloudPanel] = useState(false);
  const [cloudFiles, setCloudFiles] = useState<FileMetadata[]>([]);
  const [cloudFilesLoading, setCloudFilesLoading] = useState(false);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const { subscribe } = useOSEventBus();

  const { data: files = [] } = useListChildren(null);
  const updateFileMutation = useUpdateFileContent();
  const createFileMutation = useCreateFile();

  const isModified = content !== savedContent;
  const lineNumbers = content.split("\n").map((_, i) => i + 1);

  const handleOpen = useCallback((file: FileNodeView) => {
    setOpenFile(file);
    setContent(file.content);
    setSavedContent(file.content);
    setLanguage(detectLanguage(file.name));
    setShowFilePicker(false);
  }, []);

  // Search match count
  useEffect(() => {
    if (!searchQuery || !content) {
      setSearchMatchCount(0);
      return;
    }
    try {
      const re = new RegExp(
        searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "gi",
      );
      const matches = content.match(re);
      setSearchMatchCount(matches?.length ?? 0);
    } catch {
      setSearchMatchCount(0);
    }
  }, [searchQuery, content]);

  // Keyboard shortcut for search (Ctrl+F / Cmd+F)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setShowSearch((p) => !p);
      }
      if (e.key === "Escape" && showSearch) {
        setShowSearch(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showSearch]);

  // Subscribe to open-file events from FileManager
  useEffect(() => {
    const unsub = subscribe("open-file", (payload) => {
      const p = payload as {
        filename?: string;
        content?: string;
        appId?: string;
      };
      if (p.appId !== "codeeditor") return;
      const fakeNode: FileNodeView = {
        id: -1,
        name: p.filename ?? "untitled",
        content: p.content ?? "",
        nodeType: "file" as any,
        createdAt: BigInt(Date.now()),
        updatedAt: BigInt(Date.now()),
      };
      setOpenFile(fakeNode);
      setContent(p.content ?? "");
      setSavedContent(p.content ?? "");
      setLanguage(detectLanguage(p.filename ?? ""));
    });
    return unsub;
  }, [subscribe]);

  const handleSave = useCallback(async () => {
    if (!openFile) return;
    try {
      await updateFileMutation.mutateAsync({ fileId: openFile.id, content });
      setSavedContent(content);
      toast.success("File saved");
    } catch {
      toast.error("Save failed");
    }
  }, [openFile, content, updateFileMutation]);

  const loadCloudCodeFiles = useCallback(async () => {
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
    const ext =
      language === "typescript"
        ? ".ts"
        : language === "javascript"
          ? ".js"
          : language === "motoko"
            ? ".mo"
            : language === "python"
              ? ".py"
              : language === "rust"
                ? ".rs"
                : language === "html"
                  ? ".html"
                  : language === "css"
                    ? ".css"
                    : language === "json"
                      ? ".json"
                      : ".txt";
    const fileName = (openFile?.name?.replace(/\.[^.]+$/, "") || "code") + ext;
    const blob = new Blob([content], { type: "text/plain" });
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
    } catch {
      toast.error("Save to Files failed");
    }
  }, [actor, upload, content, language, openFile]);

  const openFromCloud = useCallback(
    async (fileUrl: string, fileName: string) => {
      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setContent(text);
        setSavedContent("");
        setLanguage(detectLanguage(fileName));
        setOpenFile(null);
        setShowCloudPanel(false);
        toast.success(`Opened ${fileName}`);
      } catch {
        toast.error("Failed to open file");
      }
    },
    [],
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    toast.success("Code copied to clipboard", { duration: 1500 });
  }, [content]);

  const handleCreateNew = useCallback(async () => {
    const name = newFileName.trim();
    if (!name) return;
    try {
      const newId = await createFileMutation.mutateAsync({
        name,
        content: "",
        parentId: null,
      });
      const newFileNode: FileNodeView = {
        id: newId,
        name,
        content: "",
        nodeType: "file" as any,
        createdAt: BigInt(Date.now()),
        updatedAt: BigInt(Date.now()),
      };
      setOpenFile(newFileNode);
      setContent("");
      setSavedContent("");
      setLanguage(detectLanguage(name));
      setShowNewFile(false);
      setNewFileName("");
      toast.success(`Created ${name}`);
    } catch {
      toast.error("Failed to create file");
    }
  }, [newFileName, createFileMutation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newContent = `${content.substring(0, start)}  ${content.substring(end)}`;
        setContent(newContent);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    },
    [content, handleSave],
  );

  const syncScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  useEffect(() => {
    syncScroll();
  }, [syncScroll]);

  const onlyFiles = files.filter((f) => f.nodeType === ("file" as any));
  const isHighlighted = language !== "plaintext";

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--os-bg-app)" }}
    >
      {/* Tab bar */}
      {tabs.length > 0 && (
        <div
          className="flex items-center border-b flex-shrink-0 overflow-x-auto"
          style={{
            borderColor: "rgba(39,215,224,0.12)",
            background: "rgba(8,15,22,0.95)",
            scrollbarWidth: "none",
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="flex items-center gap-1.5 px-3 py-1.5 border-r cursor-pointer flex-shrink-0 group"
              style={{
                borderRightColor: "rgba(39,215,224,0.1)",
                borderBottom:
                  activeTabId === tab.id
                    ? "2px solid rgba(39,215,224,0.7)"
                    : "2px solid transparent",
                background:
                  activeTabId === tab.id
                    ? "rgba(39,215,224,0.06)"
                    : "transparent",
                maxWidth: 160,
              }}
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={(e) => e.key === "Enter" && setActiveTabId(tab.id)}
              role="tab"
              tabIndex={0}
            >
              <span
                className="text-[11px] font-mono truncate"
                style={{
                  color:
                    activeTabId === tab.id
                      ? "rgba(39,215,224,0.9)"
                      : "var(--os-text-muted)",
                }}
              >
                {tab.label}
                {tab.content !== tab.savedContent && (
                  <span className="ml-1 text-amber-400">●</span>
                )}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (tabs.length === 1) return;
                  const newTabs = tabs.filter((t) => t.id !== tab.id);
                  setTabs(newTabs);
                  if (activeTabId === tab.id) {
                    setActiveTabId(newTabs[Math.max(0, newTabs.length - 1)].id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--os-text-muted)" }}
                title="Close tab"
              >
                <XIcon className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const t = newTab(null);
              setTabs((prev) => [...prev, t]);
              setActiveTabId(t.id);
              setOpenFile(null);
              setContent("");
              setSavedContent("");
              setLanguage("plaintext");
            }}
            className="px-2.5 py-1.5 text-[11px] flex-shrink-0 transition-colors"
            style={{ color: "var(--os-text-muted)" }}
            title="New tab"
          >
            +
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(39,215,224,0.15)",
          background: "rgba(11,20,26,0.9)",
        }}
      >
        <Code className="w-4 h-4 os-cyan-text flex-shrink-0" />
        <span className="text-xs font-mono os-cyan-text truncate flex-1">
          {openFile ? openFile.name : "Untitled"}
          {isModified && <span className="ml-1 text-amber-400">●</span>}
        </span>

        <Select
          value={language}
          onValueChange={(v) => setLanguage(v as Language)}
        >
          <SelectTrigger
            className="h-7 w-28 text-xs bg-transparent border-border/40"
            data-ocid="codeeditor.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
              <SelectItem key={lang} value={lang} className="text-xs">
                {LANGUAGE_LABELS[lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={handleCopy}
          data-ocid="codeeditor.primary_button"
          title="Copy all code"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={() => setShowNewFile(true)}
          data-ocid="codeeditor.secondary_button"
        >
          <FilePlus className="w-3.5 h-3.5 mr-1" />
          New
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={() => setShowFilePicker(true)}
          data-ocid="codeeditor.open_modal_button"
        >
          <FolderOpen className="w-3.5 h-3.5 mr-1" />
          Open
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs os-cyan-text hover:bg-cyan/10"
          onClick={handleSave}
          disabled={!openFile || !isModified || updateFileMutation.isPending}
          data-ocid="codeeditor.save_button"
        >
          <Save className="w-3.5 h-3.5 mr-1" />
          Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          style={{ color: "#3B82F6" }}
          onClick={() => {
            setShowCloudPanel(true);
            loadCloudCodeFiles();
          }}
          data-ocid="codeeditor.cloud_files.button"
        >
          {isCloudSaving ? (
            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
          ) : (
            <Cloud className="w-3.5 h-3.5 mr-1" />
          )}
          Cloud
        </Button>
      </div>

      {/* Search Panel */}
      {showSearch && (
        <div
          className="flex items-center gap-2 px-3 py-2 border-b flex-shrink-0"
          style={{
            borderColor: "rgba(39,215,224,0.12)",
            background: "rgba(8,15,22,0.97)",
          }}
        >
          <Search
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: "rgba(39,215,224,0.6)" }}
          />
          <input
            // biome-ignore lint/a11y/noAutofocus: search panel needs focus on open
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in file..."
            data-ocid="codeeditor.search_input"
            className="flex-1 text-xs font-mono outline-none bg-transparent"
            style={{
              color: "var(--os-text-primary)",
              caretColor: "rgba(39,215,224,0.8)",
            }}
          />
          {searchQuery && (
            <span
              className="text-[10px] flex-shrink-0"
              style={{
                color:
                  searchMatchCount > 0
                    ? "rgba(39,215,224,0.7)"
                    : "rgba(248,113,113,0.7)",
              }}
            >
              {searchMatchCount} match{searchMatchCount !== 1 ? "es" : ""}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setShowSearch(false);
              setSearchQuery("");
            }}
            className="flex-shrink-0 transition-colors"
            style={{ color: "var(--os-text-muted)" }}
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editor Area */}
      {openFile ? (
        <div className="flex flex-1 overflow-hidden font-mono text-xs">
          {/* Line numbers */}
          <div
            ref={lineNumbersRef}
            className="flex-shrink-0 overflow-hidden select-none"
            style={{
              width: 44,
              background: "rgba(11,20,26,0.7)",
              borderRight: "1px solid rgba(39,215,224,0.1)",
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            {lineNumbers.map((num) => (
              <div
                key={`ln-${num}`}
                className="text-right pr-3 leading-5 text-muted-foreground/40"
                style={{ fontSize: 11 }}
              >
                {num}
              </div>
            ))}
          </div>

          {/* Editor: highlight layer + textarea */}
          <div className="relative flex-1 overflow-hidden">
            {isHighlighted && (
              <div
                ref={highlightRef}
                aria-hidden="true"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional syntax highlighting
                dangerouslySetInnerHTML={{
                  __html: `${highlightCode(content, language)}\n`,
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  lineHeight: "20px",
                  tabSize: 2,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  pointerEvents: "none",
                  overflow: "hidden",
                  color: "var(--os-text-primary)",
                }}
              />
            )}

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={syncScroll}
              onClick={(e) => {
                const ta = e.currentTarget;
                const before = ta.value.substring(0, ta.selectionStart);
                const lines = before.split("\n");
                setCursorLine(lines.length);
                setCursorCol((lines[lines.length - 1]?.length ?? 0) + 1);
              }}
              onSelect={(e) => {
                const ta = e.currentTarget;
                const before = ta.value.substring(0, ta.selectionStart);
                const lines = before.split("\n");
                setCursorLine(lines.length);
                setCursorCol((lines[lines.length - 1]?.length ?? 0) + 1);
              }}
              spellCheck={false}
              data-ocid="codeeditor.editor"
              className="absolute inset-0 resize-none outline-none leading-5 p-2"
              style={{
                background: "transparent",
                color: isHighlighted ? "transparent" : "var(--os-text-primary)",
                caretColor: "var(--os-accent)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                lineHeight: "20px",
                tabSize: 2,
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className="flex-1 flex flex-col items-center justify-center gap-4"
          data-ocid="codeeditor.empty_state"
        >
          {/* Developer orientation card */}
          {showOrientationCard && (
            <div
              data-ocid="codeeditor.orientation.card"
              style={{
                background: "var(--os-bg-elevated)",
                border: "1px solid var(--os-border-subtle)",
                borderLeft: "3px solid #6366f1",
                borderRadius: 10,
                padding: "10px 14px",
                maxWidth: 320,
                width: "100%",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowOrientationCard(false);
                  try {
                    localStorage.setItem(
                      "decentos_codeeditor_orientation_shown",
                      "true",
                    );
                  } catch {}
                }}
                data-ocid="codeeditor.orientation.close_button"
                style={{
                  position: "absolute",
                  top: 6,
                  right: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--os-text-muted)",
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--os-text-primary)",
                  marginBottom: 8,
                }}
              >
                Developer Info
              </p>
              {[
                "DecentOS runs entirely on-chain — every save persists to ICP stable memory",
                "Multi-tab support: use the + button to open multiple files",
                "Terminal: type `help` for commands, or open API Tester from the App Store",
              ].map((tip) => (
                <p
                  key={tip}
                  style={{
                    fontSize: 11,
                    color: "var(--os-text-secondary)",
                    marginBottom: 5,
                    lineHeight: 1.4,
                  }}
                >
                  · {tip}
                </p>
              ))}
            </div>
          )}
          <Code
            className="w-12 h-12 os-cyan-text opacity-30"
            style={{ filter: "drop-shadow(0 0 12px rgba(39,215,224,0.4))" }}
          />
          <p className="text-muted-foreground/50 text-sm text-center px-8">
            Open a file from File Manager or create a new one
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-border/40"
              onClick={() => setShowFilePicker(true)}
              data-ocid="codeeditor.primary_button"
            >
              <FolderOpen className="w-3.5 h-3.5 mr-1" /> Open File
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-border/40"
              onClick={() => setShowNewFile(true)}
              data-ocid="codeeditor.secondary_button"
            >
              <FilePlus className="w-3.5 h-3.5 mr-1" /> New File
            </Button>
          </div>
        </div>
      )}

      {/* Status bar */}
      {openFile && (
        <div
          className="flex items-center gap-4 px-3 flex-shrink-0"
          style={{
            height: 24,
            borderTop: "1px solid rgba(39,215,224,0.1)",
            background: "var(--os-bg-app)",
            fontSize: 10,
            color: "var(--os-text-muted)",
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: "rgba(39,215,224,0.6)" }}>
            {LANGUAGE_LABELS[language]}
          </span>
          <span>
            Ln {cursorLine}, Col {cursorCol}
          </span>
          <span>{lineNumbers.length} lines</span>
          <span>{content.length} chars</span>
          <span style={{ color: "var(--os-text-muted)" }}>UTF-8</span>
          {isModified && <span style={{ color: "#FEBC2E" }}>unsaved</span>}
        </div>
      )}

      {/* File Picker Dialog */}
      <Dialog open={showFilePicker} onOpenChange={setShowFilePicker}>
        <DialogContent
          className="max-w-sm"
          style={{
            background: "rgba(11,20,26,0.98)",
            border: "1px solid rgba(39,215,224,0.2)",
          }}
          data-ocid="codeeditor.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-sm os-cyan-text">
              Open File
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-64">
            {onlyFiles.length === 0 ? (
              <p className="text-muted-foreground/50 text-xs text-center py-8">
                No files found
              </p>
            ) : (
              <div className="space-y-1">
                {onlyFiles.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleOpen(f)}
                    className="w-full text-left px-3 py-2 text-xs font-mono rounded hover:bg-white/8 transition-colors text-foreground/80 hover:text-foreground flex items-center gap-2"
                  >
                    <Code className="w-3 h-3 os-cyan-text flex-shrink-0" />
                    {f.name}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFilePicker(false)}
              data-ocid="codeeditor.cancel_button"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New File Dialog */}
      <Dialog open={showNewFile} onOpenChange={setShowNewFile}>
        <DialogContent
          className="max-w-sm"
          style={{
            background: "rgba(11,20,26,0.98)",
            border: "1px solid rgba(39,215,224,0.2)",
          }}
          data-ocid="codeeditor.modal"
        >
          <DialogHeader>
            <DialogTitle className="text-sm os-cyan-text">New File</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="filename.mo"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
            className="text-sm font-mono"
            data-ocid="codeeditor.input"
          />
          <DialogFooter>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNewFile(false)}
              data-ocid="codeeditor.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateNew}
              disabled={!newFileName.trim() || createFileMutation.isPending}
              className="os-cyan-text"
              data-ocid="codeeditor.confirm_button"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Cloud Files Panel */}
      {showCloudPanel && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          data-ocid="codeeditor.cloud.modal"
        >
          <div
            className="w-96 max-h-[70%] flex flex-col rounded-xl overflow-hidden"
            style={{
              background: "rgba(13,22,32,0.98)",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(59,130,246,0.15)" }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "#3B82F6" }}
              >
                Cloud Files
              </span>
              <button
                type="button"
                onClick={() => setShowCloudPanel(false)}
                data-ocid="codeeditor.cloud.close_button"
                className="text-muted-foreground/60 hover:text-muted-foreground"
              >
                <Save className="w-4 h-4" style={{ display: "none" }} />X
              </button>
            </div>
            <div
              className="p-3 border-b"
              style={{ borderColor: "rgba(59,130,246,0.1)" }}
            >
              <button
                type="button"
                onClick={saveToCloud}
                disabled={isCloudSaving || !content}
                data-ocid="codeeditor.cloud.save_button"
                className="flex items-center gap-1.5 px-3 py-2 rounded w-full justify-center text-xs font-medium"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  color: "#3B82F6",
                  border: "1px solid rgba(59,130,246,0.3)",
                }}
              >
                {isCloudSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5" />
                )}
                Save current file to Cloud
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {cloudFilesLoading ? (
                <div
                  className="flex items-center justify-center py-8"
                  data-ocid="codeeditor.cloud.loading_state"
                >
                  <Loader2 className="w-4 h-4 animate-spin text-primary/60" />
                </div>
              ) : cloudFiles.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground/60 text-xs"
                  data-ocid="codeeditor.cloud.empty_state"
                >
                  <Cloud className="w-8 h-8" />
                  <p>No code files in cloud</p>
                </div>
              ) : (
                <div className="p-2">
                  {cloudFiles.map((f, i) => (
                    <button
                      key={f.url}
                      type="button"
                      onClick={() => openFromCloud(f.url, f.name)}
                      data-ocid={`codeeditor.cloud.item.${i + 1}`}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
                    >
                      <Code
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
    </div>
  );
}
