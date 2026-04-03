import {
  Bold,
  Code,
  FileText,
  Heading1,
  Italic,
  Link,
  List,
  Save,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface MdFile {
  name: string;
  content: string;
  updatedAt: number;
}

function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks
  html = html.replace(
    /```([\s\S]*?)```/g,
    (_, code) =>
      `<pre style="background:rgba(0,0,0,0.4);border:1px solid var(--os-text-muted);border-radius:6px;padding:10px;overflow-x:auto;font-family:monospace;font-size:11px;color:rgba(39,215,224,0.9);margin:8px 0">${code.trim()}</pre>`,
  );

  html = html.replace(
    /^### (.+)$/gm,
    '<h3 style="font-size:14px;font-weight:700;color:var(--os-text-primary);margin:10px 0 4px">$1</h3>',
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 style="font-size:16px;font-weight:700;color: var(--os-text-primary);margin:12px 0 5px">$1</h2>',
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 style="font-size:20px;font-weight:800;color:rgba(39,215,224,0.95);margin:14px 0 6px">$1</h1>',
  );

  html = html.replace(
    /^---$/gm,
    '<hr style="border:none;border-top:1px solid var(--os-text-muted);margin:12px 0">',
  );

  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong style="color: var(--os-text-primary);font-weight:700">$1</strong>',
  );
  html = html.replace(
    /\*(.+?)\*/g,
    '<em style="color:var(--os-text-secondary);font-style:italic">$1</em>',
  );

  html = html.replace(
    /`([^`]+)`/g,
    '<code style="background:rgba(39,215,224,0.1);border:1px solid rgba(39,215,224,0.2);border-radius:3px;padding:1px 5px;font-family:monospace;font-size:11px;color:rgba(39,215,224,0.9)">$1</code>',
  );

  html = html.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" style="color:rgba(39,215,224,0.9);text-decoration:underline" target="_blank" rel="noopener">$1</a>',
  );

  html = html.replace(
    /^- (.+)$/gm,
    '<li style="margin:2px 0;color: var(--os-text-secondary);list-style:disc;margin-left:16px">$1</li>',
  );
  html = html.replace(
    /((?:<li[^>]*>.*<\/li>\n?)+)/g,
    '<ul style="margin:6px 0">$1</ul>',
  );

  html = html.replace(
    /^([^<\n][^\n]*)$/gm,
    '<p style="margin:4px 0;color: var(--os-text-secondary);line-height:1.6">$1</p>',
  );

  return html;
}

const DEFAULT_MD_FILES: Record<string, MdFile> = {
  "README.md": {
    name: "README.md",
    content:
      "# Welcome to Markdown Editor\n\nThis is a **live preview** editor.\n\n## Features\n- Split pane editing\n- *Italic* and **bold** text\n- `inline code` support\n- [Links](https://example.com)\n\n```\ncode blocks\n```\n\n---\n\nStart writing!",
    updatedAt: Date.now(),
  },
};

export function MarkdownEditor() {
  const { data: files, set: setFiles } = useCanisterKV<Record<string, MdFile>>(
    "decentos_markdown_editor",
    DEFAULT_MD_FILES,
  );
  const [currentFile, setCurrentFile] = useState<string>("README.md");
  const [content, setContent] = useState<string>(
    files["README.md"]?.content ?? "",
  );
  const [fileName, setFileName] = useState("README.md");
  const [saved, setSaved] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = renderMarkdown(content);
    }
  }, [content]);

  useEffect(() => {
    const f = files[currentFile];
    if (f) {
      setContent(f.content);
      setFileName(f.name);
    }
  }, [currentFile, files]);

  const handleContentChange = (val: string) => {
    setContent(val);
    setSaved(false);
  };

  const handleSave = () => {
    const name = fileName.trim() || "untitled.md";
    const updated = {
      ...files,
      [name]: { name, content, updatedAt: Date.now() },
    };
    setFiles(updated);
    setCurrentFile(name);
    setSaved(true);
  };

  const insertAt = useCallback(
    (before: string, after = "", sample = "text") => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const sel = ta.value.slice(start, end) || sample;
      const newVal =
        ta.value.slice(0, start) + before + sel + after + ta.value.slice(end);
      setContent(newVal);
      setSaved(false);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(
          start + before.length,
          start + before.length + sel.length,
        );
      });
    },
    [],
  );

  const fileList = Object.keys(files).sort();

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-border"
        style={{ background: "var(--os-border-subtle)" }}
      >
        <FileText size={13} className="text-cyan-400 flex-shrink-0" />
        <input
          className="flex-1 bg-transparent text-xs text-muted-foreground outline-none placeholder-white/30 min-w-0"
          placeholder="filename.md"
          value={fileName}
          onChange={(e) => {
            setFileName(e.target.value);
            setSaved(false);
          }}
          data-ocid="markdowneditor.input"
        />
        <select
          className="text-[10px] bg-muted/50 border border-border rounded px-1.5 py-1 text-muted-foreground outline-none cursor-pointer"
          value={currentFile}
          onChange={(e) => setCurrentFile(e.target.value)}
          data-ocid="markdowneditor.select"
        >
          {fileList.map((f) => (
            <option
              key={f}
              value={f}
              style={{ background: "var(--os-bg-app)" }}
            >
              {f}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all"
          style={{
            background: saved
              ? "var(--os-border-subtle)"
              : "rgba(39,215,224,0.15)",
            border: `1px solid ${
              saved ? "var(--os-text-muted)" : "rgba(39,215,224,0.4)"
            }`,
            color: saved ? "var(--os-text-secondary)" : "rgba(39,215,224,1)",
          }}
          data-ocid="markdowneditor.save_button"
        >
          <Save size={11} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border"
        style={{ background: "var(--os-border-subtle)" }}
      >
        {[
          {
            icon: <Heading1 size={13} />,
            label: "H1",
            action: () => insertAt("# ", "", "Heading"),
          },
          {
            icon: <Bold size={13} />,
            label: "Bold",
            action: () => insertAt("**", "**", "bold text"),
          },
          {
            icon: <Italic size={13} />,
            label: "Italic",
            action: () => insertAt("*", "*", "italic text"),
          },
          {
            icon: <Code size={13} />,
            label: "Code",
            action: () => insertAt("`", "`", "code"),
          },
          {
            icon: <List size={13} />,
            label: "List",
            action: () => insertAt("- ", "", "item"),
          },
          {
            icon: <Link size={13} />,
            label: "Link",
            action: () => insertAt("[", "](url)", "link text"),
          },
        ].map(({ icon, label, action }) => (
          <button
            key={label}
            type="button"
            title={label}
            onClick={action}
            className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-muted-foreground transition-colors"
            data-ocid="markdowneditor.button"
          >
            {icon}
          </button>
        ))}
        <div className="w-px h-4 bg-muted/50 mx-1" />
        <span className="text-[10px] text-muted-foreground/50 ml-auto pr-1">
          {content.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {/* Split pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="px-2 py-1 border-b border-border">
            <span className="text-[10px] text-muted-foreground/50 font-medium">
              EDITOR
            </span>
          </div>
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent outline-none resize-none p-3 font-mono leading-relaxed text-xs"
            style={{
              color: "var(--os-text-secondary)",
              caretColor: "rgba(39,215,224,0.9)",
            }}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing Markdown..."
            spellCheck={false}
            data-ocid="markdowneditor.textarea"
          />
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-2 py-1 border-b border-border">
            <span className="text-[10px] text-muted-foreground/50 font-medium">
              PREVIEW
            </span>
          </div>
          <div
            ref={previewRef}
            className="flex-1 overflow-y-auto p-3 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
