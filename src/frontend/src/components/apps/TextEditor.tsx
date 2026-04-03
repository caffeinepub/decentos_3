import {
  AlignLeft,
  Check,
  Loader2,
  Save,
  Search,
  WrapText,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useOSEventBus } from "../../context/OSEventBusContext";
import { useWindowFocus } from "../../context/WindowFocusContext";
import {
  useCreateFile,
  useReadFile,
  useUpdateFileContent,
} from "../../hooks/useQueries";

interface TextEditorProps {
  windowProps?: Record<string, unknown>;
}

export function TextEditor({ windowProps }: TextEditorProps) {
  const fileId =
    typeof windowProps?.fileId === "number" ? windowProps.fileId : null;
  const initialFileName =
    typeof windowProps?.fileName === "string"
      ? windowProps.fileName
      : "Document.txt";

  const [fileName, setFileName] = useState(initialFileName);
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [showFind, setShowFind] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [findTerm, setFindTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: fileContent, isLoading } = useReadFile(fileId);
  const updateFile = useUpdateFileContent();
  const createFile = useCreateFile();
  const { subscribe } = useOSEventBus();

  // biome-ignore lint/correctness/useExhaustiveDependencies: load once
  useEffect(() => {
    if (fileContent !== undefined && !isDirty) {
      setContent(fileContent);
    }
  }, [fileContent]);

  // Subscribe to open-file events from FileManager
  useEffect(() => {
    const unsub = subscribe("open-file", (payload) => {
      const p = payload as {
        filename?: string;
        content?: string;
        appId?: string;
      };
      if (p.appId !== "texteditor") return;
      setFileName(p.filename ?? "Document.txt");
      setContent(p.content ?? "");
      setIsDirty(false);
      setSaveStatus("saved");
    });
    return unsub;
  }, [subscribe]);

  const handleSave = useCallback(async () => {
    if (!isDirty) return;
    setSaveStatus("saving");
    try {
      if (fileId !== null) {
        await updateFile.mutateAsync({ fileId, content });
      } else {
        await createFile.mutateAsync({
          name: fileName,
          content,
          parentId: null,
        });
      }
      setIsDirty(false);
      setSaveStatus("saved");
      toast.success("Saved");
    } catch {
      setSaveStatus("unsaved");
      toast.error("Save failed");
    }
  }, [isDirty, fileId, content, fileName, updateFile, createFile]);

  // Auto-save every 30s
  useEffect(() => {
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    if (autoSave) {
      autoSaveTimer.current = setInterval(() => {
        if (isDirty) handleSave();
      }, 30000);
    }
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [autoSave, isDirty, handleSave]);

  const { isFocused } = useWindowFocus();

  // Ctrl+S and Ctrl+F
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isFocused) return;
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setShowFind((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFocused, handleSave]);

  const handleContentChange = (val: string) => {
    setContent(val);
    setIsDirty(true);
    setSaveStatus("unsaved");
  };

  const wordCount =
    content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
  const lineCount = content.split("\n").length;
  const charCount = content.length;

  const handleReplaceAll = () => {
    if (!findTerm) return;
    const count = content.split(findTerm).length - 1;
    const newContent = content.split(findTerm).join(replaceTerm);
    setContent(newContent);
    setIsDirty(true);
    setSaveStatus("unsaved");
    toast.success(`Replaced ${count} occurrence${count !== 1 ? "s" : ""}`);
  };

  const findCount = findTerm ? content.split(findTerm).length - 1 : 0;
  const isSaving = updateFile.isPending || createFile.isPending;

  const toolbarStyle = {
    borderColor: "rgba(42,58,66,0.8)",
    background: "rgba(18,32,38,0.5)",
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(11,15,18,0.6)" }}
      data-ocid="texteditor.panel"
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b flex-wrap"
        style={toolbarStyle}
      >
        <AlignLeft className="w-4 h-4 text-primary/60 flex-shrink-0" />
        <input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          data-ocid="texteditor.input"
          className="flex-1 min-w-[80px] bg-transparent text-xs font-medium text-foreground outline-none"
          placeholder="File name"
        />

        {/* Font size */}
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          data-ocid="texteditor.select"
          className="bg-transparent text-xs text-muted-foreground border rounded px-1 h-6 outline-none cursor-pointer"
          style={{
            borderColor: "rgba(39,215,224,0.2)",
            background: "rgba(11,20,26,0.8)",
          }}
        >
          {[12, 14, 16, 18, 20].map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </select>

        {/* Word wrap */}
        <button
          type="button"
          onClick={() => setWordWrap((w) => !w)}
          data-ocid="texteditor.toggle"
          title="Word wrap"
          className="w-6 h-6 flex items-center justify-center rounded transition-colors"
          style={{
            background: wordWrap ? "rgba(39,215,224,0.15)" : "transparent",
            color: wordWrap ? "rgba(39,215,224,1)" : "var(--os-text-secondary)",
          }}
        >
          <WrapText className="w-3.5 h-3.5" />
        </button>

        {/* Find/Replace */}
        <button
          type="button"
          onClick={() => setShowFind((s) => !s)}
          data-ocid="texteditor.secondary_button"
          title="Find & Replace (Ctrl+F)"
          className="w-6 h-6 flex items-center justify-center rounded transition-colors"
          style={{
            background: showFind ? "rgba(39,215,224,0.15)" : "transparent",
            color: showFind ? "rgba(39,215,224,1)" : "var(--os-text-secondary)",
          }}
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Auto-save */}
        <button
          type="button"
          onClick={() => setAutoSave((s) => !s)}
          data-ocid="texteditor.checkbox"
          title="Auto-save"
          className="flex items-center gap-1 px-2 h-6 rounded text-[10px] transition-colors"
          style={{
            background: autoSave ? "rgba(39,215,224,0.1)" : "transparent",
            border: "1px solid rgba(39,215,224,0.2)",
            color: autoSave ? "rgba(39,215,224,1)" : "var(--os-text-secondary)",
          }}
        >
          {autoSave && <Check className="w-2.5 h-2.5" />}
          Auto
        </button>

        {/* Word count */}
        <span className="text-[10px] text-muted-foreground/50 font-mono">
          {wordCount}w
        </span>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          data-ocid="texteditor.save_button"
          className="flex items-center gap-1 px-3 h-7 rounded text-xs font-semibold transition-all disabled:opacity-40"
          style={{
            background: "rgba(39,215,224,0.12)",
            border: "1px solid rgba(39,215,224,0.3)",
            color: "rgba(39,215,224,1)",
          }}
        >
          {isSaving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Save className="w-3 h-3" />
          )}
          Save
        </button>
      </div>

      {/* Find/Replace bar */}
      {showFind && (
        <div
          className="flex items-center gap-2 px-3 py-2 border-b"
          style={{
            borderColor: "rgba(42,58,66,0.7)",
            background: "rgba(12,24,28,0.6)",
          }}
        >
          <Search className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" />
          <input
            value={findTerm}
            onChange={(e) => setFindTerm(e.target.value)}
            data-ocid="texteditor.search_input"
            placeholder="Find..."
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder-muted-foreground/40 font-mono"
          />
          {findTerm && (
            <span className="text-[10px] text-primary/60 font-mono">
              {findCount} found
            </span>
          )}
          <div className="w-px h-4 bg-white/10" />
          <input
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            data-ocid="texteditor.input"
            placeholder="Replace with..."
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder-muted-foreground/40 font-mono"
          />
          <button
            type="button"
            onClick={handleReplaceAll}
            data-ocid="texteditor.primary_button"
            className="px-2 h-6 rounded text-[10px] font-semibold transition-all"
            style={{
              background: "rgba(39,215,224,0.12)",
              border: "1px solid rgba(39,215,224,0.3)",
              color: "rgba(39,215,224,1)",
            }}
          >
            Replace All
          </button>
          <button
            type="button"
            onClick={() => setShowFind(false)}
            data-ocid="texteditor.close_button"
            className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Editor area */}
      {isLoading ? (
        <div
          className="flex items-center justify-center flex-1"
          data-ocid="texteditor.loading_state"
        >
          <Loader2 className="w-5 h-5 animate-spin text-primary/60" />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          data-ocid="texteditor.editor"
          placeholder="Start writing..."
          spellCheck
          className="flex-1 p-4 bg-transparent text-foreground outline-none resize-none placeholder-muted-foreground/30 leading-relaxed"
          style={{
            fontSize: `${fontSize}px`,
            whiteSpace: wordWrap ? "pre-wrap" : "pre",
            overflowWrap: wordWrap ? "break-word" : "normal",
            overflowX: wordWrap ? "hidden" : "auto",
            caretColor: "rgba(39,215,224,0.8)",
            fontFamily: "inherit",
          }}
        />
      )}

      {/* Footer */}
      <div
        className="px-3 py-1 text-[10px] text-muted-foreground/40 font-mono border-t flex items-center justify-between"
        style={{ borderColor: "rgba(42,58,66,0.5)" }}
      >
        <span>
          {wordCount} words \u00b7 {charCount} chars \u00b7 {lineCount} lines
        </span>
        <span
          data-ocid={
            saveStatus === "saving"
              ? "texteditor.loading_state"
              : saveStatus === "saved"
                ? "texteditor.success_state"
                : "texteditor.error_state"
          }
          style={{
            color:
              saveStatus === "saving"
                ? "rgba(255,200,50,0.7)"
                : saveStatus === "saved"
                  ? "rgba(39,215,224,0.6)"
                  : "rgba(255,100,100,0.7)",
          }}
        >
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "saved"
              ? "Saved"
              : "Unsaved changes"}
        </span>
      </div>
    </div>
  );
}
