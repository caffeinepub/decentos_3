import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, F as FileText, a6 as Code } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { S as Save } from "./save-yx67L3vf.js";
import { H as Heading1 } from "./heading-1-CKC6nhHc.js";
import { B as Bold, I as Italic } from "./italic-DKqoJV2u.js";
import { L as List } from "./list-Ba7j3EJY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
];
const Link = createLucideIcon("link", __iconNode);
function renderMarkdown(md) {
  let html = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(
    /```([\s\S]*?)```/g,
    (_, code) => `<pre style="background:rgba(0,0,0,0.4);border:1px solid var(--os-text-muted);border-radius:6px;padding:10px;overflow-x:auto;font-family:monospace;font-size:11px;color:rgba(39,215,224,0.9);margin:8px 0">${code.trim()}</pre>`
  );
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 style="font-size:14px;font-weight:700;color:var(--os-text-primary);margin:10px 0 4px">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 style="font-size:16px;font-weight:700;color: var(--os-text-primary);margin:12px 0 5px">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 style="font-size:20px;font-weight:800;color:rgba(39,215,224,0.95);margin:14px 0 6px">$1</h1>'
  );
  html = html.replace(
    /^---$/gm,
    '<hr style="border:none;border-top:1px solid var(--os-text-muted);margin:12px 0">'
  );
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong style="color: var(--os-text-primary);font-weight:700">$1</strong>'
  );
  html = html.replace(
    /\*(.+?)\*/g,
    '<em style="color:var(--os-text-secondary);font-style:italic">$1</em>'
  );
  html = html.replace(
    /`([^`]+)`/g,
    '<code style="background:rgba(39,215,224,0.1);border:1px solid rgba(39,215,224,0.2);border-radius:3px;padding:1px 5px;font-family:monospace;font-size:11px;color:rgba(39,215,224,0.9)">$1</code>'
  );
  html = html.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" style="color:rgba(39,215,224,0.9);text-decoration:underline" target="_blank" rel="noopener">$1</a>'
  );
  html = html.replace(
    /^- (.+)$/gm,
    '<li style="margin:2px 0;color: var(--os-text-secondary);list-style:disc;margin-left:16px">$1</li>'
  );
  html = html.replace(
    /((?:<li[^>]*>.*<\/li>\n?)+)/g,
    '<ul style="margin:6px 0">$1</ul>'
  );
  html = html.replace(
    /^([^<\n][^\n]*)$/gm,
    '<p style="margin:4px 0;color: var(--os-text-secondary);line-height:1.6">$1</p>'
  );
  return html;
}
const DEFAULT_MD_FILES = {
  "README.md": {
    name: "README.md",
    content: "# Welcome to Markdown Editor\n\nThis is a **live preview** editor.\n\n## Features\n- Split pane editing\n- *Italic* and **bold** text\n- `inline code` support\n- [Links](https://example.com)\n\n```\ncode blocks\n```\n\n---\n\nStart writing!",
    updatedAt: Date.now()
  }
};
function MarkdownEditor() {
  var _a;
  const { data: files, set: setFiles } = useCanisterKV(
    "decentos_markdown_editor",
    DEFAULT_MD_FILES
  );
  const [currentFile, setCurrentFile] = reactExports.useState("README.md");
  const [content, setContent] = reactExports.useState(
    ((_a = files["README.md"]) == null ? void 0 : _a.content) ?? ""
  );
  const [fileName, setFileName] = reactExports.useState("README.md");
  const [saved, setSaved] = reactExports.useState(true);
  const textareaRef = reactExports.useRef(null);
  const previewRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = renderMarkdown(content);
    }
  }, [content]);
  reactExports.useEffect(() => {
    const f = files[currentFile];
    if (f) {
      setContent(f.content);
      setFileName(f.name);
    }
  }, [currentFile, files]);
  const handleContentChange = (val) => {
    setContent(val);
    setSaved(false);
  };
  const handleSave = () => {
    const name = fileName.trim() || "untitled.md";
    const updated = {
      ...files,
      [name]: { name, content, updatedAt: Date.now() }
    };
    setFiles(updated);
    setCurrentFile(name);
    setSaved(true);
  };
  const insertAt = reactExports.useCallback(
    (before, after = "", sample = "text") => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const sel = ta.value.slice(start, end) || sample;
      const newVal = ta.value.slice(0, start) + before + sel + after + ta.value.slice(end);
      setContent(newVal);
      setSaved(false);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(
          start + before.length,
          start + before.length + sel.length
        );
      });
    },
    []
  );
  const fileList = Object.keys(files).sort();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full flex flex-col",
      style: { background: "rgba(0,0,0,0.3)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-2 border-b border-border",
            style: { background: "var(--os-border-subtle)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13, className: "text-cyan-400 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "flex-1 bg-transparent text-xs text-muted-foreground outline-none placeholder-white/30 min-w-0",
                  placeholder: "filename.md",
                  value: fileName,
                  onChange: (e) => {
                    setFileName(e.target.value);
                    setSaved(false);
                  },
                  "data-ocid": "markdowneditor.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  className: "text-[10px] bg-muted/50 border border-border rounded px-1.5 py-1 text-muted-foreground outline-none cursor-pointer",
                  value: currentFile,
                  onChange: (e) => setCurrentFile(e.target.value),
                  "data-ocid": "markdowneditor.select",
                  children: fileList.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: f,
                      style: { background: "var(--os-bg-app)" },
                      children: f
                    },
                    f
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleSave,
                  className: "flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all",
                  style: {
                    background: saved ? "var(--os-border-subtle)" : "rgba(39,215,224,0.15)",
                    border: `1px solid ${saved ? "var(--os-text-muted)" : "rgba(39,215,224,0.4)"}`,
                    color: saved ? "var(--os-text-secondary)" : "rgba(39,215,224,1)"
                  },
                  "data-ocid": "markdowneditor.save_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 11 }),
                    saved ? "Saved" : "Save"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-border",
            style: { background: "var(--os-border-subtle)" },
            children: [
              [
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heading1, { size: 13 }),
                  label: "H1",
                  action: () => insertAt("# ", "", "Heading")
                },
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { size: 13 }),
                  label: "Bold",
                  action: () => insertAt("**", "**", "bold text")
                },
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { size: 13 }),
                  label: "Italic",
                  action: () => insertAt("*", "*", "italic text")
                },
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 13 }),
                  label: "Code",
                  action: () => insertAt("`", "`", "code")
                },
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 13 }),
                  label: "List",
                  action: () => insertAt("- ", "", "item")
                },
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { size: 13 }),
                  label: "Link",
                  action: () => insertAt("[", "](url)", "link text")
                }
              ].map(({ icon, label, action }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  title: label,
                  onClick: action,
                  className: "p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-muted-foreground transition-colors",
                  "data-ocid": "markdowneditor.button",
                  children: icon
                },
                label
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-muted/50 mx-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/50 ml-auto pr-1", children: [
                content.split(/\s+/).filter(Boolean).length,
                " words"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col border-r border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50 font-medium", children: "EDITOR" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                ref: textareaRef,
                className: "flex-1 bg-transparent outline-none resize-none p-3 font-mono leading-relaxed text-xs",
                style: {
                  color: "var(--os-text-secondary)",
                  caretColor: "rgba(39,215,224,0.9)"
                },
                value: content,
                onChange: (e) => handleContentChange(e.target.value),
                placeholder: "Start writing Markdown...",
                spellCheck: false,
                "data-ocid": "markdowneditor.textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50 font-medium", children: "PREVIEW" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                ref: previewRef,
                className: "flex-1 overflow-y-auto p-3 text-xs"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  MarkdownEditor
};
